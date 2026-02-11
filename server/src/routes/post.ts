import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/feed', authMiddleware, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, username: true, displayName: true, avatar: true } },
        comments: { include: { author: true } },
        likes: true,
        favorites: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch feed' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const post = await prisma.post.create({
      data: {
        content: req.body.content,
        media: req.body.media,
        authorId: req.userId
      },
      include: { author: true }
    });
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create post' });
  }
});

router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const like = await prisma.like.create({
      data: {
        postId: req.params.id,
        userId: req.userId
      }
    });
    res.json(like);
  } catch (error) {
    res.status(400).json({ error: 'Failed to like post' });
  }
});

router.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        postId: req.params.id,
        authorId: req.userId
      },
      include: { author: true }
    });
    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to comment' });
  }
});

export default router;
