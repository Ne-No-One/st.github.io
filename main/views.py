from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import uuid
from datetime import datetime

def home(request):
    """Головна сторінка сайту"""
    
    try:
        # Імпортуємо JSONManager
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        # Отримуємо дані (без перевірки складу)
        color_options = json_manager.get_color_options()
        quantity_options = json_manager.get_quantity_options()
        additional_products = json_manager.get_additional_products()
        services = json_manager.get_services()
        
        # Сортуємо за полем order
        color_options_sorted = sorted(color_options, key=lambda x: x.get('order', 999))
        quantity_options_sorted = sorted(quantity_options, key=lambda x: x.get('order', 999))
        additional_products_sorted = sorted(additional_products, key=lambda x: x.get('order', 999))
        services_sorted = sorted(services, key=lambda x: x.get('order', 999))
        
        # Додаємо quantity_images для кожного кольору
        import json
        for color in color_options_sorted:
            # Конвертуємо quantity_images в JSON строку для JavaScript
            color['quantity_images_json'] = json.dumps(color.get('quantity_images', {}))
        
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

@csrf_exempt
@require_http_methods(["POST"])
def save_order(request):
    """
    API для збереження замовлення на сервері
    """
    try:
        # Отримуємо дані з запиту
        data = json.loads(request.body)
        
        # Валідація обов'язкових полів
        required_fields = ['items', 'total', 'customer', 'delivery', 'payment']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Відсутнє обов\'язкове поле: {field}'}, status=400)
        
        # Імпортуємо JSONManager
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        # Генеруємо унікальний ID та номер замовлення
        order_id = str(uuid.uuid4())
        order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{order_id[:8].upper()}"
        
        # Формуємо замовлення
        order = {
            'id': order_id,
            'order_number': order_number,
            'order_date': datetime.now().isoformat(),
            'delivery_date': data['delivery'].get('date', ''),
            'delivery_time': data['delivery'].get('time', ''),
            'customer_name': f"{data['customer']['firstName']} {data['customer']['lastName']}",
            'customer_phone': data['customer']['phone'],
            'customer_email': data['customer'].get('email', ''),
            'delivery_city': data['delivery']['city'],
            'delivery_address': data['delivery']['address'],
            'delivery_postal_code': data['delivery'].get('postalCode', ''),
            'payment': data['payment'],
            'total_amount': data['total'],
            'currency': 'UAH',
            'items': data['items'],
            'notes': data.get('notes', ''),
            'subscribe_news': data.get('subscribeNews', False),
            'status': 'нове',
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        # Зберігаємо замовлення через JSONManager
        json_manager.save_order(order)
        
        return JsonResponse({
            'success': True,
            'order_id': order_id,
            'order_number': order_number,
            'message': 'Замовлення успішно збережено'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Помилка збереження замовлення: {str(e)}'
        }, status=500)

@require_http_methods(["GET"])
def get_orders(request):
    """
    API для отримання списку замовлень
    """
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        orders = json_manager.get_orders()
        
        return JsonResponse({
            'success': True,
            'orders': orders
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Помилка отримання замовлень: {str(e)}'
        }, status=500)