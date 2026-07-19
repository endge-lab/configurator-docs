# Доменные и runtime-сущности

Доменный документ и runtime-сущность связаны, но не являются одним объектом.

## Доменная сущность

Она хранит identity, metadata и source. Документ можно загрузить, сравнить, версионировать и отредактировать без запуска приложения.

Effective domain также содержит read-only descriptors с provenance `builtin`,
`local` или `derived`. Они имеют стабильную ссылку `type + identity`, но не обязаны
иметь storage id. Только `origin.kind === 'storage'` участвует в Payload, export,
delete, rename и folder persistence. Generic resolved-entity index хранит такие
descriptors отдельно от persisted maps.

## Runtime-сущность

Это живой объект, у которого есть:

- `runtimeId`;
- тип и identity исходной сущности;
- compiled program;
- reactive node или другой runtime context;
- lifecycle `create → work → destroy`;
- собственные ресурсы, подписки и события.

Typed runtime hosts существуют для Query, Action, Filter, Composition, Store и ComponentSFC. Другие документы могут быть metadata или входами и не обязаны иметь отдельный host.

## Что не является runtime-сущностью

- EventContract — каталог допустимых событий;
- Binding — сохраняемая конфигурация реакции;
- editor model — временное состояние конфигуратора;
- ProgramArtifact — исполняемый контракт, но ещё не живой экземпляр.

Runtime implementation binding для Action не является persisted Binding-документом.
Это локальная связь semantic identity с загруженной TypeScript function. Она
исчезает вместе с application session и восстанавливается регистрацией кода.

## Правило владения

Каждый runtime-resource должен иметь владельца, который создаёт и освобождает его. Если подписка или Worker не привязаны к lifecycle host, система получает утечки и скрытое поведение.
