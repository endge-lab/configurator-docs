# DataView

DataView описывает чистую проекцию входных данных в форму, нужную потребителю. Глобальный DataView и локальный DataView внутри Query компилируются в один program-контракт и исполняются одним runtime-механизмом.

Во всех декларативных режимах доступен [общий API функциональных выражений](/reference/value-expressions). DataView дополнительно предоставляет структурный pipeline, `path`, `template`, `spread` и вызов Converter.

## Режимы

| Режим | Когда использовать |
| --- | --- |
| `pipeline` | Последовательные преобразования результата через `select` или обработка коллекции через `from`, `join` и `map` |
| `projection` | Построение одного объекта из входного scope |
| `expression` | Возврат произвольного ValueExpression |
| `manual` | Trusted/global пользовательский код, когда декларативного API недостаточно |

## Pipeline

Pipeline поддерживает два отдельных контракта steps:

- value pipeline — только `select(...)`;
- collection pipeline — `from(...)`, `join(...)` и `map(...)`.

Смешивать `select` со структурными steps в одном DataView нельзя.

### Value pipeline: `select(expression)`

`select` преобразует значение целиком. Первый step получает вход DataView, каждый следующий — результат предыдущего, а результат последнего step становится результатом DataView:

```ts
defineDataView({
  mode: 'pipeline',
  steps: [
    select({
      activeRows: path('items')
        .where(match({ active: true })),
    }),

    select(
      path('activeRows')
        .map(pick(['id', 'name'])),
    ),
  ],
})
```

Здесь `path('items')` в первом step читает исходный input, а `path('activeRows')` во втором — объект, возвращённый первым `select`.

`select` принимает ровно одно [ValueExpression](/reference/value-expressions) и может вернуть объект, массив, scalar или `null`. `steps` должен быть непустым. В текущей версии select pipeline всегда материализуется целиком (`full`), потому что следующий step может зависеть от всего результата предыдущего.

`select(...)` не создаёт вложенный DataView и не обращается к другому DataView. Это последовательные этапы одного скомпилированного DataView.

### Collection pipeline

```ts
defineDataView({
  mode: 'pipeline',
  steps: [
    from('raw').as('row'),
    map({
      ...spread('row'),
      id: path('row.id'),
      title: path('row.title').trim().defaultTo('Без названия'),
      activeItems: path('row.items').where(match({ active: true })),
    }),
  ],
})
```

#### `from(source).as(alias)`

Выбирает коллекцию из входного scope и задаёт alias текущей строки:

```ts
from('response.items').as('row')
```

Перед обходом существующий collection pipeline может применить глобальный DataView. Это совместимый legacy-контракт; в новом коде для последовательных преобразований используйте `select` steps:

```ts
from('items')
  .dataView('normalize-item')
  .as('row')
```

Прежняя явная форма `.dataView(dataView('normalize-item'))` остаётся совместимой.

Inline-вложение `defineDataView` также пока читается ради обратной совместимости, но не является рекомендуемым способом композиции:

```ts
from('items')
  .dataView(defineDataView({
    mode: 'pipeline',
    steps: [from('').as('item'), map({ id: path('item.id') })],
  }))
  .as('row')
```

Новый select pipeline не создаёт и не вызывает вложенные DataView.

#### `join(source).by(...)`

Legacy structural join присоединяет первый подходящий элемент другой коллекции:

```ts
join('attributes').by({
  left: 'leg.id',
  right: 'entityId',
  as: 'legAttributes',
})
```

Для новых преобразований, составных ключей и сохранения кардинальности используйте общие [`leftJoin`, `fullJoin`, `lookupOne` и `lookupMany`](/reference/value-expressions#объединение-коллекций).

#### `map({...})` и `spread(alias)`

`map` формирует выходной объект для каждой строки. `spread` копирует поля объекта; явно объявленное поле имеет приоритет:

```ts
map({
  ...spread('row'),
  title: path('row.name'),
})
```

## Projection

Projection строит один объект без структурных steps:

```ts
defineDataView({
  mode: 'projection',
  output: {
    requestId: path('meta.requestId'),
    rows: path('items')
      .where(match({ active: true }))
      .sortBy(get('name')),
  },
})
```

Если `output` является объектом, compiler также может вывести режим projection из формы source.

## Expression

Expression возвращает результат одного общего выражения:

```ts
defineDataView({
  mode: 'expression',
  output: path('items')
    .where(match({ active: true }))
    .map(pick(['id', 'name'])),
})
```

Используйте этот режим, когда не нужен объект projection и структурный pipeline.

## Специальные выражения DataView

### `path(path)`

Читает значение из входного scope или alias pipeline и может продолжаться любым [общим методом ValueExpression](/reference/value-expressions):

```ts
path('row.items').where(match({ active: true })).map(get('id'))
```

### Legacy-операции `path`

```ts
path('row.category').pick('code')
path('row.statuses').find({ active: true })
path('row.std').convert('date.iso-to-time', { format: 'HH:mm' })
```

- `.pick(path)` читает вложенный путь;
- `.find(criteria)` находит первый подходящий элемент массива;
- `.convert(identity, options?)` вызывает зарегистрированный [Converter](/reference/converter).

Для Converter также принимается явная совместимая форма `.convert(converter('date.iso-to-time'), options)`.

Для новых выражений `pick` и `find` также доступны в общем API, но `convert` остаётся специальной возможностью DataView.

### `template(template)`

Подставляет значения текущего scope в строковый шаблон:

```ts
template('{row.name} / {row.status}')
```

## Incremental materialization

DataView может запросить стратегию обновления результата:

```ts
defineDataView({
  mode: 'pipeline',
  incremental: collectionByKey('id'),
  steps: [
    from('items').as('row'),
    map({ ...spread('row') }),
  ],
})
```

| API | Поведение |
| --- | --- |
| `auto()` | Compiler выбирает безопасную стратегию |
| `full()` | Полная повторная материализация |
| `collectionByKey(key)` | Переисполнение изменившихся строк коллекции по стабильному ключу |

`collectionByKey` применяется только к доказуемо row-local collection pipeline. Для select pipeline, projection, expression, manual или pipeline с глобальными зависимостями используется полная материализация.

## Manual DataView

```ts
defineDataView({
  mode: 'manual',
  transform(input, tools) {
    return input.raw
  },
})
```

Manual-режим содержит пользовательский код и разрешён только для trusted/global сценария. Он не поддерживается для локального DataView внутри Query или inline DataView.

## Граница ответственности

DataView не хранит состояние и не запускает HTTP-запросы. [Query](/reference/query) получает данные, DataView формирует проекцию, а [Composition](/reference/composition) связывает результат с Store и потребителями.
