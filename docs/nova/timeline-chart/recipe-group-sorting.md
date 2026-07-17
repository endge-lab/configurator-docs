# Сортировка групп

Сортировка задается в `options.groups.order`. Делайте comparator стабильным и быстрым.

```ts
groups: { order: (a, b) => a.title.localeCompare(b.title) }
```
