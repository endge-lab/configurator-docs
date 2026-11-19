---
description: "Сценарий для ИИ-агента через Endge MCP: прочитать, создать или изменить TimelineChart и TimelineGroup в Component SFC, сохранить привязки и проверить результат."
---

# Timeline в рабочем пространстве через MCP

`TimelineChart` и `TimelineGroup` — встроенные теги Component SFC. В документном API оба сохраняются в коллекции `components`, поле формата — `modelVersion: 1`. Тег в корне `<template>` определяет специализированную форму в Configurator. В составе другой вёрстки теги обрабатываются тем же runtime.

## Найти контракт и исходник

1. Откройте [MCP-сервер backend](./mcp), а в MCP используйте `resources/templates/list` для обнаружения URI ресурсов. Через `resources/read` прочитайте `agents/timeline.md`, `domain/components/timeline-chart.md` и `domain/components/timeline-group.md` под `AGENT_DOCS_URL` стенда. Страницы содержат канонические примеры Source, типы событий и правила пресетов.
2. Определите workspace через `endge_status` и `endge_list_workspaces`. У PAT workspace зафиксирован токеном, для JWT передайте workspace в запросе. Через `endge_list_documents` найдите `components` и связанный документ `compositions`. Прочитайте их через `endge_get_document`. Сверьте `source`, `modelVersion` компонента и текущую `revision`. Перед изменением исходника проверьте владельца данных и доступный runtime.
3. Выберите конструкцию по задаче. Отдельный график — `<TimelineChart>`. Несколько панелей с общими панорамированием и зумом — один `<TimelineGroup sync="time" splitter>` с прямыми детьми `<TimelineChart>`. Для нескольких однотипных графиков добавьте `for="item in props.resources"` и `:key="item.id"` на дочерний тег. Для произвольной вёрстки вложите Timeline-теги в нужную часть шаблона.

## Создать или изменить

Пример аргументов `tools/call` для отдельного графика. Пример использует PAT с правом записи. При JWT укажите ещё `workspace` в `arguments`.

```json
{
  "name": "endge_create_document",
  "arguments": {
    "collection": "components",
    "document": {
      "identity": "example-timeline",
      "displayName": "Шкала загрузки",
      "modelVersion": 1,
      "source": "<script setup lang=\"ts\">\nconst props = defineProps<{ timeline: unknown }>()\ndefinePreviewProps({ timeline: { groups: [{ id: 'r1', title: 'Ресурс 1' }], tasks: [{ id: 't1', groupId: 'r1', startTime: 1794988800000, endTime: 1794992400000 }] } })\n</script>\n<template>\n  <TimelineChart ref=\"chart\" :data=\"props.timeline\" :columns=\"[{ id: 'title', field: 'title', title: 'Ресурс' }]\" :height=\"260\" />\n</template>\n"
    }
  }
}
```

Для правки используйте `endge_update_document` с аргументами `collection: "components"`, `identity` и актуальной `revision`. Передайте новый текст и версию формата в объекте `changes: { source, modelVersion: 1 }`. При `revision_conflict` перечитайте документ и повторно примените точечную правку к новой ревизии. Форму аргументов сверяйте со схемой `tools/list` на текущем сервере.

При изменении колонки или опции сохраняйте остальные привязки и блоки SFC. Если график использует `:options="props.options"` или `:data="props.timeline"`, найдите место, откуда Composition передаёт значение. Для списка панелей проверьте структуру данных и уникальность `:key`. Для выбора задачи или загрузки по диапазону опубликуйте `taskSelected` или `rangeChanged` через типизированный `definePorts` и подключите этот публичный Event в Composition.

Пресет ссылается на код Vue-хоста или активного модуля в scope композиции. Перед использованием `preset` узнайте зарегистрированное имя, доступные `settings` и наличие провайдера в приложении и Preview. MCP работает с документами и может записывать только сериализуемые параметры пресета. Регистрация провайдера, доступ к `TimelineChartHandle` и вызов `timeline.focusTask` относятся к runtime приложения. Если пресет поставляется модулем, сверьте Source композиции, точную версию и выбранную ветку Runtime Preview. [Модули композиции](/agents/modules)

## Проверить

1. Повторно прочитайте сохранённый документ. Сверьте исходник, ID, входы, ключи повторений, оставшиеся связи и неизменность соседних блоков.
2. Проверьте компиляцию workspace версией `@endge/core`, которая понимает Timeline. При работе через один backend откройте «Проблемы» в Configurator или передайте это действие пользователю. Запись документа через MCP подтверждает прохождение валидации запроса, а проверка Source и Vue-рендера выполняется отдельно.
3. Откройте локальный Preview для `definePreviewProps`. Запустите Runtime Preview для фактических данных Composition, пресета и обработчиков. Для группы проверьте зум с разных панелей, совпадение одного момента по вертикали, независимую прокрутку строк, изменение размеров, возврат скрытой панели и сохранение диапазона после обновления данных.
4. При запросе поставки покажите `endge_commit_plan` и следуйте процедуре [коммита workspace](/configurator/workspace-delivery). Укажите, какие проверки Source и Preview состоялись.

Если MCP не читает страницу, проверьте опубликованный Markdown по URI портала и `AGENT_DOCS_URL`. Ресурсы backend кешируются до десяти минут. Если Preview сообщает о неизвестном теге, проверьте версию Core и Configurator хоста. При ошибке «реализация пресета недоступна» проверьте регистрацию провайдера в Vue-хосте или доступность выбранного модуля в текущей ветке.
