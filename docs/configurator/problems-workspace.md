# Рабочая область Problems

**Problems** — самостоятельная рабочая область конфигуратора для актуальных authoring, build и runtime problems. Она использует `Endge.diagnostics.problems` напрямую и не создаёт копию registry в Pinia или моделях доменных сущностей.

## Сценарий работы

1. Нажмите **Problems** в верхней группе левой панели.
2. Обычное Project tree сменится собственным problem-centric деревом.
3. Выберите проблемную сущность слева.
4. В основной части откроются вкладки `Authoring`, `Build` и `Runtime`, если в соответствующих фазах есть problems.
5. Выберите problem, чтобы увидеть message, code, source range, telemetry correlation и технические attributes.
6. Нажмите `Escape`, чтобы снова активировать Project и вернуться к обычным вкладкам документов.

Переключение рабочей области не удаляет problems и не закрывает вкладки документов. Оно меняет только левую навигацию и центральное представление.

## Иерархия дерева

Problems tree не повторяет папки и порядок исходного проекта. Это отдельная projection текущего problem registry:

```text
Критические
  PaymentRuntime       1F
Ошибки
  FlightTable          3E 1W
  ArrivalFilter        1E
Предупреждения
  FlightDetails        2W
```

Сущность находится под своей максимальной текущей severity и показывается один раз, даже если problems появились в нескольких фазах. В центральной области они разделяются по phase-вкладкам.

## Детализация

Для выбранной problem интерфейс показывает:

- severity, code и message;
- phase и время последнего обновления;
- `sourcePath` и range, если producer их передал;
- `traceId` и telemetry `recordId` для корреляции;
- flat technical attributes в сворачиваемой секции.

Кнопка **Открыть сущность** возвращает к Project workspace и открывает persisted document. Для runtime-only owner эта кнопка не показывается.

## Та же детализация в редакторе сущности

Центральная область Problems workspace и вкладка **Диагностика** в редакторе используют один `EntityProblemsPanel`. Поэтому message, severity, phase-вкладки, source range, telemetry correlation и empty state выглядят и ведут себя одинаково в обоих местах.

Редактор передаёт панели только `entityRef`. Панель реактивно читает актуальный набор из `Endge.diagnostics.problems` и не хранит локальную JSON-копию diagnostics. Если problem registry не содержит записей для сущности, вкладка показывает состояние **«Проблем не обнаружено»**.

В первой версии общая панель подключена к source-first редакторам Composition, Computation, Filter, DataView, Store, Mock, Query и Component SFC. Query и Component SFC получили отдельную вкладку **Диагностика** вместе с этой унификацией.

Compiler может публиковать generic entity type, например `query` или `filter`. Перед открытием configurator разрешает такую ссылку через текущий domain: `query` превращается в фактический `query-rest`, `query-gql` или `query-custom`, а документ открывается по стабильной `identity`, а не по transport-specific storage ID. Если исходный документ удалён или для типа не зарегистрирован editor, configurator остаётся в Problems и показывает предупреждение.

## Граница с telemetry

Problems отвечает на вопрос «что сломано сейчас». Повторный successful build удаляет исправленные build problems через replace semantics.

Pulse и другие telemetry views отвечают на вопрос «что происходило». Они хранят logs, spans и повторяющиеся runtime occurrences. Поэтому прежний нижний Errors widget удалён: он смешивал replaceable problem state и telemetry history в одной панели.

## Keyboard navigation

`Escape` обрабатывается в bubble phase. Открытый dialog или context menu может первым обработать и отменить событие. После его закрытия следующее нажатие `Escape` возвращает из Problems к Project. Полный список комбинаций находится в разделе [«Горячие клавиши редактора»](/configurator/editor-hotkeys).
