# Readonly timeline

Readonly режим делается на уровне данных и options: выключайте editable у задач и не подключайте внешние команды изменения по drag events.

```ts
const task = { id: 'task-1', groupId: 'group-1', startTime, endTime, editable: false }
```
