# Lifecycle и ошибки Derived

`RaphDerivedHandle` предоставляет:

- `pause()` — приостановить автоматический recompute;
- `resume()` — возобновить и синхронизировать target;
- `recompute()` — принудительный полный пересчёт;
- `dispose()` — удалить registration;
- `status` и `lastError` — состояние последнего compute.

`disposeTarget: 'keep'` сохраняет последнее значение; `'delete'` удаляет target
при cleanup.

Если compute выбрасывает ошибку, source mutation сохраняется, target остаётся
last-good, handle получает `status: 'error'`. Следующая mutation снова пытается
пересчитать. Promise/thenable результат запрещён.

Публичная специализированная ошибка `RaphDerivedTargetWriteError` сообщает о
прямой записи в active target. Остальные нарушения контракта сообщаются обычными
`Error` с диагностическим сообщением.

`runtime.getDerivedSnapshot()` возвращает registrations, errors, pending и
stabilizing для проверки lifecycle.

