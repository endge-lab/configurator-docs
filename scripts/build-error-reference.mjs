/**
 * Собирает справочник кодов ошибок Service Backend (docs/agents/errors.md) из
 * каталога docs/error-codes.yaml backend. Страница хранится в git: стенды
 * собирают сайт без исходников backend и используют сохранённый snapshot.
 *
 * Источник каталога:
 * - ENDGE_ERRORS_PATH — путь к error-codes.yaml (обязан существовать, если задан);
 * - иначе services/egorkozelskij-endge-service-backend/docs/error-codes.yaml монорепозитория;
 * - иначе страница не меняется (опубликованный snapshot).
 */
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, 'docs/agents/errors.md')
const localCatalog = path.resolve(root, '../../../services/egorkozelskij-endge-service-backend/docs/error-codes.yaml')
const CATALOG_PUBLIC_URL = 'https://github.com/endge-lab/service-backend/blob/main/docs/error-codes.yaml'

/**
 * Группы по смыслу для агента. Порядок важен: первое совпадение побеждает,
 * поэтому узкие правила стоят раньше общих.
 */
const GROUPS = [
  {
    id: 'auth',
    title: 'Вход и сессия',
    match: /^(?:unauthorized|user_inactive|csrf_|auth\.|auth_(?:access|login)_|session\.)/,
  },
  { id: 'tokens', title: 'Персональные токены', match: /^access_token_/ },
  {
    id: 'access',
    title: 'Роли и права доступа',
    match: /^(?:access_|external_access_|platform_|last_platform_admin|workspace_(?:admin|editor)_required|workspace_forbidden|shared_squash|user_query|cursor_invalid|workspace_role_invalid|workspace_selection_|membership_role_invalid|workspace_identity_required)/,
  },
  {
    id: 'request',
    title: 'Запрос: тело, параметры и заголовки',
    match: /^(?:validation_error|invalid_json|object_expected|read_only_field|string_array_invalid|path_parameter_invalid|query_boolean_invalid|query_owner_invalid|limit_invalid|offset_invalid|pagination\.\w+|active_invalid|if_match_invalid|precondition_required|snapshot_invalid|not_found|collection_unsupported)$/,
  },
  { id: 'facets', title: 'Фасеты', match: /^facet_/ },
  {
    id: 'history',
    title: 'Коммиты, восстановление, импорт и экспорт',
    match: /^(?:head_sequence_conflict|nothing_to_|revision_policy_invalid|import_|domain_version_|precondition_failed|export_option_invalid|archive_|encrypted_workspace_|workspace_password_|workspace_confirmation_invalid|workspace_schema_unsupported|backup_|revision_snapshot_invalid)/,
  },
  { id: 'releases', title: 'Релизы и сборки', match: /^(?:release_|build_(?!profile)|commit_message_required)/ },
  { id: 'build-profiles', title: 'Профили сборки', match: /^build_profile/ },
  {
    id: 'documents',
    title: 'Документы, Source и папки',
    match: /^(?:identity_|display_name_|revision_conflict|relation_target_not_found|managed_by_invalid|document_|source_|\w+_source_|component_|composition_|computation_|configuration_|update_store_required|vocab_|folder_|system_folder_immutable|move_|expected_revision_invalid)/,
  },
  { id: 'workspace', title: 'Workspace', match: /^(?:workspace_|installed_integrations_invalid|startup_composition_)/ },
  {
    id: 'integrations',
    title: 'Интеграции, AuthProfile и подключения backend',
    match: /^(?:auth_profile_|basic_|bearer_|oauth2_|oidc_|credentials?_invalid|integration_|backend_|secret_field_forbidden)/,
  },
  { id: 'ai', title: 'ИИ-ассистент и каталог моделей', match: /^ai\./ },
  { id: 'mock', title: 'Mock Generator и потоки тестовых данных', match: /^(?:mock\.|stream\.|request\.)/ },
  {
    id: 'internal',
    title: 'Общие и внутренние ошибки',
    match: /^(?:common\.|internal_error|\w+_mapping_failed|request_contract_missing)/,
  },
]
const OTHER_GROUP = { id: 'other', title: 'Прочие коды' }

const source = resolveSource()
if (!source) {
  if (!existsSync(output)) {
    throw new Error('Нет ни каталога ошибок backend, ни сохранённой страницы docs/agents/errors.md.')
  }
  console.log('Error reference: используется сохранённый snapshot; каталог backend недоступен.')
  process.exit(0)
}

const text = await readFile(source, 'utf8')
const catalog = parseYaml(text)
if (!Array.isArray(catalog?.codes) || !catalog.codes.length) {
  throw new Error(`Каталог ошибок без codes: ${source}`)
}
const version = await backendVersion(source)
const groups = [...GROUPS, OTHER_GROUP].map(group => ({ ...group, codes: [] }))
for (const entry of catalog.codes) {
  for (const field of ['code', 'status', 'meaning', 'action']) {
    if (entry[field] === undefined || entry[field] === '') {
      throw new Error(`У кода ${entry.code ?? '?'} нет поля ${field}.`)
    }
  }
  const group = groups.find(item => item.match?.test(entry.code)) ?? groups.at(-1)
  group.codes.push(entry)
}
const other = groups.at(-1)
if (other.codes.length) {
  console.warn(`Error reference: без группы ${other.codes.length} кодов: ${other.codes.map(item => item.code).join(', ')}`)
}
const filled = groups.filter(group => group.codes.length)
const sha256 = createHash('sha256').update(text).digest('hex')

await writeFile(output, page())
console.log(`Error reference: ${catalog.codes.length} кодов, ${filled.length} групп → docs/agents/errors.md`)

function resolveSource() {
  if (process.env.ENDGE_ERRORS_PATH) {
    const configured = path.resolve(process.env.ENDGE_ERRORS_PATH)
    if (!existsSync(configured)) {
      throw new Error('ENDGE_ERRORS_PATH не найден; проверьте заданный файл.')
    }
    return configured
  }
  return existsSync(localCatalog) ? localCatalog : undefined
}

/** VERSION лежит в корне backend рядом с docs/; для внешнего файла версия может быть неизвестна. */
async function backendVersion(file) {
  const candidate = path.resolve(path.dirname(file), '../VERSION')
  if (!existsSync(candidate)) {
    return undefined
  }
  return /^APP_VERSION=(\S+)$/m.exec(await readFile(candidate, 'utf8'))?.[1]
}

function page() {
  const lines = [
    '---',
    `description: ${JSON.stringify(`Все ${catalog.codes.length} кодов ошибок Service Backend: формат ответа, HTTP-статус, смысл и что делать агенту — исправить, повторить или спросить пользователя.`)}`,
    '---',
    '',
    '<!-- Сгенерировано scripts/build-error-reference.mjs из docs/error-codes.yaml Service Backend. Не редактируйте вручную: pnpm errors:build. -->',
    '',
    '# Коды ошибок Service Backend',
    '',
    `Справочник собран из каталога ошибок backend${version ? ` ${version}` : ''} ([error-codes.yaml](${CATALOG_PUBLIC_URL}), sha256 \`${sha256.slice(0, 12)}\`): ${catalog.codes.length} кодов. Каталог генерируется из исходников backend, поэтому в нём есть каждый \`code\`, который сервер может вернуть. Если код пришёл, а здесь его нет, сверьтесь с исходниками развёрнутой версии ([правила](/agents/#sources-and-versions)).`,
    '',
    '## Как читать ответ ошибки',
    '',
    'REST API отвечает на ошибку HTTP-статусом и JSON:',
    '',
    '```json',
    '{ "code": "validation_error", "message": "Некорректные поля запроса", "details": { "fields": { "modelVersion": "required field" } } }',
    '```',
    '',
    '- `code` — стабильный машинный код. Решение принимайте по нему, а не по тексту.',
    '- `message` — описание для человека. Текст может быть на русском или английском и меняться между версиями.',
    '- `details` — необязательный объект с подробностями: `fields` (поле → причина), `field`, `reason`, `maxTtlSeconds` и т. п. Ошибки middleware (`unauthorized`, `csrf_origin_rejected`, `user_inactive`) приходят без `details`; ответ `401 unauthorized` содержит `loginUrl` для браузера.',
    '- MCP-инструмент сообщает ту же ошибку результатом с `isError: true` и JSON `{ "error": "<code>", "status": <HTTP>, "message": "…", "details": {…} }` ([MCP](/agents/mcp)).',
    '',
    'Ответы без `code`:',
    '',
    '- `413 Request Entity Too Large` текстом, если тело запроса больше 16 МиБ (у `/mcp` — больше 4 МиБ). Уменьшите запрос: разбейте его на части.',
    '- `431` текстом, если заголовки больше 32 КиБ.',
    '- `404` текстом от Bridge, если он выключен на сервере.',
    '- Ошибки протокола JSON-RPC у `/mcp` (например, `-32602`, неизвестный инструмент) приходят в поле `error` JSON-RPC.',
    '',
    '## Общие правила по статусам',
    '',
    '| HTTP | Что означает | Что делать |',
    '| --- | --- | --- |',
    '| `400` | Запрос не прошёл проверку: тело, параметры, Source, заголовки | Не повторяйте без изменений. Исправьте поле из `details.fields` или `message` по схеме операции и отправьте снова |',
    '| `401` | Нет действующих учётных данных | Получите или обновите токен; персональный токен перевыпускает пользователь |',
    '| `403` | Не хватает роли или прав токена, права управляются провайдером | Не повторяйте и не обходите. Сообщите пользователю код и операцию |',
    '| `404` | Объект не найден в этом workspace | Проверьте `identity` по списку, `X-Endge-Workspace` и не удалён ли объект (`includeDeleted=true`) |',
    '| `409` | Конфликт состояния: identity занят, revision устарела, workspace изменился | Перечитайте объект или план, примените изменение к новой версии и повторите |',
    '| `412` | `If-Match` импорта не совпал с состоянием workspace | Постройте план импорта заново |',
    '| `413` | Тело слишком большое | Уменьшите тело запроса |',
    '| `428` | Нет обязательного `If-Match` | Прочитайте объект, передайте его `ETag` в `If-Match` |',
    '| `429` | Исчерпан лимит потоков Mock Generator | Закройте лишние потоки или подождите |',
    '| `500` | Внутренняя ошибка сервера | Повторите не более одного раза; при повторе сообщите пользователю код и время запроса |',
    '| `502`, `503`, `504` | Недоступен зависимый сервис (ИИ, Mock Generator, провайдер входа) | Подождите и повторите до 3 раз с паузой; затем сообщите пользователю |',
    '',
    'Повторы, `If-Match` и лимиты описаны в разделе [Лимиты, повторы и идемпотентность](/agents/#limits).',
    '',
    '## Группы',
    '',
    ...filled.map(group => `- [${group.title}](#${group.id}) — ${group.codes.length}`),
  ]
  for (const group of filled) {
    lines.push('', `## ${group.title} {#${group.id}}`, '', '| Код | HTTP | Смысл | Действие |', '| --- | --- | --- | --- |')
    for (const entry of [...group.codes].sort((left, right) => left.code.localeCompare(right.code))) {
      const statuses = [...new Set([entry.status, ...(entry.statuses ?? [])])].join(', ')
      lines.push(`| <a id="${entry.code}"></a>\`${entry.code}\` | ${statuses} | ${cell(entry.meaning)} | ${cell(entry.action)} |`)
    }
  }
  if (Array.isArray(catalog.dynamic) && catalog.dynamic.length) {
    lines.push('', '## Коды, которые приходят во время выполнения {#dynamic}', '')
    for (const item of catalog.dynamic) {
      lines.push(`- ${cell(item.note)}`)
    }
  }
  return `${lines.join('\n')}\n`
}

function cell(value) {
  return String(value)
    .replace(/\s+/g, ' ')
    .trim()
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('|', '\\|')
    .replaceAll('{{', '{&#8203;{')
}
