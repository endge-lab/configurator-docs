# Raph: маршрут агента

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

Этот раздел относится к Raph в составе документации Endge. Точные сигнатуры всех явных package entrypoints, overloads и типов собраны в [source snapshot](/raph/contracts/). Версия snapshot не означает опубликованную npm-версию: сверьте [manifest](/contracts-manifest.json) с установленным package.

## Выбор поверхности

| Задача | Import | Владелец lifecycle |
| --- | --- | --- |
| Независимые synchronous signals | `@raphy-js/raph/reactivity` | RaphReactivity / ScopeNode |
| Path/meta data, indexing, transactions, derived | `@raphy-js/raph/path` | RaphKernel и derived handles |
| Phases, scheduler, ownership tree | `@raphy-js/raph/runtime` | RaphRuntime, RaphScope, RaphNode |
| Execution profile | `@raphy-js/raph/execution` | RaphExecutionRuntime |
| Compact execution profile | `@raphy-js/raph/compact` | RaphCompactExecutionRuntime |
| Observable objects/classes/buffers | `@raphy-js/raph/observable` | Переданный runtime и consumer owners |
| State machines | `@raphy-js/raph/machine` | RaphNode или RaphScope |
| Pure machine inspection/clock helpers | `@raphy-js/raph/machine/testing` | Вызывающий код |
| Общий facade | `@raphy-js/raph` | Одна настроенная facade session |

`/signals` — export alias reactivity entrypoint, `/raph` — facade entrypoint. `debug/*` публикует debug build modules и не должен становиться заменой стабильных entrypoints в production-коде. Конкретные runtime profiles имеют разные options/capabilities: сверьте constructors и configuration types, не считайте compact профиль полным alias RaphRuntime.

## Реактивность

```ts
import { RaphReactivity } from '@raphy-js/raph/reactivity'

const reactivity = new RaphReactivity()
const owner = reactivity.scope()
const count = owner.signal(0)
const doubled = owner.computed(() => count.get() * 2)
const stop = owner.effect(() => console.log(doubled.get()))
count.set(1)
stop()
owner.dispose()
```

`get()` участвует в dependency tracking, `peek()` читает без него. Изменение выполняется через `set`, writable computed использует собственный setter. `batch` объединяет реактивные изменения, `untracked` исключает случайное чтение из dependency collection. Scope удерживает cleanup; не переносите source между независимыми runtime graph без явной boundary.

Runtime effects отличаются от synchronous reactivity: они привязаны к именованной phase. Используйте `owner.effect(phase, callback)` и `owner.watch(source, phase, callback)`. Порядок определяется phase/process contract, а не порядком строк в файле. Детали: [phases](/raph/execution/phases-and-traversal), [scheduler](/raph/execution/scheduler-and-frame-loop).

## Данные, владельцы и операции

- Kernel владеет path/meta plane; Runtime — execution lane. Несколько lanes могут разделять Kernel, сохраняя независимые owners, phases и pending work.
- Scope владеет signals, effects, subscriptions и cleanup. Node добавляет parent/children position и structure causes. Parent-child связь не заменяет dependency edge.
- Для коллекций с устойчивым key используйте [indexing](/raph/data/indexing), а не позицию массива как бизнес-identity.
- Path mutation выполняется через [mutation/transaction API](/raph/data/mutations-and-transactions). Derived outputs принадлежат их materializer; не изменяйте их как независимый writable source.
- `action` объединяет разрешённую mutation boundary. Создание action возвращает callable wrapper; его необходимо вызвать. Это не одноимённый Source Action Endge.
- `dispose` снимает принадлежащие owner ресурсы. Не освобождайте shared Kernel только потому, что закончилась одна lane.

## Куда идти за деталями

| Вопрос | Документ |
| --- | --- |
| Формат DataPath и selectors | [DataPath](/raph/data/data-path), [path contracts](/raph/contracts/path) |
| Meta dependencies | [Meta-plane](/raph/data/meta) |
| Subscriptions | [Router](/raph/data/subscriptions-and-router) |
| Derived strategies и ошибки | [Derived](/raph/derived/), [lifecycle](/raph/derived/lifecycle-and-errors) |
| Local state и granularity | [Owner-local](/raph/local/), [ordering](/raph/local/propagation-and-ordering) |
| Observable и buffers | [Observable guide](/raph/observable) |
| Machines, actors, timers и persistence | [Machine guide](/raph/machines) |
| Все точные типы | [Contracts](/raph/contracts/) |

Перед реализацией определите entrypoint, owner, phase, mutable source и cleanup. Не используйте снятые `RaphApp`, dirty-node API, local decorators или unphased runtime effects. Не переносите методы из похожей reactive library по памяти: Raph contracts имеют собственные shapes и lifecycle.
