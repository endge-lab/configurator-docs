# Annotations: points и links

`points` и `links` являются data-сущностями TimelineChart v2. Их нельзя создавать через DSL: они передаются только через `data`, `add`, `update`, `remove` и `batch`.

::::example id="timeline-chart-annotations" layout="tabs"
::::

```ts
timeline.value?.add({
  points: [{ id: 'm1', kind: 'milestone', time, groupId: 'systems', label: 'ORAT Trial' }],
  links: [{
    id: 'l1',
    kind: 'critical',
    from: { type: 'task', taskId: 'hvac', side: 'end' },
    to: { type: 'point', pointId: 'm1' },
  }],
})

timeline.value?.update({
  points: [{ id: 'm1', label: 'ORAT Trial Day' }],
  links: [{ id: 'l1', visible: false }],
})

timeline.value?.remove({ points: ['m1'], links: ['l1'] })
```

Если `annotations.enabled=false`, `points.enabled=false`, `links.enabled=false` или массив пустой, соответствующий слой не участвует в расчетах, hit-test и rendering.

## Интерактивность

`points` и `links` поддерживают те же правила selection, что и задачи. По умолчанию стандартный click rule работает для `task`, `point` и `link`: обычный click делает `select-only`, а `selectionScope: 'exclusive'` очищает selection сущностей другого типа.

```ts
const options = {
  selectionScope: 'exclusive', // point/link очищают task selection и наоборот
  selection: [
    { enabled: true, mode: ['single'], trigger: ['click'], target: ['task', 'point', 'link'], handler: ['select-only'] },
  ],
}
```

Если нужно держать вместе выделенные задачи и annotations, используйте `selectionScope: 'mixed'`. Если нужен multi-select по `Cmd/Ctrl+click`, добавьте отдельный rule с `handler: ['toggle']`.

```ts
timeline.value?.selectPoints(['comment-1'])
timeline.value?.selectLinks(['dependency-1'], { clearPrevious: false })
timeline.value?.selectAnnotations({ points: ['comment-2'], links: ['dependency-2'] })
timeline.value?.clearSelection()
```

`TimelinePointInput.selectable` и `TimelineLinkInput.selectable` отключают или уточняют selection для конкретной entity. `editable` включает drag/edit: у точки `x` меняет `time`, `group` разрешает перенос между группами. Для точки с `taskId` по умолчанию разрешено только движение по X; reassignment задачи должен включаться явно через `editable.task=true`.

```ts
points: [{
  id: 'deadline',
  time,
  groupId: 'delivery',
  selectable: true,
  editable: { x: true, group: true, snap: true },
}]
```

## Порты

Anchors могут указывать порт: `top`, `right`, `bottom`, `left`, `start`, `end`. Для задач и points доступны четыре визуальных порта: центральные точки каждой стороны. `start/end` - алиасы для `left/right` у задач. Legacy `side/y` остается рабочим и мапится в resolver, поэтому старые links не меняют визуал.

```ts
groups: [{
  id: 'delivery',
  ports: {
    tasks: { incoming: ['start', 'top'], outgoing: ['end', 'bottom'] },
    points: ['top', 'right', 'bottom', 'left'],
  },
}]

tasks: [{
  id: 'build',
  groupId: 'delivery',
  startTime,
  endTime,
  ports: { incoming: ['start'], outgoing: ['end'] },
}]

links: [{
  id: 'dep',
  from: { type: 'task', taskId: 'build', port: 'end' },
  to: { type: 'point', pointId: 'approval', port: 'left' },
}]
```

Приоритет правил: global annotation ports < group defaults for tasks/points < entity ports < явный `anchor.port/portId`. Для `from` подходят `outgoing|both`, для `to` - `incoming|both`. Явно неверный `portId` скрывает link и не меняет данные. Links привязываются только к `task`, `background`, `point` или `time` anchors; group anchors не поддерживаются. Link не может соединять entity с самой собой, даже если указаны разные порты одной задачи или point.

Orthogonal links входят в side-порт строго перпендикулярно стороне entity: `left/right` дают горизонтальный вход снаружи, `top/bottom` - вертикальный вход снаружи. Router строит короткий внешний segment у обоих endpoints и выбирает orthogonal path, который не пересекает bounds исходной и целевой entity. Это правило одинаково для задач и points.

`links` рисуются под задачами, `points` - над задачами, а endpoint handles и доступные reconnect-порты - поверх задач и points. Во время reconnect показываются только реально разрешенные порты нужного направления: для `from` это `outgoing|both`, для `to` - `incoming|both`. Если drag endpoint начался, но `mouseup` произошел не на валидном порту, данные связи не меняются.

## Видимость

Видимость `points` и `links` настраивается отдельно от `visible=false` на самой entity. Флаг `visible=false` всегда полностью исключает точку или связь из render pipeline. `annotations.points.visibility` и `annotations.links.visibility` управляют тем, когда уже активная entity попадает в текущий viewport.

По умолчанию:

- `points.visibility='geometry'` - точка рисуется по своей фактической координате во viewport. Если точка привязана к задаче через `taskId`, задача может быть скрыта или не входить в `visibleBlocks`, но точка все равно появится, если ее координата видна.
- `links.visibility='any-endpoint'` - связь рисуется, если виден хотя бы один ее endpoint: task, background, point или time-anchor.

```ts
const options = {
  annotations: {
    enabled: true,
    points: {
      enabled: true,
      visibility: 'geometry',
    },
    links: {
      enabled: true,
      visibility: 'any-endpoint',
    },
  },
}
```

Для старого строгого поведения используйте `points.visibility='anchor'` и `links.visibility='both-endpoints'`: точка будет зависеть от видимости своего якоря, а связь появится только при двух видимых концах.

```ts
const options = {
  annotations: {
    enabled: true,
    points: {
      enabled: true,
      visibility: 'anchor',
    },
    links: {
      enabled: true,
      visibility: 'both-endpoints',
    },
  },
}
```

Для пользовательских правил можно передать callback. Контекст точки содержит `point`, `anchor`, `anchorVisible`, `geometryVisible` и `viewport`. Контекст связи содержит `link`, `from`, `to`, `route`, `endpointVisible`, `geometryVisible` и `viewport`.

```ts
const options = {
  annotations: {
    enabled: true,
    points: {
      enabled: true,
      visibility: ctx => ctx.geometryVisible || ctx.point.kind === 'critical',
    },
    links: {
      enabled: true,
      visibility: ctx => ctx.endpointVisible || ctx.geometryVisible,
    },
  },
}
```
