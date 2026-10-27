/**
 * Собирает документацию Endge для языковых моделей рядом со сборкой VitePress:
 * - llms.txt — оглавление по https://llmstxt.org/: маршрут агента, разделы со ссылками
 *   и описаниями, `## Optional` для того, что можно пропустить;
 * - llms-agent.txt — ядро для типовой работы через API/MCP (бюджет AGENT_TOKEN_LIMIT);
 * - llms-full.txt — всё одним файлом;
 * - llms-full/<раздел>.txt — раздел целиком или, если он больше PART_TOKEN_LIMIT,
 *   оглавление его частей (llms-full/reference/<тип>.txt);
 * - llms-full/api.txt — оглавление HTTP API, llms-full/api/<группа>.txt — группа OpenAPI;
 * - Markdown-версию каждой публичной страницы;
 * - llms-manifest.json — provenance и состав файлов с размерами и оценкой токенов.
 *
 * Оценка токенов (estimateTokens): символы кириллицы / 2,5 + остальные символы / 3,5.
 * Формула намеренно завышает: на этой документации она на 10–30% больше счёта
 * токенизатора o200k_base, а токенизаторы других моделей обычно дают больше o200k.
 *
 * Переменные окружения:
 * - ENDGE_DOCS_URL — публичный адрес сайта для абсолютных ссылок;
 * - ENDGE_OPENAPI_PATH — путь к openapi3.yaml Service Backend;
 * - ENDGE_OPENAPI_URL — адрес спецификации, если файла нет локально;
 * - ENDGE_LLMS_OUTPUT — каталог результата (по умолчанию docs/.vitepress/dist).
 */
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'
import { documentationFingerprint, documentationRoute, publicMarkdownFiles, readDocumentation } from './documentation-catalog.mjs'
import { autoDescription, normalizeDescription, splitFrontmatter } from './documentation-pages.mjs'
import { loadOpenApi, OPENAPI_PUBLIC_URL } from './load-openapi.mjs'
import { openApiHeaderMarkdown, openApiMarkdown, openApiOperationIndex, openApiOperations, openApiTagMarkdown, openApiTags, openApiTagSlugs } from './openapi-markdown.mjs'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const documentsRoot = path.join(repositoryRoot, 'docs')
const outputRoot = path.resolve(process.env.ENDGE_LLMS_OUTPUT ?? path.join(documentsRoot, '.vitepress', 'dist'))
const siteURL = (process.env.ENDGE_DOCS_URL ?? '').replace(/\/+$/, '')

/** Ядро агента обязано помещаться в контекст вместе с задачей: превышение ломает сборку. */
const AGENT_TOKEN_LIMIT = 60_000
/** Ориентир для одной части; раздел больше него публикуется оглавлением своих частей. */
const PART_TOKEN_LIMIT = 100_000
const TOKEN_ESTIMATE = { cyrillicCharactersPerToken: 2.5, otherCharactersPerToken: 3.5 }

/**
 * Порядок разделов — по важности для агента, работающего через API/MCP.
 * Разделы с `optional` и страницы из OPTIONAL_PAGES попадают в `## Optional` llms.txt.
 */
const SECTIONS = [
  { id: 'agents', title: 'Начать здесь: ИИ-агентам', roots: ['agents'], summary: 'руководство агента, токены, MCP, коды ошибок, сценарии, авторинг и исходники' },
  { id: 'reference', title: 'Справочник документов и Source', roots: ['reference'], summary: 'авторский Source каждого типа документа, языки выражений, EndgeCSS, AuthProfile, capabilities и TypeScript-контракты' },
  { id: 'domain', title: 'Домен Endge и компоненты SFC', roots: ['domain'], summary: 'сущности, связи, жизненный цикл и встроенные теги Component SFC' },
  { id: 'guides', title: 'Руководства и таблицы SFC', roots: ['guides', 'guide', 'sfc-tables'], summary: 'практические руководства: данные, компоненты, события, вычисления, GraphQL, JSON UI, стили и таблицы SFC' },
  { id: 'start', title: 'Начало работы и Configurator', roots: ['getting-started', 'configurator'], summary: 'устройство Endge, установка, аутентификация и роли, рабочие области Configurator, поставка workspace' },
  { id: 'product', title: 'О продукте', roots: ['', 'product'], summary: 'что такое Endge, метамодель, контекст и экосистема' },
  { id: 'services', title: 'Сервисы', roots: ['services'], summary: 'Mock Generator, справочники и AI Workbench' },
  { id: 'tools', title: 'Инструменты', roots: ['tools'], summary: 'инструменты разработчика' },
  { id: 'advanced', title: 'Архитектура, Federation и Core', roots: ['advanced', 'federation', 'core', 'architecture'], optional: true, summary: 'встраивание Core, Federation, модули, контекст и состояние, диагностика и Bridge' },
  { id: 'raph', title: 'Raph', roots: ['raph'], optional: true, summary: 'библиотека реактивных данных Raph: архитектура, данные, граф выполнения, API и контракты' },
]
/** Тяжёлые и внутренние страницы обязательных разделов: агенту API/MCP они обычно не нужны. */
const OPTIONAL_PAGES = [/^reference\/contracts\//, /^services\/ai-workbench\//]
/** Состав ядра агента; порядок — порядок чтения. Коды ошибок и операции API добавляются компактно. */
const AGENT_CORE_PAGES = [
  'agents/index.md',
  'agents/tokens.md',
  'agents/mcp.md',
  'agents/scenarios.md',
  'agents/authoring.md',
  'agents/repositories.md',
  'configurator/agent-access.md',
  'reference/capabilities.md',
]
const ERRORS_PAGE = 'agents/errors.md'

const SOURCE_REPOSITORIES = [
  ['Service Backend', 'https://github.com/endge-lab/service-backend', 'Go, REST API и MCP-сервер, OpenAPI и каталог кодов ошибок'],
  ['Configurator', 'https://github.com/endge-lab/configurator', 'Vue-приложение для редактирования workspace'],
  ['@endge/core', 'https://github.com/endge-lab/core', 'домен, компиляторы Source и runtime'],
  ['@endge/ui-vue', 'https://github.com/endge-lab/ui-vue', 'Vue-адаптеры Component SFC'],
  ['@endge/utils', 'https://github.com/endge-lab/utils', 'общие утилиты пакетов Endge'],
  ['@endge/computation-sandbox', 'https://github.com/endge-lab/computation-sandbox', 'песочница исполнения Computation'],
  ['service-kit-go', 'https://github.com/endge-lab/service-kit-go', 'общий Go-каркас сервисов'],
  ['Документация', 'https://github.com/endge-lab/configurator-docs', 'исходники этого сайта и генераторы llms-файлов'],
]
/** Закрытые исходники: агент проверяет контракт по опубликованным declarations, а не по repository. */
const CLOSED_SOURCES = [
  ['Raph (@raphy-js/raph)', `контракты ${url('raph/contracts/index.md')} и \`.d.ts\` npm-пакета https://unpkg.com/@raphy-js/raph@<версия>/`],
  ['TypedWorks Federation (@typedworks/federation)', `контракты ${url('reference/contracts/federation/index.md')} и \`.d.ts\` npm-пакета https://unpkg.com/@typedworks/federation@<версия>/`],
  ['Mock Generator', 'только HTTP API backend `/api/v1/mock-data/*`'],
]

const packageManifest = JSON.parse(await readFile(path.join(repositoryRoot, 'package.json'), 'utf8'))
const documentPaths = await publicMarkdownFiles(documentsRoot)
const raw = await Promise.all(documentPaths.map(readPage))
const known = new Set(raw.map(page => page.relativePath))
const loaded = raw.map(page => ({ ...page, body: rewriteLinks(page.body, page.relativePath) }))
const pageByPath = new Map(loaded.map(page => [page.relativePath, page]))

const sections = SECTIONS.map(section => ({
  ...section,
  pages: loaded.filter(page => sectionOf(page.relativePath) === section.id).sort(comparePages),
}))
const unassigned = loaded.filter(page => !SECTIONS.some(section => section.id === sectionOf(page.relativePath)))
if (unassigned.length) {
  sections.push({ id: 'other', title: 'Прочее', summary: 'страницы вне основных разделов', pages: unassigned.sort(comparePages) })
}
const filledSections = sections.filter(section => section.pages.length)

const { spec, origin: openApiOrigin, sha256: openApiSha256 } = await loadOpenApi(repositoryRoot)
const api = openApiMarkdown(spec, { specUrl: OPENAPI_PUBLIC_URL })
const operations = openApiOperations(spec)
const tagSlugs = openApiTagSlugs(operations)
const contractManifest = await readFile(path.join(documentsRoot, 'public/contracts-manifest.json'), 'utf8')
const provenance = {
  format: 'endge-documentation/v1',
  version: packageManifest.version,
  markdownDocumentCount: loaded.length,
  documentCount: loaded.length + 1,
  documentationSha256: await documentationFingerprint(documentPaths, documentsRoot),
  openApiSha256,
  openApiOrigin,
  sourceCommit: process.env.CI_COMMIT_SHA ?? 'local',
  contractManifest: 'contracts-manifest.json',
  contractsSha256: createHash('sha256').update(contractManifest).digest('hex'),
}
const provenanceMarkdown = `Снимок Docs ${packageManifest.version}; состав страниц: sha256:${provenance.documentationSha256}. Версии и исходники API: ${url('contracts-manifest.json')}. Состав выгрузки, размеры и оценка токенов: ${url('llms-manifest.json')}.`

/** path → { content, purpose, title, description, optional } */
const files = new Map()
for (const page of loaded) {
  files.set(page.markdownPath, { content: `${pageMarkdown(page)}\n`, purpose: 'page' })
}

// Разделы: целиком или оглавлением частей.
for (const section of filledSections) {
  const whole = `# Endge: ${section.title}\n\n${section.pages.map(pageMarkdown).join('\n\n---\n\n')}\n`
  section.file = `llms-full/${section.id}.txt`
  section.parts = estimateTokens(whole) > PART_TOKEN_LIMIT ? sectionParts(section) : []
  if (!section.parts.length) {
    addFile(section.file, whole, { purpose: 'section', title: section.title, description: `${section.pages.length} ${plural(section.pages.length, 'страница', 'страницы', 'страниц')} раздела одним файлом: ${section.summary}`, optional: Boolean(section.optional) })
    continue
  }
  for (const part of section.parts) {
    addFile(part.file, partMarkdown(section, part), { purpose: 'section-part', title: part.title, description: part.description, optional: part.optional })
  }
  addFile(section.file, sectionIndexMarkdown(section, estimateTokens(whole)), {
    purpose: 'section-index',
    title: `${section.title}: оглавление частей`,
    description: `раздел больше ${formatTokens(PART_TOKEN_LIMIT)}, поэтому разбит на ${section.parts.length} ${plural(section.parts.length, 'часть', 'части', 'частей')}; здесь список частей с описаниями и размерами`,
    optional: Boolean(section.optional),
  })
}

// HTTP API: группа OpenAPI на файл и оглавление со всеми операциями.
const apiTags = openApiTags(operations).map((tag) => {
  const entries = operations.filter(entry => entry.tag === tag)
  const file = `llms-full/api/${tagSlugs.get(tag)}.txt`
  const content = [
    `# ${spec.info?.title ?? 'API'} ${spec.info?.version ?? ''}: ${tag}`.trim(),
    `> ${entries.length} ${plural(entries.length, 'операция', 'операции', 'операций')} группы «${tag}» с параметрами, телами, ответами и всеми используемыми схемами.`,
    `Общие правила API (аутентификация, \`X-Endge-Workspace\`, \`If-Match\`, формат ошибок) и остальные группы: ${url('llms-full/api.txt')}. Коды ошибок: ${url('agents/errors.md')}. Машиночитаемая спецификация OpenAPI 3: ${OPENAPI_PUBLIC_URL}`,
    openApiTagMarkdown(spec, tag, operations),
  ].join('\n\n')
  const description = `${entries.length} ${plural(entries.length, 'операция', 'операции', 'операций')}: ${shortList(entries.map(entry => entry.operation.summary).filter(Boolean))}`
  addFile(file, content, { purpose: 'api-group', title: tag, description })
  return { tag, file, count: entries.length }
})
addFile('llms-full/api.txt', apiIndexMarkdown(), {
  purpose: 'api-index',
  title: 'Оглавление HTTP API',
  description: `общие правила API и все ${operations.length} операций (метод, путь, summary) со ссылками на группы; схемы — в файлах групп`,
})

addFile('llms-agent.txt', agentMarkdown(), {
  purpose: 'agent-core',
  title: 'Ядро для агента',
  description: 'руководство агента, токены, MCP, правила исходников, версий и лимитов, сценарии, коды ошибок, авторинг, capabilities и все HTTP-операции',
})
const agentTokens = files.get('llms-agent.txt').tokens
if (agentTokens > AGENT_TOKEN_LIMIT) {
  throw new Error(`llms-agent.txt: оценка ${agentTokens} токенов больше лимита ${AGENT_TOKEN_LIMIT}. Сократите AGENT_CORE_PAGES или страницы ядра.`)
}

const everything = [
  `# Endge ${packageManifest.version}: полная документация для языковых моделей`,
  '> Документация платформы Endge и конфигуратора, руководство для ИИ-агентов и полный HTTP API Service Backend.',
  repositoriesMarkdown(),
  provenanceMarkdown,
  '---',
  filledSections.map(section => section.pages.map(pageMarkdown).join('\n\n---\n\n')).join('\n\n---\n\n'),
  '---',
  api,
].join('\n\n')
addFile('llms-full.txt', everything, { purpose: 'everything', title: 'Всё одним файлом', description: 'вся публичная документация и полный HTTP API со схемами', optional: true })
addFile('llms.txt', indexMarkdown(), { purpose: 'index', title: 'Оглавление llms.txt', description: 'маршрут агента и оглавление с описаниями' })

const overLimit = [...files].filter(([, file]) => file.purpose !== 'everything' && file.purpose !== 'page' && file.tokens > PART_TOKEN_LIMIT)
for (const [file, entry] of overLimit) {
  console.warn(`LLM docs: ${file} — оценка ${entry.tokens} токенов больше ориентира части ${PART_TOKEN_LIMIT}.`)
}

const llmsFiles = [...files].filter(([, file]) => file.purpose !== 'page').map(([file, entry]) => ({
  path: file,
  bytes: Buffer.byteLength(entry.content),
  tokens: entry.tokens,
  purpose: entry.purpose,
  title: entry.title,
  ...(entry.optional ? { optional: true } : {}),
  ...(entry.tokens > PART_TOKEN_LIMIT && entry.purpose !== 'everything' ? { overPartLimit: true } : {}),
}))
const descriptionCount = { manual: loaded.filter(page => page.descriptionSource === 'manual').length, auto: loaded.filter(page => page.descriptionSource === 'auto').length }
const manifest = {
  ...provenance,
  tokenEstimate: { method: 'characters', ...TOKEN_ESTIMATE, note: 'Оценка с запасом: кириллица / 2,5 + остальные символы / 3,5.' },
  limits: { agentCoreTokens: AGENT_TOKEN_LIMIT, partTokens: PART_TOKEN_LIMIT },
  descriptions: descriptionCount,
  files: llmsFiles,
}
const outputs = new Map([
  ['contracts-manifest.json', contractManifest],
  ['llms-manifest.json', JSON.stringify(manifest, null, 2)],
  ...[...files].map(([file, entry]) => [file, entry.content]),
])
for (const [file, content] of outputs) {
  const target = path.join(outputRoot, file)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, content.endsWith('\n') ? content : `${content}\n`, 'utf8')
}
console.log(`LLM docs: ${loaded.length} страниц (описания: ${descriptionCount.manual} ручных, ${descriptionCount.auto} авто), ${operations.length} операций API, llms-agent.txt ≈${agentTokens} токенов, llms-full.txt ${Math.round(Buffer.byteLength(everything) / 1024)} КБ`)
console.log(outputRoot)

function addFile(file, content, meta) {
  const text = content.endsWith('\n') ? content : `${content}\n`
  files.set(file, { ...meta, content: text, tokens: estimateTokens(text) })
}

function indexMarkdown() {
  const sizeOf = file => formatTokens(files.get(file).tokens)
  const link = (file, title, description) => `- [${title}](${url(file)}): ${clause(description)}; ${sizeOf(file)}`
  const pageLink = (page, prefix = '') => `- [${prefix}${page.title}](${url(page.markdownPath)}): ${page.description}`
  const reference = sections.find(section => section.id === 'reference')
  const optionalLines = [
    link('llms-full.txt', 'Всё одним файлом', files.get('llms-full.txt').description),
  ]
  const lines = [
    '# Endge',
    '> Endge — платформа для сборки конфигурации приложений: Configurator, Service Backend (REST API и MCP) и runtime. Документация на русском; ниже — маршрут для ИИ-агента и оглавление с описанием каждой ссылки.',
    [
      'Маршрут агента с ограниченным контекстом:',
      '',
      `1. Доступ. Попросите пользователя выпустить персональный токен \`endge_pat_…\` в Configurator кнопкой «Для агента» и передавайте его в \`Authorization: Bearer\` ([токены](${url('agents/tokens.md')})). Без токена — вход через OIDC ([руководство](${url('agents/index.md')})).`,
      `2. Ядро. Загрузите [llms-agent.txt](${url('llms-agent.txt')}) (${sizeOf('llms-agent.txt')}): руководство, токены, MCP, правила исходников, версий и лимитов, сценарии, коды ошибок, авторинг, capabilities и все HTTP-операции одним списком.`,
      '3. Детали по требованию. Схемы операций — файл группы `llms-full/api/<группа>.txt`, авторский Source — часть справочника `llms-full/reference/<тип>.txt`, любая страница — её `.md`. Раздел `## Optional` можно пропустить.',
    ].join('\n'),
    `Размеры — оценка токенов с запасом: кириллица / 2,5 + остальные символы / 3,5. ${provenanceMarkdown}`,
    `При расхождении документации и поведения истина — исходники развёрнутой версии: \`GET /version\` backend, тег \`v<версия>\` в публичном repository, иначе \`main\` с оговоркой ([правила](${url('agents/repositories.md')})). Закрытые исходники: ${CLOSED_SOURCES.map(([name, note]) => `${name} — ${note}`).join('; ')}.`,
  ]

  for (const section of filledSections.filter(value => !value.optional)) {
    const mainPages = section.pages.filter(page => !isOptionalPage(page.relativePath))
    const optionalPages = section.pages.filter(page => isOptionalPage(page.relativePath))
    if (!section.parts.length) {
      optionalLines.push(...optionalPages.map(page => pageLink(page, `${section.title}: `)))
    }
    const items = []
    if (section.id === 'agents') {
      items.push(link('llms-agent.txt', 'Ядро для агента', `${files.get('llms-agent.txt').description}; загружайте первым`))
    }
    if (section.parts.length) {
      items.push(link(section.file, `${section.title}: оглавление частей`, files.get(section.file).description))
      items.push(...section.parts.filter(part => !part.optional).map(part => link(part.file, part.title, part.description)))
      optionalLines.push(...section.parts.filter(part => part.optional).map(part => link(part.file, part.title, part.description)))
    }
    else {
      items.push(...mainPages.map(page => pageLink(page)))
      items.push(link(section.file, 'Раздел целиком', files.get(section.file).description))
    }
    lines.push(`## ${section.title}`, items.join('\n'))
    if (section.id === 'agents') {
      lines.push('## HTTP API Service Backend', [
        link('llms-full/api.txt', 'Оглавление HTTP API', files.get('llms-full/api.txt').description),
        ...apiTags.map(item => link(item.file, item.tag, files.get(item.file).description)),
        `- [OpenAPI 3](${OPENAPI_PUBLIC_URL}): машиночитаемая спецификация Service Backend ${spec.info?.version ?? ''}`.trimEnd(),
      ].join('\n'))
    }
    if (section === reference) {
      lines.push('## Исходный код', SOURCE_REPOSITORIES.map(([name, link, description]) => `- [${name}](${link}): ${description}`).join('\n'))
    }
  }
  // Необязательные разделы — одной ссылкой: страницы с описаниями и адресами есть в самом файле раздела.
  for (const section of filledSections.filter(value => value.optional)) {
    optionalLines.push(link(section.file, `${section.title}: раздел целиком`, files.get(section.file).description))
  }
  lines.push('## Optional', optionalLines.join('\n'))
  return `${lines.join('\n\n')}\n`
}

function agentMarkdown() {
  const core = AGENT_CORE_PAGES.map((file) => {
    const page = pageByPath.get(file)
    if (!page) {
      throw new Error(`Страница ядра агента ${file} не найдена.`)
    }
    return pageMarkdown(page)
  })
  const reference = sections.find(section => section.id === 'reference')
  const referenceLines = reference.parts.length
    ? reference.parts.filter(part => !part.optional).map(part => `- [${part.title}](${url(part.file)}): ${clause(part.description)}; ${formatTokens(files.get(part.file).tokens)}`)
    : reference.pages.map(page => `- [${page.title}](${url(page.markdownPath)}): ${page.description}`)
  return [
    `# Endge ${packageManifest.version}: ядро для ИИ-агента`,
    '> Всё для типовой работы через HTTP API или MCP одним файлом: руководство агента, персональные токены, MCP, правила исходников, версий и лимитов, сквозные сценарии, коды ошибок (компактно), авторинг Source, матрица возможностей и все HTTP-операции.',
    `Схемы тел и ответов не входят: они в файле группы API \`llms-full/api/<группа>.txt\` (ссылка у каждой группы в списке операций ниже). Авторский Source каждого типа документа — в частях справочника (список в конце). Оглавление всей документации: ${url('llms.txt')}.`,
    provenanceMarkdown,
    repositoriesMarkdown(),
    '---',
    core.join('\n\n---\n\n'),
    '---',
    errorsCompactMarkdown(),
    '---',
    [
      '# HTTP API: все операции',
      `${openApiHeaderMarkdown(spec, { specUrl: OPENAPI_PUBLIC_URL }).replace(/^# .*\n\n/, `Источник: ${url('llms-full/api.txt')}\n\n`)}`,
      openApiOperationIndex(operations, { tagLink: tag => url(`llms-full/api/${tagSlugs.get(tag)}.txt`) }),
    ].join('\n\n'),
    '---',
    [
      '# Где читать дальше',
      '## Справочник по типам документов',
      referenceLines.join('\n'),
      '## Разделы целиком',
      filledSections.map(section => `- [${section.title}](${url(section.file)}): ${clause(files.get(section.file).description)}; ${formatTokens(files.get(section.file).tokens)}`).join('\n'),
    ].join('\n\n'),
  ].join('\n\n')
}

/** Коды ошибок для ядра: общие правила страницы и коды с одинаковым действием одной строкой. */
function errorsCompactMarkdown() {
  const page = pageByPath.get(ERRORS_PAGE)
  if (!page) {
    throw new Error(`Нет страницы ${ERRORS_PAGE}.`)
  }
  const [preamble, groups = ''] = page.body.split(/^## Группы\s*$/m)
  const lines = [`# ${page.title} (компактно)`, `Источник: ${url(page.markdownPath)} — полная таблица со смыслом каждого кода.`, preamble.replace(/<!--[\s\S]*?-->/g, '').trim()]
  for (const block of groups.split(/^(?=## )/m).filter(value => value.startsWith('## '))) {
    const heading = block.split('\n')[0].slice(3).replace(/\{#[^}]+\}\s*$/, '').trim()
    const rows = block.split('\n').filter(line => line.startsWith('| <a id='))
    if (!rows.length) {
      lines.push(block.trim())
      continue
    }
    const byAction = new Map()
    for (const row of rows) {
      const cells = row.split(/(?<!\\)\|/).slice(1, -1).map(cell => plainCell(cell))
      const code = /`([^`]+)`/.exec(cells[0])?.[1]
      const action = cells[3]
      if (!code || !action) {
        throw new Error(`Не разобрана строка кода ошибки: ${row.slice(0, 80)}`)
      }
      byAction.set(action, [...(byAction.get(action) ?? []), `\`${code}\` ${cells[1]}`])
    }
    lines.push(`## ${heading}`, [...byAction].map(([action, codes]) => `- ${codes.join(', ')}: ${action}`).join('\n'))
  }
  return lines.join('\n\n')
}

function apiIndexMarkdown() {
  return [
    openApiHeaderMarkdown(spec, { specUrl: OPENAPI_PUBLIC_URL }),
    `Это оглавление: полный справочник разбит по группам OpenAPI. Файл группы содержит её операции с параметрами, телами, ответами и все используемые схемы. Всё API одним файлом входит в ${url('llms-full.txt')}. Коды ошибок: ${url('agents/errors.md')}.`,
    '## Группы',
    apiTags.map(item => `- [${item.tag}](${url(item.file)}): ${clause(files.get(item.file).description)}; ${formatTokens(files.get(item.file).tokens)}`).join('\n'),
    '## Операции',
    openApiOperationIndex(operations, { tagLink: tag => url(`llms-full/api/${tagSlugs.get(tag)}.txt`) }),
  ].join('\n\n')
}

/**
 * Части раздела: страница первого уровня — своя часть (тип документа), каталог —
 * часть вместе со страницей-корнем (`auth-profile.md` + `auth-profile/*`), каталог
 * второго уровня внутри `contracts` — часть пакета. Часть больше лимита делится по страницам.
 */
function sectionParts(section) {
  const groups = new Map()
  for (const page of section.pages) {
    const key = partKey(section, page.relativePath)
    groups.set(key, [...(groups.get(key) ?? []), page])
  }
  const parts = []
  for (const [key, pages] of groups) {
    const part = makePart(section, key, pages)
    if (pages.length > 1 && estimateTokens(partMarkdown(section, part)) > PART_TOKEN_LIMIT) {
      parts.push(...pages.map(page => makePart(section, `${key}/${path.posix.basename(page.relativePath, '.md')}`, [page])))
    }
    else {
      parts.push(part)
    }
  }
  return parts
}

function partKey(section, relativePath) {
  const root = section.roots.find(value => relativePath.startsWith(`${value}/`)) ?? ''
  const segments = relativePath.slice(root ? root.length + 1 : 0).replace(/\.md$/, '').split('/')
  if (segments[0] === 'contracts') {
    return segments.length > 2 ? `contracts/${segments[1]}` : 'contracts'
  }
  return segments[0]
}

function makePart(section, key, pages) {
  const head = pages.find(page => [`${section.roots[0]}/${key}.md`, `${section.roots[0]}/${key}/index.md`].includes(page.relativePath))
    ?? pages.find(page => /(?:^|\/)(?:index|overview)\.md$/.test(page.relativePath))
    ?? pages[0]
  const title = pages.length > 1 ? head.title.replace(/:\s*обзор$/i, '') : head.title
  return {
    key,
    file: `llms-full/${section.id}/${key}.txt`,
    title,
    description: pages.length > 1 ? `${head.description} Страниц: ${pages.length}.` : head.description,
    pages,
    optional: pages.every(page => isOptionalPage(page.relativePath)),
  }
}

function partMarkdown(section, part) {
  return [
    `# Endge: ${section.title} — ${part.title}`,
    `> ${part.description}`,
    `Часть раздела; оглавление частей: ${url(section.file)}. ${provenanceMarkdown}`,
    '---',
    part.pages.map(pageMarkdown).join('\n\n---\n\n'),
  ].join('\n\n')
}

function sectionIndexMarkdown(section, wholeTokens) {
  return [
    `# Endge: ${section.title} — оглавление частей`,
    `> Раздел целиком — ${formatTokens(wholeTokens)}, больше ориентира части (${formatTokens(PART_TOKEN_LIMIT)}). Поэтому он разбит на ${section.parts.length} ${plural(section.parts.length, 'часть', 'части', 'частей')}: загружайте только нужную. Весь раздел входит в ${url('llms-full.txt')}.`,
    provenanceMarkdown,
    '## Части',
    section.parts.filter(part => !part.optional).map(part => `- [${part.title}](${url(part.file)}): ${clause(part.description)}; ${formatTokens(files.get(part.file)?.tokens ?? estimateTokens(partMarkdown(section, part)))}`).join('\n'),
    '## Optional',
    section.parts.filter(part => part.optional).map(part => `- [${part.title}](${url(part.file)}): ${clause(part.description)}; ${formatTokens(files.get(part.file)?.tokens ?? estimateTokens(partMarkdown(section, part)))}`).join('\n'),
  ].join('\n\n')
}

function repositoriesMarkdown() {
  return [
    '## Исходный код',
    `При расхождении документации и поведения истина — исходники той версии, что развёрнута. Версия backend — \`GET /version\`, версия Configurator — в его интерфейсе. Исходники версии — тег \`v<версия>\` в публичном repository; если тега нет, смотрите \`main\` и учитывайте, что он может быть новее развёрнутого. Подробно: ${url('agents/repositories.md')}.`,
    [
      ...SOURCE_REPOSITORIES.map(([name, link, description]) => `- ${name} (${description}): ${link}`),
      ...CLOSED_SOURCES.map(([name, note]) => `- ${name}: исходники закрыты; ${note}`),
    ].join('\n'),
  ].join('\n\n')
}

function pageMarkdown(page) {
  return [`# ${page.title}`, `Источник: ${url(page.route.replace(/^\//, ''))}`, ...(page.description ? [`> ${page.description}`] : []), page.body].filter(Boolean).join('\n\n')
}

async function readPage(file) {
  const relativePath = path.relative(documentsRoot, file).split(path.sep).join('/')
  const source = await readDocumentation(file, documentsRoot)
  const split = splitFrontmatter(source)
  const meta = split.frontmatter ? parseYaml(split.frontmatter) ?? {} : {}
  const body = split.body
  const route = documentationRoute(relativePath)
  const heading = /^# (\S.*)$/m.exec(body)
  const title = String(meta.title ?? (heading ? stripInline(heading[1]) : relativePath))
  const withoutTitle = heading && !meta.title ? body.replace(heading[0], '') : body
  const manual = normalizeDescription(meta.description)
  if (manual.includes('"')) {
    throw new Error(`description страницы ${relativePath} содержит прямую кавычку: VitePress не экранирует её в <meta>. Используйте «ёлочки».`)
  }
  const description = manual || autoDescription(withoutTitle)
  if (!description) {
    throw new Error(`У страницы ${relativePath} нет описания: добавьте frontmatter description или вводный абзац.`)
  }
  return {
    file,
    relativePath,
    route,
    markdownPath: relativePath,
    title,
    description,
    descriptionSource: manual ? 'manual' : 'auto',
    body: withoutTitle.trim(),
  }
}

/** Внутренние ссылки ведут на Markdown-версии страниц, чтобы агент читал их без HTML. */
function rewriteLinks(markdown, relativePath) {
  const directory = path.posix.dirname(`/${relativePath}`)
  return markdown.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g, (match, image, label, target, title = '') => {
    if (image || /^(?:[a-z][a-z\d+.-]*:|#)/i.test(target)) {
      return match
    }
    const [pathPart, fragment] = target.split('#')
    const absolute = pathPart.startsWith('/') ? pathPart : path.posix.normalize(path.posix.join(directory, pathPart))
    const markdownPath = resolvePagePath(absolute)
    if (!markdownPath) {
      // Файлы из docs/public (примеры JSON и т. п.) и llms-файлы тоже получают адрес сайта.
      const publicFile = absolute.replace(/^\/+/, '')
      if (publicFile && (existsSync(path.join(documentsRoot, 'public', publicFile)) || /^llms(?:-full|-agent)?(?:\/|\.txt$)/.test(publicFile))) {
        return `[${label}](${url(publicFile)}${fragment ? `#${fragment}` : ''}${title})`
      }
      return match
    }
    return `[${label}](${url(markdownPath)}${fragment ? `#${fragment}` : ''}${title})`
  })
}

function resolvePagePath(absolute) {
  const clean = absolute.replace(/\.(?:md|html)$/, '').replace(/\/$/, '')
  for (const candidate of [`${clean}.md`, `${clean}/index.md`]) {
    const relative = candidate.replace(/^\//, '')
    if (known.has(relative)) {
      return relative
    }
  }
  return undefined
}

function url(relativePath) {
  return `${siteURL}/${relativePath}`
}

function sectionOf(relativePath) {
  const root = relativePath.includes('/') ? relativePath.split('/')[0] : ''
  return SECTIONS.find(section => section.roots.includes(root))?.id
}

function isOptionalPage(relativePath) {
  return OPTIONAL_PAGES.some(pattern => pattern.test(relativePath))
}

function comparePages(left, right) {
  const depth = value => value.relativePath.split('/').length
  const index = value => (value.relativePath.endsWith('index.md') ? 0 : 1)
  return depth(left) - depth(right) || index(left) - index(right) || left.relativePath.localeCompare(right.relativePath)
}

function stripInline(value) {
  return value.replace(/\{#[^}]+\}\s*$/, '').replace(/[`*_]/g, '').trim()
}

function plainCell(value) {
  return value.trim()
    .replaceAll('\\|', '|')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&#8203;', '')
    .replaceAll('&amp;', '&')
    .replace(/<a id="[^"]*"><\/a>/g, '')
}

/** Оценка токенов с запасом; формула описана в комментарии модуля. */
function estimateTokens(text) {
  const cyrillic = text.match(/\p{Script=Cyrillic}/gu)?.length ?? 0
  return Math.ceil(cyrillic / TOKEN_ESTIMATE.cyrillicCharactersPerToken + (text.length - cyrillic) / TOKEN_ESTIMATE.otherCharactersPerToken)
}

function formatTokens(value) {
  if (value < 1000) {
    return `≈${Math.max(100, Math.round(value / 100) * 100)} токенов`
  }
  const thousands = value < 10_000 ? (Math.round(value / 100) / 10).toString().replace('.', ',') : String(Math.round(value / 1000))
  return `≈${thousands} тыс. токенов`
}

/** Описание перед «; размер» — без завершающей точки. */
function clause(description) {
  return description.replace(/\.$/, '')
}

function plural(value, one, few, many) {
  const mod10 = value % 10
  const mod100 = value % 100
  if (mod10 === 1 && mod100 !== 11) {
    return one
  }
  return mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? few : many
}

/** Короткий перечень для описания ссылки: первые пункты, пока помещаются в ~140 символов. */
function shortList(items) {
  const result = []
  for (const item of items.map(value => normalizeDescription(value).replace(/\.$/, ''))) {
    if ([...result, item].join('; ').length > 140) {
      return `${result.join('; ')}${result.length ? '; …' : `${item.slice(0, 137)}…`}`
    }
    result.push(item)
  }
  return result.join('; ')
}
