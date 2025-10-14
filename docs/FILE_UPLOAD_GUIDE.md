# 📤 СИСТЕМА ЗАВАНТАЖЕННЯ ФАЙЛІВ

## 📋 ОГЛЯД

Додано можливість завантажувати фото товарів безпосередньо через адмін панель, не тільки через URL.

**Версія:** 1.0  
**Дата:** 09.10.2025

---

## 🎯 МОЖЛИВОСТІ

### Підтримувані формати:
- ✅ **JPG/JPEG** (рекомендовано)
- ✅ **PNG** (з прозорістю)
- ✅ **WebP** (сучасний формат)

### Обмеження:
- **Максимальний розмір:** 5 MB
- **Валідація:** Автоматична перевірка розміру
- **Превью:** Показується одразу після вибору файлу

---

## 📁 СТРУКТУРА ЗБЕРІГАННЯ

```
media/
├── products/
│   ├── main/           # Фото основного товару
│   │   ├── flowers_red_21.jpg
│   │   ├── flowers_red_51.jpg
│   │   └── ...
│   └── additional/     # Фото додаткових товарів
│       ├── gift_box.jpg
│       ├── vase.jpg
│       └── ...
└── .gitignore         # Файли не комітяться в Git
```

**Файли зберігаються локально на сервері**

---

## 🔧 ДЕ ВИКОРИСТОВУЄТЬСЯ

### 1. Основний товар - Кольори та кількості
**URL:** `/admin-panel/main-product/create-color-with-quantities/`

**Для кожної кількості (21, 51, 101, 201 шт):**
- Поле "URL зображення" (як раніше)
- **АБО**
- Кнопка "Завантажити файл" (нове)

**Приклад:**
```
Кількість: 21 шт
├─ URL: https://imgur.com/... (опціонально)
└─ АБО Завантажити файл: [Вибрати файл] (нове)
```

### 2. Додаткові товари - Додавання
**URL:** `/admin-panel/additional-products/`

**Секція "Додати новий товар":**
- Поле "URL зображення"
- **АБО**
- Кнопка "Завантажити файл"

### 3. Додаткові товари - Редагування
**URL:** `/admin-panel/additional-products/edit/{id}/`

**Поле зображення:**
- Поле "URL зображення" (можна залишити старе)
- **АБО**
- Кнопка "Завантажити новий файл" (замінить старе)

---

## 💡 ЯК ВИКОРИСТОВУВАТИ

### Варіант 1: URL (як раніше)
1. Вставити посилання в поле "URL зображення"
2. Залишити "Завантажити файл" пустим
3. Зберегти

**Результат:** Зображення завантажується з вказаного URL

### Варіант 2: Завантажити файл (НОВЕ)
1. Натиснути "Вибрати файл" під "АБО"
2. Обрати файл JPG/PNG/WebP (до 5MB)
3. Побачите превью зображення
4. Поле URL автоматично очиститься
5. Зберегти

**Результат:** Файл завантажується на сервер, генерується URL `/media/products/.../filename.jpg`

### Варіант 3: Змішаний
- Можна використовувати URL для одних зображень
- І завантаження файлів для інших
- В одній формі одночасно

---

## 🔍 ТЕХНІЧНІ ДЕТАЛІ

### Backend (Python)

**Helper функція:**
```python
def handle_image_upload(uploaded_file, subfolder='products'):
    """
    Обробка завантаження зображення
    
    Args:
        uploaded_file: File object з request.FILES
        subfolder: Підпапка в media/ (default: 'products')
    
    Returns:
        str: URL завантаженого файлу або None якщо помилка
    """
```

**Використання у views:**
```python
uploaded_file = request.FILES.get('image_file')
if uploaded_file:
    image_url = handle_image_upload(uploaded_file, 'products/main')
else:
    image_url = request.POST.get('image_url', '').strip()
```

### Frontend (HTML)

**Структура поля:**
```html
<!-- URL -->
<label>URL зображення</label>
<input type="url" name="image_url">

<!-- Розділювач -->
<div class="text-center">АБО</div>

<!-- File Upload -->
<label>Завантажити файл</label>
<input type="file" name="image_file" accept="image/*" 
       onchange="previewFile(this, 'preview-id')">

<!-- Превью -->
<div id="preview-id" style="display: none;">
    <img src="" class="img-fluid rounded">
</div>
```

**Важливо:** Форма повинна мати `enctype="multipart/form-data"`

### JavaScript

**Функція превью:**
```javascript
function previewUploadedImage(input, quantity) {
    const file = input.files[0];
    if (file) {
        // Валідація розміру (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Файл занадто великий!');
            return;
        }
        
        // Показуємо превью
        const reader = new FileReader();
        reader.onload = function(e) {
            // Оновлюємо img src
            img.src = e.target.result;
            // Очищаємо URL поле
            urlInput.value = '';
        };
        reader.readAsDataURL(file);
    }
}
```

---

## 🔒 БЕЗПЕКА

### Реалізовано:
- ✅ Перевірка розміру файлу (макс 5MB)
- ✅ Обмеження типів файлів (accept="image/*")
- ✅ Валідація на frontend та backend
- ✅ Файли зберігаються в окремій папці media/

### Рекомендовано додати:
- [ ] Валідація MIME type на backend
- [ ] Перевірка розмірів зображення (мін/макс)
- [ ] Автоматична оптимізація (compression)
- [ ] Генерація thumbnails
- [ ] Захист від uploading небезпечних файлів

**Приклад валідації MIME:**
```python
def handle_image_upload(uploaded_file, subfolder='products'):
    # Перевіряємо MIME type
    allowed_types = ['image/jpeg', 'image/png', 'image/webp']
    if uploaded_file.content_type not in allowed_types:
        raise ValueError('Недопустимий тип файлу')
    
    # Перевіряємо розмір
    if uploaded_file.size > 5 * 1024 * 1024:  # 5MB
        raise ValueError('Файл занадто великий')
    
    # ... зберігаємо файл
```

---

## 📊 ПЕРЕВАГИ

### Для адміністратора:
- ✅ Не потрібно шукати зовнішній хостинг (imgur, pinterest)
- ✅ Швидке завантаження - одразу в формі
- ✅ Превью перед збереженням
- ✅ Повний контроль над файлами

### Для сайту:
- ✅ Швидше завантаження (локальні файли)
- ✅ Немає залежності від зовнішніх сервісів
- ✅ Можна налаштувати CDN
- ✅ Повний контроль якості

---

## 🚀 МАЙБУТНІ ПОКРАЩЕННЯ

### Можна додати:
- [ ] **Автоматична оптимізація** (compress при завантаженні)
- [ ] **Генерація thumbnails** (мініатюри для превью)
- [ ] **Різні розміри** (small, medium, large)
- [ ] **WebP конвертація** (автоматична)
- [ ] **Crop/resize інтерфейс** (обрізати зображення)
- [ ] **Масове завантаження** (multiple files)
- [ ] **Drag & Drop** (перетягування файлів)
- [ ] **Image Library** (бібліотека завантажених файлів)
- [ ] **Alt text** (опис для SEO)
- [ ] **CDN інтеграція** (для production)

---

## ⚙️ НАЛАШТУВАННЯ

### Django Settings

**Поточні налаштування:**
```python
# mysite/settings.py
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

**Для production додати:**
```python
# Обмеження розміру
DATA_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB

# Якщо використовуєте CDN
if not DEBUG:
    MEDIA_URL = 'https://cdn.your-domain.com/media/'
```

### Nginx Configuration (Production)

```nginx
location /media/ {
    alias /var/www/flower-shop/media/;
    expires 30d;
    add_header Cache-Control "public, immutable";
    
    # Обмежити типи файлів
    location ~* \.(jpg|jpeg|png|webp)$ {
        # OK
    }
    location ~ /\. {
        deny all;  # Заборонити доступ до прихованих файлів
    }
}
```

---

## 🧪 ТЕСТУВАННЯ

### Перевірити:
1. **Завантаження файлу** в create_color_with_quantities
2. **Завантаження файлу** в додаванні додаткового товару
3. **Заміна файлу** в редагуванні додаткового товару
4. **Превью** показується правильно
5. **Файл зберігається** в media/products/
6. **URL генерується** правильно (/media/products/.../file.jpg)
7. **Зображення відображається** на сайті

### Test checklist:
- [ ] Завантажити JPG < 5MB → ✅
- [ ] Завантажити PNG > 5MB → ❌ Помилка валідації
- [ ] Завантажити WebP → ✅
- [ ] Превью показується → ✅
- [ ] URL поле очищується → ✅
- [ ] Файл з'являється в media/ → ✅
- [ ] Зображення на сайті → ✅

---

## 📞 TROUBLESHOOTING

### Проблема: Файл не завантажується
**Рішення:**
- Перевірте права доступу: `chmod 775 media/products/`
- Перевірте наявність папки: `ls media/products/`
- Перевірте розмір файлу (< 5MB)

### Проблема: Зображення не показується
**Рішення:**
- Перевірте MEDIA_URL в settings.py
- Перевірте чи додано media URL в mysite/urls.py
- Перевірте шлях до файлу в браузері (F12 → Network)

### Проблема: "Permission denied"
**Рішення:**
```bash
sudo chown -R www-data:www-data media/
sudo chmod -R 775 media/
```

---

## ✅ ГОТОВО!

Система завантаження файлів повністю інтегрована та готова до використання!

**Підготовлено:** AI Engineering Lead  
**Дата:** 09.10.2025

