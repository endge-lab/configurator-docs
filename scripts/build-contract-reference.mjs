/** Публикует точные TypeScript declarations из source, без выполнения кода пакетов. */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workspace = path.resolve(process.env.ENDGE_SOURCE_ROOT ?? path.join(root, '../../..'))
const packages = [
  { id: 'core', directory: 'web/packages/@endge/@endge-core', output: 'reference/contracts/core' },
  { id: 'ui-vue', directory: 'web/packages/@endge/@endge-ui-vue', output: 'reference/contracts/ui-vue' },
  { id: 'utils', directory: 'web/packages/@endge/@endge-utils', output: 'reference/contracts/utils' },
  { id: 'computation-sandbox', directory: 'web/packages/@endge/@endge-computation-sandbox', output: 'reference/contracts/computation-sandbox' },
  // Исходники Federation и Raph в закрытом GitLab: ссылка на repository остаётся canonical,
  // а публичный источник declarations — опубликованный npm package.
  { id: 'federation', directory: 'web/packages/@typedworks/@typedworks-federation', output: 'reference/contracts/federation', closed: true },
  { id: 'raph', directory: 'web/packages/@raphy-js/framework/@raphy-js-raph', output: 'raph/contracts', closed: true },
]
if (!packages.every(item => existsSync(path.join(workspace, item.directory, 'package.json')))) {
  if (!process.argv.includes('--if-available')) {
    throw new Error('Нужны исходники packages. Задайте ENDGE_SOURCE_ROOT с корнем монорепозитория.')
  }
  if (!existsSync(path.join(root, 'docs/public/contracts-manifest.json'))) {
    throw new Error('Нет ни исходников, ни опубликованного contracts-manifest.json.')
  }
  console.log('API reference: используются сохранённые snapshots; исходники packages недоступны.')
  process.exit(0)
}
const manifest = { format: 'endge-contracts/v1', packages: [] }
const index = [...frontmatter('Каталог публичных TypeScript-контрактов Endge Core, UI Vue, Utils, Federation и Raph из исходников: версии, точки входа и группы деклараций.'), '# Каталог контрактов из исходников', '', 'Справочник фиксирует публичные exports и декларации текущего source. Код пакетов не выполняется. Версия, Git revision, hash входов и peer dependencies указаны в [manifest](/contracts-manifest.json). Эти данные описывают локальный source snapshot; они не подтверждают публикацию соответствующего commit в публичном repository.', '', 'Декларации ниже — TypeScript API библиотек. Это **не** авторский Source (`defineQuery`, `defineStore` и т. п.) и **не** JSON DTO backend. Авторские языки описаны в [маршруте агента](/agents/authoring), HTTP DTO — в [API](/llms-full/api.txt). Private members и комментарии реализации удалены. Protected members предназначены для наследования; подчёркнутые служебные hooks не следует вызывать из обычного consumer. Имена импортируемых вспомогательных типов разрешаются в указанном исходном модуле.', '', 'Наличие export не обещает capability конкретного renderer или backend. Для таких ограничений используйте [матрицу возможностей](/reference/capabilities).', '']

for (const item of packages) {
  const directory = path.join(workspace, item.directory)
  const pkg = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'))
  const repository = repositoryURL(pkg.repository)
  const entries = []
  for (const [subpath, value] of Object.entries(pkg.exports ?? {})) {
    const types = typeof value === 'object' && value ? value.types : null
    if (typeof types !== 'string' || types.includes('*')) {
      continue
    }
    const source = types.replace(/^\.\/dist\//, './src/').replace(/\.d\.[cm]?ts$/, '.ts')
    if (!existsSync(path.join(directory, source))) {
      throw new Error(`Нет source для types entrypoint ${pkg.name}/${subpath}`)
    }
    entries.push({ import: subpath === '.' ? pkg.name : `${pkg.name}/${subpath.slice(2)}`, source: path.resolve(directory, source) })
  }
  if (!entries.length) {
    throw new Error(`Не найдены source entrypoints ${pkg.name}`)
  }
  const configFile = ['tsconfig.app.json', 'tsconfig.json'].map(name => path.join(directory, name)).find(existsSync)
  const config = configFile ? ts.readConfigFile(configFile, ts.sys.readFile) : { config: {} }
  const parsed = ts.parseJsonConfigFileContent(config.config ?? {}, ts.sys, directory)
  const program = ts.createProgram(entries.map(entry => entry.source), {
    ...parsed.options,
    noEmit: false,
    declaration: true,
    emitDeclarationOnly: true,
    noCheck: true,
    incremental: false,
    composite: false,
    declarationMap: false,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext,
    skipLibCheck: true,
  })
  const checker = program.getTypeChecker()
  const publicFiles = new Set(entries.map(entry => entry.source))
  const exports = []
  for (const entry of entries) {
    const sf = program.getSourceFile(entry.source)
    const module = sf && checker.getSymbolAtLocation(sf)
    if (!module) {
      throw new Error(`Не найден module ${entry.source}`)
    }
    for (const symbol of checker.getExportsOfModule(module)) {
      const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
      const declarations = target.getDeclarations() ?? symbol.getDeclarations() ?? []
      for (const declaration of declarations) {
        const file = declaration.getSourceFile().fileName
        if (file.startsWith(`${directory}/src/`)) {
          publicFiles.add(file)
        }
      }
      exports.push({ entrypoint: entry.import, name: symbol.name, source: declarations[0]?.getSourceFile().fileName ?? entry.source })
    }
  }
  const sourceFiles = program.getSourceFiles().filter(sf => sf.fileName.startsWith(`${directory}/src/`) && !/\/(?:test|tests)\//.test(sf.fileName))
  // Модули фасада доступны через Endge, даже если их class не реэкспортирован
  // отдельным именем из package entrypoint.
  if (item.id === 'core') {
    for (const sf of sourceFiles) {
      if (/\/Endge\w+_Module\.ts$/.test(sf.fileName)) {
        publicFiles.add(sf.fileName)
      }
    }
  }
  // Унаследованные public методы тоже являются контрактом: например,
  // RaphReactivity наследует signal/scope у собственного ReactivityEngine.
  const inheritanceFiles = [...publicFiles]
  for (const file of inheritanceFiles) {
    const sf = program.getSourceFile(file)
    if (!sf) {
      continue
    }
    const visit = (node) => {
      if (ts.isClassDeclaration(node)) {
        const type = checker.getTypeAtLocation(node)
        for (const base of type.getBaseTypes?.() ?? []) {
          for (const declaration of base.symbol?.declarations ?? []) {
            const target = declaration.getSourceFile().fileName
            if (target.startsWith(`${directory}/src/`) && !publicFiles.has(target)) {
              publicFiles.add(target)
              inheritanceFiles.push(target)
            }
          }
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(sf)
  }
  const inputHash = createHash('sha256').update(JSON.stringify(pkg))
  for (const sf of [...sourceFiles].sort((a, b) => a.fileName.localeCompare(b.fileName))) {
    inputHash.update(path.relative(directory, sf.fileName)).update('\0').update(sf.text).update('\0')
  }
  const groups = new Map()
  for (const sf of sourceFiles) {
    if (!publicFiles.has(sf.fileName) && !/\.types?|\/types\/|\/domain\/|\/entrypoints\//.test(sf.fileName)) {
      continue
    }
    let declaration = ''
    const emitted = program.emit(sf, (name, content) => {
      if (name.endsWith('.d.ts')) {
        declaration = publicDeclaration(content)
      }
    }, undefined, true)
    if (emitted.emitSkipped || !declaration.trim()) {
      continue
    }
    const relative = path.relative(directory, sf.fileName).split(path.sep).join('/')
    const group = groupOf(relative, item.id)
    const records = groups.get(group) ?? []
    records.push({ relative, declaration })
    groups.set(group, records)
  }
  if (!groups.size) {
    throw new Error(`Не извлечены declarations ${pkg.name}`)
  }
  const output = path.join(root, 'docs', item.output)
  await mkdir(output, { recursive: true })
  const expected = new Set(['index.md'])
  const lines = [...frontmatter(`Публичные TypeScript-контракты ${pkg.name} ${pkg.version}: точки входа, группы деклараций и полный список exports.`), `# ${pkg.name}: публичные контракты`, '', `Source version: **${pkg.version}**. ${repositoryText(item, pkg, repository)} [Общий каталог](/reference/contracts/).`, '', 'Точные сигнатуры, overloads, generic-параметры, события и shapes собраны из исходников TypeScript. Вызовы из примеров документации сверяйте с этим snapshot. Извлечение declarations не заменяет typecheck или runtime verification.', '', '## Точки входа', '', '| Import | Source |', '| --- | --- |', ...entries.map(entry => `| \`${entry.import}\` | ${sourceLink(item, repository, path.relative(directory, entry.source))} |`), '', ...(Object.keys(pkg.exports).some(key => key.includes('*')) ? [`Pattern exports: ${Object.entries(pkg.exports).filter(([key]) => key.includes('*')).map(([key, value]) => `\`${pkg.name}/${key.slice(2)}\` (types: \`${value.types}\`)`).join(', ')}. Debug build modules не заменяют стабильные entrypoints; таблица exports ниже считает явные entrypoints.`, ''] : []), '## Контракты по владельцам', '']
  for (const [group, records] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
    const file = `${group}.md`
    expected.add(file)
    lines.push(`- [${group}](./${group}) — ${records.length} исходных модулей.`)
    const content = [...frontmatter(`TypeScript-декларации ${pkg.name} ${pkg.version}, группа ${group}; исходных модулей: ${records.length}.`), `# ${pkg.name}: ${group}`, '', `Версия source: ${pkg.version}. [Каталог package](./). ${repositoryText(item, pkg, repository)}`, '', ...records.sort((a, b) => a.relative.localeCompare(b.relative)).flatMap(record => [
      `## ${record.relative}`,
      '',
      item.closed ? `Исходный модуль: \`${record.relative}\`` : `[Исходный модуль](${sourceURL(repository, record.relative)})`,
      '',
      '```ts',
      record.declaration.trim(),
      '```',
      '',
    ])].join('\n')
    await writeFile(path.join(output, file), content)
  }
  lines.push('', '## Все публичные exports', '', '| Import | Export | Объявление |', '| --- | --- | --- |')
  for (const entry of exports.sort((a, b) => `${a.entrypoint}:${a.name}`.localeCompare(`${b.entrypoint}:${b.name}`))) {
    const local = entry.source.startsWith(`${directory}/`)
    const relative = local ? path.relative(directory, entry.source).split(path.sep).join('/') : null
    lines.push(`| \`${entry.entrypoint}\` | \`${entry.name}\` | ${relative ? sourceLink(item, repository, relative) : 'Реэкспорт: декларация принадлежит dependency package; см. исходный entrypoint'} |`)
  }
  await writeFile(path.join(output, 'index.md'), `${lines.join('\n')}\n`)
  for (const file of await readdir(output)) {
    if (file.endsWith('.md') && !expected.has(file)) {
      await rm(path.join(output, file))
    }
  }
  const revision = execFileSync('git', ['-C', directory, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
  manifest.packages.push({ name: pkg.name, version: pkg.version, repository, revision, sourceSha256: inputHash.digest('hex'), entrypoints: entries.map(entry => ({ import: entry.import, source: path.relative(directory, entry.source).split(path.sep).join('/') })), exportCount: exports.length, declarationModuleCount: [...groups.values()].reduce((n, records) => n + records.length, 0), exportPatterns: Object.fromEntries(Object.entries(pkg.exports).filter(([key]) => key.includes('*'))), peerDependencies: pkg.peerDependencies ?? {}, pages: [...expected].sort().map(file => `${item.output}/${file}`) })
  index.push(`- [${pkg.name} ${pkg.version}](/${item.output}/) — ${exports.length} exports, ${groups.size} групп контрактов.`)
  console.log(`${pkg.name}: ${exports.length} exports, ${groups.size} групп`)
}
await mkdir(path.join(root, 'docs/reference/contracts'), { recursive: true })
await writeFile(path.join(root, 'docs/reference/contracts/index.md'), `${index.join('\n')}\n`)
await writeFile(path.join(root, 'docs/public/contracts-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
await writeLanguageCatalog()

/** Описание страницы для meta description и оглавления llms.txt; JSON-строка — валидный YAML. */
function frontmatter(description) {
  return ['---', `description: ${JSON.stringify(description)}`, '---', '']
}
function repositoryURL(value) {
  const raw = (typeof value === 'string' ? value : value?.url ?? '').replace(/^git\+/, '').replace(/\.git$/, '')
  const url = new URL(raw)
  if (url.username || url.password || url.protocol !== 'https:') {
    throw new Error('Repository должен иметь публичный HTTPS URL без credentials.')
  }
  return raw
}
function repositoryText(item, pkg, repository) {
  if (!item.closed) {
    return `[Repository](${repository}).`
  }
  return `Repository: ${repository} (закрыт, canonical). Публичные declarations — [${pkg.name}@${pkg.version} в npm](https://unpkg.com/${pkg.name}@${pkg.version}/).`
}
function sourceLink(item, repository, file) {
  const relative = file.split(path.sep).join('/')
  return item.closed ? `\`${relative}\`` : `[${relative}](${sourceURL(repository, relative)})`
}
function sourceURL(repository, file) {
  return `${repository}/${repository.includes('gitlab.com') ? '-/blob' : 'blob'}/main/${file.split(path.sep).join('/')}`
}
function groupOf(file, id) {
  if (id === 'core') {
    return (/src\/features\/core\/modules\/([^/]+)/.exec(file)?.[1] ?? (/\/federation\//.test(file) ? 'federation' : 'bootstrap')).replace(/\.ts$/, '')
  }
  if (id === 'raph') {
    return file.split('/')[1] === 'entrypoints' ? 'entrypoints' : file.split('/')[1].replace(/\.ts$/, '')
  }
  return file.split('/')[1]?.replace(/\.ts$/, '') ?? 'public-api'
}
function publicDeclaration(source) {
  const sf = ts.createSourceFile('contract.d.ts', source, ts.ScriptTarget.Latest, true)
  const transformed = ts.transform(sf, [(context) => {
    const visit = (node) => {
      if (node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.PrivateKeyword) || (node.name && ts.isPrivateIdentifier(node.name))) {
        return undefined
      }
      return ts.visitEachChild(node, visit, context)
    }
    return node => ts.visitNode(node, visit)
  }])
  const value = ts.createPrinter({ removeComments: true }).printFile(transformed.transformed[0])
  transformed.dispose()
  return value
}
async function writeLanguageCatalog() {
  const relative = 'src/features/core/modules/source/services/compilers/source-expression-compile.ts'
  const source = await readFile(path.join(workspace, packages[0].directory, relative), 'utf8')
  const sf = ts.createSourceFile(relative, source, ts.ScriptTarget.Latest, true)
  const objects = new Map()
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      const value = ts.isObjectLiteralExpression(node.initializer)
        ? node.initializer
        : ts.isCallExpression(node.initializer) ? node.initializer.arguments.find(ts.isObjectLiteralExpression) : null
      if (value) {
        objects.set(node.name.text, value)
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  const properties = (name) => {
    const value = objects.get(name)
    if (!value) {
      throw new Error(`Не найден source contract ${name}`)
    }
    return value.properties.filter(ts.isPropertyAssignment)
  }
  const literal = node => ts.isStringLiteral(node) || ts.isNumericLiteral(node) || ts.isIdentifier(node) ? node.text : null
  const arity = new Map(properties('OPERATION_ARITY').map(node => [literal(node.name), Object.fromEntries(node.initializer.properties.map(item => [literal(item.name), literal(item.initializer)]))]))
  const overrides = new Map(properties('FUNCTION_OPERATION_OVERRIDES').map(node => [literal(node.name), literal(node.initializer)]))
  const lines = [...frontmatter('Функции и readers общего языка выражений Source, извлечённые из compiler: имя, операция IR и число аргументов.'), '# Каталог функций авторских выражений', '', 'Таблица извлечена из compiler source вместе с [TypeScript-контрактами](/reference/contracts/). Она фиксирует имена и число аргументов; семантика, примеры и правила null описаны в [функциональных выражениях](/reference/value-expressions).', '', '**Область применения:** общий Source Expression DSL. Это не список JavaScript-функций SFC. Конкретный host может сужать readers и операции: например, [Filter](/reference/filter) допускает лишь небольшой whitelist. Не переносите эту таблицу в SFC interpolation или event input.', '', '## Операции', '', '| Функция | IR operation | Аргументы функции |', '| --- | --- | --- |']
  for (const node of properties('OPERATION_FUNCTIONS')) {
    const name = literal(node.name)
    const operation = overrides.get(name) ?? literal(node.initializer)
    const bounds = arity.get(operation)
    if (!bounds) {
      throw new Error(`Не найдена arity ${operation}`)
    }
    lines.push(`| \`${name}(...)\` | \`${operation}\` | ${bounds.min}${bounds.max ? bounds.max === bounds.min ? '' : `–${bounds.max}` : '+'} |`)
  }
  lines.push('', 'В chain-форме receiver занимает место первого аргумента. В predicate callbacks часть операций может неявно читать текущий элемент; такие сокращения применяйте только по примерам общего reference. `coalesce(...)` использует обычную операцию coalesce, а `.coalesce(...)` внутри join — отдельную join operation.', '', '## Readers', '', '| Имя | IR read kind | Доступность |', '| --- | --- | --- |')
  for (const node of properties('READ_FUNCTIONS')) {
    const name = literal(node.name)
    lines.push(`| \`${name}\` | \`${literal(node.initializer)}\` | ${name.startsWith('__') ? 'Внутреннее имя compiler; не писать вручную' : 'Определяется host-документом'} |`)
  }
  lines.push('', '`facet`, `config`, `context`, `contextSwitch` — отдельные compiler-owned конструкции структурного контекста. `input`, `event`, `now` и другие специализированные readers принадлежат конкретным языкам; отсутствие в общей таблице не отменяет их локальный контракт.', '', `[Владеющий compiler](https://github.com/endge-lab/core/blob/main/${relative}).`, '')
  await writeFile(path.join(root, 'docs/reference/language-catalog.md'), lines.join('\n'))
}
