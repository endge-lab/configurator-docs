# interaction

`interaction` задает, каким жестом пользователь меняет данные timeline. `editable` по-прежнему отвечает за разрешения, а `interaction` только выбирает gesture: кнопку мыши, модификаторы и область попадания.

## Defaults

```ts
interaction: {
  tasks: {
    drag: {
      moveGroup: { buttons: ['left'], modifiers: ['none'], area: 'body' },
      moveTime: { buttons: ['left'], modifiers: ['Meta', 'Ctrl', 'Alt'], area: 'body' },
      resizeStart: { buttons: ['left'], modifiers: ['Meta', 'Ctrl', 'Alt'], area: 'start-edge', edgeSizePx: 10 },
      resizeEnd: { buttons: ['left'], modifiers: ['Meta', 'Ctrl', 'Alt'], area: 'end-edge', edgeSizePx: 10 },
    },
  },
  points: {
    drag: {
      moveTime: { buttons: ['left'], modifiers: ['Meta', 'Ctrl', 'Alt'], area: 'point' },
      moveGroup: { buttons: ['left'], modifiers: ['none'], area: 'point' },
      attachTask: { enabled: false, buttons: ['left'], modifiers: ['Meta', 'Ctrl'], area: 'point' },
    },
  },
  links: {
    drag: {
      reconnectFrom: { buttons: ['left'], modifiers: ['none'], area: 'from-handle' },
      reconnectTo: { buttons: ['left'], modifiers: ['none'], area: 'to-handle' },
      moveRoutePoint: { buttons: ['left'], modifiers: ['none'], area: 'route-handle' },
    },
  },
}
```

## area

`area` описывает часть сущности, по которой должен начаться gesture.

- `body` - тело задачи без edge-зон.
- `start-edge` и `end-edge` - левая и правая зоны resize задачи.
- `point` - точка с учетом `hit-padding`.
- `segment` - сегмент связи.
- `from-handle`, `to-handle`, `route-handle` - handles связи.
- `any` - любая hit-зона сущности.

## Modifiers

`modifiers` работает как OR:

```ts
moveTime: {
  modifiers: ['Meta', 'Ctrl'],
}
```

Можно задать точное состояние клавиш:

```ts
moveGroup: {
  modifiers: [{ shift: true, meta: false }],
}
```

Если action найден по gesture, но `editable` запрещает соответствующее изменение, данные не меняются.
