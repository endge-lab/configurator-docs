/**
 * Общие правила публичных страниц без зависимостей от Node: их используют
 * генераторы llms, конфигурация VitePress и тема сайта (кнопки Markdown).
 */

/** Корни, которые остаются внутренними: их нет в llms, Knowledge Bundle и Markdown-версиях. */
export const EXCLUDED_ROOTS = Object.freeze(['project'])

/** Ориентир длины описания: столько показывают поисковики и помещается в строку оглавления llms.txt. */
export const DESCRIPTION_LIMIT = 160

/**
 * Страницы, которые сайт хранит ради старых адресов, но не обновляет. Их нет в llms,
 * Knowledge Bundle и Markdown-версиях: старое руководство Raph заменено страницей
 * `reference/raph.md`, сгенерированные контракты `raph/contracts/` остаются.
 */
export const ARCHIVED_PAGE_PATTERNS = Object.freeze([/^raph\/(?!contracts\/)/])

/** Страница сохранена по старому адресу, но не обновляется. */
export function isArchivedDocumentationPage(relativePath) {
  return ARCHIVED_PAGE_PATTERNS.some(pattern => pattern.test(relativePath))
}

/** Страница публикуется в Markdown, если она не служебная, не во внутреннем корне и не в архиве. */
export function isPublicDocumentationPage(relativePath) {
  if (!relativePath || !relativePath.endsWith('.md') || relativePath === '404.md') {
    return false
  }
  return !isArchivedDocumentationPage(relativePath)
    && !relativePath.split('/').some(part => part.startsWith('.') || EXCLUDED_ROOTS.includes(part))
}

/** Отделяет YAML frontmatter от текста страницы без его разбора. */
export function splitFrontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source)
  return match ? { frontmatter: match[1], body: source.slice(match[0].length) } : { frontmatter: '', body: source }
}

/** Приводит описание к одной строке: frontmatter может быть многострочным. */
export function normalizeDescription(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

/**
 * Запасное описание страницы: первый абзац обычного текста после заголовка.
 * Заголовки, код, таблицы, списки, цитаты-предупреждения, контейнеры `:::` и HTML
 * пропускаются; Markdown-разметка снимается; текст укорачивается до конца
 * предложения в пределах DESCRIPTION_LIMIT.
 */
export function autoDescription(markdown) {
  const candidates = paragraphs(markdown, 3).map(plainText).map(withoutStraightQuotes).filter(Boolean)
  for (const text of candidates) {
    // Абзац, который вводит список («… владеет:»), без своего последнего предложения.
    // Если предложение одно и достаточно содержательное, двоеточие заменяется точкой.
    if (!text.endsWith(':')) {
      return shorten(text)
    }
    const previous = text.replace(/(?:^|(?<=[.!?]\s))[^.!?]*:$/, '').trim()
    if (previous.length >= 30) {
      return shorten(previous)
    }
    if (text.length >= 40) {
      return shorten(text.replace(/:$/, '.'))
    }
  }
  return candidates[0] ? shorten(candidates[0].replace(/:$/, '.')) : ''
}

function paragraphs(markdown, limit) {
  const result = []
  let fence = null
  let container = 0
  let current = []
  const flush = () => {
    if (current.length) {
      result.push(current.join(' '))
      current = []
    }
  }
  for (const line of String(markdown).split(/\r?\n/)) {
    const trimmed = line.trim()
    const marker = /^ {0,3}(`{3,}|~{3,})/.exec(line)
    if (marker || fence) {
      if (marker && !fence) {
        fence = marker[1][0]
      }
      else if (marker && marker[1][0] === fence) {
        fence = null
      }
      flush()
      if (result.length >= limit) {
        break
      }
      continue
    }
    if (trimmed.startsWith(':::')) {
      container += trimmed === ':::' ? -1 : 1
      flush()
      if (result.length >= limit) {
        break
      }
      continue
    }
    const skipped = !trimmed
      || container > 0
      || /^(?:#{1,6}\s|[-*+]\s|\d+[.)]\s|!\[|\[\[|>\s*\[!|[{|<])/.test(trimmed)
    if (skipped) {
      flush()
      if (result.length >= limit) {
        break
      }
      continue
    }
    current.push(trimmed.replace(/^>\s?/, ''))
  }
  flush()
  return result.slice(0, limit)
}

/**
 * VitePress 1.6 вставляет description в `<meta content="…">` без экранирования,
 * поэтому прямые двойные кавычки заменяются ёлочками.
 */
export function withoutStraightQuotes(value) {
  return value.replace(/"([^"]*)"/g, '«$1»').replaceAll('"', '«')
}

function plainText(value) {
  // Код в обратных кавычках может содержать `<script setup>`: его не считаем HTML.
  const spans = []
  const masked = String(value).replace(/`([^`]+)`/g, (_, code) => `\uE000${spans.push(code) - 1}\uE000`)
  return normalizeDescription(masked
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\{#[^}]+\}/g, '')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(^|[\s(])[*_]([^*_\s][^*_]*)[*_](?=[\s).,;:!?]|$)/g, '$1$2')
    .replace(/\uE000(\d+)\uE000/g, (_, index) => spans[Number(index)]))
}

function shorten(text) {
  if (text.length <= DESCRIPTION_LIMIT) {
    return text
  }
  const window = text.slice(0, DESCRIPTION_LIMIT)
  const sentenceEnd = Math.max(...['. ', '! ', '? '].map(mark => window.lastIndexOf(mark)))
  if (sentenceEnd >= 60) {
    return window.slice(0, sentenceEnd + 1)
  }
  const space = window.lastIndexOf(' ', DESCRIPTION_LIMIT - 1)
  return `${window.slice(0, space > 60 ? space : DESCRIPTION_LIMIT - 1).replace(/[\s,;:—–-]+$/, '')}…`
}
