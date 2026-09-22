# Группы

Группа описывает строку timeline: ресурс, исполнителя, категорию, машину, рейс, смену или любой другой контейнер, в котором раскладываются задачи. Задача попадает в строку группы через `task.groupId`.

Пользовательский тип группы всегда должен расширять `TimelineGroupInput`. Базовый контракт нужен runtime для связи задач с группами, фильтрации, layout и API-обновлений. Все дополнительные поля остаются вашими доменными данными: их можно использовать в `options.groups.columns`, `options.groups.order`, `options.groups.filter`, templates и обработчиках событий.

```ts
import type { TimelineGroupInput } from '@engine2d/timeline-chart'

interface Group extends TimelineGroupInput {
  title: string
  owner: string
  shift: 'day' | 'night'
}

const groups: Group[] = [
  { id: 'group-1', title: 'Группа 1', owner: 'Ops', shift: 'day' },
]
```

## Стандартные поля

| Поле | Тип | Обязательное | Описание |
| --- | --- | --- | --- |
| `id` | `string` | да | Стабильный идентификатор группы. На него ссылается `task.groupId`. |
| `parentId` | `string \| null` | нет | Id родительской группы для вложенной структуры. Если родитель не найден, группа считается root-level. |
| `expanded` | `boolean` | нет | Начальное состояние раскрытия группы с подгруппами. Если не задано, используется `groups.tree.defaultExpanded`. |
| `visible` | `boolean` | нет | Флаг видимости, который удобно использовать в `options.groups.filter`. |
| `allowOverlap` | `boolean` | нет | Разрешает пересечение range-задач внутри этой группы, если сценарий допускает overlap. |

## Пользовательские поля

Timeline не ограничивает модель группы только стандартными полями. Например, `title` можно вывести в колонке, `owner` показать в tooltip или header template, а `shift` использовать для сортировки и цветовой схемы.

:::example id="timeline-chart-options" layout="tabs"
:::

## Добавление и обновление групп

```ts
import type { TimelineChartRef, TimelineGroupInput, TimelineTaskInput } from '@engine2d/timeline-chart'

interface Group extends TimelineGroupInput {
  title: string
  owner: string
}

interface Task extends TimelineTaskInput {
  title: string
}

function addGroup(timeline: TimelineChartRef<Group, Task>): void {
  timeline.add({
    groups: [{ id: 'group-2', title: 'Группа 2', owner: 'Support' }],
  })
}

function updateGroup(timeline: TimelineChartRef<Group, Task>): void {
  timeline.update({
    groups: [{ id: 'group-1', title: 'Группа 1 / обновлена', owner: 'Ops' }],
  })
}

function hideGroup(timeline: TimelineChartRef<Group, Task>): void {
  timeline.update({
    groups: [{ id: 'group-1', visible: false }],
  })
}

function removeGroup(timeline: TimelineChartRef<Group, Task>): void {
  timeline.remove({
    groups: ['group-2'],
  })
}
```

## Панель групп

Левая панель групп показывает строки timeline и помогает пользователю сопоставлять задачи с ресурсами. Ее можно скрыть через `groups.visible`, но в операционных интерфейсах панель обычно оставляют включенной: без нее плотный timeline быстро теряет контекст.

Ширина панели складывается из ширин колонок. Если колонок несколько, держите первую колонку стабильной и читаемой: обычно это название ресурса, группы или исполнителя.

```ts
const options = {
  groups: {
    visible: true,
    columns: [
      { id: 'title', title: 'Группа', width: 160, data: (group: Group) => group.title },
      { id: 'owner', title: 'Owner', width: 100, data: (group: Group) => group.owner },
    ],
    paddingY: 6,
  },
}
```

## Вложенные группы

Вложенность задается плоским списком через `parentId`. Runtime не рендерит дерево рекурсивно: перед отрисовкой он строит плоскую visible-проекцию раскрытых строк, поэтому виртуализация, grid, hit-test и задачи продолжают работать как для обычного списка групп.

```ts
const groups: Group[] = [
  { id: 'project', title: 'Запуск продукта', expanded: true },
  { id: 'research', parentId: 'project', title: 'Исследование', expanded: true },
  { id: 'engineering', parentId: 'project', title: 'Разработка', expanded: true },
  { id: 'frontend', parentId: 'engineering', title: 'Фронтенд', expanded: true },
  { id: 'backend', parentId: 'engineering', title: 'Бэкенд', expanded: true },
]
```

Если хотя бы одна группа содержит `parentId`, tree mode включается автоматически. Для явной настройки используйте `options.groups.tree`:

```ts
const options = {
  groups: {
    visible: true,
    columns: [
      { id: 'title', title: 'Группа', width: 260, data: (group: Group) => group.title },
    ],
    tree: {
      enabled: true,
      defaultExpanded: true,
      indent: 18,
      disclosureColumnId: 'title',
    },
  },
}
```

`disclosureColumnId` указывает колонку, в которой рисуется marker раскрытия. В template колонки доступен runtime group context: `group.depth`, `group.hasChildren`, `group.expanded`, `group.childrenCount`, `group.parentId`.

```ts
const options = {
  groups: {
    columns: [
      {
        id: 'title',
        title: 'Группа',
        width: 260,
        data: group => group.title,
        template: ({ group, data, x, y, width, height }) => [
          {
            type: 'text',
            text: `${group.hasChildren ? (group.expanded ? '-' : '+') : ''} ${data}`,
            x: x + group.depth * 18,
            y,
            width: width - group.depth * 18,
            height,
            styles: { ellipsis: true },
          },
        ],
      },
    ],
  },
}
```

## API раскрытия

Через `TimelineChartRef` можно управлять одной группой или всей веткой:

```ts
timeline.value?.collapseGroup('engineering')
timeline.value?.expandGroup('engineering')
timeline.value?.toggleGroup('engineering')
timeline.value?.setGroupExpanded('engineering', false)

timeline.value?.collapseGroupBranch('project')
timeline.value?.expandGroupBranch('project')
```

`collapseGroup(id)` скрывает потомков, но сохраняет их внутреннее состояние. `collapseGroupBranch(id)` дополнительно сворачивает всех потомков, поэтому после раскрытия родителя вложенные уровни останутся свернутыми.

## Колонки

Колонки панели групп задаются в `options.groups.columns`. Функция `data` получает исходный объект группы.

```ts
const options = {
  groups: {
    visible: true,
    columns: [
      { id: 'title', title: 'Группа', width: 160, data: (group: Group) => group.title },
      { id: 'owner', title: 'Owner', width: 100, data: (group: Group) => group.owner },
    ],
    order: (a: Group, b: Group) => a.title.localeCompare(b.title),
    filter: (group: Group) => group.visible !== false,
  },
}
```

## Layout строк

Группа не задает свою высоту напрямую. Высота строки рассчитывается из задач внутри группы, `options.tasks.height`, `options.tasks.rowGap`, `options.groups.paddingY` и overlap-правил. Если `allowOverlap: false`, runtime старается развести пересекающиеся range-задачи по строкам внутри группы.

:::callout title="Стабильные id"
`group.id` должен быть постоянным между render/update циклами. Не используйте индекс массива и не генерируйте новый id при каждом refetch: `update`, `remove`, связь `task.groupId` и сортировка строк опираются на этот ключ.
:::
