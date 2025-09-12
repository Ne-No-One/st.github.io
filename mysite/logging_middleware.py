"""
Middleware для логування запитів
"""
import logging
import time

logger = logging.getLogger('django.request')

class RequestLoggingMiddleware:
    """Middleware для логування всіх HTTP запитів"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Логуємо початок запиту
        start_time = time.time()
        logger.info(f"🌐 Початок запиту: {request.method} {request.path}")
        logger.info(f"   User-Agent: {request.META.get('HTTP_USER_AGENT', 'Невідомо')}")
        logger.info(f"   IP: {self.get_client_ip(request)}")
        
        # Виконуємо запит
        response = self.get_response(request)
        
        # Логуємо кінець запиту
        end_time = time.time()
        duration = (end_time - start_time) * 1000  # в мілісекундах
        
        status_emoji = "✅" if response.status_code < 400 else "❌"
        logger.info(f"{status_emoji} Кінець запиту: {request.method} {request.path}")
        logger.info(f"   Статус: {response.status_code}")
        logger.info(f"   Тривалість: {duration:.2f}ms")
        
        return response
    
    def get_client_ip(self, request):
        """Отримуємо IP адресу клієнта"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
