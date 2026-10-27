# Справочники и внешние providers

Работающий контракт справочников продукта — [Vocab Source](/reference/vocab), Workspace collection `vocabs` и runtime module `Endge.vocabs`. Не следует выводить существование готового отдельного сервиса справочников из одного имени repository.

## Доступные способы подключения

| Способ | Владелец и применение |
| --- | --- |
| Source Vocab | Описывает поля, загрузку и представление справочника |
| Внешний payload | Приложение/adapter предоставляет данные по явному provider contract |
| Code provider | Зарегистрированная implementation владеет получением данных |
| Backend collection `vocabs` | Хранит документ определения, а не произвольную бизнес-БД справочных записей |

Select и Filter используют Vocab через объявленные `valuePath` и `labelPath`. Metadata задаёт отображение; она не изменяет identity варианта. Загрузка Vocab, выбор option и запрос внешнего API — разные действия. Отсутствующий provider диагностируется, а не создаётся по строковой identity.

## Статус отдельного service-vocabs

Текущий repository service-vocabs (закрыт, публичной копии нет) содержит инфраструктурный Go template и технический reference slice. Он не предоставляет готовый универсальный CRUD, синхронизацию, tenant mapping или поиск справочников Endge. Не добавляйте агенту вызовы выдуманного `/vocabs/items` API. Для конкретного payload provider используйте его опубликованный контракт и явно зарегистрируйте интеграцию host.

Точные формы документа и facade API находятся в [Core contracts](/reference/contracts/core/); способы авторинга — в [Vocab](/reference/vocab), [field](/reference/field-contracts) и [Filter](/reference/filter).
