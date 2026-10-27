# Raph в Endge Core и Nova

Raph остаётся framework-neutral; consumers задают собственную phase semantics.

## Endge Core

Core использует:

- `RaphKernel` как path/meta data plane;
- Runtime nodes как owners lifecycle;
- persistent PathHandle watches для runtime hosts;
- `process(batch)` для boundary/node update ordering;
- `task.causes` для точного определения изменившихся paths;
- transactions и derived materializations.

UI bridge подписывается на принадлежащие component-node sources, а не сканирует
общий dirty graph.

## Nova

`NovaNode` является RaphNode. Nova выражает:

- reactive state через owner-owned `signal/computed`;
- business dependencies через `runtime.path` + `node.watch`;
- редкое нерективное изменение через `node.touch`;
- горячие phase requests через owner-owned pulses;
- continuous work через `frameTick`;
- propagation semantics внутри Nova phase `process(batch)`.

Raph не знает о Canvas, renderer, hit testing или Nova components.

## Shared Kernel

Core и Nova могут разделить Kernel только при реальном общем data contract.
Их owners, phases, scheduler и pending work остаются разными Runtime lanes.
Cross-runtime reactive edge не создаётся: связь проходит через path/meta data.

