# Django Сайт з Модульною Структурою

Красивий Django сайт з чорним фоном, плаваючими білими шарами та модульною структурою компонентів.

## Особливості

- 🎨 Чорний фон з плаваючими білими шарами (5 штук)
- 📱 Повністю адаптивний дизайн
- 🧩 Модульна структура з Django templates
- ✨ Плавні анімації та ефекти
- 🎯 Обмеження ширини секцій до 90%
- 🔧 Кожен компонент має свій CSS

## Структура проекту

```
├── manage.py                 # Django management script
├── mysite/                   # Django project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── main/                     # Django app
│   ├── __init__.py
│   ├── apps.py
│   └── views.py
├── templates/                # Django templates
│   ├── base.html            # Головний template з імпортами
│   ├── floating-shapes.html # Плаваючі шари + CSS
│   ├── header.html          # Шапка + CSS
│   ├── hero.html            # Головна секція + CSS
│   ├── about.html           # Секція "Про нас" + CSS
│   ├── services.html        # Секція "Послуги" + CSS
│   └── contact.html         # Секція "Контакти" + CSS
├── static/                   # Статичні файли
│   ├── css/
│   │   └── main.css         # Спільні стилі
│   └── js/
│       └── main.js          # JavaScript функціональність
└── requirements.txt          # Залежності Python
```

## Встановлення та запуск

### 1. Встановіть Python та pip
Переконайтеся, що у вас встановлений Python 3.8+ та pip.

### 2. Встановіть Django
```bash
pip install -r requirements.txt
```

### 3. Запустіть міграції
```bash
python manage.py migrate
```

### 4. Запустіть сервер розробки
```bash
python manage.py runserver
```

### 5. Відкрийте браузер
Перейдіть на `http://127.0.0.1:8000/`

## Як працює модульна структура

### Головний template (base.html)
```html
{% load static %}
<!DOCTYPE html>
<html lang="uk">
<head>
    <link rel="stylesheet" href="{% static 'css/main.css' %}">
</head>
<body>
    {% include 'floating-shapes.html' %}
    {% include 'header.html' %}
    {% include 'hero.html' %}
    {% include 'about.html' %}
    {% include 'services.html' %}
    {% include 'contact.html' %}
</body>
</html>
```

### Приклад компонента (header.html)
```html
<!-- HTML контент -->
<header class="header">
    <nav class="navbar">
        <!-- навігація -->
    </nav>
</header>

<style>
/* CSS стилі для цього компонента */
.navbar {
    display: flex;
    /* стилі */
}
</style>
```

## Переваги такої структури

1. **Модульність** - кожен компонент в окремому файлі
2. **CSS поруч з HTML** - легко знайти та редагувати стилі
3. **Повторне використання** - компоненти можна імпортувати в інші templates
4. **Легке тестування** - можна тестувати кожен компонент окремо
5. **Командна робота** - різні розробники можуть працювати з різними компонентами

## Додавання нового компонента

1. Створіть новий файл в `templates/` (наприклад, `footer.html`)
2. Додайте HTML та CSS в цей файл
3. Імпортуйте в `base.html`: `{% include 'footer.html' %}`

## Технології

- Django 4.2.7
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript
- Django Templates

## Браузерна підтримка

- Chrome (останні версії)
- Firefox (останні версії)
- Safari (останні версії)
- Edge (останні версії)
