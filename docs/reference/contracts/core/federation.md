---
description: "TypeScript-декларации @endge/core 1.2.0-dev.15, группа federation; исходных модулей: 4."
---

# @endge/core: federation

Версия source: 1.2.0-dev.15. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/core); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [42de8952dd5da9eecb167ee8e062d0ee8bbeeba0](https://github.com/endge-lab/core/tree/42de8952dd5da9eecb167ee8e062d0ee8bbeeba0).

## src/features/federation/services/EndgeModuleController.ts

Исходный модуль: [src/features/federation/services/EndgeModuleController.ts](https://github.com/endge-lab/core/blob/42de8952dd5da9eecb167ee8e062d0ee8bbeeba0/src/features/federation/services/EndgeModuleController.ts)

```ts
export declare class EndgeModuleController {
    registerModule(key: string, module: any): void;
    init(): void;
    reset(): void;
}
```

## src/features/federation/services/EndgeSlotRegistry.ts

Исходный модуль: [src/features/federation/services/EndgeSlotRegistry.ts](https://github.com/endge-lab/core/blob/42de8952dd5da9eecb167ee8e062d0ee8bbeeba0/src/features/federation/services/EndgeSlotRegistry.ts)

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

Исходный модуль: [src/features/federation/types/endge-modules.types.ts](https://github.com/endge-lab/core/blob/42de8952dd5da9eecb167ee8e062d0ee8bbeeba0/src/features/federation/types/endge-modules.types.ts)

```ts
export * from '@typedworks/federation';
```

## src/features/federation/types/federation.types.ts

Исходный модуль: [src/features/federation/types/federation.types.ts](https://github.com/endge-lab/core/blob/42de8952dd5da9eecb167ee8e062d0ee8bbeeba0/src/features/federation/types/federation.types.ts)

```ts
export * from '@typedworks/federation';
```
