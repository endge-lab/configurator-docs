# NovaApp

Главный runtime-контейнер: canvas, scheduler, input, surfaces и lifecycle.

## Практическая схема

- Документация: NovaCore.
- Раздел: Основные понятия.
- Тема страницы: NovaApp.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-app-cockpit" layout="tabs"
:::

:::contract id="nova-app-create-options"
:::

## Как применять

Используйте страницу как короткую рабочую заметку: сначала определите границу ответственности, затем откройте пример и сравните TypeScript-реализацию с DSL-описанием. Runtime-код остается в Nova-слое, а Vue отвечает только за mount, layout shell и cleanup.
