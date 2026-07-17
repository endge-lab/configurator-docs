# Фоновые задачи

Фоновая задача описывает интервал, который рисуется как контекст под рабочими задачами: окно работ, смена, SLA, недоступный период, плановый простой или другой визуальный диапазон времени.

Фоновые задачи используют тот же пользовательский тип, что и обычные задачи: он должен расширять `TimelineTaskInput`. При передаче через поле `backgrounds` runtime нормализует такие элементы как `type: 'background'`. Явно указать `type: 'background'` тоже можно, это делает намерение в данных очевидным.

```ts
import type { TimelineTaskInput } from '@engine2d/timeline-chart'

interface Task extends TimelineTaskInput {
  title: string
  tone?: 'maintenance' | 'sla' | 'blocked'
}

const background: Task = {
  id: 'bg-maintenance',
  type: 'background',
  groupId: 'group-1',
  title: 'Окно работ',
  tone: 'maintenance',
  startTime: Date.parse('2026-05-20T09:00:00+03:00'),
  endTime: Date.parse('2026-05-20T11:00:00+03:00'),
}
```

## Стандартные поля

| Поле | Тип | Обязательное | Описание |
| --- | --- | --- | --- |
| `id` | `string` | да | Стабильный идентификатор фонового интервала. Используется в `update` и `remove`. |
| `type` | `'background'` | нет | При передаче через `backgrounds` выставляется runtime автоматически, но явное значение делает данные понятнее. |
| `groupId` | `string \| null` | да | Id группы, на фоне которой рисуется интервал. `null` отправляет фон в ungrouped context. |
| `startTime` | `number` | да | Начало фонового интервала в timestamp milliseconds. |
| `endTime` | `number` | да | Конец фонового интервала в timestamp milliseconds. |
| `visible` | `boolean` | нет | Флаг видимости для фильтрации и частичных updates. |
| `custom` | `unknown` | нет | Произвольные данные для templates, tooltip или обработчиков. |

## Пользовательские поля

Дополнительные поля нужны, когда фоновые интервалы отличаются типом, цветом, источником или бизнес-статусом. Например, `tone` можно использовать в task profile, чтобы отрисовать SLA и maintenance разными стилями.

:::example id="timeline-chart-options" layout="tabs"
:::

## Snapshot и updates

```ts
import type { TimelineChartRef, TimelineGroupInput, TimelineRootData, TimelineTaskInput } from '@engine2d/timeline-chart'

interface Group extends TimelineGroupInput {
  title: string
}

interface Task extends TimelineTaskInput {
  title: string
}

const start = new Date('2026-05-20T09:00:00+03:00').getTime()
const end = start + 2 * 60 * 60 * 1000

const data: TimelineRootData<Group, Task> = {
  groups: [{ id: 'group-1', title: 'Группа 1' }],
  tasks: [],
  backgrounds: [{
    id: 'bg-maintenance',
    type: 'background',
    groupId: 'group-1',
    title: 'Окно работ',
    startTime: start,
    endTime: end,
  }],
}

function addBackground(timeline: TimelineChartRef<Group, Task>): void {
  timeline.add({
    backgrounds: [{
      id: 'bg-sla',
      type: 'background',
      groupId: 'group-1',
      title: 'SLA interval',
      startTime: start,
      endTime: end,
    }],
  })
}

function updateBackground(timeline: TimelineChartRef<Group, Task>): void {
  timeline.update({
    backgrounds: [{ id: 'bg-sla', title: 'Обновленный SLA interval' }],
  })
}

function removeBackground(timeline: TimelineChartRef<Group, Task>): void {
  timeline.remove({
    backgrounds: ['bg-sla'],
  })
}
```

## Рекомендация

Не смешивайте рабочие задачи и фоновые интервалы в одном массиве, если их lifecycle отличается. Для bulk updates используйте отдельное поле `backgrounds`.
