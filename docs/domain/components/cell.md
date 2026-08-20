# Cell

`Cell` задаёт template содержимого [Column](./column). Runtime добавляет локальный
`row` текущей записи и сведения о row/column context.

```vue
<Table :rows="orders" row-key="id">
  <Column key="status" title="Status">
    <Cell>
      <Flex row gap="2" align="center">
        <Dot :tone="row.statusTone" />
        <Text>{{ row.status }}</Text>
      </Flex>
    </Cell>
  </Column>
</Table>
```

| Контракт | Тип | Назначение |
| --- | --- | --- |
| `row` | object | Текущая row в expressions. |
| `rowIndex` | number | Индекс строки в текущем Table runtime. |
| `rowKey` | unknown | Стабильная identity строки с исходным типом. |
| `columnKey` | string | Key текущей колонки. |
| `value` | unknown | Значение текущей ячейки. |
| `:on` | object / array | Условные browser events и последовательные reactions. |
| `if`, `for` | directive | Standard Endge control flow внутри cell template. |
| Visual children | SFC nodes | Любые visual primitives и Component calls. |

`Cell` должен быть прямым ребёнком `Column`. Для layout и содержимого он остаётся
структурной границей, но его renderer-owned поверхность ячейки поддерживает
browser events через `:on` и простой `@event`.

```vue
<Column key="flight" title="Рейс">
  <Cell
    :on.stop="{
      event: 'click',
      modifiers: { shift: true, exact: true },
      held: { code: ['KeyW'], exact: true },
      reaction: action({
        identity: 'flight.open',
        input: { rowId: rowKey, row, columnKey, event: event() },
      }),
    }"
  >
    <Text>{{ value }}</Text>
  </Cell>
</Column>
```

Обработчик создаётся для каждой runtime-ячейки и получает её локальный context.
`.stop` останавливает всплытие к строке Table; `.prevent`, `.self`, `.once`,
`.capture` и `.passive` имеют ту же семантику, что и на других visual tags.
Полный trigger-контракт описан в [«Условные взаимодействия `:on`»](./interactions).

Если trigger хранится в Configuration, а Query должен запускаться сразу без
режима редактирования, используйте ссылочную форму:

```vue
<Cell
  :on="{
    triggers: $context.config.groundHandling.actualTimeTriggers,
    reaction: query({
      identity: 'groundHandling.actualTime.update',
      input: {
        legId: row.arrivalLeg.id,
        value: now(),
      },
    }),
  }"
>
  <Text>{{ value }}</Text>
</Cell>
```

Такой `:on` не включает `editable`: он выполняет Query непосредственно после
совпадения одного из effective triggers.

Полный список locals и правила row identity описаны в
[«Данные, строки и ячейки»](/sfc-tables/data-rows-cells).
