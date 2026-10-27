---
description: "TypeScript-декларации @raphy-js/raph 1.0.1-dev.54, группа api; исходных модулей: 4."
---

# @raphy-js/raph: api

Версия source: 1.0.1-dev.54. [Каталог package](./). Repository: https://gitlab.com/raphyjs/raphy-js-raph (закрыт, canonical). Публичные declarations — [@raphy-js/raph@1.0.1-dev.54 в npm](https://unpkg.com/@raphy-js/raph@1.0.1-dev.54/).

## src/api/errors.ts

Исходный модуль: `src/api/errors.ts`

```ts
export declare class RaphError extends Error {
}
export declare class RaphConfigurationError extends RaphError {
}
export declare class RaphCapabilityError extends RaphConfigurationError {
}
export declare class RaphDefaultInstanceError extends RaphConfigurationError {
}
export declare class RaphFacadeDisposedError extends RaphConfigurationError {
}
```

## src/api/Raph.ts

Исходный модуль: `src/api/Raph.ts`

```ts
import type { DerivedOptions, RaphDerivedHandle } from '../path/derived/RaphDerivedHandle';
import type { DataPathDef, PathOptions } from '../path/path.types';
import type { RaphKernel, RaphKernelOptions, RaphKernelRoot } from '../path/RaphKernel';
import type { ScopeNode } from '../reactivity/scope';
import type { Disposer, ReadonlySignal, Signal, WatchOptions, WatchSource, WatchValue, WritableComputedOptions } from '../reactivity/types';
import type { RaphRuntimeDebug } from '../runtime/diagnostics/RaphDebug';
import type { NodeOptions, RaphNode } from '../runtime/ownership/RaphNode';
import type { RaphScope } from '../runtime/ownership/RaphScope';
import type { FrameLoopLease, RaphAggregateSource, RaphEffectOptions, RaphPhase, RaphPhaseEffect, RaphWatchOptions, RaphWatchSource } from '../runtime/phases/phase.types';
import type { RaphRuntimeMeta, RaphRuntimeOptions } from '../runtime/RaphRuntime';
import type { PathHandle } from '../runtime/reactivity/PathHandle';
import type { RaphAggregate } from '../runtime/reactivity/RaphWorkGraph';
import type { ConfiguredRaph, RaphFlatConfigureOptions, RaphInstance, RaphInstanceDefinitions, RaphInstancesConfigureOptions, RaphReactivityInstanceOptions, StrictRaphConfigureOptions } from './types';
import { collectionByKey, filterByKey, full } from '../path/derived/derived-strategy.utils';
import { RaphRuntime } from '../runtime/RaphRuntime';
import { RaphReactivityInstance } from './RaphReactivityInstance';
type WithoutRuntimePathHandle<Source> = Source extends PathHandle<unknown> ? never : Source extends readonly unknown[] ? {
    [Key in keyof Source]: Source[Key] extends PathHandle<unknown> ? never : Source[Key];
} : Source;
export declare class Raph {
    static get configured(): boolean;
    static get defaultInstanceId(): string | undefined;
    static get kernel(): RaphKernel;
    static get meta(): RaphRuntimeMeta;
    static get debug(): RaphRuntimeDebug;
    static get root(): RaphNode;
    static get rootScope(): RaphScope;
    static get frameTick(): ReadonlySignal<number>;
    static get frame(): RaphRuntime['frame'];
    static get phases(): readonly RaphPhase[];
    static get loopEnabled(): boolean;
    static configure<const Definitions extends RaphInstanceDefinitions>(options: StrictRaphConfigureOptions<RaphInstancesConfigureOptions<Definitions>>): ConfiguredRaph<RaphInstancesConfigureOptions<Definitions>>;
    static configure<const Options extends RaphFlatConfigureOptions>(options: StrictRaphConfigureOptions<Options>): ConfiguredRaph<Options>;
    static reset(): void;
    static instance(id?: string): RaphInstance;
    static getInstance(id: string): RaphInstance | undefined;
    static hasInstance(id: string): boolean;
    static disposeInstance(id: string): boolean;
    static runtime(id?: string): RaphRuntime;
    static reactivity(id?: string): RaphReactivityInstance;
    static createRuntime(options?: RaphRuntimeOptions): RaphRuntime;
    static createReactivity(options?: RaphReactivityInstanceOptions): RaphReactivityInstance;
    static createKernel(options?: RaphKernelOptions): RaphKernel;
    static signal<T>(value: T): Signal<T>;
    static reactive<T extends object>(value: T): T;
    static computed<T>(getter: () => T): ReadonlySignal<T>;
    static computed<T>(options: WritableComputedOptions<T>): Signal<T>;
    static effect(callback: () => void | Disposer): Disposer;
    static effect(phase: string, callback: RaphPhaseEffect, options?: RaphEffectOptions): Disposer;
    static watch<Source extends WatchSource | readonly WatchSource[]>(source: Source & WithoutRuntimePathHandle<Source>, callback: (value: WatchValue<Source>, previous: WatchValue<Source> | undefined) => void | Disposer, options?: WatchOptions): Disposer;
    static watch(source: RaphWatchSource, phase: string, callback: RaphPhaseEffect, options?: RaphWatchOptions): Disposer;
    static batch<T>(operation: () => T): T;
    static untracked<T>(operation: () => T): T;
    static scope(): ScopeNode;
    static scope(id: string): RaphScope;
    static action<Args extends unknown[], Result>(operation: (...args: Args) => Result): (...args: Args) => Result;
    static action<Args extends unknown[], Result>(name: string, operation: (...args: Args) => Result): (...args: Args) => Result;
    static definePhases(phases: readonly RaphPhase[]): void;
    static addPhase(phase: RaphPhase): void;
    static clearPhases(): void;
    static requestExecution(): void;
    static flush(): void;
    static afterFlush(): Promise<void>;
    static acquireLoop(owner: string): FrameLoopLease;
    static startLoop(): void;
    static stopLoop(): void;
    static aggregate(sources: readonly RaphAggregateSource[]): RaphAggregate;
    static node<TApi = void>(options: NodeOptions, setup?: (node: RaphNode) => TApi): RaphNode<TApi>;
    static getNode(id: string): RaphNode | undefined;
    static derive<TSource, TTarget>(options: DerivedOptions<TSource, TTarget>): RaphDerivedHandle<TSource, TTarget>;
    static getDerivedSnapshot(): ReturnType<RaphKernel['getDerivedSnapshot']>;
    static path<T>(path: DataPathDef, options?: PathOptions): PathHandle<T>;
    static get<T = RaphKernelRoot>(): T | undefined;
    static get<T = unknown>(path: DataPathDef, options?: PathOptions): T | undefined;
    static peek<T = RaphKernelRoot>(): T | undefined;
    static peek<T = unknown>(path: DataPathDef, options?: PathOptions): T | undefined;
    static has(path: DataPathDef, options?: PathOptions): boolean;
    static set<T>(path: DataPathDef, value: T, options?: PathOptions): void;
    static merge(path: DataPathDef, value: unknown, options?: PathOptions): void;
    static delete(path: DataPathDef, options?: PathOptions): void;
    static readonly Scheduler: Readonly<{
        readonly AnimationFrame: "animationFrame";
        readonly Microtask: "microtask";
        readonly Sync: "sync";
    }>;
    static readonly DerivedStrategy: Readonly<{
        full: typeof full;
        collectionByKey: typeof collectionByKey;
        filterByKey: typeof filterByKey;
    }>;
}
export {};
```

## src/api/RaphReactivityInstance.ts

Исходный модуль: `src/api/RaphReactivityInstance.ts`

```ts
import type { Disposer, ReadonlySignal, Signal, WatchCallback, WatchOptions, WatchSource, WritableComputedOptions } from '../reactivity/types';
import type { RaphReactivityInstanceOptions } from './types';
import { RaphReactivity } from '../reactivity/engine';
import { ScopeNode } from '../reactivity/scope';
export declare class RaphReactivityInstance {
    readonly id: string;
    readonly mode: "reactivity";
    readonly engine: RaphReactivity;
    readonly rootScope: ScopeNode;
    constructor(id: string, options?: Omit<RaphReactivityInstanceOptions, 'id'>);
    get disposed(): boolean;
    signal<T>(value: T): Signal<T>;
    reactive<T extends object>(value: T): T;
    computed<T>(getter: () => T): ReadonlySignal<T>;
    computed<T>(options: WritableComputedOptions<T>): Signal<T>;
    effect(callback: () => void | Disposer): Disposer;
    watch<S extends WatchSource | readonly WatchSource[]>(source: S, callback: WatchCallback<S>, options?: WatchOptions): Disposer;
    batch<T>(operation: () => T): T;
    untracked<T>(operation: () => T): T;
    scope(): ScopeNode;
    dispose(): void;
    _onDisposed(listener: () => void): Disposer;
}
```

## src/api/types.ts

Исходный модуль: `src/api/types.ts`

```ts
import type { RaphKernel } from '../path/RaphKernel';
import type { RaphReactivity } from '../reactivity/engine';
import type { ScopeNode } from '../reactivity/scope';
import type { Disposer } from '../reactivity/types';
import type { RaphNode } from '../runtime/ownership/RaphNode';
import type { RaphScope } from '../runtime/ownership/RaphScope';
import type { RaphAggregateSource, RaphEffectOptions, RaphPhase, RaphPhaseEffect, RaphWatchOptions, RaphWatchSource } from '../runtime/phases/phase.types';
import type { RaphRuntime, RaphRuntimeOptions } from '../runtime/RaphRuntime';
import type { RaphAggregate } from '../runtime/reactivity/RaphWorkGraph';
import type { RaphReactivityInstance } from './RaphReactivityInstance';
export interface RaphReactiveApi {
    readonly signal: RaphReactivity['signal'];
    readonly reactive: RaphReactivity['reactive'];
    readonly computed: RaphReactivity['computed'];
    readonly batch: RaphReactivity['batch'];
    readonly untracked: RaphReactivity['untracked'];
}
export interface RaphReactivityApi extends RaphReactiveApi {
    readonly effect: RaphReactivity['effect'];
    readonly watch: RaphReactivity['watch'];
    readonly scope: () => ScopeNode;
}
interface RaphFacadeAction {
    <Args extends unknown[], Result>(operation: (...args: Args) => Result): (...args: Args) => Result;
    <Args extends unknown[], Result>(name: string, operation: (...args: Args) => Result): (...args: Args) => Result;
}
export interface RaphRuntimeApi extends RaphReactiveApi {
    readonly acquireLoop: RaphRuntime['acquireLoop'];
    readonly action: RaphFacadeAction;
    readonly addPhase: RaphRuntime['addPhase'];
    readonly afterFlush: RaphRuntime['afterFlush'];
    readonly aggregate: (sources: readonly RaphAggregateSource[]) => RaphAggregate;
    readonly clearPhases: RaphRuntime['clearPhases'];
    readonly debug: RaphRuntime['debug'];
    readonly definePhases: RaphRuntime['definePhases'];
    readonly delete: RaphRuntime['delete'];
    readonly derive: RaphRuntime['derive'];
    readonly effect: (phase: string, callback: RaphPhaseEffect, options?: RaphEffectOptions) => Disposer;
    readonly flush: RaphRuntime['flush'];
    readonly frame: RaphRuntime['frame'];
    readonly frameTick: RaphRuntime['frameTick'];
    readonly get: RaphRuntime['get'];
    readonly getDerivedSnapshot: RaphRuntime['getDerivedSnapshot'];
    readonly getNode: RaphRuntime['getNode'];
    readonly has: RaphRuntime['has'];
    readonly kernel: RaphKernel;
    readonly loopEnabled: boolean;
    readonly merge: RaphRuntime['merge'];
    readonly meta: RaphRuntime['meta'];
    readonly node: RaphRuntime['node'];
    readonly path: RaphRuntime['path'];
    readonly peek: RaphRuntime['peek'];
    readonly phases: RaphRuntime['phases'];
    readonly requestExecution: RaphRuntime['requestExecution'];
    readonly root: RaphNode;
    readonly rootScope: RaphScope;
    readonly scope: (id: string) => RaphScope;
    readonly set: RaphRuntime['set'];
    readonly startLoop: RaphRuntime['startLoop'];
    readonly stopLoop: RaphRuntime['stopLoop'];
    readonly watch: (source: RaphWatchSource, phase: string, callback: RaphPhaseEffect, options?: RaphWatchOptions) => Disposer;
}
export type RaphInstance = RaphRuntime | RaphReactivityInstance;
export type RaphInstanceMode = 'reactivity' | 'runtime';
export interface RaphReactivityInstanceOptions {
    readonly adaptiveDependencyIndex?: boolean;
    readonly id?: string;
}
export type RaphRuntimeConfigureOptions = Omit<RaphRuntimeOptions, 'id'> & {
    readonly default?: never;
    readonly id?: string;
    readonly instances?: never;
    readonly mode?: 'runtime';
    readonly phases?: readonly RaphPhase[];
};
export type RaphReactivityConfigureOptions = Omit<RaphReactivityInstanceOptions, 'id'> & {
    readonly default?: never;
    readonly id?: string;
    readonly instances?: never;
    readonly mode: 'reactivity';
};
export type RaphFlatConfigureOptions = RaphReactivityConfigureOptions | RaphRuntimeConfigureOptions;
export type RaphRuntimeInstanceDefinition = Omit<RaphRuntimeOptions, 'id'> & {
    readonly default?: boolean;
    readonly id?: string;
    readonly mode: 'runtime';
    readonly phases?: readonly RaphPhase[];
};
export type RaphReactivityInstanceDefinition = Omit<RaphReactivityInstanceOptions, 'id'> & {
    readonly default?: boolean;
    readonly id?: string;
    readonly mode: 'reactivity';
};
export type RaphInstanceDefinition = RaphReactivityInstanceDefinition | RaphRuntimeInstanceDefinition;
export type RaphInstanceDefinitions = Readonly<Record<string, RaphInstanceDefinition>>;
export interface RaphInstancesConfigureOptions<Definitions extends RaphInstanceDefinitions = RaphInstanceDefinitions> {
    readonly adaptiveDependencyIndex?: never;
    readonly default?: never;
    readonly enforceActions?: never;
    readonly id?: never;
    readonly instances: Definitions;
    readonly kernel?: never;
    readonly mode?: never;
    readonly phases?: never;
    readonly scheduler?: never;
}
export type RaphConfigureOptions = RaphFlatConfigureOptions | RaphInstancesConfigureOptions;
type InvalidInstanceDefinitionKeys<Definitions extends RaphInstanceDefinitions> = {
    [Key in keyof Definitions]: Exclude<keyof Definitions[Key], Definitions[Key] extends {
        readonly mode: 'reactivity';
    } ? keyof RaphReactivityInstanceDefinition : keyof RaphRuntimeInstanceDefinition>;
}[keyof Definitions];
type StrictInstancesConfigureOptions<Options, Definitions extends RaphInstanceDefinitions> = Exclude<keyof Options, keyof RaphInstancesConfigureOptions> extends never ? InvalidInstanceDefinitionKeys<Definitions> extends never ? Options : never : never;
export type StrictRaphConfigureOptions<Options extends RaphConfigureOptions> = Options extends {
    readonly instances: infer Definitions extends RaphInstanceDefinitions;
} ? StrictInstancesConfigureOptions<Options, Definitions> : Options extends {
    readonly mode: 'reactivity';
} ? Options & Record<Exclude<keyof Options, keyof RaphReactivityConfigureOptions>, never> : Options & Record<Exclude<keyof Options, keyof RaphRuntimeConfigureOptions>, never>;
type DefinitionInstance<Definition> = Definition extends {
    readonly mode: 'reactivity';
} ? RaphReactivityInstance : RaphRuntime;
type ResolvedDefinitionId<Key, Definition> = Definition extends {
    readonly id: infer Id extends string;
} ? Id : Key extends string ? Key : never;
type InstancesFromDefinitions<Definitions extends RaphInstanceDefinitions> = {
    [Key in keyof Definitions as ResolvedDefinitionId<Key, Definitions[Key]>]: DefinitionInstance<Definitions[Key]>;
};
export type RaphInstanceMapForConfigure<Options extends RaphConfigureOptions> = Options extends {
    readonly instances: infer Definitions extends RaphInstanceDefinitions;
} ? InstancesFromDefinitions<Definitions> : Options extends RaphFlatConfigureOptions ? Record<Options extends {
    readonly id: infer Id extends string;
} ? Id : 'default', DefinitionInstance<Options>> : never;
type DefaultFromDefinitions<Definitions extends RaphInstanceDefinitions> = {
    [Key in keyof Definitions]: Definitions[Key] extends {
        readonly default: true;
    } ? DefinitionInstance<Definitions[Key]> : never;
}[keyof Definitions];
export type RaphDefaultInstanceForConfigure<Options extends RaphConfigureOptions> = Options extends {
    readonly instances: infer Definitions extends RaphInstanceDefinitions;
} ? DefaultFromDefinitions<Definitions> : Options extends RaphFlatConfigureOptions ? DefinitionInstance<Options> : never;
type RuntimeIds<Instances extends Record<string, RaphInstance>> = {
    [Id in keyof Instances]: Instances[Id] extends RaphRuntime ? Id : never;
}[keyof Instances] & string;
type ReactivityIds<Instances extends Record<string, RaphInstance>> = {
    [Id in keyof Instances]: Instances[Id] extends RaphReactivityInstance ? Id : never;
}[keyof Instances] & string;
export interface ConfiguredRaphRegistry<Instances extends Record<string, RaphInstance>> {
    readonly configured: true;
    readonly defaultInstanceId: keyof Instances & string | undefined;
    createReactivity: (options?: RaphReactivityInstanceOptions) => RaphReactivityInstance;
    createKernel: (options?: ConstructorParameters<typeof import('../path/RaphKernel').RaphKernel>[0]) => RaphKernel;
    createRuntime: (options?: RaphRuntimeOptions) => RaphRuntime;
    disposeInstance: <Id extends keyof Instances & string>(id: Id) => boolean;
    getInstance: <Id extends keyof Instances & string>(id: Id) => Instances[Id] | undefined;
    hasInstance: <Id extends keyof Instances & string>(id: Id) => boolean;
    instance: <Id extends keyof Instances & string>(id: Id) => Instances[Id];
    reactivity: <Id extends ReactivityIds<Instances>>(id: Id) => Extract<Instances[Id], RaphReactivityInstance>;
    runtime: <Id extends RuntimeIds<Instances>>(id: Id) => Extract<Instances[Id], RaphRuntime>;
}
type RuntimeDefaultFacadeApi<DefaultInstance extends RaphRuntime> = RaphRuntimeApi & {
    instance: () => DefaultInstance;
    runtime: () => DefaultInstance;
};
type ReactivityDefaultFacadeApi<DefaultInstance extends RaphReactivityInstance> = RaphReactivityApi & {
    instance: () => DefaultInstance;
    reactivity: () => DefaultInstance;
};
type DefaultFacadeApi<DefaultInstance extends RaphInstance> = [
    DefaultInstance
] extends [
    never
] ? object : DefaultInstance extends RaphRuntime ? RuntimeDefaultFacadeApi<DefaultInstance> : DefaultInstance extends RaphReactivityInstance ? ReactivityDefaultFacadeApi<DefaultInstance> : object;
export type ConfiguredRaph<Options extends RaphConfigureOptions> = ConfiguredRaphRegistry<RaphInstanceMapForConfigure<Options>> & DefaultFacadeApi<RaphDefaultInstanceForConfigure<Options>>;
export {};
```
