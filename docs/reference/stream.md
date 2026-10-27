---
description: "Stream — source-first описание внешнего потока событий: transport, авторизация SSE, нормализация событий, подключение в Composition."
---

# Stream

Stream — source-first описание внешнего потока событий. Он задаёт transport и
правила нормализации входящих сообщений, но не знает о Store и сам не изменяет
данные. Lifecycle Stream и его маршрутизацией владеет
[Composition](/reference/composition).

## Полный пример

```ts
defineStream({
  transport: sse({
    url: env('ENDPOINT_SSE'),
    withCredentials: false,
    auth: 'inherit',
  }),

  events: {
    message: event({
      typeFrom: 'eventInfo.name',
      payloadFrom: 'payload',
    }),
  },
})
```

Для сообщения

```json
{
  "eventInfo": { "name": "schedule.row.updated" },
  "payload": {
    "id": "item-123",
    "patch": { "status": "boarding" }
  }
}
```

runtime создаст нормализованное событие с типом
`schedule.row.updated` и значением поля `payload` в качестве payload события.

## Transport

Stream поддерживает `sse(...)`, `websocket(...)` и `graphqlSse(...)`. Выбор
transport не меняет маршрутизацию событий в Composition.

### SSE

Поля `sse(...)`:

| Поле | Назначение |
| --- | --- |
| `url` | Статическая строка или `env('VARIABLE_NAME')`; SSE не принимает props |
| `withCredentials` | Передавать cookies в native `EventSource` при `auth: 'none'` |
| `auth` | Правило авторизации: Workspace default profile, именованный AuthProfile или соединение без авторизации |

`env('ENDPOINT_SSE')` компилируется в Workspace var-token. Реальный URL
разрешается перед открытием соединения, поэтому endpoint не нужно дублировать в
документах разных контекстов.

### WebSocket

`websocket(...)` подключает Stream непосредственно к `ws://` или `wss://` endpoint.
Он принимает текстовые JSON messages; binary frames и произвольный текст
диагностируются как ошибка transport и не поступают в Store.

| Поле | Назначение |
| --- | --- |
| `url` | Строка или `env('VARIABLE_NAME')`; итоговый URL должен иметь схему `ws://` или `wss://` |
| `onOpen` | Необязательный массив JSON-сообщений, отправляемых по порядку при каждом открытии соединения |

`onOpen` содержит только JSON literals: объекты, массивы, строки, конечные числа,
boolean и `null`. Функции, spreads, вычисления и `env(...)` внутри этих сообщений
не поддерживаются. Каждая запись сериализуется в отдельный JSON frame.

Абстрактный пример JSON-протокола: сервер `wss://events.example.test/ws` принимает subscribe-message и отправляет `{ channel: 'items', data: [...] }`. Это договорённость с сервером примера, а не встроенный протокол Core.

```ts
defineStream({
  transport: websocket({
    url: env('ITEMS_WS_URL'),
    onOpen: [{ method: 'subscribe', channel: 'items' }],
  }),
  events: {
    message: event({
      match: { channel: 'items' },
      eachFrom: 'data',
      type: 'item.updated',
    }),
  },
})
```

Задайте `ITEMS_WS_URL` в переменных Workspace. `match` оставляет сообщения нужного канала, `eachFrom` публикует отдельное `item.updated` для каждого элемента `data`. Stream не переименовывает поля и не пишет в Store: это делает явно подключённый Update/Composition hook.

WebSocket предоставляет только transport event `message`. Настройки SSE
`auth` и `withCredentials` для него не поддерживаются и отклоняются compiler.
Core не добавляет Bearer headers и не разрешает AuthProfile для WebSocket.
Этот пример не требует API-ключа; не помещайте credentials
в persisted Source.

### GraphQL-подписка через SSE

`graphqlSse(...)` подключает GraphQL `subscription` по протоколу graphql-sse в
режиме distinct connections: одно HTTP-соединение на подписку, события `next` и
`complete`. Query и mutation выполняются через [Query](/reference/query#graphql-вариант).

```ts
defineStream({
  props: defineProps({
    orderId: field('ID'),
    tenant: field('String').default('ou'),
  }),

  transport: graphqlSse({
    url: env('GRAPHQL_SSE_URL'),
    method: 'POST',
    document: gql`
      subscription OrderUpdated($id: ID!) {
        orderUpdated(id: $id) { id status }
      }
    `,
    variables: variables(({ prop }) => ({ id: prop('orderId') })),
    headers: { 'X-Tenant': prop('tenant'), 'X-Region': env('REGION') },
    auth: 'inherit',
    errorPolicy: 'throw',
    reconnectDelay: 3000,
  }),

  events: {
    next: event({ type: 'order.updated', payloadFrom: 'orderUpdated' }),
    complete: event('order.subscription-completed'),
  },
})
```

| Поле | Назначение |
| --- | --- |
| `url` | Статическая строка, `env('VARIABLE_NAME')` или безопасное выражение над объявленными props (`prop('endpoint')`) |
| `method` | `'POST'` по умолчанию или `'GET'` |
| `document` | Статический `gql` с operation `subscription` |
| `fragments` | Фрагменты GraphQL, в том числе по контексту — как у [Query](/reference/query#фрагменты-по-контексту) |
| `operationName` | Имя operation; обязательно, если document содержит несколько operations |
| `variables` | `variables(({ prop }) => ({ ... }))`; читает только объявленные props и `env(...)` |
| `headers` | Object literal; значения могут читать `prop('key')` и `env('NAME')` |
| `extensions` | Object literal для поля `extensions` запроса; значения могут читать `prop('key')` и `env('NAME')` |
| `auth` | `'inherit'` по умолчанию, `'none'` или `{ mode: 'profile', profile: 'identity' }` — как у [SSE](#авторизация-sse) |
| `withCredentials` | `true` или `false`; передавать cookies |
| `errorPolicy` | `'throw'` по умолчанию, `'ignore'` или `'all'` |
| `reconnectDelay` | Задержка переподключения в миллисекундах, по умолчанию `3000` |

`POST` отправляет JSON-тело `{ query, operationName?, variables }`. `GET`
добавляет параметры `query`, `operationName` и `variables` (JSON) к URL,
сохраняя его query string и hash. Если задано `extensions`, `POST` добавляет его в
тело, а `GET` — параметром `extensions` (JSON); пустой объект не отправляется.
`extensions` не object literal — `stream-graphql-sse-extensions`; `url`,
`extensions` или `headers`, читающие необъявленный prop, —
`stream-transport-prop-missing`.

`url`-выражение вычисляется при каждом подключении, затем в нём подставляются
переменные workspace (`{VAR}`). Смена prop, от которого зависит адрес,
переоткрывает подписку на новом URL:

```ts
transport: graphqlSse({
  url: prop('endpoint'),
  document: gql`subscription { tick }`,
  extensions: { persistedQuery: { version: 1 }, trace: prop('trace'), region: env('REGION') },
}),
```

Компилятор отклоняет operation `query` и `mutation`
(`stream-graphql-operation-unsupported`) и сверяет `variables(...)` с
объявлениями переменных документа так же, как [Query](/reference/query#проверка-variables)
(коды `stream-graphql-variable-unknown` и `stream-graphql-variable-missing`).

`events` допускает только `next` (обязательно) и `complete`. Формы `event(...)`
— `type`, `typeFrom`, `payloadFrom`, `match`, `eachFrom` — работают над `data`
результата `next`. `complete` публикует событие с `payload: null`, если оно
объявлено, и закрывает подписку без переподключения.

Переподключение зависит от причины ошибки. Каждая ошибка публикует `transport:error`.

| Причина | Поведение |
| --- | --- |
| Обрыв без `complete`, сетевая ошибка, HTTP 5xx, HTTP 408 и 429 | Переподключение через `reconnectDelay` с теми же variables |
| HTTP 401 при `auth: 'inherit'` или профиле | Один повтор с принудительным обновлением token AuthProfile; второй 401 подряд останавливает подписку. Счётчик сбрасывается после успешного открытия |
| HTTP 401 без auth, остальные 4xx (включая 403) | Подписка останавливается, ошибка — `GraphQLSseHttpError` со `status` и `url` (класс экспортируется из `@endge/core`), статус runtime `error` |

`errorPolicy` применяется к каждому `next`, содержащему `errors`:

| `errorPolicy` | Результат |
| --- | --- |
| `throw` | Событие не публикуется; `transport:error` получает `GraphQLQueryError` с `errors` и частичными `data`; статус runtime `error`, следующий успешный `next` возвращает `success`. Подписка продолжается |
| `ignore` | Публикуется `data`, если оно не `null`; errors скрыты |
| `all` | Публикуется `data`, если оно не `null`, с `meta.graphQLErrors`; warning `endge.stream.graphql-errors` пишется в diagnostics, в том числе при `data: null` |

Некорректный результат `next` (не объект, нет `data` и `errors`, `errors` не
массив) публикует `transport:error` с `GraphQLResponseFormatError`.

### Props Stream

`props: defineProps({...})` объявляет входы Stream с тем же контрактом поля, что
у [Query](/reference/query#props). Props допустимы только с `graphqlSse`
(`stream-props-transport`), default — только literal: `.from(filter(...))`
отклоняется (`stream-prop-default-source`). Для `graphqlSse` URL, variables, headers и extensions могут зависеть от объявленных props; URL вычисляется заново при подключении. У SSE и WebSocket URL остаётся строкой или `env(...)`.

Значения передаются из Composition:

```ts
runtimes: {
  feed: stream('order-updates')
    .withProps({ orderId: fromData('db.selectedOrder'), tenant: 'ops' })
    .dispatchTo(data('db')),
}
```

Runtime вычисляет variables и headers перед открытием соединения. При изменении
связанных данных подписка переоткрывается, только если изменился итоговый запрос.
Необъявленный prop не останавливает Stream: runtime пишет warning
`endge.stream.prop-unknown`.

### Lifecycle WebSocket

После закрытия соединения транспорт повторяет попытку через 1 секунду, увеличивая
задержку до 15 секунд. Получение корректного JSON сбрасывает задержку до 1 секунды.
При каждом новом соединении весь `onOpen` отправляется снова; подтверждение
подписки и прикладные ошибки остаются входящими сообщениями сервиса.

Пауза закрывает соединение, а возобновление создаёт новое и повторяет подписку.
Stop, destroy и переход в effective mock mode закрывают socket, удаляют listeners
и отменяют таймер reconnect. Сообщения старого соединения игнорируются. В mock mode
внешний WebSocket не открывается; Simulation использует собственный generator
contract. Автоматическое восстановление пропущенных событий transport не
гарантирует — snapshot или replay задаются протоколом сервиса в `onOpen`.

## Авторизация SSE

SSE поддерживает три правила авторизации:

| Форма | Поведение |
| --- | --- |
| `auth: 'inherit'` | Использовать default AuthProfile текущего Workspace |
| `auth: { mode: 'profile', profile: 'identity' }` | Использовать конкретный AuthProfile по identity |
| `auth: 'none'` | Не добавлять Authorization header |

Если `auth` не указан, используется `inherit`.

Именованный профиль задаётся в source без токена или других credentials:

```ts
transport: sse({
  url: env('ENDPOINT_EVENTS_SSE'),
  withCredentials: false,
  auth: {
    mode: 'profile',
    profile: 'keycloak-local',
  },
})
```

`profile` — это identity существующего активного AuthProfile, а не его
отображаемое имя. Runtime разрешает его независимо от Workspace default profile
и не делает fallback на default, если указанный профиль отсутствует, выключен
или не может создать session.

Для `inherit` и `profile` SSE transport получает access token через AuthProfile
и отправляет `Authorization: Bearer <token>`. Поэтому выбранный adapter должен
предоставлять именно access token; произвольные custom headers в этом transport
не поддерживаются.

Перед каждым connect и reconnect runtime проверяет актуальность session. После
ответа `401` или `403` следующая попытка принудительно обновляет token того же
профиля. Это не переключает Stream на другой AuthProfile: issuer, audience и
roles нового token всё равно должны соответствовать SSE endpoint.

Авторизованный transport сохраняет имена SSE-событий, поэтому в `events` можно
объявлять именованные transport events так же, как при `auth: 'none'`.
`withCredentials: true` разрешает браузеру передавать cookies в обоих режимах.
При `auth: 'none'` используется native `EventSource`, Bearer token не добавляется.
Данные, которые не являются JSON, доставляются строкой.

## Нормализация событий

Фиксированный тип и путь к payload:

```ts
events: {
  scheduleChanged: event('schedule.row.updated', 'payload'),
}
```

Тип из самого сообщения:

```ts
events: {
  message: event({
    typeFrom: 'eventInfo.name',
    payloadFrom: 'data',
  }),
}
```

| Форма | Результат |
| --- | --- |
| `event(type)` | Фиксированный канонический тип, payload равен всему сообщению |
| `event(type, payloadPath)` | Фиксированный тип и payload по dot-path |
| `event({ type })` | Фиксированный канонический тип, payload равен всему сообщению |
| `event({ type, payloadFrom })` | Фиксированный тип и payload по dot-path |
| `event({ typeFrom })` | Тип читается по dot-path, payload равен всему сообщению |
| `event({ typeFrom, payloadFrom })` | Тип и payload читаются по отдельным dot-path |

Пустой `payloadFrom` означает всё сообщение. Если `typeFrom` не разрешился в
непустую строку, runtime публикует ошибку и не маршрутизирует событие дальше.

### Фильтрация и массивы

Объектная форма `event(...)` также принимает `match` и `eachFrom`; они работают
для обоих transport.

1. `match` проверяет все пары `{ 'dot.path': expected }` в исходном JSON-сообщении.
   Допустимы только scalar values: строка, число, boolean или `null`; сравнение
   точное, без приведения типов. Несовпадение тихо пропускает сообщение.
2. `eachFrom` извлекает массив по dot-path. Пустая строка означает корневой массив.
   Пустой массив не создаёт событий, отсутствующий путь или значение другого типа
   публикует `event:error`.
3. Для каждого элемента выбираются `type` либо `typeFrom` и `payloadFrom`.
   Пути на этом шаге относятся к элементу массива. Без `eachFrom` они относятся
   ко всему сообщению. Одновременно задавать `type` и `typeFrom` нельзя.

`match: {}` не ограничивает сообщения. Dot-path читает только собственные поля
объекта. Если consumer остановит или поставит Stream на паузу при обработке
элемента, оставшиеся элементы сообщения не публикуются.

## Подключение в Composition

Composition создаёт Stream runtime, владеет соединением и передаёт
нормализованные события в один или несколько Store:

```ts
defineComposition({
  data: {
    schedule: store('schedule'),
  },

  runtimes: {
    changes: stream('schedule-events')
      .batch({ maxItems: 50, maxWaitMs: 16 })
      .dispatchTo(data('schedule')),
  },
})
```

`.dispatchTo(...)` принимает только объявленные Store data aliases. Для каждого
события Store выбирает принадлежащий ему [Update](/reference/update), чей
`handles` содержит нормализованный тип. Если подходящего Update нет, Store
оставляет событие без изменений.

`.batch(...)` — политика Composition, а не Stream. `maxItems` задаёт максимальный
размер пакета, `maxWaitMs` — время ожидания до flush. Без `.batch(...)` события
применяются сразу. Все Store, указанные в одном `.dispatchTo(...)`, получают
событие внутри общей Raph transaction.

```text
SSE message -> Stream event envelope -> Composition -> Store -> Update
```

Stream отвечает только за первые два шага. Mutation paths, выбор writable-полей
и атомарное изменение данных принадлежат Store и Update.

## Runtime и диагностика

При mount Composition создаётся `StreamRuntimeHost`. Он открывает transport,
хранит статус, время последнего события и счётчик полученных сообщений. При
unmount соединение закрывается вместе с runtime-host-ом.

Частые ошибки:

- Workspace variable из `url` не разрешилась;
- `typeFrom` вернул пустое значение;
- `eachFrom` не указывает на массив;
- WebSocket URL имеет неподдерживаемую схему или сервер присылает не JSON text;
- WebSocket содержит SSE-настройки, именованные события или не-JSON `onOpen`;
- `graphqlSse` содержит не `subscription`, объявляет события кроме `next` и `complete` или читает необъявленный prop;
- `next` подписки пришёл с `errors` при `errorPolicy: 'throw'`;
- `.dispatchTo(...)` ссылается не на Store data alias;
- целевой Store не содержит Update для типа события.

Настройка профилей, credentials и адаптеров описана в разделе [AuthProfile](./auth-profile).
