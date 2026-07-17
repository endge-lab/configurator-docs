# Computation

`RComputation` хранит один canonical source, начинающийся с `defineComputation`.

```ts
defineComputation({
  outputs: {
    base: input('value'),
    doubled: typescript({
      inputs: { value: output('base') },
      compute({ value }) {
        return value * 2
      },
    }),
  },
  result: output('doubled'),
})
```

## Контракт

- `outputs` — именованный граф зависимостей; forward references разрешены.
- `input(path?)` читает внешний input.
- `output(name)` читает другой узел графа.
- Обычные значения используют безопасный словарь ValueExpression.
- `result` обязателен и задаёт единственный результат Computation.

## TypeScript-узел

`typescript` выполняет синхронный пользовательский код внутри sandbox Worker. Imports, сеть, файловая система, таймеры, async-функции и скрытое чтение домена запрещены.

## Порт ComponentSFC

```ts
const ports = definePorts({
  state: computation<Input, Output>({
    default: 'groundhandling-process-state',
  }),
})

const state = ports.state({ process: props.process })
```

```vue
<Text if="state.loading">Загрузка…</Text>
<Text else-if="state.error" color="danger">
  {{ state.error.message }}
</Text>
<GroundHandling.Cell else :point="state.value.target" />
```

Граф только из Endge expressions готов сразу. Граф с `typescript` сначала имеет состояние `pending`. Ресурс пересчитывается при изменении input и использует latest-wins semantics.

## Локальная замена

```ts
const unbind = Endge.bind.computation(
  'groundhandling-process-state',
  {
    execution: 'sync',
    run(input, api) {
      return calculateGroundHandlingState(input, api)
    },
  },
)
```

Override полностью заменяет persisted graph. При ошибке локальной реализации runtime не выполняет скрытый fallback к persisted source.
