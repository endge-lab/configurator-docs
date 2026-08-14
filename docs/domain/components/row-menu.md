# RowMenu

`RowMenu` объявляет одно контекстное меню строк как прямой child `Table`.
Меню cell-aware: при правом клике выражения получают `row`, `rowId`, `rowIndex`,
`columnKey` и `value`. Правый клик не меняет selection.

```vue
<Table ref="orders" :rows="rows" row-key="id">
  <RowMenu>
    <MenuItem
      action="openDetails"
      :label="t('orders:menu.open', 'Открыть')"
      :input="{ id: rowId, row, columnKey, value }"
      icon="external-link"
    />
    <MenuSeparator />
    <MenuItem action="deleteRow" label="Удалить" :input="{ id: rowId }" icon="trash" />
  </RowMenu>
  <Column key="number" title="Номер" />
</Table>
```

Actions могут быть intrinsic, built-in, required или совместимыми aliases,
forwarded именно из этой Table. Alias другой mounted child отклоняется compiler diagnostic.
DOM event и координаты не входят в Action context; они остаются внутри overlay адаптера.

| Контракт | Значение |
| --- | --- |
| Placement | Не более одного прямого child `Table`. |
| Children | Только `MenuItem` и `MenuSeparator`. |
| Cell context | `row`, `rowId`, `rowIndex`, `columnKey`, `value`. |

Подробный runtime flow и правила Action provider-а:
[«Контекстное меню строк»](/sfc-tables/row-context-menu).
