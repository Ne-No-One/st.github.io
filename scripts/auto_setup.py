#!/usr/bin/env python
"""
Автоматичне налаштування та запуск системи
"""
import os
import sys
import subprocess
import time

def run_command(command, description):
    """Виконуємо команду з описом"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, encoding='utf-8')
        if result.returncode == 0:
            print(f"   ✅ {description} - успішно")
            if result.stdout.strip():
                print(f"   📋 Вивід: {result.stdout.strip()}")
            return True
        else:
            print(f"   ❌ {description} - помилка")
            if result.stderr.strip():
                print(f"   📋 Помилка: {result.stderr.strip()}")
            return False
    except Exception as e:
        print(f"   ❌ {description} - виняток: {e}")
        return False

def check_python():
    """Перевіряємо Python"""
    print("🐍 Перевірка Python...")
    try:
        result = subprocess.run([sys.executable, '--version'], capture_output=True, text=True)
        print(f"   ✅ Python версія: {result.stdout.strip()}")
        return True
    except Exception as e:
        print(f"   ❌ Помилка Python: {e}")
        return False

def setup_system():
    """Налаштовуємо систему"""
    print("🚀 Автоматичне налаштування системи")
    print("=" * 60)
    
    # Перевіряємо Python
    if not check_python():
        return False
    
    # Налаштовуємо систему через Django команду
    if not run_command(f"{sys.executable} manage.py setup_system", "Налаштування системи"):
        print("⚠️ Помилка налаштування, але продовжуємо...")
    
    # Запускаємо валідацію
    if not run_command(f"{sys.executable} manage.py validate_system", "Валідація системи"):
        print("⚠️ Помилка валідації, але продовжуємо...")
    
    print("=" * 60)
    print("✅ Налаштування завершено!")
    
    return True

def start_server():
    """Запускаємо сервер"""
    print("🚀 Запуск Django сервера...")
    print("=" * 60)
    
    try:
        # Запускаємо сервер
        process = subprocess.Popen(
            [sys.executable, 'manage.py', 'runserver'],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding='utf-8',
            universal_newlines=True
        )
        
        print("🌐 Сервер запущено!")
        print("📱 Основний сайт: http://127.0.0.1:8000/")
        print("⚙️ Адмін панель: http://127.0.0.1:8000/admin-panel/")
        print("💚 Health check: http://127.0.0.1:8000/health/")
        print("=" * 60)
        print("Для зупинки натисніть Ctrl+C")
        print("=" * 60)
        
        # Відображаємо логи сервера
        try:
            while True:
                output = process.stdout.readline()
                if output == '' and process.poll() is not None:
                    break
                if output:
                    print(output.strip())
        except KeyboardInterrupt:
            print("\n🛑 Зупинка сервера...")
            process.terminate()
            process.wait()
            print("✅ Сервер зупинено")
            
    except Exception as e:
        print(f"❌ Помилка запуску сервера: {e}")

def main():
    """Основна функція"""
    print("🎯 Автоматичне налаштування та запуск квіткового магазину")
    print("=" * 60)
    
    # Змінюємо робочу директорію на корінь проєкту
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(project_root)
    
    # Перевіряємо чи ми в правильній директорії
    if not os.path.exists('manage.py'):
        print("❌ Файл manage.py не знайдено!")
        print("   Переконайтеся, що ви в правильній директорії проекту")
        return
    
    # Налаштовуємо систему
    if not setup_system():
        print("❌ Критична помилка налаштування!")
        return
    
    # Запускаємо сервер
    start_server()

if __name__ == "__main__":
    main()
