# Plugin API

Plugins подключаются через prop `plugins` и расширяют timeline overlays, markers или runtime lifecycle.

:::example id="timeline-chart-markers" layout="tabs"
:::

## Граница ответственности

Plugin должен быть изолированным: не хранить бизнес-cache приложения и корректно очищать listeners/resources при destroy.

## Marquee selection

`TimelineChart.plugins.marqueeSelection()` включает выделение задач прямоугольником. Для кнопочного режима используйте controller:

```ts
const controller = TimelineChart.plugins.createMarqueeSelectionController({
  enabled: false,
  once: true,
})

const plugins = [
  TimelineChart.plugins.marqueeSelection({ controller }),
]
```

В NovaCSS можно настроить стандартный прямоугольник:

```css
@theme light {
  --nova-timeline-marquee-fill: rgba(29, 115, 255, 0.10);
  --nova-timeline-marquee-border: #1d73ff;
  --nova-timeline-marquee-border-width: 1;
  --nova-timeline-marquee-dash: 5,4;
}
```

DSL-вариант поддерживает кастомный `#box`:

```vue
<TimelineChart.MarqueeSelection :controller="controller" once>
  <template #box="{ rect, style, api }">
    <Rect
      :x="rect.x"
      :y="rect.y"
      :width="rect.width"
      :height="rect.height"
      :background="api.resolveThemeToken('--nova-timeline-marquee-fill', style.fill)"
      :border="{ color: style.border, width: style.borderWidth, dashPattern: style.dash }"
    />
  </template>
</TimelineChart.MarqueeSelection>
```

## Link create

`TimelineChart.plugins.linkCreate()` включает кнопочный режим создания links через annotation ports. Пока controller активен, plugin показывает доступные порты; drag от source-port к target-port создает link. `Escape` или повторное выключение controller сбрасывает draft.

```ts
const controller = TimelineChart.plugins.createLinkCreateController({
  enabled: false,
  once: true,
})

const plugins = [
  TimelineChart.plugins.linkCreate({
    controller,
    createLink: ({ from, to }) => ({
      id: crypto.randomUUID(),
      from,
      to,
      route: { mode: 'auto', type: 'orthogonal' },
      selectable: true,
      editable: true,
    }),
  }),
]
```

По умолчанию используется `direction: 'from-to'`: старт только из `outgoing|both`, drop только в `incoming|both`. Self-link на одну entity запрещен за счет списка target-портов. Готовые links добавляются через `root.add({ links })`; для ручного сохранения используйте `commit: 'event'` и `onCreate`.
