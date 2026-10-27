---
description: "TypeScript-декларации @raphy-js/raph 1.0.1-dev.54, группа path; исходных модулей: 13."
---

# @raphy-js/raph: path

Версия source: 1.0.1-dev.54. [Каталог package](./). Repository: https://gitlab.com/raphyjs/raphy-js-raph (закрыт, canonical). Публичные declarations — [@raphy-js/raph@1.0.1-dev.54 в npm](https://unpkg.com/@raphy-js/raph@1.0.1-dev.54/).

## src/path/data-path.types.ts

Исходный модуль: `src/path/data-path.types.ts`

```ts
import type { PathOptions } from './path.types';
export type PathScalar = string | number | boolean | null;
export type PathSegment = {
    readonly kind: 'key';
    readonly key: string;
} | {
    readonly kind: 'index';
    readonly index: number;
} | {
    readonly kind: 'selector';
    readonly key: string;
    readonly value: PathScalar;
} | {
    readonly kind: 'wildcard';
    readonly indexed: boolean;
};
export interface ParsedDataPath {
    readonly canonical: string;
    readonly segments: readonly Exclude<PathSegment, {
        kind: 'wildcard';
    }>[];
}
export interface ParsedPathMask {
    readonly canonical: string;
    readonly deep: boolean;
    readonly segments: readonly PathSegment[];
}
export interface DataPathParseOptions extends PathOptions {
    readonly wildcardDynamic?: boolean;
}
export interface PlainDataPath {
    readonly deepOnTail?: boolean;
    readonly segs: readonly unknown[];
}
```

## src/path/DataPath.ts

Исходный модуль: `src/path/DataPath.ts`

```ts
import type { DataPathParseOptions, ParsedDataPath, ParsedPathMask, PathSegment, PlainDataPath } from './data-path.types';
import type { DataPathDef, PathOptions } from './path.types';
export declare class DataPath {
    static from(input: DataPathDef, options?: DataPathParseOptions): DataPath;
    static fromString(path: string, options?: DataPathParseOptions): DataPath;
    static fromPlain(plain: PlainDataPath): DataPath;
    static _parseExactString(path: string, options?: PathOptions): ParsedDataPath;
    static _parseMaskString(mask: string): ParsedPathMask;
    static _renderSegments(segments: readonly PathSegment[]): string;
    toPlain(): PlainDataPath;
    toStringPath(): string;
    toString(): string;
    segments(): readonly PathSegment[];
    static match(mask: DataPathDef, target: DataPathDef): boolean;
    _asExact(): ParsedDataPath;
    _asMask(): ParsedPathMask;
}
```

## src/path/derived/derived-collection.types.ts

Исходный модуль: `src/path/derived/derived-collection.types.ts`

```ts
import type { ParsedDataPath } from '../data-path.types';
export type DerivedCollectionKey = string | number;
export interface CollectionDerivedState {
    readonly from: ParsedDataPath;
    readonly kind: 'collection-by-key' | 'filter-by-key';
    readonly key: string;
    initialized: boolean;
    full: boolean;
    readonly keys: Set<DerivedCollectionKey>;
    sourceIndex: Map<DerivedCollectionKey, number> | undefined;
    targetIndex: Map<DerivedCollectionKey, number> | undefined;
}
```

## src/path/derived/derived-strategy.types.ts

Исходный модуль: `src/path/derived/derived-strategy.types.ts`

```ts
export interface DerivedFullStrategy {
    readonly kind: 'full';
}
export interface DerivedCollectionByKeyStrategy {
    readonly kind: 'collection-by-key';
    readonly key: string;
}
export interface DerivedFilterByKeyStrategy {
    readonly kind: 'filter-by-key';
    readonly key: string;
}
export type DerivedStrategy = DerivedFullStrategy | DerivedCollectionByKeyStrategy | DerivedFilterByKeyStrategy;
```

## src/path/derived/derived-strategy.utils.ts

Исходный модуль: `src/path/derived/derived-strategy.utils.ts`

```ts
import type { DerivedCollectionByKeyStrategy, DerivedFilterByKeyStrategy, DerivedFullStrategy } from './derived-strategy.types';
export declare function full(): DerivedFullStrategy;
export declare function collectionByKey(key: string): DerivedCollectionByKeyStrategy;
export declare function filterByKey(key: string): DerivedFilterByKeyStrategy;
```

## src/path/derived/RaphDerivedHandle.ts

Исходный модуль: `src/path/derived/RaphDerivedHandle.ts`

```ts
import type { DataPathDef } from '../path.types';
import type { RaphKernel } from '../RaphKernel';
import type { DerivedStrategy } from './derived-strategy.types';
export declare class RaphDerivedTargetWriteError extends Error {
    constructor(path: string);
}
export interface DerivedOptions<TSource = unknown, TTarget = unknown> {
    readonly id?: string;
    readonly from: DataPathDef;
    readonly to: DataPathDef;
    readonly strategy?: DerivedStrategy;
    readonly compute: (source: TSource) => TTarget;
    readonly immediate?: boolean;
    readonly disposeTarget?: 'keep' | 'delete';
}
export declare class RaphDerivedHandle<TSource = unknown, TTarget = unknown> {
    readonly id: string;
    readonly options: DerivedOptions<TSource, TTarget>;
    constructor(kernel: RaphKernel, id: string, options: DerivedOptions<TSource, TTarget>);
    get paused(): boolean;
    get disposed(): boolean;
    get status(): 'idle' | 'success' | 'error';
    get lastError(): Error | null;
    _recordSuccess(): void;
    _recordFailure(error: unknown): void;
    pause(): void;
    resume(): void;
    recompute(): void;
    dispose(): void;
    _attachRoutes(removers: readonly (() => void)[]): void;
    _detachRoutes(): void;
    _disposeFromKernel(): void;
}
```

## src/path/meta/meta.types.ts

Исходный модуль: `src/path/meta/meta.types.ts`

```ts
import type { DataPath } from '../DataPath';
import type { DataPathDef, PathOptions } from '../path.types';
export type RaphMetaMutationKind = 'set' | 'merge' | 'delete';
export type RaphMetaMutationCause = 'explicit' | 'owner-delete' | 'owner-replaced';
export interface RaphMetaMutationEvent {
    readonly kind: RaphMetaMutationKind;
    readonly path: DataPath;
    readonly namespace: string | null;
    readonly cause: RaphMetaMutationCause;
}
export interface RaphMetaEvents {
    readonly events: readonly RaphMetaMutationEvent[];
}
export interface RaphMetaReadOptions extends PathOptions {
}
export interface RaphMetaWriteOptions extends RaphMetaReadOptions {
    readonly invalidate?: boolean;
}
export interface RaphMetaWatchOptions extends RaphMetaReadOptions {
    readonly namespace?: string;
    readonly wildcardDynamic?: boolean;
}
export type RaphMetaWatchCallback = (payload: RaphMetaEvents) => void | (() => void);
export interface RaphMetaApi {
    get: (path: DataPathDef, namespace?: string, options?: RaphMetaReadOptions) => unknown;
    has: (path: DataPathDef, namespace?: string, options?: RaphMetaReadOptions) => boolean;
    set: (path: DataPathDef, namespace: string, value: unknown, options?: RaphMetaWriteOptions) => void;
    merge: (path: DataPathDef, namespace: string, value: unknown, options?: RaphMetaWriteOptions) => void;
    delete: (path: DataPathDef, namespace?: string, options?: RaphMetaWriteOptions) => void;
    watch: (masks: DataPathDef | readonly DataPathDef[], callback: RaphMetaWatchCallback, options?: RaphMetaWatchOptions) => () => void;
}
```

## src/path/meta/RaphMeta.ts

Исходный модуль: `src/path/meta/RaphMeta.ts`

```ts
import type { DataPathDef } from '../path.types';
import type { RaphKernel } from '../RaphKernel';
import type { RaphMetaApi, RaphMetaReadOptions, RaphMetaWatchCallback, RaphMetaWatchOptions, RaphMetaWriteOptions } from './meta.types';
export interface RaphMetaBinding {
    readonly assertReadable?: () => void;
    readonly assertWritable?: () => void;
    readonly runWrite?: <Result>(operation: () => Result, invalidate: boolean) => Result;
    readonly watch?: (masks: DataPathDef | readonly DataPathDef[], callback: RaphMetaWatchCallback, options: RaphMetaWatchOptions) => () => void;
}
export declare class RaphMeta implements RaphMetaApi {
    constructor(_kernel: RaphKernel, _binding?: RaphMetaBinding);
    get(path: DataPathDef, namespace?: string, options?: RaphMetaReadOptions): unknown;
    has(path: DataPathDef, namespace?: string, options?: RaphMetaReadOptions): boolean;
    set(path: DataPathDef, namespace: string, value: unknown, options?: RaphMetaWriteOptions): void;
    merge(path: DataPathDef, namespace: string, value: unknown, options?: RaphMetaWriteOptions): void;
    delete(path: DataPathDef, namespace?: string, options?: RaphMetaWriteOptions): void;
    watch(masks: DataPathDef | readonly DataPathDef[], callback: RaphMetaWatchCallback, options?: RaphMetaWatchOptions): () => void;
}
```

## src/path/path.types.ts

Исходный модуль: `src/path/path.types.ts`

```ts
import type { PlainDataPath } from './data-path.types';
import type { DataPath } from './DataPath';
export type DataPathDef = string | DataPath | PlainDataPath;
export interface PathOptions {
    readonly vars?: Readonly<Record<string, unknown>>;
}
export type PathMutationKind = 'set' | 'merge' | 'delete';
export interface PathEvent {
    readonly kind: PathMutationKind;
    readonly path: string;
    readonly previous: unknown;
    readonly value: unknown;
}
export interface PathEvents {
    readonly events: readonly PathEvent[];
}
export type PathWatchCallback = (payload: PathEvents) => void;
export interface PathApi {
    get: <T = unknown>(path: DataPathDef, options?: PathOptions) => T | undefined;
    peek: <T = unknown>(path: DataPathDef, options?: PathOptions) => T | undefined;
    has: (path: DataPathDef, options?: PathOptions) => boolean;
    set: <T>(path: DataPathDef, value: T, options?: PathOptions) => void;
    merge: (path: DataPathDef, value: unknown, options?: PathOptions) => void;
    delete: (path: DataPathDef, options?: PathOptions) => void;
    batch: <T>(operation: () => T) => T;
    watch: (masks: DataPathDef | readonly DataPathDef[], callback: PathWatchCallback) => () => void;
}
```

## src/path/RaphKernel.ts

Исходный модуль: `src/path/RaphKernel.ts`

```ts
import type { DerivedOptions } from './derived/RaphDerivedHandle';
import type { RaphMetaEvents, RaphMetaReadOptions, RaphMetaWatchOptions, RaphMetaWriteOptions } from './meta/meta.types';
import type { RaphMeta } from './meta/RaphMeta';
import type { DataPathDef, PathOptions, PathWatchCallback } from './path.types';
import type { DataAdapter, DataObject, DefaultAdapterOptions } from './storage/data-adapter.types';
import type { PathEventHub } from './storage/PathEventHub';
import { RaphDerivedHandle } from './derived/RaphDerivedHandle';
export type RaphKernelRoot = DataObject;
export interface RaphKernelOptions {
    readonly id?: string;
    readonly initial?: RaphKernelRoot;
    readonly adapter?: DataAdapter;
    readonly adapterOptions?: DefaultAdapterOptions;
}
export interface RaphKernelRuntime {
    dispose: () => void;
    _beginKernelBatch?: () => void;
    _endKernelBatch?: () => void;
}
export declare class RaphKernel {
    readonly id: string;
    constructor(options?: RaphKernelOptions);
    get disposed(): boolean;
    getDerivedSnapshot(): {
        registrations: number;
        errors: number;
        pending: number;
        stabilizing: boolean;
    };
    get meta(): RaphMeta;
    get<T = RaphKernelRoot>(): T | undefined;
    get<T = unknown>(path: DataPathDef, options?: PathOptions): T | undefined;
    peek<T = RaphKernelRoot>(): T | undefined;
    peek<T = unknown>(path: DataPathDef, options?: PathOptions): T | undefined;
    has(path: DataPathDef, options?: PathOptions): boolean;
    set<T>(path: DataPathDef, value: T, options?: PathOptions): void;
    merge(path: DataPathDef, value: unknown, options?: PathOptions): void;
    delete(path: DataPathDef, options?: PathOptions): void;
    batch<T>(operation: () => T): T;
    _openSoleRuntimeBatch(runtime: RaphKernelRuntime): PathEventHub | undefined;
    _closeSoleRuntimeBatch(runtime: RaphKernelRuntime, hub: PathEventHub, operationFailed: boolean, operationError: unknown): void;
    watch(masks: DataPathDef | readonly DataPathDef[], callback: PathWatchCallback): () => void;
    getMeta(path: DataPathDef, namespace?: string, options?: RaphMetaReadOptions): unknown;
    hasMeta(path: DataPathDef, namespace?: string, options?: RaphMetaReadOptions): boolean;
    setMeta(path: DataPathDef, namespace: string, value: unknown, options?: RaphMetaWriteOptions): void;
    mergeMeta(path: DataPathDef, namespace: string, value: unknown, options?: RaphMetaWriteOptions): void;
    deleteMeta(path: DataPathDef, namespace?: string, options?: RaphMetaWriteOptions): void;
    _watchMeta(maskOrMasks: DataPathDef | readonly DataPathDef[], callback: (payload: RaphMetaEvents) => void, options?: RaphMetaWatchOptions, afterPublish?: (invalidate: boolean) => void): () => void;
    derive<TSource, TTarget>(options: DerivedOptions<TSource, TTarget>): RaphDerivedHandle<TSource, TTarget>;
    _attachRuntime(runtime: RaphKernelRuntime): void;
    _detachRuntime(runtime: RaphKernelRuntime): void;
    dispose(): void;
    _recomputeDerived<TSource, TTarget>(handle: RaphDerivedHandle<TSource, TTarget>): void;
    _removeDerived(handle: RaphDerivedHandle<any, any>): void;
}
```

## src/path/storage/data-adapter.types.ts

Исходный модуль: `src/path/storage/data-adapter.types.ts`

```ts
import type { DataPathDef, PathOptions } from '../path.types';
export type DataObject = Record<string, unknown> | unknown[];
export interface DataAdapter {
    root: () => DataObject;
    has?: (path: DataPathDef, options?: PathOptions) => boolean;
    get: (path: DataPathDef, options?: PathOptions) => unknown;
    set: (path: DataPathDef, value: unknown, options?: PathOptions) => void;
    delete: (path: DataPathDef, options?: PathOptions) => void;
    merge: (path: DataPathDef, value: unknown, options?: PathOptions) => void;
    indexOf?: (path: DataPathDef, options?: PathOptions) => number;
}
export interface DefaultAdapterOptions {
    readonly arrayDelete?: 'splice' | 'unset';
    readonly autoCreate?: boolean;
    readonly indexEnabled?: boolean;
    readonly indexStrategy?: 'lazy-key' | 'eager-all-keys';
}
```

## src/path/storage/DefaultDataAdapter.ts

Исходный модуль: `src/path/storage/DefaultDataAdapter.ts`

```ts
import type { DataPathDef, PathOptions } from '../path.types';
import type { DataAdapter, DataObject, DefaultAdapterOptions } from './data-adapter.types';
export declare class DefaultDataAdapter implements DataAdapter {
    constructor(initial?: DataObject, options?: DefaultAdapterOptions);
    root(): DataObject;
    fork(): DefaultDataAdapter;
    replaceRoot(root: DataObject): void;
    options(options: DefaultAdapterOptions): void;
    get(path: DataPathDef, options?: PathOptions): unknown;
    has(path: DataPathDef, options?: PathOptions): boolean;
    set(path: DataPathDef, value: unknown, options?: PathOptions): void;
    merge(path: DataPathDef, value: unknown, options?: PathOptions): void;
    delete(path: DataPathDef, options?: PathOptions): void;
    indexOf(path: DataPathDef, options?: PathOptions): number;
}
```

## src/path/storage/PathStore.ts

Исходный модуль: `src/path/storage/PathStore.ts`

```ts
import type { DataPathDef, PathApi, PathOptions, PathWatchCallback } from '../path.types';
import { PathEventHub } from './PathEventHub';
export declare class PathStore implements PathApi {
    get _batchHub(): PathEventHub;
    get<T = unknown>(path: DataPathDef, options?: PathOptions): T | undefined;
    peek<T = unknown>(path: DataPathDef, options?: PathOptions): T | undefined;
    has(path: DataPathDef, options?: PathOptions): boolean;
    set<T>(path: DataPathDef, value: T, options?: PathOptions): void;
    merge(path: DataPathDef, value: unknown, options?: PathOptions): void;
    delete(path: DataPathDef, options?: PathOptions): void;
    batch<T>(operation: () => T): T;
    watch(maskOrMasks: DataPathDef | readonly DataPathDef[], callback: PathWatchCallback): () => void;
}
```
