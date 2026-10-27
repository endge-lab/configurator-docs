# Жизненный цикл

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

## Runtime

`runtime.dispose()`:

- останавливает frame loop;
- отменяет phase bindings;
- рекурсивно уничтожает root subtree;
- освобождает scopes, path handles и aggregates;
- отсоединяет Runtime от Kernel;
- агрегирует cleanup errors вместо потери последующих cleanup.

Kernel, переданный снаружи, не уничтожается Runtime автоматически.

## Owners

| Ресурс | Владелец и cleanup |
| --- | --- |
| `owner.signal/computed` | owner dispose |
| `owner.effect/watch` | disposer или owner dispose |
| `owner.aggregate` | owner dispose |
| `runtime.path` | runtime dispose; backend subscription ленив |
| `runtime.metaSource` | runtime root scope |
| `RaphNode` | `node.dispose()`, включая subtree |
| frame loop lease | `lease.release()` |

Explicit watch регистрирует cleanup links со стороны consumer и source.
Disposal consumer отменяет pending delivery. Disposal source доставляет
финальный structural cause, отсоединяет edge и не удерживает consumer.

## Pause/resume

Effect scopes могут приостанавливать bindings. Resume выполняет не более одного
catch-up запуска с накопленными причинами.

## Ошибки cleanup

Cleanup пользовательского effect, disposer и structural delivery могут
ошибаться. Runtime завершает остальные обязательные освобождения и выбрасывает
исходную ошибку либо `AggregateError`.

