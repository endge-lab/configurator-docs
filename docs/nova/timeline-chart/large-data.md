# Большие наборы данных

Timeline рассчитан на плотные данные, но качество подготовки данных все равно важно.

## Практика

- Передавайте только нужные пользовательские поля.
- Используйте `groups.filter` и `tasks.filter` для локальных сценариев.
- Частые изменения объединяйте через `batch` и `executor`.
- Стабилизируйте id, сортировку и profile resolver.

## Bulk snapshot

```ts
import type { TimelineRootData, TimelineGroupInput, TimelineTaskInput } from '@engine2d/timeline-chart'

interface Group extends TimelineGroupInput {
  title: string
  visibleInCurrentFilter: boolean
}

interface Task extends TimelineTaskInput {
  title: string
  visibleInCurrentFilter: boolean
}

function buildTimelineData(groups: Array<Group>, tasks: Array<Task>): TimelineRootData<Group, Task> {
  return {
    groups: groups.filter(group => group.visibleInCurrentFilter),
    tasks: tasks.filter(task => task.visibleInCurrentFilter),
  }
}
```

## Частые изменения

```ts
import type { TimelineChartRef } from '@engine2d/timeline-chart'

function applyLivePatch(timeline: TimelineChartRef<Group, Task>, patch: Array<Partial<Task> & { id: string }>): void {
  timeline.batch(api => {
    api.update({ tasks: patch })
    api.selectTasks(patch.map(task => task.id), { clearPrevious: true })
  })
}

function configureLiveUpdates(timeline: TimelineChartRef<Group, Task>): void {
  timeline.options({
    executor: {
      delay: 80,
      maxDelay: 240,
    },
  })
}
```

## Локальная фильтрация

```ts
const options = {
  groups: {
    filter: (group: Group) => group.visibleInCurrentFilter,
  },
  tasks: {
    filter: (task: Task) => task.visibleInCurrentFilter,
  },
}
```
