# Опции

`options` содержит доменные настройки timeline. Их можно передать через prop `options` или обновить через ref API. Иерархия ниже показана через dot-path: `groups.columns[].data` означает поле `data` внутри элемента массива `groups.columns`.

:::example id="timeline-chart-options" layout="tabs"
:::

## TimelineOptions

| Опция | Тип | По умолчанию | Значения | Описание |
| --- | --- | --- | --- | --- |
| `locale` | `string` | `ru-RU` | BCP 47 locale: `ru-RU`, `en-US` | Локаль форматирования подписей временной шкалы. |
| `timezone` | `string` | `UTC` | IANA timezone или offset: `Europe/Moscow`, `UTC`, `+03:00` | Временная зона для отображения дат. Offset нормализуется во внутреннюю timezone. |
| `timeRange` | `TimelineTimeRangeOptions` | `now - 8h` до `now + 8h` | object | Общий доступный диапазон времени и видимое окно. |
| `timeRange.min` | `number` | `now - 8h` | timestamp ms | Левая граница доступного диапазона. |
| `timeRange.max` | `number` | `now + 8h` | timestamp ms | Правая граница доступного диапазона. |
| `timeRange.start` | `number` | `now - 8h` | timestamp ms | Начало видимого окна. |
| `timeRange.end` | `number` | `now + 8h` | timestamp ms | Конец видимого окна. |
| `timeScale` | `TimelineTimeScaleOptions` | object | object | Верхняя временная шкала, ticks и форматирование подписей. |
| `timeScale.enabled` | `boolean` | `true` | `true`, `false` | Показывает или скрывает временную шкалу. |
| `timeScale.height` | `number` | `40` | px | Высота области шкалы. |
| `timeScale.format` | `Array<TimeScaleFormat>` | default formats | array | Правила minor и major labels для разных интервалов. |
| `timeScale.format[].interval` | `number` | зависит от правила | ms | Минимальный интервал, к которому применяется формат. |
| `timeScale.format[].format` | `Intl.DateTimeFormatOptions` | зависит от правила | object | Формат minor label. |
| `timeScale.format[].majorFormat` | `Intl.DateTimeFormatOptions` | зависит от правила | object | Формат major label. |
| `timeScale.minTickWidthPx` | `number` | `50` | px | Минимальная ширина tick перед укрупнением шага. |
| `timeScale.maxTicksInView` | `number` | `15` | number | Верхний лимит количества ticks в текущем viewport. |
| `groups` | `TimelineGroupsOptions<G>` | object | object | Левая панель групп и ее колонки. |
| `groups.visible` | `boolean` | `true` | `true`, `false` | Показывает или скрывает левую панель групп. |
| `groups.columns` | `Array<GroupColumnInput<G>>` | `[]` | array | Описывает таблицу групп. |
| `groups.columns[].id` | `string` | required | string | Стабильный id колонки. |
| `groups.columns[].title` | `string` | required | string | Заголовок колонки. |
| `groups.columns[].data` | `(group: G) => string` | required | function | Возвращает текст ячейки. |
| `groups.columns[].width` | `number` | required | px | Ширина колонки. |
| `groups.order` | `null` или function | `null` | `(a, b) => number` | Сортирует группы перед layout. |
| `groups.filter` | `null` или function | `null` | `(group) => boolean` | Оставляет только группы, для которых функция вернула `true`. |
| `groups.paddingY` | `number` | `3` | px | Вертикальный padding внутри строк групп. |
| `groups.tree` | `TimelineGroupsTreeOptions` | object | object | Настройки вложенных групп через `parentId`. |
| `groups.tree.enabled` | `boolean` | `false` | `true`, `false` | Явно включает tree mode. Также включается автоматически, если у группы есть `parentId`. |
| `groups.tree.defaultExpanded` | `boolean` | `true` | `true`, `false` | Начальное раскрытие групп без собственного `expanded`. |
| `groups.tree.indent` | `number` | `18` | px | Горизонтальный отступ одного уровня вложенности. |
| `groups.tree.disclosureColumnId` | `string \| null` | первая колонка | id колонки | Колонка, где отображается и обрабатывается marker раскрытия. |
| `tasks` | `TimelineTasksOptions<T>` | object | object | Фильтр, высота строк и базовая отрисовка задач. |
| `tasks.filter` | `null` или function | `null` | `(task) => boolean` | Оставляет только задачи, для которых функция вернула `true`. |
| `tasks.height` | `number` | `30` | px | Базовая высота task body. |
| `tasks.rowGap` | `number` | `5` | px | Вертикальный зазор между строками задач. |
| `tasks.graphicsEnabled` | `boolean` | `true` | `true`, `false` | Включает или отключает графическую отрисовку задач. Полезно для диагностики. |
| `profiles` | `TimelineProfilesOptions` | `{}` | object | Единый выбор id visual profile для задач, backgrounds, points и links. |
| `profiles.tasks.by` | `string` или function | none | field name или `(task) => string` | Выбирает task profile из DSL/`taskProfiles`. |
| `profiles.tasks.default` | `string` | none | profile id | Fallback id для обычных задач. |
| `profiles.backgrounds.by` | `string` или function | none | field name или `(task) => string` | Выбирает background profile для задач с `type: 'background'`. |
| `profiles.backgrounds.default` | `string` | none | profile id | Fallback id для background-интервалов. |
| `profiles.points.by` | `string` или function | none | field name или `(point) => string` | Выбирает point profile из DSL/`visualProfiles`. |
| `profiles.points.default` | `string` | none | profile id | Fallback id для points. |
| `profiles.links.by` | `string` или function | none | field name или `(link) => string` | Выбирает link profile из DSL/`visualProfiles`. |
| `profiles.links.default` | `string` | none | profile id | Fallback id для links. |
| `ungroupedPanel` | `TimelineUngroupedPanelOptions` | object | object | Нижняя панель для задач с `groupId: null`. |
| `ungroupedPanel.enabled` | `boolean` | `true` | `true`, `false` | Показывает нижнюю панель задач без группы. |
| `ungroupedPanel.height` | `number` | `200` | px | Высота панели. |
| `ungroupedPanel.title` | `string` | `Неназначенные задачи` | string | Заголовок панели. |
| `viewport` | `TimelineViewportOptions` | object | object | Scroll offsets и ограничения zoom. |
| `viewport.mainScrollY` | `number` | `0` | px | Вертикальный scroll основной области. |
| `viewport.ungroupedScrollY` | `number` | `0` | px | Вертикальный scroll ungrouped panel. |
| `viewport.minDurationMs` | `number` | `60000` | ms | Минимальная длительность видимого окна при zoom in. |
| `viewport.maxDurationMs` | `number` | `2678400000` | ms | Максимальная длительность видимого окна при zoom out. |
| `scroll` | `TimelineScrollOptions` | object | object | Включает или скрывает scrollbars timeline. |
| `scroll.horizontalBarEnabled` | `boolean` | `true` | `true`, `false` | Показывает горизонтальный scrollbar времени. |
| `scroll.mainVerticalBarEnabled` | `boolean` | `true` | `true`, `false` | Показывает вертикальный scrollbar основной области. |
| `scroll.ungroupedVerticalBarEnabled` | `boolean` | `true` | `true`, `false` | Показывает вертикальный scrollbar ungrouped panel. |
| `selection` | `Array<SelectionConfig>` | single click select-only | array | Правила пользовательского выделения. Multi-select включается явным rule с `toggle`. |
| `selection[].enabled` | `boolean` | required | `true`, `false` | Включает правило selection. |
| `selection[].mode` | `Array<KeyMod>` | required | `single`, `Ctrl`, `Meta`, `Shift`, `Alt`, `Fn` | Какие модификаторы должны быть активны. |
| `selection[].trigger` | `Array<InputEventKind>` | required | `click`, `context`, `dblclick`, `mousedown`, `mouseup` | Какие input-события запускают правило. |
| `selection[].target` | `Array<SelectionTarget>` | required | `chart`, `task`, `point`, `link` | Где должен произойти input. |
| `selection[].handler` | `Array<SelectOp>` | required | `none`, `toggle`, `select`, `deselect`, `select-only`, `clear-all`, `select-all`, `select-others`, `select-outside-only` | Операция над текущим набором выделения. |
| `selectionScope` | `exclusive \| mixed` | `exclusive` | `exclusive`, `mixed` | Совмещать ли task selection с point/link selection. |
| `annotations` | `TimelineAnnotationOptions` | enabled | object | Настройки points, links, ports и routing. |
| `annotations.ports.tasks` | `TimelinePortInput` | `top/right/bottom/left` | object/array/false | Порты задач для links. |
| `annotations.ports.points` | `TimelinePortInput` | `top/right/bottom/left` | object/array/false | Порты points для links. |
| `annotations.ports.invalid` | `string` | `hide-link` | `hide-link`, `fallback-nearest`, `warn` | Политика некорректных портов. |
| `annotations.points.selectable` | `boolean \| object` | `true` | boolean/object | Базовая selectable policy для points. |
| `annotations.points.editable` | `boolean \| object` | `false` | boolean/object | Базовая editable policy для points. |
| `annotations.links.selectable` | `boolean \| object` | `true` | boolean/object | Базовая selectable policy для links. |
| `annotations.links.editable` | `boolean \| object` | `false` | boolean/object | Базовая editable policy для links. |
| `grid` | `GridConfig` | `plain` | `plain`, `striped` | Сетка chart area. |
| `grid.type` | `string` | `plain` | `plain`, `striped` | Режим сетки. |
| `grid.horizontal.color` | `string` | `#c5c5c5` | CSS color | Цвет горизонтальных линий. |
| `grid.horizontal.width` | `number` | `0.5` | px | Толщина горизонтальных линий. |
| `grid.horizontal.accent` | `string` | none | CSS color | Только для `striped`: цвет горизонтального accent. |
| `grid.vertical.major.color` | `string` | `#c5c5c5` | CSS color | Цвет major vertical lines. |
| `grid.vertical.major.width` | `number` | `0.5` | px | Толщина major vertical lines. |
| `grid.vertical.minor.color` | `string` | `#c5c5c5` | CSS color | Цвет minor vertical lines. |
| `grid.vertical.minor.width` | `number` | `0.5` | px | Толщина minor vertical lines. |
| `grid.vertical.accent` | `string` | none | CSS color | Только для `striped`: цвет вертикального accent. |
| `snap` | `TimelineSnap` | `null` | `null` или object | Привязка времени при drag/edit. |
| `snap.scale` | `string` | none | `millisecond`, `second`, `minute`, `hour`, `day`, `month`, `year` | Единица округления. |
| `snap.step` | `number` | none | positive number | Шаг округления в выбранной единице. |
| `tooltipDelay` | `number` | `300` | ms | Короткое поле задержки tooltip; синхронизируется с `tooltip.delay`. |
| `tooltip` | `TimelineTooltipOptions<G, T>` | object | object | Runtime tooltip над задачами. |
| `tooltip.enabled` | `boolean` | `true` | `true`, `false` | Включает tooltip. |
| `tooltip.delay` | `number` | `300` | ms | Задержка появления. |
| `tooltip.hideDelay` | `number` | `80` | ms | Задержка скрытия. |
| `tooltip.trigger` | `TooltipTrigger` | `{ pointer: 'hover' }` | object | Какие pointer-события открывают tooltip. |
| `tooltip.placement` | `string` | `cursor` | `cursor`, `top`, `right`, `bottom`, `left` | Базовое размещение tooltip. |
| `tooltip.position` | `string` или function | `cursor` | `cursor`, `task`, function | Полное управление anchor-позицией. |
| `tooltip.position().x` | `number` | required for custom anchor | px | X координата tooltip anchor. |
| `tooltip.position().y` | `number` | required for custom anchor | px | Y координата tooltip anchor. |
| `tooltip.position().width` | `number` | optional | px | Ширина anchor, если tooltip позиционируется от прямоугольника. |
| `tooltip.position().height` | `number` | optional | px | Высота anchor. |
| `tooltip.position().placement` | `string` | optional | `cursor`, `top`, `right`, `bottom`, `left` | Placement для конкретного anchor. |
| `tooltip.followCursor` | `boolean` | `true` | `true`, `false` | Двигает tooltip за курсором. |
| `tooltip.className` | `string` или `Array<string>` | `timeline-tooltip` | CSS class names | Классы внешнего контейнера tooltip. |
| `tooltip.contentClassName` | `string` или `Array<string>` | `timeline-tooltip__content` | CSS class names | Классы внутреннего content. |
| `tooltip.resolveContent` | function | default template | `(ctx) => NovaSchema или null` | Возвращает кастомный Nova schema для tooltip. |
| `interaction` | `TimelineInteractionOptions` | object | object | Гранулярные жесты изменения задач, точек и связей. |
| `interaction.tasks.drag.moveGroup` | pointer action | left + none + body | object | Перетаскивание задачи между группами. |
| `interaction.tasks.drag.moveTime` | pointer action | left + Meta/Ctrl/Alt + body | object | Перемещение задачи по времени целиком. |
| `interaction.tasks.drag.resizeStart` | pointer action | left + Meta/Ctrl/Alt + start-edge | object | Изменение начала задачи. |
| `interaction.tasks.drag.resizeEnd` | pointer action | left + Meta/Ctrl/Alt + end-edge | object | Изменение окончания задачи. |
| `interaction.points.drag.moveTime` | pointer action | left + Meta/Ctrl/Alt + point | object | Перемещение точки по X/time. |
| `interaction.points.drag.moveGroup` | pointer action | left + none + point | object | Перемещение свободной точки между группами. |
| `interaction.links.drag.reconnectFrom` | pointer action | left + none + from-handle | object | Переподключение начального endpoint связи. |
| `interaction.links.drag.reconnectTo` | pointer action | left + none + to-handle | object | Переподключение конечного endpoint связи. |
| `interaction.*.enabled` | `boolean` | `true` | `true`, `false` | Включает конкретное действие. |
| `interaction.*.buttons` | `Array<'left' \| 'middle' \| 'right'>` | `['left']` | array | Кнопки pointer gesture. |
| `interaction.*.modifiers` | `Array<modifier>` | varies | `none`, `Meta`, `Ctrl`, `Shift`, `Alt`, `Fn`, combo object | Клавиши, при которых action активен. Несколько значений работают как OR. |
| `interaction.*.area` | `string` | varies | `body`, `start-edge`, `end-edge`, `point`, `segment`, handles, `any` | Часть сущности, в которую должен попасть пользователь. |
| `interaction.*.edgeSizePx` | `number` | `10` | px | Ширина edge-зоны для task resize actions. |
| `clusterThresholdPx` | `number` | `0` | px | Минимальная экранная близость задач для объединения в cluster. `0` отключает кластеризацию. |
| `executor` | `{ delay, maxDelay }` | object | object | Буферизация частых updates/options updates. |
| `executor.delay` | `number` | `1000` | ms | Минимальная задержка перед применением накопленного update. |
| `executor.maxDelay` | `number` | `1000` | ms | Максимальная задержка, после которой update должен быть применен. |
| `rendering` | `TimelineRenderingOptions` | object | object | LOD, text renderer modes и deferred text во время взаимодействия. |
| `rendering.taskTextVisible` | `boolean` | `true` | `true`, `false` | Глобально включает текст внутри task, task-group и cluster templates. |
| `rendering.taskText` | object | object | object | Настройки compiled text recipes. |
| `rendering.taskText.visible` | `boolean` | `true` | `true`, `false` | Включает compiled text recipes. |
| `rendering.taskText.mode` | `string` | `lod` | `always`, `lod` | Показывать labels всегда или через LOD. |
| `rendering.taskText.minTaskWidthPx` | `number` | `42` | px | Минимальная ширина задачи для label. |
| `rendering.taskText.minTaskHeightPx` | `number` | `14` | px | Минимальная высота задачи для label. |
| `rendering.taskText.maxVisibleLabels` | `number` | `4000` | number | Верхний лимит видимых labels. |
| `rendering.taskText.hysteresisPx` | `number` | `8` | px | Запас против частого мигания labels на границе LOD. |
| `rendering.taskText.zoomBuckets` | `Array<number>` | `0.5..4` | array | Buckets для text raster/cache. |
| `rendering.taskText.prewarmAdjacentBuckets` | `boolean` | `true` | `true`, `false` | Подготавливает соседние zoom buckets. |
| `rendering.taskText.rasterBudgetMs` | `number` | `3` | ms | Бюджет rasterization text за проход. |
| `rendering.taskText.interaction` | `string` | `stable` | `stable`, `defer` | Поведение labels во время interaction. |
| `rendering.textModes` | `TimelineTextModeOptions` | object | object | Режимы Nova text renderer по зонам. |
| `rendering.textModes.timeScale` | `TimelineTextRenderMode` | `glyph-atlas` | `auto`, `run-atlas`, `glyph-atlas`, `msdf` | Режим текста временной шкалы. |
| `rendering.textModes.taskLabels` | `TimelineTextRenderMode` | `glyph-atlas` | `auto`, `run-atlas`, `glyph-atlas`, `msdf` | Режим labels задач. |
| `rendering.textModes.uiLabels` | `TimelineTextRenderMode` | `glyph-atlas` | `auto`, `run-atlas`, `glyph-atlas`, `msdf` | Режим UI labels. |
| `rendering.textDeferred` | `TimelineTextDeferredRenderingOptions` | object | object | Упрощение text/detail во время активного взаимодействия. |
| `rendering.textDeferred.enabled` | `boolean` | `true` | `true`, `false` | Включает deferred text во время interaction. |
| `rendering.textDeferred.mode` | `string` | `body-only` | `text-off`, `body-only` | Что скрывать во время interaction. |
| `rendering.textDeferred.idleMs` | `number` | `120` | ms | Через сколько вернуть полный текст после interaction. |
| `taskGrouping` | `TaskGroupingOptions<T>` | object | object | Группировка нескольких задач в task-group. |
| `taskGrouping.enabled` | `boolean` | `false` | `true`, `false` | Включает task groups. |
| `taskGrouping.getGroupKey` | function | `task.taskGroupKey` | `(task) => string или null` | Возвращает ключ группировки. |
| `taskGrouping.minTasksInGroup` | `number` | `2` | number | Минимальное количество задач для создания task group. |
| `taskGrouping.custom` | object или function | none | object или `(ctx) => object` | Добавляет пользовательские данные в runtime task group. |

## Диапазон, viewport и scroll

`timeRange` отвечает за время, которое может показать timeline. `min` и `max` задают доступные границы, а `start` и `end` - текущее видимое окно. `timeScale` форматирует верхнюю шкалу и выбирает плотность ticks.

```ts
const options = {
  timeRange: {
    min: start - 60 * 60 * 1000,
    max: start + 8 * 60 * 60 * 1000,
    start,
    end: start + 4 * 60 * 60 * 1000,
  },
  timeScale: {
    enabled: true,
    minTickWidthPx: 56,
    maxTicksInView: 14,
  },
}
```

## Profiles

`profiles` выбирает id уже объявленного DSL/recipe profile. Сами шаблоны остаются в `TimelineTaskProfile`, `TimelineChart.PointProfile`, `TimelineChart.LinkProfile`, `TimelineChart.BackgroundProfile` или в prop `taskProfiles`/`visualProfiles`.

```ts
const options = {
  profiles: {
    tasks: { by: 'status', default: 'default' },
    backgrounds: { by: task => task.kind, default: 'default' },
    points: { by: 'kind', default: 'milestone' },
    links: { by: link => link.kind, default: 'dependency' },
  },
}
```

Для всех сущностей порядок одинаковый: `by(entity)`, затем `entity.profile`, `entity.kind`, `default`.

`viewport` ограничивает zoom и хранит vertical scroll offsets. `scroll` управляет видимостью scrollbars. Для экранов с большим количеством групп обычно включают основной vertical scrollbar, а для компактных previews его можно скрыть.

```ts
const options = {
  viewport: {
    minDurationMs: 30 * 60 * 1000,
    maxDurationMs: 8 * 60 * 60 * 1000,
    mainScrollY: 0,
  },
  scroll: {
    horizontalBarEnabled: true,
    mainVerticalBarEnabled: true,
    ungroupedVerticalBarEnabled: true,
  },
}
```

## Не входит в TimelineOptions

`width`, `height`, `renderer`, `loop`, `maxDpr`, `theme`, `themes`, `styleSheet`, `assets`, `plugins`, `taskProfiles`, `visualProfiles`, `uiTemplates`, `devtools` и `sync` являются props Vue-компонента `TimelineChart`. Они не входят в `TimelineOptions`: `taskProfiles` и `visualProfiles` объявляют шаблоны, а `options.profiles` выбирает их id.

## Полный пример

:::example id="timeline-chart-all-options" layout="tabs" display="code-only" height="clamp(600px, 96vh, 840px)"
:::
