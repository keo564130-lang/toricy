import { API_URL, WS_URL } from '../config'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '../store/auth'
import VideoCall from '../components/VideoCall'
import StickerPicker from '../components/StickerPicker'
import VoiceRecorder from '../components/VoiceRecorder'
import './Chats.css'

interface Chat {
  id: string
  name?: string
  isGroup: boolean
  members: any[]
  messages: any[]
}

interface Message {
  id: string
  content: string
  type: string
  sender: { id: string; displayName: string }
  createdAt: string
}

export default function Chats() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const [showCall, setShowCall] = useState(false)
  const [callType, setCallType] = useState<'video' | 'audio'>('video')
  const [showStickers, setShowStickers] = useState(false)
  const [isRecordingVoice, setIsRecordingVoice] = useState(false)
  const { token, user } = useAuthStore()

  const { data: chats = [] } = useQuery<Chat[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      const res = await axios.get('${API_URL}/api/chats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.data
    }
  })

  useEffect(() => {
    const newSocket = io('${API_URL}', {
      auth: { token }
    })
    
    newSocket.on('new-message', (msg: Message) => {
      setMessages(prev => [...prev, msg])
    })
    
    setSocket(newSocket)
    return () => { newSocket.close() }
  }, [token])

  useEffect(() => {
    if (selectedChat && socket) {
      socket.emit('join-chat', selectedChat)
    }
  }, [selectedChat, socket])

  const sendMessage = () => {
    if (!message.trim() || !socket || !selectedChat) return
    
    socket.emit('send-message', {
      chatId: selectedChat,
      content: message,
      type: 'text'
    })
    setMessage('')
  }

  const startCall = (type: 'video' | 'audio') => {
    setCallType(type)
    setShowCall(true)
  }

  const sendSticker = (stickerId: string, stickerUrl: string) => {
    if (!socket || !selectedChat) return
    
    socket.emit('send-sticker', {
      chatId: selectedChat,
      stickerId,
      stickerUrl
    })
  }

  const sendVoiceMessage = async (audioBlob: Blob, duration: number) => {
    if (!socket || !selectedChat) return
    
    // В реальном приложении загрузить на сервер и получить URL
    const audioUrl = URL.createObjectURL(audioBlob)
    
    socket.emit('voice-message', {
      chatId: selectedChat,
      audioUrl,
      duration
    })
    
    setIsRecordingVoice(false)
  }

  return (
    <div className="chats-page">
      <div className="chats-sidebar card">
        <h2>Чаты</h2>
        <div className="chats-list">
          {chats.map(chat => (
            <motion.div
              key={chat.id}
              className={`chat-item ${selectedChat === chat.id ? 'active' : ''}`}
              onClick={() => setSelectedChat(chat.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="avatar">
                {chat.name?.[0] || chat.members[0]?.user.displayName[0]}
              </div>
              <div className="chat-info">
                <div className="chat-name">
                  {chat.name || chat.members.find(m => m.userId !== user?.id)?.user.displayName}
                </div>
                <div className="chat-preview">
                  {chat.messages[0]?.content || 'Нет сообщений'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="chat-window card">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <h3>Чат</h3>
              <div className="chat-actions">
                <button className="icon-btn" onClick={() => startCall('audio')}>
                  📞
                </button>
                <button className="icon-btn" onClick={() => startCall('video')}>
                  📹
                </button>
              </div>
            </div>

            <div className="messages">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  className={`message ${msg.sender.id === user?.id ? 'own' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {msg.type === 'text' && (
                    <div className="message-content">{msg.content}</div>
                  )}
                  {msg.type === 'sticker' && (
                    <div className="message-sticker">🎭</div>
                  )}
                  {msg.type === 'voice' && (
                    <div className="message-voice">
                      🎤 Голосовое сообщение
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {isRecordingVoice ? (
              <VoiceRecorder
                onSend={sendVoiceMessage}
                onCancel={() => setIsRecordingVoice(false)}
              />
            ) : (
              <div className="message-input">
                <button 
                  className="icon-btn"
                  onClick={() => setShowStickers(true)}
                >
                  😊
                </button>
                <input
                  type="text"
                  className="input"
                  placeholder="Написать сообщение..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button 
                  className="icon-btn"
                  onClick={() => setIsRecordingVoice(true)}
                >
                  🎤
                </button>
                <button className="btn btn-primary" onClick={sendMessage}>
                  Отправить
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-chat">Выберите чат</div>
        )}
      </div>

      <AnimatePresence>
        {showCall && selectedChat && (
          <VideoCall
            socket={socket}
            chatId={selectedChat}
            isIncoming={false}
            callType={callType}
            onEnd={() => setShowCall(false)}
          />
        )}
        
        {showStickers && (
          <StickerPicker
            onSelect={sendSticker}
            onClose={() => setShowStickers(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
