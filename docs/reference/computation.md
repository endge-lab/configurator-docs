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
- `computation(identity, input)` вызывает другую Computation и передаёт ей сформированный input.
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

## Вызов другой Computation

Computation может использовать результат другой Computation как часть собственного графа. Это позволяет выносить повторяющиеся бизнес-правила в небольшие переиспользуемые документы и собирать из них более крупные вычисления без копирования source.

::: info Композиция вычислений
`computation(identity, input)` создаёт явную зависимость между двумя Computation.

Compiler включает вызываемый документ в граф зависимостей программы, а runtime передаёт ему вычисленный input и продолжает текущий граф с полученным результатом.
:::

Предположим, общая Computation нормализует подпись:

```ts
defineComputation({
  outputs: {
    result: {
      label: input('value').trim(),
    },
  },
  result: output('result'),
})
```

Другая Computation может вызвать её по identity и продолжить обработку результата общим ValueExpression API:

```ts
defineComputation({
  outputs: {
    label: computation('shared.normalize-label', {
      value: input('name'),
    })
      .get('label')
      .upperCase(),
  },
  result: output('label'),
})
```

Вызов имеет следующий контракт:

| Часть | Требование |
| --- | --- |
| `identity` | Непустая статическая строка; динамический identity не поддерживается |
| `input` | Одно безопасное expression-значение, передаваемое вызываемой Computation |
| результат | Обычное значение, которое можно использовать в объекте, коллекции или цепочке ValueExpression |

Внешний вызов можно разместить:

- непосредственно в `outputs`;
- внутри более крупного expression;
- в объекте или массиве;
- в `inputs` TypeScript-узла.

```ts
total: typescript({
  inputs: {
    normalized: computation('shared.normalize-amount', {
      value: input('amount'),
    }),
  },
  compute({ normalized }) {
    return normalized.value * 2
  },
})
```

Вызывать `computation(...)` непосредственно внутри тела `typescript.compute` нельзя: зависимости должны быть видны compiler-у до исполнения программы.

### Линковка и исполнение

Во время сборки Endge:

1. фиксирует каждую внешнюю Computation как artifact dependency с ролью `computation-call`;
2. проверяет существование и валидность вызываемого документа;
3. обнаруживает прямые и косвенные циклы между Computation;
4. вычисляет итоговый режим исполнения всего графа.

Если все связанные artifact синхронны, родительское вычисление также остаётся синхронным. Если хотя бы одна транзитивная зависимость содержит TypeScript-узел, весь вызывающий граф получает режим `async`.

```text
Computation A → Computation B → Computation C
```

Цикл вроде `A → B → C → A`, отсутствующая Computation или ссылка на invalid artifact останавливают компиляцию. Runtime дополнительно защищён от рекурсии и ограничивает один корневой запуск глубиной 32 вызова и общим бюджетом 256 вызовов.

::: warning Контракты v1
Compiler уже проверяет dependency graph, но пока не сравнивает автоматически persisted input/output metadata вызывающей и вызываемой Computation. Структуру передаваемого input и ожидаемого результата необходимо соблюдать в source.
:::

Локальный override, зарегистрированный через `Endge.bind.computation(...)`, применяется и тогда, когда Computation вызывается из другого вычисления. При этом вызываемый доменный документ всё равно должен существовать и успешно компилироваться.

Режим локального override проверяется уже в runtime. В текущей версии асинхронный override нельзя прозрачно подставить вместо зависимости, слинкованной как `sync`: вызов завершится ошибкой `async-override`. Для такой зависимости используйте синхронный override либо заранее асинхронный artifact.

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
    default: 'item-state',
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
<Text else>{{ state.value.target }}</Text>
```

Граф только из Endge expressions готов сразу. Граф с `typescript` сначала имеет состояние `pending`. Ресурс пересчитывается при изменении input и использует latest-wins semantics.

Порт принадлежит Component SFC, а не Computation. Сама Computation ничего не знает о представлении: она принимает input и возвращает result, а порт адаптирует её к реактивности и жизненному циклу компонента.

## Локальная замена

::: info Локальная реализация Computation
Если вычисление удобнее реализовать обычным кодом в локальном репозитории приложения, его можно связать с identity существующей Computation через `Endge.bind.computation(...)`.

После регистрации runtime будет вызывать локальный handler вместо скомпилированного persisted graph. Сам документ Computation при этом не изменяется: замена существует только в коде и окружении, где был выполнен binding.
:::

```ts
const unbind = Endge.bind.computation(
  'item-state',
  {
    execution: 'sync',
    run(input, api) {
      return calculateItemState(input, api)
    },
  },
)
```

Override полностью заменяет persisted graph. Функция `unbind()` удаляет локальную привязку. При ошибке локальной реализации runtime не выполняет скрытый fallback к persisted source — ошибка возвращается потребителю явно.
