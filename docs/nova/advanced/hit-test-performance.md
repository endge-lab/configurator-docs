# Hit-test performance

Как измерять candidates, misses и target resolution.

## Практическая схема

- Документация: NovaAdvanced.
- Раздел: Индексы и hit-test.
- Тема страницы: Hit-test performance.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-input-diagnostics" layout="tabs"
:::

## Как применять

Используйте страницу как короткую рабочую заметку: сначала определите границу ответственности, затем откройте пример и сравните TypeScript-реализацию с DSL-описанием. Runtime-код остается в Nova-слое, а Vue отвечает только за mount, layout shell и cleanup.
