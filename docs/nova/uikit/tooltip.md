# Tooltip

Tooltip поддерживает два слоя:

- низкоуровневый `Tooltip` wrapper с trigger schema, как раньше;
- декларативный registry: `Tooltips` под `Root` регистрирует типы, а любой UI Kit target получает `tooltip`.

## Практическая схема

- Документация: NovaUIKit.
- Раздел: Scroll и overlay.
- Тема страницы: Tooltip.
- Переключатель TypeScript / DSL находится в панели навигации; вкладка `Код` в примере показывает файлы выбранного подхода.

:::example id="nova-prime-components" layout="tabs"
:::

## Как применять

Если registry не объявлен, работает встроенный `default` tooltip:

```nova
<Button text="Save" tooltip="Сохранить изменения" />
<TextBlock
  text="Markdown"
  :tooltip="{ type: 'default', value: 'Подсказка', width: 260, placement: 'bottom' }"
/>
```

Кастомные типы объявляются один раз под `Root`:

```nova
<Tooltips>
  <Tooltip type="task" :width="300" :height="72">
    <Flex direction="column">
      <TextBlock :text="slot.title" />
      <TextBlock :text="String(slot.value)" />
    </Flex>
  </Tooltip>

  <Tooltip type="markdown" content-mode="markdown" :width="280" />
</Tooltips>
```

`tooltip="Text"` нормализуется в `{ type: 'default', value: 'Text' }`. Object-форма принимает payload и local overrides: `value`, `type`, `width`, `placement`, `background`, `padding`, `border`, `delay`, `hideDelay`, `collision` и любые поля для шаблона. Внутри template они доступны через implicit `slot.*`: `slot.value`, `slot.title`, `slot.target`, `slot.pointer`.

В одном `Root` создается только один `RootTooltipControllerNode`. Target-компоненты не создают overlay nodes при hover; controller хранит registry, делает hit-test, открывает active overlay и переиспользует subtree.

Стандартный tooltip настраивается NovaCSS vars: `--nova-tooltip-background`, `--nova-tooltip-color`, `--nova-tooltip-border-color`, `--nova-tooltip-font-family`. Для кастомных типов используйте props в `<Tooltip type="...">` и local overrides на target.
