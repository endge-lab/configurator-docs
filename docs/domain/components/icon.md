# Icon

`Icon` хранит renderer-neutral имя иконки. Конкретный adapter решает, как оно
сопоставляется с icon registry, SVG, font glyph или Canvas asset.

```vue
<Icon name="alert-triangle" tone="warning" size="16" />
<Icon :name="flight.statusIcon" :tone="flight.statusTone" tooltip="Status" />
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `name` / `:name` | string/expression | Имя иконки. |
| `icon` / `:icon` | string/expression | Совместимый alias для `name`. |
| `size` | number/string | Размер. |
| `color` | token/string | Цвет. |
| `tone` | token | Семантический тон. |
| `tooltip` / `:tooltip` | string/expression | Tooltip metadata. |

Standard Native DOM adapter выводит name как fallback text; branded adapters
могут заменить его настоящим icon component.

