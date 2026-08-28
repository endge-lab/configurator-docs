# 5. Сборка контекста

> Статус: целевой контракт этапа. Общая схема находится в разделе [«AI Workbench: подготовка данных»](../data-preparation.md).

Цель этапа — доказать, что каждая задача имеет достаточно данных, а затем собрать единый `ModelRequest`. Сборка не меняет план и не перезапускает retrieval.

## Resolved Interaction Context

Каноническое состояние перед сборкой:

```json
{
  "interactionId": "interaction-42",
  "planVersion": 4,
  "originalMessageIds": ["message-10"],
  "tasks": [],
  "clarifications": [
    {
      "clarificationId": "clarification-7",
      "questionMessageId": "message-11",
      "answerMessageId": "message-12",
      "resolvedTaskId": "t1"
    }
  ],
  "resolvedEntities": [],
  "documentationFragments": [],
  "domainRelations": [],
  "unresolvedSlots": []
}
```

Эта структура — производная проекция. Исходные messages, plan versions и source blocks остаются отдельными проверяемыми записями.

## Context Adequacy Gate

Для каждой задачи gate проверяет:

| Проверка | Условие успеха |
|---|---|
| Intent | Intent поддержан текущим registry. |
| Dependencies | Все `dependsOn` завершены. |
| Entities | Все обязательные mentions разрешены. |
| Documentation | Найдены фрагменты для обязательных documentation aspects. |
| Relations | Включены запрошенные связи домена. |
| Snapshot | Все identity перепроверены по текущему snapshot. |
| Budget | Mandatory blocks помещаются в контекст. |

Непройденная проверка не заменяется предположением модели. Gate переводит Interaction в `awaiting_clarification` или в явную ошибку.

## Приоритеты бюджета

Блоки добавляются в порядке:

1. system contract и инварианты;
2. исходный запрос и валидный план;
3. mandatory целевые сущности;
4. обязательные доменные связи;
5. точные фрагменты документации;
6. цепочка уточнений;
7. дополнительные фрагменты;
8. окно общей истории.

Точно разрешённая цель не может быть вытеснена более длинным, но менее релевантным блоком.

## Дедупликация

Блоки с одинаковым source key и content hash объединяются. Объединённый блок сохраняет все `taskIds` и максимальный priority. Похожие, но не идентичные блоки не склеиваются без явного summarization contract.

## ModelRequest

```json
{
  "requestId": "...",
  "interaction": {
    "id": "interaction-42",
    "planVersion": 4,
    "originalRequest": "...",
    "tasks": [],
    "clarifications": []
  },
  "context": {
    "workspace": {
      "generation": 18,
      "snapshotSha256": "..."
    },
    "resolvedEntities": [],
    "domainRelations": [],
    "documentationFragments": []
  },
  "answerRequirements": {
    "language": "ru",
    "citeEntityIdentities": true,
    "doNotInventMissingData": true
  }
}
```

Единый текстовый prompt может быть сформирован из этого контракта для adapter, но не становится source of truth. Его всегда можно воспроизвести из `ModelRequest`.

Следующий этап: [«Генерация и проверка»](./generation-and-validation.md).
