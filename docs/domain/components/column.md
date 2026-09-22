# Column

`Column` описывает одну колонку [Table](./table). Без `Cell` renderer читает
значение по `key`; с [Cell](./cell) используется пользовательский template.

```vue
<Column key="number" title="Номер" width="120" sortable />

<Column
  key="createdAt"
  title="Создан"
  sortable
  sort="date"
  pinnable
>
  <Cell>
    <DateTime :value="value" format="dd.MM.yyyy HH:mm" />
  </Cell>
</Column>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `key` | string | Identity колонки и default row path |
| `title` / `name` | string | Заголовок |
| `width` / `size` | number / string | Начальная ширина |
| `sortable` | boolean | Разрешает runtime sorting |
| `sort` | `natural` / `text` / `number` / `date` / `time` / `boolean` | Comparator |
| `sort-by` / `sortBy` | string | Один или несколько comma-separated row paths |
| `pinnable` | boolean | Можно ли закреплять колонку; default `true` |
| `:metadata` | static object | Namespaced metadata колонки |

Допускается не более одного прямого `Cell`. `ColumnMenu` внутри `Column` в v1
не поддерживается: меню размещается непосредственно внутри `Table`.

## Metadata колонки

```vue
<Column
  key="priority"
  :metadata="{
    'endge.table.cell-presentation': {
      version: 1,
      branches: [
        {
          when: { source: 'value', operator: 'gte', value: 8 },
          then: { backgroundTone: 'warning' },
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

Metadata компилируется в `ProgramArtifact.metadata.nodes`. Внутри ячейки
доступны `row`, `rowKey`, `rowIndex`, `columnKey`, `columnMeta` и
`value`. Вложенный компонент получает только явно выбранный namespace.

Подробности:

- [данные, строки и ячейки](/sfc-tables/data-rows-cells);
- [управление колонками](/sfc-tables/column-management);
- [сортировка](/sfc-tables/sorting);
- [стили и условное представление](/sfc-tables/styling-and-presentation).
