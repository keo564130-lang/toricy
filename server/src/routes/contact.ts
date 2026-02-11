import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Получить контакты
router.get('/', authMiddleware, async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { userId: req.userId },
      include: { contact: true }
    });
    res.json(contacts);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch contacts' });
  }
});

// Добавить контакт
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { contactId } = req.body;
    const contact = await prisma.contact.create({
      data: {
        userId: req.userId,
        contactId
      },
      include: { contact: true }
    });
    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add contact' });
  }
});

// Удалить контакт
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.contact.delete({
      where: { id: req.params.id, userId: req.userId }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete contact' });
  }
});

// Синхронизация контактов из телефона
router.post('/sync', authMiddleware, async (req, res) => {
  try {
    const { phoneNumbers } = req.body;
    
    // Найти пользователей по номерам телефонов
    const users = await prisma.user.findMany({
      where: {
        phone: { in: phoneNumbers }
      }
    });
    
    // Создать контакты для найденных пользователей
    const contacts = await Promise.all(
      users.map(user => 
        prisma.contact.upsert({
          where: {
            userId_contactId: {
              userId: req.userId,
              contactId: user.id
            }
          },
          create: {
            userId: req.userId,
            contactId: user.id
          },
          update: {},
          include: { contact: true }
        })
      )
    );
    
    res.json(contacts);
  } catch (error) {
    res.status(400).json({ error: 'Failed to sync contacts' });
  }
});

export default router;
