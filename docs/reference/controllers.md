---
description: "Controllers: code-owned definitions, providers, Source и SDK; lifecycle, generation contexts, зависимости, ошибки и execution bundles."
---

# Controllers

Controller — runtime-узел для длительной координации с props, outputs и именованными commands. Он связывает существующие владельцы данных и эффектов: Store хранит состояние, Update атомарно меняет его, Query выполняет транспорт. Встроенный `endge.collection-window` управляет двунаправленным окном коллекции: [полный рецепт](/guides/collection-window).

Для этого руководства используйте `@endge/core@1.2.0-dev.15`, `@endge/ui-vue@2.0.0-dev.14` и Configurator `2.15.0`. Для установки указывайте точные версии пакетов.

## Definition, provider, instance

| Слой | Контракт и владелец |
| --- | --- |
| Definition | Сериализуемая code-owned декларация: identity, displayName, origin, catalogPath?, defaultProviderKey и contract |
| Provider | Код host-приложения: `{identity,key,create(context)}` возвращает instance. Функции не хранятся в Domain/Bundle |
| Instance | Отдельный `ControllerRuntimeHost` с lifecycle parent, props, outputs, commands и resources |

`contract.props` и `outputs` — массивы `SourceFieldDefinition` (key, type, array, optional, defaultValue?). `commands` — named record с optional input/output field contracts. `dependencies` — named record `{kind:'store'|'query',optional?:boolean}`. Definition не содержит JavaScript. `define(...)` и `provide(...)` возвращают unregister-функции; collisions и unregister при активных instances завершаются явной ошибкой. Hot replacement не предусмотрен.

В редакторе Composition Source Configurator подсказывает доступные определения и их контракты. Подключённый экземпляр виден в Runtime Preview, где можно посмотреть provider, props, зависимости и outputs. Определения могут прийти из Program Bundle, даже если локальный provider отсутствует. Тогда metadata читается, а mount явно сообщает `controller-provider-missing`. Визуального конструктора connections и редактора произвольного Controller-кода нет.

Controller **не является persisted Domain document**. Нет `POST /api/v1/controllers`, `defineController(...)` или корневого поля `windows`. Code-defined providers регистрирует разработчик host-приложения, а Source только выбирает известную identity.

## Source в Composition

```ts
defineComposition({
  data: { state: store('window-state').isolated() },
  runtimes: {
    window: controller('endge.collection-window')
      .withProps({ paging: 'cursor', batchSize: 40 })
      .withDependencies({
        state: { store: data('state'), path: 'window', update: 'window-commit' },
        load: { query: 'window-page', output: 'page' },
      }),
    screen: component('window-table').withProps({
      rows: fromOutput('window', 'rows'),
      rowsRevision: fromOutput('window', 'rowsRevision'),
    }),
  },
  hooks: [onEvent('screen', 'viewportChanged').command('window', 'setViewport', event())],
})
```

Это фрагмент: Store, Update, Query и SFC полностью определены в [рецепте](/guides/collection-window#source). `data('state')` — alias Store этой Composition, а не строка произвольного runtime id. Compiler проверяет наличие definition, type references, объявленные имена props/outputs/commands, required props и dependency/ownership wiring (Store path, Update owner, Query output). Фактические вычисленные props и command input/output проверяются `ControllerRuntimeHost` через существующую Core value validation. Это не общая статическая inference/assignability произвольных Source expressions или event-to-command значений. Второй writer одного Store/path отклоняется. В SDK binding `state.store` получает настоящий `StoreRuntimeHost`.

## SDK и lifecycle

```ts
const host = await Endge.runtime.controllers.mount(identity, {
  owner: registeredParentHost, // либо id уже зарегистрированного parent
  props: { /* объявленные поля */ },
  dependencies: { /* объявленные Store/Query bindings */ },
  instanceId: 'optional-instance-id',
})
const unsubscribe = host.subscribe(() => console.log(host.getOutputs()))
await host.setProps({ /* patch */ })
await host.command('commandName', input)
unsubscribe()
await host.dispose()
```

Это обзор сигнатур; исполнимый пример ниже сам создаёт owner через Composition mount. `mount` возвращает Promise готового host; `setProps` объединяет patch с текущими props и проверяет contract. `getProps()`, `getOutputs()` и `getOutput(name)` возвращают snapshots. Не создавайте `new ControllerRuntimeHost` и не передавайте unattached объект как owner. SDK и Composition используют единые registry, Compiler/Program, strategy и host tree.

Provider callbacks: `start(context)`, `setProps(props,context)`, `command(name,input,context)`, `pause()`, `resume(context)`, `destroy()`. Все кроме factory могут быть async; `command` обязателен. Provider instance живёт до destroy; props generation меняется без пересоздания instance.

Context содержит frozen props snapshot, generation `AbortSignal`, named dependencies и `publish(outputs)`. **Каждая async operation захватывает context своего callback.** Factory context не храните для последующих start/command/resume. Pause, изменившиеся props и teardown отменяют старую generation: старый publish игнорируется, старые Store capabilities/Query starts и завершившийся command отклоняются с `AbortError`. Provider должен также проверять signal перед собственными побочными эффектами и корректно освобождать ресурсы; host не может отменить произвольный внешний код.

Store dependency: `read()`, `commit(next,expectedRevision)`, `subscribe(listener)`; Query dependency: `run(input,signal)`.

Текущий Store adapter рассчитан на **versioned object** в связанном writable path: `{revision:number,...}`. Provider передаёт `next` с новой числовой `revision` и числовой `expectedRevision`; продвижение ревизии (например, `expectedRevision + 1`) обеспечивает сам provider, adapter не вычисляет её за него. Связанный guarded Update получает именно `{next,expectedRevision}`, читает `input('next')` / `input('expectedRevision')` и сохраняет этот revision protocol при записи bound value. Adapter сравнивает текущий `revision` с `expectedRevision` до Update, затем проверяет записанный `revision` на равенство `next.revision`; конфликт или skipped guard не считается успешным commit. Это не adapter произвольного scalar Store value или произвольной формы Update input. Для `endge.collection-window` объект дополнительно содержит `rowsRevision` и `blocks`; остальные code-owned providers определяют собственные поля рядом с `revision`. `commit` проходит через Store-owned Update и не обходит Store.

Query создаётся дочерним runtime, использует обычные REST/GraphQL/mock/Simulation/auth механизмы и очищается после запроса. Подписка Store автоматически снимается при отмене generation, при resume/new props provider при необходимости подписывается заново.

### Scalar command contract: только форма

Следующий TypeScript-фрагмент показывает только `definition.contract.commands`, а не полный provider или исполнимый сценарий. `input` и `output` используют публичный `SourceFieldDefinition`; это не Source DSL:

```ts
import type { ControllerDefinition } from '@endge/core'

const commands: ControllerDefinition['contract']['commands'] = {
  echoNumber: {
    input: { key: 'value', type: 'Number', array: false, optional: false },
    output: { key: 'result', type: 'Number', array: false, optional: false },
  },
}
```

Для уже смонтированного `echoHost`, чья definition включает этот contract и чей code provider реализует `echoNumber` с возвратом Number, соответствующий вызов передаёт scalar:

```ts
await echoHost.command('echoNumber', 2)
```

Поле `key` в field descriptor не создаёт объектную обёртку payload: здесь вход — `2`, не `{value:2}`, а возвращаемое provider значение — Number. Значения проверяются в runtime по объявленному contract; статическая типизация результата общего `host.command(...)` из этого фрагмента не выводится. Полный запускаемый counter ниже остаётся отдельным примером.

## Полный code-owned provider и SDK

Скачайте [sdk-controller.mjs](/examples/controllers/sdk-controller.mjs) и [load-core.mjs](/examples/controllers/load-core.mjs) в одну папку. В checkout документации они уже лежат в `docs/public/examples/controllers`. CLI-примеры этой страницы проверены на **Node.js v24.18.0**. Пакет `@endge/core@1.2.0-dev.15` не объявляет `engines`: указанная версия Node — проверенное окружение воспроизведения, а не общий диапазон поддержки Core или его минимальная версия. Команда из корня repository документации:

```bash
node docs/public/examples/controllers/sdk-controller.mjs --core /path/to/built/core
```

`/path/to/built/core` — каталог `package.json` пакета `@endge/core`, не `dist`. Установите `npm install @endge/core@1.2.0-dev.15` и передайте `--core ./node_modules/@endge/core`. `load-core.mjs` загружает ESM entrypoint Core и тот же экземпляр Raph из его dependency graph, отключает context persistence и строит нейтральный workspace bundle.

```js
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
```

Пример исполняет проверки через настоящий Core: изоляция двух instances, изменение props, отклонение устаревшего async completion, pause/resume, неизвестная command и provider lease. После `dispose`/unmount ресурсы освобождаются, затем удаляются provider и definition.

## Execution Bundle и диагностика

Compiler `buildController` создаёт controller artifact из registered definition, full build связывает его с Composition. Program Bundle сохраняет serializable definition и `requirements.hostControllers` (identity + providerKey), а executable provider остаётся в target host. Runtime не парсит Source и не загружает provider из текста Bundle. Старый bundle без hostControllers читается как раньше; новый source contract требует пересборки `program-v5`.

Проверяйте [Core runtime declarations](/reference/contracts/core/runtime), [Compiler](/reference/contracts/core/compiler), [Program](/reference/contracts/core/program) и [ошибки Controllers/window](/reference/controller-errors). Missing definition/provider, несуществующая command/output/prop, неверный dependency и конфликт writer не заменяются неявным fallback.


## Retention и кэш страниц

В Core `1.2.0-dev.15` доступны `retention`, `load.cache`, memory/IndexedDB, три политики обновления, `refreshPending`, `refresh` и `clearCache`. [Полный контракт и SDK](/guides/collection-window-cache.md). Кэш страниц не является persistence Store. Для исполнения: `node docs/public/examples/controllers/page-cache.mjs --core /path/to/built/core`; IndexedDB после reload проверяется в браузере.
