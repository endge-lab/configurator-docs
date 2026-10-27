interface MarkdownToken {
  info: string
  content: string
}

interface MarkdownRenderer {
  rules: {
    fence?: (...args: Array<any>) => string
  }
  renderToken: (...args: Array<any>) => string
}

interface MarkdownItLike {
  renderer: MarkdownRenderer
}

export function configureDocsMarkdown(markdown: MarkdownItLike): void {
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
