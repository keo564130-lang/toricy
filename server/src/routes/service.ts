import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Отправить сервисное уведомление всем пользователям
router.post('/broadcast', authMiddleware, async (req, res) => {
  try {
    const { content, title } = req.body;
    
    // Проверка прав администратора (можно добавить роль в User модель)
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });
    
    if (!user) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Получить всех пользователей
    const users = await prisma.user.findMany({
      select: { id: true }
    });
    
    // Создать сервисного бота если не существует
    let serviceBot = await prisma.serviceBot.findFirst();
    if (!serviceBot) {
      serviceBot = await prisma.serviceBot.create({
        data: {
          username: 'toricy_service',
          name: 'Toricy Service'
        }
      });
    }
    
    // Отправить уведомление каждому пользователю
    // В реальном приложении это должно быть через очередь сообщений
    const notifications = await Promise.all(
      users.map(async (targetUser) => {
        // Создать или найти чат с сервисным ботом
        let chat = await prisma.chat.findFirst({
          where: {
            isGroup: false,
            members: {
              every: {
                userId: { in: [targetUser.id] }
              }
            }
          }
        });
        
        if (!chat) {
          chat = await prisma.chat.create({
            data: {
              name: 'Toricy Service',
              isGroup: false,
              members: {
                create: [{ userId: targetUser.id }]
              }
            }
          });
        }
        
        // Создать сообщение
        return prisma.message.create({
          data: {
            content: `${title}\n\n${content}`,
            type: 'service',
            chatId: chat.id,
            senderId: req.userId
          }
        });
      })
    );
    
    res.json({ 
      success: true, 
      message: `Broadcast sent to ${users.length} users`,
      count: notifications.length
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    res.status(400).json({ error: 'Failed to send broadcast' });
  }
});

export default router;
