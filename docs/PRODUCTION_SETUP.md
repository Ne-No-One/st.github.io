# 🚀 ІНСТРУКЦІЯ З ЗАПУСКУ В PRODUCTION

## 📋 ПЕРЕДУМОВИ

Перед запуском переконайтесь що маєте:
- [ ] VPS/сервер з Ubuntu 20.04+ або іншою Linux системою
- [ ] Доменне ім'я (your-domain.com)
- [ ] SSH доступ до сервера
- [ ] Production токен від Monobank

---

## 🔧 КРОК 1: ПІДГОТОВКА СЕРВЕРА

### 1.1 Оновлення системи
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Встановлення залежностей
```bash
sudo apt install -y python3.10 python3-pip python3-venv nginx git
```

### 1.3 Встановлення certbot (для SSL)
```bash
sudo apt install -y certbot python3-certbot-nginx
```

---

## 📦 КРОК 2: НАЛАШТУВАННЯ ПРОЄКТУ

### 2.1 Клонування репозиторію
```bash
cd /var/www/
sudo git clone https://github.com/your-repo/flower-shop.git
cd flower-shop
```

### 2.2 Створення віртуального середовища
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2.3 Встановлення залежностей
```bash
pip install -r requirements.txt
pip install gunicorn  # WSGI сервер для production
```

### 2.4 Створення .env файлу
```bash
cp env.example .env
nano .env
```

**Заповніть файл .env:**
```env
DEBUG=False
SECRET_KEY=<згенеруйте новий ключ>
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
MONOBANK_PRODUCTION_TOKEN=<ваш production токен>
SITE_URL=https://your-domain.com
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

**Генерація SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 2.5 Оновлення settings.py для production
```bash
nano mysite/settings.py
```

Додайте на початку файлу:
```python
import os
from pathlib import Path
from dotenv import load_dotenv

# Завантажуємо .env
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-only-for-dev')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',')

# HTTPS Settings (тільки для production)
if not DEBUG:
    SECURE_SSL_REDIRECT = os.getenv('SECURE_SSL_REDIRECT', 'True') == 'True'
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
```

Встановіть python-dotenv:
```bash
pip install python-dotenv
```

---

## 🌐 КРОК 3: НАЛАШТУВАННЯ NGINX

### 3.1 Створення конфігураційного файлу
```bash
sudo nano /etc/nginx/sites-available/flower-shop
```

**Вставте конфігурацію:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /var/www/flower-shop/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias /var/www/flower-shop/media/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 20M;
}
```

### 3.2 Активація конфігурації
```bash
sudo ln -s /etc/nginx/sites-available/flower-shop /etc/nginx/sites-enabled/
sudo nginx -t  # Перевірка синтаксису
sudo systemctl restart nginx
```

---

## 🔒 КРОК 4: НАЛАШТУВАННЯ SSL (HTTPS)

### 4.1 Отримання SSL сертифікату
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Certbot автоматично:
- Отримає сертифікат від Let's Encrypt
- Оновить конфігурацію nginx
- Налаштує автоматичне оновлення

### 4.2 Перевірка автоматичного оновлення
```bash
sudo certbot renew --dry-run
```

---

## ⚙️ КРОК 5: НАЛАШТУВАННЯ SYSTEMD (Автозапуск)

### 5.1 Створення systemd service
```bash
sudo nano /etc/systemd/system/flower-shop.service
```

**Вставте конфігурацію:**
```ini
[Unit]
Description=Flower Shop Django Application
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/var/www/flower-shop
Environment="PATH=/var/www/flower-shop/venv/bin"
ExecStart=/var/www/flower-shop/venv/bin/gunicorn \
    --workers 3 \
    --bind 127.0.0.1:8000 \
    --timeout 120 \
    --access-logfile /var/log/flower-shop/access.log \
    --error-logfile /var/log/flower-shop/error.log \
    mysite.wsgi:application

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 5.2 Створення директорії для логів
```bash
sudo mkdir -p /var/log/flower-shop
sudo chown www-data:www-data /var/log/flower-shop
```

### 5.3 Налаштування прав доступу
```bash
sudo chown -R www-data:www-data /var/www/flower-shop
sudo chmod -R 755 /var/www/flower-shop
sudo chmod -R 775 /var/www/flower-shop/sessions
```

### 5.4 Запуск сервісу
```bash
sudo systemctl daemon-reload
sudo systemctl start flower-shop
sudo systemctl enable flower-shop  # Автозапуск при перезавантаженні
sudo systemctl status flower-shop  # Перевірка статусу
```

---

## 🗄️ КРОК 6: НАЛАШТУВАННЯ BACKUP

### 6.1 Створення backup скрипту
```bash
sudo nano /usr/local/bin/backup-flower-shop.sh
```

**Скрипт для backup:**
```bash
#!/bin/bash

# Налаштування
PROJECT_DIR="/var/www/flower-shop"
BACKUP_DIR="/var/backups/flower-shop"
DATE=$(date +%Y%m%d_%H%M%S)

# Створюємо директорію для backup
mkdir -p $BACKUP_DIR

# Backup JSON даних
cp $PROJECT_DIR/data.json $BACKUP_DIR/data_$DATE.json

# Backup сесій (опціонально)
# tar -czf $BACKUP_DIR/sessions_$DATE.tar.gz $PROJECT_DIR/sessions/

# Видаляємо backup старіші 30 днів
find $BACKUP_DIR -name "data_*.json" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/data_$DATE.json"
```

### 6.2 Налаштування прав та автоматизації
```bash
sudo chmod +x /usr/local/bin/backup-flower-shop.sh

# Додаємо в crontab (щоденний backup о 2:00)
sudo crontab -e
```

Додайте рядок:
```cron
0 2 * * * /usr/local/bin/backup-flower-shop.sh
```

---

## 📊 КРОК 7: МОНІТОРИНГ

### 7.1 Перевірка логів
```bash
# Application logs
sudo tail -f /var/log/flower-shop/error.log
sudo tail -f /var/log/flower-shop/access.log

# Nginx logs
sudo tail -f /var/nginx/error.log

# Systemd logs
sudo journalctl -u flower-shop -f
```

### 7.2 Health check
```bash
curl https://your-domain.com/health/
```

Очікуваний результат:
```json
{
  "status": "ok",
  "checks": {
    "json_file": "ok",
    "json_manager": "ok",
    "static_files": "ok",
    "templates": "ok",
    "sessions": "ok"
  }
}
```

---

## 🔥 КРОК 8: FIREWALL

### 8.1 Налаштування UFW
```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
sudo ufw status
```

---

## 🧪 КРОК 9: ТЕСТУВАННЯ

### 9.1 Перевірте всі ендпоінти:
- [ ] https://your-domain.com/ (головна)
- [ ] https://your-domain.com/cart/ (кошик)
- [ ] https://your-domain.com/admin-panel/ (адмін)
- [ ] https://your-domain.com/health/ (health check)

### 9.2 Перевірте функціонал:
- [ ] Вибір кольору та кількості
- [ ] Додавання в кошик
- [ ] Створення замовлення
- [ ] Платіж через Monobank
- [ ] Webhook від Monobank

---

## 🔄 ОНОВЛЕННЯ ПРОЄКТУ

Коли потрібно оновити код:

```bash
cd /var/www/flower-shop
git pull origin main
source venv/bin/activate
pip install -r requirements.txt --upgrade
sudo systemctl restart flower-shop
```

---

## 🆘 TROUBLESHOOTING

### Проблема: 502 Bad Gateway
**Рішення:**
```bash
sudo systemctl status flower-shop
sudo journalctl -u flower-shop -n 50
# Перевірте чи працює gunicorn на порту 8000
sudo netstat -tlnp | grep 8000
```

### Проблема: Статичні файли не завантажуються
**Рішення:**
```bash
# Перевірте права доступу
ls -la /var/www/flower-shop/static/
sudo chown -R www-data:www-data /var/www/flower-shop/static/
```

### Проблема: Помилка з sessions
**Рішення:**
```bash
# Перевірте директорію sessions
ls -la /var/www/flower-shop/sessions/
sudo chmod 775 /var/www/flower-shop/sessions/
sudo chown www-data:www-data /var/www/flower-shop/sessions/
```

---

## 📝 ЧЕКЛИСТ ЗАПУСКУ

- [ ] Сервер налаштовано (Ubuntu, Python, Nginx)
- [ ] Проєкт склоновано та встановлено
- [ ] .env файл створено з production налаштуваннями
- [ ] settings.py оновлено для production
- [ ] Nginx налаштовано
- [ ] SSL сертифікат отримано (HTTPS)
- [ ] Systemd service створено та запущено
- [ ] Backup налаштовано (cron)
- [ ] Firewall налаштовано (UFW)
- [ ] Health check проходить успішно
- [ ] Всі ендпоінти працюють
- [ ] Monobank webhook протестовано

---

## 🎉 ГОТОВО!

Ваш інтернет-магазин квітів запущено в production!

**Доступ:**
- 🌐 Сайт: https://your-domain.com
- ⚙️ Адмін: https://your-domain.com/admin-panel/
- 💚 Health: https://your-domain.com/health/

**Моніторинг:**
```bash
sudo systemctl status flower-shop  # Статус сервісу
sudo tail -f /var/log/flower-shop/error.log  # Логи помилок
```

---

**Підготовлено:** AI Engineering Lead  
**Дата:** 09.10.2025  
**Версія:** 1.0

