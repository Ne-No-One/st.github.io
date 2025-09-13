@echo off
chcp 65001 >nul
title Основний сайт - Запуск
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   🌸 ОСНОВНИЙ САЙТ 🌸                       ║
echo ║                                                              ║
echo ║              Запуск повнофункціонального сайту                ║
echo ║                     квіткового магазину                      ║
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

REM Перевіряємо чи існує файл run_main_site.py
if not exist "run_main_site.py" (
    echo ❌ Файл run_main_site.py не знайдено!
    echo    Переконайтеся що ви в правильній директорії проекту.
    echo.
    pause
    exit /b 1
)

echo ✅ Python знайдено
echo ✅ Файл запуску знайдено
echo.
echo 🔄 Запуск основного сайту...
echo.

REM Запускаємо Python скрипт
python run_main_site.py

echo.
echo 👋 Основний сайт закритий
pause
