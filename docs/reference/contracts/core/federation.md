---
description: "TypeScript-декларации @endge/core 1.3.0-dev.17, группа federation; исходных модулей: 4."
---

# @endge/core: federation

Версия source: 1.3.0-dev.17. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/core); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [5013d6272b427b472eb5c38a698d3608cf8f4ceb](https://github.com/endge-lab/core/tree/5013d6272b427b472eb5c38a698d3608cf8f4ceb).

## src/features/federation/services/EndgeModuleController.ts

Исходный модуль: [src/features/federation/services/EndgeModuleController.ts](https://github.com/endge-lab/core/blob/5013d6272b427b472eb5c38a698d3608cf8f4ceb/src/features/federation/services/EndgeModuleController.ts)

```ts
export declare class EndgeModuleController {
    registerModule(key: string, module: any): void;
    init(): void;
    reset(): void;
}
```

## src/features/federation/services/EndgeSlotRegistry.ts

Исходный модуль: [src/features/federation/services/EndgeSlotRegistry.ts](https://github.com/endge-lab/core/blob/5013d6272b427b472eb5c38a698d3608cf8f4ceb/src/features/federation/services/EndgeSlotRegistry.ts)

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

Исходный модуль: [src/features/federation/types/endge-modules.types.ts](https://github.com/endge-lab/core/blob/5013d6272b427b472eb5c38a698d3608cf8f4ceb/src/features/federation/types/endge-modules.types.ts)

```ts
export * from '@typedworks/federation';
```

## src/features/federation/types/federation.types.ts

Исходный модуль: [src/features/federation/types/federation.types.ts](https://github.com/endge-lab/core/blob/5013d6272b427b472eb5c38a698d3608cf8f4ceb/src/features/federation/types/federation.types.ts)

```ts
export * from '@typedworks/federation';
```
