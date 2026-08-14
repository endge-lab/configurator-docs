# Редактирование ячеек

Редактирование является поведением содержимого ячейки, а не отдельным режимом
`Table`. Primitive с `editable` открывает edit session и публикует semantic
Event `edited` после commit.

```vue
<Table id="orders" :rows="rows" row-key="id" paging="virtual">
  <Column key="status" title="Статус">
    <Text
      :value="value"
      editable
      edit-on="click"
      @edited="emit('rowEdited', {
        id: rowKey,
        patch: { [columnKey]: event('value') },
      })"
    />
  </Column>
</Table>
```

`Text`, `Number` и `DateTime` имеют встроенный editor. Во время commit их
`edited` payload содержит:

```ts
{
  value: unknown
  previousValue: unknown
}
```

`event('value')` читает новое значение из этого payload.

## Триггеры

По умолчанию используется `click`. Статическая короткая форма:

```vue
<Text :value="value" editable edit-on="dblclick" />
```

Для клавиатуры и модификаторов доступно выражение:

```vue
<Text
  :value="value"
  editable
  :edit-on="[{
    event: 'keydown',
    key: ['Enter', 'F2'],
    stop: true,
    prevent: true,
    self: true,
  }]"
/>
```

Во встроенном editor `Enter` сохраняет draft, `Escape` отменяет его. Одновременно
runtime держит одну активную edit session компонента.

## Пользовательский editor

Для сложного представления используйте `Editable` с вариантами `default` и
`edit` либо вложенный Component, который объявляет вариант `edit`. Компонент
editor-а должен опубликовать `edited`; host завершит ту же edit session и
передаст нормализованный payload родителю.

## Полный путь изменения данных

```text
editor commit
  → semantic edited Event
  → Component SFC event boundary
  → Composition routing
  → Store-owned Update
  → изменение Store
  → новая DataView/props-проекция
  → повторный render Table
```

`Table` и editor не должны мутировать объект `row` напрямую. Если Event
публикуется, но Store/Update не изменён, следующий render вернёт исходное
значение.

Используйте `rowKey`, а не `rowIndex`, для выбора записи Store. Это особенно
важно при сортировке, виртуализации и числовых identifiers.
