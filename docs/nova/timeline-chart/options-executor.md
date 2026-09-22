# executor

`executor` позволяет накапливать частые изменения и применять их пачками.

```ts
options: {
  executor: { delay: 60, maxDelay: 180 },
}
```

:::example id="timeline-chart-live-updates" layout="tabs"
:::

## Когда включать

Используйте executor для polling, streaming, live-progress и сценариев, где updates приходят чаще, чем пользователь успевает заметить отдельные кадры.
