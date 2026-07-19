# Actions

Action — это вызываемое типизированное поведение с одним effective provider и
опциональным результатом. Event, напротив, сообщает о произошедшем факте и может
иметь несколько или ни одного подписчика. Публичного понятия Command в этом
контракте нет: сортировка, фильтрация и закрепление Table являются Actions.

## Единый pipeline

```text
Domain/source definition
  → Compiler / Program artifact
  → Endge.runtime.implementations
  → Endge.actions.execute()
```

Persisted Action хранит semantic contract и Flow source. TypeScript function не
сохраняется в Payload: core, plugin или пользовательское приложение регистрирует
её как runtime provider.

## Источники сущностей

| `origin.kind` | Где определена | Сохраняется | Редактируется |
|---|---|---:|---:|
| `storage` | Payload/domain | да | да |
| `builtin` | core/plugin code | нет | нет |
| `local` | application code | нет | нет |
| `derived` | compiler, например SFC port | нет | нет |

`managedBy: system | integration | user` отвечает за владельца persisted
документа. `origin` отвечает за происхождение effective entity. Эти поля не
заменяют друг друга. Сам runtime provenance не записывается в Payload/export:
для загруженных документов `storage` восстанавливается на границе repository.

## Flow Action

Обычный документ Action сохраняет `definition`, `input`, `output` и `target`.
Compiler создаёт immutable Action artifact, а default implementation равна
`{ kind: 'flow' }`.

```ts
await Endge.actions.execute('orders.recalculate', {
  input: { orderId: '42' },
})
```

Nested Action nodes проходят через тот же facade, поэтому local override работает
и для прямого запуска, и внутри Flow.

## Built-in и local provider

```ts
const dispose = Endge.actions.defineLocal({
  identity: 'app.console.info',
  displayName: 'Сообщение в консоль',
  owner: 'my-app',
  execute: ({ input }) => console.info(input),
})

await Endge.actions.execute('app.console.info', {
  input: { message: 'Проверка' },
})

dispose()
```

### Built-in console log

Core регистрирует `built-in-console-log` локально при создании runtime. У Action
нет Payload-документа и database id; его stable identity и implementation
принадлежат коду `@endge/core`.

Runtime metadata `catalogPath: ['Debug']` размещает Action в
`Built-in → Debug`, не подменяя этим реального owner `@endge/core`.

Без input Action выводит диагностическое сообщение по умолчанию:

```ts
await Endge.actions.execute('built-in-console-log')
```

Можно передать строку или object с полем `message`:

```ts
await Endge.actions.execute('built-in-console-log', {
  input: {
    message: 'Проверка контекстного меню',
  },
})
```

Legacy persisted Action `console-log` удаляется миграцией и больше не создаётся
Payload seed-ом. Старый runtime-step handler также не используется.

`defineBuiltin()` имеет такой же контракт, но создаёт `origin.kind = builtin`.
Повторная identity является ошибкой. Для изменения существующего Action нужен
явный `override()`.

## Override и precedence

```ts
const removeOverride = Endge.actions.override('orders.recalculate', {
  owner: 'customer-app',
  scope: 'application',
  execute: async ({ input }) => recalculateLocally(input),
})

removeOverride() // default Flow снова effective немедленно
```

Порядок разрешения: `invocation → component → composition → workspace →
application → default`. Внутри одного scope учитывается `priority`. Два bindings
одного scope и priority дают diagnostic error; registration order не используется.

Persisted Action с override остаётся в своей папке. В редакторе доступны metadata
и active state, а identity, target, input/output и сохранённый Flow защищены.

## Typed target

```ts
target: [
  { type: 'component.table' },
  { type: 'component.orders', identity: 'orders-main' },
]
```

Selectors являются альтернативами. Один invocation получает ровно один target:

```ts
await Endge.actions.execute('table.column.pinLeft', {
  input: { columnKey: 'status' },
  target: {
    type: 'component.table',
    identity: 'departures-table',
    value: tableRuntimeApi,
  },
})
```

Если `target === null`, цель не требуется. Ошибки runtime:

- `action-target-required` — контракт есть, цель не передана;
- `action-target-type-mismatch` — тип не совпал ни с одним selector;
- `action-target-identity-mismatch` — exact identity не совпала.

Database id и Payload relationship в target resolution не участвуют.

## Component port

Compiler materializes итоговые `definePorts.provides.actions`, включая forwarded
ports, как derived Actions. Их default implementation имеет вид:

```ts
{ kind: 'component-port', portName: 'refresh' }
```

При исполнении обязателен concrete component target. Provider вызывает Action port
именно у переданного mounted instance, поэтому один Component SFC можно монтировать
несколько раз без смешивания state. Selector ограничивает `identity` самой
Component SFC definition, а поле `value` указывает на конкретный mounted instance.

## Domain Widget

В дереве Actions persisted документы остаются в своих папках. Дополнительно
показываются read-only группы `Built-in`, `Provided` и `Local`.
`Provided` располагается сразу после `Built-in`, имеет синее runtime-оформление и
содержит папку `Компоненты` с Component SFC owners и их Actions. Badges:
`system`, `built-in`, `local`, `provided`, `overridden`. Virtual nodes нельзя
перетаскивать, переименовывать, дублировать, удалять или экспортировать.

Functions и bindings не сохраняются, потому что они принадлежат application
runtime, зависят от загруженного кода и не являются переносимым domain source.
