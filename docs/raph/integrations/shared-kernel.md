# Shared Kernel и runtime lanes

Один `RaphKernel` позволяет нескольким runtime разделять data-store и derived graph, сохраняя независимые execution pipelines.

```ts
import { RaphKernel, SchedulerType } from '@endge/raph'

const kernel = new RaphKernel({ id: 'workspace' })

const computations = kernel.createRuntime({
  id: 'computations',
  scheduler: SchedulerType.Microtask,
})

const rendering = kernel.createRuntime({
  id: 'rendering',
  scheduler: SchedulerType.AnimationFrame,
})
```

## Что является общим

- корневые данные и `DataAdapter`;
- mutations и transaction boundary;
- derived registrations и их dependency graph;
- маршрутизация business data events между runtime lanes.

## Что изолировано

- `RaphNode` graph каждого runtime;
- phases и phase routes;
- dirty queues;
- scheduler и frame context;
- loops и leases;
- control-flow subscriptions;
- runtime lifecycle.

## Доставка изменений

```ts
computations.set('orders[id=10].status', 'ready')
```

Mutation выполняется в общем kernel. После derived stabilization kernel проверяет observers и routes каждого зарегистрированного runtime. Каждый затронутый runtime получает собственную invalidation и выполняется согласно своему scheduler.

## Ownership

Owner shared kernel должен:

- создать kernel до runtime lanes;
- передать его всем участникам явно;
- уничтожить дочерние runtime до завершения собственного lifecycle;
- решать, когда очищать общие данные;
- не заменять adapter, пока другие runtime используют старый data contract.

Runtime owner отвечает только за свои nodes, phases, observers, subscriptions и loops.

## Когда разделять kernels

Используйте разные kernels, если контуры:

- не должны видеть данные друг друга;
- имеют независимо уничтожаемое состояние;
- используют несовместимые adapters;
- не должны связываться общей transaction или derived graph.

Связь независимых kernels оформляйте явным bridge на уровне приложения. Не скрывайте её внутри `DataAdapter`.

