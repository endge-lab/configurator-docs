# Kernel, Runtime, Scope и Node

## RaphKernel

Kernel — source of truth path/meta data. Он владеет:

- storage и `DataPath` mutations;
- transaction boundary;
- path/meta event batches;
- materialized derived registrations;
- подключёнными Runtime lanes.

Kernel не владеет phases, scheduler или node tree.

## RaphRuntime

Runtime — execution lane. Он владеет:

- `rootScope` и `root`;
- owner-owned producers;
- persistent phase bindings;
- phase order и `process(batch)`;
- scheduler, `afterFlush()` и frame loop;
- lazy path/meta/node/subtree/runtime indexes.

`new RaphRuntime()` создаёт собственный kernel. Несколько Runtime могут получить
один явно переданный kernel, но их owners и task queues остаются изолированными.

## RaphScope

Scope — lifecycle owner без tree position:

```ts
const service = runtime.scope('search-service')
const query = service.signal('')
service.effect('update', () => consume(query.get()))
```

Disposal scope отменяет pending work, снимает edges и освобождает owned sources.

## RaphNode

Node расширяет scope parent/children hierarchy:

```ts
const page = runtime.node({ id: 'page' })
const button = runtime.node({ id: 'button', parent: page })
```

Hierarchy отвечает за ownership, structure causes, subtree granularity и
ordering helper. Она не задаёт один обязательный глобальный порядок эффектов.

Node поддерживает `addChild`, `reorderChildren`, `options`, `touch` и `dispose`.
Disposal node рекурсивно освобождает subtree и отменяет его pending deliveries.

