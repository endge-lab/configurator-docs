---
description: "TypeScript-декларации @endge/core 1.0.0-dev.12, группа EndgeTypes_Module; исходных модулей: 1."
---

# @endge/core: EndgeTypes_Module

Версия source: 1.0.0-dev.12. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/EndgeTypes_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/EndgeTypes_Module.ts)

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
