---
description: "TypeScript-декларации @raphy-js/raph 1.0.1-dev.54, группа reactivity; исходных модулей: 4."
---

# @raphy-js/raph: reactivity

Версия source: 1.0.1-dev.54. [Каталог package](./). Repository: https://gitlab.com/raphyjs/raphy-js-raph (закрыт, canonical). Публичные declarations — [@raphy-js/raph@1.0.1-dev.54 в npm](https://unpkg.com/@raphy-js/raph@1.0.1-dev.54/).

## src/reactivity/engine-core.ts

Исходный модуль: `src/reactivity/engine-core.ts`

```ts
import type { ReactivePropertySourceBridge } from './reactive-object';
import type { ComputedAccessHandle, Disposer, EffectCallback, EffectFactory, EffectTask, OwnedSource, OwnedSourceHooks, ReactiveNode, ReactivityOptions, ReadonlySignal, Signal, SignalAccess, WatchCallback, WatchOptions, WatchSource, WritableComputedOptions } from './types';
import { ScopeNode } from './scope';
export { ScopeNode } from './scope';
export type { Disposer, EffectCallback, EffectScheduler, EffectTask, ReactivityOptions, ReadonlySignal, Signal, WatchCallback, WatchOptions, WatchSource, WatchValue, WritableComputedOptions, } from './types';
export declare class ReactivityEngine {
    readonly _effectImmediate: EffectFactory;
    constructor(options?: ReactivityOptions);
    signal<T>(initialValue: T): Signal<T>;
    computed<T>(getter: () => T): ReadonlySignal<T>;
    computed<T>(options: WritableComputedOptions<T>): Signal<T>;
    effect(fn: EffectCallback, onStop?: Disposer): Disposer;
    watch<S extends WatchSource | readonly WatchSource[]>(source: S, callback: WatchCallback<S>, options?: WatchOptions): Disposer;
    batch<T>(fn: () => T): T;
    untracked<T>(fn: () => T): T;
    scope(): ScopeNode<this>;
    _createReactivePropertySourceBridge(): ReactivePropertySourceBridge;
    _signalAccess<T>(initialValue: T): SignalAccess<T>;
    _computedAccess<T>(fn: () => T): ComputedAccessHandle<T>;
    _ownedSignal<T>(initialValue: T, sourceHooks?: OwnedSourceHooks): OwnedSource<Signal<T>>;
    _ownedComputed<T>(fn: () => T, sourceHooks?: OwnedSourceHooks): OwnedSource<ReadonlySignal<T>>;
    _startBatch(): void;
    _endBatch(): void;
    _isTracking(): boolean;
    _probeReads(operation: () => void): boolean;
    _isBatching(): boolean;
    _isFlushingEffects(): boolean;
    _allocateTaskEffect(fn: EffectCallback, task: EffectTask): ReactiveNode;
    _requestTaskEffect(node: ReactiveNode, schedule: boolean): void;
    _failTaskEffectSchedule(node: ReactiveNode, error: unknown): never;
    _beginTaskEffectRun(node: ReactiveNode): boolean;
    _finishTaskEffectRun(node: ReactiveNode): void;
    _cancelTaskEffect(node: ReactiveNode): boolean;
    _rearmTaskEffect(node: ReactiveNode): void;
    _disposeTaskEffect(node: ReactiveNode): void;
    _trackSignalNode<T>(value: T, sourceHooks: OwnedSourceHooks): ReactiveNode<T> | undefined;
    _readSignalNode<T>(node: ReactiveNode<T>): T;
    _peekSignalNode<T>(node: ReactiveNode<T>): T;
    _visibleSignalValue<T>(node: ReactiveNode<T>): T;
    _writeSignalNode<T>(node: ReactiveNode<T>, value: T): void;
    _signalNodeHasSubscribers(node: ReactiveNode): boolean;
    _releaseSignalNode(node: ReactiveNode): void;
    _findSubscriberOwner<Context>(node: ReactiveNode, accept: (owner: object, context: Context) => boolean, context: Context): object | undefined;
    _activeSubscriberOwner(): object | undefined;
    _bumpSignalNode(node: ReactiveNode<number>): boolean;
    _trackCounterNode(sourceHooks: OwnedSourceHooks): ReactiveNode<number> | undefined;
    _activeEffectTask(): EffectTask | undefined;
}
```

## src/reactivity/engine.ts

Исходный модуль: `src/reactivity/engine.ts`

```ts
import type { ReactivityOptions, ReadonlySignal, Signal, WritableComputedOptions } from './types';
import { ReactivityEngine } from './engine-core';
export { ScopeNode } from './scope';
export type { Disposer, EffectCallback, EffectScheduler, EffectTask, ReactivityOptions, ReadonlySignal, Signal, WatchCallback, WatchOptions, WatchSource, WatchValue, WritableComputedOptions, } from './types';
export declare class RaphReactivity extends ReactivityEngine {
    constructor(options?: ReactivityOptions);
    reactive<T extends object>(value: T): T;
}
export declare const signal: RaphReactivity['signal'];
export declare const reactive: RaphReactivity['reactive'];
export declare function computed<T>(getter: () => T): ReadonlySignal<T>;
export declare function computed<T>(options: WritableComputedOptions<T>): Signal<T>;
export declare const effect: RaphReactivity['effect'];
export declare const watch: RaphReactivity['watch'];
export declare const batch: RaphReactivity['batch'];
export declare const untracked: RaphReactivity['untracked'];
export declare const scope: RaphReactivity['scope'];
```

## src/reactivity/scope.ts

Исходный модуль: `src/reactivity/scope.ts`

```ts
import type { DisposalFailure } from './disposal';
import type { RaphReactivity } from './engine';
import type { ReactivityEngine } from './engine-core';
import type { Disposer, EffectCallback, OwnedResource, OwnedSource, ReadonlySignal, ScopeChildren, ScopeLink, Signal, SourceFinalizer, WatchCallback, WatchOptions, WatchSource, WritableComputedOptions } from './types';
export interface OwnedSourceEntry {
    _previousSource: OwnedSourceEntry | undefined;
    _finalizeSource: () => boolean;
}
export declare abstract class ScopeOwner implements ScopeChildren<OwnedResource> {
    scopeFirstChild: OwnedResource | undefined;
    scopeLastChild: OwnedResource | undefined;
    protected _disposed: boolean;
    protected _disposing: boolean;
    constructor();
    get disposed(): boolean;
    get active(): boolean;
    _debugResourceCount(): number;
    _debugSourceCount(): number;
    _lastOwnedSource(): OwnedSourceEntry | undefined;
    _releaseRecord(entry: OwnedResource): void;
    protected _ownCleanup(cleanup: Disposer): Disposer;
    protected _ownCompleted(cleanup: () => DisposalFailure | undefined): Disposer;
    protected _ownRecord(entry: OwnedResource): void;
    protected _ownSourceFinalizer(finalizer: SourceFinalizer): void;
    protected _ownSourceEntry(entry: OwnedSourceEntry): void;
    protected _releaseOwned(): DisposalFailure[] | undefined;
}
export declare class ScopeNode<Engine extends ReactivityEngine = RaphReactivity> extends ScopeOwner {
    readonly reactivity: Engine;
    constructor(reactivity: Engine);
    signal<T>(value: T): Signal<T>;
    computed<T>(getter: () => T): ReadonlySignal<T>;
    computed<T>(options: WritableComputedOptions<T>): Signal<T>;
    effect(callback: EffectCallback): Disposer;
    watch<S extends WatchSource | readonly WatchSource[]>(source: S, callback: WatchCallback<S>, options?: WatchOptions): Disposer;
    own(disposer: Disposer): Disposer;
    dispose(): void;
    _own(disposer: Disposer): Disposer;
    _adoptResource(disposer: Disposer): Disposer;
    _adoptSource<T>(owned: OwnedSource<T>): T;
    _ownSource(finalizer: SourceFinalizer): void;
    _assertAlive(): void;
    protected _afterDispose(): void;
    protected _disposalMessage(): string;
}
export declare function appendScopeChild<T extends ScopeLink<T>>(parent: ScopeChildren<T>, child: T): void;
export declare function detachScopeChild<T extends ScopeLink<T>>(node: T): void;
export declare function throwScopeErrors(errors: readonly unknown[], message: string): void;
```

## src/reactivity/types.ts

Исходный модуль: `src/reactivity/types.ts`

```ts
export type Disposer = () => void;
export interface ReadonlySignal<T> {
    get: (this: ReadonlySignal<unknown>) => T;
    peek: (this: ReadonlySignal<unknown>) => T;
}
export interface Signal<T> extends ReadonlySignal<T> {
    set: (value: T) => void;
}
export interface WritableComputedOptions<T> {
    readonly get: () => T;
    readonly set: (value: T) => void;
}
export type EffectCallback = () => void | Disposer;
export interface EffectTask {
    dependencyOwner?: object;
    allowScheduleDuringRun?: boolean;
    notify?: (source: unknown) => void;
    cancelPending?: () => boolean;
    rearmPending?: () => void;
    schedule: () => void;
    dispose: Disposer;
}
export interface EffectScheduler {
    bind: (run: () => void) => EffectTask;
}
export interface ReactivityOptions {
    readonly adaptiveDependencyIndex?: boolean;
    readonly effectScheduler?: EffectScheduler;
}
export type WatchSource<T = unknown> = ReadonlySignal<T> | (() => T);
export interface WatchOptions {
    readonly immediate?: boolean;
}
export type WatchValue<S> = S extends readonly unknown[] ? {
    [K in keyof S]: S[K] extends WatchSource<infer V> ? V : never;
} : S extends WatchSource<infer V> ? V : never;
export type WatchCallback<S> = (value: WatchValue<S>, previous: WatchValue<S> | undefined) => void | Disposer;
export type EffectFactory = (callback: EffectCallback, onStop?: Disposer) => Disposer;
export type TrackedOperation = <T>(operation: () => T) => T;
export type SourceFinalizer = () => boolean;
export interface OwnedResource extends ScopeLink<OwnedResource> {
    dispose: Disposer;
}
export interface ScopeChildren<T> {
    scopeFirstChild?: T;
    scopeLastChild?: T;
}
export interface ScopeLink<T> {
    scopeParent?: ScopeChildren<T>;
    scopePrevious?: T;
    scopeNext?: T;
}
export interface ReactiveEdge {
    dep: ReactiveNode;
    sub: ReactiveNode;
    prevSub: ReactiveEdge | null;
    nextSub: ReactiveEdge | null;
    prevDep: ReactiveEdge | null;
    nextDep: ReactiveEdge | null;
    dependencyCleanup?: Disposer;
}
export interface ReactiveNode<T = any> extends ScopeChildren<ReactiveNode>, ScopeLink<ReactiveNode> {
    flags: number;
    firstSub: ReactiveEdge | null;
    lastSub: ReactiveEdge | null;
    firstDep: ReactiveEdge | null;
    tailDep: ReactiveEdge | null;
    subSearchCursor?: ReactiveEdge;
    evaluate: (() => any) | undefined;
    cachedValue: T;
    pendingValue?: T;
    pendingAuthor?: ReactiveNode | null;
    effectTask?: EffectTask;
    onStop?: Disposer;
    sourceHooks?: OwnedSourceHooks;
    onUnobserved?: Disposer;
}
export interface SignalAccess<T> {
    read: () => T;
    write: (value: T) => void;
}
export interface ComputedAccess<T> {
    read: (this: ComputedAccess<unknown>) => T;
}
export interface ComputedAccessHandle<T> extends ReactiveNode<T>, ComputedAccess<T> {
    evaluate: (() => T) | undefined;
}
export interface ComputedSourceAccessHandle<T> extends ReactiveNode<T>, ReadonlySignal<T> {
    evaluate: (() => T) | undefined;
}
export interface OwnedSource<T> {
    source: T;
    hasSubscribers?: () => boolean;
    dispose: SourceFinalizer;
}
export interface OwnedSourceHooks {
    readonly token?: unknown;
    readonly dependencyOwner?: object;
    readonly onDependency?: (consumerOwner: object) => Disposer | undefined;
    readonly onChange?: (previous: unknown, value: unknown, hasReactiveSubscribers: boolean) => void;
    readonly onInvalidate?: (hasReactiveSubscribers: boolean) => void;
    readonly onDispose?: (hasReactiveSubscribers: boolean) => void;
}
export interface HandleReaders {
    read: <T>(this: ReadonlySignal<unknown> | ComputedAccess<unknown>) => T;
    peek: <T>(this: ReadonlySignal<unknown>) => T;
}
```
