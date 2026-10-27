# Пользовательский DataAdapter

`DataAdapter` задаёт storage boundary Kernel:

```ts
interface DataAdapter {
  root: () => Record<string, unknown> | unknown[]
  has?: (path, options?) => boolean
  get: (path, options?) => unknown
  set: (path, value, options?) => void
  delete: (path, options?) => void
  merge: (path, value, options?) => void
  indexOf?: (path, options?) => number
}
```

## DefaultDataAdapter

```ts
const adapter = new DefaultDataAdapter(
  { orders: [] },
  {
    autoCreate: true,
    arrayDelete: 'splice',
    indexEnabled: true,
    indexStrategy: 'lazy-key',
  },
)

const kernel = new RaphKernel({ adapter })
const runtime = new RaphRuntime({ kernel })
```

Kernel без `adapter` использует встроенный `PathStore`. `DefaultDataAdapter`
включается явно, когда нужны configurable selector indexes или adapter contract.

Пользовательский adapter должен синхронно применять mutations, одинаково
интерпретировать paths и не публиковать Raph events самостоятельно. Kernel
отвечает за event batches, derived stabilization и Runtime delivery.
