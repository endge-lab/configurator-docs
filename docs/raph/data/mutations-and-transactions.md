# Изменения и transactions

Shared data принадлежит `RaphKernel`. `Raph`, `RaphApp` и `RaphRuntime` делегируют ему операции чтения и изменения.

## CRUD

```ts
import { Raph } from '@endge/raph'

Raph.set('user', { id: 1, name: 'Ada' })
Raph.set('user.name', 'Grace')
Raph.merge('user', { active: true })

const user = Raph.get('user')

Raph.delete('user.active')
```

| Операция | Поведение |
| --- | --- |
| `get` | Читает значение без публикации события |
| `set` | Устанавливает или заменяет значение и публикует mutation |
| `merge` | Объединяет значение с существующим target и публикует mutation |
| `delete` | Удаляет значение и публикует mutation |
| `runtime.notify` | Публикует изменение пути без записи значения |

`DefaultDataAdapter` по умолчанию создаёт отсутствующие промежуточные контейнеры. Параметризованный `set`, например `rows[id=10]`, может создать новый объект с указанным ключом.

## Переменные

```ts
Raph.set('rows[id=$rowId].status', 'ready', {
  vars: { rowId: 10 },
})
```

Один и тот же набор `vars` используется для доступа к данным и для формирования события.

## Transaction

`transaction` группирует mutations и откладывает доставку событий:

```ts
Raph.transaction(() => {
  Raph.set('orders[id=1].status', 'ready')
  Raph.set('orders[id=2].status', 'ready')
  Raph.delete('orders[id=3]')
})
```

После завершения внешней transaction kernel:

1. стабилизирует derived graph;
2. собирает source и derived target events;
3. доставляет итоговый batch runtime lanes;
4. запускает их согласно scheduler.

Вложенные transactions используют общий внешний batch.

::: warning Transaction не является rollback
Изменения применяются к data adapter во время callback. Если callback выбросит ошибку, kernel всё равно завершит flush накопленных mutations, а затем пробросит ошибку. Используйте transaction для batching и согласованной доставки, а не как механизм отмены.
:::

## `invalidate`

Mutation options поддерживают `invalidate: false`. Данные и routing events при этом сохраняются, но runtime не планирует автоматический запуск только из-за данного события. Используйте эту опцию лишь когда вызывающий owner сам управляет последующим `run()` или invalidation.

## Derived targets

Пока materialized dependency активна, её target является read-only для внешних mutations. Изменяйте source либо освободите derived handle перед ручной записью target.

