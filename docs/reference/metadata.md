# Metadata

Metadata — статическая JSON-совместимая конфигурация доменного документа или
внутреннего узла source. Она описывает возможности и настройки собранного
artifact, а не изменяемые данные runtime.

Metadata не является:

- входными бизнес-данными;
- состоянием Store;
- способом передать secret;
- заменой props;
- identity реализации required port.

## Два уровня

| Уровень | Где хранится | Назначение |
| --- | --- | --- |
| Persisted `meta` | В Payload-документе `REntity` | Служебная metadata документа |
| Compiled metadata | В canonical source и `ProgramArtifact.metadata` | Публичный versioned-контракт consumer-а |

Если metadata участвует в Program, используйте source-first форму конкретной
сущности.

## Формы объявления

| Сущность | Форма |
| --- | --- |
| Query / DataView / Filter / Composition | `metadata: { ... }` в definition |
| Поле Filter / Query props | `.meta({ ... })` в chain `field(...)` |
| Component SFC | `defineMetadata({ ... })` |
| Узел Component SFC | статический `:metadata="{ ... }"` |
| Computation | persisted `meta`; definition v1 принимает `outputs` и `result` |

Source принимает только JSON-compatible literals. Props, function calls,
spread, computed keys и runtime-значения запрещены.

```ts
defineMetadata({
  'orders.query': {
    version: 1,
    fields: ['id', 'number', 'status'],
  },
})
```

## Metadata поля

`.meta(...)` прикрепляет статические подсказки к конкретному `field`. Они
компилируются вместе с field contract, не попадают в Filter state и не меняют
значение output.

```ts
aircrafts: field('String')
  .array()
  .vocab('aircrafts', {
    valuePath: 'type',
    labelPath: 'description',
  })
  .meta({
    'endge.ui.select': {
      searchable: true,
    },
  })
  .default([])
```

Встроенные adapters понимают namespace `endge.ui.select`:

| Поле | Поведение |
| --- | --- |
| `searchable: true` | Всегда показывать поиск, включая короткий список. |
| `searchable: false` | Не показывать поиск. Виртуализация большого списка сохраняется. |
| `searchable` не задан | Автоматически включить поиск, если вариантов больше 10. |

Если вариантов больше 10, `vue-native`, `vue-shadcn` и `ramax-aodb`
виртуализируют список автоматически. Виртуализация — внутренняя оптимизация
adapter-а и не требует отдельной metadata. Неизвестные namespace и ключи
игнорируются.

## Namespace и версия

```ts
{
  'orders.presentation': {
    version: 1,
    compact: true,
  },
  'analytics.export': {
    version: 2,
    fields: ['id', 'status'],
  },
}
```

1. Namespace принадлежит consumer-у, который понимает его структуру.
2. Публичный namespace содержит целочисленный `version`.
3. Неизвестный namespace игнорируется.
4. Неизвестная версия не интерпретируется как текущая.
5. Defaults применяет consumer; compiler сохраняет статическое значение.
6. Несовместимое изменение требует новой версии.

## Представление в Program

```ts
interface ProgramMetadata {
  self: Record<string, JSONValue>
  nodes: Array<{
    nodeId: string
    nodeKind: string
    key?: string
    values: Record<string, JSONValue>
  }>
}
```

`self` содержит metadata документа. `nodes` содержит metadata внутренних узлов,
например `Column`.

Для Table metadata текущей колонки доступна внутри ячейки как `columnMeta`:

```vue
<StatusValue
  :value="value"
  :settings="columnMeta['orders.presentation']"
/>
```

Она не становится prop вложенного компонента автоматически.

## Чтение из Composition

```ts
metadata('component-sfc', 'orders-table')

metadataOf('table')
metadataOf('table', 'orders.query')
```

Одноаргументный `metadataOf` возвращает всю карту namespaces без
автоматического извлечения единственного ключа.

## Metadata и порты

Metadata содержит параметры вызова, но не выбирает реализацию required port.

Правильно:

```ts
{
  'orders.presentation': {
    version: 1,
    compact: true,
  },
}
```

Неправильно:

```ts
{
  computation: 'customer-order-presentation',
}
```

Default provider объявляется в `definePorts`. Runtime override регистрируется
через binding API; metadata не превращается в service locator.

## Что не следует хранить

- JWT, API keys и credentials;
- текущее время и изменяемое runtime-состояние;
- значения строк таблицы;
- CSS selectors, DOM classes и hex-цвета;
- callbacks или исполняемый source;
- вычисленные статусы, которые можно получить из входных данных.

Для условного представления таблиц используйте semantic metadata и Computation:
[условное представление таблиц](/guides/table-presentation-computations).
