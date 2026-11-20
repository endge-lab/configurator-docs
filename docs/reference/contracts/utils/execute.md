---
description: "TypeScript-декларации @endge/utils 1.0.0-dev.9, группа execute; исходных модулей: 2."
---

# @endge/utils: execute

Версия source: 1.0.0-dev.9. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/utils); сама ссылка не подтверждает snapshot этого контракта. Source checkout содержит незакоммиченные изменения; публикация этого кандидата не подтверждена. Публичный snapshot данного source-контракта не подтверждён; относительные пути ниже относятся к source-кандидату, а не к repository main.

## src/execute/delay-executor.ts

Исходный модуль: `src/execute/delay-executor.ts`

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

Исходный модуль: `src/execute/NamedExecutor.ts`

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
