# Filter

Filter — source-first описание набора полей, их состояния и производных outputs.
Composition создаёт Filter runtime через `filter(identity)`, а `filterView(...)`
строит представление над тем же состоянием.

```ts
defineFilter({
  fields: {
    from: field('DateTime').optional(),
    airlines: field('String')
      .array()
      .vocab('airlines', {
        valuePath: 'code',
        labelPath: 'description',
      })
      .default([]),
  },

  outputs: {
    request: output().json(({ value }) => compact({
      from: value('from'),
      airlines: value('airlines'),
    })),
  },
})
```

## Fields

| API | Назначение |
| --- | --- |
| `field(type)` | Тип поля: `String`, `Number`, `Boolean`, `Date`, `Time`, `DateTime`, `Object` или доменный Type. |
| `.optional()` | Поле необязательное. |
| `.array()` | Значение — массив указанного типа. |
| `.default(expression)` | Значение по умолчанию. |
| `.options([{ value, label? }])` | Статические варианты Select. |
| `.vocab(identity, mapping)` | Варианты Select из Vocab. |
| `.meta({ ... })` | Статическая namespaced metadata конкретного поля. |

`.options(...)` и `.vocab(...)` взаимоисключающие. `.meta(...)` принимает только
JSON-compatible object literal: без spread, computed keys, functions и runtime
expressions.

## Поиск и виртуализация Select

Для явного управления поиском используйте well-known namespace
`endge.ui.select`:

```ts
aircrafts: field('String')
  .array()
  .vocab('aircrafts', {
    valuePath: 'type',
    labelPath: 'description',
  })
  .meta({
    'endge.ui.select': {
      searchable: true,
    },
  })
  .default([])
```

Правило одинаково для `vue-native` и `vue-shadcn`:

- `searchable: true` принудительно включает поиск;
- `searchable: false` принудительно скрывает поиск;
- если ключ не задан, поиск включается автоматически при количестве вариантов
  больше 10;
- список больше 10 вариантов виртуализируется независимо от видимости поиска.

Metadata влияет только на представление. Она не попадает в state или output и
не меняет реактивность Filter. Подробнее: [Metadata](/reference/metadata).

## FilterView в Composition

```ts
defineComposition({
  runtimes: {
    filter: filter('schedule'),
    filters: filterView('filter').withProps({
      showLabels: false,
      labels: {
        airlines: 'Авиакомпании',
      },
    }),
  },
})
```

`filterView` не владеет состоянием и не копирует fields. Generated renderer
читает compiled field contract, разрешённые Vocab options и metadata, после чего
делегирует конкретный control активному UI adapter-у.

## Outputs

`output().json(...)` строит JSON payload, а `output().predicate(...)` — predicate
для локального применения. Output пересчитывается после изменения state и может
использоваться Query через Composition binding.
