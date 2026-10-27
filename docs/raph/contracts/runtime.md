---
description: "TypeScript-декларации @raphy-js/raph 1.0.1-dev.54, группа runtime; исходных модулей: 18."
---

# @raphy-js/raph: runtime

Версия source: 1.0.1-dev.54. [Каталог package](./). Repository: https://gitlab.com/raphyjs/raphy-js-raph (закрыт, canonical). Публичные declarations — [@raphy-js/raph@1.0.1-dev.54 в npm](https://unpkg.com/@raphy-js/raph@1.0.1-dev.54/).

## src/runtime/diagnostics/RaphDebug.ts

Исходный модуль: `src/runtime/diagnostics/RaphDebug.ts`

```ts
import type { Disposer } from '../../reactivity/types';
import type { RaphScope } from '../ownership/RaphScope';
export type RaphTraceKind = 'action' | 'error' | 'machine' | 'phase';
export type RaphTraceGuardMode = 'all' | 'failed' | 'none';
export type RaphTraceContextMode = 'keys' | 'none';
export interface RaphTraceOptions {
    readonly capacity?: number;
    readonly context?: RaphTraceContextMode;
    readonly guards?: RaphTraceGuardMode;
    readonly include?: readonly RaphTraceKind[];
}
export interface RaphDebugOptions {
    readonly trace?: false | RaphTraceOptions;
}
export interface RaphTraceEventInput {
    readonly causeId?: number;
    readonly context?: Readonly<Record<string, unknown>>;
    readonly details?: Readonly<Record<string, unknown>>;
    readonly guard?: 'failed' | 'passed';
    readonly kind: RaphTraceKind;
    readonly name: string;
    readonly operationId?: number;
    readonly status?: 'end' | 'error' | 'ignored' | 'start';
}
export interface RaphTraceEvent {
    readonly causeId?: number;
    readonly contextKeys?: readonly string[];
    readonly details?: Readonly<Record<string, unknown>>;
    readonly guard?: 'failed' | 'passed';
    readonly kind: RaphTraceKind;
    readonly name: string;
    readonly operationId?: number;
    readonly sequence: number;
    readonly status?: 'end' | 'error' | 'ignored' | 'start';
    readonly timestamp: number;
}
export interface RaphTraceReadOptions {
    readonly limit?: number;
    readonly since?: number;
}
export interface RaphTraceStatus {
    readonly capacity: number;
    readonly context: RaphTraceContextMode;
    readonly enabled: boolean;
    readonly guards: RaphTraceGuardMode;
    readonly include: readonly RaphTraceKind[];
    readonly size: number;
}
export interface RaphDebugTraceApi {
    clear: () => void;
    read: (options?: RaphTraceReadOptions) => readonly RaphTraceEvent[];
    start: (options?: RaphTraceOptions) => void;
    status: () => RaphTraceStatus;
    stop: () => void;
}
export interface RaphMachineDebugSnapshot {
    readonly active: readonly string[];
    readonly contextKeys: readonly string[];
    readonly id: string;
    readonly modelId: string;
    readonly meta: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
    readonly ownerId: string;
    readonly parentId?: string;
    readonly revision: number;
    readonly status: string;
    readonly actors: readonly string[];
}
export interface RaphMachineDebugSummary {
    readonly active: readonly string[];
    readonly id: string;
    readonly modelId: string;
    readonly ownerId: string;
    readonly parentId?: string;
    readonly revision: number;
    readonly status: string;
}
export interface RaphMachineDebugRegistration {
    readonly id: string;
    readonly ownerId: string;
    readonly parentId?: string;
    readonly snapshot: () => RaphMachineDebugSnapshot;
}
export interface RaphDebugMachinesApi {
    list: () => readonly RaphMachineDebugSummary[];
    snapshot: (id: string) => RaphMachineDebugSnapshot | undefined;
}
export interface RaphDebugOwnerSnapshot {
    readonly children: readonly RaphDebugOwnerSnapshot[];
    readonly disposed: boolean;
    readonly id: string;
    readonly kind: 'node' | 'scope';
    readonly resources: number;
    readonly sources: number;
}
export interface RaphDebugFrameLoopSnapshot {
    readonly leases: number;
    readonly manual: boolean;
    readonly running: boolean;
}
export interface RaphDebugSnapshot {
    readonly actionDepth: number;
    readonly batchDepth: number;
    readonly disposed: boolean;
    readonly frameLoop: RaphDebugFrameLoopSnapshot;
    readonly id: string;
    readonly kernelBatchDepth: number;
    readonly machines: number;
    readonly owners: number;
    readonly pathHandles: number;
    readonly pending: boolean;
    readonly root: RaphDebugOwnerSnapshot;
    readonly rootScope: RaphDebugOwnerSnapshot;
    readonly scopes: readonly RaphDebugOwnerSnapshot[];
    readonly traceEvents: number;
}
export interface RaphDebugTreeNode {
    readonly children: readonly RaphDebugTreeNode[];
    readonly count?: number;
    readonly disposed?: boolean;
    readonly id: string;
    readonly kind: 'actor' | 'machine' | 'node' | 'resource' | 'runtime' | 'scope';
    readonly status?: string;
}
export interface RaphDebugStats {
    readonly actors: number;
    readonly machines: number;
    readonly nodes: number;
    readonly owners: number;
    readonly pathHandles: number;
    readonly pending: boolean;
    readonly resources: number;
    readonly scopes: number;
    readonly sources: number;
    readonly traceEvents: number;
}
export interface RaphRuntimeDebug {
    readonly machines: RaphDebugMachinesApi;
    readonly trace: RaphDebugTraceApi;
    getTree: () => RaphDebugTreeNode;
    snapshot: () => RaphDebugSnapshot;
    stats: () => RaphDebugStats;
}
export declare class RaphDebugController {
    readonly trace: RaphDebugTraceApi;
    readonly machines: RaphDebugMachinesApi;
    constructor(options?: RaphDebugOptions, traceTarget?: object, _onTraceChange?: ((this: object) => void) | undefined);
    start(options?: RaphTraceOptions): void;
    stop(): void;
    clear(): void;
    read(options?: RaphTraceReadOptions): readonly RaphTraceEvent[];
    status(): RaphTraceStatus;
    nextOperationId(kind: RaphTraceKind): number | undefined;
    traces(kind: RaphTraceKind): boolean;
    record(input: RaphTraceEventInput): void;
    registerMachine(registration: RaphMachineDebugRegistration): Disposer;
    hasMachine(id: string): boolean;
    listMachines(): readonly RaphMachineDebugSummary[];
    machineSnapshot(id: string): RaphMachineDebugSnapshot | undefined;
    get machineCount(): number;
    get traceSize(): number;
    get actorCount(): number;
    machineTreeNodesByOwner(): ReadonlyMap<string, readonly RaphDebugTreeNode[]>;
}
export declare function createOwnerSnapshot(owner: RaphScope<any>): RaphDebugOwnerSnapshot;
export declare function createOwnerTree(owner: RaphScope<any>, machinesByOwner?: ReadonlyMap<string, readonly RaphDebugTreeNode[]>): RaphDebugTreeNode;
```

## src/runtime/errors.ts

Исходный модуль: `src/runtime/errors.ts`

```ts
import { RaphError } from '../api/errors';
export declare class RaphActionError extends RaphError {
}
export declare class RaphDisposedError extends RaphError {
}
export declare class RaphCrossRuntimeError extends RaphError {
}
export declare class RaphPhaseProcessError extends RaphError {
}
```

## src/runtime/ownership/parent-graph.types.ts

Исходный модуль: `src/runtime/ownership/parent-graph.types.ts`

```ts
import type { RaphNode } from './RaphNode';
export interface DepGraph<T extends RaphNode = RaphNode> {
    parentsOf: (node: T) => ReadonlySet<T>;
}
```

## src/runtime/ownership/parentGraph.ts

Исходный модуль: `src/runtime/ownership/parentGraph.ts`

```ts
import type { DepGraph } from './parent-graph.types';
import type { RaphNode } from './RaphNode';
export declare function parentGraph<T extends RaphNode>(): DepGraph<T>;
```

## src/runtime/ownership/RaphEffectScope.ts

Исходный модуль: `src/runtime/ownership/RaphEffectScope.ts`

```ts
import type { Disposer } from '../../reactivity/types';
import type { RaphEffectGroup, RaphEffectGroupOptions, RaphEffectGroupSlot, RaphEffectOptions, RaphOwnerWatchSource, RaphPhaseBody, RaphPhaseEffect, RaphWatchOptions, RaphWatchSource } from '../phases/phase.types';
import type { RaphRuntime } from '../RaphRuntime';
import type { RaphRuntimeBase } from '../RaphRuntimeBase';
import type { RaphScope } from './RaphScope';
export declare class RaphEffectScope<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> {
    constructor(_owner: RaphScope<Runtime>, parent?: RaphEffectScope<Runtime> | null);
    get paused(): boolean;
    get disposed(): boolean;
    fork(owner: RaphScope<Runtime>): RaphEffectScope<Runtime>;
    effect(phase: string, callback: RaphPhaseEffect<Runtime>, options?: RaphEffectOptions): Disposer;
    bindEffect(phase: string, body: RaphPhaseBody, options?: RaphEffectOptions): void;
    effectGroup<Context>(phase: string, count: number, runSlot: RaphEffectGroupSlot<Context>, context: Context, options?: RaphEffectGroupOptions): RaphEffectGroup;
    watch(source: RaphOwnerWatchSource<Runtime>, phase: string, callback: RaphPhaseEffect<Runtime>, options?: RaphWatchOptions): Disposer;
    _registerEffect(phase: string, callback: RaphPhaseEffect<Runtime>, options: RaphEffectOptions, taskless: boolean, onExecutionFailure: (error: unknown) => never, isExecutionCancelled?: () => boolean): void;
    _registerWatch(source: RaphWatchSource<Runtime>, phase: string, callback: RaphPhaseEffect<Runtime>, options: RaphWatchOptions, onExecutionFailure: (error: unknown) => never, isExecutionCancelled?: () => boolean): void;
    _registerEffectGroup<Context>(phase: string, count: number, runSlot: RaphEffectGroupSlot<Context>, context: Context, options?: RaphEffectGroupOptions): ReturnType<RaphRuntimeBase<Runtime>['_effectGroupRegistration']>;
    pause(): void;
    resume(): void;
    dispose(): void;
}
```

## src/runtime/ownership/RaphNode.ts

Исходный модуль: `src/runtime/ownership/RaphNode.ts`

```ts
import type { DisposalFailure } from '../../reactivity/disposal';
import type { RaphRuntime } from '../RaphRuntime';
import type { RaphRuntimeBase } from '../RaphRuntimeBase';
import { RaphScope } from './RaphScope';
export interface NodeOptions<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> {
    readonly id?: string;
    readonly priority?: number;
    readonly parent?: RaphNode<unknown, Runtime>;
    readonly meta?: Readonly<Record<string, unknown>>;
    readonly type?: string;
}
export interface RaphNodeHolder<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> {
    readonly node: RaphNode<unknown, Runtime>;
}
export declare class RaphNode<TApi = unknown, Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> extends RaphScope<Runtime> {
    priority: number;
    _childCount: number;
    type: string;
    constructor(parent: RaphNode<unknown, Runtime> | Runtime | null, options?: Omit<NodeOptions<Runtime>, 'parent'>, runtime?: Runtime, publication?: never);
    get id(): string;
    get meta(): Record<string, unknown>;
    set meta(value: Record<string, unknown>);
    get api(): Readonly<TApi>;
    get _subtreeSourceIdentity(): object;
    get node(): RaphNode<TApi, Runtime>;
    get parent(): RaphNode<unknown, Runtime> | null;
    _hasAncestor(owner: RaphScope<any>): boolean;
    get children(): readonly RaphNode<unknown, Runtime>[];
    addChild(node: RaphNode<unknown, Runtime>): boolean;
    reorderChildren(nodes: readonly RaphNode<unknown, Runtime>[]): void;
    moveChild(child: RaphNode<unknown, Runtime>, before: RaphNode<unknown, Runtime> | null): void;
    _swapChildren(first: RaphNode<unknown, Runtime>, second: RaphNode<unknown, Runtime>): void;
    _disposeChildren(): unknown[] | undefined;
    _disposeChildren(holders: readonly RaphNodeHolder<Runtime>[], start?: number, end?: number): unknown[] | undefined;
    options(options: Pick<NodeOptions<Runtime>, 'meta' | 'priority' | 'type'>): void;
    touch(metadata?: unknown): void;
    remove(): void;
    dispose(): void;
    _disposeForOwner(): DisposalFailure | undefined;
    _disposeWithOutcome(): DisposalFailure | undefined;
    _setApi(api: TApi): void;
    _publishCreation(): void;
    _isPublished(): boolean;
    _isLinked(): boolean;
    _collectDescendants(into: RaphScope<any>[]): void;
    _countSubtree(totals: {
        resources: number;
        sources: number;
    }): void;
    _findNode(id: string): RaphNode<unknown, Runtime> | undefined;
}
export declare function createProvisionalNode<TApi, Runtime extends RaphRuntimeBase<Runtime>>(parent: RaphNode<unknown, Runtime>, options: Omit<NodeOptions<Runtime>, 'parent'>, runtime: Runtime): RaphNode<TApi, Runtime>;
```

## src/runtime/ownership/RaphScope.ts

Исходный модуль: `src/runtime/ownership/RaphScope.ts`

```ts
import type { DisposalFailure } from '../../reactivity/disposal';
import type { OwnedSourceEntry } from '../../reactivity/scope';
import type { Disposer, OwnedResource, OwnedSource, ReadonlySignal, Signal, WritableComputedOptions } from '../../reactivity/types';
import type { RaphAggregateSource, RaphEffectGroup, RaphEffectGroupOptions, RaphEffectGroupSlot, RaphEffectOptions, RaphPhaseBody, RaphPhaseEffect, RaphWatchOptions, RaphWatchSource } from '../phases/phase.types';
import type { RaphRuntime } from '../RaphRuntime';
import type { RaphRuntimeBase } from '../RaphRuntimeBase';
import type { RaphSelector, RaphSelectorOptions } from '../reactivity/RaphSelector';
import type { RaphAggregate } from '../reactivity/RaphWorkGraph';
import type { RaphNode } from './RaphNode';
import { ScopeOwner } from '../../reactivity/scope';
export declare class RaphScope<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> extends ScopeOwner {
    protected _id: string | number;
    readonly runtime: Runtime;
    readonly _order: number;
    readonly _isNode: boolean;
    _disposed: boolean;
    _disposing: boolean;
    constructor(id: string, runtime: Runtime);
    constructor(id: string | number, runtime: Runtime);
    get id(): string;
    get node(): RaphNode<unknown, Runtime> | undefined;
    signal<T>(value: T): Signal<T>;
    computed<T>(getter: () => T): ReadonlySignal<T>;
    computed<T>(options: WritableComputedOptions<T>): Signal<T>;
    selector<Key>(source: Runtime['selectors'] extends false ? never : Signal<Key>, options?: RaphSelectorOptions<Key>): RaphSelector<Key>;
    effect(phase: string, callback: RaphPhaseEffect<Runtime>, options?: RaphEffectOptions): Disposer;
    bindEffect(phase: string, body: RaphPhaseBody, options?: RaphEffectOptions): void;
    effectGroup<Context>(phase: string, count: number, runSlot: RaphEffectGroupSlot<Context>, context: Context, options?: RaphEffectGroupOptions): RaphEffectGroup;
    watch(source: RaphWatchSource<Runtime>, phase: string, callback: RaphPhaseEffect<Runtime>, options?: RaphWatchOptions): Disposer;
    _registerEffect(phase: string, callback: RaphPhaseEffect<Runtime>, options: RaphEffectOptions, taskless: boolean, onExecutionFailure: (error: unknown) => never, isExecutionCancelled?: () => boolean): void;
    _registerWatch(source: RaphWatchSource<Runtime>, phase: string, callback: RaphPhaseEffect<Runtime>, options: RaphWatchOptions, onExecutionFailure: (error: unknown) => never, isExecutionCancelled?: () => boolean): void;
    _registerEffectGroup<Context>(phase: string, count: number, runSlot: RaphEffectGroupSlot<Context>, context: Context, options?: RaphEffectGroupOptions): ReturnType<RaphRuntime['_effectGroupRegistration']>;
    aggregate(sources: readonly RaphAggregateSource<Runtime>[]): RaphAggregate<Runtime>;
    action<Args extends unknown[], Result>(operation: (...args: Args) => Result): (...args: Args) => Result;
    action<Args extends unknown[], Result>(name: string, operation: (...args: Args) => Result): (...args: Args) => Result;
    own(disposer: Disposer): Disposer;
    dispose(): void;
    _disposeScopeForOwner(dispose: Disposer): DisposalFailure | undefined;
    _disposeWithOutcome(): DisposalFailure | undefined;
    _ownCompletedCleanup(cleanup: () => DisposalFailure | undefined): Disposer;
    _adoptResource(disposer: Disposer): Disposer;
    _adoptRecord(entry: OwnedResource): void;
    _adoptSource<T>(source: OwnedSource<T>): T;
    _adoptSourceEntry(entry: OwnedSourceEntry): void;
    _assertAlive(): void;
}
```

## src/runtime/phases/orderPhaseTasks.ts

Исходный модуль: `src/runtime/phases/orderPhaseTasks.ts`

```ts
import type { RaphRuntime } from '../RaphRuntime';
import type { RaphRuntimeBase } from '../RaphRuntimeBase';
import type { RaphPhaseTask, RaphTaskOrderOptions } from './phase.types';
export declare function orderPhaseTasks<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime>(tasks: readonly RaphPhaseTask<Runtime>[], options: RaphTaskOrderOptions<Runtime>): RaphPhaseTask<Runtime>[];
```

## src/runtime/phases/phase.types.ts

Исходный модуль: `src/runtime/phases/phase.types.ts`

```ts
import type { RaphMetaMutationEvent } from '../../path/meta/meta.types';
import type { PathEvent } from '../../path/path.types';
import type { Disposer, ReadonlySignal } from '../../reactivity/types';
import type { RaphNode } from '../ownership/RaphNode';
import type { RaphScope } from '../ownership/RaphScope';
import type { RaphRuntime } from '../RaphRuntime';
import type { RaphRuntimeBase } from '../RaphRuntimeBase';
import type { RaphMetaSource } from '../reactivity/RaphMetaSource';
import type { RaphAggregate } from '../reactivity/RaphWorkGraph';
export declare const RaphSchedulerType: Readonly<{
    readonly AnimationFrame: "animationFrame";
    readonly Microtask: "microtask";
    readonly Sync: "sync";
}>;
export type RaphSchedulerMode = typeof RaphSchedulerType[keyof typeof RaphSchedulerType];
export type RaphEffectInitialMode = 'scheduled' | 'sync';
export type RaphWatchInitialMode = RaphEffectInitialMode | 'none';
export interface FrameLoopLease {
    readonly owner: string;
    release: () => void;
}
export interface RaphFrameContext {
    readonly now: number;
    readonly delta: number;
    readonly elapsed: number;
    readonly frame: number;
}
export interface RaphStructureCause<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> {
    readonly node: RaphNode<unknown, Runtime>;
    readonly oldParent?: RaphNode<unknown, Runtime>;
    readonly newParent?: RaphNode<unknown, Runtime>;
    readonly oldIndex?: number;
    readonly newIndex?: number;
}
export type RaphWorkCauseKind = 'producer' | 'structure' | 'path' | 'frame' | 'touch';
export interface RaphWorkCause<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> {
    readonly kind: RaphWorkCauseKind;
    readonly source: RaphWatchSource<Runtime>;
    readonly sourceOwner?: RaphScope<Runtime>;
    readonly revision: number;
    readonly previous?: unknown;
    readonly value?: unknown;
    readonly structure?: RaphStructureCause<Runtime>;
    readonly events?: readonly (PathEvent | RaphMetaMutationEvent)[];
    readonly metadata?: unknown;
}
export type RaphPhaseEffect<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> = (task: RaphPhaseTask<Runtime>) => void | Disposer;
export type RaphPhaseBody = () => void | Disposer;
export type RaphEffectGroupRun<Context = unknown> = readonly [
    context: Context,
    slot: number,
    ...state: readonly unknown[]
];
export type RaphEffectGroupSlot<Context = unknown> = (run: RaphEffectGroupRun<Context>) => void | Disposer;
export interface RaphEffectGroupOptions {
    readonly priority?: number;
}
export interface RaphEffectGroup {
    start: (this: RaphEffectGroup, slot: number, initial?: RaphEffectInitialMode) => void;
}
export interface RaphPhaseTask<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> {
    readonly phase: string;
    readonly consumerOwner: RaphScope<Runtime>;
    readonly effect: RaphPhaseEffect<Runtime>;
    readonly causes: readonly RaphWorkCause<Runtime>[];
    readonly frame: RaphFrameContext;
    readonly priority: number;
    readonly sequence: number;
    run: (this: RaphPhaseTask<Runtime>) => void;
    defer: (this: RaphPhaseTask<Runtime>) => void;
    cancel: (this: RaphPhaseTask<Runtime>) => void;
}
export interface RaphPhaseBatch<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> {
    readonly phase: string;
    readonly frame: RaphFrameContext;
    readonly tasks: readonly RaphPhaseTask<Runtime>[];
}
export interface RaphPhase<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> {
    readonly name: string;
    readonly process?: (batch: RaphPhaseBatch<Runtime>) => void;
}
export interface RaphEffectOptions {
    readonly initial?: RaphEffectInitialMode;
    readonly priority?: number;
}
export type RaphWatchInclude = 'self' | 'subtree';
export interface RaphWatchOptions extends Omit<RaphEffectOptions, 'initial'> {
    readonly initial?: RaphWatchInitialMode;
    readonly include?: RaphWatchInclude;
}
export interface RaphNodeWatchSource<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> {
    readonly source: RaphNode<unknown, Runtime>;
    readonly include: RaphWatchInclude;
}
export type RaphProducerSource = ReadonlySignal<unknown>;
export type RaphWatchSource<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> = RaphProducerSource | RaphNode<unknown, Runtime> | RaphNodeWatchSource<Runtime> | Runtime | RaphAggregate<Runtime> | RaphMetaSource;
export type RaphOwnerWatchSource<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> = RaphWatchSource<Runtime>;
export type RaphAggregateSource<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> = RaphOwnerWatchSource<Runtime>;
export interface RaphTaskOrderOptions<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> {
    readonly node: (task: RaphPhaseTask<Runtime>) => RaphNode<unknown, Runtime> | null | undefined;
    readonly direction?: 'parents-first' | 'children-first';
}
```

## src/runtime/RaphCompactExecutionRuntime.ts

Исходный модуль: `src/runtime/RaphCompactExecutionRuntime.ts`

```ts
import type { RaphExecutionRuntimeOptions } from './RaphRuntimeBase';
import { RaphRuntimeBase } from './RaphRuntimeBase';
export declare class RaphCompactExecutionRuntime extends RaphRuntimeBase<RaphCompactExecutionRuntime> {
    readonly reactiveObjects: false;
    readonly selectors: false;
    constructor(options?: RaphExecutionRuntimeOptions);
}
```

## src/runtime/RaphExecutionRuntime.ts

Исходный модуль: `src/runtime/RaphExecutionRuntime.ts`

```ts
import type { RaphExecutionRuntimeOptions } from './RaphRuntimeBase';
import { RaphRuntimeBase } from './RaphRuntimeBase';
export declare class RaphExecutionRuntime extends RaphRuntimeBase<RaphExecutionRuntime> {
    readonly reactiveObjects: true;
    readonly selectors: true;
    constructor(options?: RaphExecutionRuntimeOptions);
}
```

## src/runtime/RaphRuntime.ts

Исходный модуль: `src/runtime/RaphRuntime.ts`

```ts
import type { DerivedOptions, RaphDerivedHandle } from '../path/derived/RaphDerivedHandle';
import type { RaphMeta } from '../path/meta/RaphMeta';
import type { DataPathDef, PathOptions } from '../path/path.types';
import type { RaphKernelRoot } from '../path/RaphKernel';
import type { RaphDebugOptions, RaphRuntimeDebug } from './diagnostics/RaphDebug';
import type { RaphSchedulerMode } from './phases/phase.types';
import type { RaphMetaSourceOptions } from './reactivity/RaphMetaSource';
import { RaphKernel } from '../path/RaphKernel';
import { RaphDebugController } from './diagnostics/RaphDebug';
import { RaphRuntimeBase } from './RaphRuntimeBase';
import { PathHandle } from './reactivity/PathHandle';
import { RaphMetaSource } from './reactivity/RaphMetaSource';
export type { RaphPausableRegistration } from './RaphRuntimeBase';
export interface RaphRuntimeOptions {
    readonly adaptiveDependencyIndex?: boolean;
    readonly debug?: RaphDebugOptions;
    readonly id?: string;
    readonly kernel?: RaphKernel;
    readonly enforceActions?: boolean;
    readonly scheduler?: RaphSchedulerMode;
}
export interface RaphRuntimeConfiguration {
    readonly adaptiveDependencyIndex: boolean;
    readonly debug?: RaphDebugOptions;
    readonly id: string;
    readonly kernel: RaphKernel;
    readonly enforceActions: boolean;
    readonly scheduler: RaphSchedulerMode;
}
export type RaphRuntimeMeta = Pick<RaphMeta, 'delete' | 'get' | 'has' | 'merge' | 'set'>;
export declare class RaphRuntime extends RaphRuntimeBase<RaphRuntime> {
    readonly reactiveObjects: true;
    readonly selectors: true;
    readonly configuration: RaphRuntimeConfiguration;
    protected readonly _debugController: RaphDebugController;
    constructor(options?: RaphRuntimeOptions);
    get kernel(): RaphKernel;
    get meta(): RaphRuntimeMeta;
    getDerivedSnapshot(): ReturnType<RaphKernel['getDerivedSnapshot']>;
    get debug(): RaphRuntimeDebug;
    metaSource(masks: DataPathDef | readonly DataPathDef[], options?: RaphMetaSourceOptions): RaphMetaSource;
    path<T>(path: DataPathDef, options?: PathOptions): PathHandle<T>;
    get<T = RaphKernelRoot>(): T | undefined;
    get<T = unknown>(path: DataPathDef, options?: PathOptions): T | undefined;
    peek<T = RaphKernelRoot>(): T | undefined;
    peek<T = unknown>(path: DataPathDef, options?: PathOptions): T | undefined;
    has(path: DataPathDef, options?: PathOptions): boolean;
    set<T>(path: DataPathDef, value: T, options?: PathOptions): void;
    merge(path: DataPathDef, value: unknown, options?: PathOptions): void;
    delete(path: DataPathDef, options?: PathOptions): void;
    derive<TSource, TTarget>(options: DerivedOptions<TSource, TTarget>): RaphDerivedHandle<TSource, TTarget>;
    protected _applyBatch<Args extends unknown[], Result>(operation: (...args: Args) => Result, args: ArrayLike<Args[number]>, receiver?: unknown): Result;
    protected _runDataBatch<T>(operation: () => T): T;
    protected _disposeDataSources(errors: unknown[]): void;
    protected _detachDataPlane(errors: unknown[]): void;
}
```

## src/runtime/RaphRuntimeBase.ts

Исходный модуль: `src/runtime/RaphRuntimeBase.ts`

```ts
import type { Disposer, ReadonlySignal, Signal, WritableComputedOptions } from '../reactivity/types';
import type { RaphDebugController, RaphMachineDebugRegistration, RaphTraceEventInput, RaphTraceKind } from './diagnostics/RaphDebug';
import type { DepGraph } from './ownership/parent-graph.types';
import type { NodeOptions } from './ownership/RaphNode';
import type { FrameLoopLease, RaphAggregateSource, RaphEffectGroupOptions, RaphEffectGroupSlot, RaphEffectInitialMode, RaphEffectOptions, RaphPhase, RaphPhaseEffect, RaphSchedulerMode, RaphStructureCause, RaphWatchOptions, RaphWatchSource } from './phases/phase.types';
import type { RaphPhaseState } from './phases/RaphPhasePipeline';
import type { RaphAggregate } from './reactivity/RaphWorkGraph';
import type { RuntimeDisposalSweeper, RuntimeSignalLifecycle } from './reactivity/runtime-reactivity.types';
import type { RuntimeObjectSupport } from './reactivity/RuntimeObjectSupport';
import type { RuntimeSignal } from './reactivity/RuntimeReactivity';
import type { RuntimeSelectorSupport } from './reactivity/RuntimeSelectorSupport';
import { RaphNode } from './ownership/RaphNode';
import { RaphScope } from './ownership/RaphScope';
import { RaphFrameLoop } from './phases/RaphFrameLoop';
import { RaphPhasePipeline } from './phases/RaphPhasePipeline';
import { RaphPhaseTaskRecord } from './phases/RaphPhaseTaskRecord';
import { RaphWorkGraph } from './reactivity/RaphWorkGraph';
import { RuntimeReactivity } from './reactivity/RuntimeReactivity';
export interface RaphPausableRegistration {
    readonly active: boolean;
    readonly dispose: (this: RaphPausableRegistration) => void;
    readonly pause: (this: RaphPausableRegistration) => void;
    readonly resume: (this: RaphPausableRegistration) => void;
}
export interface RaphExecutionRuntimeOptions {
    readonly adaptiveDependencyIndex?: boolean;
    readonly id?: string;
    readonly enforceActions?: boolean;
    readonly scheduler?: RaphSchedulerMode;
}
export interface RaphExecutionRuntimeConfiguration {
    readonly adaptiveDependencyIndex: boolean;
    readonly id: string;
    readonly enforceActions: boolean;
    readonly scheduler: RaphSchedulerMode;
}
export declare function resolveRuntimeConfiguration(options: RaphExecutionRuntimeOptions): RaphExecutionRuntimeConfiguration;
export declare class RaphRuntimeBase<Runtime extends RaphRuntimeBase<Runtime>> {
    readonly reactiveObjects: boolean;
    readonly selectors: boolean;
    protected readonly _reactiveObjects: RuntimeObjectSupport | undefined;
    readonly mode: "runtime";
    readonly configuration: RaphExecutionRuntimeConfiguration;
    readonly rootScope: RaphScope<Runtime>;
    readonly root: RaphNode<unknown, Runtime>;
    readonly frameTick: ReadonlySignal<number>;
    protected readonly _reactivity: RuntimeReactivity;
    protected readonly _signalLifecycle: RuntimeSignalLifecycle;
    protected readonly _workGraph: RaphWorkGraph;
    protected readonly _frameTickSignal: RuntimeSignal<number>;
    protected _phases: RaphPhasePipeline | undefined;
    protected _frameLoop: RaphFrameLoop | undefined;
    protected readonly _debugController: RaphDebugController | undefined;
    protected _parentGraph: DepGraph | undefined;
    protected readonly _topOwners: Set<RaphScope<any>>;
    protected _ownerRegistrations: number;
    protected _ownersReleased: boolean;
    protected _batchDepth: number;
    protected _mutationDepth: number;
    protected _kernelBatchDepth: number;
    protected _ownerDisposalDepth: number;
    protected readonly _disposingNodes: Array<RaphNode<unknown, any> | undefined>;
    protected _ownerDisposals: number;
    protected _disposalSweepers: RuntimeDisposalSweeper[] | undefined;
    protected _nextDisposalSweep: number;
    protected _actionDepth: number;
    protected _actionCounter: number;
    protected readonly _traceCauseStack: number[];
    protected _phaseTraceOperations: Map<string, number> | undefined;
    protected _executionRequested: boolean;
    protected _disposed: boolean;
    protected readonly _disposedListeners: Set<() => void>;
    constructor(configuration: RaphExecutionRuntimeConfiguration, diagnostics?: RaphDebugController, objects?: RuntimeObjectSupport, selectors?: RuntimeSelectorSupport);
    _getReactivity(): RuntimeReactivity;
    _getWorkGraph(): RaphWorkGraph;
    get id(): string;
    get disposed(): boolean;
    get graph(): DepGraph;
    get loopEnabled(): boolean;
    get frame(): import("./phases/phase.types").RaphFrameContext;
    get phases(): readonly RaphPhase<Runtime>[];
    signal<T>(value: T, owner?: RaphScope<any>): Signal<T>;
    reactive<T extends object>(value: this['reactiveObjects'] extends false ? never : T): T;
    computed<T>(getter: () => T, owner?: RaphScope<any>): ReadonlySignal<T>;
    computed<T>(options: WritableComputedOptions<T>, owner?: RaphScope<any>): Signal<T>;
    effect(consumer: RaphScope<any>, phaseInput: string, callback: RaphPhaseEffect<Runtime>, options?: RaphEffectOptions): Disposer;
    _effectRegistration(consumer: RaphScope<any>, phaseInput: string, callback: RaphPhaseEffect<Runtime>, options?: RaphEffectOptions, startPaused?: boolean, taskless?: boolean, onExecutionFailure?: (error: unknown) => never, isExecutionCancelled?: () => boolean): RaphPausableRegistration;
    _effectGroupRegistration(consumer: RaphScope<any>, phaseInput: string, count: number, runSlot: RaphEffectGroupSlot, context: unknown, options?: RaphEffectGroupOptions, startPaused?: boolean): RaphPhaseTaskRecord;
    _startGroupSlot(record: RaphPhaseTaskRecord, slot: number, initial: RaphEffectInitialMode, onExecutionFailure?: (error: unknown) => never): void;
    watch(consumer: RaphScope<any>, source: RaphWatchSource<Runtime>, phaseInput: string, callback: RaphPhaseEffect<Runtime>, options?: RaphWatchOptions): Disposer;
    _watchRegistration(consumer: RaphScope<any>, source: RaphWatchSource<Runtime>, phaseInput: string, callback: RaphPhaseEffect<Runtime>, options?: RaphWatchOptions, startPaused?: boolean, onExecutionFailure?: (error: unknown) => never, isExecutionCancelled?: () => boolean): RaphPhaseTaskRecord;
    aggregate(consumer: RaphScope<Runtime>, sources: readonly RaphAggregateSource<Runtime>[]): RaphAggregate<Runtime>;
    batch<T>(operation: () => T): T;
    _batchReactive<T>(operation: () => T): T;
    protected _batch<T>(operation: () => T, includeKernel: boolean): T;
    protected _closeBatch(operationFailed: boolean, operationError: unknown): void;
    protected _applyBatch<Args extends unknown[], Result>(operation: (...args: Args) => Result, args: ArrayLike<Args[number]>, receiver?: unknown): Result;
    action<Args extends unknown[], Result>(operation: (...args: Args) => Result, owner?: RaphScope<any>): (...args: Args) => Result;
    action<Args extends unknown[], Result>(name: string, operation: (...args: Args) => Result, owner?: RaphScope<any>): (...args: Args) => Result;
    _invokeAction<Args extends unknown[], Result>(name: string, owner: RaphScope<any>, operation: (...args: Args) => Result, args: ArrayLike<Args[number]>, receiver?: unknown): Result;
    untracked<T>(operation: () => T): T;
    _probeReads(operation: () => void): boolean;
    scope(id: string): RaphScope<Runtime>;
    node<TApi = void>(options: NodeOptions<Runtime>, setup?: (node: RaphNode<unknown, Runtime>) => TApi): RaphNode<TApi, Runtime>;
    protected _createCommittedNode<TApi>(options: NodeOptions<Runtime>, setup: ((node: RaphNode<unknown, Runtime>) => TApi) | undefined): RaphNode<TApi, Runtime>;
    getNode(id: string): RaphNode<unknown, Runtime> | undefined;
    definePhases(phases: readonly RaphPhase<Runtime>[]): void;
    addPhase(phase: RaphPhase<Runtime>): void;
    clearPhases(): void;
    requestExecution(): void;
    flush(): void;
    afterFlush(): Promise<void>;
    acquireLoop(owner: string): FrameLoopLease;
    startLoop(): void;
    stopLoop(): void;
    dispose(): void;
    _onDisposed(listener: () => void): Disposer;
    _notifyNodeStructure(node: RaphNode<unknown, any>, structure: RaphStructureCause<Runtime>, oldAncestors: readonly RaphNode<unknown, any>[], newAncestors: readonly RaphNode<unknown, any>[]): void;
    _hasNodeStructureDemand(node: RaphNode<unknown, any>): boolean;
    _hasNodeSubscribers(): boolean;
    _notifyNodeTouch(node: RaphNode<unknown, any>, metadata?: unknown): void;
    _assertNodeReparentAllowed(node: RaphNode<unknown, any>, newParent: RaphNode<unknown, any>): void;
    _releaseNode(node: RaphNode<unknown, any>): void;
    _runNodeMutation<T>(operation: () => T): T;
    _touchMutationBoundary(): void;
    _runPhaseTransition<T>(operation: () => T): T;
    _beginOwnerDisposal(node?: RaphNode<unknown, any>): void;
    _endOwnerDisposal(): void;
    _ownerDisposalCount(): number;
    _addDisposalSweeper(sweeper: RuntimeDisposalSweeper, due: number): void;
    _removeDisposalSweeper(sweeper: RuntimeDisposalSweeper): void;
    protected _sweepAfterDisposals(): void;
    _ownerDisposalActive(): boolean;
    _registerOwner(owner: RaphScope<any>): number;
    _unregisterOwner(owner: RaphScope<any>): void;
    _addTopOwner(node: RaphNode<unknown, any>): void;
    _removeTopOwner(node: RaphNode<unknown, any>): void;
    _assertOwnerRuntime(owner: RaphScope<any>): void;
    _beginKernelBatch(): void;
    _endKernelBatch(): void;
    _registerMachineDebug(registration: RaphMachineDebugRegistration): Disposer;
    _hasMachineDebug(id: string): boolean;
    _traces(kind: RaphTraceKind): boolean;
    _currentTraceCauseId(): number | undefined;
    _nextTraceOperation(kind: RaphTraceKind): number | undefined;
    _hasActiveReactiveContext(): boolean;
    _recordTrace(event: RaphTraceEventInput): void;
    _runWithTraceCause<T>(causeId: number | undefined, operation: () => T): T;
    protected _validatePhaseBinding(execution: RaphPhasePipeline, phaseInput: string, callback: RaphPhaseEffect<Runtime>, options: RaphEffectOptions | RaphWatchOptions, allowNoInitial?: boolean): RaphPhaseState;
    protected _rollbackRegistration(record: RaphPhaseTaskRecord, error: unknown, message: string, onExecutionFailure?: (error: unknown) => never): never;
    protected _liveOwnerCount(): number;
    protected _collectOwners(): RaphScope<any>[];
    protected get _execution(): RaphPhasePipeline;
    protected _syncPhaseTrace(): void;
    protected get _clock(): RaphFrameLoop;
    protected _tickFrameLoop(): void;
    protected _setFrameTick(value: number): void;
    protected _attachWritableComputed<T>(source: ReadonlySignal<T>, setter: (value: T) => void, owner: RaphScope<any>): Signal<T>;
    protected _own(disposer: Disposer, owner: RaphScope<any>): Disposer;
    protected _runTracked<T>(owner: RaphScope<any>, operation: () => T): T;
    protected _runUntracked<T>(operation: () => T): T;
    protected _runWrite<T>(operation: () => T, invalidate?: boolean): T;
    _isWriteBatchOpen(): boolean;
    _enterWrite(): void;
    _exitWrite(): void;
    _failWrite(operationError: unknown): unknown;
    protected _requestPendingExecution(): void;
    protected _executionBoundaryOpen(): boolean;
    protected _finishExecutionBoundary(): unknown[] | undefined;
    protected _clearTransientCausesIfSettled(): void;
    protected _requestExecution(): void;
    _applyObjectReadPolicy(checked: boolean): void;
    protected _assertTrackedRead(): void;
    _assertSourceReadable(owner: RaphScope<any>): void;
    protected _assertImplicitDependency(sourceOwner: RaphScope<any>, consumerOwner: RaphScope<any>): void;
    protected _assertWriteAllowed(): void;
    protected _throwCrossRuntime(owner: RaphRuntimeBase<Runtime>): never;
    protected _assertAlive(): void;
    protected _runDataBatch<T>(operation: () => T): T;
    protected _disposeDataSources(_errors: unknown[]): void;
    protected _detachDataPlane(_errors: unknown[]): void;
}
```

## src/runtime/reactivity/PathHandle.ts

Исходный модуль: `src/runtime/reactivity/PathHandle.ts`

```ts
import type { ParsedDataPath } from '../../path/data-path.types';
import type { PathEvents, PathOptions } from '../../path/path.types';
import type { RaphKernel } from '../../path/RaphKernel';
import type { RaphReactivity } from '../../reactivity/engine';
import type { Disposer, OwnedSourceHooks, ReadonlySignal } from '../../reactivity/types';
type PathSignalEngine = Pick<RaphReactivity, '_isTracking' | '_ownedSignal'>;
export declare class PathHandle<T> implements ReadonlySignal<T | undefined> {
    readonly path: string;
    readonly options: PathOptions;
    constructor(store: RaphKernel, parsed: ParsedDataPath, options: PathOptions, release: (handle: PathHandle<unknown>) => void, signals: PathSignalEngine, assertOwnerAlive?: () => void, assertTrackedRead?: () => void, assertWriteAllowed?: () => void, runWrite?: <Result>(operation: () => Result) => Result, sourceHooks?: OwnedSourceHooks, notifyEvents?: (events: PathEvents, hasReactiveSubscribers: boolean) => void);
    get disposed(): boolean;
    get(): T | undefined;
    peek(): T | undefined;
    set(value: T): void;
    merge(value: Partial<T>): void;
    delete(): void;
    has(): boolean;
    dispose(): void;
    _getTracked(): T | undefined;
    _activate(): Disposer;
}
export {};
```

## src/runtime/reactivity/RaphMetaSource.ts

Исходный модуль: `src/runtime/reactivity/RaphMetaSource.ts`

```ts
import type { RaphMetaWatchOptions } from '../../path/meta/meta.types';
import type { DataPathDef } from '../../path/path.types';
import type { Disposer } from '../../reactivity/types';
import type { RaphScope } from '../ownership/RaphScope';
export type RaphMetaSourceOptions = RaphMetaWatchOptions;
export declare class RaphMetaSource {
    readonly owner: RaphScope<any>;
    readonly masks: DataPathDef | readonly DataPathDef[];
    readonly options: Readonly<RaphMetaSourceOptions>;
    static _create(owner: RaphScope<any>, masks: DataPathDef | readonly DataPathDef[], options: RaphMetaSourceOptions, start: () => Disposer, release: () => void): RaphMetaSource;
    get runtime(): any;
    get disposed(): boolean;
    dispose(): void;
    _bindOwner(release: Disposer): void;
    _disposeOwned(): void;
    _activate(): Disposer;
    _assertAlive(): void;
}
```

## src/runtime/reactivity/RaphSelector.ts

Исходный модуль: `src/runtime/reactivity/RaphSelector.ts`

```ts
import type { OwnedSourceEntry } from '../../reactivity/scope';
import type { RaphScope } from '../ownership/RaphScope';
import type { RuntimeDisposalSweeper, RuntimeSignalWriteTap } from './runtime-reactivity.types';
import type { RuntimeReactivity, RuntimeSignal } from './RuntimeReactivity';
export interface RaphSelectorOptions<Key> {
    readonly equals?: (key: Key, value: Key) => boolean;
}
export type RaphSelector<Key> = (key: Key) => boolean;
export interface RuntimeSelectorDescription {
    readonly owner: string;
    readonly triggers: number;
    readonly disposed: boolean;
}
export declare class RuntimeSelector<Key> implements OwnedSourceEntry, RuntimeSignalWriteTap, RuntimeDisposalSweeper {
    readonly select: RaphSelector<Key>;
    _previousSource: OwnedSourceEntry | undefined;
    _trackedKey: Key | undefined;
    _tapSlot: number;
    _sweepSlot: number;
    _sweepDue: number;
    constructor(owner: RaphScope<any>, reactivity: RuntimeReactivity, source: RuntimeSignal<Key>, equals: ((key: Key, value: Key) => boolean) | undefined);
    get [Symbol.toStringTag](): string;
    toJSON(): RuntimeSelectorDescription;
    get _tapOwner(): RaphScope<any>;
    _debugTriggerCount(): number;
    _test(key: Key): boolean;
    _observesWrites(): boolean;
    _inspect(): RaphSelectorInspection<Key> | undefined;
    _afterSourceWrite(previous: unknown, value: unknown): void;
    _afterOwnerDisposals(disposals: number): number;
    _edgeDetached(key: Key): void;
    _findConsumerOwner<Context>(accept: (consumerOwner: object, context: Context) => boolean, context: Context): object | undefined;
    _finalizeSource(): boolean;
    _sweep(disposals?: number): void;
}
export interface RaphSelectorInspection<Key> {
    readonly read: () => Key;
    readonly test: (key: Key) => boolean;
}
export declare function inspectSelector<Key>(select: unknown): RaphSelectorInspection<Key> | undefined;
```

## src/runtime/reactivity/RaphWorkGraph.ts

Исходный модуль: `src/runtime/reactivity/RaphWorkGraph.ts`

```ts
import type { Disposer, OwnedSourceHooks } from '../../reactivity/types';
import type { RaphNode } from '../ownership/RaphNode';
import type { RaphScope } from '../ownership/RaphScope';
import type { RaphAggregateSource, RaphStructureCause, RaphWatchInclude, RaphWatchSource, RaphWorkCause, RaphWorkCauseKind } from '../phases/phase.types';
import type { RaphRuntime } from '../RaphRuntime';
import type { RaphRuntimeBase } from '../RaphRuntimeBase';
type WorkSink = (cause: RaphWorkCause<any>, key: object, schedule: boolean) => void;
type WorkEdgeSource = RaphProducer | RaphNode<unknown, any> | RaphRuntimeBase<any>;
interface WorkEdge {
    readonly sink: WorkSink;
    readonly kind: 'producer' | 'runtime' | 'self' | 'subtree';
    source?: WorkEdgeSource;
    activationRelease?: Disposer;
    previous?: WorkEdge;
    next?: WorkEdge;
}
interface WorkEdgeList {
    first?: WorkEdge;
    last?: WorkEdge;
}
type CleanupSource = RaphProducer | RaphNode<unknown, any> | RaphAggregate<any>;
interface CleanupEdge {
    cleanup?: () => void;
    source?: CleanupSource;
    previous?: CleanupEdge;
    next?: CleanupEdge;
}
interface CleanupEdgeList {
    first?: CleanupEdge;
    last?: CleanupEdge;
}
interface AggregateSubscription {
    dispose?: (finalCause?: RaphWorkCause<any>) => void;
    aggregate?: RaphAggregate<any>;
    previous?: AggregateSubscription;
    next?: AggregateSubscription;
}
interface ProducerOptions {
    readonly includeRuntime?: boolean;
}
export type RaphProducerKind = Extract<RaphWorkCauseKind, 'frame' | 'path' | 'producer'>;
export interface RaphProducerDescription {
    readonly kind: RaphProducerKind;
    readonly owner: string;
    readonly revision: number;
    readonly disposed: boolean;
}
export declare class RaphProducer {
    readonly owner: RaphScope<any>;
    readonly kind: RaphProducerKind;
    readonly includeRuntime: boolean;
    subscribers: WorkEdgeList | undefined;
    memberships: CleanupEdgeList | undefined;
    implicitConsumers: Map<RaphNode<unknown, any>, number> | undefined;
    source: RaphWatchSource<any> | undefined;
    activate: (() => void | Disposer) | undefined;
    runtimeActivation: Disposer | undefined;
    lastCause: RaphWorkCause<any> | undefined;
    transientNext: RaphProducer | undefined;
    revision: number;
    disposed: boolean;
    readonly _isProducer: boolean;
    constructor(owner: RaphScope<any>, kind: RaphProducerKind, includeRuntime: boolean);
    get runtime(): RaphRuntimeBase<any>;
    get [Symbol.toStringTag](): string;
    toJSON(): RaphProducerDescription;
}
export declare class RaphAggregate<Runtime extends RaphRuntimeBase<Runtime> = RaphRuntime> {
    readonly owner: RaphScope<Runtime>;
    static _create<OwnerRuntime extends RaphRuntimeBase<OwnerRuntime>>(owner: RaphScope<OwnerRuntime>, sources: readonly RaphAggregateSource<OwnerRuntime>[]): RaphAggregate<OwnerRuntime>;
    get runtime(): Runtime;
    get disposed(): boolean;
    get sources(): readonly RaphAggregateSource<Runtime>[];
    dispose(): void;
    _assertAlive(): void;
    _bindOwner(release: () => void): void;
    _bindMembers(releases: Array<() => void>): void;
    _removeMember(identity: object): void;
    _disposeOwned(): void;
    _linkSubscription(dispose: (finalCause?: RaphWorkCause<any>) => void): () => void;
    _linkDependent(edge: CleanupEdge): void;
    _detachDependent(edge: CleanupEdge): void;
    _disposalCause(): RaphWorkCause<any>;
    _detachSubscription(subscription: AggregateSubscription): void;
}
export declare class RaphWorkGraph {
    static _valueCauseShapeAnchor: RaphWorkCause<any>;
    constructor(_runtime: RaphRuntimeBase<any>);
    createProducer(owner: RaphScope<any>, kind?: RaphProducerKind, options?: ProducerOptions): RaphProducer;
    attachProducer<T extends object>(record: RaphProducer, source: T): T;
    setProducerActivation(record: RaphProducer, activate: () => void | Disposer, activateForRuntime?: boolean): void;
    producerHooks(record: RaphProducer): OwnedSourceHooks;
    causeForToken(token: unknown): RaphWorkCause<any> | undefined;
    clearTransientCauses(): void;
    notifyProducer(record: RaphProducer, previous?: unknown, value?: unknown, events?: RaphWorkCause<any>['events'], schedule?: boolean, hasReactiveSubscribers?: boolean, includeValues?: boolean): void;
    _notifyValueWrite(record: RaphProducer, previous: unknown, value: unknown, hasReactiveSubscribers: boolean): void;
    notifyProducerEvents(record: RaphProducer, events: NonNullable<RaphWorkCause<any>['events']>, schedule?: boolean, hasReactiveSubscribers?: boolean): void;
    _hasStructuralDemand(node: RaphNode<unknown, any>): boolean;
    _hasNodeSubscribers(): boolean;
    notifyNode(node: RaphNode<unknown, any>, kind: Extract<RaphWorkCauseKind, 'structure' | 'touch'>, options?: {
        readonly metadata?: unknown;
        readonly structure?: RaphStructureCause<any>;
        readonly oldAncestors?: readonly RaphNode<unknown, any>[];
        readonly newAncestors?: readonly RaphNode<unknown, any>[];
    }): void;
    createAggregate<OwnerRuntime extends RaphRuntimeBase<any>>(owner: RaphScope<OwnerRuntime>, sources: readonly RaphAggregateSource<OwnerRuntime>[]): RaphAggregate<OwnerRuntime>;
    subscribe(input: RaphWatchSource<any>, include: RaphWatchInclude | undefined, sink: WorkSink): () => void;
    assertSubscriptionAllowed(consumer: RaphScope<any>, input: RaphWatchSource<any>): void;
    assertReparentAllowed(node: RaphNode<unknown, any>, newParent: RaphNode<unknown, any>): void;
    releaseNode(node: RaphNode<unknown, any>): void;
    dispose(): void;
    _disposeProducer(record: RaphProducer, hasReactiveSubscribers?: boolean): void;
    _linkImplicitDependency(record: RaphProducer, consumerOwner: object): (() => void) | undefined;
}
export {};
```

## src/runtime/reactivity/runtime-reactivity.types.ts

Исходный модуль: `src/runtime/reactivity/runtime-reactivity.types.ts`

```ts
import type { ReactiveEdge, ReactiveNode } from '../../reactivity/types';
import type { RaphScope } from '../ownership/RaphScope';
export interface RuntimeSignalLifecycle {
    owner: object | undefined;
    assertWriteAllowed?: () => void;
    assertDependencyAllowed: (sourceOwner: RaphScope<any>, consumerOwner: RaphScope<any>) => void;
    throwDisposed: () => never;
    throwCrossRuntime: (owner: object) => never;
}
export interface ReleasedGraphShapes {
    readonly source: ReactiveNode;
    readonly written: ReactiveNode;
    readonly edge: ReactiveEdge;
    readonly consumer: ReactiveNode;
    readonly counter: ReactiveNode<number>;
    readonly bumped: ReactiveNode<number>;
}
export interface RuntimeDisposalSweeper {
    _sweepSlot: number;
    _sweepDue: number;
    _afterOwnerDisposals: (disposals: number) => number;
}
export interface RuntimeSignalWriteTap {
    _tapSlot: number;
    readonly _tapOwner: object;
    _observesWrites: () => boolean;
    _afterSourceWrite: (previous: unknown, value: unknown) => void;
}
```
