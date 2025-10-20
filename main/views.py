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
        # Сортуємо кількості за значенням quantity (від меншого до більшого)
        quantity_options_sorted = sorted(quantity_options, key=lambda x: int(x.get('quantity', 0)))
        additional_products_sorted = sorted(additional_products, key=lambda x: x.get('order', 999))
        services_sorted = sorted(services, key=lambda x: x.get('order', 999))
        
        # Зворотна сумісність для in_stock у кількостях
        for qty in quantity_options_sorted:
            if 'in_stock' not in qty:
                qty['in_stock'] = True
        
        # Зворотна сумісність для in_stock у додаткових товарах
        for product in additional_products_sorted:
            if 'in_stock' not in product:
                product['in_stock'] = True
        
        # Додаємо quantity_images, quantity_statuses та quantity_zoom для кожного кольору
        import json
        for color in color_options_sorted:
            # quantity_images - прості URL
            color['quantity_images_json'] = json.dumps(color.get('quantity_images', {}))
            # quantity_statuses - статуси для кожної кількості
            qty_statuses = color.get('quantity_statuses', {})
            color['quantity_statuses_json'] = json.dumps(qty_statuses)
            # quantity_zoom - для зворотньої сумісності та desktop
            zoom_desktop = color.get('quantity_zoom_desktop', color.get('quantity_zoom', {}))
            zoom_mobile = color.get('quantity_zoom_mobile', color.get('quantity_zoom', {}))
            color['quantity_zoom_desktop'] = zoom_desktop
            color['quantity_zoom_mobile'] = zoom_mobile
            
            print(f"🎨 Колір {color.get('name')}: zoom_desktop={zoom_desktop}, zoom_mobile={zoom_mobile}")
            
            # Зворотна сумісність
            if 'in_stock' not in color:
                color['in_stock'] = True
        
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


def glow_test(request):
    """Тестова сторінка з ефектами свічення"""
    return render(request, 'glow_test.html')


def test_zoom(request):
    """Тестова сторінка для налагодження zoom системи"""
    return render(request, 'test_zoom.html')


def test_zoom_admin(request):
    """Тестова сторінка налаштувань zoom (адмін)"""
    return render(request, 'test_zoom_admin.html')


def test_zoom_preview(request):
    """Тестова сторінка перегляду zoom (результат)"""
    return render(request, 'test_zoom_preview.html')


@csrf_exempt
@require_http_methods(["POST"])
def save_test_zoom_settings(request):
    """API для збереження тестових налаштувань zoom"""
    try:
        data = json.loads(request.body)
        
        # Зберігаємо в session
        request.session['test_zoom_settings'] = data
        
        print(f"💾 Збережено налаштування zoom: {len(data)} комбінацій")
        for key, value in list(data.items())[:3]:
            print(f"   - {key}: {value}%")
        
        return JsonResponse({
            'success': True,
            'message': 'Налаштування збережено',
            'count': len(data)
        })
    except Exception as e:
        print(f"❌ Помилка збереження zoom: {e}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["GET"])
def load_test_zoom_settings(request):
    """API для завантаження тестових налаштувань zoom"""
    try:
        settings = request.session.get('test_zoom_settings', {})
        
        print(f"📥 Завантажено налаштування zoom: {len(settings)} комбінацій")
        
        return JsonResponse({
            'success': True,
            'settings': settings
        })
    except Exception as e:
        print(f"❌ Помилка завантаження zoom: {e}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


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
        print("="*60)
        print("📥 Отримано запит на збереження замовлення")
        print("="*60)
        
        # Отримуємо дані з запиту
        data = json.loads(request.body)
        print(f"📋 Дані запиту: {json.dumps(data, indent=2, ensure_ascii=False)}")
        
        # Валідація обов'язкових полів
        required_fields = ['items', 'total', 'customer', 'delivery', 'payment']
        for field in required_fields:
            if field not in data:
                print(f"❌ Відсутнє поле: {field}")
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
        
        # Маскуємо чутливі дані для логування
        from mysite.encryption_utils import mask_order_for_logs, encrypt_order_data
        masked_order = mask_order_for_logs(order.copy())
        
        print(f"💾 Збереження замовлення в базу даних...")
        print(f"📦 Замовлення: {order_number}")
        print(f"👤 Клієнт (маскований): {masked_order.get('customer_name')}")
        print(f"📞 Телефон (маскований): {masked_order.get('customer_phone')}")
        print(f"📧 Email (маскований): {masked_order.get('customer_email')}")
        
        # Шифруємо чутливі дані перед збереженням (якщо увімкнено)
        encrypted_order = encrypt_order_data(order)
        
        result = json_manager.save_order(encrypted_order)
        
        if result:
            print(f"✅ Замовлення {order_number} успішно збережено!")
            return JsonResponse({
                'success': True,
                'order_id': order_id,
                'order_number': order_number,
                'message': 'Замовлення успішно збережено'
            })
        else:
            print(f"❌ Помилка збереження замовлення {order_number}")
            return JsonResponse({
                'success': False,
                'error': 'Помилка збереження замовлення в базу даних'
            }, status=500)
        
    except Exception as e:
        print(f"❌ КРИТИЧНА ПОМИЛКА: {str(e)}")
        import traceback
        print(traceback.format_exc())
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

@require_http_methods(["GET"])
def get_progress_bar_settings(request):
    """
    API: Отримати налаштування прогрес-бару для фронтенду
    """
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        print('🔄 API: Запит налаштувань прогрес-бару')
        settings = json_manager.get_progress_bar_settings()
        
        print('📊 API: Налаштування отримано:')
        print(f'   - Увімкнено: {settings.get("enabled")}')
        print(f'   - Кількість етапів: {len(settings.get("milestones", []))}')
        
        if settings.get('milestones'):
            for idx, m in enumerate(settings['milestones'], 1):
                print(f'   📌 Етап {idx}: {m.get("amount")}₴ - {m.get("title")}')
                print(f'      Знижка: {m.get("discount_percent")}%')
                print(f'      Доставка: {m.get("free_shipping")}')
                print(f'      Подарунок: {m.get("gift")}')
        
        response_data = {
            'success': True,
            'settings': settings
        }
        print('✅ API: Відповідь відправлена:', response_data)
        
        return JsonResponse(response_data)
    except Exception as e:
        print(f'❌ API: Помилка: {e}')
        import traceback
        traceback.print_exc()
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@require_http_methods(["GET"])
def get_delivery_cities(request):
    """
    API: Отримати список міст доставки для фронтенду
    """
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        # Повертаємо тільки активні міста
        cities = json_manager.get_active_delivery_cities()
        
        return JsonResponse({
            'success': True,
            'cities': cities
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def track_visit(request):
    """
    API: Записати візит користувача
    """
    try:
        data = json.loads(request.body)
        
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        visit_id = json_manager.track_visit(data)
        
        if visit_id:
            return JsonResponse({
                'success': True,
                'visit_id': visit_id
            })
        else:
            return JsonResponse({
                'success': False,
                'error': 'Помилка запису візиту'
            }, status=500)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

# ===== ТЕСТОВА СИМУЛЯЦІЯ ОПЛАТИ =====

def test_payment_simulation(request):
    """
    Сторінка симуляції оплати для тестування
    """
    order_id = request.GET.get('order_id', str(uuid.uuid4())[:8])
    amount = request.GET.get('amount', '1000')
    items_count = request.GET.get('items', '1')
    
    return render(request, 'payment/test_payment_simulation.html', {
        'order_id': order_id,
        'amount': amount,
        'items_count': items_count
    })

def test_payment_success(request):
    """
    Сторінка успішної тестової оплати
    """
    order_id = request.GET.get('order_id', 'TEST-ORDER')
    amount = request.GET.get('amount', '0')
    
    return render(request, 'payment/test_success.html', {
        'order_id': order_id,
        'amount': amount,
        'transaction_id': f'TEST-{uuid.uuid4().hex[:12].upper()}',
        'timestamp': datetime.now().strftime('%d.%m.%Y %H:%M:%S')
    })

def test_payment_failure(request):
    """
    Сторінка помилки тестової оплати
    """
    order_id = request.GET.get('order_id', 'TEST-ORDER')
    error = request.GET.get('error', 'unknown')
    
    error_messages = {
        'insufficient_funds': 'Недостатньо коштів на рахунку',
        'timeout': 'Перевищено час очікування відповіді від банку',
        'card_blocked': 'Картка заблокована',
        'invalid_card': 'Невірні дані картки',
        'unknown': 'Невідома помилка'
    }
    
    return render(request, 'payment/test_failure.html', {
        'order_id': order_id,
        'error_code': error,
        'error_message': error_messages.get(error, error_messages['unknown']),
        'timestamp': datetime.now().strftime('%d.%m.%Y %H:%M:%S')
    })

def test_payment_3ds(request):
    """
    Сторінка симуляції 3D Secure
    """
    order_id = request.GET.get('order_id', 'TEST-ORDER')
    
    return render(request, 'payment/card_payment_3ds.html', {
        'order_id': order_id,
        'redirect_url': f'/payment/test/success/?order_id={order_id}&amount=1000'
    })

def test_card_payment(request):
    """
    Сторінка тестової оплати карткою
    """
    order_id = request.GET.get('order_id', str(uuid.uuid4())[:8])
    amount = request.GET.get('amount', '1000')
    items_count = request.GET.get('items', '1')
    
    return render(request, 'payment/test_card_payment.html', {
        'order_id': order_id,
        'amount': amount,
        'items_count': items_count
    })

def test_apple_pay(request):
    """
    Сторінка тестової оплати Apple Pay
    """
    order_id = request.GET.get('order_id', str(uuid.uuid4())[:8])
    amount = request.GET.get('amount', '1000')
    items_count = request.GET.get('items', '1')
    
    return render(request, 'payment/test_apple_pay.html', {
        'order_id': order_id,
        'amount': amount,
        'items_count': items_count
    })

def test_google_pay(request):
    """
    Сторінка тестової оплати Google Pay
    """
    order_id = request.GET.get('order_id', str(uuid.uuid4())[:8])
    amount = request.GET.get('amount', '1000')
    items_count = request.GET.get('items', '1')
    
    return render(request, 'payment/test_google_pay.html', {
        'order_id': order_id,
        'amount': amount,
        'items_count': items_count
    })