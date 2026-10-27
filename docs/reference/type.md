# Type Source

Type Source — компактное source-first описание доменного типа. Оно хранится как авторский текст, проверяется безопасным parser и в дальнейшем может стать входом для генерации JSON Schema и визуального представления.

В Type editor доступны три вкладки:

- **Основное** — общие свойства документа;
- **Visual** — древовидное представление той же source schema с inline editing;
- **Source** — Type Source в Monaco editor.

Visual editor reads the compiled semantic document and writes changes back as deterministic Type Source. JSON Schema generation пока не является persisted source of truth и может быть добавлена как derived representation позднее.

Metadata документа объявляется отдельным `defineMetadata({...})` перед или после
`defineType`. Разрешена ровно одна статическая JSON-compatible декларация; она
компилируется в `ProgramArtifact.metadata.self`. Общий UI и ограничения описаны
в разделе [Metadata](/reference/metadata).

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

## Дата и время

Встроенный Type Registry содержит три отдельных строковых типа:

| Тип | Значение | Пример |
| --- | --- | --- |
| `Date` | Календарная дата без времени и часового пояса | `'2026-09-09'` |
| `Time` | Время суток без календарной даты | `'14:30:00'` |
| `DateTime` | Дата и время | `'2026-09-09T14:30:00+03:00'` |

```ts
defineType({
  departureDate: field(Date),
  departureTime: field(Time),
  updatedAt: field(DateTime),
})
```

`Date` использует формат `YYYY-MM-DD` и не превращается в JavaScript `Date`: сохранение и чтение не добавляют время и не сдвигают дату по часовому поясу. Эти типы доступны без создания документов Type. Текущая проверка значений Configuration проверяет строковое представление, а не календарную корректность или формат; автоматически выводимый default — пустая строка.

OpenAPI import отображает `string` с `format: date` в `Date`, `date-time` — в `DateTime`, `time` — в `Time`. GraphQL scalars `Date` и `LocalDate` отображаются в `Date`.

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

## contextSwitch и extends

### Наследование: `extends`

`defineType({ extends, fields })` берёт поля базового Type и добавляет свои:

```ts
defineType({
  extends: type('Flight'),
  fields: {
    stand: field(String),
    handlingAgent: field(String),
  },
})
```

- Форма распознаётся, если у корневого объекта есть `extends` и его значение не `field(...)`: поле с именем `extends: field(String)` остаётся обычным полем.
- Допустимы только свойства `extends` и `fields`. `extends` — `type('X')`, identity или `contextSwitch` таких ссылок. У `objectOf({...})` наследования нет.
- Сначала идут поля базовой цепочки, затем собственные. Поле с тем же именем заменяет унаследованное на его месте, если совместимо: тот же структурный тип и `array`; optional можно сделать required; description, examples, min и max меняются свободно.
- Artifact Type хранит развёрнутое определение, поэтому каталог типов, Simulation и Component SFC видят унаследованные поля. Source сохраняет авторскую форму: `extends` и только собственные поля.

| Код | Когда |
| --- | --- |
| `type-source-extends-property` | свойство кроме `extends`/`fields` или повтор |
| `type-source-extends-fields-shape` | `fields` не object literal |
| `type-source-extends-shape` | `extends` не ссылка на Type и не `contextSwitch` ссылок |
| `type-extends-cycle` | цикл наследования, в том числе на себя |
| `type-extends-not-object` | база — не object Type |
| `type-extends-field-incompatible` | несовместимое переопределение поля или required → optional |

### Ссылка по контексту

`contextSwitch` выбирает Type по фасетам сборки в любой позиции type expression (`field`, `arrayOf`, `unionOf`, `recordOf`, `extends`) и в контрактах Source (`defineProps`, `output().contract`, `.contract` Store, поля Filter, props Composition):

```ts
flight: output().from(response('flight')).contract(field(contextSwitch({
  default: type('Flight'),
  cases: [{ when: { tenant: 'kzn' }, use: type('FlightKzn') }],
}))),
```

Ветка — `'Identity'`, `Identity` или `type('X')`; там, где разрешены inline-типы, — `objectOf`/`recordOf`. Все ветки проверяются (`type-reference-missing`) и становятся зависимостями программы, в artifact попадает выбранная.

Визуальный редактор Type в Configurator сохраняет `extends`. Type с `contextSwitch` визуальный редактор не открывает (`type-visual-context-switch`): такой Type редактируется в режиме Source, иначе невыбранные варианты потерялись бы.

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

OpenAPI and GraphQL importers generate canonical Type Source directly. Правила GraphQL описаны в разделе [Импорт из GraphQL](#импорт-из-graphql).

System `Ref*` types remain registry entries with `entityReference.target` and `entityReference.storage`. Они не разворачиваются в object schema: their purpose is to connect a typed value with a concrete domain entity selector.

## Импорт из GraphQL

Диалог импорта Type принимает GraphQL SDL (`.graphql`, `.gql`, `.graphqls`) и
JSON результата introspection (`.json`) в формах `{ data: { __schema } }` и
`{ __schema }`. Introspection превращается в схему и импортируется тем же путём,
что SDL. В редакторе Query и Stream схему можно загрузить с endpoint и сразу
импортировать типы: [Запуск Query и схема GraphQL](/configurator/query-run-and-graphql-schema).

| GraphQL | Type Source |
| --- | --- |
| `type X { ... }` | `defineType({ ... })`; при `implements` — metadata `graphql: { kind: 'object', interfaces: [...] }` |
| `interface X { ... }` | Object type с полями interface; metadata `graphql: { kind: 'interface', implementations: [...] }` |
| `input X { ... }` | Object type; metadata `graphql: { kind: 'input' }`, default values — в `graphql.defaults`, поле с default необязательное |
| `union X = A \| B` | `defineType(unionOf(A, B))`; metadata `graphql: { kind: 'union' }` |
| `enum X` | `defineType(enumOf([...]))` без metadata |
| `scalar X` | Нормализуется в primitive; `Date` и `LocalDate` — в `Date` |
| `T` / `T!` | `.optional()` / обязательное поле |
| `[T]` | `.array()` |
| `[[T]]` | `field(arrayOf(T)).array()` |

Metadata записывается отдельной декларацией `defineMetadata({...})` перед
`defineType`:

```ts
defineMetadata({
  "graphql": {
    "kind": "input",
    "defaults": { "limit": 10 }
  }
})

defineType({
  status: field(String),
  limit: field(Number).optional(),
})
```

В пропущенные элементы с причиной попадают union из одного типа (`unionOf`
требует двух вариантов), корни operations (`Query`, `Mutation`, `Subscription`,
`schema { ... }`) и `extend type`. Аргументы полей Type Source не выражает: поле
импортируется, а кандидат получает info-диагностику
`document-import-graphql-field-arguments`. Nullability элементов вложенных
списков не сохраняется. Ошибки introspection JSON возвращаются диагностиками
`document-import-graphql-introspection-json` и
`document-import-graphql-introspection-invalid`.

## Persisted representation

Payload Type document хранит source-first контракт:

| Поле | Содержимое |
| --- | --- |
| `source` | Авторский Type Source |
| `sourceVersion` | Версия Type Source syntax, сейчас `1` |

Структурные поля типа существуют только внутри `source`. Visual editor, compiler, diagnostics and Type Registry работают с одним каноническим представлением.
