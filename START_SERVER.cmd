@echo off
chcp 65001 > nul
title Django Server - Flower Shop
color 0A

echo.
echo ==========================================
echo    🌸 КВІТКОВИЙ МАГАЗИН 🌸
echo ==========================================
echo.
echo 🚀 Запуск Django сервера...
echo.
echo 📱 Основний сайт: http://127.0.0.1:8000/
echo ⚙️ Адмін панель: http://127.0.0.1:8000/admin-panel/
echo 💚 Health check: http://127.0.0.1:8000/health/
echo.
echo Для зупинки натисніть Ctrl+C
echo ==========================================
echo.

python manage.py runserver

echo.
echo Сервер зупинено.
pause