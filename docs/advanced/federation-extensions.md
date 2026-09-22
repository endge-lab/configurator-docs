# Расширения Federation

Внешний trusted package может декларативно добавить в Federation Modules и
дочерние Federations. Он экспортирует descriptor, а конечное приложение
регистрирует его до первого обращения, конфигурирующего Federation.

## Module extension

```ts
import type { EndgePlugin } from '@endge/core'
import { EndgeModule } from '@endge/core'

export class Charts_Module extends EndgeModule {
  // Public API и lifecycle capability.
}

declare module '@endge/core' {
  interface EndgeExtensions {
    readonly charts: Charts_Module
  }
}

export const ChartsPlugin: EndgePlugin = {
  id: '@example/charts',
  modules: [
    {
      key: 'charts',
      create: () => new Charts_Module(),
      after: 'configuration',
      before: 'runtime',
    },
  ],
}
```

Module augmentation даёт TypeScript accessor `Endge.charts`, а descriptor создаёт
тот же accessor и Module в runtime. Отдельный facade package не нужен.

## Federation extension

```ts
export const DocumentsPlugin: EndgePlugin = {
  id: '@example/documents',
  federations: [
    {
      key: 'documents',
      federation: Documents,
      after: 'workspace',
    },
  ],
}
```

Для типизированного facade package также объявляет accessor child Federation:

```ts
declare module '@endge/core' {
  interface EndgeExtensions {
    readonly documents: typeof Documents
  }
}
```

Один plugin может одновременно объявить `modules` и `federations`. Все их keys
входят в общий namespace sibling-узлов расширяемой Federation и сортируются одним
`before`/`after` graph.

## Регистрация

```ts
import { Endge } from '@endge/core'
import { ChartsPlugin } from '@example/charts'
import { DocumentsPlugin } from '@example/documents'

Endge.use(ChartsPlugin)
Endge.use(DocumentsPlugin)

await Endge.boot(context)

Endge.charts
Endge.documents
```

Регистрация после configuration запрещена: иначе graph и singleton generation
стали бы зависеть от случайного порядка imports. Повторная регистрация одного
stable plugin `id` безопасна только при совпадающем structural descriptor; другой
descriptor под тем же id считается конфликтом.

Plugin не имеет imperative `install()` и не выполняет произвольные side effects.
Все side effects принадлежат lifecycle подключённых Modules или Federations.

## Граница с пользовательским Plugin API

`EndgePlugin` — механизм trusted packages, уже входящих в application bundle и
регистрируемых до boot. Он не заменяет Plugin API для загружаемых пользователем
расширений. Такие расширения проходят через отдельный manifest, validation и
runtime host; они используют заранее опубликованные capabilities приложения, но
не меняют уже сконфигурированный Federation graph вызовом `Endge.use(...)`.

## Singleton при нескольких copies package

Runtime host Federation хранится в registry текущего `globalThis` по stable
Federation `id`. Поэтому несколько copies package в одном JavaScript realm делят
один graph и lifecycle. Это не объединяет разные browser-вкладки, Workers или
Node.js processes: у них разные realms.
