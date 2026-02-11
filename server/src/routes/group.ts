import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Получить группы пользователя
router.get('/', authMiddleware, async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: { userId: req.userId }
        }
      },
      include: {
        members: { include: { user: true } }
      }
    });
    res.json(groups);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch groups' });
  }
});

// Создать группу
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, avatar, memberIds } = req.body;
    const group = await prisma.group.create({
      data: {
        name,
        description,
        avatar,
        members: {
          create: [
            { userId: req.userId, role: 'admin' },
            ...memberIds.map((id: string) => ({ userId: id }))
          ]
        }
      },
      include: { members: { include: { user: true } } }
    });
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create group' });
  }
});

// Добавить участника
router.post('/:id/members', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const member = await prisma.groupMember.create({
      data: {
        groupId: req.params.id,
        userId
      },
      include: { user: true }
    });
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add member' });
  }
});

export default router;
