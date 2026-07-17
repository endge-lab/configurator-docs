# timeRange

`timeRange` задает доступный и видимый диапазон времени.

```ts
options: {
  timeRange: { min, max, start, end },
}
```

## Правила

`start` и `end` должны попадать в `min/max`. Для программного фокуса на задачу обычно достаточно `focusOnTask`, а не ручного пересчета диапазона.
