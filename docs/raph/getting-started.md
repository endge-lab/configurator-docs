# Установка и быстрый старт

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

```bash
pnpm add @raphy-js/raph
```

## Standalone reactivity

```ts
import { RaphReactivity } from '@raphy-js/raph/reactivity'

const reactive = new RaphReactivity()
const count = reactive.signal(0)
const doubled = reactive.computed(() => count.get() * 2)

const stop = reactive.effect(() => {
  console.log(count.get(), doubled.get())
})

count.set(1)
stop()
```

Этот контур синхронный, ownerless и не создаёт Runtime, phases или path indexes.

## Runtime

```ts
import {
  orderPhaseTasks,
  RaphRuntime,
  RaphSchedulerType,
} from '@raphy-js/raph/runtime'

const runtime = new RaphRuntime({
  id: 'preview',
  scheduler: RaphSchedulerType.Microtask,
})

runtime.definePhases([
  { name: 'update' },
  {
    name: 'render',
    process(batch) {
      const tasks = orderPhaseTasks(batch.tasks, {
        node: task => task.consumerOwner.node,
        direction: 'parents-first',
      })
      for (const task of tasks) task.run()
    },
  },
])

const screen = runtime.node({ id: 'screen' }, (node) => {
  const count = node.signal(0)

  node.watch(count, 'render', (task) => {
    console.log(count.get(), task.causes)
  })

  return { count }
})

screen.api.count.set(1)
await runtime.afterFlush()
runtime.dispose()
```

`node.watch` создаёт persistent phase binding. Повторные записи одного source до
flush коалесцируются в одну delivery с cause metadata.

## Path source

```ts
const status = runtime.path<string>('orders[id=42].status')

screen.watch(status, 'update', task => {
  console.log(status.get(), task.causes)
}, { initial: 'none' })

runtime.set('orders[id=42].status', 'ready')
```

Дальше: [granularity и ordering](/raph/local/propagation-and-ordering).

