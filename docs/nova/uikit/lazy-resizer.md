# LazyResizer

Deferred resize updates без лишних layout пересчетов.

## Практическая схема

- Документация: NovaUIKit.
- Раздел: Resizer primitives.
- Тема страницы: LazyResizer.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-resizable-workspace" layout="tabs"
:::

:::contract id="nova-ui-kit-lazy-resizer"
:::

## Как применять

Используйте страницу как короткую рабочую заметку: сначала определите границу ответственности, затем откройте пример и сравните TypeScript-реализацию с DSL-описанием. Runtime-код остается в Nova-слое, а Vue отвечает только за mount, layout shell и cleanup.
