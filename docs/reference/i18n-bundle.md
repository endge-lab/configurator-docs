# I18n Bundle

I18n Bundle — отдельный доменный документ переводов. Он редактируется в собственной вкладке Configurator и содержит несколько locale trees в одном документе.

```json
{
  "ru": {
    "title": "Расписание",
    "columns": {
      "status": "Статус"
    }
  },
  "en": {
    "title": "Schedule",
    "columns": {
      "status": "Status"
    }
  }
}
```

Документ становится доступен компонентам только после явной регистрации в Composition:

```ts
defineComposition({
  resources: {
    schedule: i18n('schedule-default'),
  },

  runtimes: {
    page: component('schedule-page'),
  },
})
```

`schedule` — публичный alias, `schedule-default` — identity документа. SFC обращается к переводу через alias и dot-path:

```vue
<Text>{{ t('schedule:columns.status') }}</Text>
```

`t()` является встроенной функцией безопасных Component SFC template
expressions. Её не нужно импортировать, получать через `useI18n` или объявлять в
`defineProps`. В `<script setup>` она не выполняется как обычная JavaScript
функция.

`t(key, fallback?)` сначала читает текущую locale из `Endge.context`, затем workspace fallback locale. Если значение отсутствует, возвращается переданный fallback, а без него — заметный маркер <code>&#123;&#123;schedule:columns.status&#125;&#125;</code>.

## Вложенные Composition

Catalog накапливается от родительской Composition к дочерней и учитывает named lifecycle scopes. Полный публичный ключ состоит из alias и пути сообщения. Если descendant повторно объявляет уже доступный ключ, compiler публикует fatal diagnostic `composition-i18n-key-collision`; artifact получает статус `error` и Composition не запускается.

```text
parent: schedule:columns.status
child:  schedule:columns.status  → compile error
child:  details:columns.status   → допустимо
```

Это правило не является override-механизмом. Specific override pattern для tenant-specific документов добавляется отдельным этапом.

## Реактивность locale

Locale хранится в `Endge.context`. При её изменении runtime инвалидирует активные application scopes и повторно рендерит все renderable roots. Отдельные подписки `useI18n` внутри каждого SFC не требуются.
