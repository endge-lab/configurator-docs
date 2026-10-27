---
description: "TypeScript-декларации @endge/core 1.0.0-dev.11, группа source; исходных модулей: 35."
---

# @endge/core: source

Версия source: 1.0.0-dev.11. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/source/domain/types/action-source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/action-source.types.ts)

```ts
import type { SourceExpressionIR, SourceFieldDefinition } from '@/features/core/modules/source/domain/types/source-expression.types';
export interface ActionSourceContract {
    input: SourceFieldDefinition | null;
    output: SourceFieldDefinition | null;
}
export type ActionSourceEffectKind = 'query' | 'update' | 'action' | 'computation';
export interface ActionSourceEffectStep {
    kind: ActionSourceEffectKind;
    name: string;
    identity: string;
    input: SourceExpressionIR;
}
export interface ActionSourceExpressionStep {
    kind: 'expression';
    name: string;
    expression: SourceExpressionIR;
}
export interface ActionSourceTypescriptStep {
    kind: 'typescript';
    name: string;
    inputs: Record<string, SourceExpressionIR>;
    moduleKey: string;
    source: string;
}
export interface ActionSourceOperationStep {
    kind: 'operation';
    name: string;
    input: SourceExpressionIR | null;
    run: ActionSourceBlock;
    undo: ActionSourceBlock;
    redo: ActionSourceBlock | null;
}
export type ActionSourceStep = ActionSourceExpressionStep | ActionSourceEffectStep | ActionSourceTypescriptStep | ActionSourceOperationStep;
export interface ActionSourceBlock {
    steps: ActionSourceStep[];
    output: SourceExpressionIR | null;
}
export interface ActionSourceDocument extends ActionSourceBlock {
    contract: ActionSourceContract;
}
```

## src/features/core/modules/source/domain/types/composition-source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/composition-source.types.ts)

```ts
import type { ComponentSFCInteractionTrigger } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { ComponentSFCEventInputValue } from '@/features/core/modules/domain/types/component/sfc/ports.types';
import type { I18nCompiledLocales } from '@/features/core/modules/i18n/domain/i18n.types';
import type { EndgeMockReference } from '@/features/core/modules/mock/domain/types/mock-data.type';
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { ProgramDiagnostic } from '@/features/core/modules/program/domain/types/program.types';
import type { RuntimeHost } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { RuntimeScopeHandle } from '@/features/core/modules/runtime/domain/runtime-scope.types';
import type { VocabLoadPolicy } from '@/features/core/modules/runtime/domain/vocab-cache.types';
import type { FilterViewControlDefinition } from '@/features/core/modules/source/domain/types/filter-view.type';
import type { SourceExpressionIR, SourceFieldDefinition } from '@/features/core/modules/source/domain/types/source-expression.types';
import type { UpdateMutationStrategy } from '@/features/core/modules/source/domain/types/update-source.types';
import type { EndgeDataMode } from '@/features/core/modules/workspace/domain/workspace.types';
export type CompositionRuntimeKind = 'filter' | 'query' | 'component' | 'composition' | 'stream' | 'filter-view';
export type CompositionActivationMode = 'startup' | 'manual';
export interface CompositionActivationDescriptor {
    mode: CompositionActivationMode;
}
interface CompositionResourceDescriptorBase {
    name: string;
    path: string;
    scopePath: string;
    sourceOrder: number;
}
type CompositionSourceAssetResourceDescriptor = CompositionResourceDescriptorBase & {
    kind: 'style' | 'i18n';
    identity: string;
};
type CompositionOperationHistoryResourceDescriptor = CompositionResourceDescriptorBase & {
    kind: 'operation-history';
    operationHistory: {
        limit: number;
        limitConfigurationPath: string | null;
        shortcuts: OperationHistoryShortcutDescriptor[] | null;
    };
};
export type CompositionResourceDescriptor = CompositionSourceAssetResourceDescriptor | CompositionOperationHistoryResourceDescriptor;
export interface OperationHistoryShortcutDescriptor {
    command: 'undo' | 'redo';
    triggerSet: {
        kind: 'configuration';
        path: string;
    } | {
        kind: 'literal';
        value: ComponentSFCInteractionTrigger[];
    };
}
export interface CompositionI18nResourceArtifact {
    name: string;
    path: string;
    scopePath: string;
    identity: string;
    sourceOrder: number;
    messages: I18nCompiledLocales;
}
export interface CompositionScopeDescriptor {
    name: string;
    path: string;
    parentPath: string | null;
    activationOverride: CompositionActivationDescriptor | null;
    effectiveActivation: CompositionActivationDescriptor;
    enabledWhen?: Readonly<Record<string, string>>;
    activateWhen?: CompositionBindingValue;
    data?: string[];
    resources: string[];
    runtimes: string[];
    children: string[];
    sourceOrder: number;
}
export type CompositionBindingValue = {
    kind: 'literal';
    value: unknown;
} | {
    kind: 'output';
    runtime: string;
    output: string;
} | {
    kind: 'outputs';
    runtime: string;
    outputs?: string[];
} | {
    kind: 'store';
    key: string;
} | {
    kind: 'data';
    data: string;
    path: string;
    metaSource?: CompositionMetaSourceBinding;
} | {
    kind: 'runtime-metadata';
    runtime: string;
    namespace?: string;
} | {
    kind: 'filter-fields';
    runtime: string;
    fields: string[];
} | {
    kind: 'data-view';
    data: string;
    path: string;
    identity: string;
    props: Record<string, CompositionBindingValue>;
    metaSource?: CompositionMetaSourceBinding;
} | {
    kind: 'expression';
    expression: SourceExpressionIR;
};
export interface CompositionMetaSourceBinding {
    data: string;
    path: string;
    key?: string;
    fields?: Record<string, string>;
}
export interface CompositionDataDescriptor {
    name: string;
    path?: string;
    scopePath?: string;
    kind: 'store' | 'vocab';
    identity: string;
    resolution?: 'contextual' | 'isolated' | 'injected';
    slot?: string | null;
    policy?: VocabLoadPolicy;
}
export interface CompositionStorePublication {
    data: string;
    fields: Record<string, string>;
}
export interface CompositionFilterFieldsSlice {
    kind: 'filter-fields';
    runtimeId: string;
    runtimeName: string;
    fieldKeys: string[];
    fields: SourceFieldDefinition[];
    values: Record<string, unknown>;
}
export interface CompositionRuntimeDescriptor {
    name: string;
    path: string;
    scopePath: string;
    sourceLocations?: {
        runtime: {
            start: number;
            end: number;
        };
        call: {
            start: number;
            end: number;
        };
        withProps: {
            start: number;
            end: number;
        } | null;
    };
    kind: CompositionRuntimeKind;
    identity: string;
    contextSwitch?: {
        selected: 'default' | number;
        default: {
            kind: CompositionRuntimeKind;
            identity: string;
        };
        cases: Array<{
            when: Readonly<Record<string, string>>;
            kind: CompositionRuntimeKind;
            identity: string;
        }>;
    };
    activationOverride: CompositionActivationDescriptor | null;
    effectiveActivation: CompositionActivationDescriptor;
    enabledWhen?: Readonly<Record<string, string>>;
    activateWhen?: CompositionBindingValue;
    fields?: string[];
    controls?: Record<string, FilterViewControlDefinition>;
    componentIdentity?: string;
    persistKey?: string;
    props: Record<string, CompositionBindingValue>;
    dataBindings?: Record<string, string>;
    storeTo: CompositionStorePublication[];
    dispatchTo?: string[];
    batch?: {
        maxItems: number;
        maxWaitMs: number;
    };
}
export interface CompositionRuntimeChildHandle {
    name: string;
    descriptor: CompositionRuntimeDescriptor;
    runtime: RuntimeHost<any, any>;
}
export type CompositionChangeSource = {
    kind: 'runtime-output';
    runtime: string;
    output: string;
} | {
    kind: 'prop';
    path: string;
};
export type CompositionHook = {
    kind: 'mount';
    target: string;
} | {
    kind: 'change';
    source: CompositionChangeSource;
    target: string;
    debounceMs: number;
} | {
    kind: 'success';
    runtime: string;
    target: string;
} | CompositionComponentEventHook;
export interface ComponentEventApplyUpdateEffect {
    kind: 'apply-update';
    data: string;
    update: string;
    input?: ComponentSFCEventInputValue;
}
export interface ComponentEventStoreMutationEffect {
    kind: 'mutate-store';
    data: string;
    mutation: {
        strategy: UpdateMutationStrategy;
        path: string;
        value?: ComponentSFCEventInputValue;
        vars?: Record<string, ComponentSFCEventInputValue>;
    };
}
export interface ComponentEventExecuteActionEffect {
    kind: 'execute-action';
    action: string;
    input?: ComponentSFCEventInputValue;
}
export type CompositionComponentEventEffect = ComponentEventApplyUpdateEffect | ComponentEventStoreMutationEffect | ComponentEventExecuteActionEffect;
export interface CompositionComponentEventHook {
    kind: 'event';
    runtime: string;
    event: string;
    effect: CompositionComponentEventEffect;
}
export interface CompositionRuntimeOutputDescriptor {
    key: string;
    kind: 'runtime';
    runtime: string;
    output?: string;
}
export interface CompositionScopeOutputDescriptor {
    key: string;
    kind: 'scope';
    scope: string;
}
export type CompositionOutputDescriptor = CompositionRuntimeOutputDescriptor | CompositionScopeOutputDescriptor;
export type CompositionPreviewLiteral = null | string | number | boolean | CompositionPreviewLiteral[] | {
    [key: string]: CompositionPreviewLiteral;
};
export type CompositionPreviewPropValue = {
    kind: 'literal';
    value: CompositionPreviewLiteral;
} | EndgeMockReference;
export type CompositionPreviewProps = Record<string, CompositionPreviewPropValue>;
export interface CompositionSourceDocument {
    dataMode?: EndgeDataMode | null;
    activation: CompositionActivationDescriptor | null;
    props: SourceFieldDefinition[];
    previewProps?: CompositionPreviewProps | null;
    data: CompositionDataDescriptor[];
    resources: CompositionResourceDescriptor[];
    scopes: CompositionScopeDescriptor[];
    runtimes: CompositionRuntimeDescriptor[];
    hooks: CompositionHook[];
    outputs: CompositionOutputDescriptor[];
}
export interface CompositionSourceAddDataPatch {
    type: 'add-data';
    name: string;
    kind: CompositionDataDescriptor['kind'];
    identity: string;
}
export interface CompositionSourceAddResourcePatch {
    type: 'add-resource';
    name: string;
    kind: CompositionResourceDescriptor['kind'];
    identity?: string;
}
export interface CompositionSourceAddRuntimePatch {
    type: 'add-runtime';
    name: string;
    kind: Exclude<CompositionRuntimeKind, 'filter-view'>;
    identity: string;
    activation?: CompositionActivationMode;
}
export type CompositionSourcePatchOperation = CompositionSourceAddDataPatch | CompositionSourceAddResourcePatch | CompositionSourceAddRuntimePatch;
export type CompositionSourcePatch = CompositionSourcePatchOperation | CompositionSourcePatchOperation[];
export interface CompositionRuntimeInputConnection {
    targetRuntime: string;
    targetProp: string;
    source: CompositionBindingValue;
}
export interface CompositionRuntimeDataConnection {
    targetRuntime: string;
    targetData: string;
    sourceData: string;
}
export interface CompositionRuntimeUpdateConnection {
    id: string;
    source: CompositionChangeSource;
    targetRuntime: string;
    updateKind: 'run';
    debounceMs: number;
}
export interface CompositionRuntimeSuccessConnection {
    id: string;
    sourceRuntime: string;
    targetRuntime: string;
    updateKind: 'run';
}
export interface CompositionRuntimePublicationConnection {
    id: string;
    sourceRuntime: string;
    sourceOutput: string;
    targetData: string;
    targetPath: string;
}
export interface CompositionRuntimeMountConnection {
    targetRuntime: string;
    updateKind: 'run';
}
export interface CompositionRuntimeEventConnection extends CompositionComponentEventHook {
    id: string;
}
export interface CompositionRuntimeGraph {
    inputs: CompositionRuntimeInputConnection[];
    dataInputs?: CompositionRuntimeDataConnection[];
    updates: CompositionRuntimeUpdateConnection[];
    successes?: CompositionRuntimeSuccessConnection[];
    publications: CompositionRuntimePublicationConnection[];
    mounts: CompositionRuntimeMountConnection[];
    events?: CompositionRuntimeEventConnection[];
}
export interface CompositionProgramPayload extends CompositionSourceDocument {
    ast?: unknown;
    type: 'composition';
    sourceVersion: number;
    i18nResources?: CompositionI18nResourceArtifact[];
    graph: CompositionRuntimeGraph;
}
export interface CompositionSourceCompileResult {
    ast: unknown | null;
    document: CompositionSourceDocument | null;
    artifact: CompositionProgramPayload | null;
    metadata: ProgramMetadataMap;
    diagnostics: Omit<ProgramDiagnostic, 'entityRef'>[];
}
export interface CompositionRuntimeOutputHandle {
    kind: 'runtime';
    runtime: RuntimeHost<any, any> | null;
    output?: string;
}
export interface CompositionRuntimeHostHandle extends RuntimeHost<'composition', any, CompositionProgramPayload> {
    mountGraph: () => Promise<void>;
    getChild: (name: string) => RuntimeHost<any, any> | null;
    getChildren: () => CompositionRuntimeChildHandle[];
    getFilterFieldsSlice: (runtimeName: string, fieldKeys: string[]) => CompositionFilterFieldsSlice | null;
    getOutputs: () => Readonly<Record<string, CompositionPublicOutputHandle>>;
    getScope: (path: string) => RuntimeScopeHandle | null;
    getRuntimeHandle: (path: string) => CompositionRuntimeActivationHandle | null;
    getOutput: (name: string) => unknown;
    getDataSnapshot: () => Readonly<Record<string, unknown>>;
    getProps: () => Readonly<Record<string, unknown>>;
    getDataPath: (name: string, path?: string) => string;
}
export interface CompositionRuntimeActivationHandle {
    readonly path: string;
    readonly state: 'inactive' | 'active' | 'paused' | 'disposed';
    readonly runtime: RuntimeHost<any, any> | null;
    activate: () => Promise<RuntimeHost<any, any>>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    deactivate: () => Promise<void>;
    dispose: () => Promise<void>;
    getOutput: (name: string) => unknown;
}
export type CompositionPublicOutputHandle = CompositionRuntimeOutputHandle | CompositionRuntimeActivationHandle | RuntimeScopeHandle;
export interface CompositionMountOptions {
    id?: string;
    props?: Record<string, unknown>;
    dataRuntimes?: Record<string, string>;
}
export interface CompositionSession<THost extends CompositionRuntimeHostHandle = CompositionRuntimeHostHandle> {
    id: string;
    host: THost;
    outputs: Readonly<Record<string, CompositionPublicOutputHandle>>;
    output: <T = unknown>(name: string) => T | undefined;
    unmount: () => Promise<void>;
}
export {};
```

## src/features/core/modules/source/domain/types/configuration-source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/configuration-source.types.ts)

```ts
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { ProgramDiagnostic } from '@/features/core/modules/program/domain/types/program.types';
import type { TypeSourceExpression } from '@/features/core/modules/source/domain/types/type-source.types';
export type EndgeJSONValue = null | boolean | number | string | EndgeJSONValue[] | {
    [key: string]: EndgeJSONValue;
};
export interface ConfigurationSourceValueDefinition {
    key: string;
    type: TypeSourceExpression;
    defaultValue: EndgeJSONValue;
    defaultWasInferred: boolean;
    label: string;
    description?: string;
    min?: number;
    max?: number;
    step?: number;
}
export interface ConfigurationSourceDocument {
    values: ConfigurationSourceValueDefinition[];
}
export interface ConfigurationProgramPayload {
    ast?: unknown;
    type: 'configuration';
    identity: string;
    displayName: string;
    sourceVersion: 1;
    values: ConfigurationSourceValueDefinition[];
}
export interface ConfigurationSourceCompileResult {
    ast: unknown | null;
    document: ConfigurationSourceDocument | null;
    draftDocument?: ConfigurationSourceDocument | null;
    metadata: ProgramMetadataMap;
    diagnostics: Omit<ProgramDiagnostic, 'entityRef'>[];
}
export interface EndgeConfigurationSchemaEntry {
    ast?: unknown;
    id: string | number;
    identity: string;
    displayName: string;
    description?: string | null;
    sourceVersion: number;
    document: ConfigurationSourceDocument | null;
    diagnostics: Omit<ProgramDiagnostic, 'entityRef'>[];
    status: 'valid' | 'warning' | 'error';
}
```

## src/features/core/modules/source/domain/types/data-view-source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/data-view-source.types.ts)

```ts
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { ProgramDiagnostic } from '@/features/core/modules/program/domain/types/program.types';
import type { SourceExpressionIR, SourceFieldDefinition } from '@/features/core/modules/source/domain/types/source-expression.types';
export type DataViewSourceMode = 'manual' | 'pipeline' | 'projection' | 'expression';
export type DataViewIncrementalRequest = {
    mode: 'auto';
} | {
    mode: 'full';
} | {
    mode: 'collection-by-key';
    key: string;
} | {
    mode: 'filter-by-key';
    key: string;
};
export type DataViewMaterializationStrategy = {
    kind: 'full';
} | {
    kind: 'collection-by-key';
    key: string;
} | {
    kind: 'filter-by-key';
    key: string;
};
export interface DataViewSourceContract {
    input: SourceFieldDefinition;
    output: SourceFieldDefinition;
}
export interface DataViewSourceDocument {
    mode: DataViewSourceMode;
    incremental: DataViewIncrementalRequest;
    props: SourceFieldDefinition[];
    contract?: DataViewSourceContract | null;
    filter?: SourceExpressionIR | null;
    transform?: DataViewManualTransform;
    steps?: DataViewPipelineStep[];
    output?: Record<string, SourceExpressionIR>;
    expression?: SourceExpressionIR;
}
export interface DataViewRunContext {
    props?: Record<string, unknown>;
}
export interface DataViewManualTransform {
    params: string[];
    body: string;
}
export type DataViewPipelineStep = DataViewFromStep | DataViewJoinStep | DataViewMapStep | DataViewSelectStep;
export interface DataViewSelectStep {
    type: 'select';
    expression: SourceExpressionIR;
}
export interface DataViewFromStep {
    type: 'from';
    source: string;
    as: string;
    dataViews?: DataViewRef[];
}
export type DataViewRef = DataViewExternalRef | DataViewInlineRef | DataViewLocalRef;
export interface DataViewContextVariants {
    contextVariants?: Array<DataViewExternalRef | DataViewInlineRef>;
}
export interface DataViewExternalRef extends DataViewContextVariants {
    kind: 'external';
    identity: string;
}
export interface DataViewInlineRef extends DataViewContextVariants {
    kind: 'inline';
    source: string;
}
export interface DataViewLocalRef {
    kind: 'local';
    ref: {
        entityType: 'data-view';
        id: string | number;
        identity: string;
    };
}
export interface DataViewJoinStep {
    type: 'join';
    source: string;
    left: string;
    right: string;
    as: string;
}
export interface DataViewMapStep {
    type: 'map';
    spreads: DataViewMapSpread[];
    fields: Record<string, DataViewExpression>;
}
export interface DataViewMapSpread {
    source: string;
}
export type DataViewExpression = DataViewPathExpression | DataViewTemplateExpression | DataViewLiteralExpression | SourceExpressionIR;
export interface DataViewPathExpression {
    type: 'path';
    path: string;
    operations: DataViewPathOperation[];
}
export type DataViewPathOperation = {
    type: 'find';
    criteria: Record<string, unknown>;
} | {
    type: 'pick';
    path: string;
} | {
    type: 'convert';
    converter: string;
    options?: Record<string, unknown>;
};
export interface DataViewTemplateExpression {
    type: 'template';
    template: string;
}
export interface DataViewLiteralExpression {
    type: 'literal';
    value: unknown;
}
export interface DataViewSourceCompileResult {
    ast: unknown;
    document: DataViewSourceDocument | null;
    artifact: unknown | null;
    metadata: ProgramMetadataMap;
    diagnostics: Omit<ProgramDiagnostic, 'entityRef'>[];
}
export interface DataViewRunTools {
    convert: (identity: string, value: unknown, options?: Record<string, unknown>) => unknown;
    pick: (value: unknown, path: string) => unknown;
    path: (scope: unknown, path: string) => unknown;
    template: (template: string, scope?: Record<string, unknown>) => string;
}
```

## src/features/core/modules/source/domain/types/filter-source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/filter-source.types.ts)

```ts
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { ProgramDiagnostic } from '@/features/core/modules/program/domain/types/program.types';
import type { SourceExpressionIR, SourceFieldDefinition } from '@/features/core/modules/source/domain/types/source-expression.types';
export interface FilterSourceDocument {
    fields: SourceFieldDefinition[];
    outputs: FilterProgramOutput[];
}
export interface FilterSourceRange {
    start: number;
    end: number;
}
export interface FilterSourceEditorField extends SourceFieldDefinition {
    sourceRange: FilterSourceRange;
    keyRange: FilterSourceRange;
    valueRange: FilterSourceRange;
    valueSource: string;
    defaultSource: string | null;
}
export interface FilterSourceEditorOutput {
    key: string;
    kind: FilterProgramOutput['kind'];
    sourceRange: FilterSourceRange;
    source: string;
}
export interface FilterSourceEditorDocument {
    fields: FilterSourceEditorField[];
    outputs: FilterSourceEditorOutput[];
}
export type FilterSourcePatchOperation = {
    type: 'add-field';
    key: string;
    expression: string;
} | {
    type: 'remove-field';
    key: string;
} | {
    type: 'move-field';
    key: string;
    toIndex: number;
} | {
    type: 'rename-field';
    key: string;
    nextKey: string;
} | {
    type: 'set-field';
    key: string;
    expression: string;
};
export type FilterSourcePatch = FilterSourcePatchOperation | FilterSourcePatchOperation[];
export interface FilterProgramJsonOutput {
    key: string;
    kind: 'json';
    expression: SourceExpressionIR;
    dependencies?: string[];
}
export interface FilterProgramPredicateOutput {
    key: string;
    kind: 'predicate';
    expression: SourceExpressionIR;
    dependencies?: string[];
}
export type FilterProgramOutput = FilterProgramJsonOutput | FilterProgramPredicateOutput;
export interface FilterProgramPayload {
    ast?: unknown;
    type: 'filter';
    sourceVersion: number;
    fields: SourceFieldDefinition[];
    defaults: Record<string, SourceExpressionIR | undefined>;
    outputs: FilterProgramOutput[];
}
export interface FilterSourceCompileResult {
    ast: unknown | null;
    document: FilterSourceDocument | null;
    artifact: FilterProgramPayload | null;
    metadata: ProgramMetadataMap;
    diagnostics: Omit<ProgramDiagnostic, 'entityRef'>[];
}
export type FilterRuntimeOutput = {
    key: string;
    kind: 'json';
    value: unknown;
} | {
    key: string;
    kind: 'predicate';
    test: (row: unknown) => boolean;
};
export type FilterRuntimeActionId = 'patch' | 'set' | 'reset' | 'clear';
export interface FilterRuntimeSetPayload {
    key: string;
    value: unknown;
}
export interface FilterRuntimeActionHandle {
    run: (payload?: unknown) => Promise<void>;
}
```

## src/features/core/modules/source/domain/types/filter-view.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/filter-view.type.ts)

```ts
import type { SourceFieldDefinition, SourceFieldOption } from '@/features/core/modules/source/domain/types/source-expression.types';
export declare const ENDGE_UI_SELECT_METADATA_NAMESPACE = "endge.ui.select";
export declare const FILTER_SELECT_AUTO_OPTIMIZE_THRESHOLD = 10;
export interface FilterSelectPresentationMetadata {
    searchable?: boolean;
}
export interface FilterSelectPresentation {
    searchable: boolean;
    virtualized: boolean;
}
export declare function resolveFilterSelectPresentation(field: Pick<SourceFieldDefinition, 'metadata'>, optionCount: number): FilterSelectPresentation;
export type FilterViewControlType = 'Input' | 'Textarea' | 'Checkbox' | 'Select';
export interface FilterViewControlDefinition {
    type: FilterViewControlType;
}
export interface FilterViewBuiltinProps {
    showLabels?: boolean;
    labels?: Record<string, string>;
}
export type FilterViewImplementation = {
    kind: 'generated';
} | {
    kind: 'component';
    identity: string;
};
export interface FilterViewRenderField extends SourceFieldDefinition {
    control: FilterViewControlDefinition;
    value: unknown;
    options: SourceFieldOption[];
}
export interface FilterViewRenderModel {
    implementation: FilterViewImplementation;
    props: Readonly<Record<string, unknown>>;
    fields: FilterViewRenderField[];
}
```

## src/features/core/modules/source/domain/types/graphql-fragments.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/graphql-fragments.types.ts)

```ts
import type { SourceContextPattern } from '@/features/core/modules/source/domain/types/source-context.types';
export interface GraphQLFragmentVariant {
    when: SourceContextPattern | null;
    document: string;
}
export interface GraphQLFragmentSource {
    variants: GraphQLFragmentVariant[];
    selected: number;
}
export interface GraphQLDocumentFragments {
    operation: string;
    fragments: Record<string, GraphQLFragmentSource>;
}
export interface GraphQLDocumentVariant {
    context: SourceContextPattern;
    document: string;
}
```

## src/features/core/modules/source/domain/types/query-source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/query-source.types.ts)

```ts
import type { RQueryAuth } from '@/features/core/modules/domain/types/document/query.types';
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { ProgramDiagnostic, QueryProgramPayload } from '@/features/core/modules/program/domain/types/program.types';
import type { DataViewRef } from '@/features/core/modules/source/domain/types/data-view-source.types';
import type { GraphQLDocumentFragments } from '@/features/core/modules/source/domain/types/graphql-fragments.types';
import type { ResponseOutputTransform } from '@/features/core/modules/source/domain/types/response-output.types';
import type { QueryProgramProp, SourceExpressionIR, SourceFieldDefinition } from '@/features/core/modules/source/domain/types/source-expression.types';
export type QuerySourceKind = 'rest' | 'graphql';
export type QueryGraphQLErrorPolicy = 'throw' | 'ignore' | 'all';
export type QuerySourceRequestValue<T> = T | SourceExpressionIR;
export interface QuerySourceRestRequest {
    endpoint: QuerySourceRequestValue<string>;
    path: QuerySourceRequestValue<string>;
    method: QuerySourceRequestValue<string>;
    headers: QuerySourceRequestValue<Record<string, string>>;
    auth: QuerySourceRequestValue<RQueryAuth>;
    timeoutMs?: QuerySourceRequestValue<number>;
    formUrlencoded?: QuerySourceRequestValue<boolean>;
    body?: SourceExpressionIR | null;
}
export interface QuerySourceGraphQLRequest {
    endpoint: QuerySourceRequestValue<string>;
    document: string;
    fragments?: GraphQLDocumentFragments;
    operationName?: string;
    variables?: SourceExpressionIR | null;
    headers: QuerySourceRequestValue<Record<string, string>>;
    auth: QuerySourceRequestValue<RQueryAuth>;
    timeoutMs?: QuerySourceRequestValue<number>;
    errorPolicy: QueryGraphQLErrorPolicy;
}
export interface QuerySourceMock {
    enabled: boolean;
    data: unknown;
    errors?: unknown[];
}
export type QueryOutputSource = {
    type: 'response';
    path: string | null;
    expression?: SourceExpressionIR;
} | {
    type: 'output';
    key: string;
};
export interface QuerySourceOutput {
    key: string;
    source: QueryOutputSource;
    transforms: ResponseOutputTransform[];
    dataViews: DataViewRef[];
    contract?: SourceFieldDefinition | null;
}
export type QuerySourceOutputs = QuerySourceOutput[];
interface QuerySourceDocumentBase {
    props: QueryProgramProp[];
    outputs: QuerySourceOutputs;
    mock: QuerySourceMock;
}
export interface QuerySourceRestDocument extends QuerySourceDocumentBase {
    kind: 'rest';
    request: QuerySourceRestRequest;
}
export interface QuerySourceGraphQLDocument extends QuerySourceDocumentBase {
    kind: 'graphql';
    request: QuerySourceGraphQLRequest;
}
export type QuerySourceDocument = QuerySourceRestDocument | QuerySourceGraphQLDocument;
export type QuerySourcePatchPath = 'kind' | 'request.endpoint' | 'request.path' | 'request.method' | 'request.headers' | 'request.auth' | 'request.timeoutMs' | 'request.formUrlencoded' | 'request.body' | 'props' | 'outputs' | 'mock.enabled' | 'mock.data';
export interface QuerySourcePatchOperation {
    path: QuerySourcePatchPath;
    value?: unknown;
    expression?: string;
}
export type QuerySourcePatch = QuerySourcePatchOperation | QuerySourcePatchOperation[];
export interface QuerySourceCompileResult {
    ast: unknown | null;
    document: QuerySourceDocument | null;
    artifact: QueryProgramPayload | null;
    metadata: ProgramMetadataMap;
    diagnostics: Omit<ProgramDiagnostic, 'entityRef'>[];
}
export {};
```

## src/features/core/modules/source/domain/types/response-output.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/response-output.types.ts)

```ts
import type { DataViewRef } from '@/features/core/modules/source/domain/types/data-view-source.types';
export type ResponseOutputTransform = {
    kind: 'data-view';
    ref: DataViewRef;
} | {
    kind: 'converter';
    identity: string;
    options?: Record<string, unknown>;
};
```

## src/features/core/modules/source/domain/types/simulation-source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/simulation-source.types.ts)

```ts
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { ProgramDependency, ProgramDiagnostic } from '@/features/core/modules/program/domain/types/program.types';
export interface SimulationMockRequest {
    kind: 'mock-request';
    seed?: string;
    useExamples?: boolean;
    arrays: Record<string, number>;
    errors?: SimulationGraphQLError[];
}
export interface SimulationFieldConstraints {
    enum?: Array<string | number | boolean>;
    minimum?: number;
    maximum?: number;
}
export interface SimulationMockStream {
    kind: 'mock-stream';
    type: string;
    event: string;
    seed?: string;
    intervalMs: number;
    itemsPerMessage: number;
    fields: Record<string, SimulationFieldConstraints>;
    errors?: SimulationGraphQLError[];
}
export interface SimulationGraphQLError {
    message: string;
    path?: Array<string | number>;
    [key: string]: unknown;
}
export interface SimulationRuntimeOverride {
    alias: string;
    runtimes?: SimulationRuntimeOverride[];
    request?: SimulationMockRequest;
    stream?: SimulationMockStream;
}
export interface SimulationTargetReference {
    entityType: 'composition';
    identity: string;
}
export interface SimulationSourceDocument {
    target: SimulationTargetReference;
    dataMode?: 'live' | 'mock';
    runtimes: SimulationRuntimeOverride[];
}
export interface SimulationSourceArtifact extends SimulationSourceDocument {
    ast?: unknown;
    type: 'simulation';
    sourceVersion: number;
}
export interface SimulationSourceCompileResult {
    ast: unknown | null;
    document: SimulationSourceDocument | null;
    artifact: SimulationSourceArtifact | null;
    metadata: ProgramMetadataMap;
    diagnostics: Omit<ProgramDiagnostic, 'entityRef'>[];
    dependencies: ProgramDependency[];
    locations: Record<string, {
        start: number;
        end: number;
    }>;
}
export interface SimulationSourceInput {
    id: string | number;
    identity: string;
    displayName?: string;
    source: string;
    sourceVersion: number;
    isPrimitive?: boolean;
}
export interface SimulationSourceCatalog {
    compositions: readonly SimulationSourceInput[];
    queries: readonly SimulationSourceInput[];
    types: readonly SimulationSourceInput[];
    streams?: readonly SimulationSourceInput[];
}
```

## src/features/core/modules/source/domain/types/source-context.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/source-context.types.ts)

```ts
export type SourceContextPattern = Readonly<Record<string, string>>;
export interface SourceContextValues {
    facets: Readonly<Record<string, string>>;
    config: Readonly<Record<string, unknown>>;
    knownFacets?: readonly string[];
}
```

## src/features/core/modules/source/domain/types/source-engine.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/source-engine.types.ts)

```ts
import type { I18nCatalogProvenance, I18nRuntimeCatalog } from '@/features/core/modules/i18n/domain/i18n.types';
import type { SourceContextValues } from '@/features/core/modules/source/domain/types/source-context.types';
import type { TypeSourceDefinition } from '@/features/core/modules/source/domain/types/type-source.types';
export type SourceKind = 'action' | 'query' | 'vocab' | 'data-view' | 'filter' | 'composition' | 'store' | 'stream' | 'simulation' | 'update' | 'computation' | 'style' | 'type' | 'configuration';
export interface SourceEngineCompileContext {
    sourceVersion?: number;
    executionContext?: Readonly<Record<string, string>>;
    sourceContext?: SourceContextValues;
}
export type SourceLanguageCompletionKind = 'keyword' | 'function' | 'property' | 'value' | 'snippet';
export interface SourceLanguagePosition {
    lineNumber: number;
    column: number;
}
export interface SourceLanguageContext {
    source: string;
    position?: SourceLanguagePosition;
    typeSymbols?: Array<{
        identity: string;
        displayName?: string;
        category?: 'primitive' | 'reference' | 'user';
        definition?: TypeSourceDefinition | null;
        entityReference?: {
            target: string;
            storage: 'id' | 'identity';
        };
    }>;
    documentSymbols?: Array<{
        target: SourceDocumentReferenceTarget;
        identity: string;
        displayName?: string;
        description?: string | null;
    }>;
    ownerIdentity?: string;
    sourceContext?: SourceContextValues;
    i18n?: SourceLanguageI18nContext;
}
export interface SourceLanguageI18nOccurrence {
    id: string;
    catalogsByScope: Readonly<Record<string, I18nRuntimeCatalog>>;
    provenanceByScope: Readonly<Record<string, I18nCatalogProvenance>>;
}
export interface SourceLanguageI18nContext {
    locale: string;
    fallbackLocale: string;
    occurrences: readonly SourceLanguageI18nOccurrence[];
}
export interface SourceLanguageCompletion {
    label: string;
    kind: SourceLanguageCompletionKind;
    insertText: string;
    detail?: string;
    documentation?: string;
}
export interface SourceLanguageSignatureHelp {
    activeSignature: number;
    activeParameter: number;
    signatures: Array<{
        label: string;
        documentation?: string;
        parameters: Array<{
            label: string;
            documentation?: string;
        }>;
    }>;
}
export type SourceDocumentReferenceTarget = 'action' | 'auth-profile' | 'component' | 'composition' | 'computation' | 'converter' | 'data-view' | 'filter' | 'i18n-bundles' | 'mock' | 'query' | 'store' | 'stream' | 'update' | 'style' | 'type' | 'vocabs';
export interface SourceDocumentReference {
    target: SourceDocumentReferenceTarget;
    identity: string;
    range: {
        start: number;
        end: number;
    };
}
export interface SourceLanguageSemanticHighlight {
    kind: 'type-reference';
    status: 'resolved' | 'unresolved';
    identity: string;
    range: SourceDocumentReference['range'];
}
export interface SourceLanguageInlineHint {
    kind: 'translation';
    status: 'resolved' | 'ambiguous';
    text: string;
    tooltip?: string;
    range: SourceDocumentReference['range'];
}
export interface SourceLanguageValidationResult extends SourceEngineResult {
    diagnostics: unknown[];
}
export interface SourceEngineOperation {
    type: string;
    payload?: Record<string, unknown>;
}
export interface SourceEngineResult {
    ok: boolean;
    message?: string;
}
export interface SourceEngineGenerateResult extends SourceEngineResult {
    source?: string;
    document?: unknown;
}
export interface SourceEngineCompileResult extends SourceEngineResult {
    ast?: unknown;
    document?: unknown;
    artifact?: any;
    metadata?: import('@/features/core/modules/program/domain/types/program-metadata.types').ProgramMetadataMap;
    diagnostics?: unknown[];
    dependencies?: import('@/features/core/modules/program/domain/types/program.types').ProgramDependency[];
}
export interface SourceParseResult<TDocument = unknown> extends SourceEngineResult {
    ast?: unknown;
    document?: TDocument;
    diagnostics?: unknown[];
}
export interface SourcePatchResult<TDocument = unknown> extends SourceParseResult<TDocument> {
    source: string;
    changed: boolean;
}
export interface SourcePatchStrategy<TPatch = unknown, TDocument = unknown> {
    id: string;
    sourceKind: SourceKind;
    supports: (sourceKind: SourceKind | string) => boolean;
    parse: (source: string) => SourceParseResult<TDocument>;
    patch: (source: string, patch: TPatch) => SourcePatchResult<TDocument>;
}
export interface SourceEngineStrategy {
    id: string;
    sourceKind: SourceKind;
    supports: (sourceKind: SourceKind | string) => boolean;
    execute?: (operation: SourceEngineOperation) => SourceEngineResult;
    generate?: (model: unknown) => SourceEngineGenerateResult;
    compile?: (source: string, context?: SourceEngineCompileContext) => SourceEngineCompileResult;
}
export interface SourceLanguageTokenPattern {
    pattern: RegExp;
    token: string;
    next?: string;
}
export interface SourceLanguageSyntaxDefinition {
    aliases: string[];
    extensions: string[];
    comments: {
        lineComment: string;
        blockComment: [
            string,
            string
        ];
    };
    brackets: Array<[
        string,
        string
    ]>;
    autoClosingPairs: Array<{
        open: string;
        close: string;
    }>;
    triggerCharacters: string[];
    tokenizer: Record<string, SourceLanguageTokenPattern[]>;
}
export interface SourceLanguageStrategy {
    id: string;
    sourceKind: SourceKind;
    supports: (sourceKind: SourceKind | string) => boolean;
    syntax: SourceLanguageSyntaxDefinition;
    createDefaultSource: (variant?: string) => string;
    normalize?: (source: string) => string;
    validate: (source: string, context?: SourceLanguageContext) => SourceLanguageValidationResult;
    completions: (context: SourceLanguageContext) => SourceLanguageCompletion[];
    signatureHelp?: (context: SourceLanguageContext) => SourceLanguageSignatureHelp | null;
    resolveReference?: (context: SourceLanguageContext) => SourceDocumentReference | null;
    semanticHighlights?: (context: SourceLanguageContext) => SourceLanguageSemanticHighlight[];
    inlineHints?: (context: SourceLanguageContext) => SourceLanguageInlineHint[];
}
```

## src/features/core/modules/source/domain/types/source-expression.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/source-expression.types.ts)

```ts
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { TypeSourceExpression } from '@/features/core/modules/source/domain/types/type-source.types';
export type SourceFieldType = 'String' | 'Number' | 'Boolean' | 'Date' | 'Time' | 'DateTime' | 'Object' | 'Any' | (string & {});
export type SourceExpressionReadKind = 'env' | 'prop' | 'value' | 'row' | 'response' | 'graphql-errors' | 'store' | 'current' | 'scope' | 'composition-output' | 'composition-outputs' | 'composition-data' | 'composition-store' | 'composition-filter-fields' | 'composition-runtime-metadata' | 'metadata' | 'computation-output' | 'update-input' | 'update-item' | 'update-parent' | 'update-data' | 'update-meta' | 'update-has-data' | 'update-has-meta';
export type SourceExpressionOperation = 'merge' | 'compact' | 'get' | 'get-or' | 'has' | 'default-to' | 'pick' | 'omit' | 'defaults' | 'keys' | 'values' | 'entries' | 'map' | 'where' | 'reject' | 'find' | 'some' | 'every' | 'flat-map' | 'flatten' | 'uniq' | 'uniq-by' | 'concat' | 'take' | 'drop' | 'sort-by' | 'group-by' | 'key-by' | 'size' | 'sum' | 'sum-by' | 'min' | 'max' | 'min-by' | 'max-by' | 'trim' | 'lower-case' | 'upper-case' | 'split' | 'join' | 'match' | 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'includes' | 'or' | 'when' | 'not' | 'is-nil' | 'is-empty' | 'and' | 'between' | 'in-list' | 'in-array' | 'relative-date' | 'relative-date-time' | 'left-join' | 'full-join' | 'join-by' | 'join-by-any' | 'join-coalesce' | 'lookup-one' | 'lookup-many' | 'enrich' | 'coalesce' | 'choose' | 'lookup-value' | 'to-string' | 'to-number' | 'to-boolean' | 'type-of' | 'is-string' | 'is-number' | 'is-boolean' | 'is-array' | 'is-object' | 'is-date-time' | 'is-duration' | 'add' | 'subtract' | 'multiply' | 'divide' | 'modulo' | 'abs' | 'negate' | 'round' | 'floor' | 'ceil' | 'clamp' | 'average' | 'average-by' | 'starts-with' | 'ends-with' | 'replace' | 'replace-all' | 'slice' | 'pad-start' | 'pad-end' | 'normalize-whitespace' | 'set' | 'unset' | 'rename' | 'get-key' | 'from-entries' | 'first' | 'last' | 'at' | 'reverse' | 'sort-by-desc' | 'order-by' | 'chunk' | 'union' | 'intersection' | 'difference' | 'count-by' | 'date-time' | 'duration' | 'date-time-add' | 'date-time-subtract' | 'date-time-difference' | 'date-time-start-of' | 'date-time-end-of' | 'date-time-part' | 'duration-add' | 'duration-subtract' | 'duration-total' | 'contains-all' | 'contains-any';
export type SourceExpressionIR = {
    type: 'literal';
    value: unknown;
} | {
    type: 'object';
    properties: Record<string, SourceExpressionIR>;
} | {
    type: 'array';
    items: SourceExpressionIR[];
} | {
    type: 'read';
    source: SourceExpressionReadKind;
    path: string;
    parameters?: string[];
} | {
    type: 'transform';
    transform: 'data-view' | 'converter';
    identity: string;
    input: SourceExpressionIR;
    options?: SourceExpressionIR;
} | {
    type: 'operation';
    operation: SourceExpressionOperation;
    arguments: SourceExpressionIR[];
};
export interface SourceFieldOption {
    value: string | number | boolean;
    label?: string;
}
export interface SourceFieldVocab {
    identity: string;
    valuePath: string;
    labelPath: string;
}
export interface SourceFieldDefinition {
    key: string;
    type: SourceFieldType;
    typeExpression?: TypeSourceExpression;
    typeVariants?: TypeSourceExpression[];
    optional: boolean;
    array: boolean;
    defaultValue?: SourceExpressionIR;
    options?: SourceFieldOption[];
    vocab?: SourceFieldVocab;
    metadata?: ProgramMetadataMap;
}
export type SourceFieldDefaultSource = {
    kind: 'filter';
    identity: string;
    output: string;
} | {
    kind: 'inline-filter';
    source: string;
    output: string;
} | {
    kind: 'local-filter';
    ref: {
        entityType: 'filter';
        id: string | number;
        identity: string;
    };
    output: string;
};
export interface QueryProgramProp extends SourceFieldDefinition {
    defaultSource?: SourceFieldDefaultSource;
}
export interface SourceExpressionContext {
    environment?: (name: string) => unknown;
    props?: Record<string, unknown>;
    values?: Record<string, unknown>;
    row?: unknown;
    response?: unknown;
    graphQLErrors?: readonly unknown[];
    stores?: Record<string, unknown>;
    current?: unknown;
    scope?: unknown;
    read?: (expression: Extract<SourceExpressionIR, {
        type: 'read';
    }>) => unknown;
    transform?: (expression: Extract<SourceExpressionIR, {
        type: 'transform';
    }>, input: unknown, options: unknown) => unknown;
    onWarning?: (warning: SourceExpressionWarning) => void;
}
export type ValueExpressionIR = SourceExpressionIR;
export type ValueExpressionContext = SourceExpressionContext;
export interface SourceExpressionWarning {
    code: string;
    message: string;
    data?: unknown;
}
```

## src/features/core/modules/source/domain/types/store-source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/store-source.types.ts)

```ts
import type { EndgeMockReference } from '@/features/core/modules/mock/domain/types/mock-data.type';
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { ProgramDiagnostic } from '@/features/core/modules/program/domain/types/program.types';
import type { DataViewRef } from '@/features/core/modules/source/domain/types/data-view-source.types';
import type { SourceFieldDefinition } from '@/features/core/modules/source/domain/types/source-expression.types';
export type StoreDataDescriptor = StoreValueDescriptor | StoreDerivedDescriptor;
export interface StoreValueDescriptor {
    key: string;
    kind: 'value';
    initial: StoreValueInitializer;
    contract?: SourceFieldDefinition | null;
}
export type StoreValueInitializer = {
    kind: 'literal';
    value: unknown;
} | EndgeMockReference;
export interface StoreDerivedDescriptor {
    key: string;
    kind: 'derived';
    source: string;
    dataViews: DataViewRef[];
    materializationStrategy?: import('@/features/core/modules/source/domain/types/data-view-source.types').DataViewMaterializationStrategy;
    contract?: SourceFieldDefinition | null;
}
export interface StoreSourceDocument {
    data: StoreDataDescriptor[];
}
export interface StoreUpdateHandlerDescriptor {
    identity: string;
    eventTypes: string[];
}
export interface StoreSourceArtifact extends StoreSourceDocument {
    ast?: unknown;
    type: 'store';
    sourceVersion: number;
    updateHandlers: StoreUpdateHandlerDescriptor[];
}
export interface StoreSourceCompileResult {
    ast: unknown | null;
    document: StoreSourceDocument | null;
    artifact: StoreSourceArtifact | null;
    metadata: ProgramMetadataMap;
    diagnostics: Omit<ProgramDiagnostic, 'entityRef'>[];
}
```

## src/features/core/modules/source/domain/types/stream-source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/stream-source.types.ts)

```ts
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { ProgramDiagnostic } from '@/features/core/modules/program/domain/types/program.types';
import type { GraphQLResponseError } from '@/features/core/modules/runtime/domain/graphql-query-error';
import type { GraphQLDocumentFragments } from '@/features/core/modules/source/domain/types/graphql-fragments.types';
import type { QueryGraphQLErrorPolicy } from '@/features/core/modules/source/domain/types/query-source.types';
import type { QueryProgramProp, SourceExpressionIR } from '@/features/core/modules/source/domain/types/source-expression.types';
export interface StreamSseTransportDescriptor {
    kind: 'sse';
    url: string;
    withCredentials: boolean;
    authMode: 'inherit' | 'profile' | 'none';
    authProfileIdentity: string | null;
}
export type StreamJsonValue = string | number | boolean | null | StreamJsonValue[] | {
    [key: string]: StreamJsonValue;
};
export interface StreamWebSocketTransportDescriptor {
    kind: 'websocket';
    url: string;
    onOpen: StreamJsonValue[];
}
export interface StreamGraphQLSseTransportDescriptor {
    kind: 'graphql-sse';
    url: string;
    urlExpression?: SourceExpressionIR;
    method: 'POST' | 'GET';
    document: string;
    fragments?: GraphQLDocumentFragments;
    operationName?: string;
    variables: SourceExpressionIR | null;
    headers: SourceExpressionIR | null;
    extensions?: SourceExpressionIR;
    withCredentials: boolean;
    authMode: 'inherit' | 'profile' | 'none';
    authProfileIdentity: string | null;
    errorPolicy: QueryGraphQLErrorPolicy;
    reconnectDelayMs: number;
}
export type StreamTransportDescriptor = StreamSseTransportDescriptor | StreamWebSocketTransportDescriptor | StreamGraphQLSseTransportDescriptor;
export type StreamProgramProp = QueryProgramProp;
export interface StreamEventDescriptor {
    sourceEvent: string;
    type: string | null;
    typePath: string | null;
    payloadPath: string | null;
    match?: Record<string, string | number | boolean | null>;
    eachFrom?: string;
}
export interface StreamSourceDocument {
    props?: StreamProgramProp[];
    transport: StreamTransportDescriptor;
    events: StreamEventDescriptor[];
}
export interface StreamSourceArtifact extends StreamSourceDocument {
    ast?: unknown;
    type: 'stream';
    sourceVersion: number;
}
export interface StreamSourceCompileResult {
    ast: unknown | null;
    document: StreamSourceDocument | null;
    artifact: StreamSourceArtifact | null;
    metadata: ProgramMetadataMap;
    diagnostics: Omit<ProgramDiagnostic, 'entityRef'>[];
}
export interface StreamEventEnvelope {
    type: string;
    payload: unknown;
    meta: {
        id: string | null;
        source: string;
        sourceEvent: string;
        occurredAt: string;
        graphQLErrors?: readonly GraphQLResponseError[];
    };
}
```

## src/features/core/modules/source/domain/types/type-source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/type-source.types.ts)

```ts
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { ProgramDiagnostic } from '@/features/core/modules/program/domain/types/program.types';
export interface TypeSourceContextVariants {
    contextVariants?: TypeSourceExpression[];
}
export interface TypeSourceReference extends TypeSourceContextVariants {
    kind: 'reference';
    identity: string;
}
export interface TypeSourceField {
    key: string;
    type: TypeSourceExpression;
    description?: string;
    optional: boolean;
    array: boolean;
    min?: number;
    max?: number;
    examples: unknown[];
    inheritedFrom?: string;
}
export interface TypeSourceObjectDefinition extends TypeSourceContextVariants {
    kind: 'object';
    fields: TypeSourceField[];
    extends?: TypeSourceReference;
}
export interface TypeSourceEnumDefinition extends TypeSourceContextVariants {
    kind: 'enum';
    values: Array<string | number | boolean>;
}
export interface TypeSourceUnionDefinition extends TypeSourceContextVariants {
    kind: 'union';
    variants: TypeSourceExpression[];
}
export interface TypeSourceArrayDefinition extends TypeSourceContextVariants {
    kind: 'array';
    items: TypeSourceExpression;
}
export interface TypeSourceRecordDefinition extends TypeSourceContextVariants {
    kind: 'record';
    values: TypeSourceExpression;
}
export type TypeSourceDefinition = TypeSourceObjectDefinition | TypeSourceEnumDefinition | TypeSourceUnionDefinition | TypeSourceArrayDefinition;
export type TypeSourceExpression = TypeSourceReference | TypeSourceDefinition | TypeSourceRecordDefinition;
export interface TypeSourceDocument {
    definition: TypeSourceDefinition;
}
export interface TypeProgramPayload {
    ast?: unknown;
    type: 'type';
    sourceVersion: number;
    identity?: string;
    displayName?: string;
    category?: 'primitive' | 'reference' | 'user';
    definition: TypeSourceDefinition | null;
    runtimeType?: string;
    entityReference?: {
        target: string;
        storage: 'id' | 'identity';
    };
}
export interface TypeProgramCatalogEntry {
    id: string | number;
    identity: string;
    displayName: string;
    category: 'primitive' | 'reference' | 'user';
    sourceVersion: number;
    definition: TypeSourceDefinition | null;
    runtimeType?: string;
    entityReference?: TypeProgramPayload['entityReference'];
    status: 'valid' | 'warning' | 'error';
}
export interface TypeSourceCompileResult {
    ast: unknown | null;
    document: TypeSourceDocument | null;
    artifact: TypeProgramPayload | null;
    metadata: ProgramMetadataMap;
    diagnostics: Omit<ProgramDiagnostic, 'entityRef'>[];
}
```

## src/features/core/modules/source/domain/types/update-source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/update-source.types.ts)

```ts
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { ProgramDiagnostic } from '@/features/core/modules/program/domain/types/program.types';
import type { SourceExpressionIR } from '@/features/core/modules/source/domain/types/source-expression.types';
export type UpdateMutationStrategy = 'set' | 'merge' | 'replace' | 'append' | 'remove';
export interface UpdateMutationDescriptor {
    strategy: UpdateMutationStrategy;
    target: string;
    plane?: 'data' | 'meta';
    namespace?: string | null;
    forEach: string | null;
    ifExists: string | null;
    valueFrom: string | null;
    value?: SourceExpressionIR | null;
    when?: SourceExpressionIR | null;
    vars: Record<string, string>;
}
export interface UpdateSourceDocument {
    handles: string[];
    mutations: UpdateMutationDescriptor[];
}
export interface UpdateSourceArtifact extends UpdateSourceDocument {
    ast?: unknown;
    type: 'update';
    sourceVersion: number;
    storeIdentity: string;
}
export interface UpdateSourceCompileResult {
    ast: unknown | null;
    document: UpdateSourceDocument | null;
    artifact: Omit<UpdateSourceArtifact, 'storeIdentity'> | null;
    metadata: ProgramMetadataMap;
    diagnostics: Omit<ProgramDiagnostic, 'entityRef'>[];
}
export interface StoreMutationPlan {
    plane?: 'data' | 'meta';
    strategy: UpdateMutationStrategy;
    path: string;
    namespace?: string;
    value?: unknown;
    vars?: Record<string, unknown>;
}
```

## src/features/core/modules/source/domain/types/vocab-source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/domain/types/vocab-source.types.ts)

```ts
import type { RQueryAuth } from '@/features/core/modules/domain/types/document/query.types';
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { ProgramDiagnostic, QueryProgramOutput } from '@/features/core/modules/program/domain/types/program.types';
export type VocabProviderBaseUrl = string | {
    kind: 'env';
    name: string;
};
export interface VocabPayloadProvider {
    kind: 'payload';
    baseUrl: VocabProviderBaseUrl;
    collection: string;
    auth: RQueryAuth;
}
export interface VocabMockReference {
    identity: string;
    path: string | null;
}
export interface VocabSourceDocument {
    sourceVersion: 1;
    provider: VocabPayloadProvider | null;
    mock: VocabMockReference | null;
    outputs: QueryProgramOutput[];
}
export interface VocabProgramPayload extends VocabSourceDocument {
    ast?: unknown;
    sourceDocument?: VocabSourceDocument | null;
}
export interface VocabSourceCompileResult {
    ast: unknown;
    document: VocabSourceDocument | null;
    artifact: VocabProgramPayload | null;
    metadata: ProgramMetadataMap;
    diagnostics: Array<Omit<ProgramDiagnostic, 'entityRef'>>;
}
export interface VocabSourcePatch {
    mock: VocabMockReference | null;
}
```

## src/features/core/modules/source/EndgeSource_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/EndgeSource_Module.ts)

```ts
import type { SourceContextValues } from '@/features/core/modules/source/domain/types/source-context.types';
import type { SourceDocumentReference, SourceEngineCompileContext, SourceEngineCompileResult, SourceEngineGenerateResult, SourceEngineStrategy, SourceKind, SourceLanguageCompletion, SourceLanguageContext, SourceLanguageInlineHint, SourceLanguageSemanticHighlight, SourceLanguageSignatureHelp, SourceLanguageStrategy, SourceLanguageValidationResult, SourceParseResult, SourcePatchResult, SourcePatchStrategy } from '@/features/core/modules/source/domain/types/source-engine.types';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeSource_Module extends EndgeModule {
    constructor();
    registerStrategy(strategy: SourceEngineStrategy): void;
    registerLanguageStrategy(strategy: SourceLanguageStrategy): void;
    registerPatchStrategy(strategy: SourcePatchStrategy): void;
    listStrategies(): SourceEngineStrategy[];
    listLanguageStrategies(): SourceLanguageStrategy[];
    listPatchStrategies(): SourcePatchStrategy[];
    resolveStrategy(sourceKind: SourceKind | string): SourceEngineStrategy | null;
    resolveLanguageStrategy(sourceKind: SourceKind | string): SourceLanguageStrategy | null;
    resolvePatchStrategy(sourceKind: SourceKind | string): SourcePatchStrategy | null;
    generate(sourceKind: SourceKind | string, model: unknown): SourceEngineGenerateResult;
    compile(sourceKind: SourceKind | string, source: string, context?: SourceEngineCompileContext): SourceEngineCompileResult;
    parse<TDocument = unknown>(sourceKind: SourceKind | string, source: string): SourceParseResult<TDocument>;
    patch<TPatch = unknown, TDocument = unknown>(sourceKind: SourceKind | string, source: string, patch: TPatch): SourcePatchResult<TDocument>;
    createDefault(sourceKind: SourceKind | string, variant?: string): string;
    normalize(sourceKind: SourceKind | string, source: string): string;
    validate(sourceKind: SourceKind | string, source: string, context?: Omit<SourceLanguageContext, 'source'>): SourceLanguageValidationResult;
    currentSourceContext(): SourceContextValues | null;
    completions(sourceKind: SourceKind | string, context: SourceLanguageContext): SourceLanguageCompletion[];
    signatureHelp(sourceKind: SourceKind | string, context: SourceLanguageContext): SourceLanguageSignatureHelp | null;
    referenceAt(sourceKind: SourceKind | string, context: SourceLanguageContext): SourceDocumentReference | null;
    semanticHighlights(sourceKind: SourceKind | string, context: SourceLanguageContext): SourceLanguageSemanticHighlight[];
    inlineHints(sourceKind: SourceKind | string, context: SourceLanguageContext): SourceLanguageInlineHint[];
}
```

## src/features/core/modules/source/services/compilers/configuration-source-compile.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/compilers/configuration-source-compile.ts)

```ts
import type { ConfigurationSourceCompileResult } from '@/features/core/modules/source/domain/types/configuration-source.types';
import type { TypeProgramCatalogEntry } from '@/features/core/modules/source/domain/types/type-source.types';
export declare function compileConfigurationSource(source: string, catalog?: readonly TypeProgramCatalogEntry[]): ConfigurationSourceCompileResult;
```

## src/features/core/modules/source/services/compilers/vocab-source-compile.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/compilers/vocab-source-compile.ts)

```ts
import type { VocabSourceCompileResult } from '@/features/core/modules/source/domain/types/vocab-source.types';
export declare function compileVocabSource(source: string): VocabSourceCompileResult;
```

## src/features/core/modules/source/services/component-sfc/component-sfc-metadata-source-patch.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/component-sfc/component-sfc-metadata-source-patch.ts)

```ts
import type { ComponentSFCMetadataSourcePatchResult, ComponentSFCMetadataVisualProjection } from '@/features/core/modules/domain/types/component/sfc/metadata-visual.types';
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
export declare function inspectComponentSFCMetadata(source: string): ComponentSFCMetadataVisualProjection;
export declare function patchComponentSFCMetadataSource(source: string, metadata: ProgramMetadataMap): ComponentSFCMetadataSourcePatchResult;
```

## src/features/core/modules/source/services/component-sfc/component-sfc-ports-source-patch.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/component-sfc/component-sfc-ports-source-patch.ts)

```ts
import type { ComponentSFCCompileOptions } from '@/features/core/modules/compiler/services/component-sfc/component-sfc-compile';
import type { ComponentSFCPortsSourcePatch, ComponentSFCPortsSourcePatchResult, ComponentSFCPortsSourceProjection } from '@/features/core/modules/domain/types/component/sfc/ports-source.types';
export declare function inspectComponentSFCPortsSource(source: string, options?: ComponentSFCCompileOptions): ComponentSFCPortsSourceProjection;
export declare function patchComponentSFCPortsSource(source: string, patch: ComponentSFCPortsSourcePatch, options?: ComponentSFCCompileOptions): ComponentSFCPortsSourcePatchResult;
```

## src/features/core/modules/source/services/component-sfc/component-sfc-props-source-patch.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/component-sfc/component-sfc-props-source-patch.ts)

```ts
import type { RComponentSFC_IR_Prop } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { ComponentSFCPropsSourcePatchResult, ComponentSFCPropsVisualProjection } from '@/features/core/modules/domain/types/component/sfc/props-visual.types';
export declare function inspectComponentSFCProps(source: string): ComponentSFCPropsVisualProjection;
export declare function patchComponentSFCPropsSource(source: string, props: readonly RComponentSFC_IR_Prop[]): ComponentSFCPropsSourcePatchResult;
```

## src/features/core/modules/source/services/component-sfc/component-sfc-table-source-patch.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/component-sfc/component-sfc-table-source-patch.ts)

```ts
import type { ComponentSFCTableSourcePatch, ComponentSFCTableSourcePatchResult, ComponentSFCVisualInspectionOptions } from '@/features/core/modules/domain/types/component/sfc/visual-projection.types';
export declare function patchComponentSFCTableSource(source: string, patch: ComponentSFCTableSourcePatch, options?: ComponentSFCVisualInspectionOptions): ComponentSFCTableSourcePatchResult;
```

## src/features/core/modules/source/services/component-sfc/component-sfc-visual-projection.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/component-sfc/component-sfc-visual-projection.ts)

```ts
import type { ComponentSFCVisualInspection, ComponentSFCVisualInspectionOptions } from '@/features/core/modules/domain/types/component/sfc/visual-projection.types';
export declare function inspectComponentSFCVisual(source: string, options?: ComponentSFCVisualInspectionOptions): ComponentSFCVisualInspection;
```

## src/features/core/modules/source/services/configuration-source-patch.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/configuration-source-patch.ts)

```ts
import type { ConfigurationSourceValueDefinition } from '@/features/core/modules/source/domain/types/configuration-source.types';
export type ConfigurationSourcePatch = {
    op: 'upsert';
    value: ConfigurationSourceValueDefinition;
} | {
    op: 'remove';
    key: string;
} | {
    op: 'rename';
    key: string;
    nextKey: string;
};
export declare function patchConfigurationSource(source: string, patch: ConfigurationSourcePatch): string;
export declare function serializeConfigurationValue(value: ConfigurationSourceValueDefinition, indent?: number): string;
```

## src/features/core/modules/source/services/document-metadata.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/document-metadata.ts)

```ts
import type { DocumentMetadataInput, DocumentMetadataPatchResult, DocumentMetadataProjection } from '@/features/core/modules/domain/types/document/document-metadata.types';
import type { DomainDocumentType } from '@/features/core/modules/domain/types/document/document.types';
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
export declare function inspectDocumentMetadata(type: DomainDocumentType, input: DocumentMetadataInput): DocumentMetadataProjection;
export declare function patchDocumentMetadata(type: DomainDocumentType, input: DocumentMetadataInput, metadata: ProgramMetadataMap): DocumentMetadataPatchResult;
```

## src/features/core/modules/source/services/filter-source-patch.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/filter-source-patch.ts)

```ts
import type { FilterSourceEditorDocument, FilterSourcePatch } from '@/features/core/modules/source/domain/types/filter-source.types';
import type { SourcePatchResult } from '@/features/core/modules/source/domain/types/source-engine.types';
export declare function parseFilterSourceForEditor(source: string): {
    ok: boolean;
    ast: {} | undefined;
    document: FilterSourceEditorDocument | undefined;
    diagnostics: Omit<import("../../program/domain/types/program.types").ProgramDiagnostic, "entityRef">[];
    message: string | undefined;
};
export declare function patchFilterSource(source: string, patch: FilterSourcePatch): SourcePatchResult<FilterSourceEditorDocument>;
```

## src/features/core/modules/source/services/graphql-fragments.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/graphql-fragments.ts)

```ts
import type { DocumentNode } from 'graphql';
import type { GraphQLDocumentFragments, GraphQLDocumentVariant } from '@/features/core/modules/source/domain/types/graphql-fragments.types';
import type { GraphQLDocumentDiagnostic, GraphQLSchemaInput } from '@/features/core/modules/source/services/graphql-schema';
export interface GraphQLDocumentUsage {
    spreads: Set<string>;
    variables: Set<string>;
}
export declare function collectGraphQLDocumentUsage(document: DocumentNode): GraphQLDocumentUsage;
export declare function composeGraphQLDocument(operation: string, pick: (name: string) => string | undefined): string;
export declare function createGraphQLDocumentVariants(source: GraphQLDocumentFragments): GraphQLDocumentVariant[];
export interface GraphQLDocumentVariantValidation extends GraphQLDocumentVariant {
    diagnostics: GraphQLDocumentDiagnostic[];
}
export declare function validateGraphQLDocumentVariants(schema: GraphQLSchemaInput, source: GraphQLDocumentFragments): GraphQLDocumentVariantValidation[];
export declare function readGraphQLFragmentDefinitions(document: DocumentNode): Set<string>;
```

## src/features/core/modules/source/services/graphql-schema.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/graphql-schema.ts)

```ts
import type { IntrospectionOptions, IntrospectionQuery } from 'graphql';
import { GraphQLSchema } from 'graphql';
export type GraphQLIntrospectionResult = IntrospectionQuery | {
    data?: IntrospectionQuery | null;
    errors?: readonly unknown[];
};
export type GraphQLSchemaInput = string | GraphQLSchema | GraphQLIntrospectionResult;
export interface GraphQLDocumentDiagnostic {
    severity: 'error' | 'warning';
    code: string;
    message: string;
    line?: number;
    column?: number;
    endLine?: number;
    endColumn?: number;
    offset?: number;
    length?: number;
}
export interface GraphQLSchemaLoadResult {
    schema: GraphQLSchema | null;
    format: 'schema' | 'sdl' | 'introspection' | null;
    diagnostics: GraphQLDocumentDiagnostic[];
}
export declare function createGraphQLIntrospectionQuery(options?: IntrospectionOptions): string;
export declare function loadGraphQLSchema(input: GraphQLSchemaInput): GraphQLSchemaLoadResult;
export declare function validateGraphQLDocument(schema: GraphQLSchemaInput, source: string): GraphQLDocumentDiagnostic[];
```

## src/features/core/modules/source/services/source-expression-evaluate.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/source-expression-evaluate.ts)

```ts
import type { SourceExpressionContext, SourceExpressionIR } from '@/features/core/modules/source/domain/types/source-expression.types';
export declare function evaluateSourceExpression(expression: SourceExpressionIR, context?: SourceExpressionContext): unknown;
export declare const evaluateValueExpression: typeof evaluateSourceExpression;
```

## src/features/core/modules/source/services/type-source-serialize.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/type-source-serialize.ts)

```ts
import type { TypeSourceDocument, TypeSourceExpression } from '@/features/core/modules/source/domain/types/type-source.types';
export declare function serializeTypeSourceDocument(document: TypeSourceDocument): string;
export declare function serializeTypeSourceExpression(expression: TypeSourceExpression, indent?: number): string;
export declare function serializeTypeSourceReference(identity: string): string;
```

## src/features/core/modules/source/services/typescript-type-source.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/typescript-type-source.ts)

```ts
import type { TypeSourceDocument } from '@/features/core/modules/source/domain/types/type-source.types';
export interface TypeScriptTypeDeclarationRange {
    start: number;
    end: number;
}
export interface TypeScriptTypeDeclarationAnalysis {
    kind: 'interface' | 'type';
    identity: string;
    range: TypeScriptTypeDeclarationRange;
    actionAnchor: number;
    source: string;
    document: TypeSourceDocument | null;
    dependencies: string[];
    unsupportedReason: string | null;
}
export declare function analyzeTypeScriptTypeDeclarations(source: string): TypeScriptTypeDeclarationAnalysis[];
```

## src/features/core/modules/source/services/vocab-source-patch.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/vocab-source-patch.ts)

```ts
import type { SourcePatchResult } from '@/features/core/modules/source/domain/types/source-engine.types';
import type { VocabSourceDocument, VocabSourcePatch } from '@/features/core/modules/source/domain/types/vocab-source.types';
export declare function parseVocabSource(source: string): {
    ok: boolean;
    ast: {} | undefined;
    document: VocabSourceDocument | undefined;
    diagnostics: Omit<import("../../program/domain/types/program.types").ProgramDiagnostic, "entityRef">[];
    message: string | undefined;
};
export declare function patchVocabSource(source: string, patch: VocabSourcePatch): SourcePatchResult<VocabSourceDocument>;
```
