# Контекст Endge

`Endge.context` — единая точка доступа к фактическому контексту, в котором
работает приложение. Контекст создаётся во время `Endge.boot(...)` и объединяет
структурные координаты runtime, пользовательские предпочтения и инфраструктуру
локального состояния.

## Структурный контекст

Полный persistence scope состоит из:

- workspace;
- tenant;
- project;
- environment;
- текущего пользователя.

Приложение задаёт workspace и структурные координаты при boot. В течение одного
boot lifecycle tenant, project и environment неизменяемы: для переключения
контекста приложение выполняет reset и новый boot.

```ts
await Endge.boot({
  dataProvider: 'default',
  scope: { workspaceIdentity: 'example-workspace' },
  context: {
    tenantIdentity: 'example-tenant',
    projectIdentity: 'example-project',
    environmentIdentity: 'development',
  },
  vars: {},
  domainProvider,
})
```

Текущие координаты доступны через `getCurrentWorkspace()`,
`getCurrentTenant()`, `getCurrentProject()`, `getCurrentEnvironment()` и
`getCurrentUser()`. Метод `getExecutionContext()` возвращает структурную часть
одним snapshot.

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
