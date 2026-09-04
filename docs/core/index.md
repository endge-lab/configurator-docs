# Endge Core

`@endge/core` — конкретная реализация ядра платформы Endge. Package собирает
собственную Federation, предоставляет доменную модель и открывает публичные
подсистемы через статический facade `Endge.*`.

Core использует общий [Federation framework](/federation/), но не определяет его
архитектуру для всех приложений. Другие packages могут создавать собственные
Federations и Modules, не становясь частью Core.

## Что входит в Core

- [Modules Core](./modules) — публичные подсистемы `Endge.*`;
- [события и обновления](./events-and-updates) — границы runtime-коммуникации;
- [диагностика и отладка](./diagnostics-and-debugging) — наблюдаемость и inspection API;
- [домен Endge](/domain/entities) — документы и связи, исполняемые платформой.

## Где начинать

Если вы используете готовое ядро, начните со списка [Modules Core](./modules).
Если вы создаёте новый package или приложение вокруг собственного lifecycle,
перейдите к разделу [Federation](/federation/).
