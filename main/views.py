from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    """Головна сторінка сайту"""
    
    try:
        # Імпортуємо JSONManager
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        # Отримуємо дані та сортуємо за порядком
        color_options = json_manager.get_color_options()
        quantity_options = json_manager.get_quantity_options()
        additional_products = json_manager.get_additional_products()
        services = json_manager.get_services()
        
        # Сортуємо за полем order
        color_options_sorted = sorted(color_options, key=lambda x: x.get('order', 999))
        quantity_options_sorted = sorted(quantity_options, key=lambda x: x.get('order', 999))
        additional_products_sorted = sorted(additional_products, key=lambda x: x.get('order', 999))
        services_sorted = sorted(services, key=lambda x: x.get('order', 999))
        
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