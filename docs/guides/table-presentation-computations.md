# Условное представление таблиц

В таблице данные, правила представления и renderer разделены:

```text
DataView → нормализованные данные
Column metadata → статические настройки колонки
Computation → semantic presentation
Component SFC → явная передача результата visual-компоненту
UI-адаптер → тема и конкретный renderer
```

DataView не должен возвращать CSS, DOM classes или hex-цвета. Computation не
знает о grid-библиотеке и возвращает только renderer-neutral значения.

## Контракт правил

`table-cell-conditional-presentation` принимает:

```ts
interface TableCellConditionalPresentationInput {
  row?: Record<string, unknown>
  value?: unknown
  columnKey?: string
  rules?: TableCellPresentationRules
}
```

Правила удобно хранить в metadata конкретной `Column`:

```vue
<Column
  key="priority"
  :metadata="{
    'endge.table.cell-presentation': {
      version: 1,
      branches: [
        {
          when: {
            source: 'value',
            operator: 'gte',
            value: 8,
          },
          then: {
            backgroundTone: 'warning',
            fontWeight: 'bold',
          },
        },
      ],
      else: {
        backgroundTone: 'default',
      },
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

Branches проверяются по порядку. Применяется первый совпавший `then`; при
отсутствии совпадений используется `else`.

## Условия

Один predicate имеет форму:

```ts
{
  source?: 'row' | 'value'
  path?: string
  operator:
    | 'eq' | 'not-eq'
    | 'contains' | 'not-contains'
    | 'starts-with' | 'ends-with'
    | 'gt' | 'gte' | 'lt' | 'lte'
    | 'exists' | 'not-exists'
  value?: unknown
}
```

Условия можно объединять:

```ts
{ all: [conditionA, conditionB] }
{ any: [conditionA, conditionB] }
{ not: condition }
```

`path` является dot-path. Сравнение строк регистрозависимо. `contains` для
массива проверяет точное наличие элемента.

## Результат

```ts
interface TableCellAppearancePatch {
  backgroundTone?: string
  textTone?: string
  fontWeight?: 'normal' | 'semibold' | 'bold'
  fontStyle?: 'normal' | 'italic'
  meta?: Record<string, unknown>
}
```

Visual-компонент применяет semantic props через текущую тему. Metadata и
Computation не должны содержать CSS или цвета конкретного бренда.

## Подключение Computation

Общий computation не вызывается автоматически для каждой ячейки встроенного
`Table`. Конкретный cell component объявляет required port и передаёт контекст:

```ts
const props = defineProps<TableCellConditionalPresentationInput>()

const ports = definePorts({
  require: {
    presentation: computation<
      TableCellConditionalPresentationInput,
      TableCellAppearancePatch
    >({
      default: 'table-cell-conditional-presentation',
    }),
  },
})

const presentation = ports.require.presentation(props)
```

```vue
<StatusValue :value="value" :presentation="presentation.value" />
```

Default implementation принадлежит required port. Metadata содержит только
versioned настройки и не выбирает provider. Родительская Table-ячейка передаёт
этому cell component `row`, `value`, `columnKey` и выбранный namespace
`columnMeta` обычными props.

## Runtime-граница

```text
Column.metadata
  → ProgramArtifact.metadata.nodes
  → Table columnMeta
  → явный prop cell component
  → required Computation port
  → semantic visual props
```

Computation не выполняет Actions, не изменяет Store и не выбирает renderer.
Подробности о Table surfaces и metadata находятся в
[«Стили и представление»](/sfc-tables/styling-and-presentation).
