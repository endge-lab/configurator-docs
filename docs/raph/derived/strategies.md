# Стратегии материализации

Стратегия определяет, может ли Raph пересчитать только затронутые элементы или должен снова выполнить `compute` для всего source.

## `full()`

```ts
import { full, Raph } from '@endge/raph'

Raph.derive({
  from: 'orders',
  to: 'summary',
  strategy: full(),
  compute: orders => ({
    count: orders.length,
    total: orders.reduce((sum, order) => sum + order.amount, 0),
  }),
})
```

При любом пересекающемся source mutation Raph читает весь source, один раз вызывает `compute(source)` и заменяет target.

Используйте `full()` для:

- aggregate, sort и group;
- joins и зависимостей от внешнего контекста;
- преобразований с изменяемой cardinality или order;
- object и scalar source;
- случаев, где row-local независимость не доказана.

## `collectionByKey(key)`

```ts
import { collectionByKey, Raph } from '@endge/raph'

Raph.derive({
  from: 'orders',
  to: 'orderRows',
  strategy: collectionByKey('id'),
  compute: orders => orders.map(order => ({
    id: order.id,
    label: `${order.code}: ${order.amount}`,
  })),
})
```

Это one-to-one row-local contract:

- source и output являются массивами объектов;
- ключ имеет тип `string | number` и уникален;
- каждый input item создаёт ровно один output item;
- output сохраняет тот же ключ и порядок;
- одна строка не зависит от других строк или внешнего state.

Для mutation `orders[id=10].amount` incremental compute получает массив полных актуальных entities затронутых ключей, а не field patches.

Root replacement, reorder, numeric index mutation, изменение key и неизвестная структурная mutation вызывают full fallback.

## `filterByKey(key)`

```ts
import { filterByKey, Raph } from '@endge/raph'

Raph.derive({
  from: 'orders',
  to: 'visibleOrders',
  strategy: filterByKey('id'),
  compute: orders => orders.filter(order => order.visible),
})
```

Это zero-or-one row-local contract. Для каждого input item output может:

- содержать тот же item/key один раз;
- не содержать его.

Итоговый output обязан быть упорядоченным подмножеством source. Raph инкрементально обновляет membership и сохраняет source order.

`filterByKey` не подходит, если решение зависит от другой строки, глобального limit, сортировки, aggregate или внешнего объекта фильтров. В таких случаях используйте `full()` либо отдельную специализированную стратегию.

## Сводная таблица

| Стратегия | Cardinality | Order | Incremental unit |
| --- | --- | --- | --- |
| `full()` | Любая | Любой | Весь source |
| `collectionByKey(key)` | Ровно один output на input | Сохраняется | Полные entities затронутых keys |
| `filterByKey(key)` | Ноль или один output на input | Сохраняется | Полные entities затронутых keys |

