# Signals, Effects и Watch

Standalone reactive core не знает о Runtime phases и ownership metadata.

```ts
import { RaphReactivity } from '@raphy-js/raph/reactivity'

const r = new RaphReactivity()
const count = r.signal(0)
const doubled = r.computed(() => count.get() * 2)

const stopEffect = r.effect(() => {
  console.log(doubled.get())
})

const stopWatch = r.watch(count, (value, previous) => {
  console.log({ value, previous })
}, { immediate: true })

count.set(2)
console.log(count.peek())

stopWatch()
stopEffect()
```

- `get()` читает и отслеживает;
- `peek()` читает без dependency edge;
- `set(value)` записывает;
- computed ленив и пересчитывается при чтении;
- `batch()` объединяет несколько writes;
- effect cleanup выполняется перед повторным запуском и при stop;
- scope освобождает созданные внутри ресурсы вместе.

## Runtime reactivity

Runtime producers всегда имеют owner. Effects и watches всегда привязаны к
ровно одной фазе:

```ts
const source = node.signal(0)

node.effect('update', () => {
  console.log(source.get())
})

renderer.watch(source, 'render', task => {
  console.log(task.causes)
}, { initial: 'none' })
```

Implicit dependencies внутри `effect` разрешены только для producers того же
owner, ancestors и runtime root. Связь с sibling/descendant оформляйте явно
через `watch(source, phase, callback)`.

Coarse-watch на computed реагирует на invalidation и не заставляет computed
eagerly вычисляться.

