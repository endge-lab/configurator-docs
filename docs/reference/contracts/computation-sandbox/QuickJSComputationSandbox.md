---
description: "TypeScript-декларации @endge/computation-sandbox 1.0.0-dev.7, группа QuickJSComputationSandbox; исходных модулей: 1."
---

# @endge/computation-sandbox: QuickJSComputationSandbox

Версия source: 1.0.0-dev.7. [Каталог package](./). [Repository](https://github.com/endge-lab/computation-sandbox).

## src/QuickJSComputationSandbox.ts

[Исходный модуль](https://github.com/endge-lab/computation-sandbox/blob/main/src/QuickJSComputationSandbox.ts)

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
