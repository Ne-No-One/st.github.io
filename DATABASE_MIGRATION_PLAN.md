# 🗄️ План міграції з JSON на базу даних

## 🎯 **Мета міграції**

Перехід з JSON файлу на повноцінну базу даних для:
- Покращення продуктивності
- Підтримки транзакцій
- Можливості складних запитів
- Масштабування системи

---

## 📊 **СТРУКТУРА БАЗИ ДАНИХ**

### **1. Таблиця `site_settings`**
```sql
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    site_title VARCHAR(200) NOT NULL,
    site_description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **2. Таблиця `main_product`**
```sql
CREATE TABLE main_product (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'грн',
    add_to_cart_text VARCHAR(50) DEFAULT 'В кошик',
    show_premium_label BOOLEAN DEFAULT true,
    premium_label_text VARCHAR(100) DEFAULT 'Преміум товар',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **3. Таблиця `color_options`**
```sql
CREATE TABLE color_options (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    hex_code VARCHAR(7) NOT NULL,
    image_url TEXT,
    image_file VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    order_position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **4. Таблиця `quantity_options`**
```sql
CREATE TABLE quantity_options (
    id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    order_position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **5. Таблиця `additional_products`**
```sql
CREATE TABLE additional_products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'грн',
    image_url TEXT,
    image_file VARCHAR(255),
    add_to_cart_text VARCHAR(50) DEFAULT 'Додати в кошик',
    remove_from_cart_text VARCHAR(50) DEFAULT 'Прибрати з кошика',
    is_active BOOLEAN DEFAULT true,
    order_position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **6. Таблиця `additional_products_settings`**
```sql
CREATE TABLE additional_products_settings (
    id SERIAL PRIMARY KEY,
    section_title VARCHAR(200) DEFAULT 'Додаткові товари',
    add_all_text VARCHAR(50) DEFAULT 'Додати всі',
    remove_all_text VARCHAR(50) DEFAULT 'Прибрати всі',
    show_section BOOLEAN DEFAULT true,
    max_products_per_row INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **7. Таблиця `services`**
```sql
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    order_position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **8. Таблиця `contact_info`**
```sql
CREATE TABLE contact_info (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    working_hours TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **9. Таблиця `about_section`**
```sql
CREATE TABLE about_section (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    show_section BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔄 **ЕТАПИ МІГРАЦІЇ**

### **Етап 1: Підготовка**
1. **Створення Django моделей**
   ```python
   # admin_panel/models.py
   
   from django.db import models
   
   class SiteSettings(models.Model):
       site_title = models.CharField(max_length=200)
       site_description = models.TextField()
       created_at = models.DateTimeField(auto_now_add=True)
       updated_at = models.DateTimeField(auto_now=True)
       
       class Meta:
           verbose_name = "Налаштування сайту"
           verbose_name_plural = "Налаштування сайту"
   
   # ... інші моделі
   ```

2. **Оновлення settings.py**
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'flower_shop',
           'USER': 'your_user',
           'PASSWORD': 'your_password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

### **Етап 2: Створення міграцій**
```bash
python manage.py makemigrations admin_panel
python manage.py migrate
```

### **Етап 3: Створення скрипту міграції даних**
```python
# migrate_from_json.py

import json
import os
from django.core.management.base import BaseCommand
from admin_panel.models import *

class Command(BaseCommand):
    help = 'Міграція даних з JSON файлу в базу даних'
    
    def handle(self, *args, **options):
        # Читаємо JSON файл
        with open('data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Міграція налаштувань сайту
        site_settings_data = data.get('site_settings', {})
        SiteSettings.objects.create(**site_settings_data)
        
        # Міграція головного товару
        main_product_data = data.get('main_product', {})
        MainProduct.objects.create(**main_product_data)
        
        # Міграція кольорів
        for color_data in data.get('color_options', []):
            ColorOption.objects.create(**color_data)
        
        # ... інші дані
        
        self.stdout.write('Міграція завершена успішно!')
```

### **Етап 4: Оновлення views**
```python
# main/views.py

from django.shortcuts import render
from admin_panel.models import *

def home(request):
    try:
        site_settings = SiteSettings.objects.first()
        main_product = MainProduct.objects.first()
        color_options = ColorOption.objects.filter(is_active=True).order_by('order_position')
        # ... інші дані
        
        context = {
            'site_settings': site_settings,
            'main_product': main_product,
            'color_options': color_options,
            # ... інші дані
        }
        return render(request, 'index.html', context)
    except Exception as e:
        # Обробка помилок
        pass
```

### **Етап 5: Оновлення адмін панелі**
```python
# admin_panel/views.py

from django.shortcuts import render, redirect
from django.contrib import messages
from .models import *

def site_settings(request):
    settings_obj = SiteSettings.objects.first()
    if not settings_obj:
        settings_obj = SiteSettings.objects.create()
    
    if request.method == 'POST':
        settings_obj.site_title = request.POST.get('site_title')
        settings_obj.site_description = request.POST.get('site_description')
        settings_obj.save()
        messages.success(request, 'Налаштування збережено!')
        return redirect('admin_panel:site_settings')
    
    return render(request, 'admin_panel/site_settings.html', {'settings': settings_obj})
```

---

## 🔧 **ДОДАТКОВІ ПОКРАЩЕННЯ**

### **1. Django Admin інтеграція**
```python
# admin_panel/admin.py

from django.contrib import admin
from .models import *

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['site_title', 'updated_at']
    
@admin.register(ColorOption)
class ColorOptionAdmin(admin.ModelAdmin):
    list_display = ['name', 'hex_code', 'is_active', 'order_position']
    list_filter = ['is_active']
    ordering = ['order_position']
```

### **2. API для мобільного додатку**
```python
# api/serializers.py

from rest_framework import serializers
from admin_panel.models import *

class ColorOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColorOption
        fields = '__all__'

# api/views.py

from rest_framework import viewsets
from .serializers import *

class ColorOptionViewSet(viewsets.ModelViewSet):
    queryset = ColorOption.objects.filter(is_active=True)
    serializer_class = ColorOptionSerializer
```

### **3. Система кешування**
```python
# utils/cache.py

from django.core.cache import cache
from admin_panel.models import *

def get_site_settings():
    settings = cache.get('site_settings')
    if not settings:
        settings = SiteSettings.objects.first()
        cache.set('site_settings', settings, 300)  # 5 хвилин
    return settings
```

### **4. Система логування**
```python
# settings.py

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
        },
    },
    'loggers': {
        'admin_panel': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

---

## 📈 **ПЕРЕВАГИ ПІСЛЯ МІГРАЦІЇ**

### **Продуктивність**:
- Швидші запити до бази даних
- Можливість індексування
- Оптимізовані JOIN запити

### **Функціональність**:
- Транзакції для цілісності даних
- Складні фільтри та пошук
- Реляційні зв'язки між таблицями

### **Масштабування**:
- Підтримка великої кількості записів
- Можливість горизонтального масштабування
- Резервне копіювання

### **Безпека**:
- SQL injection захист
- Права доступу на рівні бази даних
- Аудит змін

---

## 🚀 **ПЛАН ВИКОНАННЯ**

### **Тиждень 1: Підготовка**
- Створення моделей Django
- Налаштування бази даних
- Тестування з'єднання

### **Тиждень 2: Міграція**
- Створення скрипту міграції
- Перенесення даних з JSON
- Тестування цілісності даних

### **Тиждень 3: Оновлення коду**
- Оновлення views та forms
- Тестування функціональності
- Виправлення помилок

### **Тиждень 4: Покращення**
- Оптимізація запитів
- Додавання кешування
- Система логування

---

## 📝 **РЕЗЮМЕ**

Міграція з JSON на базу даних дозволить:
1. **Покращити продуктивність** системи
2. **Додати нову функціональність**
3. **Забезпечити масштабування**
4. **Підвищити безпеку**

JSON файл залишається відмінним рішенням для прототипування та тестування, але база даних необхідна для продакшн системи.
