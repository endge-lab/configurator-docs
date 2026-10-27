---
description: "TypeScript-декларации @raphy-js/raph 1.0.1-dev.54, группа entrypoints; исходных модулей: 8."
---

# @raphy-js/raph: entrypoints

Версия source: 1.0.1-dev.54. [Каталог package](./). Repository: https://gitlab.com/raphyjs/raphy-js-raph (закрыт, canonical). Публичные declarations — [@raphy-js/raph@1.0.1-dev.54 в npm](https://unpkg.com/@raphy-js/raph@1.0.1-dev.54/).

## src/entrypoints/compact.ts

Исходный модуль: `src/entrypoints/compact.ts`

```ts
export { RaphCompactExecutionRuntime } from '../runtime/RaphCompactExecutionRuntime';
export type { RaphRuntimeBase as RaphExecution, RaphExecutionRuntimeConfiguration, RaphExecutionRuntimeOptions } from '../runtime/RaphRuntimeBase';
```

## src/entrypoints/execution.ts

Исходный модуль: `src/entrypoints/execution.ts`

```ts
export { RaphExecutionRuntime } from '../runtime/RaphExecutionRuntime';
export type { RaphRuntimeBase as RaphExecution, RaphExecutionRuntimeConfiguration, RaphExecutionRuntimeOptions } from '../runtime/RaphRuntimeBase';
```

## src/entrypoints/machine-testing.ts

Исходный модуль: `src/entrypoints/machine-testing.ts`

```ts
export { createMachineCoverage, createManualMachineClock, enumerateMachinePaths, inspectMachine, } from '../machine/testing';
export type { EnumeratedMachinePath, EnumerateMachinePathOptions, MachineCoverage, MachineCoverageReport, MachineInspection, ManualMachineClock, } from '../machine/testing';
```

## src/entrypoints/machine.ts

Исходный модуль: `src/entrypoints/machine.ts`

```ts
export { defineMachine } from '../machine/compiler';
export { getInitialSnapshot, transition } from '../machine/core';
export { MachinePersistenceError, persistMachineSnapshot, restoreMachineSnapshot, } from '../machine/persistence';
export { createMachine } from '../machine/runtime';
export type { CreateMachineOptions, MachineActorRef, MachineBindings, MachineClock, MachineConfig, MachineEvent, MachineEventStatus, MachineGuard, MachineGuardArgs, MachineInstance, MachineInvokeConfig, MachineMigration, MachineModel, MachineOutput, MachineOutputArgs, MachineReducer, MachineReducerArgs, MachineResource, MachineResourceArgs, MachineSendResult, MachineSnapshot, MachineStateConfig, MachineStatus, MachineTask, MachineTaskArgs, MachineTransitionConfig, MachineTransitionDefinition, PersistedMachineSnapshot, } from '../machine/types';
```

## src/entrypoints/observable.ts

Исходный модуль: `src/entrypoints/observable.ts`

```ts
export { observableBuffer } from '../observable/buffer';
export { makeAutoObservable, makeObservable } from '../observable/classes';
export { defineObservableAdapter, observable } from '../observable/observable';
export type { ObservableAdapter, ObservableAdapterContext, ObservableAnnotation, ObservableAnnotations, ObservableBuffer, ObservableBufferRange, ObservableBufferValue, ObservableClassOptions, ObservableOptions, } from '../observable/types';
```

## src/entrypoints/path.ts

Исходный модуль: `src/entrypoints/path.ts`

```ts
export type { DataPathParseOptions, PathScalar, PathSegment, PlainDataPath, } from '../path/data-path.types';
export { DataPath } from '../path/DataPath';
export type { DerivedCollectionByKeyStrategy, DerivedFilterByKeyStrategy, DerivedFullStrategy, DerivedStrategy, } from '../path/derived/derived-strategy.types';
export { collectionByKey, filterByKey, full } from '../path/derived/derived-strategy.utils';
export { RaphDerivedHandle } from '../path/derived/RaphDerivedHandle';
export type { DerivedOptions } from '../path/derived/RaphDerivedHandle';
export type { RaphMetaApi, RaphMetaEvents, RaphMetaMutationCause, RaphMetaMutationEvent, RaphMetaMutationKind, RaphMetaReadOptions, RaphMetaWatchCallback, RaphMetaWatchOptions, RaphMetaWriteOptions, } from '../path/meta/meta.types';
export { RaphMeta } from '../path/meta/RaphMeta';
export type { DataPathDef, PathApi, PathEvent, PathEvents, PathMutationKind, PathOptions, PathWatchCallback, } from '../path/path.types';
export { RaphKernel } from '../path/RaphKernel';
export type { RaphKernelOptions, RaphKernelRoot, RaphKernelRuntime, } from '../path/RaphKernel';
export type { DataAdapter, DataObject, DefaultAdapterOptions, } from '../path/storage/data-adapter.types';
export { DefaultDataAdapter } from '../path/storage/DefaultDataAdapter';
export { PathStore } from '../path/storage/PathStore';
```

## src/entrypoints/reactivity.ts

Исходный модуль: `src/entrypoints/reactivity.ts`

```ts
export * from '../reactivity/engine';
```

## src/entrypoints/runtime.ts

Исходный модуль: `src/entrypoints/runtime.ts`

```ts
export type { RaphDebugFrameLoopSnapshot, RaphDebugMachinesApi, RaphDebugOptions, RaphDebugOwnerSnapshot, RaphDebugSnapshot, RaphDebugStats, RaphDebugTraceApi, RaphDebugTreeNode, RaphMachineDebugSnapshot, RaphMachineDebugSummary, RaphRuntimeDebug, RaphTraceContextMode, RaphTraceEvent, RaphTraceGuardMode, RaphTraceKind, RaphTraceOptions, RaphTraceReadOptions, RaphTraceStatus, } from '../runtime/diagnostics/RaphDebug';
export { RaphActionError, RaphCrossRuntimeError, RaphDisposedError, RaphPhaseProcessError, } from '../runtime/errors';
export type { DepGraph } from '../runtime/ownership/parent-graph.types';
export { parentGraph } from '../runtime/ownership/parentGraph';
export { RaphEffectScope } from '../runtime/ownership/RaphEffectScope';
export { RaphNode } from '../runtime/ownership/RaphNode';
export type { NodeOptions } from '../runtime/ownership/RaphNode';
export { RaphScope } from '../runtime/ownership/RaphScope';
export { orderPhaseTasks } from '../runtime/phases/orderPhaseTasks';
export { RaphSchedulerType } from '../runtime/phases/phase.types';
export type { FrameLoopLease, RaphAggregateSource, RaphEffectGroup, RaphEffectGroupOptions, RaphEffectGroupRun, RaphEffectGroupSlot, RaphEffectInitialMode, RaphEffectOptions, RaphFrameContext, RaphPhase, RaphPhaseBatch, RaphPhaseBody, RaphPhaseEffect, RaphPhaseTask, RaphSchedulerMode, RaphStructureCause, RaphTaskOrderOptions, RaphWatchInclude, RaphWatchInitialMode, RaphWatchOptions, RaphWatchSource, RaphWorkCause, RaphWorkCauseKind, } from '../runtime/phases/phase.types';
export { RaphRuntime } from '../runtime/RaphRuntime';
export type { RaphRuntimeConfiguration, RaphRuntimeMeta, RaphRuntimeOptions, } from '../runtime/RaphRuntime';
export { PathHandle } from '../runtime/reactivity/PathHandle';
export type { RaphMetaSource } from '../runtime/reactivity/RaphMetaSource';
export type { RaphMetaSourceOptions } from '../runtime/reactivity/RaphMetaSource';
export type { RaphSelector, RaphSelectorInspection, RaphSelectorOptions } from '../runtime/reactivity/RaphSelector';
export { inspectSelector } from '../runtime/reactivity/RaphSelector';
export type { RaphAggregate } from '../runtime/reactivity/RaphWorkGraph';
```
