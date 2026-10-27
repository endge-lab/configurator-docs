# Component

`Component` вызывает другой Component SFC по stable identity. Все дополнительные
props передаются дочернему runtime host после evaluation.

```vue
<Component
  is="item-status-badge"
  :item="item"
  :compact="compact"
/>

<Component
  is="item-row"
  for="item in items"
  :key="item.id"
  :item="item"
/>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `is` | string | Stable identity вызываемого Component SFC. |
| `identity` | string | Совместимый explicit identity alias. |
| Любой другой prop | literal/expression | Входной prop дочернего SFC. |
| `if`, `else-if`, `else`, `for`, `:key` | directive | Standard Endge control flow. |

Если компонент зарегистрирован через global tag или component port, его можно
вызвать напрямую: `<ItemStatus :item="item" />`.

