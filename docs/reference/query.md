---
description: "Query — source-first описание получения данных: props, REST и GraphQL request, упорядоченные outputs, DataView, mock, preview, связывание."
---

# Query

Query — source-first описание получения данных. Он объявляет входные props, транспортный контракт и упорядоченные outputs, но не определяет, где результат будет храниться и кто станет его потребителем. Поддерживаются два варианта: `kind: 'rest'` и `kind: 'graphql'`.

Пользовательская metadata Query задаётся статическим корневым полем
`metadata: { ... }` внутри `defineQuery`, остаётся в Source и попадает в
`ProgramArtifact.metadata.self`. Общий JSON-контракт и UI описаны в разделе
[Metadata](/reference/metadata).

В `request.body`, `request.variables` и выражениях `output().from(...)` доступен [общий API функциональных выражений](/reference/value-expressions), включая типы, числа, строки, коллекции, DateTime и Duration. Специальные readers Query — `prop(path)`, `response(path?)` для REST, `data(path?)` и `errors(path?)` для GraphQL.

Сквозной сценарий GraphQL — Query, подписка, схема, запуск и mock — описан в руководстве [GraphQL](/guides/graphql).

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

## GraphQL-вариант

GraphQL Query хранит operation отдельно от variables. Это полноценный GraphQL transport, а не REST body с текстом мутации:

```ts
defineQuery({
  kind: 'graphql',

  props: defineProps({
    leadId: field('String'),
    actualTime: field('DateTime'),
  }),

  request: {
    endpoint: env('ENDPOINT_API_GRAPHQL'),
    operationName: 'UpdateActualTime',
    document: gql`
      mutation UpdateActualTime($leadId: ID!, $actualTime: DateTime!) {
        updateActualTime(leadId: $leadId, actualTime: $actualTime) {
          id
          actualTime
        }
      }
    `,
    variables: variables(({ prop }) => ({
      leadId: prop('leadId'),
      actualTime: prop('actualTime'),
    })),
    headers: {},
    auth: { mode: 'inherit' },
    errorPolicy: 'throw',
  },

  outputs: {
    updated: output().from(data('updateActualTime')),
  },

  mock: {
    enabled: false,
    data: null,
  },
})
```

`gql` должен быть статическим tagged template без JavaScript interpolation. Кнопка «Форматировать» форматирует одновременно Query source и GraphQL document внутри `gql`.

Query выполняет `query` и `mutation`. Operation `subscription` компилятор отклоняет: подписки описываются в [Stream](/reference/stream#graphql-подписка-через-sse) через `graphqlSse(...)`.

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
| `field(type)` | Тип: `String`, `Number`, `Boolean`, `Date`, `Time`, `DateTime`, `Object`, доменный Type или inline `objectOf`/`recordOf` |
| `.optional()` | Поле не является обязательным |
| `.array()` | Значение является массивом указанного типа |
| `.default(expression)` | Значение по умолчанию |
| `.options([{ value, label? }])` | Статический список допустимых значений |
| `.vocab(identity, { valuePath, labelPath })` | Значения и подписи из Vocab |
| `.from(filter(identity).output(name))` | Default из output внешнего Filter |
| `.from(defineFilter({...}).output(name))` | Default из output inline Filter |

`.options` и `.vocab` взаимоисключающие. Нельзя одновременно задавать `.default(...)` и `.from(...)`.

Вложенный объект описывается тем же рекурсивным field-синтаксисом, что и Type Source:

```ts
payload: field(objectOf({
  itemNumber: field(String),
  route: field(objectOf({
    outgoing: field(String),
    incoming: field(String),
  })),
}))
```

Для объекта с произвольными string-ключами используется `recordOf`:

```ts
properties: field(recordOf(objectOf({
  name: field(String),
  type: field(String),
  text: field(String),
})))
```

Prop участвует в запросе только при явной ссылке через `prop(path)` в `body(...)` или `variables(...)`:

```ts
body: body(({ prop }) => ({
  limit: prop('limit'),
  filter: prop('filterPayload'),
}))
```

`request.body` и `request.variables` могут читать только объявленные props. Произвольного доступа к Composition, Store или глобальному окружению внутри Query source нет.

## REST request

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

Для `auth` используются те же формы, что и в Stream: `mode: 'inherit'`,
`mode: 'none'` или `mode: 'profile'` с полем `profile`. Значение `profile` —
identity существующего AuthProfile:

```ts
auth: {
  mode: 'profile',
  profile: 'keycloak-dev',
}
```

Callback `body` должен непосредственно возвращать выражение. Block body, произвольный JavaScript и side effects не поддерживаются.

## GraphQL request

| Поле | Назначение |
| --- | --- |
| `endpoint` | GraphQL endpoint или Endge var-token |
| `document` | Статический GraphQL document в `gql` tagged template |
| `operationName` | Имя operation; обязательно, если document содержит несколько operations |
| `fragments` | Фрагменты GraphQL: статические или выбранные `contextSwitch` по фасетам сборки |
| `variables` | Безопасное выражение, построенное через `variables(...)` |
| `headers` | Дополнительные HTTP headers |
| `auth` | Общая Auth-конфигурация Query |
| `timeoutMs` | Необязательный timeout запроса |
| `errorPolicy` | `throw` по умолчанию, `ignore` или `all` |

Executor отправляет `POST` с полями `query`, `operationName` и `variables`. HTTP-ошибки всегда завершают Query с ошибкой.

### Фрагменты по контексту

Один Query может запрашивать разные поля для разных тенантов. Operation ссылается на фрагмент, а `fragments` задаёт его варианты:

```ts
defineQuery({
  kind: 'graphql',
  props: defineProps({ id: field(String) }),
  request: {
    endpoint: 'https://items.example.test/graphql',
    document: gql`query Item($id: ID!) { item(id: $id) { ...ItemFields } }`,
    fragments: {
      ItemFields: contextSwitch({
        default: gql`fragment ItemFields on Item { id number status outgoing gate crew { role name } }`,
        cases: [{
          when: { tenant: 'variant-b' },
          use: gql`fragment ItemFields on Item { id number status outgoing stand handlingAgent crew { role name } }`,
        }],
      }),
    },
    variables: variables(({ prop }) => ({ id: prop('id') })),
    headers: { 'X-Tenant': facet('tenant') },
  },
})
```

- Значение фрагмента — статический `gql` ровно с одним `fragment Имя on Тип {...}`, имя которого совпадает с ключом, либо `contextSwitch` таких значений (правила — в [Контексте сборки](/reference/value-expressions#контекст-сборки)).
- При любой сборке разбираются и проверяются все варианты всех фрагментов. В итоговый document попадают только фрагменты, достижимые из operation с учётом вложенных spread выбранных вариантов; runtime получает готовый текст.
- Вне сборки выбирается `default` и выдаётся info `source-expression-context-unbound`.
- Редактор Configurator проверяет по схеме каждый вариант document (функции core `createGraphQLDocumentVariants` и `validateGraphQLDocumentVariants`).

| Код | Severity | Когда |
| --- | --- | --- |
| `query-source-graphql-fragments-shape` | error | `fragments` не object literal, spread или вычисляемый ключ |
| `query-source-graphql-fragment-shape` | error | значение не статический `gql` или в нём не ровно одно определение fragment |
| `query-source-graphql-fragment-invalid` | error | синтаксическая ошибка фрагмента |
| `query-source-graphql-fragment-name` | error | имя fragment не совпадает с ключом |
| `query-source-graphql-fragment-duplicate` | error | ключ повторён или фрагмент уже определён в document |
| `query-source-graphql-fragment-undefined` | error | `...Имя` без определения |
| `query-source-graphql-fragment-variable-undeclared` | error | вариант использует `$x`, которую operation не объявляет |
| `query-source-graphql-fragment-cycle` | error | цикл spread (`A → B → A`) по всем вариантам |
| `query-source-graphql-fragment-unused` | warning | фрагмент недостижим из operation ни в одном варианте |

Для Stream коды те же с префиксом `stream-`.

### Проверка variables

Компилятор сверяет `variables(...)` с объявлениями переменных выбранной operation без схемы и без сети:

| Код | Severity | Когда |
| --- | --- | --- |
| `query-source-graphql-variable-unknown` | warning | ключ `variables(...)` не объявлен в operation |
| `query-source-graphql-variable-missing` | error | переменная `$x: T!` без default не передана, в том числе когда `variables(...)` отсутствует |

Operation выбирается по `operationName` или как единственная в документе. Если `variables(...)` возвращает не object literal, например `prop('vars')`, набор ключей статически неизвестен и проверка пропускается. Типы значений без схемы не проверяются. Проверка документа по схеме GraphQL выполняется в редакторе Configurator: [Запуск Query и схема GraphQL](/configurator/query-run-and-graphql-schema).

### Ошибки GraphQL

`errorPolicy` определяет, что происходит, когда успешный HTTP-ответ содержит `errors`:

| `errorPolicy` | Результат |
| --- | --- |
| `throw` | Query завершается ошибкой `GraphQLQueryError` с полями `errors`, `data` (частичные данные), `url`, `operationName` и `status`. Сообщение имеет вид `[GraphQL] message (path: a.b); ...` |
| `ignore` | Outputs получают `data`; errors скрыты, reader `errors()` пуст, diagnostics не пишутся |
| `all` | Outputs получают `data`; errors доступны через `errors()` и записываются warning `endge.query.graphql-errors` в diagnostics |

Элементы `errors` сохраняются целиком: `message`, `path`, `locations`, `extensions` и неизвестные поля сервера. Строковый элемент превращается в `{ message }`.

Некорректное тело успешного ответа завершает Query ошибкой `GraphQLResponseFormatError` (`code: 'graphql_response_format_error'`): пустое тело или не JSON, JSON не-объект, объект без `data` и `errors`, `errors` не массив.

Reader `errors(path?)` читает errors ответа в outputs:

```ts
request: {
  // ...
  errorPolicy: 'all',
},
outputs: {
  orders: output().from(data('orders')),
  problems: output().from(errors()),
  firstCode: output().from(errors('0.extensions.code')),
  view: output().from({ items: data('orders'), errors: errors() }),
},
```

Без аргумента `errors()` возвращает весь массив, с путём — значение по dot-path. Ошибкой компиляции является `errors(...)` в REST Query (`query-source-graphql-errors-rest`). При `errorPolicy: 'throw'` или `'ignore'` reader всегда пуст, поэтому компилятор выдаёт warning `query-source-graphql-errors-throw-policy` или `query-source-graphql-errors-ignore-policy` с подсказкой указать `errorPolicy: 'all'`.

## Outputs

REST output читает response, GraphQL output — поле `data`; оба могут ссылаться на output, объявленный выше:

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

Для GraphQL executor сначала отделяет envelope и передаёт в output только поле `data`, поэтому путь не содержит дополнительный префикс:

```ts
outputs: {
  raw: output().from(data()),
  items: output().from(data('items')),
}
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

## Упорядоченные преобразования output

После `.from(...)` DataView и Converter можно чередовать. Порядок сохраняется в Program artifact и исполняется буквально:

```ts
items: output()
  .from(response())
  .dataView('unwrap-items')
  .convert('normalize-codes', { trim: true })
  .dataView('only-active')
```

Converter получает результат предыдущего шага целиком и вызывается один раз. Legacy-поле artifact `dataViews` временно остаётся compatibility projection, но source и новый runtime используют единый ordered-transform список.

Цепочка начинается с любого `.from(...)`: с reader ответа или с имени предыдущего output.

```ts
outputs: {
  items: output().from(response('items')),
  authors: output().from('items').convert('authors-index'),
}
```

Converter должен существовать документом (`converters`), иначе компиляция даёт `response-output-converter-missing`; встроенные Converter Core (`to-array`, `split`, `iso-string-to-date` и другие) тоже нужно объявить документом с тем же identity. Реализацию пользовательского Converter регистрирует код приложения. Пока её нет, шаг возвращает `null`: этот output равен `null`, остальные outputs Query вычисляются как обычно.

## Mock, preview и runtime

`mock.enabled` переключает Query на `mock.data` без транспортного запроса. Inline mock зависит и от режима данных (переключатель Configurator, `dataMode` Composition, Simulation):

| `mock.enabled` | Режим данных `live` | Режим данных `mock` |
| --- | --- | --- |
| `true` | Ответ — `mock.data`, сеть не используется; outputs, контракты и DataView строятся как из ответа сервера | Query в Composition **не выполняется**: ни запроса, ни `mock.data`, outputs остаются пустыми (событие `run:skipped`, причина `mock-mode`) |
| `false` | HTTP-запрос; `mock.data` игнорируется | То же: Query не выполняется |

В режиме `mock` данные дают [Simulation](/reference/simulation) (`mockRequest` подменяет ответ Query) и инициализаторы Store `value(mock('<identity>'))`. Inline mock — способ работать без сервера в режиме `live`, например для превью одного Query или пока API недоступно.

Для GraphQL `mock.data` — объект `data` операции. Необязательный `mock.errors` задаёт errors ответа; они проходят `errorPolicy` и reader `errors()` так же, как ответ сервера:

```ts
mock: {
  enabled: true,
  data: { orders: [{ id: 'o-1', status: 'new' }], meta: { total: null } },
  errors: [
    { message: 'Total is unavailable', path: ['meta', 'total'], extensions: { code: 'FORBIDDEN' } },
  ],
},
```

Каждый элемент `mock.errors` — объект со строковым `message`; `path`, если указан, — массив строк и чисел; остальные поля произвольные (иначе `query-source-mock-errors-shape`). В REST Query `mock.errors` недоступен (`query-source-mock-errors-rest`): REST mock задаётся целиком через `mock.data`. При `errorPolicy: 'throw'` mock с errors завершает Query ошибкой `GraphQLQueryError` без обращения к transport.

Это inline mock конкретного Query, а не persisted `RMock`. Переиспользуемые fixtures, `mock(identity)`, document/code-provider modes и Composition preview описаны отдельно: [Mock data](/reference/mock).

Preview компилирует Query, создаёт временный `QueryRuntimeHost`, выполняет запрос и показывает outputs. После отдельного запуска временный host уничтожается. В Composition host живёт вместе с графом, поддерживает повторные запуски, reactive props, отмену устаревшего HTTP-запроса и изменение outputs.

## Связывание в Composition

```ts
request: query('items-query').withProps({
  filterPayload: fromOutput('filter', 'request'),
})
```

Здесь выбирается значение конкретного output без внешней обёртки. `fromOutput('filter')` вернул бы объект всех outputs Filter, например `{ request: value }`. Правила автоматической и ручной сборки описаны в разделе [передачи props Composition](/reference/composition#передача-props-runtime-нодам).

Query не записывает данные в Store. `.withProps`, hooks и публикация output через `.storeTo(...)` являются контрактом [Composition](/reference/composition).

Настройка профилей, credentials и адаптеров описана в разделе [AuthProfile](./auth-profile).
