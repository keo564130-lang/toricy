import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import authRoutes from '../src/routes/auth.js';
import userRoutes from '../src/routes/user.js';
import postRoutes from '../src/routes/post.js';
import chatRoutes from '../src/routes/chat.js';
import folderRoutes from '../src/routes/folder.js';
import botRoutes from '../src/routes/bot.js';
import contactRoutes from '../src/routes/contact.js';
import serviceRoutes from '../src/routes/service.js';
import groupRoutes from '../src/routes/group.js';
import channelRoutes from '../src/routes/channel.js';

dotenv.config();

const app = express();

app.use(cors({ 
  origin: [
    'http://localhost:5173',
    'https://toricy.netlify.app',
    'https://*.netlify.app'
  ], 
  credentials: true 
}));

app.use(express.json());
app.use(passport.initialize());

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

export default app;
