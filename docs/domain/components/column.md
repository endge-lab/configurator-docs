# Column

`Column` описывает одну видимую колонку [Table](./table). Без `Cell` renderer
читает значение по `key`; с `Cell` используется custom template.

```vue
<Column key="number" title="Flight" width="120" sortable />

<Column
  key="std"
  title="STD"
  sortable
  sort="date"
  sort-by="std"
  pinnable
  align="center"
>
  <Cell>
    <DateTime :value="row.std" format="HH:mm" />
  </Cell>
</Column>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `key` | string | Column identity и default row path. |
| `title` | string | Header. |
| `width` / `size` | number/string | Column width. |
| `sortable` | boolean | Разрешает sorting. |
| `sort` | `natural` / `date` / `number` | Comparator. |
| `sort-by` | string | Один или несколько comma-separated row paths. |
| `pinnable` | boolean/string | Можно ли закреплять колонку; default `true`. |
| `align` / `cell-align` | string | Horizontal cell alignment. |
| `valign` / `cell-vertical-align` | string | Vertical cell alignment. |
| `:metadata` | static object | Namespaced metadata конкретной колонки. |

Допускается не более одного прямого [Cell](./cell). `ColumnMenu` внутри Column в
v1 не поддерживается: меню размещается непосредственно внутри Table.

## Metadata колонки

`Column` поддерживает статическую JSON-совместимую metadata:

```vue
<Column
  key="fueling"
  :metadata="{
    'groundhandling.process': {
      version: 1,
      displayMode: 'active',
      criticality: 'critical',
      targetPrefix: true,
      actualPrefix: false,
    },
  }"
>
  <GroundHandlingProcess
    :process="value"
    :settings="columnMeta['groundhandling.process']"
    :now="now"
  />
</Column>
```

Верхние ключи являются namespaces consumer-ов. Контракт каждого namespace
версионируется независимо.

Metadata компилируется в `ProgramArtifact.metadata.nodes` вместе со стабильным
`nodeId`, типом `Column` и пользовательским `key`. `Table` предоставляет всю
карту namespaces в cell context как `columnMeta`. Она не превращается в props
дочернего компонента автоматически: автор ячейки явно выбирает namespace,
например `columnMeta['groundhandling.process']`.

В cell context доступны:

| Local | Назначение |
| --- | --- |
| `row` | Текущая строка |
| `rowIndex` / `rowKey` | Индекс и identity строки |
| `columnKey` | Identity колонки |
| `columnMeta` | Compiled metadata текущей `Column` |
| `value` | `row[columnKey]` |

`columnMeta` доступна только внутри содержимого `Column` / `Cell`. В header и за
пределами `Table` этого local нет.

Для условного представления доступны два контракта:

- `groundhandling.process` — настройки `GroundHandlingProcess`;
- `endge.table.cell-presentation` — общие branches условного представления
  внешней ячейки.

Подробности: [вычисления представления таблиц](/guides/table-presentation-computations)
и [общий контракт metadata](/reference/metadata).
