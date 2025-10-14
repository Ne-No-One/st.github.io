#!/usr/bin/env python
"""
Запуск сервера з повною діагностикою
"""
import os
import sys
import subprocess
import time

def run_validation():
    """Запускаємо валідацію системи"""
    print("🔍 Запуск валідації системи...")
    try:
        result = subprocess.run([sys.executable, 'tests/validate_system.py'], 
                              capture_output=True, text=True, encoding='utf-8')
        print(result.stdout)
        if result.stderr:
            print("Помилки:", result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"Помилка валідації: {e}")
        return False

def start_server():
    """Запускаємо сервер"""
    print("🚀 Запуск Django сервера...")
    try:
        # Запускаємо сервер
        process = subprocess.Popen([sys.executable, 'manage.py', 'runserver'], 
                                 stdout=subprocess.PIPE, stderr=subprocess.PIPE, 
                                 text=True, encoding='utf-8')
        
        print("Сервер запущено! Перевірте http://127.0.0.1:8000/")
        print("Для зупинки натисніть Ctrl+C")
        
        # Чекаємо завершення
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Зупинка сервера...")
            process.terminate()
            process.wait()
            
    except Exception as e:
        print(f"Помилка запуску сервера: {e}")

def main():
    """Основна функція"""
    print("🔧 Діагностика та запуск системи")
    print("=" * 50)
    
    # Змінюємо робочу директорію на корінь проєкту
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(project_root)
    
    # Валідуємо систему
    if not run_validation():
        print("❌ Валідація провалилася!")
        print("Перевірте помилки та спробуйте знову.")
        return
    
    print("✅ Валідація пройшла успішно!")
    print("=" * 50)
    
    # Запускаємо сервер
    start_server()

if __name__ == "__main__":
    main()
