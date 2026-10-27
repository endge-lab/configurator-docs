# Phases, process и ordering

Phase описывается только именем и необязательным processor:

```ts
runtime.definePhases([
  { name: 'update' },
  {
    name: 'render',
    process(batch) {
      for (const task of batch.tasks) task.run()
    },
  },
])
```

Фазы выполняются в порядке объявления и активны только при наличии задач.

## Default runner

Phase без `process` выполняет задачи в порядке:

1. `priority` по убыванию;
2. `sequence` FIFO при одинаковом priority.

## Custom process

Snapshot `batch.tasks` неизменяем. Каждая задача должна быть разрешена:

- `run()` выполняет callback;
- `defer()` переносит ту же delivery с causes на следующий scheduler turn;
- `cancel()` отбрасывает текущую delivery, не уничтожая binding.

Необработанная задача автоматически defer-ится, а текущий `afterFlush()`
отклоняется с `RaphPhaseProcessError`. Работа не теряется.

## Ordering helper

Traversal не является настройкой phase. Нужный порядок выбирает processor:

```ts
const ordered = orderPhaseTasks(batch.tasks, {
  node: task => task.consumerOwner.node,
  direction: 'parents-first',
})
```

Для Canvas можно выбрать source owner:

```ts
const ordered = orderPhaseTasks(batch.tasks, {
  node: task => {
    for (const cause of task.causes) {
      if (cause.sourceOwner?.node !== undefined)
        return cause.sourceOwner.node
    }

    return undefined
  },
  direction: 'parents-first',
})
```

Если delivery содержит несколько source owners, comparator должен явно выбрать
семантику приложения.
