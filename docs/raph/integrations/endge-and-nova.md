# Встраивание в Endge и renderer host

Raph предоставляет framework-neutral data и execution primitives. Host задаёт собственные phases, lifecycle и представление.

## Core Endge

Core использует Kernel как path/meta plane, Runtime nodes как owners, PathHandle watches для bindings и `process(batch)` для update ordering. Изменения данных проходят через явные Store/Update boundaries; UI consumer подписывается на принадлежащие component owner sources.

Пользовательская Endge-конфигурация не должна создавать внутренние RaphNode вручную вместо `store(...)` или `component(...)`: runtime-hosts Core уже владеют этими объектами. Raph API нужен при разработке host/implementation, когда такая boundary явно определена.

## Абстрактный renderer

Renderer может хранить local state в owner-owned signals, отслеживать path data через watches, запрашивать именованные phases, а continuous work связывать с frame loop. Конкретные scene nodes, hit testing и drawing остаются ответственностью renderer. Их методы не входят в общий контракт Raph.

Shared Kernel допустим при общем data contract. Owners, phases, scheduler и pending work остаются независимыми для каждой runtime lane. Связь lanes проходит через path/meta plane; прямое cross-runtime reactive edge не создаётся. Подробности — [Shared Kernel](/raph/integrations/shared-kernel).
