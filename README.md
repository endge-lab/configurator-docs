# Endge Docs

Статическое приложение документации Endge, Configurator, Core/Federation и раздела Raph на VitePress. Публичные примеры абстрактны: они не описывают клиентов, конкретные внедрения или прикладные системы.

## Локальная разработка

```bash
pnpm install
pnpm dev
```

Dev server использует порт `5179`; при занятости VitePress может выбрать следующий.

## Сборка

```bash
pnpm build
pnpm preview
```

Build последовательно обновляет source-contract snapshots и справочник кодов ошибок при наличии исходников, выполняет typecheck, собирает VitePress, LLM files и Knowledge Bundle. Тесты этой командой не запускаются. Сайт находится в `docs/.vitepress/dist`, Knowledge Bundle — в `dist/knowledge`. Preview корректно отдаёт UTF-8 для Markdown и plain text.

## Контракт публикации API snapshots

`docs/reference/contracts/`, `docs/raph/contracts/`, `docs/reference/language-catalog.md` и `docs/public/contracts-manifest.json` — **сохраняемые в Git generated references**. Их владелец — `scripts/build-contract-reference.mjs`; вручную менять declarations не следует. Это публикационный snapshot, нужный для самостоятельной сборки repository документации без монорепозитория.

```bash
pnpm contracts:build
```

Генератор читает package manifests и TypeScript source, извлекает явные package exports, доступные через фасад Core modules, декларации и унаследованные API собственных base classes. Runtime-код не исполняется; private members и комментарии реализации не публикуются. Debug wildcard patterns фиксируются отдельно от explicit export count. Общий каталог Source operations/arity извлекается из compiler AST. Это не typecheck packages и не доказательство runtime-поддержки каждого export.

По умолчанию исходники берутся из монорепозитория на три уровня выше repository документации. `ENDGE_SOURCE_ROOT` переопределяет его корень. В standalone checkout build с `--if-available` сохраняет опубликованные snapshots, если исходников packages нет. При обновлении контрактов включайте generated pages и manifest в тот же change; проверяйте diff и сборку. Удалённые compiler groups удаляются генератором.

Manifest содержит package versions, revision, hash source inputs, peer dependencies и import entrypoints. Revision относится к локальному source и может ещё отсутствовать в удалённом repository. Ссылки на `main` помогают навигации; для воспроизведения нужна соответствующая версия исходников. Package versions, Source versions, compiler version и Workspace snapshot schema — независимые значения.

## Справочник кодов ошибок

`docs/agents/errors.md` — тоже **сохраняемая в Git generated page**. Её владелец — `scripts/build-error-reference.mjs`; источник — каталог `docs/error-codes.yaml` Service Backend.

```bash
pnpm errors:build
```

Каталог ищется в `ENDGE_ERRORS_PATH`, затем в `services/egorkozelskij-endge-service-backend/docs/error-codes.yaml` монорепозитория. Если исходников backend нет, страница не меняется, и сборка использует сохранённый snapshot. Группы кодов задаёт список `GROUPS` в скрипте; код без группы попадает в «Прочие коды» с предупреждением в консоли.

## LLM files

```bash
pnpm llms:build
```

В `docs/.vitepress/dist` формируются:

- `llms.txt` — оглавление по [llmstxt.org](https://llmstxt.org/): маршрут агента, разделы по важности, у каждой ссылки описание и оценка размера, `## Optional` для contracts, Raph, Federation/Core и AI Workbench;
- `llms-agent.txt` — ядро для типовой работы через API/MCP: страницы `AGENT_CORE_PAGES`, компактные коды ошибок и все HTTP-операции без схем. Сборка падает, если оценка больше 60 тыс. токенов (`AGENT_TOKEN_LIMIT`);
- `llms-full.txt` — весь публичный каталог и HTTP API одним файлом;
- `llms-full/<раздел>.txt` — раздел целиком; раздел больше 100 тыс. токенов (`PART_TOKEN_LIMIT`) публикуется оглавлением частей, например `llms-full/reference/<тип>.txt` (часть больше лимита делится по страницам);
- `llms-full/api.txt` — оглавление HTTP API, `llms-full/api/<группа>.txt` — операции группы OpenAPI со всеми используемыми схемами;
- `<страница>.md` — Markdown-версия каждой публичной страницы;
- `llms-manifest.json` — provenance и список llms-файлов с размером, оценкой токенов и назначением; `contracts-manifest.json` — versions contracts.

Оценка токенов — символы кириллицы / 2,5 + остальные символы / 3,5. Она намеренно завышена: на этой документации на 10–30% больше счёта `o200k_base`. Часть больше 100 тыс. токенов даёт предупреждение и `overPartLimit` в manifest.

Описание страницы — frontmatter `description` (одно предложение, до ~160 символов, без прямых кавычек: VitePress не экранирует его в `<meta>`). Без него описанием становится первый абзац текста (`scripts/documentation-pages.mjs`); одно и то же описание попадает в `<meta name="description">`, `llms.txt` и Markdown-версию. Каждая публичная HTML-страница ссылается на свою Markdown-версию через `<link rel="alternate" type="text/markdown">` и на `llms.txt` через `<link rel="help">` с учётом `--base`; в теме есть кнопки «Открыть как Markdown» и «Скопировать Markdown». В `vitepress dev` Markdown-версий нет: их создаёт `pnpm llms:build`.

Публичный каталог един для LLM, Knowledge и Markdown-версий: все Markdown pages, кроме `project`, скрытых и служебных каталогов (`EXCLUDED_ROOTS`). Navigation и это исключение не определяют доступность страниц самого VitePress: внутренние планы не следует публиковать в public tree.

HTTP API берётся из OpenAPI Service Backend: явный `ENDGE_OPENAPI_PATH`, локальный `services/egorkozelskij-endge-service-backend/docs/openapi3.yaml`, затем `ENDGE_OPENAPI_URL` либо public `main`. Явно заданный отсутствующий файл считается ошибкой. Для воспроизводимой публикации задайте один закреплённый OpenAPI файл обеим выгрузкам. Workspace identity/display-name examples при рендеринге заменяются абстрактными; DTO, enum и constraints не меняются. `ENDGE_DOCS_URL` задаёт абсолютный base URL, `ENDGE_LLMS_OUTPUT` — отдельный output directory.

## Knowledge Bundle

```bash
pnpm knowledge:build
```

`dist/knowledge` содержит `documents.jsonl`, `manifest.json` и `contracts-manifest.json`. Помимо всех публичных Markdown pages включается тот же полный HTTP API. `ENDGE_KNOWLEDGE_OUTPUT` меняет output directory.

Manifest фиксирует Docs version, documentation fingerprint, OpenAPI hash/origin, количество documents/chunks и checksum JSONL. Markdown includes и именованные regions разворачиваются в обеих выгрузках. Heading parser учитывает code fences, поэтому Markdown-заголовки внутри примеров не становятся отдельными разделами. Целевой размер chunk — 6000 символов; неделимый code block может быть больше, чтобы сохранить целый пример. Bundle не включает credentials и не является источником фактических Workspace documents.
