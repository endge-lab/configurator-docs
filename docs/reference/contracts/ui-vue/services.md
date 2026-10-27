---
description: "TypeScript-декларации @endge/ui-vue 1.0.0-dev.10, группа services; исходных модулей: 8."
---

# @endge/ui-vue: services

Версия source: 1.0.0-dev.10. [Каталог package](./). [Repository](https://github.com/endge-lab/ui-vue).

## src/services/debug/vue-console.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/services/debug/vue-console.ts)

```ts
import type { App } from 'vue';
export declare function installEndgeVueWarnHandler(app: App): void;
```

## src/services/render/register-vue-ui-renderer.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/register-vue-ui-renderer.ts)

```ts
import type { UIComponentRendererRegistration } from '@endge/core';
import type { Component } from 'vue';
export interface VueUIComponentRendererRegistration extends Omit<UIComponentRendererRegistration, 'component'> {
    component: Component;
}
export declare function registerVueUIRenderer(input: VueUIComponentRendererRegistration): void;
```

## src/services/render/sfc/native-vue-sfc-adapter.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/native-vue-sfc-adapter.ts)

```ts
import type { SFCVueRenderAdapter } from '@/services/render/sfc/sfc-vue-render.type';
export declare const NATIVE_VUE_SFC_ADAPTER_ID = "vue-native";
export declare const NativeVueSFCAdapter: SFCVueRenderAdapter;
```

## src/services/render/sfc/sfc-vue-render.type.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts)

```ts
import type { ComponentSFCEventBoundary, ComponentSFCRenderPort, ComponentSFCRequiredPortBinding, EndgeRuntimeContextSnapshot, EndgeStyleMatchNode, EndgeStyleSheetArtifact, ProgramMetadata, RComponentSFC_IR, RComponentSFC_IR_ElementNode, RComponentSFC_IR_Node, RComponentSFC_IR_Tag, RComponentSFC_IR_Value, RuntimeBoundaryPatch, RuntimeHostInputSource, RuntimeHostLocalInputSource, RuntimeHostRaphInputBinding, RuntimeHostRaphInputSource, SFCRenderInspectionSessionLike, UIRenderAdapter } from '@endge/core';
import type { VNode, h as VueH } from 'vue';
import type { EndgeVueTooltipManager } from '@/ui/overlay/tooltip/endge-tooltip-manager';
export declare const SFC_VUE_RENDER_ADAPTER_REQUIRED_KEYS: readonly [
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
    "Table"
];
export type SFCVueRenderAdapterKey = typeof SFC_VUE_RENDER_ADAPTER_REQUIRED_KEYS[number];
export type SFCVueRenderPrimitive = RComponentSFC_IR_Tag;
export type SFCVueRenderBinding = {
    kind: 'literal';
    value: unknown;
} | {
    kind: 'prop';
    path: string;
};
export interface SFCVueRenderContext {
    props: Record<string, unknown>;
    context: Readonly<EndgeRuntimeContextSnapshot>;
    locals: Record<string, unknown>;
    iteration: SFCVueRenderIteration | null;
    dataScope: {
        kind: 'table-row';
        boundaryId: string;
        rowKey: unknown;
    } | null;
    renderVersion: number;
    host: ComponentSFCRenderPort | null;
    runtimeState: SFCVueRuntimeStateController | null;
    componentStack: readonly string[];
    consumerScope: string;
    portBindings?: readonly ComponentSFCRequiredPortBinding[];
    variant: string;
    styleArtifacts: readonly EndgeStyleSheetArtifact[];
    styleParent: EndgeStyleMatchNode | undefined;
    styleOwnerScopeId: string | undefined;
    runtimeScopeIds: readonly string[];
    eventBoundary?: ComponentSFCEventBoundary | null;
    inspection?: SFCRenderInspectionSessionLike | null;
    inspectionParentId?: string | null;
    metadata: ProgramMetadata | null;
    tooltipManager?: EndgeVueTooltipManager | null;
}
export interface SFCVueRuntimeStateController {
    readonly runtimeId: string;
    readonly storageKey: string;
    get: <T>(entityKey: string, section: string, fallback: T) => T;
    set: <T>(entityKey: string, section: string, value: T) => void;
    remove: (entityKey: string, section?: string) => void;
    clear: () => void;
}
export interface SFCVueRenderIteration {
    item: string;
    index?: string;
    value: unknown;
    indexValue: number;
    key: unknown;
}
export interface SFCVueRenderAdapterProps {
    ir: RComponentSFC_IR | null;
    props?: Record<string, unknown>;
    renderVersion?: number;
    host?: ComponentSFCRenderPort | null;
    inspection?: SFCRenderInspectionSessionLike | null;
}
export type SFCVueLocalInputSource = RuntimeHostLocalInputSource;
export type SFCVueRaphInputBinding = RuntimeHostRaphInputBinding;
export type SFCVueRaphInputSource = RuntimeHostRaphInputSource;
export type SFCVueRuntimeInputSource = RuntimeHostInputSource;
export interface SFCVueRuntimeRendererProps {
    host: ComponentSFCRenderPort | null;
    input: SFCVueRuntimeInputSource;
    inspection?: SFCRenderInspectionSessionLike | null;
}
export type SFCVueRuntimeBridgeUpdate = (props: Record<string, unknown>) => void;
export type SFCVueRuntimeBridgeBoundaryPatch = (patch: RuntimeBoundaryPatch) => void | boolean | Promise<void | boolean>;
export type SFCVueRenderH = typeof VueH;
export type SFCVueRenderResult = VNode | string | null;
export type SFCVueRenderListResult = Array<VNode | string>;
export interface SFCVueRenderElementInput {
    h: SFCVueRenderH;
    node: RComponentSFC_IR_ElementNode;
    context: SFCVueRenderContext;
    children: SFCVueRenderListResult;
    renderChildren: (context: SFCVueRenderContext) => SFCVueRenderListResult;
    renderNodes: (nodes: RComponentSFC_IR_Node[], context: SFCVueRenderContext) => SFCVueRenderListResult;
    props: Record<string, unknown>;
    attrs: Record<string, unknown>;
}
export type SFCVueRenderAdapterElementInput = Pick<SFCVueRenderElementInput, 'h' | 'children' | 'props' | 'attrs'>;
export type SFCVueRenderAdapterFunction = (input: SFCVueRenderAdapterElementInput) => SFCVueRenderResult;
export type SFCVueRenderFunction = (input: SFCVueRenderElementInput) => SFCVueRenderResult;
export type SFCVueRenderAdapterRendererMap = Record<SFCVueRenderAdapterKey, SFCVueRenderFunction>;
export interface SFCVueRenderAdapter extends UIRenderAdapter<SFCVueRenderFunction> {
    protocol: 'endge-sfc';
    protocolVersion: 1;
    renderer: 'vue';
    renderers: SFCVueRenderAdapterRendererMap;
    roots: {
        'shell': unknown;
        'sfc': unknown;
        'sfc-runtime': unknown;
        'filter-view': unknown;
    };
}
export interface SFCVueRenderNodeInput {
    h: SFCVueRenderH;
    node: RComponentSFC_IR_Node;
    context: SFCVueRenderContext;
}
export interface SFCVueRenderConditionState {
    shouldRender: boolean;
    startsChain: boolean;
    matchedChain: boolean;
    closesChain: boolean;
}
export type SFCVueRenderStyleValue = string | number | null | undefined;
export type SFCVueRenderValueEvaluator = (value: RComponentSFC_IR_Value | undefined, context: SFCVueRenderContext) => unknown;
```

## src/services/render/sfc/SFCVueExpressionPreview.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/SFCVueExpressionPreview.ts)

```ts
import type { SFCVueRenderContext } from '@/services/render/sfc/sfc-vue-render.type';
export declare function evaluateSFCExpression(source: string, context: SFCVueRenderContext): unknown;
```

## src/services/render/sfc/SFCVueRuntimeBridge.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/SFCVueRuntimeBridge.ts)

```ts
import type { ComponentSFCRenderPort } from '@endge/core';
import type { SFCVueRuntimeBridgeBoundaryPatch, SFCVueRuntimeBridgeUpdate, SFCVueRuntimeInputSource } from '@/services/render/sfc/sfc-vue-render.type';
export declare class SFCVueRuntimeBridge {
    constructor(input: {
        host: ComponentSFCRenderPort;
        input: SFCVueRuntimeInputSource;
        onUpdate: SFCVueRuntimeBridgeUpdate;
        onBoundaryPatch?: SFCVueRuntimeBridgeBoundaryPatch | null;
    });
    mount(): void;
    updateInput(input: SFCVueRuntimeInputSource): void;
    destroy(): void;
    refresh(): void;
    get host(): ComponentSFCRenderPort;
}
```

## src/services/style/endge-dom-style.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/services/style/endge-dom-style.ts)

```ts
import type { EndgeStyleDiagnostic, EndgeStylePlacement, EndgeStyleSheetArtifact, EndgeStyleTargetProfile } from '@endge/core';
export interface EndgeDOMStyleClassEntry {
    artifactIdentity: string;
    ruleId: string;
    selectorIndex: number;
    className: string;
}
export interface EndgeDOMStyleMaterialization {
    css: string;
    classes: EndgeDOMStyleClassEntry[];
    diagnostics: EndgeStyleDiagnostic[];
}
export type EndgeDOMStyleInput = EndgeStyleSheetArtifact | EndgeStylePlacement;
export declare function materializeEndgeCSSForDOM(inputs: readonly EndgeDOMStyleInput[], target?: EndgeStyleTargetProfile): EndgeDOMStyleMaterialization;
```

## src/services/style/EndgeDOMStyleRuntime.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/services/style/EndgeDOMStyleRuntime.ts)

```ts
import type { EndgeStylePlacement, EndgeStyleSheetArtifact, EndgeStyleTargetProfile } from '@endge/core';
export declare class EndgeDOMStyleRuntime {
    update(artifacts: readonly (EndgeStyleSheetArtifact | EndgeStylePlacement)[], target: EndgeStyleTargetProfile, hiddenScopeIds?: readonly string[]): void;
    reset(): void;
}
```
