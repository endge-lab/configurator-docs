# Task template context

Schema profile получает `TimelineTask<G, T>`: исходную задачу в `item`, группу в `group`, runtime geometry и flags overlap/shadow.

:::example id="timeline-chart-task-profile" layout="tabs"
:::

## Основные поля

- `task.item` - исходная typed задача.
- `task.x/y/width/height` - рассчитанная геометрия.
- `task.group` - runtime-группа или `null`.
