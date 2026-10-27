---
description: "Каталог публичных TypeScript-контрактов Endge Core, UI Vue, Utils, Federation и Raph из исходников: версии, точки входа и группы деклараций."
---

# Каталог контрактов из исходников

Справочник фиксирует публичные exports и декларации текущего source. Код пакетов не выполняется. Версия, Git revision, hash входов и peer dependencies указаны в [manifest](/contracts-manifest.json). Эти данные описывают локальный source snapshot; они не подтверждают публикацию соответствующего commit в публичном repository.

Декларации ниже — TypeScript API библиотек. Это **не** авторский Source (`defineQuery`, `defineStore` и т. п.) и **не** JSON DTO backend. Авторские языки описаны в [маршруте агента](/agents/authoring), HTTP DTO — в [API](/llms-full/api.txt). Private members и комментарии реализации удалены. Protected members предназначены для наследования; подчёркнутые служебные hooks не следует вызывать из обычного consumer. Имена импортируемых вспомогательных типов разрешаются в указанном исходном модуле.

Наличие export не обещает capability конкретного renderer или backend. Для таких ограничений используйте [матрицу возможностей](/reference/capabilities).

- [@endge/core 1.0.0-dev.11](/reference/contracts/core/) — 1553 exports, 29 групп контрактов.
- [@endge/ui-vue 1.0.0-dev.10](/reference/contracts/ui-vue/) — 145 exports, 7 групп контрактов.
- [@endge/utils 1.0.0-dev.6](/reference/contracts/utils/) — 125 exports, 10 групп контрактов.
- [@endge/computation-sandbox 1.0.0-dev.7](/reference/contracts/computation-sandbox/) — 4 exports, 3 групп контрактов.
- [@typedworks/federation 1.0.0-dev.1](/reference/contracts/federation/) — 36 exports, 7 групп контрактов.
- [@raphy-js/raph 1.0.1-dev.54](/raph/contracts/) — 488 exports, 8 групп контрактов.
