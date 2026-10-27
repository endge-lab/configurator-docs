---
description: "Оглавление справочника Endge: Source каждого типа документа, домен, выражения, компоненты и таблицы SFC, EndgeCSS, контракты пакетов и коды ошибок."
---

# Справочник

Справочник отвечает на вопрос «как это записать точно». Задачи по шагам — в [руководствах](/guides/), работа через HTTP API и MCP — в разделе [API и агенты](/agents/).

## С чего начать

| Страница | Когда открывать |
| --- | --- |
| [Матрица возможностей](/reference/capabilities) | Проверить, что документ сохраняется, компилируется и исполняется |
| [Сущности Endge](/domain/entities) | Понять, какие типы документов есть и как они связаны |
| [Общий контракт field](/reference/field-contracts) | Объявить поле в любом авторском Source |

## Source по типам документов

| Группа | Типы документов |
| --- | --- |
| Данные | [Type](/reference/type), [Query](/reference/query), [Stream](/reference/stream), [Store](/reference/store), [Update](/reference/update), [Converter](/reference/converter), [Computation](/reference/computation), [DataView](/reference/data-view), [Filter](/reference/filter), [Mock data](/reference/mock), [Vocab](/reference/vocab) |
| Интерфейс и сценарии | [Component SFC](/reference/component-sfc), [SFC script](/reference/sfc-script), [Composition](/reference/composition), [Composition event hooks](/reference/composition-events), [Action](/reference/action), [Operation History](/reference/operation-history), [Simulation](/reference/simulation) |
| Настройка и доступ | [Configuration](/reference/configuration), [I18n Bundle](/reference/i18n-bundle), [AuthProfile](/reference/auth-profile), [Metadata](/reference/metadata) |

## Домен

[Сущности](/domain/entities), [связи сущностей](/domain/relations) и [жизненный цикл документа](/domain/lifecycle).

## Выражения

- [Функциональные выражения](/reference/value-expressions) — общий язык значений Source.
- [Выражения Component SFC](/reference/sfc-expressions) — выражения в template компонента.
- [Каталог функций и arity](/reference/language-catalog) — функции языка, извлечённые из compiler.

## Интерфейс

- [Компоненты SFC](/domain/components/) — встроенные теги, общие атрибуты и события.
- [Таблицы SFC](/sfc-tables/) — данные, сортировка, выбор, меню, редактирование и состояние таблиц.
- [EndgeCSS](/reference/endgecss/overview) — синтаксис, селекторы, темы и стили компонентов.

## Контракты и ошибки

- [Контракты API пакетов](/reference/contracts/) — TypeScript-контракты Core, UI Vue, Utils, Computation Sandbox и Federation, собранные из исходников.
- [Коды ошибок](/agents/errors) — все коды Service Backend с причинами и действиями (раздел «API и агенты»).
- [Raph в Endge](/reference/raph) — пути данных, реактивность Store и версия Raph; точные типы — [контракты Raph](/raph/contracts/).
