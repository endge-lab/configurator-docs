import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import { argument, bundle, loadCore } from './load-core.mjs'
import { startMockAPI } from './mock-api.mjs'

async function main() {
  const { Endge, createDefaultEndgeConfiguration } = await loadCore(argument('--core'))
  // With --endpoint, reuse a running fixture API. Otherwise own an ephemeral local API.
  const api = argument('--endpoint') ? null : await startMockAPI(0)
  const endpoint = argument('--endpoint') ?? api.endpoint
  const documents = JSON.parse(await readFile(new URL('./workspace.json', import.meta.url), 'utf8'))
  // Public recipe loads on mount. This deterministic harness controls initial demand.
  for (const composition of documents.compositions) {
    composition.source = composition.source.replace('autoLoad:true', 'autoLoad:false')
  }
  for (const query of documents.queries) {
    query.source = query.source.replace('http://127.0.0.1:4182', endpoint)
  }
  const sessions = []
  try {
    await Endge.boot({ dataProvider: 'bundle', bundleSource: bundle(documents, createDefaultEndgeConfiguration), scope: { workspaceIdentity: 'controllers-example' }, vars: {}, ui: { adapterFallbackIds: [] } })
    const errors = Endge.program.getArtifacts().filter(item => item.status === 'error')
    assert.deepEqual(errors, [], 'all Source artifacts must link')
    for (const paging of ['cursor', 'offset', ...(api ? ['graphql'] : [])]) {
      const session = await Endge.runtime.composition.mount(`window-${paging}`, { id: `example-${paging}` })
      sessions.push(session)
      const window = session.host.getChild('window')
      const state = () => session.host.getDataSnapshot().state.window
      await window.command('loadInitial')
      assert.equal(window.getOutput('loadedRowCount'), 40)
      assert.equal(window.getOutput('rows')[0].id, '100')
      await window.command('retainRows', { keys: ['100'] })
      await window.command('loadAfter')
      await window.command('loadAfter')
      let rows = window.getOutput('rows')
      await window.command('setViewport', { rowsRevision: window.getOutput('rowsRevision'), firstVisible: { key: rows[90].id, index: 90 }, lastVisible: { key: rows[95].id, index: 95 }, rowCount: rows.length, reason: 'scroll' })
      assert.equal(window.getOutput('overLimit'), true)
      await window.command('releaseRows', { keys: ['100'] })
      assert.ok(window.getOutput('loadedRowCount') <= 80)
      await window.setProps({ prefetchRows: 0, maxLoadedRows: 160 })
      rows = window.getOutput('rows')
      await window.command('setViewport', { rowsRevision: window.getOutput('rowsRevision'), firstVisible: { key: rows[0].id, index: 0 }, lastVisible: { key: rows[5].id, index: 5 }, rowCount: rows.length, reason: 'position' })
      const first = Number(rows[0].id)
      await window.command('loadBefore')
      assert.ok(Number(window.getOutput('rows')[0].id) < first)
      // Reset on input change, recover an error, and reject a late generation.
      await window.setProps({ request: { filter: 'new', fail: true } })
      await window.command('loadInitial')
      assert.ok(window.getOutput('error'))
      if (api) {
        api.setFailureMode(false) // Simulate service recovery without changing Controller props.
      }
      await window.command('retry')
      if (api) {
        assert.equal(window.getOutput('error'), null)
        assert.equal(window.getOutput('loadedRowCount'), 40)
        api.setFailureMode(true)
      }
      else {
        assert.ok(window.getOutput('error'), 'external fixture still intentionally fails')
      }
      await window.setProps({ request: { filter: 'new' } })
      await window.command('loadInitial')
      assert.equal(window.getOutput('error'), null)
      await window.setProps({ request: { filter: 'old', delay: 100 } })
      const pending = window.command('loadInitial').then(() => null, error => error)
      await new Promise(resolve => setTimeout(resolve, 10))
      await window.setProps({ request: { filter: 'current' }, autoLoad: true })
      assert.equal((await pending)?.name, 'AbortError')
      assert.equal(window.getOutput('loadedRowCount'), 40)
      assert.ok(window.getOutput('rows').every(row => row.label.startsWith('current ')))
      assert.ok(state().revision > 0)
      process.stdout.write(`${paging}: Source -> Program -> Runtime PASS; before/after, trim/retain, error, cancellation, Store revision=${state().revision}` + '\n')
    }
    assert.notEqual(sessions[0].host.getChild('window').id, sessions[1].host.getChild('window').id)
  }
  finally {
    for (const session of sessions.reverse()) {
      await session.unmount()
    }
    await Endge.runtime.reset()
    if (api) {
      await new Promise(resolve => api.server.close(resolve))
    }
  }
}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
