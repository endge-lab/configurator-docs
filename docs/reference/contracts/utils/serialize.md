---
description: "TypeScript-декларации @endge/utils 1.0.0-dev.9, группа serialize; исходных модулей: 7."
---

# @endge/utils: serialize

Версия source: 1.0.0-dev.9. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/utils); сама ссылка не подтверждает snapshot этого контракта. Source checkout содержит незакоммиченные изменения; публикация этого кандидата не подтверждена. Публичный snapshot данного source-контракта не подтверждён; относительные пути ниже относятся к source-кандидату, а не к repository main.

## src/serialize/decorators/json.ts

Исходный модуль: `src/serialize/decorators/json.ts`

```ts
export declare function Json(): PropertyDecorator;
```

## src/serialize/decorators/jsonString.ts

Исходный модуль: `src/serialize/decorators/jsonString.ts`

```ts
export declare function JsonString(): PropertyDecorator;
```

## src/serialize/decorators/onDeserialized.ts

Исходный модуль: `src/serialize/decorators/onDeserialized.ts`

```ts
export declare function onDeserialized(): MethodDecorator;
export declare function getOnDeserializedMethod<T>(instance: T): (() => void) | null;
```

## src/serialize/decorators/script.ts

Исходный модуль: `src/serialize/decorators/script.ts`

```ts
export declare function Script(): PropertyDecorator;
```

## src/serialize/decorators/typeMap.ts

Исходный модуль: `src/serialize/decorators/typeMap.ts`

```ts
import type { ClassConstructor } from 'class-transformer';
export declare function TypeMap<V>(valueType: ClassConstructor<V>, keyField?: keyof V): PropertyDecorator;
```

## src/serialize/decorators/typeRecord.ts

Исходный модуль: `src/serialize/decorators/typeRecord.ts`

```ts
import type { ClassConstructor } from 'class-transformer';
export declare function TypeRecord<V>(valueType: ClassConstructor<V>): PropertyDecorator;
```

## src/serialize/Serialize.ts

Исходный модуль: `src/serialize/Serialize.ts`

```ts
import type { ClassConstructor } from 'class-transformer';
export declare class Serialize {
    static toPlain<T>(instance: T): any;
    static fromJSON<T>(cls: ClassConstructor<T>, json: any): T;
}
```
