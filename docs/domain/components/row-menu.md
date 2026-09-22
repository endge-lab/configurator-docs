# CellMenu и RowMenu

`CellMenu` объявляет контекстное меню ячеек как прямой child `Table` или `Column`.
`RowMenu` сохранён как deprecated alias только для `Table > RowMenu`.

```vue
<Table ref="orders" :rows="rows" row-key="id">
  <CellMenu>
    <MenuItem
      :action="openDetails"
      :label="t('orders:menu.open', 'Открыть')"
      v-if="$row.data.status !== 'archived'"
      :disabled="!$row.data.canOpen"
      :input="{ id: $row.id, field: $column.key, value: $cell.value }"
      icon="external-link"
    />
    <MenuSeparator />
    <MenuItem action="order.delete-row" label="Удалить" :input="{ id: $row.id }" icon="trash" />
  </CellMenu>
  <Column key="number" title="Номер" />
</Table>
```

Строковый `action="..."` означает прямую Action identity. Expression
`:action="openDetails"` означает required/provided port key. Forwarded alias
должен принадлежать именно этой Table; alias другого mounted child отклоняется
compiler diagnostic.
DOM event и координаты не входят в Action context; они остаются внутри overlay адаптера.

| Контракт | Значение |
| --- | --- |
| Placement | Не более одного прямого child `Table` или `Column`. |
| Children | Только `MenuItem` и `MenuSeparator`. |
| Cell context | `$table`, `$row`, `$column`, `$cell`, `$context`, `props`. |

Подробный runtime flow и правила Action provider-а:
[«Контекстное меню ячеек»](/sfc-tables/row-context-menu).
