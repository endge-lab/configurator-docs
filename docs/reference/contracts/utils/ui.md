---
description: "TypeScript-декларации @endge/utils 1.0.0-dev.6, группа ui; исходных модулей: 1."
---

# @endge/utils: ui

Версия source: 1.0.0-dev.6. [Каталог package](./). [Repository](https://github.com/endge-lab/utils).

## src/ui/tree.types.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/ui/tree.types.ts)

```ts
export interface TreeViewNode {
    id: string;
    label: string;
    icon?: string;
    expanded?: boolean;
    children?: Array<TreeViewNode>;
}
```
