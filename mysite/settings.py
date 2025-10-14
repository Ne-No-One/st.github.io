"""
Django settings for mysite project.
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# ===== ЗАВАНТАЖЕННЯ ENVIRONMENT VARIABLES =====
# Спробуємо завантажити .env файл якщо він існує
try:
    from dotenv import load_dotenv
    env_path = BASE_DIR / '.env'
    if env_path.exists():
        load_dotenv(env_path)
        print("[OK] Environment variables loaded from .env file")
    else:
        print("[WARNING] .env file not found, using defaults")
except ImportError:
    print("[WARNING] python-dotenv not installed, using defaults")

# ===== SECURITY SETTINGS =====

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-your-secret-key-here-CHANGE-THIS-IN-PRODUCTION')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'True') == 'True'

# Allowed hosts - читаємо з environment або використовуємо за замовчуванням
ALLOWED_HOSTS_ENV = os.getenv('ALLOWED_HOSTS', '')
if ALLOWED_HOSTS_ENV:
    ALLOWED_HOSTS = [host.strip() for host in ALLOWED_HOSTS_ENV.split(',') if host.strip()]
else:
    # Для локальної розробки
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '.ngrok-free.app', '*.ngrok.io', '.ngrok.app']

# Site URL для Monobank webhook та redirect
SITE_URL = os.getenv('SITE_URL', 'http://localhost:8000')

# Application definition
INSTALLED_APPS = [
    'django.contrib.messages',
    'django.contrib.sessions',
    'django.contrib.staticfiles',
    'main.apps.MainConfig',  # Використовуємо наш AppConfig
    'admin_panel.apps.AdminPanelConfig',  # Використовуємо наш AppConfig
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'admin_panel.middleware.AdminAuthMiddleware',  # Авторизація адмін-панелі
]

ROOT_URLCONF = 'mysite.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mysite.wsgi.application'

# Database - не використовуємо базу даних, працюємо з JSON
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

# Session configuration - використовуємо файлову систему замість бази даних
SESSION_ENGINE = 'django.contrib.sessions.backends.file'
SESSION_FILE_PATH = BASE_DIR / 'sessions'

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
    BASE_DIR / 'admin_panel' / 'static',  # Статика адмін панелі
]

# Media files (Images)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Logging configuration - simplified
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

# ===== PRODUCTION SECURITY SETTINGS =====
# Ці налаштування активуються тільки коли DEBUG = False

if not DEBUG:
    print("[SECURITY] Production security settings activated")
    
    # HTTPS налаштування
    SECURE_SSL_REDIRECT = os.getenv('SECURE_SSL_REDIRECT', 'True') == 'True'
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    
    # HSTS (HTTP Strict Transport Security)
    SECURE_HSTS_SECONDS = 31536000  # 1 рік
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    
    # Додаткові заголовки безпеки
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    
    # Proxy headers (якщо використовуєте nginx/reverse proxy)
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    
    print("[OK] Production security: SSL redirect, secure cookies, HSTS enabled")
else:
    print("[WARNING] DEBUG mode enabled - production security disabled")

# ===== DATA ENCRYPTION SETTINGS =====
# Налаштування для шифрування чутливих даних клієнтів

# Ключ шифрування (має бути окремий від SECRET_KEY)
ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY', SECRET_KEY[:32])  # Fallback до SECRET_KEY для dev

# Поля які потрібно шифрувати
ENCRYPTED_FIELDS = [
    'customer_phone',
    'customer_email',
    'delivery_address',
    'customer_name'
]

# ===== PRIVACY SETTINGS =====
# Налаштування конфіденційності даних

# Час зберігання персональних даних (в днях)
PERSONAL_DATA_RETENTION_DAYS = int(os.getenv('PERSONAL_DATA_RETENTION_DAYS', '365'))

# Автоматичне видалення старих замовлень
AUTO_DELETE_OLD_ORDERS = os.getenv('AUTO_DELETE_OLD_ORDERS', 'False') == 'True'

# Маскування чутливих даних в логах
MASK_SENSITIVE_DATA = os.getenv('MASK_SENSITIVE_DATA', 'True') == 'True'