# Source Actions

Action — именованный алгоритм из последовательных шагов. Source и код вызываются
одинаково по `identity`; runtime выбирает ровно одну effective implementation.

```ts
await Endge.actions.execute('schedule-edit-flight-carrier', {
  input: { id: '42', value: ' lh ', previousValue: 'BA' },
})
```

## Source syntax

```ts
defineAction({
  contract: {
    input: field('Object'),
    output: field('Object'),
  },

  steps: {
    normalized: input('value')
      .dataView('schedule-edit-input')
      .convert('string-trim')
      .upperCase(),

    validation: computation('schedule.validate-carrier', {
      value: output('normalized'),
    }),

    save: query({
      identity: 'schedule-sandbox-update-leg',
      input: {
        id: input('id'),
        payload: { flightCarrier: output('normalized') },
      },
    }),
  },

  output: {
    value: output('normalized'),
    validation: output('validation'),
    request: output('save'),
  },
})
```

Шаги выполняются в source order. `output('name')` может читать только уже
выполненный шаг; forward reference является compile error. Результаты шагов не
публикуются автоматически: внешний результат задаётся только верхнеуровневым
`output`.

Поддерживаются `ValueExpression`, Query, Update, Action, Computation, DataView,
Converter, Operation и чистый `typescript(...)`. Sandbox TypeScript не получает
DOM, сеть, timers или `Endge`; side effects остаются в Query, Update и Action.

## Operation

Operation — отменяемый шаг. `undo` обязателен, иначе нужно использовать обычный
Action step.

```ts
edit: operation({
  input: {
    id: input('id'),
    value: output('normalized'),
    previousValue: input('previousValue'),
  },

  run: {
    steps: {
      local: update({ identity: 'schedule-local-update-leg', input: input() }),
      remote: query({ identity: 'schedule-sandbox-update-leg', input: input() }),
    },
    output: output('remote'),
  },

  undo: {
    steps: {
      remote: query({
        identity: 'schedule-sandbox-update-leg',
        input: {
          id: input('id'),
          value: input('previousValue'),
        },
      }),
    },
    output: output('remote'),
  },
})
```

`operation.input` вычисляется один раз, клонируется и замораживается. Именно
пользователь включает в него id, новое и предыдущее значения. Отдельного
`snapshot` API нет. Успешный `run` создаёт History entry; failed run — нет.
Default `redo` повторяет `run`. Custom redo может читать `runOutput()` и
`undoOutput()`.

Подробнее: [Operation History](./operation-history.md).

## Code-owned definition и provider

Descriptor и функция регистрируются отдельно:

```ts
Endge.actions.define({
  identity: 'aodb.schedule.open-inspector',
  displayName: 'Открыть инспектор',
  origin: { kind: 'local', owner: 'ramax-aodb' },
  contract: {
    input: { type: 'Object' },
    output: { type: 'Void' },
  },
  defaultProviderKey: 'ramax-aodb.schedule.open-inspector',
})

Endge.actions.provide({
  identity: 'aodb.schedule.open-inspector',
  key: 'ramax-aodb.schedule.open-inspector',
  origin: { kind: 'local', owner: 'ramax-aodb' },
  execute({ input }) {
    openInspector(input)
  },
})
```

Две definitions с одной identity запрещены. Замена Source Action требует
предварительно установленного provider и отдельного binding:

```ts
Endge.actions.override({
  identity: 'orders.recalculate',
  providerKey: 'customer-a.orders.recalculate',
  scope: 'application',
  scopeIdentity: 'customer-a',
})
```

Configurator получает serializable catalog definitions, поэтому code-owned
Action виден read-only с origin, owner, contract и effective provider. Неизвестная
identity остаётся linker error.

## Component SFC

Inline reaction остаётся компактной ссылкой:

```vue
<Text
  :value="row.flightCarrier"
  editable
  @edited.stop="action({
    identity: 'schedule-edit-flight-carrier',
    input: {
      id: rowKey,
      value: event('value'),
      previousValue: event('previousValue'),
    },
  })"
/>
```

Одна reaction или массив выполняются в source order. Полный алгоритм и Operation
следует выносить в Source Action.
