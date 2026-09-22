# Propagation и порядок выполнения

Propagation определяет, какие ноды local tree становятся dirty вместе с исходной нодой.

## Режимы

| Значение | Поведение |
| --- | --- |
| `RaphPropagation.None` | Только текущая нода |
| `RaphPropagation.Down` | Текущая нода и descendants |
| `RaphPropagation.Up` | Текущая нода и ancestors |

Пример inherited visibility:

```ts
@RaphProperty({
  phase: 'layout',
  default: true,
  propagation: RaphPropagation.Down,
})
visible!: boolean
```

Изменение visibility родителя помечает layout descendants dirty. Default compute для `Down` объединяет локальное значение с вычисленным значением parent.

## Направление одной phase

Runtime выводит traversal local phase из её properties:

1. `mode: 'all'` → `all`;
2. хотя бы один `Down` → `dirty-and-down`;
3. иначе хотя бы один `Up` → `dirty-and-up`;
4. иначе → `dirty-only`.

Не смешивайте `Down` и `Up` properties в одной phase: текущий выбор отдаёт приоритет downward traversal. Разделите их на разные phases с явным назначением.

## Дедупликация

Несколько записей в одну пару `node + phase` до `run()` создают одну dirty entry. Связанные events могут накапливаться, а processor получает актуальные local values на момент выполнения.

## Priority strategies

Обычный runtime использует `depth-weight-desc`:

- меньшая graph depth выполняется раньше;
- внутри одной depth больший `weight` выполняется раньше.

`Raph.configureLocal` переключает runtime на `legacy-depth-weight-asc`:

- меньшая depth выполняется раньше;
- внутри одной depth меньший `weight` выполняется раньше.

Legacy strategy сохраняет порядок старого instant runtime. Не используйте знак `weight` как переносимый контракт между разными priority strategies.

## Порядок phases и properties

- decorated local phases сортируются по `priority` по возрастанию;
- properties внутри phase сортируются по `dependsOn`;
- ноды внутри phase сортируются согласно выбранной runtime priority strategy.

Если порядок выражает реальную dependency, фиксируйте её через `dependsOn`, graph edge или отдельную phase, а не только через случайно подобранный `weight`.

