# Какой API выбрать

## `RaphReactivity`

Используйте для независимого синхронного графа без phases и ownership tree:

```ts
import { RaphReactivity } from '@raphy-js/raph/reactivity'
const reactive = new RaphReactivity()
```

## `RaphRuntime`

Основной API для application/runtime integration:

```ts
import { RaphRuntime } from '@raphy-js/raph/runtime'

const runtime = new RaphRuntime({ id: 'canvas' })
```

Runtime автоматически создаёт собственный `RaphKernel`, `rootScope`, `root` и
`frameTick`. Передайте `kernel` явно, если несколько execution lanes должны
разделять path data.

## `RaphKernel`

Используйте отдельно, если нужны только path/meta data, transactions и derived:

```ts
import { RaphKernel } from '@raphy-js/raph/path'
const kernel = new RaphKernel({ initial: { rows: [] } })
```

## `RaphScope` и `RaphNode`

- scope владеет signals, computed, effects, watches и aggregates;
- node добавляет parent/children hierarchy, structure causes и granules;
- plain scope подходит service/module owner;
- node подходит DOM, Canvas, scene graph и уничтожаемому subtree.

## `Raph` facade

Facade нужно сначала сконфигурировать ровно в один режим:

```ts
Raph.configure({ mode: 'reactivity' })
// или
Raph.configure({
  mode: 'runtime',
  phases: [{ name: 'update' }, { name: 'render' }],
})
```

`Raph.reset()` освобождает принадлежащую facade runtime-сессию.

| Задача | API |
| --- | --- |
| Синхронные signals | `RaphReactivity` |
| Фазы и scheduler | `RaphRuntime` |
| Shared path store | `RaphKernel` |
| Ресурсы без tree position | `RaphScope` |
| Ownership hierarchy | `RaphNode` |
| Process-wide facade | `Raph.configure(...)` |

