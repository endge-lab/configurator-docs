# Composition

Composition собирает доменные документы в исполняемый runtime-граф: создаёт runtime-ноды, связывает их inputs и outputs, управляет запуском и публикует результаты в Store. Она описывает оркестрацию, но не layout и не способ визуализации компонентов.

Значения в `.withProps({...})` поддерживают [общие функциональные выражения](/reference/value-expressions). Специальные readers Composition перечислены ниже.

## Полный пример

```ts
defineComposition({
  activateOn: startup(),

  data: {
    schedule: store('schedule'),
    airports: vocab('airports'),
  },

  resources: {
    theme: style('application-theme'),
  },

  runtimes: {
    filters: filter('schedule-filter')
      .persist({ key: 'schedule-filters' }),

    filterPanel: filterView('schedule-filter')
      .fields(['from', 'to'])
      .component('schedule-filter-sfc'),

    request: query('schedule-query')
      .withProps({
        filter: fromOutput('filters', 'request'),
      })
      .storeTo(data('schedule'), {
        rows: output('rows'),
      }),

    table: component('schedule-table').withProps({
      rows: fromData('schedule.rows'),
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
query('schedule').activateOn(manual())
```

- `startup()` активирует узел вместе с родительским scope;
- `manual()` оставляет его неактивным до явной активации;
- локальный `.activateOn(...)` переопределяет унаследованный режим.

`onMount().run(...)` нельзя направить на runtime с ручной активацией.

## Data и resources

```ts
data: {
  db: store('groundhandling-db'),
  airports: vocab('airports'),
},
resources: {
  tableTheme: style('groundhandling-table'),
}
```

В `data` доступны `store(identity)` и `vocab(identity)`. В `resources` текущий контракт поддерживает `style(identity)`.

## Runtime-ноды

| Конструктор | Назначение | Поддерживаемые modifiers |
| --- | --- | --- |
| `filter(identity)` | Filter runtime | `activateOn`, `persist` |
| `query(identity)` | Query runtime | `activateOn`, `withProps`, `storeTo` |
| `component(identity)` | Component SFC runtime | `activateOn`, `withProps` |
| `composition(identity)` | Вложенная Composition | `activateOn`, `storeTo` |
| `filterView(identity)` | Представление Filter | `activateOn`, `fields`, `controls`, `component`, `withProps` |

`composition(...).withProps(...)` не поддерживается: у Composition v1 нет публичного input-контракта.

### FilterView

```ts
filterView('schedule-filter')
  .fields(['from', 'direction'])
  .controls({
    from: control('Input'),
    direction: control('Select'),
  })
  .component('schedule-filter-sfc')
```

Типы controls: `Input`, `Textarea`, `Checkbox`, `Select`. Методы `.fields`, `.controls` и `.component` доступны только у `filterView`.

`.controls(...)` настраивает встроенный generator, а `.component(...)` выбирает пользовательский renderer. Эти варианты взаимоисключающие.

## Передача props

`.withProps({...})` доступен для Query, Component и FilterView. В нём можно использовать литералы, специальные readers Composition и весь [API ValueExpression](/reference/value-expressions):

```ts
query('search').withProps({
  ids: fromOutput('filters', 'request')
    .getOr('rows', [])
    .where(match({ active: true }))
    .map(get('id')),
  rows: fromData('schedule.rows'),
  locale: fromStore('preferences.locale'),
  columns: metadata('component-sfc', 'flight-table')
    .getOr('columns', []),
  model: fromFilter('filters').fields(['from', 'to']),
})
```

| Reader | Что читает |
| --- | --- |
| `fromOutput(runtime, output)` | Именованный output другой runtime-ноды |
| `fromData('alias.path')` | Путь внутри объявленного `data` alias |
| `fromStore(key)` | Значение общего Store по ключу |
| `fromFilter(runtime).fields([...])` | Типизированный срез полей Filter runtime |
| `metadata(entityType, identity)` | Скомпилированные metadata документа |

Зависимости между `.withProps` компилируются в граф. Циклическая связь runtime-нод считается ошибкой.

## Публикация в Store

Query и вложенная Composition могут публиковать outputs в объявленный Store:

```ts
query('schedule-query').storeTo(data('schedule'), {
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
]
```

- `onMount` запускает Query после монтирования графа;
- `onChange('runtime.output')` запускает Query при изменении output;
- `.debounce(ms)` принимает значение от `0` до `60000`;
- если `.debounce(...)` не указан, для `onChange` используется `200` мс;
- целью `.run(...)` в текущем контракте может быть только Query runtime.

## Scopes

Scope группирует resources, runtime-ноды и вложенные scopes, а также задаёт собственную активацию:

```ts
runtimes: {
  pages: scope({
    resources: {
      theme: style('control-page-theme'),
    },
    runtimes: {
      control: composition('control-page'),
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
