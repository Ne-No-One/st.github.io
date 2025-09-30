"""
Налаштування Monobank API
"""
import os
from django.conf import settings

# Налаштування Monobank API
MONOBANK_CONFIG = {
    'api_url': 'https://api.monobank.ua/api/merchant/invoice/create',
    'status_url': 'https://api.monobank.ua/api/merchant/invoice/status',
    'cancel_url': 'https://api.monobank.ua/api/merchant/invoice/cancel',
    'invalidate_url': 'https://api.monobank.ua/api/merchant/invoice/remove',
    'finalize_url': 'https://api.monobank.ua/api/merchant/invoice/finalize',
    'merchant_details_url': 'https://api.monobank.ua/api/merchant/details',
    'card_payment_url': 'https://api.monobank.ua/api/merchant/invoice/payment-direct',
    'receipt_url': 'https://api.monobank.ua/api/merchant/invoice/receipt',
    'sync_payment_url': 'https://api.monobank.ua/api/merchant/invoice/sync-payment',
    'test_token': os.getenv('MONOBANK_TEST_TOKEN', 'test_token'),
    'production_token': os.getenv('MONOBANK_PRODUCTION_TOKEN', ''),
    'webhook_url': f"{getattr(settings, 'SITE_URL', 'http://localhost:8000')}/payment/webhook/",
    'redirect_url': f"{getattr(settings, 'SITE_URL', 'http://localhost:8000')}/payment/success/",
    'validity_seconds': 3600,  # 1 година
    'currency_code': 980,  # Гривня
    'payment_type': 'debit',  # Звичайна оплата
    'display_type': 'iframe',  # Тип відображення для iFrame
}

# Налаштування для різних середовищ
if hasattr(settings, 'DEBUG') and settings.DEBUG:
    # Тестове середовище
    MONOBANK_CONFIG.update({
        'token': MONOBANK_CONFIG['test_token'],
        'api_url': 'https://api.monobank.ua/api/merchant/invoice/create',
        'test_mode': True,
        'simulate_success': True  # Симулювати успішну оплату
    })
else:
    # Продакшн середовище
    MONOBANK_CONFIG.update({
        'token': MONOBANK_CONFIG['production_token'],
        'api_url': 'https://api.monobank.ua/api/merchant/invoice/create',
        'test_mode': False,
        'simulate_success': False
    })
