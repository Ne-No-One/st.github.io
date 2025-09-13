@echo off
chcp 65001 >nul
title Адмін панель - Запуск
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 АДМІН ПАНЕЛЬ 🚀                       ║
echo ║                                                              ║
echo ║              Швидкий запуск адміністративного                ║
echo ║                     інтерфейсу сайту                         ║
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

REM Перевіряємо чи існує файл run_admin_panel.py
if not exist "run_admin_panel.py" (
    echo ❌ Файл run_admin_panel.py не знайдено!
    echo    Переконайтеся що ви в правильній директорії проекту.
    echo.
    pause
    exit /b 1
)

echo ✅ Python знайдено
echo ✅ Файл запуску знайдено
echo.
echo 🔄 Запуск адмін панелі...
echo.

REM Запускаємо Python скрипт
python run_admin_panel.py

echo.
echo 👋 Адмін панель закрита
pause
