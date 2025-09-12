#!/usr/bin/env python
"""
Автоматичне виправлення найпоширеніших помилок
"""
import os
import sys
import json
import django

# Налаштовуємо Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

from django.conf import settings

def fix_data_json():
    """Виправляємо або створюємо data.json"""
    print("🔧 Перевірка та виправлення data.json...")
    
    data_file = os.path.join(settings.BASE_DIR, 'data.json')
    
    # Базові дані
    default_data = {
        "site_settings": {
            "site_title": "Квітковий магазин",
            "site_description": "Красиві квіти для всіх подій"
        },
        "main_product": {
            "title": "Преміум квіти",
            "description": "Найкращі квіти для ваших особливих моментів",
            "base_price": 2800.00,
            "currency": "грн",
            "add_to_cart_text": "В кошик",
            "show_premium_label": True,
            "premium_label_text": "Преміум товар"
        },
        "color_options": [
            {
                "id": 1,
                "name": "Помаранчевий",
                "hex_code": "#ff8c42",
                "image_url": "https://via.placeholder.com/400x300/ff8c42/ffffff?text=Помаранчевий",
                "is_active": True,
                "order": 1
            }
        ],
        "quantity_options": [
            {"id": 1, "quantity": 21, "is_active": True, "order": 1},
            {"id": 2, "quantity": 51, "is_active": True, "order": 2},
            {"id": 3, "quantity": 101, "is_active": True, "order": 3}
        ],
        "additional_products": [
            {
                "id": 1,
                "title": "Букет квітів",
                "description": "Красивий букет свіжих квітів",
                "price": 1500.00,
                "currency": "грн",
                "image_url": "https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Букет",
                "add_to_cart_text": "Додати в кошик",
                "is_active": True,
                "order": 1
            }
        ],
        "additional_settings": {
            "section_title": "Додаткові товари",
            "add_all_text": "Додати всі",
            "remove_all_text": "Прибрати всі",
            "show_section": True,
            "max_products_per_row": 3
        },
        "contact_info": {
            "phone": "+380 50 123 45 67",
            "email": "info@flowers.com",
            "address": "Київ, Україна",
            "working_hours": "Пн-Пт: 9:00-18:00, Сб: 10:00-16:00",
            "is_active": True
        },
        "services": [
            {
                "id": 1,
                "title": "Швидка доставка",
                "description": "Доставляємо ваші квіти в найкоротші терміни",
                "icon": "truck",
                "is_active": True,
                "order": 1
            },
            {
                "id": 2,
                "title": "Свіжі квіти",
                "description": "Тільки найсвіжіші квіти від перевірених постачальників",
                "icon": "leaf",
                "is_active": True,
                "order": 2
            }
        ],
        "about_section": {
            "title": "Про нас",
            "description": "Ми - команда професіоналів, яка вже більше 10 років займається продажем найкрасивіших квітів. Наша місія - дарувати радість та красу через неперевершені квіткові композиції.",
            "show_section": True
        }
    }
    
    try:
        # Якщо файл існує, перевіряємо його
        if os.path.exists(data_file):
            with open(data_file, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
            
            # Додаємо відсутні секції
            updated = False
            for key, value in default_data.items():
                if key not in existing_data:
                    existing_data[key] = value
                    updated = True
                    print(f"✅ Додано секцію: {key}")
            
            if updated:
                with open(data_file, 'w', encoding='utf-8') as f:
                    json.dump(existing_data, f, ensure_ascii=False, indent=2)
                print("✅ Файл data.json оновлено")
            else:
                print("✅ Файл data.json в порядку")
        else:
            # Створюємо новий файл
            with open(data_file, 'w', encoding='utf-8') as f:
                json.dump(default_data, f, ensure_ascii=False, indent=2)
            print("✅ Створено новий файл data.json")
            
    except Exception as e:
        print(f"❌ Помилка роботи з data.json: {e}")

def fix_sessions_dir():
    """Створюємо директорію для sessions"""
    print("🔧 Перевірка директорії sessions...")
    
    sessions_dir = os.path.join(settings.BASE_DIR, 'sessions')
    
    if not os.path.exists(sessions_dir):
        os.makedirs(sessions_dir)
        print("✅ Створено директорію sessions")
    else:
        print("✅ Директорія sessions існує")

def fix_static_dirs():
    """Перевіряємо статичні директорії"""
    print("🔧 Перевірка статичних директорій...")
    
    static_dirs = [
        os.path.join(settings.BASE_DIR, 'static'),
        os.path.join(settings.BASE_DIR, 'static', 'css'),
        os.path.join(settings.BASE_DIR, 'static', 'js'),
        os.path.join(settings.BASE_DIR, 'static', 'images'),
    ]
    
    for dir_path in static_dirs:
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
            print(f"✅ Створено директорію: {dir_path}")
        else:
            print(f"✅ Директорія існує: {dir_path}")

def check_critical_files():
    """Перевіряємо критичні файли"""
    print("🔧 Перевірка критичних файлів...")
    
    critical_files = [
        'manage.py',
        'mysite/settings.py',
        'mysite/urls.py',
        'main/views.py',
        'admin_panel/views.py',
        'json_manager.py',
        'templates/index.html'
    ]
    
    for file_path in critical_files:
        full_path = os.path.join(settings.BASE_DIR, file_path)
        if os.path.exists(full_path):
            print(f"✅ Файл існує: {file_path}")
        else:
            print(f"❌ КРИТИЧНО! Файл не існує: {file_path}")

def main():
    """Основна функція виправлення"""
    print("🔧 Автоматичне виправлення найпоширеніших помилок")
    print("=" * 60)
    
    fix_data_json()
    fix_sessions_dir()
    fix_static_dirs()
    check_critical_files()
    
    print("=" * 60)
    print("✅ Виправлення завершено!")
    print("Тепер можете запускати:")
    print("  python run_with_diagnosis.py")

if __name__ == "__main__":
    main()
