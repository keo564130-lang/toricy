# 🚀 Деплой Toricy на Netlify

## 📦 Что выкладывать на Netlify

На Netlify выкладывается только **FRONTEND** (папка `client/`).

Backend нужно выложить отдельно на другой хостинг (Railway, Render, Heroku).

## 🎯 Пошаговая инструкция

### Шаг 1: Подготовка Frontend

#### 1.1 Обновите API URL в коде

Откройте файлы где используется `http://localhost:3000` и замените на URL вашего backend:

**Файлы для изменения:**
- `client/src/pages/Auth.tsx`
- `client/src/pages/Feed.tsx`
- `client/src/pages/Chats.tsx`
- `client/src/pages/Groups.tsx`
- `client/src/pages/Bots.tsx`
- `client/src/pages/Profile.tsx`
- `client/src/pages/Settings.tsx`

Создайте файл `client/.env`:
```env
VITE_API_URL=https://your-backend.railway.app
VITE_WS_URL=wss://your-backend.railway.app
```

И используйте в коде:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

#### 1.2 Соберите production build

```bash
cd client
npm run build
```

Это создаст папку `client/dist/` с готовым приложением.

### Шаг 2: Деплой на Netlify

#### Вариант А: Через веб-интерфейс (проще)

1. **Зарегистрируйтесь на Netlify**
   - Перейдите на https://netlify.com
   - Войдите через GitHub/Google

2. **Загрузите папку dist**
   - Нажмите "Add new site" → "Deploy manually"
   - Перетащите папку `client/dist/` в окно браузера
   - Готово! Сайт будет доступен через несколько секунд

3. **Настройте домен (опционально)**
   - Site settings → Domain management
   - Можете использовать бесплатный поддомен `your-app.netlify.app`
   - Или подключить свой домен

#### Вариант Б: Через Netlify CLI

```bash
# Установите Netlify CLI
npm install -g netlify-cli

# Войдите в аккаунт
netlify login

# Деплой из папки client
cd client
netlify deploy --prod --dir=dist
```

#### Вариант В: Через Git (автоматический деплой)

1. **Создайте репозиторий на GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/toricy.git
   git push -u origin main
   ```

2. **Подключите к Netlify**
   - На Netlify: "Add new site" → "Import from Git"
   - Выберите ваш репозиторий
   - Настройки сборки:
     ```
     Base directory: client
     Build command: npm run build
     Publish directory: client/dist
     ```

3. **Настройте переменные окружения**
   - Site settings → Environment variables
   - Добавьте:
     ```
     VITE_API_URL=https://your-backend.railway.app
     VITE_WS_URL=wss://your-backend.railway.app
     ```

### Шаг 3: Настройка redirects для SPA

Создайте файл `client/public/_redirects`:
```
/*    /index.html   200
```

Это нужно для корректной работы React Router.

### Шаг 4: Деплой Backend

Backend нужно выложить отдельно. Рекомендуемые варианты:

#### Railway (рекомендуется)

1. Зарегистрируйтесь на https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Выберите папку `server/`
4. Railway автоматически определит Node.js
5. Добавьте переменные окружения:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   EMAIL_USER=...
   EMAIL_PASSWORD=...
   ```
6. Обновите `GOOGLE_CALLBACK_URL` на новый URL

#### Render

1. Зарегистрируйтесь на https://render.com
2. "New" → "Web Service"
3. Подключите GitHub репозиторий
4. Настройки:
   ```
   Root Directory: server
   Build Command: npm install && npx prisma generate
   Start Command: npm start
   ```
5. Добавьте переменные окружения

#### Heroku

```bash
# Установите Heroku CLI
heroku login

# Создайте приложение
heroku create toricy-backend

# Добавьте PostgreSQL
heroku addons:create heroku-postgresql:mini

# Деплой
git subtree push --prefix server heroku main

# Настройте переменные
heroku config:set JWT_SECRET=your-secret
heroku config:set GOOGLE_CLIENT_ID=...
```

### Шаг 5: База данных

Для production используйте облачную БД:

#### Neon (рекомендуется, бесплатно)

1. Зарегистрируйтесь на https://neon.tech
2. Создайте проект
3. Скопируйте connection string
4. Добавьте в переменные окружения backend:
   ```
   DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
   ```

#### Supabase (альтернатива)

1. Зарегистрируйтесь на https://supabase.com
2. Создайте проект
3. Database → Connection string → URI
4. Используйте в `DATABASE_URL`

### Шаг 6: Обновите CORS

В `server/src/index.ts` обновите CORS:

```typescript
app.use(cors({ 
  origin: [
    'http://localhost:5173',
    'https://your-app.netlify.app'
  ], 
  credentials: true 
}));

const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://your-app.netlify.app'
    ],
    credentials: true
  }
});
```

### Шаг 7: Обновите Google OAuth

В Google Console обновите Authorized redirect URIs:
```
https://your-backend.railway.app/api/auth/google/callback
```

## 📋 Чеклист деплоя

- [ ] Frontend собран (`npm run build` в папке `client/`)
- [ ] Папка `client/dist/` загружена на Netlify
- [ ] Файл `_redirects` создан в `client/public/`
- [ ] Backend задеплоен на Railway/Render/Heroku
- [ ] База данных создана на Neon/Supabase
- [ ] Переменные окружения настроены на backend
- [ ] CORS обновлен с новым frontend URL
- [ ] Google OAuth redirect URI обновлен
- [ ] API_URL в frontend указывает на backend
- [ ] Всё работает! 🎉

## 💰 Стоимость

- **Netlify:** Бесплатно (100GB bandwidth/месяц)
- **Railway:** ~$5/месяц (500 часов)
- **Neon:** Бесплатно (0.5GB storage)
- **Итого:** ~$5/месяц или бесплатно

## 🐛 Возможные проблемы

### 404 при переходе по ссылкам
- Убедитесь, что файл `_redirects` создан

### CORS ошибки
- Проверьте, что frontend URL добавлен в CORS на backend

### Google OAuth не работает
- Обновите redirect URI в Google Console

### Email не отправляются
- Проверьте переменные `EMAIL_USER` и `EMAIL_PASSWORD` на backend

## 📚 Полезные ссылки

- Netlify Docs: https://docs.netlify.com
- Railway Docs: https://docs.railway.app
- Neon Docs: https://neon.tech/docs

## ✅ Готово!

После деплоя ваше приложение будет доступно по адресу:
```
https://your-app.netlify.app
```

Поделитесь ссылкой с семьей и начните пользоваться! 🚀
