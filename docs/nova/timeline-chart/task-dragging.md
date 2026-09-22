# Перетаскивание задач

Timeline может разрешать пользователю менять задачу прямо на canvas: двигать весь интервал, менять начало, менять конец или переносить задачу в другую группу. Эти возможности задаются на уровне конкретной задачи через поле `editable`.

`editable` удобно хранить в данных: сервер или бизнес-логика решают, какие задачи можно редактировать, а timeline применяет это правило при drag/edit.

:::example id="timeline-chart-task-dragging" layout="tabs" defaultTab="canvas" height="420px"
:::

```ts
import type { TimelineTaskInput } from '@engine2d/timeline-chart'

interface Task extends TimelineTaskInput {
  title: string
  status: 'planned' | 'locked' | 'done'
}

const task: Task = {
  id: 'task-1',
  groupId: 'group-1',
  title: 'Плановая задача',
  status: 'planned',
  startTime: Date.parse('2026-05-21T09:00:00+03:00'),
  endTime: Date.parse('2026-05-21T11:00:00+03:00'),
  editable: {
    move: true,
    startTime: true,
    endTime: true,
    group: true,
  },
}
```

## editable

Поле `editable` может быть boolean или объектом с отдельными разрешениями.

| Значение | Что означает |
| --- | --- |
| `editable: true` | Задачу можно редактировать всеми поддерживаемыми способами. |
| `editable: false` | Задачу нельзя двигать и изменять через UI. |
| `editable.startTime` | Пользователь может менять начало интервала. |
| `editable.endTime` | Пользователь может менять конец интервала. |
| `editable.move` | Пользователь может двигать весь интервал по времени. |
| `editable.group` | Пользователь может переносить задачу между группами. |

Если задачу нельзя менять после завершения или блокировки, фиксируйте это прямо в данных.

```ts
const doneTask: Task = {
  id: 'task-done',
  groupId: 'group-1',
  title: 'Завершенная задача',
  status: 'done',
  startTime,
  endTime,
  editable: false,
}
```

## Частичные ограничения

Часто задачу можно двигать по времени, но нельзя переносить между группами. В этом случае оставьте `group: false`.

```ts
const timeOnlyTask: Task = {
  id: 'task-time-only',
  groupId: 'group-1',
  title: 'Можно менять только время',
  status: 'planned',
  startTime,
  endTime,
  editable: {
    move: true,
    startTime: true,
    endTime: true,
    group: false,
  },
}
```

Другой сценарий: можно растягивать задачу, но нельзя переносить весь интервал.

```ts
const resizeOnlyTask: Task = {
  id: 'task-resize-only',
  groupId: 'group-1',
  title: 'Можно менять границы',
  status: 'planned',
  startTime,
  endTime,
  editable: {
    move: false,
    startTime: true,
    endTime: true,
    group: false,
  },
}
```

## Пересечения задач

Пересечения считаются внутри конкретной строки группы. Для группы можно явно указать `allowOverlap`, чтобы описать, допускает ли эта строка пересекающиеся range-задачи.

```ts
import type { TimelineGroupInput } from '@engine2d/timeline-chart'

interface Group extends TimelineGroupInput {
  title: string
}

const groups: Group[] = [
  {
    id: 'runway-a',
    title: 'Runway A',
    allowOverlap: false,
  },
  {
    id: 'parking',
    title: 'Parking',
    allowOverlap: true,
  },
]
```

| Значение | Поведение |
| --- | --- |
| `allowOverlap: false` | Timeline не должен позволять range-задачам свободно пересекаться в этой группе. |
| `allowOverlap: true` | Задачи могут пересекаться в одной группе, если это нужно бизнес-сценарию. |
| не задано | Используется поведение runtime по умолчанию. |

## Как это связано с drag

При drag/edit timeline проверяет два уровня правил:

- разрешено ли редактирование самой задачи через `task.editable`;
- допустимо ли новое положение задачи внутри группы, включая overlap-правила группы.

Для production-сценариев лучше хранить и `editable`, и `allowOverlap` в данных, а не зашивать эти правила только в UI.

```ts
const readonlyGroup: Group = {
  id: 'archive',
  title: 'Архив',
  allowOverlap: true,
}

const readonlyTask: Task = {
  id: 'archived-task',
  groupId: 'archive',
  title: 'Архивная задача',
  status: 'done',
  startTime,
  endTime,
  editable: false,
}
```

## Практическое правило

- `editable` отвечает за то, что пользователь может менять в задаче.
- `allowOverlap` отвечает за то, допускает ли группа пересечения задач.
- `snap` в `options` отвечает за округление времени при редактировании.
- API-методы `update` и `batch` могут изменить задачу программно, даже если `editable: false`; это ограничение именно пользовательского drag/edit.
