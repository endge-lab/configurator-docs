# Types: Timeline events

События доступны через `TimelineEvents` и Nova bus. Payload зависит от события: pointer events несут DOM event, area, task/group/column; drag events несут runtime task и shadow; range/scroll events несут состояние viewport.

## Annotations

Points:

- `PointClick`, `PointDoubleClick`, `PointContextMenu`
- `PointMouseEnter`, `PointMouseLeave`
- `BeforePointDragStart`, `PointDragStart`, `PointDragMove`, `BeforePointDragEnd`, `PointDragEnd`, `PointDragCancel`

Links:

- `LinkClick`, `LinkDoubleClick`, `LinkContextMenu`
- `LinkMouseEnter`, `LinkMouseLeave`
- `BeforeLinkReconnectStart`, `LinkReconnectStart`, `LinkReconnectMove`, `BeforeLinkReconnectEnd`, `LinkReconnectEnd`, `LinkReconnectCancel`
- `BeforeLinkRouteEditStart`, `LinkRouteEditStart`, `LinkRoutePointAdd`, `LinkRoutePointMove`, `LinkRoutePointRemove`, `BeforeLinkRouteEditEnd`, `LinkRouteEditEnd`, `LinkRouteEditCancel`, `LinkRouteReset`

Selection:

- `SelectionChanged` - общий snapshot `{ taskIds, pointIds, linkIds }`
- `PointSelectionChanged`, `LinkSelectionChanged`, `AnnotationSelectionChanged` - annotation snapshot `{ pointIds, linkIds }`

Validation:

- `PortValidationFailed`
- `LinkValidationFailed`
- `AnnotationEditRejected`

Before-события можно отменить через `event.preventDefault()`. Отмена point drag возвращает точку к предыдущему `{ time, groupId, taskId }`.
