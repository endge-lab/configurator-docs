# Scheduler и frame phases

Фазы кадра и связь scheduler с invalidation.

## Практическая схема

- Документация: NovaAdvanced.
- Раздел: Render pipeline.
- Тема страницы: Scheduler и frame phases.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-render-pipeline" layout="tabs"
:::

## Как применять

Используйте страницу как короткую рабочую заметку: сначала определите границу ответственности, затем откройте пример и сравните TypeScript-реализацию с DSL-описанием. Runtime-код остается в Nova-слое, а Vue отвечает только за mount, layout shell и cleanup.
