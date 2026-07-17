# groups

`groups` управляет левой панелью, columns, сортировкой, фильтром и вертикальными отступами.

```ts
groups: {
  visible: true,
  columns: [{ id: 'title', title: 'Группа', data: group => group.title, width: 160 }],
  tree: { enabled: true, defaultExpanded: true, indent: 18, disclosureColumnId: 'title' },
  filter: group => group.visible !== false,
}
```

## Вложенность

Группы можно связывать через `parentId`. Если `parentId` есть хотя бы у одной группы, TimelineChart строит tree projection автоматически. Рендер остается плоским и виртуализированным: свернутые потомки не попадают в `visibleGroups`, grid и task scan.

```ts
const data = {
  groups: [
    { id: 'project', title: 'Запуск продукта', expanded: true },
    { id: 'frontend', parentId: 'project', title: 'Фронтенд', expanded: true },
    { id: 'backend', parentId: 'project', title: 'Бэкенд', expanded: true },
  ],
}
```

| Опция | По умолчанию | Описание |
| --- | --- | --- |
| `groups.tree.enabled` | `false` | Явно включает tree mode. Автоматически включается при наличии `parentId`. |
| `groups.tree.defaultExpanded` | `true` | Начальное раскрытие групп, если у группы не задано `expanded`. |
| `groups.tree.indent` | `18` | Горизонтальный отступ на один уровень вложенности. |
| `groups.tree.disclosureColumnId` | первая колонка | Колонка, в которой работает marker раскрытия. |
