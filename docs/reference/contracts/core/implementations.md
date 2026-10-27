---
description: "TypeScript-декларации @endge/core 1.0.0-dev.11, группа implementations; исходных модулей: 2."
---

# @endge/core: implementations

Версия source: 1.0.0-dev.11. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/implementations/domain/implementation.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/implementations/domain/implementation.types.ts)

```ts
import type { ActionExecutionTarget, ActionTargetSelector, ImplementationBindingScope } from '@/features/core/modules/actions/domain/action.types';
import type { EntityOrigin } from '@/features/core/modules/domain/types/document/entity-management.type';
export interface ImplementationContract {
    target?: ActionTargetSelector[] | null;
    input?: unknown | null;
    output?: unknown | null;
}
export interface ImplementationExecutableRef {
    type: string;
    identity: string;
    value?: unknown;
}
export interface ImplementationInvocation<TInput = unknown> {
    executable: ImplementationExecutableRef;
    input?: TInput;
    target?: ActionExecutionTarget;
    context?: Record<string, unknown>;
}
export interface ImplementationProvider<TInput = unknown, TResult = unknown> {
    key: string;
    origin: EntityOrigin;
    active?: boolean;
    contract?: ImplementationContract;
    canExecute?: (invocation: ImplementationInvocation<TInput>) => boolean;
    execute: (invocation: ImplementationInvocation<TInput>) => TResult | Promise<TResult>;
}
export interface ImplementationBinding {
    executableType: string;
    executableIdentity: string;
    providerKey: string;
    scope: Exclude<ImplementationBindingScope, 'default'>;
    scopeIdentity?: string;
    priority?: number;
}
export interface ImplementationResolutionRequest {
    executable: ImplementationExecutableRef;
    defaultProviderKey: string | null;
    scopeIdentities?: Partial<Record<Exclude<ImplementationBindingScope, 'default'>, string>>;
    invocationProviderKey?: string;
    expectedContract?: ImplementationContract;
}
export interface ResolvedImplementation {
    provider: ImplementationProvider;
    binding: ImplementationBinding | null;
    scope: ImplementationBindingScope;
}
export interface ImplementationSnapshot {
    providers: Array<{
        key: string;
        active: boolean;
        origin: EntityOrigin;
    }>;
    bindings: ImplementationBinding[];
}
export type ImplementationDiagnosticCode = 'implementation-provider-missing' | 'implementation-provider-inactive' | 'implementation-binding-ambiguous' | 'implementation-cannot-execute' | 'implementation-contract-incompatible';
export declare class ImplementationError extends Error {
    readonly code: ImplementationDiagnosticCode;
    constructor(code: ImplementationDiagnosticCode, message: string);
}
```

## src/features/core/modules/implementations/EndgeImplementations_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/implementations/EndgeImplementations_Module.ts)

```ts
import type { ImplementationBinding, ImplementationInvocation, ImplementationProvider, ImplementationResolutionRequest, ImplementationSnapshot, ResolvedImplementation } from '@/features/core/modules/implementations/domain/implementation.types';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeImplementations_Module extends EndgeModule {
    registerProvider(provider: ImplementationProvider): () => void;
    hasProvider(key: string): boolean;
    bind(binding: ImplementationBinding): () => void;
    resolve(request: ImplementationResolutionRequest): ResolvedImplementation;
    resolveOptional(request: ImplementationResolutionRequest): ResolvedImplementation | null;
    execute<TResult = unknown>(request: ImplementationResolutionRequest, invocation: ImplementationInvocation): Promise<TResult>;
    createDiagnosticsSnapshot(): ImplementationSnapshot;
    snapshot(): ImplementationSnapshot;
    reset(): void;
}
```
