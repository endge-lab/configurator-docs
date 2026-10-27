---
description: "TypeScript-декларации @endge/utils 1.0.0-dev.6, группа updates; исходных модулей: 2."
---

# @endge/utils: updates

Версия source: 1.0.0-dev.6. [Каталог package](./). [Repository](https://github.com/endge-lab/utils).

## src/updates/SSEManager.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/updates/SSEManager.ts)

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

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/updates/UPSMeter_Service.ts)

```ts
export declare class UPSMeter_Service {
    count(): void;
    get rate(): number;
    reset(): void;
}
```
