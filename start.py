#!/usr/bin/env python
"""
🌸 Універсальний скрипт запуску квіткового магазину
Запускає Django сервер з доступом до:
- Основного сайту: http://127.0.0.1:8000/
- Адмін панелі: http://127.0.0.1:8000/admin-panel/
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

def main():
    """Запуск проєкту"""
    print("=" * 60)
    print("🌸 КВІТКОВИЙ МАГАЗИН - ЗАПУСК СИСТЕМИ")
    print("=" * 60)
    
    try:
        # Налаштовуємо Django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
        django.setup()
        
        print("\n✅ Django налаштовано успішно!")
        print("\n📍 Доступні сторінки:")
        print("   🌐 Основний сайт:  http://127.0.0.1:8000/")
        print("   ⚙️  Адмін панель:   http://127.0.0.1:8000/admin-panel/")
        print("   💚 Health check:   http://127.0.0.1:8000/health/")
        print("   🛒 Кошик:          http://127.0.0.1:8000/cart/")
        
        print("\n" + "=" * 60)
        print("🔄 Запуск сервера...")
        print("💡 Для зупинки натисніть Ctrl+C")
        print("=" * 60)
        print()
        
        # Запускаємо Django сервер
        execute_from_command_line(['manage.py', 'runserver'])
        
    except KeyboardInterrupt:
        print("\n" + "=" * 60)
        print("⏹️  Сервер зупинено користувачем")
        print("👋 До побачення!")
        print("=" * 60)
    except Exception as e:
        print("\n" + "=" * 60)
        print(f"❌ Помилка: {e}")
        print("\n🔧 Можливі рішення:")
        print("   • Перевірте чи встановлені залежності: pip install -r requirements.txt")
        print("   • Переконайтеся що файл data.json існує")
        print("   • Перевірте чи немає іншого сервера на порту 8000")
        print("=" * 60)
        sys.exit(1)

if __name__ == '__main__':
    main()
