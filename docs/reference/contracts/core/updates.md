---
description: "TypeScript-декларации @endge/core 1.0.0-dev.11, группа updates; исходных модулей: 2."
---

# @endge/core: updates

Версия source: 1.0.0-dev.11. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/updates/EndgeUpdates_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/updates/EndgeUpdates_Module.ts)

```ts
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeUpdates_Module extends EndgeModule {
    applyUpdateForProfile(profileIdentity: string, message: unknown, opts?: {
        vars?: Record<string, string>;
    }): number;
}
```

## src/features/core/modules/updates/tools/ScheduleUpdate-sse-generator.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/updates/tools/ScheduleUpdate-sse-generator.ts)

```ts
export declare function runUpdates(): () => void;
```
