import { withFileBase } from './site-base'

interface MarkdownToken {
  info: string
  content: string
  attrGet: (name: string) => string | null
  attrSet: (name: string, value: string) => void
}

interface MarkdownRenderer {
  rules: {
    fence?: (...args: Array<any>) => string
    link_open?: (...args: Array<any>) => string
  }
  renderToken: (...args: Array<any>) => string
}

interface MarkdownItLike {
  renderer: MarkdownRenderer
}

export function configureDocsMarkdown(markdown: MarkdownItLike): void {
  // VitePress сам добавляет base ко всем корневым ссылкам Markdown, включая файлы
  // (`/llms.txt`, `/examples/*.json`), кроме ссылок с target или download.
  // Только им base добавляется здесь, иначе получается `/endge-docs/endge-docs/…`.
  const defaultLinkOpen = markdown.renderer.rules.link_open?.bind(markdown.renderer)
  markdown.renderer.rules.link_open = (...args: Array<any>) => {
    const tokens = args[0] as Array<MarkdownToken>
    const token = tokens[args[1] as number]!
    const href = token.attrGet('href')
    if (href && (token.attrGet('target') !== null || token.attrGet('download') !== null)) {
      token.attrSet('href', withFileBase(href))
    }
    return defaultLinkOpen?.(...args) ?? markdown.renderer.renderToken(...args)
  }

  const defaultFence = markdown.renderer.rules.fence?.bind(markdown.renderer)
  markdown.renderer.rules.fence = (...args: Array<any>) => {
    const tokens = args[0] as Array<MarkdownToken>
    const index = args[1] as number
    const token = tokens[index]!

    if (token.info.trim() === 'mermaid') {
      return `<EndgeMermaid source="${escapeAttribute(encodeURIComponent(token.content))}" />`
    }

    return defaultFence?.(...args) ?? markdown.renderer.renderToken(...args)
  }
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
