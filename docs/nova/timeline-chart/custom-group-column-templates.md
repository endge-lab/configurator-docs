# Group column templates

Колонки групп можно форматировать через `data(group)`, JSON/TS `template` или через DSL внутри `TimelineChart.GroupsPanel`.

DSL-режим компилируется в schema factories. На каждую видимую ячейку не создается `NovaNode`: runtime просто вызывает функцию, которая возвращает `NovaSchema`.

## Практика

Для текста и простых badges используйте columns. Для сложных ячеек с иконками, progress и цветом используйте `column.template` или DSL-колонки.

Приоритет:

```txt
TimelineChart.GroupColumn DSL
> column.template/headerTemplate
> options.uiTemplates.groupColumn/groupColumnHeader
> default renderer
```

## JSON/TS template

`NovaUIKit.progressRingSchema` возвращает обычный `NovaSchema`, поэтому его можно вставлять прямо в `column.template` или общий `uiTemplates.groupColumn`. Это удобный способ сделать колонку готовности как на Gantt-дашбордах, не создавая отдельный runtime node.

```ts
import { NovaUIKit, type TimelineOptions } from '@engine2d/timeline-chart'

interface Group {
  id: string
  title: string
  readiness: number
}

export const options: TimelineOptions<Group, never> = {
  groups: {
    visible: true,
    columns: [
      { id: 'title', title: 'Команда', data: group => group.title, width: 220 },
      {
        id: 'readiness',
        title: 'Готовность',
        data: group => group.readiness,
        width: 96,
        template: ({ group, x, y, width, height }) => [
          ...NovaUIKit.progressRingSchema({
            x: x + 12,
            y: y + Math.max(0, (height - 14) / 2),
            size: 14,
            value: group.readiness,
            strokeWidth: 2,
            color: group.readiness >= 80 ? '#10b981' : '#f59e0b',
            trackColor: '#e7edf5',
          }),
          {
            type: 'text',
            text: `${group.readiness}%`,
            x: x + 32,
            y,
            width: Math.max(0, width - 40),
            height,
            styles: {
              color: '#475569',
              font: { size: 11, weight: '700' },
              align: { vertical: 'middle', horizontal: 'left' },
            },
          },
        ],
      },
    ],
  },
}
```

Для больших таблиц такой подход остается дешевым: template генерирует два `arc` primitive и один `text`, а WebGL backend компилирует дуги в короткий набор line-сегментов внутри обычного schema render path.

## Inline DSL

Если удобнее описывать ячейку как markup, добавьте `TimelineChart.GroupColumn` внутрь `TimelineChart.GroupsPanel`.

```vue
<TimelineChart.Root :data="data" :options="options">
  <TimelineChart.GroupsPanel :layout="{ width: 320, height: 'fill' }">
    <TimelineChart.GroupColumn id="readiness">
      <template #cell="{ group, x, y, width, height }">
        <ProgressRing
          :x="x + 14"
          :y="y + Math.max(0, (height - 14) / 2)"
          :size="14"
          :value="group.item.readiness"
          :stroke-width="2"
          :color="group.item.readiness >= 80 ? '#10b981' : '#f59e0b'"
          track-color="#e7edf5"
        />

        <TextBlock
          :x="x + 34"
          :y="y"
          :width="width - 42"
          :height="height"
          :text="`${group.item.readiness}%`"
          color="#475569"
          :font="{ size: 10, weight: '700' }"
          :align="{ vertical: 'middle', horizontal: 'center' }"
        />
      </template>
    </TimelineChart.GroupColumn>
  </TimelineChart.GroupsPanel>
</TimelineChart.Root>
```

Внутри `#cell` и `#header` разрешены schema primitives: `Rect`, `Line`, `Circle`, `Icon`, `Text`, `TextBlock`, `ProgressRing`.

## External DSL

Для больших примеров колонки можно разложить по файлам и подключить через существующий синтаксис `<template src>`.

```txt
src/templates/groups/
  GroupPanel.nova
  columns/
    TeamColumn.nova
    OwnerColumn.nova
    StatusColumn.nova
    ReadinessColumn.nova
```

`App.vue`:

```vue
<script setup lang="ts">
import GroupPanel from './templates/groups/GroupPanel.nova'
</script>

<TimelineChart.Root :data="data" :options="options">
  <TimelineChart.GroupsPanel :layout="{ width: 452, height: 'fill', flexShrink: 0 }">
    <GroupPanel nova:schema />
  </TimelineChart.GroupsPanel>
</TimelineChart.Root>
```

`GroupPanel.nova`:

```vue
<template>
  <template src="./columns/TeamColumn.nova" />
  <template src="./columns/ReadinessColumn.nova" />
</template>
```

`ReadinessColumn.nova`:

```vue
<template>
  <TimelineChart.GroupColumn id="readiness">
    <template #cell="{ group, x, y, width, height }">
      <ProgressRing
        :x="x + 14"
        :y="y + Math.max(0, (height - 14) / 2)"
        :size="14"
        :value="group.item.readiness"
        :stroke-width="2"
        :color="group.item.readiness >= 80 ? '#10b981' : '#f59e0b'"
        track-color="#e7edf5"
      />
    </template>
  </TimelineChart.GroupColumn>
</template>
```

`<template src>` inline-вставляет template content и не создает компонентный `NovaNode`. В fragments, которые подключаются внутри `NovaCanvas`, держите выражения на slot context, literals и данных группы. Если нужен helper для иконок или цветов, удобнее заранее положить готовое значение в `group.item`.
