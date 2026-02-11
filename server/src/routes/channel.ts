import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Получить все каналы пользователя
router.get('/', authMiddleware, async (req, res) => {
  try {
    const channels = await prisma.channel.findMany({
      where: { ownerId: req.userId },
      include: { owner: true }
    });
    res.json(channels);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch channels' });
  }
});

// Создать канал
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, avatar } = req.body;
    const channel = await prisma.channel.create({
      data: {
        name,
        description,
        avatar,
        ownerId: req.userId
      },
      include: { owner: true }
    });
    res.json(channel);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create channel' });
  }
});

// Обновить канал
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const channel = await prisma.channel.update({
      where: { id: req.params.id, ownerId: req.userId },
      data: req.body
    });
    res.json(channel);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update channel' });
  }
});

// Удалить канал
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.channel.delete({
      where: { id: req.params.id, ownerId: req.userId }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete channel' });
  }
});

export default router;
