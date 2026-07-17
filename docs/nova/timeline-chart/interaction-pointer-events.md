# Pointer events

Pointer events публикуются через Nova bus. Подписку удобно делать в `@ready`, когда доступен `app`.

```ts
import { TimelineEvents } from '@engine2d/timeline-chart'

function handleReady({ app }) {
  app.bus.on(TimelineEvents.Click, payload => console.log(payload))
}
```
