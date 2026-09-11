# Metadata

Metadata — пользовательский статический JSON-объект, который дополняет документ
или внутренний узел Source. Он описывает назначение, возможности и настройки для
consumer-а, но не становится изменяемым runtime-состоянием.

Metadata не заменяет props, бизнес-данные, Store state или identity реализации
required port. Не храните в ней JWT, API keys, пароли, cookies и другие
credentials: metadata входит в документ и может быть доступна редакторам,
экспорту и compiled Program.

## Редактирование в Configurator

У поддерживаемого документа откройте вкладку «Основное», затем выберите в
боковом меню «Метаданные». Редактор принимает один JSON-объект верхнего уровня.
Пункт «Основное» использует иконку `Settings2`, «Метаданные» — `FileJson2`.
Выбранный пункт и ширина меню относятся к персональному UI state и сами по себе
не делают документ изменённым.

Draft metadata участвует в общем признаке несохранённых изменений. При Save
Configurator проверяет JSON и через Core записывает его в каноническое место
конкретного типа документа. Невалидный draft остаётся в редакторе и блокирует
Save. Правки во вкладке Source обновляют представление metadata, если в
metadata-редакторе нет незавершённого draft. Для system- и
integration-managed документов metadata доступна только для чтения.

Обычный Component SFC получает два пункта: «Основное» и «Метаданные». В
визуальном редакторе SFC Table пункт «Метаданные» остаётся частью расширенного
меню таблицы и использует тот же JSON editor; верхняя иконка Table не меняется.

## Три способа хранения

Core выбирает backing по `DomainDocumentDescriptor.capabilities.metadata`.
Пользователю не нужно вручную синхронизировать несколько копий.

| Backing | Где хранится | Типы документов |
| --- | --- | --- |
| `definition-property` | Корневое поле `metadata` основного DSL-вызова | Action, Computation, Store, Stream, Simulation, Update, все Query, DataView, Default Filter, Composition, Vocab |
| `definition-declaration` | Отдельный `defineMetadata({...})` | Component SFC, Type, Configuration |
| `entity-meta` | Только `REntity.meta.user` | Facet, Facet Document, Style, Mock, Converter, Auth Profile, I18n Bundles, Navigation, Workspace |

Source-first metadata хранится только в Source и не копируется в `meta.user`.
Entity-backed metadata меняет только `meta.user`; любые соседние системные
ключи сохраняются.

### Поле основного definition

```ts
defineQuery({
  metadata: {
    'company.feature': {
      version: 1,
      owner: 'operations',
    },
  },

  kind: 'rest',
  request: { path: '/orders' },
  outputs: {},
})
```

Configurator патчит только значение `metadata`, сохраняя остальной авторский
Source. Если поля нет, при чтении показывается `{}`, но простое открытие
документа ничего не вставляет.

### Отдельный `defineMetadata`

В Component SFC декларация находится в `<script setup>`. В Type и Configuration
разрешён ровно один `defineMetadata({...})` рядом с главным вызовом, в любом
порядке. При первой визуальной записи Core вставляет декларацию перед
`defineType` или `defineConfig`:

```ts
defineMetadata({
  'company.feature': {
    owner: 'operations',
  },
})

defineType({
  identity: field(String),
})
```

### `REntity.meta.user`

Для документов без подходящего Source-синтаксиса пользовательская карта
хранится в `meta.user`:

```json
{
  "meta": {
    "configurator": { "panel": "source" },
    "endge": { "navigation": true },
    "user": {
      "company.feature": { "owner": "operations" }
    }
  }
}
```

Пользователь владеет только `meta.user`. `meta.configurator`, `meta.endge` и
любой другой верхнеуровневый `meta.*` зарезервированы их платформенными
owners, не показываются в JSON editor и не удаляются при сохранении. Старые
корневые ключи не мигрируют автоматически: их происхождение невозможно надёжно
определить.

## Допустимый JSON

Корнем должен быть object. Допустимы строки, конечные числа, boolean, `null`,
массивы и вложенные объекты. В Source это означает только статические
JSON-compatible literals. Spread, computed keys, function calls, identifiers,
runtime-выражения и повторяющиеся ключи запрещены. Дубликат декларации или
динамическая форма создаёт diagnostic и блокирует визуальную перезапись, чтобы
не потерять авторский Source.

```ts
{
  'orders.presentation': {
    version: 1,
    compact: true,
    fields: ['id', 'status'],
  },
}
```

Namespace принадлежит consumer-у, который понимает его структуру. Публичный
namespace должен содержать целочисленный `version`; неизвестные namespace и
версии consumer игнорирует. Defaults применяет consumer, а несовместимое
изменение требует новой версии.

## Поддержка документов

| Группа | Типы |
| --- | --- |
| Поддержаны через Source | `action`, `computation`, `store`, `stream`, `simulation`, `update`, `query-rest`, `query-gql`, `query-custom`, `data-view`, `default-filter`, `composition`, `vocabs`, `component-sfc`, `type`, `configuration` |
| Поддержаны через `meta.user` | `facet`, `facet-document`, `style`, `mock`, `converter`, `auth-profile`, `i18n-bundles`, `navigation`, `workspace` |
| Не входят в функцию | `component-dsl`, `component-table`, `integration`, `page-template`, `page`, `policy`, built-in `primitive` |

Наличие Domain class само по себе не расширяет backend persistence. Исключённые
типы остаются вне функции, пока их persistence и authoring contracts не будут
спроектированы отдельно.

## Metadata поля и внутренних узлов

Metadata самого документа не следует смешивать с metadata его внутренних
узлов. Например, `.meta(...)` прикрепляет статические подсказки к полю Filter:

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

А статический `:metadata="{ ... }"` у `Column` относится только к этой колонке.
Такие значения компилируются как node metadata и не появляются в редакторе
metadata документа.

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

- `REntity.meta.user` — persisted user authoring для entity-backed документа;
- остальные `REntity.meta.*` — persisted системные данные их owners;
- `ProgramArtifact.metadata.self` — compiler-derived metadata всего документа;
- `ProgramArtifact.metadata.nodes` — compiler-derived metadata внутренних
  Source-узлов, например колонок.

`ProgramArtifact` не является отдельным persisted source of truth. Для
Source-first документов `self` строится из Source; для Style — из
`meta.user`. У документов без ProgramArtifact `meta.user` остаётся только
persisted metadata документа.

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
Default provider объявляется в `definePorts`, а runtime override регистрируется
через binding API; metadata не превращается в service locator.

## Что не следует хранить

- JWT, API keys, credentials и другие secrets;
- текущее время и изменяемое runtime-состояние;
- значения строк таблицы;
- CSS selectors, DOM classes и hex-цвета;
- callbacks или исполняемый source;
- вычисленные статусы, которые можно получить из входных данных.

Для условного представления таблиц используйте semantic metadata и Computation:
[условное представление таблиц](/guides/table-presentation-computations).
