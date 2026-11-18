---
description: "Скользящее окно коллекции: cursor и offset, Store/Update/Query, typed Table viewport, Composition, retention, отмена и рабочие примеры."
---

# Скользящее окно коллекции

`endge.collection-window` подгружает записи до и после видимой области, удерживает связное окно в Store и удаляет далёкие блоки. Table сообщает геометрию, Controller определяет спрос, Query получает страницу, guarded Update атомарно заменяет state. [Общий контракт Controllers](/reference/controllers).

Для этого руководства используйте `@endge/core@1.2.0-dev.15`, `@endge/ui-vue@2.0.0-dev.14` и Configurator `2.15.0`. Для установки указывайте точные версии пакетов.

## Выберите режим

| Задача | Механизм | Что ограничивается |
| --- | --- | --- |
| Небольшой полный массив | Table `paging="pages"` | Только отображаемая страница, все rows остаются в памяти |
| Большой уже загруженный массив | Table `paging="virtual"` | DOM и overscan, полный массив остаётся в памяти |
| Серверная коллекция, последовательный скролл | Controller + Query + Table virtual | Удерживаемые блоки в Store и DOM раздельно |
| Внешние кнопки номер/назад/вперёд | [Ручная страница через Action](/sfc-tables/server-paging) | State одного ответа; работает на прежнем опубликованном baseline |

`maxLoadedRows` — мягкая цель для данных, а не размер DOM. `prefetchRows` — коридор защиты/подгрузки, не overscan renderer. По умолчанию дополнительного кэша нет: удалённый блок запрашивается снова. Опциональные retention и memory/IndexedDB cache с политиками обновления описаны в [кэше страниц](/guides/collection-window-cache). Table scrollbar представляет только загруженные rows; общего scrollbar по серверному total, произвольного seek/перехода к незагруженному key и server-mode у `lazy` нет.

## Контракт страниц

Вход Query — `request` props плюс `direction:'initial'|'before'|'after'`, `limit` и `cursor` **или** `offset`. Paging-поля Controller имеют приоритет над одноимёнными request полями. Cursor первого запроса не задан: API само выбирает начальную область. `initialOffset` используется только в offset-режиме.

```ts
// cursor: opaque непустые tokens для доступных краёв
{ rows: [{ id:'100', label:'Record 100' }], startCursor:'100', endCursor:'101', hasBefore:true, hasAfter:true }
// offset: offset должен равняться запрошенному; total ИЛИ явные hasBefore/hasAfter
{ rows: [{ id:'100', label:'Record 100' }], offset:100, total:500 }
```

Для cursor обязательны обе continuation flags; startCursor нужен при hasBefore, endCursor — при hasAfter. Для offset `hasBefore` может выводиться из offset, а `hasAfter` — из total; без total нужен явный hasAfter. Короткая страница сама по себе не означает конец. Terminal response без новых ключей, включая all-duplicate страницу, закрывает запрошенный край и обновляет совпавшие значения без пустого edge block; пустая страница с продолжением — `window-no-progress`. Server должен возвращать согласованные границы и устойчивый порядок с уникальным ключом. Фильтры и порядок всех данных применяются на сервере **до** пагинации; Table sorting/filtering видят только загруженную часть. Поэтому пример отключает локальную сортировку.

Ключ — прямое поле row, String или Number, непустое. Controller дедуплицирует ключи (число 1 и строка '1' считаются одним key), обновляет значения совпавших строк и сохраняет сырой sourceCount для offset, чтобы дедупликация не сдвигала следующий запрос. Смещение и cursors принадлежат API, а не индексу массива после trim.

## Полный Source {#source}

Ниже точные тела создания документов Service Backend. Авторизованный API сохраняет Source; Compiler проверяет его отдельно. `storeIdentity` у Update — поле HTTP DTO, не поле `defineUpdate`. Controller не создаётся отдельным POST. В этом примере каждый window явно объявляет `store('window-state').isolated()`, поэтому получает независимый локальный Store instance. Contextual/injected Store в других Composition может заимствоваться у parent; независимость не является свойством любого mount. Два Controller не могут писать в один Store runtime/path: для независимых окон используйте `.isolated()`, разные Store либо разные writable paths с соответствующими Update.

Локальный API из [mock-api.mjs](/examples/controllers/mock-api.mjs) слушает `http://127.0.0.1:4182` и поддерживает показанный POST и GraphQL mapping ниже. Его нужно запустить, если вы исполняете эти документы через Configurator. Он не является Service Backend. В production замените endpoint/авторизацию и output mapping на контракт своего сервиса. Поле `filter` этого mock только меняет подпись строк; это демонстрация сброса запроса, не реализация реального поиска.

```bash
node docs/public/examples/controllers/mock-api.mjs 4182
```

Для браузерного приложения с другим origin настройте CORS/proxy своего API (в демонстрации mock разрешает локальный cross-origin). Для HTTPS-host используйте HTTPS API, чтобы браузер не блокировал mixed content. Node exercise ниже сам запускает ephemeral mock и не требует отдельного сервера.

### Store: подтверждённые blocks и revisions

```json [POST /api/v1/stores]
{
  "identity": "window-state",
  "displayName": "Window state",
  "sourceVersion": 1,
  "source": "defineStore({data:{window:value({revision:0,rowsRevision:0,blocks:[]})}})"
}
```

### Update: compare-and-set целого окна

```json [POST /api/v1/updates]
{
  "identity": "window-commit",
  "displayName": "Commit window",
  "storeIdentity": "window-state",
  "sourceVersion": 1,
  "source": "defineUpdate({mutations:[{strategy:'set',target:'window',value:input('next'),when:eq(data('window.revision'),input('expectedRevision'))}]})"
}
```

### REST Query: transport и output page

```json [POST /api/v1/queries]
{
  "identity": "window-page",
  "displayName": "Window page",
  "sourceVersion": 2,
  "source": "defineQuery({\n  kind:'rest',\n  props:defineProps({direction:field('String'),limit:field('Number'),cursor:field('String').optional(),offset:field('Number').optional(),filter:field('String').optional(),delay:field('Number').optional(),fail:field('Boolean').optional()}),\n  request:{endpoint:'http://127.0.0.1:4182',path:'/__collection-window/page',method:'POST',headers:{'Content-Type':'application/json'},body:body(({prop})=>({direction:prop('direction'),limit:prop('limit'),cursor:prop('cursor'),offset:prop('offset'),filter:prop('filter'),delay:prop('delay'),fail:prop('fail')}))},\n  outputs:{page:output().from(response())}\n})"
}
```

### SFC: типизированный viewport port

```json [POST /api/v1/components]
{
  "identity": "window-table",
  "displayName": "Window table",
  "modelVersion": 1,
  "source": "<script setup lang=\"ts\">\ndefineProps<{rows:Array<{id:string,label:string}>,rowsRevision:number}>()\nconst ports = definePorts({emits:{viewportChanged:event<TableViewportChangedEvent>({from:{ref:'table',event:'viewportChanged'}})}})\n</script>\n<template>\n  <Table ref=\"table\" id=\"window-table\" :rows=\"rows\" :rows-revision=\"rowsRevision\" :preserve-scroll-anchor=\"true\" paging=\"virtual\" :row-size=\"32\" height=\"320\" row-key=\"id\" sort-mode=\"disabled\" @rowActivated=\"action({identity:'table.scrollToRow',input:{rowId:event('rowId'),align:'start'}})\">\n    <Column key=\"id\" title=\"Key\" />\n    <Column key=\"label\" title=\"Record\" :width=\"280\" />\n  </Table>\n</template>"
}
```

### Composition: cursor и offset

```json [POST /api/v1/compositions]
{
  "identity": "window-cursor",
  "displayName": "Window cursor",
  "sourceVersion": 1,
  "source": "defineComposition({\n  data:{state:store('window-state').isolated()},\n  runtimes:{\n    window:controller('endge.collection-window')\n      .withProps({paging:'cursor',batchSize:40,prefetchRows:2,maxLoadedRows:80,initialOffset:100,autoLoad:true,request:{filter:'all'}})\n      .withDependencies({state:{store:data('state'),path:'window',update:'window-commit'},load:{query:'window-page',output:'page'}}),\n    screen:component('window-table').withProps({rows:fromOutput('window','rows'),rowsRevision:fromOutput('window','rowsRevision')})\n  },\n  hooks:[onEvent('screen','viewportChanged').command('window','setViewport',event())],\n  outputs:{rows:output().fromRuntime('window').select('rows'),rowsRevision:output().fromRuntime('window').select('rowsRevision')}\n})"
}
```

```json [POST /api/v1/compositions]
{
  "identity": "window-offset",
  "displayName": "Window offset",
  "sourceVersion": 1,
  "source": "defineComposition({\n  data:{state:store('window-state').isolated()},\n  runtimes:{\n    window:controller('endge.collection-window')\n      .withProps({paging:'offset',batchSize:40,prefetchRows:2,maxLoadedRows:80,initialOffset:100,autoLoad:true,request:{filter:'all'}})\n      .withDependencies({state:{store:data('state'),path:'window',update:'window-commit'},load:{query:'window-page',output:'page'}}),\n    screen:component('window-table').withProps({rows:fromOutput('window','rows'),rowsRevision:fromOutput('window','rowsRevision')})\n  },\n  hooks:[onEvent('screen','viewportChanged').command('window','setViewport',event())],\n  outputs:{rows:output().fromRuntime('window').select('rows'),rowsRevision:output().fromRuntime('window').select('rowsRevision')}\n})"
}
```

В SFC `const ports = definePorts(...)` должен находиться на верхнем уровне script. Тип **обязателен**: `event<TableViewportChangedEvent>({from:{ref:'table',event:'viewportChanged'}})`; голый `event(...)` объявляет payload void и не сохраняет требуемый viewport contract. Это не обещание общей статической проверки assignability произвольного event input к command: используйте явный event type и правильную форму payload. SFC macros и тип `TableViewportChangedEvent` разрешает compiler, это не обычный Vue import. Hook передаёт весь payload через Composition `event()`.

Пример задаёт `autoLoad:true`: первый Query запускается при mount, затем Table публикует viewport и Controller подгружает края. Для детерминированной Node-проверки harness перед boot явно заменяет это поле на false и сам вызывает loadInitial. Дополнительных Query hooks onMount не нужно.

### Читаемый SFC и Composition

```vue
<script setup lang="ts">
defineProps<{rows:Array<{id:string,label:string}>,rowsRevision:number}>()
const ports = definePorts({emits:{viewportChanged:event<TableViewportChangedEvent>({from:{ref:'table',event:'viewportChanged'}})}})
</script>
<template>
  <Table ref="table" id="window-table" :rows="rows" :rows-revision="rowsRevision" :preserve-scroll-anchor="true" paging="virtual" :row-size="32" height="320" row-key="id" sort-mode="disabled" @rowActivated="action({identity:'table.scrollToRow',input:{rowId:event('rowId'),align:'start'}})">
    <Column key="id" title="Key" />
    <Column key="label" title="Record" :width="280" />
  </Table>
</template>
```

```ts
defineComposition({
  data:{state:store('window-state').isolated()},
  runtimes:{
    window:controller('endge.collection-window')
      .withProps({paging:'cursor',batchSize:40,prefetchRows:2,maxLoadedRows:80,initialOffset:100,autoLoad:true,request:{filter:'all'}})
      .withDependencies({state:{store:data('state'),path:'window',update:'window-commit'},load:{query:'window-page',output:'page'}}),
    screen:component('window-table').withProps({rows:fromOutput('window','rows'),rowsRevision:fromOutput('window','rowsRevision')})
  },
  hooks:[onEvent('screen','viewportChanged').command('window','setViewport',event())],
  outputs:{rows:output().fromRuntime('window').select('rows'),rowsRevision:output().fromRuntime('window').select('rowsRevision')}
})
```

## Props, outputs, commands

| Prop | Default | Смысл |
| --- | --- | --- |
| paging | `'cursor'` | `'cursor'` или `'offset'` |
| rowKey | `'id'` | Прямое поле стабильного row key |
| batchSize | `100` | Положительное целое число записей запроса |
| prefetchRows | `20` | Неотрицательный коридор до/после видимых строк |
| maxLoadedRows | `1000` | Положительная мягкая цель retained rows |
| request | `{}` | Пользовательские props Query, например filter/order |
| initialOffset | `0` | Неотрицательная начальная позиция offset-режима |
| autoLoad | `true` | Начальный запрос при start/reset |
| retention | Нет | Дополнительные расстояния beforeRows/afterRows; [контракт](/guides/collection-window-cache) |

Outputs: `rows`, `rowsRevision`, `loading`, `error:{message,direction}|null`, `hasBefore`, `hasAfter`, `loadedRowCount`, `overLimit`. Loading/error принадлежат Controller; Table не получает выдуманные loading/error props. Store value — `{revision,rowsRevision,blocks}`; **все** подтверждённые rows находятся там. Outputs — проекция state.

| Command | Input / поведение |
| --- | --- |
| loadInitial | Без input; запрос initial, заменяет блоки начальной страницей |
| loadBefore / loadAfter | Без input; доступный край, одна текущая request operation |
| setViewport | `{rowsRevision,firstVisible:{key,index}|null,lastVisible:{key,index}|null,rowCount,reason?}` |
| reset | Отмена, очистка blocks/ошибки/viewport/retention, новый initial при autoLoad |
| retry | Очистить ошибку и повторить её direction |
| retainRows / releaseRows | Массив keys либо `{keys:[...]}` |

`setViewport` принимает только текущую rowsRevision и согласованные visible keys/indices. Table публикует `{tableId,rowsRevision,firstVisible,lastVisible,rowCount,reason}`; reason — mount/scroll/data/resize/position. Indices относятся к переданному текущему массиву, не серверному total. Измеряется фактически видимый диапазон без headers и overscan; при пустом диапазоне first/last равны null. Быстрые scroll/resize coalesce в animation frame renderer, повторный demand не запускает параллельные запросы.

## Удержание, редактирование и мягкий лимит

Controller удаляет целые крайние блоки, сохраняя связную полосу: видимые строки + prefetch corridor + retained keys. Удалить защищённый или последний блок нельзя. Поэтому maxLoadedRows может превышаться, output overLimit показывает это явно; без валидного viewport автоматического trim нет. Малый лимит относительно viewport/batchSize также не гарантирует ровно N rows.

Начало редактирования приложения должно вызвать `retainRows({keys:[rowId]})`, commit/cancel редактора — `releaseRows({keys:[rowId]})`. **Автоматического определения dirty editor нет.** Далёкий retained key защищает и промежуточные блоки; держите retention только пока это требуется. Reset очищает retention, поэтому перед сменой фильтра приложение само решает судьбу несохранённого редактирования.

## Отмена, ошибки и reset

Одновременно выполняется один Query; новые demand используют текущую operation. Ошибка оставляет подтверждённые rows и блокирует автоматические запросы до retry/reset. `await command(...)` не заменяет проверку output error: ошибки страницы сохраняются там; отменённая или superseded operation может отклониться с `AbortError`.

Смена request/paging/rowKey/initialOffset отменяет старую generation, очищает blocks/retention и при autoLoad запускает initial. `request` заменяется целиком, а не глубоко объединяется: `setProps({request:{...controller.getProps().request,filter:'new'}})`. Изменения batchSize/prefetchRows/maxLoadedRows сохраняют окно, применяют trim и перезапускают прерванный запрос с новыми policy inputs. Pause/destroy отменяют Query; поздний ответ не публикуется в Store. Guarded Update проверяет expectedRevision до и после записи; skipped guard — ошибка, не успешная публикация. Один Store/path имеет одного Controller writer.

## Сохранение якоря и позиционирование

Передайте rowsRevision и `preserve-scroll-anchor="true"` вместе с тем же row-key. Vue Table сохраняет верхний видимый key и пиксельный offset после prepend/trim. Если key исчез, используется безопасная ограниченная позиция; незагруженный ряд не появляется сам. Двойной клик в SFC примере вызывает intrinsic Action `table.scrollToRow` на **исходной Table**:

```ts
{ identity:'table.scrollToRow', input:{rowId:'120',align:'center'} }
```

Align: start/center/end/auto (default auto). Допустим только загруженный key; иначе Action завершается ошибкой. Для другого источника вызова нужен явный target контекст Table. Без preserve-scroll-anchor сохраняется прежнее поведение таблицы. Этот механизм не является remote seek и не даёт глобальных серверных координат scrollbar.

## GraphQL и другое REST API

Controller получает значение выбранного Query output `page`. Query может преобразовать любой реальный API ответ в ровно описанный page contract. REST с `{items,pageInfo}` может вернуть output object из `response('items')` и `response('pageInfo.startCursor')` и т. п.; конкретные paths проверьте по ответу сервера. [Полный Query DSL](/reference/query).

GraphQL сохраняет тот же Controller. Mock API также поддерживает `/graphql` и сопоставляет `variables` с теми же page inputs; он возвращает `{data:{window:page}}`. Это нейтральный transport fixture, а не GraphQL schema validation server. Следующие полные документы добавляют третью Composition и выполняются default Node exercise:

```json [POST /api/v1/queries]
{
  "identity": "window-page-graphql",
  "displayName": "Window GraphQL page",
  "sourceVersion": 2,
  "source": "defineQuery({\n  kind:'graphql',\n  props:defineProps({direction:field('String'),limit:field('Number'),cursor:field('String').optional(),offset:field('Number').optional(),filter:field('String').optional(),delay:field('Number').optional(),fail:field('Boolean').optional()}),\n  request:{endpoint:'http://127.0.0.1:4182/graphql',document:gql`query Window($direction:String!,$limit:Int!,$cursor:String,$offset:Int,$filter:String,$delay:Int,$fail:Boolean){window(direction:$direction,limit:$limit,cursor:$cursor,offset:$offset,filter:$filter,delay:$delay,fail:$fail){rows{id label} startCursor endCursor hasBefore hasAfter offset total}}`,variables:variables(({prop})=>({direction:prop('direction'),limit:prop('limit'),cursor:prop('cursor'),offset:prop('offset'),filter:prop('filter'),delay:prop('delay'),fail:prop('fail')}))},\n  outputs:{page:output().from(data('window'))}\n})"
}
```

```json [POST /api/v1/compositions]
{
  "identity": "window-graphql",
  "displayName": "Window GraphQL",
  "sourceVersion": 1,
  "source": "defineComposition({\n  data:{state:store('window-state').isolated()},\n  runtimes:{\n    window:controller('endge.collection-window')\n      .withProps({paging:'cursor',batchSize:40,prefetchRows:2,maxLoadedRows:80,initialOffset:100,autoLoad:true,request:{filter:'all'}})\n      .withDependencies({state:{store:data('state'),path:'window',update:'window-commit'},load:{query:'window-page-graphql',output:'page'}}),\n    screen:component('window-table').withProps({rows:fromOutput('window','rows'),rowsRevision:fromOutput('window','rowsRevision')})\n  },\n  hooks:[onEvent('screen','viewportChanged').command('window','setViewport',event())],\n  outputs:{rows:output().fromRuntime('window').select('rows'),rowsRevision:output().fromRuntime('window').select('rowsRevision')}\n})"
}
```

Для реальной схемы адаптируйте field/arguments/variable types и Query output. В Relay connection сначала сопоставьте edges/node/pageInfo с rows/cursors/flags; наличие GraphQL не обещает before/after или total у сервера. HTTP-успех и compilation не заменяют schema validation.

## Исполняемая проверка без Configurator

Скачайте в одну папку [workspace.json](/examples/controllers/workspace.json), [source-window.mjs](/examples/controllers/source-window.mjs), [load-core.mjs](/examples/controllers/load-core.mjs), [mock-api.mjs](/examples/controllers/mock-api.mjs). В checkout документации они уже доступны:

```bash
node scripts/grade-workspace.mjs --markdown docs/guides/collection-window.md --core /path/to/built/core --each-facet
node docs/public/examples/controllers/source-window.mjs --core /path/to/built/core
node docs/public/examples/controllers/sdk-controller.mjs --core /path/to/built/core
```

Первый инструмент компилирует все полные POST examples (включая linked Composition/SFC), два следующих реально выполняют Core. Source exercise сам запускает нейтральный local API, исполняет cursor/offset REST и cursor GraphQL Composition, проверяет initial/before/after, retention/trim, ошибку и отмену при смене request, затем unmount/reset и останавливает свой API. Без renderer viewport подаётся явно; DOM/якорь проверяйте в Vue host. При наличии запущенного нейтрального fixture API можно явно передать `--endpoint <его local origin>`; default exercise полностью самодостаточен.

Параметр `--core` принимает каталог установленного или собранного пакета. Для установки используйте `npm install @endge/core@1.2.0-dev.15` и передайте `--core ./node_modules/@endge/core`. Для браузерного Preview используйте указанные версии Core, UI Vue и Configurator. Исполняемый пример Node проверяет работу контроллера без renderer.

[Ошибки и восстановление](/reference/controller-errors), [Table event reference](/sfc-tables/events-and-actions), [ручная пагинация прежних версий](/sfc-tables/server-paging).
