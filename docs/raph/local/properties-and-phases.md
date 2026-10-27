# Signals и phase bindings

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

## Owner-owned producer

```ts
const position = node.signal({ x: 0, y: 0 })
const matrix = node.computed(() => makeMatrix(position.get()))
```

Producer автоматически освобождается вместе с owner.

## Effect

```ts
node.effect('matrix', task => {
  applyMatrix(matrix.get(), task.causes)
}, {
  priority: 10,
  initial: 'scheduled',
})
```

Effect динамически собирает implicit dependencies. Один effect принадлежит ровно
одной фазе.

## Watch

```ts
renderer.watch(position, 'render', renderShape, {
  initial: 'none',
  priority: 20,
})
```

Watch задаёт source явно и разрешает cross-node связь внутри одного Runtime.

## Pulse

```ts
const renderPulse = node.signal(0)

node.watch(renderPulse, 'render', renderNode, { initial: 'none' })

function requestRender() {
  renderPulse.set(renderPulse.peek() + 1)
}
```

Это явная замена phase invalidation для горячего imperative state.
