# ColumnMenu

`ColumnMenu` объявляет единое context menu для всех колонок Table.

```vue
<Table :rows="rows" row-key="id">
  <ColumnMenu>
    <MenuItem command="table.sort.setColumnAsc" label="Sort ascending" />
    <MenuItem command="table.sort.setColumnDesc" label="Sort descending" />
    <MenuSeparator />
    <MenuItem command="table.sort.clearAll" label="Clear sorting" />
  </ColumnMenu>
  <Column key="number" title="Flight" sortable />
</Table>
```

| Контракт | Значение |
| --- | --- |
| Placement | Ровно один прямой child `Table`. |
| Children | Только `MenuItem` и `MenuSeparator`. |
| Attributes | Собственных attributes в v1 нет. |

Если `Table` содержит `column-menu="disabled"`, inline descriptor не используется.

