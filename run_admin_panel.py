#!/usr/bin/env python
"""
Запуск тільки адмін панелі Django проекту
Створено для швидкого доступу до адміністративного інтерфейсу
"""

import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line
from django.core.wsgi import get_wsgi_application
from django.urls import path, include
from django.http import HttpResponseRedirect
import webbrowser
import threading
import time

def redirect_to_admin(request):
    """Перенаправлення на адмін панель"""
    return HttpResponseRedirect('/admin-panel/')

def setup_admin_only_urls():
    """Налаштування URL-ів тільки для адмін панелі"""
    from django.urls import path, include
    
    # Імпортуємо URL-и адмін панелі
    from admin_panel import urls as admin_urls
    
    urlpatterns = [
        path('', redirect_to_admin, name='home'),
        path('admin-panel/', include('admin_panel.urls')),
    ]
    return urlpatterns

def setup_admin_only_settings():
    """Налаштування Django тільки для адмін панелі"""
    # Додаємо поточну директорію до Python path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)
    
    # Налаштовуємо Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
    
    # Імпортуємо налаштування
    import mysite.settings as django_settings
    
    # Перевизначаємо ROOT_URLCONF для адмін панелі
    django_settings.ROOT_URLCONF = 'run_admin_panel'
    
    # Налаштовуємо Django
    django.setup()
    
    return django_settings

def create_admin_urlconf():
    """Створюємо модуль URL конфігурації для адмін панелі"""
    urlpatterns = setup_admin_only_urls()
    
    # Додаємо модуль до sys.modules
    import sys
    import types
    
    admin_urlconf = types.ModuleType('run_admin_panel')
    admin_urlconf.urlpatterns = urlpatterns
    sys.modules['run_admin_panel'] = admin_urlconf
    
    return admin_urlconf

def open_browser_delay():
    """Відкриваємо браузер з затримкою"""
    time.sleep(2)  # Чекаємо 2 секунди
    try:
        webbrowser.open('http://127.0.0.1:8001/admin-panel/')
        print("🌐 Адмін панель відкрита в браузері!")
    except Exception as e:
        print(f"⚠️  Не вдалося відкрити браузер: {e}")
        print("📱 Відкрийте вручну: http://127.0.0.1:8001/admin-panel/")

def main():
    """Головна функція запуску адмін панелі"""
    print("🚀 Запуск адмін панелі...")
    print("=" * 50)
    
    try:
        # Налаштовуємо Django
        settings = setup_admin_only_settings()
        print("✅ Django налаштовано")
        
        # Створюємо URL конфігурацію
        create_admin_urlconf()
        print("✅ URL конфігурація створена")
        
        # Створюємо директорію для сесій
        sessions_dir = os.path.join(os.path.dirname(__file__), 'sessions')
        if not os.path.exists(sessions_dir):
            os.makedirs(sessions_dir)
            print("✅ Директорія сесій створена")
        
        print("\n📊 Інформація про запуск:")
        print(f"   • Порт: 8001")
        print(f"   • Адреса: http://127.0.0.1:8001")
        print(f"   • Адмін панель: http://127.0.0.1:8001/admin-panel/")
        print(f"   • Режим: DEBUG = {settings.DEBUG}")
        print(f"   • Хости: {settings.ALLOWED_HOSTS}")
        
        print("\n🎯 Доступні розділи адмін панелі:")
        print("   • 📊 Дашборд - головна сторінка")
        print("   • ⚙️  Налаштування сайту")
        print("   • 🛍️  Головний товар")
        print("   • 🎨 Кольорові варіанти")
        print("   • 📦 Варіанти кількості")
        print("   • 🛒 Додаткові товари")
        print("   • 🔧 Послуги")
        print("   • 📞 Контактна інформація")
        print("   • ℹ️  Про нас")
        print("   • 📋 Замовлення")
        print("   • 👥 Клієнти")
        print("   • 📦 Склад")
        print("   • 💰 Фінансові звіти")
        
        print("\n" + "=" * 50)
        print("🔄 Запуск сервера...")
        
        # Запускаємо браузер в окремому потоці
        browser_thread = threading.Thread(target=open_browser_delay)
        browser_thread.daemon = True
        browser_thread.start()
        
        # Запускаємо Django сервер
        execute_from_command_line(['manage.py', 'runserver', '127.0.0.1:8001'])
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Сервер зупинено користувачем")
        print("👋 До побачення!")
    except Exception as e:
        print(f"\n❌ Помилка запуску: {e}")
        print("\n🔧 Можливі рішення:")
        print("   • Перевірте чи встановлені всі залежності: pip install -r requirements.txt")
        print("   • Переконайтеся що ви в правильній директорії проекту")
        print("   • Перевірте чи немає конфліктів з іншими серверами на порту 8001")
        sys.exit(1)

if __name__ == '__main__':
    main()
