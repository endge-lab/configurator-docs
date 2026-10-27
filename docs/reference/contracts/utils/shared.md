---
description: "TypeScript-декларации @endge/utils 1.0.0-dev.6, группа shared; исходных модулей: 8."
---

# @endge/utils: shared

Версия source: 1.0.0-dev.6. [Каталог package](./). [Repository](https://github.com/endge-lab/utils).

## src/shared/serialize/decorator.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/shared/serialize/decorator.ts)

```ts
import type { ExposeOptions } from 'class-transformer';
import type { ValidationOptions } from 'class-validator';
import 'reflect-metadata';
export declare function GenericExpose(options: ExposeOptions): (target: object, propertyKey: string | symbol) => void;
export declare function BeforeSerialize(): (target: any, propertyKey: string, _descriptor: PropertyDescriptor) => void;
export declare function AfterDeserialize(target: any, propertyKey: string, _descriptor: PropertyDescriptor): void;
export declare function IsOptionalTransformed(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
export interface ISerializable {
    toPlain: () => any;
    toJson: () => string;
}
export declare function DeserializeId(): PropertyDecorator;
export declare function DeserializeArrayField(field: string): PropertyDecorator;
export declare function SerializeId(): PropertyDecorator;
export declare function SerializeIds(): PropertyDecorator;
export declare function IgnoreToPlain(): PropertyDecorator;
```

## src/shared/serialize/parse.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/shared/serialize/parse.ts)

```ts
import type { ClassConstructor } from 'class-transformer';
export declare function toInstance<T>(ctor: ClassConstructor<T>, json: object): T;
export declare function toPlain<T>(obj: T): object;
```

## src/shared/types/Maybe.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/shared/types/Maybe.ts)

```ts
export type Maybe<T> = T | null | undefined;
export declare function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined;
```

## src/shared/utils/compare.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/shared/utils/compare.ts)

```ts
export declare function compareNumber(a: number, b: number): number;
```

## src/shared/utils/generate.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/shared/utils/generate.ts)

```ts
export declare const generateUUID: () => string;
export declare function randomString(length: number): string;
```

## src/shared/utils/keyboard.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/shared/utils/keyboard.ts)

```ts
export interface KeyCombo {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
    key: string;
}
export type KeyComboArray = Array<KeyCombo>;
export declare function isAnyKeyComboActive(combos: KeyComboArray, event: KeyboardEvent): boolean;
```

## src/shared/utils/text.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/shared/utils/text.ts)

```ts
export declare function capitalize(val: unknown): string;
```

## src/shared/utils/time.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/shared/utils/time.ts)

```ts
export interface DateRange {
    start: Date;
    end: Date;
}
export declare function isAfterOrEqual(dateA: Date, dateB: Date): boolean;
export declare function isDateRangeOverlap(s1: Date, s2: Date, validFrom: Date, validTo: Date): boolean;
export declare function isDateInRange(date: Date, validFrom: Date, validTo: Date): boolean;
export declare const parseDate: (isoString: string) => "" | Date;
export declare function formatDatetime(date: Date, formatString?: string, options?: {}): string;
export declare function formatDatetimeTZ(date: Date | string | object, formatString?: string, options?: {}, isLocalTime?: boolean): string;
export declare function getDayOfWeek(date: Date | number): string;
export declare function formatDateToMSK(date: Date | string | number): string;
export declare function extractTime(date: Date | string | object, isLocalTime?: boolean): string;
export declare function findMinMaxDates(dates: Set<Date>): {
    minDate: Date;
    maxDate: Date;
};
export declare function diffDuration(d1: Date, d2: Date): string;
export declare function diffDurationTable(d1: Date, d2: Date): string;
export declare function removeTime(date?: Date): Date;
export declare function getDateOnlyDiffFactor(d1: Date, d2: Date): {
    variant: 'red' | 'blue';
    value: string;
} | null;
export declare function toIsoZDate(value: string): string | null;
export declare function toIsoZDateTime(value: string): string | null;
export declare function isoToDateInput(value: unknown): string;
export declare function isoToDateTimeLocalInput(value: unknown): string;
export declare function isoDateTimeToTimeInput(value: unknown, timezone?: unknown): string;
export declare function mergeTimeIntoDateTime(value: unknown, time: unknown, timezone?: unknown): string | null;
export declare function timeToTimeInput(value: unknown): string;
export declare function toTimeHHMMSS(value: unknown): string | null;
export declare function parseDuration(duration: string): string;
export declare function formatDatetimeTZSpecial(date?: Date | string | object | null, formatString?: string, options?: {}): string;
export declare function parseOffsetToTimezone(offsetStr: string): string | null;
export declare function getTimezoneOffsetMs(timezone: string): number;
```
