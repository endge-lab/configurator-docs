# batch

`batch` группирует несколько API-команд в один update cycle.

```ts
timeline.value?.batch(api => {
  api.update({ tasks: [{ id: 'task-1', progress: 90 }] })
  api.selectTasks(['task-1'], { clearPrevious: true })
  api.focusOnTask('task-1', { vAlign: 'center', hAlign: 'center' })
})
```

:::example id="timeline-chart-api-updates" layout="tabs"
:::

## Когда использовать

Используйте batch для UI-команд, где данные, selection и viewport должны измениться вместе.
