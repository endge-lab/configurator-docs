# Table

`Table` материализует rows через declarative [Column](./column) children. Это
runtime primitive: он использует table host, sorting, pinning и command boundary.

```vue
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
    <MenuItem command="table.sort.clearAll" label="Clear sorting" />
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

