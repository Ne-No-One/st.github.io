"""
Управління платежами в адмін-панелі
"""
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import requests
from datetime import datetime, timedelta
from monobank_config import MONOBANK_CONFIG

def payment_management(request):
    """Головна сторінка управління платежами"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        # Отримуємо всі замовлення
        orders = json_manager.get_orders()
        
        # Фільтруємо замовлення з онлайн оплатою
        online_orders = [order for order in orders if order.get('payment') == 'online']
        
        # Статистика платежів
        total_orders = len(orders)
        online_orders_count = len(online_orders)
        paid_orders = len([order for order in online_orders if order.get('payment_status') == 'success'])
        pending_orders = len([order for order in online_orders if order.get('payment_status') == 'pending'])
        failed_orders = len([order for order in online_orders if order.get('payment_status') == 'failed'])
        
        # Обчислюємо загальну суму оплачених замовлень
        total_amount = sum(float(order.get('total_amount', 0)) for order in online_orders if order.get('payment_status') == 'success')
        
        context = {
            'orders': online_orders,
            'total_orders': total_orders,
            'online_orders_count': online_orders_count,
            'paid_orders': paid_orders,
            'pending_orders': pending_orders,
            'failed_orders': failed_orders,
            'total_amount': total_amount,
            'currency': 'UAH'
        }
        
        return render(request, 'admin_panel/payment_management.html', context)
        
    except Exception as e:
        messages.error(request, f'Помилка завантаження платежів: {e}')
        return render(request, 'admin_panel/payment_management.html', {'orders': []})

def payment_detail(request, order_id):
    """Деталі платежу"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        order = json_manager.get_order_by_id(order_id)
        if not order:
            messages.error(request, f'Замовлення з ID {order_id} не знайдено')
            return redirect('admin_panel:payment_management')
        
        # Отримуємо детальну інформацію про платіж з Monobank
        payment_details = None
        if order.get('invoice_id'):
            try:
                payment_details = get_payment_details_from_monobank(order['invoice_id'])
            except Exception as e:
                print(f'Помилка отримання деталей платежу: {e}')
        
        context = {
            'order': order,
            'payment_details': payment_details
        }
        
        return render(request, 'admin_panel/payment_detail.html', context)
        
    except Exception as e:
        messages.error(request, f'Помилка завантаження деталей платежу: {e}')
        return redirect('admin_panel:payment_management')

@csrf_exempt
@require_http_methods(["POST"])
def cancel_payment(request, order_id):
    """Скасування платежу"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        order = json_manager.get_order_by_id(order_id)
        if not order:
            return JsonResponse({'success': False, 'error': 'Замовлення не знайдено'})
        
        if not order.get('invoice_id'):
            return JsonResponse({'success': False, 'error': 'ID рахунку не знайдено'})
        
        # Викликаємо Monobank API для скасування
        cancel_data = {
            'invoiceId': order['invoice_id']
        }
        
        headers = {
            'X-Token': MONOBANK_CONFIG['token'],
            'Content-Type': 'application/json'
        }
        
        response = requests.post(
            MONOBANK_CONFIG['cancel_url'],
            json=cancel_data,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            
            # Оновлюємо статус замовлення
            json_manager.update_order_status(order_id, 'скасовано')
            json_manager.update_order_payment_status(order_id, 'cancelled')
            
            return JsonResponse({
                'success': True,
                'message': 'Платіж успішно скасовано',
                'result': result
            })
        else:
            error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
            return JsonResponse({
                'success': False,
                'error': f'Помилка скасування: {error_data.get("errText", "Невідома помилка")}'
            })
            
    except Exception as e:
        return JsonResponse({'success': False, 'error': f'Внутрішня помилка: {str(e)}'})

@csrf_exempt
@require_http_methods(["POST"])
def refund_payment(request, order_id):
    """Повернення коштів"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        order = json_manager.get_order_by_id(order_id)
        if not order:
            return JsonResponse({'success': False, 'error': 'Замовлення не знайдено'})
        
        if not order.get('invoice_id'):
            return JsonResponse({'success': False, 'error': 'ID рахунку не знайдено'})
        
        data = json.loads(request.body)
        refund_amount = data.get('amount', order.get('total_amount', 0))
        reason = data.get('reason', 'Повернення коштів')
        
        # Викликаємо Monobank API для повернення
        refund_data = {
            'invoiceId': order['invoice_id'],
            'amount': int(float(refund_amount) * 100),  # В копійках
            'reason': reason
        }
        
        headers = {
            'X-Token': MONOBANK_CONFIG['token'],
            'Content-Type': 'application/json'
        }
        
        response = requests.post(
            MONOBANK_CONFIG['refund_url'],
            json=refund_data,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            
            # Оновлюємо статус замовлення
            json_manager.update_order_payment_status(order_id, 'refunded')
            
            return JsonResponse({
                'success': True,
                'message': 'Кошти успішно повернено',
                'result': result
            })
        else:
            error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
            return JsonResponse({
                'success': False,
                'error': f'Помилка повернення: {error_data.get("errText", "Невідома помилка")}'
            })
            
    except Exception as e:
        return JsonResponse({'success': False, 'error': f'Внутрішня помилка: {str(e)}'})

def check_payment_status(request, order_id):
    """Перевірка статусу платежу"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        order = json_manager.get_order_by_id(order_id)
        if not order:
            return JsonResponse({'success': False, 'error': 'Замовлення не знайдено'})
        
        if not order.get('invoice_id'):
            return JsonResponse({'success': False, 'error': 'ID рахунку не знайдено'})
        
        # Отримуємо статус з Monobank
        payment_details = get_payment_details_from_monobank(order['invoice_id'])
        
        if payment_details:
            # Оновлюємо статус в базі даних
            status_mapping = {
                'success': 'success',
                'failure': 'failed',
                'processing': 'pending',
                'expired': 'expired'
            }
            
            new_status = status_mapping.get(payment_details.get('status'), 'unknown')
            json_manager.update_order_payment_status(order_id, new_status)
            
            return JsonResponse({
                'success': True,
                'status': new_status,
                'details': payment_details
            })
        else:
            return JsonResponse({'success': False, 'error': 'Не вдалося отримати статус платежу'})
            
    except Exception as e:
        return JsonResponse({'success': False, 'error': f'Внутрішня помилка: {str(e)}'})

def download_payment_receipt(request, order_id):
    """Завантаження квитанції платежу"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        order = json_manager.get_order_by_id(order_id)
        if not order or not order.get('invoice_id'):
            return JsonResponse({'success': False, 'error': 'Замовлення або ID рахунку не знайдено'})
        
        # Отримуємо квитанцію з Monobank
        headers = {
            'X-Token': MONOBANK_CONFIG['token']
        }
        
        url = f"{MONOBANK_CONFIG['receipt_url']}?invoiceId={order['invoice_id']}"
        response = requests.get(url, headers=headers, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            
            if result.get('file'):
                # Декодуємо base64 файл
                import base64
                pdf_data = base64.b64decode(result['file'])
                
                # Створюємо HTTP відповідь з PDF файлом
                response = HttpResponse(pdf_data, content_type='application/pdf')
                response['Content-Disposition'] = f'attachment; filename="receipt_{order["order_number"]}.pdf"'
                return response
            else:
                return JsonResponse({'success': False, 'error': 'Квитанція не знайдена'})
        else:
            return JsonResponse({'success': False, 'error': 'Помилка отримання квитанції'})
            
    except Exception as e:
        return JsonResponse({'success': False, 'error': f'Внутрішня помилка: {str(e)}'})

def payment_reports(request):
    """Звіти по платежах"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        # Отримуємо параметри фільтрації
        date_from = request.GET.get('date_from', '')
        date_to = request.GET.get('date_to', '')
        status = request.GET.get('status', '')
        
        orders = json_manager.get_orders()
        online_orders = [order for order in orders if order.get('payment') == 'online']
        
        # Фільтруємо по датах
        if date_from:
            online_orders = [order for order in online_orders if order.get('order_date', '') >= date_from]
        if date_to:
            online_orders = [order for order in online_orders if order.get('order_date', '') <= date_to]
        if status:
            online_orders = [order for order in online_orders if order.get('payment_status') == status]
        
        # Статистика
        stats = {
            'total_orders': len(online_orders),
            'total_amount': sum(float(order.get('total_amount', 0)) for order in online_orders),
            'successful_payments': len([order for order in online_orders if order.get('payment_status') == 'success']),
            'failed_payments': len([order for order in online_orders if order.get('payment_status') == 'failed']),
            'pending_payments': len([order for order in online_orders if order.get('payment_status') == 'pending'])
        }
        
        context = {
            'orders': online_orders,
            'stats': stats,
            'date_from': date_from,
            'date_to': date_to,
            'status': status
        }
        
        return render(request, 'admin_panel/payment_reports.html', context)
        
    except Exception as e:
        messages.error(request, f'Помилка завантаження звітів: {e}')
        return render(request, 'admin_panel/payment_reports.html', {'orders': [], 'stats': {}})

def get_payment_details_from_monobank(invoice_id):
    """Отримання деталей платежу з Monobank API"""
    try:
        headers = {
            'X-Token': MONOBANK_CONFIG['token']
        }
        
        url = f"{MONOBANK_CONFIG['status_url']}?invoiceId={invoice_id}"
        response = requests.get(url, headers=headers, timeout=30)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f'Помилка отримання статусу платежу: {response.status_code} - {response.text}')
            return None
            
    except Exception as e:
        print(f'Помилка запиту до Monobank API: {e}')
        return None
