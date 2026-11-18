import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
// --core names the actual locally built пакет Core, not a registry tag.
export async function loadCore(directory) {
  if (!directory) {
    throw new Error('Pass --core <built @endge/core directory>')
  }
  const base = path.resolve(directory)
  const pkg = JSON.parse(await readFile(path.join(base, 'package.json'), 'utf8'))
  if (pkg.name !== '@endge/core' || pkg.version !== '1.2.0-dev.15') {
    throw new Error('This example requires @endge/core 1.2.0-dev.15')
  }
  const entry = pathToFileURL(path.join(base, pkg.exports['.'].import)).href
  const require = createRequire(entry)
  const raphManifest = require.resolve.paths('@raphy-js/raph').map(base => path.join(base, '@raphy-js/raph/package.json')).find(existsSync)
  const raphPackage = JSON.parse(await readFile(raphManifest, 'utf8'))
  const raphImport = raphPackage.exports['.'].import
  const { Raph } = await import(pathToFileURL(path.join(path.dirname(raphManifest), typeof raphImport === 'string' ? raphImport : raphImport.default)).href)
  const { Endge, createDefaultEndgeConfiguration } = await import(entry)
  if (!Raph.configured) {
    Raph.configure({ mode: 'runtime' })
  }
  Endge.context.configurePersistence({ context: 'disabled' })
  return { Endge, createDefaultEndgeConfiguration, Raph }
}
export function argument(name) {
  const index = process.argv.indexOf(name)
  return index < 0 ? undefined : process.argv[index + 1]
}
export function bundle(documents, createDefaultEndgeConfiguration) {
  const collections = ['facets', 'facet-documents', 'folders', 'types', 'queries', 'data-views', 'compositions', 'stores', 'streams', 'simulations', 'updates', 'mocks', 'components', 'actions', 'filters', 'converters', 'computations', 'vocabs', 'i18n-bundles', 'auth-profiles', 'navigations', 'styles', 'configurations']
  return { kind: 'workspace-snapshot', schemaVersion: 5, workspace: { identity: 'controllers-example', displayName: 'Controllers example', startupCompositionIdentity: null, dataMode: 'production', managedBy: 'user', managedById: null, meta: {}, configuration: createDefaultEndgeConfiguration() }, installedIntegrations: [], documents: { ...Object.fromEntries(collections.map(key => [key, []])), ...documents } }
}
