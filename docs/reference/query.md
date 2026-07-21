# Query

Query — source-first описание получения данных. Он объявляет входные props, HTTP-контракт и упорядоченные outputs, но не определяет, где результат будет храниться и кто станет его потребителем.

В `request.body` и выражениях `output().from(...)` доступен [общий API функциональных выражений](/reference/value-expressions). Специальные readers Query — `prop(path)` и `response(path?)`.

## Полный пример

```ts
defineQuery({
  kind: 'rest',

  props: defineProps({
    filterPayload: field('Object')
      .optional()
      .from(filter('items-filter').output('request')),
    limit: field('Number').default(100),
  }),

  request: {
    endpoint: env('ENDPOINT_API'),
    path: '/select',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    auth: {
      mode: 'profile',
      profile: 'keycloak-dev',
    },
    timeoutMs: 15000,
    formUrlencoded: false,
    body: body(({ prop }) => merge(
      { limit: prop('limit') },
      prop('filterPayload'),
    )),
  },

  outputs: {
    raw: output().from(response('items')),
    active: output().from(
      response('items')
        .where(match({ active: true }))
        .sortBy(get('name')),
    ),
  },

  mock: {
    enabled: false,
    data: null,
  },
})
```

В текущей версии поддерживается `kind: 'rest'`.

## Props

`defineProps` задаёт единственный runtime input-контракт Query:

```ts
props: defineProps({
  statuses: field('String')
    .array()
    .optional()
    .default(['active'])
    .options([
      { value: 'active', label: 'Активен' },
      { value: 'closed', label: 'Закрыт' },
    ]),
})
```

| API | Назначение |
| --- | --- |
| `field(type)` | Тип: `String`, `Number`, `Boolean`, `Date`, `Time`, `DateTime` или `Object` |
| `.optional()` | Поле не является обязательным |
| `.array()` | Значение является массивом указанного типа |
| `.default(expression)` | Значение по умолчанию |
| `.options([{ value, label? }])` | Статический список допустимых значений |
| `.vocab(identity, { valuePath, labelPath })` | Значения и подписи из Vocab |
| `.from(filter(identity).output(name))` | Default из output внешнего Filter |
| `.from(defineFilter({...}).output(name))` | Default из output inline Filter |

`.options` и `.vocab` взаимоисключающие. Нельзя одновременно задавать `.default(...)` и `.from(...)`.

Prop участвует в запросе только при явной ссылке через `prop(path)`:

```ts
body: body(({ prop }) => ({
  limit: prop('limit'),
  filter: prop('filterPayload'),
}))
```

`request.body` может читать только объявленные props. Произвольного доступа к Composition, Store или глобальному окружению внутри Query source нет.

## Request

| Поле | Назначение |
| --- | --- |
| `endpoint` | Базовый endpoint или Endge var-token |
| `path` | REST path |
| `method` | HTTP method |
| `headers` | Статические HTTP headers |
| `auth` | Auth-конфигурация запроса |
| `timeoutMs` | Необязательный timeout запроса |
| `formUrlencoded` | Кодировать body как `application/x-www-form-urlencoded` |
| `body` | Безопасное выражение, построенное через `body(...)` |

Callback `body` должен непосредственно возвращать выражение. Block body, произвольный JavaScript и side effects не поддерживаются.

## Outputs

Output читает response или output, объявленный выше:

```ts
outputs: {
  raw: output().from(response()),
  items: output().from(response('data.items')),
  rows: output().from('items'),
}
```

`response()` возвращает весь ответ, `response('items')` — значение по dot-path. К reader можно применять любые [общие операции](/reference/value-expressions):

```ts
rows: output().from(
  response('items')
    .where(match({ active: true }))
    .map(pick(['id', 'name'])),
)
```

Ссылаться можно только на предыдущий output. Такой порядок делает граф однозначным и исключает циклы.

## DataView в output

Ссылка на глобальный DataView:

```ts
rows: output()
  .from('raw')
  .dataView('item-rows')
```

Прежняя явная форма `.dataView(dataView('item-rows'))` остаётся совместимой.

Локальный DataView:

```ts
rows: output()
  .from('raw')
  .dataView(defineDataView({
    mode: 'pipeline',
    steps: [
      from('').as('row'),
      map({
        ...spread('row'),
        formattedDate: path('row.createdAt')
          .convert('time-string-to-date'),
      }),
    ],
  }))
```

Локальный DataView компилируется как child artifact Query и не создаёт отдельный документ домена. Полный API преобразований: [DataView](/reference/data-view).

## Mock, preview и runtime

`mock.enabled` переключает Query на `mock.data` без транспортного запроса.

Это inline mock конкретного Query, а не persisted `RMock`. Переиспользуемые fixtures, `mock(identity)`, document/code-provider modes и Composition preview описаны отдельно: [Mock data](/reference/mock).

Preview компилирует Query, создаёт временный `QueryRuntimeHost`, выполняет запрос и показывает outputs. После отдельного запуска временный host уничтожается. В Composition host живёт вместе с графом, поддерживает повторные запуски, reactive props, отмену устаревшего HTTP-запроса и изменение outputs.

## Связывание в Composition

```ts
request: query('items-query').withProps({
  filterPayload: fromOutput('filter', 'request'),
})
```

Query не записывает данные в Store. `.withProps`, hooks и публикация output через `.storeTo(...)` являются контрактом [Composition](/reference/composition).
