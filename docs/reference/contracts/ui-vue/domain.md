---
description: "TypeScript-декларации @endge/ui-vue 2.1.0-dev.16, группа domain; исходных модулей: 1."
---

# @endge/ui-vue: domain

Версия source: 2.1.0-dev.16. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/ui-vue); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [c04ff37288b65db89bc2d828c9e1339ada37fda8](https://github.com/endge-lab/ui-vue/tree/c04ff37288b65db89bc2d828c9e1339ada37fda8).

## src/domain/types/filter-renderer.type.ts

Исходный модуль: [src/domain/types/filter-renderer.type.ts](https://github.com/endge-lab/ui-vue/blob/c04ff37288b65db89bc2d828c9e1339ada37fda8/src/domain/types/filter-renderer.type.ts)

```ts
import type { FilterViewRenderModel, FilterViewRuntimeHost } from '@endge/core';
export interface EndgeFilterRendererProps {
    runtime?: FilterViewRuntimeHost | null;
    model?: FilterViewRenderModel;
    readonly?: boolean;
}
```
