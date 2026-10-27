---
description: "TypeScript-декларации @raphy-js/raph 1.0.1-dev.54, группа machine; исходных модулей: 6."
---

# @raphy-js/raph: machine

Версия source: 1.0.1-dev.54. [Каталог package](./). Repository: https://gitlab.com/raphyjs/raphy-js-raph (закрыт, canonical). Публичные declarations — [@raphy-js/raph@1.0.1-dev.54 в npm](https://unpkg.com/@raphy-js/raph@1.0.1-dev.54/).

## src/machine/compiler.ts

Исходный модуль: `src/machine/compiler.ts`

```ts
import type { MachineConfig, MachineEvent, MachineGuardRef, MachineInvokeConfig, MachineMigration, MachineModel, MachineOutputRef, MachineReducerRef } from './types';
export type CompiledStateKind = 'atomic' | 'compound' | 'final' | 'history' | 'parallel';
export interface CompiledTransition {
    readonly emit: readonly MachineOutputRef<unknown, MachineEvent, unknown>[];
    readonly guard?: MachineGuardRef<unknown, MachineEvent, unknown>;
    readonly index: number;
    readonly raise?: MachineEvent | ((args: {
        readonly context: Readonly<unknown>;
        readonly event: MachineEvent;
        readonly input: unknown;
    }) => MachineEvent);
    readonly reason?: string;
    readonly reduce: readonly MachineReducerRef<unknown, MachineEvent, unknown>[];
    readonly reenter: boolean;
    readonly source: number;
    readonly target?: number;
}
export interface CompiledInvoke {
    readonly id: string;
    readonly input?: MachineInvokeConfig<unknown, MachineEvent, unknown>['input'];
    readonly onDone: readonly CompiledTransition[];
    readonly onError: readonly CompiledTransition[];
    readonly src: MachineInvokeConfig<unknown, MachineEvent, unknown>['src'];
    readonly type: 'machine' | 'task';
}
export interface CompiledState {
    readonly after: ReadonlyMap<string, readonly CompiledTransition[]>;
    readonly always: readonly CompiledTransition[];
    readonly children: readonly number[];
    readonly depth: number;
    readonly entry: readonly MachineOutputRef<unknown, MachineEvent, unknown>[];
    readonly exit: readonly MachineOutputRef<unknown, MachineEvent, unknown>[];
    readonly history: 'deep' | 'shallow';
    readonly historyFallback?: number;
    readonly id: number;
    readonly initial?: number;
    readonly invokes: readonly CompiledInvoke[];
    readonly key: string;
    readonly kind: CompiledStateKind;
    readonly meta?: Readonly<Record<string, unknown>>;
    readonly on: ReadonlyMap<string, readonly CompiledTransition[]>;
    readonly onDone: readonly CompiledTransition[];
    readonly output?: unknown | ((args: {
        readonly context: Readonly<unknown>;
        readonly event: MachineEvent;
        readonly input: unknown;
    }) => unknown);
    readonly parent?: number;
    readonly path: string;
    readonly resources: readonly string[];
    readonly tags: readonly string[];
}
export interface CompiledMachine {
    readonly ancestry: readonly (readonly number[])[];
    readonly context: MachineConfig<unknown, MachineEvent, unknown, unknown>['context'];
    readonly eventIndexes: ReadonlyMap<string, number>;
    readonly eventTypes: readonly string[];
    readonly flat: boolean;
    readonly flatDispatch?: readonly (readonly CompiledTransition[] | undefined)[];
    readonly id: string;
    readonly initial: number;
    readonly migrations: ReadonlyMap<number, MachineMigration>;
    readonly output?: MachineConfig<unknown, MachineEvent, unknown, unknown>['output'];
    readonly pathToState: ReadonlyMap<string, number>;
    readonly rootChildren: readonly number[];
    readonly states: readonly CompiledState[];
    readonly version: number;
}
export declare function defineMachine<Context, Event extends MachineEvent, Input = void, Output = unknown>(config: MachineConfig<Context, Event, Input, Output>): MachineModel<Context, Event, Input, Output>;
export declare function getCompiledMachine(model: MachineModel<unknown, MachineEvent, unknown, unknown>): CompiledMachine;
```

## src/machine/core.ts

Исходный модуль: `src/machine/core.ts`

```ts
import type { CompiledMachine, CompiledTransition } from './compiler';
import type { MachineBindings, MachineEvent, MachineModel, MachineOutputRef, MachineSnapshot, PersistedMachineSnapshot } from './types';
export interface MachineEvaluationHooks {
    readonly guard?: (name: string, passed: boolean, context: Readonly<Record<string, unknown>> | undefined) => void;
    readonly transition?: (details: {
        readonly reason?: string;
        readonly source: string;
        readonly target?: string;
    }) => void;
}
export interface MachineEffectPlan {
    readonly entered: readonly number[];
    readonly entryOutputs: readonly PlannedOutput[];
    readonly event: MachineEvent;
    readonly exited: readonly number[];
    readonly exitOutputs: readonly PlannedOutput[];
    readonly transitionOutputRefs?: readonly MachineOutputRef<unknown, MachineEvent, unknown>[];
    readonly transitionOutputs: readonly PlannedOutput[];
}
export interface PlannedOutput {
    readonly event: MachineEvent;
    readonly ref: MachineOutputRef<unknown, MachineEvent, unknown>;
}
export interface MachineMacrostepResult<Context, Output> {
    readonly changed: boolean;
    readonly plan: MachineEffectPlan;
    readonly snapshot: MachineSnapshot<Context, Output>;
}
export declare function getInitialSnapshot<Context, Event extends MachineEvent, Input, Output>(model: MachineModel<Context, Event, Input, Output>, input?: Input): MachineSnapshot<Context, Output>;
export declare function transition<Context, Event extends MachineEvent, Input, Output>(model: MachineModel<Context, Event, Input, Output>, snapshot: MachineSnapshot<Context, Output>, event: Event, bindings?: MachineBindings<Context, Event, Input>, hooks?: MachineEvaluationHooks): MachineSnapshot<Context, Output>;
export declare function assertMachineSnapshot(model: MachineModel<unknown, MachineEvent, unknown, unknown>, snapshot: MachineSnapshot<unknown>): void;
export declare function stopMachineSnapshot<Context, Event extends MachineEvent, Input, Output>(model: MachineModel<Context, Event, Input, Output>, snapshot: MachineSnapshot<Context, Output>): MachineSnapshot<Context, Output>;
export declare function createInitialSnapshot<Context, Event extends MachineEvent, Input, Output>(model: MachineModel<Context, Event, Input, Output>, input: Input, bindings: MachineBindings<Context, Event, Input> | undefined, hooks?: MachineEvaluationHooks): MachineMacrostepResult<Context, Output>;
export declare function runMacrostep<Context, Event extends MachineEvent, Input, Output>(model: MachineModel<Context, Event, Input, Output>, snapshot: MachineSnapshot<Context, Output>, event: Event, bindings: MachineBindings<Context, Event, Input> | undefined, input: Input, hooks?: MachineEvaluationHooks, compiledInput?: CompiledMachine, stabilizeOnly?: boolean, initialRaised?: readonly MachineEvent[]): MachineMacrostepResult<Context, Output>;
export declare function runValidatedMacrostep<Context, Event extends MachineEvent, Input, Output>(model: MachineModel<Context, Event, Input, Output>, snapshot: MachineSnapshot<Context, Output>, event: Event, bindings: MachineBindings<Context, Event, Input> | undefined, input: Input, hooks?: MachineEvaluationHooks, compiledInput?: CompiledMachine, flatEventId?: number, stabilizeOnly?: boolean, initialRaised?: readonly MachineEvent[]): MachineMacrostepResult<Context, Output>;
export declare function runExplicitTransitions<Context, Event extends MachineEvent, Input, Output>(model: MachineModel<Context, Event, Input, Output>, snapshot: MachineSnapshot<Context, Output>, event: Event, transitions: readonly CompiledTransition[], bindings: MachineBindings<Context, Event, Input> | undefined, input: Input, hooks?: MachineEvaluationHooks): MachineMacrostepResult<Context, Output>;
export declare function hydrateSnapshot<Context, Event extends MachineEvent, Input, Output>(model: MachineModel<Context, Event, Input, Output>, persisted: PersistedMachineSnapshot<Context, Output>, input: Input): MachineSnapshot<Context, Output>;
export declare function canHandleEvent(compiled: CompiledMachine, active: readonly string[], eventType: string): boolean;
```

## src/machine/persistence.ts

Исходный модуль: `src/machine/persistence.ts`

```ts
import type { MachineEvent, MachineModel, MachineSnapshot, PersistedMachineSnapshot } from './types';
export declare class MachinePersistenceError extends Error {
}
export declare function persistMachineSnapshot<Context, Event extends MachineEvent, Input, Output>(model: MachineModel<Context, Event, Input, Output>, snapshot: MachineSnapshot<Context, Output>): PersistedMachineSnapshot<Context, Output>;
export declare function restoreMachineSnapshot<Context, Event extends MachineEvent, Input, Output>(model: MachineModel<Context, Event, Input, Output>, persisted: PersistedMachineSnapshot<unknown, unknown>, input?: Input): MachineSnapshot<Context, Output>;
```

## src/machine/runtime.ts

Исходный модуль: `src/machine/runtime.ts`

```ts
import type { RaphNode } from '../runtime/ownership/RaphNode';
import type { CreateMachineOptions, MachineBindings, MachineEvent, MachineInstance, MachineModel } from './types';
import { RaphScope } from '../runtime/ownership/RaphScope';
export declare function createMachine<Context, Event extends MachineEvent, Input = void, Output = unknown>(owner: RaphNode | RaphScope, model: MachineModel<Context, Event, Input, Output>, bindings?: MachineBindings<Context, Event, Input>, options?: CreateMachineOptions<Context, Input, Output>): MachineInstance<Context, Event, Input, Output>;
```

## src/machine/testing.ts

Исходный модуль: `src/machine/testing.ts`

```ts
import type { MachineBindings, MachineClock, MachineEvent, MachineModel, MachineSnapshot } from './types';
export interface MachineInspection {
    readonly deadEnds: readonly string[];
    readonly inconsistencies: readonly string[];
    readonly reachable: readonly string[];
    readonly unreachable: readonly string[];
    readonly valid: boolean;
}
export interface EnumeratedMachinePath<Context, Output> {
    readonly events: readonly MachineEvent[];
    readonly snapshot: MachineSnapshot<Context, Output>;
}
export interface EnumerateMachinePathOptions<Context, Event extends MachineEvent, Input> {
    readonly bindings?: MachineBindings<Context, Event, Input>;
    readonly events?: readonly Event[];
    readonly input?: Input;
    readonly maxDepth?: number;
    readonly maxPaths?: number;
}
export interface MachineCoverageReport {
    readonly guards: Readonly<Record<string, Readonly<{
        failed: number;
        passed: number;
    }>>>;
    readonly states: Readonly<Record<string, number>>;
    readonly transitions: Readonly<Record<string, number>>;
}
export interface MachineCoverage {
    guard: (name: string, passed: boolean) => void;
    record: <Context, Output>(before: MachineSnapshot<Context, Output>, event: MachineEvent, after: MachineSnapshot<Context, Output>) => void;
    report: () => MachineCoverageReport;
    reset: () => void;
    transition: <Context, Event extends MachineEvent, Input, Output>(model: MachineModel<Context, Event, Input, Output>, before: MachineSnapshot<Context, Output>, event: Event, bindings?: MachineBindings<Context, Event, Input>) => MachineSnapshot<Context, Output>;
}
export interface ManualMachineClock extends MachineClock {
    readonly pending: number;
    advance: (duration: number) => void;
    runAll: () => void;
}
export declare function inspectMachine<Context, Event extends MachineEvent, Input, Output>(model: MachineModel<Context, Event, Input, Output>): MachineInspection;
export declare function enumerateMachinePaths<Context, Event extends MachineEvent, Input, Output>(model: MachineModel<Context, Event, Input, Output>, options?: EnumerateMachinePathOptions<Context, Event, Input>): readonly EnumeratedMachinePath<Context, Output>[];
export declare function createMachineCoverage(): MachineCoverage;
export declare function createManualMachineClock(initialNow?: number): ManualMachineClock;
```

## src/machine/types.ts

Исходный модуль: `src/machine/types.ts`

```ts
import type { Disposer, ReadonlySignal } from '../reactivity/types';
import type { RaphNode } from '../runtime/ownership/RaphNode';
import type { RaphScope } from '../runtime/ownership/RaphScope';
export interface MachineEvent {
    readonly type: string;
}
export type MachineStatus = 'active' | 'done' | 'stopped';
export type MachineEventStatus = 'ignored' | 'queued' | 'transitioned';
export interface MachineSnapshot<Context, Output = unknown> {
    readonly active: readonly string[];
    readonly context: Readonly<Context>;
    readonly history: Readonly<Record<string, readonly string[]>>;
    readonly output?: Output;
    readonly revision: number;
    readonly status: MachineStatus;
}
export interface MachineGuardArgs<Context, Event extends MachineEvent, Input> {
    readonly context: Readonly<Context>;
    readonly event: Event;
    readonly input: Input;
}
export interface MachineReducerArgs<Context, Event extends MachineEvent, Input> extends MachineGuardArgs<Context, Event, Input> {
}
export interface MachineOutputArgs<Context, Event extends MachineEvent, Input> extends MachineGuardArgs<Context, Event, Input> {
    readonly snapshot: MachineSnapshot<Context>;
}
export type MachineGuard<Context, Event extends MachineEvent, Input> = (args: MachineGuardArgs<Context, Event, Input>) => boolean;
export type MachineReducer<Context, Event extends MachineEvent, Input> = (args: MachineReducerArgs<Context, Event, Input>) => Context;
export type MachineOutput<Context, Event extends MachineEvent, Input> = (args: MachineOutputArgs<Context, Event, Input>) => void;
export type MachineGuardRef<Context, Event extends MachineEvent, Input> = MachineGuard<Context, Event, Input> | string;
export type MachineReducerRef<Context, Event extends MachineEvent, Input> = MachineReducer<Context, Event, Input> | string;
export type MachineOutputRef<Context, Event extends MachineEvent, Input> = MachineOutput<Context, Event, Input> | string;
export interface MachineTransitionConfig<Context, Event extends MachineEvent, Input> {
    readonly emit?: MachineOutputRef<Context, Event, Input> | readonly MachineOutputRef<Context, Event, Input>[];
    readonly guard?: MachineGuardRef<Context, Event, Input>;
    readonly raise?: Event | ((args: MachineReducerArgs<Context, Event, Input>) => Event);
    readonly reason?: string;
    readonly reduce?: MachineReducerRef<Context, Event, Input> | readonly MachineReducerRef<Context, Event, Input>[];
    readonly reenter?: boolean;
    readonly target?: string;
}
export type MachineTransitionDefinition<Context, Event extends MachineEvent, Input> = MachineTransitionConfig<Context, Event, Input> | readonly MachineTransitionConfig<Context, Event, Input>[] | string;
export interface MachineInvokeConfig<Context, Event extends MachineEvent, Input> {
    readonly id?: string;
    readonly input?: unknown | ((args: MachineGuardArgs<Context, Event, Input>) => unknown);
    readonly onDone?: MachineTransitionDefinition<Context, Event, Input>;
    readonly onError?: MachineTransitionDefinition<Context, Event, Input>;
    readonly src: string | MachineModel<unknown, MachineEvent, unknown, unknown>;
    readonly type?: 'machine' | 'task';
}
export interface MachineStateConfig<Context, Event extends MachineEvent, Input, Output> {
    readonly after?: Readonly<Record<string, MachineTransitionDefinition<Context, Event, Input>>>;
    readonly always?: MachineTransitionDefinition<Context, Event, Input>;
    readonly entry?: MachineOutputRef<Context, Event, Input> | readonly MachineOutputRef<Context, Event, Input>[];
    readonly exit?: MachineOutputRef<Context, Event, Input> | readonly MachineOutputRef<Context, Event, Input>[];
    readonly history?: 'deep' | 'shallow';
    readonly initial?: string;
    readonly invoke?: MachineInvokeConfig<Context, Event, Input> | readonly MachineInvokeConfig<Context, Event, Input>[];
    readonly meta?: Readonly<Record<string, unknown>>;
    readonly on?: Readonly<Partial<Record<Event['type'], MachineTransitionDefinition<Context, Event, Input>>>> | Readonly<Record<string, MachineTransitionDefinition<Context, Event, Input>>>;
    readonly onDone?: MachineTransitionDefinition<Context, Event, Input>;
    readonly output?: Output | ((args: MachineGuardArgs<Context, Event, Input>) => Output);
    readonly resources?: string | readonly string[];
    readonly states?: Readonly<Record<string, MachineStateConfig<Context, Event, Input, Output>>>;
    readonly tags?: string | readonly string[];
    readonly target?: string;
    readonly type?: 'atomic' | 'compound' | 'final' | 'history' | 'parallel';
}
export interface PersistedMachineSnapshot<Context = unknown, Output = unknown> {
    readonly active: readonly string[];
    readonly context: Context;
    readonly history: Readonly<Record<string, readonly string[]>>;
    readonly modelId: string;
    readonly output?: Output;
    readonly revision: number;
    readonly status: MachineStatus;
    readonly version: number;
}
export type MachineMigration = (snapshot: PersistedMachineSnapshot) => PersistedMachineSnapshot;
export interface MachineConfig<Context, Event extends MachineEvent, Input, Output> {
    readonly context: Context | ((input: Input) => Context);
    readonly id: string;
    readonly initial: string;
    readonly migrations?: Readonly<Record<number, MachineMigration>>;
    readonly output?: Output | ((args: MachineGuardArgs<Context, Event, Input>) => Output);
    readonly states: Readonly<Record<string, MachineStateConfig<Context, Event, Input, Output>>>;
    readonly version?: number;
}
declare const MACHINE_MODEL_TYPES: unique symbol;
export interface MachineModel<Context, Event extends MachineEvent, Input, Output> {
    readonly id: string;
    readonly version: number;
    readonly [MACHINE_MODEL_TYPES]?: {
        readonly context: Context;
        readonly event: Event;
        readonly input: Input;
        readonly output: Output;
    };
}
export interface MachineClock {
    clearTimeout: (handle: unknown) => void;
    now: () => number;
    setTimeout: (callback: () => void, delay: number) => unknown;
}
export interface MachineTaskArgs<Context, Event extends MachineEvent, Input> extends MachineGuardArgs<Context, Event, Input> {
    readonly send: (event: Event) => void;
    readonly signal: AbortSignal;
}
export type MachineTask<Context, Event extends MachineEvent, Input> = (args: MachineTaskArgs<Context, Event, Input>) => unknown | Promise<unknown>;
export interface MachineResourceArgs<Context, Event extends MachineEvent, Input> extends MachineOutputArgs<Context, Event, Input> {
    readonly owner: RaphNode | RaphScope;
    readonly signal: AbortSignal;
}
export type MachineResource<Context, Event extends MachineEvent, Input> = (args: MachineResourceArgs<Context, Event, Input>) => void | Disposer;
export interface MachineBindings<Context, Event extends MachineEvent, Input> {
    readonly actors?: Readonly<Record<string, MachineModel<unknown, MachineEvent, unknown, unknown>>>;
    readonly delays?: Readonly<Record<string, number | ((args: MachineGuardArgs<Context, Event, Input>) => number)>>;
    readonly guards?: Readonly<Record<string, MachineGuard<Context, Event, Input>>>;
    readonly outputs?: Readonly<Record<string, MachineOutput<Context, Event, Input>>>;
    readonly reducers?: Readonly<Record<string, MachineReducer<Context, Event, Input>>>;
    readonly resources?: Readonly<Record<string, MachineResource<Context, Event, Input>>>;
    readonly tasks?: Readonly<Record<string, MachineTask<Context, Event, Input>>>;
}
export interface CreateMachineOptions<Context, Input, Output> {
    readonly clock?: MachineClock;
    readonly errorPolicy?: 'ignore' | 'stop' | 'throw';
    readonly id?: string;
    readonly input?: Input;
    readonly parentId?: string;
    readonly persisted?: PersistedMachineSnapshot<Context, Output>;
}
export interface MachineSendResult<Context, Output> {
    readonly snapshot: MachineSnapshot<Context, Output>;
    readonly status: MachineEventStatus;
}
export interface MachineActorRef<Event extends MachineEvent = MachineEvent> {
    readonly id: string;
    send: (event: Event) => MachineSendResult<unknown, unknown>;
    stop: () => void;
}
export interface MachineInstance<Context, Event extends MachineEvent, Input, Output> {
    readonly id: string;
    readonly model: MachineModel<Context, Event, Input, Output>;
    readonly snapshot: ReadonlySignal<MachineSnapshot<Context, Output>>;
    readonly started: boolean;
    hasTag: (tag: string) => boolean;
    matches: (path: string) => boolean;
    persist: () => PersistedMachineSnapshot<Context, Output>;
    send: (event: Event) => MachineSendResult<Context, Output>;
    sendTo: (actorId: string, event: MachineEvent) => MachineSendResult<unknown, unknown>;
    start: () => MachineInstance<Context, Event, Input, Output>;
    stop: () => void;
    subscribe: (listener: (snapshot: MachineSnapshot<Context, Output>) => void) => Disposer;
}
export {};
```
