"""
Тестові views для симуляції платіжних операцій
"""
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import uuid
from datetime import datetime, timedelta
from monobank_config import MONOBANK_CONFIG

def test_payment_success(request):
    """Тестова сторінка успішної оплати"""
    invoice_id = request.GET.get('invoiceId', str(uuid.uuid4()))
    order_id = request.GET.get('orderId', '')
    
    context = {
        'invoice_id': invoice_id,
        'order_id': order_id,
        'amount': request.GET.get('amount', '0'),
        'currency': 'UAH',
        'payment_date': datetime.now().strftime('%d.%m.%Y %H:%M'),
        'test_mode': True
    }
    
    return render(request, 'payment/test_success.html', context)

def test_payment_failure(request):
    """Тестова сторінка невдалої оплати"""
    invoice_id = request.GET.get('invoiceId', str(uuid.uuid4()))
    order_id = request.GET.get('orderId', '')
    error_code = request.GET.get('errorCode', 'PAYMENT_FAILED')
    error_message = request.GET.get('errorMessage', 'Платіж не вдалося обробити')
    
    context = {
        'invoice_id': invoice_id,
        'order_id': order_id,
        'amount': request.GET.get('amount', '0'),
        'currency': 'UAH',
        'error_code': error_code,
        'error_message': error_message,
        'test_mode': True
    }
    
    return render(request, 'payment/test_failure.html', context)

def test_payment_cancel(request):
    """Тестова сторінка скасування оплати"""
    invoice_id = request.GET.get('invoiceId', str(uuid.uuid4()))
    order_id = request.GET.get('orderId', '')
    
    context = {
        'invoice_id': invoice_id,
        'order_id': order_id,
        'amount': request.GET.get('amount', '0'),
        'currency': 'UAH',
        'test_mode': True
    }
    
    return render(request, 'payment/test_cancel.html', context)

@csrf_exempt
@require_http_methods(["POST"])
def test_create_invoice(request):
    """Тестовий створення рахунку з реалістичною симуляцією"""
    try:
        data = json.loads(request.body)
        
        # Генеруємо тестові дані
        invoice_id = str(uuid.uuid4())
        order_id = data.get('order_id', str(uuid.uuid4()))
        amount = data.get('amount', 0)
        
        # Симулюємо затримку API (як справжній Monobank)
        import time
        time.sleep(1.5)
        
        # Реалістична симуляція - не завжди успіх
        import random
        
        # 80% успіх, 15% помилка, 5% затримка
        simulation_type = random.choices(
            ['success', 'failure', 'timeout'], 
            weights=[80, 15, 5]
        )[0]
        
        if simulation_type == 'success':
            # Симулюємо успішне створення рахунку
            response_data = {
                'success': True,
                'invoiceId': invoice_id,
                'pageUrl': f'/test-payment-success/?invoiceId={invoice_id}&orderId={order_id}&amount={amount}',
                'amount': amount,
                'currency': 'UAH',
                'status': 'created',
                'createdDate': datetime.now().isoformat(),
                'modifiedDate': datetime.now().isoformat(),
                'test_mode': True,
                'simulation_type': 'success'
            }
        elif simulation_type == 'failure':
            # Симулюємо помилку створення рахунку
            error_messages = [
                'Недостатньо коштів на рахунку',
                'Невірні дані картки',
                'Тимчасово недоступно',
                'Перевищено ліміт операцій',
                'Картка заблокована'
            ]
            response_data = {
                'success': False,
                'error': random.choice(error_messages),
                'errorCode': f'TEST_ERROR_{random.randint(1000, 9999)}',
                'test_mode': True,
                'simulation_type': 'failure'
            }
        else:  # timeout
            # Симулюємо таймаут
            response_data = {
                'success': False,
                'error': 'Час очікування вичерпано',
                'errorCode': 'TIMEOUT',
                'test_mode': True,
                'simulation_type': 'timeout'
            }
        
        return JsonResponse(response_data)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Test error: {str(e)}',
            'test_mode': True
        })

@csrf_exempt
@require_http_methods(["POST"])
def test_payment_status(request):
    """Тестова перевірка статусу платежу з реалістичною симуляцією"""
    try:
        data = json.loads(request.body)
        invoice_id = data.get('invoiceId', '')
        amount = data.get('amount', 0)
        
        # Симулюємо затримку API
        import time
        time.sleep(0.8)
        
        import random
        
        # Реалістичні статуси з різними ймовірностями
        statuses = ['processing', 'success', 'failure', 'expired', 'cancelled']
        weights = [30, 50, 10, 5, 5]  # 30% обробка, 50% успіх, 10% помилка, 5% застарілий, 5% скасований
        status = random.choices(statuses, weights=weights)[0]
        
        response_data = {
            'success': True,
            'invoiceId': invoice_id,
            'status': status,
            'amount': amount,
            'currency': 'UAH',
            'createdDate': datetime.now().isoformat(),
            'modifiedDate': datetime.now().isoformat(),
            'test_mode': True
        }
        
        if status == 'success':
            # Детальна інформація про успішний платіж
            response_data['paymentInfo'] = {
                'maskedPan': f'{random.randint(1000, 9999)}****{random.randint(1000, 9999)}',
                'approvalCode': f'{random.randint(100000, 999999)}',
                'rrn': str(uuid.uuid4())[:12].upper(),
                'terminal': f'TEST{random.randint(100, 999)}',
                'authCode': str(uuid.uuid4())[:8].upper(),
                'transactionId': str(uuid.uuid4()),
                'processedAt': datetime.now().isoformat()
            }
        elif status == 'failure':
            # Різні причини помилок
            failure_reasons = [
                'Недостатньо коштів',
                'Картка заблокована',
                'Невірний PIN-код',
                'Перевищено ліміт',
                'Тимчасово недоступно'
            ]
            response_data['failureReason'] = random.choice(failure_reasons)
            response_data['errorCode'] = f'PAYMENT_FAILED_{random.randint(100, 999)}'
        elif status == 'processing':
            # Платіж в обробці
            response_data['processingInfo'] = {
                'estimatedTime': random.randint(30, 300),  # секунди
                'stage': random.choice(['validating', 'authorizing', 'confirming'])
            }
        elif status == 'expired':
            # Платіж застарів
            response_data['expiredAt'] = (datetime.now() - timedelta(minutes=random.randint(5, 60))).isoformat()
            response_data['reason'] = 'Payment session expired'
        
        return JsonResponse(response_data)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Test error: {str(e)}',
            'test_mode': True
        })

@csrf_exempt
@require_http_methods(["POST"])
def test_cancel_payment(request):
    """Тестове скасування платежу з реалістичною симуляцією"""
    try:
        data = json.loads(request.body)
        invoice_id = data.get('invoiceId', '')
        
        # Симулюємо затримку API
        import time
        time.sleep(1.2)
        
        import random
        
        # 90% успішне скасування, 10% помилка
        success = random.random() < 0.9
        
        if success:
            response_data = {
                'success': True,
                'invoiceId': invoice_id,
                'status': 'cancelled',
                'message': 'Платіж успішно скасовано',
                'cancelledAt': datetime.now().isoformat(),
                'refundAmount': data.get('amount', 0),
                'test_mode': True
            }
        else:
            # Симулюємо помилку скасування
            error_messages = [
                'Платіж вже оброблено',
                'Неможливо скасувати застарілий платіж',
                'Платіж в процесі обробки',
                'Тимчасово недоступно'
            ]
            response_data = {
                'success': False,
                'error': random.choice(error_messages),
                'errorCode': f'CANCEL_FAILED_{random.randint(100, 999)}',
                'test_mode': True
            }
        
        return JsonResponse(response_data)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Test error: {str(e)}',
            'test_mode': True
        })

@csrf_exempt
@require_http_methods(["POST"])
def test_refund_payment(request):
    """Тестове повернення коштів з реалістичною симуляцією"""
    try:
        data = json.loads(request.body)
        invoice_id = data.get('invoiceId', '')
        amount = data.get('amount', 0)
        reason = data.get('reason', 'Test refund')
        
        # Симулюємо затримку API
        import time
        time.sleep(2.0)  # Повернення коштів займає більше часу
        
        import random
        
        # 85% успішне повернення, 15% помилка
        success = random.random() < 0.85
        
        if success:
            refund_id = str(uuid.uuid4())
            response_data = {
                'success': True,
                'invoiceId': invoice_id,
                'refundId': refund_id,
                'amount': amount,
                'reason': reason,
                'status': 'refunded',
                'refundedAt': datetime.now().isoformat(),
                'processingTime': random.randint(1, 5),  # днів
                'refundMethod': random.choice(['original_card', 'bank_transfer']),
                'test_mode': True
            }
        else:
            # Симулюємо помилку повернення
            error_messages = [
                'Платіж не знайдено',
                'Повернення вже виконано',
                'Неможливо повернути частково оброблений платіж',
                'Перевищено термін повернення',
                'Недостатньо коштів для повернення'
            ]
            response_data = {
                'success': False,
                'error': random.choice(error_messages),
                'errorCode': f'REFUND_FAILED_{random.randint(100, 999)}',
                'test_mode': True
            }
        
        return JsonResponse(response_data)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Test error: {str(e)}',
            'test_mode': True
        })

def test_payment_receipt(request):
    """Тестова квитанція платежу"""
    invoice_id = request.GET.get('invoiceId', str(uuid.uuid4()))
    order_id = request.GET.get('orderId', '')
    amount = request.GET.get('amount', '0')
    
    context = {
        'invoice_id': invoice_id,
        'order_id': order_id,
        'amount': amount,
        'currency': 'UAH',
        'payment_date': datetime.now().strftime('%d.%m.%Y %H:%M'),
        'receipt_number': str(uuid.uuid4())[:8].upper(),
        'test_mode': True
    }
    
    return render(request, 'payment/test_receipt.html', context)

def test_payment_demo(request):
    """Демо сторінка з усіма тестовими функціями"""
    context = {
        'test_mode': True,
        'invoice_id': str(uuid.uuid4()),
        'order_id': str(uuid.uuid4()),
        'amount': 1000
    }
    
    return render(request, 'payment/test_demo.html', context)

@csrf_exempt
@require_http_methods(["POST"])
def test_simulation_settings(request):
    """Налаштування параметрів симуляції"""
    try:
        data = json.loads(request.body)
        
        # Оновлюємо налаштування симуляції
        global SIMULATION_SETTINGS
        SIMULATION_SETTINGS = {
            'success_rate': data.get('success_rate', 80),
            'failure_rate': data.get('failure_rate', 15),
            'timeout_rate': data.get('timeout_rate', 5),
            'api_delay': data.get('api_delay', 1.5),
            'realistic_mode': data.get('realistic_mode', True)
        }
        
        return JsonResponse({
            'success': True,
            'message': 'Налаштування симуляції оновлено',
            'settings': SIMULATION_SETTINGS,
            'test_mode': True
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Test error: {str(e)}',
            'test_mode': True
        })

# Глобальні налаштування симуляції
SIMULATION_SETTINGS = {
    'success_rate': 80,
    'failure_rate': 15,
    'timeout_rate': 5,
    'api_delay': 1.5,
    'realistic_mode': True
}
