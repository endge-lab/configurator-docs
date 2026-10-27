---
description: "TypeScript-декларации @endge/core 1.0.0-dev.11, группа computations; исходных модулей: 4."
---

# @endge/core: computations

Версия source: 1.0.0-dev.11. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/computations/EndgeComputations_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/computations/EndgeComputations_Module.ts)

```ts
import type { ImplementationBindingScope } from '@/features/core/modules/actions/domain/action.types';
import type { ComputationProgramPayload } from '@/features/core/modules/domain/types/computation/computation-program.types';
import type { ComputationOverride, ComputationSandboxAdapter, ComputationSandboxRequest } from '@/features/core/modules/domain/types/computation/computation-runtime.types';
import type { EntityOrigin } from '@/features/core/modules/domain/types/document/entity-management.type';
import type { EndgeImplementations_Module } from '@/features/core/modules/implementations/EndgeImplementations_Module';
import type { ProgramArtifact } from '@/features/core/modules/program/domain/types/program.types';
import { ComputationResourceState } from '@/features/core/modules/computations/model/ComputationResource';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeComputations_Module extends EndgeModule {
    constructor(_implementations: EndgeImplementations_Module);
    hasDefinition(identity: string): boolean;
    define(definition: {
        identity: string;
        origin: EntityOrigin;
        defaultProviderKey?: string;
        execution?: 'sync' | 'async';
    }): VoidFunction;
    provide(provider: {
        identity: string;
        key: string;
        origin?: EntityOrigin;
        implementation: ComputationOverride;
    }): VoidFunction;
    override(binding: {
        identity: string;
        providerKey: string;
        scope?: Exclude<ImplementationBindingScope, 'default' | 'invocation'>;
        scopeIdentity?: string;
        priority?: number;
    }): VoidFunction;
    setSandboxAdapter(adapter: ComputationSandboxAdapter | null): void;
    executeSandbox(request: ComputationSandboxRequest): Promise<unknown>;
    run(idOrIdentity: string | number, input: unknown): Promise<unknown>;
    runArtifact(artifact: ProgramArtifact<ComputationProgramPayload>, input: unknown): Promise<unknown>;
    runSource(source: string, input: unknown, identity?: string): Promise<unknown>;
    runSync(idOrIdentity: string | number, input: unknown): unknown;
    runArtifactSync(artifact: ProgramArtifact<ComputationProgramPayload>, input: unknown): unknown;
    createResource(identity: string, input: unknown, _consumerKey: string): ComputationResourceState;
    reset(): void;
}
```

## src/features/core/modules/computations/model/ComputationResource.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/computations/model/ComputationResource.ts)

```ts
import type { ComputationResource as ComputationResourceContract, ComputationRuntimeErrorShape } from '@/features/core/modules/domain/types/computation/computation-runtime.types';
type AsyncRunner<T> = (input: unknown) => Promise<T>;
type SyncRunner<T> = (input: unknown) => T;
export declare class ComputationResourceState<T = unknown> implements ComputationResourceContract<T> {
    constructor(input: unknown, _asyncRunner: AsyncRunner<T>, _syncRunner?: SyncRunner<T> | null, _identity?: string);
    get status(): import("@/features/core/modules/domain/types/computation/computation-runtime.types").ComputationResourceStatus;
    get loading(): boolean;
    get value(): T | undefined;
    get error(): ComputationRuntimeErrorShape | null;
    snapshot(): {
        identity: string;
        input: unknown;
        status: import("@/features/core/modules/domain/types/computation/computation-runtime.types").ComputationResourceStatus;
        loading: boolean;
        value: T | undefined;
        error: ComputationRuntimeErrorShape | null;
    };
    updateInput(input: unknown): void;
    refresh(): Promise<void>;
    subscribe(listener: VoidFunction): VoidFunction;
    dispose(): void;
}
export {};
```

## src/features/core/modules/computations/model/ComputationResourceRegistry.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/computations/model/ComputationResourceRegistry.ts)

```ts
import type { ComputationResourceState } from './ComputationResource';
import type { ComputationResource as ComputationResourceContract } from '@/features/core/modules/domain/types/computation/computation-runtime.types';
export declare class ComputationResourceRegistry {
    getOrCreate(key: string, input: unknown, create: () => ComputationResourceState, onChange?: VoidFunction): ComputationResourceContract;
    releaseScope(scope: string, keep?: (key: string) => boolean): void;
    dispose(): void;
    snapshot(): {
        identity: string;
        input: unknown;
        status: import("@/features/core/modules/domain/types/computation/computation-runtime.types").ComputationResourceStatus;
        loading: boolean;
        value: unknown;
        error: import("@/features/core/modules/domain/types/computation/computation-runtime.types").ComputationRuntimeErrorShape | null;
    }[];
}
```

## src/features/core/modules/computations/services/ComputationGraphExecutor.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/computations/services/ComputationGraphExecutor.ts)

```ts
import type { ComputationProgramPayload } from '@/features/core/modules/domain/types/computation/computation-program.types';
import type { ComputationDependencyRunner, ComputationExecutionScope, ComputationSandboxAdapter } from '@/features/core/modules/domain/types/computation/computation-runtime.types';
export declare class ComputationRuntimeError extends Error {
    readonly computationIdentity: string;
    readonly kind: string;
    readonly outputName?: string | undefined;
    readonly name = "ComputationRuntimeError";
    constructor(message: string, computationIdentity: string, kind: string, outputName?: string | undefined, options?: ErrorOptions);
    toJSON(): {
        readonly name: "ComputationRuntimeError";
        readonly message: string;
        readonly computationIdentity: string;
        readonly outputName: string | undefined;
        readonly kind: string;
    };
}
export declare class ComputationGraphExecutor {
    constructor(_sandbox: () => ComputationSandboxAdapter | null, _dependencies?: ComputationDependencyRunner | null);
    runSync(payload: ComputationProgramPayload, input: unknown, identity: string, scope?: ComputationExecutionScope): unknown;
    run(payload: ComputationProgramPayload, input: unknown, identity: string, scope?: ComputationExecutionScope): Promise<unknown>;
}
```
