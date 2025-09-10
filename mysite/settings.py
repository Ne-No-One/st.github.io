"""
Django settings for mysite project.
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-your-secret-key-here'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# settings.py

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '.ngrok-free.app', '*.ngrok.io', '.ngrok.app']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'main',
    'admin_panel',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'mysite.image_protection.PNGProtectionMiddleware',  # Захист PNG зображень
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
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mysite.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
    BASE_DIR / 'assets',
]

# Media files (Images)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR

# Additional static files directories
STATICFILES_DIRS = [
    BASE_DIR / 'static',
    BASE_DIR / 'assets',
    BASE_DIR,  # Add root directory for images
]

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Налаштування для захисту PNG зображень від конвертації
# Забороняємо автоматичну конвертацію PNG в JPG
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB

# Налаштування для статичних файлів
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# Додаткові налаштування для зображень
# Забороняємо стиснення PNG зображень
import mimetypes
mimetypes.add_type('image/png', '.png')
mimetypes.add_type('image/jpeg', '.jpg')
mimetypes.add_type('image/jpeg', '.jpeg')

# Налаштування для захисту прозорих зображень
# Це забезпечує, що PNG файли не будуть оброблятися як звичайні зображення
FILE_UPLOAD_HANDLERS = [
    'django.core.files.uploadhandler.MemoryFileUploadHandler',
    'django.core.files.uploadhandler.TemporaryFileUploadHandler',
]

# Додаткові налаштування для захисту PNG
PNG_PROTECTION = {
    'preserve_alpha_channel': True,
    'no_compression': True,
    'no_conversion': True,
    'quality': 100,  # Максимальна якість для PNG
}

# Налаштування для статичних файлів з захистом PNG
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

# Додаткові налаштування для медіа файлів
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'

# Налаштування для захисту від автоматичної конвертації
# Забороняємо Django обробляти PNG файли
FILE_UPLOAD_PERMISSIONS = 0o644
FILE_UPLOAD_DIRECTORY_PERMISSIONS = 0o755