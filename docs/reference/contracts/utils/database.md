---
description: "TypeScript-декларации @endge/utils 1.0.0-dev.9, группа database; исходных модулей: 1."
---

# @endge/utils: database

Версия source: 1.0.0-dev.9. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/utils); сама ссылка не подтверждает snapshot этого контракта. Source checkout содержит незакоммиченные изменения; публикация этого кандидата не подтверждена. Публичный snapshot данного source-контракта не подтверждён; относительные пути ниже относятся к source-кандидату, а не к repository main.

## src/database/PayloadHttpClient.ts

Исходный модуль: `src/database/PayloadHttpClient.ts`

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
