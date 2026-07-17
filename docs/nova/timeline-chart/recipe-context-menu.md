# Контекстное меню диаграммы

TimelineChart v2 поставляет базовый registry `TimelineChart.Overlays`. Он регистрирует overlay `chart-context-menu`, который можно открыть по обычному клику или по `contextmenu`.

```vue
<NovaCanvas @ready="handleReady">
  <TimelineChart.Root
    ref="timeline"
    :data="data"
    :options="options"
  />
  <TimelineChart.Overlays />
</NovaCanvas>
```

```ts
import { TimelineEvents } from '@engine2d/timeline-chart'

function handleReady({ app }) {
  app.bus.on(TimelineEvents.Click, payload => {
    if (payload.area !== 'chart') return

    timeline.value?.openOverlay('chart-context-menu', {
      id: 'chart-menu',
      value: payload,
      anchor: {
        kind: 'pointer',
        x: payload.event.clientX,
        y: payload.event.clientY,
      },
    })
  })
}
```

`chart-context-menu` использует `ActionList` и содержит базовые пункты `Focus visible range`, `Clear selection`, `Refresh`. Пользователь может переопределить overlay через обычный UI Kit registry или открыть свой type через `openOverlay`.

Для правой кнопки используйте тот же код с `TimelineEvents.ContextMenu`: интерактивный слой уже вызывает `preventDefault()` для browser context menu.

## Контекстное меню задачи

Для задач есть opt-in настройка `taskContextMenu`. Timeline сам рассчитывает `rect`-anchor видимой части задачи и открывает overlay снизу от нее.

```ts
export const options = {
  taskContextMenu: {
    enabled: true,
    trigger: 'contextmenu',
    items: ({ task, api }) => [
      {
        id: 'focus',
        label: 'Сфокусировать задачу',
        onClick: () => api.focusOnTask(task.id, { vAlign: 'center', hAlign: 'center', select: true }),
      },
      {
        id: 'select',
        label: 'Выделить задачу',
        onClick: () => api.selectTasks([task.id], { clearPrevious: true }),
      },
    ],
  },
}
```

По умолчанию используется встроенный overlay `task-context-menu` на базе `NovaUIKit.ActionList`. Если нужен свой UI, зарегистрируйте overlay и укажите его type:

```nova
<Overlays>
  <Overlay type="my-task-menu" kind="menu">
    <MyTaskMenu :task="slot.value.task" :close="slot.close" />
  </Overlay>
</Overlays>
```

```ts
export const options = {
  taskContextMenu: {
    enabled: true,
    overlayType: 'my-task-menu',
  },
}
```

Для ручного открытия доступен `timelineApi.getTaskOverlayAnchor(taskId)`. Он возвращает `rect`-anchor в координатах UI Kit `Root`, уже обрезанный по видимой области.
