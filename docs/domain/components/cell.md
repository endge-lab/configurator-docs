# Cell

`Cell` задаёт template содержимого [Column](./column). Runtime добавляет локальный
`row` текущей записи и сведения о row/column context.

```vue
<Table :rows="flights" row-key="id">
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
| `if`, `for` | directive | Standard Endge control flow внутри cell template. |
| Visual children | SFC nodes | Любые visual primitives и Component calls. |

`Cell` — structural tag без собственных визуальных атрибутов. Он должен быть
прямым ребёнком `Column`.

