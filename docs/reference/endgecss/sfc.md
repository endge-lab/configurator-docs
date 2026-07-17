# Стили ComponentSFC

Отсутствующий `lang` и `lang="endgecss"` разрешены. Любой другой явно заданный язык, включая CSS, считается ошибкой. Scoped styles получают стабильный scope id из identity компонента.

```vue
<template>
  <Badge id="status" class="notice" state="delayed" part="status">
    Задержан
  </Badge>
</template>

<style scoped lang="endgecss">
#status:state(delayed) { color: orange; }
::part(status) { font-weight: 700; }
</style>
```

## `state` и `part`

`state` принимает строку, массив строк или boolean record в runtime. `part` должен быть статическим списком tokens и публикует визуальную поверхность компонента.

`[part="status"]` выполняет локальный attribute matching, а `::part(status)` может пересечь границу encapsulation. `::slot()` зарезервирован и создаёт diagnostic.

## Поверхности Table

Встроенный Table публикует нейтральные части:

- `::part(grid)` — общая поверхность таблицы;
- `::part(header)` и `::part(header-cell)` — шапка;
- `::part(header-content)` — содержимое заголовка;
- `::part(body)` — viewport строк;
- `::part(row)` и `::part(cell)` — физические строки и ячейки;
- `::part(cell-content)` — пользовательское содержимое;
- `::part(group-row)` — строка группировки.

Эти имена не раскрывают DOM-классы конкретной grid-библиотеки. Другой renderer может опубликовать те же смысловые поверхности.

```css
#control::part(header-cell) {
  background-color: #1e3a5f;
  border-bottom: 1px solid #718096;
}

#control::part(header-content) {
  color: #ffffff;
  font-weight: 600;
}
```

Полный пример тем можно скачать как <a href="/examples/hub-table-themes.endgecss">hub-table-themes.endgecss</a>.
