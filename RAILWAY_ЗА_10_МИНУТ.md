# 🚂 Railway за 10 минут

## 1️⃣ Зайдите на Railway (1 мин)

1. https://railway.app
2. "Login" → через GitHub
3. Готово!

## 2️⃣ Создайте проект (2 мин)

1. "New Project"
2. "Deploy from GitHub repo"
3. Выберите `keo564130-lang/toricy`
4. Railway автоматически определит Node.js!

## 3️⃣ Настройте (3 мин)

1. Откройте ваш сервис
2. "Settings" → "Root Directory" → `server`
3. "Variables" → "Add Variable" → добавьте:

```
JWT_SECRET=toricy-super-secret-key-2024
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://ваш-url.railway.app/api/auth/google/callback
```

4. "Settings" → "Networking" → "Generate Domain"
5. Скопируйте URL (например: `toricy-production.up.railway.app`)

## 4️⃣ Обновите GOOGLE_CALLBACK_URL (1 мин)

1. В Variables измените `GOOGLE_CALLBACK_URL` на реальный URL
2. Сохраните

## 5️⃣ Обновите frontend (2 мин)

Локально выполните:

```bash
# Обновите .env.production
echo "VITE_API_URL=https://ваш-url.railway.app" > client/.env.production

# Пересоберите
cd client
npm run build

# Перетащите client/dist/ на Netlify
```

## 6️⃣ Обновите Google OAuth (1 мин)

1. https://console.cloud.google.com
2. Credentials → OAuth Client ID
3. Добавьте redirect URI:
   ```
   https://ваш-url.railway.app/api/auth/google/callback
   ```

## ✅ Готово! (10 минут)

Ваше приложение работает:
- Frontend: Netlify
- Backend: Railway
- Database: SQLite (в Railway)

**Стоимость: $5 кредитов/месяц (бесплатно!)** 🎉

---

## 💡 Преимущества Railway

- ✅ Проще чем Vercel
- ✅ Не ругается на TypeScript
- ✅ Поддерживает WebSocket (чаты работают!)
- ✅ $5 кредитов бесплатно каждый месяц
- ✅ Автоматические деплои из GitHub
- ✅ Встроенная база данных

---

## 🐛 Если что-то не работает

1. Проверьте логи: Railway → ваш сервис → "Deployments" → последний деплой → "View Logs"
2. Проверьте Variables: все ли добавлены?
3. Проверьте Domain: сгенерирован ли?

---

## 🎯 Следующие шаги

1. Откройте ваш сайт на Netlify
2. Попробуйте зарегистрироваться
3. Всё должно работать!

**Railway не засыпает (в отличие от Render)!** 🚀
