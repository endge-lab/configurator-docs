---
description: "Минимальные проверенные примеры документов всех 22 коллекций Endge: Source и точное тело HTTP-запроса создания с полем версии формата."
---

# Примеры документов всех типов

На странице — по одному минимальному документу каждой коллекции, которую сохраняет Service Backend. Для каждого показаны Source (если он есть) и **точное тело** `POST /api/v1/<коллекция>`. Тело в блоке `json` — каноническое: Source в нём совпадает с блоком выше. Через MCP то же тело передаётся в `endge_create_document` как `document`, коллекция — в `collection` (для документа фасета ещё `facetIdentity`).

Все примеры вместе образуют один workspace. Он проверен двумя способами:

1. Каждое тело создано на Service Backend 0.17.0 (`AUTH_MODE=dev`): 24 ответа `201`.
2. Snapshot `GET /api/v1/domain` скомпилирован целиком `@endge/core` 1.0.0-dev.11 тем же путём, что в Configurator: ни одной ошибки и предупреждения во всех контекстах фасета.

Успешная запись сама по себе ничего не доказывает: backend хранит Source как текст и не компилирует его. Связанный пример со сложными связями — [вертикальный срез](/agents/vertical-slice).

## Сводка полей

| Коллекция | Source | Поле версии формата | Другие обязательные поля |
| --- | --- | --- | --- |
| `types`, `configurations`, `streams`, `stores`, `data-views`, `actions`, `styles`, `compositions`, `simulations` | да | `sourceVersion: 1` | — |
| `queries` | да | `sourceVersion: 2` | — |
| `updates` | да | `sourceVersion: 1` | `storeIdentity` |
| `computations` | да | `sourceVersion: 1` | `contractVersion: 1` |
| `filters`, `vocabs` | да, необязателен | `sourceVersion: 1` вместе с `source` | — |
| `components` | SFC | `modelVersion: 1` (не `sourceVersion`) | — |
| `mocks` | содержимое fixture | нет | `contentSource`, `contentType` по смыслу |
| `facets` | нет | нет | `icon`, `color` |
| `facet-documents` | нет | нет | `configuration`; путь `/facets/{facet}/documents` |
| `i18n-bundles`, `converters`, `navigations` | нет | нет | — |
| `auth-profiles` | нет | нет | `adapterId` |

Значение `sourceVersion` — версия языка Source, а не ревизия документа. Configurator создаёт все документы с `1`, кроме Query (`2`). Поле версии передаётся и при `PATCH`, если меняется `source`.

## Порядок создания

Ссылки разрешает компилятор, а не backend, поэтому backend примет документы в любом порядке. Но промежуточный workspace будет компилироваться с ошибками, а план коммита — содержать сломанные состояния. Создавайте от зависимостей к потребителям:

1. Фасеты и их документы.
2. Types, затем Configuration.
3. Mock, I18n Bundle, Style, Converter, AuthProfile.
4. Filter, Query, Stream, Vocab.
5. Store, затем его Update.
6. DataView и Computation.
7. Action (вызывает Query, Computation).
8. Component SFC: сначала дочерние, затем использующие их.
9. Composition: сначала вложенные (`kind: 'library'`), затем страницы (`kind: 'workspace'`).
10. Simulation, Navigation.

## Документы
### Facet

Фасет — ось контекста сборки. Тело без Source; `icon` и `color` обязательны.

`POST /api/v1/facets`:

```json [POST /api/v1/facets]
{
  "identity": "example-variant",
  "displayName": "Вариант",
  "icon": "Layers",
  "color": "#2563eb"
}
```

### Документ фасета

Создаётся по пути родителя. `configuration.patch` меняет значения Configuration для этого варианта.

`POST /api/v1/facets/example-variant/documents`:

```json [POST /api/v1/facets/example-variant/documents]
{
  "identity": "variant-a",
  "displayName": "Вариант A",
  "configuration": {
    "mode": "inherit",
    "patch": {}
  }
}
```

### Type

```ts
defineType({
  id: field(String),
  title: field(String),
  done: field(Boolean),
})
```

`POST /api/v1/types`:

```json [POST /api/v1/types]
{
  "identity": "ExampleItem",
  "displayName": "Пример записи",
  "sourceVersion": 1,
  "source": "defineType({\n  id: field(String),\n  title: field(String),\n  done: field(Boolean),\n})"
}
```

### Type с вложенным списком

Внутри Type ссылка на другой Type пишется `type('ExampleItem')`, список — `arrayOf(...)`. В контрактах Query, Store и props та же ссылка пишется строкой: `field('ExampleItem').array()`.

```ts
defineType({
  items: field(arrayOf(type('ExampleItem'))),
})
```

`POST /api/v1/types`:

```json [POST /api/v1/types]
{
  "identity": "ExampleItemsResponse",
  "displayName": "Пример ответа списка",
  "sourceVersion": 1,
  "source": "defineType({\n  items: field(arrayOf(type('ExampleItem'))),\n})"
}
```

### Configuration

Identity Configuration — пространство имён: значение читается как `config('example.title')`.

```ts
defineConfig({
  title: value(String, 'Пример').label('Заголовок'),
})
```

`POST /api/v1/configurations`:

```json [POST /api/v1/configurations]
{
  "identity": "example",
  "displayName": "Пример настроек",
  "sourceVersion": 1,
  "source": "defineConfig({\n  title: value(String, 'Пример').label('Заголовок'),\n})"
}
```

### Query (REST)

`sourceVersion` у Query — ровно `2`. Контракт output ссылается на Type через `field('ExampleItem').array()`; контракт корневого ответа (`response`) нужен Simulation, чтобы знать пути массивов.

```ts
defineQuery({
  kind: 'rest',
  request: {
    endpoint: 'https://api.example.test',
    path: '/items',
    method: 'GET',
  },
  outputs: {
    response: output().from(response()).contract(field('ExampleItemsResponse')),
    items: output().from(response('items')).contract(field('ExampleItem').array()),
  },
  mock: {
    enabled: true,
    data: { items: [{ id: 'item-1', title: 'Первая', done: false }] },
  },
})
```

`POST /api/v1/queries`:

```json [POST /api/v1/queries]
{
  "identity": "example-items",
  "displayName": "Пример списка",
  "sourceVersion": 2,
  "source": "defineQuery({\n  kind: 'rest',\n  request: {\n    endpoint: 'https://api.example.test',\n    path: '/items',\n    method: 'GET',\n  },\n  outputs: {\n    response: output().from(response()).contract(field('ExampleItemsResponse')),\n    items: output().from(response('items')).contract(field('ExampleItem').array()),\n  },\n  mock: {\n    enabled: true,\n    data: { items: [{ id: 'item-1', title: 'Первая', done: false }] },\n  },\n})"
}
```

### Query (GraphQL)

```ts
defineQuery({
  kind: 'graphql',
  props: defineProps({
    id: field('String'),
  }),
  request: {
    endpoint: 'https://api.example.test/graphql',
    operationName: 'LoadItem',
    document: gql`query LoadItem($id: ID!) { item(id: $id) { id title done } }`,
    variables: variables(({ prop }) => ({ id: prop('id') })),
    errorPolicy: 'throw',
  },
  outputs: {
    item: output().from(data('item')).contract(field('ExampleItem')),
  },
})
```

`POST /api/v1/queries`:

```json [POST /api/v1/queries]
{
  "identity": "example-item-gql",
  "displayName": "Пример GraphQL",
  "sourceVersion": 2,
  "source": "defineQuery({\n  kind: 'graphql',\n  props: defineProps({\n    id: field('String'),\n  }),\n  request: {\n    endpoint: 'https://api.example.test/graphql',\n    operationName: 'LoadItem',\n    document: gql`query LoadItem($id: ID!) { item(id: $id) { id title done } }`,\n    variables: variables(({ prop }) => ({ id: prop('id') })),\n    errorPolicy: 'throw',\n  },\n  outputs: {\n    item: output().from(data('item')).contract(field('ExampleItem')),\n  },\n})"
}
```

### Stream

```ts
defineStream({
  transport: sse({
    url: 'https://api.example.test/events',
    withCredentials: false,
    auth: 'inherit',
  }),
  events: {
    message: event({
      typeFrom: 'type',
      payloadFrom: 'payload',
    }),
  },
})
```

`POST /api/v1/streams`:

```json [POST /api/v1/streams]
{
  "identity": "example-events",
  "displayName": "Пример потока",
  "sourceVersion": 1,
  "source": "defineStream({\n  transport: sse({\n    url: 'https://api.example.test/events',\n    withCredentials: false,\n    auth: 'inherit',\n  }),\n  events: {\n    message: event({\n      typeFrom: 'type',\n      payloadFrom: 'payload',\n    }),\n  },\n})"
}
```

### Store

```ts
defineStore({
  data: {
    items: value([]).contract(field('ExampleItem').array()),
    selectedId: value(null),
  },
})
```

`POST /api/v1/stores`:

```json [POST /api/v1/stores]
{
  "identity": "example-store",
  "displayName": "Пример Store",
  "sourceVersion": 1,
  "source": "defineStore({\n  data: {\n    items: value([]).contract(field('ExampleItem').array()),\n    selectedId: value(null),\n  },\n})"
}
```

### Update

Владелец задаётся полем `storeIdentity` тела, а не внутри Source. Писать можно только в `value(...)`-поля этого Store.

```ts
defineUpdate({
  handles: ['item.toggled'],
  mutations: [
    {
      strategy: 'merge',
      target: 'items[id=$id]',
      ifExists: 'items[id=$id]',
      valueFrom: 'patch',
      vars: { id: 'id' },
    },
  ],
})
```

`POST /api/v1/updates`:

```json [POST /api/v1/updates]
{
  "identity": "example-store-toggle",
  "displayName": "Пример Update",
  "storeIdentity": "example-store",
  "sourceVersion": 1,
  "source": "defineUpdate({\n  handles: ['item.toggled'],\n  mutations: [\n    {\n      strategy: 'merge',\n      target: 'items[id=$id]',\n      ifExists: 'items[id=$id]',\n      valueFrom: 'patch',\n      vars: { id: 'id' },\n    },\n  ],\n})"
}
```

### Filter

```ts
defineFilter({
  fields: {
    done: field('Boolean').optional(),
  },
  outputs: {
    request: output().json(({ value }) => compact({ done: value('done') })),
  },
})
```

`POST /api/v1/filters`:

```json [POST /api/v1/filters]
{
  "identity": "example-filter",
  "displayName": "Пример фильтра",
  "sourceVersion": 1,
  "source": "defineFilter({\n  fields: {\n    done: field('Boolean').optional(),\n  },\n  outputs: {\n    request: output().json(({ value }) => compact({ done: value('done') })),\n  },\n})"
}
```

### DataView

```ts
defineDataView({
  mode: 'projection',
  output: {
    open: path('').where(match({ done: false })).sortBy(get('title')),
  },
})
```

`POST /api/v1/data-views`:

```json [POST /api/v1/data-views]
{
  "identity": "example-open-items",
  "displayName": "Пример DataView",
  "sourceVersion": 1,
  "source": "defineDataView({\n  mode: 'projection',\n  output: {\n    open: path('').where(match({ done: false })).sortBy(get('title')),\n  },\n})"
}
```

### Computation

У Computation два обязательных поля версии: `sourceVersion` и `contractVersion` (оба `1`). Без `contractVersion` — `400 validation_error`.

```ts
defineComputation({
  outputs: {
    tone: when(eq(input('done'), true), 'success', 'info'),
  },
  result: output('tone'),
})
```

`POST /api/v1/computations`:

```json [POST /api/v1/computations]
{
  "identity": "example-tone",
  "displayName": "Пример вычисления",
  "sourceVersion": 1,
  "contractVersion": 1,
  "source": "defineComputation({\n  outputs: {\n    tone: when(eq(input('done'), true), 'success', 'info'),\n  },\n  result: output('tone'),\n})"
}
```

### Action

```ts
defineAction({
  contract: {
    input: field('Object'),
    output: field('Object'),
  },
  steps: {
    load: query({ identity: 'example-items', input: {} }),
  },
  output: {
    result: output('load'),
  },
})
```

`POST /api/v1/actions`:

```json [POST /api/v1/actions]
{
  "identity": "example-reload",
  "displayName": "Пример Action",
  "sourceVersion": 1,
  "source": "defineAction({\n  contract: {\n    input: field('Object'),\n    output: field('Object'),\n  },\n  steps: {\n    load: query({ identity: 'example-items', input: {} }),\n  },\n  output: {\n    result: output('load'),\n  },\n})"
}
```

### Component SFC

У компонента поле версии формата — `modelVersion` (`1`), а не `sourceVersion`: чужое поле отклоняется как неизвестное.

```vue
<script setup lang="ts">
defineProps<{ items: Array<{ id: string, title: string }> }>()
</script>

<template>
  <Flex col gap="2">
    <Text for="item in items" :key="item.id">{{ item.title }}</Text>
  </Flex>
</template>
```

`POST /api/v1/components`:

```json [POST /api/v1/components]
{
  "identity": "example-list",
  "displayName": "Пример списка",
  "modelVersion": 1,
  "source": "<script setup lang=\"ts\">\ndefineProps<{ items: Array<{ id: string, title: string }> }>()\n</script>\n\n<template>\n  <Flex col gap=\"2\">\n    <Text for=\"item in items\" :key=\"item.id\">{{ item.title }}</Text>\n  </Flex>\n</template>\n"
}
```

### Style

Source — EndgeCSS, а не произвольный CSS.

```css
* {
  --surface: #ffffff;
  --text: #111827;
}

@theme dark {
  --surface: #111827;
  --text: #f9fafb;
}
```

`POST /api/v1/styles`:

```json [POST /api/v1/styles]
{
  "identity": "example-theme",
  "displayName": "Пример темы",
  "sourceVersion": 1,
  "source": "* {\n  --surface: #ffffff;\n  --text: #111827;\n}\n\n@theme dark {\n  --surface: #111827;\n  --text: #f9fafb;\n}\n"
}
```

### I18n Bundle

Без Source: переводы лежат в `locales` как `{локаль: {ключ: строка}}`.

`POST /api/v1/i18n-bundles`:

```json [POST /api/v1/i18n-bundles]
{
  "identity": "example-texts",
  "displayName": "Пример переводов",
  "locales": {
    "ru": {
      "title": "Записи"
    },
    "en": {
      "title": "Items"
    }
  }
}
```

### Composition

`kind: 'workspace'` — страница верхнего уровня; `library` — переиспользуемая часть, которую вызывает другая Composition.

```ts
defineComposition({
  activateOn: startup(),
  data: {
    state: store('example-store'),
  },
  resources: {
    theme: style('example-theme'),
    texts: i18n('example-texts'),
  },
  runtimes: {
    request: query('example-items').storeTo(data('state'), { items: output('items') }),
    list: component('example-list').withProps({ items: fromData('state.items') }),
  },
  hooks: [onMount().run('request')],
})
```

`POST /api/v1/compositions`:

```json [POST /api/v1/compositions]
{
  "identity": "example-page",
  "displayName": "Пример страницы",
  "kind": "workspace",
  "sourceVersion": 1,
  "source": "defineComposition({\n  activateOn: startup(),\n  data: {\n    state: store('example-store'),\n  },\n  resources: {\n    theme: style('example-theme'),\n    texts: i18n('example-texts'),\n  },\n  runtimes: {\n    request: query('example-items').storeTo(data('state'), { items: output('items') }),\n    list: component('example-list').withProps({ items: fromData('state.items') }),\n  },\n  hooks: [onMount().run('request')],\n})"
}
```

### Mock

`source` здесь — содержимое fixture (JSON-строка), версии формата нет. Некорректный JSON даёт только warning `mock.source.json-invalid`.

`POST /api/v1/mocks`:

```json [POST /api/v1/mocks]
{
  "identity": "example-fixture",
  "displayName": "Пример fixture",
  "contentSource": "document",
  "contentType": "application/json",
  "source": "{\"items\": [{\"id\": \"item-1\", \"title\": \"Первая\", \"done\": false}]}"
}
```

### Simulation

Aliases (`request`) должны существовать в целевой Composition; пути массивов (`items`) берутся из контракта output Query.

```ts
defineSimulation({
  target: composition('example-page'),
  overrides: {
    runtimes: {
      request: {
        request: mockRequest({ seed: 'example', arrays: { items: 20 } }),
      },
    },
  },
})
```

`POST /api/v1/simulations`:

```json [POST /api/v1/simulations]
{
  "identity": "example-page-demo",
  "displayName": "Пример симуляции",
  "sourceVersion": 1,
  "source": "defineSimulation({\n  target: composition('example-page'),\n  overrides: {\n    runtimes: {\n      request: {\n        request: mockRequest({ seed: 'example', arrays: { items: 20 } }),\n      },\n    },\n  },\n})"
}
```

### Vocab

```ts
defineVocab({
  mock: mock('example-fixture').path('items'),
  outputs: {
    items: output().from(response()),
  },
})
```

`POST /api/v1/vocabs`:

```json [POST /api/v1/vocabs]
{
  "identity": "example-statuses",
  "displayName": "Пример справочника",
  "sourceVersion": 1,
  "source": "defineVocab({\n  mock: mock('example-fixture').path('items'),\n  outputs: {\n    items: output().from(response()),\n  },\n})"
}
```

### Converter

Документ только объявляет identity: реализация регистрируется кодом приложения (`Endge.implementations`). Без реализации ссылка `.convert('example-trim')` не исполнится.

`POST /api/v1/converters`:

```json [POST /api/v1/converters]
{
  "identity": "example-trim",
  "displayName": "Пример конвертера"
}
```

### AuthProfile

В `credentials` — ссылка на переменную workspace `{EXAMPLE_API_TOKEN}`, а не сам секрет. Секреты в ответах не возвращаются.

Создать профиль может только пользователь с ролью Admin workspace (JWT-сессия). Персональный токен агента получает `403 access_token_admin_forbidden`, и MCP не предлагает ему `auth-profiles` в инструментах изменения. Агенту без профиля: в Query и Stream `auth: { mode: 'inherit' }`; если нужен отдельный профиль — попросить пользователя создать его в Configurator с этим телом и затем сослаться на него `auth: { mode: 'profile', profile: 'example-api' }`.

`POST /api/v1/auth-profiles`:

```json [POST /api/v1/auth-profiles]
{
  "identity": "example-api",
  "displayName": "Пример профиля",
  "adapterId": "bearer",
  "config": {},
  "credentials": {
    "token": "{EXAMPLE_API_TOKEN}"
  }
}
```

### Navigation

Дерево меню приложения из узлов трёх типов:

| `type` | Назначение | `children` |
| --- | --- | --- |
| `section` | Раздел верхнего уровня (блок меню) | группы и ссылки |
| `group` | Раскрывающаяся группа: внутри неё показываются ссылки её поддерева | ссылки и группы |
| `link` | Пункт меню: `path` маршрута приложения или внешний адрес (`external: true`) | нет |

У каждого узла обязателен `title`; необязательны `id`, `icon`, `hidden`, `disabled`, `collapsedTitle`, `path`, `routeName`. Navigation не ссылается на Composition: пункт ведёт на маршрут (`path`, `routeName`), а какую Composition показывать по маршруту, решает приложение. Ни backend, ни компилятор дерево не проверяют, поэтому опечатку в `type` или `path` покажет только само меню.

`POST /api/v1/navigations`:

```json [POST /api/v1/navigations]
{
  "identity": "example-menu",
  "displayName": "Пример меню",
  "tree": [
    {
      "type": "group",
      "title": "Записи",
      "icon": "List",
      "children": [
        { "type": "link", "title": "Все записи", "path": "/items" },
        { "type": "link", "title": "Архив", "path": "/items/archive" }
      ]
    },
    {
      "type": "link",
      "title": "Справка",
      "path": "https://docs.example.test",
      "external": true
    }
  ]
}
```

## Что проверяет компиляция и что нет

Компиляция всего workspace находит синтаксические ошибки, несуществующие identity и kind, отсутствующие outputs, порты и события, запись Update в derived-поле, циклы Composition, ошибки Simulation и контрактов Type. Она **не** находит:

- обращение в template к полю, которого нет в типе prop (интерполяция `item.name` при `item: { title: string }`);
- некорректный JSON в Mock — только warning `mock.source.json-invalid`;
- реализацию Converter: документ лишь объявляет identity;
- значения переменных (`env(...)`, `{EXAMPLE_API_TOKEN}`) и доступность адресов.

Лишние и недостающие props при вызове компонента, `config('...')` без значения и условия по несуществующему документу фасета компилятор 1.0.0-dev.11 не считает ошибкой; их ловит инструмент оценки из репозитория документации (`scripts/grade-workspace.mjs`). Агент без локального Core проверяет результат в Configurator: вкладка «Проблемы» показывает те же диагностики.

## Связанные страницы

- [Вертикальный срез](/agents/vertical-slice): сложные связи, таблица «когда нужно / когда не нужно».
- [Авторинг Source](/agents/authoring): языки, порядок работы, разбор ошибок.
- [MCP-сервер](/agents/mcp): инструменты и поле версии формата.
- Справочник языка каждого типа: [Type](/reference/type), [Query](/reference/query), [Store](/reference/store), [Update](/reference/update), [DataView](/reference/data-view), [Computation](/reference/computation), [Action](/reference/action), [Component SFC](/reference/component-sfc), [Composition](/reference/composition), [Simulation](/reference/simulation), [Mock](/reference/mock).
