# Overlay registry

`Overlay` - общий anchored surface для menu, popover-like panel и short-lived overlay panels. Для прикладного кода предпочтителен registry: `Overlays` объявляется один раз под `Root`, а открыть overlay можно через `RootApi.openOverlay(type, payload)`.

```nova
<Root ref="root">
  <Overlays>
    <Overlay
      type="task-menu"
      kind="menu"
      :width="220"
      :height="112"
      placement="bottom-start"
    >
      <ActionList
        :items="slot.items"
        :on-action="slot.close"
      />
    </Overlay>
  </Overlays>
</Root>
```

```ts
root.openOverlay('task-menu', {
  id: 'task-42-menu',
  value: task,
  items: [
    { id: 'open', label: 'Open' },
    { id: 'delete', label: 'Delete', tone: 'danger' },
  ],
  anchor: { kind: 'pointer', x: event.x, y: event.y },
})
```

## Anchors

В первой версии поддерживаются три anchor-типа:

- `pointer` - меню появляется у координаты клика;
- `rect` - overlay привязывается к известному прямоугольнику;
- `root` - позиционирование относительно всего Root.

`placement`, `offset` и `collision` используют общий positioning helper UI Kit. Для context menu обычно хватает `placement: 'bottom-start'`, `anchor.kind: 'pointer'` и `collision: { mode: 'shift', padding: 8 }`.

## Slot context

В custom template доступен implicit `slot.*`:

- весь payload из `openOverlay`;
- `slot.id`, `slot.type`, `slot.value`;
- `slot.anchor`;
- `slot.props` - итоговые props после merge;
- `slot.overlay` - `{ id, type, kind, index }`;
- `slot.close(event?)`;
- `slot.update(patch)`.

Priority merge: built-in defaults -> props `<Overlay type="...">` -> payload из `openOverlay`.

## Root API

`RootApi` для registry overlays:

- `openOverlay(input, payload?)`;
- `closeOverlay(id?)`;
- `closeOverlays()`;
- `updateOverlay(id, patch)`;
- `getOpenOverlayIds()`.

Несколько `<Overlays>` под одним `Root` дополняют registry. Если два source регистрируют один `type`, более поздний source переопределяет definition.
