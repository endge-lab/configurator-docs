---
description: "TypeScript-декларации @endge/core 1.2.0-dev.15, группа updates; исходных модулей: 2."
---

# @endge/core: updates

Версия source: 1.2.0-dev.15. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/core); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [42de8952dd5da9eecb167ee8e062d0ee8bbeeba0](https://github.com/endge-lab/core/tree/42de8952dd5da9eecb167ee8e062d0ee8bbeeba0).

## src/features/core/modules/updates/EndgeUpdates_Module.ts

Исходный модуль: [src/features/core/modules/updates/EndgeUpdates_Module.ts](https://github.com/endge-lab/core/blob/42de8952dd5da9eecb167ee8e062d0ee8bbeeba0/src/features/core/modules/updates/EndgeUpdates_Module.ts)

```ts
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeUpdates_Module extends EndgeModule {
    applyUpdateForProfile(profileIdentity: string, message: unknown, opts?: {
        vars?: Record<string, string>;
    }): number;
}
```

## src/features/core/modules/updates/tools/ScheduleUpdate-sse-generator.ts

Исходный модуль: [src/features/core/modules/updates/tools/ScheduleUpdate-sse-generator.ts](https://github.com/endge-lab/core/blob/42de8952dd5da9eecb167ee8e062d0ee8bbeeba0/src/features/core/modules/updates/tools/ScheduleUpdate-sse-generator.ts)

```ts
export declare function runUpdates(): () => void;
```
