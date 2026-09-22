# ActionList

`ActionList` - универсальный список действий для меню, context menu, command list и listbox-сценариев. Отдельный `Menu` не нужен: внешний код сам открывает `Popover`, а внутри кладет `ActionList`.

## Базовый пример

```ts
{
  type: NovaUIKit.ActionList,
  props: {
    items: [
      { id: 'copy', label: 'Copy', shortcut: 'Meta+C' },
      { type: 'separator' },
      { id: 'delete', label: 'Delete', tone: 'danger' },
    ],
    onAction: item => runCommand(item.id),
  },
}
```

Поддерживаются `item`, `separator`, `group`, `checkbox`, `radio`, `submenu`, disabled/selected/checked состояния, keyboard navigation и `onValueChange`.

## Кастомизация

Основные parts: `root`, `item`, `icon`, `label`, `description`, `shortcut`, `checkmark`, `separator`, `group`, `submenu`. Токены начинаются с `--nova-action-list-*`.
