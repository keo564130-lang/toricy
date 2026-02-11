import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: { userId: req.userId }
        }
      },
      include: {
        members: { include: { user: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });
    res.json(chats);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch chats' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { memberIds, name, isGroup } = req.body;
    const chat = await prisma.chat.create({
      data: {
        name,
        isGroup,
        members: {
          create: [
            { userId: req.userId, role: 'admin' },
            ...memberIds.map((id: string) => ({ userId: id }))
          ]
        }
      },
      include: { members: { include: { user: true } } }
    });
    res.json(chat);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create chat' });
  }
});

export default router;
