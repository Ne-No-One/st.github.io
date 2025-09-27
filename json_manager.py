#!/usr/bin/env python
"""
Менеджер для роботи з JSON файлом
"""
import json
import os
import logging
from django.conf import settings

# Налаштування логера
logger = logging.getLogger('json_manager')

class JSONManager:
    """Клас для управління JSON файлом з даними"""
    
    def __init__(self):
        logger.info("🔧 Ініціалізація JSONManager")
        try:
            self.data_file = os.path.join(settings.BASE_DIR, 'data.json')
            logger.info(f"📁 Шлях до файлу: {self.data_file}")
            self._ensure_data_file()
            logger.info("✅ JSONManager успішно ініціалізовано")
        except Exception as e:
            logger.error(f"❌ Помилка ініціалізації JSONManager: {e}")
            raise
    
    def _ensure_data_file(self):
        """Перевіряємо чи існує файл даних, якщо ні - створюємо"""
        logger.info("🔍 Перевірка існування файлу даних")
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
        """Завантажуємо дані з JSON файлу"""
        logger.info("📖 Завантаження даних з JSON файлу")
        try:
            if not os.path.exists(self.data_file):
                logger.error(f"❌ Файл {self.data_file} не існує")
                return {}
            
            with open(self.data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                logger.info(f"✅ Дані завантажено успішно, розмір: {len(str(data))} символів")
                return data
        except json.JSONDecodeError as e:
            logger.error(f"❌ Помилка парсингу JSON: {e}")
            return {}
        except Exception as e:
            logger.error(f"❌ Помилка завантаження даних: {e}")
            return {}
    
    def save_data(self, data):
        """Зберігаємо дані в JSON файл"""
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
        logger.info("🔧 Отримання налаштувань сайту")
        try:
            data = self.load_data()
            settings = data.get('site_settings', {})
            
            # Забезпечуємо дефолтні значення для секцій тільки якщо вони відсутні
            if 'show_services_section' not in settings:
                settings['show_services_section'] = True
                logger.info("🔧 Встановлено дефолтне значення show_services_section = True")
            if 'show_contact_section' not in settings:
                settings['show_contact_section'] = True
                logger.info("🔧 Встановлено дефолтне значення show_contact_section = True")
            if 'show_about_section' not in settings:
                settings['show_about_section'] = True
                logger.info("🔧 Встановлено дефолтне значення show_about_section = True")
            
            logger.info(f"✅ Налаштування сайту отримано: {settings}")
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
    
    def update_color_option_with_layers(self, color_id, name, hex_code, image_url, is_active=True, packaging_texture_url=None, mask_image_url=None, flowers_image_url=None):
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
                    'is_active': is_active
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
    
    def add_quantity_image_for_color(self, color_id, quantity, image_url):
        """Додаємо фото для конкретної кількості кольору"""
        print(f"🖼️ add_quantity_image_for_color: color_id={color_id}, quantity={quantity}, image_url={image_url}")
        data = self.load_data()
        colors = data.get('color_options', [])
        found = False
        for color in colors:
            if color.get('id') == color_id:
                if 'quantity_images' not in color:
                    color['quantity_images'] = {}
                color['quantity_images'][str(quantity)] = image_url
                print(f"✅ Додано фото для кольору {color_id}, кількість {quantity}")
                found = True
                break
        
        if not found:
            print(f"❌ Колір з ID {color_id} не знайдено!")
            return False
            
        data['color_options'] = colors
        result = self.save_data(data)
        print(f"💾 Результат збереження фото: {result}")
        return result
    
    def update_quantity_image_for_color(self, color_id, quantity, image_url):
        """Оновлюємо фото для конкретної кількості кольору"""
        return self.add_quantity_image_for_color(color_id, quantity, image_url)
    
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
    
    def add_color_with_quantities(self, name, hex_code, image_url="", order=None, quantities_data=None):
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
            'is_active': True,
            'order': order,
            'quantity_images': {}
        }
        
        # Додаємо фото для кількостей
        if quantities_data:
            for qty_data in quantities_data:
                quantity = qty_data.get('quantity')
                image_url = qty_data.get('image_url')
                if quantity and image_url:
                    new_color['quantity_images'][str(quantity)] = image_url
        
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
            'order': order
        }
        print(f"📦 Новий варіант: {new_quantity}")
        
        quantities.append(new_quantity)
        data['quantity_options'] = quantities
        result = self.save_data(data)
        print(f"💾 Результат збереження: {result}")
        return result
    
    def update_quantity_option(self, quantity_id, quantity, price_per_unit, is_active):
        """Оновлюємо варіант кількості"""
        data = self.load_data()
        quantities = data.get('quantity_options', [])
        for qty in quantities:
            if qty.get('id') == quantity_id:
                qty.update({
                    'quantity': quantity,
                    'price_per_unit': price_per_unit,
                    'is_active': is_active
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
    
    def add_additional_product(self, title, description, price, currency, image_url="", add_to_cart_text="Додати в кошик"):
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
            'add_to_cart_text': add_to_cart_text,
            'is_active': True,
            'order': len(products) + 1
        }
        products.append(new_product)
        data['additional_products'] = products
        return self.save_data(data)
    
    def update_additional_product(self, product_id, title, description, price, currency, image_url="", order=None):
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
        logger.info("📋 Отримання списку замовлень")
        data = self.load_data()
        orders = data.get('orders', [])
        # Сортуємо за датою замовлення (новіші спочатку)
        orders.sort(key=lambda x: x.get('order_date', ''), reverse=True)
        logger.info(f"✅ Знайдено {len(orders)} замовлень")
        return orders
    
    def get_order_by_id(self, order_id):
        """Отримуємо замовлення за ID"""
        logger.info(f"🔍 Пошук замовлення з ID: {order_id}")
        orders = self.get_orders()
        for order in orders:
            if order.get('id') == int(order_id):
                logger.info(f"✅ Замовлення знайдено: {order.get('order_number')}")
                return order
        logger.warning(f"⚠️ Замовлення з ID {order_id} не знайдено")
        return None
    
    def update_order_status(self, order_id, new_status):
        """Оновлюємо статус замовлення"""
        logger.info(f"🔄 Оновлення статусу замовлення {order_id} на '{new_status}'")
        data = self.load_data()
        orders = data.get('orders', [])
        
        for order in orders:
            if order.get('id') == int(order_id):
                order['status'] = new_status
                logger.info(f"✅ Статус замовлення {order.get('order_number')} оновлено")
                return self.save_data(data)
        
        logger.error(f"❌ Замовлення з ID {order_id} не знайдено")
        return False
    
    def get_orders_by_status(self, status):
        """Отримуємо замовлення за статусом"""
        logger.info(f"📊 Отримання замовлень зі статусом: {status}")
        orders = self.get_orders()
        filtered_orders = [order for order in orders if order.get('status') == status]
        logger.info(f"✅ Знайдено {len(filtered_orders)} замовлень зі статусом '{status}'")
        return filtered_orders
    
    # ===== CUSTOMERS MANAGEMENT =====
    
    def get_customers(self):
        """Отримуємо всіх клієнтів"""
        logger.info("👥 Отримання списку клієнтів")
        data = self.load_data()
        customers = data.get('customers', [])
        # Сортуємо за загальною сумою покупок (VIP спочатку)
        customers.sort(key=lambda x: x.get('total_spent', 0), reverse=True)
        logger.info(f"✅ Знайдено {len(customers)} клієнтів")
        return customers
    
    def get_customer_by_id(self, customer_id):
        """Отримуємо клієнта за ID"""
        logger.info(f"🔍 Пошук клієнта з ID: {customer_id}")
        customers = self.get_customers()
        for customer in customers:
            if customer.get('id') == int(customer_id):
                logger.info(f"✅ Клієнт знайдений: {customer.get('name')}")
                return customer
        logger.warning(f"⚠️ Клієнт з ID {customer_id} не знайдений")
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
        logger.info("💰 Отримання фінансових звітів")
        data = self.load_data()
        reports = data.get('financial_reports', {})
        logger.info("✅ Фінансові звіти отримано")
        return reports
    
    def get_daily_sales(self, limit=30):
        """Отримуємо щоденні продажі"""
        logger.info(f"📊 Отримання щоденних продажів (останні {limit} днів)")
        reports = self.get_financial_reports()
        daily_sales = reports.get('daily_sales', [])
        # Сортуємо за датою (новіші спочатку) і обмежуємо кількість
        daily_sales.sort(key=lambda x: x.get('date', ''), reverse=True)
        return daily_sales[:limit]
    
    def get_monthly_summary(self):
        """Отримуємо місячний звіт"""
        logger.info("📈 Отримання місячного звіту")
        reports = self.get_financial_reports()
        return reports.get('monthly_summary', {})
    
    def get_additional_settings(self):
        """Отримуємо налаштування додаткових товарів"""
        data = self.load_data()
        return data.get('additional_settings', {})
