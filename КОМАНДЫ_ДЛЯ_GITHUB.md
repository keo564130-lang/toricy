# 📝 Команды для GitHub

## 🎯 Что нужно сделать:

### 1. Создайте репозиторий на GitHub

1. Откройте https://github.com
2. Нажмите зеленую кнопку **"New"** (или "New repository")
3. **Repository name:** `toricy`
4. **Description:** `Семейная социальная сеть`
5. **Public** или **Private** - на ваш выбор
6. **НЕ** ставьте галочки на:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
7. Нажмите **"Create repository"**

---

### 2. Скопируйте ваш username

После создания репозитория GitHub покажет URL типа:
```
https://github.com/ваш-username/toricy.git
```

Скопируйте ваш **username** (например: `alexey`, `john`, `maria` и т.д.)

---

### 3. Выполните команды

**Замените `ваш-username` на ваш реальный GitHub username!**

```bash
git remote add origin https://github.com/ваш-username/toricy.git
git push -u origin main
```

**Примеры:**

Если ваш username `alexey`:
```bash
git remote add origin https://github.com/alexey/toricy.git
git push -u origin main
```

Если ваш username `john`:
```bash
git remote add origin https://github.com/john/toricy.git
git push -u origin main
```

---

### 4. Введите пароль

GitHub попросит авторизацию:
- **Username:** ваш GitHub username
- **Password:** используйте **Personal Access Token** (не обычный пароль!)

#### Как создать Personal Access Token:

1. GitHub → Settings (справа вверху)
2. Developer settings (внизу слева)
3. Personal access tokens → Tokens (classic)
4. Generate new token (classic)
5. Note: `toricy`
6. Expiration: `No expiration`
7. Галочка на: **repo** (все подпункты)
8. Generate token
9. **СКОПИРУЙТЕ токен!** (больше не увидите)
10. Используйте его вместо пароля

---

## ✅ Готово!

После `git push` ваш код будет на GitHub!

Проверьте: https://github.com/ваш-username/toricy

---

## 🚀 Что дальше?

Откройте **ПРОСТАЯ_ИНСТРУКЦИЯ.md** и следуйте шагам 2 и 3:
- Netlify (frontend)
- Vercel (backend + база)

---

## 🆘 Если ошибка

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/ваш-username/toricy.git
git push -u origin main
```

### "Authentication failed"
- Используйте Personal Access Token вместо пароля
- См. инструкцию выше

### "Permission denied"
- Проверьте, что репозиторий создан
- Проверьте username в URL
- Проверьте токен

---

## 📝 Команды одной строкой:

```bash
# Замените ваш-username!
git remote add origin https://github.com/ваш-username/toricy.git && git push -u origin main
```
