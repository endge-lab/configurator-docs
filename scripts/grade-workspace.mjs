/**
 * Оценка workspace Endge компиляцией, как это делает Configurator.
 *
 * Backend хранит Source как текст и не проверяет его, поэтому успешная запись
 * ничего не говорит об исполнимости. Скрипт загружает snapshot workspace
 * в `@endge/core` (тот же `Endge.boot` с provider `service-backend`, что у
 * Configurator), собирает весь Domain и печатает по каждому документу статус
 * и диагностику: синтаксис, linking (identity, порты, outputs, типы, циклы),
 * entity validation и висячие или неиспользуемые ссылки.
 *
 * Вход (можно сочетать):
 * - `--backend <url> --workspace <identity>` — `GET /api/v1/domain`;
 *   токен из `ENDGE_TOKEN` (без него — только `AUTH_MODE=dev`);
 * - `--snapshot <file.json>` — ответ `GET /api/v1/domain` или export;
 * - `--markdown <page.md>` — тела блоков ```json [POST /api/v1/<коллекция>]
 *   страницы документации добавляются поверх snapshot (без snapshot —
 *   поверх пустого workspace).
 *
 * Контекст: `--facets tenant=tenant-a,region=eu` задаёт выбор фасетов,
 * `--each-facet` дополнительно собирает каждый документ каждого фасета.
 *
 * Core: `--core <каталог>` или `ENDGE_CORE_DIR` — каталог, из которого
 * разрешается `@endge/core` (например `npm i --prefix <каталог>
 * @endge/core@1.0.0-dev.11`); по умолчанию — пакет Core монорепозитория.
 *
 * Выход: отчёт в stdout, `--json <file>` — машиночитаемый отчёт. Код выхода
 * 0 — ошибок нет, 1 — есть ошибки, 2 — сбой самого инструмента.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const monorepoCore = path.resolve(root, '../../packages/@endge/@endge-core')

const COLLECTIONS = [
  'facets',
  'facet-documents',
  'folders',
  'types',
  'queries',
  'data-views',
  'compositions',
  'stores',
  'streams',
  'simulations',
  'updates',
  'mocks',
  'components',
  'actions',
  'filters',
  'converters',
  'computations',
  'vocabs',
  'i18n-bundles',
  'auth-profiles',
  'navigations',
  'styles',
  'configurations',
]

/** Коллекция HTTP → тип artifact/problem Core. */
const ENTITY_TYPE = {
  'types': 'type',
  'queries': 'query',
  'data-views': 'data-view',
  'compositions': 'composition',
  'stores': 'store',
  'streams': 'stream',
  'simulations': 'simulation',
  'updates': 'update',
  'mocks': 'mock',
  'components': 'component-sfc',
  'actions': 'action',
  'filters': 'filter',
  'converters': 'converter',
  'computations': 'computation',
  'vocabs': 'vocabs',
  'i18n-bundles': 'i18n-bundles',
  'auth-profiles': 'auth-profile',
  'navigations': 'navigation',
  'styles': 'style',
  'configurations': 'configuration',
  'facets': 'facet',
  'facet-documents': 'facet-document',
}

/** Коллекции, документы которых компилируются в ProgramArtifact. */
const COMPILED = new Set(['types', 'queries', 'data-views', 'compositions', 'stores', 'streams', 'simulations', 'updates', 'components', 'actions', 'filters', 'computations', 'vocabs', 'styles', 'configurations'])

/** Документы, которые сами являются точкой входа и могут ни на что не ссылаться извне. */
const ROOT_COLLECTIONS = new Set(['compositions', 'simulations', 'configurations', 'mocks', 'facets', 'facet-documents', 'folders', 'i18n-bundles', 'auth-profiles', 'navigations', 'converters', 'vocabs', 'styles'])

/** Пустой workspace с настройками по умолчанию backend 0.17.0. */
const EMPTY_WORKSPACE = {
  identity: 'grader',
  displayName: 'Grader',
  description: null,
  dataMode: 'development',
  documentStructure: 'frontend',
  startupCompositionIdentity: null,
  managedBy: 'user',
  managedById: null,
  meta: {},
  configuration: {
    defaultAuthProfileIdentity: null,
    defaultLocale: 'ru',
    fallbackLocale: 'ru',
    defaultSfcAdapterId: 'vue-native',
    sfcAdapterIds: ['vue-native'],
    defaultTheme: 'light',
    defaultTimezone: 'local',
    diagnostics: {},
    locales: [{ code: 'ru', direction: 'ltr', displayName: 'Русский', shortLabel: 'RU' }],
    themes: [{ identity: 'light', displayName: 'Светлая' }],
    timezones: [{ identity: 'local', displayName: 'Локальное время' }],
    sfcEditing: { cancelOn: [{ event: 'keydown', key: ['Escape'] }], commitOn: [{ event: 'keydown', key: ['Enter'] }] },
    values: {},
    vars: [],
  },
}

function parseArgs(argv) {
  const options = { markdown: [], snapshot: null, backend: null, workspace: null, facets: {}, eachFacet: false, json: null, core: null, quiet: false }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    const next = () => {
      const value = argv[index + 1]
      if (value === undefined) {
        throw new Error(`${arg}: нет значения`)
      }
      index += 1
      return value
    }
    if (arg === '--markdown') {
      options.markdown.push(next())
    }
    else if (arg === '--snapshot') {
      options.snapshot = next()
    }
    else if (arg === '--backend') {
      options.backend = next().replace(/\/+$/, '')
    }
    else if (arg === '--workspace') {
      options.workspace = next()
    }
    else if (arg === '--facets') {
      options.facets = Object.fromEntries(next().split(',').filter(Boolean).map(pair => pair.split('=').map(part => part.trim())))
    }
    else if (arg === '--each-facet') {
      options.eachFacet = true
    }
    else if (arg === '--json') {
      options.json = next()
    }
    else if (arg === '--core') {
      options.core = next()
    }
    else if (arg === '--quiet') {
      options.quiet = true
    }
    else if (arg === '--help' || arg === '-h') {
      options.help = true
    }
    else {
      throw new Error(`Неизвестный аргумент ${arg}`)
    }
  }
  return options
}

function findPackageJson(require, name) {
  for (const base of require.resolve.paths(name) ?? []) {
    const candidate = path.join(base, name, 'package.json')
    if (existsSync(candidate)) {
      return candidate
    }
  }
  throw new Error(`Пакет ${name} не найден`)
}

/** URL ESM-входа пакета; `require.resolve` вернул бы CJS-сборку и второй экземпляр Raph. */
function esmEntry(require, name) {
  const manifestPath = findPackageJson(require, name)
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const exported = manifest.exports?.['.'] ?? manifest.exports
  const entry = typeof exported === 'string'
    ? exported
    : exported?.import?.default ?? exported?.import ?? exported?.default ?? manifest.module ?? manifest.main
  return { url: pathToFileURL(path.join(path.dirname(manifestPath), entry)).href, version: manifest.version }
}

async function loadCore(coreDir) {
  const base = path.resolve(coreDir)
  const selfManifest = path.join(base, 'package.json')
  const selfName = existsSync(selfManifest) ? JSON.parse(readFileSync(selfManifest, 'utf8')).name : null
  const require = createRequire(selfManifest)
  const core = selfName === '@endge/core'
    ? (() => {
        const manifest = JSON.parse(readFileSync(selfManifest, 'utf8'))
        return { url: pathToFileURL(path.join(base, manifest.exports['.'].import)).href, version: manifest.version }
      })()
    : esmEntry(require, '@endge/core')
  const coreRequire = createRequire(new URL(core.url))
  const raph = esmEntry(coreRequire, '@raphy-js/raph')
  const { Raph } = await import(raph.url)
  const { Endge } = await import(core.url)
  if (!Raph.configured) {
    Raph.configure({ mode: 'runtime' })
  }
  return { Endge, coreVersion: core.version, raphVersion: raph.version }
}

async function fetchSnapshot(backend, workspace) {
  const headers = { 'Accept': 'application/json', 'X-Endge-Workspace': workspace }
  if (process.env.ENDGE_TOKEN) {
    headers.Authorization = `Bearer ${process.env.ENDGE_TOKEN}`
  }
  const response = await fetch(`${backend}/api/v1/domain`, { headers })
  const text = await response.text()
  if (!response.ok) {
    throw new Error(`GET /api/v1/domain: ${response.status} ${text.slice(0, 300)}`)
  }
  return JSON.parse(text)
}

/** Блоки ```json [POST /api/v1/<коллекция>] (и `/facets/<facet>/documents`) страницы. */
function readMarkdownBodies(file) {
  const text = readFileSync(file, 'utf8')
  const bodies = []
  const pattern = /^```json[ \t]+\[POST \/api\/v1\/([\w-]+)(?:\/([\w-]+)\/documents)?\][ \t]*\n([\s\S]*?)^```/gm
  for (const match of text.matchAll(pattern)) {
    const line = text.slice(0, match.index).split('\n').length
    const collection = match[2] ? 'facet-documents' : match[1]
    let body
    try {
      body = JSON.parse(match[3])
    }
    catch (error) {
      bodies.push({ file, line, collection, error: `JSON не разбирается: ${error.message}` })
      continue
    }
    if (match[2]) {
      body = { facetIdentity: match[2], ...body }
    }
    bodies.push({ file, line, collection, body })
  }
  return bodies
}

/**
 * Обязательные поля `CreateRequest` сверх identity и displayName (OpenAPI backend 0.17.0).
 * Backend отклоняет тело без них с `400 validation_error`.
 */
const REQUIRED_FIELDS = {
  'types': ['source', 'sourceVersion'],
  'configurations': ['source', 'sourceVersion'],
  'queries': ['source', 'sourceVersion'],
  'streams': ['source', 'sourceVersion'],
  'stores': ['source', 'sourceVersion'],
  'updates': ['source', 'sourceVersion', 'storeIdentity'],
  'data-views': ['source', 'sourceVersion'],
  'computations': ['source', 'sourceVersion', 'contractVersion'],
  'actions': ['source', 'sourceVersion'],
  'components': ['source', 'modelVersion'],
  'styles': ['source', 'sourceVersion'],
  'compositions': ['source', 'sourceVersion'],
  'simulations': ['source', 'sourceVersion'],
  'auth-profiles': ['adapterId'],
  'facets': ['icon', 'color'],
}

/** Структурная проверка тела создания документа (поле версии формата и обязательные поля). */
function checkCreateBody({ collection, body }) {
  const problems = []
  if (!COLLECTIONS.includes(collection) || collection === 'folders') {
    problems.push(`неизвестная коллекция ${collection}`)
  }
  if (typeof body.identity !== 'string' || !body.identity) {
    problems.push('нет identity')
  }
  if (typeof body.displayName !== 'string' || !body.displayName) {
    problems.push('нет displayName')
  }
  for (const field of REQUIRED_FIELDS[collection] ?? []) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      problems.push(`нет обязательного поля ${field}`)
    }
  }
  // У Mock `source` — содержимое fixture, а не Source DSL: версии формата нет.
  if (typeof body.source === 'string' && collection !== 'mocks') {
    if (collection === 'components' && body.modelVersion === undefined) {
      problems.push('у components поле версии формата — modelVersion')
    }
    if (collection === 'components' && body.sourceVersion !== undefined) {
      problems.push('у components нет sourceVersion, только modelVersion')
    }
    if (collection !== 'components' && body.sourceVersion === undefined) {
      problems.push('Source без sourceVersion')
    }
  }
  return problems
}

function withState(document, index) {
  if (document.state) {
    return document
  }
  return {
    description: null,
    managedBy: 'user',
    managedById: null,
    meta: {},
    ...document,
    state: { id: `grader-${index}`, revision: 1, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  }
}

function normalizeSnapshot(input, overlays) {
  const snapshot = structuredClone(input ?? { kind: 'workspace-snapshot', schemaVersion: 1, workspace: EMPTY_WORKSPACE, installedIntegrations: [], documents: {} })
  snapshot.kind ??= 'workspace-snapshot'
  snapshot.schemaVersion ??= 1
  snapshot.installedIntegrations ??= []
  snapshot.workspace = { ...EMPTY_WORKSPACE, ...snapshot.workspace }
  snapshot.workspace.state ??= { id: 'grader-workspace', generation: 'grader', headSequence: 0, revision: 1 }
  snapshot.documents ??= {}
  const unknown = Object.keys(snapshot.documents).filter(key => !COLLECTIONS.includes(key))
  for (const key of COLLECTIONS) {
    snapshot.documents[key] ??= []
  }
  let counter = 0
  for (const overlay of overlays) {
    const list = snapshot.documents[overlay.collection]
    if (!list) {
      continue
    }
    const existing = list.findIndex(document => document.identity === overlay.body.identity
      && (overlay.collection !== 'facet-documents' || document.facetIdentity === overlay.body.facetIdentity))
    const document = withState(overlay.body, (counter += 1))
    if (existing >= 0) {
      list[existing] = document
    }
    else {
      list.push(document)
    }
  }
  for (const key of COLLECTIONS) {
    snapshot.documents[key] = snapshot.documents[key].map((document, index) => withState(document, `${key}-${index}`))
  }
  return { snapshot, unknown }
}

function documentKey(entityType, identity) {
  return `${entityType}:${identity}`
}

async function compileOnce(Endge, snapshot, facets) {
  const provider = {
    id: 'service-backend',
    capabilities: { snapshot: true, mutations: false, softDelete: false, restore: false },
    etag: null,
    loadWorkspace: async () => structuredClone(snapshot),
  }
  try {
    await Endge.reset()
  }
  catch {}
  try {
    await Endge.boot({
      dataProvider: 'default',
      scope: { workspaceIdentity: snapshot.workspace.identity },
      vars: {},
      domainProvider: provider,
      context: Object.keys(facets).length > 0 ? { facets } : {},
    })
  }
  catch (error) {
    // Configurator с таким workspace тоже не откроется: это ошибка конфигурации, а не сбой инструмента.
    const message = String(error?.cause?.message ?? error?.message ?? error)
    return { programStatus: 'boot-failed', selections: facets, artifacts: [], problems: [], configValues: {}, payloads: new Map(), bootError: message }
  }
  const payloads = new Map(Endge.program.getArtifacts().map(artifact => [documentKey(artifact.ref.entityType, artifact.ref.identity), artifact.payload]))
  // Artifact Vocab называется `vocab`, а entity validation публикует problems как `vocabs`.
  const entityTypeOf = type => (type === 'vocab' ? 'vocabs' : type)
  const artifacts = Endge.program.getArtifacts().map(artifact => ({
    entityType: entityTypeOf(artifact.ref.entityType),
    identity: artifact.ref.identity,
    status: artifact.status,
    diagnostics: artifact.diagnostics.map(item => ({ severity: item.severity, code: item.code, message: item.message, sourcePath: item.sourcePath })),
    dependencies: artifact.dependencies.map(item => ({ entityType: entityTypeOf(item.entityType), identity: item.identity ?? String(item.id), role: item.role })),
  }))
  const problems = Endge.diagnostics.problems.query().map(problem => ({
    severity: problem.severity,
    phase: problem.owner?.phase,
    code: problem.code,
    message: problem.message,
    sourcePath: problem.sourcePath,
    entityType: problem.owner?.entityRef?.entityType ?? null,
    identity: problem.owner?.entityRef?.identity ?? null,
  }))
  const configValues = structuredClone(Endge.configuration.current?.values ?? {})
  return { programStatus: Endge.program.status, selections: Endge.context.getFacetSelections?.() ?? facets, artifacts, problems, configValues, payloads, bootError: null }
}

function readPath(value, dotted) {
  return dotted.split('.').reduce((current, key) => (current && typeof current === 'object' ? current[key] : undefined), value)
}

/**
 * Проверки, которых нет в compiler Core 1.0.0-dev.11, но которые ловят типичные
 * ошибки агента: лишние и недостающие props при вызове компонента или вложенной
 * Composition, ветки по несуществующим фасетам и пути `config(...)` без значения.
 */
function graderChecks(snapshot, run) {
  const issues = new Map()
  const push = (key, severity, code, message) => {
    if (!issues.has(key)) {
      issues.set(key, [])
    }
    issues.get(key).push({ severity, code, message, origin: 'grader' })
  }
  const facetDocuments = new Map()
  for (const facet of snapshot.documents.facets) {
    facetDocuments.set(facet.identity, new Set())
  }
  for (const document of snapshot.documents['facet-documents']) {
    if (!facetDocuments.has(document.facetIdentity)) {
      push(documentKey('facet-document', document.identity), 'error', 'grader-facet-missing', `фасет ${document.facetIdentity} не существует`)
    }
    else {
      facetDocuments.get(document.facetIdentity).add(document.identity)
    }
  }
  for (const collection of COLLECTIONS) {
    const entityType = ENTITY_TYPE[collection]
    for (const document of snapshot.documents[collection]) {
      if (typeof document.source !== 'string' || collection === 'mocks') {
        continue
      }
      const key = documentKey(entityType, document.identity)
      for (const match of document.source.matchAll(/(?:when:\s*|context\(\s*)\{([^{}]*)\}/g)) {
        for (const pair of match[1].matchAll(/['"]?([\w-]+)['"]?\s*:\s*['"]([^'"]+)['"]/g)) {
          const [, facet, value] = pair
          if (!facetDocuments.has(facet)) {
            push(key, 'error', 'grader-facet-case-unknown', `условие по фасету ${facet}, которого нет`)
          }
          else if (!facetDocuments.get(facet).has(value)) {
            push(key, 'error', 'grader-facet-case-unknown', `условие ${facet}: '${value}' — такого документа фасета нет`)
          }
        }
      }
      for (const match of document.source.matchAll(/\bconfig\(\s*['"]([^'"]+)['"]\s*\)/g)) {
        if (readPath(run.configValues, match[1]) === undefined) {
          push(key, 'error', 'grader-config-missing', `config('${match[1]}') не задан ни в одной Configuration текущего контекста`)
        }
      }
    }
  }
  for (const [key, payload] of run.payloads) {
    if (!key.startsWith('composition:') || !Array.isArray(payload?.runtimes)) {
      continue
    }
    for (const runtime of payload.runtimes) {
      let declared = null
      if (runtime.kind === 'component') {
        declared = run.payloads.get(documentKey('component-sfc', runtime.identity))?.contract?.inputs?.map(input => ({ name: input.name, optional: input.optional }))
      }
      else if (runtime.kind === 'composition') {
        declared = (run.payloads.get(documentKey('composition', runtime.identity))?.props ?? []).map(contract => ({ name: contract.key, optional: Boolean(contract.optional) || contract.default !== undefined }))
      }
      if (!declared) {
        continue
      }
      const passed = Object.keys(runtime.props ?? {})
      for (const name of passed) {
        if (!declared.some(input => input.name === name)) {
          push(key, 'error', 'grader-prop-unknown', `runtime ${runtime.path}: ${runtime.kind} ${runtime.identity} не объявляет prop ${name}`)
        }
      }
      for (const input of declared) {
        if (!input.optional && !passed.includes(input.name)) {
          push(key, 'warning', 'grader-prop-missing', `runtime ${runtime.path}: обязательный prop ${input.name} ${runtime.kind} ${runtime.identity} не передан`)
        }
      }
    }
  }
  return issues
}

function analyze(snapshot, run, structural) {
  const extra = graderChecks(snapshot, run)
  const documents = []
  const known = new Set()
  for (const collection of COLLECTIONS) {
    for (const document of snapshot.documents[collection]) {
      if (collection === 'folders') {
        continue
      }
      const entityType = ENTITY_TYPE[collection]
      known.add(documentKey(entityType, document.identity))
      documents.push({ collection, entityType, identity: document.identity, facetIdentity: document.facetIdentity, active: document.active !== false })
    }
  }
  for (const artifact of run.artifacts) {
    known.add(documentKey(artifact.entityType, artifact.identity))
  }

  const referencedBy = new Map()
  const dangling = []
  for (const artifact of run.artifacts) {
    for (const dependency of artifact.dependencies) {
      const key = documentKey(dependency.entityType, dependency.identity)
      if (!referencedBy.has(key)) {
        referencedBy.set(key, new Set())
      }
      referencedBy.get(key).add(documentKey(artifact.entityType, artifact.identity))
      const tracked = Object.values(ENTITY_TYPE).includes(dependency.entityType)
      if (tracked && !known.has(key)) {
        dangling.push({ from: documentKey(artifact.entityType, artifact.identity), to: key, role: dependency.role })
      }
    }
  }

  const startup = snapshot.workspace.startupCompositionIdentity
  const report = documents.map((document) => {
    const key = documentKey(document.entityType, document.identity)
    const artifact = run.artifacts.find(item => item.entityType === document.entityType && item.identity === document.identity)
    const issues = []
    for (const item of artifact?.diagnostics ?? []) {
      issues.push({ ...item, origin: 'compiler' })
    }
    for (const problem of run.problems) {
      if (problem.entityType === document.entityType && problem.identity === document.identity
        && !issues.some(item => item.code === problem.code && item.message === problem.message)) {
        issues.push({ severity: problem.severity, code: problem.code, message: problem.message, sourcePath: problem.sourcePath, origin: 'problems' })
      }
    }
    for (const item of dangling.filter(entry => entry.from === key)) {
      issues.push({ severity: 'warning', code: 'grader-dangling-reference', message: `ссылка на несуществующий ${item.to} (${item.role ?? 'reference'})`, origin: 'grader' })
    }
    for (const issue of extra.get(key) ?? []) {
      issues.push(issue)
    }
    for (const message of structural.get(key) ?? []) {
      issues.push({ severity: 'error', code: 'grader-create-body', message, origin: 'grader' })
    }
    if (document.active && COMPILED.has(document.collection) && !ROOT_COLLECTIONS.has(document.collection)
      && !(referencedBy.get(key)?.size) && !(document.collection === 'compositions' && document.identity === startup)) {
      issues.push({ severity: 'info', code: 'grader-unused', message: 'на документ не ссылается ни один другой документ', origin: 'grader' })
    }
    let status = 'ok'
    if (run.bootError) {
      status = 'not-compiled'
    }
    else if (!document.active) {
      status = 'inactive'
    }
    else if (COMPILED.has(document.collection) && !artifact) {
      status = 'not-compiled'
    }
    if (issues.some(item => item.severity === 'error' || item.severity === 'fatal')) {
      status = 'error'
    }
    else if (status === 'ok' && issues.some(item => item.severity === 'warning')) {
      status = 'warning'
    }
    return { ...document, status, artifactStatus: artifact?.status ?? null, issues }
  })
  const orphanProblems = run.problems.filter(problem => !problem.entityType
    || !documents.some(document => document.entityType === problem.entityType && document.identity === problem.identity))
    .filter(problem => !run.artifacts.some(artifact => artifact.entityType === problem.entityType && artifact.identity === problem.identity))
  return { report, orphanProblems }
}

function printRun(label, run, analysis, quiet) {
  const lines = []
  const counts = {}
  for (const entry of analysis.report) {
    counts[entry.status] = (counts[entry.status] ?? 0) + 1
  }
  lines.push(`\n## ${label}`)
  if (run.bootError) {
    lines.push(`ERROR boot: ${run.bootError}`)
  }
  lines.push(`Program: ${run.programStatus}; фасеты: ${JSON.stringify(run.selections)}; документы: ${Object.entries(counts).map(([key, value]) => `${key} ${value}`).join(', ')}`)
  for (const entry of analysis.report) {
    if ((quiet && entry.status === 'ok') || run.bootError) {
      continue
    }
    const facet = entry.facetIdentity ? `${entry.facetIdentity}/` : ''
    lines.push(`- [${entry.status}] ${entry.collection} ${facet}${entry.identity}`)
    for (const issue of entry.issues) {
      lines.push(`    ${issue.severity} ${issue.code}${issue.sourcePath ? ` @${issue.sourcePath}` : ''}: ${issue.message}`)
    }
  }
  for (const problem of analysis.orphanProblems) {
    lines.push(`- [problem] ${problem.entityType ?? '—'} ${problem.identity ?? ''}: ${problem.severity} ${problem.code}: ${problem.message}`)
  }
  console.log(lines.join('\n'))
}

function hasErrors(analysis, run) {
  return Boolean(run.bootError) || analysis.report.some(entry => entry.status === 'error' || entry.status === 'not-compiled')
    || analysis.orphanProblems.some(problem => problem.severity === 'error' || problem.severity === 'fatal')
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help || (!options.snapshot && !options.backend && options.markdown.length === 0)) {
    console.log('node scripts/grade-workspace.mjs [--backend <url> --workspace <id> | --snapshot <file>] [--markdown <page.md>]... [--facets k=v,...] [--each-facet] [--json <file>] [--core <dir>] [--quiet]')
    return options.help ? 0 : 2
  }
  const coreDir = options.core ?? process.env.ENDGE_CORE_DIR ?? monorepoCore
  const { Endge, coreVersion, raphVersion } = await loadCore(coreDir)

  let base = null
  let source = 'пустой workspace'
  if (options.backend) {
    if (!options.workspace) {
      throw new Error('--backend требует --workspace')
    }
    base = await fetchSnapshot(options.backend, options.workspace)
    source = `${options.backend} workspace ${options.workspace}`
  }
  else if (options.snapshot) {
    base = JSON.parse(readFileSync(options.snapshot, 'utf8'))
    source = options.snapshot
  }

  const bodies = options.markdown.flatMap(file => readMarkdownBodies(file))
  const structural = new Map()
  const bodyErrors = []
  for (const entry of bodies) {
    if (entry.error) {
      bodyErrors.push(`${path.relative(process.cwd(), entry.file)}:${entry.line}: ${entry.error}`)
      continue
    }
    const problems = checkCreateBody(entry)
    if (problems.length > 0) {
      structural.set(documentKey(ENTITY_TYPE[entry.collection], entry.body.identity), problems)
    }
  }
  const { snapshot, unknown } = normalizeSnapshot(base, bodies.filter(entry => !entry.error))

  console.log(`# Оценка workspace ${snapshot.workspace.identity}`)
  console.log(`Источник: ${source}${bodies.length > 0 ? ` + ${bodies.length} тел из Markdown` : ''}; @endge/core ${coreVersion}, @raphy-js/raph ${raphVersion}`)
  for (const message of bodyErrors) {
    console.log(`ERROR ${message}`)
  }
  if (unknown.length > 0) {
    console.log(`WARNING коллекции, неизвестные Core: ${unknown.join(', ')}`)
  }

  const contexts = [{ label: 'Базовый контекст', facets: options.facets }]
  if (options.eachFacet) {
    for (const document of snapshot.documents['facet-documents']) {
      if (document.active === false) {
        continue
      }
      contexts.push({ label: `Фасет ${document.facetIdentity}=${document.identity}`, facets: { ...options.facets, [document.facetIdentity]: document.identity } })
    }
  }

  const runs = []
  let failed = bodyErrors.length > 0
  for (const context of contexts) {
    const run = await compileOnce(Endge, snapshot, context.facets)
    const analysis = analyze(snapshot, run, structural)
    printRun(context.label, run, analysis, options.quiet)
    failed ||= hasErrors(analysis, run)
    runs.push({ label: context.label, facets: context.facets, programStatus: run.programStatus, bootError: run.bootError, selections: run.selections, documents: analysis.report, orphanProblems: analysis.orphanProblems })
  }

  const total = runs[0]?.documents.length ?? 0
  console.log(`\nИтог: ${failed ? 'ЕСТЬ ОШИБКИ' : 'чисто'}; документов ${total}, контекстов ${runs.length}`)
  if (options.json) {
    writeFileSync(options.json, `${JSON.stringify({ source, coreVersion, raphVersion, ok: !failed, bodyErrors, unknownCollections: unknown, runs }, null, 2)}\n`)
  }
  return failed ? 1 : 0
}

main().then((code) => {
  process.exit(code)
}, (error) => {
  console.error(`Сбой инструмента: ${error instanceof Error ? error.stack : String(error)}`)
  process.exit(2)
})
