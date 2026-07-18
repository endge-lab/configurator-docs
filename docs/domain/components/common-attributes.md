# Общие атрибуты SFC-компонентов

Эти атрибуты доступны visual primitives. Structural tags могут поддерживать
только явно описанную часть контракта.

## Flow и data binding

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `if` | expression | Рендерит узел при истинном условии. |
| `else-if` | expression | Продолжает соседнюю conditional chain. |
| `else` | boolean | Последняя ветвь conditional chain. |
| `for` | expression | Повторяет элемент, например `for="item in items"`. |
| `:key` | expression | Стабильный ключ элемента внутри `for`. |
| `:attr` | expression | Передаёт вычисленное значение атрибута. |
| `{{ expression }}` | expression | Выводит вычисленное текстовое значение. |

## Identity и metadata

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `id` | string | Локальный id template-узла. |
| `class` | string | Семантический class для EndgeCSS и adapter-а. |
| `tooltip` / `:tooltip` | string / expression | Tooltip metadata; DOM adapter использует `title`. |
| `visible` / `:visible` | boolean / expression | Мягкая видимость; для удаления узла используйте `if`. |

## Размеры и spacing

| Атрибуты | Тип | Назначение |
| --- | --- | --- |
| `width` / `w`, `height` / `h` | number/string | Размер элемента. |
| `minWidth` / `minW`, `maxWidth` / `maxW` | number/string | Ограничения ширины. |
| `minHeight` / `minH`, `maxHeight` / `maxH` | number/string | Ограничения высоты. |
| `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl` | number/string | Padding. |
| `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml` | number/string | Margin. |

Numeric spacing в стандартных DOM adapters использует шаг `4px`. Явные CSS-like
строки (`10px`, `1rem`, `min(100%, 40rem)`) передаются как renderer value.

## Цвет, border и typography

| Атрибуты | Тип | Назначение |
| --- | --- | --- |
| `color`, `bg`, `borderColor` | token/string | Цвет текста, фона и рамки. |
| `tone` | token | `neutral`, `muted`, `info`, `success`, `warning`, `danger`. |
| `borderWidth` | number/string | Толщина рамки. |
| `radius` / `r` | number/string | Скругление. |
| `size`, `lineHeight` | number/string | Размер и высота строки. |
| `weight` | number/string | Толщина текста. |
| `align`, `valign` | string | Горизонтальное и вертикальное выравнивание. |
| `truncate`, `wrap` | boolean/string | Обрезка и перенос текста. |

## Placement внутри Grid

Placement attributes читаются только в контексте прямого родителя [Grid](./grid).

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `colStart` | positive integer | Начальная колонка. |
| `colSpan` | positive integer | Количество колонок. |
| `rowStart` | positive integer | Начальная строка. |
| `rowSpan` | positive integer | Количество строк. |

```vue
<Grid columns="12">
  <Box colStart="2" colSpan="5" rowStart="1" rowSpan="2" />
</Grid>
```

