---
description: "Публичные TypeScript-контракты @endge/ui-vue 1.0.0-dev.10: точки входа, группы деклараций и полный список exports."
---

# @endge/ui-vue: публичные контракты

Source version: **1.0.0-dev.10**. [Repository](https://github.com/endge-lab/ui-vue). [Общий каталог](/reference/contracts/).

Точные сигнатуры, overloads, generic-параметры, события и shapes собраны из исходников TypeScript. Вызовы из примеров документации сверяйте с этим snapshot. Извлечение declarations не заменяет typecheck или runtime verification.

## Точки входа

| Import | Source |
| --- | --- |
| `@endge/ui-vue` | [src/main.ts](https://github.com/endge-lab/ui-vue/blob/main/src/main.ts) |

## Контракты по владельцам

- [domain](./domain) — 1 исходных модулей.
- [main](./main) — 1 исходных модулей.
- [modules](./modules) — 1 исходных модулей.
- [reactive](./reactive) — 6 исходных модулей.
- [services](./services) — 8 исходных модулей.
- [store](./store) — 1 исходных модулей.
- [ui](./ui) — 29 исходных модулей.

## Все публичные exports

| Import | Export | Объявление |
| --- | --- | --- |
| `@endge/ui-vue` | `applyRowSnapshots` | [src/ui/render/sfc/SFCRender_Table.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Table.ts) |
| `@endge/ui-vue` | `attachEndgeTooltipTriggerAttrs` | [src/ui/overlay/tooltip/endge-tooltip-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/tooltip/endge-tooltip-manager.ts) |
| `@endge/ui-vue` | `attachSFCShorthandTooltip` | [src/ui/render/sfc/SFCRender_Base.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Base.ts) |
| `@endge/ui-vue` | `closeEndgeContextMenu` | [src/ui/overlay/context-menu-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/context-menu-manager.ts) |
| `@endge/ui-vue` | `createInitialTableVisibility` | [src/ui/render/sfc/SFCRender_Table.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Table.ts) |
| `@endge/ui-vue` | `createSFCBaseAttrs` | [src/ui/render/sfc/SFCRender_Base.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Base.ts) |
| `@endge/ui-vue` | `createSFCNodeEventAttrs` | [src/ui/render/sfc/SFCRender_Base.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Base.ts) |
| `@endge/ui-vue` | `createSFCTableColumnMarkers` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `createSFCTableColumnStyleSurfaces` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `createSFCTableMarkers` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `createSFCTableStyleContract` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `createSFCVueBoundaryRegistry` | [src/ui/render/sfc/SFCRender_BoundaryRegistry.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_BoundaryRegistry.ts) |
| `@endge/ui-vue` | `createSFCVueRenderContext` | [src/ui/render/sfc/SFCRender_Context.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Context.ts) |
| `@endge/ui-vue` | `decorateSFCTableRowWindow` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `DomainView` | [src/store/domain.ts](https://github.com/endge-lab/ui-vue/blob/main/src/store/domain.ts) |
| `@endge/ui-vue` | `EndgeContextMenuOpenInput` | [src/ui/overlay/context-menu-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/context-menu-manager.ts) |
| `@endge/ui-vue` | `EndgeContextMenuRoot` | [src/main.ts](https://github.com/endge-lab/ui-vue/blob/main/src/main.ts) |
| `@endge/ui-vue` | `endgeContextMenuState` | [src/ui/overlay/context-menu-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/context-menu-manager.ts) |
| `@endge/ui-vue` | `EndgeContextMenuState` | [src/ui/overlay/context-menu-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/context-menu-manager.ts) |
| `@endge/ui-vue` | `EndgeDOMStyleClassEntry` | [src/services/style/endge-dom-style.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/style/endge-dom-style.ts) |
| `@endge/ui-vue` | `EndgeDOMStyleInput` | [src/services/style/endge-dom-style.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/style/endge-dom-style.ts) |
| `@endge/ui-vue` | `EndgeDOMStyleMaterialization` | [src/services/style/endge-dom-style.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/style/endge-dom-style.ts) |
| `@endge/ui-vue` | `EndgeDOMStyleRuntime` | [src/services/style/EndgeDOMStyleRuntime.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/style/EndgeDOMStyleRuntime.ts) |
| `@endge/ui-vue` | `EndgeFilterField` | [src/ui/filter/index.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/filter/index.ts) |
| `@endge/ui-vue` | `EndgeFilterRenderer` | [src/ui/filter/index.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/filter/index.ts) |
| `@endge/ui-vue` | `EndgeFilterRendererProps` | [src/domain/types/filter-renderer.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/domain/types/filter-renderer.type.ts) |
| `@endge/ui-vue` | `EndgePage` | [src/main.ts](https://github.com/endge-lab/ui-vue/blob/main/src/main.ts) |
| `@endge/ui-vue` | `EndgeShell` | [src/main.ts](https://github.com/endge-lab/ui-vue/blob/main/src/main.ts) |
| `@endge/ui-vue` | `EndgeTanStackTableColumn` | [src/ui/table/tanstack-table.types.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/table/tanstack-table.types.ts) |
| `@endge/ui-vue` | `EndgeTanStackTableColumnSort` | [src/ui/table/tanstack-table.types.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/table/tanstack-table.types.ts) |
| `@endge/ui-vue` | `EndgeTanStackTablePaging` | [src/ui/table/tanstack-table.types.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/table/tanstack-table.types.ts) |
| `@endge/ui-vue` | `EndgeTanStackTableProps` | [src/ui/table/tanstack-table.types.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/table/tanstack-table.types.ts) |
| `@endge/ui-vue` | `EndgeTooltipActivationReason` | [src/ui/overlay/tooltip/endge-tooltip-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/tooltip/endge-tooltip-manager.ts) |
| `@endge/ui-vue` | `EndgeTooltipContentKind` | [src/ui/overlay/tooltip/endge-tooltip-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/tooltip/endge-tooltip-manager.ts) |
| `@endge/ui-vue` | `EndgeVue_Module` | [src/modules/EndgeVue_Module.ts](https://github.com/endge-lab/ui-vue/blob/main/src/modules/EndgeVue_Module.ts) |
| `@endge/ui-vue` | `EndgeVuePlugin` | [src/modules/EndgeVue_Module.ts](https://github.com/endge-lab/ui-vue/blob/main/src/modules/EndgeVue_Module.ts) |
| `@endge/ui-vue` | `EndgeVueTooltipManager` | [src/ui/overlay/tooltip/endge-tooltip-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/tooltip/endge-tooltip-manager.ts) |
| `@endge/ui-vue` | `EndgeVueTooltipManagerKey` | [src/ui/overlay/tooltip/endge-tooltip-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/tooltip/endge-tooltip-manager.ts) |
| `@endge/ui-vue` | `EndgeVueTooltipPolicy` | [src/ui/overlay/tooltip/endge-tooltip-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/tooltip/endge-tooltip-manager.ts) |
| `@endge/ui-vue` | `EndgeVueTooltipRequest` | [src/ui/overlay/tooltip/endge-tooltip-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/tooltip/endge-tooltip-manager.ts) |
| `@endge/ui-vue` | `EndgeVueTooltipState` | [src/ui/overlay/tooltip/endge-tooltip-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/tooltip/endge-tooltip-manager.ts) |
| `@endge/ui-vue` | `evaluateSFCBinding` | [src/ui/render/sfc/SFCRender_Evaluator.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Evaluator.ts) |
| `@endge/ui-vue` | `evaluateSFCExpression` | [src/services/render/sfc/SFCVueExpressionPreview.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/SFCVueExpressionPreview.ts) |
| `@endge/ui-vue` | `evaluateSFCProps` | [src/ui/render/sfc/SFCRender_Evaluator.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Evaluator.ts) |
| `@endge/ui-vue` | `evaluateSFCValue` | [src/ui/render/sfc/SFCRender_Evaluator.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Evaluator.ts) |
| `@endge/ui-vue` | `executeEndgeContextMenuItem` | [src/ui/overlay/context-menu-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/context-menu-manager.ts) |
| `@endge/ui-vue` | `extendSFCVueRenderContext` | [src/ui/render/sfc/SFCRender_Context.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Context.ts) |
| `@endge/ui-vue` | `extendSFCVueStyleContext` | [src/ui/render/sfc/SFCRender_Context.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Context.ts) |
| `@endge/ui-vue` | `filterVisibleTableColumns` | [src/ui/render/sfc/SFCRender_Table.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Table.ts) |
| `@endge/ui-vue` | `formatSFCDateTime` | [src/ui/render/sfc/SFCRender_DateTime.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_DateTime.ts) |
| `@endge/ui-vue` | `getContextMenuItems` | [src/ui/overlay/context-menu-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/context-menu-manager.ts) |
| `@endge/ui-vue` | `getExecutableContextMenuItems` | [src/ui/overlay/context-menu-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/context-menu-manager.ts) |
| `@endge/ui-vue` | `getSFCTableCellStyleSurfaces` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `getSFCTableRowAttrs` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `installEndgeVueWarnHandler` | [src/services/debug/vue-console.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/debug/vue-console.ts) |
| `@endge/ui-vue` | `isTruthySFCValue` | [src/ui/render/sfc/SFCRender_Evaluator.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Evaluator.ts) |
| `@endge/ui-vue` | `materializeEndgeCSSForDOM` | [src/services/style/endge-dom-style.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/style/endge-dom-style.ts) |
| `@endge/ui-vue` | `NATIVE_VUE_SFC_ADAPTER_ID` | [src/services/render/sfc/native-vue-sfc-adapter.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/native-vue-sfc-adapter.ts) |
| `@endge/ui-vue` | `NativeVueSFCAdapter` | [src/services/render/sfc/native-vue-sfc-adapter.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/native-vue-sfc-adapter.ts) |
| `@endge/ui-vue` | `normalizeSFCTableCellAlignment` | [src/ui/render/sfc/SFCRender_TableAlignment.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableAlignment.ts) |
| `@endge/ui-vue` | `normalizeSFCTableRows` | [src/ui/render/sfc/SFCRender_Table.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Table.ts) |
| `@endge/ui-vue` | `openEndgeContextMenu` | [src/ui/overlay/context-menu-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/context-menu-manager.ts) |
| `@endge/ui-vue` | `readSFCObjectPath` | [src/ui/render/sfc/SFCRender_Evaluator.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Evaluator.ts) |
| `@endge/ui-vue` | `readSFCPath` | [src/ui/render/sfc/SFCRender_Evaluator.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Evaluator.ts) |
| `@endge/ui-vue` | `registerVueUIRenderer` | [src/services/render/register-vue-ui-renderer.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/register-vue-ui-renderer.ts) |
| `@endge/ui-vue` | `renderSFCNode` | [src/ui/render/sfc/SFCRender_Node.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Node.ts) |
| `@endge/ui-vue` | `renderSFCNodes` | [src/ui/render/sfc/SFCRender_Node.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Node.ts) |
| `@endge/ui-vue` | `resolveEndgeContextMenuItemLabel` | [src/ui/overlay/context-menu-manager.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/overlay/context-menu-manager.ts) |
| `@endge/ui-vue` | `resolveSFCConditionState` | [src/ui/render/sfc/SFCRender_Base.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Base.ts) |
| `@endge/ui-vue` | `resolveSFCTableMenu` | [src/ui/render/sfc/SFCRender_TableMenu.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableMenu.ts) |
| `@endge/ui-vue` | `SFC_Renderer` | [src/main.ts](https://github.com/endge-lab/ui-vue/blob/main/src/main.ts) |
| `@endge/ui-vue` | `SFC_RuntimeRenderer` | [src/main.ts](https://github.com/endge-lab/ui-vue/blob/main/src/main.ts) |
| `@endge/ui-vue` | `SFC_TABLE_ROW_CLASS_FIELD` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `SFC_VUE_RENDER_ADAPTER_REQUIRED_KEYS` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCRender_Badge` | [src/ui/render/sfc/SFCRender_Badge.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Badge.ts) |
| `@endge/ui-vue` | `SFCRender_Base` | [src/ui/render/sfc/SFCRender_Base.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Base.ts) |
| `@endge/ui-vue` | `SFCRender_Box` | [src/ui/render/sfc/SFCRender_Box.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Box.ts) |
| `@endge/ui-vue` | `SFCRender_Checkbox` | [src/ui/render/sfc/SFCRender_Checkbox.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Checkbox.ts) |
| `@endge/ui-vue` | `SFCRender_Component` | [src/ui/render/sfc/SFCRender_Component.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Component.ts) |
| `@endge/ui-vue` | `SFCRender_DateTime` | [src/ui/render/sfc/SFCRender_DateTime.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_DateTime.ts) |
| `@endge/ui-vue` | `SFCRender_Divider` | [src/ui/render/sfc/SFCRender_Divider.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Divider.ts) |
| `@endge/ui-vue` | `SFCRender_Dot` | [src/ui/render/sfc/SFCRender_Dot.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Dot.ts) |
| `@endge/ui-vue` | `SFCRender_Flex` | [src/ui/render/sfc/SFCRender_Flex.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Flex.ts) |
| `@endge/ui-vue` | `SFCRender_Grid` | [src/ui/render/sfc/SFCRender_Grid.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Grid.ts) |
| `@endge/ui-vue` | `SFCRender_Icon` | [src/ui/render/sfc/SFCRender_Icon.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Icon.ts) |
| `@endge/ui-vue` | `SFCRender_Input` | [src/ui/render/sfc/SFCRender_Input.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Input.ts) |
| `@endge/ui-vue` | `SFCRender_Number` | [src/ui/render/sfc/SFCRender_Number.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Number.ts) |
| `@endge/ui-vue` | `SFCRender_Select` | [src/ui/render/sfc/SFCRender_Select.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Select.ts) |
| `@endge/ui-vue` | `SFCRender_Table` | [src/ui/render/sfc/SFCRender_Table.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Table.ts) |
| `@endge/ui-vue` | `SFCRender_Text` | [src/ui/render/sfc/SFCRender_Text.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Text.ts) |
| `@endge/ui-vue` | `SFCRender_Textarea` | [src/ui/render/sfc/SFCRender_Textarea.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Textarea.ts) |
| `@endge/ui-vue` | `SFCRender_Tooltip` | [src/ui/render/sfc/SFCRender_Tooltip.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_Tooltip.ts) |
| `@endge/ui-vue` | `SFCTableCellAlign` | [src/ui/render/sfc/SFCRender_TableAlignment.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableAlignment.ts) |
| `@endge/ui-vue` | `SFCTableCellAlignment` | [src/ui/render/sfc/SFCRender_TableAlignment.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableAlignment.ts) |
| `@endge/ui-vue` | `SFCTableCellStyleSurfaces` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `SFCTableCellVerticalAlign` | [src/ui/render/sfc/SFCRender_TableAlignment.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableAlignment.ts) |
| `@endge/ui-vue` | `SFCTableColumnMarkers` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `SFCTableColumnStyleSurfaces` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `SFCTableMarkerAttrs` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `SFCTableMarkers` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `SFCTablePublicPart` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `SFCTablePublicSurface` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `SFCTableStyleContract` | [src/ui/render/sfc/SFCRender_TableStyle.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_TableStyle.ts) |
| `@endge/ui-vue` | `SFCVueBoundaryController` | [src/ui/render/sfc/SFCRender_BoundaryRegistry.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_BoundaryRegistry.ts) |
| `@endge/ui-vue` | `SFCVueBoundaryRegistry` | [src/ui/render/sfc/SFCRender_BoundaryRegistry.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_BoundaryRegistry.ts) |
| `@endge/ui-vue` | `SFCVueBoundaryRegistryKey` | [src/ui/render/sfc/SFCRender_BoundaryRegistry.ts](https://github.com/endge-lab/ui-vue/blob/main/src/ui/render/sfc/SFCRender_BoundaryRegistry.ts) |
| `@endge/ui-vue` | `SFCVueLocalInputSource` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRaphInputBinding` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRaphInputSource` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderAdapter` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderAdapterElementInput` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderAdapterFunction` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderAdapterKey` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderAdapterProps` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderAdapterRendererMap` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderBinding` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderConditionState` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderContext` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderElementInput` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderFunction` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderH` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderIteration` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderListResult` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderNodeInput` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderPrimitive` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderResult` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderStyleValue` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRenderValueEvaluator` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRuntimeBridge` | [src/services/render/sfc/SFCVueRuntimeBridge.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/SFCVueRuntimeBridge.ts) |
| `@endge/ui-vue` | `SFCVueRuntimeBridgeBoundaryPatch` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRuntimeBridgeUpdate` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRuntimeInputSource` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRuntimeRendererProps` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `SFCVueRuntimeStateController` | [src/services/render/sfc/sfc-vue-render.type.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/sfc/sfc-vue-render.type.ts) |
| `@endge/ui-vue` | `TanStackSfcDataTable` | [src/main.ts](https://github.com/endge-lab/ui-vue/blob/main/src/main.ts) |
| `@endge/ui-vue` | `TanStackTableRuntimeRenderer` | [src/main.ts](https://github.com/endge-lab/ui-vue/blob/main/src/main.ts) |
| `@endge/ui-vue` | `useCurrentFacet` | [src/reactive/use-current-facet.ts](https://github.com/endge-lab/ui-vue/blob/main/src/reactive/use-current-facet.ts) |
| `@endge/ui-vue` | `useCurrentLocale` | [src/reactive/use-current-locale.ts](https://github.com/endge-lab/ui-vue/blob/main/src/reactive/use-current-locale.ts) |
| `@endge/ui-vue` | `useCurrentTheme` | [src/reactive/use-current-theme.ts](https://github.com/endge-lab/ui-vue/blob/main/src/reactive/use-current-theme.ts) |
| `@endge/ui-vue` | `useCurrentTimezone` | [src/reactive/use-current-timezone.ts](https://github.com/endge-lab/ui-vue/blob/main/src/reactive/use-current-timezone.ts) |
| `@endge/ui-vue` | `useDomainStore` | [src/store/domain.ts](https://github.com/endge-lab/ui-vue/blob/main/src/store/domain.ts) |
| `@endge/ui-vue` | `useSubscribableRef` | [src/reactive/use-subscribable-ref.ts](https://github.com/endge-lab/ui-vue/blob/main/src/reactive/use-subscribable-ref.ts) |
| `@endge/ui-vue` | `useSubscribableRefAuto` | [src/reactive/use-subscribable-ref.ts](https://github.com/endge-lab/ui-vue/blob/main/src/reactive/use-subscribable-ref.ts) |
| `@endge/ui-vue` | `useUI` | [src/reactive/use-ui.ts](https://github.com/endge-lab/ui-vue/blob/main/src/reactive/use-ui.ts) |
| `@endge/ui-vue` | `VueUIComponentRendererRegistration` | [src/services/render/register-vue-ui-renderer.ts](https://github.com/endge-lab/ui-vue/blob/main/src/services/render/register-vue-ui-renderer.ts) |
