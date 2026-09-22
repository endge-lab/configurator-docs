# Данные timeline

Корневой snapshot описывается типом `TimelineRootData<G, T>`. В обычном сценарии передаются `groups` и `tasks`, а фоновые интервалы идут отдельно через `backgrounds`.

```ts
import type { TimelineRootData, TimelineGroupInput, TimelineTaskInput } from '@engine2d/timeline-chart'

interface Group extends TimelineGroupInput { title: string }
interface Task extends TimelineTaskInput { title: string }

const start = new Date('2026-05-20T09:00:00+03:00').getTime()
const end = start + 2 * 60 * 60 * 1000

const data: TimelineRootData<Group, Task> = {
  groups: [{ id: 'group-1', title: 'Группа 1' }],
  tasks: [{ id: 'task-1', groupId: 'group-1', title: 'Задача 1', startTime: start, endTime: end }],
  backgrounds: [{ id: 'bg-1', type: 'background', groupId: 'group-1', title: 'Окно работ', startTime: start, endTime: end }],
}
```

:::example id="timeline-chart-basic" layout="tabs"
:::

## Замена и частичные изменения

Для полной замены используйте prop `data` или метод `data(nextData)`. Для точечных изменений используйте `add`, `update`, `remove`.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  TimelineChart,
  type TimelineChartRef,
  type TimelineGroupInput,
  type TimelineRootData,
  type TimelineTaskInput,
} from '@engine2d/timeline-chart'

interface Group extends TimelineGroupInput { title: string }
interface Task extends TimelineTaskInput { title: string }

const timeline = ref<TimelineChartRef<Group, Task> | null>(null)
const start = new Date('2026-05-20T09:00:00+03:00').getTime()

const initialData: TimelineRootData<Group, Task> = {
  groups: [{ id: 'group-1', title: 'Группа 1' }],
  tasks: [{ id: 'task-1', groupId: 'group-1', title: 'Задача 1', startTime: start, endTime: start + 3600000 }],
}

function replaceViaProp(): TimelineRootData<Group, Task> {
  return {
    groups: [{ id: 'group-2', title: 'Новая группа' }],
    tasks: [{ id: 'task-2', groupId: 'group-2', title: 'Новая задача', startTime: start, endTime: start + 7200000 }],
  }
}

function replaceViaRef(): void {
  timeline.value?.data(replaceViaProp())
}

function patchData(): void {
  timeline.value?.batch(api => {
    api.add({
      groups: [{ id: 'group-3', title: 'Добавленная группа' }],
      tasks: [{ id: 'task-3', groupId: 'group-3', title: 'Добавленная задача', startTime: start, endTime: start + 3600000 }],
    })
    api.update({
      tasks: [{ id: 'task-1', title: 'Переименованная задача' }],
    })
    api.remove({
      tasks: ['task-2'],
    })
  })
}
</script>

<template>
  <TimelineChart ref="timeline" :data="initialData" width="100%" height="360" />
</template>
```

## Когда что использовать

| Сценарий | Метод |
| --- | --- |
| Пришел новый snapshot с сервера | `data(nextData)` или prop `:data="nextData"` |
| Нужно добавить группу, задачи или backgrounds | `add({ groups, tasks, backgrounds })` |
| Нужно изменить поля существующих сущностей | `update({ groups, tasks, backgrounds })` |
| Нужно удалить сущности по id | `remove({ groups, tasks, backgrounds })` |
| Нужно применить несколько операций как один update cycle | `batch(api => { ... })` |
