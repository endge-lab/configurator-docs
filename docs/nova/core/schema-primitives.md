# Schema primitives

Базовые schema-объекты: rect, line, circle, arc, polygon, border, clip и opacity.

## Практическая схема

- Документация: NovaCore.
- Раздел: Отрисовка.
- Тема страницы: Schema primitives.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-schema-primitives" layout="tabs"
:::

:::contract id="nova-schema-item"
:::

## Arc

`arc` рисует дугу или кольцевой сегмент без DOM и подходит для progress rings, circular indicators и компактных gauge-элементов.

```ts
{
  type: 'arc',
  x: 24,
  y: 24,
  radius: 9,
  startAngle: -Math.PI / 2,
  endAngle: -Math.PI / 2 + Math.PI * 1.5,
  styles: {
    color: '#10b981',
    width: 2,
    lineCap: 'round',
  },
}
```

Для готового индикатора прогресса используйте `NovaUIKit.progressRingSchema`.

## Как применять

Используйте страницу как короткую рабочую заметку: сначала определите границу ответственности, затем откройте пример и сравните TypeScript-реализацию с DSL-описанием. Runtime-код остается в Nova-слое, а Vue отвечает только за mount, layout shell и cleanup.
