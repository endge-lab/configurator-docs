# Checkbox

`Checkbox` показывает boolean state с необязательной подписью.

```vue
<Checkbox :checked="flight.cancelled" label="Cancelled" />
<Checkbox checked label="Locked" disabled />
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `checked` / `:checked` | boolean/expression | Checked state. |
| `label` / `:label` | string/expression | Подпись. |
| `readonly` | boolean | Metadata; native checkbox всё ещё может реагировать на click. |
| `disabled` | boolean | Полностью блокирует native interaction. |
| spacing, Grid placement | number/string | [Общие атрибуты](./common-attributes). |

Изменение native checked state не создаёт runtime mutation в display-only v1.

