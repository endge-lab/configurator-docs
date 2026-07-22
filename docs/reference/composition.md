# Composition

Composition собирает доменные документы в исполняемый runtime-граф: создаёт runtime-ноды, связывает их props и outputs, управляет запуском и публикует результаты в Store. Она описывает оркестрацию, но не layout и не способ визуализации компонентов.

Значения в `.withProps({...})` поддерживают [общие функциональные выражения](/reference/value-expressions). Специальные readers Composition перечислены ниже.

## Полный пример

```ts
defineComposition({
  activateOn: startup(),

  data: {
    application: store('application-data'),
    categories: vocab('item-categories'),
  },

  resources: {
    theme: style('application-theme'),
  },

  runtimes: {
    filters: filter('items-filter')
      .persist({ key: 'items-filter-state' }),

    filterPanel: filterView('items-filter')
      .fields(['from', 'to'])
      .component('items-filter-panel'),

    request: query('items-query')
      .withProps({
        filter: fromOutput('filters', 'request'),
      })
      .storeTo(data('application'), {
        rows: output('rows'),
      }),

    table: component('items-table').withProps({
      rows: fromData('application.rows'),
    }),
  },

  hooks: [
    onMount().run('request'),
    onChange('filters.request').debounce(200).run('request'),
  ],

  outputs: {
    table: output().fromRuntime('table'),
    rows: output().fromRuntime('request').select('rows'),
  },
})
```

## Активация

`activateOn` задаётся для всей Composition, scope или отдельной runtime-ноды:

```ts
activateOn: startup()
query('items-query').activateOn(manual())
```

- `startup()` активирует узел вместе с родительским scope;
- `manual()` оставляет его неактивным до явной активации;
- локальный `.activateOn(...)` переопределяет унаследованный режим.

`onMount().run(...)` нельзя направить на runtime с ручной активацией.

## Data и resources

```ts
data: {
  application: store('application-data'),
  categories: vocab('item-categories'),
},
resources: {
  tableTheme: style('items-table-theme'),
}
```

В `data` доступны `store(identity)` и `vocab(identity)`. В `resources` текущий контракт поддерживает `style(identity)`.

`store(identity)` по умолчанию contextual: использует explicit binding, затем ближайший Store provider с той же identity, а без provider создаёт локальный fallback. Это позволяет одной Composition работать и внутри project tree, и самостоятельно в preview.

```ts
data: {
  shared: store('schedule'),
  draft: store('schedule').isolated(),
  session: store('user-session').injected(),
  primaryForm: store('flight-form').slot('primary'),
}
```

- `.isolated()` всегда создаёт локальный Store instance;
- `.injected()` требует explicit или ancestor provider и не создаёт fallback;
- `.slot(name)` различает несколько providers одной Store identity;
- alias (`shared`) локален для `fromData`, provider matching выполняется по Store identity и slot;
- sibling compositions не заимствуют fallback друг у друга.

Вложенной Composition можно явно передать Store, переименовав alias или выбрав конкретный instance:

```ts
composition('flight-board').withData({
  schedule: data('shared'),
})
```

## Runtime-ноды

| Конструктор | Назначение | Поддерживаемые modifiers |
| --- | --- | --- |
| `filter(identity)` | Filter runtime | `activateOn`, `persist` |
| `query(identity)` | Query runtime | `activateOn`, `withProps`, `storeTo` |
| `component(identity)` | Component SFC runtime | `activateOn`, `withProps` |
| `composition(identity)` | Вложенная Composition | `activateOn`, `withProps`, `withData`, `storeTo` |
| `filterView(identity)` | Представление Filter | `activateOn`, `fields`, `controls`, `component`, `withProps` |

Вложенная Composition принимает значения своего публичного props-контракта через `.withProps(...)`. Соответствие обязательным и объявленным props проверяется после linking с compiled artifact вызываемой Composition.

### FilterView

```ts
filterView('items-filter')
  .fields(['from', 'direction'])
  .controls({
    from: control('Input'),
    direction: control('Select'),
  })

filterView('items-filter')
  .fields(['from', 'direction'])
  .component('items-filter-panel')
```

Типы controls: `Input`, `Textarea`, `Checkbox`, `Select`. Методы `.fields`, `.controls` и `.component` доступны только у `filterView`.

`.controls(...)` настраивает встроенный generator, а `.component(...)` выбирает пользовательский renderer. Эти варианты взаимоисключающие.

Filter state меняется через Actions, а не через commands. Runtime host предоставляет
четыре стандартных Action handles:

```ts
await filter.action('set').run({ key: 'search', value: 'SU' })
await filter.action('patch').run({ search: 'SU', direction: 'departure' })
await filter.action('reset').run()
await filter.action('clear').run()
```

`set` и `patch` валидируют значения по compiled Filter fields. `reset` возвращает
defaults, `clear` создаёт пустой state. После изменения Filter публикует Events
`state:change` и, только для действительно изменившихся outputs, `output:change`.

## Публичные props Composition

Composition использует тот же author-facing vocabulary, что Query и Component: объявляет контракт через `props: defineProps({...})`, читает значения через `prop(path)`, а caller передаёт их через `.withProps({...})`.

```ts
defineComposition({
  props: defineProps({
    requirements: field('Object'),
  }),

  runtimes: {
    attributes: query('attributes-leg-select').withProps({
      names: prop('requirements.arrival.attributes'),
    }),
  },
})
```

Caller может передать literal, обычный Composition binding или namespace compiled metadata компонента:

```ts
defineComposition({
  runtimes: {
    requests: composition('groundhandling-default').withProps({
      requirements: metadataOf('table'),
    }),
    table: component('groundhandling-control-table'),
  },
})
```

`metadataOf(runtime)` разрешает документ через runtime alias и читает весь `ProgramArtifact.metadata.self`. `metadataOf(runtime, namespace)` сохраняет старый точный контракт и возвращает `ProgramArtifact.metadata.self[namespace]`. Source SFC и renderer state во время выполнения не анализируются. При самостоятельном запуске те же значения передаются как `{ props }` в `Endge.runtime.composition.mount(...)`.

Обе формы доступны внутри ValueExpression, поэтому metadata можно передать целиком, выбрать namespace или собрать объект вручную:

```ts
requirements: metadataOf('table')

requirements: metadataOf(
  'table',
  'groundhandling.query',
)

requirements: {
  arrival: metadataOf(
    'table',
    'groundhandling.arrival',
  ),
  departure: metadataOf(
    'table',
    'groundhandling.departure',
  ),
}
```

Одноаргументная форма не извлекает автоматически единственный namespace. Если `metadata.self` имеет вид `{ 'groundhandling.query': value }`, результат сохранит эту обёртку.

## Preview props

`previewProps: definePreviewProps({...})` задаёт fixtures для самостоятельного запуска Composition из Runtime Preview. Ключи соответствуют публичному контракту `props`, а значения можно записать прямо в source:

```ts
defineComposition({
  props: defineProps({
    requirements: field('GroundHandlingQueryRequirements'),
    airport: field('String'),
  }),

  previewProps: definePreviewProps({
    requirements: {
      arrival: {
        attributes: ['LegStatus', 'BestOn'],
        groundHandling: [
          { code: 'Bridge On', points: ['value'] },
        ],
      },
      departure: {
        attributes: ['LegStatus', 'BestOff'],
        groundHandling: [
          { code: 'Bridge Off', points: ['value'] },
        ],
      },
    },
    airport: 'SVO',
  }),

  runtimes: {},
})
```

Большой или переиспользуемый fixture можно вынести в [Mock data](/reference/mock):

```ts
previewProps: definePreviewProps({
  requirements: mock('groundhandling-query-requirements'),
  airport: 'SVO',
}),
```

`mock(identity)` относится к одному prop, поэтому inline values и несколько Mock-документов можно смешивать в одном `definePreviewProps`. Содержимое Mock должно соответствовать типу именно этого prop, а не быть объектом всех preview props.

Compiler проверяет имена props, индексирует RMock dependency и сверяет inline fixtures с доступным RType artifact. Проблемы preview остаются warnings: они видимы в Problems и Runtime Preview, но не делают production Composition неисполняемой.

`definePreviewProps` не задаёт runtime defaults. Значения применяются только Configurator preview launcher-ом:

```text
definePreviewProps → ProgramArtifact.previewProps → Runtime Preview → mount({ props })
```

Обычный `Endge.runtime.composition.mount()`, запуск через Project и вложенная `composition(...).withProps(...)` не читают preview fixtures автоматически.

## Передача props runtime-нодам

`.withProps({...})` доступен для Query, Component, вложенной Composition и FilterView. В нём можно использовать литералы, специальные readers Composition и весь [API ValueExpression](/reference/value-expressions):

```ts
query('search').withProps({
  filterOutputs: fromOutput('filters'),
  ids: fromOutput('filters', 'request')
    .getOr('rows', [])
    .where(match({ active: true }))
    .map(get('id')),
  rows: fromData('application.rows'),
  locale: fromStore('preferences.locale'),
  columns: metadata('component-sfc', 'items-table')
    .getOr('columns', []),
  model: fromFilter('filters').fields(['from', 'to']),
})
```

| Reader | Что читает |
| --- | --- |
| `fromOutput(runtime)` | Объект всех outputs другой runtime-ноды: `{ [outputName]: value }` |
| `fromOutput(runtime, output)` | Явно выбранный именованный output другой runtime-ноды |
| `fromData('alias.path')` | Путь внутри объявленного `data` alias |
| `fromStore(key)` | Значение общего Store по ключу |
| `fromFilter(runtime).fields([...])` | Типизированный срез полей Filter runtime |
| `metadata(entityType, identity)` | Скомпилированные metadata документа |
| `prop(path)` | Значение публичного prop текущей Composition |
| `metadataOf(runtime)` | Весь `ProgramArtifact.metadata.self` документа, указанного runtime alias-ом |
| `metadataOf(runtime, namespace)` | Один namespace из `ProgramArtifact.metadata.self` |

Зависимости между `.withProps` компилируются в граф. Циклическая связь runtime-нод считается ошибкой.

Форма `fromOutput('filters')` собирает все outputs runtime-ноды в один объект. Compiler фиксирует их публичные имена в ProgramArtifact, а runtime реактивно пересчитывает объект при изменении любого output. Количество outputs не меняет форму результата: один output `request` также возвращается как `{ request: value }`, а отсутствие outputs даёт `{}`.

Выбрать один output или собрать объект вручную по-прежнему можно явно. Пустая строка не является именем output:

```ts
// Автоматическая сборка:
// { arrival: value, departure: value }
filter: fromOutput('filters')

// Один output без внешней обёртки.
arrival: fromOutput('filters', 'arrival')

// Ручная сборка с собственными именами и структурой.
filter: {
  arrival: fromOutput('filters', 'arrival'),
  departure: fromOutput('filters', 'departure'),
}
```

## Публикация в Store

Query и вложенная Composition могут публиковать outputs в объявленный Store:

```ts
query('items-query').storeTo(data('application'), {
  'raw.items': output('raw'),
  rows: output('rows'),
})
```

Ключ объекта — путь назначения в Store, `output(name)` — output исходной runtime-ноды. Query сам не выбирает место хранения результата: этот контракт принадлежит Composition.

## Hooks

```ts
hooks: [
  onMount().run('request'),
  onChange('filters.request').run('request'),
  onChange('filters.request').debounce(300).run('request'),
  onSuccess('request').run('requestDetails'),
]
```

- `onMount` запускает Query после монтирования графа;
- `onChange('runtime.output')` запускает Query при изменении output;
- `onSuccess('runtime')` запускает Query после успешного выполнения исходной Query;
- `.debounce(ms)` доступен только для `onChange` и принимает значение от `0` до `60000`;
- если `.debounce(...)` не указан, для `onChange` используется `200` мс;
- источником `onSuccess(...)` и целью `.run(...)` может быть только Query runtime;
- ошибка исходной Query не запускает её `onSuccess` targets;
- циклы, созданные bindings, `onChange` или `onSuccess`, запрещены compiler-ом.

Hooks одного готового уровня выполняются параллельно. Порядок строк в `hooks` не задаёт последовательность. Последовательность появляется только из явно объявленной зависимости.

```ts
hooks: [
  // Оба root-запроса стартуют параллельно.
  onMount().run('arrivalPairs'),
  onMount().run('departurePairs'),

  // После arrivalPairs оба targets стартуют параллельно.
  onSuccess('arrivalPairs').run('arrivalAttributes'),
  onSuccess('arrivalPairs').run('arrivalGroundHandling'),

  // Эта ветка не зависит от arrival и стартует после departurePairs.
  onSuccess('departurePairs').run('departureAttributes'),
  onSuccess('departurePairs').run('departureGroundHandling'),
]
```

Исполняемый граф для этого примера имеет два независимых branches:

```text
arrivalPairs   ──success──> [arrivalAttributes || arrivalGroundHandling]
departurePairs ──success──> [departureAttributes || departureGroundHandling]
```

Если `arrivalPairs` завершится раньше, два arrival targets начнутся раньше departure targets. Если обе root Query завершатся одновременно, все четыре дочерние Query смогут выполняться одновременно.

Чтобы получить строгую последовательность, следующий hook должен зависеть от предыдущей Query, а не от общего parent:

```ts
hooks: [
  onMount().run('arrivalPairs'),
  onSuccess('arrivalPairs').run('arrivalAttributes'),
  onSuccess('arrivalAttributes').run('arrivalGroundHandling'),
]
```

При initial mount Composition ожидает завершения всей цепочки, начатой через `onMount` и продолженной через `onSuccess`. При последующих запусках, например через `onChange`, success-chain выполняется реактивно без повторного mount Composition.

Props дочерней Query разрешаются непосредственно перед её запуском. Поэтому результат parent Query можно преобразовать через ValueExpression и передать в дочерний request:

```ts
runtimes: {
  arrivalPairs: query('groundhandling-legs-pair-filter-arrival'),

  arrivalAttributes: query('attributes-leg-select').withProps({
    legIds: fromOutput('arrivalPairs', 'raw')
      .map(get('arrivalLeg.id'))
      .compact()
      .uniq(),
  }),
},

hooks: [
  onMount().run('arrivalPairs'),
  onSuccess('arrivalPairs').run('arrivalAttributes'),
]
```

Здесь data dependency задаётся через `fromOutput(...)`, а control dependency — через `onSuccess(...)`. Это разные части одного compiled runtime graph: binding передаёт значение, hook определяет момент запуска.

## Scopes

Scope группирует resources, runtime-ноды и вложенные scopes, а также задаёт собственную активацию:

```ts
runtimes: {
  pages: scope({
    resources: {
      theme: style('application-page-theme'),
    },
    runtimes: {
      content: composition('application-page'),
    },
  }).activateOn(manual()),
}
```

Публичный handle scope можно экспортировать через `output().fromScope(path)`.

## Outputs

```ts
outputs: {
  rows: output().fromRuntime('request').select('rows'),
  table: output().fromRuntime('table'),
  pages: output().fromScope('pages'),
}
```

- `.fromRuntime(name)` экспортирует runtime handle;
- `.select(output)` выбирает конкретный output runtime-ноды;
- `.fromScope(path)` экспортирует управляемый scope handle.

## Границы ответственности

Composition отвечает за runtime-граф, активацию, реактивные connections и публикацию данных. Она не описывает DOM, Canvas, layout или визуальные теги. Представление остаётся ответственностью [Component SFC](/reference/component-sfc), а преобразование данных — [DataView](/reference/data-view), [Computation](/reference/computation) и [общих функциональных выражений](/reference/value-expressions).
