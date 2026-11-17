import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

/** Не принимаем Git родительского checkout за revision скопированного сайта. */
export function documentationProvenance(repositoryRoot) {
  const hasGit = existsSync(path.join(repositoryRoot, '.git'))
  const git = args => execFileSync('git', args, { cwd: repositoryRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
  const sourceCommit = process.env.ENDGE_DOCS_SOURCE_COMMIT || process.env.GITHUB_SHA || process.env.CI_COMMIT_SHA
  return {
    sourceCommit: sourceCommit || (hasGit ? git(['rev-parse', 'HEAD']) : 'unknown'),
    sourceDirty: hasGit ? Boolean(git(['status', '--porcelain', '--untracked-files=normal'])) : null,
  }
}
