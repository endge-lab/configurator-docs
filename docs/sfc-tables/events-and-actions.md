# События, порты и Actions

Table использует два независимых контракта:

- **Event** сообщает, что уже произошло;
- **Action** описывает вызываемое поведение с одним runtime provider.

## Полный каталог Events

| Event | Payload type | Основные поля |
| --- | --- | --- |
| `rowActivated` | `TableRowActivatedEvent` | `rowId`, `rowIndex`, `row`, `columnKey`, `activation` |
| `rowContextMenuRequested` | `TableRowContextMenuRequestedEvent` | `rowId`, `rowIndex`, `row`, `columnKey`, `anchor` |
| `selectionChanged` | `TableSelectionChangedEvent` | `mode`, `selectedRowIds`, `selectedRows`, `addedRowIds`, `removedRowIds` |
| `cellSelectionChanged` | `TableCellSelectionChangedEvent` | `selectedCell`, `previousCell` |
| `sortChanged` | `TableSortChangedEvent` | `sort` |
| `columnVisibilityChanged` | `TableColumnVisibilityChangedEvent` | `visibility`, `hiddenColumnKeys` |
| `columnPinChanged` | `TableColumnPinChangedEvent` | `left`, `right` |
| `columnOrderChanged` | `TableColumnOrderChangedEvent` | `columnKeys` |
| `columnSizeChanged` | `TableColumnSizeChangedEvent` | `sizes`, `changedColumnKey` |
| `pageChanged` | `TablePageChangedEvent` | `pageIndex`, `pageSize`, `pageCount` |

Все payload содержат `tableId`. DOM Event не выходит за границу renderer-а.
Этот каталог является общим для Configurator, compiler и всех Table adapters:
те же Events отображаются в выпадающем списке раздела Table → «События» и в
каталоге built-in Events.

## Контекст выделения строк и ячейки

`selectionChanged` публикует полный актуальный набор строк и delta одного
перехода:

```ts
type TableSelectionChangedEvent = {
  tableId: string
  mode: 'single' | 'multiple'
  selectedRowIds: string[]
  selectedRows: Record<string, unknown>[]
  addedRowIds: string[]
  removedRowIds: string[]
}
```

`cellSelectionChanged` содержит контекст новой и предыдущей ячейки. При сбросе
`selectedCell` равен `null`:

```ts
type TableSelectedCell = {
  rowId: string
  rowIndex: number
  row: Record<string, unknown>
  columnKey: string
  value: unknown
}

type TableCellSelectionChangedEvent = {
  tableId: string
  selectedCell: TableSelectedCell | null
  previousCell: TableSelectedCell | null
}
```

Если row selection и cell selection включены вместе, один клик может
последовательно опубликовать оба Events. Они остаются независимыми: обработчик
строк получает полный row selection, а обработчик ячейки — её row/column/value
context. `Escape` публикует только те Events, для которых состояние действительно
изменилось.

## DOM и semantic Event

`contextmenu` на `Table` — общий браузерный Event области. Он не гарантирует,
что указатель находится над строкой, и имеет pointer payload.

`rowContextMenuRequested` — renderer-neutral событие строки с `row`, `rowId`,
`rowIndex`, `columnKey` и `anchor`. Для прикладной логики строки используйте его.

## Локальная реакция

```vue
<Table
  ref="orders"
  :rows="rows"
  @rowActivated="action({
    identity: 'order.open',
    input: { id: event('rowId') },
  })"
/>
```

Реакции на независимые selection Events:

```vue
<Table
  ref="orders"
  :rows="rows"
  selection-mode="multiple"
  selection-trigger="both"
  cell-selection-mode="single"
  @selectionChanged="action({
    identity: 'orders.selectionChanged',
    input: { ids: event('selectedRowIds') },
  })"
  @cellSelectionChanged="action({
    identity: 'orders.cellChanged',
    input: {
      rowId: event('selectedCell.rowId'),
      columnKey: event('selectedCell.columnKey'),
      value: event('selectedCell.value'),
    },
  })"
/>
```

Так как при очистке `selectedCell` равен `null`, прикладная Action должна
принимать nullable cell context либо проверять его перед обращением к полям.

## Публикация наружу

Один Event можно объявить явно:

```ts
const ports = definePorts({
  emits: {
    rowActivated: event<TableRowActivatedEvent>({
      from: { ref: 'orders', event: 'rowActivated' },
    }),
  },
})
```

Для публикации всего поддерживаемого контракта:

```ts
const ports = definePorts({
  forward: {
    from: 'orders',
    ports: {
      emits: '*',
      provides: '*',
    },
  },
})
```

`ref` должен быть literal и ссылаться на конкретный mounted Table. Forwarded
Action сохраняет target исходного экземпляра, поэтому две таблицы одного
Component SFC не смешивают состояние.

## Intrinsic Actions Table

| Группа | Actions |
| --- | --- |
| Sorting | `setColumnAsc`, `setColumnDesc`, `clearColumn`, `clearAll` |
| Pinning | `pinLeft`, `pinRight`, `unpin`, `resetPin`, `resetAllPins` |
| Visibility | `table.column.hide` |

Полные identities начинаются с `table.sort.*` или `table.column.*`. Их не нужно
повторно объявлять в `definePorts.provides`, чтобы использовать внутри
`ColumnMenu`. `forward` нужен только для публикации наружу.

Прикладные Actions объявляются отдельно. SFC владеет пунктом меню и Action
identity; application/runtime provider владеет эффектом, `canExecute`, диалогом,
Query и серверной авторизацией.
