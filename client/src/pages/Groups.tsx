import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuthStore } from '../store/auth'
import './Groups.css'

interface Group {
  id: string
  name: string
  description?: string
  avatar?: string
  members: any[]
}

export default function Groups() {
  const [showCreate, setShowCreate] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberIds: [] as string[]
  })
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/groups', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.data
    }
  })

  const createGroup = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await axios.post('http://localhost:3000/api/groups', data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      setShowCreate(false)
      setFormData({ name: '', description: '', memberIds: [] })
    }
  })

  return (
    <div className="groups-page">
      <div className="page-header">
        <h1>Группы</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          Создать группу
        </button>
      </div>

      <div className="groups-grid">
        {groups.map(group => (
          <motion.div
            key={group.id}
            className="group-card card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="group-header">
              <div className="avatar large">{group.name[0]}</div>
              <div className="group-info">
                <h3>{group.name}</h3>
                <p className="member-count">{group.members.length} участников</p>
              </div>
            </div>
            {group.description && (
              <p className="group-description">{group.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
