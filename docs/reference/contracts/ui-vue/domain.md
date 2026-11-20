---
description: "TypeScript-декларации @endge/ui-vue 2.4.1-dev.24, группа domain; исходных модулей: 1."
---

# @endge/ui-vue: domain

Версия source: 2.4.1-dev.24. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/ui-vue); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [3e2e86a56e6b69243302b632d6e35106293ab8b4](https://github.com/endge-lab/ui-vue/tree/3e2e86a56e6b69243302b632d6e35106293ab8b4).

## src/domain/types/filter-renderer.type.ts

Исходный модуль: [src/domain/types/filter-renderer.type.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/domain/types/filter-renderer.type.ts)

```ts
import type { FilterViewRenderModel, FilterViewRuntimeHost } from '@endge/core';
export interface EndgeFilterRendererProps {
    runtime?: FilterViewRuntimeHost | null;
    model?: FilterViewRenderModel;
    readonly?: boolean;
}
```
