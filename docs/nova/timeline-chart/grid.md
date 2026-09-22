# Grid и шкала времени

Grid повышает читаемость плотного timeline: линии времени и строк помогают сопоставлять интервалы с группами. Это визуальная настройка, поэтому ее удобнее рассматривать рядом с темами, templates и task profiles.

`grid` задается в `TimelineOptions`, а не через отдельный plugin. Он работает вместе с `timeScale`: шкала дает подписи времени, grid продолжает эти ориентиры в основной области задач.

```ts
const options = {
  grid: {
    type: 'striped',
    horizontal: {
      color: '#d4d7dd',
      width: 0.5,
      accent: 'rgba(36, 107, 254, 0.06)',
    },
    vertical: {
      major: { color: '#b8bdca', width: 0.75 },
      minor: { color: '#e1e4ea', width: 0.5 },
      accent: 'rgba(36, 107, 254, 0.08)',
    },
  },
  timeScale: {
    enabled: true,
    minTickWidthPx: 56,
    maxTicksInView: 14,
  },
}
```

## Режимы

| Поле | Что настраивает |
| --- | --- |
| `grid.type` | Общий режим сетки: `plain` или `striped`. |
| `grid.horizontal` | Линии и accent между строками групп. |
| `grid.vertical.major` | Основные вертикальные линии, которые визуально совпадают с крупными ticks шкалы. |
| `grid.vertical.minor` | Вторичные вертикальные линии для более мелких делений. |
| `grid.vertical.accent` | Мягкая заливка интервалов в режиме `striped`. |

## Рекомендация

Включайте grid для операционных интерфейсов, где пользователь сравнивает много задач по времени. Для dashboard-preview его можно приглушить: оставить только major vertical lines или снизить opacity через цвета.
