# Select

`Select` отображает одиночный или множественный выбор из `SourceFieldOption[]`.

```vue
<Select
  :value="status"
  :options="statusOptions"
  placeholder="Status"
/>

<Select
  multiple
  :value="airlines"
  :options="vocab('airlines', {
    valuePath: 'code',
    labelPath: 'description',
  })"
/>
```

```ts
type SourceFieldOption = {
  value: string | number | boolean
  label?: string
}
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `value` / `:value` | scalar/scalar[]/expression | Selected value или массив для `multiple`. |
| `options` / `:options` | `SourceFieldOption[]`/expression | Доступные варианты. |
| `multiple` | boolean | Multiple selection. |
| `placeholder` | string | Placeholder одиночного режима. |
| `searchable` | boolean | Явно показать или скрыть строку поиска. |
| `virtualized` | boolean | Явно включить или отключить виртуальный список. |
| `readonly` | boolean | Metadata; native select не блокируется. |
| `disabled` | boolean | Disabled state. |

Во встроенных adapters списки длиннее 10 элементов автоматически получают
поиск и виртуализацию. Явный `searchable` переопределяет только видимость поиска;
для больших списков виртуализация остаётся включённой по умолчанию.

Generated Filter передаёт эти настройки из field metadata. Контракт и пример:
[Filter](/reference/filter#поиск-и-виртуализация-select) и
[Metadata поля](/reference/metadata#metadata-поля).

DOM values сравниваются через string normalization. Тег display-only и не
передаёт `change` обратно в runtime.

Статический массив options можно передать обычным prop-выражением. Для внешнего
справочника не нужно добавлять массив в `defineProps`: Composition предоставляет
Vocab alias, а встроенная функция `vocab(alias, mapping?)` возвращает
`SourceFieldOption[]` и реактивно обновляет Select после refresh кеша.

```ts
defineComposition({
  data: {
    airlines: vocab('catalog-airlines'),
  },

  runtimes: {
    card: component('schedule-card'),
  },
})
```

Подробнее: [Component SFC: справочники](/reference/component-sfc#справочники-vocab)
и [Справочники (Vocab)](/reference/vocab).
