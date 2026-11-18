---
description: "TypeScript-декларации @endge/ui-vue 2.0.0-dev.14, группа domain; исходных модулей: 1."
---

# @endge/ui-vue: domain

Версия source: 2.0.0-dev.14. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/ui-vue); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [b28dfe275ef2d08431082b412644d6fe561a6027](https://github.com/endge-lab/ui-vue/tree/b28dfe275ef2d08431082b412644d6fe561a6027).

## src/domain/types/filter-renderer.type.ts

Исходный модуль: [src/domain/types/filter-renderer.type.ts](https://github.com/endge-lab/ui-vue/blob/b28dfe275ef2d08431082b412644d6fe561a6027/src/domain/types/filter-renderer.type.ts)

```ts
import type { FilterViewRenderModel, FilterViewRuntimeHost } from '@endge/core';
export interface EndgeFilterRendererProps {
    runtime?: FilterViewRuntimeHost | null;
    model?: FilterViewRenderModel;
    readonly?: boolean;
}
```
