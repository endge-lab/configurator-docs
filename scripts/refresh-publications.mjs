/** Явная read-only сверка npm; обычная сборка Docs не требует сети registry. */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = path.join(root, 'docs/public/contracts-manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const checkedAt = new Date().toISOString()

// Сохраняем результат только после успешной проверки всех exact versions.
for (const entry of manifest.packages) {
  const registryUrl = `https://registry.npmjs.org/${encodeURIComponent(entry.name)}`
  const response = await fetch(registryUrl, { signal: AbortSignal.timeout(30_000) })
  if (!response.ok) {
    throw new Error(`${entry.name}: npm HTTP ${response.status}`)
  }
  const metadata = await response.json()
  const published = metadata.versions?.[entry.version]
  if (!published?.dist?.integrity || !published.dist.tarball) {
    throw new Error(`${entry.name}@${entry.version}: exact publication с integrity не найдена`)
  }
  const publication = {
    checkedAt,
    version: published.version,
    registryUrl: `${registryUrl}/${encodeURIComponent(entry.version)}`,
    integrity: published.dist.integrity,
    tarball: published.dist.tarball,
    observedDistTags: metadata['dist-tags'],
    ...(published.gitHead ? { gitHead: published.gitHead } : {}),
  }
  // gitHead закрытого repository тоже может быть в npm, но публичным URL не является.
  if (entry.repository.startsWith('https://github.com/') && published.gitHead) {
    const repository = entry.repository.slice('https://github.com/'.length)
    const rawUrl = `https://raw.githubusercontent.com/${repository}/${published.gitHead}/package.json`
    const source = await fetch(rawUrl, { signal: AbortSignal.timeout(30_000) })
    if (!source.ok) {
      throw new Error(`${entry.name}: публичный npm gitHead недоступен (HTTP ${source.status})`)
    }
    const pkg = await source.json()
    if (pkg.name !== entry.name || pkg.version !== entry.version) {
      throw new Error(`${entry.name}: package.json публичного gitHead не совпадает с npm`)
    }
    publication.sourceUrl = `${entry.repository}/tree/${published.gitHead}`
  }
  entry.publication = publication
  entry.revisionScope = 'source-checkout'
  console.log(`${entry.name}@${entry.version}: npm integrity и ${publication.sourceUrl ? 'public gitHead' : 'registry'} проверены`)
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
