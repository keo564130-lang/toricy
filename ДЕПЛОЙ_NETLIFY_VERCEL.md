# 🚀 Деплой: Netlify + Vercel (БЕСПЛАТНО!)

## ✅ Frontend собран! Готово к деплою.

Папка `client/dist/` готова.

---

## 📦 Шаг 1: Загрузите код на GitHub (2 минуты)

```bash
git init
git add .
git commit -m "Initial commit"
```

Создайте репозиторий на GitHub:
1. https://github.com → "New repository"
2. Название: `toricy`
3. Создайте
4. Скопируйте команды и выполните:

```bash
git remote add origin https://github.com/ваш-username/toricy.git
git push -u origin main
```

---

## 🎨 Шаг 2: Frontend на Netlify (1 минута)

### Вариант А: Перетащить папку (проще)

1. Откройте https://netlify.com
2. Войдите через GitHub
3. "Add new site" → "Deploy manually"
4. Перетащите папку `client/dist/` в окно
5. Готово! Скопируйте URL: `https://ваш-app.netlify.app`

### Вариант Б: Через GitHub (автодеплой)

1. На Netlify: "Add new site" → "Import from Git"
2. Выберите репозиторий `toricy`
3. Настройки:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`
4. Deploy!

---

## 🗄️ Шаг 3: База данных на Neon (1 минута)

1. https://neon.tech
2. Войдите через GitHub
3. "Create Project" → название: `toricy`
4. Скопируйте **Connection string** (начинается с `postgresql://`)

---

## 🔧 Шаг 4: Backend на Vercel (2 минуты)

1. https://vercel.com
2. Войдите через GitHub
3. "Add New" → "Project"
4. Выберите репозиторий `toricy`
5. Настройки:
   - **Project Name:** `toricy-backend`
   - **Framework Preset:** Other
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npx prisma generate`
   - **Install Command:** `npm install`

6. **Environment Variables** (нажмите "Add"):
   ```
   DATABASE_URL=postgresql://... (вставьте из Neon)
   JWT_SECRET=toricy-super-secret-key-2024
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=https://toricy-backend.vercel.app/api/auth/google/callback
   ```

7. "Deploy"
8. Подождите 2-3 минуты
9. Скопируйте URL: `https://toricy-backend.vercel.app`

10. **Обновите GOOGLE_CALLBACK_URL:**
    - Settings → Environment Variables
    - Измените на ваш реальный URL
    - Deployments → Redeploy

---

## 🔄 Шаг 5: Обновите Frontend для production

### 1. Создайте файл `client/.env.production`:
```env
VITE_API_URL=https://toricy-backend.vercel.app
VITE_WS_URL=wss://toricy-backend.vercel.app
```

### 2. Обновите код для использования переменных

Создайте `client/src/config.ts`:
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000'
```

### 3. Замените в файлах

В файлах `Auth.tsx`, `Feed.tsx`, `Chats.tsx` и т.д. замените:
```typescript
// Было:
axios.post('http://localhost:3000/api/...')

// Стало:
import { API_URL } from '../config'
axios.post(`${API_URL}/api/...`)
```

### 4. Закоммитьте и запушьте:
```bash
git add .
git commit -m "Add production config"
git push
```

Netlify и Vercel автоматически передеплоят! 🎉

---

## 🔐 Шаг 6: Обновите Google OAuth (30 секунд)

1. https://console.cloud.google.com
2. Выберите проект
3. APIs & Services → Credentials
4. Нажмите на OAuth Client ID
5. В "Authorized redirect URIs" добавьте:
   ```
   https://toricy-backend.vercel.app/api/auth/google/callback
   ```
6. Сохраните

---

## 🎉 ГОТОВО!

Ваше приложение работает:
- **Frontend:** https://ваш-app.netlify.app
- **Backend:** https://toricy-backend.vercel.app
- **Database:** Neon PostgreSQL

**Стоимость: 0₽ навсегда!** ✅

---

## ⚠️ Важно знать

### WebSocket на Vercel
Vercel **НЕ поддерживает** WebSocket в бесплатном плане!

Это значит **НЕ будут работать:**
- ❌ Чаты в реальном времени
- ❌ Видео/аудио звонки
- ❌ Уведомления в реальном времени

**Будут работать:**
- ✅ Регистрация и вход
- ✅ Посты, лайки, комментарии
- ✅ Профиль и настройки
- ✅ Email верификация
- ✅ Google OAuth

### Решение для WebSocket

Если нужны чаты и звонки, замените Vercel на **Render**:
- Frontend → Netlify (оставить)
- Backend → Render FREE (вместо Vercel)
- Database → Neon (оставить)

См. [ДЕПЛОЙ_ЗА_5_МИНУТ.md](./ДЕПЛОЙ_ЗА_5_МИНУТ.md)

---

## 🔄 Автоматические деплои

При каждом `git push`:
- ✅ Netlify автоматически деплоит frontend
- ✅ Vercel автоматически деплоит backend

---

## 🐛 Проблемы?

### CORS ошибки
Обновите `server/src/index.ts`:
```typescript
app.use(cors({ 
  origin: [
    'http://localhost:5173',
    'https://ваш-app.netlify.app'
  ], 
  credentials: true 
}));
```

Закоммитьте и запушьте.

### Backend не запускается
- Проверьте логи на Vercel
- Убедитесь, что все Environment Variables добавлены
- Проверьте DATABASE_URL

### Google OAuth не работает
- Проверьте redirect URI в Google Console
- Должен совпадать с GOOGLE_CALLBACK_URL

---

## 💡 Рекомендация

**Если вам нужны чаты и звонки:**
Используйте Render вместо Vercel для backend!

**Если только посты и профили:**
Netlify + Vercel отлично работают!

---

## 📝 Что дальше?

1. Протестируйте приложение
2. Поделитесь ссылкой с семьей
3. Если нужны чаты - переключитесь на Render

**Всё бесплатно! 🚀**
