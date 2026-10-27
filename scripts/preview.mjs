/**
 * Локальный просмотр собранного сайта: обычный `vitepress preview`, но файлы
 * для агентов (`llms.txt`, `llms-full/*.txt`, `<страница>/index.md`) отдаются
 * с `charset=utf-8`. Без кодировки браузер читает русский текст как Latin-1.
 *
 * Использование: node scripts/preview.mjs [--port 4173]
 */

import process from 'node:process'
import { serve } from 'vitepress'

const portIndex = process.argv.indexOf('--port')
const port = portIndex === -1 ? 4173 : Number(process.argv[portIndex + 1])

const TEXT_TYPES = {
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

function textType(url) {
  const pathname = (url ?? '').split('?')[0]
  const extension = Object.keys(TEXT_TYPES).find(item => pathname.endsWith(item))
  return extension ? TEXT_TYPES[extension] : undefined
}

const app = await serve({ root: 'docs', port })

app.server.prependListener('request', (request, response) => {
  const type = textType(request.url)
  if (!type) {
    return
  }
  const writeHead = response.writeHead.bind(response)
  response.writeHead = (status, ...rest) => {
    for (const value of rest) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        for (const key of Object.keys(value)) {
          if (key.toLowerCase() === 'content-type') {
            delete value[key]
          }
        }
        value['Content-Type'] = type
      }
    }
    response.setHeader('Content-Type', type)
    return writeHead(status, ...rest)
  }
})
