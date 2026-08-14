# Стили и представление

Table не раскрывает классы RevoGrid, TanStack или другой grid-библиотеки.
EndgeCSS работает с renderer-neutral surfaces.

## Публичные части

- `::part(grid)` — вся таблица;
- `::part(header)` — область заголовков;
- `::part(header-cell)` и `::part(header-content)` — колонка заголовка;
- `::part(body)` — viewport строк;
- `::part(row)` — строка;
- `::part(cell)` и `::part(cell-content)` — ячейка;
- `::part(group-row)` — зарезервированная поверхность группировки.

```vue
<template>
  <Table id="orders" :rows="rows">
    <Column key="number" title="Номер" />
    <Column key="status" title="Статус" />
  </Table>
</template>

<style scoped lang="endgecss">
#orders::part(header-cell) {
  background-color: surface-accent;
  font-weight: 600;
}
</style>
```

Используйте semantic tokens темы, а не renderer-specific selectors.

## Metadata колонки

Статическая `Column.metadata` компилируется в
`ProgramArtifact.metadata.nodes`. Внутри ячейки она доступна как `columnMeta`:

```vue
<Column
  key="priority"
  :metadata="{
    'endge.table.cell-presentation': {
      version: 1,
      branches: [
        {
          when: { source: 'value', operator: 'gte', value: 8 },
          then: { backgroundTone: 'warning', fontWeight: 'bold' },
        },
      ],
    },
  }"
>
  <Cell>
    <PriorityValue
      :value="value"
      :rules="columnMeta['endge.table.cell-presentation']"
    />
  </Cell>
</Column>
```

Metadata не становится prop вложенного компонента автоматически: namespace
выбирается явно.

## Computation

DataView должен возвращать данные, а не CSS и hex-цвета. Computation получает
`row`, `value`, `columnKey` и правила, затем возвращает semantic presentation:
`backgroundTone`, `textTone`, `fontWeight` или `fontStyle`. Visual-компонент
сопоставляет эти значения с текущей темой.

Общий `table-cell-conditional-presentation` не вызывается автоматически для
каждой ячейки. Его подключает конкретный cell component через required port.
Полное описание: [условное представление таблиц](/guides/table-presentation-computations).
