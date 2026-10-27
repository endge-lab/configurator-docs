---
description: "TypeScript-декларации @endge/core 1.0.0-dev.12, группа actions; исходных модулей: 3."
---

# @endge/core: actions

Версия source: 1.0.0-dev.12. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/actions/domain/action.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/actions/domain/action.types.ts)

```ts
import type { EntityOrigin, EntityRef } from '@/features/core/modules/domain/types/document/entity-management.type';
export type RuntimeActionId = string;
export type RuntimeActionSurface = string;
export declare const BUILTIN_ACTION_IDS: {
    readonly consoleLog: "built-in-console-log";
    readonly testAlert: "built-in-test-alert";
    readonly vocabAcquire: "built-in-vocabs-acquire";
    readonly vocabRefresh: "built-in-vocabs-refresh";
    readonly vocabInvalidate: "built-in-vocabs-invalidate";
};
export interface ActionBinding<TInput = unknown> {
    identity: RuntimeActionId;
    input?: TInput;
}
export interface ActionTargetSelector {
    type: string;
    identity?: string;
}
export interface ActionExecutionTarget<TValue = unknown> {
    type: string;
    identity: string;
    value: TValue;
}
export type ActionImplementation = {
    kind: 'source';
} | {
    kind: 'provider';
    providerKey: string;
} | {
    kind: 'component-port';
    portName: string;
};
export interface ActionDefinitionInput {
    identity: string;
    displayName?: string;
    description?: string | null;
    active?: boolean;
    target?: ActionTargetSelector[] | null;
    contract?: {
        input?: unknown;
        output?: unknown;
    };
    defaultProviderKey?: string;
    defaultImplementation?: ActionImplementation;
    owner?: EntityRef;
}
export interface ActionExecuteOptions<TInput = unknown> {
    input?: TInput;
    target?: ActionExecutionTarget;
    context?: Record<string, unknown>;
    resolution?: Partial<Record<Exclude<ImplementationBindingScope, 'default'>, string>>;
    providerKey?: string;
}
export interface ResolvedActionDescriptor {
    identity: string;
    displayName: string;
    description: string | null;
    active: boolean;
    origin: EntityOrigin;
    catalogPath?: string[];
    owner?: EntityRef;
    target: ActionTargetSelector[] | null;
    input: unknown | null;
    output: unknown | null;
    defaultImplementation: ActionImplementation;
    overridden: boolean;
    effectiveProviderKey: string | null;
    effectiveProviderOrigin: EntityOrigin | null;
    bindingScope: ImplementationBindingScope | null;
}
export type ImplementationBindingScope = 'default' | 'application' | 'workspace' | 'composition' | 'component' | 'invocation';
export interface RuntimeActionContext {
    surface: RuntimeActionSurface;
    runtimeId?: string;
    target?: unknown;
}
export interface RuntimeAction<TContext extends RuntimeActionContext = RuntimeActionContext, TPayload = unknown, TResult = void> {
    id: RuntimeActionId;
    label?: string;
    description?: string;
    surface?: RuntimeActionSurface;
    canExecute?: (context: TContext, payload?: TPayload) => boolean;
    execute: (context: TContext, payload?: TPayload) => TResult | Promise<TResult>;
}
export type AnyRuntimeAction = RuntimeAction<any, any, any>;
export interface RuntimeActionSnapshotItem {
    id: RuntimeActionId;
    label?: string;
    description?: string;
    surface?: RuntimeActionSurface;
}
export interface RuntimeActionRegistrySnapshot {
    actions: RuntimeActionSnapshotItem[];
}
export type TableColumnPinSide = 'left' | 'right' | 'none';
export type TableSortDirection = 'asc' | 'desc';
export type TableSortMode = 'multiple' | 'single' | 'fixed' | 'disabled';
export declare const TABLE_RUNTIME_ACTION_IDS: {
    readonly columnHide: "table.column.hide";
    readonly columnPinLeft: "table.column.pinLeft";
    readonly columnPinRight: "table.column.pinRight";
    readonly columnUnpin: "table.column.unpin";
    readonly columnResetPin: "table.column.resetPin";
    readonly columnResetAllPins: "table.column.resetAllPins";
    readonly sortSetColumnAsc: "table.sort.setColumnAsc";
    readonly sortSetColumnDesc: "table.sort.setColumnDesc";
    readonly sortClearColumn: "table.sort.clearColumn";
    readonly sortClearAll: "table.sort.clearAll";
};
export type TableRuntimeActionId = typeof TABLE_RUNTIME_ACTION_IDS[keyof typeof TABLE_RUNTIME_ACTION_IDS];
export interface TableColumnSortState {
    active: boolean;
    direction?: TableSortDirection;
    index?: number;
}
export interface TableRuntimeActionTarget {
    setColumnVisibility?: (columnKey: string, visible: boolean) => void | Promise<void>;
    setColumnPin?: (columnKey: string, side: TableColumnPinSide) => void | Promise<void>;
    resetColumnPin?: (columnKey: string) => void | Promise<void>;
    resetAllPins?: () => void | Promise<void>;
    setColumnSort?: (columnKey: string, direction: TableSortDirection) => void | Promise<void>;
    clearColumnSort?: (columnKey: string) => void | Promise<void>;
    clearAllSort?: () => void | Promise<void>;
}
export interface TableColumnActionContext extends RuntimeActionContext {
    surface: 'table-column-header';
    tableRuntimeId: string;
    tableId: string;
    target: TableRuntimeActionTarget;
    columnKey: string;
    columnIndex: number;
    hideable: boolean;
    pinnable: boolean;
    pinMode: 'enabled' | 'disabled';
    pinState: TableColumnPinSide;
    defaultPinState: TableColumnPinSide;
    hasPinChanges: boolean;
    sortable: boolean;
    sortMode: TableSortMode;
    sortState: TableColumnSortState;
    activeSortCount: number;
}
export interface TableActionTableContext {
    id: string;
    runtimeId: string;
    state: Readonly<Record<string, unknown>>;
}
export interface TableActionRowContext {
    id: string;
    index: number;
    data: Record<string, unknown>;
}
export interface TableActionColumnContext {
    key: string;
    index: number;
    title: string;
    metadata: Readonly<Record<string, unknown>>;
}
export interface TableActionCellContext {
    value: unknown;
}
export interface TableRowActionContext extends RuntimeActionContext {
    surface: 'table-row';
    table: TableActionTableContext;
    rowContext: TableActionRowContext;
    column: TableActionColumnContext;
    cell: TableActionCellContext;
    tableRuntimeId: string;
    tableId: string;
    target: TableRuntimeActionTarget;
    row: Record<string, unknown>;
    rowId: string;
    rowIndex: number;
    columnKey: string;
    value: unknown;
}
export type TableCellActionContext = TableRowActionContext;
```

## src/features/core/modules/actions/EndgeActions_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/actions/EndgeActions_Module.ts)

```ts
import type { ActionDefinitionInput, ActionExecuteOptions, ImplementationBindingScope, ResolvedActionDescriptor, RuntimeAction, RuntimeActionContext, RuntimeActionId, RuntimeActionRegistrySnapshot } from '@/features/core/modules/actions/domain/action.types';
import type { EntityOrigin } from '@/features/core/modules/domain/types/document/entity-management.type';
import type { ImplementationProvider } from '@/features/core/modules/implementations/domain/implementation.types';
import type { EndgeImplementations_Module } from '@/features/core/modules/implementations/EndgeImplementations_Module';
import { RAction } from '@/features/core/modules/domain/entities/RAction';
import { EndgeModule } from '@/features/federation/EndgeModule';
export interface CodeActionDefinition extends Omit<ActionDefinitionInput, 'owner'> {
    owner: string;
    catalogPath?: readonly string[];
    providerKey?: string;
    execute?: ImplementationProvider['execute'];
    canExecute?: ImplementationProvider['canExecute'];
}
export interface ActionOverrideInput {
    identity: string;
    providerKey: string;
    scope?: Exclude<ImplementationBindingScope, 'default' | 'invocation'>;
    scopeIdentity?: string;
    priority?: number;
}
export interface ActionDefinitionDescriptor extends ActionDefinitionInput {
    origin: EntityOrigin;
    catalogPath?: readonly string[];
}
export interface ActionProviderDescriptor extends Omit<ImplementationProvider, 'contract'> {
    identity: string;
}
export declare class EndgeActions_Module extends EndgeModule {
    constructor(_implementations: EndgeImplementations_Module);
    setup(): void;
    reset(): void;
    define(definition: ActionDefinitionDescriptor): () => void;
    provide(provider: ActionProviderDescriptor): () => void;
    override(override: ActionOverrideInput): () => void;
    execute<TResult = unknown>(identity: RuntimeActionId, optionsOrContext?: ActionExecuteOptions | RuntimeActionContext, legacyPayload?: unknown): Promise<TResult | undefined>;
    listResolved(): ResolvedActionDescriptor[];
    list(input?: {
        surface?: string;
    }): RuntimeAction[];
    get(id: RuntimeActionId): RuntimeAction | null;
    has(id: RuntimeActionId): boolean;
    getCodeDefinition(identity: string): RAction | null;
    getDefinition(identity: string): RAction | null;
    canExecute(id: RuntimeActionId, context: RuntimeActionContext, payload?: unknown): boolean;
    serialize(): RuntimeActionRegistrySnapshot;
}
```

## src/features/core/modules/actions/services/table-actions.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/actions/services/table-actions.ts)

```ts
import type { RuntimeAction, TableColumnActionContext } from '@/features/core/modules/actions/domain/action.types';
export declare function createTableRuntimeActions(): RuntimeAction<TableColumnActionContext>[];
```
