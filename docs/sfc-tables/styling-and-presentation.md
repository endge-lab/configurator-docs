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

## Стили selection

Все обязательные адаптеры публикуют одинаковые CSS custom properties:

| Переменная | Что меняет | Значение по умолчанию |
| --- | --- | --- |
| `--endge-table-selection` | Заливка выбранной строки в `single` | синяя полупрозрачная заливка |
| `--endge-table-multiple-selection` | Заливка строк в `multiple` | fallback на `--endge-table-selection` |
| `--endge-table-selection-marker` | Маркер выбранной строки слева | `#3b82f6` |
| `--endge-table-cell-selection` | Заливка выбранной ячейки | `rgba(59, 130, 246, 0.2)` |
| `--endge-table-cell-selection-color` | Цвет текста выбранной ячейки | `inherit` |
| `--endge-table-cell-selection-outline` | Внутренний outline ячейки | `#3b82f6` |

Переменные можно назначить конкретному `id` или стабильному authored-классу.
Они наследуются внутренними surfaces, поэтому не зависят от RevoGrid, TanStack
или AODB DataTable:

```vue
<Table
  id="orders"
  class="operations-table"
  :rows="rows"
  selection-mode="multiple"
  selection-trigger="both"
  cell-selection-mode="single"
>
  <Column key="number" title="Номер" />
  <Column key="status" title="Статус" />
</Table>

<style scoped lang="endgecss">
#orders {
  --endge-table-selection: rgba(14, 165, 233, 0.16);
  --endge-table-multiple-selection: rgba(168, 85, 247, 0.2);
  --endge-table-selection-marker: #7c3aed;
}

.operations-table {
  --endge-table-cell-selection: rgba(245, 158, 11, 0.24);
  --endge-table-cell-selection-color: #78350f;
  --endge-table-cell-selection-outline: #f59e0b;
}
</style>
```

Для более точных правил доступны semantic states на `::part(cell)`:

| State | Поверхность |
| --- | --- |
| `selected` | Любая выбранная row/cell surface |
| `row-selected` | Ячейки выбранной строки |
| `multi-selected` | Ячейки строк в `selection-mode="multiple"` |
| `cell-selected` | Только конкретная выбранная ячейка |

Если строка и её ячейка выбраны одновременно, cell surface содержит оба
состояния: `row-selected` и `cell-selected`. Сначала применяется заливка строки,
затем заливка и outline конкретной ячейки.

```endgecss
/* Отдельное оформление нескольких выбранных строк. */
#orders:state(multi-selected)::part(cell) {
  --endge-table-multiple-selection: rgba(236, 72, 153, 0.18);
  font-weight: 600;
}

/* Оформление только выбранной ячейки. */
#orders:state(cell-selected)::part(cell) {
  --endge-table-cell-selection: #fef3c7;
  --endge-table-cell-selection-color: #78350f;
  --endge-table-cell-selection-outline: #f59e0b;
}
```

Не используйте `.rgRow`, классы shadcn или TanStack: они являются деталями
адаптера и не входят в публичный контракт.

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
