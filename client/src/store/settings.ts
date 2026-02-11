import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  language: string
  notifications: boolean
  sounds: boolean
  autoplay: boolean
  accentColor: string
  fontSize: 'small' | 'medium' | 'large'
  compactMode: boolean
  animations: boolean
  updateSettings: (settings: Partial<Omit<SettingsState, 'updateSettings'>>) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'ru',
      notifications: true,
      sounds: true,
      autoplay: true,
      accentColor: '#0066ff',
      fontSize: 'medium',
      compactMode: false,
      animations: true,
      updateSettings: (newSettings) => {
        set((state) => {
          const updated = { ...state, ...newSettings }
          
          // Применяем настройки к DOM
          if (newSettings.accentColor) {
            document.documentElement.style.setProperty('--accent', newSettings.accentColor)
          }
          
          if (newSettings.fontSize) {
            const sizes = { small: '14px', medium: '15px', large: '16px' }
            document.documentElement.style.setProperty('--font-size-base', sizes[newSettings.fontSize])
          }
          
          if (newSettings.compactMode !== undefined) {
            document.documentElement.classList.toggle('compact-mode', newSettings.compactMode)
          }
          
          if (newSettings.animations !== undefined) {
            document.documentElement.classList.toggle('no-animations', !newSettings.animations)
          }
          
          return updated
        })
      }
    }),
    { name: 'toricy-settings' }
  )
)
