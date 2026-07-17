# Dialog

`Dialog` - низкоуровневый overlay surface поверх ближайшего UI Kit root. Он может быть modal или non-modal, с dimmer/backdrop, произвольным DSL body, close button, drag и resize.

```ts
{
  type: NovaUIKit.Dialog,
  props: {
    open,
    title: 'Edit item',
    draggable: true,
    resizable: true,
    onOpenChange: next => open = next,
  },
  children: [
    { type: NovaUIKit.TextBlock, props: { text: 'Any DSL content' } },
  ],
}
```

Внешний trigger не входит в компонент. Пользователь управляет `open` из handlers кнопок, shortcuts или API.

Parts: `backdrop`, `surface`, `header`, `body`, `footer`, `close`, `dragHandle`, `resizeHandle`. Токены: `--nova-dialog-*`.

## Dialogs registry

Для прикладного кода предпочтителен декларативный registry. `Dialogs` описывается под `Root`, а открыть диалог можно через `RootApi.openDialog(type, payload)`:

```nova
<Root ref="root">
  <Dialogs>
    <Dialog type="confirm" :width="420" :height="240">
      <Flex direction="column" :gap="8">
        <TextBlock :text="slot.title" />
        <TextBlock :text="String(slot.value)" />
        <Button text="Закрыть" :on-press="slot.close" />
      </Flex>
    </Dialog>

    <Dialog
      type="sheet"
      placement="right"
      :width="360"
      :height="420"
      :modal="false"
      :backdrop="false"
      class-name="sheet"
    />
  </Dialogs>
</Root>
```

```ts
root.openDialog('confirm', {
  id: 'remove-task',
  title: 'Удалить задачу',
  value: 'Это действие нельзя отменить.',
  placement: 'center',
  draggable: true,
})

root.openDialog({
  type: 'sheet',
  id: 'task-details',
  title: 'Детали',
  value: task,
  width: 420,
})
```

Если `Dialogs` не объявлен, `openDialog({ title, value })` открывает встроенный `default` dialog: title/description берутся из props, body строится из `value`.

## Slot context

В custom template доступен implicit `slot.*`, без `v-slot`:

- весь payload из `openDialog`;
- `slot.id`, `slot.type`, `slot.value`;
- `slot.props` - итоговые нормализованные props после merge;
- `slot.dialog` - `{ id, type, index }`;
- `slot.close(event?)`;
- `slot.update(patch)`.

Priority merge: built-in default props -> props `<Dialog type="...">` -> payload/local overrides из `openDialog`.

## Параметры

Поддерживаются основные props `Dialog`: `title`, `description`, `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight`, `placement`, `position`, `modal`, `backdrop`, `dismiss`, `closeButton`, `draggable`, `resizable`, `scale`, `padding`, `background`, `color`, `border`, `fontFamily`, `fontSize`, `lineHeight`, `className`, `attrs`, `onOpenChange`, `onMove`, `onResize`.

`RootApi` для registry-диалогов:

- `openDialog(input, payload?)`;
- `closeDialog(id?)`;
- `closeDialogs()`;
- `updateDialog(id, patch)`;
- `getOpenDialogIds()`.

На один `Root` создается один `RootDialogControllerNode`. Он хранит registry, stack открытых dialogs и reconciles overlay subtree. Несколько `<Dialogs>` только дополняют или переопределяют registry типов.

## Styling

Встроенный chrome читает NovaCSS vars:

- `--nova-dialog-background`;
- `--nova-dialog-color`;
- `--nova-dialog-border-color`;
- `--nova-dialog-font-family`;
- `--nova-dialog-description-color`;
- `--nova-dialog-body-color`;
- `--nova-dialog-backdrop-background`;
- `--nova-dialog-drag-handle-background`;
- `--nova-dialog-resize-handle-background`.

Для типов можно использовать props на `<Dialog type="...">`, local overrides в `openDialog`, `className` и selectors Root style engine:

```css
Dialog.danger {
  background: #fff7ed;
  color: #9a3412;
  borderColor: #fed7aa;
}

Dialog.sheet {
  background: #f8fafc;
  borderColor: #bfdbfe;
}
```
