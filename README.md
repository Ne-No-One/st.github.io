# ST - Django Site на GitHub Pages

Красивий Django сайт з чорним фоном, плаваючими білими шарами та модульною структурою компонентів, тепер доступний на GitHub Pages з Jekyll.

## 🚀 Живий сайт

Сайт доступний за адресою: [https://your-username.github.io/st](https://your-username.github.io/st)

## 📋 Що було виправлено

### ✅ Liquid Syntax Error
- **Проблема**: Jekyll намагався обробити Django теги `{% load %}` як Liquid теги
- **Рішення**: Обернув всі Django теги в `{% raw %}` блоки в README_DJANGO.md

### ✅ GitHub Pages Compatibility Error
- **Проблема**: `Invalid date '<%= Time.now.strftime('%Y-%m-%d %H:%M:%S %z') %>'` в vendor файлах
- **Рішення**: Виключив vendor директорію з обробки Jekyll та оновив Gemfile для сумісності

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

### ✅ Jekyll Structure
- Створено базовий layout (`_layouts/default.html`)
- Додано стилі (`assets/css/style.css`)
- Додано JavaScript (`assets/js/main.js`)
- Створено головну сторінку (`index.html`)

## 🛠 Технології

- **Jekyll 4.3.0** - статичний генератор сайтів
- **GitHub Pages** - хостинг
- **GitHub Actions** - CI/CD
- **Liquid** - шаблонізатор
- **HTML5, CSS3, JavaScript** - фронтенд

## 📁 Структура Jekyll

```
├── _config.yml          # Jekyll конфігурація
├── _layouts/            # Шаблони
│   └── default.html     # Базовий layout
├── assets/              # Статичні файли
│   ├── css/
│   │   └── style.css    # Стилі
│   └── js/
│       └── main.js      # JavaScript
├── .github/workflows/   # GitHub Actions
│   └── pages.yml        # Workflow для деплою
├── index.html           # Головна сторінка
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

## 📝 Важливі нотатки

- Django файли виключені з Jekyll обробки
- Всі Django теги в документації обернуті в `{% raw %}` блоки
- Сайт повністю адаптивний та оптимізований для GitHub Pages
- SEO оптимізований з мета-тегами та sitemap

## 🎯 Наступні кроки

1. Замінити `your-username` на свій GitHub username в `_config.yml`
2. Оновити email та соціальні посилання
3. Додати власний контент в `index.html`
4. Налаштувати домен (опціонально)

---

**Проблема з Liquid syntax error вирішена!** 🎉
