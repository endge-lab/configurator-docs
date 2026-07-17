# Computation

Computation — доменная сущность для вычисления производного значения из входных данных. Она описывает вычисление как граф зависимостей: принимает `input`, последовательно формирует именованные промежуточные `outputs` и публикует один итоговый `result`. При изменении входных данных runtime пересчитывает зависимые узлы и предоставляет потребителю актуальный результат.

Например, один из заказчиков может потребовать, чтобы компонент выделялся синим цветом, если заявка относится к его подразделению и требует согласования. Для этого не нужно добавлять условие непосредственно в компонент. Специфичная для контекста заказчика Computation вычислит семантическое значение `accent`, а компоненту останется только отобразить полученный результат.

::: info Модель Computation
**Входные данные → граф вычислений → один итоговый результат**

Контекст определяет, какая реализация Computation будет использована, а входные данные определяют результат конкретного вычисления.
:::

```ts
defineComputation({
  outputs: {
    requiresAccent: and(
      eq(input('request.department'), 'customer-a'),
      eq(input('request.approvalRequired'), true),
    ),
    color: when(
      output('requiresAccent'),
      'blue',
      'default',
    ),
  },
  result: output('color'),
})
```

Общая версия приложения при этом не меняется. Через Specific Override Pattern заказчик может получить собственную реализацию Computation для своего контекста, а Component SFC продолжит зависеть от стабильного вычислительного контракта, не зная о конкретном бизнес-правиле.

В persisted-документе Computation хранится один canonical source, начинающийся с `defineComputation`.

Обычные узлы графа поддерживают весь [API функциональных выражений](/reference/value-expressions). Специальные readers Computation — `input(path?)` и `output(name)`.

```ts
defineComputation({
  outputs: {
    base: input('value'),
    doubled: typescript({
      inputs: { value: output('base') },
      compute({ value }) {
        return value * 2
      },
    }),
  },
  result: output('doubled'),
})
```

## Контракт

- `outputs` — именованный граф зависимостей; forward references разрешены.
- `input(path?)` читает внешний input.
- `output(name)` читает другой узел графа.
- Обычные значения используют безопасный словарь ValueExpression: коллекции, условия, агрегации, joins и lookup.
- `result` обязателен и задаёт единственный результат Computation.

Compiler строит граф зависимостей outputs, поэтому циклические ссылки отклоняются. Кроме `defineComputation`, source может содержать только TypeScript type/interface declarations.

```ts
defineComputation({
  outputs: {
    activeRows: input('rows').where(match({ active: true })),
    total: output('activeRows').sumBy(get('amount')),
    title: when(
      gt(output('activeRows').size(), 0),
      'Есть данные',
      'Нет данных',
    ),
  },
  result: {
    rows: output('activeRows'),
    total: output('total'),
    title: output('title'),
  },
})
```

## TypeScript-узел

`typescript` выполняет синхронный пользовательский код внутри sandbox Worker. Imports, сеть, файловая система, таймеры, async-функции и скрытое чтение домена запрещены.

```ts
normalized: typescript({
  inputs: {
    rows: output('activeRows'),
    factor: input('factor'),
  },
  compute({ rows, factor }) {
    return rows.map(row => ({
      ...row,
      weightedAmount: row.amount * factor,
    }))
  },
})
```

`typescript` нужен только там, где задача действительно не выражается общим декларативным API. Его `compute` синхронен, хотя runtime ресурса остаётся асинхронным из-за исполнения в Worker.

## Использование в Component SFC

Component SFC подключает Computation через порт. Порт объявляет типизированную зависимость компонента от внешнего вычисления и скрывает поиск, компиляцию и исполнение конкретной Computation.

Компонент передаёт вычислению входные данные и получает реактивный ресурс с состояниями `loading`, `value` и `error`. Подробнее об устройстве этого контракта: [порты Component SFC](/reference/component-sfc#порты).

```ts
const ports = definePorts({
  state: computation<Input, Output>({
    default: 'groundhandling-process-state',
  }),
})

const state = ports.state({ process: props.process })
```

- `state` — локальное имя порта;
- `Input` — тип входных данных Computation;
- `Output` — тип результата;
- `default` — identity Computation по умолчанию;
- `ports.state(input)` создаёт связанный с компонентом вычислительный ресурс.

```vue
<Text if="state.loading">Загрузка…</Text>
<Text else-if="state.error" color="danger">
  {{ state.error.message }}
</Text>
<GroundHandling.Cell else :point="state.value.target" />
```

Граф только из Endge expressions готов сразу. Граф с `typescript` сначала имеет состояние `pending`. Ресурс пересчитывается при изменении input и использует latest-wins semantics.

Порт принадлежит Component SFC, а не Computation. Сама Computation ничего не знает о представлении: она принимает input и возвращает result, а порт адаптирует её к реактивности и жизненному циклу компонента.

## Локальная замена

```ts
const unbind = Endge.bind.computation(
  'groundhandling-process-state',
  {
    execution: 'sync',
    run(input, api) {
      return calculateGroundHandlingState(input, api)
    },
  },
)
```

Override полностью заменяет persisted graph. При ошибке локальной реализации runtime не выполняет скрытый fallback к persisted source.
