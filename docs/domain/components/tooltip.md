# Tooltip

`Tooltip` показывает дополнительное содержимое при наведении мышью или получении
фокуса. Все варианты renderer-neutral и одинаково поддерживаются адаптерами
`vue-native`, `vue-shadcn` и `ramax-aodb`.

## Короткая запись: обычный текст

Атрибут `tooltip` на visual primitive остаётся самым коротким вариантом:

```vue
<Badge
  :value="row.status"
  :tooltip="`Статус рейса: ${row.status}`"
/>
```

В таблице атрибут нужно размещать на реально отрисовываемом компоненте, а не на
структурном `Cell`:

```vue
<Column key="status" title="Статус">
  <Cell>
    <Text :tooltip="row.statusDescription">
      {{ row.status }}
    </Text>
  </Cell>
</Column>
```

Для локального уточнения поведения shorthand поддерживает
`tooltip-side`, `tooltip-align`, `tooltip-open-delay` и
`tooltip-close-delay`. Для адресной стилизации доступны `tooltip-id`,
`tooltip-class` и `tooltip-part`.

## Обычный текст через Tooltip

Compound-запись удобна, когда настройки и style hooks принадлежат самому
тултипу:

```vue
<Tooltip
  :text="row.statusDescription"
  side="right"
  align="start"
  :open-delay="250"
  :close-delay="100"
  id="flight-status"
  class="flight-status-tooltip"
>
  <Badge :value="row.status" />
</Tooltip>
```

`side` является предпочтением. Adapter может перевернуть тултип на
противоположную сторону или сдвинуть его, если содержимое не помещается в
viewport.

## Markdown

```vue
<Tooltip :markdown="row.statusHelp">
  <Icon name="circle-help" />
</Tooltip>
```

Например, `row.statusHelp` может содержать:

```md
### Задержка

**Причина:** позднее прибытие борта

- план: `12:40`
- прогноз: `13:05`
```

Поддерживается безопасное подмножество Markdown: заголовки `#`–`###`, абзацы,
маркированные и нумерованные списки, `**strong**`, `*emphasis*`, inline code,
fenced code blocks и ссылки `http(s)`, `mailto`, `/path`, `#anchor`. Raw HTML
не исполняется: parser создаёт token AST, а adapter — обычные VNode, без
`v-html`.

## Произвольная SFC-вёрстка

Для rich-content используются ровно один `TooltipTrigger` и один
`TooltipContent`:

```vue
<Tooltip side="bottom" align="start" id="delay-details">
  <TooltipTrigger>
    <Badge tone="warning">+25 мин</Badge>
  </TooltipTrigger>

  <TooltipContent>
    <Flex direction="column" gap="1">
      <Text weight="600">Задержка отправления</Text>
      <Divider />
      <Grid columns="2" gap="1">
        <Text tone="muted">План</Text>
        <DateTime :value="row.std" format="HH:mm" />
        <Text tone="muted">Прогноз</Text>
        <DateTime :value="row.etd" format="HH:mm" />
      </Grid>
    </Flex>
  </TooltipContent>
</Tooltip>
```

В `TooltipContent` разрешены обычные SFC primitives и пользовательские
`Component`. Интерактивные кнопки, формы и вложенные тултипы не допускаются:
для такого сценария нужен `Popover` или `Dialog`.

## Наследуемые настройки

Базовое поведение задаётся во вкладке «Тултипы» конфигурации и наследуется в
порядке Workspace → Tenant → Project → Environment:

| Поле | Системное значение | Назначение |
| --- | --- | --- |
| `side` | `right` | Предпочтительная сторона. |
| `align` | `start` | `start`, `center` или `end`. |
| `openDelay` | `250` | Задержка появления в миллисекундах. |
| `closeDelay` | `100` | Задержка исчезновения в миллисекундах. |

Локальные атрибуты `<Tooltip>` имеют наивысший приоритет. Удаление локального
атрибута возвращает наследуемое effective-значение.

Фон, скругление, рамка и другие параметры темы намеренно не входят в
конфигурацию поведения.

## Стили и стабильные hooks

Единственный overlay получает следующие hooks:

- `.endge-tooltip`, `.endge-tooltip--text`, `--markdown`, `--rich`;
- `.endge-tooltip--vue-native`, `.endge-tooltip--vue-shadcn` или
  `.endge-tooltip--ramax-aodb`;
- `[data-endge-tooltip-adapter]`, `[data-endge-tooltip-id]`, `[data-side]`,
  `[data-align]`;
- `class`, `id` и `part` из `<Tooltip>`; authored `id` доступен как
  `data-endge-tooltip-id`, а уникальный DOM `id` генерируется с учётом строки и
  колонки.

Основные CSS-переменные:

```css
.endge-tooltip {
  --endge-tooltip-background: #111827;
  --endge-tooltip-color: #f9fafb;
  --endge-tooltip-radius: 8px;
  --endge-tooltip-padding: 8px 10px;
  --endge-tooltip-max-width: 360px;
  --endge-tooltip-shadow: 0 10px 30px rgb(0 0 0 / 0.24);
}

[data-theme="compact"] [data-endge-tooltip-id="flight-status"] {
  --endge-tooltip-radius: 3px;
  --endge-tooltip-padding: 4px 6px;
}

.endge-tooltip--ramax-aodb.flight-status-tooltip {
  --endge-tooltip-background: hsl(var(--popover));
  --endge-tooltip-color: hsl(var(--popover-foreground));
}
```

## Lazy lifecycle

Каждый `EndgeShell` создаёт один manager и один overlay. Ячейки таблицы не
регистрируют постоянные tooltip instances. До завершения `openDelay` хранится
только текущий запрос; Markdown parsing и rich VNode выполняются лишь при
фактическом открытии. При закрытии, recycling trigger или unmount Shell
таймеры/observers освобождаются, а content удаляется.
