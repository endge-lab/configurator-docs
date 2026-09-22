# Задачи без группы

Задача без группы - это обычная `TimelineTaskInput` задача, у которой `groupId: null`. Она не попадает ни в одну строку группы и может отображаться в нижней панели `ungroupedPanel`.

Такой формат полезен для очереди, черновиков, конфликтов распределения или задач, которые еще не назначены ресурсу. Когда задача получает группу, достаточно обновить `groupId` на id существующей группы.

```ts
import type { TimelineTaskInput } from '@engine2d/timeline-chart'

interface Task extends TimelineTaskInput {
  title: string
  source: 'queue' | 'draft' | 'conflict'
}

const start = Date.parse('2026-05-20T09:00:00+03:00')

const task: Task = {
  id: 'task-free',
  groupId: null,
  title: 'Без группы',
  source: 'queue',
  startTime: start,
  endTime: start + 60 * 60 * 1000,
}
```

## Стандартные поля

| Поле | Тип | Обязательное | Описание |
| --- | --- | --- | --- |
| `id` | `string` | да | Стабильный идентификатор задачи для API-операций. |
| `groupId` | `null` | да | Главное отличие ungrouped task. Для назначения группе замените на id группы. |
| `startTime` | `number` | да | Начало интервала в timestamp milliseconds. |
| `endTime` | `number` | да | Конец интервала в timestamp milliseconds. |
| `visible` | `boolean` | нет | Флаг видимости для фильтрации или частичных updates. |
| `editable` | `boolean` или object | нет | Можно разрешить перенос задачи в группу через edit/drag сценарий. |

## Пользовательские поля

Дополнительные поля помогают объяснить, почему задача еще не назначена. Например, `source: 'conflict'` можно использовать в tooltip или кастомном template нижней панели.

## Добавление и назначение группы

```ts
import type { TimelineChartRef, TimelineGroupInput, TimelineTaskInput } from '@engine2d/timeline-chart'

interface Group extends TimelineGroupInput {
  title: string
}

interface Task extends TimelineTaskInput {
  title: string
}

function addUngroupedTask(timeline: TimelineChartRef<Group, Task>, start: number): void {
  timeline.add({
    tasks: [{
      id: 'task-free',
      groupId: null,
      title: 'Ожидает назначения',
      startTime: start,
      endTime: start + 60 * 60 * 1000,
    }],
  })
}

function assignTaskToGroup(timeline: TimelineChartRef<Group, Task>): void {
  timeline.update({
    tasks: [{ id: 'task-free', groupId: 'group-1', title: 'Назначена группе' }],
  })
}
```

## Опции панели

Ungrouped panel - нижняя область timeline для задач без группы. Она включается отдельно от основной области и имеет собственную высоту и vertical scroll.

```ts
const options = {
  ungroupedPanel: {
    enabled: true,
    height: 120,
    title: 'Без группы',
  },
  scroll: {
    ungroupedVerticalBarEnabled: true,
  },
}
```

Если ungrouped-задач много, включайте `scroll.ungroupedVerticalBarEnabled`. Если нижняя очередь не нужна в конкретном экране, оставляйте `ungroupedPanel.enabled: false` и фильтруйте такие задачи на уровне данных.

## Когда применять

Используйте ungrouped panel для очереди, черновиков, конфликтов распределения или задач, которые еще не назначены ресурсу.
