from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    """Головна сторінка сайту"""
    
    try:
        # Імпортуємо JSONManager
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        # Отримуємо дані з перевіркою наявності на складі
        color_options = json_manager.get_color_options_with_stock()
        quantity_options = json_manager.get_quantity_options()
        additional_products = json_manager.get_additional_products_with_stock()
        services = json_manager.get_services()
        
        # Сортуємо за полем order
        color_options_sorted = sorted(color_options, key=lambda x: x.get('order', 999))
        quantity_options_sorted = sorted(quantity_options, key=lambda x: x.get('order', 999))
        additional_products_sorted = sorted(additional_products, key=lambda x: x.get('order', 999))
        services_sorted = sorted(services, key=lambda x: x.get('order', 999))
        
        # Додаємо quantity_images та дані про склад для кожного кольору
        import json
        for color in color_options_sorted:
            # Конвертуємо quantity_images в JSON строку для JavaScript
            color['quantity_images_json'] = json.dumps(color.get('quantity_images', {}))
            
            # Додаємо інформацію про наявність кількостей для цього кольору
            available_quantities = json_manager.get_quantity_options_with_stock(color['id'])
            color['available_quantities'] = available_quantities
        
        # Створюємо контекст з відсортованими даними
        context = {
            'is_django': True,
            'site_settings': json_manager.get_site_settings(),
            'main_product': json_manager.get_main_product(),
            'color_options': color_options_sorted,
            'quantity_options': quantity_options_sorted,
            'additional_products': additional_products_sorted,
            'additional_settings': json_manager.get_additional_settings(),
            'contact_info': json_manager.get_contact_info(),
            'services': services_sorted,
            'about_section': json_manager.get_about_section(),
        }
        
        return render(request, 'index.html', context)
        
    except Exception as e:
        # Якщо є помилка, показуємо простий текст
        return HttpResponse(f"""
        <html>
        <head><title>Квітковий магазин</title></head>
        <body>
        <h1>🌸 Квітковий магазин</h1>
        <p>Сайт завантажується...</p>
        <p>Помилка: {e}</p>
        <p>Для управління сайтом використовуйте окремий скрипт: python run_admin_panel.py</p>
        </body>
        </html>
        """)


def cart(request):
    """Сторінка кошика"""
    
    try:
        # Імпортуємо JSONManager
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        # Створюємо контекст для сторінки кошика
        context = {
            'is_django': True,
            'site_settings': json_manager.get_site_settings(),
            'contact_info': json_manager.get_contact_info(),
            'page_title': 'Кошик покупок',
        }
        
        return render(request, 'cart.html', context)
        
    except Exception as e:
        # Якщо є помилка, показуємо простий текст
        return HttpResponse(f"""
        <html>
        <head><title>Кошик - Квітковий магазин</title></head>
        <body>
        <h1>🛒 Кошик покупок</h1>
        <p>Сторінка завантажується...</p>
        <p>Помилка: {e}</p>
        <p><a href="/">Повернутися на головну</a></p>
        </body>
        </html>
        """)