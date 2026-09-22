# Drag lifecycle

Drag lifecycle состоит из start, move, end и cancel событий. До сохранения в backend воспринимайте drag как optimistic UI state.

## Рекомендация

Сначала проверьте изменения в событиях before/move, затем отправляйте `update` только после подтверждения бизнес-правил.
