# Граница DOM и Canvas

DOM backend находится в UI-адаптере. Он материализует нейтральные declarations в стабильные сгенерированные классы и один управляемый stylesheet.

Generated selectors используют `:where(.generated-class)`. Правила выдаются в порядке нейтрального каскада, поэтому особенности browser selector engine не должны менять семантику EndgeCSS.

Theme selectors активируют заранее скомпилированные rules через `data-endge-theme`. Переключение темы не требует повторной компиляции ComponentSFC.

Canvas не использует сгенерированный CSS. Canvas backend должен получить тот же `EndgeStyleSheetArtifact`, условия и abstract matcher, а затем преобразовать итоговые declarations в команды layout и paint.

Главная граница: DOM/CSS — способ оптимальной материализации, а не архитектурный контракт языка стилей.
