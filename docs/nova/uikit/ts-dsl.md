# TypeScript и DSL

Как описывать UI Kit components через TypeScript schema или `.nova` template.

## Практическая схема

- Документация: NovaUIKit.
- Раздел: Начало.
- Тема страницы: TypeScript и DSL.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-sfc-compiler" layout="tabs"
:::

## Как применять

Используйте страницу как короткую рабочую заметку: сначала определите границу ответственности, затем откройте пример и сравните TypeScript-реализацию с DSL-описанием. Runtime-код остается в Nova-слое, а Vue отвечает только за mount, layout shell и cleanup.
