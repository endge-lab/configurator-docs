# Фильтрация групп и задач

Фильтры можно держать в Vue state и передавать в `options`.

```ts
timeline.value?.options({
  groups: { filter: group => group.title.includes(query.value) },
  tasks: { filter: task => task.title.includes(query.value) },
})
```
