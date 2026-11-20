---
description: "TypeScript-декларации @endge/computation-sandbox 1.0.1-dev.9, группа EndgeComputationSandboxPlugin; исходных модулей: 1."
---

# @endge/computation-sandbox: EndgeComputationSandboxPlugin

Версия source: 1.0.1-dev.9. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/computation-sandbox); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [9ff99c3e84afc9e3dd024abc93a4bf69c10b0a75](https://github.com/endge-lab/computation-sandbox/tree/9ff99c3e84afc9e3dd024abc93a4bf69c10b0a75).

## src/EndgeComputationSandboxPlugin.ts

Исходный модуль: [src/EndgeComputationSandboxPlugin.ts](https://github.com/endge-lab/computation-sandbox/blob/9ff99c3e84afc9e3dd024abc93a4bf69c10b0a75/src/EndgeComputationSandboxPlugin.ts)

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
