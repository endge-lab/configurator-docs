# Raph Meta

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

Meta-plane хранит metadata отдельно от обычных path data и derived graph.
Metadata может принадлежать только существующему data path.

```ts
runtime.set('items[id=42].category', 'SU')

runtime.meta.set(
  'items[id=$id].category',
  'ui.optimistic',
  { status: 'waiting' },
  { vars: { id: 42 } },
)
```

`runtime.meta` предоставляет `get/has/set/merge/delete`. Для phase-bound событий
создайте source:

```ts
const changes = runtime.metaSource('items.*', {
  namespace: 'ui.optimistic',
})

node.watch(changes, 'update', task => {
  const events = task.causes.flatMap(cause => cause.events ?? [])
  consume(events)
}, { initial: 'none' })
```

Wildcard разрешён для `metaSource`, но не для writes. Удаление data owner
каскадно удаляет metadata descendants; replacement удаляет metadata только
исчезнувших owners.

Meta events не запускают derived graph. Внутри одной Runtime transaction data и
meta causes доставляются согласованно. Опция `invalidate: false` существует
только у meta writes; она подавляет scheduler request, но не event payload.
