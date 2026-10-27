# Observable objects, classes и buffers

`@raphy-js/raph/observable` связывает привычные object/class mutations с конкретным RaphRuntime. Это отдельная API-поверхность; она не превращает произвольный объект в Endge Store и не создаёт persisted document.

## Object и class

```ts
import { observable } from '@raphy-js/raph/observable'
import { RaphRuntime } from '@raphy-js/raph/runtime'

const runtime = new RaphRuntime({ id: 'example' })
const state = observable(runtime, { count: 0 })
const increment = runtime.root.action(() => { state.count += 1 })
increment()
```

Lifecycle runtime и подписок остаётся ответственностью host. Для plain object используйте `observable(runtime, value, options?)`; `deep` управляет глубиной обработки. Для class доступны `makeObservable(runtime, target, annotations, options?)` и `makeAutoObservable(runtime, target, overrides?, options?)`.

| Annotation | Назначение |
| --- | --- |
| `observable` | Наблюдаемое поле |
| `shallow` | Поверхностное наблюдение |
| `ref` | Зависимость от ссылки |
| `computed` | Вычисляемое свойство |
| `action` | Mutation wrapper |
| `action.bound` | Mutation wrapper с привязкой receiver |
| `override` | Явное переопределение annotation |
| `false` | Исключение из обработки |

`ObservableClassOptions.autoBind` задаёт привязку методов. Не копируйте сюда decorators/annotations другой библиотеки: используйте точный [контракт Raph](/raph/contracts/observable), особенно для наследования и дополнительных keys.

## Пользовательский adapter

`defineObservableAdapter` принимает объект с `create(value, context)`. Возвращаемый View может отличаться от исходного типа. Context предоставляет `track(key)`, `notify(key)`, `mutate(key, operation)`, `onObserved(key, subscribe)` и `onDispose(cleanup)`.

Adapter должен отмечать прочитанные keys, сообщать об изменениях и связывать внешние subscriptions с наблюдением/dispose. Не публикуйте broad notification каждого поля при одном изменении без необходимости. Обход adapter через изменение исходного объекта может не создать нужную invalidation.

## Binary buffers

`observableBuffer(runtime, value)` принимает ArrayBufferLike или ArrayBufferView и возвращает wrapper с `value`, `read`, `mutate`, `notify`. Операции используют диапазон `{ offset, length }`; range contract следует сверять с buffer API, а не подменять произвольным DataPath.

`read(range, operation)` регистрирует чтение, `mutate(range, operation)` выполняет изменение и уведомляет о диапазоне. `notify(range)` нужен для уже выполненной внешней записи. Простое изменение `wrapper.value` вне этих boundaries не эквивалентно tracked mutation. Exact generic types и adapter overload приведены в [source snapshot](/raph/contracts/observable).
