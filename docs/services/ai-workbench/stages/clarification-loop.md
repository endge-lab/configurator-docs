# 4. Цикл уточнений

> Статус: целевой контракт этапа. Общая схема находится в разделе [«AI Workbench: подготовка данных»](../data-preparation.md).

Уточнение не является новым независимым prompt. Это продолжение сохранённого `Interaction` — одного логического запроса, который может занять несколько сообщений.

## Interaction и Conversation

```text
Conversation
├── Interaction A: completed
├── Interaction B: awaiting_clarification
│   ├── root user message
│   ├── clarification question 1
│   ├── user answer 1
│   ├── clarification question 2
│   └── user answer 2
└── Interaction C: new request
```

Conversation владеет историей диалога. Interaction владеет планом и незавершённой целью. Provider run — только один технический вызов модели внутри Interaction.

## Машина состояний

```mermaid
stateDiagram-v2
  [*] --> planning
  planning --> resolving
  resolving --> awaiting_clarification: недостаточно данных
  awaiting_clarification --> resolving: ответ применён
  resolving --> ready: все задачи разрешены
  ready --> generating
  generating --> completed
  planning --> failed
  resolving --> failed
  generating --> failed
  awaiting_clarification --> cancelled
  awaiting_clarification --> superseded: новый запрос
```

В первой версии в Conversation допускается не более одного активного Interaction. Новый независимый запрос переводит предыдущий в `superseded`.

## Сохраняемое состояние

Целевая проекция Interaction:

```text
interactions
  id
  conversation_id
  root_message_id
  status
  plan_json
  plan_version
  workspace_generation
  workspace_snapshot_sha256
  documentation_version
  created_at
  updated_at
```

Цепочка уточнений:

```text
clarifications
  id
  interaction_id
  task_id
  slot
  question_message_id
  answer_message_id
  candidate_snapshot_json
  status
  plan_version
  created_at
  resolved_at
```

Это логическая целевая схема. Точные SQL-имена и миграции фиксируются на этапе реализации.

## Формирование вопроса

Вопрос адресует одно незаполненное поле конкретной задачи:

```json
{
  "clarificationId": "clarification-7",
  "interactionId": "interaction-42",
  "taskId": "t1",
  "slot": "resolvedEntity",
  "question": "Какую композицию вы имеете в виду?",
  "candidates": [
    {
      "candidateId": "c1",
      "identity": "example-composition-alpha",
      "displayName": "Пример композиции Альфа"
    },
    {
      "candidateId": "c2",
      "identity": "example-composition-beta",
      "displayName": "Пример композиции Бета"
    }
  ]
}
```

`candidate_snapshot_json` нужен, чтобы ответ «первую» имел тот же смысл после изменения Workspace.

## Связь ответа с вопросом

Configurator передаёт скрытую структурную ссылку:

```json
{
  "text": "Первую",
  "interactionId": "interaction-42",
  "replyToClarificationId": "clarification-7"
}
```

При выборе готового кандида UI может передать `selectedCandidateId`. Текстовый ответ тоже сохраняется как обычное user message.

Для streaming-контракта нужен отдельный event `clarification_required`. Он завершает текущий transport run, но не завершает Interaction.

## Классификация ответа

Новая реплика может быть:

- `answer` — ответом на открытый вопрос;
- `correction` — исправлением ранее указанного условия;
- `new_request` — новой независимой задачей;
- `cancel` — отменой Interaction;
- `unclear` — ответ нельзя связать с планом.

Явные команды обрабатываются алгоритмически. LLM Clarification Classifier вызывается только для неоднозначного свободного текста. При низкой confidence Workbench спрашивает: «Продолжить уточнение или начать новый вопрос?»

## Обновление плана

Ответ применяется как scoped patch:

```json
{
  "interactionId": "interaction-42",
  "basePlanVersion": 3,
  "updates": [
    {
      "taskId": "t1",
      "field": "resolvedEntity",
      "candidateId": "c1"
    }
  ]
}
```

Workbench атомарно:

1. проверяет `basePlanVersion`;
2. проверяет candidate snapshot;
3. сохраняет answer message;
4. применяет patch;
5. повышает `plan_version`;
6. инвалидирует зависимые задачи;
7. повторно запускает только инвалидированную часть графа.

Исходный user message остаётся неизменным.

## Изменение Workspace

При каждом продолжении backend передаёт актуальный `ExportLive`. Если snapshot hash изменился, Workbench:

- повторно проверяет уже разрешённые identity;
- инвалидирует изменившиеся связи;
- повторяет только затронутые задачи;
- задаёт новое уточнение, если выбранный документ исчез.

Следующий этап: [«Сборка контекста»](./context-assembly.md).
