# Кодогенерация: обзор

Кодогенерация в Endge разделена на два слоя:

1. Базовые типы в ядре.
2. Сгенерированные типы и реестры в пользовательском проекте.

## Базовые типы в ядре

В `@endge/core` есть fallback-типы:

```ts
type EndgeProjectId = string
type EndgeEnvId = string
type EndgeComponentId = string
type EndgeActionId = string
```

Они нужны, чтобы библиотечные компоненты можно было писать даже до первой генерации.

Пример:

```ts
import type { EndgeEnvId, EndgeProjectId } from '@endge/core'

interface Props {
  project: EndgeProjectId
  env: EndgeEnvId
}
```

## Сгенерированные типы в проекте

После запуска codegen в целевом проекте появляется `src/gen/types.ts` с namespace `EndgeGen`.

Пример:

```ts
import { EndgeGen } from '@/gen'

interface Props {
  project: EndgeGen.ProjectId
  env: EndgeGen.EnvId
}
```

Это уже не просто `string`, а узкий union по текущему домену.

## Что именно генерируется

Для каждой коллекции домена генерируются:

- `EndgeGen.ProjectId`
- `EndgeGen.EnvId`
- `EndgeGen.PageId`
- `EndgeGen.ComponentId`
- `EndgeGen.QueryId`
- `EndgeGen.ActionId`
- `EndgeGen.SettingsId`

и аналогичные типы для остальных сущностей.

Также создаются:

- объект-константа с identity
- type alias по значениям
- массив `all...Ids`

## Примеры по текущему проекту

В текущем дереве уже встречаются такие identity:

- проект: `configurator`
- среда: `dev`
- settings: `general`
- action: `configurator-init`
- component: `text`

Это значит, что после генерации вы ожидаете примерно такой контракт:

```ts
import { EndgeGen } from '@/gen'

type ProjectId = EndgeGen.ProjectId
type EnvId = EndgeGen.EnvId
type SettingsId = EndgeGen.SettingsId
type ActionId = EndgeGen.ActionId
type ComponentId = EndgeGen.ComponentId
```

и примерно такие значения:

```ts
EndgeGen.ProjectId.configurator
EndgeGen.EnvId.dev
EndgeGen.SettingsId.general
EndgeGen.ActionId.configurator_init
EndgeGen.ComponentId.text
```

Обрати внимание: ключи в объекте нормализуются для TypeScript. Например, `workplaces-init` превращается в ключ `workplaces_init`, но значение остается исходной identity-строкой.

## Где это уже используется

Сейчас базовые `Endge*Id` уже протянуты в:

- `EndgeShell`
- `EndgeView`
- `useEndgeView(identity)`

То есть библиотека работает сразу, а generated-слой просто усиливает типизацию поверх нее.
