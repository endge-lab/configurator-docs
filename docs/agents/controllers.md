---
description: "Прямой маршрут агента: Controllers SDK/providers и скользящее окно cursor/offset, точные source версии, примеры и проверка."
---

# Controllers и скользящее окно: маршрут агента

Для примеров используйте Core `1.2.0-dev.15`, UI Vue `2.0.0-dev.14` и Configurator `2.15.0`. Выбирайте точные версии пакетов: тег `latest` может указывать на прежний контракт, а широкий semver-диапазон может выбрать историческую Core `1.2.13` без Controllers.

1. Для модели providers/instances/lifecycle читайте [Controllers](/reference/controllers.md). Там полный code-owned SDK example с реальным зарегистрированным owner; provider callbacks получают generation-bound context. Не удерживайте factory context.
2. Для server scroll читайте [collection-window](/guides/collection-window.md). Там полный Store + CAS Update + Query + SFC + Composition для cursor и offset/limit. Controller не является Domain document; нет POST /controllers, root windows и произвольного Controller JS в Source.
3. Для точных сигнатур — [runtime declarations](/reference/contracts/core/runtime.md), [Compiler](/reference/contracts/core/compiler.md), [Program](/reference/contracts/core/program.md). Для проблем — [Controller/window diagnostics](/reference/controller-errors.md), HTTP ошибки backend [отдельно](/agents/errors.md).
4. Скачайте [workspace.json](/examples/controllers/workspace.json), [source-window.mjs](/examples/controllers/source-window.mjs), [sdk-controller.mjs](/examples/controllers/sdk-controller.mjs), [load-core.mjs](/examples/controllers/load-core.mjs), [mock-api.mjs](/examples/controllers/mock-api.mjs) в одну папку. В checkout docs они уже лежат в `docs/public/examples/controllers`. Запустите оба runtime exercises с `--core /path/to/built/core`. Source exercise сам запускает local mock; реальный внешний API не требуется.
5. Не смешивайте ограничения: virtual ограничивает DOM, window удерживает blocks в Store, дополнительный cache включается через `load.cache` и имеет отдельные бюджеты. Retained rows и коридор viewport делают cap мягким. Dirty editor требует retain/release от приложения. Server filter/order, глобальный scrollbar и remote seek не добавляются автоматически.

Для старых опубликованных версий используйте [ручной Action/Query paging](/sfc-tables/server-paging.md); он не обещает Controller concurrency/retention. После работы сообщите отдельно compilation, execution, renderer check и release/delivery status.

Для retrieval доступны [Knowledge manifest](/knowledge/manifest.json) и `documents.jsonl` по адресу из manifest; это тот же публичный корпус, что Markdown/llms, с source provenance. Компактный маршрут выше позволяет сначала прочитать две нужные страницы, не загружая весь dump.


## Retention и кэш страниц

В Core `1.2.0-dev.15` доступны `retention`, `load.cache`, memory/IndexedDB, три политики обновления, `refreshPending`, `refresh` и `clearCache`. [Полный контракт и SDK](/guides/collection-window-cache.md). Кэш страниц не является persistence Store. Для исполнения: `node docs/public/examples/controllers/page-cache.mjs --core /path/to/built/core`; IndexedDB после reload проверяется в браузере.
