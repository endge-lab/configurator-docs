# Обзор options

`options` принимает частичные доменные настройки timeline. Их можно передать prop или применить через ref API.

```ts
timeline.value?.options({
  tasks: { height: 34, rowGap: 6 },
  groups: { visible: true },
})
```

:::example id="timeline-chart-options" layout="tabs"
:::

## Что не входит

`renderer`, `loop`, `width`, `height`, `maxDpr`, themes, styleSheet, assets и devtools относятся к Vue wrapper.
