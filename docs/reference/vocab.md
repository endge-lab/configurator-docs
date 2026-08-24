# Справочники (Vocab)

Vocab — source-first документ внешнего справочника. Сохраняемый `source` описывает provider, необязательный Mock и упорядоченный output pipeline. Композиционный вызов остаётся коротким: `vocab('airlines')` ссылается на Vocab по его стабильному `identity`.

Каноническая версия контракта:

```text
sourceVersion: 1
```

```ts
defineVocab({
  provider: payload({
    baseUrl: env('ENDPOINT_VOCABS_SERVICE'),
    collection: 'airlines',
    auth: { mode: 'inherit' },
  }),

  mock: mock('demo-fixtures').path('lookups.airlines'),

  outputs: {
    items: output()
      .from(response())
      .dataView('normalize-airlines')
      .convert('normalize-code'),
  },
})
```

`outputs.items` обязателен и после всех преобразований должен вернуть массив.

## Provider

В `sourceVersion: 1` поддерживается Payload-provider:

```ts
provider: payload({
  baseUrl: env('ENDPOINT_VOCABS_SERVICE'),
  collection: 'stations',
  auth: { mode: 'profile', profile: 'keycloak-default' },
})
```

`provider` необязателен. Vocab без provider допустим, если данные приходят только из Mock. `baseUrl` принимает строку или `env('NAME')`; `collection` задаёт Payload collection slug. Auth использует `inherit`, `none` либо конкретный профиль.

Live reader агрегирует все страницы Payload и нормализует корневой массив либо объект `{ docs: [...] }` в одно raw-значение. Затем применяется output pipeline.

## Mock и dot-path

```ts
mock: mock('demo-fixtures')
```

Эта форма читает весь JSON-документ. Путь внутрь fixture задаётся через точечную JSON-нотацию:

```ts
mock: mock('demo-fixtures').path('lookups.airlines')
```

Числовой сегмент обращается к элементу массива: `groups.0.items`. Отсутствующий явно указанный Mock-документ или путь является ошибкой компиляции/runtime, а не пустым значением.

В Mock Runtime действуют отдельные правила:

- provider, его Auth и сетевой transport не инициализируются;
- при явной Mock-ссылке читается fixture и применяется тот же output pipeline;
- без Mock-ссылки штатный результат Vocab — `[]`;
- SSE-подписки в mock-режиме не запускаются.

Таким образом Mock Preview не требует Keycloak только потому, что Vocab имеет live provider.

## Output pipeline

Pipeline сохраняет порядок вызовов и допускает чередование DataView и Converter:

```ts
outputs: {
  items: output()
    .from(response())
    .dataView('unwrap-docs')
    .convert('normalize-codes', { trim: true })
    .dataView('only-active'),
}
```

`.convert(identity, options?)` получает текущее значение целиком и вызывается один раз. Если требуется обработать каждый элемент массива, это явно описывается внутри DataView. Async Converter не поддерживается.

Query использует тот же ordered-transform контракт. Поле Query artifact `dataViews` временно сохраняется только как compatibility projection для старых клиентов.

## Использование в Composition

```ts
defineComposition({
  data: {
    airlines: vocab('airlines'),
    aircrafts: vocab('aircrafts'),
    stations: vocab('stations').policy({
      strategy: 'stale-while-revalidate',
      maxAgeMs: 300_000,
      onError: 'use-cache',
    }),
  },

  runtimes: {
    schedule: component('schedule'),
  },
})
```

Имя слева — публичный alias Composition, аргумент `vocab(...)` — identity документа. Compiler сохраняет эту связь в Program artifact; runtime не перечитывает Domain и не компилирует Vocab source повторно.

Если `.policy(...)` отсутствует, используется `cache-first`, `maxAgeMs: null`, `onError: 'fail'`.

## Cache и consumers

Канонический runtime path строится по identity:

```text
vocabs.<identity>
```

На переходный релиз дополнительно публикуется alias `vocabs.<provider.collection>`. Новый код не должен зависеть от этого alias.

Composition, Filter и Action conditions читают уже разрешённое значение по identity. Они не создают собственные transport-загрузки. Параллельные запросы одного Vocab объединяются в один in-flight request.

## Component SFC

SFC обращается к публичному alias ближайшей Composition:

```vue
<Select
  :value="flight.flightCarrier"
  :options="vocab('airlines', {
    valuePath: 'code',
    labelPath: 'description',
  })"
/>
```

Первый аргумент здесь — alias `Composition.data`, а не обязательно физическая identity. Runtime разрешает его через compiled Composition catalog и подписывается на `vocabs.<identity>`.

## Configurator

Редактор Vocab содержит вкладки «Общее», «Source», «Артефакт» и «Диагностика». Source в Monaco — единственный сохраняемый источник истины; artifact и diagnostics пересобираются из него.

«Полная загрузка словаря» является authoring-действием: она явно вызывает live provider, применяет pipeline и показывает итоговый `items` JSON. Поэтому эта команда может запросить авторизацию даже тогда, когда Runtime Preview запускается в mock-режиме.

Контекстное меню корня «Словари» умеет создать или обновить JSON Mock: оно предварительно загружает до 10 raw Payload-элементов каждого provider-backed Vocab, сохраняет их под ключами identity и добавляет в source ссылки `mock(...).path('<identity>')`. Существующие ключи других сценариев сохраняются, а перезаписываемые Vocab-ключи подтверждаются до записи.

## Миграция legacy-документов

Совместимый backend-релиз формирует `sourceVersion: 1` и `source` из прежних `collection_slug`, `service_base_url` и `auth_profile_id`. Значение вида `{ENDPOINT_NAME}` становится `env('ENDPOINT_NAME')`; обычный URL остаётся строкой.

Пока действует совместимый релиз, legacy-поля могут присутствовать рядом с source, но редактор и Core считают source каноническим. После миграции всех consumers cleanup-релиз удаляет legacy JSON-ключи и relation `auth_profile_id`; обратная миграция восстанавливает схему, но не потерянные legacy-значения.

## Граница ответственности

- Domain хранит Vocab source.
- Compiler проверяет ссылки, pipeline и итоговый массив, создавая Program artifact.
- Composition определяет момент активации зависимости.
- `Endge.vocabs` выполняет provider или Mock-ветку и дедуплицирует загрузки.
- Raph хранит значения по `vocabs.<identity>`.
- Runtime consumers читают artifact/cache и не обращаются к persisted source.
