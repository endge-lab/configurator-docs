# MenuSeparator

`MenuSeparator` разделяет группы Actions внутри [ColumnMenu](./column-menu).

```vue
<ColumnMenu>
  <MenuItem action="table.sort.setColumnAsc" label="По возрастанию" />
  <MenuSeparator id="sort-actions-end" />
  <MenuItem action="table.sort.clearAll" label="Сбросить сортировку" />
</ColumnMenu>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `id` | literal string | Опциональный stable id; иначе `separator-{index}`. |

Тег не имеет children и допустим только внутри `ColumnMenu`.
