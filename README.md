# 🛒 Гібридний Проект: Django Магазин + Jekyll Демо

## 📋 Огляд

Цей проект містить **дві версії** одного сайту:

1. **🛒 Django Магазин** - Повноцінний інтернет-магазин з базою даних
2. **🎨 Jekyll Демо** - Демонстраційна версія для GitHub Pages

## 📁 Структура проекту

```
E:\st\
├── django-shop/          ← Повноцінний магазин на Django
│   ├── mysite/           ← Налаштування Django
│   ├── shop/             ← Додаток магазину
│   ├── templates/        ← HTML шаблони
│   ├── static/           ← Статичні файли
│   ├── media/            ← Завантажені файли
│   └── requirements.txt  ← Python залежності
├── jekyll-demo/          ← Демонстраційний сайт на Jekyll
│   ├── _config.yml       ← Налаштування Jekyll
│   ├── _layouts/         ← HTML шаблони
│   ├── assets/           ← CSS, JS, зображення
│   ├── .github/workflows/← GitHub Actions
│   └── Gemfile           ← Ruby залежності
├── shared/               ← Спільні ресурси
│   ├── css/style.css     ← Спільні стилі
│   ├── js/main.js        ← Спільний JavaScript
│   └── foto*.jpg         ← Спільні зображення
└── README.md             ← Цей файл
```

## 🚀 Швидкий старт

### Django Магазин (Повна версія)

```bash
# Перейти в папку Django
cd django-shop

# Встановити залежності
pip install -r requirements.txt

# Запустити міграції
python manage.py migrate

# Створити суперкористувача
python manage.py createsuperuser

# Запустити сервер
python manage.py runserver
```

**Доступ**: http://127.0.0.1:8000/

### Jekyll Демо (Демонстрація)

```bash
# Перейти в папку Jekyll
cd jekyll-demo

# Встановити залежності
bundle install

# Запустити локально
bundle exec jekyll serve
```

**Доступ**: http://localhost:4000

## 🎯 Функціональність

### Django Магазин (Повна версія)
- ✅ База даних товарів
- ✅ Адмін-панель
- ✅ Кошик покупок
- ✅ Оформлення замовлень
- ✅ Обробка платежів
- ✅ Управління користувачами
- ✅ API для AJAX запитів

### Jekyll Демо (Демонстрація)
- ✅ Статичний сайт
- ✅ GitHub Pages хостинг
- ✅ Демо функціональність кошика
- ✅ Адаптивний дизайн
- ✅ Швидка завантаження
- ❌ Немає бази даних
- ❌ Немає обробки замовлень

## 🎨 Дизайн

Обидві версії використовують **спільний дизайн**:
- Чорний фон з плаваючими білими шарами
- Сучасний UI/UX
- Адаптивний дизайн
- Градієнтні кнопки та елементи

## 🔄 Розробка

### Для Django:
1. Редагувати моделі в `django-shop/shop/models.py`
2. Додавати views в `django-shop/shop/views.py`
3. Створювати шаблони в `django-shop/templates/`
4. Налаштовувати URL в `django-shop/shop/urls.py`

### Для Jekyll:
1. Редагувати контент в `jekyll-demo/index.html`
2. Змінювати стилі в `shared/css/style.css`
3. Додавати JavaScript в `shared/js/main.js`
4. Налаштовувати Jekyll в `jekyll-demo/_config.yml`

### Спільні ресурси:
- CSS стилі: `shared/css/style.css`
- JavaScript: `shared/js/main.js`
- Зображення: `shared/foto*.jpg`

## 🚀 Деплой

### Django (Продакшн)
- Використовувати PostgreSQL замість SQLite
- Налаштувати статичні файли
- Використовувати Gunicorn + Nginx
- Налаштувати HTTPS

### Jekyll (GitHub Pages)
- Автоматичний деплой через GitHub Actions
- Налаштувати домен в `_config.yml`
- Оптимізувати зображення

## 📞 Підтримка

### Django проблеми:
1. Перевірити міграції: `python manage.py showmigrations`
2. Перевірити статичні файли: `python manage.py collectstatic`
3. Перевірити логи в консолі

### Jekyll проблеми:
1. Перевірити Ruby: `ruby --version`
2. Очистити кеш: `bundle clean --force`
3. Перевірити `_config.yml`

## 🔗 Корисні посилання

- [Django Documentation](https://docs.djangoproject.com/)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages](https://pages.github.com/)
- [Bootstrap](https://getbootstrap.com/)

## 📝 Ліцензія

MIT License - використовуйте вільно для своїх проектів!

---

**Створено з ❤️ для демонстрації гібридного підходу до веб-розробки**