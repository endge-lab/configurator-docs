---
description: "Filter — source-first описание полей, их состояния и производных outputs: поиск и виртуализация Select, FilterView в Composition, whitelist."
---

# Filter

Filter — source-first описание набора полей, их состояния и производных outputs.
Composition создаёт Filter runtime через `filter(identity)`, а `filterView(...)`
строит представление над тем же состоянием.

```ts
defineFilter({
  fields: {
    from: field('DateTime').optional(),
    categories: field('String')
      .array()
      .vocab('categories', {
        valuePath: 'code',
        labelPath: 'description',
      })
      .default([]),
  },

  outputs: {
    request: output().json(({ value }) => compact({
      from: value('from'),
      categories: value('categories'),
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
products: field('String')
  .array()
  .vocab('products', {
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

Правило для `vue-native`:

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
        categories: 'Категории',
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

## Whitelist outputs

Filter намеренно использует ограниченное подмножество общего Expression DSL:

| Output | Readers | Операции |
| --- | --- | --- |
| `.json(...)` | `value(path)` | `merge`, `compact`, `inList`, `trim`, `lowerCase`, `upperCase`, `toString` |
| `.predicate(...)` | `row(path)`, `value(path)` | `and`, `between`, `inArray` |

JSON-compatible literals, objects и arrays остаются допустимыми. Общий каталог операций не расширяет эту таблицу: например, `eq(...)`, `or(...)` и `map(...)` нельзя автоматически использовать в Filter output. Ошибки — `filter-source-output-operation` и `filter-source-output-read`.

```ts
defineFilter({
  fields: {
    from: field('DateTime').optional(),
    to: field('DateTime').optional(),
    categories: field('String').array().default([]),
  },
  outputs: {
    predicate: output().predicate(({ row, value }) => and(
      between(row('createdAt'), value('from'), value('to')),
      inArray(row('category'), value('categories')),
    )),
  },
})
```

`between` с отсутствующей границей оставляет эту сторону открытой. Пустой список `inArray` не ограничивает выборку. Для более сложного преобразования используйте DataView/Computation в соответствующей boundary; не маскируйте unsupported expression обычным JavaScript callback.

Filter state принадлежит одному Filter runtime; FilterView — представление этого состояния. Изменение visual labels, layout или Select metadata не создаёт отдельный state и не должно дублировать поля.

[Общий field contract](/reference/field-contracts), [compiler source](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/compilers/filter-source-compile.ts).
