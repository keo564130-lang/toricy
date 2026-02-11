import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useThemeStore } from '../store/theme'
import './Layout.css'

export default function Layout() {
  const location = useLocation()
  const { theme, toggleTheme } = useThemeStore()

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="logo">Toricy</h1>
          <div className="nav-links">
            <NavLink to="/" active={location.pathname === '/'}>Лента</NavLink>
            <NavLink to="/chats" active={location.pathname === '/chats'}>Чаты</NavLink>
            <NavLink to="/groups" active={location.pathname === '/groups'}>Группы</NavLink>
            <NavLink to="/bots" active={location.pathname === '/bots'}>Боты</NavLink>
          </div>
          <div className="nav-actions">
            <button onClick={toggleTheme} className="icon-btn">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link to="/settings" className="icon-btn">
              ⚙️
            </Link>
            <Link to="/profile" className="icon-btn">
              👤
            </Link>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link to={to} className={`nav-link ${active ? 'active' : ''}`}>
      {children}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="active-indicator"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  )
}
