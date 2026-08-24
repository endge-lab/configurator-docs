# Выбор строк, ячеек и активация

Selection и activation — разные механики. Selection хранит текущий набор строк,
а activation сообщает о намерении открыть или выполнить основное действие.

```vue
<Table
  ref="orders"
  :rows="rows"
  row-key="id"
  selection-mode="multiple"
  selection-trigger="both"
  cell-selection-mode="single"
>
  <Column key="number" title="Номер" />
  <Column key="status" title="Статус" />
</Table>
```

## Выделение строк

| Режим | Поведение |
| --- | --- |
| `none` | Строки не выбираются |
| `single` | В selection может находиться только одна строка |
| `multiple` | В selection может находиться несколько строк |

Способ изменения selection задаёт отдельный атрибут `selection-trigger`:

| Значение | Поведение |
| --- | --- |
| `auto` | Используется стандартный UX активного адаптера |
| `control` | Selection меняется только control-элементом в левой колонке |
| `row` | Selection меняется кликом или `Space` на строке |
| `both` | Доступны control и взаимодействие со строкой |

При `multiple` control отображается как checkbox, а при `single` — как
одиночный переключатель. Header checkbox в `multiple` меняет выбор строк
текущей страницы или текущего видимого набора. `selection-mode="none"`
отключает selection независимо от trigger.

Для `row` и `both` обычный клик в `multiple` начинает новый selection,
Cmd/Ctrl переключает строку, а Shift выбирает диапазон. `Space` выполняет то же
действие с клавиатуры. Для `control` используется стандартная клавиатурная
семантика checkbox или radio. Если строка исчезает из `rows`, runtime удаляет
её из selection и публикует изменение.

Shift выбирает диапазон в текущем отображаемом наборе: внутри текущей страницы
для `paging="pages"` и во всей отсортированной коллекции для `paging="virtual"`.

`selectionChanged` содержит полный новый selection и delta:

```ts
{
  tableId: string
  mode: 'single' | 'multiple'
  selectedRowIds: string[]
  selectedRows: Record<string, unknown>[]
  addedRowIds: string[]
  removedRowIds: string[]
}
```

Selection живёт только внутри смонтированного Table и не входит в сохраняемое
состояние. Для долгоживущего бизнес-выбора обработайте Event и сохраните identity
во внешнем Store.

Control и строка не создают два независимых selection. При любом trigger
выбранные строки получают одинаковое смысловое и визуальное состояние:
`aria-selected`, selected-стиль, `selectionChanged` и доступность групповых
Actions. Конкретные цвета hover и selected задаются темой или CSS активного
адаптера.

## Выбор одной ячейки

Выбор конкретной ячейки включается отдельным атрибутом
`cell-selection-mode="single"`:

```vue
<Table
  id="orders"
  ref="orders"
  :rows="rows"
  row-key="id"
  selection-mode="multiple"
  selection-trigger="both"
  cell-selection-mode="single"
>
  <Column key="number" title="Номер" />
  <Column key="status" title="Статус" />
</Table>
```

| Режим | Поведение |
| --- | --- |
| `none` | Ячейки не выбираются; значение по умолчанию |
| `single` | В Table находится одна выбранная ячейка |

Identity ячейки состоит из стабильного `rowId` и `columnKey`. Выбор сохраняется
при сортировке, смене страницы и виртуализации. Если строка или колонка исчезает,
runtime очищает выбор и публикует новое событие.

Выбор строк и выбор ячейки независимы. Оба режима можно включить одновременно:

| Row selection | Cell selection | Клик по обычной области ячейки |
| --- | --- | --- |
| `none` | `single` | Выбирается только ячейка |
| `single` | `single` | Выбираются ячейка и её строка |
| `multiple` | `single` | Обычный клик заменяет набор строк её строкой; Cmd/Ctrl добавляет строку; выбранная ячейка остаётся одна |

Совместное изменение строки выполняется только при `selection-trigger="row"`
или `both`. При `control` клик меняет ячейку, а строки по-прежнему выбираются
только control-элементами. Shift сохраняет диапазонный выбор строк.

Клик по обычной области ячейки и клавиши `Enter`/`Space` выбирают ячейку.
Интерактивные элементы внутри неё — input, button, link, select, editor —
обрабатывают своё действие и не меняют выбор автоматически.

Выбранная ячейка внутри выбранной строки получает одновременно semantic states
`row-selected` и `cell-selected`. Это позволяет отдельно стилизовать строку и
поверх неё — конкретную ячейку.

`cellSelectionChanged` содержит новое и предыдущее значение:

```ts
type SelectedCell = {
  rowId: string
  rowIndex: number
  row: Record<string, unknown>
  columnKey: string
  value: unknown
}

type CellSelectionChanged = {
  tableId: string
  selectedCell: SelectedCell | null
  previousCell: SelectedCell | null
}
```

Настройка цветов, outline и semantic states описана в разделе
[Стили и представление](/sfc-tables/styling-and-presentation).

## Сброс через Escape

Когда фокус находится на строке, ячейке или поверхности Table, `Escape`
очищает и выбранные строки, и выбранную ячейку. Фокус остаётся внутри таблицы.
Если selection уже пуст, Events не публикуются.

Вложенный интерактивный элемент имеет приоритет: editor сначала отменяет
редактирование, menu закрывается, а input/select/button не передают свою
обработанную клавишу общей очистке Table. Настройка этой клавиши пока не
предусмотрена.

При очистке публикуются только реально изменившиеся Events:
`selectionChanged` с пустыми `selectedRowIds` и `cellSelectionChanged` с
`selectedCell: null`. Полный каталог payload находится в разделе
[События, порты и Actions](/sfc-tables/events-and-actions).

## Activation

Двойной клик или `Enter` публикует `rowActivated`:

```ts
{
  tableId: string
  rowId: string
  rowIndex: number
  row: Record<string, unknown>
  columnKey: string | null
  activation: 'pointer' | 'keyboard'
}
```

Event ничего не открывает сам. Component SFC может связать его с Action или
переопубликовать наружу через `definePorts`.

::: info Контекстное меню
Правый клик публикует отдельный `rowContextMenuRequested` и не изменяет
selection. Это предотвращает неявную смену выбранных строк перед выполнением
menu Action.
:::
