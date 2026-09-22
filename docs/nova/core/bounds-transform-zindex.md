# Bounds, transform и zIndex

Как размеры, transform и zIndex влияют на render order и interaction.

## Практическая схема

- Документация: NovaCore.
- Раздел: Отрисовка.
- Тема страницы: Bounds, transform и zIndex.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-node-editor" layout="tabs"
:::

## Как применять

Используйте страницу как короткую рабочую заметку: сначала определите границу ответственности, затем откройте пример и сравните TypeScript-реализацию с DSL-описанием. Runtime-код остается в Nova-слое, а Vue отвечает только за mount, layout shell и cleanup.
