#!/usr/bin/env python
"""
Запуск основного сайту Django проекту
Створено для запуску повнофункціонального сайту квіткового магазину
"""

import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line
import webbrowser
import threading
import time

def setup_django():
    """Налаштування Django для основного сайту"""
    # Додаємо поточну директорію до Python path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)
    
    # Налаштовуємо Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
    django.setup()
    
    return settings

def open_browser_delay():
    """Відкриваємо браузер з затримкою"""
    time.sleep(3)  # Чекаємо 3 секунди
    try:
        webbrowser.open('http://127.0.0.1:8000/')
        print("🌐 Основний сайт відкритий в браузері!")
    except Exception as e:
        print(f"⚠️  Не вдалося відкрити браузер: {e}")
        print("📱 Відкрийте вручну: http://127.0.0.1:8000/")

def main():
    """Головна функція запуску основного сайту"""
    print("🌸 Запуск основного сайту квіткового магазину...")
    print("=" * 60)
    
    try:
        # Налаштовуємо Django
        settings = setup_django()
        print("✅ Django налаштовано")
        
        # Створюємо директорію для сесій
        sessions_dir = os.path.join(os.path.dirname(__file__), 'sessions')
        if not os.path.exists(sessions_dir):
            os.makedirs(sessions_dir)
            print("✅ Директорія сесій створена")
        
        print("\n📊 Інформація про запуск:")
        print(f"   • Порт: 8000")
        print(f"   • Адреса: http://127.0.0.1:8000/")
        print(f"   • Адмін панель: http://127.0.0.1:8000/admin-panel/")
        print(f"   • Режим: DEBUG = {settings.DEBUG}")
        print(f"   • Хости: {settings.ALLOWED_HOSTS}")
        
        print("\n🎯 Доступні розділи сайту:")
        print("   • 🏠 Головна сторінка - каталог товарів")
        print("   • 🛍️  Послуги - інформація про послуги")
        print("   • ℹ️  Про нас - інформація про компанію")
        print("   • 📞 Контакти - форма зворотного зв'язку")
        print("   • ⚙️  Адмін панель - управління сайтом")
        
        print("\n" + "=" * 60)
        print("🔄 Запуск сервера...")
        
        # Запускаємо браузер в окремому потоці
        browser_thread = threading.Thread(target=open_browser_delay)
        browser_thread.daemon = True
        browser_thread.start()
        
        # Запускаємо Django сервер
        execute_from_command_line(['manage.py', 'runserver', '127.0.0.1:8000'])
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Сервер зупинено користувачем")
        print("👋 До побачення!")
    except Exception as e:
        print(f"\n❌ Помилка запуску: {e}")
        print("\n🔧 Можливі рішення:")
        print("   • Перевірте чи встановлені всі залежності: pip install -r requirements.txt")
        print("   • Переконайтеся що ви в правильній директорії проекту")
        print("   • Перевірте чи немає конфліктів з іншими серверами на порту 8000")
        print("   • Переконайтеся що адмін панель не запущена одночасно")
        sys.exit(1)

if __name__ == '__main__':
    main()
