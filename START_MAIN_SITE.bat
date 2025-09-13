@echo off
chcp 65001 >nul
title Основний сайт - Простий запуск
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   🌸 ОСНОВНИЙ САЙТ 🌸                       ║
echo ║                                                              ║
echo ║                   Простий запуск через                       ║
echo ║                   python manage.py runserver                 ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Перевіряємо чи існує Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python не знайдено! Встановіть Python 3.7+ 
    echo.
    echo 📥 Завантажити Python: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

REM Перевіряємо чи існує файл manage.py
if not exist "manage.py" (
    echo ❌ Файл manage.py не знайдено!
    echo    Переконайтеся що ви в правильній директорії проекту.
    echo.
    pause
    exit /b 1
)

echo ✅ Python знайдено
echo ✅ Файл manage.py знайдено
echo.
echo 🔄 Запуск основного сайту...
echo.
echo 📱 Основний сайт: http://127.0.0.1:8000/
echo ⚙️ Адмін панель: http://127.0.0.1:8000/admin-panel/
echo.
echo Для зупинки натисніть Ctrl+C
echo ==========================================
echo.

REM Запускаємо Django сервер
python manage.py runserver

echo.
echo 👋 Основний сайт закритий
pause
