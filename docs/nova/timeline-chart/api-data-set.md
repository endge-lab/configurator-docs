# data

`data(snapshot)` полностью заменяет root data.

:::example id="timeline-chart-api-updates" layout="tabs"
:::

## Когда использовать

Используйте полную замену после refetch, смены фильтра на сервере или перехода на другой dataset. Для точечных изменений лучше подходят `add`, `update`, `remove`.
