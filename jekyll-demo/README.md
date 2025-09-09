# Jekyll Демо Сайт

## 🎨 Опис

Демонстраційна версія сайту на Jekyll для GitHub Pages з:
- ✅ Статичний сайт
- ✅ GitHub Pages хостинг
- ✅ Демо функціональність кошика
- ✅ Адаптивний дизайн
- ✅ Швидка завантаження

## 🚀 Встановлення

### 1. Встановити Ruby та Bundler:
```bash
# Windows (з Chocolatey)
choco install ruby

# Або завантажити з https://rubyinstaller.org/
```

### 2. Встановити залежності:
```bash
bundle install
```

### 3. Запустити локально:
```bash
bundle exec jekyll serve
```

### 4. Відкрити в браузері:
http://localhost:4000

## 📱 Доступ

- **Локально**: http://localhost:4000
- **GitHub Pages**: https://yourusername.github.io/st-demo

## 🎯 Функціональність

### Демо функції:
- Перегляд товарів
- Демо кошик (localStorage)
- Зміна кольорів товару
- Форма контактів
- Адаптивний дизайн

### Обмеження:
- ❌ Немає бази даних
- ❌ Немає обробки замовлень
- ❌ Немає адмін-панелі
- ❌ Немає реальних платежів

## 📁 Структура

```
jekyll-demo/
├── _config.yml          ← Налаштування Jekyll
├── _layouts/            ← HTML шаблони
│   └── default.html     ← Основний шаблон
├── assets/              ← CSS, JS, зображення
│   ├── css/
│   ├── js/
│   └── images/
├── index.html           ← Головна сторінка
├── Gemfile              ← Ruby залежності
└── README.md            ← Документація
```

## 🎨 Дизайн

Використовує спільні CSS/JS файли з папки `shared/` для:
- Чорний фон з плаваючими шарами
- Адаптивний дизайн
- Сучасний UI/UX
- Демо функціональність

## 🔄 Розробка

### Додавання контенту:
1. Редагувати `index.html` для зміни контенту
2. Додавати нові сторінки в корені
3. Змінювати стилі в `assets/css/style.css`
4. Додавати JavaScript в `assets/js/main.js`

### Налаштування:
- Змінити налаштування в `_config.yml`
- Додати нові шаблони в `_layouts/`
- Налаштувати GitHub Pages в налаштуваннях репозиторію

## 🚀 Деплой на GitHub Pages

### Автоматичний деплой:
1. Завантажити код в GitHub репозиторій
2. Увімкнути GitHub Pages в налаштуваннях
3. Вибрати "GitHub Actions" як джерело
4. Створити `.github/workflows/pages.yml`:

```yaml
name: Deploy Jekyll site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'
          bundler-cache: true
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Build with Jekyll
        run: bundle exec jekyll build --baseurl "${{ steps.pages.outputs.base_path }}"
        env:
          JEKYLL_ENV: production
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 📞 Підтримка

При проблемах:
1. Перевірити версію Ruby: `ruby --version`
2. Перевірити Bundler: `bundle --version`
3. Очистити кеш: `bundle clean --force`
4. Перевірити логи Jekyll

## 🔗 Корисні посилання

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages](https://pages.github.com/)
- [Liquid Template Language](https://shopify.github.io/liquid/)
- [Jekyll Themes](https://jekyllthemes.io/)
