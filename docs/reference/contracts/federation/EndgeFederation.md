---
description: "TypeScript-декларации @typedworks/federation 1.0.0-dev.1, группа EndgeFederation; исходных модулей: 1."
---

# @typedworks/federation: EndgeFederation

Версия source: 1.0.0-dev.1. [Каталог package](./). Repository: https://gitlab.com/typedworks/typedworks-federation (закрыт, canonical). Публичные declarations — [@typedworks/federation@1.0.0-dev.1 в npm](https://unpkg.com/@typedworks/federation@1.0.0-dev.1/).

## src/EndgeFederation.ts

Исходный модуль: `src/EndgeFederation.ts`

```ts
import type { AnyEndgeModule, EndgeFederationContextOf, EndgeFederationModuleAccessors, EndgeModuleDefinition, EndgeModuleDefinitions, EndgeModuleDescriptor } from './types/endge-modules.types.js';
import type { AnyEndgeFederation, EndgeChildFederationDefinition, EndgeChildFederationDefinitions, EndgeFederationContext, EndgeFederationDefinition, EndgeFederationDiagnosticsSnapshot, EndgeFederationDiagnosticsSnapshotOptions, EndgeFederationHost, EndgeFederationState, EndgeLifecycleNodeDescriptor, EndgePlugin } from './types/federation.types.js';
type EndgeFederationPhase = 'setup' | 'load' | 'build' | 'start';
declare const ENDGE_FEDERATION_CONTROL_KEY: unique symbol;
type UnionToIntersection<TValue> = (TValue extends unknown ? (value: TValue) => void : never) extends ((value: infer TResult) => void) ? TResult : never;
type EndgeChildFederationContext<TFederation> = TFederation extends {
    boot: (ctx: infer TContext) => Promise<void>;
} ? TContext : EndgeFederationContext;
type EndgeChildFederationsContext<TDefinitions extends EndgeChildFederationDefinitions> = [
    TDefinitions[number]
] extends [
    never
] ? EndgeFederationContext : UnionToIntersection<EndgeChildFederationContext<TDefinitions[number]['federation']>> extends infer TContext extends EndgeFederationContext ? TContext : EndgeFederationContext;
type EndgeFederationConstructor = abstract new (...args: any[]) => EndgeFederation;
type EndgeFederationStatics = Omit<typeof EndgeFederation, 'prototype' | 'boot' | 'build'>;
type EndgeFederationAccessors<TDefinitions extends EndgeChildFederationDefinitions> = {
    readonly [TDefinition in TDefinitions[number] as TDefinition['key']]: TDefinition['federation'];
};
export type DefinedEndgeFederation<TDefinitions extends EndgeModuleDefinitions, TFederations extends EndgeChildFederationDefinitions = readonly [
], TContext extends EndgeFederationContext = EndgeFederationContextOf<TDefinitions> & EndgeChildFederationsContext<TFederations>> = EndgeFederationConstructor & EndgeFederationStatics & EndgeFederationModuleAccessors<TDefinitions> & EndgeFederationAccessors<TFederations> & {
    readonly prototype: EndgeFederation;
    boot: (ctx: TContext) => Promise<void>;
    build: (ctx?: TContext) => Promise<void>;
};
interface EndgeFederationControl {
    readonly id: string;
    attach: (parentFederationId: string) => void;
    createDiagnosticsSnapshot: (path: string[], options: EndgeFederationDiagnosticsSnapshotOptions) => EndgeFederationDiagnosticsSnapshot;
    configure: () => void;
    runPhase: (phase: EndgeFederationPhase, ctx: EndgeFederationContext) => Promise<void>;
    reset: () => Promise<void>;
}
export declare abstract class EndgeFederation {
    protected static readonly federationId: string;
    protected static readonly federationDefinitionSignature: string | null;
    static get id(): string;
    static define<const TDefinitions extends EndgeModuleDefinitions, const TFederations extends EndgeChildFederationDefinitions = readonly [
    ]>(definition: EndgeFederationDefinition<TDefinitions, TFederations>): DefinedEndgeFederation<TDefinitions, TFederations>;
    static get isInitialized(): boolean;
    static get isConfigured(): boolean;
    static get state(): EndgeFederationState;
    static get lastError(): unknown | null;
    static createDiagnosticsSnapshot(options?: EndgeFederationDiagnosticsSnapshotOptions): EndgeFederationDiagnosticsSnapshot;
    protected static configureFederation(): void;
    protected static selectLifecycleNodes(nodes: readonly EndgeLifecycleNodeDescriptor[], _ctx: EndgeFederationContext): readonly EndgeLifecycleNodeDescriptor[];
    static boot(ctx: EndgeFederationContext): Promise<void>;
    static use(plugin: EndgePlugin): void;
    static defineModule<T extends AnyEndgeModule>(descriptor: EndgeModuleDescriptor<T>): T;
    static defineModules(descriptors: readonly EndgeModuleDescriptor[]): void;
    protected static defineModuleDefinitions(definitions: readonly EndgeModuleDefinition[]): void;
    static defineFederation(definition: EndgeChildFederationDefinition): void;
    static defineFederations(definitions: readonly EndgeChildFederationDefinition[]): void;
    protected static setup(ctx?: EndgeFederationContext, touchedNodes?: Set<EndgeLifecycleNodeDescriptor>): Promise<void>;
    protected static load(ctx?: EndgeFederationContext, touchedNodes?: Set<EndgeLifecycleNodeDescriptor>): Promise<void>;
    static build(ctx?: EndgeFederationContext): Promise<void>;
    protected static start(ctx?: EndgeFederationContext, touchedNodes?: Set<EndgeLifecycleNodeDescriptor>): Promise<void>;
    static reset(): Promise<void>;
    static getModule<T extends AnyEndgeModule = AnyEndgeModule>(key: string): T;
    static tryGetModule<T extends AnyEndgeModule = AnyEndgeModule>(key: string): T | null;
    static hasModule(key: string): boolean;
    static getFederation<T extends AnyEndgeFederation = AnyEndgeFederation>(key: string): T;
    static tryGetFederation<T extends AnyEndgeFederation = AnyEndgeFederation>(key: string): T | null;
    static hasFederation(key: string): boolean;
    protected static get host(): EndgeFederationHost;
    protected static [ENDGE_FEDERATION_CONTROL_KEY](): EndgeFederationControl;
}
export {};
```
