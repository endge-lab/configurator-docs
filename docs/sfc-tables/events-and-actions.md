# События, порты и Actions

Table использует два независимых контракта:

- **Event** сообщает, что уже произошло;
- **Action** описывает вызываемое поведение с одним runtime provider.

## Смысловые Events

| Event | Основной payload |
| --- | --- |
| `rowActivated` | строка, колонка, pointer/keyboard activation |
| `rowContextMenuRequested` | строка, колонка, screen anchor |
| `selectionChanged` | полный selection и added/removed identities |
| `sortChanged` | упорядоченный массив sort descriptors |
| `columnVisibilityChanged` | visibility map и скрытые ключи |
| `columnPinChanged` | ключи слева и справа |
| `columnOrderChanged` | текущий порядок колонок |
| `columnSizeChanged` | карта размеров и изменённая колонка |
| `pageChanged` | индекс, размер и число страниц |

Все payload содержат `tableId`. DOM Event не выходит за границу renderer-а.

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
