# Owner-local state

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

Runtime state принадлежит `RaphScope` или `RaphNode`.

```ts
const x = node.signal(0)
const worldX = node.computed(() => x.get() + parentX.get())

node.effect('matrix', () => {
  updateMatrix(worldX.get())
})
```

Owner metadata нужна для lifecycle и проверки implicit dependencies. Она не
добавляет стоимость standalone reactive core.

## Прямое и coarse состояние

- используйте signal/computed для реактивного state;
- используйте path handle для business data Kernel;
- используйте `touch(metadata)` для редкого изменения нерективного state;
- используйте отдельный pulse signal для частого imperative phase request;
- используйте aggregate для нескольких стабильных sources.

Удалённые local-property decorators и dirty queues не являются частью Runtime
API.
