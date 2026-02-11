# ✅ Railway Deployment Checklist

## Шаг 1: Настройте Root Directory
- [ ] Railway → Settings → Root Directory → `server`
- [ ] Сохраните

## Шаг 3: Добавьте Environment Variables
Скопируйте из `server/.env` и добавьте в Railway → Variables:

- [ ] `JWT_SECRET`
- [ ] `EMAIL_HOST`
- [ ] `EMAIL_PORT`
- [ ] `EMAIL_USER`
- [ ] `EMAIL_PASSWORD`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`

## Шаг 4: Получите Railway URL
- [ ] Settings → Networking → Generate Domain
- [ ] Скопируйте URL: `_____________________.railway.app`

## Шаг 5: Добавьте GOOGLE_CALLBACK_URL
- [ ] Variables → Add Variable:
  ```
  GOOGLE_CALLBACK_URL=https://ваш-url.railway.app/api/auth/google/callback
  ```

## Шаг 6: Дождитесь деплоя
- [ ] Deployments → View Logs → ✅ Build successful

## Шаг 7: Обновите Frontend
```bash
cd client
echo "VITE_API_URL=https://ваш-url.railway.app" > .env.production
npm run build
```
- [ ] Перетащите `client/dist/` на Netlify

## Шаг 8: Обновите Google OAuth
- [ ] Google Console → Credentials → Add redirect URI:
  ```
  https://ваш-url.railway.app/api/auth/google/callback
  ```

## Шаг 9: Тестирование
- [ ] Регистрация через email работает
- [ ] Вход через Google работает
- [ ] Посты создаются
- [ ] Чаты работают

---

## 🎉 Готово!

Ваш Railway URL: `_____________________`
Ваш Netlify URL: `_____________________`

**Всё работает бесплатно!** 🚀
