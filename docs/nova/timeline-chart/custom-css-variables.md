# CSS-переменные TimelineChart v2

TimelineChart v2 публикует semantic tokens в формате CSS custom properties. Их можно задать обычным CSS-классом, через NovaCSS `@theme` или через JSON `Nova.import(...)`.

```css
.timeline-theme-critical {
  --nova-timeline-accent: #dc2626;
  --nova-timeline-timescale-major-text: #dc2626;
  --nova-timeline-grid-major-line: rgba(220, 38, 38, 0.24);
}
```

Для NovaCSS theme тот же набор tokens пишется внутри selector-а:

```css
@theme dark {
  TimelineChart#airport {
    --nova-timeline-accent: #f97316;
    --nova-timeline-timescale-major-text: #f97316;
  }
}
```

## Root

```css
--nova-timeline-bg: #ffffff;                 /* общий фон */
--nova-timeline-panel-bg: #ffffff;           /* фон панелей */
--nova-timeline-text: #111827;               /* основной текст */
--nova-timeline-muted-text: #797A80;         /* вторичный текст */
--nova-timeline-border: rgba(63,63,71,.18);  /* границы и разделители */
--nova-timeline-accent: #005CF1;             /* акцент timeline */
--nova-timeline-selection: #1635ff;          /* выделение */
```

## GroupsPanel

```css
--nova-timeline-groups-bg: #ffffff;                   /* фон панели групп */
--nova-timeline-groups-header-bg: #ffffff;            /* фон заголовка колонок */
--nova-timeline-groups-header-text: #797A80;          /* текст заголовка */
--nova-timeline-groups-cell-bg: lightblue;            /* фон ячейки */
--nova-timeline-groups-cell-text: #000000;            /* текст ячейки */
--nova-timeline-groups-cell-selected-bg: lightblue;   /* фон выбранной ячейки */
--nova-timeline-groups-cell-selected-text: #ffffff;   /* текст выбранной ячейки */
--nova-timeline-groups-divider: rgba(63,63,71,.18);   /* разделители колонок */
```

## TimeScale

```css
--nova-timeline-timescale-bg: #ffffff;             /* фон шкалы */
--nova-timeline-timescale-major-text: #005CF1;     /* major labels */
--nova-timeline-timescale-minor-text: #3F3F47;     /* minor labels */
--nova-timeline-timescale-major-line: rgba(0,92,241,.35);
--nova-timeline-timescale-minor-line: rgba(63,63,71,.18);
--nova-timeline-timescale-font-family: Verdana;
--nova-timeline-timescale-major-font-size: 10px;
--nova-timeline-timescale-minor-font-size: 10px;
--nova-timeline-timescale-major-font-weight: bold;
--nova-timeline-timescale-minor-font-weight: normal;
```

## Grid

```css
--nova-timeline-grid-major-line: rgba(63,63,71,.25);        /* major vertical line */
--nova-timeline-grid-minor-line: rgba(63,63,71,.12);        /* minor vertical line */
--nova-timeline-grid-row-line: rgba(63,63,71,.12);          /* horizontal row line */
--nova-timeline-grid-major-width: 1px;
--nova-timeline-grid-minor-width: 1px;
--nova-timeline-grid-row-width: 1px;
--nova-timeline-grid-vertical-stripe-bg: rgba(0,92,241,.04);
--nova-timeline-grid-horizontal-stripe-bg: rgba(63,63,71,.04);
```

## UngroupedPanel

```css
--nova-timeline-ungrouped-bg: #ffffff;                       /* фон нижней панели */
--nova-timeline-ungrouped-header-bg: #ffffff;                /* фон заголовка */
--nova-timeline-ungrouped-title-text: blue;                  /* заголовок панели */
--nova-timeline-ungrouped-border: rgba(63,63,71,.18);
--nova-timeline-ungrouped-resizer: rgba(63,63,71,.24);
--nova-timeline-ungrouped-scrollbar-track: rgba(15,23,42,.08);
--nova-timeline-ungrouped-scrollbar-thumb: rgba(15,23,42,.32);
```
