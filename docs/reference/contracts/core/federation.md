---
description: "TypeScript-декларации @endge/core 1.0.0-dev.11, группа federation; исходных модулей: 4."
---

# @endge/core: federation

Версия source: 1.0.0-dev.11. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/federation/services/EndgeModuleController.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/federation/services/EndgeModuleController.ts)

```ts
export declare class EndgeModuleController {
    registerModule(key: string, module: any): void;
    init(): void;
    reset(): void;
}
```

## src/features/federation/services/EndgeSlotRegistry.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/federation/services/EndgeSlotRegistry.ts)

```ts
import type { VoidFunction } from '@endge/utils';
export declare class EndgeSlotRegistry<T extends {
    id?: string;
}> {
    add(item: T): VoidFunction;
    remove(item: T): void;
    list(): readonly T[];
    get(id: string): T | undefined;
    subscribe(cb: () => void): VoidFunction;
}
```

## src/features/federation/types/endge-modules.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/federation/types/endge-modules.types.ts)

```ts
export * from '@typedworks/federation';
```

## src/features/federation/types/federation.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/federation/types/federation.types.ts)

```ts
export * from '@typedworks/federation';
```
