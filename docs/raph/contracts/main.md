---
description: "TypeScript-декларации @raphy-js/raph 1.0.1-dev.54, группа main; исходных модулей: 1."
---

# @raphy-js/raph: main

Версия source: 1.0.1-dev.54. [Каталог package](./). Repository: https://gitlab.com/raphyjs/raphy-js-raph (закрыт, canonical). Публичные declarations — [@raphy-js/raph@1.0.1-dev.54 в npm](https://unpkg.com/@raphy-js/raph@1.0.1-dev.54/).

## src/main.ts

Исходный модуль: `src/main.ts`

```ts
export { RaphCapabilityError, RaphConfigurationError, RaphDefaultInstanceError, RaphError, RaphFacadeDisposedError, } from './api/errors';
export { Raph } from './api/Raph';
export { RaphReactivityInstance } from './api/RaphReactivityInstance';
export type { ConfiguredRaph, RaphConfigureOptions, RaphFlatConfigureOptions, RaphInstance, RaphInstanceDefinition, RaphInstanceDefinitions, RaphInstanceMode, RaphInstancesConfigureOptions, RaphReactiveApi, RaphReactivityApi, RaphReactivityConfigureOptions, RaphReactivityInstanceDefinition, RaphReactivityInstanceOptions, RaphRuntimeApi, RaphRuntimeConfigureOptions, RaphRuntimeInstanceDefinition, StrictRaphConfigureOptions, } from './api/types';
export * from './entrypoints/runtime';
export type { DataPathParseOptions, PathScalar, PathSegment, PlainDataPath, } from './path/data-path.types';
export { DataPath } from './path/DataPath';
export type { DerivedCollectionByKeyStrategy, DerivedFilterByKeyStrategy, DerivedFullStrategy, DerivedStrategy, } from './path/derived/derived-strategy.types';
export { collectionByKey, filterByKey, full } from './path/derived/derived-strategy.utils';
export { RaphDerivedHandle, RaphDerivedTargetWriteError } from './path/derived/RaphDerivedHandle';
export type { DerivedOptions } from './path/derived/RaphDerivedHandle';
export type { RaphMetaApi, RaphMetaEvents, RaphMetaMutationCause, RaphMetaMutationEvent, RaphMetaMutationKind, RaphMetaReadOptions, RaphMetaWatchCallback, RaphMetaWatchOptions, RaphMetaWriteOptions, } from './path/meta/meta.types';
export { RaphMeta } from './path/meta/RaphMeta';
export type { DataPathDef, PathEvent, PathEvents, PathMutationKind, PathOptions, PathWatchCallback, } from './path/path.types';
export { RaphKernel } from './path/RaphKernel';
export type { RaphKernelOptions, RaphKernelRoot, RaphKernelRuntime, } from './path/RaphKernel';
export type { DataAdapter, DataObject, DefaultAdapterOptions, } from './path/storage/data-adapter.types';
export { DefaultDataAdapter } from './path/storage/DefaultDataAdapter';
export type { Disposer, ReadonlySignal, Signal, WatchOptions, WatchSource, WatchValue, WritableComputedOptions, } from './reactivity/types';
export type PhaseName = string;
```
