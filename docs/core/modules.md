# Модули Endge

Модули `Endge.*` — публичные точки доступа к подсистемам ядра. Они не совпадают с виджетами конфигуратора и сущностями домена.

## Контекст и конфигурация

| Модуль | Назначение |
| --- | --- |
| `Endge.context` | Текущий проект, окружение и locale runtime |
| `Endge.workspace.variables` | Переменные рабочего пространства и их разрешение для окружения |
| `Endge.auth` | Профили и runtime-контекст авторизации |

## Домен и схема

| Модуль | Назначение |
| --- | --- |
| `Endge.domain` | Коллекции доменных документов, поиск и обход сущностей |
| `Endge.schema` | Загрузка, сохранение и преобразование схемы |
| `Endge.vocabs` | Словари и общие перечисления домена |

## Компиляция и исполнение

| Модуль | Назначение |
| --- | --- |
| `Endge.compiler` | Компиляция source в program artifacts |
| `Endge.program` | Доступ к скомпилированным контрактам |
| `Endge.runtime` | Создание и управление живыми runtime-host |
| `Endge.runtime.query` | Исполнение Query program |
| `Endge.runtime.flow` | Исполнение action flow |

## Связи и коммуникация

| Модуль | Назначение |
| --- | --- |
| `Endge.bind` | Локальные реализации Converter, Computation и других открытых контрактов |
| `Endge.events` | Доставка runtime-событий подписчикам из кода |
| `Endge.updates` | Применение обновлений данных и конфигурации |
| `Endge.sse` | Получение серверных событий |

## Диагностика и UI

| Модуль | Назначение |
| --- | --- |
| `Endge.diagnostics` | Logs, exceptions, completed spans, bounded storage, subscriptions и adapter routes |
| `Endge.runtimeDebugger` | Отдельный inspection tool для runtime-host, вкладок и реактивного графа |
| `Endge.ui` | Registry UI-примитивов и presentation adapters |
| `Endge.styles` | Компиляция и исполнение EndgeCSS |

## Правило границы

Модуль предоставляет механизм. Документ домена хранит конфигурацию этого механизма, а runtime-host исполняет конкретную программу. Не следует переносить runtime-состояние в `Endge.domain` или делать UI-виджет публичным API ядра.
