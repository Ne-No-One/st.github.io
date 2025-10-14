"""
Швидке створення super admin без інтерактивного вводу
"""
import sys
import os

# Додаємо шлях до Django проєкту
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Налаштовуємо Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
import django
django.setup()

from json_manager import JSONManager
from admin_panel.auth_views import hash_password
from datetime import datetime


def create_default_admin():
    """Створює super admin з дефолтними даними"""
    print("="*60)
    print("СТВОРЕННЯ SUPER ADMIN")
    print("="*60)
    
    # Дефолтні дані
    username = "admin"
    password = "admin123"  # ЗМІНІТЬ ПІСЛЯ ПЕРШОГО ВХОДУ!
    name = "Головний Адміністратор"
    email = "admin@example.com"
    
    json_manager = JSONManager()
    
    # Перевіряємо чи вже існує
    existing = json_manager.get_admin_by_username(username)
    if existing:
        print(f"[INFO] Адміністратор '{username}' вже існує")
        print(f"[INFO] Використовуйте ці дані для входу:")
        print(f"   Username: {username}")
        print(f"   Password: (ваш пароль)")
        print()
        print("Якщо забули пароль, видаліть 'admin_users' з data.json і запустіть скрипт знову")
        return
    
    # Хешуємо пароль
    password_hash, salt = hash_password(password)
    
    # Створюємо адміністратора
    admin_data = {
        'username': username,
        'password_hash': password_hash,
        'salt': salt,
        'name': name,
        'email': email,
        'role': 'super_admin',
        'created_at': datetime.now().isoformat(),
        'last_login': None,
        'is_active': True
    }
    
    result = json_manager.create_admin(admin_data)
    
    if result:
        print()
        print("[SUCCESS] Super admin створений!")
        print("="*60)
        print("ДАНІ ДЛЯ ВХОДУ:")
        print("="*60)
        print(f"URL: http://localhost:8000/admin-panel/login/")
        print(f"Username: {username}")
        print(f"Password: {password}")
        print()
        print("[WARNING] ОБОВ'ЯЗКОВО змініть пароль після першого входу!")
        print("="*60)
    else:
        print("[ERROR] Помилка створення адміністратора")


if __name__ == '__main__':
    try:
        create_default_admin()
    except Exception as e:
        print(f"[ERROR] Помилка: {e}")
        import traceback
        traceback.print_exc()

