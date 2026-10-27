import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { EXCLUDED_ROOTS as EXCLUDED_ROOT_LIST } from './documentation-pages.mjs'

/** Один публичный состав для llms, Knowledge Bundle и Markdown-версий страниц. */
export const EXCLUDED_ROOTS = new Set(EXCLUDED_ROOT_LIST)

export function documentationRoute(file) {
  const index = /(?:^|\/)index\.md$/.test(file)
  const route = `/${file.replace(/(?:^|\/)index\.md$/, '').replace(/\.md$/, '')}`
  return index && route !== '/' ? `${route}/` : route
}

export async function publicMarkdownFiles(root) {
  const result = []
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const target = path.join(root, entry.name)
    if (entry.name.startsWith('.') || entry.name === 'public' || EXCLUDED_ROOTS.has(entry.name)) {
      continue
    }
    if (entry.isDirectory()) {
      result.push(...await publicMarkdownFiles(target))
    }
    else if (entry.isFile() && entry.name.endsWith('.md')) {
      result.push(target)
    }
  }
  return result.sort()
}

export async function documentationFingerprint(files, root) {
  const hash = createHash('sha256')
  for (const file of [...files].sort()) {
    hash.update(path.relative(root, file).split(path.sep).join('/'))
    hash.update('\0')
    hash.update(await readFile(file))
    hash.update('\0')
  }
  return hash.digest('hex')
}

/** Разворачивает используемые сайтом Markdown includes и именованные regions. */
export async function readDocumentation(file, root, ancestors = []) {
  if (ancestors.includes(file)) {
    throw new Error('Циклический Markdown include.')
  }
  const source = await readFile(file, 'utf8')
  const include = /<!--\s*@include:([^>]+)-->/g
  let result = ''
  let offset = 0
  for (const match of source.matchAll(include)) {
    const [target, region] = match[1].trim().split('#')
    const resolved = path.resolve(target.startsWith('/') ? root : path.dirname(file), target.replace(/^\//, ''))
    const relative = path.relative(root, resolved)
    if (relative.startsWith('..') || relative.split(path.sep).some(part => part.startsWith('.') || EXCLUDED_ROOTS.has(part))) {
      throw new Error('Markdown include выходит за пределы публичной документации.')
    }
    let content = await readDocumentation(resolved, root, [...ancestors, file])
    if (region) {
      const lines = content.split(/\r?\n/)
      const start = lines.findIndex(line => line.trim() === `<!-- #region ${region} -->`)
      const end = lines.findIndex((line, index) => index > start && line.trim() === `<!-- #endregion ${region} -->`)
      if (start < 0 || end < 0) {
        throw new Error(`Не найден Markdown region ${region}`)
      }
      content = lines.slice(start + 1, end).join('\n')
    }
    result += source.slice(offset, match.index) + content
    offset = match.index + match[0].length
  }
  return result + source.slice(offset)
}

/** Заголовки внутри fenced code остаются частью примера. */
export function markdownSections(source) {
  const sections = []
  let headings = []
  let content = []
  let fence = null
  const flush = () => {
    const body = content.join('\n').trim()
    if (body) {
      sections.push({ headingPath: [...headings], body })
    }
    content = []
  }
  for (const line of source.split(/\r?\n/)) {
    const marker = /^ {0,3}(`{3,}|~{3,})/.exec(line)
    if (marker) {
      if (!fence) {
        fence = { character: marker[1][0], length: marker[1].length }
      }
      else if (marker[1][0] === fence.character && marker[1].length >= fence.length && !line.slice(marker[0].length).trim()) {
        fence = null
      }
      content.push(line)
      continue
    }
    const heading = !fence && /^(#{1,6})[ \t]+(\S.*)$/.exec(line)
    if (!heading) {
      content.push(line)
      continue
    }
    flush()
    const level = heading[1].length
    headings = [...headings.slice(0, level - 1), heading[2].replace(/\{#[^}]+\}\s*$/, '').trim()]
  }
  flush()
  return sections
}
