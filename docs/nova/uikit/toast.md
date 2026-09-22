# ToastRegion и Toast

`ToastRegion` управляет stack уведомлений, а `Toast` можно использовать как одиночный item для ручной композиции.

```ts
{
  type: NovaUIKit.ToastRegion,
  props: {
    placement: 'top-right',
    limit: 4,
    autoDismiss: true,
    items: [
      { id: 'saved', title: 'Saved', message: 'Settings updated', tone: 'success' },
    ],
  },
}
```

`ToastRegion` переиспользует дочерние nodes по `id`, поэтому churn уведомлений не должен раздувать дерево.

Parts: `toastRegion.root`, `toast.root`, `icon`, `title`, `message`, `action`, `close`, `progress`. Токены: `--nova-toast-*`.
