# Ordered schema

Стабильный порядок schema-элементов перед backend replay.

## Практическая схема

- Документация: NovaAdvanced.
- Раздел: Render pipeline.
- Тема страницы: Ordered schema.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-render-pipeline" layout="tabs"
:::

## Как применять

Используйте страницу как короткую рабочую заметку: сначала определите границу ответственности, затем откройте пример и сравните TypeScript-реализацию с DSL-описанием. Runtime-код остается в Nova-слое, а Vue отвечает только за mount, layout shell и cleanup.
