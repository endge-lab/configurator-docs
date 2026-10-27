---
description: "TypeScript-декларации @endge/ui-vue 1.0.0-dev.10, группа domain; исходных модулей: 1."
---

# @endge/ui-vue: domain

Версия source: 1.0.0-dev.10. [Каталог package](./). [Repository](https://github.com/endge-lab/ui-vue).

## src/domain/types/filter-renderer.type.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/domain/types/filter-renderer.type.ts)

```ts
import type { FilterViewRenderModel, FilterViewRuntimeHost } from '@endge/core';
export interface EndgeFilterRendererProps {
    runtime?: FilterViewRuntimeHost | null;
    model?: FilterViewRenderModel;
    readonly?: boolean;
}
```
