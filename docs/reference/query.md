# Query

Query — source-first описание получения данных. Он формирует именованные `outputs`, но не определяет, где они будут храниться и кто станет их потребителем.

## Базовый пример

```ts
defineQuery({
  kind: 'rest',

  props: defineProps({
    filterPayload: field('Object')
      .optional()
      .from(filter('schedule').output('request')),
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
    body: body(({ prop }) => merge({}, prop('filterPayload'))),
  },

  outputs: {
    raw: output().from(response()),
  },

  mock: {
    enabled: false,
    data: null,
  },
})
```

## Ответственность

Query отвечает за:

- входные `props`;
- transport и auth;
- request body;
- mock response;
- упорядоченный граф outputs;
- локальные и внешние DataView внутри outputs.

Query не записывает данные в Store или произвольный путь Raph. Это делает Composition.

## Props

```ts
props: defineProps({
  filterPayload: field('Object').optional(),
  limit: field('Number').default(100),
})
```

Prop участвует в HTTP-запросе только при явной ссылке из `request`:

```ts
body: body(({ prop }) =>
  merge({ limit: prop('limit') }, prop('filterPayload')),
)
```

## Outputs

Output получает данные из response или предыдущего output:

```ts
outputs: {
  raw: output().from(response('items')),
  rows: output().from('raw'),
}
```

Ссылаться можно только на output, объявленный выше. Такой порядок делает граф однозначным.

## DataView в Query

Ссылка на глобальный DataView:

```ts
rows: output()
  .from('raw')
  .dataView(dataView('flightRows'))
```

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
        departureTime: path('row.departureTime')
          .convert('time-string-to-date'),
      }),
    ],
  }))
```

Локальный DataView компилируется как child artifact Query и не создаёт отдельный документ домена.

## Preview и runtime

Preview компилирует Query, создаёт временный `QueryRuntimeHost`, выполняет запрос и показывает outputs. После отдельного запуска временный host уничтожается.

В Composition host может жить дольше одного вызова. Он обеспечивает повторные запуски, reactive props, отмену устаревшего HTTP-запроса и события изменения outputs.

## Связывание в Composition

```ts
query: query('schedule').withProps({
  filterPayload: fromOutput('filter', 'request'),
})
```

Запись output в Store является частью binding-контракта Composition, а не Query source.
