#!/usr/bin/env python
"""
Простий запуск основного сайту через manage.py runserver
"""

import os
import sys
import subprocess
import webbrowser
import threading
import time

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
        # Перевіряємо чи існує manage.py
        if not os.path.exists('manage.py'):
            print("❌ Файл manage.py не знайдено!")
            print("   Переконайтеся що ви в правильній директорії проекту.")
            sys.exit(1)
        
        print("✅ Файл manage.py знайдено")
        
        print("\n📊 Інформація про запуск:")
        print("   • Порт: 8000")
        print("   • Адреса: http://127.0.0.1:8000/")
        print("   • Адмін панель: http://127.0.0.1:8000/admin-panel/")
        
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
        
        # Запускаємо Django сервер через subprocess
        subprocess.run([sys.executable, 'manage.py', 'runserver', '127.0.0.1:8000'])
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Сервер зупинено користувачем")
        print("👋 До побачення!")
    except Exception as e:
        print(f"\n❌ Помилка запуску: {e}")
        print("\n🔧 Можливі рішення:")
        print("   • Перевірте чи встановлені всі залежності: pip install -r requirements.txt")
        print("   • Переконайтеся що ви в правильній директорії проекту")
        print("   • Перевірте чи немає конфліктів з іншими серверами на порту 8000")
        sys.exit(1)

if __name__ == '__main__':
    main()
