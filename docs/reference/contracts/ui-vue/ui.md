---
description: "TypeScript-декларации @endge/ui-vue 1.0.0-dev.11, группа ui; исходных модулей: 29."
---

# @endge/ui-vue: ui

Версия source: 1.0.0-dev.11. [Каталог package](./). [Repository](https://github.com/endge-lab/ui-vue).

## src/ui/filter/index.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/filter/index.ts)

```ts
export { default as EndgeFilterField } from './EndgeFilterField.vue';
export { default as EndgeFilterRenderer } from './EndgeFilterRenderer.vue';
```

## src/ui/overlay/context-menu-manager.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/context-menu-manager.ts)

```ts
import type { ContextMenuDescriptor, ContextMenuItemDescriptor, ContextMenuNodeDescriptor, RuntimeActionContext } from '@endge/core';
export interface EndgeContextMenuOpenInput<TContext extends RuntimeActionContext = RuntimeActionContext> {
    ownerId: string;
    x: number;
    y: number;
    menu: ContextMenuDescriptor;
    context: TContext;
}
export interface EndgeContextMenuState {
    open: boolean;
    ownerId: string | null;
    x: number;
    y: number;
    menu: ContextMenuDescriptor | null;
    context: RuntimeActionContext | null;
}
export declare const endgeContextMenuState: {
    open: boolean;
    ownerId: string | null;
    x: number;
    y: number;
    menu: {
        kind: "context-menu";
        items: ({
            kind: "item";
            id: string;
            label: string;
            action: import("@endge/core").RuntimeActionId;
            input?: unknown;
            icon?: string | undefined;
            disabled?: boolean | undefined;
        } | {
            kind: "separator";
            id: string;
        })[];
    } | null;
    context: {
        surface: import("@endge/core").RuntimeActionSurface;
        runtimeId?: string | undefined;
        target?: unknown;
    } | null;
};
export declare function openEndgeContextMenu(input: EndgeContextMenuOpenInput): void;
export declare function closeEndgeContextMenu(ownerId?: string): void;
export declare function getContextMenuItems(): ContextMenuNodeDescriptor[];
export declare const getExecutableContextMenuItems: typeof getContextMenuItems;
export declare function executeEndgeContextMenuItem(item: ContextMenuItemDescriptor): Promise<void>;
export declare function resolveEndgeContextMenuItemLabel(item: ContextMenuItemDescriptor): string;
```

## src/ui/overlay/tooltip/endge-tooltip-manager.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/tooltip/endge-tooltip-manager.ts)

```ts
import type { EndgeTooltipConfiguration } from '@endge/core';
import type { InjectionKey, VNodeChild } from 'vue';
export type EndgeTooltipContentKind = 'text' | 'markdown' | 'rich';
export type EndgeTooltipActivationReason = 'pointer' | 'focus';
export interface EndgeVueTooltipPolicy extends EndgeTooltipConfiguration {
}
export interface EndgeVueTooltipRequest {
    ownerId: string;
    domId: string;
    anchor: HTMLElement;
    kind: EndgeTooltipContentKind;
    policy?: Partial<EndgeVueTooltipPolicy>;
    className?: unknown;
    authoredId?: string;
    part?: string;
    renderContent: () => VNodeChild;
}
export interface EndgeVueTooltipState {
    phase: 'idle' | 'pending' | 'visible';
    ownerId: string | null;
    domId: string | null;
    anchor: HTMLElement | null;
    kind: EndgeTooltipContentKind;
    policy: EndgeVueTooltipPolicy;
    className: unknown;
    authoredId: string | null;
    part: string | null;
    content: VNodeChild | null;
}
export declare class EndgeVueTooltipManager {
    readonly state: EndgeVueTooltipState;
    readonly adapterId: string;
    constructor(adapterId: string, defaults: EndgeTooltipConfiguration);
    activate(request: EndgeVueTooltipRequest, reason: EndgeTooltipActivationReason): void;
    deactivate(ownerId: string, reason: EndgeTooltipActivationReason, anchor?: HTMLElement): void;
    detachTrigger(ownerId: string, anchor: HTMLElement): void;
    reattachIfHovered(ownerId: string, anchor: HTMLElement, createRequest: (anchor: HTMLElement) => EndgeVueTooltipRequest): void;
    refreshTrigger(ownerId: string, anchor: HTMLElement, createRequest: (anchor: HTMLElement) => EndgeVueTooltipRequest): void;
    close(ownerId?: string): void;
    dispose(): void;
}
export declare const EndgeVueTooltipManagerKey: InjectionKey<EndgeVueTooltipManager>;
export declare function attachEndgeTooltipTriggerAttrs(attrs: Record<string, unknown>, manager: EndgeVueTooltipManager | null, ownerId: string, createRequest: (anchor: HTMLElement) => EndgeVueTooltipRequest): void;
```

## src/ui/render/sfc/SFCRender_Badge.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Badge.ts)

```ts
import type { SFCVueRenderAdapterFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Badge: SFCVueRenderAdapterFunction;
```

## src/ui/render/sfc/SFCRender_Base.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Base.ts)

```ts
import type { EndgeStyleMatchNode, RComponentSFC_IR_ElementNode } from '@endge/core';
import type { SFCVueRenderConditionState, SFCVueRenderContext, SFCVueRenderFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare function SFCRender_Base(renderFn: SFCVueRenderFunction): SFCVueRenderFunction;
export declare function resolveSFCConditionState(node: RComponentSFC_IR_ElementNode, context: SFCVueRenderContext, previousMatched: boolean): SFCVueRenderConditionState;
export declare function createSFCBaseAttrs(node: RComponentSFC_IR_ElementNode, props: Record<string, unknown>, styleNode?: EndgeStyleMatchNode, runtimeScopeIds?: readonly string[]): Record<string, unknown>;
export declare function attachSFCShorthandTooltip(attrs: Record<string, unknown>, node: RComponentSFC_IR_ElementNode, props: Record<string, unknown>, context: SFCVueRenderContext): void;
export declare function createSFCNodeEventAttrs(node: RComponentSFC_IR_ElementNode, props: Record<string, unknown>, context: SFCVueRenderContext): Record<string, unknown>;
```

## src/ui/render/sfc/SFCRender_BoundaryRegistry.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_BoundaryRegistry.ts)

```ts
import type { RuntimeBoundaryPatch } from '@endge/core';
import type { InjectionKey } from 'vue';
export interface SFCVueBoundaryController {
    applyPatch: (patch: RuntimeBoundaryPatch) => boolean | Promise<boolean>;
}
export interface SFCVueBoundaryRegistry {
    register: (boundaryId: string, controller: SFCVueBoundaryController) => VoidFunction;
    applyPatch: (patch: RuntimeBoundaryPatch) => Promise<boolean>;
}
export declare const SFCVueBoundaryRegistryKey: InjectionKey<SFCVueBoundaryRegistry>;
export declare function createSFCVueBoundaryRegistry(): SFCVueBoundaryRegistry;
```

## src/ui/render/sfc/SFCRender_Box.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Box.ts)

```ts
import type { SFCVueRenderAdapterFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Box: SFCVueRenderAdapterFunction;
```

## src/ui/render/sfc/SFCRender_Checkbox.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Checkbox.ts)

```ts
import type { SFCVueRenderAdapterFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Checkbox: SFCVueRenderAdapterFunction;
```

## src/ui/render/sfc/SFCRender_Component.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Component.ts)

```ts
import type { SFCVueRenderFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Component: SFCVueRenderFunction;
```

## src/ui/render/sfc/SFCRender_Context.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Context.ts)

```ts
import type { ComponentSFCEventBoundary, ComponentSFCRenderPort, ComponentSFCRequiredPortBinding, EndgeStyleMatchNode, EndgeStyleSheetArtifact, ProgramMetadata, RComponentSFC_IR, SFCRenderInspectionSessionLike } from '@endge/core';
import type { SFCVueRenderContext, SFCVueRenderIteration } from '@/services/render/sfc/sfc-vue-render.type';
import type { EndgeVueTooltipManager } from '@/ui/overlay/tooltip/endge-tooltip-manager';
export declare function createSFCVueRenderContext(props: Record<string, unknown> | undefined, renderVersion?: number, host?: ComponentSFCRenderPort | null, ir?: RComponentSFC_IR | null, componentStack?: readonly string[], consumerScope?: string, inheritedStyleArtifacts?: readonly EndgeStyleSheetArtifact[], inheritedEventBoundary?: ComponentSFCEventBoundary | null, inspection?: SFCRenderInspectionSessionLike | null, metadata?: ProgramMetadata | null, variant?: string, tooltipManager?: EndgeVueTooltipManager | null, portBindings?: readonly ComponentSFCRequiredPortBinding[], parentContext?: SFCVueRenderContext): SFCVueRenderContext;
export declare function extendSFCVueRenderContext(context: SFCVueRenderContext, locals: Record<string, unknown>, iteration?: SFCVueRenderIteration | null, consumerScope?: string, dataScope?: {
    kind: "table-row";
    boundaryId: string;
    rowKey: unknown;
} | null): SFCVueRenderContext;
export declare function extendSFCVueStyleContext(context: SFCVueRenderContext, parent: EndgeStyleMatchNode): SFCVueRenderContext;
```

## src/ui/render/sfc/SFCRender_DateTime.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_DateTime.ts)

```ts
import type { SFCVueRenderAdapterFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_DateTime: SFCVueRenderAdapterFunction;
export declare function formatSFCDateTime(value: unknown, format: unknown, timezone: unknown, empty: unknown): string;
```

## src/ui/render/sfc/SFCRender_Divider.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Divider.ts)

```ts
import type { SFCVueRenderAdapterFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Divider: SFCVueRenderAdapterFunction;
```

## src/ui/render/sfc/SFCRender_Dot.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Dot.ts)

```ts
import type { SFCVueRenderAdapterFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Dot: SFCVueRenderAdapterFunction;
```

## src/ui/render/sfc/SFCRender_Evaluator.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Evaluator.ts)

```ts
import type { RComponentSFC_IR_Value } from '@endge/core';
import type { SFCVueRenderBinding, SFCVueRenderContext } from '@/services/render/sfc/sfc-vue-render.type';
export declare function evaluateSFCValue(value: RComponentSFC_IR_Value | undefined, context: SFCVueRenderContext): unknown;
export declare function evaluateSFCBinding(binding: SFCVueRenderBinding, context: SFCVueRenderContext): unknown;
export declare function evaluateSFCProps(props: Record<string, RComponentSFC_IR_Value> | undefined, context: SFCVueRenderContext): Record<string, unknown>;
export declare function isTruthySFCValue(value: unknown): boolean;
export declare function readSFCPath(path: string, context: SFCVueRenderContext): unknown;
export declare function readSFCObjectPath(path: string, source: unknown): unknown;
```

## src/ui/render/sfc/SFCRender_Flex.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Flex.ts)

```ts
import type { SFCVueRenderAdapterFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Flex: SFCVueRenderAdapterFunction;
```

## src/ui/render/sfc/SFCRender_Grid.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Grid.ts)

```ts
import type { SFCVueRenderAdapterFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Grid: SFCVueRenderAdapterFunction;
```

## src/ui/render/sfc/SFCRender_Icon.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Icon.ts)

```ts
import type { SFCVueRenderAdapterFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Icon: SFCVueRenderAdapterFunction;
```

## src/ui/render/sfc/SFCRender_Input.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Input.ts)

```ts
import type { SFCVueRenderAdapterFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Input: SFCVueRenderAdapterFunction;
```

## src/ui/render/sfc/SFCRender_Node.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Node.ts)

```ts
import type { RComponentSFC_IR_Node } from '@endge/core';
import type { SFCVueRenderContext, SFCVueRenderH, SFCVueRenderListResult, SFCVueRenderResult } from '@/services/render/sfc/sfc-vue-render.type';
export declare function renderSFCNodes(h: SFCVueRenderH, nodes: RComponentSFC_IR_Node[] | undefined, context: SFCVueRenderContext): SFCVueRenderListResult;
export declare function renderSFCNode(h: SFCVueRenderH, node: RComponentSFC_IR_Node, context: SFCVueRenderContext): SFCVueRenderResult;
```

## src/ui/render/sfc/SFCRender_Number.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Number.ts)

```ts
import type { SFCVueRenderAdapterFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Number: SFCVueRenderAdapterFunction;
```

## src/ui/render/sfc/SFCRender_Select.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Select.ts)

```ts
import type { SFCVueRenderAdapterFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Select: SFCVueRenderAdapterFunction;
```

## src/ui/render/sfc/SFCRender_Table.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Table.ts)

```ts
import type { SFCVueRenderFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Table: SFCVueRenderFunction;
export declare function normalizeSFCTableRows(value: unknown): Record<string, unknown>[];
export declare function createInitialTableVisibility<T extends {
    key: string;
}>(defaultHidden: readonly string[], columns: readonly T[]): Record<string, boolean>;
export declare function filterVisibleTableColumns<T extends {
    key: string;
}>(columns: readonly T[], visibility: Readonly<Record<string, boolean>>): T[];
export declare function applyRowSnapshots(rows: Record<string, unknown>[], patches: Array<{
    itemIndex: number | null;
    itemKey: unknown;
    itemSnapshot: unknown;
}>, rowKey: string): Record<string, unknown>[];
```

## src/ui/render/sfc/SFCRender_TableAlignment.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableAlignment.ts)

```ts
export type SFCTableCellAlign = 'left' | 'center' | 'right';
export type SFCTableCellVerticalAlign = 'top' | 'middle' | 'bottom';
export interface SFCTableCellAlignment {
    horizontal: SFCTableCellAlign;
    vertical: SFCTableCellVerticalAlign;
}
export declare function normalizeSFCTableCellAlignment(horizontal: unknown, vertical: unknown): SFCTableCellAlignment;
```

## src/ui/render/sfc/SFCRender_TableMenu.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableMenu.ts)

```ts
import type { ComponentSFCTableMenuDescriptor, ContextMenuDescriptor } from '@endge/core';
import type { SFCVueRenderContext } from '@/services/render/sfc/sfc-vue-render.type';
export declare function resolveSFCTableMenu(descriptor: ComponentSFCTableMenuDescriptor | null, context: SFCVueRenderContext): ContextMenuDescriptor | null;
```

## src/ui/render/sfc/SFCRender_TableStyle.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts)

```ts
import type { SFCVueRenderContext } from '@/services/render/sfc/sfc-vue-render.type';
export type SFCTablePublicPart = 'grid' | 'header' | 'header-cell' | 'header-content' | 'body' | 'row' | 'cell' | 'cell-content' | 'group-row';
export interface SFCTableMarkerAttrs extends Record<string, unknown> {
    'part': SFCTablePublicPart;
    'data-endge-part': SFCTablePublicPart;
    'class': string[];
}
export interface SFCTableMarkers {
    context: SFCVueRenderContext;
    grid: SFCTableMarkerAttrs;
    header: SFCTableMarkerAttrs;
    body: SFCTableMarkerAttrs;
    row: SFCTableMarkerAttrs;
    groupRow: SFCTableMarkerAttrs;
}
export interface SFCTableColumnMarkers {
    headerCell: SFCTableMarkerAttrs;
    headerContent: SFCTableMarkerAttrs;
    cell: SFCTableMarkerAttrs;
    cellContent: SFCTableMarkerAttrs;
}
export interface SFCTablePublicSurface {
    attrs: SFCTableMarkerAttrs;
}
export interface SFCTableStyleContract {
    context: SFCVueRenderContext;
    markers: SFCTableMarkers;
    grid: SFCTablePublicSurface;
    header: SFCTablePublicSurface;
    body: SFCTablePublicSurface;
    groupRow: SFCTablePublicSurface;
}
export interface SFCTableColumnStyleSurfaces {
    headerCell: SFCTablePublicSurface;
    headerContent: SFCTablePublicSurface;
}
export interface SFCTableCellStyleSurfaces {
    cell: SFCTablePublicSurface;
    cellContent: SFCTablePublicSurface;
}
export declare const SFC_TABLE_ROW_CLASS_FIELD = "__endgeStyleRowClass";
export declare function createSFCTableMarkers(context: SFCVueRenderContext): SFCTableMarkers;
export declare function createSFCTableColumnMarkers(markers: SFCTableMarkers, columnCount: number): SFCTableColumnMarkers[];
export declare function createSFCTableStyleContract(context: SFCVueRenderContext): SFCTableStyleContract;
export declare function createSFCTableColumnStyleSurfaces(contract: SFCTableStyleContract, columnCount: number): SFCTableColumnStyleSurfaces[];
export declare function decorateSFCTableRowWindow(rows: readonly Record<string, unknown>[], columnCount: number, contract: SFCTableStyleContract, _startIndex: number, _totalRowCount: number): Record<string, unknown>[];
export declare function getSFCTableRowAttrs(row: Record<string, unknown>, states?: Iterable<string>): SFCTableMarkerAttrs;
export declare function getSFCTableCellStyleSurfaces(row: Record<string, unknown>, columnIndex: number, states?: Iterable<string>): SFCTableCellStyleSurfaces | null;
```

## src/ui/render/sfc/SFCRender_Text.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Text.ts)

```ts
import type { SFCVueRenderAdapterFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Text: SFCVueRenderAdapterFunction;
```

## src/ui/render/sfc/SFCRender_Textarea.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Textarea.ts)

```ts
import type { SFCVueRenderAdapterFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Textarea: SFCVueRenderAdapterFunction;
```

## src/ui/render/sfc/SFCRender_Tooltip.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Tooltip.ts)

```ts
import type { SFCVueRenderFunction } from '@/services/render/sfc/sfc-vue-render.type';
export declare const SFCRender_Tooltip: SFCVueRenderFunction;
```

## src/ui/table/tanstack-table.types.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/ui/table/tanstack-table.types.ts)

```ts
import type { ComponentSFCEventBoundary, ComponentSFCTableColumnMenuDescriptor, ComponentSFCTableColumnPinMode, ComponentSFCTableColumnPinStateItem, ComponentSFCTableRowMenuDescriptor, ComponentSFCTableSortComparator, ComponentSFCTableSortMode, ComponentSFCTableSortStateItem, RComponentSFC_IR_ElementNode, RComponentSFC_IR_EventBinding, RComponentSFC_IR_Node, TableCellSelectionMode, TableSelectionMode, TableSelectionTrigger } from '@endge/core';
import type { SFCVueRenderContext, SFCVueRenderResult, SFCVueRuntimeStateController } from '@/services/render/sfc/sfc-vue-render.type';
import type { SFCTableCellAlignment } from '@/ui/render/sfc/SFCRender_TableAlignment';
import type { SFCTableColumnStyleSurfaces, SFCTableStyleContract } from '@/ui/render/sfc/SFCRender_TableStyle';
export interface EndgeTanStackTableColumnSort {
    sortable: boolean;
    comparator: ComponentSFCTableSortComparator;
    paths: string[];
}
export interface EndgeTanStackTableColumn {
    index: number;
    key: string;
    title: string;
    width: number | null;
    minWidth: number;
    maxWidth: number;
    pinnable: boolean;
    alignment: SFCTableCellAlignment;
    metadata?: Readonly<Record<string, unknown>>;
    cellMenu?: ComponentSFCTableRowMenuDescriptor;
    sort: EndgeTanStackTableColumnSort | null;
    cellNode: RComponentSFC_IR_ElementNode | null;
    cellNodes: RComponentSFC_IR_Node[];
    styleSurfaces: SFCTableColumnStyleSurfaces;
}
export type EndgeTanStackTablePaging = 'pages' | 'virtual';
export interface EndgeTanStackTableProps {
    boundaryId: string;
    nodeId?: string;
    tableRef?: string | null;
    tableId: string;
    eventBoundary?: ComponentSFCEventBoundary | null;
    eventBindings?: RComponentSFC_IR_EventBinding[];
    selectionMode?: TableSelectionMode;
    selectionTrigger?: TableSelectionTrigger;
    cellSelectionMode?: TableCellSelectionMode;
    runtimeState: SFCVueRuntimeStateController | null;
    columns: EndgeTanStackTableColumn[];
    source: Record<string, unknown>[];
    styleContract: SFCTableStyleContract;
    rowKey: string;
    sortMode: ComponentSFCTableSortMode;
    pinMode: ComponentSFCTableColumnPinMode;
    columnMenu: ComponentSFCTableColumnMenuDescriptor;
    rowMenu?: ComponentSFCTableRowMenuDescriptor;
    menuContext?: SFCVueRenderContext;
    defaultSort: ComponentSFCTableSortStateItem[];
    defaultPin: ComponentSFCTableColumnPinStateItem[];
    defaultHidden: string[];
    rowSize: number;
    paging?: EndgeTanStackTablePaging;
    pageSize?: number;
    pageSizes?: number[];
    lazy?: boolean;
    renderVersion: number;
    renderCell: (column: EndgeTanStackTableColumn, row: Record<string, unknown>, rowIndex: number, rowId: string) => SFCVueRenderResult;
}
```
