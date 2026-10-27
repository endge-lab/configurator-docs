---
description: "TypeScript-декларации @endge/utils 1.0.0-dev.6, группа execute; исходных модулей: 2."
---

# @endge/utils: execute

Версия source: 1.0.0-dev.6. [Каталог package](./). [Repository](https://github.com/endge-lab/utils).

## src/execute/delay-executor.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/execute/delay-executor.ts)

```ts
export declare class DelayedExecutor<T extends Array<any> = [
]> {
    constructor(_fn: (...args: T) => void, _firstExecuteImmediately?: boolean);
    run(args: T, delayMs?: number, maxWaitMs?: number): void;
    flush(): void;
    cancel(): void;
}
```

## src/execute/NamedExecutor.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/execute/NamedExecutor.ts)

```ts
interface NamedExecutorConfig {
    delayMs: number;
    maxMs: number;
}
export declare class NamedExecutor {
    constructor(_config: NamedExecutorConfig);
    run(id: string, callback: () => void): void;
    flush(id: string): void;
    cancel(id: string): void;
    flushAll(): void;
}
export {};
```
