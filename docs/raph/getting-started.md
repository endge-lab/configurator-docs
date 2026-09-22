# Установка и быстрый старт

## Установка

```bash
npm install @endge/raph
```

Пакет публикуется как `@endge/raph` и предоставляет ESM, CommonJS и TypeScript declarations через корневой export.

## Shared data и watch

Для одного общего runtime используйте static API `Raph`:

```ts
import { Raph } from '@endge/raph'

const stop = Raph.watch('user.*', ({ events }) => {
  for (const event of events) {
    console.log('Изменился путь:', event.canonical)
  }
})

Raph.set('user.name', 'Ada')
Raph.merge('user', { role: 'admin' })

console.log(Raph.get('user.name'))

stop()
```

`watch` возвращает disposer. Вызывайте его, когда подписка больше не нужна.

## Signals и effects

```ts
import { Raph } from '@endge/raph'

const count = Raph.signal(0)
const doubled = Raph.signal(() => count.value * 2)

const stopEffect = Raph.effect(() => {
  console.log({ count: count.value, doubled: doubled.value })
})

count.value = 1
stopEffect()
```

Значение сигнала читается и записывается через `.value`. Computed signal доступен только для чтения.

## Изолированный runtime

Если static singleton не подходит, создайте `RaphApp`:

```ts
import {
  RaphApp,
  RaphNode,
  SchedulerType,
  type PhaseName,
} from '@endge/raph'

const app = new RaphApp({
  scheduler: SchedulerType.Sync,
})

app.definePhases([
  {
    name: 'render' as PhaseName,
    traversal: 'dirty-only',
    routes: ['ui.*'],
    each: ({ node, events }) => {
      console.log('render', node.id, events)
    },
  },
])

const screen = new RaphNode(app, { id: 'screen' })
app.addNode(screen)
app.track(screen, 'ui.dashboard.*')

app.set('ui.dashboard.title', 'Overview')
```

В этом примере изменение пути попадает в phase router, помечает подписанную ноду dirty и запускает фазу `render`.

## Куда двигаться дальше

- [Какой API выбрать](/raph/choosing-api)
- [DataPath](/raph/data/data-path)
- [Phases и traversal](/raph/execution/phases-and-traversal)
- [Производные данные](/raph/derived/)

