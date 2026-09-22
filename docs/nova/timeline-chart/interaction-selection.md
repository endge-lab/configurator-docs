# Selection

Selection может быть пользовательским через `options.selection` и программным через ref API. Единый механизм работает для `task`, `point` и `link`.

:::example id="timeline-chart-api-updates" layout="tabs"
:::

## Практика

По умолчанию пользовательское выделение работает как single-select: обычный click выбирает только один `task`, `point` или `link`, а выбор сущности другого типа очищает предыдущую. Это задается дефолтным `selectionScope: 'exclusive'` и единственным rule `select-only`.

```ts
const options = {
  selectionScope: 'exclusive',
  selection: [
    { enabled: true, mode: ['single'], trigger: ['click'], target: ['task', 'point', 'link'], handler: ['select-only'] },
  ],
}
```

Для multi-select его нужно включить явно: добавьте rule с `Meta`/`Ctrl` и `toggle` или используйте ref API с `clearPrevious: false`.

```ts
const options = {
  selectionScope: 'exclusive',
  selection: [
    { enabled: true, mode: ['single'], trigger: ['click'], target: ['task', 'point', 'link'], handler: ['select-only'] },
    { enabled: true, mode: ['Meta', 'Ctrl'], trigger: ['click'], target: ['task', 'point', 'link'], handler: ['toggle'] },
  ],
}
```

`selectionScope='exclusive'` очищает task selection при выборе point/link и наоборот. `selectionScope='mixed'` разрешает смешанное выделение разных типов, но не включает multi-select само по себе: набор операций по-прежнему задает `options.selection`.

```ts
timeline.value?.selectTasks(['task-1'])
timeline.value?.selectPoints(['point-1'], { clearPrevious: false })
timeline.value?.selectLinks(['link-1'], { clearPrevious: false })
timeline.value?.selectAnnotations({ points: ['point-2'], links: ['link-2'] })

const points = timeline.value?.getSelectedPoints()
const links = timeline.value?.getSelectedLinks()
```
