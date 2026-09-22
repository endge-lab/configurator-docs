# Annotations cookbook

## Dependency links with task ports

```ts
tasks: [
  { id: 'design', groupId: 'team', startTime, endTime, ports: { outgoing: ['end'] } },
  { id: 'build', groupId: 'team', startTime: endTime, endTime: endTime + day, ports: { incoming: ['start'] } },
],
links: [{
  id: 'design-build',
  from: { type: 'task', taskId: 'design', port: 'end' },
  to: { type: 'task', taskId: 'build', port: 'start' },
}]
```

## Comment-like point

```ts
points: [{
  id: 'c-42',
  kind: 'comment',
  time,
  groupId: 'support',
  label: '3',
  selectable: true,
}]
```

```vue
<TimelineChart.PointProfile
  id="comment"
  shape="icon"
  icon="comment"
  fill="#2563eb"
  selected-fill="#1d73ff"
  hovered-stroke="#93c5fd"
/>
```

## Draggable milestone

```ts
points: [{
  id: 'gate',
  kind: 'milestone',
  time,
  groupId: 'release',
  editable: { x: true, group: true, snap: true },
}]
```

## Reconnectable link with port constraints

```ts
links: [{
  id: 'qa-prod',
  from: { type: 'task', taskId: 'qa', port: 'end' },
  to: { type: 'task', taskId: 'prod', port: 'start' },
  editable: { reconnect: true },
}]
```

При drag endpoint handle библиотека подсвечивает только разрешенные target-порты. Drop вне порта отменяет reconnect без изменения `from/to`.

## Manual route with waypoints

```ts
links: [{
  id: 'pretty-route',
  from: { type: 'task', taskId: 'source', port: 'end' },
  to: { type: 'point', pointId: 'target', port: 'left' },
  route: {
    mode: 'manual',
    type: 'polyline',
    points: [
      { type: 'offset', from: 'from', dx: 40, dy: 0 },
      { type: 'time-group', time: checkpointTime, groupId: 'ops' },
      { type: 'offset', from: 'to', dx: -40, dy: 0 },
    ],
  },
}]
```
