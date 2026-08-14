# ColumnMenu

`ColumnMenu` объявляет единое context menu для всех колонок Table.

```vue
<Table :rows="rows" row-key="id">
  <ColumnMenu>
    <MenuItem action="table.sort.setColumnAsc" label="По возрастанию" />
    <MenuItem action="table.sort.setColumnDesc" label="По убыванию" />
    <MenuSeparator />
    <MenuItem action="table.sort.clearAll" label="Сбросить сортировку" />
  </ColumnMenu>
  <Column key="number" title="Номер" sortable />
</Table>
```

Intrinsic Table Actions доступны внутри `ColumnMenu` без повторного объявления
в `definePorts.provides`. Для публикации этих Actions наружу используйте
[`definePorts.forward`](/reference/component-sfc#forward-повторная-публикация-портов-локальных-компонентов).

`label` и `input` вычисляются при открытии меню. Поэтому допустимы `:label="t(...)"`
и безопасные SFC expressions; для заголовка доступен обычный Table context.

| Контракт | Значение |
| --- | --- |
| Placement | Ровно один прямой child `Table`. |
| Children | Только `MenuItem` и `MenuSeparator`. |
| Attributes | Собственных attributes в v1 нет. |

Если `Table` содержит `column-menu="disabled"`, inline descriptor не используется.

Режимы открытия, context и intrinsic Actions описаны в
[«Меню заголовков колонок»](/sfc-tables/column-header-menu).
