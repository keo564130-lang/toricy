import { API_URL, WS_URL } from '../config'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/auth'
import axios from 'axios'
import './Auth.css'

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    password: '',
    username: '',
    displayName: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const codeInputRef = useRef<HTMLInputElement>(null)

  // Автоматическая вставка кода из буфера обмена
  useEffect(() => {
    if (step === 'code' && codeInputRef.current) {
      codeInputRef.current.focus()
      
      // Попытка автоматически вставить код из буфера
      const handlePaste = async () => {
        try {
          const text = await navigator.clipboard.readText()
          const code = text.replace(/\D/g, '').slice(0, 6)
          if (code.length === 6) {
            setFormData(prev => ({ ...prev, code }))
          }
        } catch (err) {
          // Буфер обмена недоступен или пользователь не дал разрешение
        }
      }
      
      handlePaste()
    }
  }, [step])

  // Обработка вставки кода
  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const code = pastedText.replace(/\D/g, '').slice(0, 6)
    setFormData({ ...formData, code })
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await axios.post('${API_URL}/api/auth/send-code', {
        email: formData.email
      })
      setStep('code')
      alert('Код отправлен на ваш email!')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка отправки кода')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await axios.post('${API_URL}/api/auth/register/email', {
        email: formData.email,
        code: formData.code,
        password: formData.password,
        username: formData.username,
        displayName: formData.displayName
      })
      setAuth(res.data.token, res.data.user)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await axios.post('${API_URL}/api/auth/login', {
        identifier: formData.email,
        password: formData.password
      })
      setAuth(res.data.token, res.data.user)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="auth-title">Toricy</h1>
        <p className="auth-subtitle">Семейная соцсеть</p>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login')
              setStep('email')
              setError('')
            }}
          >
            Вход
          </button>
          <button 
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register')
              setStep('email')
              setError('')
            }}
          >
            Регистрация
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="email"
              placeholder="Email или username"
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            
            <input
              type="password"
              placeholder="Пароль"
              className="input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>

            <button 
              type="button"
              className="btn btn-secondary google-btn"
              onClick={() => window.location.href = '${API_URL}/api/auth/google'}
            >
              🔐 Войти через Google
            </button>
          </form>
        ) : (
          <>
            {step === 'email' ? (
              <form onSubmit={handleSendCode} className="auth-form">
                <input
                  type="email"
                  placeholder="Email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Отправка...' : 'Получить код'}
                </button>

                <button 
                  type="button"
                  className="btn btn-secondary google-btn"
                  onClick={() => window.location.href = '${API_URL}/api/auth/google'}
                >
                  🔐 Войти через Google
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="auth-form">
                <div className="code-info">
                  📧 Код отправлен на <strong>{formData.email}</strong>
                  <button 
                    type="button"
                    className="change-email-btn"
                    onClick={() => setStep('email')}
                  >
                    Изменить
                  </button>
                </div>

                <input
                  ref={codeInputRef}
                  type="text"
                  placeholder="Код из email (6 цифр)"
                  className="input code-input"
                  value={formData.code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setFormData({ ...formData, code: value })
                  }}
                  onPaste={handleCodePaste}
                  maxLength={6}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                />
                
                <input
                  type="text"
                  placeholder="Имя пользователя (username)"
                  className="input"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                
                <input
                  type="text"
                  placeholder="Отображаемое имя"
                  className="input"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  required
                />
                
                <input
                  type="password"
                  placeholder="Пароль"
                  className="input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>

                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSendCode}
                  disabled={loading}
                >
                  Отправить код повторно
                </button>
              </form>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
