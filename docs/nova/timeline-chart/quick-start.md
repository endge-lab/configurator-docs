# Быстрый старт
## Установка

Пакет подключается как обычная npm/workspace зависимость и используется напрямую из Vue-кода.

```ts
import { TimelineChart } from '@engine2d/timeline-chart'
```

Для базового сценария нужен Vue 3 и runtime-пакеты Nova. Для template-профилей через DSL в проекте должен быть включен Nova compiler plugin. Для большинства рабочих сценариев используйте `renderer="webgl"`.

## Основные понятия

| Понятие | Что означает |
| --- | --- |
| `group` | Строка, ресурс или категория в левой панели. |
| `task` | Интервал времени с `startTime`, `endTime` и `groupId`. |
| `background` | Фоновый интервал для визуального контекста. |
| `ungrouped task` | Задача с `groupId: null`, которая попадает в нижнюю ungrouped panel. |
| `timeRange` | Общий доступный диапазон времени и текущее видимое окно. |
| `viewport` | Видимая часть timeline, scroll offsets и ограничения zoom. |
| `task profile` | Правило отрисовки задачи через schema или compiled recipe. |
| `plugin` | Расширение timeline, например markers или overlay. |
| `TimelineChartRef` | Imperative API: `add`, `update`, `remove`, `batch`, `focusOnTask`, `selectTasks`, `refresh`, `data`, `options`. |

## Пример

:::example id="timeline-chart-basic" layout="tabs" display="code-only"
:::
