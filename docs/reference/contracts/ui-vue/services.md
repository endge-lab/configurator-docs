---
description: "TypeScript-декларации @endge/ui-vue 2.4.1-dev.24, группа services; исходных модулей: 11."
---

# @endge/ui-vue: services

Версия source: 2.4.1-dev.24. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/ui-vue); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [3e2e86a56e6b69243302b632d6e35106293ab8b4](https://github.com/endge-lab/ui-vue/tree/3e2e86a56e6b69243302b632d6e35106293ab8b4).

## src/services/debug/vue-console.ts

Исходный модуль: [src/services/debug/vue-console.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/services/debug/vue-console.ts)

```ts
import type { App } from 'vue';
export declare function installEndgeVueWarnHandler(app: App): void;
```

## src/services/modules/vue-delivery.ts

Исходный модуль: [src/services/modules/vue-delivery.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/services/modules/vue-delivery.ts)

```ts
import type { EndgeBootContext } from '@endge/core';
import type { VueModuleHost } from './vue-module';
export declare function bootVueDelivery(input: unknown, facets: Readonly<Record<string, string>>, context: EndgeBootContext, host: () => Promise<VueModuleHost>): Promise<void>;
```

## src/services/modules/vue-module-catalog-loader.ts

Исходный модуль: [src/services/modules/vue-module-catalog-loader.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/services/modules/vue-module-catalog-loader.ts)

```ts
import type { ModuleArtifactLoader } from '@endge/core';
import type { VueModuleHost } from './vue-module';
interface VueModuleCatalogLoaderOptions {
    backendURL: string;
    host: () => Promise<VueModuleHost>;
    resolveAccessToken?: () => Promise<string | null>;
}
export declare function createVueModuleCatalogLoader(options: VueModuleCatalogLoaderOptions): ModuleArtifactLoader;
export {};
```

## src/services/modules/vue-module.ts

Исходный модуль: [src/services/modules/vue-module.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/services/modules/vue-module.ts)

```ts
import type { ModuleArtifact, ScopedModule, ScopedModuleContext } from '@endge/core';
import type { SFCVueRenderAdapterKey, SFCVueRenderFunction } from '@/services/render/sfc/sfc-vue-render.type';
import type { TimelinePresetDescriptor, TimelinePresetProvider } from '@/ui/timeline/timeline-presets';
export declare const MODULE_VISUAL_ATTRIBUTE = "data-endge-module-visual";
export declare const VUE_MODULE_RENDERERS = "endge.vue.renderers";
export declare const VUE_MODULE_TIMELINE_PRESETS = "endge.vue.timeline.presets";
export declare function registerScopedVueRenderer(context: ScopedModuleContext, tag: SFCVueRenderAdapterKey, renderer: SFCVueRenderFunction): () => void;
export declare function registerNamedScopedVueRenderer(context: ScopedModuleContext, primitive: SFCVueRenderAdapterKey, id: string, renderer: SFCVueRenderFunction): () => void;
export declare function registerScopedTimelinePreset(context: ScopedModuleContext, descriptor: TimelinePresetDescriptor, provider: TimelinePresetProvider): () => void;
export interface VueModuleHost {
    core: typeof import('@endge/core');
    vue: typeof import('vue');
    uiVue: typeof import('@/main');
    timeline: typeof import('@nova-lab/timeline');
}
export interface VueModuleExports {
    default: (host: VueModuleHost) => ScopedModule;
}
export declare function createVueModuleArtifact(module: VueModuleExports, host: VueModuleHost, css?: string): ModuleArtifact;
export declare function loadVueModuleTimeline(): Promise<VueModuleHost['timeline']>;
```

## src/services/render/register-vue-ui-renderer.ts

Исходный модуль: [src/services/render/register-vue-ui-renderer.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/services/render/register-vue-ui-renderer.ts)

```ts
import type { UIComponentRendererRegistration } from '@endge/core';
import type { Component } from 'vue';
export interface VueUIComponentRendererRegistration extends Omit<UIComponentRendererRegistration, 'component'> {
    component: Component;
}
export declare function registerVueUIRenderer(input: VueUIComponentRendererRegistration): void;
```

## src/services/render/sfc/native-vue-sfc-adapter.ts

Исходный модуль: [src/services/render/sfc/native-vue-sfc-adapter.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/services/render/sfc/native-vue-sfc-adapter.ts)

```ts
import type { SFCVueRenderAdapter } from '@/services/render/sfc/sfc-vue-render.type';
export declare const NATIVE_VUE_SFC_ADAPTER_ID = "vue-native";
export declare const NativeVueSFCAdapter: SFCVueRenderAdapter;
```

## src/services/render/sfc/sfc-vue-render.type.ts

Исходный модуль: [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/services/render/sfc/sfc-vue-render.type.ts)

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
export declare const SFC_VUE_RENDER_ADAPTER_OPTIONAL_KEYS: readonly [
    "TimelineChart",
    "TimelineGroup"
];
type SFCVueRequiredRenderAdapterKey = typeof SFC_VUE_RENDER_ADAPTER_REQUIRED_KEYS[number];
type SFCVueOptionalRenderAdapterKey = typeof SFC_VUE_RENDER_ADAPTER_OPTIONAL_KEYS[number];
export type SFCVueRenderAdapterKey = SFCVueRequiredRenderAdapterKey | SFCVueOptionalRenderAdapterKey;
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
    runtimeScopeId?: string;
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
export type SFCVueRenderAdapterRendererMap = Record<SFCVueRequiredRenderAdapterKey, SFCVueRenderFunction> & Partial<Record<SFCVueOptionalRenderAdapterKey, SFCVueRenderFunction>>;
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
export {};
```

## src/services/render/sfc/SFCVueExpressionPreview.ts

Исходный модуль: [src/services/render/sfc/SFCVueExpressionPreview.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/services/render/sfc/SFCVueExpressionPreview.ts)

```ts
import type { SFCVueRenderContext } from '@/services/render/sfc/sfc-vue-render.type';
export declare function evaluateSFCExpression(source: string, context: SFCVueRenderContext): unknown;
```

## src/services/render/sfc/SFCVueRuntimeBridge.ts

Исходный модуль: [src/services/render/sfc/SFCVueRuntimeBridge.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/services/render/sfc/SFCVueRuntimeBridge.ts)

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

Исходный модуль: [src/services/style/endge-dom-style.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/services/style/endge-dom-style.ts)

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

Исходный модуль: [src/services/style/EndgeDOMStyleRuntime.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/services/style/EndgeDOMStyleRuntime.ts)

```ts
import type { EndgeStylePlacement, EndgeStyleSheetArtifact, EndgeStyleTargetProfile } from '@endge/core';
export declare class EndgeDOMStyleRuntime {
    update(artifacts: readonly (EndgeStyleSheetArtifact | EndgeStylePlacement)[], target: EndgeStyleTargetProfile, hiddenScopeIds?: readonly string[]): void;
    reset(): void;
}
```
