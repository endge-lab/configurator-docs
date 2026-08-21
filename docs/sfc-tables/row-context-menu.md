# Контекстное меню ячеек

`CellMenu` объявляет меню, которое открывается правым кликом по ячейке. Браузерное
контекстное меню подавляется. Состав принадлежит Component SFC, а эффект пунктов —
Action providers runtime-а.

## Меню таблицы по умолчанию

```vue
<Table ref="orders" id="orders" :rows="props.rows" row-key="id">
  <CellMenu>
    <MenuItem
      v-if="$row.data.status !== 'archived'"
      action="order.open"
      label="Открыть"
      :input="{ id: $row.data.id, field: $column.key }"
    />
    <MenuSeparator />
    <MenuItem
      action="order.delete"
      label="Удалить"
      :disabled="!$row.data.canDelete"
      :input="{ id: $row.data.id, value: $cell.value }"
    />
  </CellMenu>

  <Column key="number" title="Номер" />
  <Column key="status" title="Статус" />
</Table>
```

`v-if` полностью скрывает пункт. `:disabled` оставляет его видимым, но запрещает
выполнение. После фильтрации runtime убирает начальные, конечные и повторяющиеся
разделители.

## Переопределение в колонке

`Column > CellMenu` полностью заменяет табличное меню для ячеек этой колонки.
Это не merge: порядок и состав переопределения остаются очевидными в Source.

```vue
<Table :rows="props.rows" row-key="id">
  <CellMenu>
    <MenuItem action="order.open" label="Открыть" :input="{ id: $row.id }" />
  </CellMenu>

  <Column key="number" title="Номер" />

  <Column key="status" title="Статус">
    <CellMenu>
      <MenuItem
        v-if="$row.data.status === 'draft'"
        action="order.publish"
        label="Опубликовать"
        :disabled="!$context.permissions.canPublish"
        :input="{ id: $row.id }"
      />
    </CellMenu>
  </Column>

  <Column key="system" title="Система" cell-menu="none" />
</Table>
```

Приоритет: `Column > CellMenu` → `Table > CellMenu` → меню отсутствует.
`cell-menu="none"` на колонке явно останавливает fallback.

## Контекст выражений

Условия, `label` и `input` вычисляются в момент открытия и получают один снимок
[`$table`, `$row`, `$column`, `$cell`, `$context` и `props`](./context-variables).
Сложное состояние можно заранее передать через `props` или `$context`, а эффект
вынести в Action своего репозитория: конфигуратор не ограничивает Action identity.

## Action context

Action получает renderer-neutral контекст ячейки. Для совместимости `surface`
пока остаётся `table-row`, а прежние плоские поля сохраняются.

```ts
{
  surface: 'table-row'
  table: { id, runtimeId, state }
  rowContext: { id, index, data }
  column: { key, index, title, metadata }
  cell: { value }

  // compatibility aliases
  row, rowId, rowIndex, columnKey, value
}
```

DOM event и координаты не входят в Action input. Они используются только для
позиционирования меню. Проверка прав на backend остаётся обязательной:
`v-if` и `disabled` управляют интерфейсом, а не безопасностью.

## Совместимость

`Table > RowMenu` продолжает работать как deprecated alias табличного
`CellMenu`. Новый Source и визуальный редактор создают `CellMenu`.

Независимо от наличия меню публикуется `rowContextMenuRequested` с данными строки,
колонки и `anchor: { x, y }`. Правый клик не меняет selection.
