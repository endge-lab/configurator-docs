import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { documentationFingerprint, documentationRoute, markdownSections, publicMarkdownFiles, readDocumentation } from './documentation-catalog.mjs'
import { loadOpenApi, OPENAPI_PUBLIC_URL } from './load-openapi.mjs'
import { openApiMarkdown } from './openapi-markdown.mjs'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryRoot = path.resolve(scriptDirectory, '..')
const documentsRoot = path.join(repositoryRoot, 'docs')
const outputRoot = path.resolve(
  process.env.ENDGE_KNOWLEDGE_OUTPUT ?? path.join(repositoryRoot, 'dist', 'knowledge'),
)
const packageManifest = JSON.parse(await readFile(path.join(repositoryRoot, 'package.json'), 'utf8'))

const maximumChunkCharacters = 6_000
const documentPaths = await publicMarkdownFiles(documentsRoot)

const chunks = []
for (const documentPath of documentPaths) {
  const source = await readDocumentation(documentPath, documentsRoot)
  const relativePath = normalizePath(path.relative(documentsRoot, documentPath))
  chunks.push(...chunkDocument(relativePath, source))
}

const { spec, origin: openApiOrigin, sha256: openApiSha256 } = await loadOpenApi(repositoryRoot)
chunks.push(...chunkDocument('generated/service-backend-api.md', openApiMarkdown(spec, { specUrl: OPENAPI_PUBLIC_URL }))
  .map(chunk => ({ ...chunk, documentPath: '/llms-full/api.txt' })))

const documentsJSONL = `${chunks.map(chunk => JSON.stringify(chunk)).join('\n')}\n`
const documentsChecksum = createHash('sha256').update(documentsJSONL).digest('hex')
const bundleId = `endge-docs-${packageManifest.version}`
const contractManifest = await readFile(path.join(documentsRoot, 'public/contracts-manifest.json'), 'utf8')
const manifest = {
  schemaVersion: 'endge-knowledge/v1',
  bundleId,
  version: packageManifest.version,
  sourceCommit: process.env.CI_COMMIT_SHA ?? 'local',
  documentationSha256: await documentationFingerprint(documentPaths, documentsRoot),
  contractManifest: 'contracts-manifest.json',
  contractsSha256: createHash('sha256').update(contractManifest).digest('hex'),
  markdownDocumentCount: documentPaths.length,
  openApiOrigin,
  openApiSha256,
  documentCount: new Set(chunks.map(chunk => chunk.documentPath)).size,
  chunkCount: chunks.length,
  documentsFile: 'documents.jsonl',
  documentsSha256: documentsChecksum,
}

await mkdir(outputRoot, { recursive: true })
await writeFile(path.join(outputRoot, 'documents.jsonl'), documentsJSONL, 'utf8')
await writeFile(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

await writeFile(path.join(outputRoot, 'contracts-manifest.json'), contractManifest, 'utf8')

console.log(`Knowledge bundle ${bundleId}: ${manifest.documentCount} documents, ${manifest.chunkCount} chunks`)
console.log(outputRoot)

function chunkDocument(relativePath, source) {
  const sections = markdownSections(stripFrontmatter(source))
  const title = sections.find(section => section.headingPath.length)?.headingPath[0] ?? relativePath.replace(/\.md$/, '')

  const documentPath = documentationRoute(relativePath)
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
    const fenceMatch = /^ {0,3}(`{3,}|~{3,})/.exec(line)
    if (fenceMatch) {
      if (!fence) {
        fence = { character: fenceMatch[1][0], length: fenceMatch[1].length }
      }
      else if (fenceMatch[1][0] === fence.character && fenceMatch[1].length >= fence.length && !line.slice(fenceMatch[0].length).trim()) {
        fence = null
      }
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

function normalizePath(value) {
  return value.split(path.sep).join('/')
}
