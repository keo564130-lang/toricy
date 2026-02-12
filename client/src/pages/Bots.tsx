import { API_URL, WS_URL } from '../config'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuthStore } from '../store/auth'
import './Bots.css'

interface Bot {
  id: string
  name: string
  username: string
  description?: string
  avatar?: string
  pythonCode?: string
  active: boolean
  token: string
}

export default function Bots() {
  const [showCreate, setShowCreate] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    description: '',
    pythonCode: ''
  })
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: bots = [] } = useQuery<Bot[]>({
    queryKey: ['bots'],
    queryFn: async () => {
      const res = await axios.get('${API_URL}/api/bots', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.data
    }
  })

  const createBot = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await axios.post('${API_URL}/api/bots', data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] })
      setShowCreate(false)
      setFormData({ name: '', username: '', description: '', pythonCode: '' })
    }
  })

  const toggleBot = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const endpoint = active ? 'stop' : 'start'
      await axios.post(`${API_URL}/api/bots/${id}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] })
    }
  })

  const deleteBot = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/api/bots/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] })
    }
  })

  return (
    <div className="bots-page">
      <div className="page-header">
        <h1>Мои боты</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          Создать бота
        </button>
      </div>

      <div className="bots-grid">
        {bots.map(bot => (
          <motion.div
            key={bot.id}
            className="bot-card card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bot-header">
              <div className="avatar">{bot.name[0]}</div>
              <div className="bot-info">
                <h3>{bot.name}</h3>
                <p className="bot-username">@{bot.username}</p>
              </div>
              <div className={`bot-status ${bot.active ? 'active' : ''}`}>
                {bot.active ? '🟢' : '⚫'}
              </div>
            </div>
            
            {bot.description && (
              <p className="bot-description">{bot.description}</p>
            )}
            
            <div className="bot-token">
              <span className="token-label">Token:</span>
              <code className="token-value">{bot.token.slice(0, 20)}...</code>
            </div>
            
            <div className="bot-actions">
              <button
                className={`btn ${bot.active ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => toggleBot.mutate({ id: bot.id, active: bot.active })}
              >
                {bot.active ? 'Остановить' : 'Запустить'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => deleteBot.mutate(bot.id)}
              >
                Удалить
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              className="modal card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Создать бота</h2>
              <form onSubmit={(e) => {
                e.preventDefault()
                createBot.mutate(formData)
              }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Имя бота"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Username (без @)"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <textarea
                  className="input"
                  placeholder="Описание"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
                <textarea
                  className="input code-input"
                  placeholder="Python код бота"
                  value={formData.pythonCode}
                  onChange={(e) => setFormData({ ...formData, pythonCode: e.target.value })}
                  rows={10}
                />
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Создать
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
