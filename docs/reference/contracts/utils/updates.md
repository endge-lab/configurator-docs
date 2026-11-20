---
description: "TypeScript-декларации @endge/utils 1.0.0-dev.9, группа updates; исходных модулей: 2."
---

# @endge/utils: updates

Версия source: 1.0.0-dev.9. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/utils); сама ссылка не подтверждает snapshot этого контракта. Source checkout содержит незакоммиченные изменения; публикация этого кандидата не подтверждена. Публичный snapshot данного source-контракта не подтверждён; относительные пути ниже относятся к source-кандидату, а не к repository main.

## src/updates/SSEManager.ts

Исходный модуль: `src/updates/SSEManager.ts`

```ts
export interface SSEManagerMessage {
    event: string;
    id: string | null;
    data: unknown;
}
export interface SSEManagerOptions {
    url: string;
    retryInterval?: number;
    method?: 'GET' | 'POST';
    body?: string;
    headers?: Record<string, string>;
    withCredentials?: boolean;
    getToken?: () => string | undefined | Promise<string | undefined>;
    onEvent?: (data: any) => void;
    onMessage?: (message: SSEManagerMessage) => void;
    onError?: (error: Error) => void;
    onOpen?: () => void;
    onClose?: () => void;
}
export declare class SSEManager {
    constructor(options: SSEManagerOptions);
    start(): void;
    stop(): void;
    get isConnected(): boolean;
}
```

## src/updates/UPSMeter_Service.ts

Исходный модуль: `src/updates/UPSMeter_Service.ts`

```ts
export declare class UPSMeter_Service {
    count(): void;
    get rate(): number;
    reset(): void;
}
```
