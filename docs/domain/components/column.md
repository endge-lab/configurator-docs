# Column

`Column` описывает одну видимую колонку [Table](./table). Без `Cell` renderer
читает значение по `key`; с `Cell` используется custom template.

```vue
<Column key="number" title="Flight" width="120" sortable />

<Column
  key="std"
  title="STD"
  sortable
  sort="date"
  sort-by="std"
  pinnable
  align="center"
>
  <Cell>
    <DateTime :value="row.std" format="HH:mm" />
  </Cell>
</Column>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `key` | string | Column identity и default row path. |
| `title` | string | Header. |
| `width` / `size` | number/string | Column width. |
| `sortable` | boolean | Разрешает sorting. |
| `sort` | `natural` / `date` / `number` | Comparator. |
| `sort-by` | string | Один или несколько comma-separated row paths. |
| `pinnable` | boolean/string | Можно ли закреплять колонку; default `true`. |
| `align` / `cell-align` | string | Horizontal cell alignment. |
| `valign` / `cell-vertical-align` | string | Vertical cell alignment. |

Допускается не более одного прямого [Cell](./cell). `ColumnMenu` внутри Column в
v1 не поддерживается: меню размещается непосредственно внутри Table.

