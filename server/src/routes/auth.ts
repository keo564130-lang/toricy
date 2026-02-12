import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { sendVerificationEmail, generateVerificationCode } from '../utils/email.js';

const router = Router();
const prisma = new PrismaClient();

// Google OAuth Strategy (опционально)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      let user = await prisma.user.findUnique({
        where: { googleId: profile.id }
      });

      if (!user) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.emails?.[0].value }
        });

        if (existingUser) {
          user = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              googleId: profile.id,
              avatar: profile.photos?.[0].value,
              verified: true
            }
          });
        } else {
          const baseUsername = profile.emails?.[0].value.split('@')[0] || 'user';
          let username = baseUsername;
          let counter = 1;
          
          while (await prisma.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${counter}`;
            counter++;
          }

          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails?.[0].value,
              username,
              displayName: profile.displayName,
              avatar: profile.photos?.[0].value,
              verified: true,
              settings: { create: {} }
            }
          });
        }
      }

      done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      done(error as Error, undefined);
    }
  }));
}

// Шаг 1: Отправка кода на email
router.post('/send-code', async (req, res) => {
  try {
    const { email } = req.body;
    
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email уже используется' });
    }
    
    const code = generateVerificationCode();
    
    await prisma.verificationCode.create({
      data: {
        code,
        email,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      }
    });
    
    const sent = await sendVerificationEmail(email, code);
    
    if (!sent) {
      return res.status(500).json({ error: 'Не удалось отправить email' });
    }
    
    res.json({ success: true, message: 'Код отправлен на email' });
  } catch (error) {
    console.error('Send code error:', error);
    res.status(400).json({ error: 'Ошибка отправки кода' });
  }
});

// Шаг 2: Регистрация с проверкой кода
router.post('/register/email', async (req, res) => {
  try {
    const { email, code, password, username, displayName } = req.body;
    
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });
    
    if (!verificationCode) {
      return res.status(400).json({ error: 'Неверный или истекший код' });
    }
    
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { used: true }
    });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        displayName,
        verified: true,
        settings: { create: {} }
      }
    });
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.json({ token, user: { id: user.id, username: user.username, displayName: user.displayName } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Ошибка регистрации' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
          { username: identifier }
        ]
      }
    });
    
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.json({ token, user: { id: user.id, username: user.username, displayName: user.displayName } });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user as any;
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

export default router;
