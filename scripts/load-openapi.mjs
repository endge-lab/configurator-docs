import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { parse as parseYaml } from 'yaml'

export const OPENAPI_PUBLIC_URL = 'https://github.com/endge-lab/service-backend/blob/main/docs/openapi3.yaml'
const OPENAPI_RAW_URL = 'https://raw.githubusercontent.com/endge-lab/service-backend/main/docs/openapi3.yaml'

export async function loadOpenApi(repositoryRoot) {
  const local = process.env.ENDGE_OPENAPI_PATH
    ?? path.resolve(repositoryRoot, '../../../services/egorkozelskij-endge-service-backend/docs/openapi3.yaml')
  let spec
  let origin
  if (existsSync(local)) {
    spec = parseYaml(await readFile(local, 'utf8'))
    origin = 'local-file'
  }
  else {
    if (process.env.ENDGE_OPENAPI_PATH) {
      throw new Error('ENDGE_OPENAPI_PATH не найден; проверьте заданный файл.')
    }
    const source = process.env.ENDGE_OPENAPI_URL ?? OPENAPI_RAW_URL
    origin = process.env.ENDGE_OPENAPI_URL ? 'configured-url' : 'public-main'
    const response = await fetch(source, { signal: AbortSignal.timeout(30_000) })
    if (!response.ok) {
      throw new Error(`OpenAPI HTTP ${response.status}; задайте ENDGE_OPENAPI_PATH.`)
    }
    spec = parseYaml(await response.text())
  }
  if (!spec?.openapi || !spec.paths || !spec.components?.schemas) {
    throw new Error('Неполная OpenAPI specification.')
  }
  return { spec, origin, sha256: createHash('sha256').update(JSON.stringify(spec)).digest('hex') }
}
