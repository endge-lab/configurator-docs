# Scheduler и frame loop

Scheduler определяет, когда runtime выполняет накопленные dirty phases после invalidation.

## Режимы

```ts
import { SchedulerType } from '@endge/raph'

app.options({
  scheduler: SchedulerType.Microtask,
  maxUps: 120,
})
```

| Режим | Планирование |
| --- | --- |
| `SchedulerType.Sync` | Callback вызывается синхронно |
| `SchedulerType.Microtask` | Через `queueMicrotask` |
| `SchedulerType.AnimationFrame` | Через `requestAnimationFrame` |

Повторные invalidations коалесцируются. `maxUps` ограничивает частоту фактических `run()` и определяет минимальный интервал между обновлениями.

## Frame context

Каждый `run()` создаёт `RaphFrameContext`:

```ts
interface RaphFrameContext {
  now: number
  delta: number
  elapsed: number
  frame: number
}
```

- `now` — время текущего запуска;
- `delta` — интервал от предыдущего frame, ограниченный диапазоном `0..100` мс;
- `elapsed` — время с начала текущей последовательности frames;
- `frame` — последовательный номер запуска.

Контекст передаётся каждому phase callback и доступен через `runtime.frame`.

## Автоматическая invalidation

Обычная mutation вызывает `invalidate()`, если есть затронутые ноды или subscriptions. Runtime планирует один запуск согласно scheduler.

При `invalidate: false` автоматический запуск не планируется. Owner может позднее вызвать `run()` или `invalidate()` самостоятельно.

## Непрерывный loop

Для animation, motion и других непрерывных контуров доступны:

```ts
runtime.startLoop()
runtime.stopLoop()
```

Предпочтительный owner-based вариант — lease:

```ts
const lease = runtime.acquireLoop('timeline-motion')

// Когда owner завершил работу
lease.release()
```

Loop остаётся активным, пока включён manual mode или существует хотя бы один lease. Это не заставляет каждую phase выполнять полезную работу: phase без dirty nodes пропускается, если у неё нет `always: true`.

## Runtime-метрики

Runtime публикует read-only значения:

- `ups` — updates в секунду;
- `eps` — data events в секунду;
- `nps` — затронутые nodes в секунду;
- `loopEnabled`;
- `frame`;
- `maxUps` и `minUpdateInterval`.

Эти counters предназначены для live-диагностики, а не для воспроизводимого benchmark. Для сравнения производительности используйте отдельный benchmark scenario с фиксированными входными данными.

