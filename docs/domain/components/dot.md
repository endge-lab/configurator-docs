# Dot

`Dot` — минимальный status indicator без текстового содержимого.

```vue
<Dot tone="success" />
<Dot :tone="item.statusTone" size="6" tooltip="Item status" />
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `tone` | token | Семантический тон. |
| `color` | token/string | Явный цвет. |
| `size` | number/string | Диаметр; standard adapters используют `8px` по умолчанию. |
| `tooltip` / `:tooltip` | string/expression | Доступное пояснение. |

Для важного состояния не полагайтесь только на цвет: добавляйте `tooltip` или
соседний [Text](./text).

