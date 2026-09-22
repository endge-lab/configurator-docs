# Оптимизация загрузки и изоляция динамического контекста

Направление объединяет две связанные потребности:

1. уменьшить начальную загрузку через code splitting и lazy loading;
2. не допустить попадания данных одного выбранного контекста в bundle или сессию другого.

## Зачем это нужно

Большой монолитный bundle увеличивает время загрузки и разбора JavaScript.
Одновременно build-time подстановка клиентских данных создаёт риск раскрытия:
динамический фасет может представлять заказчика, регион, подразделение или любую
другую выбранную ось, но её конкретные данные не должны встраиваться в общий
application artifact.

## Текущее состояние

- страницы, widgets и тяжёлые editors частично загружаются динамически;
- приложение имеет один Vite entry и общие vendor chunks;
- Domain загружается после выбора backend и Workspace;
- Context разрешает выбранные документы активных фасетов во время boot;
- формального audit gate для поиска contextual data в собранных chunks пока нет.

## Целевой контракт

### Build artifact не содержит contextual data

- identity и содержимое конкретных facet documents, персональные и
  конфиденциальные данные не подставляются в source через build-time env;
- Domain и configuration contributions приходят только из авторизованного API или
  явно переданного runtime snapshot;
- отдельные customer-specific builds, если они когда-нибудь появятся, хранятся и
  распространяются как разные artifacts.

### Lazy loading следует feature boundary

- первый экран загружает только bootstrap, auth, выбор backend/Workspace и
  критический UI;
- Monaco, графы, debugger и другие тяжёлые возможности подключаются при входе в
  соответствующую feature;
- shared chunk содержит общий код, но не authored Domain data;
- feature registry не импортирует все реализации eagerly в корне приложения.

### Runtime isolation следует полному scope

- cache и persisted UI state изолируются по Workspace, упорядоченной map выбранных
  документов фасетов и user;
- backend авторизует Workspace и не полагается на client-side фильтрацию;
- переключение structural context выполняет reset/boot, не смешивая Program и
  runtime state разных selections.

## Проверка

- bundle analysis показывает состав начального и lazy chunks;
- artifact scan проверяет отсутствие известных contextual identities и secret
  material;
- browser scenario переключает selection и подтверждает новый boot без повторного
  использования прежнего Program/runtime state;
- backend access tests подтверждают, что другой Workspace нельзя получить прямым
  запросом.

## Риски

Избыточный code splitting увеличивает количество сетевых запросов, а поиск только
по известным строкам не доказывает отсутствие всех утечек. Нужны одновременно
архитектурная граница, artifact audit и runtime/access проверки.
