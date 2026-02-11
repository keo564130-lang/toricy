# 🎯 БЕЗ PostgreSQL - Используем SQLite!

## ✅ SQLite - файловая база данных

Не нужно устанавливать PostgreSQL, Neon, Vercel Postgres и прочее!
SQLite работает из коробки - это просто файл!

---

## 🚀 Что изменилось

### 1. База данных теперь SQLite

В `server/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### 2. Файл базы данных

База данных - это просто файл `server/dev.db`
Создается автоматически при первом запуске!

---

## 📦 Деплой БЕЗ базы данных

### Netlify (Frontend)
1. https://netlify.com
2. Deploy manually
3. Перетащите `client/dist/`
4. Готово!

### Vercel (Backend)
1. https://vercel.com
2. New Project → выбрать `toricy`
3. Root: `server`
4. Environment Variables (БЕЗ DATABASE_URL!):
   ```
   JWT_SECRET=toricy-super-secret-key-2024
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=https://ваш-backend.vercel.app/api/auth/google/callback
   ```
5. Deploy!

**Всё! Никаких баз данных!** ✅

---

## ⚠️ Важно для production

SQLite отлично работает для:
- ✅ Разработки
- ✅ Тестирования
- ✅ Небольших проектов
- ✅ Личного использования

Но для production с большой нагрузкой лучше PostgreSQL.

---

## 🔄 Если понадобится PostgreSQL позже

Просто измените в `server/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

И добавьте `DATABASE_URL` в переменные окружения.

---

## 🎉 Преимущества SQLite

1. ✅ Не нужно устанавливать
2. ✅ Не нужно настраивать
3. ✅ Работает из коробки
4. ✅ Просто файл
5. ✅ Быстрый
6. ✅ Бесплатный

---

## 📝 Локальный запуск

```bash
cd server
npx prisma migrate dev
npm run dev
```

База создастся автоматически в `server/dev.db`!

---

## 🚀 Готово!

Теперь деплой еще проще:
- Frontend → Netlify
- Backend → Vercel
- База → SQLite (автоматически)

**Никаких внешних сервисов!** 🎉
