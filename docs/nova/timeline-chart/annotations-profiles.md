# Annotations profiles

Визуал `points` и `links` задается через `visualProfiles`. DSL используется только для описания профилей, а не для создания data-сущностей.

```ts
const options = {
  profiles: {
    points: {
      by: 'kind',
      default: 'milestone',
    },
    links: {
      by: link => link.kind,
      default: 'critical',
    },
  },
}

const visualProfiles = {
  pointProfiles: {
    milestone: {
      recipe: TimelineChart.recipes.point({
        shape: 'diamond',
        size: 12,
        fill: '#10b981',
        stroke: '#047857',
        selectedFill: '#1d73ff',
        hoveredStroke: '#93c5fd',
        label: { text: point => point.label, position: 'right', offset: 8 },
      }),
    },
  },
  linkProfiles: {
    critical: {
      recipe: TimelineChart.recipes.link({
        stroke: '#ef4444',
        width: 2,
        selectedStroke: '#1d73ff',
        selectedWidth: 3,
        handleFill: 'rgba(29, 115, 255, 0.28)',
        handleStroke: '#1d73ff',
        pattern: 'dash',
        dash: [6, 4],
        routing: { type: 'orthogonal', elbow: { mode: 'ratio', value: 0.55 } },
      }),
    },
  },
}
```

```vue
<TimelineChart :data="data" :options="options" :visual-profiles="visualProfiles" />
```

`options.profiles.points.by` и `options.profiles.links.by` выбирают id объявленного DSL/recipe profile. Порядок выбора единый: `by(entity)`, затем `entity.profile`, `entity.kind`, `default`.

Background-интервалы также могут получать отдельные `backgroundProfiles`; они подключаются к тому же механизму task profiles и выбираются через `options.profiles.backgrounds` для задач с `type: 'background'`.

## DSL

`TimelineChart.PointProfile` и `TimelineChart.LinkProfile` компилируются в `visualProfiles`. State props применяются только к визуалу; data-сущности остаются в `data.points/data.links`.

```vue
<TimelineChart.Root :data="data" :options="options">
  <TimelineChart.PointProfile
    id="comment"
    shape="icon"
    icon="comment"
    fill="#2563eb"
    selected-fill="#1d73ff"
    hovered-stroke="#93c5fd"
    :editable="{ x: true, group: true }"
    :ports="['top', 'right', 'bottom', 'left']"
  />

  <TimelineChart.LinkProfile
    id="dependency"
    stroke="#64748b"
    selected-stroke="#1d73ff"
    :selected-width="3"
    handle-fill="rgba(29, 115, 255, 0.28)"
    handle-stroke="#1d73ff"
    :routing="{ type: 'orthogonal', elbow: { mode: 'ratio', value: 0.5 } }"
  />
</TimelineChart.Root>
```

Поддержанные state props для points: `selected-fill`, `selected-stroke`, `selected-stroke-width`, `hovered-fill`, `hovered-stroke`, `hovered-stroke-width`, `handle-*`, `selectable`, `editable`, `ports`.

Для links: `selected-stroke`, `selected-width`, `hovered-stroke`, `hovered-width`, `handle-*`, `route-handle-*`, `selectable`, `editable`, `ports`.
