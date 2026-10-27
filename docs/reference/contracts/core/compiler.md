---
description: "TypeScript-декларации @endge/core 1.0.0-dev.12, группа compiler; исходных модулей: 16."
---

# @endge/core: compiler

Версия source: 1.0.0-dev.12. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/compiler/EndgeCompiler_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/EndgeCompiler_Module.ts)

```ts
import type { EndgeBootContext } from '@/features/core/kernel/types/bootstrap.types';
import type { RSimulation } from '@/features/core/modules/domain/entities/RSimulation';
import type { RStore } from '@/features/core/modules/domain/entities/RStore';
import type { RStream } from '@/features/core/modules/domain/entities/RStream';
import type { RType } from '@/features/core/modules/domain/entities/RType';
import type { RUpdate } from '@/features/core/modules/domain/entities/RUpdate';
import type { RVocabs } from '@/features/core/modules/domain/entities/RVocabs';
import type { ActionProgramPayload, ComponentSFCProgramPayload, ComputationProgramPayload, DataViewProgramPayload, EndgeStyleProgramPayload, ProgramArtifact, ProgramEntityType, QueryProgramPayload } from '@/features/core/modules/program/domain/types/program.types';
import type { CompositionProgramPayload } from '@/features/core/modules/source/domain/types/composition-source.types';
import type { FilterProgramPayload } from '@/features/core/modules/source/domain/types/filter-source.types';
import type { SimulationSourceArtifact } from '@/features/core/modules/source/domain/types/simulation-source.types';
import type { StoreSourceArtifact } from '@/features/core/modules/source/domain/types/store-source.types';
import type { StreamSourceArtifact } from '@/features/core/modules/source/domain/types/stream-source.types';
import type { TypeProgramPayload } from '@/features/core/modules/source/domain/types/type-source.types';
import type { UpdateSourceArtifact } from '@/features/core/modules/source/domain/types/update-source.types';
import type { VocabProgramPayload } from '@/features/core/modules/source/domain/types/vocab-source.types';
import { RAction } from '@/features/core/modules/domain/entities/RAction';
import { RComponentSFC } from '@/features/core/modules/domain/entities/RComponentSFC';
import { RComposition } from '@/features/core/modules/domain/entities/RComposition';
import { RComputation } from '@/features/core/modules/domain/entities/RComputation';
import { RDataView } from '@/features/core/modules/domain/entities/RDataView';
import { RFilter } from '@/features/core/modules/domain/entities/RFilter';
import { RQuery } from '@/features/core/modules/domain/entities/RQuery';
import { RStyle } from '@/features/core/modules/domain/entities/RStyle';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeCompiler_Module extends EndgeModule<EndgeBootContext> {
    constructor();
    listSupportedEntityTypes(): ProgramEntityType[];
    build(_ctx: EndgeBootContext): void;
    buildQuery(entity: RQuery): ProgramArtifact<QueryProgramPayload>;
    buildVocab(entity: RVocabs): ProgramArtifact<VocabProgramPayload>;
    buildComputation(entity: RComputation): ProgramArtifact<ComputationProgramPayload>;
    buildType(entity: RType): ProgramArtifact<TypeProgramPayload>;
    buildAction(entity: RAction): ProgramArtifact<ActionProgramPayload>;
    buildComponentSFC(entity: RComponentSFC): ProgramArtifact<ComponentSFCProgramPayload>;
    compileComponentSFCArtifact(entity: RComponentSFC): ProgramArtifact<ComponentSFCProgramPayload>;
    buildDataView(entity: RDataView): ProgramArtifact<DataViewProgramPayload>;
    buildStore(entity: RStore): ProgramArtifact<StoreSourceArtifact>;
    buildStream(entity: RStream): ProgramArtifact<StreamSourceArtifact>;
    buildSimulation(entity: RSimulation): ProgramArtifact<SimulationSourceArtifact>;
    compileSimulationArtifact(entity: RSimulation): ProgramArtifact<SimulationSourceArtifact>;
    buildUpdate(entity: RUpdate): ProgramArtifact<UpdateSourceArtifact>;
    buildFilter(entity: RFilter): ProgramArtifact<FilterProgramPayload>;
    buildComposition(entity: RComposition): ProgramArtifact<CompositionProgramPayload>;
    compileCompositionArtifact(entity: RComposition): ProgramArtifact<CompositionProgramPayload>;
    buildStyle(entity: RStyle): ProgramArtifact<EndgeStyleProgramPayload>;
}
```

## src/features/core/modules/compiler/services/component-sfc/component-sfc-attributes.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-attributes.ts)

```ts
import type { RComponentContractInput, RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
import type { RComponentSFC_AST } from '@/features/core/modules/domain/types/component/sfc/ast.types';
import type { ComponentSFCAttributeAnalysisOptions, ComponentSFCTagAttributeContract } from '@/features/core/modules/domain/types/component/sfc/tag-attribute-contract.types';
export declare function validateComponentSFCAttributeValues(source: string, ast: RComponentSFC_AST | null, options?: ComponentSFCAttributeAnalysisOptions): RComponentDiagnostic[];
export declare function resolveComponentSFCTagAttributeContracts(tag: string, options?: ComponentSFCAttributeAnalysisOptions): readonly ComponentSFCTagAttributeContract[];
export declare function createComponentSFCAttributeContractsFromInputs(inputs: readonly RComponentContractInput[]): ComponentSFCTagAttributeContract[];
```

## src/features/core/modules/compiler/services/component-sfc/component-sfc-built-in-tags.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-built-in-tags.ts)

```ts
import type { RComponentSFC_IR_Tag } from '@/features/core/modules/domain/types/component/sfc/ir.types';
export declare const ENDGE_SFC_BUILT_IN_TAGS: Set<RComponentSFC_IR_Tag>;
export declare function isComponentSFCBuiltInTag(tag: string): tag is RComponentSFC_IR_Tag;
```

## src/features/core/modules/compiler/services/component-sfc/component-sfc-compile.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-compile.ts)

```ts
import type { EndgeSFCEditingConfiguration } from '@/features/core/modules/configuration/domain/types/configuration.type';
import type { RComponentContract, RComponentDependencies, RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
import type { RComponentSFC_AST } from '@/features/core/modules/domain/types/component/sfc/ast.types';
import type { RComponentSFC_RuntimeDependencies } from '@/features/core/modules/domain/types/component/sfc/dependencies.types';
import type { RComponentSFC_IR } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { ComponentSFCPortManifest, ComponentSFCPortProviderDescriptor } from '@/features/core/modules/domain/types/component/sfc/ports.types';
import type { RComponentSFCSource_Parts } from '@/features/core/modules/domain/types/component/sfc/source.types';
import type { ProgramMetadata } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { ComponentSFCPreviewOptions, ComponentSFCPreviewProps } from '@/features/core/modules/program/domain/types/program.types';
import type { TypeSourceDefinition } from '@/features/core/modules/source/domain/types/type-source.types';
export interface ComponentSFCCompileResult {
    sourceParts: RComponentSFCSource_Parts;
    ast: RComponentSFC_AST | null;
    ir: RComponentSFC_IR | null;
    contract: RComponentContract;
    dependencies: RComponentDependencies;
    runtimeDependencies: RComponentSFC_RuntimeDependencies;
    previewProps: ComponentSFCPreviewProps | null;
    previewOptions: ComponentSFCPreviewOptions | null;
    diagnostics: RComponentDiagnostic[];
    metadata: ProgramMetadata;
    sections: Record<'script' | 'template' | 'style', 'valid' | 'warning' | 'error'>;
}
export interface ComponentSFCCompileOptions {
    identity?: string;
    resolveComponentTag?: (tag: string) => string | null;
    hasComponentIdentity?: (identity: string) => boolean;
    resolvePortProvider?: (identity: string, expectedKind: 'computation' | 'component' | 'action' | 'query') => ComponentSFCPortProviderDescriptor | null;
    resolveComponentPortManifest?: (identity: string) => ComponentSFCPortManifest | null;
    resolveComponentVariants?: (identity: string) => string[] | null;
    resolveTypeDefinition?: (identity: string) => TypeSourceDefinition | null;
    sfcEditing?: EndgeSFCEditingConfiguration;
}
export declare function compileComponentSFC(source: string, options?: ComponentSFCCompileOptions): ComponentSFCCompileResult;
```

## src/features/core/modules/compiler/services/component-sfc/component-sfc-expression.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-expression.ts)

```ts
import type { Node } from '@babel/types';
import type { EndgeRuntimeContextSnapshot } from '@/features/core/modules/context/domain/context-persistence.types';
import type { RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
import type { RComponentSFC_IR_Value } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { EndgeConfigurationSchemaEntry } from '@/features/core/modules/source/domain/types/configuration-source.types';
export interface ComponentSFCExpressionContext {
    props?: Iterable<string>;
    locals?: Iterable<string>;
    sourcePath?: string;
}
export interface ComponentSFCExpressionCompileResult {
    value: RComponentSFC_IR_Value;
    diagnostics: RComponentDiagnostic[];
}
export type ComponentSFCExpressionCompletionScope = 'table-row-menu' | 'table-column-menu';
export interface ComponentSFCExpressionCompletionRequest {
    source: string;
    cursor: number;
    scope: ComponentSFCExpressionCompletionScope;
    context?: Readonly<EndgeRuntimeContextSnapshot> | Record<string, unknown>;
    configurations?: Iterable<EndgeConfigurationSchemaEntry>;
}
export interface ComponentSFCExpressionCompletion {
    label: string;
    insertText: string;
    kind: 'variable' | 'property' | 'configuration';
    detail: string;
    documentation?: string;
    replace: {
        start: number;
        end: number;
    };
}
export declare function resolveComponentSFCExpressionCompletions(request: ComponentSFCExpressionCompletionRequest): ComponentSFCExpressionCompletion[];
export declare function readComponentSFCTranslationFallback(source: string): string | null;
export declare function compileComponentSFCExpression(source: string, context?: ComponentSFCExpressionContext): ComponentSFCExpressionCompileResult;
export declare function compileComponentSFCExpressionAST(ast: Node, source: string, context?: ComponentSFCExpressionContext): ComponentSFCExpressionCompileResult;
```

## src/features/core/modules/compiler/services/component-sfc/component-sfc-forward.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-forward.ts)

```ts
import type { RComponentDependencies, RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
import type { RComponentSFC_IR_Template } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { ComponentSFCPortManifest } from '@/features/core/modules/domain/types/component/sfc/ports.types';
export interface ComponentSFCPortForwardOptions {
    resolveComponentPortManifest?: (identity: string) => ComponentSFCPortManifest | null;
}
export interface ComponentSFCPortForwardResult {
    diagnostics: RComponentDiagnostic[];
    dependencies: RComponentDependencies;
}
export declare function resolveComponentSFCPortForwards(manifest: ComponentSFCPortManifest, template: RComponentSFC_IR_Template | null, options?: ComponentSFCPortForwardOptions): ComponentSFCPortForwardResult;
export declare function createBuiltInComponentPortManifest(tag: string): ComponentSFCPortManifest | null;
export declare function listBuiltInComponentPortManifests(): Array<{
    tag: string;
    manifest: ComponentSFCPortManifest;
}>;
```

## src/features/core/modules/compiler/services/component-sfc/component-sfc-parse.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-parse.ts)

```ts
import type { RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
import type { RComponentSFC_AST } from '@/features/core/modules/domain/types/component/sfc/ast.types';
import type { RComponentSFCSource_Parts } from '@/features/core/modules/domain/types/component/sfc/source.types';
export interface ComponentSFCParseResult {
    sourceParts: RComponentSFCSource_Parts;
    ast: RComponentSFC_AST | null;
    diagnostics: RComponentDiagnostic[];
}
export declare function parseComponentSFC(source: string): ComponentSFCParseResult;
```

## src/features/core/modules/compiler/services/component-sfc/component-sfc-ports.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-ports.ts)

```ts
import type { File } from '@babel/types';
import type { RComponentDependencies, RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
import type { RComponentSFC_AST_Script } from '@/features/core/modules/domain/types/component/sfc/ast.types';
import type { ComponentSFCEventAction, ComponentSFCPortManifest, ComponentSFCPortProviderDescriptor, RComponentSFC_IR_PortCall } from '@/features/core/modules/domain/types/component/sfc/ports.types';
import type { TypeSourceDefinition } from '@/features/core/modules/source/domain/types/type-source.types';
export interface ComponentSFCPortAnalysisOptions {
    scriptSyntax?: File | null;
    resolveProvider?: (identity: string, expectedKind: 'computation' | 'component' | 'action' | 'query') => ComponentSFCPortProviderDescriptor | null;
    resolveTypeDefinition?: (identity: string) => TypeSourceDefinition | null;
}
export declare function compileComponentSFCLocalEventActions(eventName: string, source: string, sourceOffset: number, dependencies: RComponentDependencies, diagnostics: RComponentDiagnostic[], ownerPorts?: ComponentSFCPortManifest | null): ComponentSFCEventAction[];
export declare function compileComponentSFCLocalEventAction(eventName: string, source: string, sourceOffset: number, dependencies: RComponentDependencies, diagnostics: RComponentDiagnostic[], ownerPorts?: ComponentSFCPortManifest | null): ComponentSFCEventAction | null;
export interface ComponentSFCPortAnalysisResult {
    manifest: ComponentSFCPortManifest;
    calls: RComponentSFC_IR_PortCall[];
    dependencies: RComponentDependencies;
    diagnostics: RComponentDiagnostic[];
    bindingName: string | null;
}
export declare function analyzeComponentSFCPorts(script: RComponentSFC_AST_Script | null, dependencies: RComponentDependencies, options?: ComponentSFCPortAnalysisOptions): ComponentSFCPortAnalysisResult;
```

## src/features/core/modules/compiler/services/component-sfc/component-sfc-script.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-script.ts)

```ts
import type { File } from '@babel/types';
import type { RComponentContract, RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
import type { RComponentSFC_AST_Script } from '@/features/core/modules/domain/types/component/sfc/ast.types';
import type { RComponentSFC_IR_LocalBinding, RComponentSFC_IR_Prop } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { ComponentSFCPreviewOptions, ComponentSFCPreviewProps } from '@/features/core/modules/program/domain/types/program.types';
import type { TypeSourceDefinition } from '@/features/core/modules/source/domain/types/type-source.types';
export interface ComponentSFCTypeResolutionOptions {
    scriptSyntax?: File | null;
    resolveTypeDefinition?: (identity: string) => TypeSourceDefinition | null;
}
export interface ComponentSFCScriptAnalysisResult {
    contract: RComponentContract;
    props: RComponentSFC_IR_Prop[];
    locals: RComponentSFC_IR_LocalBinding[];
    previewProps: ComponentSFCPreviewProps | null;
    previewOptions: ComponentSFCPreviewOptions | null;
    metadata: ProgramMetadataMap;
    diagnostics: RComponentDiagnostic[];
}
export declare function analyzeComponentSFCScript(script: RComponentSFC_AST_Script | null, options?: ComponentSFCTypeResolutionOptions): ComponentSFCScriptAnalysisResult;
export declare function parseComponentSFCTypeFields(source: string, scriptContent?: string, options?: ComponentSFCTypeResolutionOptions): RComponentSFC_IR_Prop[];
```

## src/features/core/modules/compiler/services/component-sfc/component-sfc-style.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-style.ts)

```ts
import type { RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
import type { RComponentSFC_AST_Style } from '@/features/core/modules/domain/types/component/sfc/ast.types';
import type { RComponentSFC_IR_Style } from '@/features/core/modules/domain/types/component/sfc/ir.types';
export interface ComponentSFCStyleCompileResult {
    style: RComponentSFC_IR_Style | null;
    diagnostics: RComponentDiagnostic[];
}
export interface ComponentSFCStyleCompileOptions {
    identity?: string;
}
export declare function compileComponentSFCStyle(style: RComponentSFC_AST_Style | null, options?: ComponentSFCStyleCompileOptions): ComponentSFCStyleCompileResult;
```

## src/features/core/modules/compiler/services/component-sfc/component-sfc-table-menu.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-table-menu.ts)

```ts
import type { ComponentSFCTableCellMenuDescriptor, ComponentSFCTableColumnMenuDescriptor, ComponentSFCTableRowMenuDescriptor, RComponentSFC_IR_ElementNode } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { ComponentSFCActionPort } from '@/features/core/modules/domain/types/component/sfc/ports.types';
export declare const SFC_TABLE_COLUMN_MENU_MODES: readonly [
    "default",
    "disabled"
];
export type { ComponentSFCTableCellMenuDescriptor, ComponentSFCTableCellMenuMode, ComponentSFCTableColumnMenuDescriptor, ComponentSFCTableColumnMenuMode, ComponentSFCTableMenuDescriptor, ComponentSFCTableMenuItemDescriptor, ComponentSFCTableMenuNodeDescriptor, ComponentSFCTableMenuSeparatorDescriptor, ComponentSFCTableRowMenuDescriptor, ComponentSFCTableRowMenuMode, } from '@/features/core/modules/domain/types/component/sfc/ir.types';
interface NormalizeMenuOptions {
    availableActions?: ComponentSFCActionPort[];
}
export declare function normalizeComponentSFCTableColumnMenu(tableNode: RComponentSFC_IR_ElementNode, actionsOrOptions?: ComponentSFCActionPort[] | NormalizeMenuOptions): ComponentSFCTableColumnMenuDescriptor;
export declare function normalizeComponentSFCTableRowMenu(tableNode: RComponentSFC_IR_ElementNode, actionsOrOptions?: ComponentSFCActionPort[] | NormalizeMenuOptions): ComponentSFCTableRowMenuDescriptor;
export declare function normalizeComponentSFCTableCellMenu(tableNode: RComponentSFC_IR_ElementNode, actionsOrOptions?: ComponentSFCActionPort[] | NormalizeMenuOptions): ComponentSFCTableCellMenuDescriptor;
export declare function normalizeComponentSFCColumnCellMenu(tableNode: RComponentSFC_IR_ElementNode, columnNode: RComponentSFC_IR_ElementNode, actionsOrOptions?: ComponentSFCActionPort[] | NormalizeMenuOptions): ComponentSFCTableCellMenuDescriptor | undefined;
export declare function readComponentSFCTableMenuActionPortReference(source: string): {
    name: string;
    role?: 'require' | 'provides';
} | null;
```

## src/features/core/modules/compiler/services/component-sfc/component-sfc-table-pin.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-table-pin.ts)

```ts
import type { TableColumnPinSide } from '@/features/core/modules/actions/domain/action.types';
import type { RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
import type { RComponentSFC_IR_ElementNode } from '@/features/core/modules/domain/types/component/sfc/ir.types';
export declare const SFC_TABLE_COLUMN_PIN_MODES: readonly [
    "enabled",
    "disabled"
];
export declare const SFC_TABLE_COLUMN_PIN_SIDES: readonly [
    "left",
    "right"
];
export type ComponentSFCTableColumnPinMode = typeof SFC_TABLE_COLUMN_PIN_MODES[number];
export type ComponentSFCTableColumnPinSide = typeof SFC_TABLE_COLUMN_PIN_SIDES[number];
export interface ComponentSFCTableColumnPinStateItem {
    key: string;
    side: ComponentSFCTableColumnPinSide;
}
export interface ComponentSFCTableColumnPinDescriptor {
    mode: ComponentSFCTableColumnPinMode;
    defaultPin: ComponentSFCTableColumnPinStateItem[];
    columns: ComponentSFCTableColumnPinCapability[];
    diagnostics: RComponentDiagnostic[];
}
export interface ComponentSFCTableColumnPinCapability {
    key: string;
    pinnable: boolean;
}
export declare function normalizeComponentSFCTableColumnPin(tableNode: RComponentSFC_IR_ElementNode): ComponentSFCTableColumnPinDescriptor;
export declare function normalizeComponentSFCTableColumnPinMode(value: unknown): ComponentSFCTableColumnPinMode;
export declare function normalizeTableColumnPinSide(value: unknown): TableColumnPinSide;
```

## src/features/core/modules/compiler/services/component-sfc/component-sfc-table-sort.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-table-sort.ts)

```ts
import type { RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
import type { RComponentSFC_IR_ElementNode } from '@/features/core/modules/domain/types/component/sfc/ir.types';
export declare const SFC_TABLE_SORT_MODES: readonly [
    "multiple",
    "single",
    "fixed",
    "disabled"
];
export declare const SFC_TABLE_SORT_COMPARATORS: readonly [
    "natural",
    "text",
    "number",
    "date",
    "time",
    "boolean"
];
export declare const SFC_TABLE_SORT_DIRECTIONS: readonly [
    "asc",
    "desc"
];
export type ComponentSFCTableSortMode = typeof SFC_TABLE_SORT_MODES[number];
export type ComponentSFCTableSortComparator = typeof SFC_TABLE_SORT_COMPARATORS[number];
export type ComponentSFCTableSortDirection = typeof SFC_TABLE_SORT_DIRECTIONS[number];
export interface ComponentSFCTableSortStateItem {
    key: string;
    direction: ComponentSFCTableSortDirection;
}
export interface ComponentSFCTableColumnSortDescriptor {
    key: string;
    sortable: boolean;
    comparator: ComponentSFCTableSortComparator;
    paths: string[];
}
export interface ComponentSFCTableSortDescriptor {
    mode: ComponentSFCTableSortMode;
    defaultSort: ComponentSFCTableSortStateItem[];
    columns: ComponentSFCTableColumnSortDescriptor[];
    diagnostics: RComponentDiagnostic[];
}
export declare function normalizeComponentSFCTableSort(tableNode: RComponentSFC_IR_ElementNode): ComponentSFCTableSortDescriptor;
export declare function normalizeComponentSFCTableSortComparator(value: unknown): ComponentSFCTableSortComparator | null;
export declare function normalizeComponentSFCTableSortMode(value: unknown): ComponentSFCTableSortMode;
export declare function parseComponentSFCTableSortPaths(value: unknown, fallback: string): string[];
```

## src/features/core/modules/compiler/services/component-sfc/component-sfc-table-visibility.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-table-visibility.ts)

```ts
import type { RComponentSFC_IR_ElementNode } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { ComponentSFCTableColumnVisibilityDescriptor } from '@/features/core/modules/domain/types/component/sfc/table-visibility.types';
export declare function normalizeComponentSFCTableColumnVisibility(tableNode: RComponentSFC_IR_ElementNode): ComponentSFCTableColumnVisibilityDescriptor;
```

## src/features/core/modules/compiler/services/component-sfc/component-sfc-template.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-template.ts)

```ts
import type { EndgeSFCEditingConfiguration } from '@/features/core/modules/configuration/domain/types/configuration.type';
import type { RComponentDependencies, RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
import type { RComponentSFC_AST_Template } from '@/features/core/modules/domain/types/component/sfc/ast.types';
import type { RComponentSFC_IR_Template } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { ComponentSFCComponentPort, ComponentSFCPortManifest, ComponentSFCPortProviderDescriptor, ComponentSFCRequiredPortKind } from '@/features/core/modules/domain/types/component/sfc/ports.types';
import type { ProgramNodeMetadata } from '@/features/core/modules/program/domain/types/program-metadata.types';
export interface ComponentSFCTemplateCompileContext {
    props: string[];
    locals: string[];
    componentPorts?: ComponentSFCComponentPort[];
    ownerPorts?: ComponentSFCPortManifest | null;
    resolveComponentTag?: (tag: string) => string | null;
    hasComponentIdentity?: (identity: string) => boolean;
    resolveComponentPortManifest?: (identity: string) => ComponentSFCPortManifest | null;
    resolvePortProvider?: (identity: string, expectedKind: ComponentSFCRequiredPortKind) => ComponentSFCPortProviderDescriptor | null;
    resolveComponentVariants?: (identity: string) => string[] | null;
    sfcEditing?: EndgeSFCEditingConfiguration;
}
export interface ComponentSFCTemplateCompileResult {
    template: RComponentSFC_IR_Template | null;
    dependencies: RComponentDependencies;
    diagnostics: RComponentDiagnostic[];
    metadata: ProgramNodeMetadata[];
    emittedEvents: string[];
}
export { isComponentSFCBuiltInTag } from '@/features/core/modules/compiler/services/component-sfc/component-sfc-built-in-tags';
export declare function compileComponentSFCTemplate(template: RComponentSFC_AST_Template | null, context: ComponentSFCTemplateCompileContext): ComponentSFCTemplateCompileResult;
```

## src/features/core/modules/compiler/services/computation/computation-compile.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/computation/computation-compile.ts)

```ts
import type { ComputationProgramPayload } from '@/features/core/modules/domain/types/computation/computation-program.types';
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
import type { ProgramDiagnostic } from '@/features/core/modules/program/domain/types/program.types';
import * as t from '@babel/types';
type DiagnosticDraft = Omit<ProgramDiagnostic, 'entityRef'>;
export interface ComputationCompileInput {
    source: string;
}
export interface ComputationCompileResult {
    payload: ComputationProgramPayload;
    metadata: ProgramMetadataMap;
    diagnostics: DiagnosticDraft[];
}
export declare function compileComputation(input: ComputationCompileInput): ComputationCompileResult;
export declare function validateSandboxBody(node: t.Node, diagnostics: DiagnosticDraft[], sourcePath: string): void;
export declare function functionSource(node: t.ObjectMethod | t.FunctionExpression | t.ArrowFunctionExpression, source: string): string;
export {};
```
