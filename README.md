# Endge Docs

Отдельное статическое приложение документации платформы Endge, Core, Federation,
Configurator и Nova на VitePress.

## Local development

```bash
pnpm install
pnpm dev
```

По умолчанию VitePress запускает локальный dev server на свободном порту, начиная с `5173`.

## Production build

```bash
pnpm build
pnpm preview
```

Production output создаётся в `docs/.vitepress/dist`.

## Knowledge Bundle для AI Workbench

Публичный срез Markdown-документации собирается отдельно от VitePress:

```bash
pnpm knowledge:build
```

Команда создаёт игнорируемый Git каталог `dist/knowledge` с файлами
`manifest.json` и `documents.jsonl`. В bundle входят только публичные разделы;
`project`, служебные файлы VitePress и внутренние документы не импортируются.
