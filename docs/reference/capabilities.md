---
description: "Матрица возможностей документов: что сохраняется, компилируется и исполняется, какие контракты ограничены и где проходят границы языков."
---

# Матрица возможностей

Эта матрица различает сохранение документа, его авторский язык, compilation и исполнение. Совпадение названий классов и UI editor не создаёт отсутствующую capability. Точные DTO смотрите в [HTTP API](/llms-full/api.txt), сигнатуры — в [контрактах Core](/reference/contracts/core/).

## Документы с compiler contract

| Документ | Backend collection | Авторская форма | Program | Исполнение или consumer |
| --- | --- | --- | --- | --- |
| Primitive / Type | `types` | Type Source | `type` | Type registry, compiler/linker |
| Configuration | `configurations` | Configuration Source | `configuration` | Configuration cascade при сборке |
| Computation | `computations` | Computation Source | `computation` | Computation executor/resource |
| Action | `actions` | Action Source | `action` | Action runtime и Operation executor |
| Component SFC | `components` | Endge SFC | `component-sfc` | Component host и UI adapter |
| Style | `styles` | EndgeCSS | `style` | Style materializer и leases |
| DataView | `data-views` | DataView Source | `data-view` | Материализация derived data |
| Vocab | `vocabs` | Vocab Source | `vocab` | Vocab module |
| Update | `updates` | Update Source | `update` | Атомарное изменение Store |
| Store | `stores` | Store Source | `store` | Store runtime |
| Stream | `streams` | Stream Source | `stream` | Stream runtime |
| Filter | `filters` | Filter Source | `filter` | Filter runtime и FilterView |
| Query REST / GraphQL / Custom | `queries` | Query Source | `query` | Query runtime; custom требует implementation |
| Composition | `compositions` | Composition Source | `composition` | Runtime tree и bindings |
| Simulation | `simulations` | Simulation Source | `simulation` | Отдельный root, target Composition и Query overrides |

Query GraphQL выполняет `query` и `mutation`. GraphQL `subscription` задаётся Stream с `graphqlSse`. Проверка документа по внешней GraphQL schema — отдельный вызов validation API; синтаксическая проверка Source не заменяет её.

## Документы без собственного ProgramArtifact

| Документ | Backend | Consumer |
| --- | --- | --- |
| Mock | `mocks` | Mock module; JSON/text fixture или code provider |
| Converter | `converters` | Зарегистрированная implementation |
| I18n Bundle | `i18n-bundles` | Каталоги переводов |
| AuthProfile | `auth-profiles` | Auth adapters и runtime-запросы |
| Navigation | `navigations` | Host navigation consumer |
| Facet | `facets` | Структурные оси контекста и порядок cascade |
| Facet Document | `facet-documents` | Configuration contribution выбранного значения |
| Workspace | Отдельный workspace endpoint | Граница документов, настроек и доступа |

Facet и Facet Document имеют отдельный typed provider contract. Identity Facet Document уникальна внутри родительского Facet. Их нельзя отправлять произвольным generic document endpoint.

## Контракты с ограниченной поддержкой

`integration`, `policy`, `page-template`, `page`, `component-dsl` и `component-table` представлены в Core, но отсутствуют в текущей канонической таблице backend collections. Не обещайте их сохранение через Service Backend по аналогии с Component SFC. Legacy Component Table/DSL не является исполняемым SFC. `Version` не следует создавать как обычный domain document: история, revisions, commits и releases имеют собственные API. Отдельного универсального persisted `Parameter` collection нет: параметры объявляются в props, Filter fields или Configuration в зависимости от назначения.

`Endge.updates` сохраняет legacy entrypoint внешних обновлений, но текущая реализация не применяет сообщения и возвращает ноль изменений. Для работающего data flow используйте Store, Stream, Update и Composition.

## Границы языков и окружений

- Общие Source expressions не исполняют произвольный JavaScript. У Filter, event input и SFC свои подмножества.
- UI adapter определяет renderer capabilities. Для таблиц действует [публичная матрица vue-native](/sfc-tables/adapters-and-limitations); backend paging `lazy` и grouping не возникают от наличия сторонней grid-библиотеки.
- Bundle provider предназначен для исполнения готового снимка и не является редакторским API записи.
- Наличие права редактирования документа не добавляет runtime permission в `$context`: бизнес-флаги передаются явно через props или Configuration.
- Preview, production host и Simulation имеют разные lifecycle owners. Успешная compilation не подтверждает сетевую доступность, credentials или готовность UI adapter.

[Domain descriptor в source](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/documents/domain-document-descriptors.ts) — владелец capability profile. [Маршрут агента](/agents/authoring) объясняет последовательность работы.
