# Task recipes

Compiled recipes нужны, когда один и тот же вид задачи повторяется много раз. Они уменьшают стоимость runtime schema creation.

## Когда применять

Начинайте с обычного `schema`. Переходите на recipe, когда profiling показывает, что генерация schema стала заметной частью update/render стоимости.
