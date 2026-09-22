# Lifecycle, ошибки и диагностика Derived

`derive` возвращает `RaphDerivedHandle`, через который owner управляет registration.

## Handle

```ts
const handle = runtime.derive({
  id: 'visible-orders',
  from: 'orders',
  to: 'visibleOrders',
  compute: orders => orders.filter(order => order.visible),
})

handle.pause()
handle.resume()
handle.recompute()
handle.dispose()
```

| Метод | Поведение |
| --- | --- |
| `pause()` | Приостанавливает вычисления; новые source events помечают registration stale |
| `resume()` | Возвращает active status и выполняет full recompute |
| `recompute()` | Принудительно выполняет full recompute |
| `dispose()` | Снимает routes, graph node и compute reference |
| `snapshot()` | Возвращает статус и counters registration |

`dispose()` идемпотентен. После удаления методы, которым нужен manager, сообщают `RaphDerivedDisposedError`.

## Target disposal

По умолчанию `disposeTarget: 'keep'`: последнее materialized value остаётся в store.

```ts
const handle = runtime.derive({
  from: 'draft.source',
  to: 'draft.preview',
  disposeTarget: 'delete',
  compute: source => buildPreview(source),
})
```

`disposeTarget: 'delete'` удаляет target и публикует derived mutation при disposal.

## Ошибки compute

Если `compute` выбрасывает исключение:

- source mutation сохраняется;
- target остаётся в last-good состоянии;
- node получает status `error` и `lastError`;
- ошибка публикуется после обработки стабилизированного batch;
- следующая source mutation пытается выполнить полный пересчёт.

Promise и другие thenable-результаты запрещены. Derived pipeline синхронный.

## Ошибки контракта

Raph различает несколько типов ошибок:

- `RaphDerivedPathError` — пустой id, wildcard path, пересечение source/target;
- `RaphDerivedTargetWriteError` — второй writer target или внешняя запись в активный target;
- `RaphDerivedCycleError` — цикл materialized dependencies;
- `RaphDerivedStrategyError` — нарушение cardinality, order, key или типа коллекции;
- `RaphDerivedComputeError` — исключение пользовательского compute;
- `RaphDerivedReentrancyError` — изменение registry/store во время stabilization;
- `RaphDerivedDisposedError` — операция через освобождённый handle.

## Snapshots

```ts
const registration = handle.snapshot()
const manager = runtime.getDerivedSnapshot()
```

Handle snapshot содержит status, paths, strategy, compute counters, количество target writes, stale и last error. Manager snapshot показывает размеры registry/graph/routes, pending keys, errors и факт текущей stabilization.

Snapshots предназначены для диагностики и проверок cleanup. Они не дают права изменять внутренний manager.

