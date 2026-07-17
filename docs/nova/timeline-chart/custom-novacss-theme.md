# Темы через NovaCSS @theme

`@theme` делает NovaCSS похожим на обычный CSS: файл импортируется один раз, темы регистрируются глобально, а `Nova.theme('dark')` переключает активную тему приложения.

## Отдельный .novacss файл

```ts
import { Nova } from '@engine2d/timeline-chart'
import './timeline.novacss'

Nova.theme('light')
Nova.theme('dark')
```

```css
@theme light {
  TimelineChart {
    --nova-timeline-timescale-bg: #ffffff;
    --nova-timeline-timescale-major-text: #2563eb;
  }

  TimelineChart#airport {
    --nova-timeline-grid-major-line: rgba(37, 99, 235, 0.18);
  }
}

@theme dark {
  TimelineChart {
    --nova-timeline-timescale-bg: #0f172a;
    --nova-timeline-timescale-major-text: #f97316;
  }
}
```

Bare import `import './timeline.novacss'` регистрирует asset глобально. Если нужен asset без side effect, используйте `import themeAsset from './timeline.novacss?asset'`.

## Inline style

```vue
<script setup lang="ts">
import { Nova, TimelineChart } from '@engine2d/timeline-chart'

Nova.theme('dark')
</script>

<template>
  <TimelineChart id="airport" :data="data" :options="options" />
</template>

<style lang="novacss">
@theme dark {
  TimelineChart#airport {
    --nova-timeline-timescale-bg: #0f172a;
    --nova-timeline-timescale-major-text: #f97316;
  }
}
</style>
```

Unscoped `<style lang="novacss">` вырезается из Vue SFC и регистрируется через `Nova.import(...)`. Scoped blocks остаются локальным NovaCSS для inline Nova DSL.

## JSON schema

```ts
import { Nova } from '@engine2d/timeline-chart'

Nova.import({
  themes: [
    {
      id: 'light',
      tokens: {
        '--nova-timeline-timescale-bg': '#ffffff',
      },
      styleSheet: null,
    },
    {
      id: 'dark',
      tokens: {
        '--nova-timeline-timescale-bg': '#0f172a',
      },
      styleSheet: null,
    },
  ],
})

Nova.theme('dark')
```

JSON подходит для generated-конфигов и интеграций, где тема приходит не из файла.

## Global и instance override

Без prop `theme` chart наследует глобальную тему:

```vue
<TimelineChart id="airport" :data="data" :options="options" />
```

Локальный override фиксирует тему конкретного instance и не реагирует на `Nova.theme(...)`:

```vue
<TimelineChart id="airport" theme="light" :data="data" :options="options" />
<TimelineChart id="factory" theme="dark" :data="data" :options="options" />
```

Selector-ы позволяют разделять несколько timeline на одной странице:

```css
@theme dark {
  TimelineChart {
    --nova-timeline-timescale-bg: #111827;
  }

  TimelineChart#airport {
    --nova-timeline-timescale-major-text: #38bdf8;
  }

  TimelineChart.dense {
    --nova-timeline-grid-minor-line: rgba(148, 163, 184, 0.12);
  }
}
```
