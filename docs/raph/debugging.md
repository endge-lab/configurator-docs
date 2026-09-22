# Отладка и метрики

Raph предоставляет read-only snapshots для инспекции graph, routes и derived lifecycle.

## Default runtime debug

```ts
import { Raph } from '@endge/raph'

Raph.options({ debug: true })

const flat = Raph.debug.getFlat()
const tree = Raph.debug.getTree()
```

`getFlat()` возвращает для каждой ноды:

- `id` и `type`;
- parent и child ids dependency graph;
- tracked routes.

`getTree()` возвращает иерархию нод с children и routes для визуального инспектора.

## Debug lease

Временный inspector может удерживать сбор debug state через lease:

```ts
const lease = Raph.debug.acquire()

try {
  inspect(Raph.debug.getFlat())
}
finally {
  lease.release()
}
```

Debugger остаётся включённым, пока действует manual `debug: true` или существует хотя бы один lease.

## Derived snapshots

```ts
const registration = handle.snapshot()
const manager = runtime.getDerivedSnapshot()
```

Проверяйте:

- `status`, `stale` и `lastError`;
- количество full и incremental computes;
- число target writes;
- размеры derived graph;
- pending keys и errors;
- отсутствие registrations после cleanup.

## Runtime counters

```ts
console.log({
  ups: runtime.ups,
  eps: runtime.eps,
  nps: runtime.nps,
  frame: runtime.frame,
})
```

Counters помогают увидеть активность live runtime, но не заменяют профилирование. На них влияют scheduler, частота входных событий, browser throttling и активность loop.

## Что проверять при утечке

1. Освобождены ли watch/effect/subscription disposers.
2. Вызван ли `dispose()` у derived handles.
3. Освобождены ли loop leases.
4. Уничтожены ли runtime lanes, которые больше не используются.
5. Не удерживает ли application disposed nodes внешними ссылками.
6. Обнулился ли derived manager snapshot для уничтоженного scope.

