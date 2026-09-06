# Контекстные переменные Component SFC

Переменные с префиксом `$` создаёт платформа во время исполнения. Их не нужно и
нельзя объявлять в `script setup`. Префикс отличает runtime-контекст от обычных
пользовательских bindings.

| Имя | Где доступно | Форма |
| --- | --- | --- |
| `$table` | Table и его ячейки/меню | `{ id, runtimeId, state }` |
| `$row` | ячейка и `CellMenu` | `{ id, index, data }` |
| `$column` | ячейка и `CellMenu` | `{ key, index, title, metadata }` |
| `$cell` | ячейка и `CellMenu` | `{ value }` |
| `$context` | Component SFC | глобальный синхронизируемый context приложения |
| `$data` | Component SFC template | read-only API метаданных входных данных |
| `props` | Component SFC | входные props конкретного экземпляра компонента |

```vue
<MenuItem
  v-if="$row.data.status === 'draft' && $context.features.publish"
  :disabled="!props.editable || $table.state.selectedRowIds.length > 1"
  action="order.publish"
  :input="{
    orderId: $row.id,
    field: $column.key,
    previousValue: $cell.value,
  }"
/>
```

`$row.data` всегда содержит исходную строку. Платформа намеренно не поднимает её
поля на `$row`: запись `$row.status` неоднозначна и не поддерживается.

`$column.metadata` — renderer-neutral metadata текущей колонки. `$table.state`
содержит только публичное состояние адаптера; для контекстного меню гарантирован
`selectedRowIds`. В контекст не копируются все строки и ячейки таблицы.

## Метаданные входных данных

`$data.metaOf(reference, namespace?)` реактивно читает Raph Meta-plane того
`DataPath`, из которого получено входное значение. Первый аргумент является
ссылкой, а не уже вычисленным primitive:

```vue
<Text
  :value="row.flightCarrier"
  :class="{
    'is-waiting': $data.metaOf(row.flightCarrier, 'aodb.optimistic')?.status === 'waiting',
  }"
>
  {{ row.flightCarrier }}
</Text>
```

Без второго аргумента возвращается объект всех namespaces:

```vue
{{ $data.metaOf(props.flight.status).validation?.message }}
```

Разрешены статические ссылки на `props.foo`, прямой prop alias `foo`,
`row.field` и `$row.data.field`. Произвольные результаты функций и динамический
namespace запрещены: compiler должен заранее построить Meta subscription.

Обычные props остаются plain JavaScript values. Физический DataPath передаётся
runtime отдельно и недоступен Source. Если Composition преобразовала коллекцию
через DataView, она должна явно сохранить provenance через `.metaFrom(...)`;
иначе `$data.metaOf(...)` вернёт `undefined`.

## Область видимости

- `$table` доступен внутри `Table`.
- `$row`, `$column` и `$cell` появляются только там, где существует конкретная
  ячейка: в её содержимом и при материализации `CellMenu`.
- `$context` и `props` принадлежат экземпляру Component SFC и не зависят от
  таблицы.
- `$data` доступен во всём template, но конкретное чтение требует Raph-backed
  prop и известную provenance-ссылку.

Старые `row`, `rowId`, `rowIndex`, `columnKey`, `columnMeta` и `value` пока
сохраняются как compatibility aliases. Для нового Source используйте `$`-форму.

## Пользовательские вычисления

Если выражение становится сложным, подготовьте данные в `props`/`$context` либо
вынесите эффект в Action своего репозитория. `action="..."` принимает внешнюю
identity, поэтому пользователь не ограничен списком встроенных вычислений
конфигуратора.
