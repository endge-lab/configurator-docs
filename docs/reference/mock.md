# Mock data

`RMock` — сохраняемый доменный документ с fixture-данными. Он позволяет вынести большой JSON из source других сущностей, переиспользовать один сценарий в нескольких preview и подключить data provider из application code без скрытого чтения файлов runtime-ом.

Mock не является runtime state, Store или production default. `mock(identity)` создаёт явную ссылку на документ, а consumer решает, когда materialize его значение.

## Основные поля

| Поле | Назначение |
| --- | --- |
| `identity` | Стабильное имя, которое используется в `mock(identity)` |
| `displayName` | Название в Configurator |
| `description` | Описание сценария и назначения данных |
| `contentSource` | `document` или `code-provider` |
| `contentType` | `application/json` или `text/plain` |
| `source` | Persisted JSON/text для режима `document` |
| `codeRef` | Namespaced ref provider-а для режима `code-provider` |

`identity` и `codeRef` не взаимозаменяемы. Source всегда ссылается на persisted `RMock.identity`. `codeRef` используется только внутри документа, чтобы найти зарегистрированный application provider.

## JSON document

Для обычного fixture выберите `contentSource: document` и `contentType: application/json`. Например, Mock с identity `groundhandling-query-requirements` может хранить значение одного typed Composition prop:

```json
{
  "arrival": {
    "attributes": ["LegStatus", "BestOn"],
    "groundHandling": [
      {
        "code": "Bridge On",
        "points": ["value"]
      }
    ]
  },
  "departure": {
    "attributes": ["LegStatus", "BestOff"],
    "groundHandling": [
      {
        "code": "Bridge Off",
        "points": ["value"]
      }
    ]
  }
}
```

Каждое чтение возвращает независимую JSON-копию. Изменение значения внутри одного preview не изменяет persisted Mock и другие preview sessions.

## Code provider

Режим `code-provider` хранит данные не в `source`, а получает их через синхронный provider, зарегистрированный приложением:

```ts
Endge.mock.registerProvider({
  ref: '@application:mocks.groundhandling-requirements',
  description: 'Ground handling requirements fixture',
  provide: () => ({
    arrival: {
      attributes: ['LegStatus', 'BestOn'],
      groundHandling: [],
    },
    departure: {
      attributes: ['LegStatus', 'BestOff'],
      groundHandling: [],
    },
  }),
})
```

Persisted RMock при этом содержит:

```text
identity: groundhandling-query-requirements
contentSource: code-provider
codeRef: @application:mocks.groundhandling-requirements
```

Provider должен быть синхронным и возвращать JSON-compatible значение. Регистрация provider-а сама по себе не создаёт RMock document.

## Composition preview

Composition принимает RMock как значение конкретного preview prop:

```ts
defineComposition({
  props: defineProps({
    requirements: field('GroundHandlingQueryRequirements'),
  }),

  previewProps: definePreviewProps({
    requirements: mock('groundhandling-query-requirements'),
  }),

  runtimes: {},
})
```

Compiler сохраняет `{ kind: 'mock', identity }` в `ProgramArtifact.previewProps`, добавляет dependency с ролью `composition-preview:<prop>` и проверяет binding status. Configurator Runtime Preview разрешает Mock и передаёт полученное значение через обычный `mount({ props })`.

Preview fixture не используется при production mount, запуске Project или вызове вложенной Composition. Подробный contract: [Composition](/reference/composition#preview-props).

## Store initializer

Store может использовать RMock как initial value:

```ts
defineStore({
  data: {
    raw: value(mock('groundhandling-response')),
  },
})
```

В отличие от Composition preview, это значение materialize уже самим `StoreRuntimeHost` как начальное runtime state поля `raw`.

## Query mock и RMock

В Query существует локальная секция `mock.enabled`/`mock.data`. Это inline mock ответа конкретного Query и не является ссылкой на RMock document:

```ts
defineQuery({
  mock: {
    enabled: true,
    data: {
      rows: [],
    },
  },
})
```

Используйте Query `mock.data` для небольшого сценария, принадлежащего одному запросу. Используйте RMock, когда данные большие, переиспользуются несколькими сущностями или должны предоставляться application code.

## Component SFC

Component SFC также поддерживает `definePreviewProps`, но его runtime-backed значения сейчас задаются через `fromStore` и `fromData`. Прямая форма `mock(identity)` поддерживается в Composition preview и Store initializer. Для компонента RMock можно сначала materialize в Store, а затем прочитать через `fromData`.

## Diagnostics

Возможные binding states:

| Status | Значение |
| --- | --- |
| `document` | Persisted JSON/text доступен |
| `connected` | Persisted document связан с зарегистрированным code provider |
| `missing-document` | RMock с указанным identity не загружен |
| `missing-provider` | Документ существует, но `codeRef` не зарегистрирован |
| `invalid-content` | JSON в `source` не разбирается |

Store initializer рассматривает недоступный Mock как compile error, потому что от него зависит runtime state. Composition preview публикует warning: сломанный fixture не должен делать production Composition неисполняемой, но Runtime Preview завершится понятной ошибкой при попытке materialize значение.

Не храните в Mock secrets, access tokens или production credentials. Mock documents являются конфигурационными данными и могут экспортироваться вместе с workspace.
