# Overlay layer

Единый слой overlay без владения business state.

## Практическая схема

- Документация: NovaUIKit.
- Раздел: Scroll и overlay.
- Тема страницы: Overlay layer.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-prime-components" layout="tabs"
:::

## Как применять

Используйте страницу как короткую рабочую заметку: сначала определите границу ответственности, затем откройте пример и сравните TypeScript-реализацию с DSL-описанием. Runtime-код остается в Nova-слое, а Vue отвечает только за mount, layout shell и cleanup.
