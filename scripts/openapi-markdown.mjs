/**
 * Превращает OpenAPI 3 спецификацию Service Backend в Markdown-справочник для
 * языковых моделей: каждая операция с параметрами, телом и ответами, затем все
 * схемы в виде TypeScript-подобных типов.
 */

const METHODS = ['get', 'post', 'put', 'patch', 'delete']

const UNTAGGED = 'Без группы'
/** Имена файлов для тегов, у которых общий префикс путей неточен или пуст. */
const TAG_SLUG_OVERRIDES = {
  'Сессия': 'session',
  'Управление доступом': 'access-grants',
  'Ревизии': 'revisions',
  'Перенос домена': 'domain-transfer',
  'Участники рабочего пространства': 'workspace-members',
  'Сервис': 'service',
}

export function openApiMarkdown(spec, { specUrl } = {}) {
  const operations = openApiOperations(spec)
  const tags = openApiTags(operations)
  const lines = [openApiHeaderMarkdown(spec, { specUrl })]
  lines.push('## Оглавление операций')
  lines.push(tags.map((tag) => {
    const items = operations.filter(entry => entry.tag === tag)
    return `- ${tag}: ${items.map(entry => `\`${entry.method.toUpperCase()} ${entry.path}\``).join(', ')}`
  }).join('\n'))

  for (const tag of tags) {
    lines.push(`## ${tag}`)
    for (const entry of operations.filter(value => value.tag === tag)) {
      lines.push(operationMarkdown(entry, spec))
    }
  }
  lines.push(schemasMarkdown(spec, Object.keys(spec.components?.schemas ?? {})))
  return `${lines.join('\n\n')}\n`
}

/** Заголовок справочника: название, версия, общее описание API и ссылка на спецификацию. */
export function openApiHeaderMarkdown(spec, { specUrl } = {}) {
  const info = spec.info ?? {}
  const lines = [`# ${info.title ?? 'API'} ${info.version ?? ''}`.trim()]
  if (info.description) {
    lines.push(clean(info.description))
  }
  if (specUrl) {
    lines.push(`Машиночитаемая спецификация OpenAPI 3: ${specUrl}`)
  }
  return lines.join('\n\n')
}

/** Все операции в порядке спецификации; группа — первый тег операции. */
export function openApiOperations(spec) {
  const operations = []
  for (const [path, item] of Object.entries(spec.paths ?? {})) {
    for (const method of METHODS) {
      if (item[method]) {
        operations.push({ path, method, operation: item[method], shared: item.parameters ?? [], tag: item[method].tags?.[0] ?? UNTAGGED })
      }
    }
  }
  return operations
}

export function openApiTags(operations) {
  return [...new Set(operations.map(entry => entry.tag))]
}

/**
 * Имя файла группы: явное имя из TAG_SLUG_OVERRIDES, латинский тег как есть, иначе
 * общий префикс путей операций (`/api/v1/domain/backups` → `domain-backups`).
 * Новый тег backend всегда получает имя: при совпадении добавляется номер.
 */
export function openApiTagSlugs(operations) {
  const slugs = new Map()
  for (const tag of openApiTags(operations)) {
    const base = TAG_SLUG_OVERRIDES[tag]
      ?? (/^[\w\s.-]+$/.test(tag) ? slugify(tag) : pathSlug(operations.filter(entry => entry.tag === tag).map(entry => entry.path)))
      ?? ''
    let slug = base || 'group'
    for (let index = 2; [...slugs.values()].includes(slug); index++) {
      slug = `${base || 'group'}-${index}`
    }
    slugs.set(tag, slug)
  }
  return slugs
}

/** Операции одной группы и все схемы, на которые они ссылаются (транзитивно). */
export function openApiTagMarkdown(spec, tag, operations) {
  const entries = operations.filter(entry => entry.tag === tag)
  const names = new Set()
  for (const entry of entries) {
    collectSchemaRefs([entry.shared, entry.operation.parameters, entry.operation.requestBody, entry.operation.responses], spec, names)
  }
  return [
    `## ${tag}`,
    ...entries.map(entry => operationMarkdown(entry, spec)),
    schemasMarkdown(spec, [...names]),
  ].join('\n\n')
}

/** Компактный список операций: метод, путь и summary, без схем. */
export function openApiOperationIndex(operations, { tagLink } = {}) {
  return openApiTags(operations).map((tag) => {
    const items = operations.filter(entry => entry.tag === tag)
    const link = tagLink?.(tag)
    return [
      `### ${tag}${link ? ` — [полностью](${link})` : ''}`,
      items.map(entry => `- \`${entry.method.toUpperCase()} ${entry.path}\`${entry.operation.summary ? ` — ${clean(entry.operation.summary)}` : ''}`).join('\n'),
    ].join('\n\n')
  }).join('\n\n')
}

function schemasMarkdown(spec, names) {
  const schemas = spec.components?.schemas ?? {}
  const lines = ['## Схемы данных', 'Типы записаны в TypeScript-подобной нотации. `?` — необязательное поле, в комментарии — описание, формат, ограничения и пример из спецификации.']
  for (const name of [...names].sort((left, right) => left.localeCompare(right))) {
    const schema = schemas[name]
    if (!schema) {
      continue
    }
    lines.push(`### ${name}`)
    if (schema.description) {
      lines.push(clean(schema.description))
    }
    lines.push(fence(typeText(schema, 0, true)))
  }
  return lines.join('\n\n')
}

function collectSchemaRefs(value, spec, names, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) {
    return
  }
  seen.add(value)
  if (typeof value.$ref === 'string') {
    const name = refName(value.$ref)
    if (value.$ref.startsWith('#/components/schemas/')) {
      if (names.has(name)) {
        return
      }
      names.add(name)
    }
    collectSchemaRefs(resolve(value, spec), spec, names, seen)
    return
  }
  for (const item of Array.isArray(value) ? value : Object.values(value)) {
    collectSchemaRefs(item, spec, names, seen)
  }
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z\d]+/g, '-').replace(/^-+|-+$/g, '')
}

/** Общий префикс путей; если его нет — самый частый первый сегмент после `/api/v1`. */
function pathSlug(paths) {
  const split = paths.map(value => value.split('/').filter(part => part && !/^\{.*\}$/.test(part) && part !== 'api' && !/^v\d+$/.test(part)))
  const common = []
  for (let index = 0; split.every(parts => index < parts.length && parts[index] === split[0][index]); index++) {
    common.push(split[0][index])
  }
  if (common.length) {
    return slugify(common.join('-'))
  }
  const counts = new Map()
  for (const parts of split.filter(value => value.length)) {
    counts.set(parts[0], (counts.get(parts[0]) ?? 0) + 1)
  }
  return slugify([...counts].sort((left, right) => right[1] - left[1])[0]?.[0] ?? '')
}

function operationMarkdown({ path, method, operation, shared }, spec) {
  const parts = [`### ${method.toUpperCase()} ${path}`]
  const header = []
  if (operation.summary) {
    header.push(`**${clean(operation.summary)}**`)
  }
  if (operation.description && operation.description !== operation.summary) {
    header.push(clean(operation.description))
  }
  if (header.length) {
    parts.push(header.join('\n\n'))
  }
  const facts = []
  if (operation.operationId) {
    facts.push(`- operationId: \`${operation.operationId}\``)
  }
  const security = operation.security ?? spec.security
  facts.push(`- Аутентификация: ${security?.length ? 'требуется (Bearer access token или cookie-сессия)' : 'не требуется'}`)
  if (operation.deprecated) {
    facts.push('- Устарела')
  }
  parts.push(facts.join('\n'))

  const parameters = [...shared, ...(operation.parameters ?? [])].map(parameter => resolve(parameter, spec))
  if (parameters.length) {
    parts.push([
      '| Параметр | Где | Обязателен | Тип | Описание |',
      '| --- | --- | --- | --- | --- |',
      ...parameters.map(parameter => `| \`${parameter.name}\` | ${parameter.in} | ${parameter.required ? 'да' : 'нет'} | ${cell(inlineType(parameter.schema ?? {}))} | ${cell(describe(parameter))} |`),
    ].join('\n'))
  }

  if (operation.requestBody) {
    const body = resolve(operation.requestBody, spec)
    const content = Object.entries(body.content ?? {})
    parts.push(`Тело запроса${body.required ? ' (обязательно)' : ''}${body.description ? `: ${clean(body.description)}` : ''}`)
    for (const [type, media] of content) {
      parts.push(`- \`${type}\`: ${typeReference(media.schema)}`)
    }
  }

  const responses = Object.entries(operation.responses ?? {})
  if (responses.length) {
    parts.push([
      'Ответы:',
      '',
      ...responses.map(([code, value]) => {
        const response = resolve(value, spec)
        const media = Object.entries(response.content ?? {})
        const types = media.map(([type, item]) => `${type === 'application/json' ? '' : `\`${type}\` `}${typeReference(item.schema)}`).join(', ')
        const headers = Object.entries(response.headers ?? {}).map(([name, item]) => `заголовок \`${name}\`${item.description ? ` (${clean(item.description)})` : ''}`)
        return `- \`${code}\` ${clean(response.description ?? '')}${types ? ` → ${types}` : ''}${headers.length ? `; ${headers.join(', ')}` : ''}`
      }),
    ].join('\n'))
  }
  return parts.join('\n\n')
}

function resolve(value, spec) {
  let current = value
  for (let depth = 0; current?.$ref && depth < 10; depth++) {
    const path = current.$ref.replace(/^#\//, '').split('/')
    current = path.reduce((target, key) => target?.[key], spec)
  }
  return current ?? {}
}

function refName(ref) {
  return ref.split('/').at(-1)
}

function typeReference(schema) {
  if (!schema) {
    return 'без тела'
  }
  if (schema.$ref) {
    return `\`${refName(schema.$ref)}\``
  }
  if (schema.type === 'array' && schema.items?.$ref) {
    return `\`${refName(schema.items.$ref)}[]\``
  }
  return `\`${inlineType(schema)}\``
}

function inlineType(schema) {
  return typeText(schema, 0, false).replace(/\s*\n\s*/g, ' ')
}

function typeText(schema, depth, expand) {
  if (!schema || typeof schema !== 'object') {
    return 'unknown'
  }
  if (schema.$ref) {
    return refName(schema.$ref)
  }
  for (const key of ['oneOf', 'anyOf']) {
    if (schema[key]) {
      return schema[key].map(item => typeText(item, depth, false)).join(' | ')
    }
  }
  if (schema.allOf) {
    return schema.allOf.map(item => typeText(item, depth, false)).join(' & ')
  }
  if (schema.enum) {
    return schema.enum.map(value => JSON.stringify(value)).join(' | ')
  }
  const nullable = schema.nullable ? ' | null' : ''
  if (schema.type === 'array') {
    return `${wrap(typeText(schema.items ?? {}, depth, false))}[]${nullable}`
  }
  if (schema.type === 'object' || schema.properties || schema.additionalProperties) {
    const properties = Object.entries(schema.properties ?? {})
    if (!properties.length) {
      const value = schema.additionalProperties && typeof schema.additionalProperties === 'object' && Object.keys(schema.additionalProperties).length
        ? typeText(schema.additionalProperties, depth, false)
        : 'unknown'
      return `Record<string, ${value}>${nullable}`
    }
    if (!expand && depth > 0) {
      return `object${nullable}`
    }
    const required = new Set(schema.required ?? [])
    const indent = '  '.repeat(depth + 1)
    const fields = properties.map(([name, property]) => {
      const comment = describe(property, name)
      const key = /^[A-Z_$][\w$]*$/i.test(name) ? name : JSON.stringify(name)
      return `${indent}${key}${required.has(name) ? '' : '?'}: ${typeText(property, depth + 1, expand)}${comment ? ` // ${comment}` : ''}`
    })
    return `{\n${fields.join('\n')}\n${'  '.repeat(depth)}}${nullable}`
  }
  const base = schema.type === 'integer' ? 'number' : (schema.type ?? 'unknown')
  return `${base}${nullable}`
}

function wrap(type) {
  return type.includes(' ') ? `(${type})` : type
}

function describe(value, propertyName = value.name) {
  const schema = value.schema ?? value
  const notes = []
  if (value.description) {
    notes.push(clean(value.description))
  }
  if (schema.format) {
    notes.push(`формат ${schema.format}`)
  }
  for (const [key, label] of [['minLength', 'мин. длина'], ['maxLength', 'макс. длина'], ['minimum', 'минимум'], ['maximum', 'максимум'], ['minItems', 'мин. элементов'], ['maxItems', 'макс. элементов'], ['pattern', 'шаблон']]) {
    if (schema[key] !== undefined) {
      notes.push(`${label} ${schema[key]}`)
    }
  }
  if (schema.default !== undefined) {
    notes.push(`по умолчанию ${JSON.stringify(schema.default)}`)
  }
  const rawExample = value.example ?? schema.example
  const example = /^(?:workspace|tenant)(?:Identity|Id|Name|DisplayName)?$/i.test(propertyName ?? '')
    ? /(?:DisplayName|Name)$/i.test(propertyName) ? 'Example Workspace' : 'example-workspace'
    : rawExample
  if (example !== undefined && typeof example !== 'object') {
    notes.push(`пример ${JSON.stringify(example instanceof Date ? example.toISOString() : example)}`)
  }
  return notes.join('; ')
}

function clean(text) {
  return String(text).replace(/\s+/g, ' ').trim()
}

function cell(text) {
  return text.replaceAll('|', '\\|')
}

function fence(code) {
  return `\`\`\`ts\n${code}\n\`\`\``
}
