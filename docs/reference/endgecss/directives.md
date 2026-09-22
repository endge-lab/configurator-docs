# Темы и директивы

## `@theme`

```css
@theme dark {
  --surface: #111827;
  --text: #f9fafb;
  .panel {
    background: var(--surface);
    color: var(--text);
  }
}
```

Тема добавляет переключаемые tokens и rules.

## `@scope`

```css
@scope (:component(ItemList)) to (.nested-list) {
  Text { letter-spacing: .01em; }
}
```

Scope ограничивает matching в абстрактном дереве.

## `@supports`

```css
@supports renderer(dom) and not capability(print) {
  ::part(status) { text-decoration: underline; }
}
```

`@supports` используется для необязательной стилизации, зависящей от renderer или adapter capability. Неизвестная capability исключает правило и создаёт warning.

`@layer` запрещён: его не следует смешивать с будущими source bindings для specific override.
