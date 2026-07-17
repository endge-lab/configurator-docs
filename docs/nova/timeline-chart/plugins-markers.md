# Markers

Markers plugin показывает линии и интервалы поверх timeline.

```ts
const markers = TimelineChart.plugins.markers({
  defaultValue: [{ id: 'now', kind: 'fixed-line', time: Date.now(), color: '#ef4444' }],
})
```

`kind: 'today'` использует текущее `Date.now()` и по умолчанию обновляет label-layer раз в секунду. Timer активен только пока today-marker попадает в текущий viewport; tick не инвалидирует data/layout/tasks и не дергает общий `custom`, а запрашивает render только plugin anchor с labels.

Для заливки области относительно marker используйте `cover`. У линии и `today` доступны `left` и `right`, у range дополнительно `inside`.

```ts
TimelineChart.plugins.markers({
  defaultValue: [
    {
      id: 'now',
      kind: 'fixed-line',
      time: Date.now(),
      cover: ['left'],
    },
    {
      id: 'window',
      kind: 'fixed-interval',
      startTime,
      endTime,
      cover: {
        positions: ['left', 'inside'],
        background: 'rgba(29, 115, 255, 0.08)',
      },
    },
  ],
})
```

:::example id="timeline-chart-markers" layout="tabs"
:::
