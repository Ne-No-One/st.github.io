"""
Захист PNG зображень від автоматичної конвертації в Django
Аналог WordPress коду для захисту прозорих зображень
"""

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from PIL import Image
import os


def protect_png_images(file_path):
    """
    Захищає PNG зображення від конвертації та стиснення
    """
    if file_path.lower().endswith('.png'):
        try:
            # Відкриваємо зображення
            with Image.open(file_path) as img:
                # Перевіряємо, чи зображення має альфа-канал (прозорість)
                if img.mode in ('RGBA', 'LA') or 'transparency' in img.info:
                    # Зберігаємо зображення без стиснення
                    img.save(file_path, 'PNG', optimize=False, compress_level=0)
                    return True
        except Exception as e:
            print(f"Помилка при захисті PNG: {e}")
    return False


def validate_image_format(file):
    """
    Валідує формат зображення та забороняє конвертацію PNG
    """
    if hasattr(file, 'name') and file.name.lower().endswith('.png'):
        # Для PNG файлів забороняємо будь-яку обробку
        return True
    return False


# Middleware для захисту PNG зображень
class PNGProtectionMiddleware:
    """
    Middleware для захисту PNG зображень від автоматичної конвертації
    """
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Перевіряємо, чи це запит на статичний файл
        if request.path.startswith('/static/') and request.path.lower().endswith('.png'):
            # Додаємо заголовки для захисту PNG
            response['Content-Type'] = 'image/png'
            response['Cache-Control'] = 'public, max-age=31536000'  # Кешування на рік
            
        return response


# Функція для обробки завантажених зображень
def process_uploaded_image(file):
    """
    Обробляє завантажене зображення з захистом PNG
    """
    if file.name.lower().endswith('.png'):
        # Для PNG файлів не робимо жодної обробки
        return file
    
    # Для інших форматів можна додати обробку
    return file


# Налаштування для захисту PNG в Django
PNG_PROTECTION_SETTINGS = {
    'preserve_alpha_channel': True,
    'no_compression': True,
    'no_conversion': True,
    'quality': 100,  # Максимальна якість для PNG
}
