---
description: "TypeScript-декларации @endge/core 1.0.0-dev.12, группа context; исходных модулей: 9."
---

# @endge/core: context

Версия source: 1.0.0-dev.12. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/context/domain/context-events.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/context/domain/context-events.types.ts)

```ts
import type { EndgeCoreEventMap } from '@/features/core/modules/events/domain/events.types';
export type ContextEvent = {
    [K in keyof EndgeCoreEventMap & `context:${string}`]: {
        readonly name: K;
        readonly payload: EndgeCoreEventMap[K];
    };
}[keyof EndgeCoreEventMap & `context:${string}`];
```

## src/features/core/modules/context/domain/context-persistence.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/context/domain/context-persistence.types.ts)

```ts
import type { EndgePublicConfigurationSnapshot } from '@/features/core/modules/configuration/domain/types/configuration.type';
export type EndgePersistenceDriver = 'local' | 'disabled';
export interface EndgePersistenceOptions {
    driver?: EndgePersistenceDriver;
}
export interface EndgeContextPersistenceConfig {
    context?: EndgePersistenceDriver | EndgePersistenceOptions | null;
}
export interface EndgeContextSnapshot {
    workspace: string | null;
    facets: Readonly<Record<string, string>>;
    user: string | null;
    locale: string | null;
    theme: string | null;
    timezone: string | null;
}
export interface EndgePersistedContextSnapshot extends EndgeContextSnapshot {
    themePreferenceVersion?: 1;
}
export interface EndgeKeyboardContextSnapshot {
    platform: 'macos' | 'windows' | 'linux' | 'unknown';
    modifiers: {
        ctrl: boolean;
        shift: boolean;
        alt: boolean;
        meta: boolean;
        mod: boolean;
        altGraph: boolean;
    };
    held: {
        key: string[];
        code: string[];
    };
}
export interface EndgeRuntimeContextSnapshot extends EndgeContextSnapshot {
    config: EndgePublicConfigurationSnapshot;
    input: {
        keyboard: EndgeKeyboardContextSnapshot;
    };
}
export interface EndgePersistenceScope {
    workspaceId: string;
    facetSelections: readonly EndgePersistenceFacetSelection[];
    userId: string;
}
export interface EndgePersistenceFacetSelection {
    facetIdentity: string;
    documentIdentity: string;
}
export type EndgePersistenceScopeResolver = () => EndgePersistenceScope;
export interface EndgeSessionIdentity {
    userId?: string | null;
    facetSelections?: Readonly<Record<string, string>>;
    facetErrors?: readonly string[];
}
export interface EndgeSessionIdentityProvider {
    getCurrentIdentity: () => EndgeSessionIdentity | null;
}
export interface EndgeStorageAdapter {
    readonly id: EndgePersistenceDriver;
    isAvailable: () => boolean;
    read: <T>(key: string) => T | undefined;
    write: <T>(key: string, value: T) => void;
    remove: (key: string) => void;
}
export interface RuntimeStateDocument {
    version: 2;
    scope: EndgePersistenceScope;
    runtimeId: string;
    state: Record<string, Record<string, unknown>>;
}
export interface RuntimeStateControllerLike {
    readonly runtimeId: string;
    readonly storageId: string;
    readonly storageKey: string;
    readonly scope: EndgePersistenceScope;
    get: <T>(entityKey: string, section: string, fallback: T) => T;
    set: <T>(entityKey: string, section: string, value: T) => void;
    remove: (entityKey: string, section?: string) => void;
    clear: () => void;
}
```

## src/features/core/modules/context/domain/context-state.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/context/domain/context-state.types.ts)

```ts
import type { ClassConstructor } from 'class-transformer';
export interface EndgeContextStateCodec<T> {
    serialize: (state: T) => unknown;
    deserialize: (value: unknown) => T;
}
export type EndgeContextStateTransform<T> = ClassConstructor<T> | EndgeContextStateCodec<T>;
export type EndgeContextStateListener = () => void;
```

## src/features/core/modules/context/endge-vars.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/context/endge-vars.ts)

```ts
import type { EndgeResolvedWorkspaceVariable, EndgeWorkspaceVar } from '@/features/core/modules/workspace/domain/workspace.types';
type EnvRecord = Record<string, unknown>;
export declare class WorkspaceVariables {
    constructor(_getDefinitions: () => EndgeWorkspaceVar[]);
    setEnvironment(envyRecord: EnvRecord): void;
    setEnvyRecord(envyRecord: EnvRecord): void;
    get definitions(): EndgeWorkspaceVar[];
    getValue(name: string): string | undefined;
    getAll(): EndgeResolvedWorkspaceVariable[];
    toRecord(): Record<string, {
        defaultValue: string;
        currentValue: string;
    }>;
    resolve<T = string>(raw: unknown, options?: {
        coerce?: (value: string | number | boolean | null | undefined) => T;
        fallback?: T;
        onInvalid?: 'fallback' | 'as-is' | 'throw';
    }): T | undefined;
    static toNumber(v: unknown): number;
    static toString(v: unknown): string;
    static toBoolean(v: unknown): boolean;
}
export {};
```

## src/features/core/modules/context/EndgeContext_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/context/EndgeContext_Module.ts)

```ts
import type { EndgeBootContext, EndgeBootMode } from '@/features/core/kernel/types/bootstrap.types';
import type { EndgeConfiguration } from '@/features/core/modules/configuration/domain/types/configuration.type';
import type { ContextEvent } from '@/features/core/modules/context/domain/context-events.types';
import type { EndgeContextPersistenceConfig, EndgeContextSnapshot, EndgeKeyboardContextSnapshot, EndgePersistenceScope, EndgeRuntimeContextSnapshot, EndgeSessionIdentityProvider, EndgeStorageAdapter } from '@/features/core/modules/context/domain/context-persistence.types';
import type { EndgeContextStateListener, EndgeContextStateTransform } from '@/features/core/modules/context/domain/context-state.types';
import type { EndgePersistenceInput } from '@/features/core/modules/context/persistence/EndgeStorageAdapterRegistry';
import type { EndgeExecutionContext, EndgeExecutionContextResolutionInput } from '@/features/core/modules/runtime/domain/execution-context.types';
import type { EndgeDataMode } from '@/features/core/modules/workspace/domain/workspace.types';
import { RuntimeStateController } from '@/features/core/modules/context/persistence/RuntimeStateController';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeContext_Module extends EndgeModule<EndgeBootContext> {
    get bootMode(): EndgeBootMode;
    constructor();
    setup(ctx: EndgeBootContext): void;
    reset(): void;
    get isLoadingFromStorage(): boolean;
    registerStorageAdapter(adapter: EndgeStorageAdapter): void;
    configurePersistence(config: EndgeContextPersistenceConfig): void;
    setSessionIdentityProvider(provider: EndgeSessionIdentityProvider | null): void;
    isFacetLockedBySession(facetIdentity: string): boolean;
    createDiagnosticsSnapshot(): Record<string, unknown>;
    serialize(): EndgeContextSnapshot;
    runtimeSnapshot(): EndgeRuntimeContextSnapshot;
    getKeyboardState(): EndgeKeyboardContextSnapshot;
    setKeyboardState(input: EndgeKeyboardContextSnapshot): void;
    notify(): void;
    applyEvent(event: ContextEvent): void;
    deserialize(payload: Partial<EndgeContextSnapshot> | undefined): void;
    applyInspection(snapshot: EndgeContextSnapshot & {
        dataMode?: EndgeDataMode;
    }): void;
    saveToStorage(): void;
    loadFromStorage(): EndgeContextSnapshot | undefined;
    getPersistenceScope(): EndgePersistenceScope;
    getUserState<T>(userId: string, key: string, transform?: EndgeContextStateTransform<T>): T | undefined;
    setUserState<T>(userId: string, key: string, state: T, transform?: EndgeContextStateTransform<T>): void;
    getState<T>(key: string, transform?: EndgeContextStateTransform<T>): T | undefined;
    setState<T>(key: string, state: T, transform?: EndgeContextStateTransform<T>): void;
    removeState(key: string): void;
    subscribeState(key: string, listener: EndgeContextStateListener): () => void;
    createRuntimeStateController(input: {
        runtimeId: string;
        storageId?: string;
        persistence?: EndgePersistenceInput;
    }): RuntimeStateController;
    getRuntimeStateController(runtimeId: string): RuntimeStateController | null;
    destroyRuntimeStateController(runtimeId: string): void;
    getCurrentWorkspace(): string | null;
    setCurrentWorkspace(identity: string | null): void;
    getFacetSelections(): Readonly<Record<string, string>>;
    getFacetSelection(facetIdentity: string): string | null;
    setFacetSelection(facetIdentity: string, documentIdentity: string | null): void;
    setFacetSelections(selections: Readonly<Record<string, string>>): void;
    getExecutionContext(): EndgeExecutionContext;
    resolveExecutionContext(input: EndgeExecutionContextResolutionInput): EndgeExecutionContext;
    getCurrentUser(): string;
    setCurrentUser(identity: string | null): void;
    get dataMode(): EndgeDataMode;
    get isMockEnabled(): boolean;
    get isDataModeOverridden(): boolean;
    setWorkspaceDataMode(mode: EndgeDataMode): void;
    setDataMode(mode: EndgeDataMode): void;
    clearDataModeOverride(): void;
    setMockEnabled(enabled: boolean): void;
    get currentLocale(): string;
    setCurrentLocale(locale: string | null): void;
    reconcileCurrentLocaleWithWorkspace(configuration?: EndgeConfiguration): void;
    get currentTheme(): string;
    setCurrentTheme(theme: string | null): void;
    reconcileCurrentThemeWithWorkspace(configuration?: EndgeConfiguration): void;
    get currentTimezone(): string;
    setCurrentTimezone(timezone: string | null): void;
    reconcileCurrentTimezoneWithWorkspace(configuration?: EndgeConfiguration): void;
}
```

## src/features/core/modules/context/persistence/adapters/DisabledContextAdapter.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/context/persistence/adapters/DisabledContextAdapter.ts)

```ts
import type { EndgeStorageAdapter } from '@/features/core/modules/context/domain/context-persistence.types';
export declare class DisabledContextAdapter implements EndgeStorageAdapter {
    readonly id: "disabled";
    isAvailable(): boolean;
    read<T>(_key: string): T | undefined;
    write<T>(_key: string, _value: T): void;
    remove(_key: string): void;
}
```

## src/features/core/modules/context/persistence/adapters/LocalStorageContextAdapter.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/context/persistence/adapters/LocalStorageContextAdapter.ts)

```ts
import type { EndgeStorageAdapter } from '@/features/core/modules/context/domain/context-persistence.types';
export declare class LocalStorageContextAdapter implements EndgeStorageAdapter {
    readonly id: "local";
    isAvailable(): boolean;
    read<T>(key: string): T | undefined;
    readRaw(key: string): string | null;
    write<T>(key: string, value: T): void;
    remove(key: string): void;
}
```

## src/features/core/modules/context/persistence/EndgeStorageAdapterRegistry.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/context/persistence/EndgeStorageAdapterRegistry.ts)

```ts
import type { EndgePersistenceDriver, EndgePersistenceOptions, EndgeStorageAdapter } from '@/features/core/modules/context/domain/context-persistence.types';
export type EndgePersistenceInput = EndgePersistenceDriver | EndgePersistenceOptions | null | undefined;
export declare function normalizePersistence(input: EndgePersistenceInput): EndgePersistenceOptions;
export declare function normalizePersistenceDriver(value: unknown): EndgePersistenceDriver;
export declare class EndgeStorageAdapterRegistry {
    register(adapter: EndgeStorageAdapter): void;
    resolve(input: EndgePersistenceInput): EndgeStorageAdapter;
}
```

## src/features/core/modules/context/persistence/RuntimeStateController.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/context/persistence/RuntimeStateController.ts)

```ts
import type { EndgePersistenceScope, EndgePersistenceScopeResolver, EndgeStorageAdapter, RuntimeStateControllerLike } from '@/features/core/modules/context/domain/context-persistence.types';
export declare function buildRuntimeStateStorageKey(scope: EndgePersistenceScope, runtimeId: string): string;
export declare class RuntimeStateController implements RuntimeStateControllerLike {
    readonly runtimeId: string;
    readonly storageId: string;
    constructor(input: {
        runtimeId: string;
        storageId?: string;
        scope: EndgePersistenceScope | EndgePersistenceScopeResolver;
        adapter: EndgeStorageAdapter;
    });
    get scope(): EndgePersistenceScope;
    get storageKey(): string;
    get<T>(entityKey: string, section: string, fallback: T): T;
    set<T>(entityKey: string, section: string, value: T): void;
    remove(entityKey: string, section?: string): void;
    clear(): void;
}
```
