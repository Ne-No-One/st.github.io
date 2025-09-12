"""
Автоматичні перевірки при запуску Django
"""
import os
import json
import logging
from pathlib import Path
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

logger = logging.getLogger('startup_checks')

class StartupValidator:
    """Клас для валідації системи при запуску"""
    
    def __init__(self):
        self.errors = []
        self.warnings = []
        
    def validate_all(self):
        """Виконуємо всі перевірки"""
        logger.info("🚀 Початок перевірок при запуску Django")
        
        self.check_directories()
        self.check_json_file()
        self.check_static_files()
        self.check_templates()
        self.check_sessions()
        
        if self.errors:
            logger.error(f"❌ Знайдено {len(self.errors)} критичних помилок:")
            for error in self.errors:
                logger.error(f"   - {error}")
            raise ImproperlyConfigured(f"Критичні помилки при запуску: {'; '.join(self.errors)}")
        
        if self.warnings:
            logger.warning(f"⚠️ Знайдено {len(self.warnings)} попереджень:")
            for warning in self.warnings:
                logger.warning(f"   - {warning}")
        
        logger.info("✅ Всі перевірки при запуску пройшли успішно!")
        
    def check_directories(self):
        """Перевіряємо та створюємо необхідні директорії"""
        logger.info("📁 Перевірка директорій...")
        
        required_dirs = [
            settings.BASE_DIR / 'static',
            settings.BASE_DIR / 'static' / 'css',
            settings.BASE_DIR / 'static' / 'js', 
            settings.BASE_DIR / 'static' / 'images',
            settings.BASE_DIR / 'templates',
            settings.BASE_DIR / 'templates' / 'admin_panel',
            settings.BASE_DIR / 'sessions',
        ]
        
        for dir_path in required_dirs:
            if not dir_path.exists():
                try:
                    dir_path.mkdir(parents=True, exist_ok=True)
                    logger.info(f"✅ Створено директорію: {dir_path}")
                except Exception as e:
                    self.errors.append(f"Не вдалося створити директорію {dir_path}: {e}")
            else:
                logger.debug(f"✅ Директорія існує: {dir_path}")
                
    def check_json_file(self):
        """Перевіряємо та створюємо JSON файл з даними"""
        logger.info("📄 Перевірка JSON файлу...")
        
        json_file = settings.BASE_DIR / 'data.json'
        
        if not json_file.exists():
            logger.warning("⚠️ Файл data.json не існує, створюємо...")
            self.create_default_json(json_file)
        else:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                # Перевіряємо обов'язкові секції
                required_sections = [
                    'site_settings', 'main_product', 'color_options', 
                    'quantity_options', 'additional_products', 'additional_settings',
                    'contact_info', 'services', 'about_section'
                ]
                
                missing_sections = []
                for section in required_sections:
                    if section not in data:
                        missing_sections.append(section)
                
                if missing_sections:
                    self.warnings.append(f"Відсутні секції в JSON: {', '.join(missing_sections)}")
                    # Додаємо відсутні секції
                    self.add_missing_sections(json_file, data, missing_sections)
                else:
                    logger.info("✅ JSON файл має всі необхідні секції")
                    
            except json.JSONDecodeError as e:
                self.errors.append(f"Некоректний JSON файл: {e}")
            except Exception as e:
                self.errors.append(f"Помилка читання JSON файлу: {e}")
                
    def create_default_json(self, json_file):
        """Створюємо JSON файл з базовими даними"""
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
                "description": "Ми - команда професіоналів, яка вже більше 10 років займається продажем найкрасивіших квітів.",
                "show_section": True
            }
        }
        
        try:
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(default_data, f, ensure_ascii=False, indent=2)
            logger.info("✅ Створено базовий JSON файл")
        except Exception as e:
            self.errors.append(f"Не вдалося створити JSON файл: {e}")
            
    def add_missing_sections(self, json_file, data, missing_sections):
        """Додаємо відсутні секції в JSON"""
        # Тут можна додати логіку для кожної секції
        logger.info(f"Додаємо відсутні секції: {', '.join(missing_sections)}")
        
    def check_static_files(self):
        """Перевіряємо статичні файли"""
        logger.info("🎨 Перевірка статичних файлів...")
        
        static_files = [
            settings.BASE_DIR / 'static' / 'css' / 'style.css',
            settings.BASE_DIR / 'static' / 'js' / 'main.js'
        ]
        
        for file_path in static_files:
            if not file_path.exists():
                self.warnings.append(f"Статичний файл не існує: {file_path}")
            else:
                logger.debug(f"✅ Статичний файл існує: {file_path}")
                
    def check_templates(self):
        """Перевіряємо шаблони"""
        logger.info("📋 Перевірка шаблонів...")
        
        required_templates = [
            settings.BASE_DIR / 'templates' / 'index.html',
            settings.BASE_DIR / 'templates' / 'admin_panel' / 'base.html',
            settings.BASE_DIR / 'templates' / 'admin_panel' / 'dashboard.html'
        ]
        
        for template_path in required_templates:
            if not template_path.exists():
                self.errors.append(f"Критичний шаблон не існує: {template_path}")
            else:
                logger.debug(f"✅ Шаблон існує: {template_path}")
                
    def check_sessions(self):
        """Перевіряємо налаштування sessions"""
        logger.info("🔐 Перевірка sessions...")
        
        if hasattr(settings, 'SESSION_FILE_PATH'):
            session_path = Path(settings.SESSION_FILE_PATH)
            if not session_path.exists():
                try:
                    session_path.mkdir(parents=True, exist_ok=True)
                    logger.info(f"✅ Створено директорію sessions: {session_path}")
                except Exception as e:
                    self.errors.append(f"Не вдалося створити директорію sessions: {e}")
            else:
                logger.debug(f"✅ Директорія sessions існує: {session_path}")

# Глобальний екземпляр валідатора
startup_validator = StartupValidator()

def run_startup_checks():
    """Запускаємо перевірки при старті"""
    try:
        startup_validator.validate_all()
        return True
    except Exception as e:
        logger.error(f"❌ Критична помилка при запуску: {e}")
        return False
