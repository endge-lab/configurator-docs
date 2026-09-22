# Lifecycle

Mount, update, dirty и cleanup для UI Kit primitives.

## Практическая схема

- Документация: NovaUIKit.
- Раздел: Основы.
- Тема страницы: Lifecycle.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-scene-switcher" layout="tabs"
:::

## Как применять

Используйте страницу как короткую рабочую заметку: сначала определите границу ответственности, затем откройте пример и сравните TypeScript-реализацию с DSL-описанием. Runtime-код остается в Nova-слое, а Vue отвечает только за mount, layout shell и cleanup.
