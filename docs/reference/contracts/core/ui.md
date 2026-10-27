---
description: "TypeScript-декларации @endge/core 1.0.0-dev.12, группа ui; исходных модулей: 14."
---

# @endge/core: ui

Версия source: 1.0.0-dev.12. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/ui/adapters/json/endge-ui-json-adapter.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/ui/adapters/json/endge-ui-json-adapter.ts)

```ts
import type { ComponentSFCRenderPort } from '@/features/core/modules/runtime/domain/component-sfc-render-port.types';
import type { EndgeUIJsonMount, EndgeUIJsonMountOptions } from '@/features/core/modules/ui/domain/types/endge-ui-json.types';
import type { UIRenderAdapter } from '@/features/core/modules/ui/domain/types/ui-render-adapter.type';
export declare function mountEndgeUIJson(host: ComponentSFCRenderPort, options?: EndgeUIJsonMountOptions): EndgeUIJsonMount;
export interface EndgeUIJsonPrimitiveRenderer {
    type: string;
}
export declare const EndgeUIJsonAdapter: UIRenderAdapter<EndgeUIJsonPrimitiveRenderer>;
```

## src/features/core/modules/ui/adapters/json/endge-ui-json-patch.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/ui/adapters/json/endge-ui-json-patch.ts)

```ts
import type { EndgeUIJsonSnapshot, EndgeUIPatch } from '@/features/core/modules/ui/domain/types/endge-ui-json.types';
export declare function diffEndgeUIJsonSnapshots(previous: EndgeUIJsonSnapshot, next: EndgeUIJsonSnapshot): EndgeUIPatch;
export declare function applyEndgeUIPatch(snapshot: EndgeUIJsonSnapshot, patch: EndgeUIPatch): EndgeUIJsonSnapshot;
```

## src/features/core/modules/ui/adapters/json/endge-ui-json.schema.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/ui/adapters/json/endge-ui-json.schema.ts)

```ts
export declare const ENDGE_UI_JSON_SCHEMA: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://endge.dev/schemas/endge-ui/v1.json";
    readonly title: "Endge JSON UI endge-ui/v1";
    readonly oneOf: readonly [
        {
            readonly $ref: "#/$defs/snapshot";
        },
        {
            readonly $ref: "#/$defs/patch";
        }
    ];
    readonly $defs: {
        readonly json: {};
        readonly marker: {
            readonly type: "object";
            readonly required: readonly [
                "code",
                "severity",
                "message"
            ];
            readonly additionalProperties: false;
            readonly properties: {
                readonly code: {
                    readonly type: "string";
                };
                readonly severity: {
                    readonly enum: readonly [
                        "info",
                        "warning",
                        "error"
                    ];
                };
                readonly message: {
                    readonly type: "string";
                };
            };
        };
        readonly menu: {
            readonly type: "object";
            readonly required: readonly [
                "items"
            ];
            readonly additionalProperties: false;
            readonly properties: {
                readonly items: {
                    readonly type: "array";
                    readonly items: {
                        readonly oneOf: readonly [
                            {
                                readonly type: "object";
                                readonly required: readonly [
                                    "kind",
                                    "id",
                                    "label",
                                    "action"
                                ];
                                readonly additionalProperties: false;
                                readonly properties: {
                                    readonly kind: {
                                        readonly const: "item";
                                    };
                                    readonly id: {
                                        readonly type: "string";
                                    };
                                    readonly label: {
                                        readonly type: "string";
                                    };
                                    readonly action: {
                                        readonly type: "string";
                                    };
                                    readonly icon: {
                                        readonly type: "string";
                                    };
                                    readonly disabled: {
                                        readonly type: "boolean";
                                    };
                                };
                            },
                            {
                                readonly type: "object";
                                readonly required: readonly [
                                    "kind",
                                    "id"
                                ];
                                readonly additionalProperties: false;
                                readonly properties: {
                                    readonly kind: {
                                        readonly const: "separator";
                                    };
                                    readonly id: {
                                        readonly type: "string";
                                    };
                                };
                            }
                        ];
                    };
                };
            };
        };
        readonly editable: {
            readonly type: "object";
            readonly required: readonly [
                "active",
                "value",
                "triggers"
            ];
            readonly additionalProperties: false;
            readonly properties: {
                readonly active: {
                    readonly type: "boolean";
                };
                readonly value: {
                    readonly $ref: "#/$defs/json";
                };
                readonly draft: {
                    readonly $ref: "#/$defs/json";
                };
                readonly triggers: {
                    readonly type: "array";
                };
            };
        };
        readonly table: {
            readonly type: "object";
            readonly required: readonly [
                "rowKey",
                "columns",
                "rowCount",
                "offset",
                "limit"
            ];
            readonly additionalProperties: false;
            readonly properties: {
                readonly rowKey: {
                    readonly type: "string";
                };
                readonly rowCount: {
                    readonly type: "integer";
                    readonly minimum: 0;
                };
                readonly offset: {
                    readonly type: "integer";
                    readonly minimum: 0;
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly minimum: 1;
                };
                readonly columns: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly required: readonly [
                            "key",
                            "title"
                        ];
                        readonly additionalProperties: false;
                        readonly properties: {
                            readonly key: {
                                readonly type: "string";
                            };
                            readonly title: {
                                readonly type: "string";
                            };
                            readonly width: {
                                readonly type: "number";
                            };
                            readonly align: {
                                readonly type: "string";
                            };
                            readonly sortable: {
                                readonly type: "boolean";
                            };
                            readonly menu: {
                                readonly $ref: "#/$defs/menu";
                            };
                        };
                    };
                };
            };
        };
        readonly node: {
            readonly type: "object";
            readonly required: readonly [
                "id",
                "type",
                "props",
                "children"
            ];
            readonly additionalProperties: false;
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly type: {
                    readonly enum: readonly [
                        "Text",
                        "DateTime",
                        "Number",
                        "Icon",
                        "Badge",
                        "Dot",
                        "Box",
                        "Flex",
                        "Grid",
                        "Divider",
                        "Input",
                        "Textarea",
                        "Checkbox",
                        "Select",
                        "Tooltip",
                        "TooltipTrigger",
                        "TooltipContent",
                        "Component",
                        "Table",
                        "Column",
                        "Cell",
                        "ColumnMenu",
                        "CellMenu",
                        "RowMenu",
                        "MenuItem",
                        "MenuSeparator",
                        "Editable",
                        "Variant",
                        "#text",
                        "#row",
                        "#cell"
                    ];
                };
                readonly props: {
                    readonly type: "object";
                };
                readonly children: {
                    readonly type: "array";
                    readonly items: {
                        readonly $ref: "#/$defs/node";
                    };
                };
                readonly text: {
                    readonly type: "string";
                };
                readonly events: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly classes: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly states: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly parts: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly style: {
                    readonly type: "object";
                    readonly additionalProperties: {
                        readonly type: "string";
                    };
                };
                readonly component: {
                    readonly type: "string";
                };
                readonly editable: {
                    readonly $ref: "#/$defs/editable";
                };
                readonly table: {
                    readonly $ref: "#/$defs/table";
                };
                readonly menu: {
                    readonly $ref: "#/$defs/menu";
                };
                readonly markers: {
                    readonly type: "array";
                    readonly items: {
                        readonly $ref: "#/$defs/marker";
                    };
                };
            };
        };
        readonly snapshot: {
            readonly type: "object";
            readonly required: readonly [
                "format",
                "revision",
                "component",
                "roots"
            ];
            readonly additionalProperties: false;
            readonly properties: {
                readonly format: {
                    readonly const: "endge-ui/v1";
                };
                readonly revision: {
                    readonly type: "integer";
                    readonly minimum: 1;
                };
                readonly component: {
                    readonly type: readonly [
                        "string",
                        "null"
                    ];
                };
                readonly roots: {
                    readonly type: "array";
                    readonly items: {
                        readonly $ref: "#/$defs/node";
                    };
                };
                readonly markers: {
                    readonly type: "array";
                    readonly items: {
                        readonly $ref: "#/$defs/marker";
                    };
                };
            };
        };
        readonly patchOperation: {
            readonly oneOf: readonly [
                {
                    readonly type: "object";
                    readonly required: readonly [
                        "op",
                        "id"
                    ];
                    readonly additionalProperties: false;
                    readonly properties: {
                        readonly op: {
                            readonly const: "update";
                        };
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly set: {
                            readonly type: "object";
                        };
                        readonly unset: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                    };
                },
                {
                    readonly type: "object";
                    readonly required: readonly [
                        "op",
                        "id",
                        "children"
                    ];
                    readonly additionalProperties: false;
                    readonly properties: {
                        readonly op: {
                            readonly const: "children";
                        };
                        readonly id: {
                            readonly type: readonly [
                                "string",
                                "null"
                            ];
                        };
                        readonly children: {
                            readonly type: "array";
                            readonly items: {
                                readonly oneOf: readonly [
                                    {
                                        readonly $ref: "#/$defs/node";
                                    },
                                    {
                                        readonly type: "object";
                                        readonly required: readonly [
                                            "ref"
                                        ];
                                        readonly additionalProperties: false;
                                        readonly properties: {
                                            readonly ref: {
                                                readonly type: "string";
                                            };
                                        };
                                    }
                                ];
                            };
                        };
                    };
                },
                {
                    readonly type: "object";
                    readonly required: readonly [
                        "op",
                        "id",
                        "node"
                    ];
                    readonly additionalProperties: false;
                    readonly properties: {
                        readonly op: {
                            readonly const: "replace";
                        };
                        readonly id: {
                            readonly type: "string";
                        };
                        readonly node: {
                            readonly $ref: "#/$defs/node";
                        };
                    };
                },
                {
                    readonly type: "object";
                    readonly required: readonly [
                        "op",
                        "markers"
                    ];
                    readonly additionalProperties: false;
                    readonly properties: {
                        readonly op: {
                            readonly const: "markers";
                        };
                        readonly markers: {
                            readonly type: "array";
                            readonly items: {
                                readonly $ref: "#/$defs/marker";
                            };
                        };
                    };
                }
            ];
        };
        readonly patch: {
            readonly type: "object";
            readonly required: readonly [
                "format",
                "baseRevision",
                "revision",
                "ops"
            ];
            readonly additionalProperties: false;
            readonly properties: {
                readonly format: {
                    readonly const: "endge-ui/v1";
                };
                readonly baseRevision: {
                    readonly type: "integer";
                    readonly minimum: 1;
                };
                readonly revision: {
                    readonly type: "integer";
                    readonly minimum: 1;
                };
                readonly ops: {
                    readonly type: "array";
                    readonly items: {
                        readonly $ref: "#/$defs/patchOperation";
                    };
                };
            };
        };
    };
};
export interface EndgeUIJsonSchemaIssue {
    path: string;
    message: string;
}
export declare function validateEndgeUIJson(value: unknown, form?: 'snapshot' | 'patch' | 'any'): EndgeUIJsonSchemaIssue[];
```

## src/features/core/modules/ui/domain/types/context-menu.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/ui/domain/types/context-menu.types.ts)

```ts
import type { RuntimeActionId } from '@/features/core/modules/actions/domain/action.types';
export type ContextMenuItemKind = 'item' | 'separator';
export interface ContextMenuDescriptor {
    kind: 'context-menu';
    items: ContextMenuNodeDescriptor[];
}
export type ContextMenuNodeDescriptor = ContextMenuItemDescriptor | ContextMenuSeparatorDescriptor;
export interface ContextMenuItemDescriptor {
    kind: 'item';
    id: string;
    label: string;
    action: RuntimeActionId;
    input?: unknown;
    icon?: string;
    disabled?: boolean;
}
export interface ContextMenuSeparatorDescriptor {
    kind: 'separator';
    id: string;
}
```

## src/features/core/modules/ui/domain/types/endge-ui-json.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/ui/domain/types/endge-ui-json.types.ts)

```ts
import type { RComponentSFC_IR_Tag } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { RuntimeHostInputSource } from '@/features/core/modules/runtime/domain/runtime-host.types';
export declare const ENDGE_UI_JSON_FORMAT = "endge-ui/v1";
export declare const ENDGE_UI_JSON_ADAPTER_ID = "endge-ui-json";
export declare const ENDGE_UI_JSON_RENDERER = "json";
export type EndgeUIJsonValue = null | boolean | number | string | EndgeUIJsonValue[] | {
    [key: string]: EndgeUIJsonValue;
};
export type EndgeUISyntheticNodeType = '#text' | '#row' | '#cell';
export type EndgeUINodeType = RComponentSFC_IR_Tag | EndgeUISyntheticNodeType;
export interface EndgeUIMarker {
    code: string;
    severity: 'info' | 'warning' | 'error';
    message: string;
}
export interface EndgeUIEditableState {
    active: boolean;
    value: EndgeUIJsonValue;
    draft?: EndgeUIJsonValue;
    triggers: EndgeUIJsonValue[];
}
export interface EndgeUIMenuItem {
    kind: 'item';
    id: string;
    label: string;
    action: string;
    icon?: string;
    disabled?: boolean;
}
export interface EndgeUIMenuSeparator {
    kind: 'separator';
    id: string;
}
export interface EndgeUIMenu {
    items: Array<EndgeUIMenuItem | EndgeUIMenuSeparator>;
}
export interface EndgeUITableColumn {
    key: string;
    title: string;
    width?: number;
    align?: string;
    sortable?: boolean;
    menu?: EndgeUIMenu;
}
export interface EndgeUITableState {
    rowKey: string;
    columns: EndgeUITableColumn[];
    rowCount: number;
    offset: number;
    limit: number;
}
export interface EndgeUINode {
    id: string;
    type: EndgeUINodeType;
    props: Record<string, EndgeUIJsonValue>;
    children: EndgeUINode[];
    text?: string;
    events?: string[];
    classes?: string[];
    states?: string[];
    parts?: string[];
    style?: Record<string, string>;
    component?: string;
    editable?: EndgeUIEditableState;
    table?: EndgeUITableState;
    menu?: EndgeUIMenu;
    markers?: EndgeUIMarker[];
}
export interface EndgeUIJsonSnapshot {
    format: typeof ENDGE_UI_JSON_FORMAT;
    revision: number;
    component: string | null;
    roots: EndgeUINode[];
    markers?: EndgeUIMarker[];
}
export type EndgeUIChildEntry = EndgeUINode | {
    ref: string;
};
export type EndgeUINodeField = Exclude<keyof EndgeUINode, 'id' | 'type' | 'children'>;
export type EndgeUIPatchOperation = {
    op: 'update';
    id: string;
    set?: Partial<Pick<EndgeUINode, EndgeUINodeField>>;
    unset?: EndgeUINodeField[];
} | {
    op: 'children';
    id: string | null;
    children: EndgeUIChildEntry[];
} | {
    op: 'replace';
    id: string;
    node: EndgeUINode;
} | {
    op: 'markers';
    markers: EndgeUIMarker[];
};
export interface EndgeUIPatch {
    format: typeof ENDGE_UI_JSON_FORMAT;
    baseRevision: number;
    revision: number;
    ops: EndgeUIPatchOperation[];
}
export interface EndgeUIDispatchResult {
    handled: boolean;
    reason?: 'unknown-node' | 'unknown-event' | 'unmounted';
}
export interface EndgeUIJsonMountOptions {
    input?: RuntimeHostInputSource;
    locale?: string;
    timezone?: string;
    theme?: string;
    tableRowLimit?: number;
    schedule?: 'microtask' | 'sync';
}
export interface EndgeUIJsonMount {
    snapshot: () => EndgeUIJsonSnapshot;
    subscribe: (listener: (patch: EndgeUIPatch) => void) => () => void;
    dispatch: (nodeId: string, event: string, payload?: unknown) => Promise<EndgeUIDispatchResult>;
    refresh: () => EndgeUIPatch | null;
    unmount: () => void;
}
```

## src/features/core/modules/ui/domain/types/jsx.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/ui/domain/types/jsx.types.ts)

```ts
export declare const EndgeJsxAttr: {
    readonly TagRoot: "endge-tag-root";
    readonly Tag: "endge-tag";
    readonly TagIdentity: "endge-tag-identity";
    readonly ComponentIdentity: "endge-component-identity";
    readonly ComponentId: "data-endge-component-id";
};
```

## src/features/core/modules/ui/domain/types/tooltip-markdown.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/ui/domain/types/tooltip-markdown.types.ts)

```ts
export type EndgeTooltipMarkdownInline = {
    kind: 'text';
    value: string;
} | {
    kind: 'strong';
    children: EndgeTooltipMarkdownInline[];
} | {
    kind: 'emphasis';
    children: EndgeTooltipMarkdownInline[];
} | {
    kind: 'code';
    value: string;
} | {
    kind: 'link';
    href: string;
    children: EndgeTooltipMarkdownInline[];
};
export type EndgeTooltipMarkdownBlock = {
    kind: 'heading';
    level: 1 | 2 | 3;
    children: EndgeTooltipMarkdownInline[];
} | {
    kind: 'paragraph';
    children: EndgeTooltipMarkdownInline[];
} | {
    kind: 'list';
    ordered: boolean;
    items: EndgeTooltipMarkdownInline[][];
} | {
    kind: 'code-block';
    value: string;
};
```

## src/features/core/modules/ui/domain/types/ui-composition.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/ui/domain/types/ui-composition.types.ts)

```ts
import type { UIRenderAdapterDescriptor } from './ui-render-adapter.type';
export type UIPrimitiveKind = 'page' | 'flex' | 'grid' | 'box' | 'custom-component' | 'text' | 'button';
export interface UIAstNodeLayout {
    colStart: number;
    rowStart: number;
    span: number;
    rowSpan: number;
}
export interface UIAstNodeReference {
    definitionRef: string;
    configRef?: string | null;
    assetRef?: string | null;
}
export interface UIAstNodeBase<TKind extends UIPrimitiveKind = UIPrimitiveKind, TProps extends Record<string, unknown> = Record<string, unknown>> extends UIAstNodeReference {
    id: string;
    kind: TKind;
    name: string;
    children: string[];
    props: TProps;
    layout?: UIAstNodeLayout;
    meta?: Record<string, unknown>;
}
export interface UIAstDocument<TNode extends UIAstNodeBase = UIAstNodeBase> {
    id: string;
    version: number;
    rootId: string;
    nodes: Record<string, TNode>;
}
export type UIPresentationSurface = 'canvas' | 'admin' | 'runtime';
export interface UIPresentationRoleContract {
    role: string;
    description: string;
    supportedSurfaces: UIPresentationSurface[];
    defaultRendererRefs?: Partial<Record<UIPresentationSurface, string>>;
}
export interface UIPresentationContract {
    id: string;
    roles: UIPresentationRoleContract[];
}
export interface UIComponentDefinition<TProps extends Record<string, unknown> = Record<string, unknown>> {
    id: string;
    title: string;
    description: string;
    groupId: string;
    groupTitle: string;
    groupDescription: string;
    primitiveKind: UIPrimitiveKind;
    jsxTag: string;
    supportsChildren: boolean;
    paletteVisible: boolean;
    canvasAccentClass: string;
    keywords?: string[];
    configKind?: string | null;
    defaultNodeName: string;
    defaultProps: TProps;
    defaultLayout?: UIAstNodeLayout;
    defaultRendererRef?: string;
    allowsRendererRefOverride?: boolean;
    stubDescription?: string;
    presentationContract: UIPresentationContract;
}
export interface UIComponentDefinitionGroup {
    id: string;
    title: string;
    description: string;
}
export interface UIComponentConfigDefinition {
    kind: string;
    title: string;
    description: string;
    definitionRef: string;
}
export interface UIComponentConfigDocument<TData extends Record<string, unknown> = Record<string, unknown>> {
    id: string;
    kind: string;
    definitionRef: string;
    title: string;
    data: TData;
}
export interface UIComponentPresetDocument {
    id: string;
    title: string;
    description: string;
    definitionRef: string;
    configRef?: string | null;
    assetRef?: string | null;
    propsPatch?: Record<string, unknown>;
    layoutPatch?: Partial<UIAstNodeLayout>;
    keywords?: string[];
}
export interface UIComponentAssetDocument<TNode extends UIAstNodeBase = UIAstNodeBase> {
    id: string;
    title: string;
    definitionRef?: string | null;
    description?: string;
    ast: {
        rootId: string;
        nodes: Record<string, TNode>;
    };
    defaultConfigRef?: string | null;
}
export interface UIJsxElementNode {
    type: 'element';
    tag: string;
    attributes: Record<string, string | number | boolean | null>;
    children: UIJsxNode[];
}
export interface UIJsxTextNode {
    type: 'text';
    value: string;
}
export type UIJsxNode = UIJsxElementNode | UIJsxTextNode;
export interface UIJsxComponentDocument<TNode extends UIAstNodeBase = UIAstNodeBase> {
    id: string;
    title: string;
    description: string;
    definitionRef: string;
    jsxSource: string;
    keywords?: string[];
    ast: {
        rootId: string;
        nodes: Record<string, TNode>;
    };
}
export interface UIComponentRendererRegistration {
    ref: string;
    definitionRef: string;
    surface: UIPresentationSurface;
    role: string;
    component: any;
    label?: string;
    makeDefault?: boolean;
}
export interface UIResolvedComponentRenderer {
    ref: string;
    definitionRef: string;
    surface: UIPresentationSurface;
    role: string;
    component: any;
    label?: string;
}
export interface UIResolveRendererOptions {
    definitionRef: string;
    surface: UIPresentationSurface;
    role?: string;
    rendererRef?: string | null;
}
export interface UIRegistrySnapshot {
    definitions: string[];
    configDefinitions: string[];
    presets: string[];
    jsxComponents: string[];
    renderers: string[];
    adapters: UIRenderAdapterDescriptor[];
    activeAdapterId: string | null;
}
export interface UIRegistryNodeDraft {
    id: string;
    definitionRef: string;
    name?: string;
    propsPatch?: Record<string, unknown>;
    layoutPatch?: Partial<UIAstNodeLayout>;
    configRef?: string | null;
    assetRef?: string | null;
    meta?: Record<string, unknown>;
}
export declare function getUIJsxTagName(definition: Pick<UIComponentDefinition, 'jsxTag'>): string;
```

## src/features/core/modules/ui/domain/types/ui-render-adapter.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/ui/domain/types/ui-render-adapter.type.ts)

```ts
export declare const ENDGE_SFC_RENDER_ADAPTER_PROTOCOL = "endge-sfc";
export declare const ENDGE_SFC_RENDER_ADAPTER_PROTOCOL_VERSION = 1;
export declare const ENDGE_SFC_RENDER_ADAPTER_REQUIRED_KEYS: readonly [
    "Text",
    "DateTime",
    "Number",
    "Icon",
    "Badge",
    "Dot",
    "Box",
    "Flex",
    "Grid",
    "Divider",
    "Input",
    "Textarea",
    "Checkbox",
    "Select"
];
export type EndgeSFCRenderAdapterKey = typeof ENDGE_SFC_RENDER_ADAPTER_REQUIRED_KEYS[number];
export interface UIRenderAdapter<TImplementation = unknown> {
    id: string;
    protocol: string;
    protocolVersion: number;
    renderer: string;
    renderers: Readonly<Record<string, TImplementation>>;
    roots?: Readonly<Record<string, unknown>>;
}
export interface UIRenderAdapterRequirement {
    id: string;
    protocol?: string;
    protocolVersion?: number;
    renderer?: string;
    requiredRendererKeys?: readonly string[];
    requiredRootKeys?: readonly string[];
}
export type UIActiveRenderAdapterRequirement = Omit<UIRenderAdapterRequirement, 'id'>;
export interface UIRenderAdapterDescriptor {
    id: string;
    protocol: string;
    protocolVersion: number;
    renderer: string;
    rendererKeys: string[];
    rootKeys: string[];
}
```

## src/features/core/modules/ui/domain/types/ui.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/ui/domain/types/ui.types.ts)

```ts
export type TimeZoneMode = 'LT' | 'UTC';
export interface EndgeUISnapshot {
    zoom: number;
    zoomClass: string;
    theme: string;
    isDark: boolean;
    isLocalTime: boolean;
    timeZone: TimeZoneMode;
}
export declare const THEME_CLASS_BY_NAME: Record<string, string[]>;
export interface ThemeConfig {
    defaultTheme: string;
    availableThemes: string[];
    storageKey: string;
}
export declare const themeConfig: ThemeConfig;
export declare const ALL_THEME_CLASSES: string[];
```

## src/features/core/modules/ui/EndgeUI_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/ui/EndgeUI_Module.ts)

```ts
import type { EndgeUISnapshot, TimeZoneMode } from '@/features/core/modules/ui/domain/types/ui.types';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeUI_Module extends EndgeModule {
    constructor();
    start(): void;
    reset(): void;
    createDiagnosticsSnapshot(): EndgeUISnapshot;
    get snapshot(): EndgeUISnapshot;
    get zoom(): number;
    get zoomClass(): string;
    setZoom(value: number): void;
    resetZoom(): void;
    zoomUp(): void;
    zoomDown(): void;
    get theme(): string;
    get availableThemes(): string[];
    get isDark(): boolean;
    setTheme(next: string): void;
    get isLocalTime(): boolean;
    get timeZone(): TimeZoneMode;
    setLocalTime(value: boolean): void;
    switchTime(): void;
}
```

## src/features/core/modules/ui/EndgeUIRegistry_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/ui/EndgeUIRegistry_Module.ts)

```ts
import type { UIAstNodeBase, UIAstNodeLayout, UIComponentConfigDefinition, UIComponentDefinition, UIComponentDefinitionGroup, UIComponentPresetDocument, UIComponentRendererRegistration, UIJsxComponentDocument, UIPresentationRoleContract, UIPresentationSurface, UIPrimitiveKind, UIRegistryNodeDraft, UIRegistrySnapshot, UIResolvedComponentRenderer, UIResolveRendererOptions } from '@/features/core/modules/ui/domain/types/ui-composition.types';
import { UIAdapterRegistry } from '@/features/core/modules/ui/registry/UIAdapterRegistry';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeUIRegistry_Module extends EndgeModule {
    readonly adapters: UIAdapterRegistry;
    constructor();
    reset(): void;
    setup(): void;
    serialize(): UIRegistrySnapshot;
    registerDefinitions(definitions: UIComponentDefinition[]): void;
    registerConfigDefinitions(definitions: UIComponentConfigDefinition[]): void;
    registerPresetComponents(components: UIComponentPresetDocument[]): void;
    registerJsxComponents(components: UIJsxComponentDocument[]): void;
    listDefinitions(input?: {
        includeSystem?: boolean;
        paletteOnly?: boolean;
    }): UIComponentDefinition[];
    listDefinitionGroups(): UIComponentDefinitionGroup[];
    getDefinition(definitionRef: string | null | undefined): UIComponentDefinition | null;
    getDefinitionOrThrow(definitionRef: string): UIComponentDefinition;
    getConfigDefinition(kind: string | null | undefined): UIComponentConfigDefinition | null;
    listPresetComponents(): UIComponentPresetDocument[];
    listJsxComponents(): UIJsxComponentDocument[];
    getPresetComponent(componentId: string | null | undefined): UIComponentPresetDocument | null;
    getJsxComponent(componentId: string | null | undefined): UIJsxComponentDocument | null;
    resolveLegacyDefinitionRef(kind: UIPrimitiveKind, props?: Record<string, unknown> | null): string;
    getDefinitionDefaultLayout(definitionRef: string): UIAstNodeLayout | undefined;
    getDefinitionDefaultProps(definitionRef: string): Record<string, unknown>;
    createNodeFromDefinition(input: UIRegistryNodeDraft): UIAstNodeBase;
    createRootNode(input?: {
        id?: string;
        propsPatch?: Record<string, unknown>;
    }): UIAstNodeBase<'page'>;
    normalizeNodeDefinition<TNode extends UIAstNodeBase>(node: TNode): TNode;
    registerRenderer(input: UIComponentRendererRegistration): void;
    setDefaultRendererRef(definitionRef: string, surface: UIPresentationSurface, role: string, rendererRef: string): void;
    getRendererByRef(rendererRef: string | null | undefined): UIResolvedComponentRenderer | null;
    resolveRenderer(input: UIResolveRendererOptions): UIResolvedComponentRenderer | null;
}
export declare function getUIPresentationRoleContract(definition: UIComponentDefinition, role: string): UIPresentationRoleContract | null;
```

## src/features/core/modules/ui/tooltip/endge-tooltip-markdown.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/ui/tooltip/endge-tooltip-markdown.ts)

```ts
import type { EndgeTooltipMarkdownBlock } from '@/features/core/modules/ui/domain/types/tooltip-markdown.types';
export declare function parseEndgeTooltipMarkdown(source: unknown): EndgeTooltipMarkdownBlock[];
export declare function createEndgeTooltipDomId(seed: string): string;
```

## src/features/core/modules/ui/ui-composition.config.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/ui/ui-composition.config.ts)

```ts
import type { UIAstNodeBase } from '@/features/core/modules/ui/domain/types/ui-composition.types';
export declare const UI_COMPONENT_HOST_DEFINITION_ID = "ui.component-host";
export declare const ENDGE_UI_DEFAULT_DEFINITIONS: ({
    id: string;
    title: string;
    description: string;
    groupId: string;
    groupTitle: string;
    groupDescription: string;
    primitiveKind: "page";
    jsxTag: string;
    supportsChildren: true;
    paletteVisible: false;
    canvasAccentClass: string;
    keywords: string[];
    configKind: null;
    defaultNodeName: string;
    defaultProps: {
        title: string;
        gap: number;
        padding: number;
        rowHeight: number;
        text?: undefined;
        label?: undefined;
        direction?: undefined;
        columns?: undefined;
        minHeight?: undefined;
        rendererRef?: undefined;
    };
    presentationContract: {
        id: string;
        roles: {
            role: string;
            description: string;
            supportedSurfaces: ("runtime" | "canvas" | "admin")[];
        }[];
    };
    defaultLayout?: undefined;
    stubDescription?: undefined;
    defaultRendererRef?: undefined;
    allowsRendererRefOverride?: undefined;
} | {
    id: string;
    title: string;
    description: string;
    groupId: string;
    groupTitle: string;
    groupDescription: string;
    primitiveKind: "text";
    jsxTag: string;
    supportsChildren: false;
    paletteVisible: true;
    canvasAccentClass: string;
    keywords: string[];
    configKind: null;
    defaultNodeName: string;
    defaultProps: {
        text: string;
        title?: undefined;
        gap?: undefined;
        padding?: undefined;
        rowHeight?: undefined;
        label?: undefined;
        direction?: undefined;
        columns?: undefined;
        minHeight?: undefined;
        rendererRef?: undefined;
    };
    defaultLayout: {
        colStart: number;
        rowStart: number;
        span: number;
        rowSpan: number;
    };
    presentationContract: {
        id: string;
        roles: {
            role: string;
            description: string;
            supportedSurfaces: ("runtime" | "canvas" | "admin")[];
            defaultRendererRefs: {
                admin: string;
                runtime: string;
            };
        }[];
    };
    stubDescription?: undefined;
    defaultRendererRef?: undefined;
    allowsRendererRefOverride?: undefined;
} | {
    id: string;
    title: string;
    description: string;
    groupId: string;
    groupTitle: string;
    groupDescription: string;
    primitiveKind: "button";
    jsxTag: string;
    supportsChildren: false;
    paletteVisible: true;
    canvasAccentClass: string;
    keywords: string[];
    configKind: null;
    defaultNodeName: string;
    defaultProps: {
        label: string;
        title?: undefined;
        gap?: undefined;
        padding?: undefined;
        rowHeight?: undefined;
        text?: undefined;
        direction?: undefined;
        columns?: undefined;
        minHeight?: undefined;
        rendererRef?: undefined;
    };
    defaultLayout: {
        colStart: number;
        rowStart: number;
        span: number;
        rowSpan: number;
    };
    presentationContract: {
        id: string;
        roles: {
            role: string;
            description: string;
            supportedSurfaces: ("runtime" | "canvas" | "admin")[];
            defaultRendererRefs: {
                admin: string;
                runtime: string;
            };
        }[];
    };
    stubDescription?: undefined;
    defaultRendererRef?: undefined;
    allowsRendererRefOverride?: undefined;
} | {
    id: string;
    title: string;
    description: string;
    groupId: string;
    groupTitle: string;
    groupDescription: string;
    primitiveKind: "box";
    jsxTag: string;
    supportsChildren: true;
    paletteVisible: true;
    canvasAccentClass: string;
    keywords: string[];
    configKind: null;
    defaultNodeName: string;
    defaultProps: {
        title: string;
        padding: number;
        gap?: undefined;
        rowHeight?: undefined;
        text?: undefined;
        label?: undefined;
        direction?: undefined;
        columns?: undefined;
        minHeight?: undefined;
        rendererRef?: undefined;
    };
    defaultLayout: {
        colStart: number;
        rowStart: number;
        span: number;
        rowSpan: number;
    };
    presentationContract: {
        id: string;
        roles: {
            role: string;
            description: string;
            supportedSurfaces: ("runtime" | "canvas" | "admin")[];
            defaultRendererRefs: {
                admin: string;
                runtime: string;
            };
        }[];
    };
    stubDescription?: undefined;
    defaultRendererRef?: undefined;
    allowsRendererRefOverride?: undefined;
} | {
    id: string;
    title: string;
    description: string;
    groupId: string;
    groupTitle: string;
    groupDescription: string;
    primitiveKind: "flex";
    jsxTag: string;
    supportsChildren: true;
    paletteVisible: true;
    canvasAccentClass: string;
    keywords: string[];
    configKind: null;
    defaultNodeName: string;
    defaultProps: {
        direction: string;
        gap: number;
        padding: number;
        title?: undefined;
        rowHeight?: undefined;
        text?: undefined;
        label?: undefined;
        columns?: undefined;
        minHeight?: undefined;
        rendererRef?: undefined;
    };
    defaultLayout: {
        colStart: number;
        rowStart: number;
        span: number;
        rowSpan: number;
    };
    presentationContract: {
        id: string;
        roles: {
            role: string;
            description: string;
            supportedSurfaces: ("runtime" | "canvas" | "admin")[];
            defaultRendererRefs: {
                admin: string;
                runtime: string;
            };
        }[];
    };
    stubDescription?: undefined;
    defaultRendererRef?: undefined;
    allowsRendererRefOverride?: undefined;
} | {
    id: string;
    title: string;
    description: string;
    groupId: string;
    groupTitle: string;
    groupDescription: string;
    primitiveKind: "grid";
    jsxTag: string;
    supportsChildren: true;
    paletteVisible: true;
    canvasAccentClass: string;
    keywords: string[];
    configKind: null;
    defaultNodeName: string;
    defaultProps: {
        columns: number;
        gap: number;
        padding: number;
        minHeight: number;
        title?: undefined;
        rowHeight?: undefined;
        text?: undefined;
        label?: undefined;
        direction?: undefined;
        rendererRef?: undefined;
    };
    defaultLayout: {
        colStart: number;
        rowStart: number;
        span: number;
        rowSpan: number;
    };
    presentationContract: {
        id: string;
        roles: {
            role: string;
            description: string;
            supportedSurfaces: ("runtime" | "canvas" | "admin")[];
            defaultRendererRefs: {
                admin: string;
                runtime: string;
            };
        }[];
    };
    stubDescription?: undefined;
    defaultRendererRef?: undefined;
    allowsRendererRefOverride?: undefined;
} | {
    id: string;
    title: string;
    description: string;
    groupId: string;
    groupTitle: string;
    groupDescription: string;
    primitiveKind: "box";
    jsxTag: string;
    supportsChildren: true;
    paletteVisible: true;
    canvasAccentClass: string;
    keywords: string[];
    configKind: string;
    defaultNodeName: string;
    defaultProps: {
        title: string;
        padding: number;
        gap?: undefined;
        rowHeight?: undefined;
        text?: undefined;
        label?: undefined;
        direction?: undefined;
        columns?: undefined;
        minHeight?: undefined;
        rendererRef?: undefined;
    };
    defaultLayout: {
        colStart: number;
        rowStart: number;
        span: number;
        rowSpan: number;
    };
    stubDescription: string;
    presentationContract: {
        id: string;
        roles: ({
            role: string;
            description: string;
            supportedSurfaces: ("runtime" | "canvas" | "admin")[];
            defaultRendererRefs: {
                admin: string;
                runtime: string;
            };
        } | {
            role: string;
            description: string;
            supportedSurfaces: "admin"[];
            defaultRendererRefs: {
                admin: string;
                runtime?: undefined;
            };
        })[];
    };
    defaultRendererRef?: undefined;
    allowsRendererRefOverride?: undefined;
} | {
    id: string;
    title: string;
    description: string;
    groupId: string;
    groupTitle: string;
    groupDescription: string;
    primitiveKind: "custom-component";
    jsxTag: string;
    supportsChildren: false;
    paletteVisible: true;
    canvasAccentClass: string;
    keywords: string[];
    configKind: null;
    defaultNodeName: string;
    defaultProps: {
        title: string;
        rendererRef: string;
        gap?: undefined;
        padding?: undefined;
        rowHeight?: undefined;
        text?: undefined;
        label?: undefined;
        direction?: undefined;
        columns?: undefined;
        minHeight?: undefined;
    };
    defaultLayout: {
        colStart: number;
        rowStart: number;
        span: number;
        rowSpan: number;
    };
    stubDescription: string;
    presentationContract: {
        id: string;
        roles: {
            role: string;
            description: string;
            supportedSurfaces: ("runtime" | "canvas" | "admin")[];
            defaultRendererRefs: {
                admin: string;
                runtime: string;
            };
        }[];
    };
    defaultRendererRef?: undefined;
    allowsRendererRefOverride?: undefined;
} | {
    id: string;
    title: string;
    description: string;
    groupId: string;
    groupTitle: string;
    groupDescription: string;
    primitiveKind: "custom-component";
    jsxTag: string;
    supportsChildren: false;
    paletteVisible: true;
    canvasAccentClass: string;
    keywords: string[];
    configKind: string;
    defaultNodeName: string;
    defaultProps: {
        title: string;
        rendererRef: string;
        gap?: undefined;
        padding?: undefined;
        rowHeight?: undefined;
        text?: undefined;
        label?: undefined;
        direction?: undefined;
        columns?: undefined;
        minHeight?: undefined;
    };
    defaultLayout: {
        colStart: number;
        rowStart: number;
        span: number;
        rowSpan: number;
    };
    stubDescription: string;
    presentationContract: {
        id: string;
        roles: ({
            role: string;
            description: string;
            supportedSurfaces: ("runtime" | "canvas" | "admin")[];
            defaultRendererRefs: {
                admin: string;
                runtime: string;
            };
        } | {
            role: string;
            description: string;
            supportedSurfaces: "admin"[];
            defaultRendererRefs: {
                admin: string;
                runtime?: undefined;
            };
        })[];
    };
    defaultRendererRef?: undefined;
    allowsRendererRefOverride?: undefined;
} | {
    id: string;
    title: string;
    description: string;
    groupId: string;
    groupTitle: string;
    groupDescription: string;
    primitiveKind: "custom-component";
    jsxTag: string;
    supportsChildren: false;
    paletteVisible: false;
    canvasAccentClass: string;
    keywords: string[];
    configKind: null;
    defaultNodeName: string;
    defaultProps: {
        title: string;
        rendererRef: string;
        gap?: undefined;
        padding?: undefined;
        rowHeight?: undefined;
        text?: undefined;
        label?: undefined;
        direction?: undefined;
        columns?: undefined;
        minHeight?: undefined;
    };
    defaultLayout: {
        colStart: number;
        rowStart: number;
        span: number;
        rowSpan: number;
    };
    defaultRendererRef: string;
    allowsRendererRefOverride: true;
    stubDescription: string;
    presentationContract: {
        id: string;
        roles: {
            role: string;
            description: string;
            supportedSurfaces: ("runtime" | "canvas" | "admin")[];
            defaultRendererRefs: {
                admin: string;
                runtime: string;
            };
        }[];
    };
})[];
export declare const ENDGE_UI_DEFAULT_CONFIG_DEFINITIONS: {
    kind: string;
    title: string;
    description: string;
    definitionRef: string;
}[];
export declare const ENDGE_UI_DEFAULT_PRESET_COMPONENTS: {
    id: string;
    title: string;
    description: string;
    definitionRef: string;
    configRef: string;
    propsPatch: {
        title: string;
    };
    layoutPatch: {
        span: number;
        rowSpan: number;
    };
    keywords: string[];
}[];
export declare const ENDGE_UI_DEFAULT_JSX_COMPONENTS: {
    id: string;
    title: string;
    description: string;
    definitionRef: string;
    jsxSource: string;
    keywords: string[];
    ast: {
        rootId: string;
        nodes: Record<string, UIAstNodeBase<import("@/features/core/modules/ui/domain/types/ui-composition.types").UIPrimitiveKind, Record<string, unknown>>>;
    };
}[];
```
