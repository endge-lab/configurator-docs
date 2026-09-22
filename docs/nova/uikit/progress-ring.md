# ProgressRing

Кольцевой индикатор прогресса для плотных canvas-интерфейсов: таблицы, панели статусов, readiness-колонки и compact widgets.

## Schema helper

`NovaUIKit.progressRingSchema(options)` возвращает массив `NovaSchema` с дугами `arc`. Его можно использовать в UI Kit scenes, TimelineChart templates и любых местах, где принимается Nova schema.

```ts
import type { NovaSchema } from '@endge/nova'
import { NovaUIKit } from '@endge/nova-ui-kit'

const schema: NovaSchema = [
  ...NovaUIKit.progressRingSchema({
    x: 12,
    y: 8,
    size: 18,
    value: 78,
    strokeWidth: 2,
    color: '#10b981',
    trackColor: '#e7edf5',
  }),
  {
    type: 'text',
    text: '78%',
    x: 38,
    y: 4,
    width: 48,
    height: 24,
    styles: {
      color: '#475569',
      font: { size: 12, weight: '700' },
      align: { vertical: 'middle', horizontal: 'left' },
    },
  },
]
```

## Options

| Поле | Назначение |
| --- | --- |
| `x`, `y` | Верхний левый угол индикатора. |
| `value` | Процент от `0` до `100`; значения за пределами диапазона clamp-ятся. |
| `size` | Размер квадрата индикатора, по умолчанию `18`. |
| `strokeWidth` | Толщина дуги, по умолчанию `2`. |
| `color` | Цвет активной дуги. |
| `trackColor` | Цвет фоновой дуги. |
| `opacity` | Общая прозрачность дуг. |
| `lineCap` | Окончание активной дуги: `butt`, `round` или `square`. |

`ProgressRing` не владеет состоянием и не запускает анимацию сам. Для live progress обновляйте значение в данных или template context, а runtime перерисует schema в обычном dirty frame.
