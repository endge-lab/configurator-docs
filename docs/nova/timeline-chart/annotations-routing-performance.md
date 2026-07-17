# Routing и performance annotations

Links используют anchor-модель: пользователь описывает связь с задачей, background, point или временем, а TimelineChart считает экранные координаты из текущего layout.

```ts
links: [{
  id: 'link',
  from: { type: 'task', taskId: 'source', port: 'end' },
  to: { type: 'task', taskId: 'target', port: 'start' },
  route: { mode: 'auto', type: 'orthogonal' },
}]
```

`route.mode='auto'` оставляет текущее поведение resolver-а, но теперь endpoints берутся из портов. `manual` строит связь строго через заданные waypoints. `hybrid` считает пользовательские точки обязательными чекпоинтами и прокладывает orthogonal-сегменты между ними.

```ts
links: [{
  id: 'manual-review',
  from: { type: 'task', taskId: 'review', port: 'end' },
  to: { type: 'point', pointId: 'approval', port: 'left' },
  route: {
    mode: 'manual',
    type: 'polyline',
    points: [
      { type: 'offset', from: 'from', dx: 32, dy: 0 },
      { type: 'time-group', time: reviewGateTime, groupId: 'qa' },
      { type: 'canvas', x: 520, y: 160 },
      { type: 'anchor', anchor: { type: 'point', pointId: 'approval', port: 'left' } },
    ],
  },
}]
```

Порты задаются глобально, на группе как defaults для задач/точек, или на самой entity:

```ts
annotations: {
  ports: {
    tasks: { incoming: ['start'], outgoing: ['end'] },
    points: ['top', 'right', 'bottom', 'left'],
    invalid: 'hide-link',
  },
}
```

Для `orthogonal`-routes TimelineChart добавляет короткий внешний segment перед/после side-порта, чтобы link входил в задачу или point перпендикулярно стороне. Router проверяет только bounds двух endpoints и выбирает короткий path из фиксированного набора orthogonal candidates, поэтому link не пересекает исходную и целевую entity без полного скана сцены.

Self-links запрещены: связь между двумя портами одной и той же entity не рендерится, а reconnect на entity второго конца связи считается невалидным drop.

`routing.mode='auto'` оставляет простые маршруты на main thread, а тяжелые режимы могут уходить в worker. Если результат еще не готов, `pending='stale'` оставляет старый маршрут, а `pending='hide'` скрывает link до готовности.

Для производительности:

- неактивные annotations не создают route jobs;
- `visible=false` исключает entity из render pipeline;
- профили компилируются в recipe и переиспользуются;
- custom schema fallback считается медленным режимом и не попадает в worker/fast path.
