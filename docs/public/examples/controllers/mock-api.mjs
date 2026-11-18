import { createServer } from 'node:http'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
// Same neutral page contract as the Configurator collection-window fixture.
export function startMockAPI(port = 4182) {
  const requests = []
  let failuresEnabled = true
  const server = createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }
    if (req.url === '/__collection-window/requests') {
      res.end(JSON.stringify(requests))
      return
    }
    if (!['/__collection-window/page', '/graphql'].includes(req.url) || req.method !== 'POST') {
      res.writeHead(404)
      res.end('{}')
      return
    }
    let body = ''
    for await (const chunk of req) {
      body += chunk
    }
    const parsed = JSON.parse(body || '{}')
    const input = req.url === '/graphql' ? parsed.variables : parsed
    requests.push(input)
    const limit = Number(input.limit ?? 40)
    const cursor = Number(input.cursor ?? 100)
    const start = Math.max(0, Number(input.offset ?? (input.direction === 'before' ? cursor - limit : cursor)))
    const end = Math.min(500, start + limit)
    setTimeout(() => {
      if (input.fail && failuresEnabled) {
        res.writeHead(503)
        res.end(JSON.stringify({ message: 'Fixture page failure' }))
        return
      }
      const page = { rows: Array.from({ length: Math.max(0, end - start) }, (_, i) => ({ id: String(start + i), label: `${input.filter ?? 'all'} record ${start + i}` })), offset: start, total: 500, startCursor: String(start), endCursor: String(end), hasBefore: start > 0, hasAfter: end < 500 }
      res.end(JSON.stringify(req.url === '/graphql' ? { data: { window: page } } : page))
    }, Number(input.delay ?? 20))
  })
  return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve({ server, requests, setFailureMode: (enabled) => {
    failuresEnabled = enabled
  }, endpoint: `http://127.0.0.1:${server.address().port}` })))
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startMockAPI(Number(process.argv[2] ?? 4182)).then((api) => {
    process.stdout.write(`Mock API: ${api.endpoint}/__collection-window/page (POST); stop with Ctrl-C\n`)
  }).catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
