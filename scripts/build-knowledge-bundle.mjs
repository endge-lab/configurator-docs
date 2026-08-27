import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryRoot = path.resolve(scriptDirectory, '..')
const documentsRoot = path.join(repositoryRoot, 'docs')
const outputRoot = path.resolve(
  process.env.ENDGE_KNOWLEDGE_OUTPUT ?? path.join(repositoryRoot, 'dist', 'knowledge'),
)
const packageManifest = JSON.parse(await readFile(path.join(repositoryRoot, 'package.json'), 'utf8'))

const includedRoots = new Set([
  'configurator',
  'domain',
  'getting-started',
  'guides',
  'nova',
  'reference',
  'sfc-tables',
])
const maximumChunkCharacters = 6_000

const documentPaths = (await collectMarkdownFiles(documentsRoot))
  .filter(isPublicDocument)
  .sort((left, right) => left.localeCompare(right))

const chunks = []
for (const documentPath of documentPaths) {
  const source = await readFile(documentPath, 'utf8')
  const relativePath = normalizePath(path.relative(documentsRoot, documentPath))
  chunks.push(...chunkDocument(relativePath, source))
}

const documentsJSONL = chunks.map(chunk => JSON.stringify(chunk)).join('\n') + '\n'
const documentsChecksum = createHash('sha256').update(documentsJSONL).digest('hex')
const bundleId = `endge-docs-${packageManifest.version}`
const manifest = {
  schemaVersion: 'endge-knowledge/v1',
  bundleId,
  version: packageManifest.version,
  sourceCommit: process.env.CI_COMMIT_SHA ?? 'local',
  documentCount: new Set(chunks.map(chunk => chunk.documentPath)).size,
  chunkCount: chunks.length,
  documentsFile: 'documents.jsonl',
  documentsSha256: documentsChecksum,
}

await mkdir(outputRoot, { recursive: true })
await writeFile(path.join(outputRoot, 'documents.jsonl'), documentsJSONL, 'utf8')
await writeFile(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

console.log(`Knowledge bundle ${bundleId}: ${manifest.documentCount} documents, ${manifest.chunkCount} chunks`)
console.log(outputRoot)

async function collectMarkdownFiles(root) {
  const result = []
  const entries = await readdir(root, { withFileTypes: true })
  for (const entry of entries) {
    const entryPath = path.join(root, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== '.vitepress') {
        result.push(...await collectMarkdownFiles(entryPath))
      }
    }
    else if (entry.isFile() && entry.name.endsWith('.md')) {
      result.push(entryPath)
    }
  }
  return result
}

function isPublicDocument(documentPath) {
  const relativePath = normalizePath(path.relative(documentsRoot, documentPath))
  if (relativePath === 'index.md') {
    return true
  }
  return includedRoots.has(relativePath.split('/')[0])
}

function chunkDocument(relativePath, source) {
  const lines = stripFrontmatter(source).split(/\r?\n/)
  const sections = []
  let title = relativePath.replace(/\.md$/, '')
  let headingPath = []
  let content = []

  const flush = () => {
    const body = content.join('\n').trim()
    if (body !== '') {
      sections.push({ headingPath: [...headingPath], body })
    }
    content = []
  }

  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/)
    if (!heading) {
      content.push(line)
      continue
    }

    flush()
    const level = heading[1].length
    const value = stripInlineMarkdown(heading[2])
    if (level === 1) {
      title = value
    }
    headingPath = [...headingPath.slice(0, Math.max(0, level - 1)), value]
  }
  flush()

  const documentPath = `/${relativePath.replace(/(?:\/index)?\.md$/, '')}`
  const result = []
  let ordinal = 0
  for (const section of sections) {
    for (const part of splitSection(section.body)) {
      ordinal += 1
      const heading = section.headingPath.join(' > ') || title
      const stableKey = `${relativePath}\n${heading}\n${ordinal}`
      result.push({
        id: createHash('sha256').update(stableKey).digest('hex').slice(0, 24),
        documentPath,
        sourceFile: relativePath,
        title,
        heading,
        ordinal,
        content: part,
      })
    }
  }
  return result
}

function splitSection(content) {
  if (content.length <= maximumChunkCharacters) {
    return [content]
  }

  const blocks = markdownBlocks(content)
  const parts = []
  let current = ''
  for (const block of blocks) {
    const candidate = current === '' ? block : `${current}\n\n${block}`
    if (current !== '' && candidate.length > maximumChunkCharacters) {
      parts.push(current)
      current = block
    }
    else {
      current = candidate
    }
  }
  if (current !== '') {
    parts.push(current)
  }
  return parts
}

function markdownBlocks(content) {
  const blocks = []
  let current = []
  let fence = null
  for (const line of content.split(/\r?\n/)) {
    const fenceMatch = line.match(/^\s*(```|~~~)/)
    if (fenceMatch) {
      fence = fence === null ? fenceMatch[1] : null
    }
    if (line.trim() === '' && fence === null) {
      if (current.length > 0) {
        blocks.push(current.join('\n').trim())
        current = []
      }
      continue
    }
    current.push(line)
  }
  if (current.length > 0) {
    blocks.push(current.join('\n').trim())
  }
  return blocks.filter(Boolean)
}

function stripFrontmatter(source) {
  if (!source.startsWith('---\n') && !source.startsWith('---\r\n')) {
    return source
  }
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
}

function stripInlineMarkdown(value) {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .trim()
}

function normalizePath(value) {
  return value.split(path.sep).join('/')
}
