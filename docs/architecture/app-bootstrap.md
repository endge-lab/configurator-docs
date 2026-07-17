# Bootstrap приложения

Bootstrap собирает платформенные модули, домен, runtime и presentation в работающий экземпляр приложения.

## AppCore

AppCore — application-level orchestrator. Он определяет порядок инициализации, хранит handles подключённых модулей и управляет остановкой приложения. AppCore не должен повторять реализации `Endge.domain`, compiler или runtime.

## Рекомендуемый порядок запуска

1. создать application context;
2. установить обязательные модули ядра;
3. загрузить configuration и environment;
4. загрузить домен и проверить schema;
5. зарегистрировать local bindings;
6. скомпилировать необходимые entry artifacts;
7. создать runtime hosts;
8. подключить presentation adapter;
9. открыть приложение для пользователя.

## EndgeVue

EndgeVue подключает Vue presentation: регистрирует plugin, UI primitives и renderer-specific materializers. Он не должен становиться обязательной зависимостью headless runtime.

## Остановка

Dispose выполняется в обратном порядке: UI unmount, runtime hosts, bindings, integrations и module handles. Корректная остановка так же важна, как bootstrap, особенно для повторного монтажа и разработки с hot reload.
