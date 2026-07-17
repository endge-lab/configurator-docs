# EndgeCSS: обзор

EndgeCSS — единый renderer-neutral язык стилей для глобальных документов Style и блоков `<style>` в ComponentSFC.

```text
Style.source / SFC <style>
→ parser и diagnostics
→ EndgeStyleSheetArtifact в Endge.program
→ abstract selector matcher
→ DOM или другой materializer
```

Source является единственной авторской истиной. Сгенерированный CSS для DOM — результат компиляции и preview, а не редактируемое состояние.

```css
Text.notice {
  color: var(--accent);
}
```

`Text` здесь означает абстрактный Endge-тег, а не конкретный HTML-элемент.

Далее: [синтаксис и значения](/reference/endgecss/syntax).
