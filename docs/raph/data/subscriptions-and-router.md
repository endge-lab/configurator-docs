# Подписки, PathHandle и RaphRouter

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

## Runtime path source

```ts
const orders = runtime.path('orders.*')

const stop = node.watch(orders, 'update', task => {
  const pathEvents = task.causes.flatMap(cause => cause.events ?? [])
  consume(pathEvents)
}, { initial: 'none' })
```

`runtime.path` возвращает lifecycle-aware `PathHandle`. Handle можно читать через
`get/peek` и использовать как source. Backend watch создаётся лениво.

## Meta source

```ts
const validation = runtime.metaSource('orders.*', {
  namespace: 'validation',
})

node.watch(validation, 'update', handleValidation, { initial: 'none' })
```

Path/meta event batches сохраняют event-stream semantics. Обычные signal effects
коалесцируют состояние и не являются журналом всех промежуточных событий.

## Kernel watch

`kernel.watch(mask, callback)` — низкоуровневая синхронная path subscription без
Runtime phase. Используйте её в storage/integration слоях.

## Standalone RaphRouter

`RaphRouter<T>` — независимый matcher масок с пользовательским payload. Он не
создаёт owners, phases или scheduler и не заменяет Runtime watch.

