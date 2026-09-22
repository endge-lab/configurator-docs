# Phases и traversal

Phase описывает, какие ноды и в каком контексте должны выполниться при изменении данных.

```ts
import type { PhaseName, RaphPhase } from '@endge/raph'

const renderPhase: RaphPhase = {
  name: 'render' as PhaseName,
  routes: ['ui.*'],
  traversal: 'dirty-and-down',
  each: ({ node, frame, events }) => {
    console.log(node.id, frame.frame, events)
  },
}

app.definePhases([renderPhase])
```

## Routes

`routes` связывает фазу с data paths. Если mutation совпала с route фазы, runtime находит ноды, подписанные на этот path через `track`, и применяет traversal.

Пустой массив `routes` означает, что data mutation сама по себе не выберет фазу. Такую фазу можно активировать через `node.dirty(...)`, `runtime.dirty(...)` или direct data observer.

## Traversal

| Значение | Набор нод |
| --- | --- |
| `dirty-only` | Только непосредственно затронутые ноды |
| `dirty-and-down` | Затронутые ноды и их descendants |
| `dirty-and-up` | Затронутые ноды и их ancestors |
| `all` | Все зарегистрированные ноды в топологическом порядке |

При path notification runtime использует dependency graph, чтобы определить затронутый набор. Финальное разворачивание execution contexts для `dirty-and-down` и `dirty-and-up` следует parent/children tree. Поэтому dependency edges и node hierarchy должны выражать согласованное направление там, где phase полагается на traversal.

## `each` и `all`

- `each(ctx)` вызывается отдельно для каждой выбранной ноды;
- `all(ctxs)` получает весь набор contexts одним вызовом.

Context содержит имя фазы, node, frame и накопленные path events.

`mode: 'all'` разворачивает batch до всех нод. `always: true` запускает фазу даже без dirty nodes; в таком случае `each` получает root node, а `all` — сформированный runtime context.

## Фильтрация нод

Поле `nodes` ограничивает phase:

```ts
const phase: RaphPhase = {
  name: 'render' as PhaseName,
  routes: ['ui.*'],
  traversal: 'dirty-only',
  nodes: node => node.type === 'component',
  each: ({ node }) => renderNode(node),
}
```

Вместо predicate можно передать массив branded `RaphNodeType`.

## Порядок фаз

Фазы выполняются в порядке массива, переданного в `definePhases`. `addPhase` добавляет phase в конец. После ручного изменения набора phases используйте публичные методы `definePhases`, `addPhase` или `clearPhases`, чтобы runtime сохранил согласованный router.

::: warning Асинхронные callbacks
Тип callback допускает `Promise`, но текущий `run()` не ожидает завершения `each` или `all`. Если следующая фаза зависит от результата предыдущей, выполняйте критический участок синхронно либо явно координируйте async lifecycle вне phase ordering.
:::
