# Modules и submodules

Module — владелец связного runtime-состояния, public API и lifecycle одной
ответственности. Federation координирует корневые Modules, но не переносит их
business logic в собственный class.

## Lifecycle Module

Module может участвовать в пяти фазах:

```mermaid
flowchart LR
  SETUP["setup<br/>dependencies и registries"] --> LOAD["load<br/>входные данные"]
  LOAD --> BUILD["build<br/>normalize и compile"]
  BUILD --> START["start<br/>subscriptions и runtime"]
  START --> RESET["reset<br/>cleanup и новый запуск"]

  class SETUP,LOAD,BUILD,START endgeProcess
  class RESET endgeTerminal
```

- `setup` подготавливает dependencies, clients и registries;
- `load` принимает или загружает принадлежащие Module данные;
- `build` нормализует, валидирует, индексирует и компилирует;
- `start` запускает subscriptions, watchers и живую инфраструктуру;
- `reset` освобождает ресурсы и возвращает Module в повторно запускаемое состояние.

Module переопределяет только необходимые методы. Federation проводит корневые
Modules через общий pipeline и учитывает их `before`/`after` ordering.

## Submodule

Submodule является полноценным Module, но его owner — родительский Module, а не
Federation.

Родитель:

- явно создаёт submodules;
- предоставляет доступ к ним через собственный public API;
- вызывает их lifecycle в своих lifecycle methods;
- выполняет cleanup в безопасном, обычно обратном, порядке;
- включает их snapshots в собственную persistence schema, если persistence нужна.

```ts
export class Diagnostics_Module extends EndgeModule {
  public readonly telemetry = new Telemetry_Module()
  public readonly problems = new Problems_Module()

  public override async start(): Promise<void> {
    await this.telemetry.start()
    await this.problems.start()
  }

  public override async reset(): Promise<void> {
    await this.problems.reset()
    await this.telemetry.reset()
  }
}
```

Federation не обнаруживает submodules через reflection и не обходит поля Module.
Порядок lifecycle потомков является явным контрактом родителя.

## State и persistence

Federation не сохраняет Module state автоматически. Persistent Module сам владеет:

- storage contract или специализированным persistence Service;
- snapshot schema и её versioning;
- моментом сохранения;
- порядком восстановления собственных submodules.

Локальный UI-state остаётся в компоненте, если он не должен переживать lifecycle
компонента. Он становится состоянием Module только при наличии общего owner и
реального runtime-сценария.
