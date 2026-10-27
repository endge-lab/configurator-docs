# Scheduler и frame loop

`RaphSchedulerType` определяет момент обработки уже поставленной work:

| Режим | Поведение |
| --- | --- |
| `Sync` | flush на завершении mutation boundary |
| `Microtask` | один coalesced microtask |
| `AnimationFrame` | ближайший animation frame |

`runtime.flush()` синхронно дренирует текущую очередь. `afterFlush()` ждёт
обычные, nested и явно deferred deliveries.

## Passes

Новая work для будущей phase может войти в текущий pass. Work для текущей или
пройденной phase начинает следующий pass. Повторные defer/nested writes
ограничены диагностируемым максимальным числом passes.

## Frame tick

Постоянная кадровая работа выражается source, а не always-phase:

```ts
node.watch(runtime.frameTick, 'render', renderFrame, {
  initial: 'none',
})

const lease = runtime.acquireLoop('animation')
lease.release()
```

`runtime` source намеренно не включает `frameTick`. Поэтому global changes и
continuous animation остаются разными контрактами.

`startLoop()` удерживает clock вручную; `stopLoop()` снимает manual hold.
FrameTick активирует только его subscribers, пустые phases не запускаются.

