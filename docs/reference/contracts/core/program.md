---
description: "TypeScript-декларации @endge/core 1.0.0-dev.11, группа program; исходных модулей: 6."
---

# @endge/core: program

Версия source: 1.0.0-dev.11. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/program/domain/types/action-program.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/program/domain/types/action-program.types.ts)

```ts
import type { ActionTargetSelector } from '@/features/core/modules/actions/domain/action.types';
import type { ActionSourceDocument } from '@/features/core/modules/source/domain/types/action-source.types';
export interface ActionProgramPayload {
    ast?: unknown;
    type: 'action';
    sourceVersion: number;
    sourceDocument: ActionSourceDocument | null;
    target: ActionTargetSelector[] | null;
}
```

## src/features/core/modules/program/domain/types/execution-bundle.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/program/domain/types/execution-bundle.types.ts)

```ts
import type { ComponentSFCTagRegistryEntry, ProgramArtifact, ProgramArtifactKey } from './program.types';
import type { BundleJsonValue } from '@/features/core/kernel/types/endge-bundle.types';
import type { EndgeConfiguration } from '@/features/core/modules/configuration/domain/types/configuration.type';
import type { EndgeContextSnapshot } from '@/features/core/modules/context/domain/context-persistence.types';
export interface CompiledFolderDescriptor {
    id: string;
    identity: string;
    displayName: string;
    parentId: string | null;
    scope: 'workspace' | 'collection';
    entityType: string | null;
    position: number;
    icon?: string;
    color?: string;
}
export interface CompiledDocumentDescriptor {
    id: string;
    identity: string;
    entityType: string;
    displayName: string;
    folderId: string | null;
    workspaceFolderId: string | null;
    position: number;
    documentType?: string;
    facetIdentity?: string;
    kind?: string;
    kindIdentity?: string;
    storeIdentity?: string;
    icon?: string;
    color?: string;
    artifactKeys: ProgramArtifactKey[];
    status: 'compiled' | 'not-compiled';
}
export interface CompiledWorkspaceDescriptor {
    identity: string;
    displayName: string;
    startupCompositionIdentity: string | null;
    documentStructure?: 'frontend' | 'custom';
}
export interface CompiledProgramCatalog {
    workspace?: CompiledWorkspaceDescriptor;
    folders: Record<string, CompiledFolderDescriptor>;
    documents: Record<string, CompiledDocumentDescriptor>;
}
export type PortableProgramArtifact = ProgramArtifact<BundleJsonValue>;
export interface CompiledContextDescriptor extends EndgeContextSnapshot {
    configuration: EndgeConfiguration;
}
export interface ProgramHostActionRequirement {
    identity: string;
    owner: string;
    providerKey: string;
}
export interface ProgramRequirements {
    hostActions?: ProgramHostActionRequirement[];
    artifactTypes: string[];
    componentTags: ComponentSFCTagRegistryEntry[];
}
export interface ExecutionBundle {
    version: 1;
    programId: string;
    compilerVersion: string;
    createdAt: string;
    context: CompiledContextDescriptor;
    requirements: ProgramRequirements;
    catalog: CompiledProgramCatalog;
    artifacts: Record<ProgramArtifactKey, PortableProgramArtifact>;
}
export interface PreparedProgramInstall {
    readonly bundle: ExecutionBundle;
}
```

## src/features/core/modules/program/domain/types/program-metadata.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/program/domain/types/program-metadata.types.ts)

```ts
export type ProgramMetadataValue = null | boolean | number | string | ProgramMetadataValue[] | {
    [key: string]: ProgramMetadataValue;
};
export type ProgramMetadataMap = Record<string, ProgramMetadataValue>;
export interface ProgramNodeMetadata {
    nodeId: string;
    nodeKind: string;
    key?: string;
    values: ProgramMetadataMap;
}
export interface ProgramMetadata {
    self: ProgramMetadataMap;
    nodes: ProgramNodeMetadata[];
}
export declare function createEmptyProgramMetadata(): ProgramMetadata;
```

## src/features/core/modules/program/domain/types/program.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/program/domain/types/program.types.ts)

```ts
import type { RComponentContract, RComponentDependencies } from '@/features/core/modules/domain/types/component/component-core.types';
import type { RComponentSFC_AST } from '@/features/core/modules/domain/types/component/sfc/ast.types';
import type { RComponentSFC_RuntimeDependencies } from '@/features/core/modules/domain/types/component/sfc/dependencies.types';
import type { RComponentSFC_IR } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { RComponentSFCSource_Parts } from '@/features/core/modules/domain/types/component/sfc/source.types';
import type { ComputationProgramPayload } from '@/features/core/modules/domain/types/computation/computation-program.types';
import type { ProgramMetadata } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { DataViewManualTransform, DataViewPipelineStep, DataViewRef, DataViewSourceDocument } from '@/features/core/modules/source/domain/types/data-view-source.types';
import type { QueryGraphQLErrorPolicy } from '@/features/core/modules/source/domain/types/query-source.types';
import type { ResponseOutputTransform } from '@/features/core/modules/source/domain/types/response-output.types';
import type { QueryProgramProp, SourceExpressionIR, SourceFieldDefinition } from '@/features/core/modules/source/domain/types/source-expression.types';
import type { VocabProgramPayload } from '@/features/core/modules/source/domain/types/vocab-source.types';
import type { EndgeStyleSheetArtifact } from '@/features/core/modules/styles/domain/types/style.types';
export type { ActionProgramPayload } from '@/features/core/modules/program/domain/types/action-program.types';
export type { ConfigurationProgramPayload } from '@/features/core/modules/source/domain/types/configuration-source.types';
export type ProgramArtifactKey = string;
export type ProgramEntityType = 'type' | 'component-sfc' | 'computation' | 'action' | 'query' | 'vocab' | 'data-view' | 'store' | 'stream' | 'simulation' | 'update' | 'filter' | 'composition' | 'style' | 'configuration';
export type ProgramArtifactStatus = 'valid' | 'warning' | 'error';
export type ProgramCapability = 'compilable' | 'runnable' | 'executable' | 'renderable' | 'data-provider' | 'configuration';
export interface ProgramArtifactRef {
    entityType: ProgramEntityType;
    id: string | number;
    identity: string;
}
export interface ProgramDiagnostic {
    severity: 'info' | 'warning' | 'error';
    code: string;
    message: string;
    entityRef?: ProgramArtifactRef;
    sourcePath?: string;
    start?: number;
    end?: number;
}
export interface ProgramDependency {
    entityType: ProgramEntityType | string;
    id: string | number;
    identity?: string;
    role?: string;
    sourcePath?: string;
    start?: number;
    end?: number;
}
export interface ProgramArtifact<TPayload = unknown> {
    ref: ProgramArtifactRef;
    sourceHash: string;
    compilerVersion: string;
    contextHash?: string;
    status: ProgramArtifactStatus;
    diagnostics: ProgramDiagnostic[];
    dependencies: ProgramDependency[];
    capabilities: ProgramCapability[];
    metadata: ProgramMetadata;
    payload: TPayload;
    children?: ProgramArtifact[];
}
export type QueryProgramOutputSource = {
    type: 'response';
    path: string | null;
    expression?: import('@/features/core/modules/source/domain/types/source-expression.types').SourceExpressionIR;
} | {
    type: 'output';
    key: string;
};
export interface QueryProgramOutput {
    key: string;
    source: QueryProgramOutputSource;
    transforms?: ResponseOutputTransform[];
    dataViews: DataViewRef[];
    contract?: SourceFieldDefinition | null;
    materialization: {
        kind: 'source';
    } | {
        kind: 'derived';
        strategy: import('@/features/core/modules/source/domain/types/data-view-source.types').DataViewMaterializationStrategy;
    };
}
export type QueryProgramRequestValue<T> = T | SourceExpressionIR;
export interface QueryProgramPayload {
    sourceVersion: number;
    ast?: unknown;
    sourceDocument?: unknown;
    type: string;
    method?: QueryProgramRequestValue<string>;
    endpoint: QueryProgramRequestValue<string>;
    query: QueryProgramRequestValue<string>;
    operationName?: string;
    errorPolicy?: QueryGraphQLErrorPolicy;
    headers?: QueryProgramRequestValue<Record<string, string>>;
    auth?: QueryProgramRequestValue<unknown>;
    timeoutMs?: QueryProgramRequestValue<number>;
    sendAsFormUrlencoded?: QueryProgramRequestValue<boolean>;
    props: QueryProgramProp[];
    requestBody: SourceExpressionIR | null;
    requestVariables?: SourceExpressionIR | null;
    mockDataEnabled?: boolean;
    mockData?: unknown;
    mockErrors?: unknown[];
    outputs: QueryProgramOutput[];
}
export type { VocabProgramPayload };
export interface DataViewProgramPayload {
    ast?: unknown;
    type: 'data-view';
    mode: 'manual' | 'pipeline' | 'projection' | 'expression';
    materializationStrategy: import('@/features/core/modules/source/domain/types/data-view-source.types').DataViewMaterializationStrategy;
    sourceDocument: DataViewSourceDocument | null;
    contract?: DataViewSourceDocument['contract'];
    props?: SourceFieldDefinition[];
    filter?: SourceExpressionIR | null;
    transform: DataViewManualTransform | null;
    steps: DataViewPipelineStep[];
    output: Record<string, SourceExpressionIR>;
    expression?: SourceExpressionIR | null;
}
export interface ComponentSFCProgramPayload {
    sections?: Record<'script' | 'template' | 'style', ProgramArtifactStatus>;
    sourceParts: RComponentSFCSource_Parts;
    contract: RComponentContract;
    dependencies: RComponentDependencies;
    runtimeDependencies: RComponentSFC_RuntimeDependencies;
    previewProps: ComponentSFCPreviewProps | null;
    previewOptions: ComponentSFCPreviewOptions | null;
    ast?: RComponentSFC_AST | null;
    ir: RComponentSFC_IR | null;
}
export interface EndgeStyleProgramPayload {
    ast?: unknown;
    stylesheet: EndgeStyleSheetArtifact;
    themes: string[];
    dependencies: ProgramDependency[];
}
export type { ComputationProgramPayload };
export interface ComponentSFCTagRegistryEntry {
    tag: string;
    identity: string;
}
export type ComponentSFCPreviewLiteral = null | string | number | boolean | ComponentSFCPreviewLiteral[] | {
    [key: string]: ComponentSFCPreviewLiteral;
};
export interface ComponentSFCPreviewStoreProp {
    type: 'store';
    path: string;
}
export interface ComponentSFCPreviewDataProp {
    type: 'data';
    store: string;
    path: string;
}
export type ComponentSFCPreviewPropValue = ComponentSFCPreviewLiteral | ComponentSFCPreviewStoreProp | ComponentSFCPreviewDataProp;
export type ComponentSFCPreviewProps = Record<string, ComponentSFCPreviewPropValue>;
export interface ComponentSFCPreviewRunTarget {
    type: 'query';
    identity: string;
    storeTo?: {
        store: string;
        fields: Record<string, string>;
    };
}
export interface ComponentSFCPreviewOptions {
    seed?: Record<string, ComponentSFCPreviewLiteral>;
    run?: ComponentSFCPreviewRunTarget[];
}
export interface ProgramCompileContext {
    compilerVersion: string;
    buildContext: import('@/features/core/modules/configuration/domain/types/configuration.type').EndgeBuildContext;
}
export interface EntityCompilerHandler<TEntity = unknown, TPayload = unknown> {
    entityType: ProgramEntityType;
    compile: (entity: TEntity, context: ProgramCompileContext) => ProgramArtifact<TPayload>;
}
export interface EndgeProgramSnapshot {
    generatedAt: number;
    status: ProgramArtifactStatus;
    compilerVersion: string;
    total: number;
    byStatus: Record<ProgramArtifactStatus, number>;
    byEntityType: Record<string, number>;
    diagnostics: ProgramDiagnostic[];
    artifacts: Array<{
        ref: ProgramArtifactRef;
        status: ProgramArtifactStatus;
        diagnostics: number;
        dependencies: number;
        capabilities: ProgramCapability[];
        sourceHash: string;
        compilerVersion: string;
    }>;
}
```

## src/features/core/modules/program/EndgeProgram_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/program/EndgeProgram_Module.ts)

```ts
import type { CompiledContextDescriptor, CompiledProgramCatalog, ExecutionBundle, PreparedProgramInstall, ProgramHostActionRequirement } from './domain/types/execution-bundle.types';
import type { ActionProgramPayload, ComponentSFCTagRegistryEntry, ComputationProgramPayload, DataViewProgramPayload, EndgeProgramSnapshot, EndgeStyleProgramPayload, ProgramArtifact, ProgramArtifactRef, ProgramArtifactStatus, ProgramDiagnostic, ProgramEntityType, QueryProgramPayload } from '@/features/core/modules/program/domain/types/program.types';
import type { CompositionProgramPayload } from '@/features/core/modules/source/domain/types/composition-source.types';
import type { FilterProgramPayload } from '@/features/core/modules/source/domain/types/filter-source.types';
import type { SimulationSourceArtifact } from '@/features/core/modules/source/domain/types/simulation-source.types';
import type { StoreSourceArtifact } from '@/features/core/modules/source/domain/types/store-source.types';
import type { StreamSourceArtifact } from '@/features/core/modules/source/domain/types/stream-source.types';
import type { TypeProgramCatalogEntry, TypeProgramPayload } from '@/features/core/modules/source/domain/types/type-source.types';
import type { UpdateSourceArtifact } from '@/features/core/modules/source/domain/types/update-source.types';
import type { VocabProgramPayload } from '@/features/core/modules/source/domain/types/vocab-source.types';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeProgram_Module extends EndgeModule {
    get programId(): string | null;
    get catalog(): Readonly<CompiledProgramCatalog>;
    completeCompile(catalog: CompiledProgramCatalog, context: CompiledContextDescriptor, isCurrent?: () => boolean, hostActions?: ProgramHostActionRequirement[]): void;
    exportBundle(options?: {
        includeAst?: boolean;
    }): ExecutionBundle;
    prepareInstall(value: unknown): PreparedProgramInstall;
    installBundle(prepared: PreparedProgramInstall): void;
    get status(): ProgramArtifactStatus;
    get compilerVersion(): string;
    beginCompile(compilerVersion: string): void;
    setStatus(status: ProgramArtifactStatus): void;
    recalculateStatus(): void;
    addArtifact<TPayload>(artifact: ProgramArtifact<TPayload>, isCurrent?: () => boolean): ProgramArtifact<TPayload>;
    setComponentTags(entries: readonly ComponentSFCTagRegistryEntry[]): void;
    resolveComponentTag(tag: string): string | null;
    getComponentTags(): ComponentSFCTagRegistryEntry[];
    getArtifact<TPayload = unknown>(entityType: ProgramEntityType, idOrIdentity: string | number): ProgramArtifact<TPayload> | null;
    getArtifactByRef<TPayload = unknown>(ref: Pick<ProgramArtifactRef, 'entityType'> & {
        id?: string | number;
        identity?: string;
    }): ProgramArtifact<TPayload> | null;
    getActionArtifact(idOrIdentity: string | number): ProgramArtifact<ActionProgramPayload> | null;
    getQueryArtifact(idOrIdentity: string | number): ProgramArtifact<QueryProgramPayload> | null;
    getVocabArtifact(idOrIdentity: string | number): ProgramArtifact<VocabProgramPayload> | null;
    getComputationArtifact(idOrIdentity: string | number): ProgramArtifact<ComputationProgramPayload> | null;
    getDataViewArtifact(idOrIdentity: string | number): ProgramArtifact<DataViewProgramPayload> | null;
    getStoreArtifact(idOrIdentity: string | number): ProgramArtifact<StoreSourceArtifact> | null;
    getStreamArtifact(idOrIdentity: string | number): ProgramArtifact<StreamSourceArtifact> | null;
    getSimulationArtifact(idOrIdentity: string | number): ProgramArtifact<SimulationSourceArtifact> | null;
    getUpdateArtifact(idOrIdentity: string | number): ProgramArtifact<UpdateSourceArtifact> | null;
    getFilterArtifact(idOrIdentity: string | number): ProgramArtifact<FilterProgramPayload> | null;
    getCompositionArtifact(idOrIdentity: string | number): ProgramArtifact<CompositionProgramPayload> | null;
    getStyleArtifact(idOrIdentity: string | number): ProgramArtifact<EndgeStyleProgramPayload> | null;
    getTypeArtifact(idOrIdentity: string | number): ProgramArtifact<TypeProgramPayload> | null;
    getTypeCatalog(): TypeProgramCatalogEntry[];
    getDiagnostics(ref?: Pick<ProgramArtifactRef, 'entityType'> & {
        id?: string | number;
        identity?: string;
    }): ProgramDiagnostic[];
    getArtifacts(): ProgramArtifact[];
    clear(): void;
    reset(): void;
    createDiagnosticsSnapshot(): EndgeProgramSnapshot;
    snapshot(): EndgeProgramSnapshot;
}
```

## src/features/core/modules/program/tools/restore-program-source.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/program/tools/restore-program-source.ts)

```ts
import type { ProgramArtifact } from '../domain/types/program.types';
export declare function restoreProgramArtifactSource(artifact: ProgramArtifact): string | null;
```
