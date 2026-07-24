# Metadata

Metadata — статическая JSON-совместимая конфигурация доменного документа или
внутреннего узла его source. Она описывает возможности, требования и настройки,
которые принадлежат не данным runtime, а собранному artifact.

Metadata не является:

- входными бизнес-данными;
- состоянием Store;
- способом передать секрет;
- заменой props;
- identity реализации, которую должен разрешать port binding.

## Два уровня metadata

В Endge необходимо различать persisted `meta` и публичную compiled metadata.

| Уровень | Где хранится | Назначение |
| --- | --- | --- |
| Persisted `meta` | В Payload-документе любой `REntity` | Служебная и интеграционная metadata самого документа |
| Compiled metadata | В canonical source и затем в `ProgramArtifact.metadata` | Публичный versioned-контракт для compiler, Composition и renderer adapter |

Persisted `meta` доступна всем доменным сущностям, но сама по себе не становится
частью исполняемого контракта. Если metadata должна участвовать в Program,
предпочтителен source-first вариант конкретной сущности.

## Формы объявления в source

| Сущность | Форма |
| --- | --- |
| Query | `metadata: { ... }` внутри `defineQuery` |
| DataView | `metadata: { ... }` внутри `defineDataView` |
| Filter | `metadata: { ... }` внутри `defineFilter` |
| Composition | `metadata: { ... }` внутри `defineComposition` |
| Component SFC | `defineMetadata({ ... })` |
| Узел Component SFC | статический `:metadata="{ ... }"` |
| Computation | persisted `meta`; `defineComputation` v1 принимает только `outputs` и `result` |

Формы source принимают только статические JSON-совместимые значения: строки,
числа, boolean, `null`, массивы и объекты. Props, вызовы функций, spread,
computed keys и runtime-значения запрещены.

```ts
defineMetadata({
  'groundhandling.query': {
    version: 1,
    arrival: {
      attributes: ['STA', 'ETA', 'ATA'],
    },
  },
})
```

## Namespace и версия

Верхний ключ metadata — namespace consumer-а или интеграции:

```ts
{
  'groundhandling.process': {
    version: 1,
    criticality: 'critical',
  },
  'analytics.export': {
    version: 2,
    fields: ['id', 'status'],
  },
}
```

Правила контракта:

1. Namespace должен принадлежать consumer-у, который понимает его структуру.
2. Внутри публичного namespace указывается целочисленный `version`.
3. Неизвестный namespace игнорируется.
4. Неизвестная версия не должна молча интерпретироваться как текущая.
5. Defaults применяет consumer; compiler только сохраняет статическое значение.
6. Несовместимое изменение структуры требует новой версии.

## Представление в Program

Compiler нормализует metadata в общий контракт:

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

`self` содержит metadata документа. `nodes` содержит metadata внутренних
source-узлов, например отдельных `Column`.

Metadata узла сохраняется в artifact, но не становится runtime prop
автоматически. Renderer или другой consumer должен явно выбрать runtime-
поверхность. Для `Table` карта metadata текущей колонки доступна внутри ячейки
как `columnMeta`; дочерний компонент всё равно получает выбранный namespace
явным prop:

```vue
<GroundHandlingProcess
  :process="value"
  :settings="columnMeta['groundhandling.process']"
/>
```

## Чтение metadata

Composition может получить compiled metadata документа:

```ts
metadata('component-sfc', 'groundhandling-tgo-table')
```

Для runtime alias доступны:

```ts
metadataOf('table')
metadataOf('table', 'groundhandling.query')
```

Одноаргументный `metadataOf` возвращает всю карту namespaces без автоматического
извлечения единственного ключа.

## Metadata и порты

Metadata содержит параметры вызова, но не выбирает реализацию required port.

Правильно:

```ts
{
  'groundhandling.process': {
    version: 1,
    criticality: 'critical',
    displayMode: 'active',
  },
}
```

Неправильно:

```ts
{
  computation: 'customer-groundhandling-process-state',
}
```

Default provider объявляется в `definePorts`. Runtime override той же identity
регистрируется через `Endge.bind.computation(...)`; будущий выбор другой
persisted Computation для конкретного экземпляра должен принадлежать
Composition port-binding contract. В обоих случаях metadata не превращается в
service locator.

## Что не следует хранить

- JWT, API keys и другие credentials;
- текущее время и изменяемое runtime-состояние;
- значения строк таблицы;
- CSS selectors, DOM classes и hex-цвета для renderer-neutral контрактов;
- callbacks или исполняемый source;
- вычисленные статусы, которые можно получить из входных данных.

Для условного представления таблиц используйте semantic metadata и Computation:
[условное представление таблиц](/guides/table-presentation-computations).
