# Стабильные id

`id` - главный ключ для diff, update, remove, selection и focus. Он должен быть стабильным между render/update циклами.

## Правила

- Не генерируйте новые id при каждом refetch.
- Не используйте индекс массива как id.
- Для optimistic updates сохраняйте временный id до подтверждения или делайте явную замену.

## Пример корректного обновления

```ts
import type { TimelineChartRef, TimelineGroupInput, TimelineTaskInput } from '@engine2d/timeline-chart'

interface Group extends TimelineGroupInput {
  title: string
}

interface Task extends TimelineTaskInput {
  title: string
  externalId: string
}

function applyServerPatch(timeline: TimelineChartRef<Group, Task>): void {
  timeline.update({
    tasks: [{
      id: 'task-42',
      externalId: 'server-task-42',
      title: 'Новое название с сервера',
    }],
  })
}

function removeByStableId(timeline: TimelineChartRef<Group, Task>): void {
  timeline.remove({
    tasks: ['task-42'],
  })
}
```

## Optimistic id

```ts
function createOptimisticTask(timeline: TimelineChartRef<Group, Task>, startTime: number): void {
  timeline.add({
    tasks: [{
      id: 'tmp-task-1',
      externalId: 'pending',
      groupId: 'group-1',
      title: 'Создается...',
      startTime,
      endTime: startTime + 60 * 60 * 1000,
    }],
  })
}

function confirmOptimisticTask(timeline: TimelineChartRef<Group, Task>, startTime: number): void {
  timeline.batch(api => {
    api.remove({ tasks: ['tmp-task-1'] })
    api.add({
      tasks: [{
        id: 'task-100',
        externalId: 'server-task-100',
        groupId: 'group-1',
        title: 'Созданная задача',
        startTime,
        endTime: startTime + 60 * 60 * 1000,
      }],
    })
  })
}
```
