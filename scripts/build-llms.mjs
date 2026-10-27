/**
 * Собирает документацию Endge для языковых моделей рядом со сборкой VitePress:
 * llms.txt (оглавление), llms-full.txt (всё одним файлом), llms-full/<раздел>.txt,
 * llms-full/api.txt (полный HTTP API Service Backend из OpenAPI) и Markdown-версию
 * каждой страницы.
 *
 * Переменные окружения:
 * - ENDGE_DOCS_URL — публичный адрес сайта для абсолютных ссылок;
 * - ENDGE_OPENAPI_PATH — путь к openapi3.yaml Service Backend;
 * - ENDGE_OPENAPI_URL — адрес спецификации, если файла нет локально;
 * - ENDGE_LLMS_OUTPUT — каталог результата (по умолчанию docs/.vitepress/dist).
 */
import { Buffer } from 'node:buffer'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'
import { openApiMarkdown } from './openapi-markdown.mjs'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const documentsRoot = path.join(repositoryRoot, 'docs')
const outputRoot = path.resolve(process.env.ENDGE_LLMS_OUTPUT ?? path.join(documentsRoot, '.vitepress', 'dist'))
const siteURL = (process.env.ENDGE_DOCS_URL ?? '').replace(/\/+$/, '')
const OPENAPI_PUBLIC_URL = 'https://github.com/endge-lab/service-backend/blob/main/docs/openapi3.yaml'
const OPENAPI_RAW_URL = 'https://raw.githubusercontent.com/endge-lab/service-backend/main/docs/openapi3.yaml'
const openApiPath = process.env.ENDGE_OPENAPI_PATH
  ?? path.resolve(repositoryRoot, '../../../services/egorkozelskij-endge-service-backend/docs/openapi3.yaml')

/** Порядок разделов: агенту сначала нужен способ подключения, затем модель продукта. */
const SECTIONS = [
  { id: 'agents', title: 'ИИ-агентам: подключение и работа через API', roots: ['agents'] },
  { id: 'product', title: 'О продукте', roots: ['', 'product'] },
  { id: 'start', title: 'Начало работы и Configurator', roots: ['getting-started', 'configurator'] },
  { id: 'domain', title: 'Домен Endge', roots: ['domain'] },
  { id: 'reference', title: 'Справочник документов и Source', roots: ['reference'] },
  { id: 'guides', title: 'Руководства', roots: ['guides', 'guide', 'sfc-tables', 'cookbook'] },
  { id: 'advanced', title: 'Архитектура, Federation и Core', roots: ['advanced', 'federation', 'core', 'architecture'] },
  { id: 'raph', title: 'Raph', roots: ['raph'] },
  { id: 'services', title: 'Сервисы', roots: ['services'] },
  { id: 'tools', title: 'Инструменты', roots: ['tools'] },
]
/** Планы проекта остаются внутренними, как и в Knowledge Bundle. */
const EXCLUDED_ROOTS = new Set(['project'])

const SOURCE_REPOSITORIES = [
  ['Service Backend (Go, REST API)', 'https://github.com/endge-lab/service-backend'],
  ['Configurator (Vue)', 'https://github.com/endge-lab/configurator'],
  ['@endge/core: домен, компиляторы Source, runtime', 'https://github.com/endge-lab/core'],
  ['@endge/ui-vue', 'https://github.com/endge-lab/ui-vue'],
  ['@endge/utils', 'https://github.com/endge-lab/utils'],
  ['@endge/computation-sandbox', 'https://github.com/endge-lab/computation-sandbox'],
  ['service-kit-go', 'https://github.com/endge-lab/service-kit-go'],
  ['Документация (эта)', 'https://github.com/endge-lab/configurator-docs'],
]

const packageManifest = JSON.parse(await readFile(path.join(repositoryRoot, 'package.json'), 'utf8'))
const raw = (await Promise.all((await collectMarkdownFiles(documentsRoot)).map(readPage)))
  .filter(page => !EXCLUDED_ROOTS.has(page.relativePath.split('/')[0]))
const known = new Set(raw.map(page => page.relativePath))
const loaded = raw.map(page => ({ ...page, body: rewriteLinks(page.body, page.relativePath) }))

const sections = SECTIONS.map(section => ({
  ...section,
  pages: loaded
    .filter(page => sectionOf(page.relativePath) === section.id)
    .sort(comparePages),
}))
const unassigned = loaded.filter(page => !SECTIONS.some(section => section.id === sectionOf(page.relativePath)))
if (unassigned.length) {
  sections.push({ id: 'other', title: 'Прочее', pages: unassigned.sort(comparePages) })
}

const spec = await loadOpenApi()
const api = openApiMarkdown(spec, { specUrl: OPENAPI_PUBLIC_URL })

const files = new Map()
for (const page of loaded) {
  files.set(page.markdownPath, `${pageMarkdown(page)}\n`)
}
files.set('llms-full/api.txt', api)
for (const section of sections.filter(value => value.pages.length)) {
  files.set(
    `llms-full/${section.id}.txt`,
    `# Endge: ${section.title}\n\n${section.pages.map(pageMarkdown).join('\n\n---\n\n')}\n`,
  )
}
files.set('llms.txt', indexMarkdown())
files.set('llms-full.txt', [
  `# Endge ${packageManifest.version}: полная документация для языковых моделей`,
  '> Документация платформы Endge и конфигуратора, руководство для ИИ-агентов и полный HTTP API Service Backend.',
  repositoriesMarkdown(),
  '---',
  sections.filter(value => value.pages.length).map(section => section.pages.map(pageMarkdown).join('\n\n---\n\n')).join('\n\n---\n\n'),
  '---',
  api,
].join('\n\n'))

for (const [file, content] of files) {
  const target = path.join(outputRoot, file)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, content.endsWith('\n') ? content : `${content}\n`, 'utf8')
}
const fullSize = Buffer.byteLength(files.get('llms-full.txt'))
console.log(`LLM docs: ${loaded.length} страниц, ${spec.paths ? Object.keys(spec.paths).length : 0} путей API, llms-full.txt ${Math.round(fullSize / 1024)} КБ`)
console.log(outputRoot)

function indexMarkdown() {
  const lines = [
    '# Endge',
    '> Платформа для сборки конфигурации приложений: Configurator, Service Backend (REST API) и runtime. Документация на русском.',
    `Начните с руководства для агентов: ${url('agents/index.md')}. В нём описаны вход от имени пользователя (OIDC, device flow, пароль), workspace, чтение и изменение документов, revisions и коммиты.`,
    [
      `- [Всё одним файлом](${url('llms-full.txt')}): руководство, вся документация и полный API`,
      `- [Полный HTTP API Service Backend](${url('llms-full/api.txt')}): ${Object.keys(spec.paths ?? {}).length} путей, все операции, параметры, ответы и схемы`,
      `- [OpenAPI 3 спецификация](${OPENAPI_PUBLIC_URL})`,
    ].join('\n'),
    repositoriesMarkdown(),
  ]
  for (const section of sections.filter(value => value.pages.length)) {
    lines.push(`## ${section.title}`)
    lines.push([
      `- [Весь раздел одним файлом](${url(`llms-full/${section.id}.txt`)})`,
      ...section.pages.map(page => `- [${page.title}](${url(page.markdownPath)})${page.description ? `: ${page.description}` : ''}`),
    ].join('\n'))
  }
  return `${lines.join('\n\n')}\n`
}

function repositoriesMarkdown() {
  return `## Исходный код\n\n${SOURCE_REPOSITORIES.map(([name, link]) => `- ${name}: ${link}`).join('\n')}`
}

function pageMarkdown(page) {
  return [`# ${page.title}`, `Источник: ${url(page.route.replace(/^\//, ''))}`, ...(page.description ? [`> ${page.description}`] : []), page.body].filter(Boolean).join('\n\n')
}

async function readPage(file) {
  const relativePath = path.relative(documentsRoot, file).split(path.sep).join('/')
  const source = await readFile(file, 'utf8')
  const { meta, body } = frontmatter(source)
  const route = `/${relativePath.replace(/(?:^|\/)index\.md$/, '').replace(/\.md$/, '')}`.replace(/\/$/, '') || '/'
  const heading = /^# (\S.*)$/m.exec(body)
  const title = String(meta.title ?? (heading ? stripInline(heading[1]) : relativePath))
  const withoutTitle = heading && !meta.title ? body.replace(heading[0], '') : body
  return {
    file,
    relativePath,
    route: route === '/' ? '/' : `${route}${relativePath.endsWith('index.md') ? '/' : ''}`,
    markdownPath: relativePath,
    title,
    description: meta.description ? String(meta.description).replace(/\s+/g, ' ').trim() : '',
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
      // Файлы из docs/public (примеры JSON и т. п.) тоже получают адрес сайта.
      const publicFile = absolute.replace(/^\/+/, '')
      if (publicFile && existsSync(path.join(documentsRoot, 'public', publicFile))) {
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

function comparePages(left, right) {
  const depth = value => value.relativePath.split('/').length
  const index = value => (value.relativePath.endsWith('index.md') ? 0 : 1)
  return depth(left) - depth(right) || index(left) - index(right) || left.relativePath.localeCompare(right.relativePath)
}

function frontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source)
  if (!match) {
    return { meta: {}, body: source }
  }
  return { meta: parseYaml(match[1]) ?? {}, body: source.slice(match[0].length) }
}

function stripInline(value) {
  return value.replace(/\{#[^}]+\}\s*$/, '').replace(/[`*_]/g, '').trim()
}

async function loadOpenApi() {
  if (existsSync(openApiPath)) {
    return parseYaml(await readFile(openApiPath, 'utf8'))
  }
  const source = process.env.ENDGE_OPENAPI_URL ?? OPENAPI_RAW_URL
  const response = await fetch(source)
  if (!response.ok) {
    throw new Error(`Не удалось получить OpenAPI: ${source} → ${response.status}. Задайте ENDGE_OPENAPI_PATH.`)
  }
  return parseYaml(await response.text())
}

async function collectMarkdownFiles(root) {
  const result = []
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const entryPath = path.join(root, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'public') {
      result.push(...await collectMarkdownFiles(entryPath))
    }
    else if (entry.isFile() && entry.name.endsWith('.md')) {
      result.push(entryPath)
    }
  }
  return result
}
