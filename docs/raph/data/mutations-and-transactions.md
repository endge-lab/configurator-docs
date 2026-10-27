# Изменения и transactions

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

Shared data принадлежит `RaphKernel`. Runtime делегирует CRUD своему Kernel.

```ts
runtime.set('user', { id: 1, name: 'Ada' })
runtime.merge('user', { active: true })
const user = runtime.get('user')
runtime.delete('user.active')
```

`runtime.get` участвует в tracking активного phase effect. `peek` читает без
dependency edge. Для явной подписки используйте `runtime.path(path)`.

## Переменные пути

```ts
runtime.set('rows[id=$rowId].status', 'ready', {
  vars: { rowId: 10 },
})
```

## Transaction

```ts
runtime.batch(() => {
  runtime.set('orders[id=1].status', 'ready')
  runtime.set('orders[id=2].status', 'ready')
  pulse.set(pulse.peek() + 1)
})
```

Transaction объединяет reactive writes и Kernel mutations в одну execution
boundary. После callback Kernel стабилизирует derived graph, sources
коалесцируют causes, затем Runtime запускает scheduler.

Transaction не является rollback: уже применённые mutations не отменяются при
ошибке callback.

Опции path mutation не содержат `invalidate: false`. Если нужно изменить
нерективное локальное состояние без автоматической work, измените его напрямую,
а нужную delivery запросите явным source позже.
