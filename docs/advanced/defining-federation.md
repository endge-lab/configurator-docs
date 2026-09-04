# Определение Federation

Для обычной Federation используйте `EndgeFederation.define(...)`. Declaration
описывает identity, Module factories и ordering; общий lifecycle и доступ к
Modules предоставляет framework.

## Module definitions

```ts
import type { EndgeModuleDefinition } from '@endge/core'
import { EndgeFederation } from '@endge/core'

const FEATURE_MODULES = [
  {
    key: 'projectRuntime',
    create: () => new ProjectRuntime_Module(),
  },
  {
    key: 'schedule',
    create: ({ getModule }) => new Schedule_Module(
      getModule<ProjectRuntime_Module>('projectRuntime'),
    ),
    after: 'projectRuntime',
  },
] as const satisfies readonly EndgeModuleDefinition[]
```

Каждый Module создаётся лениво при первой конфигурации Federation. Factory
`getModule(key)` возвращает тот же экземпляр зависимости, который будет доступен
через Federation. Framework отклоняет неизвестные keys, циклическое создание и
повторное объявление одного key.

`before` и `after` принимают один key либо список keys и задают lifecycle-ordering.
Dependency в constructor и lifecycle-ordering — разные contracts: если Module
получает другой Module через `getModule`, необходимый порядок фаз всё равно следует
объявить явно.

## Простая Federation

```ts
export const Feature = EndgeFederation.define({
  id: 'feature',
  name: 'Feature',
  modules: FEATURE_MODULES,
})
```

Literal keys и return types factories формируют типизированные readonly accessors:

```ts
Feature.projectRuntime
Feature.schedule

await Feature.boot(context)
await Feature.reset()
```

Если concrete Module объявляет собственный lifecycle context через generic
`EndgeModule<FeatureContext>`, `define(...)` выводит тот же context для
`Feature.boot(context)` и `Feature.build(context)`. Пустой wrapper-class только
ради сужения типа `boot` не требуется.

Ручные однотипные `configureFederation()` и getters вида
`getModule<T>('key')` для каждого Module не нужны.

## Federation с дополнительной логикой

Если application или package владеет дополнительной orchestration, наследуйте
результат `define(...)`:

```ts
const ApplicationFederation = EndgeFederation.define({
  id: 'application',
  name: 'Application',
  modules: APPLICATION_MODULES,
})

export class Application extends ApplicationFederation {
  public static async init(context: ApplicationContext): Promise<void> {
    await this.boot(context)
    await this.preferences.apply()
  }
}
```

В custom class остаётся только поведение конкретного owner. Generated accessors,
module graph, тип lifecycle context и базовый lifecycle не переопределяются.

Прямое наследование от `EndgeFederation` оправдано только для действительно
нестандартного configuration algorithm или для framework contract tests.

## Выбор id

Используйте короткую стабильную identity, связанную с владельцем Federation:

```ts
EndgeFederation.define({
  id: 'aodb',
  name: 'AODB',
  modules: AODB_MODULES,
})
```

Не генерируйте id во время запуска и не используйте разные module graphs с одним
id. В одном JavaScript realm такой id всегда разрешается в один общий runtime-host.
