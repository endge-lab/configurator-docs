---
description: "TypeScript-декларации @endge/utils 1.0.0-dev.6, группа database; исходных модулей: 1."
---

# @endge/utils: database

Версия source: 1.0.0-dev.6. [Каталог package](./). [Repository](https://github.com/endge-lab/utils).

## src/database/PayloadHttpClient.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/database/PayloadHttpClient.ts)

```ts
export interface PayloadClientOptions {
    baseUrl: string;
}
export declare class PayloadHttpClient {
    constructor(opts: PayloadClientOptions);
    get<T>(path: string, query?: Record<string, unknown>, extraHeaders?: HeadersInit): Promise<T>;
    post<T>(path: string, body?: unknown, extraHeaders?: HeadersInit): Promise<T>;
    patch<T>(path: string, body?: unknown, extraHeaders?: HeadersInit): Promise<T>;
    delete<T>(path: string, extraHeaders?: HeadersInit): Promise<T>;
}
```
