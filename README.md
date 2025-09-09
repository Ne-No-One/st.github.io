# Мій Сайт на GitHub Pages

Красивий сайт з чорним фоном, плаваючими білими шарами та сучасним дизайном, тепер доступний на GitHub Pages як статичний сайт.

## 🚀 Живий сайт

Сайт доступний за адресою: [https://your-username.github.io/st](https://your-username.github.io/st)

## 📋 Що було виправлено

### ✅ Liquid Syntax Error
- **Проблема**: Jekyll намагався обробити Django теги `{% load %}` як Liquid теги
- **Рішення**: Обернув всі Django теги в `{% raw %}` блоки в README_DJANGO.md

### ✅ GitHub Pages Compatibility Error
- **Проблема**: `Invalid date '<%= Time.now.strftime('%Y-%m-%d %H:%M:%S %z') %>'` в vendor файлах
- **Рішення**: Виключив vendor директорію з обробки Jekyll та оновив Gemfile для сумісності

### ✅ CSS/JS Files Not Loading
- **Проблема**: На GitHub Pages відображався тільки текст без дизайну
- **Рішення**: Перемістив CSS та JS файли в кореневу папку та оновив шляхи в layout

### ✅ Jekyll Configuration
- Створено `_config.yml` з правильною конфігурацією
- Налаштовано виключення Django файлів з обробки
- Додано підтримку SEO та sitemap
- Виключено vendor файли з обробки Jekyll

### ✅ GitHub Actions Workflow
- Створено автоматичний деплой через GitHub Actions
- Налаштовано збірку Jekyll сайту
- Автоматичне розгортання на GitHub Pages
- Виправлено сумісність з GitHub Pages (Jekyll 3.10.0)

### ✅ Статичний Django Сайт
- Конвертовано Django templates в статичний HTML
- Перенесено всі стилі та JavaScript функції
- Збережено плаваючі білі шари та анімації
- Додано функціональність товару та кошика

## 🛠 Технології

- **Jekyll** - статичний генератор сайтів
- **GitHub Pages** - хостинг
- **GitHub Actions** - CI/CD
- **HTML5, CSS3, JavaScript** - фронтенд
- **Плаваючі анімації** - CSS animations
- **Інтерактивний товар** - JavaScript функціональність

## 📁 Структура сайту

```
├── _config.yml          # Jekyll конфігурація
├── _layouts/            # Шаблони
│   └── default.html     # Базовий layout
├── assets/              # Статичні файли
│   ├── css/
│   │   └── style.css    # Стилі (чорний фон, плаваючі шари)
│   └── js/
│       └── main.js      # JavaScript (товар, кошик, анімації)
├── .github/workflows/   # GitHub Actions
│   └── pages.yml        # Workflow для деплою
├── index.html           # Головна сторінка з товаром
├── Gemfile              # Ruby залежності
└── .gitignore           # Виключення з Git
```

## 🚀 Як це працює

1. **Push до main гілки** → GitHub Actions автоматично запускається
2. **Збірка Jekyll** → Генерується статичний сайт
3. **Деплой на Pages** → Сайт стає доступним

## 🔧 Локальна розробка

```bash
# Встановити Ruby та Bundler
gem install bundler

# Встановити залежності (GitHub Pages сумісні)
bundle install

# Запустити локальний сервер
bundle exec jekyll serve

# Сайт буде доступний на http://localhost:4000
```

### Альтернативний спосіб (без bundle):

```bash
# Встановити github-pages gem
gem install github-pages

# Запустити сервер
jekyll serve
```

## 📝 Особливості сайту

- **Чорний фон** з плаваючими білими шарами (5 штук)
- **Інтерактивний товар** з вибором кольору та додаванням в кошик
- **B2B кнопка** та кошик з лічильником
- **Плавні анімації** при скролі та наведенні
- **Адаптивний дизайн** для всіх пристроїв
- **Форма контактів** з валідацією

## 🎯 Наступні кроки

1. Замінити `your-username` на свій GitHub username в `_config.yml`
2. Оновити email та контактну інформацію
3. Додати реальні зображення товару замість placeholder
4. Налаштувати домен (опціонально)

---

**Ваш Django сайт тепер працює на GitHub Pages!** 🎉
