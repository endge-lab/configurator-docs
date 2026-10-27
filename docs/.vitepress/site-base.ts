import process from 'node:process'

// Расширения файлов, которые сайт отдаёт как есть (не страницы VitePress).
const FILE_LINK = /\.(?:txt|json|ya?ml|csv|pdf|zip)$/i

/**
 * Базовый путь сайта из CLI: `vitepress build docs --base /endge-docs/`.
 * Deployment может задавать `/endge-docs/`; локальный запуск использует `/`.
 */
export function resolveSiteBase(argv: readonly string[] = process.argv): string {
  let value: string | undefined
  argv.forEach((argument, index) => {
    if (argument === '--base') {
      value = argv[index + 1]
    }
    else if (argument.startsWith('--base=')) {
      value = argument.slice('--base='.length)
    }
  })
  const trimmed = (value ?? '').trim().replace(/^\/+|\/+$/g, '')
  return trimmed ? `/${trimmed}/` : '/'
}

/**
 * VitePress добавляет base только к ссылкам на страницы, а ссылки на файлы
 * (`/llms.txt`, `/examples/*.json`) оставляет как есть. Эта функция добавляет base
 * к корневой ссылке на файл; остальные ссылки возвращает без изменений.
 */
export function withFileBase(link: string, base: string = resolveSiteBase()): string {
  const pathname = link.split(/[?#]/)[0] ?? ''
  if (!link.startsWith('/') || link.startsWith('//') || !FILE_LINK.test(pathname) || base === '/' || link.startsWith(base)) {
    return link
  }
  return `${base}${link.slice(1)}`
}
