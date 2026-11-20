---
description: "TypeScript-декларации @endge/utils 1.0.0-dev.9, группа ui; исходных модулей: 1."
---

# @endge/utils: ui

Версия source: 1.0.0-dev.9. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/utils); сама ссылка не подтверждает snapshot этого контракта. Source checkout содержит незакоммиченные изменения; публикация этого кандидата не подтверждена. Публичный snapshot данного source-контракта не подтверждён; относительные пути ниже относятся к source-кандидату, а не к repository main.

## src/ui/tree.types.ts

Исходный модуль: `src/ui/tree.types.ts`

```ts
export interface TreeViewNode {
    id: string;
    label: string;
    icon?: string;
    expanded?: boolean;
    children?: Array<TreeViewNode>;
}
```
