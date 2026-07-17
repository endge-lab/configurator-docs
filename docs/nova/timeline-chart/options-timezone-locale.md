# timezone и locale

`locale` и `timezone` влияют на форматирование времени и шкалы.

```ts
options: { locale: 'ru-RU', timezone: 'Europe/Moscow' }
```

## Рекомендация

Храните task times в timestamp milliseconds. Timezone используйте для отображения, а не как часть модели задачи.
