# Жизненный цикл

Raph управляет нодами, observers, derived registrations, scheduled work и непрерывными loops. Владелец runtime должен явно завершать их lifecycle.

## Создание

При создании `RaphRuntime`:

- создаётся root node `__root__`;
- runtime регистрируется в переданном `RaphKernel`;
- при наличии параметра `scheduler` настраивается способ запуска;
- пользовательские ноды, phases и observers добавляются отдельно.

`RaphApp` выполняет ту же роль, но может самостоятельно создать kernel.

## Инициализация local runtime

`init()` регистрирует root node, финализирует local phases, пересобирает phase router и помечает default local properties dirty. Повторный вызов пропускается.

Для runtime без local-конфигурации обычно достаточно определить фазы и зарегистрировать ноды; data-path операции не требуют отдельного local bootstrap.

## Lifecycle отдельных ресурсов

| Ресурс | Освобождение |
| --- | --- |
| `Raph.watch(...)` | disposer, возвращённый `watch` |
| `Raph.effect(...)` | disposer, возвращённый `effect` |
| `runtime.subscribe(...)` | disposer либо `unsubscribe` |
| `runtime.observeData(...)` | disposer |
| Derived registration | `handle.dispose()` |
| Loop lease | `lease.release()` |
| `RaphNode` | `node.dispose()` |

`RaphEffect.stop()` перед удалением вызывает cleanup предыдущего запуска. Удаление node снимает принадлежащие ей control-flow subscriptions и data observers.

## Reset и destroy

`runtime.reset()`:

- останавливает manual loop и освобождает loop leases;
- очищает frame state;
- рекурсивно освобождает дочерние ноды root;
- удаляет routes, observers, subscriptions и dirty queues;
- освобождает derived registrations этого runtime;
- оставляет runtime зарегистрированным в kernel и допускает повторную настройку.

`runtime.destroy()` дополнительно снимает runtime с kernel и помечает instance уничтоженным. После `destroy()` создавайте новый runtime instance.

## Shared kernel

Уничтожение одного runtime не уничтожает данные kernel и другие runtime lanes. Общий kernel должен жить не меньше всех использующих его runtime. Для очистки shared data вызывайте `kernel.clear()` только на уровне владельца всего kernel.

## Derived target

По умолчанию `handle.dispose()` сохраняет последнее target value. Для scoped данных укажите `disposeTarget: 'delete'`, если target должен исчезнуть вместе с registration.

