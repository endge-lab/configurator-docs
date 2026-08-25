# Operation History

History — runtime resource Composition. Без активной History Operation выполняет
`run`, но не создаёт запись.

В одну и ту же ближайшую History попадают как Operation из Source Action, так и
короткие `operation(...)` из Component SFC reactions. SFC не создаёт отдельный
стек и использует обычные правила runtime ancestry.

```ts
defineComposition({
  resources: {
    operations: operationHistory({ limit: 20 }),
  },
  runtimes: {},
})
```

По умолчанию undo использует `Mod+Z`, redo — `Mod+Shift+Z`; `Mod` означает
Command на macOS и Control на Windows/Linux. Обработчик вызывает `preventDefault`.

Defaults можно полностью заменить существующими `TriggerSet` из effective
configuration. Отдельный тип shortcut не вводится:

```ts
defineComposition({
  resources: {
    operations: operationHistory({
      limit: $editing.operationHistoryLimit,
      shortcuts: [
        onShortcut($editing.shortcuts.undo).undo(),
        onShortcut($editing.shortcuts.redo).redo(),
      ],
    }),
  },
  runtimes: {},
})
```

Если `shortcuts` указан, системные сочетания больше не добавляются. Пустой или
некорректный `TriggerSet` останавливает активацию resource с явной ошибкой.

Правила scope:

- в одном Composition scope разрешена максимум одна History независимо от alias;
- Operation выбирает ближайшую активную History по runtime ancestry;
- вложенная History перекрывает родительскую;
- project/root History является общей для дочернего runtime tree;
- pause сохраняет entries, но блокирует запись и shortcuts;
- resume возвращает History;
- deactivate/dispose очищает entries и listeners;
- уменьшение limit удаляет самые старые entries.

Runtime API:

```ts
await Endge.runtime.operations.undo()
await Endge.runtime.operations.redo()
Endge.runtime.operations.canUndo()
Endge.runtime.operations.canRedo()
Endge.runtime.operations.getActiveHistory()
```

Успешный undo перемещает cursor в redo branch. Ошибка undo/redo не меняет cursor.
Новая Operation после undo удаляет redo branch. Undo и redo не создают новые
History entries и выполняются последовательно.
