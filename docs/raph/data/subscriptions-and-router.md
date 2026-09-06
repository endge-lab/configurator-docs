# Подписки и RaphRouter

Raph предоставляет несколько механизмов реакции на data paths. Они решают разные задачи и выполняются в разные моменты.

## Сравнение механизмов

| API | Для чего | Когда выполняется |
| --- | --- | --- |
| `track(node, mask)` | Связать data path с обычным phase pipeline | В фазе, выбранной по `routes` |
| `observeData(node, mask, options)` | Направить path сразу в заданную фазу runtime | В указанной фазе |
| `subscribe(owner, mask, callback)` | Выполнить внешний control-flow callback | После фаз текущего тика |
| `Raph.watch(mask, callback)` | Упрощённая реактивная подписка default app | В системной watch-фазе |
| `RaphRouter<T>` | Независимый path matcher | При явном вызове `match` |

## Track

```ts
app.track(node, 'orders[id=$orderId].status')
```

`track` регистрирует node в node router. При mutation runtime сначала определяет подходящие phases по их `routes`, затем расширяет набор затронутых нод согласно `traversal` каждой фазы.

`untrack(node)` снимает все masks ноды, а `untrack(node, mask)` — одну маску.

## Direct data observer

```ts
const dispose = runtime.observeData(node, 'orders.*', {
  phase: 'render',
  traversal: 'dirty-and-down',
})

dispose()
```

Observer явно задаёт target phase и не полагается на phase routes. Он принадлежит runtime и node и удаляется вместе с ними.

## Control-flow subscription

```ts
const dispose = runtime.subscribe(
  owner,
  'orders[id=$orderId].status',
  ({ events, params, matches }) => {
    console.log(events, params?.orderId, matches)
  },
)

dispose()
```

Callback получает batch событий после выполнения runtime phases. `params` содержит первый набор captures, а `matches` — все совпадения и их параметры.

## Standalone RaphRouter

```ts
import { RaphRouter } from '@endge/raph'

const router = new RaphRouter<string>()

router.add('orders[id=$orderId].status', 'status-handler')
router.add('orders.*', 'orders-handler')

const matches = router.matchWithParams('orders[id=10].status')
```

Основные методы:

- `add(mask, payload)`;
- `remove(mask, payload?)`;
- `removePayload(payload)`;
- `removeAll()`;
- `match(path)`;
- `matchWithParams(path)`;
- `matchIncludingPrefix(path)`;
- `matchIncludingPrefixWithParams(path)`;
- `collectByPrefix(prefix)`;
- `masksFor(payload)`.

Обычный `match` возвращает уникальные payload. Вариант `matchWithParams` возвращает отдельные совпадения с captures динамических сегментов.

