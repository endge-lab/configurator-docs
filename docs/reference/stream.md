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
    "id": "SU-123",
    "patch": { "status": "boarding" }
  }
}
```

runtime создаст нормализованное событие с типом
`schedule.row.updated` и значением поля `payload` в качестве payload события.

## Transport

Stream поддерживает `sse(...)` и `websocket(...)`. Выбор transport не меняет
маршрутизацию событий в Composition.

### SSE

Поля `sse(...)`:

| Поле | Назначение |
| --- | --- |
| `url` | Статическая строка или `env('VARIABLE_NAME')` |
| `withCredentials` | Передавать cookies в native `EventSource` при `auth: 'none'` |
| `auth` | Правило авторизации: Workspace default profile, именованный AuthProfile или соединение без авторизации |

`env('ENDPOINT_SSE')` компилируется в Workspace var-token. Реальный URL
разрешается перед открытием соединения, поэтому endpoint не нужно дублировать в
документах разных окружений.

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

Пример прямого подключения к публичным котировкам Kraken. В настройках рабочего
пространства, раздел **Среда → Переменные окружения**, задайте:

```text
QUOTES_WS_URL = wss://ws.kraken.com/v2
```

В Source Stream:

```ts
defineStream({
  transport: websocket({
    url: env('QUOTES_WS_URL'),
    onOpen: [
      {
        method: 'subscribe',
        params: {
          channel: 'ticker',
          symbol: ['BTC/USD', 'ETH/USD', 'SOL/USD'],
          snapshot: true,
        },
      },
    ],
  }),

  events: {
    message: event({
      match: { channel: 'ticker' },
      eachFrom: 'data',
      type: 'quote.updated',
    }),
  },
})
```

`match` пропускает служебные сообщения Kraken. Для каждого элемента `data`
Stream публикует `quote.updated`; payload содержит поля Kraken, в том числе
`symbol`, `last`, `bid`, `ask`. Если Store использует `lastPrice`, соответствующий
Update читает `input('last')` и записывает результат в это поле. Stream не
переименовывает поля и не записывает данные в Store самостоятельно.

Формат подписки и сообщения определяет [протокол Kraken](https://docs.kraken.com/api/docs/websocket-v2/ticker/).
Имена каналов, символы и `method` остаются данными Source; ядро не содержит
специального кода для биржи. Число символов в подписке должно соответствовать
нужным инструментам: наличие строки в Store само по себе не добавляет подписку.

WebSocket предоставляет только transport event `message`. Настройки SSE
`auth` и `withCredentials` для него не поддерживаются и отклоняются compiler.
Core не добавляет Bearer headers и не разрешает AuthProfile для WebSocket.
Этот пример использует публичный поток без API-ключа; не помещайте credentials
в persisted Source.

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

Авторизованный transport поддерживает только стандартное SSE-событие `message`.
Именованные transport events доступны при `auth: 'none'` через native
`EventSource`. В этом режиме `withCredentials: true` разрешает браузеру
передавать cookies; Bearer token не добавляется.

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
- авторизованный Stream объявил transport event, отличный от `message`;
- `.dispatchTo(...)` ссылается не на Store data alias;
- целевой Store не содержит Update для типа события.

Настройка профилей, credentials и адаптеров описана в разделе [AuthProfile](./auth-profile).
