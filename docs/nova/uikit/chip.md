# Chip

`Chip` - compact interactive token для фильтров, выбранных значений, статусов и removable tags. Это отдельный компонент, не alias `Tag`.

```ts
{
  type: NovaUIKit.Chip,
  props: {
    label: 'Paid',
    selected: true,
    removable: true,
    tone: 'success',
    onPress: () => toggleFilter('paid'),
    onRemove: () => removeFilter('paid'),
  },
}
```

Keyboard: `Enter`/`Space` вызывают press, `Backspace`/`Delete` вызывают remove.

Parts: `root`, `icon`, `avatar`, `label`, `remove`. Токены: `--nova-chip-*`, включая tone и selected-варианты.
