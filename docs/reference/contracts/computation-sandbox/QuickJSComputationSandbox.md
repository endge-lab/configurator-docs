---
description: "TypeScript-декларации @endge/computation-sandbox 1.0.1-dev.9, группа QuickJSComputationSandbox; исходных модулей: 1."
---

# @endge/computation-sandbox: QuickJSComputationSandbox

Версия source: 1.0.1-dev.9. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/computation-sandbox); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [9ff99c3e84afc9e3dd024abc93a4bf69c10b0a75](https://github.com/endge-lab/computation-sandbox/tree/9ff99c3e84afc9e3dd024abc93a4bf69c10b0a75).

## src/QuickJSComputationSandbox.ts

Исходный модуль: [src/QuickJSComputationSandbox.ts](https://github.com/endge-lab/computation-sandbox/blob/9ff99c3e84afc9e3dd024abc93a4bf69c10b0a75/src/QuickJSComputationSandbox.ts)

```ts
import type { ComputationSandboxAdapter, ComputationSandboxRequest } from '@endge/core';
export interface QuickJSComputationSandboxOptions {
    workerCount?: number;
    watchdogMs?: number;
}
export declare class QuickJSComputationSandbox implements ComputationSandboxAdapter {
    constructor(options?: QuickJSComputationSandboxOptions);
    execute(request: ComputationSandboxRequest): Promise<unknown>;
    dispose(): void;
}
export declare function createQuickJSComputationSandbox(options?: QuickJSComputationSandboxOptions): QuickJSComputationSandbox;
```
