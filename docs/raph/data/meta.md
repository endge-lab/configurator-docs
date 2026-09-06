# Raph Meta

Meta-plane хранит произвольную пользовательскую metadata отдельно от обычных
данных Raph. Metadata привязана к существующему `DataPath`, но не попадает в
`Raph.data`, Store snapshots, DataView и derived graph.

```ts
Raph.set('sandboxItems[id=42].flightCarrier', 'SU')

Raph.meta.set(
  'sandboxItems[id=$id].flightCarrier',
  'aodb.optimistic',
  {
    status: 'waiting',
    optimisticValue: 'SU',
    previousValue: 'LH',
  },
  { vars: { id: 42 } },
)
```

## API

```ts
Raph.meta.get(path, namespace?, options?)
Raph.meta.has(path, namespace?, options?)
Raph.meta.set(path, namespace, value, options?)
Raph.meta.merge(path, namespace, value, options?)
Raph.meta.delete(path, namespace?, options?)
Raph.meta.watch(pathOrMask, callback, options?)
```

Без namespace `get` возвращает объект namespaces exact path. `set` и `merge`
требуют непустой namespace. Wildcard разрешён в `watch`, но запрещён в writes.

Meta можно записать только для существующего data owner. Путь со значением
`undefined` существует; это проверяет `Raph.has(path)`. Удаление data path
каскадно удаляет Meta поддерева, а замена parent удаляет metadata только у
исчезнувших descendants.

## Реактивность

Data observers не получают Meta events, Meta observers не запускают derived
graph. В одной `Raph.transaction` оба слоя доставляются согласованно, и каждый
затронутый runtime инвалидируется один раз.

Meta привязана к адресу. Для коллекций предпочтителен стабильный selector
`rows[id=$id]`; `rows[3]` описывает позицию и после перестановки может относиться
к другой записи.

## Чтение в Component SFC

Component SFC не получает `Raph` и физические пути напрямую. Read-only фасад
`$data.metaOf(reference, namespace?)` восстанавливает путь по provenance
входного prop и подписывает runtime на Meta-plane:

```vue
<Badge
  v-if="$data.metaOf(row.flightCarrier, 'aodb.optimistic')?.status === 'waiting'"
  tone="warning"
>
  Ожидает подтверждения
</Badge>
```

Без namespace метод возвращает объект всех namespaces exact path. Подробнее об
области видимости и допустимых ссылках: [контекстные переменные Component SFC](/sfc-tables/context-variables#метаданные-входных-данных).
