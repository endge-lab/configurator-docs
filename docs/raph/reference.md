# Публичный API

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

Используйте package entrypoints, а не deep imports:

```ts
import { Raph, RaphKernel, RaphRuntime } from '@raphy-js/raph'
import { RaphReactivity } from '@raphy-js/raph/reactivity'
import { orderPhaseTasks, RaphNode, RaphScope } from '@raphy-js/raph/runtime'
```

## Runtime

- `RaphRuntime`, `RaphScope`, `RaphNode`, `RaphEffectScope`;
- `RaphPhase`, `RaphPhaseBatch`, `RaphPhaseTask`, `RaphWorkCause`;
- `orderPhaseTasks`;
- `PathHandle`, `RaphMetaSource`, `RaphAggregate`;
- `RaphSchedulerType`;
- `RaphPhaseProcessError`, `RaphCrossRuntimeError`, `RaphDisposedError`.

## Reactivity

- `RaphReactivity`;
- `Signal<T>` и `ReadonlySignal<T>`;
- `signal/computed/effect/watch/batch/untracked/scope` instance methods.

## Path plane

- `RaphKernel`, `DataPath`, `DefaultDataAdapter`;
- `RaphMeta`;
- `full`, `collectionByKey`, `filterByKey`;
- `RaphDerivedHandle`.

## Facade

`Raph.configure({ mode: 'reactivity' | 'runtime' })` выбирает backend один раз на
сессию. `Raph.reset()` завершает facade lifecycle.

Снятые `RaphApp`, local decorators, dirty-node API, phase routes/traversal и
unphased Runtime effects не входят в public API.

## Полный source snapshot

Эта страница — маршрут по основным API. Полный перечень явных entrypoints/exports, declarations, overloads и option types: [контрактный справочник](/raph/contracts/). Дополнительные поверхности: [Observable](/raph/observable), [Machines](/raph/machines), [маршрут агента](/raph/agent-guide).
