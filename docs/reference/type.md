# Type Source

Type Source — компактное source-first описание доменного типа. Оно хранится как авторский текст, проверяется безопасным parser и в дальнейшем может стать входом для генерации JSON Schema и визуального представления.

В Type editor доступны четыре вкладки:

- **Основное** — общие свойства документа;
- **Legacy Form** — прежний редактор полей;
- **Visual** — древовидное представление той же source schema с inline editing;
- **Source** — Type Source в Monaco editor.

::: warning Переходный режим
`source` и legacy `schema` пока сохраняются одновременно, но независимо. Изменение Source не обновляет Legacy Form, а изменение Legacy Form не переписывает Source. Legacy data остаётся доступной только во вкладке Legacy Form; compiler, diagnostics и новые type selectors используют Type Source registry.
:::

Visual editor reads the compiled semantic document and writes changes back as deterministic Type Source. JSON Schema generation пока не является persisted source of truth и может быть добавлена как derived representation позднее.

## Object type

Для object type поля передаются прямо в `defineType`. Дополнительная вложенность `fields: { ... }` не нужна:

```ts
defineType({
  identity: field(String)
    .description('Passenger profile identifier'),

  displayName: field(String),

  forecastFactorTotal: field(Number)
    .min(0)
    .max(1)
    .example(0.7),

  flightFilters: field(FlightFilter)
    .array()
    .optional(),

  arrivalDistribution: field(ArrivalDistribution)
    .array(),
})
```

Identifier в `field(TypeName)` — symbolic reference на identity примитивного или пользовательского Type. Импорты для пользовательских типов не требуются: compiler разрешает identifier через текущий Type Registry.

## Inline object type

Одноразовую вложенную структуру можно описать прямо в поле через `objectOf({...})`. Она не получает identity и не создаёт отдельный Type document:

```ts
defineType({
  id: field(ID),

  customer: field(Customer),

  delivery: field(objectOf({
    method: field(String),

    address: field(objectOf({
      city: field(String),
      street: field(String),
      coordinates: field(objectOf({
        latitude: field(Number)
          .min(-90)
          .max(90),

        longitude: field(Number)
          .min(-180)
          .max(180),
      })).optional(),
    })),
  })),
})
```

Use `objectOf` when the shape belongs only to its parent field. Use `field(Address)` when the type needs reuse, a stable identity, separate documentation, permissions, or recursive references.

`objectOf`, `recordOf`, `enumOf`, `unionOf` and `arrayOf` are recursive type expressions. Поэтому их можно вкладывать друг в друга:

```ts
defineType({
  points: field(arrayOf(objectOf({
    x: field(Number),
    y: field(Number),
  }))),
})
```

## Field API

| API | Назначение |
| --- | --- |
| `field(typeIdentity)` | Обязательное поле со ссылкой на primitive или named Type |
| `field(typeExpression)` | Поле с inline `objectOf`, `recordOf`, `enumOf`, `unionOf` или `arrayOf` |
| `.description(text)` | Описание поля |
| `.optional()` | Поле не является обязательным |
| `.array()` | Значение является массивом указанного типа |
| `.min(number)` | Минимальное значение для `field(Number)` |
| `.max(number)` | Максимальное значение для `field(Number)` |
| `.example(value)` | Статический JSON-compatible пример |

`.example(...)` можно повторить, чтобы сохранить несколько примеров. Допускаются строки, числа, boolean, `null`, arrays и object literals. Function calls, identifiers и вычисляемые значения не выполняются.

```ts
defineType({
  code: field(String)
    .example('SU')
    .example('FV'),

  threshold: field(Number)
    .min(-1)
    .max(1),
})
```

## Enum type

```ts
defineType(enumOf([
  'draft',
  'active',
  'archived',
]))
```

`enumOf` принимает непустой array уникальных literals. Все значения должны иметь один primitive type: `String`, `Number` или `Boolean`.

## Union type

```ts
defineType(unionOf(
  ArrivalFlight,
  DepartureFlight,
))
```

`unionOf` requires at least two unique type expressions. Named identifiers создают ссылки на доменные Types, а `objectOf(...)` добавляет anonymous variant inline.

## Array type

```ts
defineType(arrayOf(
  Flight,
))
```

Root `arrayOf` описывает тип, который сам является массивом. Для массива внутри object field используется modifier `.array()`.

`arrayOf(...)` также принимает любой type expression, например `arrayOf(objectOf({...}))`. Modifier `.array()` остаётся короткой формой для массива значения конкретного field.

`recordOf(...)` описывает inline-словарь с произвольными string-ключами и единым типом значений:

```ts
defineType({
  properties: field(recordOf(objectOf({
    name: field(String),
    text: field(String),
  }))),
})
```

В текущей версии `recordOf` является только вложенным type expression и не используется как корень `defineType(...)`.

## Ограничения синтаксиса

Type Source похож на TypeScript, но не является произвольной программой. Документ содержит ровно один `defineType(...)` и использует только поддержанные static declarations.

Не поддерживаются:

- imports, variables и дополнительные top-level statements;
- function calls вне whitelist Type DSL;
- spread и computed property names;
- executable expressions внутри `.example(...)`;
- неизвестные field modifiers.

Monaco показывает parser и Type Registry diagnostics непосредственно в Source. Completion list includes primitive types, entity references and user types generated from current Type Source artifacts. Разрешённые type identifiers подсвечиваются зелёным, а отсутствующие в Type Registry — красным и получают error diagnostic.

Для ссылки `field(CustomType)`, `arrayOf(CustomType)` или variant внутри `unionOf(...)` используйте `Cmd/Ctrl + click` либо `Cmd/Ctrl + B`, чтобы открыть связанный Type document. Primitive types do not open as documents.

## Compilation diagnostics

Compiler creates one Type Program artifact for each Type document before compiling Actions, Computations, SFC components, Queries and Filters. Эти сущности проверяют свои type contracts против единого registry и публикуют зависимости на используемые Type artifacts.

- Missing type identity is an error diagnostic on the owning entity, but it does not stop the whole compiler pipeline.
- Contract mismatch is a warning during the migration stage.
- `Any` is valid and produces `type-any-usage` warning on the entity that uses it.
- An artifact with warnings remains available to editor tooling and runtime orchestration.

OpenAPI and GraphQL importers now generate Type Source and keep legacy fields at the same time. This allows old records to remain editable in Legacy Form while every new consumer reads the source-backed model.

System `Ref*` types remain registry entries with `entityReference.target` and `entityReference.storage`. Они не разворачиваются в object schema: their purpose is to connect a typed value with a concrete domain entity selector.

## Persisted representation

На переходном этапе Payload Type document хранит оба поля:

| Поле | Содержимое |
| --- | --- |
| `schema` | Старое JSON-представление, которое редактирует Legacy Form |
| `source` | Авторский Type Source |
| `sourceVersion` | Версия Type Source syntax, сейчас `1` |

Core сохраняет `source` отдельно и не вкладывает его внутрь legacy `schema`. Automatic synchronization remains intentionally absent: Stage 2 can remove old fields only after production data and integrations are verified against compiled Type Source.
