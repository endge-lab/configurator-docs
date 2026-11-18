import assert from 'node:assert/strict'
import process from 'node:process'
import { argument, bundle, loadCore } from './load-core.mjs'

async function main() {
  const { Endge, createDefaultEndgeConfiguration } = await loadCore(argument('--core'))
  await Endge.boot({ dataProvider: 'bundle', bundleSource: bundle({ compositions: [{ identity: 'example-owner', sourceVersion: 1, source: 'defineComposition({data:{},runtimes:{}})' }] }, createDefaultEndgeConfiguration), scope: { workspaceIdentity: 'controllers-example' }, vars: {}, ui: { adapterFallbackIds: [] } })
  for (const artifact of Endge.program.getArtifacts()) {
    if (artifact.status === 'error') {
      throw new Error(JSON.stringify(artifact.diagnostics))
    }
  }
  // mount() creates and registers a real lifecycle owner before any Controller.
  const session = await Endge.runtime.composition.mount('example-owner', { id: 'counter-owner' })
  const removeDefinition = Endge.runtime.controllers.define({
    identity: 'example.counter',
    displayName: 'Counter',
    origin: { kind: 'local', owner: 'example' },
    catalogPath: ['Examples'],
    defaultProviderKey: 'example.counter.default',
    contract: { props: [{ key: 'initial', type: 'Number', array: false, optional: true, defaultValue: { type: 'literal', value: 0 } }], outputs: [{ key: 'count', type: 'Number', array: false, optional: false }], commands: { increment: {}, delayed: {} }, dependencies: {} },
  })
  const removeProvider = Endge.runtime.controllers.provide({
    identity: 'example.counter',
    key: 'example.counter.default',
    create() {
      let count = 0
      return {
        start(context) {
          count = Number(context.props.initial)
          context.publish({ count })
        },
        setProps(props, context) {
          count = Number(props.initial)
          context.publish({ count })
        },
        async command(name, _input, context) {
          // Capture THIS operation context; never retain the factory context.
          if (name === 'delayed') {
            await new Promise(resolve => setTimeout(resolve, 50))
          }
          if (context.signal.aborted) {
            throw new DOMException('Canceled', 'AbortError')
          }
          context.publish({ count: ++count })
          return count
        },
        pause() { },
        resume(context) { context.publish({ count }) },
        destroy() { },
      }
    },
  })
  let a, b
  try {
    a = await Endge.runtime.controllers.mount('example.counter', { owner: session.host, props: { initial: 2 } })
    b = await Endge.runtime.controllers.mount('example.counter', { owner: session.host.id, props: { initial: 10 } })
    await a.command('increment')
    assert.equal(a.getOutput('count'), 3)
    assert.equal(b.getOutput('count'), 10)
    const pending = a.command('delayed').then(() => null, error => error)
    await a.setProps({ initial: 20 })
    assert.equal((await pending)?.name, 'AbortError')
    assert.equal(a.getOutput('count'), 20)
    await a.pause()
    await assert.rejects(a.command('increment'), { name: 'AbortError' })
    await a.resume()
    await a.command('increment')
    assert.equal(a.getOutput('count'), 21)
    await assert.rejects(a.command('missing'), /controller-command-missing/)
    assert.throws(removeProvider, /controller-provider-in-use/)
    process.stdout.write('SDK/provider: PASS; registered owner, isolated instances, props, stale completion, pause/resume, command validation, leases' + '\n')
  }
  finally {
    if (a) {
      await a.dispose()
    }
    if (b) {
      await b.dispose()
    }
    await session.unmount()
    removeProvider()
    removeDefinition()
    await Endge.runtime.reset()
  }
}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
