# add

`add` добавляет группы, задачи и background intervals без удаления существующих данных.

```ts
timeline.value?.add({
  tasks: [{ id: 'task-new', groupId: 'group-1', title: 'Новая задача', startTime, endTime }],
})
```

:::example id="timeline-chart-api-updates" layout="tabs"
:::

## Правило

Если id уже существует, используйте `update`, чтобы намерение было явным.
