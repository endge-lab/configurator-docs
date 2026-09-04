# Federation

Federation — расширяемая модель композиции runtime-возможностей Endge. Она
объединяет корневые Modules, задаёт их порядок и проводит через общий lifecycle.
Приложение может использовать готовую Federation, определить собственную или
скомпоновать несколько независимых Federations.

Federation не обязательна для каждой feature. Она оправдана, когда функциональный
блок владеет несколькими Modules, общим lifecycle или orchestration. Простая
stateless-утилита и feature без такого владельца остаются обычным functional root.

## Модель расширения

```mermaid
flowchart TB
  APP["Конечное приложение"] --> FED["Federation<br/>composition и lifecycle"]
  FED --> MODULE_A["Module A<br/>state и public API"]
  FED --> MODULE_B["Module B<br/>state и public API"]
  FED --> MODULE_C["Module C<br/>state и public API"]
  MODULE_B --> SUBMODULE_A["Submodule B.1"]
  MODULE_B --> SUBMODULE_B["Submodule B.2"]

  class APP endgePackage
  class FED endgeFederation
  class MODULE_A,MODULE_B,MODULE_C endgeModule
  class SUBMODULE_A,SUBMODULE_B endgeSubmodule
```

Federation управляет lifecycle только корневых Modules. Если Module состоит из
submodules, он сам создаёт их, открывает через свой public API и передаёт им
lifecycle. Federation не обходит родителя и не управляет его потомками напрямую.

## Runtime identity и singleton

Federation используется как статический facade, но её изменяемое runtime-состояние
хранится в общем host. Host определяется не именем TypeScript-класса, а стабильным
`federationId`.

```mermaid
flowchart LR
  PACKAGE_A["Package A<br/>Federation facade"] --> REGISTRY[("globalThis<br/>Federation registry")]
  PACKAGE_B["Package B<br/>другая копия facade"] --> REGISTRY
  REGISTRY --> HOST["Один Federation host<br/>id = aodb"]
  HOST --> MODULES["Общий graph Modules"]

  class PACKAGE_A,PACKAGE_B endgePackage
  class REGISTRY endgeRegistry
  class HOST endgeFederation
  class MODULES endgeModule
```

Несколько copies одного package в одном JavaScript realm получают общий host,
если используют одинаковый `federationId`. Это предотвращает дублирование
Modules и lifecycle в конечном приложении.

::: warning Runtime-граница
Singleton действует в пределах одного JavaScript realm — конкретного
`globalThis`. Другая browser-вкладка, Worker, iframe с отдельным realm или другой
Node.js process имеет собственный registry.
:::

## Контракт identity

- `id` — стабильная runtime identity Federation;
- `name` — отображаемое имя для diagnostics и сообщений;
- один `id` соответствует одному module graph;
- независимые Federations используют разные ids;
- разные декларации с одинаковым id не должны описывать разные наборы Modules.

Коллизия ids не создаёт второй host: определения начинают разделять состояние,
а первая выполненная конфигурация определяет graph. Поэтому id должен быть
глобально уникальным внутри приложения и сохраняться между versions Federation.

## Дальше

1. Выберите [структуру feature](./functional-structure).
2. Определите ownership [Modules и submodules](./modules).
3. Соберите Federation через [`EndgeFederation.define(...)`](./defining-federation).
