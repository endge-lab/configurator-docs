# State machines

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

`@raphy-js/raph/machine` разделяет declarative model, чистое вычисление перехода и runtime instance. Machine API — TypeScript библиотеки; это не Endge Source DSL. [Полные contracts](/raph/contracts/machine) содержат все generics, options и bindings.

## Минимальная модель

```ts
import { defineMachine, getInitialSnapshot, transition } from '@raphy-js/raph/machine'

type Event = { type: 'OPEN' } | { type: 'CLOSE' }
const model = defineMachine<{ count: number }, Event>({
  id: 'panel',
  context: { count: 0 },
  initial: 'closed',
  states: {
    closed: { on: { OPEN: 'opened' } },
    opened: { on: { CLOSE: 'closed' } },
  },
})
const initial = getInitialSnapshot(model)
const next = transition(model, initial, { type: 'OPEN' })
```

Чистая `transition` возвращает следующий snapshot; она не создаёт owner, таймеры, сеть или actor lifecycle. Snapshot содержит `active`, immutable `context`, `history`, `revision`, `status` и optional `output`. Status — `active`, `done` или `stopped`.

## Структура state и transition

| Surface | Возможности |
| --- | --- |
| State type | `atomic`, `compound`, `parallel`, `final`, `history` |
| Вложенность | `states`, `initial`, target paths |
| Реакции | `on`, `always`, `after` |
| Lifecycle | `entry`, `exit`, `invoke` |
| History | `shallow` / `deep` |
| Описание | `tags`, `meta` |
| Transition | `target`, `guard`, `reduce`, `emit`, `raise`, `reenter`, `reason` |

Transition задаётся строкой target, config object или ordered list configs. `guard` решает применимость, `reduce` возвращает новый context, `emit` выполняет output callback, `raise` создаёт внутреннее событие. Не изменяйте Readonly context напрямую. Для строковых ссылок предоставьте соответствующий map в `MachineBindings`.

## Runtime instance

```ts
import { createMachine } from '@raphy-js/raph/machine'

// owner — существующий RaphNode или RaphScope.
const instance = createMachine(owner, model)
instance.start()
const result = instance.send({ type: 'OPEN' })
console.log(result.status, instance.snapshot.get())
instance.stop()
```

`send` возвращает `ignored`, `queued` или `transitioned` вместе со snapshot. Instance предоставляет `matches`, `hasTag`, `subscribe`, `sendTo`, `persist`, `start` и `stop`. Отписку `subscribe` нужно освободить. Создание и start — разные операции; явно запускайте instance перед рабочими событиями.

Bindings включают `guards`, `reducers`, `outputs`, `delays`, `tasks`, `resources`, `actors`. Task получает `AbortSignal` и `send`; resource получает owner/signal и может вернуть disposer. При выходе из state и остановке runtime освобождает связанные ресурсы; внешняя операция должна уважать signal, иначе её фактическое прекращение не гарантируется. `invoke` указывает task или child model, optional input, `onDone` и `onError`.

`CreateMachineOptions` задаёт clock, input, persisted snapshot, id/parentId и `errorPolicy: ignore | stop | throw`. Политика ошибки влияет на instance; она не разрешает произвольные side effects внутри чистого reducer.

## Persistence и диагностика

Persisted snapshot содержит `modelId` и version наряду с состоянием. Используйте `persistMachineSnapshot` / `restoreMachineSnapshot`, model version и migrations; не подменяйте проверку приведением JSON через `as`. Несовместимый snapshot даёт `MachinePersistenceError`. Возобновление состояния не сериализует незавершённый JavaScript Promise, сетевое соединение или чужой resource.

`@raphy-js/raph/machine/testing` экспортирует `inspectMachine`, `enumerateMachinePaths`, `createMachineCoverage`, `createManualMachineClock`. Это отдельные инструменты анализа моделей и управления временем; подключение package не запускает проверки автоматически. Debug API runtime предоставляет machine summaries/snapshots с owner association. Точные доступные методы — [runtime contracts](/raph/contracts/runtime).
