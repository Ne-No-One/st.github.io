"""
Скрипт для генерації SECRET_KEY та ENCRYPTION_KEY для production
"""
import secrets
import sys
import os

# Встановлюємо UTF-8 для Windows консолі
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Додаємо шлях до Django проєкту
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def generate_secret_key():
    """Генерує Django SECRET_KEY"""
    from django.core.management.utils import get_random_secret_key
    return get_random_secret_key()

def generate_encryption_key():
    """Генерує ENCRYPTION_KEY для шифрування даних"""
    return secrets.token_urlsafe(32)

def main():
    print("="*60)
    print("🔐 ГЕНЕРАЦІЯ КЛЮЧІВ ДЛЯ PRODUCTION")
    print("="*60)
    print()
    
    # Генеруємо ключі
    secret_key = generate_secret_key()
    encryption_key = generate_encryption_key()
    
    print("✅ Ключі успішно згенеровані!")
    print()
    print("="*60)
    print("📋 СКОПІЮЙТЕ ЦІ ЗНАЧЕННЯ В ВАШ .env ФАЙЛ:")
    print("="*60)
    print()
    print(f"SECRET_KEY={secret_key}")
    print(f"ENCRYPTION_KEY={encryption_key}")
    print()
    print("="*60)
    print("⚠️ ВАЖЛИВО:")
    print("="*60)
    print("1. Ці ключі мають бути УНІКАЛЬНИМИ для кожного проєкту")
    print("2. НЕ публікуйте ці ключі в Git або публічних місцях")
    print("3. Зберігайте їх в безпечному місці (password manager)")
    print("4. Для production використовуйте окремі ключі")
    print("5. Регулярно змінюйте ключі (раз на рік)")
    print()
    print("="*60)
    print("📝 НАСТУПНІ КРОКИ:")
    print("="*60)
    print("1. Створіть файл .env в корені проєкту:")
    print("   cp env.example .env")
    print()
    print("2. Відкрийте .env та вставте згенеровані ключі")
    print()
    print("3. Налаштуйте інші параметри:")
    print("   - DEBUG=False")
    print("   - ALLOWED_HOSTS=your-domain.com")
    print("   - SITE_URL=https://your-domain.com")
    print("   - MONOBANK_PRODUCTION_TOKEN=your-token")
    print()
    print("4. Перезапустіть сервер:")
    print("   python start.py")
    print()
    print("="*60)

if __name__ == '__main__':
    main()

