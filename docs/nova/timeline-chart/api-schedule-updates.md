# schedule updates

Отложенное применение частых updates настраивается через `options.executor`.

:::example id="timeline-chart-live-updates" layout="tabs"
:::

## Практика

Собирайте внешние изменения в очереди приложения, затем отправляйте их через `batch`. `delay` сглаживает частые микрособытия, `maxDelay` ограничивает максимальное ожидание.
