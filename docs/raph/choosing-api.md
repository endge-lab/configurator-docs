# Какой API выбрать

Raph предоставляет несколько уровней API. Выбирайте самый высокий уровень, который покрывает текущую задачу.

## `Raph`: один default runtime

Static facade подходит, когда приложению достаточно одного общего runtime:

```ts
import { Raph } from '@endge/raph'

Raph.set('session.userId', 42)
const userId = Raph.get('session.userId')
```

Через `Raph` доступны shared data, signals, effects, watch, nodes, phases, subscriptions, transactions и derived data.

## `RaphApp`: самостоятельный instance

Используйте `RaphApp`, если нужен отдельный store и независимый execution lifecycle:

```ts
import { RaphApp, SchedulerType } from '@endge/raph'

const preview = new RaphApp({
  scheduler: SchedulerType.Microtask,
})
```

Это удобная граница для sandbox, preview, editor instance или другого автономного контура.

## `RaphKernel` и `RaphRuntime`: shared data, разные execution lanes

Если несколько runtime должны видеть одни данные, но владеть разными нодами, фазами и scheduler, создайте общий kernel:

```ts
import { RaphKernel, SchedulerType } from '@endge/raph'

const kernel = new RaphKernel({ id: 'workspace' })

const ui = kernel.createRuntime({
  id: 'ui',
  scheduler: SchedulerType.AnimationFrame,
})

const computations = kernel.createRuntime({
  id: 'computations',
  scheduler: SchedulerType.Microtask,
})
```

`RaphKernel` остаётся владельцем данных и transactions. Каждый `RaphRuntime` самостоятельно владеет execution graph и lifecycle.

## `RaphNode`: собственные runtime-объекты

Наследуйте `RaphNode`, когда объект должен:

- участвовать в dependency graph;
- подписываться на data paths;
- выполняться в фазах;
- иметь parent/children и local properties;
- освобождать свои подписки вместе с lifecycle.

## `DataPath` и `RaphRouter`: инфраструктура без runtime

Эти классы можно использовать отдельно:

- `DataPath` — для разбора и нормализации путей;
- `RaphRouter<T>` — для сопоставления путей и масок с произвольным payload.

## Выбор по сценарию

| Нужно | Выбор |
| --- | --- |
| Простая общая реактивность | `Raph` |
| Полностью изолированный runtime | `RaphApp` |
| Общие данные и несколько execution-контуров | `RaphKernel` + `RaphRuntime` |
| Пользовательские графовые сущности | `RaphNode` |
| Только path matching | `DataPath` + `RaphRouter` |
| Быстрые свойства дерева нод | [Local Runtime](/raph/local/) |

