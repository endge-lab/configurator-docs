---
description: "TypeScript-декларации @endge/core 1.0.0-dev.12, группа runtime; исходных модулей: 62."
---

# @endge/core: runtime

Версия source: 1.0.0-dev.12. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/runtime/ComponentSFCEventBoundary.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/ComponentSFCEventBoundary.ts)

```ts
import type { RComponentSFC_IR_EventBinding } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { ComponentSFCEventRuntimeSource, ComponentSFCPortManifest, ComponentSFCRequiredPortBinding } from '@/features/core/modules/domain/types/component/sfc/ports.types';
import type { ComponentSFCRuntimeHost } from '@/features/core/modules/runtime/hosts/ComponentSFCRuntimeHost';
export declare class ComponentSFCEventBoundary {
    readonly componentIdentity: string;
    constructor(_host: Pick<ComponentSFCRuntimeHost, 'executeEventPortAction' | 'publishEventPort' | 'emit'> | null, componentIdentity: string, _manifest: ComponentSFCPortManifest, _parent?: ComponentSFCEventBoundary | null, _parentSource?: ComponentSFCEventRuntimeSource | undefined, _parentBindings?: readonly RComponentSFC_IR_EventBinding[], _parentEventTransform?: ((event: string, payload: unknown) => {
        event: string;
        payload: unknown;
    } | null) | undefined, _requiredPortBindings?: readonly ComponentSFCRequiredPortBinding[]);
    createChild(componentIdentity: string, manifest: ComponentSFCPortManifest, source: ComponentSFCEventRuntimeSource, bindings?: readonly RComponentSFC_IR_EventBinding[], transform?: (event: string, payload: unknown) => {
        event: string;
        payload: unknown;
    } | null, requiredPortBindings?: readonly ComponentSFCRequiredPortBinding[]): ComponentSFCEventBoundary;
    observesChild(source: ComponentSFCEventRuntimeSource, event: string): boolean;
    claimLocalOnce(key: string): boolean;
    routeChild(source: ComponentSFCEventRuntimeSource, event: string, payload: unknown, bindings?: readonly RComponentSFC_IR_EventBinding[], trace?: string[], depth?: number, scope?: Record<string, unknown>): Promise<void>;
    emitChild(source: ComponentSFCEventRuntimeSource, event: string, payload: unknown, trace?: string[], depth?: number): Promise<void>;
    emitOwn(name: string, payload: unknown, trace?: string[], depth?: number): Promise<void>;
}
```

## src/features/core/modules/runtime/domain/component-sfc-render-port.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/component-sfc-render-port.types.ts)

```ts
import type { ComponentSFCRuntimeHost } from '@/features/core/modules/runtime/hosts/ComponentSFCRuntimeHost';
import type { EndgeStyleSheetArtifact } from '@/features/core/modules/styles/domain/types/style.types';
export type ComponentSFCRenderPort = Pick<ComponentSFCRuntimeHost, 'id' | 'entityIdentity' | 'runtimeState' | 'getIr' | 'getArtifact' | 'getArtifactReader' | 'getComputationResource' | 'releaseComputationResources' | 'readDataMeta' | 'translate' | 'resolveVocabOptions' | 'getEditSession' | 'beginEditSession' | 'updateEditDraft' | 'commitEditSession' | 'cancelEditSession' | 'executeEventPortAction' | 'publishEventPort' | 'setInputSource' | 'on' | 'off' | 'emit'> & {
    readonly readonly?: boolean;
    readonly styleArtifacts?: readonly EndgeStyleSheetArtifact[];
    readonly runtimeScopeIds?: readonly string[];
};
```

## src/features/core/modules/runtime/domain/execution-context.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/execution-context.types.ts)

```ts
export interface EndgeExecutionContext {
    readonly facets: Readonly<Record<string, string>>;
}
export interface EndgeExecutionContextFacetCandidate {
    identity: string;
    position: number;
    documents: readonly string[];
}
export interface EndgeExecutionContextResolutionInput {
    explicit?: Partial<EndgeExecutionContext>;
    facets: readonly EndgeExecutionContextFacetCandidate[];
}
```

## src/features/core/modules/runtime/domain/graphql-query-error.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/graphql-query-error.ts)

```ts
import type { QueryGraphQLErrorPolicy } from '@/features/core/modules/source/domain/types/query-source.types';
export interface GraphQLResponseErrorLocation {
    line: number;
    column: number;
}
export interface GraphQLResponseError {
    message: string;
    path?: ReadonlyArray<string | number>;
    locations?: ReadonlyArray<GraphQLResponseErrorLocation>;
    extensions?: Record<string, unknown>;
    [key: string]: unknown;
}
export interface GraphQLQueryErrorRequest {
    url: string;
    operationName?: string;
    status?: number;
}
export declare class GraphQLQueryError extends Error {
    readonly code = "graphql_query_error";
    readonly errors: readonly GraphQLResponseError[];
    readonly data: unknown;
    readonly url: string;
    readonly operationName?: string;
    readonly status?: number;
    constructor(errors: readonly GraphQLResponseError[], data: unknown, request: GraphQLQueryErrorRequest);
}
export declare class GraphQLResponseFormatError extends Error {
    readonly code = "graphql_response_format_error";
    readonly reason: string;
    readonly url: string;
    readonly operationName?: string;
    readonly status?: number;
    readonly contentType?: string;
    constructor(reason: string, request: GraphQLQueryErrorRequest & {
        contentType?: string;
    });
}
export declare function formatGraphQLResponseErrors(errors: readonly GraphQLResponseError[]): string;
export interface GraphQLExecutionResult {
    data: unknown;
    errors: GraphQLResponseError[];
}
export declare function readGraphQLExecutionResult(body: unknown, request: GraphQLQueryErrorRequest & {
    contentType?: string;
}): GraphQLExecutionResult;
export declare function normalizeGraphQLResponseError(error: unknown): GraphQLResponseError;
export type GraphQLNextRouting = {
    kind: 'publish';
    data: unknown;
    graphQLErrors?: GraphQLResponseError[];
} | {
    kind: 'error';
    error: GraphQLQueryError;
} | {
    kind: 'skip';
};
export declare function routeGraphQLNextResult(result: GraphQLExecutionResult, errorPolicy: QueryGraphQLErrorPolicy, request: GraphQLQueryErrorRequest): GraphQLNextRouting;
```

## src/features/core/modules/runtime/domain/query-execution.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/query-execution.types.ts)

```ts
import type { QueryProgramPayload } from '@/features/core/modules/program/domain/types/program.types';
import type { GraphQLResponseError } from '@/features/core/modules/runtime/domain/graphql-query-error';
export interface QueryExecutionRequest {
    protocol: 'REST' | 'GraphQL';
    method: string;
    url: string;
    headers: Record<string, string>;
    params: Record<string, unknown>;
    body?: unknown;
    operationName?: string;
    timeoutMs?: number;
    authHeaders: string[];
    authParams: string[];
}
export interface QueryExecutionResponse {
    status?: number;
    statusText?: string;
    headers: Record<string, string>;
    data: unknown;
}
export interface QueryExecutionObserver {
    onRequest?: (request: QueryExecutionRequest) => void;
    onResponse?: (response: QueryExecutionResponse) => void;
}
export interface QueryExecutionContext extends QueryExecutionObserver {
    payload: QueryProgramPayload;
    vars?: Record<string, unknown>;
    signal?: AbortSignal;
    onGraphQLErrors?: (errors: readonly GraphQLResponseError[]) => void;
}
```

## src/features/core/modules/runtime/domain/runtime-entity-map.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/runtime-entity-map.types.ts)

```ts
import type { RAction } from '@/features/core/modules/domain/entities/RAction';
import type { RComponentSFC } from '@/features/core/modules/domain/entities/RComponentSFC';
import type { RComposition } from '@/features/core/modules/domain/entities/RComposition';
import type { RFilter } from '@/features/core/modules/domain/entities/RFilter';
import type { RPage } from '@/features/core/modules/domain/entities/RPage';
import type { RQuery } from '@/features/core/modules/domain/entities/RQuery';
import type { RSimulation } from '@/features/core/modules/domain/entities/RSimulation';
import type { RStore } from '@/features/core/modules/domain/entities/RStore';
import type { RStream } from '@/features/core/modules/domain/entities/RStream';
export interface RuntimeEntityModelMap {
    'simulation': RSimulation;
    'page': RPage;
    'component-sfc': RComponentSFC;
    'query': RQuery;
    'filter': RFilter;
    'composition': RComposition;
    'store': RStore;
    'stream': RStream;
    'action': RAction;
}
export type RuntimeEntityType = keyof RuntimeEntityModelMap;
```

## src/features/core/modules/runtime/domain/runtime-execute.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/runtime-execute.type.ts)

```ts
import type { EndgePersistenceDriver } from '@/features/core/modules/context/domain/context-persistence.types';
import type { RuntimeArtifactReader } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { AnyRuntimeHost } from '@/features/core/modules/runtime/domain/runtime-strategy.types';
export type RuntimeParentRef = AnyRuntimeHost | string;
export interface RuntimeAppScopeReference {
    readonly id: string;
}
export interface RuntimeExecuteOptions {
    id?: string;
    instanceId?: string;
    parent?: RuntimeParentRef | null;
    appScope?: RuntimeAppScopeReference | string;
    artifactReader?: RuntimeArtifactReader;
    persistence?: EndgePersistenceDriver;
    persistenceKey?: string;
    meta?: Record<string, unknown>;
}
export type RuntimeAppScopeExecuteOptions = Omit<RuntimeExecuteOptions, 'appScope'>;
```

## src/features/core/modules/runtime/domain/runtime-host.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/runtime-host.types.ts)

```ts
import type { PathEvent, PhaseName, RaphFrameContext, RaphNode } from '@raphy-js/raph';
import type { RuntimeStateControllerLike } from '@/features/core/modules/context/domain/context-persistence.types';
import type { ProgramArtifact, ProgramEntityType } from '@/features/core/modules/program/domain/types/program.types';
import type { RuntimeEntityModelMap, RuntimeEntityType } from '@/features/core/modules/runtime/domain/runtime-entity-map.types';
import type { RuntimeKind } from '@/features/core/modules/runtime/domain/runtime.types';
export type RuntimeHostStatus = 'created' | 'mounted' | 'running' | 'active' | 'pausing' | 'paused' | 'stopping' | 'stopped' | 'unmounted' | 'destroyed' | 'error';
export type RuntimeHostCapability = 'renderable';
export type RuntimeHostResourceKind = 'raph-node' | 'derived' | 'event-subscription' | 'scope' | 'meta';
export interface RuntimeHostResource {
    id: string;
    kind: RuntimeHostResourceKind;
    title: string;
    subtitle?: string;
    payload?: Record<string, unknown>;
}
export type RuntimeHostChannelKind = 'raph' | 'event-bus' | 'external';
export interface RuntimeHostChannel {
    id: string;
    kind: RuntimeHostChannelKind;
    name: string;
    direction: 'in' | 'out' | 'both';
    subtitle?: string;
}
export interface RuntimeHostContextBase {
    status: 'idle' | 'running' | 'success' | 'error';
    startedAt: string | null;
    updatedAt: string | null;
}
export interface ActionRuntimeHostContext extends RuntimeHostContextBase {
    input: Record<string, unknown>;
    result: unknown;
    parent?: ActionRuntimeHostContext | null;
}
export interface QueryRuntimeHostContext extends RuntimeHostContextBase {
    lastFilterChangeAt: string | null;
}
export interface FilterRuntimeHostContext extends RuntimeHostContextBase {
    instance: string;
    lastStateChangeAt: string | null;
}
export interface CompositionRuntimeHostContext extends RuntimeHostContextBase {
    mountedChildren: number;
    lastHookAt: string | null;
}
export interface StoreRuntimeHostContext extends RuntimeHostContextBase {
    lastStateChangeAt: string | null;
    writableFields: string[];
    derivedFields: string[];
}
export interface StreamRuntimeHostContext extends RuntimeHostContextBase {
    lastEventAt: string | null;
    receivedCount: number;
}
export interface ComponentSFCRuntimeHostContext extends RuntimeHostContextBase {
    target: 'dom' | 'canvas' | null;
    lastParseAt: string | null;
    lastCompileAt: string | null;
    lastRenderAt: string | null;
}
export interface PageRuntimeHostContext extends RuntimeHostContextBase {
    lastRenderAt: string | null;
}
export interface RuntimeHostContextMap {
    'simulation': RuntimeHostContextBase;
    'action': ActionRuntimeHostContext;
    'query': QueryRuntimeHostContext;
    'filter': FilterRuntimeHostContext;
    'composition': CompositionRuntimeHostContext;
    'store': StoreRuntimeHostContext;
    'stream': StreamRuntimeHostContext;
    'component-sfc': ComponentSFCRuntimeHostContext;
    'page': PageRuntimeHostContext;
}
export type RuntimeHostContext<TType extends RuntimeEntityType> = RuntimeHostContextMap[TType];
export interface RuntimeHostSnapshot {
    id: string;
    basePath: string;
    parentId: string | null;
    removedAt: number | null;
    runtimeType: string;
    capabilities: RuntimeHostCapability[];
    entityType: RuntimeEntityType;
    entityIdentity: string;
    title: string;
    status: RuntimeHostStatus;
    createdAt: number;
    updatedAt: number;
    resources: RuntimeHostResource[];
    channels: RuntimeHostChannel[];
    meta: Record<string, unknown>;
    context: Record<string, unknown>;
}
export interface DestroyedRuntimeHostSnapshot {
    id: string;
    basePath: string;
    parentId: string | null;
    runtimeType: string;
    capabilities: RuntimeHostCapability[];
    entityType: RuntimeEntityType;
    entityIdentity: string;
    title: string;
    previousStatus: RuntimeHostStatus;
    status: 'destroyed';
    createdAt: number;
    updatedAt: number;
    removedAt: number;
    resources: Array<Omit<RuntimeHostResource, 'payload'>>;
    channels: RuntimeHostChannel[];
}
export interface RuntimeInspectionLease {
    release: () => void;
}
export interface RuntimeHostLifecycle {
    create: () => Promise<void> | void;
    mount: () => Promise<void> | void;
    start: () => Promise<void> | void;
    pause: () => Promise<void> | void;
    resume: () => Promise<void> | void;
    reconcile: () => Promise<void> | void;
    stop: () => Promise<void> | void;
    unmount: () => Promise<void> | void;
    quiesce: () => Promise<void> | void;
    destroy: () => Promise<void> | void;
    update: (ctx: RuntimeHostUpdateContext) => Promise<void> | void;
}
export interface RuntimeArtifactReader {
    getArtifact: <TPayload = unknown>(entityType: ProgramEntityType, idOrIdentity: string | number) => ProgramArtifact<TPayload> | null;
}
export interface RuntimeHostArtifactRef {
    entityType: ProgramEntityType;
    id?: string | number;
    identity?: string;
}
export declare const RUNTIME_BOUNDARY_UPDATE_PHASE_NAME: PhaseName;
export declare const RUNTIME_NODE_UPDATE_PHASE_NAME: PhaseName;
export type RuntimePhaseEvent = PathEvent;
export type RuntimeHostInputBinding = {
    kind: 'literal';
    value: unknown;
} | {
    kind: 'raph';
    path: string;
};
export interface RuntimeHostUpdateBinding {
    id: string;
    sourcePath: string;
    update: {
        kind: string;
        payload?: unknown;
    };
    policy?: {
        debounceMs?: number;
    };
}
export interface RuntimeHostResolvedUpdate {
    bindingId: string;
    sourcePath: string;
    kind: string;
    payload?: unknown;
}
export interface RuntimeHostLocalInputSource {
    kind: 'local';
    props: Record<string, unknown>;
}
export interface RuntimeHostRaphInputBinding {
    path: string;
    wildcardDynamic?: boolean;
    metaSource?: {
        path: string;
        key?: string;
        fields?: Record<string, string>;
    };
}
export interface RuntimeHostRaphInputSource {
    kind: 'raph';
    bindings: Record<string, RuntimeHostRaphInputBinding>;
    props?: Record<string, unknown>;
}
export type RuntimeHostInputSource = RuntimeHostLocalInputSource | RuntimeHostRaphInputSource;
export interface RuntimeDirtyBoundary {
    boundary: RaphNode;
    dirtyNodes: RaphNode[];
    events: RuntimePhaseEvent[];
}
export interface RuntimeHostUpdateContext {
    node: RaphNode;
    events: RuntimePhaseEvent[];
    boundaries: RuntimeDirtyBoundary[];
    frame: RaphFrameContext;
    updates?: RuntimeHostResolvedUpdate[];
}
export interface RuntimeCollectionProjectionPatch {
    boundaryId: string;
    key: string;
    index: number;
}
export interface RuntimeCollectionProjectionUpdatePatch {
    kind: 'collection-projection-update';
    boundaryId: string;
    boundaryType: 'table';
    sourcePath: string;
    itemIndex: number | null;
    itemKey: unknown;
    itemSnapshot: unknown;
    changedPaths: string[][];
    affectedProjections: RuntimeCollectionProjectionPatch[];
    events: RuntimePhaseEvent[];
    node: RaphNode;
}
export interface RuntimeCollectionItemPatch {
    itemIndex: number | null;
    itemKey: unknown;
    itemSnapshot: unknown;
    changedPaths: string[][];
}
export interface RuntimeCollectionProjectionBatchPatch {
    kind: 'collection-projection-batch';
    boundaryId: string;
    boundaryType: 'table';
    sourcePath: string;
    items: RuntimeCollectionItemPatch[];
    affectedProjections: RuntimeCollectionProjectionPatch[];
    events: RuntimePhaseEvent[];
    node: RaphNode;
}
export type RuntimeBoundaryPatch = RuntimeCollectionProjectionUpdatePatch | RuntimeCollectionProjectionBatchPatch;
export interface RuntimeHost<TType extends RuntimeEntityType = RuntimeEntityType, TContext extends RuntimeHostContext<TType> = RuntimeHostContext<TType>, TArtifactPayload = unknown> extends RuntimeHostLifecycle {
    readonly id: string;
    readonly parent: RuntimeHost<any, any> | null;
    readonly kind: RuntimeKind | 'runtime';
    readonly runtimeType: string;
    readonly capabilities: readonly RuntimeHostCapability[];
    readonly entityType: TType;
    readonly model: RuntimeEntityModelMap[TType];
    readonly entityIdentity: string;
    readonly title: string;
    status: RuntimeHostStatus;
    readonly createdAt: number;
    updatedAt: number;
    readonly resources: RuntimeHostResource[];
    readonly channels: RuntimeHostChannel[];
    readonly meta: Record<string, unknown>;
    context: TContext;
    readonly runtimeState: RuntimeStateControllerLike | null;
    readonly node: RaphNode | null;
    readonly basePath: string;
    statePath: (path?: string) => string;
    outputPath: (name: string) => string;
    bindInput: (name: string, binding: RuntimeHostInputBinding) => void;
    readInput: (name: string) => unknown;
    readInputs: () => Readonly<Record<string, unknown>>;
    bindUpdate: (binding: RuntimeHostUpdateBinding) => () => void;
    getArtifact: () => ProgramArtifact<TArtifactPayload> | null;
    getArtifactReader: () => RuntimeArtifactReader | null;
    getArtifactPayload: () => TArtifactPayload | null;
    setStatus: (status: RuntimeHostStatus) => void;
    hasCapability: (capability: RuntimeHostCapability) => boolean;
    addResource: (resource: RuntimeHostResource) => void;
    addChannel: (channel: RuntimeHostChannel) => void;
    emit: (event: string, payload: any) => void;
    on: (event: string, listener: (payload: any) => void) => any;
    off: (event: string, listener: (payload: any) => void) => any;
    setContext: (patch: Partial<TContext>) => void;
    replaceContext: (context: TContext) => void;
    attachRuntimeState: (runtimeState: RuntimeStateControllerLike | null) => void;
    update: (ctx: RuntimeHostUpdateContext) => Promise<void> | void;
    snapshot: () => RuntimeHostSnapshot;
    captureRenderInspection?: () => import('./runtime-render-inspection.types').RuntimeRenderableInspection;
}
```

## src/features/core/modules/runtime/domain/runtime-inspection.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/runtime-inspection.types.ts)

```ts
import type { RuntimeHostStatus } from './runtime-host.types';
import type { RuntimeRenderInspection } from './runtime-render-inspection.types';
import type { EndgeRuntimeSnapshot } from './runtime.types';
export interface RuntimeInspectionSnapshot {
    version: 1;
    runtime: EndgeRuntimeSnapshot;
    data?: unknown;
    render?: RuntimeRenderInspection;
    dataGeneratedAt?: number;
    dataError?: string;
}
export type RuntimeControlTarget = {
    kind: 'host';
    id: string;
    createdAt: number;
} | {
    kind: 'scope';
    id: string;
    generation: number;
};
export type RuntimeControlOperation = 'pause' | 'resume' | 'stop';
export interface RuntimeStatusChange {
    readonly id: string;
    readonly previous: RuntimeHostStatus;
    readonly value: RuntimeHostStatus;
}
```

## src/features/core/modules/runtime/domain/runtime-registry.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/runtime-registry.types.ts)

```ts
import type { RuntimeEntityType } from '@/features/core/modules/runtime/domain/runtime-entity-map.types';
import type { DestroyedRuntimeHostSnapshot, RuntimeHost, RuntimeHostSnapshot } from '@/features/core/modules/runtime/domain/runtime-host.types';
export interface RuntimeHostRegistrySnapshot {
    total: number;
    byStatus: Record<string, number>;
    hosts: RuntimeHostSnapshot[];
    deletedTotal: number;
    deletedHosts: DestroyedRuntimeHostSnapshot[];
}
export interface RuntimeHostRegistryLike {
    register: <T extends RuntimeHost<any, any>>(host: T) => T;
    getById: (id: string) => RuntimeHost<any, any> | null;
    getAll: () => RuntimeHost<any, any>[];
    getByEntity: (entityType: RuntimeEntityType, entityIdentity: string) => RuntimeHost<any, any>[];
    removeById: (id: string) => RuntimeHost<any, any> | null;
    clear: () => void;
    rememberDeletedSnapshot: (snapshot: DestroyedRuntimeHostSnapshot) => void;
    getDeletedSnapshots: () => DestroyedRuntimeHostSnapshot[];
    removeDeletedSnapshot: (id: string) => DestroyedRuntimeHostSnapshot | null;
    setDeletedSnapshotLimit: (limit: number) => void;
    clearDeleted: () => void;
    snapshot: () => RuntimeHostRegistrySnapshot;
}
```

## src/features/core/modules/runtime/domain/runtime-render-inspection.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/runtime-render-inspection.types.ts)

```ts
import type { ComputationRuntimeErrorShape } from '@/features/core/modules/domain/types/computation/computation-runtime.types';
import type { RuntimeHostInputSource } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { FilterViewRenderModel } from '@/features/core/modules/source/domain/types/filter-view.type';
import type { EndgeStyleSheetArtifact } from '@/features/core/modules/styles/domain/types/style.types';
export interface RuntimeComputationInspection {
    identity: string;
    input: unknown;
    status: 'idle' | 'pending' | 'success' | 'error';
    loading: boolean;
    value: unknown;
    error: ComputationRuntimeErrorShape | null;
}
export type RuntimeRenderableInspection = {
    kind: 'component-sfc';
    input: RuntimeHostInputSource | null;
    computations: RuntimeComputationInspection[];
    dataMeta: Record<string, unknown>;
} | {
    kind: 'filter-view';
    model: FilterViewRenderModel;
};
export interface RuntimeRenderInspection {
    hosts: Record<string, RuntimeRenderableInspection>;
    styles: readonly EndgeStyleSheetArtifact[];
}
```

## src/features/core/modules/runtime/domain/runtime-resource.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/runtime-resource.types.ts)

```ts
export interface RuntimeOwnedResource {
    readonly id: string;
    readonly kind: string;
    pause?: () => Promise<void> | void;
    resume?: () => Promise<void> | void;
    dispose: () => Promise<void> | void;
}
export interface RuntimeResourceBagSnapshot {
    total: number;
    paused: boolean;
    resources: Array<{
        id: string;
        kind: string;
    }>;
}
```

## src/features/core/modules/runtime/domain/runtime-scope.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/runtime-scope.types.ts)

```ts
import type { RuntimeHost } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { RuntimeResourceBagSnapshot } from '@/features/core/modules/runtime/domain/runtime-resource.types';
export type RuntimeScopeState = 'inactive' | 'activating' | 'active' | 'pausing' | 'paused' | 'resuming' | 'deactivating' | 'error' | 'disposed';
export interface RuntimeScopeSnapshot {
    id: string;
    path: string;
    parentScopeId: string | null;
    ownerRuntimeId: string | null;
    boundaryId: string;
    state: RuntimeScopeState;
    generation: number;
    stale: boolean;
    updateGateOpen: boolean;
    childScopeIds: string[];
    memberRuntimeIds: string[];
    resources: RuntimeResourceBagSnapshot;
    lastError: string | null;
}
export interface RuntimeScopeHandle {
    readonly id: string;
    readonly path: string;
    readonly state: RuntimeScopeState;
    readonly boundaryId: string;
    activate: () => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    deactivate: () => Promise<void>;
    dispose: () => Promise<void>;
    getRuntime: (path: string) => RuntimeHost<any, any> | null;
    getOutput: (name: string) => unknown;
    snapshot: () => RuntimeScopeSnapshot;
}
export interface RuntimeScopeLifecycleHooks {
    activate?: (signal: AbortSignal, generation: number) => Promise<void> | void;
    pause?: () => Promise<void> | void;
    resume?: (signal: AbortSignal, generation: number) => Promise<void> | void;
    reconcile?: () => Promise<void> | void;
    deactivate?: () => Promise<void> | void;
    dispose?: () => Promise<void> | void;
    destroyRuntime?: (runtimeId: string) => Promise<void> | void;
    resolveRuntime?: (path: string) => RuntimeHost<any, any> | null;
    resolveOutput?: (name: string) => unknown;
}
```

## src/features/core/modules/runtime/domain/runtime-strategy.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/runtime-strategy.types.ts)

```ts
import type { RuntimeEntityType } from './runtime-entity-map.types';
import type { RuntimeArtifactReader, RuntimeHost } from './runtime-host.types';
export type RuntimeStrategyMeta = Record<string, any>;
export type AnyRuntimeHost = RuntimeHost<any, any>;
export interface RuntimeCreateContext<TModel = unknown> {
    id: string;
    model: TModel;
    meta: RuntimeStrategyMeta;
    parent: AnyRuntimeHost | null;
    artifacts: RuntimeArtifactReader;
}
export interface RuntimeDestroyContext<THost extends AnyRuntimeHost = AnyRuntimeHost> {
    host: THost;
}
export interface RuntimeStrategy<TModel = unknown, THost extends AnyRuntimeHost = AnyRuntimeHost> {
    id: string;
    entityType: RuntimeEntityType;
    supports: (model: unknown) => model is TModel;
    create: (ctx: RuntimeCreateContext<TModel>) => THost | null;
    destroy?: (ctx: RuntimeDestroyContext<THost>) => Promise<void> | void;
}
export type AnyRuntimeStrategy = RuntimeStrategy<any, any>;
```

## src/features/core/modules/runtime/domain/runtime.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/runtime.types.ts)

```ts
import type { RAction } from '@/features/core/modules/domain/entities/RAction';
import type { RComponentSFC } from '@/features/core/modules/domain/entities/RComponentSFC';
import type { RComposition } from '@/features/core/modules/domain/entities/RComposition';
import type { RFilter } from '@/features/core/modules/domain/entities/RFilter';
import type { RPage } from '@/features/core/modules/domain/entities/RPage';
import type { RQuery } from '@/features/core/modules/domain/entities/RQuery';
import type { RSimulation } from '@/features/core/modules/domain/entities/RSimulation';
import type { RStore } from '@/features/core/modules/domain/entities/RStore';
import type { RStream } from '@/features/core/modules/domain/entities/RStream';
import type { RuntimeHostRegistrySnapshot } from '@/features/core/modules/runtime/domain/runtime-registry.types';
export type RuntimeKind = 'query' | 'filter' | 'composition' | 'store' | 'stream' | 'action' | 'simulation' | 'runtime';
export type RuntimeExecutableModel = RQuery | RAction | RPage | RComponentSFC | RFilter | RComposition | RStore | RStream | RSimulation;
export interface EndgeRuntimeSnapshot extends RuntimeHostRegistrySnapshot {
    generatedAt: number;
    scopes: import('@/features/core/modules/runtime/domain/runtime-scope.types').RuntimeScopeSnapshot[];
}
export interface EndgeRuntimeRaphSnapshot {
    data?: unknown;
    render?: import('./runtime-render-inspection.types').RuntimeRenderInspection;
    graph?: {
        runtimeId: string;
        loopEnabled: boolean;
        frame: unknown;
        nodes: unknown[];
        tree: unknown[];
        derived: unknown;
    };
}
export interface FilterChangeEvent {
    filterId: string;
}
export interface QueryRuntimeEvents {
    'filter:change': FilterChangeEvent;
}
export interface ActionRuntimeEvents {
    'source:change': {
        events?: unknown[];
        meta?: Record<string, unknown>;
    };
    'step:start': {
        stepId: string;
        runtimeId?: string | null;
        actionId?: string | null;
        title?: string | null;
        meta?: Record<string, unknown>;
    };
    'step:success': {
        stepId: string;
        runtimeId?: string | null;
        actionId?: string | null;
        title?: string | null;
        output?: unknown;
        meta?: Record<string, unknown>;
    };
    'step:error': {
        stepId: string;
        runtimeId?: string | null;
        actionId?: string | null;
        title?: string | null;
        error: unknown;
        meta?: Record<string, unknown>;
    };
}
export interface RuntimeProfile<K extends RuntimeKind, E extends Record<string, any>> {
    kind: K;
    events: E;
}
export interface RuntimeProfiles {
    query: RuntimeProfile<'query', QueryRuntimeEvents>;
    action: RuntimeProfile<'action', ActionRuntimeEvents>;
}
export type RuntimeProfileByKind<K extends keyof RuntimeProfiles> = RuntimeProfiles[K];
export type RuntimeEventsByKind<K extends keyof RuntimeProfiles> = RuntimeProfileByKind<K>['events'];
```

## src/features/core/modules/runtime/domain/sfc-render-inspection.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/sfc-render-inspection.type.ts)

```ts
import type { RComponentSFC_SourceRange } from '@/features/core/modules/domain/types/component/sfc/location.types';
export type SFCRenderInspectionNodeKind = 'component' | 'element' | 'text' | 'expression';
export interface SFCRenderInspectionBinding {
    kind: 'literal' | 'expression';
    source?: string;
    reads: string[];
    value: unknown;
}
export interface SFCRenderInspectionNodeInput {
    runtimeId: string;
    componentIdentity: string;
    componentStack: string[];
    scope: string;
    parentId: string | null;
    nodeId: string;
    kind: SFCRenderInspectionNodeKind;
    tag: string;
    componentTag?: string;
    calledComponentIdentity?: string;
    sourceRange?: RComponentSFC_SourceRange;
    props: Record<string, unknown>;
    componentProps: Record<string, unknown>;
    locals: Record<string, unknown>;
    bindings: Record<string, SFCRenderInspectionBinding>;
    meta?: Record<string, unknown>;
}
export interface SFCRenderInspectionNode extends SFCRenderInspectionNodeInput {
    id: string;
    updatedAt: number;
}
export interface SFCRenderInspectionTreeNode extends SFCRenderInspectionNode {
    children: SFCRenderInspectionTreeNode[];
}
export interface SFCRenderInspectionSessionLike {
    registerNode: (input: SFCRenderInspectionNodeInput) => string;
    unregisterNode: (id: string) => void;
    getNode: (id: string) => SFCRenderInspectionNode | null;
    getTree: (runtimeId?: string) => SFCRenderInspectionTreeNode[];
    subscribe: (listener: () => void) => VoidFunction;
    clearRuntime: (runtimeId: string) => void;
    clear: () => void;
}
```

## src/features/core/modules/runtime/domain/simulation-runtime.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/simulation-runtime.types.ts)

```ts
import type { RuntimeArtifactReader } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { StreamTransportConnection, StreamTransportFactory } from '@/features/core/modules/runtime/domain/stream-runtime.types';
import type { SimulationRuntimeHost } from '@/features/core/modules/runtime/hosts/SimulationRuntimeHost';
import type { SimulationMockStream } from '@/features/core/modules/source/domain/types/simulation-source.types';
export interface SimulationGenerator {
    generate: (schema: Record<string, unknown>, seed: string, signal: AbortSignal) => Promise<unknown>;
    openStream: (schema: Record<string, unknown>, options: SimulationMockStream, callbacks: Parameters<StreamTransportFactory['open']>[1]) => StreamTransportConnection;
}
export interface SimulationMountOptions {
    generator?: SimulationGenerator;
    artifactReader?: RuntimeArtifactReader;
    forceMock?: boolean;
    props?: Record<string, unknown>;
}
export interface SimulationRuntimeSession {
    readonly id: string;
    readonly host: SimulationRuntimeHost;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    unmount: () => Promise<void>;
}
```

## src/features/core/modules/runtime/domain/stream-runtime.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/stream-runtime.types.ts)

```ts
import type { GraphQLResponseError } from '@/features/core/modules/runtime/domain/graphql-query-error';
import type { StreamSourceArtifact } from '@/features/core/modules/source/domain/types/stream-source.types';
export interface StreamTransportMessage {
    sourceEvent: string;
    id: string | null;
    data: unknown;
    graphQLErrors?: readonly GraphQLResponseError[];
}
export interface StreamTransportConnection {
    close: () => void | Promise<void>;
    pause?: () => Promise<void>;
    resume?: () => Promise<void>;
}
export interface StreamTransportRequest {
    variables?: Record<string, unknown>;
    headers?: Record<string, string>;
    extensions?: Record<string, unknown>;
}
export interface StreamTransportFactory {
    open: (artifact: StreamSourceArtifact, callbacks: {
        message: (message: StreamTransportMessage) => void;
        error: (error: unknown) => void;
        open: () => void;
    }, request?: StreamTransportRequest) => StreamTransportConnection;
}
```

## src/features/core/modules/runtime/domain/table-binding.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/table-binding.types.ts)

```ts
export interface TableBinding {
    keys: Record<string, {
        pk: string;
        fk: string;
    }>;
}
```

## src/features/core/modules/runtime/domain/table.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/table.types.ts)

```ts
export interface ColumnSortConfig {
    by: string;
    type: string;
}
```

## src/features/core/modules/runtime/domain/vocab-cache.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/domain/vocab-cache.types.ts)

```ts
export type VocabReference = string | number;
export type VocabLoadStrategy = 'cache-first' | 'network-first' | 'stale-while-revalidate';
export type VocabLoadErrorPolicy = 'fail' | 'use-cache';
export interface VocabLoadPolicy {
    strategy: VocabLoadStrategy;
    maxAgeMs: number | null;
    onError: VocabLoadErrorPolicy;
}
export declare const DEFAULT_VOCAB_LOAD_POLICY: Readonly<VocabLoadPolicy>;
export type VocabCacheOperationStatus = 'cache-hit' | 'loaded' | 'refreshed' | 'refreshing' | 'invalidated';
export interface VocabCacheOperationResult {
    identity: string;
    status: VocabCacheOperationStatus;
    count: number;
}
export interface VocabRuntimeCatalogEntry {
    identity: string;
    path: string;
}
export type VocabRuntimeCatalog = Record<string, VocabRuntimeCatalogEntry>;
export interface VocabOptionMapping {
    valuePath: string;
    labelPath: string;
}
```

## src/features/core/modules/runtime/EndgeRuntime_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/EndgeRuntime_Module.ts)

```ts
import type { EndgeBootContext } from '@/features/core/kernel/types/bootstrap.types';
import type { RuntimeEntityType } from '@/features/core/modules/runtime/domain/runtime-entity-map.types';
import type { RuntimeExecuteOptions } from '@/features/core/modules/runtime/domain/runtime-execute.type';
import type { DestroyedRuntimeHostSnapshot, RuntimeHost, RuntimeInspectionLease } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { RuntimeControlOperation, RuntimeControlTarget, RuntimeInspectionSnapshot, RuntimeStatusChange } from '@/features/core/modules/runtime/domain/runtime-inspection.types';
import type { RuntimeRenderInspection } from '@/features/core/modules/runtime/domain/runtime-render-inspection.types';
import type { AnyRuntimeHost, AnyRuntimeStrategy } from '@/features/core/modules/runtime/domain/runtime-strategy.types';
import type { EndgeRuntimeRaphSnapshot, EndgeRuntimeSnapshot, RuntimeExecutableModel } from '@/features/core/modules/runtime/domain/runtime.types';
import type { RuntimeAppScopeOptions } from '@/features/core/modules/runtime/RuntimeAppScope';
import type { EndgeDataMode } from '@/features/core/modules/workspace/domain/workspace.types';
import { EndgeRuntimeScopes_Module } from '@/features/core/modules/runtime/EndgeRuntimeScopes_Module';
import { EndgeComposition } from '@/features/core/modules/runtime/execution/endge-composition';
import { EndgeDataView } from '@/features/core/modules/runtime/execution/endge-data-view';
import { EndgeQuery } from '@/features/core/modules/runtime/execution/endge-query';
import { EndgeSimulation } from '@/features/core/modules/runtime/execution/endge-simulation';
import { EndgeOperations_Module } from '@/features/core/modules/runtime/operation/EndgeOperations_Module';
import { RuntimeAppScope } from '@/features/core/modules/runtime/RuntimeAppScope';
import { RuntimeScope } from '@/features/core/modules/runtime/RuntimeScope';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeRuntime_Module extends EndgeModule<EndgeBootContext> {
    readonly query: EndgeQuery;
    readonly dataView: EndgeDataView;
    readonly composition: EndgeComposition;
    readonly simulation: EndgeSimulation;
    readonly operations: EndgeOperations_Module;
    readonly scopes: EndgeRuntimeScopes_Module;
    acquireDestroyedHostSnapshots(limit: number): RuntimeInspectionLease;
    constructor();
    notify(): void;
    setup(ctx: EndgeBootContext): void;
    start(): void;
    execute(model: RuntimeExecutableModel, options?: RuntimeExecuteOptions): AnyRuntimeHost | null;
    executeAsync(model: RuntimeExecutableModel, options?: RuntimeExecuteOptions): Promise<AnyRuntimeHost | null>;
    resolveDataMode(host: RuntimeHost<any, any> | null | undefined): EndgeDataMode;
    mountStartup(options?: Parameters<EndgeComposition['mount']>[1]): Promise<import("@/features/core/modules/source/domain/types/composition-source.types").CompositionSession<import("./hosts/CompositionRuntimeHost").CompositionRuntimeHost>>;
    registerStrategy(strategy: AnyRuntimeStrategy): void;
    createAppScope(options: RuntimeAppScopeOptions): RuntimeAppScope;
    getRuntimeScopeByHost(runtimeId: string): RuntimeScope | null;
    getDefaultAppScope(): RuntimeAppScope;
    getAppScope(id: string): RuntimeAppScope | null;
    getRuntimeById<T = AnyRuntimeHost>(runtimeId: string): T | null;
    getRuntimeHosts(): AnyRuntimeHost[];
    invalidateApplicationScopes(): void;
    registerRuntimeHost(host: AnyRuntimeHost): boolean;
    getDeletedRuntimeHostSnapshots(): DestroyedRuntimeHostSnapshot[];
    removeDeletedRuntimeHostSnapshot(runtimeId: string): void;
    clearDeletedRuntimeHostSnapshots(): void;
    getRuntimeHostsByEntity(entityType: RuntimeEntityType, entityIdentity: string, appScopeId?: string): AnyRuntimeHost[];
    createDiagnosticsSnapshot(): EndgeRuntimeSnapshot & {
        operations: unknown;
    };
    snapshot(): EndgeRuntimeSnapshot;
    snapshotRaph(options: {
        includeData: boolean;
        includeGraph: boolean;
    }): EndgeRuntimeRaphSnapshot;
    captureInspection(includeData?: boolean): RuntimeInspectionSnapshot;
    applyInspectionSnapshot(value: unknown): void;
    replaceInspectionSnapshot(value: unknown): void;
    applyInspectionEvent(change: RuntimeStatusChange): void;
    applyInspectionData(data: unknown, generatedAt: number, render?: RuntimeRenderInspection): void;
    applyInspectionDataError(message: string): void;
    captureInspectionData(): {
        data: unknown;
        render?: RuntimeRenderInspection;
        generatedAt: number;
    };
    clearInspection(): void;
    get inspection(): Readonly<RuntimeInspectionSnapshot>;
    acquireDataChanges(): RuntimeInspectionLease;
    control(operation: RuntimeControlOperation, input: RuntimeControlTarget): Promise<void>;
    destroyRuntime(runtimeId: string): void;
    destroyRuntimeTree(runtimeId: string): void;
    destroyRuntimeTreeAsync(runtimeId: string): Promise<void>;
    reset(): Promise<void>;
}
```

## src/features/core/modules/runtime/EndgeRuntimeScopes_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/EndgeRuntimeScopes_Module.ts)

```ts
import type { RuntimeHost } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { RuntimeScope } from '@/features/core/modules/runtime/RuntimeScope';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeRuntimeScopes_Module extends EndgeModule {
    constructor(_onChange?: () => void);
    notify(): void;
    register(scope: RuntimeScope): RuntimeScope;
    transaction<T>(operation: () => T): T;
    get(id: string): RuntimeScope | null;
    getAll(): RuntimeScope[];
    snapshot(): import("./domain/runtime-scope.types").RuntimeScopeSnapshot[];
    attachRuntime(scopeId: string, host: RuntimeHost<any, any>): void;
    detachRuntime(runtimeId: string): void;
    getByRuntime(runtimeId: string): RuntimeScope | null;
    remove(id: string): Promise<void>;
    reset(): Promise<void>;
}
```

## src/features/core/modules/runtime/execution/endge-composition.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/execution/endge-composition.ts)

```ts
import type { CompositionRuntimeHost } from '@/features/core/modules/runtime/hosts/CompositionRuntimeHost';
import type { CompositionMountOptions, CompositionPreviewProps, CompositionSession } from '@/features/core/modules/source/domain/types/composition-source.types';
import type { EndgeDataMode } from '@/features/core/modules/workspace/domain/workspace.types';
export declare class EndgeComposition {
    mount(identity: string, options?: CompositionMountOptions): Promise<CompositionSession<CompositionRuntimeHost>>;
}
export declare function materializeCompositionPreviewProps(previewProps: CompositionPreviewProps | null | undefined, dataMode?: EndgeDataMode): Record<string, unknown>;
```

## src/features/core/modules/runtime/execution/endge-data-view.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/execution/endge-data-view.ts)

```ts
import type { DataViewProgramPayload, ProgramArtifact } from '@/features/core/modules/program/domain/types/program.types';
import type { DataViewRef, DataViewRunContext, DataViewRunTools } from '@/features/core/modules/source/domain/types/data-view-source.types';
import { RDataView } from '@/features/core/modules/domain/entities/RDataView';
export declare class DataViewArtifactUnavailableError extends Error {
    readonly code = "data_view_artifact_unavailable";
    constructor(identity: string);
}
export declare class EndgeDataView {
    run(dataViewOrId: RDataView | string | number, input: unknown, tools?: Partial<DataViewRunTools>, context?: DataViewRunContext): unknown;
    runArtifact(artifact: ProgramArtifact<DataViewProgramPayload>, input: unknown, tools?: Partial<DataViewRunTools>, context?: DataViewRunContext): unknown;
    runPayload(artifact: DataViewProgramPayload, input: unknown, tools?: Partial<DataViewRunTools>, context?: DataViewRunContext & {
        children?: ProgramArtifact[];
    }): unknown;
    runRef(ref: DataViewRef, input: unknown, tools?: Partial<DataViewRunTools>, context?: DataViewRunContext & {
        children?: ProgramArtifact[];
    }): unknown;
    runSource(source: string, input: unknown, tools?: Partial<DataViewRunTools>, context?: DataViewRunContext): unknown;
    convert(identity: string, value: unknown, options?: Record<string, unknown>): unknown;
}
```

## src/features/core/modules/runtime/execution/endge-query.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/execution/endge-query.ts)

```ts
import type { RQuery } from '@/features/core/modules/domain/entities/RQuery';
import type { QueryProgramPayload } from '@/features/core/modules/program/domain/types/program.types';
import type { GraphQLResponseError } from '@/features/core/modules/runtime/domain/graphql-query-error';
import type { QueryExecutionContext, QueryExecutionObserver } from '@/features/core/modules/runtime/domain/query-execution.types';
import type { RuntimeParentRef } from '@/features/core/modules/runtime/domain/runtime-execute.type';
import { QueryExecutor_Adapter } from '@/features/core/modules/runtime/adapters/QueryExecutor_Adapter';
export declare class EndgeQuery {
    constructor(executor?: QueryExecutor_Adapter);
    run(query: RQuery, params?: Record<string, unknown>, parent?: RuntimeParentRef | null, options?: {
        observer?: QueryExecutionObserver;
    }): Promise<any>;
    executeArtifact(input: {
        payload: QueryProgramPayload;
        props: Record<string, unknown>;
        signal?: AbortSignal;
        onGraphQLErrors?: QueryExecutionContext['onGraphQLErrors'];
        observer?: QueryExecutionObserver;
    }): Promise<any>;
    applySimulatedGraphQLErrors(input: {
        payload: QueryProgramPayload;
        data: unknown;
        errors: readonly unknown[] | undefined;
        props: Record<string, unknown>;
        onGraphQLErrors?: QueryExecutionContext['onGraphQLErrors'];
    }): unknown;
    readResponseOutput(output: QueryProgramPayload['outputs'][number], response: unknown, graphQLErrors?: readonly GraphQLResponseError[]): unknown;
}
```

## src/features/core/modules/runtime/execution/endge-response-output.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/execution/endge-response-output.ts)

```ts
import type { ProgramArtifact } from '@/features/core/modules/program/domain/types/program.types';
import type { DataViewRef } from '@/features/core/modules/source/domain/types/data-view-source.types';
import type { ResponseOutputTransform } from '@/features/core/modules/source/domain/types/response-output.types';
export declare function runResponseOutputTransforms(transforms: readonly ResponseOutputTransform[] | undefined, legacyDataViews: readonly DataViewRef[], value: unknown, children?: readonly ProgramArtifact[]): unknown;
```

## src/features/core/modules/runtime/execution/endge-simulation.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/execution/endge-simulation.ts)

```ts
import type { SimulationMountOptions, SimulationRuntimeSession } from '@/features/core/modules/runtime/domain/simulation-runtime.types';
export declare class EndgeSimulation {
    mount(identity: string, options?: SimulationMountOptions): Promise<SimulationRuntimeSession>;
}
```

## src/features/core/modules/runtime/hosts/ActionRuntimeHost.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/hosts/ActionRuntimeHost.ts)

```ts
import type { RAction } from '@/features/core/modules/domain/entities/RAction';
import type { ActionRuntimeHostContext, RuntimeHost } from '@/features/core/modules/runtime/domain/runtime-host.types';
import { RuntimeHostBase } from '@/features/core/modules/runtime/RuntimeHostBase';
export declare function createActionContext(options: {
    input?: Record<string, unknown> | unknown;
    parent?: ActionRuntimeHostContext | null;
}): ActionRuntimeHostContext;
export declare class ActionRuntimeHost extends RuntimeHostBase<'action'> {
    constructor(input: {
        id: string;
        model: RAction;
        entityIdentity: string;
        parent?: RuntimeHost<any, any> | null;
        title?: string;
        meta?: Record<string, unknown>;
    });
    static createRuntime(input: {
        id: string;
        model: RAction;
        meta?: Record<string, any>;
        parent?: RuntimeHost<any, any> | null;
    }): RuntimeHost<'action'>;
}
```

## src/features/core/modules/runtime/hosts/ComponentSFCRuntimeHost.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/hosts/ComponentSFCRuntimeHost.ts)

```ts
import type { RComponentSFC } from '@/features/core/modules/domain/entities/RComponentSFC';
import type { RComponentContract, RComponentDependencies, RComponentRenderTarget } from '@/features/core/modules/domain/types/component/component-core.types';
import type { RComponentSFC_AST } from '@/features/core/modules/domain/types/component/sfc/ast.types';
import type { RComponentSFC_RuntimeDependencies } from '@/features/core/modules/domain/types/component/sfc/dependencies.types';
import type { ComponentSFCEditedEventPayload, RComponentSFC_IR, RComponentSFC_IR_DataMetaReference } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { ComponentSFCEventOccurrence, ComponentSFCEventPort, ComponentSFCEventRuntimeSource } from '@/features/core/modules/domain/types/component/sfc/ports.types';
import type { RComponentSFCSource_Parts } from '@/features/core/modules/domain/types/component/sfc/source.types';
import type { ComputationResource } from '@/features/core/modules/domain/types/computation/computation-runtime.types';
import type { ComponentSFCPreviewOptions, ComponentSFCProgramPayload, ProgramDiagnostic } from '@/features/core/modules/program/domain/types/program.types';
import type { RuntimeArtifactReader, RuntimeHost, RuntimeHostContext, RuntimeHostInputSource, RuntimeHostUpdateContext } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { RuntimeRenderableInspection } from '@/features/core/modules/runtime/domain/runtime-render-inspection.types';
import type { VocabOptionMapping } from '@/features/core/modules/runtime/domain/vocab-cache.types';
import type { SourceFieldOption } from '@/features/core/modules/source/domain/types/source-expression.types';
import { RuntimeHostBase } from '@/features/core/modules/runtime/RuntimeHostBase';
export interface ComponentSFCEditSession {
    key: string;
    originalValue: unknown;
    draftValue: unknown;
    baseVariant: string;
}
export declare class ComponentSFCRuntimeHost extends RuntimeHostBase<'component-sfc', RuntimeHostContext<'component-sfc'>, ComponentSFCProgramPayload> {
    constructor(input: {
        id: string;
        model: RComponentSFC;
        entityIdentity: string;
        parent?: RuntimeHost<any, any> | null;
        title?: string;
        meta?: Record<string, unknown>;
        artifactReader?: RuntimeArtifactReader | null;
    });
    static createRuntime(input: {
        id: string;
        model: RComponentSFC;
        meta?: Record<string, any>;
        parent?: RuntimeHost<any, any> | null;
        artifactReader?: RuntimeArtifactReader | null;
    }): ComponentSFCRuntimeHost;
    getSourceParts(): RComponentSFCSource_Parts | null;
    getDiagnostics(): ProgramDiagnostic[];
    translate(key: string, fallback?: string): string;
    resolveVocabOptions(alias: string, mapping?: Partial<VocabOptionMapping>): SourceFieldOption[];
    getContract(): RComponentContract | null;
    getDependencies(): RComponentDependencies | null;
    getRuntimeDependencies(): RComponentSFC_RuntimeDependencies;
    getAst(): RComponentSFC_AST | null;
    getIr(): RComponentSFC_IR | null;
    getPreviewProps(): Record<string, unknown> | null;
    getPreviewOptions(): ComponentSFCPreviewOptions | null;
    onEventPort(name: string, listener: (occurrence: ComponentSFCEventOccurrence) => void): () => void;
    emitEventPort(name: string, payload: unknown, source?: ComponentSFCEventRuntimeSource): Promise<void>;
    executeEventPortAction(ownerIdentity: string, port: ComponentSFCEventPort, payload: unknown, source: ComponentSFCEventRuntimeSource | undefined, emitOwn: (name: string, payload: unknown, trace: string[], depth: number) => Promise<void>, trace?: string[], depth?: number, scope?: Record<string, unknown>): Promise<boolean>;
    publishEventPort(name: string, payload: unknown, source?: ComponentSFCEventRuntimeSource): void;
    getEditSession(key: string): Readonly<ComponentSFCEditSession> | null;
    beginEditSession(key: string, originalValue: unknown, baseVariant?: string): ComponentSFCEditSession;
    updateEditDraft(key: string, value: unknown): void;
    commitEditSession(key: string, value?: unknown): ComponentSFCEditedEventPayload | null;
    cancelEditSession(key?: string): void;
    getComputationResource(identity: string, input: unknown, consumerKey: string, portName?: string): ComputationResource;
    releaseComputationResources(consumerScope: string, keep?: (key: string) => boolean): void;
    setInputSource(input: RuntimeHostInputSource | null | undefined): void;
    getInputSource(): RuntimeHostInputSource | null;
    captureRenderInspection(): RuntimeRenderableInspection;
    readDataMeta(reference: RComponentSFC_IR_DataMetaReference & {
        boundaryId?: string;
        rowKey?: unknown;
    }, namespace?: string): unknown;
    update(ctx: RuntimeHostUpdateContext): void;
    pause(): void;
    resume(): void;
    destroy(): void;
    syncArtifactState(target: RComponentRenderTarget | null): void;
    preparePlaceholders(target: RComponentRenderTarget | null): void;
}
```

## src/features/core/modules/runtime/hosts/CompositionRuntimeHost.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/hosts/CompositionRuntimeHost.ts)

```ts
import type { RComposition } from '@/features/core/modules/domain/entities/RComposition';
import type { I18nRuntimeCatalog } from '@/features/core/modules/i18n/domain/i18n.types';
import type { RuntimeEntityModelMap } from '@/features/core/modules/runtime/domain/runtime-entity-map.types';
import type { RuntimeArtifactReader, RuntimeHost, RuntimeHostContext, RuntimeHostInputSource, RuntimeHostUpdateContext } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { VocabRuntimeCatalog } from '@/features/core/modules/runtime/domain/vocab-cache.types';
import type { FilterViewRuntimeHost } from '@/features/core/modules/runtime/hosts/FilterViewRuntimeHost';
import type { CompositionFilterFieldsSlice, CompositionProgramPayload, CompositionPublicOutputHandle, CompositionRuntimeActivationHandle, CompositionRuntimeChildHandle } from '@/features/core/modules/source/domain/types/composition-source.types';
import type { StoreMutationPlan } from '@/features/core/modules/source/domain/types/update-source.types';
import { RuntimeHostBase } from '@/features/core/modules/runtime/RuntimeHostBase';
import { RuntimeScope } from '@/features/core/modules/runtime/RuntimeScope';
export declare class CompositionRuntimeHost extends RuntimeHostBase<'composition', RuntimeHostContext<'composition'>, CompositionProgramPayload> {
    constructor(input: {
        id: string;
        model: RuntimeEntityModelMap['composition'];
        parent?: RuntimeHost<any, any> | null;
        meta?: Record<string, unknown>;
        artifactReader: RuntimeArtifactReader;
    });
    static createRuntime(input: {
        id: string;
        model: RComposition;
        meta?: Record<string, any>;
        parent?: RuntimeHost<any, any> | null;
        artifacts: RuntimeArtifactReader;
    }): CompositionRuntimeHost | null;
    mountGraph(): Promise<void>;
    getChild(name: string): RuntimeHost<any, any> | null;
    getChildren(): CompositionRuntimeChildHandle[];
    getFilterFieldsSlice(runtimeName: string, fieldKeys: string[]): CompositionFilterFieldsSlice | null;
    getOutputs(): Readonly<Record<string, CompositionPublicOutputHandle>>;
    getScope(path: string): RuntimeScope | null;
    getI18nCatalog(scopePath?: string): I18nRuntimeCatalog;
    getVocabCatalog(scopePath?: string): VocabRuntimeCatalog;
    getRuntimeHandle(path: string): CompositionRuntimeActivationHandle | null;
    getOutput(name: string): unknown;
    getDataSnapshot(): Readonly<Record<string, unknown>>;
    getProps(): Readonly<Record<string, unknown>>;
    mutateStore(dataAlias: string, plan: StoreMutationPlan): void;
    applyStoreUpdate(dataAlias: string, updateIdentity: string, payload: unknown): void;
    applyUpdateByIdentity(updateIdentity: string, payload: unknown): void;
    setInputSource(input: RuntimeHostInputSource | null | undefined): void;
    getDataPath(name: string, path?: string): string;
    quiesce(): void;
    destroy(): Promise<void>;
    protected onUpdate(ctx: RuntimeHostUpdateContext): void;
    isFilterViewRuntime(runtime: RuntimeHost<any, any>): runtime is FilterViewRuntimeHost;
}
```

## src/features/core/modules/runtime/hosts/FilterRuntimeHost.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/hosts/FilterRuntimeHost.ts)

```ts
import type { RFilter } from '@/features/core/modules/domain/entities/RFilter';
import type { RuntimeArtifactReader, RuntimeHost, RuntimeHostContext } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { FilterProgramPayload, FilterRuntimeActionHandle, FilterRuntimeActionId, FilterRuntimeOutput } from '@/features/core/modules/source/domain/types/filter-source.types';
import type { SourceFieldDefinition } from '@/features/core/modules/source/domain/types/source-expression.types';
import { RuntimeHostBase } from '@/features/core/modules/runtime/RuntimeHostBase';
export declare class FilterRuntimeHost extends RuntimeHostBase<'filter', RuntimeHostContext<'filter'>, FilterProgramPayload> {
    constructor(input: {
        id: string;
        model: RFilter;
        parent?: RuntimeHost<any, any> | null;
        meta?: Record<string, unknown>;
        artifactReader: RuntimeArtifactReader;
    });
    static createRuntime(input: {
        id: string;
        model: RFilter;
        meta?: Record<string, any>;
        parent?: RuntimeHost<any, any> | null;
        artifacts: RuntimeArtifactReader;
    }): FilterRuntimeHost | null;
    create(): void;
    getState(): Readonly<Record<string, unknown>>;
    get instanceName(): string;
    getDefaults(): Readonly<Record<string, unknown>>;
    getFields(): SourceFieldDefinition[];
    getOutput(name: string): FilterRuntimeOutput | null;
    getOutputs(): FilterRuntimeOutput[];
    destroy(): void;
    action(id: FilterRuntimeActionId): FilterRuntimeActionHandle;
}
```

## src/features/core/modules/runtime/hosts/FilterViewRuntimeHost.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/hosts/FilterViewRuntimeHost.ts)

```ts
import type { RFilter } from '@/features/core/modules/domain/entities/RFilter';
import type { RuntimeHost, RuntimeHostContext } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { FilterRuntimeHost } from '@/features/core/modules/runtime/hosts/FilterRuntimeHost';
import type { CompositionFilterFieldsSlice } from '@/features/core/modules/source/domain/types/composition-source.types';
import type { FilterProgramPayload } from '@/features/core/modules/source/domain/types/filter-source.types';
import type { FilterViewControlDefinition, FilterViewRenderModel } from '@/features/core/modules/source/domain/types/filter-view.type';
import { RuntimeHostBase } from '@/features/core/modules/runtime/RuntimeHostBase';
export declare class FilterViewRuntimeHost extends RuntimeHostBase<'filter', RuntimeHostContext<'filter'>, FilterProgramPayload> {
    constructor(input: {
        id: string;
        name: string;
        model: RFilter;
        sourceRuntimeName: string;
        sourceRuntime: FilterRuntimeHost;
        fieldKeys?: string[];
        controls?: Record<string, FilterViewControlDefinition>;
        componentIdentity?: string;
        props?: Record<string, unknown>;
        parent?: RuntimeHost<any, any> | null;
        meta?: Record<string, unknown>;
    });
    getRenderModel(): FilterViewRenderModel;
    getProps(): Readonly<Record<string, unknown>>;
    captureRenderInspection(): {
        kind: "filter-view";
        model: FilterViewRenderModel;
    };
    setProps(patch: Record<string, unknown>): void;
    setValue(key: string, value: unknown): Promise<void>;
    getSlice(): CompositionFilterFieldsSlice;
    destroy(): void;
}
```

## src/features/core/modules/runtime/hosts/PageRuntimeHost.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/hosts/PageRuntimeHost.ts)

```ts
import type { RPage } from '@/features/core/modules/domain/entities/RPage';
import type { RuntimeHost } from '@/features/core/modules/runtime/domain/runtime-host.types';
import { RuntimeHostBase } from '@/features/core/modules/runtime/RuntimeHostBase';
export declare class PageRuntimeHost extends RuntimeHostBase<'page'> {
    constructor(input: {
        id: string;
        model: RPage;
        entityIdentity: string;
        parent?: RuntimeHost<any, any> | null;
        title?: string;
        meta?: Record<string, unknown>;
    });
    static createRuntime(input: {
        id: string;
        model: RPage;
        meta?: Record<string, any>;
        parent?: RuntimeHost<any, any> | null;
    }): RuntimeHost<'page'>;
}
```

## src/features/core/modules/runtime/hosts/QueryRuntimeHost.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/hosts/QueryRuntimeHost.ts)

```ts
import type { RQuery } from '@/features/core/modules/domain/entities/RQuery';
import type { QueryProgramPayload } from '@/features/core/modules/program/domain/types/program.types';
import type { QueryExecutionObserver } from '@/features/core/modules/runtime/domain/query-execution.types';
import type { RuntimeArtifactReader, RuntimeHost, RuntimeHostContext, RuntimeHostUpdateContext } from '@/features/core/modules/runtime/domain/runtime-host.types';
import { RuntimeHostBase } from '@/features/core/modules/runtime/RuntimeHostBase';
export declare class QueryRuntimeHost extends RuntimeHostBase<'query', RuntimeHostContext<'query'>, QueryProgramPayload> {
    constructor(input: {
        id: string;
        model: RQuery;
        parent?: RuntimeHost<any, any> | null;
        meta?: Record<string, unknown>;
        artifactReader?: RuntimeArtifactReader;
        entityIdentity?: string;
        title?: string;
    });
    static createRuntime(input: {
        id: string;
        model: RQuery;
        meta?: Record<string, any>;
        parent?: RuntimeHost<any, any> | null;
        artifacts: RuntimeArtifactReader;
    }): QueryRuntimeHost | null;
    create(): void;
    getProps(): Readonly<Record<string, unknown>>;
    setProps(patch: Record<string, unknown>): void;
    getOutput(name: string): unknown;
    getOutputs(): Readonly<Record<string, unknown>>;
    run(propsPatch?: Record<string, unknown>, options?: {
        observer?: QueryExecutionObserver;
    }): Promise<Record<string, unknown>>;
    pause(): void;
    stop(): void;
    reconcile(): Promise<void>;
    quiesce(): void;
    destroy(): void;
    protected onUpdate(ctx: RuntimeHostUpdateContext): void;
}
```

## src/features/core/modules/runtime/hosts/SimulationRuntimeHost.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/hosts/SimulationRuntimeHost.ts)

```ts
import type { RSimulation } from '@/features/core/modules/domain/entities/RSimulation';
import type { RuntimeArtifactReader, RuntimeHost, RuntimeHostContextBase } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { StreamTransportFactory } from '@/features/core/modules/runtime/domain/stream-runtime.types';
import type { CompositionRuntimeHost } from '@/features/core/modules/runtime/hosts/CompositionRuntimeHost';
import type { SimulationSourceArtifact } from '@/features/core/modules/source/domain/types/simulation-source.types';
import { RuntimeHostBase } from '@/features/core/modules/runtime/RuntimeHostBase';
export declare class SimulationRuntimeHost extends RuntimeHostBase<'simulation', RuntimeHostContextBase, SimulationSourceArtifact> {
    readonly forceMock: boolean;
    static createRuntime(input: {
        id: string;
        model: RSimulation;
        parent: RuntimeHost<any, any> | null;
        meta: Record<string, unknown>;
        artifacts: RuntimeArtifactReader;
    }): SimulationRuntimeHost | null;
    get target(): CompositionRuntimeHost | null;
    hasRequest(host: RuntimeHost<any, any>): boolean;
    readResponse(host: RuntimeHost<any, any>): {
        value: unknown;
        errors?: readonly unknown[];
    } | null;
    streamOverride(host: RuntimeHost<any, any>): {
        schema: Record<string, unknown>;
        options: import("@/features/core/modules/source/domain/types/simulation-source.types").SimulationMockStream;
    } | null;
    openStream(host: RuntimeHost<any, any>, callbacks: Parameters<StreamTransportFactory['open']>[1]): import("@/features/core/modules/runtime/domain/stream-runtime.types").StreamTransportConnection;
    activateTarget(): Promise<CompositionRuntimeHost>;
    deactivateTarget(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    quiesce(): void;
    destroy(): Promise<void>;
}
```

## src/features/core/modules/runtime/hosts/StoreRuntimeHost.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/hosts/StoreRuntimeHost.ts)

```ts
import type { RStore } from '@/features/core/modules/domain/entities/RStore';
import type { RuntimeArtifactReader, RuntimeHost, RuntimeHostContext } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { StoreDataDescriptor, StoreSourceArtifact } from '@/features/core/modules/source/domain/types/store-source.types';
import type { StreamEventEnvelope } from '@/features/core/modules/source/domain/types/stream-source.types';
import type { StoreMutationPlan } from '@/features/core/modules/source/domain/types/update-source.types';
import { RuntimeHostBase } from '@/features/core/modules/runtime/RuntimeHostBase';
export declare class StoreRuntimeHost extends RuntimeHostBase<'store', RuntimeHostContext<'store'>, StoreSourceArtifact> {
    constructor(input: {
        id: string;
        model: RStore;
        parent?: RuntimeHost<any, any> | null;
        meta?: Record<string, unknown>;
        artifactReader: RuntimeArtifactReader;
        artifact: StoreSourceArtifact;
    });
    static createRuntime(input: {
        id: string;
        model: RStore;
        meta?: Record<string, any>;
        parent?: RuntimeHost<any, any> | null;
        artifacts: RuntimeArtifactReader;
    }): StoreRuntimeHost | null;
    getFields(): StoreDataDescriptor[];
    getDataPath(path?: string): string;
    getDataSnapshot(): Readonly<Record<string, unknown>>;
    isWritable(path: string): boolean;
    isDeclared(path: string): boolean;
    set(path: string, value: unknown): void;
    dispatch(event: StreamEventEnvelope): boolean;
    applyUpdate(updateIdentity: string, payload: unknown): void;
    applyMutation(plan: StoreMutationPlan): void;
    destroy(): void;
}
```

## src/features/core/modules/runtime/hosts/StreamRuntimeHost.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/hosts/StreamRuntimeHost.ts)

```ts
import type { RStream } from '@/features/core/modules/domain/entities/RStream';
import type { RuntimeArtifactReader, RuntimeHost, RuntimeHostContext } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { StreamTransportFactory } from '@/features/core/modules/runtime/domain/stream-runtime.types';
import type { StreamSourceArtifact } from '@/features/core/modules/source/domain/types/stream-source.types';
import { RuntimeHostBase } from '@/features/core/modules/runtime/RuntimeHostBase';
export declare class StreamRuntimeHost extends RuntimeHostBase<'stream', RuntimeHostContext<'stream'>, StreamSourceArtifact> {
    constructor(input: {
        id: string;
        model: RStream;
        parent?: RuntimeHost<any, any> | null;
        meta?: Record<string, unknown>;
        artifactReader: RuntimeArtifactReader;
        privateTransportFactory: StreamTransportFactory;
    });
    static createRuntime(input: {
        id: string;
        model: RStream;
        meta?: Record<string, any>;
        parent?: RuntimeHost<any, any> | null;
        artifacts: RuntimeArtifactReader;
        transportFactory: StreamTransportFactory;
    }): StreamRuntimeHost | null;
    getProps(): Readonly<Record<string, unknown>>;
    setProps(patch: Record<string, unknown>): void;
    start(): void;
    pause(): Promise<void>;
    resume(): Promise<void>;
    stop(): void;
    quiesce(): void;
    destroy(): Promise<void>;
}
```

## src/features/core/modules/runtime/operation/EndgeOperations_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/operation/EndgeOperations_Module.ts)

```ts
import type { RuntimeHost } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { OperationHistory } from '@/features/core/modules/runtime/operation/operation-history';
import type { RuntimeScope } from '@/features/core/modules/runtime/RuntimeScope';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeOperations_Module extends EndgeModule {
    register(scope: RuntimeScope, history: OperationHistory): () => void;
    resolveForHost(host: RuntimeHost<any, any> | null | undefined): OperationHistory | null;
    getActiveHistory(): OperationHistory | null;
    undo(): Promise<unknown>;
    redo(): Promise<unknown>;
    canUndo(): boolean;
    canRedo(): boolean;
    createDiagnosticsSnapshot(): unknown;
    reset(): void;
}
```

## src/features/core/modules/runtime/operation/operation-history.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/operation/operation-history.ts)

```ts
import type { ComponentSFCInteractionTrigger } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { RuntimeOwnedResource } from '@/features/core/modules/runtime/domain/runtime-resource.types';
export interface OperationHistoryShortcutBinding {
    command: 'undo' | 'redo';
    triggers: ComponentSFCInteractionTrigger[];
}
export interface OperationHistoryEntry {
    id: string;
    input: unknown;
    runOutput: unknown;
    undo: () => Promise<unknown>;
    redo: () => Promise<unknown>;
    undoOutput?: unknown;
}
export interface OperationHistoryOptions {
    id: string;
    limit?: number;
    shortcuts?: OperationHistoryShortcutBinding[] | null;
    onChange?: () => void;
}
export declare class OperationHistory implements RuntimeOwnedResource {
    readonly kind = "operation-history";
    readonly id: string;
    constructor(_options: OperationHistoryOptions);
    get limit(): number;
    get shortcuts(): OperationHistoryShortcutBinding[];
    get active(): boolean;
    canUndo(): boolean;
    canRedo(): boolean;
    setLimit(value: number): void;
    commit(entry: OperationHistoryEntry): Promise<void>;
    execute<T>(operation: () => Promise<{
        result: T;
        entry: OperationHistoryEntry;
    }>): Promise<T>;
    undo(): Promise<unknown>;
    redo(): Promise<unknown>;
    pause(): void;
    resume(): void;
    dispose(): void;
    snapshot(): {
        limit: number;
        cursor: number;
        size: number;
        paused: boolean;
    };
}
export declare function defaultOperationHistoryShortcuts(): OperationHistoryShortcutBinding[];
```

## src/features/core/modules/runtime/RuntimeActionRegistry.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/RuntimeActionRegistry.ts)

```ts
import type { AnyRuntimeAction, RuntimeAction, RuntimeActionContext, RuntimeActionId, RuntimeActionRegistrySnapshot } from '@/features/core/modules/actions/domain/action.types';
export declare class RuntimeActionRegistry {
    register<TContext extends RuntimeActionContext, TPayload = unknown, TResult = void>(action: RuntimeAction<TContext, TPayload, TResult>): () => void;
    registerMany(actions: AnyRuntimeAction[]): void;
    unregister(id: RuntimeActionId): void;
    clear(): void;
    has(id: RuntimeActionId): boolean;
    get<TContext extends RuntimeActionContext, TPayload = unknown, TResult = void>(id: RuntimeActionId): RuntimeAction<TContext, TPayload, TResult> | null;
    list(input?: {
        surface?: string;
    }): AnyRuntimeAction[];
    canExecute<TContext extends RuntimeActionContext, TPayload = unknown>(id: RuntimeActionId, context: TContext, payload?: TPayload): boolean;
    execute<TContext extends RuntimeActionContext, TPayload = unknown, TResult = void>(id: RuntimeActionId, context: TContext, payload?: TPayload): Promise<TResult | undefined>;
    snapshot(): RuntimeActionRegistrySnapshot;
}
```

## src/features/core/modules/runtime/RuntimeAppScope.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/RuntimeAppScope.ts)

```ts
import type { RuntimeEntityType } from '@/features/core/modules/runtime/domain/runtime-entity-map.types';
import type { RuntimeAppScopeExecuteOptions, RuntimeExecuteOptions } from '@/features/core/modules/runtime/domain/runtime-execute.type';
import type { AnyRuntimeHost } from '@/features/core/modules/runtime/domain/runtime-strategy.types';
import type { RuntimeExecutableModel } from '@/features/core/modules/runtime/domain/runtime.types';
export type RuntimeAppScopeCollisionPolicy = 'multi' | 'reject' | 'replace';
export interface RuntimeAppScopeOptions {
    id: string;
    rootPath: string;
    collisionPolicy?: RuntimeAppScopeCollisionPolicy;
    persistence?: 'disabled' | 'local';
}
export interface RuntimeAppScopeAddress {
    runtimeId: string;
    localId: string;
    runtimePath: string;
}
interface RuntimeAppScopeOwner {
    executeAsync: (model: RuntimeExecutableModel, options?: RuntimeExecuteOptions) => Promise<AnyRuntimeHost | null>;
    execute: (model: RuntimeExecutableModel, options?: RuntimeExecuteOptions) => AnyRuntimeHost | null;
    getRuntimeHostsByEntity: (entityType: RuntimeEntityType, entityIdentity: string, appScopeId?: string) => AnyRuntimeHost[];
    destroyRuntimeTree: (runtimeId: string) => void;
    destroyRuntimeTreeAsync: (runtimeId: string) => Promise<void>;
}
export declare class RuntimeAppScope {
    readonly id: string;
    readonly rootPath: string;
    readonly collisionPolicy: RuntimeAppScopeCollisionPolicy;
    readonly persistence: 'disabled' | 'local';
    constructor(owner: RuntimeAppScopeOwner, options: RuntimeAppScopeOptions);
    execute(model: RuntimeExecutableModel, options?: RuntimeAppScopeExecuteOptions): AnyRuntimeHost | null;
    executeAsync(model: RuntimeExecutableModel, options?: RuntimeAppScopeExecuteOptions): Promise<AnyRuntimeHost | null>;
    resolve<T = AnyRuntimeHost>(entityType: RuntimeEntityType, identity: string): T | null;
    destroy(entityType: RuntimeEntityType, identity: string): void;
    destroyAsync(entityType: RuntimeEntityType, identity: string): Promise<void>;
    allocate(input: {
        entityType: RuntimeEntityType;
        identity: string;
        explicitRuntimeId?: string | null;
        requestedLocalId?: string | null;
        scopeRoot: boolean;
    }): RuntimeAppScopeAddress;
    reset(): void;
}
export {};
```

## src/features/core/modules/runtime/RuntimeBindingScope.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/RuntimeBindingScope.ts)

```ts
import type { RuntimeHost } from '@/features/core/modules/runtime/domain/runtime-host.types';
export interface RuntimeBindingScope {
    parentRuntimeId: string | null;
    basePath: string | null;
    aliases: Record<string, string>;
}
export declare function asRuntimeBindingScope(value: unknown): RuntimeBindingScope | null;
export declare function resolveRuntimeBindingScope(input: {
    parent?: RuntimeHost<any, any> | null;
    basePath?: string | null;
    sourceVar?: string | null;
    scope?: Partial<RuntimeBindingScope> | null;
}): RuntimeBindingScope;
export declare function getRuntimeScopeItemsPath(scope: RuntimeBindingScope): string;
export declare function getRuntimeScopeRowPath(scope: RuntimeBindingScope): string;
export declare function resolveScopedTablePath(input: {
    rawPath: string;
    scope: RuntimeBindingScope;
    rowIndex?: number;
}): {
    path: string;
    vars: Record<string, any>;
};
```

## src/features/core/modules/runtime/RuntimeHostBase.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/RuntimeHostBase.ts)

```ts
import type { RaphNode, RaphPhaseEffect } from '@raphy-js/raph';
import type { RuntimeStateControllerLike } from '@/features/core/modules/context/domain/context-persistence.types';
import type { ProgramArtifact } from '@/features/core/modules/program/domain/types/program.types';
import type { RuntimeEntityModelMap, RuntimeEntityType } from '@/features/core/modules/runtime/domain/runtime-entity-map.types';
import type { RuntimeArtifactReader, RuntimeHost, RuntimeHostArtifactRef, RuntimeHostCapability, RuntimeHostChannel, RuntimeHostContext, RuntimeHostInputBinding, RuntimeHostResource, RuntimeHostSnapshot, RuntimeHostStatus, RuntimeHostUpdateBinding, RuntimeHostUpdateContext } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { RuntimeKind } from '@/features/core/modules/runtime/domain/runtime.types';
import { EventBus } from '@endge/utils';
export declare abstract class RuntimeHostBase<TType extends RuntimeEntityType, TContext extends RuntimeHostContext<TType> = RuntimeHostContext<TType>, TArtifactPayload = unknown> extends EventBus<Record<string, any>> implements RuntimeHost<TType, TContext, TArtifactPayload> {
    readonly id: string;
    parent: RuntimeHost<any, any> | null;
    readonly kind: RuntimeKind | 'runtime';
    readonly runtimeType: string;
    readonly capabilities: readonly RuntimeHostCapability[];
    readonly entityType: TType;
    readonly model: RuntimeEntityModelMap[TType];
    readonly entityIdentity: string;
    readonly title: string;
    status: RuntimeHostStatus;
    readonly createdAt: number;
    updatedAt: number;
    readonly resources: RuntimeHostResource[];
    readonly channels: RuntimeHostChannel[];
    readonly meta: Record<string, unknown>;
    context: TContext;
    node: RaphNode | null;
    readonly basePath: string;
    runtimeState: RuntimeStateControllerLike | null;
    constructor(input: {
        id: string;
        parent?: RuntimeHost<any, any> | null;
        kind: RuntimeKind;
        runtimeType: string;
        capabilities?: RuntimeHostCapability[];
        entityType: TType;
        model: RuntimeEntityModelMap[TType];
        entityIdentity: string;
        title?: string;
        status?: RuntimeHostStatus;
        meta?: Record<string, unknown>;
        context?: TContext;
        artifactReader?: RuntimeArtifactReader | null;
        artifactRef?: RuntimeHostArtifactRef | null;
    });
    create(): void;
    mount(): void;
    start(): void;
    pause(): void;
    resume(): void;
    reconcile(): void;
    stop(): void;
    unmount(): void;
    quiesce(): void;
    destroy(): void;
    update(ctx: RuntimeHostUpdateContext): void;
    protected onUpdate(ctx: RuntimeHostUpdateContext): Promise<void> | void;
    statePath(path?: string): string;
    outputPath(name: string): string;
    bindInput(name: string, binding: RuntimeHostInputBinding): void;
    readInput(name: string): unknown;
    readInputs(): Readonly<Record<string, unknown>>;
    bindUpdate(binding: RuntimeHostUpdateBinding): () => void;
    protected watchRuntimePaths(paths: string | readonly string[], callback: RaphPhaseEffect, phase?: string): () => void;
    setStatus(status: RuntimeHostStatus): void;
    hasCapability(capability: RuntimeHostCapability): boolean;
    addResource(resource: RuntimeHostResource): void;
    addChannel(channel: RuntimeHostChannel): void;
    setContext(patch: Partial<TContext>): void;
    replaceContext(context: TContext): void;
    attachRuntimeState(runtimeState: RuntimeStateControllerLike | null): void;
    addRaphNode(node: RaphNode): void;
    getArtifact(): ProgramArtifact<TArtifactPayload> | null;
    getArtifactReader(): RuntimeArtifactReader | null;
    getArtifactPayload(): TArtifactPayload | null;
    snapshot(): RuntimeHostSnapshot;
    protected touch(): void;
}
```

## src/features/core/modules/runtime/RuntimeHostFactory.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/RuntimeHostFactory.ts)

```ts
import type { RuntimeEntityModelMap, RuntimeEntityType } from '@/features/core/modules/runtime/domain/runtime-entity-map.types';
import type { RuntimeArtifactReader, RuntimeHost } from '@/features/core/modules/runtime/domain/runtime-host.types';
export interface RuntimeHostFactoryInput<TType extends RuntimeEntityType> {
    id: string;
    entityType: TType;
    model: RuntimeEntityModelMap[TType];
    entityIdentity: string;
    title?: string;
    meta?: Record<string, unknown>;
    artifactReader?: RuntimeArtifactReader;
}
export type RuntimeHostFactoryAnyInput = RuntimeHostFactoryInput<RuntimeEntityType>;
export declare function createRuntimeHost(input: RuntimeHostFactoryAnyInput): RuntimeHost<any>;
```

## src/features/core/modules/runtime/RuntimeHostRegistry.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/RuntimeHostRegistry.ts)

```ts
import type { RuntimeEntityType } from '@/features/core/modules/runtime/domain/runtime-entity-map.types';
import type { DestroyedRuntimeHostSnapshot, RuntimeHost } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { RuntimeHostRegistryLike, RuntimeHostRegistrySnapshot } from '@/features/core/modules/runtime/domain/runtime-registry.types';
export declare class RuntimeHostRegistry implements RuntimeHostRegistryLike {
    register<T extends RuntimeHost<any, any>>(host: T): T;
    getById(id: string): RuntimeHost<any, any> | null;
    getAll(): RuntimeHost<any, any>[];
    getTreePostOrder(rootId: string): string[];
    getByEntity(entityType: RuntimeEntityType, entityIdentity: string): RuntimeHost<any, any>[];
    removeById(id: string): RuntimeHost<any, any> | null;
    clear(): void;
    rememberDeletedSnapshot(snapshot: DestroyedRuntimeHostSnapshot): void;
    getDeletedSnapshots(): DestroyedRuntimeHostSnapshot[];
    removeDeletedSnapshot(id: string): DestroyedRuntimeHostSnapshot | null;
    clearDeleted(): void;
    setDeletedSnapshotLimit(limit: number): void;
    snapshot(): RuntimeHostRegistrySnapshot;
}
```

## src/features/core/modules/runtime/RuntimeResourceBag.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/RuntimeResourceBag.ts)

```ts
import type { RuntimeOwnedResource, RuntimeResourceBagSnapshot } from '@/features/core/modules/runtime/domain/runtime-resource.types';
export declare class RuntimeResourceBag {
    add<T extends RuntimeOwnedResource>(resource: T): T;
    has(id: string): boolean;
    pause(): Promise<void>;
    resume(): Promise<void>;
    dispose(): Promise<void>;
    snapshot(): RuntimeResourceBagSnapshot;
}
```

## src/features/core/modules/runtime/RuntimeScope.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/RuntimeScope.ts)

```ts
import type { RuntimeHost } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { RuntimeScopeHandle, RuntimeScopeLifecycleHooks, RuntimeScopeSnapshot, RuntimeScopeState } from '@/features/core/modules/runtime/domain/runtime-scope.types';
import { RuntimeResourceBag } from '@/features/core/modules/runtime/RuntimeResourceBag';
export interface RuntimeScopeOptions {
    id: string;
    path: string;
    boundaryId?: string;
    parent?: RuntimeScope | null;
    ownerRuntimeId?: string | null;
    hooks?: RuntimeScopeLifecycleHooks;
}
export declare class RuntimeScope implements RuntimeScopeHandle {
    readonly id: string;
    readonly path: string;
    readonly boundaryId: string;
    readonly parent: RuntimeScope | null;
    readonly ownerRuntimeId: string | null;
    readonly resources: RuntimeResourceBag;
    state: RuntimeScopeState;
    constructor(options: RuntimeScopeOptions);
    get generation(): number;
    get signal(): AbortSignal | null;
    get updateGateOpen(): boolean;
    get stale(): boolean;
    subscribe(listener: () => void): () => void;
    activate(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    deactivate(): Promise<void>;
    dispose(): Promise<void>;
    addRuntime(host: RuntimeHost<any, any>): void;
    removeRuntime(runtimeId: string): void;
    markStale(): void;
    acceptsUpdates(): boolean;
    getRuntime(path: string): RuntimeHost<any, any> | null;
    getOutput(name: string): unknown;
    getChildren(): RuntimeScope[];
    snapshot(): RuntimeScopeSnapshot;
}
```

## src/features/core/modules/runtime/services/component-sfc-expression-evaluate.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/services/component-sfc-expression-evaluate.ts)

```ts
import type { ComponentSFCExpressionIR as Expression } from '@/features/core/modules/domain/types/component/sfc/expression-ir.types';
import type { ComponentSFCRenderPort } from '@/features/core/modules/runtime/domain/component-sfc-render-port.types';
export interface SFCExpressionEvaluationContext {
    props: Record<string, unknown>;
    locals: Record<string, unknown>;
    context: object;
    host: Pick<ComponentSFCRenderPort, 'translate' | 'resolveVocabOptions' | 'readDataMeta'> | null;
    dataScope: {
        boundaryId: string;
        rowKey: unknown;
    } | null;
}
export declare function evaluateComponentSFCExpression(expression: Expression, context: SFCExpressionEvaluationContext): unknown;
```

## src/features/core/modules/runtime/services/RuntimeStrategyRegistry.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/services/RuntimeStrategyRegistry.ts)

```ts
import type { AnyRuntimeStrategy } from '@/features/core/modules/runtime/domain/runtime-strategy.types';
export declare class RuntimeStrategyRegistry {
    register(strategy: AnyRuntimeStrategy): void;
    list(): AnyRuntimeStrategy[];
    resolve(model: unknown): AnyRuntimeStrategy | null;
}
```

## src/features/core/modules/runtime/services/SFCRenderInspectionSession.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/services/SFCRenderInspectionSession.ts)

```ts
import type { SFCRenderInspectionNode, SFCRenderInspectionNodeInput, SFCRenderInspectionSessionLike, SFCRenderInspectionTreeNode } from '@/features/core/modules/runtime/domain/sfc-render-inspection.type';
export declare class SFCRenderInspectionSession implements SFCRenderInspectionSessionLike {
    registerNode(input: SFCRenderInspectionNodeInput): string;
    unregisterNode(id: string): void;
    getNode(id: string): SFCRenderInspectionNode | null;
    getTree(runtimeId?: string): SFCRenderInspectionTreeNode[];
    subscribe(listener: () => void): VoidFunction;
    clearRuntime(runtimeId: string): void;
    clear(): void;
}
```

## src/features/core/modules/runtime/services/strategies/ActionRuntimeStrategy.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/services/strategies/ActionRuntimeStrategy.ts)

```ts
import type { RuntimeStrategy } from '@/features/core/modules/runtime/domain/runtime-strategy.types';
import { RAction } from '@/features/core/modules/domain/entities/RAction';
export declare class ActionRuntimeStrategy implements RuntimeStrategy<RAction> {
    readonly id = "runtime:action";
    readonly entityType = "action";
    supports(model: unknown): model is RAction;
    create(ctx: Parameters<RuntimeStrategy<RAction>['create']>[0]): import("../../domain/runtime-host.types").RuntimeHost<"action", import("../../domain/runtime-host.types").ActionRuntimeHostContext, unknown>;
}
```

## src/features/core/modules/runtime/services/strategies/ComponentSFCRuntimeStrategy.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/services/strategies/ComponentSFCRuntimeStrategy.ts)

```ts
import type { RuntimeStrategy } from '@/features/core/modules/runtime/domain/runtime-strategy.types';
import { RComponentSFC } from '@/features/core/modules/domain/entities/RComponentSFC';
import { ComponentSFCRuntimeHost } from '@/features/core/modules/runtime/hosts/ComponentSFCRuntimeHost';
export declare class ComponentSFCRuntimeStrategy implements RuntimeStrategy<RComponentSFC> {
    readonly id = "runtime:component-sfc";
    readonly entityType = "component-sfc";
    supports(model: unknown): model is RComponentSFC;
    create(ctx: Parameters<RuntimeStrategy<RComponentSFC>['create']>[0]): ComponentSFCRuntimeHost;
}
```

## src/features/core/modules/runtime/services/strategies/CompositionRuntimeStrategy.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/services/strategies/CompositionRuntimeStrategy.ts)

```ts
import type { RuntimeStrategy } from '@/features/core/modules/runtime/domain/runtime-strategy.types';
import { RComposition } from '@/features/core/modules/domain/entities/RComposition';
import { CompositionRuntimeHost } from '@/features/core/modules/runtime/hosts/CompositionRuntimeHost';
export declare class CompositionRuntimeStrategy implements RuntimeStrategy<RComposition, CompositionRuntimeHost> {
    readonly id = "runtime:composition";
    readonly entityType: "composition";
    supports(model: unknown): model is RComposition;
    create(ctx: Parameters<RuntimeStrategy<RComposition, CompositionRuntimeHost>['create']>[0]): CompositionRuntimeHost | null;
}
```

## src/features/core/modules/runtime/services/strategies/FilterRuntimeStrategy.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/services/strategies/FilterRuntimeStrategy.ts)

```ts
import type { RuntimeStrategy } from '@/features/core/modules/runtime/domain/runtime-strategy.types';
import { RFilter } from '@/features/core/modules/domain/entities/RFilter';
import { FilterRuntimeHost } from '@/features/core/modules/runtime/hosts/FilterRuntimeHost';
export declare class FilterRuntimeStrategy implements RuntimeStrategy<RFilter, FilterRuntimeHost> {
    readonly id = "runtime:filter";
    readonly entityType: "filter";
    supports(model: unknown): model is RFilter;
    create(ctx: Parameters<RuntimeStrategy<RFilter, FilterRuntimeHost>['create']>[0]): FilterRuntimeHost | null;
}
```

## src/features/core/modules/runtime/services/strategies/PageRuntimeStrategy.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/services/strategies/PageRuntimeStrategy.ts)

```ts
import type { RuntimeStrategy } from '@/features/core/modules/runtime/domain/runtime-strategy.types';
import { RPage } from '@/features/core/modules/domain/entities/RPage';
export declare class PageRuntimeStrategy implements RuntimeStrategy<RPage> {
    readonly id = "runtime:page";
    readonly entityType = "page";
    supports(model: unknown): model is RPage;
    create(ctx: Parameters<RuntimeStrategy<RPage>['create']>[0]): import("../../domain/runtime-host.types").RuntimeHost<"page", import("../../domain/runtime-host.types").PageRuntimeHostContext, unknown>;
}
```

## src/features/core/modules/runtime/services/strategies/QueryRuntimeStrategy.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/services/strategies/QueryRuntimeStrategy.ts)

```ts
import type { RuntimeStrategy } from '@/features/core/modules/runtime/domain/runtime-strategy.types';
import { RQuery } from '@/features/core/modules/domain/entities/RQuery';
import { QueryRuntimeHost } from '@/features/core/modules/runtime/hosts/QueryRuntimeHost';
export declare class QueryRuntimeStrategy implements RuntimeStrategy<RQuery, QueryRuntimeHost> {
    readonly id = "runtime:query";
    readonly entityType = "query";
    supports(model: unknown): model is RQuery;
    create(ctx: Parameters<RuntimeStrategy<RQuery>['create']>[0]): QueryRuntimeHost | null;
}
```

## src/features/core/modules/runtime/services/strategies/StoreRuntimeStrategy.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/services/strategies/StoreRuntimeStrategy.ts)

```ts
import type { RuntimeStrategy } from '@/features/core/modules/runtime/domain/runtime-strategy.types';
import { RStore } from '@/features/core/modules/domain/entities/RStore';
import { StoreRuntimeHost } from '@/features/core/modules/runtime/hosts/StoreRuntimeHost';
export declare class StoreRuntimeStrategy implements RuntimeStrategy<RStore, StoreRuntimeHost> {
    readonly id = "runtime:store";
    readonly entityType: "store";
    supports(model: unknown): model is RStore;
    create(ctx: Parameters<RuntimeStrategy<RStore, StoreRuntimeHost>['create']>[0]): StoreRuntimeHost | null;
}
```

## src/features/core/modules/runtime/services/strategies/StreamRuntimeStrategy.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/services/strategies/StreamRuntimeStrategy.ts)

```ts
import type { RuntimeStrategy } from '@/features/core/modules/runtime/domain/runtime-strategy.types';
import type { ResolveAuthSession } from '@/features/core/modules/runtime/services/transports/BrowserSseStreamTransportFactory';
import { RStream } from '@/features/core/modules/domain/entities/RStream';
import { StreamRuntimeHost } from '@/features/core/modules/runtime/hosts/StreamRuntimeHost';
export declare class StreamRuntimeStrategy implements RuntimeStrategy<RStream, StreamRuntimeHost> {
    readonly id = "runtime:stream";
    readonly entityType: "stream";
    constructor(_resolveAuthSession: ResolveAuthSession);
    supports(model: unknown): model is RStream;
    create(ctx: Parameters<RuntimeStrategy<RStream, StreamRuntimeHost>['create']>[0]): StreamRuntimeHost | null;
}
```

## src/features/core/modules/runtime/services/transports/BrowserGraphQLSseStreamTransportFactory.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/services/transports/BrowserGraphQLSseStreamTransportFactory.ts)

```ts
import type { StreamTransportConnection, StreamTransportFactory } from '@/features/core/modules/runtime/domain/stream-runtime.types';
import type { ResolveAuthSession } from '@/features/core/modules/runtime/services/transports/BrowserSseStreamTransportFactory';
export declare class GraphQLSseHttpError extends Error {
    readonly status: number;
    readonly url: string;
    constructor(status: number, url: string, cause?: unknown);
}
export declare function readSseHttpStatus(error: unknown): number | null;
export declare class BrowserGraphQLSseStreamTransportFactory implements StreamTransportFactory {
    constructor(_resolveAuthSession: ResolveAuthSession);
    open(artifact: Parameters<StreamTransportFactory['open']>[0], callbacks: Parameters<StreamTransportFactory['open']>[1], request?: Parameters<StreamTransportFactory['open']>[2]): StreamTransportConnection;
}
```

## src/features/core/modules/runtime/tools/runtime-render-inspection.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/tools/runtime-render-inspection.ts)

```ts
import type { RComponentSFC_IR_DataMetaReference } from '@/features/core/modules/domain/types/component/sfc/ir.types';
export declare function runtimeInspectionMetaKey(reference: RComponentSFC_IR_DataMetaReference & {
    boundaryId?: string;
    rowKey?: unknown;
}, namespace?: string): string;
```

## src/features/core/modules/runtime/tools/runtime-render-values.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/tools/runtime-render-values.ts)

```ts
import type { VocabOptionMapping } from '@/features/core/modules/runtime/domain/vocab-cache.types';
import type { SourceFieldOption } from '@/features/core/modules/source/domain/types/source-expression.types';
export declare function resolveRuntimeVocabOptions(values: unknown, mapping?: Partial<VocabOptionMapping>): SourceFieldOption[];
```
