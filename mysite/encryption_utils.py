"""
Утиліти для шифрування та дешифрування чутливих даних клієнтів
"""
import base64
import hashlib
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
from django.conf import settings


class DataEncryption:
    """
    Клас для шифрування та дешифрування персональних даних
    """
    
    def __init__(self):
        """Ініціалізація з ключем шифрування"""
        self.encryption_key = self._get_encryption_key()
        self.cipher = Fernet(self.encryption_key)
    
    def _get_encryption_key(self):
        """
        Генерує ключ шифрування з SECRET_KEY
        """
        # Використовуємо PBKDF2HMAC для генерації ключа з SECRET_KEY
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=b'flower_shop_salt_2025',  # Статична сіль (в production краще зберігати окремо)
            iterations=100000,
            backend=default_backend()
        )
        
        secret = settings.ENCRYPTION_KEY.encode()
        key = base64.urlsafe_b64encode(kdf.derive(secret))
        return key
    
    def encrypt(self, data):
        """
        Шифрує дані
        
        Args:
            data (str): Дані для шифрування
            
        Returns:
            str: Зашифровані дані в base64
        """
        if not data:
            return data
        
        try:
            encrypted = self.cipher.encrypt(data.encode())
            return base64.urlsafe_b64encode(encrypted).decode()
        except Exception as e:
            print(f"❌ Помилка шифрування: {e}")
            return data  # Повертаємо оригінал у разі помилки
    
    def decrypt(self, encrypted_data):
        """
        Дешифрує дані
        
        Args:
            encrypted_data (str): Зашифровані дані в base64
            
        Returns:
            str: Розшифровані дані
        """
        if not encrypted_data:
            return encrypted_data
        
        try:
            decoded = base64.urlsafe_b64decode(encrypted_data.encode())
            decrypted = self.cipher.decrypt(decoded)
            return decrypted.decode()
        except Exception as e:
            print(f"❌ Помилка дешифрування: {e}")
            return encrypted_data  # Повертаємо як є у разі помилки
    
    def mask_data(self, data, mask_char='*', visible_chars=4):
        """
        Маскує дані для відображення в логах
        
        Args:
            data (str): Дані для маскування
            mask_char (str): Символ маски
            visible_chars (int): Кількість видимих символів з кінця
            
        Returns:
            str: Маскований рядок
        """
        if not data or len(data) <= visible_chars:
            return mask_char * len(data) if data else ''
        
        masked_part = mask_char * (len(data) - visible_chars)
        visible_part = data[-visible_chars:]
        return masked_part + visible_part
    
    def hash_data(self, data):
        """
        Створює хеш даних (для порівняння без зберігання оригіналу)
        
        Args:
            data (str): Дані для хешування
            
        Returns:
            str: SHA256 хеш
        """
        if not data:
            return ''
        
        return hashlib.sha256(data.encode()).hexdigest()


# Глобальний екземпляр для використання в проєкті
encryption = DataEncryption()


def encrypt_order_data(order_data):
    """
    Шифрує чутливі дані в замовленні
    
    Args:
        order_data (dict): Дані замовлення
        
    Returns:
        dict: Замовлення з зашифрованими даними
    """
    if not settings.MASK_SENSITIVE_DATA:
        return order_data
    
    encrypted_order = order_data.copy()
    
    # Шифруємо чутливі поля
    sensitive_fields = settings.ENCRYPTED_FIELDS
    
    for field in sensitive_fields:
        if field in encrypted_order and encrypted_order[field]:
            encrypted_order[field] = encryption.encrypt(str(encrypted_order[field]))
            encrypted_order[f'{field}_encrypted'] = True
    
    print(f"🔒 Зашифровано {len([f for f in sensitive_fields if f in order_data])} полів")
    
    return encrypted_order


def decrypt_order_data(order_data):
    """
    Дешифрує чутливі дані в замовленні
    
    Args:
        order_data (dict): Замовлення з зашифрованими даними
        
    Returns:
        dict: Замовлення з розшифрованими даними
    """
    if not settings.MASK_SENSITIVE_DATA:
        return order_data
    
    decrypted_order = order_data.copy()
    
    # Дешифруємо чутливі поля
    sensitive_fields = settings.ENCRYPTED_FIELDS
    
    for field in sensitive_fields:
        if field in decrypted_order and decrypted_order.get(f'{field}_encrypted'):
            decrypted_order[field] = encryption.decrypt(decrypted_order[field])
            del decrypted_order[f'{field}_encrypted']
    
    return decrypted_order


def mask_order_for_logs(order_data):
    """
    Маскує чутливі дані для безпечного логування
    
    Args:
        order_data (dict): Дані замовлення
        
    Returns:
        dict: Замовлення з маскованими даними
    """
    if not settings.MASK_SENSITIVE_DATA:
        return order_data
    
    masked_order = order_data.copy()
    
    # Маскуємо телефон (показуємо тільки останні 4 цифри)
    if 'customer_phone' in masked_order:
        masked_order['customer_phone'] = encryption.mask_data(masked_order['customer_phone'], visible_chars=4)
    
    # Маскуємо email (показуємо тільки домен)
    if 'customer_email' in masked_order and '@' in str(masked_order['customer_email']):
        email = masked_order['customer_email']
        local, domain = email.split('@')
        masked_order['customer_email'] = f"{encryption.mask_data(local, visible_chars=2)}@{domain}"
    
    # Маскуємо адресу (показуємо тільки місто)
    if 'delivery_address' in masked_order:
        masked_order['delivery_address'] = '***адреса приховано***'
    
    # Маскуємо ім'я (показуємо тільки ініціали)
    if 'customer_name' in masked_order:
        name_parts = masked_order['customer_name'].split()
        if len(name_parts) >= 2:
            masked_order['customer_name'] = f"{name_parts[0][0]}. {name_parts[1][0]}."
        else:
            masked_order['customer_name'] = f"{name_parts[0][0]}***"
    
    return masked_order


def anonymize_old_orders(days=365):
    """
    Анонімізує старі замовлення (видаляє персональні дані)
    
    Args:
        days (int): Вік замовлень для анонімізації
        
    Returns:
        int: Кількість анонімізованих замовлень
    """
    from datetime import datetime, timedelta
    from json_manager import JSONManager
    
    json_manager = JSONManager()
    orders = json_manager.get_orders()
    
    cutoff_date = datetime.now() - timedelta(days=days)
    anonymized_count = 0
    
    for order in orders:
        try:
            order_date = datetime.fromisoformat(order.get('created_at', ''))
            
            if order_date < cutoff_date:
                # Анонімізуємо персональні дані
                order['customer_name'] = 'АНОНІМІЗОВАНО'
                order['customer_phone'] = '***'
                order['customer_email'] = 'anonymized@system.local'
                order['delivery_address'] = '***'
                order['notes'] = ''
                order['anonymized'] = True
                order['anonymized_at'] = datetime.now().isoformat()
                
                anonymized_count += 1
        except Exception as e:
            print(f"❌ Помилка анонімізації замовлення {order.get('order_number')}: {e}")
    
    if anonymized_count > 0:
        # Зберігаємо оновлені дані
        data = json_manager.load_data()
        data['orders'] = orders
        json_manager.save_data(data)
        print(f"✅ Анонімізовано {anonymized_count} замовлень старше {days} днів")
    
    return anonymized_count

