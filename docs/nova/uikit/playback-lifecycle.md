# Playback lifecycle

play, loop, dedupe, cooldown и cleanup sound handles.

## Практическая схема

- Документация: NovaUIKit.
- Раздел: Motion и Sound.
- Тема страницы: Playback lifecycle.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-sound-mixer" layout="tabs"
:::

:::contract id="nova-sound-play-options"
:::

## Как применять

Используйте страницу как короткую рабочую заметку: сначала определите границу ответственности, затем откройте пример и сравните TypeScript-реализацию с DSL-описанием. Runtime-код остается в Nova-слое, а Vue отвечает только за mount, layout shell и cleanup.
