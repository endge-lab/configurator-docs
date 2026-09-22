# Селекторы и каскад

EndgeCSS поддерживает tags, `.class`, локальный `#id`, attributes, combinators и основные structural pseudo-classes.

```css
Text { color: gray; }
#status[data-tone="danger"] { color: red; }
:component(ItemList) > Flex:nth-child(odd) { background: #f8fafc; }
:identity(item-list) ::part(status) { font-weight: 700; }
```

Поддерживаются:

- descendant, child и sibling combinators;
- `:first-child`, `:last-child`, `:nth-child()`;
- `:not()`, `:is()` и `:where()`;
- `:component()` и `:identity()`;
- renderer-neutral `::part()`.

Локальный `#id` преобразуется в `data-endge-id`, поэтому повторные экземпляры компонента не создают дублирующиеся HTML id.

Порядок каскада:

1. `!important`;
2. specificity селектора;
3. детерминированный effective source order.

Inline normal declarations сильнее normal rules, но EndgeCSS `!important` может переопределить inline normal declaration.
