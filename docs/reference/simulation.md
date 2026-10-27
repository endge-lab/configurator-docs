---
description: "Simulation — подмены запросов и Stream для одной Composition: Source, контракт ответа и подсказки, редактирование и хранение."
---

# Simulation

Simulation сохраняет описание подмен запросов для одной [Composition](/reference/composition).
Документ доступен в разделе **Инфраструктура → Симуляции**. Сохранённую Simulation
запускает контекстное меню документа, черновик — кнопка Preview редактора;
значения генерирует mock-сервис.

## Source

```ts
defineSimulation({
  target: composition('application-startup'),
  overrides: {
    runtimes: {
      scheduleSandbox: {
        runtimes: {
          query: {
            request: mockRequest({
              seed: 'schedule-demo',
              arrays: {
                items: 50,
              },
            }),
          },
        },
      },
    },
  },
})
```

`target` выбирает Composition по identity. `scheduleSandbox` и `query` — aliases,
уже объявленные в её дереве `runtimes`. Вложенность повторяет Composition и scopes.
Simulation не создаёт новые aliases и не меняет props, activation или Store. Она подменяет request Query и generator Stream только в явно выбранных runtime-узлах.

`request: mockRequest(...)` допустим только у Query, `stream: mockStream(...)` —
только у Stream. `seed` — необязательная строка.
`arrays` — необязательный объект: ключ обозначает массив в корневом ответе Query,
значение — неотрицательное целое количество элементов. Например, `items: 50`,
`'items[].children': 3`; для корневого массива используется `''`.

## Контракт ответа и подсказки

Чтобы получить пути массивов, Query должен явно описывать корневой ответ:

```ts
outputs: {
  response: output()
    .from(response())
    .contract(field(ScheduleResponse)),
}
```

Редактор предлагает Composition, её вложенные aliases и пути массивов из Type.
Контракт отдельного `response('items')` не описывает весь ответ. Если корневого
контракта нет, он неоднозначен или его Type недоступен, диагностика объясняет причину.
Редактор не подставляет предполагаемый тип. Динамические ключи record не предлагаются
как статические пути.

### GraphQL Query

Для GraphQL Query корневой ответ — объект `data` операции. Если есть корневой
`output().from(data()).contract(field(Type))` без преобразований, используется он,
как у REST. Иначе объект `data` собирается из outputs вида
`output().from(data('a.b')).contract(field(Type))` без выражений и преобразований:
вложенные объекты строятся по статическим путям, все поля обязательные.

```ts
// Query orders:
outputs: {
  orders: output().from(data('orders')).contract(field(Order).array()),
  total: output().from(data('meta.total')).contract(field(Number)),
}

// Simulation:
request: mockRequest({ arrays: { orders: 20 } })
```

Пути `arrays` относятся к собранному объекту: `orders`, `orders[].items`.
Диагностика отклоняет разные контракты одного пути, путь вместе с вложенным в
него (`data('a')` и `data('a.b')`), индексы массивов (`data('items.0')`) и Query
без единого output с контрактом. Outputs с выражением или преобразованиями
контракт не задают.

GraphQL errors в Simulation задаёт `errors` в `mockRequest`:

```ts
orders: { request: mockRequest({ errors: [{ message: 'Denied', path: ['orders'] }] }) }
```

Элемент — `{ message, path?, extensions? }`. Errors проходят тот же `errorPolicy`
Query, что [`mock.errors`](/reference/query#mock-preview-и-runtime): `throw` —
`GraphQLQueryError` и статус `error`, `all` — `errors()` и warning, `ignore` —
пусто. Неверная форма — `simulation-request-errors`, цель не GraphQL Query —
`simulation-request-errors-transport`.

## Подмена Stream

```ts
stream: mockStream({
  type: PortfolioQuote,
  event: 'quote.updated',
  seed: 'portfolio-demo',
  intervalMs: 1000,
  itemsPerMessage: 5,
  fields: {
    symbol: { enum: ['BTC/USD', 'ETH/USD'] },
    lastPrice: { minimum: 0.01, maximum: 100000 },
  },
})
```

`type` — существующий Type payload, `event` — нормализованный тип события,
который ожидает Update. `fields` ограничивает значения по статическим путям:
`enum`, `minimum`, `maximum`. По умолчанию `intervalMs` — 1000 (100…60000),
`itemsPerMessage` — 1 (1…100).

### GraphQL-подписка

Для Stream с `graphqlSse(...)` `type` описывает `data` события `next`, а `event`
не указывается: тип события задаёт `events.next` Stream (иначе
`simulation-stream-event-graphql`).

```ts
// Type OrderUpdatedData = defineType({ orderUpdated: field(Order) })
stream: mockStream({
  type: OrderUpdatedData,
  intervalMs: 1000,
  errors: [{ message: 'Status is stale', path: ['orderUpdated', 'status'] }],
})
```

Сгенерированные `data` проходят тот же путь, что ответ сервера: `events.next`,
`errorPolicy` Stream, `meta.graphQLErrors` и warning при `all`, `transport:error`
без публикации события при `throw`. Необязательный `errors` — непустой статический
JSON-массив GraphQL errors, который добавляется к каждому событию `next`; он
разрешён только для `graphqlSse` (`simulation-stream-errors-transport`). Для `sse`
и `websocket` `event` обязателен (`simulation-stream-contract`).

## Редактирование и хранение

Новый документ содержит пустой target и пустые overrides. Source можно сохранить
незавершённым: ошибки будут показаны на вкладке диагностики. После исправления
ссылок compiler строит декларативный artifact с зависимостями от Composition,
Query и Type. Изменение зависимостей обновляет диагностику и делает старый artifact
неактуальным до пересборки.

Несохранённый черновик сохраняется при переключении вкладок. После перезагрузки
страницы вкладка восстанавливается с серверной версией Source, поэтому перед
перезагрузкой сохраните нужные изменения.

Доступны обычные действия документа: создание, переименование, дублирование,
перемещение в папку, история revisions, удаление и восстановление. Экспорт и импорт
выполняются backend вместе с остальным workspace; Simulation сохраняет `sourceVersion: 1`.
Текущий полный workspace snapshot использует `schemaVersion: 10` (отдельно от `sourceVersion` Simulation). Backend строго сверяет версию формата; неподдерживаемый snapshot повторно экспортируйте из совместимого backend. Актуальная версия находится в manifest Service Backend `VERSION`, поле `WORKSPACE_SCHEMA_VERSION`.

Открытие и компиляция Simulation не выполняют Query и не вызывают Mock-сервис.
Выполнение начинается только при явном запуске.
