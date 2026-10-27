---
description: "TypeScript-декларации @typedworks/federation 1.0.0-dev.1, группа types; исходных модулей: 2."
---

# @typedworks/federation: types

Версия source: 1.0.0-dev.1. [Каталог package](./). Repository: https://gitlab.com/typedworks/typedworks-federation (закрыт, canonical). Публичные declarations — [@typedworks/federation@1.0.0-dev.1 в npm](https://unpkg.com/@typedworks/federation@1.0.0-dev.1/).

## src/types/endge-modules.types.ts

Исходный модуль: `src/types/endge-modules.types.ts`

```ts
import type { EndgeModule } from '../EndgeModule.js';
import type { EndgeFederationContext, EndgeFederationDiagnosticsSnapshot, EndgeFederationDiagnosticsSnapshotOptions } from './federation.types.js';
export type AnyEndgeModule = EndgeModule<any>;
export type EndgeModuleOrder = string | readonly string[];
export interface EndgeModuleFactoryContext {
    getModule: <T extends AnyEndgeModule = AnyEndgeModule>(key: string) => T;
    createDiagnosticsSnapshot: (options?: EndgeFederationDiagnosticsSnapshotOptions) => EndgeFederationDiagnosticsSnapshot;
}
export interface EndgeModuleDefinition<TKey extends string = string, TModule extends AnyEndgeModule = AnyEndgeModule> {
    readonly key: TKey;
    readonly create: (context: EndgeModuleFactoryContext) => TModule;
    readonly before?: EndgeModuleOrder;
    readonly after?: EndgeModuleOrder;
}
export interface EndgeModuleDescriptor<T extends AnyEndgeModule = AnyEndgeModule> {
    key: string;
    module: T;
    before?: EndgeModuleOrder;
    after?: EndgeModuleOrder;
}
export type EndgeModuleDefinitions = readonly EndgeModuleDefinition[];
export type EndgeModuleContext<TModule extends AnyEndgeModule> = TModule extends EndgeModule<infer TContext> ? TContext : never;
type UnionToIntersection<TValue> = (TValue extends unknown ? (value: TValue) => void : never) extends ((value: infer TResult) => void) ? TResult : never;
export type EndgeFederationContextOf<TDefinitions extends EndgeModuleDefinitions> = UnionToIntersection<EndgeModuleContext<ReturnType<TDefinitions[number]['create']>>> extends infer TContext extends EndgeFederationContext ? TContext : EndgeFederationContext;
export type EndgeFederationModuleAccessors<TDefinitions extends EndgeModuleDefinitions> = {
    readonly [TDefinition in TDefinitions[number] as TDefinition['key']]: ReturnType<TDefinition['create']>;
};
export {};
```

## src/types/federation.types.ts

Исходный модуль: `src/types/federation.types.ts`

```ts
import type { EndgeModule } from '../EndgeModule.js';
import type { AnyEndgeModule, EndgeModuleDefinitions, EndgeModuleDescriptor, EndgeModuleOrder } from './endge-modules.types.js';
export interface EndgeFederationContext {
    signal?: AbortSignal;
}
export type EndgeFederationState = 'idle' | 'booting' | 'ready' | 'building' | 'resetting' | 'failed';
export type EndgeModuleDiagnosticsSnapshotStatus = 'captured' | 'empty' | 'skipped' | 'failed' | 'referenced';
export interface EndgeModuleDiagnosticsSnapshotReference {
    federationId: string;
    key: string;
    path: string[];
    moduleName: string;
}
export interface EndgeFederationDiagnosticsSnapshotOptions {
    shouldCaptureModule?: (module: EndgeModuleDiagnosticsSnapshotReference) => boolean;
}
export interface EndgeModuleDiagnosticsSnapshotNode extends EndgeModuleDiagnosticsSnapshotReference {
    kind: 'module';
    status: EndgeModuleDiagnosticsSnapshotStatus;
    snapshot?: unknown;
    snapshotRef?: string;
    error?: string;
}
export interface EndgeChildFederationDiagnosticsSnapshotNode {
    kind: 'federation';
    key: string;
    path: string[];
    status: 'captured' | 'failed';
    federation?: EndgeFederationDiagnosticsSnapshot;
    error?: string;
}
export type EndgeFederationDiagnosticsSnapshotNode = EndgeModuleDiagnosticsSnapshotNode | EndgeChildFederationDiagnosticsSnapshotNode;
export interface EndgeFederationDiagnosticsSnapshot {
    id: string;
    name: string;
    path: string[];
    state: EndgeFederationState;
    plugins: string[];
    nodes: EndgeFederationDiagnosticsSnapshotNode[];
}
export interface EndgeFederationFacade<in TContext extends EndgeFederationContext = EndgeFederationContext> {
    readonly id: string;
    readonly isConfigured: boolean;
    readonly isInitialized: boolean;
    readonly lastError: unknown | null;
    readonly state: EndgeFederationState;
    createDiagnosticsSnapshot: (options?: EndgeFederationDiagnosticsSnapshotOptions) => EndgeFederationDiagnosticsSnapshot;
    boot: (ctx: TContext) => Promise<void>;
    build: (ctx?: TContext) => Promise<void>;
    reset: () => Promise<void>;
}
export type AnyEndgeFederation = EndgeFederationFacade<any>;
export interface EndgeChildFederationDefinition<TKey extends string = string, TFederation extends AnyEndgeFederation = AnyEndgeFederation> {
    readonly key: TKey;
    readonly federation: TFederation;
    readonly before?: EndgeModuleOrder;
    readonly after?: EndgeModuleOrder;
}
export type EndgeChildFederationDefinitions = readonly EndgeChildFederationDefinition[];
export interface EndgePlugin<TModules extends EndgeModuleDefinitions = EndgeModuleDefinitions, TFederations extends EndgeChildFederationDefinitions = EndgeChildFederationDefinitions> {
    readonly id: string;
    readonly modules?: TModules;
    readonly federations?: TFederations;
    readonly selectLifecycleNodes?: (nodes: readonly EndgeLifecycleNodeDescriptor[], ctx: EndgeFederationContext) => readonly EndgeLifecycleNodeDescriptor[];
}
export interface EndgeFederationDefinition<TDefinitions extends EndgeModuleDefinitions, TFederations extends EndgeChildFederationDefinitions = readonly [
]> {
    readonly id: string;
    readonly name?: string;
    readonly modules: TDefinitions;
    readonly federations?: TFederations;
    readonly selectLifecycleNodes?: (nodes: readonly EndgeLifecycleNodeDescriptor[], ctx: EndgeFederationContext) => readonly EndgeLifecycleNodeDescriptor[];
}
export type EndgeLifecycleNodeDescriptor = {
    readonly kind: 'module';
    readonly key: string;
    readonly module: AnyEndgeModule;
    readonly before?: EndgeModuleOrder;
    readonly after?: EndgeModuleOrder;
} | {
    readonly kind: 'federation';
    readonly key: string;
    readonly federation: AnyEndgeFederation;
    readonly before?: EndgeModuleOrder;
    readonly after?: EndgeModuleOrder;
};
export interface EndgeFederationHost {
    definitionSignature: string | null;
    parentFederationId: string | null;
    isConfigured: boolean;
    isConfiguring: boolean;
    isSetup: boolean;
    isInitialized: boolean;
    state: EndgeFederationState;
    lastError: unknown | null;
    bootContext: EndgeFederationContext | null;
    lifecycleNodes: readonly EndgeLifecycleNodeDescriptor[] | null;
    bootPromise: Promise<void> | null;
    resetPromise: Promise<void> | null;
    buildQueue: Promise<void>;
    pendingBuilds: number;
    moduleDefinitions: EndgeModuleDefinitions[number][];
    federationDefinitions: EndgeChildFederationDefinition[];
    moduleDescriptors: EndgeModuleDescriptor[];
    nodes: EndgeLifecycleNodeDescriptor[];
    modules: Map<string, EndgeModule<any>>;
    federations: Map<string, AnyEndgeFederation>;
    facades: Set<AnyEndgeFederation>;
    plugins: EndgePlugin[];
    pluginSignatures: Map<string, string>;
    installedPluginIds: Set<string>;
    attachedTouchedNodes: Set<EndgeLifecycleNodeDescriptor>;
}
```
