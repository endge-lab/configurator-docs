# Стратегии материализации

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

## `full()`

Пересчитывает весь source при любом пересечении. Используйте для aggregate,
sort, group, join и зависимостей с меняющейся cardinality/order.

```ts
kernel.derive({
  from: 'orders',
  to: 'summary',
  strategy: full(),
  compute: orders => ({
    count: orders.length,
    total: orders.reduce((sum, order) => sum + order.amount, 0),
  }),
})
```

## `collectionByKey(key)`

One-to-one row-local contract: один input даёт один output с тем же уникальным
`string | number` key и порядком. Изменение одной entity может пересчитать только
её; reorder, key mutation и неизвестная структура дают full fallback.

## `filterByKey(key)`

Zero-or-one row-local contract. Output является упорядоченным подмножеством
source с теми же keys. Не используйте для global limit, sort, aggregate или
решения, зависящего от соседней строки.

| Стратегия | Cardinality | Incremental unit |
| --- | --- | --- |
| `full()` | любая | весь source |
| `collectionByKey(key)` | один к одному | entities затронутых keys |
| `filterByKey(key)` | ноль или один | entities затронутых keys |

