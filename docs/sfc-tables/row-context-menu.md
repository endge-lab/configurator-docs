# Контекстное меню строк

`RowMenu` объявляет единое меню для всех строк Table. Состав меню принадлежит
Component SFC, а реальное поведение пунктов — Action providers runtime-а.

```vue
<Table ref="orders" id="orders" :rows="rows" row-key="id">
  <RowMenu>
    <MenuItem
      action="order.open"
      label="Открыть"
      icon="external-link"
      :input="{ id: row.id }"
    />
    <MenuSeparator />
    <MenuItem
      action="order.delete"
      :label="t('orders:delete', 'Удалить')"
      icon="trash"
      :input="{ id: row.id, row }"
    />
  </RowMenu>

  <Column key="number" title="Номер" />
  <Column key="status" title="Статус" />
</Table>
```

## Context меню

При открытии доступны `row`, `rowId`, `rowIndex`, `columnKey` и
`value`. `label` и `input` вычисляются в момент открытия, поэтому один descriptor
может зависеть от конкретной строки и ячейки.

`MenuItem.action` содержит стабильную Action identity. `input` является
отдельным выражением; форма `{ identity, message }` не поддерживается.

`rowId` является строковой runtime identity. Если бизнес-identity в данных имеет
другой тип, передавайте исходное поле из `row`, например `row.id`.

Runtime передаёт Action provider-у renderer-neutral `TableRowActionContext`:

```ts
{
  surface: 'table-row'
  tableId: string
  row: Record<string, unknown>
  rowId: string
  rowIndex: number
  columnKey: string
  value: unknown
}
```

DOM event и координаты не становятся Action input. Overlay использует их только
для размещения меню.

## Доступность пунктов

Перед показом и выполнением runtime вызывает `canExecute`. Если ни один пункт
нельзя выполнить, меню не открывается. Проверки прав на backend всё равно должны
выполняться сервером: `canExecute` управляет интерфейсом, а не безопасностью.

## Event открытия

Независимо от наличия inline `RowMenu` публикуется
`rowContextMenuRequested` с данными строки, колонки и `anchor: { x, y }`.
Правый клик не меняет selection.

Чтобы внешняя Composition могла подписаться на Event или Action, используйте
`forward` от literal `ref`. Подробности: [события, порты и Actions](./events-and-actions).
