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

В Stream v1 поддерживается transport `sse(...)`:

| Поле | Назначение |
| --- | --- |
| `url` | Статическая строка или `env('VARIABLE_NAME')` |
| `withCredentials` | Передавать cookies в native `EventSource` при `auth: 'none'` |
| `auth` | Правило авторизации: Workspace default profile, именованный AuthProfile или соединение без авторизации |

`env('ENDPOINT_SSE')` компилируется в Workspace var-token. Реальный URL
разрешается перед открытием соединения, поэтому endpoint не нужно дублировать в
документах разных окружений.

## Авторизация

Stream поддерживает три правила авторизации:

| Форма | Поведение |
| --- | --- |
| `auth: 'inherit'` | Использовать default AuthProfile текущего Workspace |
| `auth: { mode: 'profile', profile: 'identity' }` | Использовать конкретный AuthProfile по identity |
| `auth: 'none'` | Не добавлять Authorization header |

Если `auth` не указан, используется `inherit`.

Именованный профиль задаётся в source без токена или других credentials:

```ts
transport: sse({
  url: env('ENDPOINT_AODB_SSE'),
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
| `event({ typeFrom })` | Тип читается по dot-path, payload равен всему сообщению |
| `event({ typeFrom, payloadFrom })` | Тип и payload читаются по отдельным dot-path |

Пустой `payloadFrom` означает всё сообщение. Если `typeFrom` не разрешился в
непустую строку, runtime публикует ошибку и не маршрутизирует событие дальше.

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
- авторизованный Stream объявил transport event, отличный от `message`;
- `.dispatchTo(...)` ссылается не на Store data alias;
- целевой Store не содержит Update для типа события.

Общая граница событий, глобальной шины и Updates описана в разделе
[события и обновления](/core/events-and-updates).
