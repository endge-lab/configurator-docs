# Endge Docs

Отдельное статическое приложение документации платформы Endge, Core, Federation,
Raph и Configurator на VitePress.

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

## Документация для языковых моделей

`pnpm build` после VitePress запускает `scripts/build-llms.mjs`; отдельно —
`pnpm llms:build`. В `docs/.vitepress/dist` появляются:

- `llms.txt` — оглавление со ссылками на Markdown-версии страниц;
- `llms-full.txt` — руководство для агентов, вся документация и полный HTTP API;
- `llms-full/<раздел>.txt` и `llms-full/api.txt` — те же данные по частям;
- `<страница>.md` — Markdown-версия каждой страницы.

Справочник API генерируется из OpenAPI Service Backend. Скрипт берёт
`ENDGE_OPENAPI_PATH`, затем файл backend в монорепозитории, затем
`ENDGE_OPENAPI_URL` или публичную копию на GitHub. `ENDGE_DOCS_URL` делает ссылки
абсолютными. Раздел `project` не включается.

## Knowledge Bundle для AI Workbench

Публичный срез Markdown-документации собирается отдельно от VitePress:

```bash
pnpm knowledge:build
```

Команда создаёт игнорируемый Git каталог `dist/knowledge` с файлами
`manifest.json` и `documents.jsonl`. В bundle входят только публичные разделы;
`project`, служебные файлы VitePress и внутренние документы не импортируются.
