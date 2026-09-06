# Пользовательский DataAdapter

`DataAdapter` отделяет runtime от физического представления shared data.

```ts
interface DataAdapter {
  root: () => Record<string | number, unknown>
  get: (path, options?) => unknown
  set: (path, value, options?) => void
  delete: (path, options?) => void
  merge: (path, value, options?) => void
  indexOf: (path, options?) => number
}
```

## DefaultDataAdapter

Встроенный adapter хранит данные в памяти и поддерживает:

- object keys и array indexes;
- поиск элементов массива через `[key=value]`;
- автоматическое создание промежуточных containers;
- индексы параметризованных коллекций;
- `splice` или `unset` при удалении array element.

```ts
import { DefaultDataAdapter, RaphApp } from '@endge/raph'

const adapter = new DefaultDataAdapter(
  { orders: [] },
  {
    autoCreate: true,
    arrayDelete: 'splice',
    indexEnabled: true,
    indexStrategy: 'lazy-key',
  },
)

const app = new RaphApp()
app.options({ adapter })
```

## Adapter wrapper

Новый adapter нужен только при другой модели хранения. Для instrumentation или policy часто достаточно wrapper над default implementation:

```ts
import {
  DefaultDataAdapter,
  type DataAdapter,
  type DataPathDef,
} from '@endge/raph'

class LoggingAdapter implements DataAdapter {
  private readonly base = new DefaultDataAdapter()

  root = () => this.base.root()
  get = (path: DataPathDef, options?: { vars?: Record<string, any> }) =>
    this.base.get(path, options)

  set = (path: DataPathDef, value: unknown, options?: { vars?: Record<string, any> }) => {
    console.log('set', path)
    this.base.set(path, value, options)
  }

  delete = (path: DataPathDef, options?: { vars?: Record<string, any> }) =>
    this.base.delete(path, options)

  merge = (path: DataPathDef, value: unknown, options?: { vars?: Record<string, any> }) =>
    this.base.merge(path, value, options)

  indexOf = (path: DataPathDef, options?: { vars?: Record<string, any> }) =>
    this.base.indexOf(path, options)
}
```

## Invariants adapter

Пользовательская реализация должна:

- одинаково интерпретировать path во всех CRUD operations;
- поддерживать `vars` согласно выбранному контракту;
- возвращать единый mutable root из `root()`;
- синхронно применять mutations;
- обеспечивать `indexOf` для параметризованных коллекций;
- не публиковать Raph events самостоятельно.

Kernel публикует mutation после вызова adapter. Adapter отвечает за данные, а Raph — за routing, derived stabilization и execution.

::: warning Shared ownership
Adapter принадлежит kernel. `runtime.options({ adapter })` заменяет adapter всего shared kernel, а не только одного runtime lane.
:::
