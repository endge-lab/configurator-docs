# Меню заголовков колонок

`ColumnMenu` описывает одно меню, применяемое ко всем заголовкам Table.

```vue
<Table
  ref="orders"
  :rows="rows"
  column-pin="enabled"
  sort-mode="multiple"
>
  <ColumnMenu>
    <MenuItem action="table.sort.setColumnAsc" label="По возрастанию" />
    <MenuItem action="table.sort.setColumnDesc" label="По убыванию" />
    <MenuItem action="table.sort.clearColumn" label="Сбросить сортировку" />
    <MenuSeparator />
    <MenuItem action="table.column.pinLeft" label="Закрепить слева" />
    <MenuItem action="table.column.pinRight" label="Закрепить справа" />
    <MenuItem action="table.column.unpin" label="Не закреплять" />
    <MenuSeparator />
    <MenuItem action="table.column.hide" label="Скрыть" />
  </ColumnMenu>

  <Column key="number" title="Номер" sortable pinnable />
  <Column key="status" title="Статус" />
</Table>
```

## Режимы

| Режим | Источник |
| --- | --- |
| `default` | Встроенное меню активного адаптера |
| `inline` | Прямой дочерний `ColumnMenu` |
| `disabled` | `column-menu="disabled"`; меню не открывается |

Наличие `ColumnMenu` переводит descriptor в `inline`. Если одновременно задан
`column-menu="disabled"`, inline descriptor не используется.

## Контекст заголовка

Intrinsic Actions получают `TableColumnActionContext`: identity и индекс
колонки, возможность hide/pin/sort, текущее и исходное закрепление, текущее
направление сортировки и target конкретного экземпляра Table.

Пункты автоматически отключаются через `canExecute`. Например,
`table.column.unpin` недоступен для незакреплённой колонки, а sort Actions — для
несортируемой колонки или `sort-mode="fixed"`.

## Открытие меню

Адаптер может открывать меню правой кнопкой на заголовке или через доступный
header control. Конкретный жест является renderer detail; состав меню и Action
identities остаются одинаковыми.

::: warning Ограничение v1
`ColumnMenu` должен быть прямым child `Table`. Разные inline-меню внутри
отдельных `Column` пока не поддерживаются. Различия реализуются через
`canExecute` и контекст текущей колонки.
:::
