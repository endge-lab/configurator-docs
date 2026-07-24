# Вычисления представления таблиц

В таблицах данные, правила представления и renderer разделены:

```text
DataView → нормализованные данные
Column metadata → настройки конкретной колонки
Computation → семантическое состояние
Component SFC / Table adapter → тема и визуал
```

DataView не должен возвращать CSS, цвета или выбранные для отображения точки.
Computation не форматирует дату и не знает о DOM. Renderer применяет semantic
tones через текущую тему.

## Готовые Computation

В домене доступны два документа:

| Identity | Назначение |
| --- | --- |
| `groundhandling-process-state` | Состояние внутренних target/actual-точек `GroundHandlingProcess` |
| `table-cell-conditional-presentation` | Общие правила представления внешней ячейки Table |

Оба документа используют canonical `defineComputation` source как граф
именованных этапов. Обычные преобразования собраны из ValueExpression, а
TypeScript оставлен только в узких узлах, которым не хватает текущих
декларативных примитивов.

## GroundHandlingProcess

### Metadata колонки

Настройки процесса ТГО принадлежат конкретной `Column`:

```vue
<Column
  key="deboarding"
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
    :process="row.arrivalLeg.groundHandling[code = 'Deboarding']"
    :settings="columnMeta['groundhandling.process']"
    :now="now"
  />
</Column>
```

`columnMeta` — runtime local ячейки, который `Table` получает из
`ProgramArtifact.metadata.nodes`. Выбор namespace остаётся явным: компонент не
получает всю metadata как неявный prop.

Контракт `groundhandling.process` v1:

| Поле | Тип | Default | Назначение |
| --- | --- | --- | --- |
| `version` | `1` | обязательно | Версия metadata-контракта |
| `displayMode` | `active` / `all` | `active` | Одна активная точка или все точки |
| `criticality` | `none` / `critical` / `half-critical` | `none` | Алгоритм оценки actual |
| `targetPrefix` | boolean | `false` | Добавлять первую букву code к target |
| `actualPrefix` | boolean | `false` | Добавлять первую букву code к actual |

`criticality` является enum, поэтому нельзя одновременно включить `critical` и
`half-critical`.

Текущее время не входит в metadata. Таблица принимает реактивный `now` от
владельца runtime и явно передаёт его компоненту:

```ts
defineProps<{
  rows: GroundHandlingRow[]
  now?: string
}>()
```

`groundhandling-tgo-page` объявляет тот же публичный prop и связывает его с
таблицей:

```ts
props: defineProps({
  now: field('String').default(''),
})

table: component('groundhandling-tgo-table').withProps({
  rows: fromData('db.tableTGO'),
  now: prop('now'),
})
```

В production владелец Composition должен обновлять `now` хотя бы раз в минуту.
Фиксированный `previewProps.now` предназначен только для воспроизводимого
Runtime Preview.

Скрытый `Date.now()` внутри Computation использовать нельзя: ресурс
пересчитывается по изменению входов, поэтому без реактивного clock значение
устареет. Если `now` не передан, actual-based правила продолжают работать, но
`target-overdue` не вычисляется.

### Вход вычисления

```ts
interface GroundHandlingProcessStateInput {
  process?: {
    id?: string | number
    code: string
    station?: string
    legId?: string
    points?: Array<{
      code: string
      order: number
      target?: GroundHandlingPointValue
      actual?: GroundHandlingPointValue
    }>
  }
  settings?: {
    displayMode?: 'active' | 'all'
    criticality?: 'none' | 'critical' | 'half-critical'
    targetPrefix?: boolean
    actualPrefix?: boolean
  }
  now?: string
}
```

`process.points` уже должен быть объединён и отсортирован DataView. Computation
не повторяет join target/actual.

Перед входом в TypeScript-этап декларативная часть нормализует необязательные
значения:

- отсутствующие `target` и `actual` становятся `null`;
- отсутствующий `activePoint` становится `null`;
- отсутствующий `now` становится `null`;
- для `code` и `order` применяются безопасные defaults.

Это обязательная sandbox-граница: TypeScript inputs должны быть полностью
JSON-compatible и не могут содержать `undefined`. Во входных данных компонента
`target` / `actual` по-прежнему могут отсутствовать; `null` используется только
в подготовленном состоянии Computation.

### Выход вычисления и исходные значения

Результат Computation является только presentation-проекцией. Для каждой
выбранной точки он возвращает стабильный `index`, префиксы, semantic appearance
и status. `target`, `actual`, комментарии и остальные бизнес-данные в результат
не копируются.

`groundHandlingProcess` использует `index`, чтобы прочитать отображаемые время и
tooltip непосредственно из исходного `process.points`. Поэтому замена
Computation через port может изменить выбор точки и оформление, но не может
подменить значение ячейки.

### Этапы графа

```text
settings
   └─ нормализация defaults и enum
points
   └─ чтение process.points
preparedPoints
   └─ index, prefixes и стабильная форма точки
activePoint
   └─ первая точка без actual или последняя завершённая
selectedPoints
   └─ active/all
evaluatedPresentation
   └─ date arithmetic, statuses и previousIndicator
state
   └─ итоговый публичный контракт
```

Только `evaluatedPresentation` является TypeScript-узлом. Остальные шесть
этапов компилируются в безопасный expression IR и могут быть напрямую
представлены визуальными блоками.

### Алгоритм

В `active` выбирается первая точка без `actual.value`. Если все точки завершены,
выбирается последняя. В `all` возвращаются все точки.

| Условие actual | Semantic result |
| --- | --- |
| Не half-critical, target есть, actual нет, `target < now` | `target-overdue`, warning background |
| Critical, `actual > target` | `actual-late-critical`, danger background |
| Critical, `actual <= target` | `actual-on-time-critical`, success background |
| Non-critical, задержка строго больше 10 минут | `actual-late-noncritical`, danger background |
| Half-critical, `actual > target` | `actual-late-half-critical`, danger text |
| Остальные случаи | `neutral` |

`fresh` переводится в semantic `fontWeight: 'bold'`.

В `active` дополнительно рассчитывается `previousIndicator`. Для опоздавшего
half-critical предыдущего индикатора используется danger background, как в
Legacy HUB, а не danger text.

### Required port

На этапе подключения компонент объявляет default provider:

```ts
const ports = definePorts({
  require: {
    state: computation<
      GroundHandlingProcessStateInput,
      GroundHandlingProcessState
    >({
      default: 'groundhandling-process-state',
    }),
  },
})
```

Metadata содержит только `settings`; default identity остаётся в `definePorts`.
Сейчас runtime позволяет заменить реализацию той же identity через
`Endge.bind.computation(...)`. Выбор другой persisted Computation для отдельного
экземпляра компонента потребует отдельного Composition port-binding contract и
не должен кодироваться в `Column.metadata`.

Текущий `groundHandlingProcess` уже реализует этот контракт: вызывает port,
сохраняет один корневой `Flex` во время `loading`, `error` и готового состояния,
читает значения из исходного `process` и применяет к ним `backgroundTone`,
`textTone`, `fontWeight` из `state.value`. Стабильный корень обязателен для
безопасного асинхронного обновления вложенного SFC внутри Table/RevoGrid. Vue
adapter сопоставляет semantic tones с CSS variables:

- `--endge-tone-warning-background`;
- `--endge-tone-danger-background`;
- `--endge-tone-success-background`;
- `--endge-tone-danger-text`.

Если переменные не определены темой, adapter использует безопасные fallback-
значения.

## Общие правила внешней ячейки

`table-cell-conditional-presentation` принимает:

```ts
interface TableCellConditionalPresentationInput {
  row?: Record<string, unknown>
  value?: unknown
  columnKey?: string
  rules?: TableCellPresentationRules
}
```

Граф вычисления:

```text
context
   └─ row, value и columnKey
rulesProvided
   └─ признак явно переданного контракта
rules
   └─ versioned rules с безопасным default
branches
   └─ нормализованный массив веток
evaluatedRules
   └─ рекурсивная проверка all/any/not и predicates
presentation
   └─ итоговый renderer-neutral patch
```

`context`, `rulesProvided`, `rules`, `branches` и `presentation` являются
декларативными expression-узлами. TypeScript используется только в
`evaluatedRules`, потому что ValueExpression v1 не поддерживает рекурсивную
интерпретацию произвольного дерева условий.

Правила можно хранить в metadata колонки:

```vue
<Column
  key="booked"
  :metadata="{
    'endge.table.cell-presentation': {
      version: 1,
      branches: [
        {
          when: {
            source: 'row',
            path: 'bookedPax.total',
            operator: 'lt',
            value: 20,
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
/>
```

Branches проверяются по порядку. Применяется первый совпавший `then`; если
совпадений нет, используется `else`.

### Условия

Predicate:

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

Группы:

```ts
{ all: [conditionA, conditionB] }
{ any: [conditionA, conditionB] }
{ not: condition }
```

`path` является обычным dot-path. Сравнение строк регистрозависимо.
`contains` для массива проверяет точное наличие элемента.

### Результат

```ts
interface TableCellAppearancePatch {
  backgroundTone?: string
  textTone?: string
  fontWeight?: 'normal' | 'semibold' | 'bold'
  fontStyle?: 'normal' | 'italic'
  meta?: Record<string, unknown>
}
```

Это renderer-neutral patch. Visual-компонент передаёт поля patch как semantic
props (`backgroundTone`, `textTone`, `fontWeight`), а adapter сопоставляет их с
темой. В metadata и Computation не нужны CSS или hex-цвета.

Вычисление не выполняет Action, не изменяет Store и не выбирает другой renderer.

## Текущая граница runtime

Для `GroundHandlingProcess` цепочка подключена полностью:

```text
Column.metadata
  → ProgramArtifact.metadata.nodes
  → Table columnMeta
  + Composition prop now
  → GroundHandlingProcess.settings
  → required port groundhandling-process-state
  → semantic props Vue adapter
```

Общий `table-cell-conditional-presentation` пока не вызывается автоматически
для каждой ячейки `Table`. Его следует подключать required port-ом конкретного
cell component, передавая `row`, `value`, `columnKey` и
`columnMeta['endge.table.cell-presentation']`. Автоматическую Table-level
surface стоит добавлять отдельно, когда будет определён port-binding contract
для встроенного `Table`.
