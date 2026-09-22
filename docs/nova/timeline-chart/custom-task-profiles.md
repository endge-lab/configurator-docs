# Task profiles

Task profile выбирает schema или compiled recipe для задачи. Это основной способ рисовать разные статусы задач.

```ts
const options = {
  profiles: {
    tasks: {
      by: 'status',
      default: 'active',
    },
  },
}

const taskProfiles = {
  defaultProfileId: 'active',
  profiles: {
    active: { schema: task => [/* NovaSchema */] },
  },
}
```

`options.profiles.tasks.by` выбирает id объявленного task profile. Значение может быть именем поля задачи или функцией. Порядок выбора единый: `by(task)`, затем `task.profile`, `task.kind`, `default`.

:::example id="timeline-chart-task-profile" layout="tabs"
:::

## Рекомендация

Держите profile resolver быстрым и детерминированным. Не делайте сетевые запросы и тяжелые вычисления из template path.
