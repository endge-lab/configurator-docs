# Динамическое состояние

Dynamic state предназначен для небольших сериализуемых значений, которые должны
переживать reload: состояния панелей и вкладок, пользовательские фильтры,
настройки представления и другие UI preferences.

## Базовый API

```ts
const key = 'my-module.navigation'

Endge.context.setState(key, {
  expanded: ['operations', 'resources'],
  width: 280,
})

const state = Endge.context.getState<{
  expanded: string[]
  width: number
}>(key)

const unsubscribe = Endge.context.subscribeState(key, () => {
  console.log('state changed', Endge.context.getState(key))
})

Endge.context.removeState(key)
unsubscribe()
```

`getState` возвращает `undefined`, если значение отсутствует или storage
недоступен. Storage работает в best-effort режиме: ошибка выводится в console,
но не останавливает lifecycle приложения.

## Изоляция

Потребитель передаёт только стабильный namespaced key. Core сам добавляет
Workspace, упорядоченную map выбранных документов фасетов и пользователя. Поэтому
одинаковый ключ можно безопасно использовать в разных контекстах и сессиях:

```ts
Endge.context.setState('editor.smart-tabs', tabs)
Endge.context.setState('navigation.sidebar', navigation)
```

Не добавляйте `userId`, Workspace или facet selections в собственный ключ. Не
генерируйте ключ случайно: после reload потребитель должен вычислить ту же строку.

## Хранилище рабочего контекста

Workspace задаёт `configuration.userStateDriver`, а документ фасета может
переопределить его через `configuration.patch.userStateDriver`. Значение
`local` сохраняет настройки в браузерном хранилище, `indexeddb` использует
IndexedDB, `backend` отправляет настройки в Service Backend. Новые ключи
синхронизируются без регистрации. `disabled` отключает запись настроек
через этот механизм. Хост может объявить браузерные исключения в `localKeys`.

Core загружает рабочее состояние после определения эффективного контекста,
до запуска потребителей. Сам `getState` остаётся синхронным. При работе с Backend
Core записывает изменения в IndexedDB и отправляет их в фоне. Виджеты хоста
могут читать `Endge.context.getWorkspaceStateSyncStatus()` и разрешать конфликт
через `resolveWorkspaceStateConflict(key, 'retry' | 'discard')`.
Offline-запуск зависит от возможности хоста восстановить домен и сессию.

Подробнее о [настройке в Configurator](/configurator/user-settings) и
[подключении хоста](/agents/user-settings).

## Личные настройки приложения

Передайте стабильный `appId` при вызове `Endge.boot({ ...options, appId })`.
Например, можно использовать имя приложения из его `package.json`.
Тема, язык, часовой пояс и настройки, записанные через `setUserState` для
текущей учётной записи, хранятся отдельно для каждого приложения и пользователя.
В режиме Backend они используют ту же очередь, что и пользовательские
настройки рабочего контекста. Хранилище при этом общее для рабочих пространств
одного приложения в пределах одной среды Backend.

```ts
const userId = Endge.context.getCurrentUserStateId()
if (userId) {
  Endge.context.setUserState(userId, 'commands.shortcuts', shortcuts)
}
```

Core Auth получает идентификатор учётной записи из активной сессии. Для OIDC
используются `sub` и, если доступен, `iss`. При другом способе входа хост
передаёт стабильный `userId` через `setSessionIdentityProvider`. Параметр
`identityNamespace` разделяет разные источники учётных записей, если они
могут выдавать совпадающие ID. До установления личности тема работает
в памяти. Начальный выбор определяется `ui.defaultTheme` и конфигурацией
workspace. Значения из общего ключа темы и формата `user-state:v1`
не переносятся.

## Граница применения

Dynamic state подходит, когда значение:

- невелико;
- принадлежит конкретному module или UI feature;
- можно потерять без повреждения business data;
- имеет JSON-compatible представление.

Не сохраняйте этим API access/refresh tokens, OIDC session, Domain documents,
workspace snapshots, большие query results и значения, необходимые для выбора
backend или workspace до `Endge.boot(...)`.
