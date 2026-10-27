# Отладка и метрики

Runtime предоставляет immutable snapshots без отдельного debug mode.

```ts
const snapshot = runtime.debug.snapshot()
const tree = runtime.debug.getTree()
```

`snapshot()` содержит:

- runtime id, disposed и pending;
- transaction depths;
- количество owners и активных path handles;
- root scope, plain scopes и node tree;
- состояние frame loop: running, manual, leases.

Owner snapshot сообщает `kind`, `disposed`, число resources/sources и children.

## Derived

```ts
console.log({
  status: handle.status,
  lastError: handle.lastError,
  manager: runtime.getDerivedSnapshot(),
})
```

Manager snapshot показывает registrations, errors, pending и stabilization.

## Проверка утечек

1. Освобождены ли effect/watch disposers.
2. Уничтожены ли owners и Runtime lanes.
3. Освобождены ли loop leases.
4. Не удерживает ли application disposed node внешней ссылкой.
5. Вернулись ли owner resources/sources и pathHandles к ожидаемому уровню.

