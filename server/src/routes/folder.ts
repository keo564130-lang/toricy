import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Получить папки
router.get('/', authMiddleware, async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.userId }
    });
    res.json(folders);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch folders' });
  }
});

// Создать папку
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const folder = await prisma.folder.create({
      data: {
        name,
        userId: req.userId
      }
    });
    res.json(folder);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create folder' });
  }
});

// Обновить папку
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const folder = await prisma.folder.update({
      where: { id: req.params.id, userId: req.userId },
      data: req.body
    });
    res.json(folder);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update folder' });
  }
});

// Удалить папку
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.folder.delete({
      where: { id: req.params.id, userId: req.userId }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete folder' });
  }
});

export default router;
