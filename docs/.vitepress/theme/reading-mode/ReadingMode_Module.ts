import type { Ref } from 'vue'
import { inBrowser } from 'vitepress'
import { readonly, ref } from 'vue'

const STORAGE_KEY = 'endge-docs:reading-mode'

/** Управляет сохранённым режимом чтения документации. */
export class ReadingMode_Module {
  /** Текущее состояние режима и признак завершённой browser-инициализации. */
  private readonly _enabled: Ref<boolean> = ref(false)
  private _isStarted = false

  public readonly enabled = readonly(this._enabled)

  /**
   * ----------------------------------------
   * PUBLIC
   * ----------------------------------------
   */

  /** Восстанавливает пользовательский выбор после client-side mount. */
  public start(): void {
    if (this._isStarted || !inBrowser) {
      return
    }

    this._isStarted = true
    this._enabled.value = this._restore()
  }

  /** Переключает обычную компоновку и режим чтения. */
  public toggle(): void {
    this.setEnabled(!this._enabled.value)
  }

  /** Устанавливает режим и сохраняет его для следующих посещений. */
  public setEnabled(enabled: boolean): void {
    this._enabled.value = enabled
    this._persist(enabled)
  }

  /**
   * ----------------------------------------
   * PRIVATE
   * ----------------------------------------
   */

  /** Безопасно читает сохранённый выбор без влияния на SSR. */
  private _restore(): boolean {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === 'true'
    }
    catch {
      return false
    }
  }

  /** Сохраняет выбор, не блокируя интерфейс при недоступном storage. */
  private _persist(enabled: boolean): void {
    if (!inBrowser || !this._isStarted) {
      return
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, String(enabled))
    }
    catch {
      // Режим чтения продолжает работать в пределах текущей сессии.
    }
  }
}
