---
description: "TypeScript-декларации @typedworks/federation 1.0.0-dev.1, группа Subscribable; исходных модулей: 1."
---

# @typedworks/federation: Subscribable

Версия source: 1.0.0-dev.1. [Каталог package](./). Repository: https://gitlab.com/typedworks/typedworks-federation (закрыт, canonical). Публичные declarations — [@typedworks/federation@1.0.0-dev.1 в npm](https://unpkg.com/@typedworks/federation@1.0.0-dev.1/).

## src/Subscribable.ts

Исходный модуль: `src/Subscribable.ts`

```ts
export interface SubscribableLike {
    subscribe: (listener: () => void) => () => void;
}
export declare class Subscribable implements SubscribableLike {
    subscribe(listener: () => void): () => void;
    notify(): void;
}
```
