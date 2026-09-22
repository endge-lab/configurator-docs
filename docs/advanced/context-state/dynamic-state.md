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

## Граница применения

Dynamic state подходит, когда значение:

- невелико;
- принадлежит конкретному module или UI feature;
- можно потерять без повреждения business data;
- имеет JSON-compatible представление.

Не сохраняйте этим API access/refresh tokens, OIDC session, Domain documents,
workspace snapshots, большие query results и значения, необходимые для выбора
backend или workspace до `Endge.boot(...)`.
