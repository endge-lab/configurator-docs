# Модель производительности

Стоимость складывается из подготовки данных, layout, templates, text rendering, hit-test и replay в renderer.

## Главные рычаги

- Стабильные id и быстрые filters.
- `batch` для связанных изменений.
- `executor` для частых updates.
- Простые task profiles и LOD для текста.
