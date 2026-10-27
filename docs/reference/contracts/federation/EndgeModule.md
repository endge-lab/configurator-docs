---
description: "TypeScript-декларации @typedworks/federation 1.0.0-dev.1, группа EndgeModule; исходных модулей: 1."
---

# @typedworks/federation: EndgeModule

Версия source: 1.0.0-dev.1. [Каталог package](./). Repository: https://gitlab.com/typedworks/typedworks-federation (закрыт, canonical). Публичные declarations — [@typedworks/federation@1.0.0-dev.1 в npm](https://unpkg.com/@typedworks/federation@1.0.0-dev.1/).

## src/EndgeModule.ts

Исходный модуль: `src/EndgeModule.ts`

```ts
import type { EndgeFederationContext } from './types/federation.types.js';
import { Subscribable } from './Subscribable.js';
export declare abstract class EndgeModule<TContext extends EndgeFederationContext = EndgeFederationContext> extends Subscribable {
    protected readonly _contextType: TContext;
    setup(_ctx: TContext): void | Promise<void>;
    load(_ctx: TContext): void | Promise<void>;
    build(_ctx: TContext): void | Promise<void>;
    start(_ctx: TContext): void | Promise<void>;
    reset(): void | Promise<void>;
    createDiagnosticsSnapshot(): unknown;
    serialize(): unknown;
    deserialize(_payload: unknown): void;
}
```
