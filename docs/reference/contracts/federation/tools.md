---
description: "TypeScript-декларации @typedworks/federation 1.0.0-dev.1, группа tools; исходных модулей: 1."
---

# @typedworks/federation: tools

Версия source: 1.0.0-dev.1. [Каталог package](./). Repository: https://gitlab.com/typedworks/typedworks-federation (закрыт, canonical). Публичные declarations — [@typedworks/federation@1.0.0-dev.1 в npm](https://unpkg.com/@typedworks/federation@1.0.0-dev.1/).

## src/tools/sort-endge-modules.ts

Исходный модуль: `src/tools/sort-endge-modules.ts`

```ts
import type { EndgeModuleDescriptor } from '../types/endge-modules.types.js';
interface EndgeOrderedDescriptor {
    readonly key: string;
    readonly before?: string | readonly string[];
    readonly after?: string | readonly string[];
}
export declare function sortEndgeOrderedDescriptors<TDescriptor extends EndgeOrderedDescriptor>(descriptors: readonly TDescriptor[]): TDescriptor[];
export declare function sortEndgeModuleDescriptors(descriptors: EndgeModuleDescriptor[]): EndgeModuleDescriptor[];
export {};
```
