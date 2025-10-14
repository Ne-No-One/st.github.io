"""
Скрипт для створення першого super admin акаунту
"""
import sys
import os
import io

# Встановлюємо UTF-8 для Windows консолі
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Додаємо шлях до Django проєкту
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Налаштовуємо Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
import django
django.setup()

from json_manager import JSONManager
from admin_panel.auth_views import hash_password
from datetime import datetime
import getpass


def create_superadmin():
    """Створює super admin акаунт"""
    print("="*60)
    print("СТВОРЕННЯ SUPER ADMIN АКАУНТУ")
    print("="*60)
    print()
    
    json_manager = JSONManager()
    
    # Перевіряємо чи вже є адміністратори
    existing_admins = json_manager.get_all_admins()
    if existing_admins:
        print(f"[INFO] Знайдено {len(existing_admins)} існуючих адміністраторів")
        response = input("Продовжити створення нового super admin? (y/n): ")
        if response.lower() != 'y':
            print("[CANCELLED] Скасовано")
            return
        print()
    
    # Збираємо дані
    print("Введіть дані для super admin акаунту:")
    print()
    
    username = input("Username (логін): ").strip()
    if not username:
        print("[ERROR] Username не може бути порожнім")
        return
    
    # Перевіряємо чи існує
    if json_manager.get_admin_by_username(username):
        print(f"[ERROR] Користувач {username} вже існує")
        return
    
    name = input("Повне ім'я: ").strip()
    if not name:
        name = username
    
    email = input("Email (опціонально): ").strip()
    
    # Пароль
    while True:
        password = getpass.getpass("Пароль (мін. 8 символів): ")
        if len(password) < 8:
            print("[ERROR] Пароль має містити мінімум 8 символів")
            continue
        
        password_confirm = getpass.getpass("Підтвердіть пароль: ")
        if password != password_confirm:
            print("[ERROR] Паролі не співпадають")
            continue
        
        break
    
    print()
    print("="*60)
    print("ПІДТВЕРДЖЕННЯ")
    print("="*60)
    print(f"Username: {username}")
    print(f"Ім'я: {name}")
    print(f"Email: {email or '(не вказано)'}")
    print(f"Роль: super_admin")
    print()
    
    confirm = input("Створити акаунт? (y/n): ")
    if confirm.lower() != 'y':
        print("[CANCELLED] Скасовано")
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
        print("="*60)
        print("[SUCCESS] Super admin успішно створений!")
        print("="*60)
        print()
        print(f"Username: {username}")
        print(f"Ім'я: {name}")
        print(f"Роль: super_admin")
        print()
        print("Тепер ви можете увійти в адмін-панель:")
        print("http://localhost:8000/admin-panel/login/")
        print()
        print("="*60)
    else:
        print("[ERROR] Помилка створення адміністратора")


if __name__ == '__main__':
    try:
        create_superadmin()
    except KeyboardInterrupt:
        print("\n[CANCELLED] Скасовано користувачем")
    except Exception as e:
        print(f"[ERROR] Помилка: {e}")
        import traceback
        traceback.print_exc()

