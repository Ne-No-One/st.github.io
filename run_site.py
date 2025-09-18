#!/usr/bin/env python
"""
Запуск основного сайту квіткового магазину
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

def main():
    """Запуск основного сайту"""
    print("🌸 Запуск основного сайту квіткового магазину...")
    print("=" * 50)
    
    try:
        # Налаштовуємо Django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
        django.setup()
        
        print("✅ Django налаштовано")
        print("🌐 Сайт: http://127.0.0.1:8000/")
        print("🔄 Запуск сервера...")
        
        # Запускаємо Django сервер
        execute_from_command_line(['manage.py', 'runserver'])
        
    except KeyboardInterrupt:
        print("\n⏹️  Сервер зупинено")
    except Exception as e:
        print(f"❌ Помилка: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
