# Signals, Effects и Watch

Reactive API — удобный слой над default `RaphApp`. Он подходит для небольших реактивных контуров, которым не требуется вручную создавать nodes и phases.

## Writable signal

```ts
import { Raph } from '@endge/raph'

const count = Raph.signal(0)

console.log(count.value)
count.value = 1
```

Signal хранит значение во внутреннем path default app и является `RaphNode`.

## Computed signal

```ts
const count = Raph.signal(1)
const doubled = Raph.signal(() => count.value * 2)

console.log(doubled.value)
```

При вычислении Raph отслеживает чтения других signals, создаёт dependency edges и обновляет подписки. Computed signal нельзя изменить через `.value`.

## Effect

```ts
const stop = Raph.effect(() => {
  console.log('count:', count.value)

  return () => {
    console.log('cleanup')
  }
})

count.value = 2
stop()
```

Перед повторным запуском effect:

- снимает предыдущие tracked paths;
- вызывает cleanup предыдущего выполнения;
- заново собирает dependencies во время чтения signals.

По умолчанию effect выполняется сразу. Опция `immediate: false` ставит первый запуск в системную effect-phase.

## Watch

```ts
const stop = Raph.watch(
  ['user.*', 'settings.locale'],
  ({ events }) => {
    for (const event of events) {
      console.log(event.original, event.canonical)
    }
  },
)

stop()
```

Watch реагирует на paths и masks, а не на сравнение возвращаемого значения. Callback получает batch `PhaseEvent` текущего запуска.

## Граница API

Signals, effects и watch используют global default app и static computation context `Raph.currentNode`. Для независимо уничтожаемых приложений и нескольких execution lanes используйте явные `RaphApp`/`RaphRuntime` и node-based API.

Reactive API, как и остальная библиотека, пока имеет экспериментальный статус.

