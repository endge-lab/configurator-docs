# GraphQL

Руководство показывает сквозной сценарий с GraphQL-сервисом: начальные данные
читаются через Query, изменения приходят по GraphQL-подписке через SSE, а
команды отправляются отдельными Query, например REST. Схема GraphQL помогает
писать документы в редакторе, панель запуска — проверять запросы, mock и
Simulation — работать без сервера.

```text
Query (read model) ──storeTo──▶ Store ◀──dispatchTo── Stream (graphqlSse)
                                  │                       ▲
                                  ▼                       │ props
                              Component ───────────── Composition
```

## 1. Read model через Query

Query `orders-query` загружает список заказов и отдаёт его outputs:

```ts
defineQuery({
  kind: 'graphql',

  props: defineProps({
    status: field('String').optional(),
  }),

  request: {
    endpoint: env('GRAPHQL_URL'),
    document: gql`
      query Orders($status: String) {
        orders(status: $status) { id status updatedAt }
      }
    `,
    variables: variables(({ prop }) => ({ status: prop('status') })),
    auth: { mode: 'inherit' },
    errorPolicy: 'all',
  },

  outputs: {
    orders: output().from(data('orders')),
    problems: output().from(errors()),
  },
})
```

`errorPolicy` определяет реакцию на `errors` в ответе:

- `throw` — Query завершается ошибкой `GraphQLQueryError`, частичные данные
  доступны в самой ошибке;
- `ignore` — outputs получают `data`, errors скрыты;
- `all` — outputs получают `data`, а reader `errors()` — массив errors с `path`
  и `extensions`; errors также пишутся warning в diagnostics.

Компилятор сверяет `variables(...)` с переменными operation: необъявленный ключ
даёт warning, а пропущенная обязательная переменная `$x: T!` — ошибку.
Подробности: [Query](/reference/query#ошибки-graphql).

## 2. Живые обновления через подписку

Stream `order-updates` открывает GraphQL-подписку по протоколу graphql-sse.
Variables и заголовки вычисляются из props Stream:

```ts
defineStream({
  props: defineProps({
    tenant: field('String').default('ou'),
  }),

  transport: graphqlSse({
    url: env('GRAPHQL_SSE_URL'),
    document: gql`
      subscription OrderUpdated($tenant: String!) {
        orderUpdated(tenant: $tenant) { id status updatedAt }
      }
    `,
    variables: variables(({ prop }) => ({ tenant: prop('tenant') })),
    headers: { 'X-Tenant': prop('tenant') },
    errorPolicy: 'all',
  }),

  events: {
    next: event({ type: 'order.updated', payloadFrom: 'orderUpdated' }),
  },
})
```

По умолчанию запрос отправляется `POST` с JSON-телом. Если сервис ожидает
параметры в URL, укажите `method: 'GET'`. Обрыв соединения без `complete`
переподключает подписку через `reconnectDelay` (по умолчанию 3000 мс).
Подробности: [Stream](/reference/stream#graphql-подписка-через-sse).

Update Store применяет событие к строке read model:

```ts
defineUpdate({
  handles: ['order.updated'],

  mutations: [
    {
      strategy: 'merge',
      target: 'orders[id=$id]',
      ifExists: 'orders[id=$id]',
      value: { status: input('status'), updatedAt: input('updatedAt') },
      vars: { id: 'id' },
    },
  ],
})
```

## 3. Сборка в Composition

Composition загружает read model, публикует его в Store и подключает подписку
к тому же Store:

```ts
defineComposition({
  data: {
    ou: store('ou-orders'),
  },

  runtimes: {
    orders: query('orders-query')
      .storeTo(data('ou'), {
        orders: output('orders'),
      }),

    updates: stream('order-updates')
      .withProps({ tenant: 'ops' })
      .dispatchTo(data('ou')),
  },

  hooks: [
    onMount().run('orders'),
  ],
})
```

Props Stream можно связать с данными: `withProps({ orderId:
fromData('ou.selectedOrder') })`. При изменении значения подписка переоткрывается,
только если изменились итоговые variables или заголовки.

Команды, которые меняют данные на сервере, выполняются отдельными Query или
Action — подписка только доставляет изменения.

## 4. Схема GraphQL в редакторе

В редакторе GraphQL Query и Stream с `graphqlSse` откройте меню «Схема GraphQL»
на вкладке Source:

1. «Загрузить схему с endpoint» выполняет introspection с auth документа.
   Если introspection выключен, используйте «Загрузить схему из файла…»
   и выберите SDL или JSON introspection.
2. После загрузки документ внутри `gql` проверяется по схеме, а автодополнение
   предлагает поля, аргументы, enum и переменные.
3. «Импортировать типы из схемы» создаёт Type из object, input, interface, union
   и enum схемы.

Схема хранится в браузере и не участвует в компиляции. Подробности:
[Запуск Query и схема GraphQL](/configurator/query-run-and-graphql-schema#схема-graphql)
и [импорт Type](/reference/type#импорт-из-graphql).

## 5. Проверка запроса в панели запуска

Кнопка ▶ редактора Query открывает панель «Запуск Query». Заполните props,
проверьте «Итоговые variables» и нажмите «Выполнить». Панель покажет статус,
ответ, итоговый запрос без секретов, GraphQL errors с `path` и `extensions` и
outputs. Ошибки видны при любом `errorPolicy`. Подробности:
[Панель запуска Query](/configurator/query-run-and-graphql-schema#панель-запуска-query).

## 6. Работа без сервера

Inline mock Query задаёт `data` и, для GraphQL, `errors`:

```ts
mock: {
  enabled: true,
  data: { orders: [{ id: 'o-1', status: 'new', updatedAt: '2026-10-26T10:00:00Z' }] },
  errors: [{ message: 'Status is stale', path: ['orders', 0, 'status'] }],
},
```

Mock errors проходят тот же `errorPolicy`, что ответ сервера.

Simulation генерирует данные mock-сервисом. Для GraphQL Query объект `data`
собирается из outputs с контрактом, для подписки `type` описывает `data` события
`next`:

```ts
defineSimulation({
  target: composition('ou-page'),
  overrides: {
    runtimes: {
      orders: { request: mockRequest({ arrays: { orders: 20 } }) },
      updates: { stream: mockStream({ type: OrderUpdatedData, intervalMs: 1000 }) },
    },
  },
})
```

Для `mockRequest` outputs Query должны объявлять контракт, например
`output().from(data('orders')).contract(field(Order).array())`. `OrderUpdatedData`
— Type вида `defineType({ orderUpdated: field(Order) })`. Подробности:
[Simulation](/reference/simulation#graphql-query).
