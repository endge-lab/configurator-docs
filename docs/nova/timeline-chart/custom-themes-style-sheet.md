# Themes, NovaCSS и styleSheet

Кастомизация TimelineChart v2 делится на три слоя:

- CSS-переменные/Nova theme tokens меняют цвета, шрифты и линии без изменения данных.
- `uiTemplates` и templates колонок меняют отдельные зоны через JSON/NovaSchema.
- DSL parts и slots полностью заменяют или дорисовывают панели.

Рекомендуемый путь для темы - NovaCSS `@theme`:

```ts
import { Nova } from '@engine2d/timeline-chart'
import './timeline.novacss'

Nova.theme('dark')
```

```css
@theme dark {
  TimelineChart {
    --nova-timeline-timescale-bg: #0f172a;
    --nova-timeline-timescale-major-text: #f97316;
    --nova-timeline-grid-major-line: rgba(249, 115, 22, 0.24);
  }
}
```

Без prop `theme` компонент наследует `Nova.theme(...)`. Prop `theme` остается локальным override конкретного instance:

```vue
<TimelineChart id="main" :data="data" :options="options" />
<TimelineChart id="preview" theme="light" :data="data" :options="options" />
```

Для CSS custom properties без NovaCSS можно по-прежнему задать обычный class на DOM-обертке:

```vue
<TimelineChart class="timeline-accent" :data="data" :options="options" />
```

```css
.timeline-accent {
  --nova-timeline-timescale-major-text: #dc2626;
  --nova-timeline-grid-major-line: rgba(220, 38, 38, 0.24);
}
```

`themes` prop и `styleSheet` остаются совместимыми для локальной программной настройки, но для новых тем удобнее использовать глобальный `import './timeline.novacss'` и `Nova.theme(...)`.
