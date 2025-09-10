#!/bin/bash

echo "🚀 Запуск Django сервера для адмін панелі..."
echo ""
echo "📋 Інструкції:"
echo "1. Запустіть ngrok в новому терміналі: ngrok http 8000"
echo "2. Відкрийте адмін панель: https://your-url.ngrok-free.app/admin-panel/"
echo "3. Основний сайт: https://your-url.ngrok-free.app/"
echo ""
echo "⚠️  Натисніть Ctrl+C для зупинки сервера"
echo ""

python manage.py runserver 0.0.0.0:8000
