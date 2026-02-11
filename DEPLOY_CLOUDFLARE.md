# Деплой Toricy на Cloudflare

## Архитектура деплоя

- **Frontend**: Cloudflare Pages
- **Backend**: Cloudflare Workers (или Railway/Render)
- **Database**: Neon PostgreSQL (бесплатный serverless)

## Часть 1: Подготовка базы данных (Neon)

### Шаг 1: Создайте аккаунт на Neon

1. Перейдите на https://neon.tech
2. Зарегистрируйтесь (можно через GitHub)
3. Создайте новый проект: **Toricy**

### Шаг 2: Получите connection string

1. В дашборде Neon скопируйте **Connection string**
2. Он будет выглядеть так:
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Шаг 3: Обновите .env

Замените в `server/.env`:
```env
DATABASE_URL="ваш-neon-connection-string"
```

### Шаг 4: Примените миграции

```bash
cd server
npx prisma migrate deploy
npx prisma generate
```

## Часть 2: Деплой Backend (Railway - рекомендуется)

### Вариант A: Railway (проще и быстрее)

1. **Зарегистрируйтесь на Railway**
   - Перейдите на https://railway.app
   - Войдите через GitHub

2. **Создайте новый проект**
   - New Project → Deploy from GitHub repo
   - Выберите ваш репозиторий Toricy
   - Root Directory: `server`

3. **Настройте переменные окружения**
   
   В Railway добавьте:
   ```
   DATABASE_URL=ваш-neon-connection-string
   JWT_SECRET=ваш-секретный-ключ
   GOOGLE_CLIENT_ID=ваш-google-client-id
   GOOGLE_CLIENT_SECRET=ваш-google-client-secret
   GOOGLE_CALLBACK_URL=https://ваш-домен.railway.app/api/auth/google/callback
   PORT=3000
   ```

4. **Настройте build команды**
   
   Railway автоматически определит Node.js проект.
   Убедитесь что в `server/package.json` есть:
   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/index.js"
     }
   }
   ```

5. **Деплой**
   - Railway автоматически задеплоит при push в GitHub
   - Получите URL: `https://ваш-проект.railway.app`

### Вариант B: Render

1. Перейдите на https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Настройте:
   - Build Command: `cd server && npm install && npm run build`
   - Start Command: `cd server && npm start`
   - Environment Variables: добавьте все из .env

## Часть 3: Деплой Frontend (Cloudflare Pages)

### Шаг 1: Подготовьте код

1. **Обновите API URL в коде**

Создайте файл `client/.env.production`:
```env
VITE_API_URL=https://ваш-backend.railway.app
```

2. **Обновите axios базовый URL**

Создайте `client/src/config.ts`:
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

Замените все `http://localhost:3000` на `API_URL` в коде.

### Шаг 2: Создайте проект на Cloudflare Pages

1. **Войдите в Cloudflare**
   - Перейдите на https://dash.cloudflare.com
   - Workers & Pages → Create application → Pages

2. **Подключите GitHub**
   - Connect to Git
   - Выберите репозиторий Toricy

3. **Настройте build**
   ```
   Build command: cd client && npm install && npm run build
   Build output directory: client/dist
   Root directory: /
   ```

4. **Environment variables**
   ```
   VITE_API_URL=https://ваш-backend.railway.app
   ```

5. **Deploy**
   - Нажмите "Save and Deploy"
   - Cloudflare задеплоит ваш сайт
   - Получите URL: `https://toricy.pages.dev`

### Шаг 3: Настройте custom domain (опционально)

1. В Cloudflare Pages → Custom domains
2. Добавьте ваш домен (например, `toricy.com`)
3. Cloudflare автоматически настроит SSL

## Часть 4: Обновите Google OAuth

1. Перейдите в Google Cloud Console
2. Обновите Authorized redirect URIs:
   ```
   https://ваш-backend.railway.app/api/auth/google/callback
   ```
3. Обновите Authorized JavaScript origins:
   ```
   https://toricy.pages.dev
   https://ваш-домен.com (если есть)
   ```

## Часть 5: Настройте CORS

Обновите `server/src/index.ts`:

```typescript
app.use(cors({ 
  origin: [
    'http://localhost:5173',
    'https://toricy.pages.dev',
    'https://ваш-домен.com'
  ],
  credentials: true 
}));

const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://toricy.pages.dev',
      'https://ваш-домен.com'
    ],
    credentials: true
  }
});
```

## Автоматический деплой

После настройки:
- Push в `main` ветку → автоматический деплой на Cloudflare Pages
- Push в `main` ветку → автоматический деплой на Railway

## Мониторинг

### Railway
- Логи: Railway Dashboard → Deployments → Logs
- Метрики: CPU, Memory, Network

### Cloudflare Pages
- Analytics: Pages → Analytics
- Логи: Pages → Deployments → View logs

### Neon
- Database metrics: Neon Dashboard → Monitoring

## Стоимость

- **Neon**: Бесплатно (0.5 GB storage, 100 часов compute)
- **Railway**: $5/месяц (500 часов, потом $0.000231/GB-s)
- **Cloudflare Pages**: Бесплатно (500 builds/месяц)

**Итого**: ~$5/месяц для полноценного приложения

## Альтернативы

### Для Backend:
- **Vercel** (serverless functions)
- **Fly.io** (контейнеры)
- **DigitalOcean App Platform** ($5/месяц)

### Для Database:
- **Supabase** (PostgreSQL + Auth)
- **PlanetScale** (MySQL)
- **MongoDB Atlas** (NoSQL)

## Troubleshooting

### Ошибка CORS
- Проверьте origin в настройках CORS
- Убедитесь что credentials: true

### Ошибка подключения к БД
- Проверьте DATABASE_URL
- Убедитесь что SSL включен: `?sslmode=require`

### Google OAuth не работает
- Проверьте redirect URIs в Google Console
- Убедитесь что используете HTTPS

### WebSocket не работает
- Cloudflare Pages не поддерживает WebSocket
- Используйте отдельный домен для backend
- Или используйте Cloudflare Workers с Durable Objects

## Готово! 🎉

Ваше приложение Toricy теперь доступно онлайн:
- Frontend: https://toricy.pages.dev
- Backend: https://ваш-проект.railway.app
- Database: Neon PostgreSQL

Пользователи могут регистрироваться и пользоваться всеми функциями!
