# update

`update` принимает partial objects с обязательным `id`. Меняются только переданные поля.

```ts
timeline.value?.update({
  tasks: [{ id: 'task-1', title: 'Готово', progress: 100 }],
})
```

:::example id="timeline-chart-api-updates" layout="tabs"
:::

## Частые updates

Для нескольких изменений подряд используйте `batch`. Для потока событий настройте `executor`.
