---
description: "Где искать точный контракт: истина при расхождении документации и сервера, публичные и закрытые исходники, маршрут по Core и загрузка llms-файлов."
---

# Репозитории и поиск точного контракта

Начните с [маршрута автора](/agents/authoring): текст Source, HTTP DTO, compiled IR и библиотечный TypeScript API имеют разные грамматики. Для точной сигнатуры используйте [каталог контрактов](/reference/contracts/); версии исходников и hash записаны в [contracts-manifest.json](/contracts-manifest.json).

## Истина при расхождении {#source-of-truth}

Если документация и поведение сервера расходятся, истина — **исходники той версии, что развёрнута**. Документация описывает свой snapshot и может отставать или опережать стенд.

1. Узнайте версию. Backend: `GET /version` (поле `version`, без авторизации). Configurator: версия показана в его интерфейсе. Версия npm-пакета — в `package.json` проекта или `contracts-manifest.json` этого сайта.
2. Откройте исходники этой версии: тег `v<версия>` в публичном repository, например `https://github.com/endge-lab/service-backend/tree/v0.16.1`. У npm-пакетов `@endge/*` теги есть.
3. Нет тега — смотрите ветку `main` и явно оговорите пользователю, что `main` может быть новее развёрнутой версии.
4. Исходники закрыты (Raph, Federation, Mock Generator) — сверяйтесь с [точными контрактами](/reference/contracts/) этого сайта и `.d.ts` опубликованного npm-пакета `https://unpkg.com/<пакет>@<версия>/`.

## Публичные repositories

| Repository | Что искать |
| --- | --- |
| [Service Backend](https://github.com/endge-lab/service-backend) | HTTP/MCP API, persistence, revisions, access control, commits/releases/builds, OpenAPI (`docs/openapi3.yaml`), каталог ошибок (`docs/error-codes.yaml`) |
| [Configurator](https://github.com/endge-lab/configurator) | Редакторы, preview, visual authoring, API adapters и работа с сохранёнными документами |
| [Configurator Docs](https://github.com/endge-lab/configurator-docs) | Этот сайт, исходники страниц и генераторы LLM/reference |
| [Core](https://github.com/endge-lab/core) | Source parsers, compiler/linker, Domain entities, Program artifacts, runtime hosts, data ownership, facade Endge |
| [UI Vue](https://github.com/endge-lab/ui-vue) | Публичный renderer `vue-native`, SFC tags, таблицы, FilterView, интеграция с Vue |
| [Utils](https://github.com/endge-lab/utils) | Общие utilities, сериализация и вспомогательные типы |
| [Computation Sandbox](https://github.com/endge-lab/computation-sandbox) | Ограниченное выполнение вычислительных выражений |
| [Service Kit Go](https://github.com/endge-lab/service-kit-go) | Общая инфраструктура Go-сервисов |

## Закрытые исходники

| Компонент | Canonical repository | Где проверять контракт |
| --- | --- | --- |
| Raph (`@raphy-js/raph`) | `gitlab.com/raphyjs/raphy-js-raph` — закрыт | [Контракты Raph](/raph/contracts/), [раздел Raph](/raph/), `.d.ts` в `https://unpkg.com/@raphy-js/raph@<версия>/` |
| TypedWorks Federation (`@typedworks/federation`) | `gitlab.com/typedworks/typedworks-federation` — закрыт | [Контракты Federation](/reference/contracts/federation/), `.d.ts` в `https://unpkg.com/@typedworks/federation@<версия>/` |
| Mock Generator | закрыт, публичной копии нет | HTTP API backend `/api/v1/mock-data/*` ([Mock data](/services/mock-data)) |

Ссылки на закрытый GitLab ведут на страницу входа: не пытайтесь их открыть. Версию пакета берите из `package.json` проекта или [contracts-manifest.json](/contracts-manifest.json).

Ссылки ведут на canonical repositories из package manifests и service module paths. Snapshot этого сайта может описывать более новый локальный source: перед переносом кода сопоставьте installed version, revision и peer dependencies. Сайт не подтверждает публикацию локального commit.

## Маршрут по исходникам Core

Базовый путь — `src/features/core/modules/`:

| Вопрос | Владеющий source |
| --- | --- |
| Сохраняется ли документ и исполняется ли он | `domain/documents/domain-document-descriptors.ts` |
| Какие document types существуют | `domain/types/document/document.types.ts` |
| Какая грамматика Source допустима | `source/services/compilers/<kind>-source-compile.ts` |
| Общие выражения и arity | `source/services/compilers/source-expression-compile.ts` |
| Контракт field/default/options | `source/services/compilers/source-field-compile.ts` |
| SFC parser, macros, выражения и порты | `compiler/services/component-sfc/` |
| Связаны ли внешние identities и outputs | `compiler/` и `program/` |
| Что происходит при mount/activate/pause/dispose | `runtime/hosts/` |
| Формат data write и Update | `runtime/` и `source/services/compilers/update-source-compile.ts` |
| Источник defaults для нового документа | `source/templates/` и Domain descriptor |

В backend начните с `docs/openapi3.yaml`, затем найдите HTTP resource в `internal/api/http/v1/`, usecase и port. Наличие UI editor или класса `R*` само по себе не доказывает поддержку backend collection.

## Как не потерять контекст при загрузке LLM-файлов

`llms.txt` — маршрут и оглавление: у каждой ссылки есть описание и оценка размера, а раздел `## Optional` можно пропустить. Порядок загрузки при ограниченном context window:

1. [llms-agent.txt](/llms-agent.txt) — ядро для типовой работы через API или MCP (не больше 60 тыс. токенов): это руководство, токены, MCP, сценарии, компактные коды ошибок, авторинг, capability matrix и все HTTP-операции без схем.
2. Схемы нужной операции — файл её группы `llms-full/api/<группа>.txt`; список групп и всех операций — [llms-full/api.txt](/llms-full/api.txt).
3. Авторский Source типа документа — часть справочника `llms-full/reference/<тип>.txt` (оглавление — [llms-full/reference.txt](/llms-full/reference.txt)), затем при необходимости соответствующие contracts.
4. Отдельная страница — её Markdown-версия: тот же адрес с `.md` (на сайте — кнопка «Открыть как Markdown»).

`llms-full.txt` содержит полный публичный каталог и HTTP API одним файлом. [llms-manifest.json](/llms-manifest.json) фиксирует fingerprint документации и OpenAPI, а также перечисляет все llms-файлы с размером в байтах, оценкой токенов и назначением. Оценка: символы кириллицы / 2,5 + остальные символы / 3,5; она намеренно завышена относительно реальных токенизаторов. Knowledge Bundle собирается из того же публичного каталога; manifest связывает его с contract snapshot.
