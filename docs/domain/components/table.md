# Table

`Table` отображает локальную коллекцию строк. Колонки объявляются прямыми
дочерними тегами [Column](./column), а пользовательское содержимое ячейки —
через [Cell](./cell).

```vue
<Table :rows="rows" row-key="id">
  <Column key="number" title="Номер" sortable />
  <Column key="status" title="Статус">
    <Cell><Badge>{{ value }}</Badge></Cell>
  </Column>
</Table>
```

Тег renderer-neutral: Component SFC описывает один контракт, а активный
UI-адаптер выбирает конкретный grid renderer. Детальные сценарии собраны в
разделе [«Таблицы SFC»](/sfc-tables/).

## Атрибуты

| Атрибут | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `rows` / `:rows` | массив / выражение | `[]` | Полная локальная коллекция строк. |
| `row-key` / `rowKey` | string | `id` | Поле со стабильной identity строки. |
| `selection-mode` / `selectionMode` | `none` / `single` / `multiple` | `none` | Режим выбора строк. |
| `selection-trigger` / `selectionTrigger` | `auto` / `control` / `row` / `both` | `auto` | Каким взаимодействием изменяется selection. |
| `cell-selection-mode` / `cellSelectionMode` | `none` / `single` | `none` | Независимый режим выбора конкретной ячейки. |
| `id` / `tableId` | string | — | Стабильный ключ сохраняемого состояния. |
| `paging` | `pages` / `virtual` | `pages` | Страницы или единый виртуальный список. |
| `page-size` / `pageSize` | number | `10` | Размер локальной страницы. |
| `page-sizes` / `pageSizes` | string / number[] | `10,25,50,100` | Доступные размеры страницы. |
| `lazy` | boolean | `false` | Зарезервированный признак будущей серверной загрузки. |
| `row-size` / `rowSize` | number | `40` | Расчётная высота строки для виртуализации. |
| `width` / `w` | number / string | `100%` | Ширина таблицы. |
| `height` / `h` | number / string | доступная высота | Высота таблицы. |
| `minHeight` / `minH` | number / string | `180px` | Минимальная высота таблицы. |
| `theme` | string | зависит от адаптера | Renderer-specific подсказка темы. |
| `sort-mode` / `sortMode` | `multiple` / `single` / `fixed` / `disabled` | `multiple` | Режим сортировки. |
| `default-sort` / `defaultSort` | string | — | Начальная сортировка `column:direction`. |
| `column-pin` / `columnPin` | `enabled` / `disabled` | `enabled` | Разрешает runtime-закрепление колонок. |
| `default-pin` / `defaultPin` | string | — | Начальное закрепление `column:left/right`. |
| `default-hidden` / `defaultHidden` | string | — | Изначально скрытые колонки через запятую. |
| `column-menu` | `default` / `disabled` | `default` | Встроенное меню заголовков. |
| `cell-align` / `cellAlign` | `left` / `center` / `right` | `left` | Горизонтальное выравнивание ячеек. |
| `cell-vertical-align` / `cellVerticalAlign` | `top` / `middle` / `bottom` | `middle` | Вертикальное выравнивание ячеек. |

Прямыми дочерними элементами могут быть:

- любое число [Column](./column);
- не более одного [ColumnMenu](./column-menu);
- не более одного табличного [CellMenu](./row-menu); `RowMenu` — deprecated alias.

## Смысловые события

`Table` публикует `rowActivated`, `rowContextMenuRequested`,
`selectionChanged`, `cellSelectionChanged`, `sortChanged`, `columnVisibilityChanged`,
`columnPinChanged`, `columnOrderChanged`, `columnSizeChanged` и `pageChanged`.

Payload, отличие от браузерных событий и способы публикации наружу описаны в
[«События, порты и Actions»](/sfc-tables/events-and-actions).

## Browser events ячейки

Нативный жест конкретной ячейки настраивается на [`Cell`](./cell), а не на
структурной `Column`. `Cell :on` поддерживает Shift/Ctrl/Alt/Meta, удерживаемые
физические клавиши, mouse button и модификаторы поведения события. Reaction
получает `row`, `rowIndex`, `rowKey`, `columnKey`, `value` и snapshot `event()`.

В Visual editor откройте колонку и блок «Обработка событий ячейки». Если в Source
ещё нет явного `Cell`, редактор создаст его и сохранит прежнее содержимое колонки.

## Подробные руководства

- [данные, строки и ячейки](/sfc-tables/data-rows-cells);
- [выбор строк, ячеек и активация](/sfc-tables/selection-and-activation);
- [пейджинг и виртуализация](/sfc-tables/paging-and-virtualization);
- [контекстное меню ячеек](/sfc-tables/row-context-menu);
- [меню заголовков колонок](/sfc-tables/column-header-menu);
- [редактирование ячеек](/sfc-tables/cell-editing);
- [адаптеры и ограничения](/sfc-tables/adapters-and-limitations).
