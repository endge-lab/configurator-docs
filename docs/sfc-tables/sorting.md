# Сортировка

Сортировка включается на уровне `Column`, а режим взаимодействия задаётся на
`Table`.

```vue
<Table
  :rows="rows"
  sort-mode="multiple"
  default-sort="priority:desc,createdAt:asc"
>
  <Column key="title" title="Название" sortable sort="text" />
  <Column key="priority" title="Приоритет" sortable sort="number" />
  <Column key="createdAt" title="Создан" sortable sort="date" />
</Table>
```

## Настройки Column

| Атрибут | Назначение |
| --- | --- |
| `sortable` | Разрешает пользователю менять сортировку колонки |
| `sort` | Выбирает comparator |
| `sort-by` / `sortBy` | Задаёт один или несколько путей строки через запятую |

Доступные comparators: `natural`, `text`, `number`, `date`, `time`, `boolean`.
Если `sort-by` отсутствует, используется `Column.key`. Несколько путей
сравниваются последовательно до первого различия.

## Режимы Table

| `sort-mode` | Поведение |
| --- | --- |
| `multiple` | Несколько активных колонок; порядок входит в sort state |
| `single` | Одновременно сортируется только одна колонка |
| `fixed` | Применяется `default-sort`, но пользователь не меняет его |
| `disabled` | Сортировка полностью отключена |

`default-sort` использует формат `column:asc,column:desc`. Он может ссылаться
только на объявленные sortable/sort колонки. Неизвестные ключи и направления
являются compiler diagnostics.

## Actions

В menu context доступны:

- `table.sort.setColumnAsc`;
- `table.sort.setColumnDesc`;
- `table.sort.clearColumn`;
- `table.sort.clearAll`.

`canExecute` учитывает `sortable`, `sort-mode` и текущее состояние. Например,
очистка одной колонки недоступна, пока она не участвует в сортировке.

## Event

После пользовательского или Action-изменения публикуется:

```ts
{
  tableId: string
  sort: Array<{
    columnKey: string
    direction: 'asc' | 'desc'
  }>
}
```

Сохранённый runtime state имеет приоритет над `default-sort`. Подробнее:
[состояние таблицы](./state).
