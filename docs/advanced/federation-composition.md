# Дочерние Federations

Federation может включать другую Federation как один composite lifecycle-узел.
Это позволяет приложению один раз вызвать root `boot(context)`, а framework
рекурсивно проведёт всё дерево через `setup -> load -> build -> start`.

## Объявление дерева

```ts
const Documents = EndgeFederation.define({
  id: 'documents',
  modules: DOCUMENT_MODULES,
})

const Workspace = EndgeFederation.define({
  id: 'workspace',
  modules: WORKSPACE_MODULES,
})

export const Application = EndgeFederation.define({
  id: 'application',
  modules: APPLICATION_MODULES,
  federations: [
    { key: 'workspace', federation: Workspace, after: 'configuration' },
    { key: 'documents', federation: Documents, after: 'workspace' },
  ],
})
```

`before` и `after` ссылаются только на sibling keys текущей Federation. В примере
root graph знает о `configuration`, `workspace` и `documents`, но не обращается к
внутренним Modules дочерних Federations.

## Lifecycle

```ts
await Application.boot(context)
await Application.build()
await Application.reset()
```

Перед первой phase framework рекурсивно конфигурирует и валидирует всё дерево:
проверяет неизвестные dependencies, ordering cycles, конфликтующие ids и повторное
присоединение child к разным parents. Затем каждая phase идёт в прямом resolved
order, а reset — в обратном.

Если любой узел boot завершается с ошибкой, уже затронутые Modules и Federations
откатываются в обратном порядке. Ошибки cleanup агрегируются вместе с исходной
причиной.

::: warning Один lifecycle owner
После присоединения `Workspace.boot()`, `Workspace.build()` и `Workspace.reset()`
нельзя вызывать напрямую. Lifecycle дочерней Federation принадлежит root.
:::

## Что не считается child Federation

Submodule остаётся внутренней частью Module. Его создаёт и сбрасывает сам Module;
framework не ищет Modules или Federations через reflection и не обходит поля
объектов автоматически.
