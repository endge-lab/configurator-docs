# Badge

`Badge` — компактная статусная или категорийная метка.

```vue
<Badge tone="success">On time</Badge>
<Badge :tone="flight.statusTone">{{ flight.status }}</Badge>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `value` / `:value` | string/expression | Альтернатива textual children. |
| `tone` | token | Семантический тон. |
| `color`, `bg` | token/string | Цвет текста и фон. |
| `size` | string/number | Размер badge. |
| `radius` / `r` | number/string | Скругление. |
| `tooltip` / `:tooltip` | string/expression | Tooltip metadata. |

Adapter получает `tone` как semantic metadata и сам выбирает visual theme.

