# MenuSeparator

`MenuSeparator` разделяет группы команд внутри [ColumnMenu](./column-menu).

```vue
<ColumnMenu>
  <MenuItem command="table.sort.setColumnAsc" label="Sort ascending" />
  <MenuSeparator id="sort-actions-end" />
  <MenuItem command="table.sort.clearAll" label="Clear sorting" />
</ColumnMenu>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `id` | literal string | Опциональный stable id; иначе `separator-{index}`. |

Тег не имеет children и допустим только внутри `ColumnMenu`.

