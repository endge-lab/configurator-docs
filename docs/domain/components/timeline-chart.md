---
description: "TimelineChart в Endge: данные Timeline, колонки, Visual и Source, параметры шкалы и панелей, события, Action focusTask и TypeScript-пресеты."
---

# TimelineChart

`<TimelineChart>` отображает задачи на временной шкале. В Vue-хосте Endge он создаёт экземпляр `@nova-lab/timeline`. Начать можно с данных и колонок. Пресет понадобится, если приложение хочет управлять оформлением балок, настройками взаимодействия или использовать API экземпляра.

## Первый график

В дереве проекта создайте **Timeline Chart**. Откройте **Visual** для параметров и **Source** для привязки к данным. Шаблон создания уже содержит демонстрационные данные. Минимальный самостоятельный пример:

```vue
<script setup lang="ts">
const props = defineProps<{ timeline: unknown }>()
definePreviewProps({
  timeline: {
    groups: [{ id: 'line-1', title: 'Линия 1' }],
    tasks: [{
      id: 'job-1',
      groupId: 'line-1',
      startTime: 1794988800000,
      endTime: 1794992400000,
    }],
  },
})
</script>

<template>
  <TimelineChart
    ref="chart"
    :data="props.timeline"
    :columns="[{ id: 'name', field: 'title', title: 'Линия', width: 160, sortable: true }]"
    :options="{ timezone: 'UTC', ungroupedPanel: { enabled: false } }"
    :height="260"
  />
</template>
```

`definePreviewProps` задаёт примеры для Preview. На рабочем экране передайте подготовленный объект в prop `timeline` при вызове компонента из [Composition](/reference/composition). Query, DataView или Store могут поставлять исходные данные. Преобразуйте их к модели Timeline перед передачей в компонент, если они приходят в другой форме. Для проверки этой связки запустите [Runtime Preview](/configurator/runtime-preview-workspace).

Например, если Store `schedule-data` содержит поле `timeline` с объектом Timeline, зарегистрируйте его в `data` рабочей Composition и свяжите с prop:

```ts
defineComposition({
  data: {
    schedule: store('schedule-data'),
  },
  runtimes: {
    chart: component('resource-timeline')
      .withProps({ timeline: fromData('schedule.timeline') }),
  },
})
```

Здесь `resource-timeline` — identity документа Component SFC из примера. Когда данные обновляются, Vue-адаптер применяет их к существующему графику.

## Visual и Source

**Timeline Chart** и **Timeline Group** создают обычные документы [Component SFC](/reference/component-sfc). Configurator определяет форму и иконку по единственному значимому корню шаблона. У `<TimelineChart>` своя форма и иконка, у [`<TimelineGroup>`](./timeline-group) своя. В шаблоне с корнем `<Flex>`, `<Grid>` или другой произвольной вёрсткой добавляйте Timeline-теги через Source.

Правка литерала в Visual меняет соответствующий атрибут или поле объекта в исходном SFC. Если значение связано с prop или вычисляется выражением, форма показывает привязку и ведёт к ней в Source. Поля внутри литерального объекта можно менять отдельно, пока путь к полю представлен литералами. Например, при `:options="props.chartOptions"` настройки меняются в поставщике `chartOptions`, а при `:options="{ timeScale: { enabled: true } }"` переключатель шкалы доступен в Visual.

## Входы

| Атрибут | Значение |
| --- | --- |
| `data` | Объект данных Timeline. Используйте `:data="props.timeline"` для привязки |
| `columns` | Массив описаний левых колонок |
| `options` | Объект настроек Timeline. Базовые поля доступны в Visual |
| `height` | Высота панели в px. Если её не задал SFC или пресет, используется 320 px до применения ограничений |
| `min-height`, `max-height` | Нижняя и верхняя границы высоты панели. По умолчанию 80 и 2400 px |
| `title` | Заголовок панели, в том числе в компактном состоянии |
| `hidden`, `collapsed` | `hidden` скрывает весь график. `collapsed` оставляет компактную панель с заголовком. Для условий используйте `:hidden` и `:collapsed` |
| `preset`, `settings` | Имя доступного в scope пресета и объект его параметров |
| `ref` | Адрес узла для маршрутизации события и выполнения Action |

### Данные и колонки

Используйте стабильные строковые ID внутри каждого графика. Временные метки передаются числами в миллисекундах Unix.

| Массив в `data` | Содержимое |
| --- | --- |
| `groups` | Строки левой области с `id`. `parentId` связывает строки в дерево. Добавляйте поля, по которым строятся колонки, например `title` |
| `tasks` | Временные интервалы с `id`, `groupId`, `startTime` и `endTime`. `groupId: null` помещает задачу в нижнюю панель без группы |
| `points` | Точки с `id` и `time`, при необходимости с привязкой к `groupId` или `taskId` |
| `links` | Связи с `id`, `from` и `to` в формате Timeline anchors |
| `backgrounds` | Фоновые интервалы с `id`, `startTime` и `endTime` |

У колонки обязательны уникальный `id` и `field`. `field` читает собственное поле объекта строки, например `title`. Для вложенных данных вынесите значение в плоское поле при подготовке данных или используйте accessor в явном коде пресета. `title` задаёт подпись и по умолчанию совпадает с `field`. `width` задаёт ширину в px, по умолчанию 160. `sortable: true` включает сортировку загруженных строк по колонке. Если колонки задаёт SFC, Vue-адаптер создаёт accessor для каждого `field`.

`groups` определяет строки. Группировку нескольких балок в одну агрегированную задачу настраивают отдельно через правила Timeline в пресете, например через `taskGroupKey` в данных и конфигурацию группировки задач. Профили балок, свой рендер подписей и слои загрузки также описываются кодом пресета.

### Базовые настройки

Имена в таблице совпадают с путями внутри `options`. Числовые размеры формы указаны в пикселях.

| Поле | Что меняет |
| --- | --- |
| `ungroupedPanel.enabled`, `ungroupedPanel.height`, `ungroupedPanel.title` | Видимость, высота и заголовок нижней панели задач без группы |
| `scroll.horizontalBarEnabled` | Горизонтальная полоса прокрутки |
| `scroll.mainVerticalBarEnabled` | Вертикальная полоса основной области |
| `scroll.ungroupedVerticalBarEnabled` | Вертикальная полоса нижней панели |
| `timeScale.enabled`, `timeScale.height` | Видимость и высота шкалы времени |
| `timeScale.preset` | Вид шкалы: `calendar`, `ticks` или `bands` |
| `timeScale.minTickWidthPx` | Минимальная ширина деления |
| `timezone` | Часовой пояс для подписей шкалы, например `Europe/Moscow` |
| `tasks.height`, `tasks.rowGap` | Высота балки и зазор между рядами балок |

Начальное окно можно задать в Source через `options.timeRange` с `start`, `end` и при необходимости границами `min` и `max`. Без заданного окна график подбирает диапазон по первым непустым временным данным. Обновление данных и оформления сохраняет текущий диапазон в пределах допустимых границ. Чтобы перейти в новое окно, передайте новое значение диапазона. Для синхронизированных графиков задавайте окно на [группе](./timeline-group).

## Событие и фокус по задаче

`taskSelected` передаёт `TimelineTaskSelectedEvent` с `taskId: string | null` и `taskIds: string[]`. Чтобы прокинуть событие наружу, дайте графику `ref="chart"` и добавьте в `<script setup>`:

```ts
const ports = definePorts({
  emits: {
    picked: event<TimelineTaskSelectedEvent>({
      from: { ref: 'chart', event: 'taskSelected' },
    }),
  },
})
```

Компонент публикует `picked` для обработчика в Composition. См. [порты Component SFC](/reference/component-sfc) и [привязку событий Composition](/reference/composition-events).

Из кода приложения Action `timeline.focusTask` принимает `input: { id: string }` и цель смонтированного графика. Получите цель по его `ref` у runtime host этого SFC:

```ts
const target = host.getNodeActionTarget('chart')
if (target) {
  const focused = await Endge.actions.execute('timeline.focusTask', {
    input: { id: 'job-1' },
    target,
  })
}
```

Для фокуса задача должна быть в данных графика. `focusTask` возвращает результат Timeline. Фокус может изменить временное окно, которое распространится на связанные графики.

## Пресет приложения

Для пресета конкретной ветки подключите модуль в `resources` композиции. Его фабрика вызывает `registerScopedTimelinePreset(context, descriptor, provider)`. В поле **«Пресет»** редактор показывает штатные варианты и пресеты активного scope выбранного Runtime Preview. Если имя осталось прежним при смене реализации, адаптер заново монтирует график с новым provider и вызывает cleanup предыдущего `mounted`. [Источник подключения в Composition](/reference/composition#модули-композиции)

Для пресета всего Vue-хоста зарегистрируйте его в startup-коде до монтирования SFC. Описание параметров можно регистрировать отдельно в Configurator, чтобы Visual показал поля. Для точного Preview текущий хост должен зарегистрировать также TypeScript-реализацию под тем же именем. При отсутствии реализации график покажет диагностику в Preview.

```ts
import { registerTimelinePreset } from '@endge/ui-vue'

const unregister = registerTimelinePreset({
  name: 'resource-load',
  label: 'Загрузка ресурса',
  compact: true,
  fields: {
    color: { type: 'color', label: 'Цвет балки', default: '#478ACF' },
  },
}, {
  configure: ({ settings, collapsed }) => ({
    options: { tasks: { height: collapsed ? 10 : 22 } },
    taskProfiles: {
      defaultProfileId: 'load',
      profiles: {
        load: {
          recipe: {
            rects: [{
              id: 'fill',
              x: context => context.x,
              y: context => context.y,
              width: context => context.width,
              height: context => context.height,
              color: String(settings.color),
            }],
          },
        },
      },
    },
  }),
  mounted: (chart) => {
    const unsubscribe = chart.on('viewport.changed', (event) => {
      if (event.origin === 'user') {
        console.debug(event.current.timeRange)
      }
    })
    return unsubscribe
  },
})
```

`unregister` снимает регистрацию имени. Функция, возвращённая из `mounted`, освобождает подписки конкретного экземпляра при его уничтожении или перемонтировании. Провайдер получает настоящий `TimelineChartHandle`, поэтому может использовать публичные методы Timeline. Самим экземпляром владеет Vue-адаптер. Для координации нескольких графиков на одном экране используйте [TimelineGroup](./timeline-group).

Привязка пресета в SFC выглядит так:

```vue
<TimelineChart :data="props.timeline" preset="resource-load" :settings="{ color: '#387DAE' }" />
```

Дескриптор полей сериализуемый. Для `boolean` и `number` доступны значения `default` соответствующего типа. Для `string` и `color` можно задать строковое значение по умолчанию и список допустимых строк `values`. Провайдер получает значения после применения defaults и проверки. Явные `data` и `columns` замещают значения пресета, а явные поля `options` имеют приоритет при объединении вложенных настроек. `compact: true` разрешает рендер пресета внутри компактной панели. В `configure` и `mounted` приходит `collapsed` в контексте.

Без пресета график использует стандартное оформление и настройки просмотра с отключённым перетаскиванием и изменением длительности задач. Обычные данные, размеры и настройки применяются через handle. При смене пресета, его параметров или снятии некоторых опций адаптер может пересоздать экземпляр с восстановлением временного окна. Ошибки входов и монтирования видны в области графика. При закрытии экрана адаптер очищает подписки и уничтожает график.
