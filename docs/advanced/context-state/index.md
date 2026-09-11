# Контекст Endge

`Endge.context` — единая точка доступа к фактическому контексту, в котором
работает приложение. Контекст создаётся во время `Endge.boot(...)` и объединяет
структурные координаты runtime, пользовательские предпочтения и инфраструктуру
локального состояния.

## Структурный контекст

Полный persistence scope состоит из:

- workspace;
- упорядоченного набора выбранных документов активных фасетов;
- текущего пользователя.

Приложение задаёт workspace и при необходимости явную map выбора фасетов при boot.
Состав и порядок фасетов загружаются из Domain. В течение одного boot lifecycle
структурный контекст неизменяем: для переключения приложение выполняет reset и
новый boot.

При обычном повторном boot сохранённый выбор сверяется с актуальным Domain. Если
фасет удалён, его coordinate исчезает; если выбранный документ удалён или
деактивирован, Endge выбирает первый активный документ в стабильном порядке
identity. Фасет без активных документов остаётся без выбора. Явно переданные
приложением или обязательные session coordinates строже: неизвестный фасет или
документ останавливает boot, потому что такой контракт нельзя незаметно заменить.

```ts
await Endge.boot({
  dataProvider: 'default',
  scope: { workspaceIdentity: 'example-workspace' },
  context: {
    facets: {
      customer: 'example-customer',
      region: 'north-west',
    },
  },
  vars: {},
  domainProvider,
})
```

Текущие координаты доступны через `getCurrentWorkspace()`,
`getFacetSelections()`, `getFacetSelection(facetIdentity)` и `getCurrentUser()`.
Метод `getExecutionContext()` возвращает структурную часть одним snapshot в поле
`facets`.

## Пользователь сессии

Core Auth автоматически связывает `getCurrentUser()` с subject активной session.
Если host использует собственный auth lifecycle, он передаёт identity через
`setSessionIdentityProvider(...)`; `setCurrentUser(...)` остаётся fallback для
host-режима без Core Auth session. Потребителям dynamic state не нужно знать,
откуда получен пользователь, и нельзя дублировать его identity в собственном key.

## Встроенные предпочтения

Контекст также владеет текущими `locale`, `theme`, `timezone` и data mode.
Например:

```ts
Endge.context.setCurrentLocale('ru')
Endge.context.setCurrentTheme('dark')
Endge.context.setCurrentTimezone('Europe/Moscow')

console.log(Endge.context.currentLocale)
console.log(Endge.context.currentTheme)
console.log(Endge.context.currentTimezone)
```

Эти значения нормализуются относительно активной конфигурации workspace и
публикуются подписчикам `Endge.context.subscribe(...)`.

## Что читать дальше

- [Динамическое состояние](./dynamic-state) — небольшие значения внешних modules.
- [Сериализация](./serialization) — plain JSON, annotations и ручной codec.
- [Vue reactivity](./vue-reactivity) — связанный с Core `Ref`.

Контекст не заменяет Domain, Store или Auth. Документы, business data, query
results, токены и session credentials должны оставаться у своих владельцев.
