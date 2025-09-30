"""
Платіжна система Monobank
"""
import json
import requests
import uuid
import time
from datetime import datetime, timedelta
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.shortcuts import render
import logging
from monobank_config import MONOBANK_CONFIG

logger = logging.getLogger(__name__)

def create_monobank_invoice(request):
    """
    Створення рахунку для оплати через Monobank
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Метод не дозволений'}, status=405)
    
    try:
        # Отримуємо дані з запиту
        data = json.loads(request.body)
        
        # Перевіряємо чи увімкнений тестовий режим
        if MONOBANK_CONFIG.get('test_mode', False) and MONOBANK_CONFIG.get('simulate_success', False):
            print("🧪 Тестовий режим: симулюємо повний платіжний процес")
            
            # Генеруємо тестові дані
            invoice_id = str(uuid.uuid4())
            order_id = data.get('order_id', str(uuid.uuid4()))
            amount = data.get('amount', 0)
            
            # Симулюємо всі етапи реального платіжного процесу
            
            # 1. Валідація даних (як у реальному Monobank)
            print("🔍 Етап 1: Валідація даних замовлення...")
            if not amount or amount <= 0:
                return JsonResponse({
                    'success': False,
                    'error': 'Некоректна сума замовлення',
                    'errorCode': 'INVALID_AMOUNT',
                    'test_mode': True
                })
            
            if amount > 1000000:  # Максимальна сума
                return JsonResponse({
                    'success': False,
                    'error': 'Перевищено максимальну суму замовлення',
                    'errorCode': 'AMOUNT_TOO_LARGE',
                    'test_mode': True
                })
            
            # 2. Перевірка доступності сервісу
            print("🌐 Етап 2: Перевірка доступності платіжного сервісу...")
            import random
            if random.random() < 0.05:  # 5% шанс недоступності
                return JsonResponse({
                    'success': False,
                    'error': 'Платіжний сервіс тимчасово недоступний',
                    'errorCode': 'SERVICE_UNAVAILABLE',
                    'test_mode': True
                })
            
            # 3. Створення сесії платежу
            print("💳 Етап 3: Створення сесії платежу...")
            import time
            time.sleep(1.5)  # Симулюємо час обробки
            
            # 4. Генерація URL для оплати
            print("🔗 Етап 4: Генерація URL для оплати...")
            payment_url = f'/test-payment-success/?invoiceId={invoice_id}&orderId={order_id}&amount={amount}'
            
            # 5. Збереження в базі даних (симуляція)
            print("💾 Етап 5: Збереження інформації про платіж...")
            
            # 6. Відправка webhook (симуляція)
            print("📡 Етап 6: Відправка webhook...")
            
            # 7. Повернення результату
            print("✅ Етап 7: Повернення результату клієнту...")
            
            return JsonResponse({
                'success': True,
                'invoiceId': invoice_id,
                'pageUrl': payment_url,
                'amount': amount,
                'currency': 'UAH',
                'status': 'created',
                'createdDate': datetime.now().isoformat(),
                'expiresAt': (datetime.now() + timedelta(hours=1)).isoformat(),
                'test_mode': True,
                'simulation_steps': [
                    'Валідація даних замовлення',
                    'Перевірка доступності сервісу',
                    'Створення сесії платежу',
                    'Генерація URL для оплати',
                    'Збереження інформації про платіж',
                    'Відправка webhook',
                    'Повернення результату клієнту'
                ]
            })
        
        # Валідація обов'язкових полів
        required_fields = ['amount']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Відсутнє обов\'язкове поле: {field}'}, status=400)
        
        # Формуємо дані для Monobank API
        amount = int(data['amount'] * 100)  # Конвертуємо в копійки
        
        # Базові дані рахунку
        monobank_data = {
            "amount": amount,
            "ccy": data.get('ccy', MONOBANK_CONFIG['currency_code']),
        }
        
        # Додаємо merchantPaymInfo якщо вказано
        if 'merchantPaymInfo' in data:
            monobank_data['merchantPaymInfo'] = data['merchantPaymInfo']
        else:
            # Формуємо базові дані замовлення
            reference = data.get('reference', str(uuid.uuid4()))
            destination = data.get('destination', 'Оплата замовлення')
            
            # Формуємо корзину товарів якщо вказано
            basket_order = []
            if 'items' in data:
                for item in data['items']:
                    basket_item = {
                        "name": item.get('name', item.get('title', 'Товар')),
                        "qty": item.get('qty', item.get('quantity', 1)),
                        "sum": int(item.get('sum', item.get('price', 0) * 100)),  # В копійках
                        "total": int(item.get('total', item.get('price', 0) * item.get('quantity', 1) * 100)),
                        "icon": item.get('icon'),
                        "unit": item.get('unit', 'шт.'),
                        "code": item.get('code', str(uuid.uuid4())),
                        "barcode": item.get('barcode'),
                        "header": item.get('header'),
                        "footer": item.get('footer'),
                        "tax": item.get('tax', []),
                        "uktzed": item.get('uktzed'),
                        "splitReceiverId": item.get('splitReceiverId'),
                        "discounts": item.get('discounts', [])
                    }
                    basket_order.append(basket_item)
            
            monobank_data['merchantPaymInfo'] = {
                "reference": reference,
                "destination": destination,
                "comment": data.get('comment', ''),
                "customerEmails": data.get('customerEmails', []),
                "discounts": data.get('discounts', []),
                "basketOrder": basket_order
            }
        
        # Додаємо опціональні поля
        if 'redirectUrl' in data:
            monobank_data['redirectUrl'] = data['redirectUrl']
        else:
            monobank_data['redirectUrl'] = MONOBANK_CONFIG['redirect_url']
        
        if 'webHookUrl' in data:
            monobank_data['webHookUrl'] = data['webHookUrl']
        else:
            monobank_data['webHookUrl'] = MONOBANK_CONFIG['webhook_url']
        
        if 'validity' in data:
            monobank_data['validity'] = data['validity']
        else:
            monobank_data['validity'] = MONOBANK_CONFIG['validity_seconds']
        
        if 'paymentType' in data:
            monobank_data['paymentType'] = data['paymentType']
        else:
            monobank_data['paymentType'] = MONOBANK_CONFIG['payment_type']
        
        # Додаємо додаткові опції
        if 'qrId' in data:
            monobank_data['qrId'] = data['qrId']
        
        if 'code' in data:
            monobank_data['code'] = data['code']
        
        if 'saveCardData' in data:
            monobank_data['saveCardData'] = data['saveCardData']
        
        if 'agentFeePercent' in data:
            monobank_data['agentFeePercent'] = data['agentFeePercent']
        
        if 'tipsEmployeeId' in data:
            monobank_data['tipsEmployeeId'] = data['tipsEmployeeId']
        
        if 'displayType' in data:
            monobank_data['displayType'] = data['displayType']
        
        # Заголовки для запиту
        headers = {
            'X-Token': MONOBANK_CONFIG['token'],
            'Content-Type': 'application/json'
        }
        
        # Додаємо CMS заголовки якщо вказано
        if 'cms' in data:
            headers['X-Cms'] = data['cms']
        if 'cmsVersion' in data:
            headers['X-Cms-Version'] = data['cmsVersion']
        
        # Відправляємо запит до Monobank
        response = requests.post(
            MONOBANK_CONFIG['api_url'],
            json=monobank_data,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return JsonResponse({
                'success': True,
                'invoiceId': result.get('invoiceId'),
                'pageUrl': result.get('pageUrl'),
                'message': 'Рахунок успішно створено'
            })
        else:
            logger.error(f'Monobank API error: {response.status_code} - {response.text}')
            try:
                error_data = response.json()
                error_code = error_data.get('errCode', 'UNKNOWN_ERROR')
                error_text = error_data.get('errText', 'Невідома помилка')
            except:
                error_code = 'UNKNOWN_ERROR'
                error_text = response.text
            
            return JsonResponse({
                'success': False,
                'error': 'Помилка створення рахунку',
                'errorCode': error_code,
                'errorText': error_text,
                'details': response.text
            }, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Невірний JSON'}, status=400)
    except Exception as e:
        logger.error(f'Error creating Monobank invoice: {str(e)}')
        return JsonResponse({'error': 'Внутрішня помилка сервера'}, status=500)

def create_cart_invoice(request):
    """
    Створення рахунку з кошика для оплати через Monobank
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Метод не дозволений'}, status=405)
    
    try:
        # Отримуємо дані з запиту
        data = json.loads(request.body)
        
        # Валідація обов'язкових полів
        required_fields = ['amount', 'items']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Відсутнє обов\'язкове поле: {field}'}, status=400)
        
        # Формуємо дані для Monobank API
        amount = int(data['amount'] * 100)  # Конвертуємо в копійки
        
        # Формуємо корзину товарів для Monobank
        basket_order = []
        for item in data['items']:
            basket_item = {
                "name": item.get('name', 'Товар'),
                "qty": item.get('quantity', 1),
                "sum": int(item.get('price', 0) * 100),  # В копійках
                "total": int(item.get('price', 0) * item.get('quantity', 1) * 100),
                "icon": item.get('icon'),
                "unit": item.get('unit', 'шт.'),
                "code": item.get('code', str(uuid.uuid4())),
                "barcode": item.get('barcode'),
                "header": item.get('header'),
                "footer": item.get('footer'),
                "tax": item.get('tax', []),
                "uktzed": item.get('uktzed'),
                "splitReceiverId": item.get('splitReceiverId'),
                "discounts": item.get('discounts', [])
            }
            basket_order.append(basket_item)
        
        # Формуємо дані для запиту до Monobank
        monobank_data = {
            "amount": amount,
            "ccy": data.get('ccy', MONOBANK_CONFIG['currency_code']),
            "merchantPaymInfo": {
                "reference": data.get('reference', f"online_{data.get('order_id', int(time.time()))}"),
                "destination": data.get('destination', f"Оплата кошика ({len(data['items'])} товарів)"),
                "comment": data.get('comment', ''),
                "customerEmails": data.get('customerEmails', []),
                "discounts": data.get('discounts', []),
                "basketOrder": basket_order
            },
            "redirectUrl": data.get('redirectUrl', MONOBANK_CONFIG['redirect_url']),
            "webHookUrl": data.get('webHookUrl', MONOBANK_CONFIG['webhook_url']),
            "validity": data.get('validity', MONOBANK_CONFIG['validity_seconds']),
            "paymentType": data.get('paymentType', MONOBANK_CONFIG['payment_type'])
        }
        
        # Додаємо додаткові опції
        if 'qrId' in data:
            monobank_data['qrId'] = data['qrId']
        
        if 'code' in data:
            monobank_data['code'] = data['code']
        
        if 'saveCardData' in data:
            monobank_data['saveCardData'] = data['saveCardData']
        
        if 'agentFeePercent' in data:
            monobank_data['agentFeePercent'] = data['agentFeePercent']
        
        if 'tipsEmployeeId' in data:
            monobank_data['tipsEmployeeId'] = data['tipsEmployeeId']
        
        if 'displayType' in data:
            monobank_data['displayType'] = data['displayType']
        
        # Заголовки для запиту
        headers = {
            'X-Token': MONOBANK_CONFIG['token'],
            'Content-Type': 'application/json'
        }
        
        # Додаємо CMS заголовки якщо вказано
        if 'cms' in data:
            headers['X-Cms'] = data['cms']
        if 'cmsVersion' in data:
            headers['X-Cms-Version'] = data['cmsVersion']
        
        # Відправляємо запит до Monobank
        response = requests.post(
            MONOBANK_CONFIG['api_url'],
            json=monobank_data,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return JsonResponse({
                'success': True,
                'invoiceId': result.get('invoiceId'),
                'pageUrl': result.get('pageUrl'),
                'message': 'Рахунок з кошика успішно створено'
            })
        else:
            logger.error(f'Monobank cart invoice API error: {response.status_code} - {response.text}')
            try:
                error_data = response.json()
                error_code = error_data.get('errCode', 'UNKNOWN_ERROR')
                error_text = error_data.get('errText', 'Невідома помилка')
            except:
                error_code = 'UNKNOWN_ERROR'
                error_text = response.text
            
            return JsonResponse({
                'success': False,
                'error': 'Помилка створення рахунку з кошика',
                'errorCode': error_code,
                'errorText': error_text,
                'details': response.text
            }, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Невірний JSON'}, status=400)
    except Exception as e:
        logger.error(f'Error creating cart invoice: {str(e)}')
        return JsonResponse({'error': 'Внутрішня помилка сервера'}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def monobank_webhook(request):
    """
    Webhook для обробки статусів платежів від Monobank
    """
    try:
        data = json.loads(request.body)
        
        # Логуємо отримані дані
        logger.info(f'Monobank webhook received: {data}')
        
        # Обробляємо різні статуси платежу
        status = data.get('status')
        invoice_id = data.get('invoiceId')
        
        if status == 'success':
            # Платіж успішний
            logger.info(f'Payment successful for invoice: {invoice_id}')
            
            # Оновлюємо статус замовлення
            try:
                from json_manager import JSONManager
                json_manager = JSONManager()
                
                # Знаходимо замовлення за order_id з reference
                reference = data.get('reference', '')
                order_id = reference.replace('card_', '').replace('online_', '')
                
                # Спробуємо знайти замовлення за ID
                order = json_manager.get_order_by_id(order_id)
                if order:
                    json_manager.update_order_status(order['id'], 'оплачено')
                    logger.info(f'Order {order.get("order_number")} status updated to "оплачено"')
                else:
                    # Якщо не знайшли за ID, шукаємо по reference
                    orders = json_manager.get_orders()
                    for order in orders:
                        if order.get('id') in reference:
                            json_manager.update_order_status(order['id'], 'оплачено')
                            logger.info(f'Order {order.get("order_number")} status updated to "оплачено"')
                            break
                        
            except Exception as e:
                logger.error(f'Error updating order status: {e}')
            
        elif status == 'failure':
            # Платіж невдалий
            logger.warning(f'Payment failed for invoice: {invoice_id}')
            
            # Оновлюємо статус замовлення
            try:
                from json_manager import JSONManager
                json_manager = JSONManager()
                
                # Знаходимо замовлення за reference
                orders = json_manager.get_orders()
                for order in orders:
                    if order.get('id') in data.get('reference', ''):
                        json_manager.update_order_status(order['id'], 'оплата невдала')
                        logger.info(f'Order {order.get("order_number")} status updated to "оплата невдала"')
                        break
                        
            except Exception as e:
                logger.error(f'Error updating order status: {e}')
            
        elif status == 'processing':
            # Платіж в обробці
            logger.info(f'Payment processing for invoice: {invoice_id}')
            
        elif status == 'expired':
            # Платіж прострочений
            logger.warning(f'Payment expired for invoice: {invoice_id}')
            
            # Оновлюємо статус замовлення
            try:
                from json_manager import JSONManager
                json_manager = JSONManager()
                
                # Знаходимо замовлення за reference
                orders = json_manager.get_orders()
                for order in orders:
                    if order.get('id') in data.get('reference', ''):
                        json_manager.update_order_status(order['id'], 'оплата прострочена')
                        logger.info(f'Order {order.get("order_number")} status updated to "оплата прострочена"')
                        break
                        
            except Exception as e:
                logger.error(f'Error updating order status: {e}')
        
        return HttpResponse('OK', status=200)
        
    except json.JSONDecodeError:
        logger.error('Invalid JSON in webhook')
        return HttpResponse('Invalid JSON', status=400)
    except Exception as e:
        logger.error(f'Webhook error: {str(e)}')
        return HttpResponse('Error', status=500)

def payment_success(request):
    """
    Сторінка успішної оплати
    """
    return render(request, 'payment/success.html', {
        'title': 'Оплата успішна',
        'message': 'Ваше замовлення успішно оплачено!'
    })

def payment_failure(request):
    """
    Сторінка невдалої оплати
    """
    return render(request, 'payment/failure.html', {
        'title': 'Помилка оплати',
        'message': 'Сталася помилка при оплаті. Спробуйте ще раз.'
    })

def get_invoice_status(request, invoice_id):
    """
    Отримання статусу рахунку через Monobank API
    """
    try:
        # Перевіряємо чи увімкнений тестовий режим
        if MONOBANK_CONFIG.get('test_mode', False) and MONOBANK_CONFIG.get('simulate_success', False):
            print(f"🧪 Тестовий режим: симулюємо перевірку статусу рахунку {invoice_id}")
            
            # Симулюємо всі етапи перевірки статусу
            
            # 1. Валідація invoice_id
            print("🔍 Етап 1: Валідація ID рахунку...")
            if not invoice_id or len(invoice_id) < 10:
                return JsonResponse({
                    'success': False,
                    'error': 'Невірний ID рахунку',
                    'errorCode': 'INVALID_INVOICE_ID',
                    'test_mode': True
                })
            
            # 2. Перевірка існування рахунку
            print("🔍 Етап 2: Перевірка існування рахунку...")
            import random
            if random.random() < 0.02:  # 2% шанс що рахунок не знайдено
                return JsonResponse({
                    'success': False,
                    'error': 'Рахунок не знайдено',
                    'errorCode': 'INVOICE_NOT_FOUND',
                    'test_mode': True
                })
            
            # 3. Симуляція затримки API
            print("⏱️ Етап 3: Очікування відповіді від платіжного сервісу...")
            import time
            time.sleep(0.8)
            
            # 4. Генерація статусу (реалістичні ймовірності)
            print("🎲 Етап 4: Визначення поточного статусу платежу...")
            statuses = ['processing', 'success', 'failure', 'expired', 'cancelled']
            weights = [25, 60, 10, 3, 2]  # 25% обробка, 60% успіх, 10% помилка, 3% застарілий, 2% скасований
            status = random.choices(statuses, weights=weights)[0]
            
            # 5. Генерація деталей відповідно до статусу
            print(f"📊 Етап 5: Генерація деталей для статусу '{status}'...")
            
            base_data = {
                'success': True,
                'invoiceId': invoice_id,
                'amount': random.randint(100, 10000),
                'ccy': 980,
                'createdDate': (datetime.now() - timedelta(minutes=random.randint(1, 60))).isoformat(),
                'modifiedDate': datetime.now().isoformat(),
                'test_mode': True,
                'simulation_steps': [
                    'Валідація ID рахунку',
                    'Перевірка існування рахунку',
                    'Очікування відповіді від платіжного сервісу',
                    f'Визначення поточного статусу платежу: {status}',
                    'Генерація деталей відповідно до статусу'
                ]
            }
            
            if status == 'success':
                base_data.update({
                    'status': 'success',
                    'finalAmount': base_data['amount'],
                    'paymentInfo': {
                        'maskedPan': f'{random.randint(1000, 9999)}****{random.randint(1000, 9999)}',
                        'approvalCode': f'{random.randint(100000, 999999)}',
                        'rrn': str(uuid.uuid4())[:12].upper(),
                        'terminal': f'TEST{random.randint(100, 999)}',
                        'authCode': str(uuid.uuid4())[:8].upper(),
                        'transactionId': str(uuid.uuid4()),
                        'processedAt': datetime.now().isoformat()
                    }
                })
            elif status == 'failure':
                failure_reasons = [
                    'Недостатньо коштів на рахунку',
                    'Картка заблокована',
                    'Невірний PIN-код',
                    'Перевищено ліміт операцій',
                    'Тимчасово недоступно'
                ]
                base_data.update({
                    'status': 'failure',
                    'failureReason': random.choice(failure_reasons),
                    'errCode': f'PAYMENT_FAILED_{random.randint(100, 999)}'
                })
            elif status == 'processing':
                base_data.update({
                    'status': 'processing',
                    'processingInfo': {
                        'estimatedTime': random.randint(30, 300),
                        'stage': random.choice(['validating', 'authorizing', 'confirming'])
                    }
                })
            elif status == 'expired':
                base_data.update({
                    'status': 'expired',
                    'expiredAt': (datetime.now() - timedelta(minutes=random.randint(5, 60))).isoformat()
                })
            elif status == 'cancelled':
                base_data.update({
                    'status': 'cancelled',
                    'cancelledAt': datetime.now().isoformat(),
                    'cancelReason': 'Користувач скасував операцію'
                })
            
            print(f"✅ Етап 6: Повернення результату зі статусом '{status}'...")
            return JsonResponse(base_data)
        
        # Заголовки для запиту
        headers = {
            'X-Token': MONOBANK_CONFIG['token']
        }
        
        # URL для запиту статусу
        status_url = f"{MONOBANK_CONFIG['status_url']}?invoiceId={invoice_id}"
        
        # Відправляємо запит до Monobank
        response = requests.get(status_url, headers=headers, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            return JsonResponse({
                'success': True,
                'status': result.get('status'),
                'invoiceId': result.get('invoiceId'),
                'amount': result.get('amount'),
                'ccy': result.get('ccy'),
                'finalAmount': result.get('finalAmount'),
                'createdDate': result.get('createdDate'),
                'modifiedDate': result.get('modifiedDate'),
                'reference': result.get('reference'),
                'destination': result.get('destination'),
                'failureReason': result.get('failureReason'),
                'errCode': result.get('errCode'),
                'paymentInfo': result.get('paymentInfo'),
                'walletData': result.get('walletData'),
                'tipsInfo': result.get('tipsInfo'),
                'cancelList': result.get('cancelList', [])
            })
        elif response.status_code == 404:
            return JsonResponse({
                'success': False,
                'error': 'Рахунок не знайдено',
                'code': 'INVOICE_NOT_FOUND'
            }, status=404)
        else:
            logger.error(f'Monobank status API error: {response.status_code} - {response.text}')
            return JsonResponse({
                'success': False,
                'error': 'Помилка отримання статусу рахунку',
                'details': response.text
            }, status=400)
            
    except Exception as e:
        logger.error(f'Error getting invoice status: {str(e)}')
        return JsonResponse({
            'success': False,
            'error': 'Внутрішня помилка сервера'
        }, status=500)

def payment_status(request, invoice_id=None):
    """
    Сторінка статусу замовлення
    """
    if request.method == 'GET' and invoice_id:
        # Отримуємо статус рахунку
        try:
            headers = {
                'X-Token': MONOBANK_CONFIG['token']
            }
            
            status_url = f"{MONOBANK_CONFIG['status_url']}?invoiceId={invoice_id}"
            response = requests.get(status_url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                status_data = response.json()
                return render(request, 'payment/status.html', {
                    'title': 'Статус замовлення',
                    'invoice_id': invoice_id,
                    'status_data': status_data,
                    'status': status_data.get('status'),
                    'amount': status_data.get('amount'),
                    'final_amount': status_data.get('finalAmount'),
                    'created_date': status_data.get('createdDate'),
                    'modified_date': status_data.get('modifiedDate'),
                    'destination': status_data.get('destination'),
                    'failure_reason': status_data.get('failureReason'),
                    'payment_info': status_data.get('paymentInfo'),
                    'success': True
                })
            else:
                return render(request, 'payment/status.html', {
                    'title': 'Статус замовлення',
                    'invoice_id': invoice_id,
                    'error': 'Не вдалося отримати статус замовлення',
                    'success': False
                })
        except Exception as e:
            logger.error(f'Error in payment_status view: {str(e)}')
            return render(request, 'payment/status.html', {
                'title': 'Статус замовлення',
                'invoice_id': invoice_id,
                'error': 'Помилка отримання статусу замовлення',
                'success': False
            })
    else:
        # Форма для введення ID рахунку
        return render(request, 'payment/status.html', {
            'title': 'Перевірка статусу замовлення',
            'show_form': True
        })

def cancel_invoice(request):
    """
    Скасування рахунку через Monobank API
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Метод не дозволений'}, status=405)
    
    try:
        # Отримуємо дані з запиту
        data = json.loads(request.body)
        
        # Перевіряємо чи увімкнений тестовий режим
        if MONOBANK_CONFIG.get('test_mode', False) and MONOBANK_CONFIG.get('simulate_success', False):
            print(f"🧪 Тестовий режим: симулюємо скасування рахунку {data.get('invoiceId', 'unknown')}")
            
            # Симулюємо всі етапи скасування
            
            # 1. Валідація даних
            print("🔍 Етап 1: Валідація даних для скасування...")
            if 'invoiceId' not in data:
                return JsonResponse({
                    'success': False,
                    'error': 'Відсутнє обов\'язкове поле: invoiceId',
                    'errorCode': 'MISSING_INVOICE_ID',
                    'test_mode': True
                })
            
            invoice_id = data['invoiceId']
            if not invoice_id or len(invoice_id) < 10:
                return JsonResponse({
                    'success': False,
                    'error': 'Невірний ID рахунку',
                    'errorCode': 'INVALID_INVOICE_ID',
                    'test_mode': True
                })
            
            # 2. Перевірка можливості скасування
            print("🔍 Етап 2: Перевірка можливості скасування...")
            import random
            if random.random() < 0.1:  # 10% шанс що скасування неможливе
                error_reasons = [
                    'Платіж вже оброблено',
                    'Неможливо скасувати застарілий платіж',
                    'Платіж в процесі обробки',
                    'Тимчасово недоступно'
                ]
                return JsonResponse({
                    'success': False,
                    'error': random.choice(error_reasons),
                    'errorCode': f'CANCEL_FAILED_{random.randint(100, 999)}',
                    'test_mode': True
                })
            
            # 3. Симуляція затримки API
            print("⏱️ Етап 3: Обробка запиту на скасування...")
            import time
            time.sleep(1.2)
            
            # 4. Генерація результату скасування
            print("📊 Етап 4: Генерація результату скасування...")
            
            cancel_result = {
                'success': True,
                'invoiceId': invoice_id,
                'status': 'cancelled',
                'cancelledAt': datetime.now().isoformat(),
                'refundAmount': data.get('amount', random.randint(100, 10000)),
                'message': 'Платіж успішно скасовано',
                'test_mode': True,
                'simulation_steps': [
                    'Валідація даних для скасування',
                    'Перевірка можливості скасування',
                    'Обробка запиту на скасування',
                    'Генерація результату скасування'
                ]
            }
            
            # Додаємо деталі скасування
            if 'items' in data:
                cancel_result['cancelledItems'] = data['items']
            
            print("✅ Етап 5: Повернення результату скасування...")
            return JsonResponse(cancel_result)
        
        # Валідація обов'язкових полів
        if 'invoiceId' not in data:
            return JsonResponse({'error': 'Відсутнє обов\'язкове поле: invoiceId'}, status=400)
        
        # Формуємо дані для Monobank API
        cancel_data = {
            'invoiceId': data['invoiceId']
        }
        
        # Додаємо опціональні поля
        if 'extRef' in data:
            cancel_data['extRef'] = data['extRef']
        
        if 'amount' in data:
            cancel_data['amount'] = int(data['amount'] * 100)  # Конвертуємо в копійки
        
        if 'items' in data:
            # Формуємо список товарів для скасування
            cancel_items = []
            for item in data['items']:
                cancel_item = {
                    'name': item.get('name', 'Товар'),
                    'qty': item.get('qty', 1),
                    'sum': int(item.get('sum', 0) * 100),  # В копійках
                    'code': item.get('code', str(uuid.uuid4())),
                    'barcode': item.get('barcode'),
                    'header': item.get('header'),
                    'footer': item.get('footer'),
                    'tax': item.get('tax'),
                    'uktzed': item.get('uktzed')
                }
                cancel_items.append(cancel_item)
            cancel_data['items'] = cancel_items
        
        # Заголовки для запиту
        headers = {
            'X-Token': MONOBANK_CONFIG['token'],
            'Content-Type': 'application/json'
        }
        
        # Відправляємо запит до Monobank
        response = requests.post(
            MONOBANK_CONFIG['cancel_url'],
            json=cancel_data,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return JsonResponse({
                'success': True,
                'status': result.get('status'),
                'createdDate': result.get('createdDate'),
                'modifiedDate': result.get('modifiedDate'),
                'message': 'Рахунок успішно скасовано'
            })
        else:
            logger.error(f'Monobank cancel API error: {response.status_code} - {response.text}')
            try:
                error_data = response.json()
                error_code = error_data.get('errCode', 'UNKNOWN_ERROR')
                error_text = error_data.get('errText', 'Невідома помилка')
            except:
                error_code = 'UNKNOWN_ERROR'
                error_text = response.text
            
            return JsonResponse({
                'success': False,
                'error': 'Помилка скасування рахунку',
                'errorCode': error_code,
                'errorText': error_text,
                'details': response.text
            }, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Невірний JSON'}, status=400)
    except Exception as e:
        logger.error(f'Error canceling invoice: {str(e)}')
        return JsonResponse({'error': 'Внутрішня помилка сервера'}, status=500)

def payment_cancel(request, invoice_id=None):
    """
    Сторінка скасування замовлення
    """
    if request.method == 'POST' and invoice_id:
        # Обробляємо скасування
        try:
            data = json.loads(request.body) if request.body else {}
            data['invoiceId'] = invoice_id
            
            # Викликаємо функцію скасування
            cancel_response = cancel_invoice(request)
            cancel_data = json.loads(cancel_response.content)
            
            if cancel_data.get('success'):
                return render(request, 'payment/cancel_success.html', {
                    'title': 'Замовлення скасовано',
                    'invoice_id': invoice_id,
                    'cancel_data': cancel_data,
                    'success': True
                })
            else:
                return render(request, 'payment/cancel_failure.html', {
                    'title': 'Помилка скасування',
                    'invoice_id': invoice_id,
                    'error': cancel_data.get('error', 'Невідома помилка'),
                    'error_code': cancel_data.get('errorCode'),
                    'error_text': cancel_data.get('errorText'),
                    'success': False
                })
        except Exception as e:
            logger.error(f'Error in payment_cancel view: {str(e)}')
            return render(request, 'payment/cancel_failure.html', {
                'title': 'Помилка скасування',
                'invoice_id': invoice_id,
                'error': 'Помилка обробки запиту',
                'success': False
            })
    elif request.method == 'GET' and invoice_id:
        # Форма підтвердження скасування
        return render(request, 'payment/cancel_confirm.html', {
            'title': 'Скасування замовлення',
            'invoice_id': invoice_id
        })
    else:
        # Форма для введення ID рахунку
        return render(request, 'payment/cancel_form.html', {
            'title': 'Скасування замовлення',
            'show_form': True
        })

def invalidate_invoice(request):
    """
    Інвалідація (деактивація) рахунку через Monobank API
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Метод не дозволений'}, status=405)
    
    try:
        # Отримуємо дані з запиту
        data = json.loads(request.body)
        
        # Валідація обов'язкових полів
        if 'invoiceId' not in data:
            return JsonResponse({'error': 'Відсутнє обов\'язкове поле: invoiceId'}, status=400)
        
        # Формуємо дані для Monobank API
        invalidate_data = {
            'invoiceId': data['invoiceId']
        }
        
        # Заголовки для запиту
        headers = {
            'X-Token': MONOBANK_CONFIG['token'],
            'Content-Type': 'application/json'
        }
        
        # Відправляємо запит до Monobank
        response = requests.post(
            MONOBANK_CONFIG['invalidate_url'],
            json=invalidate_data,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            return JsonResponse({
                'success': True,
                'message': 'Рахунок успішно деактивовано'
            })
        else:
            logger.error(f'Monobank invalidate API error: {response.status_code} - {response.text}')
            try:
                error_data = response.json()
                error_code = error_data.get('errCode', 'UNKNOWN_ERROR')
                error_text = error_data.get('errText', 'Невідома помилка')
            except:
                error_code = 'UNKNOWN_ERROR'
                error_text = response.text
            
            return JsonResponse({
                'success': False,
                'error': 'Помилка інвалідації рахунку',
                'errorCode': error_code,
                'errorText': error_text,
                'details': response.text
            }, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Невірний JSON'}, status=400)
    except Exception as e:
        logger.error(f'Error invalidating invoice: {str(e)}')
        return JsonResponse({'error': 'Внутрішня помилка сервера'}, status=500)

def payment_invalidate(request, invoice_id=None):
    """
    Сторінка інвалідації замовлення
    """
    if request.method == 'POST' and invoice_id:
        # Обробляємо інвалідацію
        try:
            data = json.loads(request.body) if request.body else {}
            data['invoiceId'] = invoice_id
            
            # Викликаємо функцію інвалідації
            invalidate_response = invalidate_invoice(request)
            invalidate_data = json.loads(invalidate_response.content)
            
            if invalidate_data.get('success'):
                return render(request, 'payment/invalidate_success.html', {
                    'title': 'Замовлення деактивовано',
                    'invoice_id': invoice_id,
                    'invalidate_data': invalidate_data,
                    'success': True
                })
            else:
                return render(request, 'payment/invalidate_failure.html', {
                    'title': 'Помилка деактивації',
                    'invoice_id': invoice_id,
                    'error': invalidate_data.get('error', 'Невідома помилка'),
                    'error_code': invalidate_data.get('errorCode'),
                    'error_text': invalidate_data.get('errorText'),
                    'success': False
                })
        except Exception as e:
            logger.error(f'Error in payment_invalidate view: {str(e)}')
            return render(request, 'payment/invalidate_failure.html', {
                'title': 'Помилка деактивації',
                'invoice_id': invoice_id,
                'error': 'Помилка обробки запиту',
                'success': False
            })
    elif request.method == 'GET' and invoice_id:
        # Форма підтвердження інвалідації
        return render(request, 'payment/invalidate_confirm.html', {
            'title': 'Деактивація замовлення',
            'invoice_id': invoice_id
        })
    else:
        # Форма для введення ID рахунку
        return render(request, 'payment/invalidate_form.html', {
            'title': 'Деактивація замовлення',
            'show_form': True
        })

def finalize_hold(request):
    """
    Фіналізація суми холду через Monobank API
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Метод не дозволений'}, status=405)
    
    try:
        # Отримуємо дані з запиту
        data = json.loads(request.body)
        
        # Валідація обов'язкових полів
        if 'invoiceId' not in data:
            return JsonResponse({'error': 'Відсутнє обов\'язкове поле: invoiceId'}, status=400)
        
        # Формуємо дані для Monobank API
        finalize_data = {
            'invoiceId': data['invoiceId']
        }
        
        # Додаємо опціональні поля
        if 'amount' in data:
            finalize_data['amount'] = int(data['amount'] * 100)  # Конвертуємо в копійки
        
        if 'items' in data:
            # Формуємо список товарів для фіскалізації
            finalize_items = []
            for item in data['items']:
                finalize_item = {
                    'name': item.get('name', 'Товар'),
                    'qty': item.get('qty', 1),
                    'sum': int(item.get('sum', 0) * 100),  # В копійках
                    'code': item.get('code', str(uuid.uuid4())),
                    'barcode': item.get('barcode'),
                    'header': item.get('header'),
                    'footer': item.get('footer'),
                    'tax': item.get('tax'),
                    'uktzed': item.get('uktzed')
                }
                finalize_items.append(finalize_item)
            finalize_data['items'] = finalize_items
        
        # Заголовки для запиту
        headers = {
            'X-Token': MONOBANK_CONFIG['token'],
            'Content-Type': 'application/json'
        }
        
        # Відправляємо запит до Monobank
        response = requests.post(
            MONOBANK_CONFIG['finalize_url'],
            json=finalize_data,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return JsonResponse({
                'success': True,
                'status': result.get('status'),
                'message': 'Холд успішно фіналізовано'
            })
        else:
            logger.error(f'Monobank finalize API error: {response.status_code} - {response.text}')
            try:
                error_data = response.json()
                error_code = error_data.get('errCode', 'UNKNOWN_ERROR')
                error_text = error_data.get('errText', 'Невідома помилка')
            except:
                error_code = 'UNKNOWN_ERROR'
                error_text = response.text
            
            return JsonResponse({
                'success': False,
                'error': 'Помилка фіналізації холду',
                'errorCode': error_code,
                'errorText': error_text,
                'details': response.text
            }, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Невірний JSON'}, status=400)
    except Exception as e:
        logger.error(f'Error finalizing hold: {str(e)}')
        return JsonResponse({'error': 'Внутрішня помилка сервера'}, status=500)

def payment_finalize(request, invoice_id=None):
    """
    Сторінка фіналізації холду
    """
    if request.method == 'POST' and invoice_id:
        # Обробляємо фіналізацію
        try:
            data = json.loads(request.body) if request.body else {}
            data['invoiceId'] = invoice_id
            
            # Викликаємо функцію фіналізації
            finalize_response = finalize_hold(request)
            finalize_data = json.loads(finalize_response.content)
            
            if finalize_data.get('success'):
                return render(request, 'payment/finalize_success.html', {
                    'title': 'Холд фіналізовано',
                    'invoice_id': invoice_id,
                    'finalize_data': finalize_data,
                    'success': True
                })
            else:
                return render(request, 'payment/finalize_failure.html', {
                    'title': 'Помилка фіналізації',
                    'invoice_id': invoice_id,
                    'error': finalize_data.get('error', 'Невідома помилка'),
                    'error_code': finalize_data.get('errorCode'),
                    'error_text': finalize_data.get('errorText'),
                    'success': False
                })
        except Exception as e:
            logger.error(f'Error in payment_finalize view: {str(e)}')
            return render(request, 'payment/finalize_failure.html', {
                'title': 'Помилка фіналізації',
                'invoice_id': invoice_id,
                'error': 'Помилка обробки запиту',
                'success': False
            })
    elif request.method == 'GET' and invoice_id:
        # Форма підтвердження фіналізації
        return render(request, 'payment/finalize_confirm.html', {
            'title': 'Фіналізація холду',
            'invoice_id': invoice_id
        })
    else:
        # Форма для введення ID рахунку
        return render(request, 'payment/finalize_form.html', {
            'title': 'Фіналізація холду',
            'show_form': True
        })

def get_merchant_details(request):
    """
    Отримання даних мерчанта через Monobank API
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'Метод не дозволений'}, status=405)
    
    try:
        # Заголовки для запиту
        headers = {
            'X-Token': MONOBANK_CONFIG['token'],
            'Content-Type': 'application/json'
        }
        
        # Відправляємо запит до Monobank
        response = requests.get(
            MONOBANK_CONFIG['merchant_details_url'],
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return JsonResponse({
                'success': True,
                'merchantId': result.get('merchantId'),
                'merchantName': result.get('merchantName'),
                'edrpou': result.get('edrpou'),
                'message': 'Дані мерчанта успішно отримано'
            })
        else:
            logger.error(f'Monobank merchant details API error: {response.status_code} - {response.text}')
            try:
                error_data = response.json()
                error_code = error_data.get('errCode', 'UNKNOWN_ERROR')
                error_text = error_data.get('errText', 'Невідома помилка')
            except:
                error_code = 'UNKNOWN_ERROR'
                error_text = response.text
            
            return JsonResponse({
                'success': False,
                'error': 'Помилка отримання даних мерчанта',
                'errorCode': error_code,
                'errorText': error_text,
                'details': response.text
            }, status=400)
            
    except Exception as e:
        logger.error(f'Error getting merchant details: {str(e)}')
        return JsonResponse({'error': 'Внутрішня помилка сервера'}, status=500)

def merchant_details(request):
    """
    Сторінка з даними мерчанта
    """
    if request.method == 'GET':
        try:
            # Отримуємо дані мерчанта
            details_response = get_merchant_details(request)
            details_data = json.loads(details_response.content)
            
            if details_data.get('success'):
                return render(request, 'payment/merchant_details.html', {
                    'title': 'Дані мерчанта',
                    'merchant_data': details_data,
                    'success': True
                })
            else:
                return render(request, 'payment/merchant_details_error.html', {
                    'title': 'Помилка отримання даних',
                    'error': details_data.get('error', 'Невідома помилка'),
                    'error_code': details_data.get('errorCode'),
                    'error_text': details_data.get('errorText'),
                    'success': False
                })
        except Exception as e:
            logger.error(f'Error in merchant_details view: {str(e)}')
            return render(request, 'payment/merchant_details_error.html', {
                'title': 'Помилка отримання даних',
                'error': 'Помилка обробки запиту',
                'success': False
            })
    else:
        return JsonResponse({'error': 'Метод не дозволений'}, status=405)

def process_card_payment(request):
    """
    Обробка оплати за реквізитами картки через Monobank API
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Метод не дозволений'}, status=405)
    
    try:
        # Отримуємо дані з запиту
        data = json.loads(request.body)
        
        # Валідація обов'язкових полів
        required_fields = ['amount', 'cardData']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Відсутнє обов\'язкове поле: {field}'}, status=400)
        
        # Валідація даних картки
        card_data = data['cardData']
        required_card_fields = ['pan', 'exp', 'cvv']
        for field in required_card_fields:
            if field not in card_data:
                return JsonResponse({'error': f'Відсутнє обов\'язкове поле картки: {field}'}, status=400)
        
        # Формуємо дані для Monobank API
        payment_data = {
            'amount': int(data['amount'] * 100),  # Конвертуємо в копійки
            'ccy': data.get('ccy', MONOBANK_CONFIG['currency_code']),
            'cardData': {
                'pan': card_data['pan'],
                'exp': card_data['exp'],
                'cvv': int(card_data['cvv'])
            }
        }
        
        # Додаємо опціональні поля
        if 'merchantPaymInfo' in data:
            payment_data['merchantPaymInfo'] = data['merchantPaymInfo']
        
        if 'webHookUrl' in data:
            payment_data['webHookUrl'] = data['webHookUrl']
        else:
            payment_data['webHookUrl'] = MONOBANK_CONFIG['webhook_url']
        
        if 'paymentType' in data:
            payment_data['paymentType'] = data['paymentType']
        else:
            payment_data['paymentType'] = MONOBANK_CONFIG['payment_type']
        
        if 'saveCardData' in data:
            payment_data['saveCardData'] = data['saveCardData']
        
        if 'redirectUrl' in data:
            payment_data['redirectUrl'] = data['redirectUrl']
        else:
            payment_data['redirectUrl'] = MONOBANK_CONFIG['redirect_url']
        
        if 'initiationKind' in data:
            payment_data['initiationKind'] = data['initiationKind']
        
        # Заголовки для запиту
        headers = {
            'X-Token': MONOBANK_CONFIG['token'],
            'Content-Type': 'application/json'
        }
        
        # Додаємо CMS заголовки якщо вказано
        if 'cms' in data:
            headers['X-Cms'] = data['cms']
        if 'cmsVersion' in data:
            headers['X-Cms-Version'] = data['cmsVersion']
        
        # Відправляємо запит до Monobank
        response = requests.post(
            MONOBANK_CONFIG['card_payment_url'],
            json=payment_data,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return JsonResponse({
                'success': True,
                'invoiceId': result.get('invoiceId'),
                'tdsUrl': result.get('tdsUrl'),
                'status': result.get('status'),
                'failureReason': result.get('failureReason'),
                'amount': result.get('amount'),
                'ccy': result.get('ccy'),
                'createdDate': result.get('createdDate'),
                'modifiedDate': result.get('modifiedDate'),
                'message': 'Оплата успішно оброблена'
            })
        else:
            logger.error(f'Monobank card payment API error: {response.status_code} - {response.text}')
            try:
                error_data = response.json()
                error_code = error_data.get('errCode', 'UNKNOWN_ERROR')
                error_text = error_data.get('errText', 'Невідома помилка')
            except:
                error_code = 'UNKNOWN_ERROR'
                error_text = response.text
            
            return JsonResponse({
                'success': False,
                'error': 'Помилка обробки оплати',
                'errorCode': error_code,
                'errorText': error_text,
                'details': response.text
            }, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Невірний JSON'}, status=400)
    except Exception as e:
        logger.error(f'Error processing card payment: {str(e)}')
        return JsonResponse({'error': 'Внутрішня помилка сервера'}, status=500)

def card_payment(request):
    """
    Сторінка оплати за реквізитами картки
    """
    if request.method == 'POST':
        # Обробляємо оплату
        try:
            payment_response = process_card_payment(request)
            payment_data = json.loads(payment_response.content)
            
            if payment_data.get('success'):
                if payment_data.get('tdsUrl'):
                    # Потрібна 3DS авторизація
                    return render(request, 'payment/card_payment_3ds.html', {
                        'title': '3DS Авторизація',
                        'tds_url': payment_data['tdsUrl'],
                        'invoice_id': payment_data['invoiceId'],
                        'payment_data': payment_data,
                        'success': True
                    })
                else:
                    # Пряма оплата
                    return render(request, 'payment/card_payment_success.html', {
                        'title': 'Оплата успішна',
                        'invoice_id': payment_data['invoiceId'],
                        'payment_data': payment_data,
                        'success': True
                    })
            else:
                return render(request, 'payment/card_payment_failure.html', {
                    'title': 'Помилка оплати',
                    'error': payment_data.get('error', 'Невідома помилка'),
                    'error_code': payment_data.get('errorCode'),
                    'error_text': payment_data.get('errorText'),
                    'success': False
                })
        except Exception as e:
            logger.error(f'Error in card_payment view: {str(e)}')
            return render(request, 'payment/card_payment_failure.html', {
                'title': 'Помилка оплати',
                'error': 'Помилка обробки запиту',
                'success': False
            })
    else:
        # Форма оплати
        return render(request, 'payment/card_payment_form.html', {
            'title': 'Оплата карткою',
            'show_form': True
        })

def get_invoice_receipt(request, invoice_id):
    """
    Отримання квитанції через Monobank API
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'Метод не дозволений'}, status=405)
    
    try:
        # Отримуємо email з параметрів запиту
        email = request.GET.get('email', '')
        
        # Формуємо URL для запиту
        url = f"{MONOBANK_CONFIG['receipt_url']}?invoiceId={invoice_id}"
        if email:
            url += f"&email={email}"
        
        # Заголовки для запиту
        headers = {
            'X-Token': MONOBANK_CONFIG['token'],
            'Content-Type': 'application/json'
        }
        
        # Відправляємо запит до Monobank
        response = requests.get(url, headers=headers, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            return JsonResponse({
                'success': True,
                'file': result.get('file'),
                'message': 'Квитанція успішно отримана'
            })
        else:
            logger.error(f'Monobank receipt API error: {response.status_code} - {response.text}')
            try:
                error_data = response.json()
                error_code = error_data.get('errCode', 'UNKNOWN_ERROR')
                error_text = error_data.get('errText', 'Невідома помилка')
            except:
                error_code = 'UNKNOWN_ERROR'
                error_text = response.text
            
            return JsonResponse({
                'success': False,
                'error': 'Помилка отримання квитанції',
                'errorCode': error_code,
                'errorText': error_text,
                'details': response.text
            }, status=400)
            
    except Exception as e:
        logger.error(f'Error getting invoice receipt: {str(e)}')
        return JsonResponse({'error': 'Внутрішня помилка сервера'}, status=500)

def download_receipt(request, invoice_id):
    """
    Завантаження квитанції як PDF файл
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'Метод не дозволений'}, status=405)
    
    try:
        # Отримуємо квитанцію через API
        receipt_response = get_invoice_receipt(request, invoice_id)
        receipt_data = json.loads(receipt_response.content)
        
        if receipt_data.get('success'):
            # Декодуємо base64 файл
            import base64
            pdf_data = base64.b64decode(receipt_data['file'])
            
            # Створюємо HTTP відповідь з PDF файлом
            from django.http import HttpResponse
            response = HttpResponse(pdf_data, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="receipt_{invoice_id}.pdf"'
            return response
        else:
            return JsonResponse({
                'success': False,
                'error': receipt_data.get('error', 'Помилка отримання квитанції'),
                'errorCode': receipt_data.get('errorCode'),
                'errorText': receipt_data.get('errorText')
            }, status=400)
            
    except Exception as e:
        logger.error(f'Error downloading receipt: {str(e)}')
        return JsonResponse({'error': 'Внутрішня помилка сервера'}, status=500)

def receipt_page(request, invoice_id=None):
    """
    Сторінка для роботи з квитанціями
    """
    if request.method == 'POST' and invoice_id:
        # Обробляємо запит на отримання квитанції
        try:
            email = request.POST.get('email', '')
            receipt_response = get_invoice_receipt(request, invoice_id)
            receipt_data = json.loads(receipt_response.content)
            
            if receipt_data.get('success'):
                return render(request, 'payment/receipt_success.html', {
                    'title': 'Квитанція отримана',
                    'invoice_id': invoice_id,
                    'receipt_data': receipt_data,
                    'email': email,
                    'success': True
                })
            else:
                return render(request, 'payment/receipt_failure.html', {
                    'title': 'Помилка отримання квитанції',
                    'invoice_id': invoice_id,
                    'error': receipt_data.get('error', 'Невідома помилка'),
                    'error_code': receipt_data.get('errorCode'),
                    'error_text': receipt_data.get('errorText'),
                    'success': False
                })
        except Exception as e:
            logger.error(f'Error in receipt_page view: {str(e)}')
            return render(request, 'payment/receipt_failure.html', {
                'title': 'Помилка отримання квитанції',
                'invoice_id': invoice_id,
                'error': 'Помилка обробки запиту',
                'success': False
            })
    elif request.method == 'GET' and invoice_id:
        # Форма для введення email
        return render(request, 'payment/receipt_form.html', {
            'title': 'Отримання квитанції',
            'invoice_id': invoice_id,
            'show_form': True
        })
    else:
        # Форма для введення ID рахунку
        return render(request, 'payment/receipt_form.html', {
            'title': 'Отримання квитанції',
            'show_form': True
        })

def process_sync_payment(request):
    """
    Обробка синхронної оплати через Monobank API
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Метод не дозволений'}, status=405)
    
    try:
        # Отримуємо дані з запиту
        data = json.loads(request.body)
        
        # Валідація обов'язкових полів
        required_fields = ['amount', 'ccy']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Відсутнє обов\'язкове поле: {field}'}, status=400)
        
        # Перевірка наявності хоча б одного способу оплати
        payment_methods = ['cardData', 'applePay', 'googlePay']
        has_payment_method = any(method in data for method in payment_methods)
        
        if not has_payment_method:
            return JsonResponse({'error': 'Необхідно вказати хоча б один спосіб оплати (cardData, applePay, googlePay)'}, status=400)
        
        # Формуємо дані для Monobank API
        payment_data = {
            'amount': int(data['amount'] * 100),  # Конвертуємо в копійки
            'ccy': data.get('ccy', MONOBANK_CONFIG['currency_code'])
        }
        
        # Додаємо merchantPaymInfo якщо вказано
        if 'merchantPaymInfo' in data:
            payment_data['merchantPaymInfo'] = data['merchantPaymInfo']
        
        # Додаємо способи оплати
        if 'cardData' in data:
            payment_data['cardData'] = data['cardData']
        
        if 'applePay' in data:
            payment_data['applePay'] = data['applePay']
        
        if 'googlePay' in data:
            payment_data['googlePay'] = data['googlePay']
        
        # Заголовки для запиту
        headers = {
            'X-Token': MONOBANK_CONFIG['token'],
            'Content-Type': 'application/json'
        }
        
        # Додаємо CMS заголовки якщо вказано
        if 'cms' in data:
            headers['X-Cms'] = data['cms']
        if 'cmsVersion' in data:
            headers['X-Cms-Version'] = data['cmsVersion']
        
        # Відправляємо запит до Monobank
        response = requests.post(
            MONOBANK_CONFIG['sync_payment_url'],
            json=payment_data,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return JsonResponse({
                'success': True,
                'invoiceId': result.get('invoiceId'),
                'status': result.get('status'),
                'failureReason': result.get('failureReason'),
                'errCode': result.get('errCode'),
                'amount': result.get('amount'),
                'ccy': result.get('ccy'),
                'finalAmount': result.get('finalAmount'),
                'createdDate': result.get('createdDate'),
                'modifiedDate': result.get('modifiedDate'),
                'reference': result.get('reference'),
                'destination': result.get('destination'),
                'cancelList': result.get('cancelList', []),
                'paymentInfo': result.get('paymentInfo'),
                'walletData': result.get('walletData'),
                'tipsInfo': result.get('tipsInfo'),
                'message': 'Синхронна оплата успішно оброблена'
            })
        else:
            logger.error(f'Monobank sync payment API error: {response.status_code} - {response.text}')
            try:
                error_data = response.json()
                error_code = error_data.get('errCode', 'UNKNOWN_ERROR')
                error_text = error_data.get('errText', 'Невідома помилка')
            except:
                error_code = 'UNKNOWN_ERROR'
                error_text = response.text
            
            return JsonResponse({
                'success': False,
                'error': 'Помилка обробки синхронної оплати',
                'errorCode': error_code,
                'errorText': error_text,
                'details': response.text
            }, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Невірний JSON'}, status=400)
    except Exception as e:
        logger.error(f'Error processing sync payment: {str(e)}')
        return JsonResponse({'error': 'Внутрішня помилка сервера'}, status=500)

def sync_payment(request):
    """
    Сторінка синхронної оплати
    """
    if request.method == 'POST':
        # Обробляємо оплату
        try:
            payment_response = process_sync_payment(request)
            payment_data = json.loads(payment_response.content)
            
            if payment_data.get('success'):
                if payment_data.get('status') == 'success':
                    # Успішна оплата
                    return render(request, 'payment/sync_payment_success.html', {
                        'title': 'Оплата успішна',
                        'invoice_id': payment_data['invoiceId'],
                        'payment_data': payment_data,
                        'success': True
                    })
                elif payment_data.get('status') == 'failure':
                    # Невдала оплата
                    return render(request, 'payment/sync_payment_failure.html', {
                        'title': 'Помилка оплати',
                        'invoice_id': payment_data.get('invoiceId'),
                        'error': payment_data.get('failureReason', 'Невідома помилка'),
                        'error_code': payment_data.get('errCode'),
                        'payment_data': payment_data,
                        'success': False
                    })
                else:
                    # Обробка або інший статус
                    return render(request, 'payment/sync_payment_processing.html', {
                        'title': 'Оплата обробляється',
                        'invoice_id': payment_data['invoiceId'],
                        'payment_data': payment_data,
                        'success': True
                    })
            else:
                return render(request, 'payment/sync_payment_failure.html', {
                    'title': 'Помилка оплати',
                    'error': payment_data.get('error', 'Невідома помилка'),
                    'error_code': payment_data.get('errorCode'),
                    'error_text': payment_data.get('errorText'),
                    'success': False
                })
        except Exception as e:
            logger.error(f'Error in sync_payment view: {str(e)}')
            return render(request, 'payment/sync_payment_failure.html', {
                'title': 'Помилка оплати',
                'error': 'Помилка обробки запиту',
                'success': False
            })
    else:
        # Форма оплати
        return render(request, 'payment/sync_payment_form.html', {
            'title': 'Синхронна оплата',
            'show_form': True
        })

def create_iframe_invoice(request):
    """
    Створення рахунку для iFrame оплати
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Метод не дозволений'}, status=405)
    
    try:
        # Отримуємо дані з запиту
        data = json.loads(request.body)
        
        # Валідація обов'язкових полів
        required_fields = ['amount']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Відсутнє обов\'язкове поле: {field}'}, status=400)
        
        # Формуємо дані для Monobank API
        invoice_data = {
            'amount': int(data['amount'] * 100),  # Конвертуємо в копійки
            'ccy': data.get('ccy', MONOBANK_CONFIG['currency_code']),
            'displayType': 'iframe'  # Обов'язковий параметр для iFrame
        }
        
        # Додаємо merchantPaymInfo якщо вказано
        if 'merchantPaymInfo' in data:
            invoice_data['merchantPaymInfo'] = data['merchantPaymInfo']
        else:
            # Базові дані замовлення
            invoice_data['merchantPaymInfo'] = {
                'reference': data.get('reference', f'order_{int(time.time())}'),
                'destination': data.get('destination', 'Оплата замовлення')
            }
        
        # Додаємо опціональні поля
        if 'redirectUrl' in data:
            invoice_data['redirectUrl'] = data['redirectUrl']
        else:
            invoice_data['redirectUrl'] = MONOBANK_CONFIG['redirect_url']
        
        if 'webHookUrl' in data:
            invoice_data['webHookUrl'] = data['webHookUrl']
        else:
            invoice_data['webHookUrl'] = MONOBANK_CONFIG['webhook_url']
        
        if 'validity' in data:
            invoice_data['validity'] = data['validity']
        else:
            invoice_data['validity'] = MONOBANK_CONFIG['validity_seconds']
        
        if 'paymentType' in data:
            invoice_data['paymentType'] = data['paymentType']
        else:
            invoice_data['paymentType'] = MONOBANK_CONFIG['payment_type']
        
        # Заголовки для запиту
        headers = {
            'X-Token': MONOBANK_CONFIG['token'],
            'Content-Type': 'application/json'
        }
        
        # Додаємо CMS заголовки якщо вказано
        if 'cms' in data:
            headers['X-Cms'] = data['cms']
        if 'cmsVersion' in data:
            headers['X-Cms-Version'] = data['cmsVersion']
        
        # Відправляємо запит до Monobank
        response = requests.post(
            MONOBANK_CONFIG['api_url'],
            json=invoice_data,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return JsonResponse({
                'success': True,
                'invoiceId': result.get('invoiceId'),
                'pageUrl': result.get('pageUrl'),
                'message': 'Рахунок для iFrame успішно створено'
            })
        else:
            logger.error(f'Monobank iframe invoice API error: {response.status_code} - {response.text}')
            try:
                error_data = response.json()
                error_code = error_data.get('errCode', 'UNKNOWN_ERROR')
                error_text = error_data.get('errText', 'Невідома помилка')
            except:
                error_code = 'UNKNOWN_ERROR'
                error_text = response.text
            
            return JsonResponse({
                'success': False,
                'error': 'Помилка створення рахунку для iFrame',
                'errorCode': error_code,
                'errorText': error_text,
                'details': response.text
            }, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Невірний JSON'}, status=400)
    except Exception as e:
        logger.error(f'Error creating iframe invoice: {str(e)}')
        return JsonResponse({'error': 'Внутрішня помилка сервера'}, status=500)

def iframe_payment(request):
    """
    Сторінка iFrame оплати
    """
    if request.method == 'POST':
        # Обробляємо створення рахунку
        try:
            invoice_response = create_iframe_invoice(request)
            invoice_data = json.loads(invoice_response.content)
            
            if invoice_data.get('success'):
                return render(request, 'payment/iframe_payment.html', {
                    'title': 'Оплата через iFrame',
                    'invoice_id': invoice_data['invoiceId'],
                    'page_url': invoice_data['pageUrl'],
                    'success': True
                })
            else:
                return render(request, 'payment/iframe_payment_error.html', {
                    'title': 'Помилка створення рахунку',
                    'error': invoice_data.get('error', 'Невідома помилка'),
                    'error_code': invoice_data.get('errorCode'),
                    'error_text': invoice_data.get('errorText'),
                    'success': False
                })
        except Exception as e:
            logger.error(f'Error in iframe_payment view: {str(e)}')
            return render(request, 'payment/iframe_payment_error.html', {
                'title': 'Помилка створення рахунку',
                'error': 'Помилка обробки запиту',
                'success': False
            })
    else:
        # Форма створення рахунку
        return render(request, 'payment/iframe_payment_form.html', {
            'title': 'Оплата через iFrame',
            'show_form': True
        })
