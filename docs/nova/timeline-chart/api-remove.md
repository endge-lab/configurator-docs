# remove

`remove` удаляет сущности по id.

```ts
timeline.value?.remove({
  tasks: ['task-1'],
  groups: ['group-old'],
  backgrounds: ['window-1'],
})
```

:::example id="timeline-chart-api-updates" layout="tabs"
:::

## После удаления группы

Не оставляйте задачи с устаревшим `groupId`, если они должны исчезнуть вместе с группой. Удаляйте их той же операцией или заранее переносите в `groupId: null`.
