# Производные данные

Derived создаёт синхронную materialized dependency между двумя path branches.

```ts
import { collectionByKey, RaphKernel } from '@raphy-js/raph'

const kernel = new RaphKernel({ initial: { schedule: { raw: [] } } })

const handle = kernel.derive({
  id: 'schedule-table',
  from: 'schedule.raw',
  to: 'schedule.table',
  strategy: collectionByKey('id'),
  compute: rows => rows.map(row => ({
    id: row.id,
    title: row.name,
  })),
})
```

Source и target должны быть concrete и не пересекаться. Один target имеет
одного active writer; внешняя запись в него отклоняется. Compute синхронный и не
мутирует Kernel.

Target одного derived может быть source другого. Kernel стабилизирует DAG в
топологическом порядке до публикации path events.

`runtime.derive(options)` создаёт registration в Kernel и привязывает её cleanup
к root scope Runtime. `kernel.derive(options)` требует явного `handle.dispose()`.

