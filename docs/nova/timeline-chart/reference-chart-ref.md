# Types: TimelineChartRef

`TimelineChartRef<G, T>` совпадает с публичным `TimelineRootApi<G, T>`: `data`, `options`, `add`, `update`, `remove`, `batch`, `focusOnTask`, `selectTasks`, `selectPoints`, `selectLinks`, `selectAnnotations`, `clearSelection`, `refresh`, методы раскрытия групп.

Для вложенных групп доступны методы раскрытия:

```ts
timeline.value?.expandGroup('frontend')
timeline.value?.collapseGroup('frontend')
timeline.value?.toggleGroup('frontend')
timeline.value?.setGroupExpanded('frontend', true)

timeline.value?.expandGroupBranch('project')
timeline.value?.collapseGroupBranch('project')
```

Методы одной группы сохраняют состояние дочерних групп. Методы `*Branch` применяются рекурсивно ко всей ветке.

Для annotations доступны методы:

```ts
timeline.value?.selectPoints(['point-1'])
timeline.value?.unselectPoints(['point-1'])
timeline.value?.selectLinks(['link-1'], { clearPrevious: false })
timeline.value?.unselectLinks(['link-1'])
timeline.value?.selectAnnotations({ points: ['point-2'], links: ['link-2'] })
timeline.value?.clearSelection()

const selectedPoints = timeline.value?.getSelectedPoints()
const selectedLinks = timeline.value?.getSelectedLinks()
```
