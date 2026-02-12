import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import chatRoutes from './routes/chat.js';
import folderRoutes from './routes/folder.js';
import botRoutes from './routes/bot.js';
import contactRoutes from './routes/contact.js';
import serviceRoutes from './routes/service.js';
import groupRoutes from './routes/group.js';
import channelRoutes from './routes/channel.js';
import { setupSocketHandlers } from './socket/index.js';

import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const prisma = new PrismaClient();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true
  }
});

app.use(cors({ 
  origin: true,
  credentials: true 
}));
app.use(express.json());
app.use(passport.initialize());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Toricy API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/channels', channelRoutes);

setupSocketHandlers(io);

const PORT = process.env.PORT || 3000;

// Initialize database
async function initDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

initDatabase();

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
