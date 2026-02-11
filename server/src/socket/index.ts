import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const setupSocketHandlers = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.data.userId);
    
    socket.on('join-chat', (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });
    
    socket.on('send-message', async (data) => {
      try {
        const message = await prisma.message.create({
          data: {
            content: data.content,
            type: data.type || 'text',
            media: data.media,
            chatId: data.chatId,
            senderId: socket.data.userId
          },
          include: { sender: true }
        });
        
        io.to(`chat:${data.chatId}`).emit('new-message', message);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    // WebRTC Signaling для видео/аудио звонков
    socket.on('call:start', (data) => {
      socket.to(`chat:${data.chatId}`).emit('call:incoming', {
        callerId: socket.data.userId,
        chatId: data.chatId,
        type: data.type,
        offer: data.offer
      });
    });
    
    socket.on('call:answer', (data) => {
      socket.to(`chat:${data.chatId}`).emit('call:answered', {
        answer: data.answer
      });
    });
    
    socket.on('call:ice-candidate', (data) => {
      socket.to(`chat:${data.chatId}`).emit('call:ice-candidate', {
        candidate: data.candidate
      });
    });
    
    socket.on('call:end', (data) => {
      socket.to(`chat:${data.chatId}`).emit('call:ended');
    });
    
    // Голосовые сообщения
    socket.on('voice-message', async (data) => {
      try {
        const message = await prisma.message.create({
          data: {
            type: 'voice',
            media: { audioUrl: data.audioUrl, duration: data.duration },
            chatId: data.chatId,
            senderId: socket.data.userId
          },
          include: { sender: true }
        });
        
        io.to(`chat:${data.chatId}`).emit('new-message', message);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send voice message' });
      }
    });
    
    // Стикеры
    socket.on('send-sticker', async (data) => {
      try {
        const message = await prisma.message.create({
          data: {
            type: 'sticker',
            media: { stickerId: data.stickerId, stickerUrl: data.stickerUrl },
            chatId: data.chatId,
            senderId: socket.data.userId
          },
          include: { sender: true }
        });
        
        io.to(`chat:${data.chatId}`).emit('new-message', message);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send sticker' });
      }
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.userId);
    });
  });
};
