# ColumnMenu

`ColumnMenu` объявляет единое context menu для всех колонок Table.

```vue
<script setup lang="ts">
const ports = definePorts({
  provides: {
    'table.sort.setColumnAsc': action<unknown, void>(),
    'table.sort.setColumnDesc': action<unknown, void>(),
    'table.sort.clearAll': action<unknown, void>(),
  },
})
</script>

<Table :rows="rows" row-key="id">
  <ColumnMenu>
    <MenuItem action="table.sort.setColumnAsc" label="По возрастанию" />
    <MenuItem action="table.sort.setColumnDesc" label="По убыванию" />
    <MenuSeparator />
    <MenuItem action="table.sort.clearAll" label="Сбросить сортировку" />
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
