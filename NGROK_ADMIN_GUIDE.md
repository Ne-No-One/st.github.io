# 🌐 Доступ до Адмін Панелі через Ngrok

## 📋 Що потрібно зробити:

### 1. 🚀 Запуск сервера
```bash
python manage.py runserver 0.0.0.0:8000
```

### 2. 🌍 Запуск Ngrok
В новому терміналі:
```bash
ngrok http 8000
```

### 3. 🔗 Отримання URL
Ngrok надасть вам URL типу:
```
https://abc123.ngrok-free.app
```

## 🎯 Доступ до адмін панелі:

### Основний сайт:
```
https://abc123.ngrok-free.app/
```

### Адмін панель:
```
https://abc123.ngrok-free.app/admin-panel/
```

### Django Admin:
```
https://abc123.ngrok-free.app/admin/
```

## ⚙️ Налаштування для Ngrok:

### 1. Оновіть ALLOWED_HOSTS в settings.py:
```python
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '.ngrok-free.app', '*.ngrok.io']
```

### 2. Для безпеки (опціонально):
```python
# В settings.py додайте:
SECURE_SSL_REDIRECT = False  # Для ngrok
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
```

## 🔧 Команди для швидкого запуску:

### Windows PowerShell:
```powershell
# Термінал 1 - Django сервер
python manage.py runserver 0.0.0.0:8000

# Термінал 2 - Ngrok
ngrok http 8000
```

### Linux/Mac:
```bash
# Термінал 1 - Django сервер
python manage.py runserver 0.0.0.0:8000 &

# Термінал 2 - Ngrok
ngrok http 8000
```

## 📱 Доступ з мобільних пристроїв:

1. **Запустіть ngrok** і скопіюйте URL
2. **Відкрийте на телефоні** `https://your-url.ngrok-free.app/admin-panel/`
3. **Управляйте сайтом** з будь-якого пристрою

## 🛡️ Безпека:

- Ngrok URL змінюється при кожному перезапуску
- Використовуйте тільки для розробки
- Не публікуйте ngrok URL в публічних місцях
- Для продакшену використовуйте власний домен

## 🎨 Функціональність адмін панелі:

- ✅ **Дашборд** - статистика та швидкий доступ
- ✅ **Налаштування сайту** - кольори, ширини, SEO
- ✅ **Головний товар** - ціна, опис, кнопки
- ✅ **Кольори** - drag & drop сортування
- ✅ **Кількість** - варіанти кількості
- ✅ **Додаткові товари** - управління товарами
- ✅ **Контакти** - телефон, email, соцмережі
- ✅ **Послуги** - додавання та редагування

## 🚨 Вирішення проблем:

### Помилка "no such table":
```bash
python manage.py makemigrations admin_panel
python manage.py migrate
```

### Помилка "ALLOWED_HOSTS":
Додайте ваш ngrok домен до ALLOWED_HOSTS в settings.py

### Помилка "CSRF":
Ngrok автоматично обробляє CSRF токени

## 💡 Поради:

1. **Збережіть ngrok URL** для швидкого доступу
2. **Використовуйте закладки** для швидкої навігації
3. **Тестуйте на різних пристроях** через ngrok
4. **Перевіряйте зміни** на основному сайті

## 🎉 Готово!

Тепер ви можете управляти сайтом з будь-якого місця через ngrok!
