# Types: TimelineGroupInput

Базовая группа содержит обязательный `id`. Пользовательские поля добавляются через расширение интерфейса.

```ts
interface Group extends TimelineGroupInput {
  title: string
  owner: string
}
```

```ts
interface TimelineGroupInput {
  id: string
  parentId?: string | null
  expanded?: boolean
  visible?: boolean
  allowOverlap?: boolean
}
```

| Поле | Описание |
| --- | --- |
| `id` | Стабильный id группы. На него ссылается `task.groupId`. |
| `parentId` | Родительская группа для вложенной структуры. Неизвестный parent трактуется как root-level. |
| `expanded` | Начальное раскрытие группы с подгруппами. |
| `visible` | Базовый флаг видимости группы. |
| `allowOverlap` | Свернутый overlap-layout задач внутри этой группы. Не связан с tree collapse. |
