import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { settings: true }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch user' });
  }
});

router.patch('/settings', authMiddleware, async (req, res) => {
  try {
    const settings = await prisma.userSettings.update({
      where: { userId: req.userId },
      data: req.body
    });
    res.json(settings);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update settings' });
  }
});

export default router;
