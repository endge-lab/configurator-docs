# Configuration

`Configuration` — Workspace-owned source-документ, объявляющий типизированную категорию пользовательских настроек. Его `displayName` становится названием категории в редакторах Workspace, Tenant, Project и Environment, а `identity` — ключом в `$context.config`.

Configuration не поддерживает папки. Source является единственным источником истины; Visual editor меняет его локальными AST/source-патчами.

## Source v1

```ts
defineConfig({
  actualTimeTriggers: value(TriggerSet, [
    {
      event: 'contextmenu',
      button: 2,
      prevent: true,
    },
    {
      event: 'keydown',
      code: ['KeyT'],
      modifiers: { mod: true, shift: true },
      held: { code: ['Space'], match: 'all' },
      prevent: true,
    },
  ])
    .label('Установка фактического времени')
    .description('Способы перехода к редактированию времени'),

  rowHeight: value(Number, 32)
    .label('Высота строки')
    .min(24)
    .max(80)
    .step(1),

  integrationOptions: value(JSON, {
    compact: true,
    visibleColumns: ['flight', 'actualTime'],
  }).label('Дополнительные параметры'),
})
```

Документ обязан иметь `sourceVersion: 1`. DSL статический: imports, spreads, computed keys, функции и выполнение пользовательского JavaScript запрещены.

## Типы и defaults

Configuration использует общий Type Registry: встроенные `String`, `Number`, `Boolean`, `ID`, `Null`, `Time`, `DateTime`, `Object`, `Any`, enum, union, array, object, record, пользовательские Type и reference-типы. Дополнительно доступны `TriggerSet` и `JSON`.

| Тип | Auto-default | Редактор |
|---|---|---|
| `String`, `ID`, `Time`, `DateTime` | `''` | Input или time/date-time control |
| `Number` | `0` | numeric Input с `min`, `max`, `step` |
| `Boolean` | `false` | Switch |
| `Null`, `Any` | `null` | JSON editor для сложных значений |
| `Object`, `JSON`, record | `{}` | Monaco JSON |
| array, `TriggerSet` | `[]` | list/trigger editor |
| enum | первый вариант | Select |
| object Type | рекурсивный object default | рекурсивная форма |

Reference, пустой enum, union без однозначного варианта и обязательная рекурсия требуют явного default. Default всегда JSON-сериализуем и валидируется по Type Registry. Visual editor записывает его явно; в ручном Source допустимо `value(Type)`.

## TriggerSet

`TriggerSet` соответствует массиву interaction triggers. Элементы массива объединяются через OR, условия внутри элемента — через AND. Пустой массив означает отсутствие реакции.

Trigger может содержать:

- `event`, `key`, `code`;
- `modifiers`: `mod`, `ctrl`, `meta`, `shift`, `alt`, `exact`;
- `held.key`, `held.code`, `held.match`, `held.exact`;
- pointer `button`;
- `repeat`, `composing`;
- flags `stop`, `prevent`, `self`, `once`, `capture`, `passive`.

`mod` означает Command на macOS и Ctrl на остальных основных desktop-платформах. Системные сочетания ОС и клавиши, зажатые до монтирования приложения, не гарантируются.

## JSON editor

`JSON` хранит parsed JSON, а не строку. Monaco показывает syntax/parse diagnostics и форматирует документ кнопкой «Форматировать». Невалидный текст остаётся локальным draft и не затирает последнее валидное значение.

## Persisted values и каскад

Workspace хранит значения во внутреннем namespace:

```json
{
  "configuration": {
    "values": {
      "groundHandling": {
        "rowHeight": 32
      }
    }
  }
}
```

Tenant, Project и Environment сохраняют field-level `set` override. Сброс override возвращает inheritance. Effective значение вычисляется так:

```text
Source defaults → Workspace → Tenant → Project → Environment
```

В `replace` режиме пользовательские значения сначала возвращаются к Source defaults, затем применяется replace-слой. Несовместимое значение активного поля блокирует build. Значения удалённых или неизвестных документов/полей сохраняются как stale, не входят в effective config и снова применяются после совместимого restore.

## `$context.config`

В SFC доступна глубоко замороженная проекция:

```html
<DateTime
  editable
  :edit-on="$context.config.groundHandling.actualTimeTriggers"
/>
```

Системные public-поля (`defaultTheme`, locales, timezone, auth-profile identity, SFC adapters, editing и tooltips) лежат непосредственно в `$context.config`. Configuration identity является ключом первого уровня. `values`, credentials, diagnostics internals и adapter options наружу не публикуются.

Snapshot не сохраняется в local storage, не публикуется в Raph и не создаёт runtime subscriptions. Он меняется только после нового boot/build и входит в `contextHash`.

## Import, export и hash

Новые snapshots всегда содержат `documents.configurations`, даже если массив пуст. Старый schemaVersion 1 без коллекции принимается как пустой. Bundle `schemaVersion` остаётся 1, версия самого документа задаётся `sourceVersion: 1`.

Domain hash изменяется при изменении Source/default/type/identity, context values и soft-delete/restore активного Configuration. Порядок документов и JSON keys на hash не влияет.

::: warning Не храните secrets
Configuration доступна клиентскому JavaScript и предназначена только для публичной браузерной конфигурации. Пароли, токены, private keys и другие credentials здесь хранить нельзя.
:::
