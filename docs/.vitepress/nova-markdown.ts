interface MarkdownToken {
  info: string
  content: string
}

interface MarkdownState {
  src: string
}

interface MarkdownRenderer {
  rules: {
    fence?: (...args: Array<any>) => string
  }
  renderToken: (...args: Array<any>) => string
}

interface MarkdownItLike {
  core: {
    ruler: {
      before: (beforeName: string, ruleName: string, handler: (state: MarkdownState) => void) => void
    }
  }
  renderer: MarkdownRenderer
}

export function configureNovaMarkdown(markdown: MarkdownItLike): void {
  markdown.core.ruler.before('block', 'nova-doc-directives', state => {
    state.src = replaceNovaDirectives(state.src)
  })

  const defaultFence = markdown.renderer.rules.fence?.bind(markdown.renderer)
  markdown.renderer.rules.fence = (...args: Array<any>) => {
    const tokens = args[0] as Array<MarkdownToken>
    const index = args[1] as number
    const token = tokens[index]!

    if (token.info.trim() === 'mermaid') {
      return `<NovaMermaid source="${escapeAttribute(encodeURIComponent(token.content))}" />`
    }

    if (token.info.trim() === 'nova') {
      token.info = 'html'
    }

    return defaultFence?.(...args) ?? markdown.renderer.renderToken(...args)
  }
}

function replaceNovaDirectives(source: string): string {
  const lines = source.split('\n')
  const result: Array<string> = []
  let fence = ''

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]!
    const fenceMatch = line.match(/^\s*(```+|~~~+)/)
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1]![0]!
      else if (fence === fenceMatch[1]![0]) fence = ''
      result.push(line)
      continue
    }

    if (!fence && lines[index + 1]?.trim() === ':::') {
      const directive = line.match(/^:::(example|contract)\s+(.+)$/)
      if (directive) {
        const component = directive[1] === 'example' ? 'NovaExample' : 'NovaContract'
        result.push(`<${component}${renderAttributes(parseAttributes(directive[2]!))} />`)
        index += 1
        continue
      }
    }

    result.push(line)
  }

  return result.join('\n')
}

function parseAttributes(source: string): Record<string, string> {
  const attributes: Record<string, string> = {}
  const pattern = /([\w-]+)="([^"]*)"/g
  let match = pattern.exec(source)

  while (match) {
    attributes[match[1]!] = match[2]!
    match = pattern.exec(source)
  }

  return attributes
}

function renderAttributes(attributes: Record<string, string>): string {
  return Object.entries(attributes)
    .map(([name, value]) => ` ${toKebabCase(name)}="${escapeAttribute(value)}"`)
    .join('')
}

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, character => `-${character.toLowerCase()}`)
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
