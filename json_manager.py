#!/usr/bin/env python
"""
Менеджер для роботи з JSON файлом
"""
import json
import os
import logging
from datetime import datetime
from django.conf import settings

# Налаштування логера
logger = logging.getLogger('json_manager')

class JSONManager:
    """Клас для управління JSON файлом з даними"""
    
    # Кеш для даних щоб не читати файл кожного разу
    _cache = None
    _cache_timestamp = None
    _cache_duration = 5  # Кеш на 5 секунд
    
    def __init__(self):
        # Видалено зайве логування для оптимізації
        try:
            self.data_file = os.path.join(settings.BASE_DIR, 'data.json')
            self._ensure_data_file()
        except Exception as e:
            logger.error(f"❌ Помилка ініціалізації JSONManager: {e}")
            raise
    
    def _ensure_data_file(self):
        """Перевіряємо чи існує файл даних, якщо ні - створюємо"""
        if not os.path.exists(self.data_file):
            logger.warning("⚠️ Файл даних не існує, створюємо новий")
            default_data = {
                "site_settings": {
                    "site_title": "Квітковий магазин",
                    "site_description": "Красиві квіти для всіх подій",
                    "cart_button_text": "В кошик",
                    "remove_from_cart_text": "З кошика",
                    "show_services_section": True,
                    "show_contact_section": True,
                    "show_about_section": True
                },
                "main_product": {
                    "title": "Преміум квіти",
                    "description": "Найкращі квіти для ваших особливих моментів",
                    "base_price": 2800,
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
                        "image_url": "",
                        "is_active": True,
                        "order": 1
                    },
                    {
                        "id": 2,
                        "name": "Блакитний", 
                        "hex_code": "#4ecdc4",
                        "image_url": "",
                        "is_active": True,
                        "order": 2
                    }
                ],
                "quantity_options": [
                    {
                        "id": 1,
                        "quantity": 21,
                        "is_active": True,
                        "order": 1
                    },
                    {
                        "id": 2,
                        "quantity": 51,
                        "is_active": True,
                        "order": 2
                    }
                ],
                "additional_products": [
                    {
                        "id": 1,
                        "title": "Букет квітів",
                        "description": "Красивий букет свіжих квітів",
                        "price": 1500,
                        "currency": "грн",
                        "image_url": "",
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
                    "email": "info@example.com",
                    "address": "Київ, Україна",
                    "working_hours": "Пн-Пт: 9:00-18:00, Сб: 10:00-16:00",
                    "is_active": True
                },
                "services": [
                    {
                        "id": 1,
                        "title": "Швидка доставка",
                        "description": "Доставляємо ваші квіти в найкоротші терміни по всьому місту",
                        "icon": "truck",
                        "is_active": True,
                        "order": 1
                    }
                ],
                "about_section": {
                    "title": "Про нас",
                    "description": "Ми - команда професіоналів, які створюють красиві квіти для ваших особливих моментів.",
                    "show_section": True
                }
            }
            self.save_data(default_data)
    
    def load_data(self):
        """Завантажуємо дані з JSON файлу з кешуванням"""
        # Перевіряємо кеш
        import time
        current_time = time.time()
        
        if (JSONManager._cache is not None and 
            JSONManager._cache_timestamp is not None and 
            (current_time - JSONManager._cache_timestamp) < JSONManager._cache_duration):
            # Використовуємо кешовані дані
            return JSONManager._cache
        
        # Завантажуємо дані з файлу (без зайвого логування)
        try:
            if not os.path.exists(self.data_file):
                logger.error(f"❌ Файл {self.data_file} не існує")
                return {}
            
            with open(self.data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # Оновлюємо кеш
                JSONManager._cache = data
                JSONManager._cache_timestamp = current_time
                # Логуємо тільки якщо це перше завантаження
                if JSONManager._cache_timestamp == current_time:
                    logger.debug(f"✅ Дані завантажено, розмір: {len(str(data))} символів")
                return data
        except json.JSONDecodeError as e:
            logger.error(f"❌ Помилка парсингу JSON: {e}")
            return {}
        except Exception as e:
            logger.error(f"❌ Помилка завантаження даних: {e}")
            return {}
    
    def save_data(self, data):
        """Зберігаємо дані в JSON файл"""
        # Очищаємо кеш при збереженні
        JSONManager._cache = None
        JSONManager._cache_timestamp = None
        logger.info("💾 Збереження даних в JSON файл")
        try:
            # Перевіряємо валідність даних
            if not isinstance(data, dict):
                logger.error("❌ Дані повинні бути словником")
                return False
            
            # Створюємо резервну копію
            backup_file = self.data_file + '.backup'
            if os.path.exists(self.data_file):
                import shutil
                shutil.copy2(self.data_file, backup_file)
                logger.info(f"📦 Створено резервну копію: {backup_file}")
            
            with open(self.data_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            logger.info(f"✅ Дані збережено успішно, розмір: {len(str(data))} символів")
            return True
        except Exception as e:
            logger.error(f"❌ Помилка збереження даних: {e}")
            return False
    
    def get_site_settings(self):
        """Отримуємо налаштування сайту"""
        # Видалено зайве логування для оптимізації
        try:
            data = self.load_data()
            settings = data.get('site_settings', {})
            
            # Забезпечуємо дефолтні значення для секцій тільки якщо вони відсутні
            if 'show_services_section' not in settings:
                settings['show_services_section'] = True
            if 'show_contact_section' not in settings:
                settings['show_contact_section'] = True
            if 'show_about_section' not in settings:
                settings['show_about_section'] = True
            
            return settings
        except Exception as e:
            logger.error(f"❌ Помилка отримання налаштувань сайту: {e}")
            return {}
    
    def update_site_settings(self, **kwargs):
        """Оновлюємо налаштування сайту"""
        data = self.load_data()
        if 'site_settings' not in data:
            data['site_settings'] = {}
        
        # Забезпечуємо наявність дефолтних значень для секцій
        if 'show_services_section' not in data['site_settings']:
            data['site_settings']['show_services_section'] = True
        if 'show_contact_section' not in data['site_settings']:
            data['site_settings']['show_contact_section'] = True
        if 'show_about_section' not in data['site_settings']:
            data['site_settings']['show_about_section'] = True
        
        data['site_settings'].update(kwargs)
        return self.save_data(data)
    
    def get_main_product(self):
        """Отримуємо головний товар"""
        data = self.load_data()
        return data.get('main_product', {})
    
    def update_main_product(self, **kwargs):
        """Оновлюємо головний товар"""
        data = self.load_data()
        if 'main_product' not in data:
            data['main_product'] = {}
        data['main_product'].update(kwargs)
        return self.save_data(data)
    
    def get_color_options(self):
        """Отримуємо кольори"""
        data = self.load_data()
        return data.get('color_options', [])
    
    def update_color_options(self, color_options):
        """Оновлюємо всі кольори (для масового оновлення, наприклад порядку)"""
        data = self.load_data()
        data['color_options'] = color_options
        return self.save_data(data)
    
    def add_color_option(self, name, hex_code, image_url="", order=None):
        """Додаємо новий колір (старий метод для зворотної сумісності)"""
        data = self.load_data()
        colors = data.get('color_options', [])
        new_id = max([c.get('id', 0) for c in colors], default=0) + 1
        if order is None:
            order = len(colors) + 1
        new_color = {
            'id': new_id,
            'name': name,
            'hex_code': hex_code,
            'image_url': image_url,
            'is_active': True,
            'order': order
        }
        colors.append(new_color)
        data['color_options'] = colors
        return self.save_data(data)
    
    def add_color_option_with_layers(self, name, hex_code, image_url, order=None, packaging_texture_url=None, mask_image_url=None, flowers_image_url=None):
        """Додаємо новий колір (спрощена версія без шарів)"""
        data = self.load_data()
        colors = data.get('color_options', [])
        new_id = max([c.get('id', 0) for c in colors], default=0) + 1
        if order is None:
            order = len(colors) + 1
        
        new_color = {
            'id': new_id,
            'name': name,
            'hex_code': hex_code,
            'image_url': image_url,
            'is_active': True,
            'in_stock': True,  # Новий статус наявності
            'order': order,
            'quantity_images': {}  # Структура для фото по кількостях
        }
        colors.append(new_color)
        data['color_options'] = colors
        return self.save_data(data)
    
    def update_color_option(self, color_id, name, hex_code, image_url=""):
        """Оновлюємо колір/варіант товару (старий метод для зворотної сумісності)"""
        data = self.load_data()
        colors = data.get('color_options', [])
        for color in colors:
            if color.get('id') == color_id:
                color.update({
                    'name': name,
                    'hex_code': hex_code,
                    'image_url': image_url
                })
                break
        data['color_options'] = colors
        return self.save_data(data)
    
    def update_color_option_with_layers(self, color_id, name, hex_code, image_url, is_active=True, in_stock=True, packaging_texture_url=None, mask_image_url=None, flowers_image_url=None):
        """Оновлюємо колір (спрощена версія без шарів)"""
        data = self.load_data()
        colors = data.get('color_options', [])
        for color in colors:
            if color.get('id') == color_id:
                # Оновлюємо основні поля
                color.update({
                    'name': name,
                    'hex_code': hex_code,
                    'image_url': image_url,
                    'is_active': is_active,
                    'in_stock': in_stock
                })
                # Додаємо quantity_images якщо його немає
                if 'quantity_images' not in color:
                    color['quantity_images'] = {}
                break
        data['color_options'] = colors
        return self.save_data(data)
    
    def delete_color_option(self, color_id):
        """Видаляємо колір/варіант товару"""
        data = self.load_data()
        colors = data.get('color_options', [])
        data['color_options'] = [c for c in colors if c.get('id') != color_id]
        return self.save_data(data)
    
    def add_quantity_image_for_color(self, color_id, quantity, image_url, is_active=True, in_stock=True, zoom=100, zoom_desktop=None, zoom_mobile=None):
        """Додаємо фото для конкретної кількості кольору з статусами та zoom"""
        # Зворотна сумісність
        if zoom_desktop is None:
            zoom_desktop = zoom
        if zoom_mobile is None:
            zoom_mobile = zoom
            
        print(f"🖼️ add_quantity_image: color={color_id}, qty={quantity}, active={is_active}, stock={in_stock}, zoom_desktop={zoom_desktop}%, zoom_mobile={zoom_mobile}%")
        data = self.load_data()
        colors = data.get('color_options', [])
        found = False
        for color in colors:
            if color.get('id') == color_id:
                if 'quantity_images' not in color:
                    color['quantity_images'] = {}
                if 'quantity_statuses' not in color:
                    color['quantity_statuses'] = {}
                if 'quantity_zoom_desktop' not in color:
                    color['quantity_zoom_desktop'] = {}
                if 'quantity_zoom_mobile' not in color:
                    color['quantity_zoom_mobile'] = {}
                
                # URL як простий рядок
                color['quantity_images'][str(quantity)] = image_url
                
                # Статуси в окремому полі
                color['quantity_statuses'][str(quantity)] = {
                    'is_active': is_active,
                    'in_stock': in_stock
                }
                
                # Zoom окремо для desktop та mobile
                color['quantity_zoom_desktop'][str(quantity)] = zoom_desktop
                color['quantity_zoom_mobile'][str(quantity)] = zoom_mobile
                
                print(f"✅ Додано: qty={quantity}, zoom_desktop={zoom_desktop}%, zoom_mobile={zoom_mobile}%")
                found = True
                break
        
        if not found:
            print(f"❌ ПОМИЛКА: Колір з ID {color_id} не знайдено!")
            return False
            
        data['color_options'] = colors
        result = self.save_data(data)
        print(f"💾 Результат збереження: {result}")
        return result
    
    def update_quantity_image_for_color(self, color_id, quantity, image_url, is_active=True, in_stock=True, zoom=100, zoom_desktop=None, zoom_mobile=None):
        """Оновлюємо фото для конкретної кількості кольору з статусами та zoom"""
        return self.add_quantity_image_for_color(color_id, quantity, image_url, is_active, in_stock, zoom, zoom_desktop, zoom_mobile)
    
    def delete_quantity_image_for_color(self, color_id, quantity):
        """Видаляємо фото для конкретної кількості кольору"""
        data = self.load_data()
        colors = data.get('color_options', [])
        
        for color in colors:
            if color.get('id') == color_id:
                if 'quantity_images' in color and str(quantity) in color['quantity_images']:
                    del color['quantity_images'][str(quantity)]
                    data['color_options'] = colors
                    return self.save_data(data)
                else:
                    return False
        
        return False
    
    def get_quantity_image_for_color(self, color_id, quantity):
        """Отримуємо фото для конкретної кількості кольору"""
        colors = self.get_color_options()
        for color in colors:
            if color.get('id') == color_id:
                quantity_images = color.get('quantity_images', {})
                return quantity_images.get(str(quantity), color.get('image_url', ''))
        return ''
    
    def get_default_image_for_color(self, color_id):
        """Отримуємо фото за замовчуванням для кольору (з найбільшою кількістю)"""
        colors = self.get_color_options()
        for color in colors:
            if color.get('id') == color_id:
                quantity_images = color.get('quantity_images', {})
                if quantity_images:
                    # Знаходимо кількість з найбільшим значенням
                    max_quantity = max(quantity_images.keys(), key=lambda x: int(x))
                    return quantity_images[max_quantity]
                else:
                    return color.get('image_url', '')
        return ''
    
    def add_color_with_quantities(self, name, hex_code, image_url="", order=None, quantities_data=None, is_active=True, in_stock=True):
        """Додаємо новий колір з кількостями та фото"""
        data = self.load_data()
        colors = data.get('color_options', [])
        new_id = max([c.get('id', 0) for c in colors], default=0) + 1
        if order is None:
            order = len(colors) + 1
        
        # Створюємо колір
        new_color = {
            'id': new_id,
            'name': name,
            'hex_code': hex_code,
            'image_url': image_url,
            'is_active': is_active,
            'in_stock': in_stock,
            'order': order,
            'quantity_images': {},  # Завжди прості URL
            'quantity_statuses': {}  # Статуси окремо
        }
        
        # Ініціалізуємо quantity_zoom якщо його немає
        if 'quantity_zoom' not in new_color:
            new_color['quantity_zoom'] = {}
        
        # Додаємо фото та статуси для кількостей
        if quantities_data:
            for qty_data in quantities_data:
                quantity = qty_data.get('quantity')
                image_url = qty_data.get('image_url')
                qty_active = qty_data.get('is_active', True)
                qty_stock = qty_data.get('in_stock', True)
                qty_zoom = qty_data.get('zoom', 100)
                
                if quantity and image_url:
                    # URL як простий рядок
                    new_color['quantity_images'][str(quantity)] = image_url
                    # Статуси окремо
                    new_color['quantity_statuses'][str(quantity)] = {
                        'is_active': qty_active,
                        'in_stock': qty_stock
                    }
                    # Zoom окремо
                    new_color['quantity_zoom'][str(quantity)] = qty_zoom
        
        colors.append(new_color)
        data['color_options'] = colors
        return self.save_data(data)
    
    def get_quantity_options(self):
        """Отримуємо варіанти кількості"""
        data = self.load_data()
        return data.get('quantity_options', [])
    
    def add_quantity_option(self, quantity):
        """Додаємо новий варіант кількості (старий метод)"""
        data = self.load_data()
        quantities = data.get('quantity_options', [])
        new_id = max([q.get('id', 0) for q in quantities], default=0) + 1
        new_quantity = {
            'id': new_id,
            'quantity': quantity,
            'is_active': True,
            'order': len(quantities) + 1
        }
        quantities.append(new_quantity)
        data['quantity_options'] = quantities
        return self.save_data(data)
    
    def add_quantity_option_with_price(self, quantity, price_per_unit, order=None):
        """Додаємо новий варіант кількості з ціною за одиницю"""
        print(f"🔧 add_quantity_option_with_price: quantity={quantity}, price_per_unit={price_per_unit}, order={order}")
        data = self.load_data()
        quantities = data.get('quantity_options', [])
        print(f"📊 Поточні кількості: {len(quantities)}")
        
        new_id = max([q.get('id', 0) for q in quantities], default=0) + 1
        if order is None:
            order = len(quantities) + 1
        
        new_quantity = {
            'id': new_id,
            'quantity': quantity,
            'price_per_unit': price_per_unit,
            'is_active': True,
            'in_stock': True,  # Новий статус наявності
            'order': order
        }
        print(f"📦 Новий варіант: {new_quantity}")
        
        quantities.append(new_quantity)
        data['quantity_options'] = quantities
        result = self.save_data(data)
        print(f"💾 Результат збереження: {result}")
        return result
    
    def update_quantity_option(self, quantity_id, quantity, price_per_unit, is_active, in_stock=True):
        """Оновлюємо варіант кількості"""
        data = self.load_data()
        quantities = data.get('quantity_options', [])
        for qty in quantities:
            if qty.get('id') == quantity_id:
                qty.update({
                    'quantity': quantity,
                    'price_per_unit': price_per_unit,
                    'is_active': is_active,
                    'in_stock': in_stock
                })
                break
        data['quantity_options'] = quantities
        return self.save_data(data)
    
    def delete_quantity_option(self, quantity_id):
        """Видаляємо варіант кількості"""
        data = self.load_data()
        quantities = data.get('quantity_options', [])
        data['quantity_options'] = [q for q in quantities if q.get('id') != quantity_id]
        return self.save_data(data)
    
    def get_additional_products(self):
        """Отримуємо додаткові товари"""
        data = self.load_data()
        return data.get('additional_products', [])
    
    def add_additional_product(self, title, description, price, currency, image_url="", category="", add_to_cart_text="Додати в кошик", is_active=True, in_stock=True):
        """Додаємо новий додатковий товар"""
        data = self.load_data()
        products = data.get('additional_products', [])
        new_id = max([p.get('id', 0) for p in products], default=0) + 1
        new_product = {
            'id': new_id,
            'title': title,
            'description': description,
            'price': price,
            'currency': currency,
            'image_url': image_url,
            'category': category if category else '',
            'add_to_cart_text': add_to_cart_text,
            'is_active': is_active,
            'in_stock': in_stock,
            'order': len(products) + 1
        }
        products.append(new_product)
        data['additional_products'] = products
        return self.save_data(data)
    
    def update_additional_product(self, product_id, title, description, price, currency, image_url="", order=None, category="", is_active=None, in_stock=None):
        """Оновлюємо додатковий товар"""
        data = self.load_data()
        products = data.get('additional_products', [])
        for product in products:
            if product.get('id') == product_id:
                update_data = {
                    'title': title,
                    'description': description,
                    'price': price,
                    'currency': currency,
                    'image_url': image_url,
                    'add_to_cart_text': 'Додати в кошик'
                }
                if order is not None:
                    update_data['order'] = order
                if category is not None:
                    update_data['category'] = category
                if is_active is not None:
                    update_data['is_active'] = is_active
                if in_stock is not None:
                    update_data['in_stock'] = in_stock
                product.update(update_data)
                break
        data['additional_products'] = products
        return self.save_data(data)
    
    def delete_additional_product(self, product_id):
        """Видаляємо додатковий товар"""
        data = self.load_data()
        products = data.get('additional_products', [])
        data['additional_products'] = [p for p in products if p.get('id') != product_id]
        return self.save_data(data)
    
    def get_services(self):
        """Отримуємо послуги"""
        data = self.load_data()
        return data.get('services', [])
    
    def add_service(self, title, description, icon):
        """Додаємо нову послугу"""
        data = self.load_data()
        services = data.get('services', [])
        new_id = max([s.get('id', 0) for s in services], default=0) + 1
        new_service = {
            'id': new_id,
            'title': title,
            'description': description,
            'icon': icon,
            'is_active': True,
            'order': len(services) + 1
        }
        services.append(new_service)
        data['services'] = services
        return self.save_data(data)
    
    def get_contact_info(self):
        """Отримуємо контактну інформацію"""
        data = self.load_data()
        return data.get('contact_info', {})
    
    def update_contact_info(self, phone, email, address, working_hours):
        """Оновлюємо контактну інформацію"""
        data = self.load_data()
        data['contact_info'] = {
            'phone': phone,
            'email': email,
            'address': address,
            'working_hours': working_hours,
            'is_active': True
        }
        return self.save_data(data)
    
    def get_about_section(self):
        """Отримуємо секцію 'Про нас'"""
        data = self.load_data()
        return data.get('about_section', {})
    
    def update_about_section(self, title, description, show_section=True):
        """Оновлюємо секцію 'Про нас'"""
        data = self.load_data()
        data['about_section'] = {
            'title': title,
            'description': description,
            'show_section': show_section
        }
        return self.save_data(data)
    
    def update_additional_settings(self, **kwargs):
        """Оновлюємо додаткові налаштування"""
        data = self.load_data()
        if 'additional_settings' not in data:
            data['additional_settings'] = {}
        data['additional_settings'].update(kwargs)
        return self.save_data(data)
    
    # ===== ORDERS MANAGEMENT =====
    
    def get_orders(self):
        """Отримуємо всі замовлення"""
        # Видалено зайве логування для оптимізації
        data = self.load_data()
        orders = data.get('orders', [])
        # Сортуємо за датою замовлення (новіші спочатку)
        orders.sort(key=lambda x: x.get('order_date', ''), reverse=True)
        return orders
    
    def get_order_by_id(self, order_id):
        """Отримуємо замовлення за ID"""
        # Видалено зайве логування для оптимізації
        orders = self.get_orders()
        for order in orders:
            # Порівнюємо як string, бо ID може бути UUID
            if str(order.get('id')) == str(order_id):
                return order
        return None
    
    def update_order_status(self, order_id, new_status):
        """Оновлюємо статус замовлення"""
        logger.info(f"🔄 Оновлення статусу замовлення {order_id} на '{new_status}'")
        data = self.load_data()
        orders = data.get('orders', [])
        
        for order in orders:
            if str(order.get('id')) == str(order_id):
                order['status'] = new_status
                logger.info(f"✅ Статус замовлення {order.get('order_number')} оновлено")
                return self.save_data(data)
        
        logger.error(f"❌ Замовлення з ID {order_id} не знайдено")
        return False
    
    def update_order_payment_status(self, order_id, payment_status):
        """Оновлюємо статус платежу замовлення"""
        logger.info(f"💳 Оновлення статусу платежу замовлення {order_id} на '{payment_status}'")
        data = self.load_data()
        orders = data.get('orders', [])
        
        for order in orders:
            if str(order.get('id')) == str(order_id):
                order['payment_status'] = payment_status
                order['updated_at'] = datetime.now().isoformat()
                logger.info(f"✅ Статус платежу замовлення {order.get('order_number')} оновлено на '{payment_status}'")
                return self.save_data(data)
        
        logger.error(f"❌ Замовлення з ID {order_id} не знайдено")
        return False
    
    def get_orders_by_status(self, status):
        """Отримуємо замовлення за статусом"""
        # Видалено зайве логування для оптимізації
        orders = self.get_orders()
        filtered_orders = [order for order in orders if order.get('status') == status]
        return filtered_orders
    
    def save_order(self, order_data):
        """Зберігаємо замовлення"""
        logger.info(f"💾 Збереження замовлення: {order_data.get('order_number', 'Unknown')}")
        try:
            data = self.load_data()
            
            # Ініціалізуємо список замовлень якщо його немає
            if 'orders' not in data:
                data['orders'] = []
            
            # Додаємо замовлення
            data['orders'].append(order_data)
            
            # Зберігаємо дані
            self.save_data(data)
            
            logger.info(f"✅ Замовлення {order_data.get('order_number')} успішно збережено")
            return True
            
        except Exception as e:
            logger.error(f"❌ Помилка збереження замовлення: {e}")
            return False
    
    # ===== CUSTOMERS MANAGEMENT =====
    
    def get_customers(self):
        """Отримуємо всіх клієнтів"""
        # Видалено зайве логування для оптимізації
        data = self.load_data()
        customers = data.get('customers', [])
        # Сортуємо за загальною сумою покупок (VIP спочатку)
        customers.sort(key=lambda x: x.get('total_spent', 0), reverse=True)
        return customers
    
    def get_customer_by_id(self, customer_id):
        """Отримуємо клієнта за ID"""
        # Видалено зайве логування для оптимізації
        customers = self.get_customers()
        for customer in customers:
            if customer.get('id') == int(customer_id):
                return customer
        return None
    
    def add_customer(self, customer_data):
        """Додаємо нового клієнта"""
        logger.info(f"➕ Додавання нового клієнта: {customer_data.get('name')}")
        data = self.load_data()
        customers = data.get('customers', [])
        
        # Генеруємо новий ID
        new_id = max([c.get('id', 0) for c in customers], default=0) + 1
        customer_data['id'] = new_id
        
        customers.append(customer_data)
        data['customers'] = customers
        
        if self.save_data(data):
            logger.info(f"✅ Клієнт додан з ID: {new_id}")
            return new_id
        logger.error("❌ Помилка при додаванні клієнта")
        return None
    
    def update_customer(self, customer_id, customer_data):
        """Оновлюємо дані клієнта"""
        logger.info(f"🔄 Оновлення клієнта з ID: {customer_id}")
        data = self.load_data()
        customers = data.get('customers', [])
        
        for i, customer in enumerate(customers):
            if customer.get('id') == int(customer_id):
                customers[i].update(customer_data)
                data['customers'] = customers
                if self.save_data(data):
                    logger.info(f"✅ Клієнт оновлен: {customer_data.get('name', 'Без імені')}")
                    return True
                break
        
        logger.error(f"❌ Клієнт з ID {customer_id} не знайдений")
        return False
    
    
    
    
    
    
    
    
    
    # ===== FINANCIAL REPORTS =====
    
    def get_financial_reports(self):
        """Отримуємо фінансові звіти"""
        # Видалено зайве логування для оптимізації
        data = self.load_data()
        reports = data.get('financial_reports', {})
        return reports
    
    def get_daily_sales(self, limit=30):
        """Отримуємо щоденні продажі"""
        # Видалено зайве логування для оптимізації
        reports = self.get_financial_reports()
        daily_sales = reports.get('daily_sales', [])
        # Сортуємо за датою (новіші спочатку) і обмежуємо кількість
        daily_sales.sort(key=lambda x: x.get('date', ''), reverse=True)
        return daily_sales[:limit]
    
    def get_monthly_summary(self):
        """Отримуємо місячний звіт"""
        # Видалено зайве логування для оптимізації
        reports = self.get_financial_reports()
        return reports.get('monthly_summary', {})
    
    def get_additional_settings(self):
        """Отримуємо налаштування додаткових товарів"""
        data = self.load_data()
        return data.get('additional_settings', {})
    
    def get_categories(self):
        """Отримуємо категорії додаткових товарів"""
        data = self.load_data()
        additional_settings = data.get('additional_settings', {})
        return additional_settings.get('categories', [])
    
    def add_category(self, title, order=None):
        """Додаємо нову категорію"""
        data = self.load_data()
        additional_settings = data.get('additional_settings', {})
        categories = additional_settings.get('categories', [])
        
        # Генеруємо ID з назви (транслітерація)
        category_id = title.lower().replace(' ', '_')
        
        # Перевіряємо чи така категорія вже існує
        if any(cat.get('id') == category_id for cat in categories):
            return False
        
        if order is None:
            order = len(categories) + 1
        
        new_category = {
            'id': category_id,
            'title': title,
            'order': order
        }
        
        categories.append(new_category)
        additional_settings['categories'] = categories
        data['additional_settings'] = additional_settings
        return self.save_data(data)
    
    def update_category(self, category_id, title, order):
        """Оновлюємо категорію"""
        data = self.load_data()
        additional_settings = data.get('additional_settings', {})
        categories = additional_settings.get('categories', [])
        
        for category in categories:
            if category.get('id') == category_id:
                category['title'] = title
                category['order'] = order
                break
        else:
            return False
        
        additional_settings['categories'] = categories
        data['additional_settings'] = additional_settings
        return self.save_data(data)
    
    def delete_category(self, category_id):
        """Видаляємо категорію"""
        data = self.load_data()
        additional_settings = data.get('additional_settings', {})
        categories = additional_settings.get('categories', [])
        
        # Видаляємо категорію
        categories = [cat for cat in categories if cat.get('id') != category_id]
        
        # Видаляємо категорію з товарів (робимо порожнім)
        products = data.get('additional_products', [])
        for product in products:
            if product.get('category') == category_id:
                product['category'] = ''
        
        additional_settings['categories'] = categories
        data['additional_settings'] = additional_settings
        data['additional_products'] = products
        return self.save_data(data)
    
    # ===== PROGRESS BAR MANAGEMENT =====
    
    def get_progress_bar_settings(self):
        """Отримуємо налаштування прогрес-бару"""
        # Видалено зайве логування для оптимізації
        data = self.load_data()
        progress_bar = data.get('site_settings', {}).get('progress_bar', {
            'enabled': True,
            'milestones': []
        })
        
        # Завжди сортуємо етапи по сумі (зростання)
        if 'milestones' in progress_bar and progress_bar['milestones']:
            progress_bar['milestones'].sort(key=lambda x: x.get('amount', 0))
        
        return progress_bar
    
    def update_progress_bar_enabled(self, enabled):
        """Увімкнути/вимкнути прогрес-бар"""
        logger.info(f"⚡ Оновлення статусу прогрес-бару: {enabled}")
        data = self.load_data()
        if 'progress_bar' not in data.get('site_settings', {}):
            data['site_settings']['progress_bar'] = {'enabled': enabled, 'milestones': []}
        else:
            data['site_settings']['progress_bar']['enabled'] = enabled
        return self.save_data(data)
    
    def add_milestone(self, milestone_data):
        """Додаємо новий етап прогрес-бару"""
        logger.info(f"➕ Додавання етапу: {milestone_data.get('title')}")
        data = self.load_data()
        
        if 'progress_bar' not in data.get('site_settings', {}):
            data['site_settings']['progress_bar'] = {'enabled': True, 'milestones': []}
        
        milestones = data['site_settings']['progress_bar'].get('milestones', [])
        
        # Генеруємо новий ID
        new_id = max([m.get('id', 0) for m in milestones], default=0) + 1
        milestone_data['id'] = new_id
        
        milestones.append(milestone_data)
        
        # Сортуємо по сумі
        milestones.sort(key=lambda x: x.get('amount', 0))
        
        data['site_settings']['progress_bar']['milestones'] = milestones
        
        if self.save_data(data):
            logger.info(f"✅ Етап #{new_id} додано успішно")
            return new_id
        else:
            logger.error(f"❌ Помилка додавання етапу")
            return None
    
    def update_milestone(self, milestone_id, milestone_data):
        """Оновлюємо етап прогрес-бару"""
        logger.info(f"✏️ Оновлення етапу #{milestone_id}")
        data = self.load_data()
        
        milestones = data.get('site_settings', {}).get('progress_bar', {}).get('milestones', [])
        
        for milestone in milestones:
            if milestone.get('id') == milestone_id:
                # Оновлюємо всі поля, крім id
                for key, value in milestone_data.items():
                    if key != 'id':
                        milestone[key] = value
                
                # Сортуємо по сумі
                milestones.sort(key=lambda x: x.get('amount', 0))
                
                data['site_settings']['progress_bar']['milestones'] = milestones
                
                if self.save_data(data):
                    logger.info(f"✅ Етап #{milestone_id} оновлено")
                    return True
                else:
                    logger.error(f"❌ Помилка оновлення етапу")
                    return False
        
        logger.warning(f"⚠️ Етап #{milestone_id} не знайдено")
        return False
    
    def delete_milestone(self, milestone_id):
        """Видаляємо етап прогрес-бару"""
        logger.info(f"🗑️ Видалення етапу #{milestone_id}")
        data = self.load_data()
        
        milestones = data.get('site_settings', {}).get('progress_bar', {}).get('milestones', [])
        original_count = len(milestones)
        
        milestones = [m for m in milestones if m.get('id') != milestone_id]
        
        if len(milestones) < original_count:
            data['site_settings']['progress_bar']['milestones'] = milestones
            if self.save_data(data):
                logger.info(f"✅ Етап #{milestone_id} видалено")
                return True
            else:
                logger.error(f"❌ Помилка видалення етапу")
                return False
        
        logger.warning(f"⚠️ Етап #{milestone_id} не знайдено")
        return False
    
    def get_milestone_by_id(self, milestone_id):
        """Отримуємо етап по ID"""
        # Видалено зайве логування для оптимізації
        data = self.load_data()
        milestones = data.get('site_settings', {}).get('progress_bar', {}).get('milestones', [])
        
        for milestone in milestones:
            if milestone.get('id') == milestone_id:
                return milestone
        
        logger.warning(f"⚠️ Етап #{milestone_id} не знайдено")
        return None
    
    # ===== DELIVERY CITIES MANAGEMENT =====
    
    def get_delivery_cities(self):
        """Отримуємо список міст доставки"""
        logger.info("🏙️ Отримання міст доставки")
        data = self.load_data()
        return data.get('site_settings', {}).get('delivery_cities', [])
    
    def add_delivery_city(self, city_name, region=None, delivery_fee=0, free_delivery_threshold=1000):
        """Додаємо місто доставки"""
        logger.info(f"➕ Додавання міста доставки: {city_name}")
        data = self.load_data()
        
        if 'delivery_cities' not in data.get('site_settings', {}):
            data['site_settings']['delivery_cities'] = []
        
        cities = data['site_settings']['delivery_cities']
        
        # Перевіряємо чи місто вже існує
        if any(c.get('name', '').lower() == city_name.lower() for c in cities):
            logger.warning(f"⚠️ Місто '{city_name}' вже існує")
            return False
        
        # Генеруємо новий ID
        new_id = max([c.get('id', 0) for c in cities], default=0) + 1
        
        city_data = {
            'id': new_id,
            'name': city_name,
            'region': region or '',
            'delivery_fee': delivery_fee,
            'free_delivery_threshold': free_delivery_threshold,
            'is_active': True
        }
        
        cities.append(city_data)
        data['site_settings']['delivery_cities'] = cities
        
        if self.save_data(data):
            logger.info(f"✅ Місто '{city_name}' додано")
            return new_id
        else:
            logger.error(f"❌ Помилка додавання міста")
            return None
    
    def update_delivery_city(self, city_id, city_name, region=None, delivery_fee=0, free_delivery_threshold=1000, is_active=True):
        """Оновлюємо дані міста"""
        logger.info(f"✏️ Оновлення міста #{city_id}")
        data = self.load_data()
        
        cities = data.get('site_settings', {}).get('delivery_cities', [])
        
        for city in cities:
            if city.get('id') == city_id:
                city['name'] = city_name
                city['region'] = region or ''
                city['delivery_fee'] = delivery_fee
                city['free_delivery_threshold'] = free_delivery_threshold
                city['is_active'] = is_active
                
                data['site_settings']['delivery_cities'] = cities
                
                if self.save_data(data):
                    logger.info(f"✅ Місто #{city_id} оновлено")
                    return True
                else:
                    logger.error(f"❌ Помилка оновлення міста")
                    return False
        
        logger.warning(f"⚠️ Місто #{city_id} не знайдено")
        return False
    
    def delete_delivery_city(self, city_id):
        """Видаляємо місто"""
        logger.info(f"🗑️ Видалення міста #{city_id}")
        data = self.load_data()
        
        cities = data.get('site_settings', {}).get('delivery_cities', [])
        original_count = len(cities)
        
        cities = [c for c in cities if c.get('id') != city_id]
        
        if len(cities) < original_count:
            data['site_settings']['delivery_cities'] = cities
            if self.save_data(data):
                logger.info(f"✅ Місто #{city_id} видалено")
                return True
            else:
                logger.error(f"❌ Помилка видалення міста")
                return False
        
        logger.warning(f"⚠️ Місто #{city_id} не знайдено")
        return False
    
    def get_active_delivery_cities(self):
        """Отримуємо тільки активні міста доставки"""
        logger.info("🏙️ Отримання активних міст")
        cities = self.get_delivery_cities()
        return [c for c in cities if c.get('is_active', True)]
    
    # ===== ANALYTICS MANAGEMENT =====
    
    def track_visit(self, visit_data):
        """Записуємо візит користувача"""
        logger.info(f"📊 Трекінг візиту від {visit_data.get('device_type')}")
        data = self.load_data()
        
        if 'analytics' not in data:
            data['analytics'] = {
                'visits': [],
                'sessions': []
            }
        
        # Генеруємо ID візиту
        visit_id = f"visit_{datetime.now().strftime('%Y%m%d%H%M%S')}_{visit_data.get('user_id', 'unknown')[-8:]}"
        visit_data['id'] = visit_id
        
        # Додаємо візит
        data['analytics']['visits'].append(visit_data)
        
        # Обмежуємо історію (зберігаємо останні 1000 візитів)
        if len(data['analytics']['visits']) > 1000:
            data['analytics']['visits'] = data['analytics']['visits'][-1000:]
        
        if self.save_data(data):
            logger.info(f"✅ Візит {visit_id} записано")
            return visit_id
        else:
            logger.error("❌ Помилка запису візиту")
            return None
    
    def get_visits(self, limit=100):
        """Отримуємо історію візитів"""
        logger.info(f"📊 Отримання візитів (limit={limit})")
        data = self.load_data()
        visits = data.get('analytics', {}).get('visits', [])
        
        # Сортуємо за часом (новіші першими)
        visits_sorted = sorted(visits, key=lambda x: x.get('timestamp', ''), reverse=True)
        
        return visits_sorted[:limit]
    
    def get_analytics_summary(self):
        """Отримуємо загальну статистику"""
        logger.info("📊 Генерація статистики аналітики")
        data = self.load_data()
        visits = data.get('analytics', {}).get('visits', [])
        
        if not visits:
            return {
                'total_visits': 0,
                'unique_users': 0,
                'total_sessions': 0,
                'top_pages': [],
                'top_referrers': [],
                'top_devices': [],
                'top_browsers': [],
                'top_cities': []
            }
        
        # Унікальні користувачі
        unique_users = len(set(v.get('user_id') for v in visits if v.get('user_id')))
        
        # Унікальні сесії
        unique_sessions = len(set(v.get('session_id') for v in visits if v.get('session_id')))
        
        # Топ сторінок
        pages_count = {}
        for visit in visits:
            page = visit.get('page_url', 'Unknown')
            pages_count[page] = pages_count.get(page, 0) + 1
        top_pages = sorted(pages_count.items(), key=lambda x: x[1], reverse=True)[:10]
        
        # Топ джерел
        referrers_count = {}
        for visit in visits:
            ref = visit.get('referrer', 'Direct')
            referrers_count[ref] = referrers_count.get(ref, 0) + 1
        top_referrers = sorted(referrers_count.items(), key=lambda x: x[1], reverse=True)[:10]
        
        # Топ пристроїв
        devices_count = {}
        for visit in visits:
            device = visit.get('device_type', 'Unknown')
            devices_count[device] = devices_count.get(device, 0) + 1
        top_devices = sorted(devices_count.items(), key=lambda x: x[1], reverse=True)
        
        # Топ браузерів
        browsers_count = {}
        for visit in visits:
            browser = visit.get('browser', 'Unknown')
            browsers_count[browser] = browsers_count.get(browser, 0) + 1
        top_browsers = sorted(browsers_count.items(), key=lambda x: x[1], reverse=True)[:5]
        
        # Топ міст
        cities_count = {}
        for visit in visits:
            city = visit.get('city')
            if city:
                cities_count[city] = cities_count.get(city, 0) + 1
        top_cities = sorted(cities_count.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return {
            'total_visits': len(visits),
            'unique_users': unique_users,
            'total_sessions': unique_sessions,
            'top_pages': [{'page': p[0], 'count': p[1]} for p in top_pages],
            'top_referrers': [{'source': r[0], 'count': r[1]} for r in top_referrers],
            'top_devices': [{'device': d[0], 'count': d[1]} for d in top_devices],
            'top_browsers': [{'browser': b[0], 'count': b[1]} for b in top_browsers],
            'top_cities': [{'city': c[0], 'count': c[1]} for c in top_cities]
        }
    
    def get_visits_by_date(self, days=7):
        """Отримуємо візити за датами"""
        from datetime import datetime, timedelta
        logger.info(f"📊 Отримання візитів за {days} днів")
        
        data = self.load_data()
        visits = data.get('analytics', {}).get('visits', [])
        
        # Групуємо по датах
        visits_by_date = {}
        
        for i in range(days):
            date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
            visits_by_date[date] = 0
        
        for visit in visits:
            try:
                visit_date = visit.get('timestamp', '')[:10]  # Беремо тільки дату
                if visit_date in visits_by_date:
                    visits_by_date[visit_date] += 1
            except:
                pass
        
        # Перетворюємо в список
        result = [{'date': date, 'count': count} for date, count in sorted(visits_by_date.items())]
        
        return result
    
    # ===== ADMIN USERS MANAGEMENT =====
    
    def get_all_admins(self):
        """Отримуємо всіх адміністраторів"""
        logger.info("👥 Отримання списку адміністраторів")
        data = self.load_data()
        return data.get('admin_users', [])
    
    def get_admin_by_username(self, username):
        """Отримуємо адміністратора по username"""
        logger.info(f"🔍 Пошук адміністратора: {username}")
        admins = self.get_all_admins()
        for admin in admins:
            if admin.get('username') == username and admin.get('is_active', True):
                return admin
        return None
    
    def get_admin_by_id(self, admin_id):
        """Отримуємо адміністратора по ID"""
        logger.info(f"🔍 Пошук адміністратора по ID: {admin_id}")
        admins = self.get_all_admins()
        for admin in admins:
            if admin.get('id') == admin_id:
                return admin
        return None
    
    def create_admin(self, admin_data):
        """Створюємо нового адміністратора"""
        logger.info(f"➕ Створення адміністратора: {admin_data.get('username')}")
        try:
            data = self.load_data()
            
            if 'admin_users' not in data:
                data['admin_users'] = []
            
            # Генеруємо ID
            existing_ids = [a.get('id', 0) for a in data['admin_users']]
            new_id = max(existing_ids, default=0) + 1
            admin_data['id'] = new_id
            
            data['admin_users'].append(admin_data)
            
            self.save_data(data)
            logger.info(f"✅ Адміністратор {admin_data.get('username')} створений")
            return True
        except Exception as e:
            logger.error(f"❌ Помилка створення адміністратора: {e}")
            return False
    
    def update_admin_last_login(self, admin_id):
        """Оновлюємо час останнього входу"""
        logger.info(f"🕐 Оновлення last_login для адміністратора #{admin_id}")
        try:
            data = self.load_data()
            admins = data.get('admin_users', [])
            
            for admin in admins:
                if admin.get('id') == admin_id:
                    from datetime import datetime
                    admin['last_login'] = datetime.now().isoformat()
                    break
            
            data['admin_users'] = admins
            self.save_data(data)
            return True
        except Exception as e:
            logger.error(f"❌ Помилка оновлення last_login: {e}")
            return False
    
    def update_admin_profile(self, admin_id, name=None, email=None):
        """Оновлюємо профіль адміністратора"""
        logger.info(f"📝 Оновлення профілю адміністратора #{admin_id}")
        try:
            data = self.load_data()
            admins = data.get('admin_users', [])
            
            for admin in admins:
                if admin.get('id') == admin_id:
                    if name:
                        admin['name'] = name
                    if email:
                        admin['email'] = email
                    from datetime import datetime
                    admin['updated_at'] = datetime.now().isoformat()
                    break
            
            data['admin_users'] = admins
            self.save_data(data)
            logger.info(f"✅ Профіль адміністратора #{admin_id} оновлено")
            return True
        except Exception as e:
            logger.error(f"❌ Помилка оновлення профілю: {e}")
            return False
    
    def update_admin_password(self, admin_id, password_hash, salt):
        """Оновлюємо пароль адміністратора"""
        logger.info(f"🔐 Оновлення пароля адміністратора #{admin_id}")
        try:
            data = self.load_data()
            admins = data.get('admin_users', [])
            
            for admin in admins:
                if admin.get('id') == admin_id:
                    admin['password_hash'] = password_hash
                    admin['salt'] = salt
                    from datetime import datetime
                    admin['password_changed_at'] = datetime.now().isoformat()
                    break
            
            data['admin_users'] = admins
            self.save_data(data)
            logger.info(f"✅ Пароль адміністратора #{admin_id} оновлено")
            return True
        except Exception as e:
            logger.error(f"❌ Помилка оновлення пароля: {e}")
            return False
    
    def toggle_admin_status(self, admin_id):
        """Активує/деактивує адміністратора"""
        logger.info(f"🔄 Зміна статусу адміністратора #{admin_id}")
        try:
            data = self.load_data()
            admins = data.get('admin_users', [])
            
            for admin in admins:
                if admin.get('id') == admin_id:
                    admin['is_active'] = not admin.get('is_active', True)
                    from datetime import datetime
                    admin['updated_at'] = datetime.now().isoformat()
                    logger.info(f"✅ Статус адміністратора #{admin_id}: {admin['is_active']}")
                    break
            
            data['admin_users'] = admins
            self.save_data(data)
            return True
        except Exception as e:
            logger.error(f"❌ Помилка зміни статусу: {e}")
            return False