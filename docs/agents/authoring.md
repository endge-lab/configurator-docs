---
description: "Как агенту создавать и менять Source документов: выбор поверхности изменения, версии и корневые конструкции, порядок работы, проверка и разбор ошибок."
---

# Авторинг Endge для агента

Этот маршрут предназначен агенту, создающему и изменяющему документы Endge. Все примеры используют условные identities и данные. Имя вроде `Item` означает пользовательский Type, который нужно создать либо найти в выбранном workspace; это не автоматически доступный builtin.

## Выберите поверхность изменения

| Что меняется | Авторская поверхность | Проверка |
| --- | --- | --- |
| Доменная модель | Type Source | Parser, Type Registry, зависимости |
| Настройки контекста | Configuration Source и contributions фасетов | Типы, defaults, effective cascade |
| Получение данных | Query Source | Request, props, outputs; GraphQL syntax/schema отдельно |
| Поток событий | Stream Source | Transport, props, нормализация событий |
| Хранение | Store Source | Writable/derived graph и contracts |
| Изменение данных | Update Source | Store owner, paths, pre-update plans |
| Преобразование | DataView Source | Режим, readers и pipeline |
| Вычисление | Computation Source | Outputs DAG, result, sandbox boundary |
| Алгоритм с эффектами | Action Source | Порядок steps, input/output, providers |
| Интерфейс | Component SFC | Макросы, template, ports, EndgeCSS |
| Оркестрация | Composition Source | Data aliases, runtimes, hooks, scopes |
| Стили | Style Source или SFC `<style>` | EndgeCSS и renderer capabilities |
| Подмена данных | Mock и Simulation | Fixture, target, types, generator |
| Интеграция с кодом | Публичный TypeScript API Core/UI | Imports, lifecycle и реализации адаптеров |
| Сохранение | HTTP DTO Service Backend | Role, workspace, revision, request schema |

Source, внутренний Program payload и HTTP DTO — три разных формата. Не отправляйте `StoreSourceArtifact`, AST или runtime snapshot вместо `source` в REST API. Не используйте поля `R*` class как список разрешённых полей HTTP request: backend отклоняет неизвестные поля.

## Версии и корневые конструкции

| Документ | Коллекция HTTP | Source version | Корень |
| --- | --- | --- | --- |
| Type | `types` | `1` | `defineType(...)`, optional `defineMetadata(...)` |
| Configuration | `configurations` | `1` | `defineConfig(...)` |
| Query | `queries` | `2` | `defineQuery({...})` |
| Stream | `streams` | `1` | `defineStream({...})` |
| Store | `stores` | `1` | `defineStore({...})` |
| Update | `updates` | `1` | `defineUpdate({...})`; owner `storeIdentity` вне Source |
| Filter | `filters` | `1` | `defineFilter({...})` |
| DataView | `data-views` | `1` | `defineDataView({...})` |
| Computation | `computations` | `1`, плюс обязательное `contractVersion: 1` | `defineComputation({...})` |
| Action | `actions` | `1` | `defineAction({...})` |
| Composition | `compositions` | `1` | `defineComposition({...})` |
| Simulation | `simulations` | `1` | `defineSimulation({...})` |
| Vocab | `vocabs` | `1` | `defineVocab({...})` |
| Component SFC | `components` | `modelVersion: 1` (не `sourceVersion`) | SFC с `<script setup lang="ts">`, `<template>`, optional `<style>` |
| Style | `styles` | `1` | EndgeCSS |
| Mock, Converter, AuthProfile, I18n Bundle, Navigation | Соответствующая коллекция | Поля версии нет | Специализированный JSON/text contract |

Значения в таблице — текущие версии языков: их пишет Configurator и принимает компилятор. Сервер у части коллекций принимает и другое положительное число, но передавайте ровно эти. Проверенное тело создания каждой коллекции — на странице [примеров документов](/agents/document-examples).

AuthProfile создаёт и меняет только пользователь с ролью Admin workspace. Персональный токен получает `403 access_token_admin_forbidden`: укажите в Query и Stream `auth: { mode: 'inherit' }` или попросите пользователя создать профиль в Configurator ([подробнее](/agents/mcp#профили-авторизации)).

Версия полного workspace snapshot не равна `sourceVersion`. Точные версии libraries и их source fingerprints: [manifest](/contracts-manifest.json). Публичные entrypoints, сигнатуры и overloads: [каталог контрактов](/reference/contracts/). Для существующего документа сохраняйте его контракт и выполняйте явную миграцию только когда она нужна.

## Какие языки нельзя смешивать

1. **Декларативный Source DSL** использует whitelist функций и методов. В ValueExpression коллекция пишется как `.map(get('id'))`; JavaScript callback `.map(x => x.id)` не разрешён.
2. **SFC template** использует отдельное безопасное подмножество выражений: `props.title.toUpperCase()`, `condition ? a : b`, `t(...)`. Метод `.upperCase()` из ValueExpression здесь не появляется автоматически.
3. **Event input** допускает `event(path)`, `now()`, literals и lexical context. У Composition event mapping нет доступа к `row` или `props` компонента: выбирайте `event('rowId')` и другие поля опубликованного payload.
4. **`typescript.compute`** содержит пользовательский TypeScript в sandbox. Доступ к DOM, сети, timers, imports и `Endge` не разрешён.
5. **EndgeCSS** описывает нейтральные стили. Это отдельный язык; SCSS mixins и произвольный CSS target не подразумеваются.

Точные правила: [ValueExpression](/reference/value-expressions), [SFC expressions](/reference/sfc-expressions), [SFC script](/reference/sfc-script), [Event routing](/reference/composition-events), [EndgeCSS](/reference/endgecss/overview).

## Последовательность работы

1. Определите workspace, права и целевой тип документа. Прочитайте текущую revision, source и публичные зависимости. Для ссылок используйте identity, для подписи — `displayName`.
2. Выберите минимальный документ, владеющий требуемым поведением. Query получает данные, Store хранит, Update изменяет, DataView преобразует, Component показывает, Composition связывает.
3. Объявите contracts и зависимости. Укажите, какие identities уже существуют, какие новые документы нужны и какие providers регистрирует host.
4. Напишите Source по справочнику конкретного языка. Не переносите произвольные методы из JavaScript, Vue или соседнего DSL.
5. Проверьте syntax и доступные registry contracts до записи. При наличии локального Core используйте `Endge.source.validate(...)`; затем полную компиляцию контекста для междокументных зависимостей.
6. Выполните минимальный PATCH с актуальным `If-Match`. При конфликте перечитайте документ, сопоставьте изменения и пересоберите правку.
7. Перечитайте сохранённый документ. Отдельно сообщите, что подтверждено: синтаксис, linking, preview или только запись. Успешный HTTP ответ не доказывает исполнимость Source.

Для задачи из нескольких связанных документов (Query, Store, компоненты, несколько Composition, различия тенантов) сначала прочитайте [вертикальный срез](/agents/vertical-slice): там порядок создания, таблица «когда нужно / когда не нужно» и коды ошибок каждой связи.

## Локальная проверка без исполнения сценария

Следующий фрагмент выполняется **в host с инициализированным Endge**, где `source` — строка документа:

```ts
const sourceContext = Endge.source.currentSourceContext()
const validation = Endge.source.validate('query', source, {
  ...(sourceContext ? { sourceContext } : {}),
})

if (!validation.ok) {
  console.log(validation.diagnostics)
}
```

`validate` не делает HTTP-запрос Query. `compile` возвращает normalized document/artifact payload конкретной source strategy. Для SFC применяется отдельный compiler pipeline; не передавайте выдуманный sourceKind `component-sfc` в общий Source Registry. Полная компиляция Domain проверяет references, active state, типы, циклы и build context; локальная syntax validation не заменяет этот этап. Точные параметры методов — [Source API](/reference/contracts/core/source) и [Compiler API](/reference/contracts/core/compiler).

Если агент имеет только REST/MCP, локального compiler у него может не быть. В этом случае он явно отмечает отсутствие compiler validation и использует Problems/Configurator при доступном подключении. Backend хранит Source как текст и не является валидатором всех языков.

## Разбор ошибки

| Симптом | Следующий шаг |
| --- | --- |
| Parser error | Проверить корневую конструкцию, скобки, literals и допустимые вызовы языка |
| Missing reference | Проверить identity, коллекцию, active state и текущий workspace |
| Contract mismatch | Сверить declared props/ports и передаваемую форму |
| `program-artifact-stale` | Пересобрать для актуального контекста, не применять старый payload |
| Пустое представление | Проверить outputs, binding, activation и входной prop |
| Ввод возвращается к старому значению | Проверить путь Event → Action/Update → Store; editor не мутирует row |
| `composition-filter-fields-source-missing` | В `filterView('…')` передан не ключ Filter runtime этой Composition (часто — identity документа Filter). Объявите `filters: filter('<identity>')` и передайте `filterView('filters')`: [FilterView](/reference/composition#filterview) |
| `access_token_admin_forbidden` при записи `auth-profiles` | Профиль создаёт пользователь в Configurator; до этого — `auth: { mode: 'inherit' }` |
| `401` / `403` | Сообщить код и операцию; использовать разрешённый пользователем способ авторизации |
| `409` | Перечитать revision/head и пересмотреть правку |

HTTP/MCP workflow: [подключение агента](/agents/). Полный каталог возможностей и границ: [capabilities](/reference/capabilities). Ссылки на все source repositories: [репозитории](/agents/repositories).
