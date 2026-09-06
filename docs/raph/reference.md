# Публичный API

Пакет экспортирует API через корневой entrypoint:

```ts
import { Raph, RaphApp, RaphNode } from '@endge/raph'
```

Не используйте deep imports из `src` или `dist`.

## Основной runtime

| Export | Назначение |
| --- | --- |
| `Raph` | Static facade default app |
| `RaphKernel` | Shared data, transactions, observers и derived graph |
| `RaphRuntime` | Execution lane с nodes, phases и scheduler |
| `RaphApp` | Runtime с собственным или переданным kernel |
| `RaphNode` | Базовая runtime-нода |
| `RaphDebug` | Graph и route snapshots |

## Пути, routing и данные

| Export | Назначение |
| --- | --- |
| `DataPath` | Parse, canonical serialization и matching путей |
| `RaphRouter<T>` | Router масок с generic payload |
| `DefaultDataAdapter` | In-memory реализация `DataAdapter` |
| `DataAdapter` | Контракт пользовательского storage adapter |
| `DepGraph<T>` | Направленный ациклический dependency graph |

`RouterNode`, `ControlFlowRegistry` и `ControlFlowQueue` также экспортируются, но являются низкоуровневыми building blocks. Для обычной подписки используйте `runtime.subscribe` или `Raph.watch`.

## Derived

| Export | Назначение |
| --- | --- |
| `full()` | Полная материализация |
| `collectionByKey(key)` | One-to-one row-local materialization |
| `filterByKey(key)` | Zero-or-one row-local filtering |
| `RaphDerivedHandle` | Lifecycle registration |
| `RaphDerivedNode` | Системная node materialization |

Пакет также экспортирует derived option/snapshot types и специализированные error classes.

## Local Runtime

| Export | Назначение |
| --- | --- |
| `RaphProperty` / `RaphLocalProperty` | Decorator local property |
| `RaphLocalPhase` | Decorator phase processor |
| `RaphAfter` / `RaphLocalAfter` | Node hook после phase processing |
| `RaphPropagation` | `None`, `Down`, `Up` |
| `RaphLocalPropertyRuntime` | Исполняемый property descriptor |
| `RaphLocalPhaseRuntime` | Исполняемая local phase |

Для custom integration доступны extract-функции decorator metadata и типы local configuration/context.

## Reactive API

| Export | Назначение |
| --- | --- |
| `RaphSignal<T>` | Writable или computed signal node |
| `RaphEffect` | Effect node с cleanup |
| `RaphWatch` | Path watcher node |

Обычно эти классы создаются через `Raph.signal`, `Raph.effect` и `Raph.watch`.

## Основные типы

- `RaphOptions`, `RaphRuntimeOptions`;
- `RaphPhase`, `PhaseName`, `PhaseEvent`, `PhaseExecutorContext`, `Traversal`;
- `DataPathDef`, `DataObject`, `DataAdapter`;
- `ControlFlowPayload`, `ControlFlowMatch`, `ControlFlowSubscribeOptions`;
- `RaphDerivedOptions`, `RaphDerivedStrategy`, snapshot contracts;
- `RaphLocalPhaseContext`, local property/phase descriptors;
- `RaphFrameContext`, `RaphLoopLease`, `RaphPriorityStrategy`;
- `SchedulerType` и alias `RaphSchedulerType`.

## Стабильность

Физический export означает доступность символа из package entrypoint, но не одинаковый уровень абстракции. Для application code предпочитайте `Raph`, `RaphApp`, `RaphKernel`, `RaphRuntime`, `RaphNode`, `DataPath`, documented strategies и lifecycle handles. Низкоуровневые registries и runtime descriptors используйте только при создании собственного integration layer.

