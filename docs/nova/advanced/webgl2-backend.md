# WebGL2 backend

WebGL2 batching, resources и limitations.

## Практическая схема

- Документация: NovaAdvanced.
- Раздел: Renderer backend.
- Тема страницы: WebGL2 backend.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-hybrid-webgl" layout="tabs"
:::

## Как применять

Используйте страницу как короткую рабочую заметку: сначала определите границу ответственности, затем откройте пример и сравните TypeScript-реализацию с DSL-описанием. Runtime-код остается в Nova-слое, а Vue отвечает только за mount, layout shell и cleanup.
