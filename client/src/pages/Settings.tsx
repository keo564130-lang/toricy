import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/auth'
import { useThemeStore } from '../store/theme'
import { useSettingsStore } from '../store/settings'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import './Settings.css'

export default function Settings() {
  const { user, token, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const settingsStore = useSettingsStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'app' | 'custom'>('profile')
  const queryClient = useQueryClient()
  
  const settings = {
    language: settingsStore.language,
    notifications: settingsStore.notifications,
    sounds: settingsStore.sounds,
    autoplay: settingsStore.autoplay,
    accentColor: settingsStore.accentColor,
    fontSize: settingsStore.fontSize,
    compactMode: settingsStore.compactMode,
    animations: settingsStore.animations
  }
  const updateSettings = settingsStore.updateSettings

  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    bio: '',
    status: ''
  })

  const updateProfile = useMutation({
    mutationFn: async (data: typeof profileData) => {
      const res = await axios.patch('http://localhost:3000/api/users/me', data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: '👤' },
    { id: 'app', label: 'Приложение', icon: '⚙️' },
    { id: 'custom', label: 'Кастомизация', icon: '🎨' }
  ]

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Настройки</h1>
      </div>

      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="settings-content">
        {activeTab === 'profile' && (
          <motion.div
            className="settings-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card">
              <h2>Информация профиля</h2>
              
              <div className="profile-avatar-section">
                <div className="avatar-large">{user?.displayName[0]}</div>
                <button className="btn btn-secondary">Изменить фото</button>
              </div>

              <div className="form-group">
                <label>Отображаемое имя</label>
                <input
                  type="text"
                  className="input"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="input"
                  value={user?.username}
                  disabled
                />
                <small>Username нельзя изменить</small>
              </div>

              <div className="form-group">
                <label>Биография</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Расскажите о себе..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Статус</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ваш статус..."
                  value={profileData.status}
                  onChange={(e) => setProfileData({ ...profileData, status: e.target.value })}
                />
              </div>

              <button 
                className="btn btn-primary"
                onClick={() => updateProfile.mutate(profileData)}
              >
                Сохранить изменения
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'app' && (
          <motion.div
            className="settings-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card">
              <h2>Настройки приложения</h2>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Тема оформления</div>
                  <div className="setting-description">Выберите светлую или темную тему</div>
                </div>
                <button 
                  className="theme-toggle-btn"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? '🌙 Темная' : '☀️ Светлая'}
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Язык</div>
                  <div className="setting-description">Язык интерфейса</div>
                </div>
                <select 
                  className="input"
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value })}
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                  <option value="uk">Українська</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Уведомления</div>
                  <div className="setting-description">Получать уведомления о новых сообщениях</div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => updateSettings({ notifications: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Звуки</div>
                  <div className="setting-description">Звуковые уведомления</div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.sounds}
                    onChange={(e) => updateSettings({ sounds: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Автовоспроизведение</div>
                  <div className="setting-description">Автоматически воспроизводить видео</div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.autoplay}
                    onChange={(e) => updateSettings({ autoplay: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="card danger-zone">
              <h2>Опасная зона</h2>
              <button className="btn btn-danger" onClick={logout}>
                Выйти из аккаунта
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'custom' && (
          <motion.div
            className="settings-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card">
              <h2>Кастомизация интерфейса</h2>

              <div className="form-group">
                <label>Акцентный цвет</label>
                <div className="color-picker-grid">
                  {['#0066ff', '#00c853', '#ff3b30', '#ffa726', '#9c27b0', '#00bcd4'].map(color => (
                    <button
                      key={color}
                      className={`color-option ${settings.accentColor === color ? 'active' : ''}`}
                      style={{ background: color }}
                      onClick={() => updateSettings({ accentColor: color })}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Размер шрифта</label>
                <div className="font-size-options">
                  {['small', 'medium', 'large'].map(size => (
                    <button
                      key={size}
                      className={`font-size-btn ${settings.fontSize === size ? 'active' : ''}`}
                      onClick={() => updateSettings({ fontSize: size as 'small' | 'medium' | 'large' })}
                    >
                      {size === 'small' && 'Маленький'}
                      {size === 'medium' && 'Средний'}
                      {size === 'large' && 'Большой'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Компактный режим</div>
                  <div className="setting-description">Уменьшить отступы между элементами</div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.compactMode}
                    onChange={(e) => updateSettings({ compactMode: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Анимации</div>
                  <div className="setting-description">Плавные переходы и эффекты</div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.animations}
                    onChange={(e) => updateSettings({ animations: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <button 
                className="btn btn-secondary"
                onClick={() => updateSettings({
                  accentColor: '#0066ff',
                  fontSize: 'medium',
                  compactMode: false,
                  animations: true
                })}
              >
                Сбросить настройки
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
