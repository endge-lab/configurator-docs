# viewport

`viewport` хранит scroll offsets и ограничения масштаба. В прикладном коде чаще всего меняют `minDurationMs` и `maxDurationMs`.

## Практика

Не обновляйте viewport на каждый пиксель scroll из внешнего Vue state. Используйте events для аналитики, а runtime оставляйте владельцем интерактивного состояния.
