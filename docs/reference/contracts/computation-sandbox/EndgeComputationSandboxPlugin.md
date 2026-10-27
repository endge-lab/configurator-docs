---
description: "TypeScript-декларации @endge/computation-sandbox 1.0.0-dev.8, группа EndgeComputationSandboxPlugin; исходных модулей: 1."
---

# @endge/computation-sandbox: EndgeComputationSandboxPlugin

Версия source: 1.0.0-dev.8. [Каталог package](./). [Repository](https://github.com/endge-lab/computation-sandbox).

## src/EndgeComputationSandboxPlugin.ts

[Исходный модуль](https://github.com/endge-lab/computation-sandbox/blob/main/src/EndgeComputationSandboxPlugin.ts)

```ts
import type { EndgePlugin } from '@endge/core';
import { EndgeComputationSandbox_Module } from './modules/EndgeComputationSandbox_Module';
declare module '@endge/core' {
    interface EndgeExtensions {
        readonly computationSandbox: EndgeComputationSandbox_Module;
    }
}
export declare const EndgeComputationSandboxPlugin: EndgePlugin;
```
