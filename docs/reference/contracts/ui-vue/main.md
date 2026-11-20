---
description: "TypeScript-декларации @endge/ui-vue 2.4.1-dev.24, группа main; исходных модулей: 1."
---

# @endge/ui-vue: main

Версия source: 2.4.1-dev.24. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/ui-vue); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [3e2e86a56e6b69243302b632d6e35106293ab8b4](https://github.com/endge-lab/ui-vue/tree/3e2e86a56e6b69243302b632d6e35106293ab8b4).

## src/main.ts

Исходный модуль: [src/main.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/main.ts)

```ts
import '@/assets/styles.scss';
export * from '@/domain/types/filter-renderer.type';
export * from '@/modules/EndgeVue_Module';
export * from '@/reactive/use-current-facet';
export * from '@/reactive/use-current-locale';
export * from '@/reactive/use-current-theme';
export * from '@/reactive/use-current-timezone';
export * from '@/reactive/use-subscribable-ref';
export * from '@/reactive/use-ui';
export * from '@/services/debug/vue-console';
export * from '@/services/modules/vue-delivery';
export * from '@/services/modules/vue-module';
export * from '@/services/modules/vue-module-catalog-loader';
export * from '@/services/render/register-vue-ui-renderer';
export * from '@/services/render/sfc/native-vue-sfc-adapter';
export * from '@/services/render/sfc/sfc-vue-render.type';
export * from '@/services/render/sfc/SFCVueExpressionPreview';
export * from '@/services/render/sfc/SFCVueRuntimeBridge';
export * from '@/services/style';
export * from '@/store/domain';
export * from '@/ui/filter';
export { default as EndgeShell } from '@/ui/layout/EndgeShell.vue';
export * from '@/ui/overlay/context-menu-manager';
export { default as EndgeContextMenuRoot } from '@/ui/overlay/EndgeContextMenuRoot.vue';
export * from '@/ui/overlay/tooltip/endge-tooltip-manager';
export { default as EndgePage } from '@/ui/render/entities/EndgePage.vue';
export { default as SFC_Renderer } from '@/ui/render/sfc/SFC_Renderer.vue';
export { default as SFC_RuntimeRenderer } from '@/ui/render/sfc/SFC_RuntimeRenderer.vue';
export * from '@/ui/render/sfc/SFCRender_Badge';
export * from '@/ui/render/sfc/SFCRender_Base';
export * from '@/ui/render/sfc/SFCRender_BoundaryRegistry';
export * from '@/ui/render/sfc/SFCRender_Box';
export * from '@/ui/render/sfc/SFCRender_Checkbox';
export * from '@/ui/render/sfc/SFCRender_Component';
export * from '@/ui/render/sfc/SFCRender_Context';
export * from '@/ui/render/sfc/SFCRender_DateTime';
export * from '@/ui/render/sfc/SFCRender_Divider';
export * from '@/ui/render/sfc/SFCRender_Dot';
export * from '@/ui/render/sfc/SFCRender_Evaluator';
export * from '@/ui/render/sfc/SFCRender_Flex';
export * from '@/ui/render/sfc/SFCRender_Grid';
export * from '@/ui/render/sfc/SFCRender_Icon';
export * from '@/ui/render/sfc/SFCRender_Input';
export * from '@/ui/render/sfc/SFCRender_Node';
export * from '@/ui/render/sfc/SFCRender_Number';
export * from '@/ui/render/sfc/SFCRender_Select';
export * from '@/ui/render/sfc/SFCRender_Table';
export * from '@/ui/render/sfc/SFCRender_TableAlignment';
export { resolveSFCTableMenu } from '@/ui/render/sfc/SFCRender_TableMenu';
export * from '@/ui/render/sfc/SFCRender_TableStyle';
export * from '@/ui/render/sfc/SFCRender_Text';
export * from '@/ui/render/sfc/SFCRender_Textarea';
export * from '@/ui/render/sfc/SFCRender_Tooltip';
export * from '@/ui/table/tanstack-table.types';
export { default as TanStackSfcDataTable } from '@/ui/table/TanStackSfcDataTable.vue';
export { default as TanStackTableRuntimeRenderer } from '@/ui/table/TanStackTableRuntimeRenderer.vue';
export { listTimelinePresets, registerTimelinePreset } from '@/ui/timeline/timeline-presets';
export type { TimelinePresetContext, TimelinePresetDescriptor, TimelinePresetField, TimelinePresetProvider } from '@/ui/timeline/timeline-presets';
```
