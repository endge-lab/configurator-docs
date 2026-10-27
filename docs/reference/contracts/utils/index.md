---
description: "Публичные TypeScript-контракты @endge/utils 1.0.0-dev.6: точки входа, группы деклараций и полный список exports."
---

# @endge/utils: публичные контракты

Source version: **1.0.0-dev.6**. [Repository](https://github.com/endge-lab/utils). [Общий каталог](/reference/contracts/).

Точные сигнатуры, overloads, generic-параметры, события и shapes собраны из исходников TypeScript. Вызовы из примеров документации сверяйте с этим snapshot. Извлечение declarations не заменяет typecheck или runtime verification.

## Точки входа

| Import | Source |
| --- | --- |
| `@endge/utils` | [src/index.ts](https://github.com/endge-lab/utils/blob/main/src/index.ts) |

## Контракты по владельцам

- [collection](./collection) — 4 исходных модулей.
- [database](./database) — 1 исходных модулей.
- [events](./events) — 1 исходных модулей.
- [execute](./execute) — 2 исходных модулей.
- [index](./index) — 1 исходных модулей.
- [serialize](./serialize) — 7 исходных модулей.
- [shared](./shared) — 8 исходных модулей.
- [tools](./tools) — 10 исходных модулей.
- [ui](./ui) — 1 исходных модулей.
- [updates](./updates) — 2 исходных модулей.

## Все публичные exports

| Import | Export | Объявление |
| --- | --- | --- |
| `@endge/utils` | `ActiveState` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `AfterDeserialize` | [src/shared/serialize/decorator.ts](https://github.com/endge-lab/utils/blob/main/src/shared/serialize/decorator.ts) |
| `@endge/utils` | `AnyRecord` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `AppBus` | [src/events/EventBus.ts](https://github.com/endge-lab/utils/blob/main/src/events/EventBus.ts) |
| `@endge/utils` | `AsyncFn` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `Awaitable` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `BeforeSerialize` | [src/shared/serialize/decorator.ts](https://github.com/endge-lab/utils/blob/main/src/shared/serialize/decorator.ts) |
| `@endge/utils` | `Callback` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `capitalize` | [src/shared/utils/text.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/text.ts) |
| `@endge/utils` | `Collection` | [src/collection/collection.ts](https://github.com/endge-lab/utils/blob/main/src/collection/collection.ts) |
| `@endge/utils` | `CollectionEntity` | [src/collection/collection.types.ts](https://github.com/endge-lab/utils/blob/main/src/collection/collection.types.ts) |
| `@endge/utils` | `CollectionEvents` | [src/collection/collection.types.ts](https://github.com/endge-lab/utils/blob/main/src/collection/collection.types.ts) |
| `@endge/utils` | `CollectionOptions` | [src/collection/collection.types.ts](https://github.com/endge-lab/utils/blob/main/src/collection/collection.types.ts) |
| `@endge/utils` | `compareNumber` | [src/shared/utils/compare.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/compare.ts) |
| `@endge/utils` | `consoleErrorSummary` | [src/tools/console.ts](https://github.com/endge-lab/utils/blob/main/src/tools/console.ts) |
| `@endge/utils` | `consoleValueSummary` | [src/tools/console.ts](https://github.com/endge-lab/utils/blob/main/src/tools/console.ts) |
| `@endge/utils` | `Constructor` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `ConstructorOrFactory` | [src/tools/reflect.ts](https://github.com/endge-lab/utils/blob/main/src/tools/reflect.ts) |
| `@endge/utils` | `createInstance` | [src/tools/reflect.ts](https://github.com/endge-lab/utils/blob/main/src/tools/reflect.ts) |
| `@endge/utils` | `DataPoint` | [src/tools/geometry.ts](https://github.com/endge-lab/utils/blob/main/src/tools/geometry.ts) |
| `@endge/utils` | `DataRect` | [src/tools/geometry.ts](https://github.com/endge-lab/utils/blob/main/src/tools/geometry.ts) |
| `@endge/utils` | `DataSize` | [src/tools/geometry.ts](https://github.com/endge-lab/utils/blob/main/src/tools/geometry.ts) |
| `@endge/utils` | `DateRange` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `DeepPartial` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `DelayedExecutor` | [src/execute/delay-executor.ts](https://github.com/endge-lab/utils/blob/main/src/execute/delay-executor.ts) |
| `@endge/utils` | `DeserializeArrayField` | [src/shared/serialize/decorator.ts](https://github.com/endge-lab/utils/blob/main/src/shared/serialize/decorator.ts) |
| `@endge/utils` | `DeserializeId` | [src/shared/serialize/decorator.ts](https://github.com/endge-lab/utils/blob/main/src/shared/serialize/decorator.ts) |
| `@endge/utils` | `Dictionary` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `diffDuration` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `diffDurationTable` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `dt` | [src/tools/system-clock.ts](https://github.com/endge-lab/utils/blob/main/src/tools/system-clock.ts) |
| `@endge/utils` | `EventBus` | [src/events/EventBus.ts](https://github.com/endge-lab/utils/blob/main/src/events/EventBus.ts) |
| `@endge/utils` | `EventBusOptions` | [src/events/EventBus.ts](https://github.com/endge-lab/utils/blob/main/src/events/EventBus.ts) |
| `@endge/utils` | `EventCallback` | [src/events/EventBus.ts](https://github.com/endge-lab/utils/blob/main/src/events/EventBus.ts) |
| `@endge/utils` | `EventList` | [src/events/EventBus.ts](https://github.com/endge-lab/utils/blob/main/src/events/EventBus.ts) |
| `@endge/utils` | `Events` | [src/collection/collection.types.ts](https://github.com/endge-lab/utils/blob/main/src/collection/collection.types.ts) |
| `@endge/utils` | `extractTime` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `Falsy` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `findMinMaxDates` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `formatDatetime` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `formatDatetimeTZ` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `formatDatetimeTZSpecial` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `formatDateToMSK` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `generateUUID` | [src/shared/utils/generate.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/generate.ts) |
| `@endge/utils` | `GenericExpose` | [src/shared/serialize/decorator.ts](https://github.com/endge-lab/utils/blob/main/src/shared/serialize/decorator.ts) |
| `@endge/utils` | `getDateOnlyDiffFactor` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `getDayOfWeek` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `getKeyboardStateSnapshot` | [src/tools/keyboard.ts](https://github.com/endge-lab/utils/blob/main/src/tools/keyboard.ts) |
| `@endge/utils` | `getOnDeserializedMethod` | [src/serialize/decorators/onDeserialized.ts](https://github.com/endge-lab/utils/blob/main/src/serialize/decorators/onDeserialized.ts) |
| `@endge/utils` | `getTimezoneOffsetMs` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `GlobalEvents` | [src/events/EventBus.ts](https://github.com/endge-lab/utils/blob/main/src/events/EventBus.ts) |
| `@endge/utils` | `globalState` | [src/tools/state.ts](https://github.com/endge-lab/utils/blob/main/src/tools/state.ts) |
| `@endge/utils` | `HotkeyManager` | [src/tools/hotkeys.ts](https://github.com/endge-lab/utils/blob/main/src/tools/hotkeys.ts) |
| `@endge/utils` | `Ignored` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `IgnoreToPlain` | [src/shared/serialize/decorator.ts](https://github.com/endge-lab/utils/blob/main/src/shared/serialize/decorator.ts) |
| `@endge/utils` | `IndexCollectionEntity` | [src/collection/collection.types.ts](https://github.com/endge-lab/utils/blob/main/src/collection/collection.types.ts) |
| `@endge/utils` | `IndexedCollection` | [src/collection/indexed-collection.ts](https://github.com/endge-lab/utils/blob/main/src/collection/indexed-collection.ts) |
| `@endge/utils` | `IS_DEBUG` | [src/tools/debug.ts](https://github.com/endge-lab/utils/blob/main/src/tools/debug.ts) |
| `@endge/utils` | `isAfterOrEqual` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `isAnyKeyComboActive` | [src/shared/utils/keyboard.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/keyboard.ts) |
| `@endge/utils` | `isConstructor` | [src/tools/reflect.ts](https://github.com/endge-lab/utils/blob/main/src/tools/reflect.ts) |
| `@endge/utils` | `isDateInRange` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `isDateRangeOverlap` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `ISerializable` | [src/shared/serialize/decorator.ts](https://github.com/endge-lab/utils/blob/main/src/shared/serialize/decorator.ts) |
| `@endge/utils` | `isNullOrUndefined` | [src/shared/types/Maybe.ts](https://github.com/endge-lab/utils/blob/main/src/shared/types/Maybe.ts) |
| `@endge/utils` | `isoDateTimeToTimeInput` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `IsOptionalTransformed` | [src/shared/serialize/decorator.ts](https://github.com/endge-lab/utils/blob/main/src/shared/serialize/decorator.ts) |
| `@endge/utils` | `isoToDateInput` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `isoToDateTimeLocalInput` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `Json` | [src/serialize/decorators/json.ts](https://github.com/endge-lab/utils/blob/main/src/serialize/decorators/json.ts) |
| `@endge/utils` | `JsonString` | [src/serialize/decorators/jsonString.ts](https://github.com/endge-lab/utils/blob/main/src/serialize/decorators/jsonString.ts) |
| `@endge/utils` | `KeyboardStatePlatform` | [src/tools/keyboard.ts](https://github.com/endge-lab/utils/blob/main/src/tools/keyboard.ts) |
| `@endge/utils` | `KeyboardStateSnapshot` | [src/tools/keyboard.ts](https://github.com/endge-lab/utils/blob/main/src/tools/keyboard.ts) |
| `@endge/utils` | `KeyCombo` | [src/shared/utils/keyboard.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/keyboard.ts) |
| `@endge/utils` | `KeyComboArray` | [src/shared/utils/keyboard.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/keyboard.ts) |
| `@endge/utils` | `KeysWithType` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `Maybe` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `MaybeArray` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `mergeTimeIntoDateTime` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `NamedExecutor` | [src/execute/NamedExecutor.ts](https://github.com/endge-lab/utils/blob/main/src/execute/NamedExecutor.ts) |
| `@endge/utils` | `NonNullableStrict` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `Nullable` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `onDeserialized` | [src/serialize/decorators/onDeserialized.ts](https://github.com/endge-lab/utils/blob/main/src/serialize/decorators/onDeserialized.ts) |
| `@endge/utils` | `OneOrMany` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `Override` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `parseDate` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `parseDuration` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `parseOffsetToTimezone` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `PartialDeep` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `PayloadClientOptions` | [src/database/PayloadHttpClient.ts](https://github.com/endge-lab/utils/blob/main/src/database/PayloadHttpClient.ts) |
| `@endge/utils` | `PayloadHttpClient` | [src/database/PayloadHttpClient.ts](https://github.com/endge-lab/utils/blob/main/src/database/PayloadHttpClient.ts) |
| `@endge/utils` | `profile` | [src/tools/debug.ts](https://github.com/endge-lab/utils/blob/main/src/tools/debug.ts) |
| `@endge/utils` | `randomString` | [src/shared/utils/generate.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/generate.ts) |
| `@endge/utils` | `ReadonlyIndexCollection` | [src/collection/collection.types.ts](https://github.com/endge-lab/utils/blob/main/src/collection/collection.types.ts) |
| `@endge/utils` | `removeTime` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `RingBuffer` | [src/collection/RingBuffer.ts](https://github.com/endge-lab/utils/blob/main/src/collection/RingBuffer.ts) |
| `@endge/utils` | `Script` | [src/serialize/decorators/script.ts](https://github.com/endge-lab/utils/blob/main/src/serialize/decorators/script.ts) |
| `@endge/utils` | `Serialize` | [src/serialize/Serialize.ts](https://github.com/endge-lab/utils/blob/main/src/serialize/Serialize.ts) |
| `@endge/utils` | `SerializeId` | [src/shared/serialize/decorator.ts](https://github.com/endge-lab/utils/blob/main/src/shared/serialize/decorator.ts) |
| `@endge/utils` | `SerializeIds` | [src/shared/serialize/decorator.ts](https://github.com/endge-lab/utils/blob/main/src/shared/serialize/decorator.ts) |
| `@endge/utils` | `SharedMaybe` | [src/shared/types/Maybe.ts](https://github.com/endge-lab/utils/blob/main/src/shared/types/Maybe.ts) |
| `@endge/utils` | `Side` | [src/tools/geometry.ts](https://github.com/endge-lab/utils/blob/main/src/tools/geometry.ts) |
| `@endge/utils` | `SSEManager` | [src/updates/SSEManager.ts](https://github.com/endge-lab/utils/blob/main/src/updates/SSEManager.ts) |
| `@endge/utils` | `SSEManagerMessage` | [src/updates/SSEManager.ts](https://github.com/endge-lab/utils/blob/main/src/updates/SSEManager.ts) |
| `@endge/utils` | `SSEManagerOptions` | [src/updates/SSEManager.ts](https://github.com/endge-lab/utils/blob/main/src/updates/SSEManager.ts) |
| `@endge/utils` | `StructuredLogEntry` | [src/tools/logs.ts](https://github.com/endge-lab/utils/blob/main/src/tools/logs.ts) |
| `@endge/utils` | `StructuredLogger` | [src/tools/logs.ts](https://github.com/endge-lab/utils/blob/main/src/tools/logs.ts) |
| `@endge/utils` | `Subscribable` | Реэкспорт: декларация принадлежит dependency package; см. исходный entrypoint |
| `@endge/utils` | `SubscribableLike` | Реэкспорт: декларация принадлежит dependency package; см. исходный entrypoint |
| `@endge/utils` | `subscribeKeyboardState` | [src/tools/keyboard.ts](https://github.com/endge-lab/utils/blob/main/src/tools/keyboard.ts) |
| `@endge/utils` | `SystemClock` | [src/tools/system-clock.ts](https://github.com/endge-lab/utils/blob/main/src/tools/system-clock.ts) |
| `@endge/utils` | `timeToTimeInput` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `toInstance` | [src/shared/serialize/parse.ts](https://github.com/endge-lab/utils/blob/main/src/shared/serialize/parse.ts) |
| `@endge/utils` | `toIsoZDate` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `toIsoZDateTime` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `toPlain` | [src/shared/serialize/parse.ts](https://github.com/endge-lab/utils/blob/main/src/shared/serialize/parse.ts) |
| `@endge/utils` | `toTimeHHMMSS` | [src/shared/utils/time.ts](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts) |
| `@endge/utils` | `TreeViewNode` | [src/ui/tree.types.ts](https://github.com/endge-lab/utils/blob/main/src/ui/tree.types.ts) |
| `@endge/utils` | `Truthy` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `TypeMap` | [src/serialize/decorators/typeMap.ts](https://github.com/endge-lab/utils/blob/main/src/serialize/decorators/typeMap.ts) |
| `@endge/utils` | `TypeRecord` | [src/serialize/decorators/typeRecord.ts](https://github.com/endge-lab/utils/blob/main/src/serialize/decorators/typeRecord.ts) |
| `@endge/utils` | `Undefinable` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `UPSMeter_Service` | [src/updates/UPSMeter_Service.ts](https://github.com/endge-lab/utils/blob/main/src/updates/UPSMeter_Service.ts) |
| `@endge/utils` | `VoidFn` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
| `@endge/utils` | `VoidFunction` | [src/tools/tools.types.ts](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts) |
