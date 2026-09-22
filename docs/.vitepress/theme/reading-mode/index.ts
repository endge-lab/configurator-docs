import type { InjectionKey } from 'vue'
import { inject } from 'vue'
import { ReadingMode_Module } from './ReadingMode_Module'

export const readingModeInjectionKey: InjectionKey<ReadingMode_Module> = Symbol.for('endge-docs:reading-mode')

export function useReadingMode(): ReadingMode_Module {
  const readingMode = inject(readingModeInjectionKey)

  if (!readingMode) {
    throw new Error('ReadingMode_Module is not provided')
  }

  return readingMode
}

export { ReadingMode_Module }
