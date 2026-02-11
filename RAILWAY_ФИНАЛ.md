# 🚂 Railway - Финальная Инструкция

## ✅ ЧТО ДЕЛАТЬ ПРЯМО СЕЙЧАС

### 1. Railway автоматически подтянет новый код

Я добавил файл `server/nixpacks.toml` который говорит Railway использовать `npm install` вместо `npm ci`.

Railway автоматически пересоберёт проект после push в GitHub!

### 2. Добавьте Environment Variables

В Railway → **Variables** → **Add Variable**:

```
JWT_SECRET=toricy-super-secret-key-change-in-production-2024
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=ваш-email@gmail.com
EMAIL_PASSWORD=ваш-app-password
GOOGLE_CLIENT_ID=ваш-google-client-id
GOOGLE_CLIENT_SECRET=ваш-google-client-secret
```

**Используйте свои реальные значения из `server/.env`!**

**НЕ ДОБАВЛЯЙТЕ** `GOOGLE_CALLBACK_URL` пока! Сначала получите URL от Railway.

### 3. Получите URL от Railway

1. **Settings** → **Networking** → **Generate Domain**
2. Скопируйте URL (например: `toricy-production.up.railway.app`)

### 4. Добавьте GOOGLE_CALLBACK_URL

Теперь добавьте последнюю переменную:

```
GOOGLE_CALLBACK_URL=https://ваш-url.railway.app/api/auth/google/callback
```

Замените `ваш-url.railway.app` на реальный URL из шага 3!

### 5. Дождитесь успешного деплоя

Railway автоматически пересоберёт проект. Проверьте логи:
- **Deployments** → последний деплой → **View Logs**
- Должно быть: ✅ Build successful

---

## 📱 Обновите Frontend

После успешного деплоя на Railway:

```bash
# 1. Обновите API URL
cd client
echo "VITE_API_URL=https://ваш-url.railway.app" > .env.production

# 2. Пересоберите
npm run build

# 3. Загрузите на Netlify
# Перетащите папку client/dist/ на Netlify
```

---

## 🔐 Обновите Google OAuth

1. https://console.cloud.google.com
2. **Credentials** → ваш OAuth Client ID
3. **Authorized redirect URIs** → Add URI:
   ```
   https://ваш-url.railway.app/api/auth/google/callback
   ```
4. Save

---

## 🎯 Проверка

1. Откройте ваш сайт на Netlify
2. Попробуйте:
   - ✅ Регистрация через email (должен прийти код)
   - ✅ Вход через Google
   - ✅ Создание поста
   - ✅ Чаты (WebSocket работает!)

---

## 🐛 Если не работает

### Backend не запускается
- Проверьте логи в Railway
- Убедитесь что все Variables добавлены
- Проверьте что Root Directory = `server`

### Frontend не подключается к backend
- Проверьте `.env.production` в client
- Пересоберите: `npm run build`
- Перезагрузите на Netlify

### Google OAuth не работает
- Проверьте `GOOGLE_CALLBACK_URL` в Railway Variables
- Проверьте redirect URI в Google Console
- Они должны совпадать!

---

## 💰 Стоимость

Railway даёт **$5 кредитов бесплатно каждый месяц**!

Ваше приложение будет стоить ~$3-4/месяц = **БЕСПЛАТНО** 🎉

---

## ✨ Готово!

Ваша соц сеть Toricy работает:
- 🌐 Frontend: Netlify
- 🚂 Backend: Railway  
- 💾 Database: SQLite (в Railway)
- 🔐 Auth: Email + Google OAuth
- 💬 Чаты: WebSocket
- 📧 Email: Gmail

**Всё бесплатно и работает 24/7!** 🚀
