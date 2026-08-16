# Выбор и активация строк

Selection и activation — разные механики. Selection хранит текущий набор строк,
а activation сообщает о намерении открыть или выполнить основное действие.

```vue
<Table
  ref="orders"
  :rows="rows"
  row-key="id"
  selection-mode="multiple"
  selection-trigger="both"
>
  <Column key="number" title="Номер" />
  <Column key="status" title="Статус" />
</Table>
```

## Режимы selection

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
