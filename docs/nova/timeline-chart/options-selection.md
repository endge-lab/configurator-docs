# selection

`selection` управляет пользовательским выделением `task`, `point` и `link`.

По умолчанию доступен только single-select: click без модификаторов выбирает одну сущность через `select-only`, а `selectionScope: 'exclusive'` не позволяет одновременно держать выбранными task и annotations.

```ts
selectionScope: 'exclusive',
selection: [
  { enabled: true, mode: ['single'], trigger: ['click'], target: ['task', 'point', 'link'], handler: ['select-only'] },
]
```

Multi-select пользователь включает явно отдельным rule:

```ts
selection: [
  { enabled: true, mode: ['single'], trigger: ['click'], target: ['task', 'point', 'link'], handler: ['select-only'] },
  { enabled: true, mode: ['Meta', 'Ctrl'], trigger: ['click'], target: ['task', 'point', 'link'], handler: ['toggle'] },
]
```

Для программного добавления к текущему набору используйте ref API с `clearPrevious: false`.
