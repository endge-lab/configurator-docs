# options

`options(partial)` применяет partial update и возвращает snapshot при вызове без аргументов.

```ts
timeline.value?.options({ tasks: { height: 40 } })
const current = timeline.value?.options()
```
