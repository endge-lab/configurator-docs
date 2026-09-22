# Tooltip content

Содержимое tooltip без смешивания overlay lifecycle и business state.

## Практическая схема

- Документация: NovaUIKit.
- Раздел: Текст и display.
- Тема страницы: Tooltip content.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-prime-components" layout="tabs"
:::

## Как применять

Используйте страницу как короткую рабочую заметку: сначала определите границу ответственности, затем откройте пример и сравните TypeScript-реализацию с DSL-описанием. Runtime-код остается в Nova-слое, а Vue отвечает только за mount, layout shell и cleanup.
