"""
Management команда для налаштування системи
"""
from django.core.management.base import BaseCommand
from django.conf import settings
import os
import json

class Command(BaseCommand):
    help = 'Налаштування системи з нуля'
    
    def handle(self, *args, **options):
        self.stdout.write("🔧 Налаштування системи...")
        
        # Створюємо базові директорії
        self.create_directories()
        
        # Створюємо JSON файл
        self.create_json_file()
        
        # Створюємо базові статичні файли
        self.create_static_files()
        
        self.stdout.write(
            self.style.SUCCESS('✅ Система налаштована!')
        )
        
    def create_directories(self):
        """Створюємо необхідні директорії"""
        self.stdout.write("📁 Створення директорій...")
        
        dirs = [
            'static', 'static/css', 'static/js', 'static/images',
            'templates', 'templates/admin_panel', 'sessions'
        ]
        
        for dir_name in dirs:
            dir_path = os.path.join(settings.BASE_DIR, dir_name)
            os.makedirs(dir_path, exist_ok=True)
            self.stdout.write(f"   ✅ {dir_name}")
            
    def create_json_file(self):
        """Створюємо базовий JSON файл"""
        self.stdout.write("📄 Створення JSON файлу...")
        
        json_file = os.path.join(settings.BASE_DIR, 'data.json')
        
        if os.path.exists(json_file):
            self.stdout.write("   ⚠️ JSON файл вже існує")
            return
            
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
            "color_options": [],
            "quantity_options": [],
            "additional_products": [],
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
                "working_hours": "Пн-Пт: 9:00-18:00",
                "is_active": True
            },
            "services": [],
            "about_section": {
                "title": "Про нас",
                "description": "Про нашу компанію",
                "show_section": True
            }
        }
        
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(default_data, f, ensure_ascii=False, indent=2)
            
        self.stdout.write("   ✅ JSON файл створено")
        
    def create_static_files(self):
        """Створюємо базові статичні файли якщо їх немає"""
        self.stdout.write("🎨 Перевірка статичних файлів...")
        
        # CSS файл
        css_file = os.path.join(settings.BASE_DIR, 'static', 'css', 'style.css')
        if not os.path.exists(css_file):
            with open(css_file, 'w', encoding='utf-8') as f:
                f.write("/* Базові стилі */\nbody { font-family: Arial, sans-serif; }\n")
            self.stdout.write("   ✅ Створено style.css")
        
        # JS файл  
        js_file = os.path.join(settings.BASE_DIR, 'static', 'js', 'main.js')
        if not os.path.exists(js_file):
            with open(js_file, 'w', encoding='utf-8') as f:
                f.write("// Основний JavaScript файл\nconsole.log('Сайт завантажено');\n")
            self.stdout.write("   ✅ Створено main.js")
