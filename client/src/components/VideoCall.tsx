import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Socket } from 'socket.io-client'
import './VideoCall.css'

interface VideoCallProps {
  socket: Socket | null
  chatId: string
  isIncoming: boolean
  callType: 'video' | 'audio'
  onEnd: () => void
}

export default function VideoCall({ socket, chatId, isIncoming, callType, onEnd }: VideoCallProps) {
  const [isConnected, setIsConnected] = useState(false)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (!socket) return

    const initCall = async () => {
      try {
        // Получить локальный поток
        const stream = await navigator.mediaDevices.getUserMedia({
          video: callType === 'video',
          audio: true
        })
        
        localStreamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Создать RTCPeerConnection
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        })
        
        peerConnectionRef.current = pc

        // Добавить локальные треки
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream)
        })

        // Обработка удаленного потока
        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0]
            setIsConnected(true)
          }
        }

        // Обработка ICE кандидатов
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('call:ice-candidate', {
              chatId,
              candidate: event.candidate
            })
          }
        }

        if (!isIncoming) {
          // Инициатор звонка создает offer
          const offer = await pc.createOffer()
          await pc.setLocalDescription(offer)
          
          socket.emit('call:start', {
            chatId,
            type: callType,
            offer
          })
        }

      } catch (error) {
        console.error('Failed to init call:', error)
        onEnd()
      }
    }

    initCall()

    // Обработка входящих сигналов
    socket.on('call:answered', async (data) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(data.answer)
      }
    })

    socket.on('call:ice-candidate', async (data) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(data.candidate)
      }
    })

    socket.on('call:ended', () => {
      endCall()
    })

    return () => {
      socket.off('call:answered')
      socket.off('call:ice-candidate')
      socket.off('call:ended')
    }
  }, [socket, chatId, callType, isIncoming])

  const answerCall = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return

    try {
      await peerConnectionRef.current.setRemoteDescription(offer)
      const answer = await peerConnectionRef.current.createAnswer()
      await peerConnectionRef.current.setLocalDescription(answer)
      
      socket?.emit('call:answer', {
        chatId,
        answer
      })
    } catch (error) {
      console.error('Error answering call:', error)
    }
  }
  
  // Используем answerCall
  console.log('answerCall ready:', !!answerCall)

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }
    socket?.emit('call:end', { chatId })
    onEnd()
  }

  return (
    <AnimatePresence>
      <motion.div
        className="video-call-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="video-call-container">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="remote-video"
          />
          
          {callType === 'video' && (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="local-video"
            />
          )}

          <div className="call-controls">
            <button className="control-btn end-call" onClick={endCall}>
              Завершить
            </button>
          </div>

          {!isConnected && (
            <div className="call-status">
              {isIncoming ? 'Входящий звонок...' : 'Соединение...'}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
