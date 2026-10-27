/**
 * Превращает OpenAPI 3 спецификацию Service Backend в Markdown-справочник для
 * языковых моделей: каждая операция с параметрами, телом и ответами, затем все
 * схемы в виде TypeScript-подобных типов.
 */

const METHODS = ['get', 'post', 'put', 'patch', 'delete']

export function openApiMarkdown(spec, { specUrl } = {}) {
  const schemas = spec.components?.schemas ?? {}
  const lines = []
  const info = spec.info ?? {}
  lines.push(`# ${info.title ?? 'API'} ${info.version ?? ''}`.trim())
  if (info.description) {
    lines.push(clean(info.description))
  }
  if (specUrl) {
    lines.push(`Машиночитаемая спецификация OpenAPI 3: ${specUrl}`)
  }

  const operations = []
  for (const [path, item] of Object.entries(spec.paths ?? {})) {
    for (const method of METHODS) {
      if (item[method]) {
        operations.push({ path, method, operation: item[method], shared: item.parameters ?? [] })
      }
    }
  }
  const tags = []
  for (const { operation } of operations) {
    for (const tag of operation.tags?.length ? operation.tags : ['Без группы']) {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }
  }

  lines.push('## Оглавление операций')
  lines.push(tags.map((tag) => {
    const items = operations.filter(entry => (entry.operation.tags?.[0] ?? 'Без группы') === tag)
    return `- ${tag}: ${items.map(entry => `\`${entry.method.toUpperCase()} ${entry.path}\``).join(', ')}`
  }).join('\n'))

  for (const tag of tags) {
    lines.push(`## ${tag}`)
    for (const entry of operations.filter(value => (value.operation.tags?.[0] ?? 'Без группы') === tag)) {
      lines.push(operationMarkdown(entry, spec))
    }
  }

  lines.push('## Схемы данных')
  lines.push('Типы записаны в TypeScript-подобной нотации. `?` — необязательное поле, в комментарии — описание, формат, ограничения и пример из спецификации.')
  for (const [name, schema] of Object.entries(schemas).sort(([left], [right]) => left.localeCompare(right))) {
    lines.push(`### ${name}`)
    if (schema.description) {
      lines.push(clean(schema.description))
    }
    lines.push(fence(typeText(schema, 0, true)))
  }
  return `${lines.join('\n\n')}\n`
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
      const comment = describe(property)
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

function describe(value) {
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
  const example = value.example ?? schema.example
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
