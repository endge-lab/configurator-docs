# Утилита Codegen

Локальная утилита codegen работает как listener на `127.0.0.1:3210`.

Она нужна для ручного сценария без постоянного демона:

1. ты запускаешь listener
2. расширение находит открытую вкладку платформы
3. по кнопке `Сгенерировать` расширение отправляет bundle в listener
4. listener создает или обновляет `src/gen`

## Запуск

Из корня проекта:

```bash
pnpm codegen:listen
```

Ожидаемое поведение в консоли:

```text
[endge-codegen] Listening on http://127.0.0.1:3210
[endge-codegen] Waiting for Chrome extension connection...
[endge-codegen] Connection not established yet. Retrying in 5 seconds...
```

Когда вкладка найдена и heartbeat пошел, listener пишет подключение к вкладке.

## Что генерируется

В целевом проекте создается каталог:

```text
src/gen
```

Сейчас туда пишутся:

- `domain.json`
- `domain.meta.ts`
- `catalog.ts`
- `identifiers.ts`
- `types.ts`
- `index.ts`

## Что будет внутри

Пример `types.ts`:

```ts
import { EndgeGen } from '@/gen'

type ProjectId = EndgeGen.ProjectId
type EnvId = EndgeGen.EnvId
```

Пример `index.ts`:

```ts
export * from './catalog'
export * from './domain.meta'
export * from './identifiers'
export * from './types'
```

## Примеры на текущих identity

По текущему проекту полезно ожидать такие generated-конструкции:

```ts
EndgeGen.ProjectId.configurator
EndgeGen.EnvId.dev
EndgeGen.SettingsId.general
EndgeGen.ActionId.configurator_init
EndgeGen.ComponentId.text
```

И затем использовать их в коде:

```ts
import { EndgeGen } from '@/gen'

interface ShellProps {
  project: EndgeGen.ProjectId
  env: EndgeGen.EnvId
}
```

Если в текущем snapshot конкретная сущность отсутствует, generated type для нее откатывается к базовому типу из `@endge/core`, а не ломает сборку.

## Что нужно для корректной работы

- расширение Chrome установлено и обновлено
- открыта поддерживаемая вкладка платформы
- listener запущен локально
- в popup указан абсолютный путь до целевого проекта

После этого генерация должна обновить `src/gen`, а IDE подхватит новые типы и константы.
