# Renderer fallback

Переходы между backend-ами и degradation rules.

## Практическая схема

- Документация: NovaAdvanced.
- Раздел: Renderer backend.
- Тема страницы: Renderer fallback.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-renderer-policy" layout="tabs"
:::

## Как применять

Используйте страницу как короткую рабочую заметку: сначала определите границу ответственности, затем откройте пример и сравните TypeScript-реализацию с DSL-описанием. Runtime-код остается в Nova-слое, а Vue отвечает только за mount, layout shell и cleanup.
