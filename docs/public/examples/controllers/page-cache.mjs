import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import { argument, bundle, loadCore } from './load-core.mjs'
import { startMockAPI } from './mock-api.mjs'

async function main() {
  const { Endge, createDefaultEndgeConfiguration } = await loadCore(argument('--core'))
  const api = await startMockAPI(0)
  const documents = JSON.parse(await readFile(new URL('./workspace.json', import.meta.url), 'utf8'))
  const cache = { key: 'example-pages-v1', storage: 'memory', strategy: 'cache-first', maxAgeMs: 60000, maxEntries: 50, maxBytes: 8388608 }
  for (const query of documents.queries) {
    query.source = query.source.replace('http://127.0.0.1:4182', api.endpoint)
  }
  for (const composition of documents.compositions) {
    composition.source = composition.source.replace('autoLoad:true', 'autoLoad:false').replace('maxLoadedRows:80', 'maxLoadedRows:80,retention:{beforeRows:40,afterRows:80}').replace('output:\'page\'}', `output:'page',cache:${JSON.stringify(cache)}}`)
  }
  documents.compositions.push({ identity: 'cache-sdk-owner', sourceVersion: 1, source: 'defineComposition({runtimes:{}})' })
  const sessions = []
  const wait = async (predicate) => {
    const deadline = Date.now() + 3000
    while (!predicate()) {
      assert.ok(Date.now() < deadline, 'cache operation timed out')
      await new Promise(resolve => setTimeout(resolve, 5))
    }
  }
  try {
    await Endge.boot({ dataProvider: 'bundle', bundleSource: bundle(documents, createDefaultEndgeConfiguration), scope: { workspaceIdentity: 'controllers-example' }, vars: {}, ui: { adapterFallbackIds: [] } })
    assert.deepEqual(Endge.program.getArtifacts().filter(item => item.status === 'error').flatMap(item => item.diagnostics), [])
    const markdown = await readFile(new URL('../../../guides/collection-window-cache.md', import.meta.url), 'utf8')
    const guide = /```ts\n(defineComposition\([\s\S]*?)\n```/.exec(markdown)?.[1]
    assert.ok(guide, 'full guide Composition exists')
    assert.deepEqual(Endge.source.compile('composition', guide).diagnostics.filter(item => item.severity === 'error'), [], 'guide IndexedDB Source compiles as written')
    for (const paging of ['cursor', 'offset', 'graphql']) {
      const session = await Endge.runtime.composition.mount(`window-${paging}`, { id: `cache-${paging}` })
      sessions.push(session)
      const host = session.host.getChild('window')
      await host.command('loadInitial')
      await wait(() => host.getOutput('cacheStatus').entries > 0)
      const requests = api.requests.length
      await host.command('reset')
      await host.command('loadInitial')
      assert.equal(api.requests.length, requests, `${paging} warm hit performs no HTTP`)
      assert.equal(host.getOutput('cacheStatus').source, 'memory')
      const rows = host.getOutput('rows')
      await host.command('clearCache')
      assert.deepEqual(host.getOutput('rows'), rows, 'clearCache preserves active rows')
      await host.command('refresh')
      assert.equal(api.requests.length, requests + 1)
      process.stdout.write(`${paging}: retention + page cache Source/Query/Store/Update PASS\n`)
    }
    const session = await Endge.runtime.composition.mount('cache-sdk-owner', { id: 'cache-sdk-owner' })
    sessions.push(session)
    const storeHost = Endge.runtime.execute(Endge.domain.getStore('window-state'), { parent: session.host, persistence: 'disabled' })
    const host = await Endge.runtime.controllers.mount('endge.collection-window', {
      owner: session.host,
      props: { paging: 'offset', autoLoad: false, request: { filter: 'sdk' }, retention: { beforeRows: 200, afterRows: 400 } },
      dependencies: { state: { store: storeHost, path: 'window', update: 'window-commit' }, load: { query: 'window-page', output: 'page', cache } },
    })
    await host.command('loadInitial')
    await wait(() => host.getOutput('cacheStatus').entries > 0)
    const requests = api.requests.length
    await host.command('reset')
    await host.command('loadInitial')
    assert.equal(api.requests.length, requests)
    await host.dispose()
    process.stdout.write('SDK: real owner + owned Store + memory page cache PASS\n')
  }
  finally {
    for (const session of sessions.reverse()) {
      await session.unmount()
    }
    await Endge.runtime.reset()
    await new Promise(resolve => api.server.close(resolve))
  }
}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
