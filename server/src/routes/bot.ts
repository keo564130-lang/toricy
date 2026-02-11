import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { spawn } from 'child_process';
import crypto from 'crypto';

const router = Router();
const prisma = new PrismaClient();

// Получить ботов пользователя
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bots = await prisma.bot.findMany({
      where: { ownerId: req.userId }
    });
    res.json(bots);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch bots' });
  }
});

// Создать бота
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, username, description, avatar, pythonCode } = req.body;
    const token = crypto.randomBytes(32).toString('hex');
    
    const bot = await prisma.bot.create({
      data: {
        name,
        username,
        description,
        avatar,
        pythonCode,
        token,
        ownerId: req.userId
      }
    });
    
    res.json(bot);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create bot' });
  }
});

// Обновить бота
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const bot = await prisma.bot.update({
      where: { id: req.params.id, ownerId: req.userId },
      data: req.body
    });
    res.json(bot);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update bot' });
  }
});

// Запустить бота
router.post('/:id/start', authMiddleware, async (req, res) => {
  try {
    const bot = await prisma.bot.findUnique({
      where: { id: req.params.id, ownerId: req.userId }
    });
    
    if (!bot || !bot.pythonCode) {
      return res.status(400).json({ error: 'Bot not found or no code' });
    }
    
    // Запуск Python кода бота
    const pythonProcess = spawn('python3', ['-c', bot.pythonCode]);
    
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Bot ${bot.username}: ${data}`);
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Bot ${bot.username} error: ${data}`);
    });
    
    await prisma.bot.update({
      where: { id: bot.id },
      data: { active: true }
    });
    
    res.json({ success: true, message: 'Bot started' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to start bot' });
  }
});

// Остановить бота
router.post('/:id/stop', authMiddleware, async (req, res) => {
  try {
    await prisma.bot.update({
      where: { id: req.params.id, ownerId: req.userId },
      data: { active: false }
    });
    res.json({ success: true, message: 'Bot stopped' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to stop bot' });
  }
});

// Удалить бота
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.bot.delete({
      where: { id: req.params.id, ownerId: req.userId }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete bot' });
  }
});

export default router;
