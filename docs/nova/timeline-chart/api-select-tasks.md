# selectTasks

`selectTasks` программно задает selection.

```ts
timeline.value?.selectTasks(['task-1', 'task-2'], { clearPrevious: true })
```

:::example id="timeline-chart-api-updates" layout="tabs"
:::

## Связь с options

Пользовательский selection контролируется `options.selection`, программный selection доступен через ref API.
