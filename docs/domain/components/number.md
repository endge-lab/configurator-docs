# Number

`Number` форматирует число с locale-aware разделителями, дробной частью,
префиксом и суффиксом.

```vue
<Flex row gap="2">
  <Number :value="flight.delayMinutes" suffix=" min" />
  <Number :value="flight.loadFactor" decimals="1" suffix="%" />
  <Number :value="price" minFractionDigits="2" prefix="€ " />
</Flex>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `value` / `:value` | number/expression | Форматируемое значение. |
| `decimals` | number/string | Максимальное число знаков после запятой. |
| `minFractionDigits` | number/string | Минимальная дробная часть. |
| `maxFractionDigits` | number/string | Максимальная дробная часть; приоритетнее `decimals`. |
| `prefix`, `suffix` | string | Строки до и после числа. |
| `empty` | string | Renderer-neutral placeholder для пустого значения. |
| `color`, `size`, `weight`, `align` | token/string | Typography attributes. |

Нечисловое значение выводится как строка; `null` и `undefined` дают пустую строку.

