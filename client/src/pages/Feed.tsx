import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuthStore } from '../store/auth'
import './Feed.css'

interface Post {
  id: string
  content: string
  author: { id: string; username: string; displayName: string; avatar?: string }
  likes: any[]
  comments: any[]
  favorites: any[]
  createdAt: string
}

export default function Feed() {
  const [newPost, setNewPost] = useState('')
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/posts/feed', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.data
    }
  })

  const createPost = useMutation({
    mutationFn: async (content: string) => {
      const res = await axios.post('http://localhost:3000/api/posts', 
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setNewPost('')
    }
  })

  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      await axios.post(`http://localhost:3000/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })

  return (
    <div className="feed">
      <motion.div 
        className="create-post card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <textarea
          className="input post-input"
          placeholder="Что нового?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          rows={3}
        />
        <button 
          className="btn btn-primary"
          onClick={() => createPost.mutate(newPost)}
          disabled={!newPost.trim()}
        >
          Опубликовать
        </button>
      </motion.div>

      <div className="posts">
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              className="post card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="post-header">
                <div className="post-author">
                  <div className="avatar">{post.author.displayName[0]}</div>
                  <div>
                    <div className="author-name">{post.author.displayName}</div>
                    <div className="post-time">{new Date(post.createdAt).toLocaleDateString('ru')}</div>
                  </div>
                </div>
              </div>
              <p className="post-content">{post.content}</p>
              <div className="post-actions">
                <button 
                  className="action-btn"
                  onClick={() => likePost.mutate(post.id)}
                >
                  ❤️ {post.likes.length}
                </button>
                <button className="action-btn">💬 {post.comments.length}</button>
                <button className="action-btn">⭐ {post.favorites.length}</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
