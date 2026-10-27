# Поток изменения данных

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

## Producer → binding

```txt
signal/path/node/touch/frame source
  -> cause coalescing
  -> persistent phase binding
  -> phase queue
  -> process(batch)
  -> task.run() | task.defer() | task.cancel()
```

Producer не создаёт отдельный task object на каждую запись. Binding хранит
стабильную identity effect + consumer owner; новая запись только обновляет
причины и pending state.

## Causes

`RaphWorkCause` сообщает:

- `kind`: producer, structure, path, frame или touch;
- logical `source` и `sourceOwner`;
- revision, previous/value;
- path/meta events;
- net structural snapshot;
- touch metadata.

Один logical source встречается в delivery один раз в порядке первого появления.

## Path mutation

```txt
runtime.set(...)
  -> Kernel mutation
  -> derived stabilization
  -> active PathHandle / MetaSource
  -> subscribed bindings нужных Runtime lanes
  -> scheduler
```

PathHandle ленив: Kernel subscription появляется при первом consumer и снимается
после последнего.

## Nested writes

Новая задача для ещё не пройденной фазы может выполниться в текущем pass.
Инвалидация текущей или уже пройденной фазы начинает следующий pass с первой
фазы. `afterFlush()` завершается после обычных и явно deferred deliveries.

