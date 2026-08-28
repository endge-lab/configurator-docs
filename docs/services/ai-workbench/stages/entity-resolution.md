# 3. Разрешение сущностей

> Статус: целевой контракт этапа. Общая схема находится в разделе [«AI Workbench: подготовка данных»](../data-preparation.md).

Цель resolver — связать текстовое упоминание с конкретным документом из текущего `ExportLive`. Resolver не генерирует новые identity и не изменяет домен.

## Запрос на разрешение

```json
{
  "taskId": "t1",
  "mention": "Пример композиции Альфа",
  "expectedTypes": ["composition"],
  "identityLikelihood": 0.18,
  "displayNameLikelihood": 0.91,
  "scope": {
    "folderIdentity": null
  }
}
```

`expectedTypes` и `scope` — это ограничения поиска, а не готовый ответ. Если тип неуверенный, resolver может искать по нескольким типам, но не по всему содержимому без ограничений.

## Генерация кандидатов

Кандидаты собираются несколькими независимыми каналами:

1. exact identity;
2. exact normalized display name;
3. aliases и синонимы;
4. токены и префиксы;
5. транслитерация и морфологическая нормализация;
6. fuzzy-сравнение;
7. слабое lexical-совпадение в содержимом.

Каналы не заменяют друг друга. Один документ может получить несколько evidence signals.

## Ранжирование

Оценка кандидата учитывает:

- силу совпадения ключа;
- совпадение типа;
- принадлежность указанной папке;
- связи с уже разрешёнными задачами;
- разницу между первым и вторым кандидами;
- количество независимых evidence signals.

Exact identity при совпадающем типе имеет приоритет над fuzzy и content match. Конкретные пороги и веса не являются постоянными: они калибруются на размеченных запросах.

```json
{
  "candidateId": "c1",
  "documentType": "composition",
  "identity": "example-composition-alpha",
  "displayName": "Пример композиции Альфа",
  "score": 0.96,
  "evidence": [
    "type_match",
    "display_name_exact"
  ]
}
```

## Иерархический scope

Запрос «композиция из папки „Пример папки“» выполняется в два шага:

1. resolver разрешает папку;
2. resolver ищет Composition только в её scope.

Слово «папка» без указания типа не ограничивает результат Composition: запрос «что в папке» может возвращать документы разных типов.

## Semantic Reranker

Reranker вызывается только для ограниченного набора близких кандидатов. Его output contract:

```json
{
  "selectedCandidateId": "c1",
  "confidence": 0.89,
  "requiresClarification": false,
  "reason": "Упоминание Альфа совпадает с displayName"
}
```

`selectedCandidateId` обязан существовать в переданном списке. Низкая confidence не компенсируется повторными неограниченными вызовами: Workbench переходит к уточнению.

## Результат

```json
{
  "taskId": "t1",
  "status": "resolved",
  "resolvedEntity": {
    "documentType": "composition",
    "identity": "example-composition-alpha",
    "snapshotSha256": "..."
  },
  "candidateMargin": 0.31
}
```

Результат `ambiguous`, `not_found` или `unsupported_type` передаётся в [цикл уточнений](./clarification-loop.md).
