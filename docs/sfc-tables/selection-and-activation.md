# Выбор и активация строк

Selection и activation — разные механики. Selection хранит текущий набор строк,
а activation сообщает о намерении открыть или выполнить основное действие.

```vue
<Table
  ref="orders"
  :rows="rows"
  row-key="id"
  selection-mode="multiple"
>
  <Column key="number" title="Номер" />
  <Column key="status" title="Статус" />
</Table>
```

## Режимы selection

| Режим | Поведение |
| --- | --- |
| `none` | Строки не выбираются |
| `single` | Клик выбирает одну строку |
| `multiple` | Cmd/Ctrl переключает строку, Shift выбирает диапазон |

Обычный клик в `multiple` начинает новый selection. `Space` выполняет то же
действие с клавиатуры. Если строка исчезает из `rows`, runtime удаляет её из
selection и публикует изменение.

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
