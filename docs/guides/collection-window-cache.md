---
description: "Retention и кэш страниц коллекции: memory, IndexedDB, cache-first, network-first, SWR, refreshPending, лимиты и lifecycle."
---

# Retention и кэш страниц

Для этого руководства используйте `@endge/core@1.2.0-dev.15`, `@endge/ui-vue@2.0.0-dev.14` и Configurator `2.15.0`. Для установки указывайте точные версии пакетов.

```sh
npm install @endge/core@1.2.0-dev.15 @endge/ui-vue@2.0.0-dev.14
```

Начните с [полного примера Store → Update → Query → Controller → Table](/guides/collection-window). Эта страница расширяет его настройками удержания и кэша. Контроллер доступен через Source Composition и SDK; отдельного документа Cache или нового корневого поля Composition нет.

## Три независимых ограничения

| Механизм | Что хранит | Чем управляется |
| --- | --- | --- |
| Table virtual | DOM видимых строк и overscan | Настройки Table |
| Активный Store | Связный диапазон загруженных блоков | `maxLoadedRows`, `retention`, retain/release |
| Кэш страниц | Результаты загрузок, включая вытесненные из Store | `load.cache`, отдельные бюджеты и свежесть |

Store остаётся реактивным хранилищем в RAM. `storage:'indexeddb'` относится к кэшу страниц, не заменяет синхронное чтение Store. `storage:'memory'` создаёт дополнительный расход RAM сверх активного окна.

## Source

Ниже полная Composition, использующая Store, Update, Query и Component из связанного примера. Их identities должны существовать в текущем workspace. Компонент `window-table` принимает `rows`/`rowsRevision` и объявляет событие `viewportChanged`.

```ts
defineComposition({
  data: { state: store('window-state').isolated() },
  runtimes: {
    window: controller('endge.collection-window')
      .withProps({
        paging: 'cursor', rowKey: 'id',
        request: { filter: 'all' },
        batchSize: 100, prefetchRows: 20, maxLoadedRows: 1000,
        retention: { beforeRows: 200, afterRows: 400 },
      })
      .withDependencies({
        state: { store: data('state'), path: 'window', update: 'window-commit' },
        load: {
          query: 'window-page', output: 'page',
          cache: {
            key: 'orders-pages-v1', storage: 'indexeddb',
            strategy: 'stale-while-revalidate',
            maxAgeMs: 60000, maxStaleMs: 600000, onError: 'fail',
            maxEntries: 500, maxBytes: 50 * 1024 * 1024,
          },
        },
      }),
    screen: component('window-table').withProps({
      rows: fromOutput('window', 'rows'),
      rowsRevision: fromOutput('window', 'rowsRevision'),
    }),
  },
  hooks: [onEvent('screen', 'viewportChanged').command('window', 'setViewport', event())],
})
```

Для offset замените `paging:'cursor'` на `paging:'offset'`, при необходимости задайте `initialOffset`. REST/GraphQL преобразуют ответ в прежний нормализованный page contract. Серверные фильтры и сортировка применяются до пагинации.

## Retention

Без `retention` сохраняется прежнее удаление по общему лимиту. Оба расстояния должны быть целыми и не меньше `prefetchRows`. Неизвестные поля и несовместимые значения отклоняются.

`beforeRows`/`afterRows` считаются среди уже загруженных строк вокруг действительно видимого диапазона. Полностью вышедшие блоки удаляются даже ниже общего лимита. Это не команды предварительно загрузить указанное количество строк.

Удаление идёт целыми блоками, поэтому граница округляется. `maxLoadedRows` может потребовать удаления раньше внешней границы retention. Viewport, внутренний prefetch-буфер и явно закреплённые строки защищены; лимит остаётся мягким, превышение отражается в `overLimit`. Далёкое закрепление удерживает и промежуточный диапазон. Без корректного viewport trim не выполняется.

### Настройка по фасету

В `.withProps(...)` можно выбрать весь объект `retention` через действующий `contextSwitch`. В этом примере `tenant-b` получает меньший диапазон, а остальные значения фасета используют `default`.

```ts
retention: contextSwitch({
  default: { beforeRows: 200, afterRows: 400 },
  cases: [
    { when: { tenant: 'tenant-b' }, use: { beforeRows: 100, afterRows: 150 } },
  ],
})
```

Выбор выполняется при сборке Composition для выбранного контекста. Обе настройки должны быть совместимы с `prefetchRows`. См. [контекст сборки](/reference/value-expressions#контекст-сборки).

## Выбор кэша и defaults

Без `cache` дополнительного кэша нет. Для memory используйте тот же объект с `storage:'memory'`; для дискового кэша — `storage:'indexeddb'`.

| Поле | Default | Смысл |
| --- | --- | --- |
| key | Обязательно | Логическое имя кэша |
| storage | Обязательно | `memory` или `indexeddb` |
| strategy | `cache-first` | Политика загрузки |
| maxAgeMs | `60000` | Период свежести после записи |
| maxStaleMs | `0` | Разрешённый возраст после истечения свежести |
| onError | `fail` | `fail` или явно разрешённый `use-cache` |
| maxEntries | `500` | Максимум результатов страниц в namespace |
| maxBytes | `52428800` | Бюджет JSON-полезных данных, не размер heap или всей БД |

Бюджеты объединяют страницы разных фильтров одного cache namespace. Оба ограничения действуют одновременно, вытеснение — LRU. Независимые владельцы одного namespace должны задавать одинаковые бюджеты. Полный ключ формируется системой из контекста, Query/output, режима выполнения, выборки и запроса страницы; одного `key` недостаточно для совпадения записей.

Fingerprint учитывает compiled зависимости Query, включая DataView. При изменении пользовательского исполняемого provider или внешнего контракта данных повышайте версию `key`: произвольные изменения кода приложения не имеют сериализуемой версии и автоматически не определяются.

Значения кэша — независимые JSON-совместимые копии страницы до оконной дедупликации. Functions, Date/class instances, циклы и слишком большие записи не сохраняются; ошибка отражается в диагностике, окно продолжает работать. Credentials не являются содержимым записи или публичной диагностикой.

## Политики обновления

- `cache-first`: свежая запись, иначе Query.
- `network-first`: Query; при ошибке fallback допускается только с `onError:'use-cache'` и в разрешённых возрастных пределах. Отмена, HTTP 401 и 403 не разрешают fallback.
- `stale-while-revalidate`: свежая запись без запроса; допустимая устаревшая запись сразу плюс фоновая проверка; слишком старая — обычная загрузка.

Пример: `maxAgeMs:60000, maxStaleMs:600000` разрешает читать просроченную запись не более десяти минут после первой минуты свежести. Эти значения проверяются при использовании страницы; они не являются таймером удаления строк из уже отображаемого Store. Периодического polling нет.

Фоновая проверка запускается при обращении к просроченной странице, включая повторный viewport demand активного блока. Foreground имеет приоритет, фон отменяется при необходимости загрузить страницу пользователю. Сетевой Query остаётся дочерним runtime своего контроллера.

При прежних исходных ключах, порядке и границах фон обновляет значения без изменения якоря. Идентичный ответ не повышает `rowsRevision`. Если изменились ключи, порядок, continuation, offset/total или опциональная серверная `revision`, выставляется `refreshPending`. Существующие строки сохраняются; достраивание несовместимой цепочки останавливается до явного `refresh`. Кэш не создаёт серверный snapshot и не устраняет ограничения изменяемой offset-коллекции.

## SDK и команды

SDK получает настоящий owning runtime и смонтированный Store, не строковый Source alias:

```ts
import { Endge, StoreRuntimeHost } from '@endge/core'

// После boot workspace из полного Source-примера:
// cache-sdk-owner: defineComposition({ runtimes: {} })
const session = await Endge.runtime.composition.mount('cache-sdk-owner')
const owner = session.host
const model = Endge.domain.getStore('window-state')
if (!model) throw new Error('Store window-state is missing')
const storeHost = Endge.runtime.execute(model, {
  parent: owner, persistence: 'disabled',
})
if (!(storeHost instanceof StoreRuntimeHost)) throw new Error('Store did not mount')

const handle = await Endge.runtime.controllers.mount('endge.collection-window', {
  owner,
  props: {
    paging: 'offset', autoLoad: false,
    batchSize: 100, prefetchRows: 20, maxLoadedRows: 1000,
    retention: { beforeRows: 200, afterRows: 400 },
    request: { filter: 'all' },
  },
  dependencies: {
    state: { store: storeHost, path: 'window', update: 'window-commit' },
    load: {
      query: 'window-page', output: 'page',
      cache: { key: 'orders-pages-v1', storage: 'memory', maxEntries: 50 },
    },
  },
})
await handle.command('loadInitial')
const outputs = handle.getOutputs()
await handle.command('clearCache') // rows сохраняются
await handle.command('refresh')    // новое initial с сервера
await handle.dispose()
await session.unmount()
```

`owner` и `storeHost` создаются по [SDK-рецепту Controllers](/reference/controllers). `reset` отменяет поколение, очищает активное окно и закрепления, но сохраняет кэш. При `autoLoad:true` он может восстановить initial из кэша. `refresh` очищает текущую цепочку и кэш выборки и явно загружает initial с сервера, включая `autoLoad:false`.

`clearCache` сохраняет активные строки, отменяет старые операции и запрещает поздней записи восстановить очищенную выборку. Другие условия поиска того же namespace не удаляются. Смена `request` сохраняет прежние страницы под прежними ключами, а активное окно сбрасывает.

Retain/release защищают от вытеснения, не заменяют черновики редактора. Фоновое обновление значений может обновить закреплённую строку; перед явным reset/refresh приложение само решает судьбу несохранённых правок.

## Lifecycle и диагностика

`source` и `stale` описывают последнюю обработанную страницу, а не snapshot всего набора. `cacheStatus` сообщает `source`, `stale`, `revalidating`, `hits`, `misses`, `evictions`, `entries`, `bytes`, `pendingWrites`, `pendingBytes`, `error` и инвалидирование цепочки. Статусы записи не публикуют заново массив rows. Preview показывает outputs и `refreshPending`.

IndexedDB — best-effort cache. Очередь ограничена 32 страницами и 8 МиБ, записи одного ключа объединяются. Ошибка квоты, недоступность storage или переполнение очереди не блокируют таблицу; часть результатов может остаться несохранённой. Успешное отображение ответа не означает завершение записи на диск. `pendingWrites:0` — наблюдаемый результат завершения очереди.

Memory cache освобождается с Runtime reset; IndexedDB может пережить reload. Ключ использует фактического пользователя session provider, workspace/фасеты и эффективный live/mock режим владельца; Simulation изолирована идентичностью экземпляра. При смене пользователя, workspace, фасетов или глобального data mode Controller синхронно отменяет операции и переходит в pause. Старый экземпляр нельзя resume в новом контексте: владелец освобождает прежний scope и монтирует новый, обычно с изолированным Store. Приложение само определяет судьбу прежних отображаемых данных и черновиков при таком переходе. После pause/reset/destroy старый результат не публикуется в Store. Возвращённая страница дополнительно проверяется относительно актуальной опорной границы, поэтому вытеснение исходного блока не создаёт разрыва окна.

## Исполняемые примеры и проверка

Из каталога документации:

```sh
node docs/public/examples/controllers/page-cache.mjs --core /path/to/built/core
```

`/path/to/built/core` — каталог пакет Core с `package.json` и `dist`, не npm latest. Пример запускает свой нейтральный API и настоящие Source/Program/Store/Update/Query runtimes. Node проверяет memory; настоящую IndexedDB проверяйте в браузере.

Браузерная fixture Configurator: `/src/test/e2e/collection-window.html?cache=indexeddb&strategy=stale-while-revalidate`. Это путь локального тестового Vite server, не страница production Deploy. Автоматические тесты и performance-профиль имеют отдельные команды; benchmark results не заменяют функциональную приёмку.


### Браузерная fixture: точный запуск

Из source checkout, после сборки Core и UI Vue:

```sh
# В корне исходников Configurator
pnpm exec vite --config src/test/e2e/collection-window.vite.config.ts --host 127.0.0.1 --port 4184 --strictPort
```

Откройте `http://127.0.0.1:4184/src/test/e2e/collection-window.html?cache=indexeddb&strategy=stale-while-revalidate&maxAgeMs=1000`. Дождитесь `pendingWrites:0`; reload должен читать сохранённые страницы. Для изменения значений у условного API:

```sh
curl -X POST http://127.0.0.1:4184/__collection-window/control -H 'Content-Type: application/json' -d '{"label":"-updated"}'
```

После истечения свежести прокрутите несколько строк: фон обновит значения. `{ "shift": 1 }` меняет ключи и позволяет проверить `refreshPending`; кнопка refresh явно перестраивает окно. Остановите свой Vite процесс после проверки. Fixture предназначена для локальной проверки, не для размещения как production API.

В самостоятельном Vite browser host для built Core используйте `define: { 'process.env': {} }` и один экземпляр peer `@raphy-js/raph` из dependency graph Core. Полный Node bootstrap и выбор локального build показаны в public `load-core.mjs`; для Vue host зарегистрируйте `EndgeVuePlugin` до первого boot. Поддержка IndexedDB в Node не предполагается.

## Отдельная проверка производительности

Функциональный прогон и benchmark запускаются отдельно. Из каталога Core:

```sh
pnpm exec vitest run src/test/features/core/modules/runtime/collection-window-cache.test.ts
pnpm exec vitest bench --run src/test/features/core/modules/runtime/collection-window.bench.ts src/test/features/core/modules/runtime/page-cache.bench.ts
```

Production browser profile использует настоящий Store/Update/Query и Table. Native adapter contract собирается отдельно командой `pnpm exec vite build --config src/test/e2e/page-cache-contract.vite.config.ts --outDir /path/to/adapter-contract-dist`. Из каталога Configurator соберите два изолированных output-каталога одинаковой командой, указав для baseline `ENDGE_BENCH_CORE_ENTRY=/path/to/baseline/core/dist/core.js`, затем запустите:

```sh
pnpm exec vite build --config src/test/e2e/collection-window-performance.vite.config.ts --outDir /path/to/candidate-dist
node src/test/performance/collection-window.mjs --baseline /path/to/baseline-dist --candidate /path/to/candidate-dist --contract /path/to/adapter-contract-dist --out /path/to/private-results.json --blocks 5
```

`--smoke` выполняет только correctness admission, включая настоящую IndexedDB в Chromium, Firefox и WebKit; он не подтверждает timing. Полный профиль сохраняет отдельно viewport CPU, интервалы кадров, long tasks, latency попаданий, число запросов, heap после GC, budgets и очередь. Используйте одинаковые production-сборки и браузеры, тихий стенд, A/A и парные чередующиеся baseline/candidate блоки. Не публикуйте raw traces и heap dumps как часть документации. Команды описывают процедуру проверки; наличие профиля не является заявлением о прохождении критериев производительности candidate.
