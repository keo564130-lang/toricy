# 🚀 Деплой на Vercel (БЕСПЛАТНО!)

## ✅ Готово к деплою!

Frontend собран в папке `client/dist/`

## 📦 Шаг 1: Загрузите код на GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ваш-username/toricy.git
git push -u origin main
```

Если у вас еще нет репозитория:
1. Зайдите на https://github.com
2. Нажмите "New repository"
3. Назовите "toricy"
4. Создайте
5. Скопируйте команды и выполните

## 🎯 Шаг 2: Деплой Frontend на Vercel

### 1. Зайдите на Vercel
- https://vercel.com
- Войдите через GitHub

### 2. Импортируйте проект
- Нажмите "Add New" → "Project"
- Выберите репозиторий "toricy"
- Нажмите "Import"

### 3. Настройте Frontend
- **Project Name:** toricy-frontend
- **Framework Preset:** Vite
- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- Нажмите "Deploy"

### 4. Подождите
- Деплой займет 1-2 минуты
- Скопируйте URL (например: `https://toricy-frontend.vercel.app`)

## 🔧 Шаг 3: Создайте базу данных на Neon

### 1. Зайдите на Neon
- https://neon.tech
- Войдите через GitHub/Google

### 2. Создайте проект
- Нажмите "Create Project"
- Название: toricy
- Region: выберите ближайший
- Нажмите "Create"

### 3. Скопируйте connection string
- На странице проекта найдите "Connection string"
- Скопируйте (начинается с `postgresql://`)

## 🚀 Шаг 4: Деплой Backend на Vercel

### 1. Добавьте еще один проект
- На Vercel нажмите "Add New" → "Project"
- Выберите тот же репозиторий "toricy"
- Нажмите "Import"

### 2. Настройте Backend
- **Project Name:** toricy-backend
- **Framework Preset:** Other
- **Root Directory:** `server`
- **Build Command:** `npm install && npx prisma generate`
- **Output Directory:** оставьте пустым
- **Install Command:** `npm install`

### 3. Добавьте Environment Variables
Нажмите "Environment Variables" и добавьте:

```
DATABASE_URL=postgresql://... (из Neon)
JWT_SECRET=toricy-super-secret-key-2024
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://toricy-backend.vercel.app/api/auth/google/callback
```

⚠️ **Важно:** Замените `toricy-backend` на ваш реальный URL после деплоя!

### 4. Деплой
- Нажмите "Deploy"
- Подождите 2-3 минуты
- Скопируйте URL (например: `https://toricy-backend.vercel.app`)

### 5. Обновите GOOGLE_CALLBACK_URL
- Вернитесь в Environment Variables
- Обновите `GOOGLE_CALLBACK_URL` на реальный URL
- Redeploy проект

## 🔄 Шаг 5: Обновите Frontend

### 1. Создайте файл переменных окружения
Создайте `client/.env.production`:
```env
VITE_API_URL=https://toricy-backend.vercel.app
VITE_WS_URL=wss://toricy-backend.vercel.app
```

### 2. Обновите код
Добавьте в начало файлов где используется API:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

Замените все `http://localhost:3000` на `API_URL`

### 3. Закоммитьте и запушьте
```bash
git add .
git commit -m "Add production env"
git push
```

Vercel автоматически передеплоит!

## 🔐 Шаг 6: Обновите Google OAuth

### 1. Зайдите в Google Console
- https://console.cloud.google.com
- Выберите ваш проект

### 2. Обновите Authorized redirect URIs
- APIs & Services → Credentials
- Нажмите на ваш OAuth Client ID
- В "Authorized redirect URIs" добавьте:
  ```
  https://toricy-backend.vercel.app/api/auth/google/callback
  ```
- Сохраните

## 🎉 Готово!

Ваше приложение работает:
- **Frontend:** https://toricy-frontend.vercel.app
- **Backend:** https://toricy-backend.vercel.app
- **Database:** Neon

**Стоимость: 0₽ навсегда!** ✅

## 📝 Автоматические деплои

Теперь при каждом `git push`:
- Frontend автоматически деплоится
- Backend автоматически деплоится

## ⚠️ Важные моменты

### Vercel Serverless Functions
Backend на Vercel работает как serverless functions:
- Холодный старт ~1-2 секунды
- Лимит выполнения: 10 секунд (бесплатный план)
- Подходит для API, но не для WebSocket

### WebSocket на Vercel
⚠️ Vercel не поддерживает WebSocket в бесплатном плане!

Для WebSocket (чаты, звонки) используйте:
- **Render** (бесплатно, но засыпает)
- **Railway** ($5 кредитов)
- **Fly.io** (бесплатно)

## 🔄 Альтернатива: Vercel + Render

**Лучшая связка:**
- Frontend → Vercel (быстро, бесплатно)
- Backend → Render FREE (WebSocket работает)
- Database → Neon (бесплатно)

См. [ДЕПЛОЙ_ЗА_5_МИНУТ.md](./ДЕПЛОЙ_ЗА_5_МИНУТ.md)

## 💡 Совет

Если нужны чаты и звонки (WebSocket), используйте Render для backend вместо Vercel!

Vercel отлично подходит для:
- Frontend (статика)
- API без WebSocket
- Serverless functions

Но для real-time функций лучше Render или Railway.
