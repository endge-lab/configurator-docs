# Встраивание Core и карта API

`@endge/core` предоставляет фасад `Endge`, Domain contracts, compiler и runtime. Приложение подключает provider, implementations и renderer; Source-документы описывают поведение внутри этой среды. Все публичные entrypoints и exports перечислены в [контрактном snapshot](/reference/contracts/core/).

## Bootstrap

```ts
import { Endge } from '@endge/core'

await Endge.boot({
  dataProvider: 'default',
  scope: { workspaceIdentity: 'example-workspace' },
  vars: {
    ENDPOINT_API: 'https://api.example.test',
  },
})
```

Пример предполагает, что приложение уже предоставило требуемые backend/provider adapters. `boot` сам по себе не создаёт сервер, credentials или UI renderer. `vars` — явный map; реальные секреты не следует помещать в открытые примеры или публичный bundle.

| Bootstrap option | Назначение |
| --- | --- |
| `dataProvider` | `default`, `plain` или `bundle` |
| `scope.workspaceIdentity` | Выбор Workspace |
| `context` | Начальный execution context |
| `vars` | Значения workspace variables для Source `env(...)` |
| `ui` | Default locale, theme и adapter fallback IDs |
| `auth` | Подключение auth-окружения |
| `bridge` | Разрешённые Bridge connections и политики host |
| `commands` | Подключение внешних команд приложения |
| `plainSource`, `domainProvider`, `bundleSource` | Соответствующие provider inputs |
| `signal` | Отмена bootstrap |
| `mode` | `application` или `debugger` |

Точный shape и обязательность полей: [bootstrap contracts](/reference/contracts/core/bootstrap). Bundle — снимок для исполнения, поэтому редакторскую запись выполняют через backend provider, а не через bundle runtime.

## Кто владеет какой возможностью

| API фасада | Ответственность | Контракт |
| --- | --- | --- |
| `context`, `workspace` | Выбранный Workspace, структурный контекст и coherent переключение | [context](/reference/contracts/core/context), [workspace](/reference/contracts/core/workspace) |
| `domain`, `domainRepository` | Materialization, индексы, serialization и persistence boundary | [domain](/reference/contracts/core/domain), [repository](/reference/contracts/core/domain-repository) |
| `source` | Defaults, parse, validate, normalize, compile, patch и language services | [source](/reference/contracts/core/source) |
| `documentImport` | Импорт Type из GraphQL/OpenAPI | [document-import](/reference/contracts/core/document-import) |
| `program`, `compiler` | Artifacts, linking, зависимости и диагностика compilation | [program](/reference/contracts/core/program), [compiler](/reference/contracts/core/compiler) |
| `runtime` | Создание hosts, roots, resources, data flow и операции | [runtime](/reference/contracts/core/runtime) |
| `types`, `configurationSchema`, `configuration` | Type registry и effective Configuration | [types](/reference/contracts/core/EndgeTypes_Module), [configuration](/reference/contracts/core/configuration) |
| `actions`, `computations`, `converters`, `implementations` | Регистрация code implementations и исполнение | [actions](/reference/contracts/core/actions), [computations](/reference/contracts/core/computations), [converters](/reference/contracts/core/converters), [implementations](/reference/contracts/core/implementations) |
| `mock`, `vocabs`, `i18n` | Mock fixtures, справочники и переводы | [mock](/reference/contracts/core/mock), [vocabs](/reference/contracts/core/EndgeVocabs_Module), [i18n](/reference/contracts/core/i18n) |
| `auth` | Credentials и adapter lifecycle | [auth](/reference/contracts/core/auth) |
| `ui`, `uiRegistry`, `styles` | UI settings, definitions, implementations, adapters и style leases | [ui](/reference/contracts/core/ui), [styles](/reference/contracts/core/styles) |
| `events`, `commands` | Публикация событий и внешняя command boundary | [events](/reference/contracts/core/events), [commands](/reference/contracts/core/commands) |
| `diagnostics`, `inspection`, `bridge` | Наблюдение за исполнением и разрешённая отладка | [diagnostics](/reference/contracts/core/diagnostics), [inspection](/reference/contracts/core/inspection), [bridge](/reference/contracts/core/bridge) |
| `updates` | Legacy entrypoint без применения входящих сообщений | [updates](/reference/contracts/core/updates) |

Некоторые facade modules находятся в одной группе деклараций с соседним owner. Полный export index позволяет найти тип по имени, если раздел объединён. Контракт общего Federation и lifecycle расширений — [Federation](/advanced/) и [Endge declarations](/reference/contracts/core/federation) и [базовые Federation contracts](/reference/contracts/federation/).

## Lifecycle и ресурсы

Provider загружает Domain, compiler создаёт Program artifacts, runtime создаёт hosts. Writable data принадлежит Store; binding передаёт ссылки/значения согласно контракту и не делает consumer владельцем Store. Данные runtime хранятся в библиотеке реактивных данных Raph: как устроены пути данных, когда пересчитываются производные поля Store и какая версия Raph нужна — на странице [«Raph в Endge»](/reference/raph) в справочнике. Child host и borrowed resource освобождаются их owner; scope не должен самостоятельно удалять чужой экземпляр.

На смене контекста учитывайте пересборку зависимых artifacts и remount дерева. Подписки diagnostics, events, Bridge и reactive consumers имеют unsubscribe/dispose; удерживайте их рядом с lifecycle owner. `pause` не эквивалентен `dispose`: pause может сохранять данные, но останавливать side effects. Конкретные правила ресурса описаны на его странице и в RuntimeHost contracts.

Не вызывайте compiler или serializer вручную в обход владеющего module ради «обновить UI». Изменение persisted document, compilation, runtime state и view invalidation — разные операции с разными владельцами. Для диагностики сначала определите, на какой границе возникло расхождение.

## Renderer и безопасная точка расширения

`@endge/ui-vue` предоставляет Vue renderer и `vue-native` adapter. Используйте его публичные [entrypoints](/reference/contracts/ui-vue/); не импортируйте private components из `src`. Пользовательские UI definitions/implementations и code implementations регистрируются через публичные registry contracts. Имя тега из другой UI-библиотеки не становится допустимым SFC-тегом автоматически.
