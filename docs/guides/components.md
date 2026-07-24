# Создание интерфейса

Для исполняемого интерфейса используется ComponentSFC. Компонент описывает публичные порты, шаблон, локальную логику и стили, но не должен напрямую зависеть от внутреннего устройства Store или конкретного renderer.

## Рекомендуемый порядок

1. Определите входы и ресурсы компонента через ports.
2. Соберите шаблон из доступных UI-примитивов и компонентов.
3. Пользовательский текст получайте через `t('resource:key', fallback?)`; i18n resource регистрирует Composition.
4. Опции из внешних справочников получайте через `vocab('alias', mapping?)`; Vocab data dependency регистрирует Composition.
5. Не добавляйте i18n catalogs и Vocab-массивы в `defineProps`: это скрытый runtime-контекст, а не публичный бизнес-контракт компонента.
6. Вынесите бизнес-вычисления в Computation.
7. Вынесите подготовку коллекций в DataView.
8. Добавьте локальные EndgeCSS-стили.
9. Проверьте loading, empty, error и success-состояния.

## Граница компонента

Хороший компонент получает данные через небольшой контракт и сообщает о действиях событиями. Он не знает, какой Query загрузил данные и по какому внутреннему пути они материализованы.

## Legacy Component

Сущность `Component` хранит старую Table/DSL-конфигурацию и используется для просмотра исторических документов. Новые исполняемые интерфейсы следует создавать как `ComponentSFC`.

Синтаксис: [Component SFC](/reference/component-sfc).

Runtime-контекст: [`t()` и `vocab()`](/reference/component-sfc#функции-runtime-контекста).

Переводы: [I18n Bundle](/reference/i18n-bundle) и [resources Composition](/reference/composition#data-и-resources).

Справочники: [Vocab](/reference/vocab) и [Select](/domain/components/select).
