# Table

`Table` материализует rows через declarative [Column](./column) children. Это
runtime primitive: он использует table host, sorting, pinning и единый Action boundary.

```vue
<script setup lang="ts">
const ports = definePorts({
  provides: {
    'table.sort.clearAll': action<unknown, void>(),
  },
})
</script>

<Table
  :rows="flights"
  row-key="id"
  table-id="departures"
  sort-mode="multiple"
  default-sort="std:asc,number:desc"
  column-pin="enabled"
  default-pin="number:left,status:right"
>
  <ColumnMenu>
    <MenuItem action="table.sort.clearAll" label="Сбросить сортировку" />
  </ColumnMenu>
  <Column key="number" title="Flight" sortable />
  <Column key="std" title="STD" sortable sort="date" />
</Table>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `rows` / `:rows` | array/expression | Строки таблицы. |
| `row-key` / `rowKey` | string | Path стабильного row id. |
| `table-id` / `tableId` | string | Runtime-state owner identity. |
| `row-size` / `rowSize` | number/string | Высота строки. |
| `width` / `w`, `height` / `h` | number/string | Bounds. |
| `theme` | string | Renderer theme hint. |
| `sort-mode` | string | `single`, `multiple` или disabled mode adapter-а. |
| `default-sort` | string | `column:asc|desc`, разделённые запятыми. |
| `column-pin` | `enabled` / `disabled` | Column pin capability. |
| `default-pin` | string | `column:left|right`, разделённые запятыми. |
| `column-menu` | `default` / `disabled` | Built-in или отключённое column menu. |
| `cell-align`, `cell-vertical-align` | string | Table-level cell alignment defaults. |

Допустимые прямые children: один [ColumnMenu](./column-menu) и любое число
[Column](./column).

Встроенное menu использует Table Actions автоматически. Для inline menu каждая
Action identity должна быть явно объявлена в `definePorts.provides`. Это делает
публичные возможности компонента видимыми в compiled contract.

## Встроенные Actions

| Identity | Эффект |
| --- | --- |
| `table.sort.setColumnAsc` | Сортировать текущую колонку по возрастанию. |
| `table.sort.setColumnDesc` | Сортировать текущую колонку по убыванию. |
| `table.sort.clearColumn` | Удалить сортировку текущей колонки. |
| `table.sort.clearAll` | Удалить все сортировки. |
| `table.column.pinLeft` | Закрепить текущую колонку слева. |
| `table.column.pinRight` | Закрепить текущую колонку справа. |
| `table.column.unpin` | Снять закрепление текущей колонки. |
| `table.column.resetPin` | Вернуть default pin текущей колонки. |
| `table.column.resetAllPins` | Вернуть defaults всех колонок. |

Action получает context конкретной mounted Table instance. Поэтому одну и ту же
Component SFC definition можно смонтировать несколько раз: сортировка и pin state
не становятся global singleton.
