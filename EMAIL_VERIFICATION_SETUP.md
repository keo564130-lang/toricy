# Email верификация (бесплатная альтернатива SMS)

Если не хотите платить за SMS, используйте email верификацию!

## Вариант 1: Gmail SMTP (Бесплатно)

### Шаг 1: Создайте App Password в Google

1. Перейдите на https://myaccount.google.com/security
2. Включите **2-Step Verification** (если еще не включена)
3. Перейдите в **App passwords** (Пароли приложений)
4. Выберите:
   - App: Mail
   - Device: Other (Custom name) → введите "Toricy"
5. Нажмите **Generate**
6. Скопируйте 16-значный пароль (без пробелов)

### Шаг 2: Обновите .env

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="ваш-email@gmail.com"
EMAIL_PASSWORD="ваш-app-password-16-символов"
```

### Шаг 3: Код уже готов!

Email отправка уже реализована в коде. Просто обновите .env и перезапустите сервер.

## Вариант 2: Resend (Современный, бесплатно)

### Преимущества:
- 3000 emails/месяц бесплатно
- Современный API
- Красивые email шаблоны
- Аналитика

### Настройка:

1. Зарегистрируйтесь на https://resend.com
2. Получите API ключ
3. Установите пакет:
```bash
cd server
npm install resend
```

4. Обновите код:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Toricy <onboarding@resend.dev>',
  to: email,
  subject: 'Код подтверждения',
  html: `<p>Ваш код: <strong>${code}</strong></p>`
});
```

## Вариант 3: Для разработки - без верификации

Если это только для разработки/тестирования:

### Отключите SMS верификацию:

В `server/src/routes/auth.ts`:

```typescript
// Регистрация по телефону БЕЗ SMS
router.post('/register/phone', async (req, res) => {
  try {
    const { phone, password, username, displayName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        username,
        displayName,
        verified: true, // Сразу верифицируем
        settings: { create: {} }
      }
    });
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.json({ token, user: { id: user.id, username: user.username, displayName: user.displayName } });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});
```

## Вариант 4: Российские SMS сервисы (дешевле)

### SMS.ru
- От 1.55₽ за SMS
- Российский сервис
- https://sms.ru

**Настройка:**
1. Регистрация на sms.ru
2. Пополнить баланс (от 100₽)
3. Получить API ключ
4. Установить пакет:
```bash
npm install sms-ru
```

### SMSC.ru
- От 1₽ за SMS
- Еще дешевле
- https://smsc.ru

## Сравнение вариантов:

| Вариант | Стоимость | Сложность | Для продакшена |
|---------|-----------|-----------|----------------|
| Email (Gmail) | Бесплатно | Легко | ✅ Да |
| Resend | Бесплатно (3000/мес) | Легко | ✅ Да |
| Без верификации | Бесплатно | Очень легко | ❌ Нет |
| SMS.ru | ~1.5₽/SMS | Средне | ✅ Да |
| Twilio | ~5₽/SMS | Средне | ✅ Да |

## Рекомендация:

**Для вашего случая:**
1. **Email верификация** - бесплатно и надежно
2. Пользователи регистрируются по email
3. Получают код на почту
4. Вводят код и регистрируются

**Или:**
- Используйте только Google OAuth (уже настроено!)
- Пользователи входят через Google одним кликом
- Никаких SMS/Email не нужно

## Хотите настроить Email верификацию?

Скажите, и я обновлю код для использования Gmail SMTP вместо SMS!
