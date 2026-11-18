---
description: "TypeScript-декларации @endge/core 1.2.0-dev.15, группа EndgeTypes_Module; исходных модулей: 1."
---

# @endge/core: EndgeTypes_Module

Версия source: 1.2.0-dev.15. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/core); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [42de8952dd5da9eecb167ee8e062d0ee8bbeeba0](https://github.com/endge-lab/core/tree/42de8952dd5da9eecb167ee8e062d0ee8bbeeba0).

## src/features/core/modules/EndgeTypes_Module.ts

Исходный модуль: [src/features/core/modules/EndgeTypes_Module.ts](https://github.com/endge-lab/core/blob/42de8952dd5da9eecb167ee8e062d0ee8bbeeba0/src/features/core/modules/EndgeTypes_Module.ts)

```ts
import { RType } from '@/features/core/modules/domain/entities/RType';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeTypes_Module extends EndgeModule {
    constructor();
    listBuiltins(): RType[];
    listResolved(): RType[];
    getCodeDefinition(identity: string): RType | null;
    getDefinition(identity: string): RType | null;
}
```
