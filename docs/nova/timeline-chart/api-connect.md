# Подключение API

Публичные методы timeline доступны через Vue `ref` на компонент `TimelineChart`. Тип ref - `TimelineChartRef<Group, Task>`, где `Group` и `Task` - ваши типы данных, расширяющие `TimelineGroupInput` и `TimelineTaskInput`.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  TimelineChart,
  type TimelineChartProps,
  type TimelineChartRef,
  type TimelineGroupInput,
  type TimelineRootData,
  type TimelineTaskInput,
} from '@engine2d/timeline-chart'

interface Group extends TimelineGroupInput {
  title: string
}

interface Task extends TimelineTaskInput {
  title: string
}

const timeline = ref<TimelineChartRef<Group, Task> | null>(null)

const start = Date.parse('2026-05-21T09:00:00+03:00')

const data: TimelineRootData<Group, Task> = {
  groups: [{ id: 'group-1', title: 'Группа 1' }],
  tasks: [{
    id: 'task-1',
    groupId: 'group-1',
    title: 'Задача 1',
    startTime: start,
    endTime: start + 2 * 60 * 60 * 1000,
  }],
}

const options: TimelineChartProps<Group, Task>['options'] = {}
</script>

<template>
  <TimelineChart
    ref="timeline"
    :data="data"
    :options="options"
    width="100%"
    height="360"
    renderer="webgl"
  />
</template>
```

До mount значение ref равно `null`, поэтому API вызывают после mount, в обработчиках UI или после проверки `timeline.value`.

Любой метод можно вызвать напрямую: это удобно для одной команды. Если нужно применить несколько связанных изменений за один update cycle, используйте `batch`: внутри callback доступен тот же API-объект.

Дальше в этом разделе каждая страница описывает отдельный метод API и его типичный сценарий применения.
