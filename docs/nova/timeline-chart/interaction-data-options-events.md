# Data/options events

Data/options events помогают отследить момент применения изменений в runtime.

## Практика

Используйте events для логирования, diagnostics и внешней синхронизации. Не подменяйте ими основной data flow: команды должны идти через ref API или props.
