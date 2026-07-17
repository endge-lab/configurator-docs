# Панели, Grid и TimeScale

Основные части TimelineChart v2 поддерживают `renderMode`:

- `default` - стандартная отрисовка.
- `overlay` - стандартная отрисовка плюс пользовательский слой сверху.
- `replace` - пользователь полностью заменяет визуальный слой.

## JSON templates

Кастомная major-линия TimeScale:

```ts
const options = {
  uiTemplates: {
    timescaleMajorTick: ({ tick, x, height }) => [
      {
        type: 'rect',
        x,
        y: 0,
        width: 1,
        height,
        styles: {
          background: '#dc2626',
        },
      },
      {
        type: 'text',
        text: tick.label,
        x: x + 6,
        y: 8,
        width: 96,
        height: 18,
        styles: {
          color: '#dc2626',
          font: { size: 11, weight: '700' },
        },
      },
    ],
  },
}
```

Кастомизация только одной колонки групп:

```ts
const options = {
  groups: {
    columns: [
      {
        id: 'name',
        title: 'Name',
        width: 180,
        data: group => group.name,
      },
      {
        id: 'status',
        title: 'Status',
        width: 120,
        data: group => group.status,
        template: ({ data, x, y, width, height }) => [
          {
            type: 'rect',
            x,
            y,
            width,
            height,
            styles: {
              background: data === 'critical' ? '#fee2e2' : '#ecfdf5',
            },
          },
          {
            type: 'text',
            text: String(data),
            x: x + 8,
            y,
            width: width - 16,
            height,
            styles: {
              color: data === 'critical' ? '#991b1b' : '#065f46',
              font: { size: 11, weight: '600' },
              ellipsis: true,
            },
          },
        ],
      },
    ],
  },
}
```

Приоритет колонки:

```txt
column.template/headerTemplate
> options.uiTemplates.groupColumn/groupColumnHeader
> default renderer
```

## DSL slots

Advanced layout строится через `NovaCanvas` и `TimelineChart.Root`. Достаточно импортировать пакет `@engine2d/timeline-chart`: он сам подключает UI Kit и timeline DSL к новым `NovaApp`.

```ts
import { NovaCanvas, TimelineChart } from '@engine2d/timeline-chart'
```

В обычном сценарии `plugins` в `NovaCanvas` не нужны:

```vue
<NovaCanvas>
  <TimelineChart.Root :data="data" :options="options" />
</NovaCanvas>
```

Для специальных harness/tests preset остается доступен явно:

```ts
import { timelineChartPlugin } from '@engine2d/timeline-chart'
```

```vue
<NovaCanvas :width="900" :height="360">
  <TimelineChart.Root :data="data" :options="options">
    <template #layout>
      <Flex direction="column" :width="900" :height="360">
        <TimelineChart.TimeScale :layout="{ height: 56, flexShrink: 0 }">
          <template #overlay="{ width, height, majorTicks }">
            <Surface
              for="tick in majorTicks"
              :key="tick.value"
              :x="tick.x"
              :y="0"
              :width="1"
              :height="height"
              background="#dc2626"
            />
            <TextBlock
              for="tick in majorTicks"
              :key="`${tick.value}-label`"
              :x="tick.x + 6"
              :y="8"
              :width="96"
              :height="18"
              :text="tick.label"
              color="#dc2626"
              font-weight="700"
            />
          </template>
        </TimelineChart.TimeScale>

        <TimelineChart.TasksPanel :layout="{ flexGrow: 1 }" />
      </Flex>
    </template>
  </TimelineChart.Root>
</NovaCanvas>
```

Для точечного переопределения стандартный layout собирать не нужно. Named slots на root создают нужную part-зону сами:

```vue
<TimelineChart.Root :data="data" :options="options">
  <template #grid="{ width, height, verticalLines, horizontalLines }">
    <Surface
      for="line in verticalLines"
      :key="line.id"
      :x="line.x"
      :y="0"
      :width="line.kind === 'major' ? 2 : 1"
      :height="height"
      :background="line.kind === 'major' ? '#2563eb' : 'rgba(15,23,42,.14)'"
    />

    <Surface
      for="line in horizontalLines"
      :key="line.id"
      :x="0"
      :y="line.y"
      :width="width"
      :height="1"
      background="rgba(15,23,42,.1)"
    />
  </template>

  <template #timeScaleOverlay="{ majorTicks, height }">
    <TextBlock
      for="tick in majorTicks"
      :key="tick.value"
      :x="tick.x + 6"
      :y="8"
      :width="96"
      :height="height"
      :text="tick.label"
      color="#dc2626"
    />
  </template>
</TimelineChart.Root>
```
