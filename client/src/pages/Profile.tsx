import { motion } from 'framer-motion'
import { useAuthStore } from '../store/auth'
import { useThemeStore } from '../store/theme'
import './Profile.css'

export default function Profile() {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  return (
    <div className="profile-page">
      <motion.div 
        className="profile-card card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-header">
          <div className="avatar large">{user?.displayName[0]}</div>
          <div className="profile-info">
            <h2>{user?.displayName}</h2>
            <p className="username">@{user?.username}</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Настройки</h3>
          <div className="settings-list">
            <div className="setting-item">
              <span>Тема</span>
              <button className="btn btn-secondary" onClick={toggleTheme}>
                {theme === 'light' ? 'Светлая' : 'Темная'}
              </button>
            </div>
            <div className="setting-item">
              <span>Язык</span>
              <button className="btn btn-secondary">Русский</button>
            </div>
            <div className="setting-item">
              <span>Уведомления</span>
              <button className="btn btn-secondary">Включены</button>
            </div>
          </div>
        </div>

        <button className="btn btn-primary logout-btn" onClick={logout}>
          Выйти
        </button>
      </motion.div>
    </div>
  )
}
