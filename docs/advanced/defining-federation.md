# Определение Federation

Для обычной Federation используйте `EndgeFederation.define(...)`. Declaration
описывает identity, Module factories, дочерние Federations и ordering; общий
lifecycle и типизированный доступ к узлам предоставляет framework.

## Module definitions

```ts
import type { EndgeModuleDefinition } from '@endge/core'
import { EndgeFederation } from '@endge/core'

const FEATURE_MODULES = [
  {
    key: 'dataRuntime',
    create: () => new DataRuntime_Module(),
  },
  {
    key: 'schedule',
    create: ({ getModule }) => new Schedule_Module(
      getModule<DataRuntime_Module>('dataRuntime'),
    ),
    after: 'dataRuntime',
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
Feature.dataRuntime
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

## Child Federation definitions

Дочерняя Federation объявляется в отдельном `federations` массиве. Её key
участвует в том же локальном ordering namespace, что и keys Modules:

```ts
const Workspace = EndgeFederation.define({
  id: 'workspace',
  modules: WORKSPACE_MODULES,
})

export const Application = EndgeFederation.define({
  id: 'application',
  modules: APPLICATION_MODULES,
  federations: [
    {
      key: 'workspace',
      federation: Workspace,
      after: 'configuration',
    },
  ],
})
```

`Application.workspace` имеет точный тип facade `Workspace`. После объявления
parent управляет lifecycle child, поэтому приложение вызывает `boot`, `build` и
`reset` только у `Application`.

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
  id: 'workspace',
  name: 'Workspace',
  modules: WORKSPACE_MODULES,
})
```

Не генерируйте id во время запуска и не используйте разные module graphs с одним
id. В одном JavaScript realm такой id всегда разрешается в один общий runtime-host.
