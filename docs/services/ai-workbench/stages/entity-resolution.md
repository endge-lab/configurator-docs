# 3. Разрешение сущностей

> Статус: реализовано в Workbench v0.6.0 для exact identity/display name, закрытого Reranker и folder scope. Общая схема находится в разделе [«AI Workbench: подготовка данных»](../data-preparation.md).

Цель resolver — связать текстовое упоминание с конкретным документом из текущего `ExportLive`. Resolver не генерирует новые identity и не изменяет домен.

## Запрос на разрешение

```json
{
  "taskId": "task-1",
  "mention": "Объект Альфа",
  "expectedTypes": ["compositions"],
  "scope": {
    "folderIdentity": null
  }
}
```

`expectedTypes` и `scope` — это ограничения поиска, а не готовый ответ. Производный индекс строится только из текущего snapshot и не сохраняется как второй source of truth.

## Генерация кандидатов

В v0.6.0 кандидаты собираются детерминированно из:

1. exact identity;
2. exact normalized display name;
3. токенов и префиксов;
4. слабого lexical-совпадения в содержимом.

Только уникальный exact identity или exact normalized display name принимается автоматически. Остальные сигналы формируют не более пяти кандидатов для Reranker и не являются самостоятельным решением.

## Ранжирование

Оценка кандидата учитывает:

- силу совпадения ключа;
- совпадение типа;
- принадлежность указанной папке;
- связи с уже разрешёнными задачами;
- разницу между первым и вторым кандидами;
- количество независимых evidence signals.

Exact identity при совпадающем типе имеет приоритет над token/content match. Reranker принимает кандидата только при настроенном пороге confidence; отдельная fuzzy-метрика в v0.6.0 отсутствует.

```json
{
  "candidateId": "candidate-1",
  "documentType": "compositions",
  "identity": "example-composition-alpha",
  "displayName": "Объект Альфа"
}
```

## Иерархический scope

Запрос «объекты из папки „Раздел Альфа“» выполняется в два шага:

1. resolver разрешает папку;
2. resolver ищет дочерние документы только по подтверждённому `folderIdentity`.

Запрос «что в папке» может возвращать документы разных типов.

## Semantic Reranker

Reranker вызывается только для ограниченного набора близких кандидатов. Его output contract:

```json
{
  "selectedCandidateId": "candidate-1",
  "confidence": 0.89,
  "requiresClarification": false,
  "reason": "Упоминание совпадает с displayName"
}
```

`selectedCandidateId` обязан существовать в переданном списке. Низкая confidence не компенсируется повторными неограниченными вызовами: Workbench переходит к уточнению.

## Результат

```json
{
  "taskId": "task-1",
  "status": "resolved",
  "resolvedEntity": {
    "documentType": "compositions",
    "identity": "example-composition-alpha",
    "snapshotSha256": "..."
  }
}
```

Результат `ambiguous`, `not_found` или `unsupported_type` передаётся в [цикл уточнений](./clarification-loop.md).
