#!/usr/bin/env python
"""
Валідатор системи
"""
import os
import sys
import json
import django

# Налаштовуємо Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

import logging
from django.conf import settings

# Налаштовуємо логування
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def validate_json_file():
    """Валідуємо JSON файл"""
    logger.info("🔍 Валідація JSON файлу...")
    
    data_file = os.path.join(settings.BASE_DIR, 'data.json')
    
    # Перевіряємо існування файлу
    if not os.path.exists(data_file):
        logger.error(f"❌ Файл {data_file} не існує")
        return False
    
    try:
        # Читаємо JSON
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        logger.info("✅ JSON файл валідний")
        
        # Перевіряємо обов'язкові секції
        required_sections = [
            'site_settings',
            'main_product', 
            'color_options',
            'quantity_options',
            'additional_products',
            'additional_settings',
            'contact_info',
            'services',
            'about_section'
        ]
        
        for section in required_sections:
            if section in data:
                logger.info(f"✅ Секція '{section}' присутня")
            else:
                logger.warning(f"⚠️ Секція '{section}' відсутня")
        
        # Перевіряємо site_settings
        if 'site_settings' in data:
            site_settings = data['site_settings']
            if 'site_title' in site_settings and 'site_description' in site_settings:
                logger.info("✅ site_settings має всі обов'язкові поля")
            else:
                logger.error("❌ site_settings не має обов'язкових полів")
        
        return True
        
    except json.JSONDecodeError as e:
        logger.error(f"❌ Помилка парсингу JSON: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Помилка валідації: {e}")
        return False

def validate_templates():
    """Валідуємо шаблони"""
    logger.info("🔍 Валідація шаблонів...")
    
    templates_dir = os.path.join(settings.BASE_DIR, 'templates')
    
    # Основні шаблони
    main_templates = [
        'index.html',
        'base.html',
        'header.html'
    ]
    
    for template in main_templates:
        template_path = os.path.join(templates_dir, template)
        if os.path.exists(template_path):
            logger.info(f"✅ Шаблон {template} існує")
        else:
            logger.warning(f"⚠️ Шаблон {template} не існує")
    
    # Шаблони адмін панелі
    admin_templates_dir = os.path.join(templates_dir, 'admin_panel')
    admin_templates = [
        'base.html',
        'dashboard.html',
        'site_settings.html',
        'main_product_settings.html',
        'color_options.html',
        'quantity_options.html',
        'additional_products.html',
        'services.html',
        'contact_info.html',
        'about_section.html'
    ]
    
    for template in admin_templates:
        template_path = os.path.join(admin_templates_dir, template)
        if os.path.exists(template_path):
            logger.info(f"✅ Адмін шаблон {template} існує")
        else:
            logger.error(f"❌ Адмін шаблон {template} не існує")

def validate_static_files():
    """Валідуємо статичні файли"""
    logger.info("🔍 Валідація статичних файлів...")
    
    static_dir = os.path.join(settings.BASE_DIR, 'static')
    
    static_files = [
        'css/style.css',
        'js/main.js'
    ]
    
    for static_file in static_files:
        file_path = os.path.join(static_dir, static_file)
        if os.path.exists(file_path):
            logger.info(f"✅ Статичний файл {static_file} існує")
        else:
            logger.error(f"❌ Статичний файл {static_file} не існує")

def validate_json_manager():
    """Валідуємо JSONManager"""
    logger.info("🔍 Валідація JSONManager...")
    
    try:
        from json_manager import JSONManager
        logger.info("✅ JSONManager імпортується")
        
        json_manager = JSONManager()
        logger.info("✅ JSONManager створюється")
        
        # Тестуємо основні методи
        site_settings = json_manager.get_site_settings()
        logger.info(f"✅ get_site_settings працює: {site_settings}")
        
        main_product = json_manager.get_main_product()
        logger.info(f"✅ get_main_product працює: {main_product}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Помилка JSONManager: {e}")
        return False

def validate_views():
    """Валідуємо views"""
    logger.info("🔍 Валідація views...")
    
    try:
        from django.test import Client
        client = Client()
        
        # Тестуємо головну сторінку
        response = client.get('/')
        if response.status_code == 200:
            logger.info("✅ Головна сторінка працює")
        else:
            logger.error(f"❌ Головна сторінка: статус {response.status_code}")
        
        # Тестуємо адмін панель
        response = client.get('/admin-panel/')
        if response.status_code == 200:
            logger.info("✅ Адмін панель працює")
        else:
            logger.error(f"❌ Адмін панель: статус {response.status_code}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Помилка тестування views: {e}")
        return False

def main():
    """Основна функція валідації"""
    logger.info("🚀 Початок валідації системи")
    
    all_ok = True
    
    # Валідуємо компоненти
    if not validate_json_file():
        all_ok = False
    
    validate_templates()
    validate_static_files()
    
    if not validate_json_manager():
        all_ok = False
    
    if not validate_views():
        all_ok = False
    
    if all_ok:
        logger.info("🎉 Всі перевірки пройшли успішно!")
    else:
        logger.error("❌ Деякі перевірки провалилися")
    
    return all_ok

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
