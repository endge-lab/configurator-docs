# Задачи

Задача описывает временной интервал на timeline. Runtime использует ее `id` для updates и selection, `groupId` для размещения в строке группы, а `startTime` и `endTime` для расчета положения на временной шкале.

Пользовательский тип задачи всегда должен расширять `TimelineTaskInput`. Стандартные поля нужны для layout, selection, focus, drag/edit и API-операций. Дополнительные поля остаются вашими доменными данными: их можно использовать в task profiles, tooltip, filters, events и частичных updates.

```ts
import type { TimelineTaskInput } from '@engine2d/timeline-chart'

interface Task extends TimelineTaskInput {
  title: string
  status: 'active' | 'done' | 'risk'
}

const start = new Date('2026-05-20T09:00:00+03:00').getTime()
const end = start + 2 * 60 * 60 * 1000

const task: Task = {
  id: 'task-1',
  groupId: 'group-1',
  title: 'Задача 1',
  status: 'active',
  startTime: start,
  endTime: end,
}
```

## Стандартные поля

| Поле | Тип | Обязательное | Описание |
| --- | --- | --- | --- |
| `id` | `string` | да | Стабильный идентификатор задачи. Используется в `update`, `remove`, `selectTasks`, `focusOnTask`. |
| `groupId` | `string \| null` | да | Id группы. `null` означает, что задача находится в ungrouped panel. |
| `startTime` | `number` | да | Начало интервала в timestamp milliseconds. |
| `endTime` | `number` | да | Конец интервала в timestamp milliseconds. |
| `type` | `'range' \| 'background' \| 'task-group'` | нет | Тип runtime-задачи. Для обычных задач можно не указывать: используется `range`. |
| `visible` | `boolean` | нет | Флаг видимости, который удобно использовать в `options.tasks.filter`. |
| `editable` | `boolean` или object | нет | Разрешает или ограничивает drag/edit для конкретной задачи. |
| `taskGroupKey` | `string \| null` | нет | Ключ агрегации для `taskGrouping`. |
| `custom` | `unknown` | нет | Поле для произвольных данных, если их удобнее хранить отдельно от верхнего уровня задачи. |

## Пользовательские поля

Timeline сохраняет дополнительные поля задачи и передает их в templates, tooltip, events и API callbacks. Например, `status` можно использовать для выбора task profile, а `progress` вывести внутри кастомной карточки.

:::example id="timeline-chart-basic" layout="tabs"
:::

## Основная область задач

Основная область timeline содержит range-задачи, background-задачи, selection overlay и drag shadows. Координаты задачи рассчитываются runtime по `groupId`, `startTime`, `endTime`, текущему `timeRange` и vertical scroll.

Размер task body задается в `options.tasks`. Эти настройки влияют на layout строк, но не заменяют кастомную отрисовку: task profile получает уже готовые `x`, `y`, `width`, `height`.

```ts
const options = {
  tasks: {
    height: 34,
    rowGap: 6,
    filter: (task: Task) => task.visible !== false,
  },
}
```

Если задачи пересекаются по времени внутри одной группы, runtime учитывает `group.allowOverlap`. Для явного запрета пересечений задавайте `allowOverlap: false` на группе, а не на задаче.

## Добавление, перенос и удаление

```ts
import type { TimelineChartRef, TimelineGroupInput, TimelineTaskInput } from '@engine2d/timeline-chart'

interface Group extends TimelineGroupInput {
  title: string
}

interface Task extends TimelineTaskInput {
  title: string
  status: 'active' | 'done' | 'risk'
}

function addTask(timeline: TimelineChartRef<Group, Task>, start: number): void {
  timeline.add({
    tasks: [{
      id: 'task-2',
      groupId: 'group-1',
      title: 'Новая задача',
      status: 'active',
      startTime: start,
      endTime: start + 60 * 60 * 1000,
    }],
  })
}

function moveTask(timeline: TimelineChartRef<Group, Task>, start: number): void {
  timeline.update({
    tasks: [{
      id: 'task-1',
      groupId: 'group-2',
      startTime: start + 2 * 60 * 60 * 1000,
      endTime: start + 3 * 60 * 60 * 1000,
    }],
  })
}

function completeTask(timeline: TimelineChartRef<Group, Task>): void {
  timeline.update({
    tasks: [{ id: 'task-1', status: 'done', title: 'Готово' }],
  })
}

function removeTask(timeline: TimelineChartRef<Group, Task>): void {
  timeline.remove({
    tasks: ['task-2'],
  })
}
```

## Editable

Флаг `editable` можно задать boolean или объектом по осям редактирования: `startTime`, `endTime`, `group`, `move`.

```ts
const editableTask: Task = {
  id: 'task-editable',
  groupId: 'group-1',
  title: 'Редактируемая задача',
  status: 'active',
  startTime: start,
  endTime: start + 2 * 60 * 60 * 1000,
  editable: {
    startTime: true,
    endTime: true,
    group: true,
    move: true,
  },
}
```

:::callout title="Стабильные id"
`task.id` должен оставаться тем же для одной и той же бизнес-задачи. По нему работают `update`, `remove`, `selectTasks`, `focusOnTask` и optimistic updates. Не используйте индекс массива и не заменяйте id при каждом refetch.
:::
