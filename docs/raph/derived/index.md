# Производные данные

Derived API создаёт синхронную материализованную зависимость между двумя ветками shared store.

```ts
import { collectionByKey, Raph } from '@endge/raph'

const handle = Raph.derive({
  id: 'schedule-table',
  from: 'schedule.raw',
  to: 'schedule.table',
  strategy: collectionByKey('id'),
  compute: rows => rows.map(row => ({
    id: row.id,
    title: row.name,
  })),
})
```

Raph создаёт системную `RaphDerivedNode`, выполняет initial recompute и поддерживает target при последующих source mutations.

## Контракт

```ts
interface RaphDerivedOptions<TSource, TTarget> {
  id?: string
  from: DataPathDef
  to: DataPathDef
  strategy?: RaphDerivedStrategy
  compute: (source: TSource) => TTarget
  immediate?: boolean
  disposeTarget?: 'keep' | 'delete'
}
```

- `from` и `to` должны быть concrete paths без wildcard и неразрешённых variables;
- source и target не могут пересекаться;
- один target может иметь только одного активного writer;
- `compute` должен быть синхронным и не должен изменять store;
- target read-only, пока registration активна;
- одинаковые публичные `id` нельзя регистрировать повторно в одном kernel.

Если `strategy` не указана, используется полный пересчёт.

## Derived graph

Target одного derived может быть source другого:

```text
schedule.raw
    ↓
schedule.visible
    ↓
schedule.rows
```

Kernel строит отдельный dependency graph materializations и стабилизирует его в топологическом порядке. Циклические цепочки отклоняются при регистрации.

## Согласованность observers

При mutation kernel сначала доводит derived graph до стабильного состояния и только потом публикует source и target events обычным observers. Поэтому callback не должен видеть старый target рядом с уже обновлённым source.

## Где создаётся derived

- `Raph.derive(options)` — в default app;
- `runtime.derive(options)` — registration принадлежит конкретному runtime;
- фактический manager и data-store принадлежат shared kernel.

Уничтожение runtime освобождает созданные им registrations, но не затрагивает derived других runtime того же kernel.

