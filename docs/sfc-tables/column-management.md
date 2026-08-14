# Управление колонками

Table разделяет authored defaults и пользовательское runtime state. Source
определяет исходную видимость, порядок объявления, ширину и закрепление, а
адаптер может позволить пользователю изменить их во время работы.

```vue
<Table
  id="orders"
  :rows="rows"
  default-hidden="internalNote"
  default-pin="number:left,status:right"
  column-pin="enabled"
>
  <Column key="number" title="Номер" width="120" pinnable />
  <Column key="customer" title="Клиент" width="240" />
  <Column key="internalNote" title="Комментарий" />
  <Column key="status" title="Статус" width="140" />
</Table>
```

## Видимость

`default-hidden` перечисляет ключи существующих прямых `Column`. Новые колонки,
не указанные в списке, видимы. Неизвестный или повторный ключ является compiler
diagnostic.

`table.column.hide` скрывает текущую колонку через runtime state. Некоторые
адаптеры также предоставляют column manager для повторного включения колонок.

::: warning Не контроль доступа
Скрытая колонка не удаляет поле из `rows`. Для защиты данных исключайте их из
Query/DataView и проверяйте разрешения на backend.
:::

## Закрепление

`default-pin="number:left,status:right"` задаёт authored default.
`column-pin="disabled"` отключает изменение и игнорирует `default-pin`.
Отдельная `Column` может запретить закрепление через `pinnable="false"`.

Intrinsic Actions: `pinLeft`, `pinRight`, `unpin`, `resetPin`, `resetAllPins`.

## Ширина и resize

`Column.width`/`size` задаёт начальную ширину. Конкретный адаптер ограничивает
минимальную и максимальную ширину своим layout-контрактом. Двойной клик по
resize control может вернуть исходную ширину, если это поддерживает адаптер.

Resize-события объединяются: `columnSizeChanged` публикуется после короткой
паузы и содержит всю карту размеров плюс `changedColumnKey`.

## Порядок колонок

Исходный порядок равен порядку `Column` в Source. Runtime-перестановка сохраняет
список ключей и публикует `columnOrderChanged`. При изменении Source неизвестные
ключи удаляются, а новые добавляются без потери существующего порядка.

## Events

- `columnVisibilityChanged` — карта visibility и скрытые ключи;
- `columnPinChanged` — массивы `left` и `right`;
- `columnOrderChanged` — текущий порядок ключей;
- `columnSizeChanged` — карта размеров.

Правила persistence описаны в [состоянии таблицы](./state).
