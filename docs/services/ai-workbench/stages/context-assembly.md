# 5. Сборка контекста

> Статус: реализовано в Workbench v0.6.0. Общая схема находится в разделе [«AI Workbench: подготовка данных»](../data-preparation.md).

Цель этапа — доказать, что каждая задача имеет достаточно данных, а затем собрать единый `ModelRequest`. Сборка не меняет план и не перезапускает retrieval.

## Вход сборщика

Сборщик получает валидный `TaskPlan`, разрешённые source blocks и ограниченное окно сообщений. Состояние Interaction остаётся в persistence и не копируется в отдельную каноническую модель контекста.

## Context Adequacy Gate

Для каждой задачи gate проверяет:

| Проверка | Условие успеха |
|---|---|
| Intent | Intent поддержан текущим registry. |
| Context | Для каждой domain/documentation задачи создан хотя бы один подтверждённый block. |
| Snapshot | Ранее разрешённый identity повторно ищется, если изменился snapshot hash. |
| Budget | Mandatory blocks помещаются в контекст. |

Непройденная проверка не заменяется предположением модели. Gate переводит Interaction в `awaiting_clarification` или в явную ошибку.

## Приоритеты бюджета

Сначала помещаются mandatory blocks, затем остальные blocks по убыванию lexical score. System contract, исходный запрос, план и ограниченное окно истории добавляются самим prompt template вокруг выбранных blocks.

Точно разрешённая цель не может быть вытеснена более длинным, но менее релевантным блоком.

## Дедупликация

Повторные documentation chunks дедуплицируются по `chunkId`, domain candidates — по паре `documentType + identity`. Семантически похожие, но разные blocks не склеиваются.

## ModelRequest

```json
{
  "request": "...",
  "plan": { "tasks": [] },
  "context": [],
  "conversation": [],
  "workspace": {
    "generation": "18",
    "snapshotSha256": "..."
  }
}
```

JSON сначала сериализуется стандартным encoder, затем подставляется в строгий embedded template. Итоговый prompt не становится source of truth: его можно воспроизвести из payload и версии prompt catalog.

Следующий этап: [«Генерация и проверка»](./generation-and-validation.md).
