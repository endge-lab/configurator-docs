# Shared Kernel и runtime lanes

```ts
import { RaphKernel, RaphRuntime, RaphSchedulerType } from '@raphy-js/raph'

const kernel = new RaphKernel({ id: 'workspace' })

const computations = new RaphRuntime({
  id: 'computations',
  kernel,
  scheduler: RaphSchedulerType.Microtask,
})

const rendering = new RaphRuntime({
  id: 'rendering',
  kernel,
  scheduler: RaphSchedulerType.AnimationFrame,
})
```

Общими являются path/meta data, transactions и derived graph. Изолированы
owners, phases, bindings, scheduler, frame loop и lifecycle.

`computations.set(...)` выполняет mutation общего Kernel. Только Runtime lanes с
активными PathHandle/MetaSource subscriptions получают work.

Cross-runtime watch запрещён: общая связь проходит через Kernel path/meta source
либо явный application bridge.

Owner Kernel уничтожает дочерние Runtime до `kernel.dispose()`.

