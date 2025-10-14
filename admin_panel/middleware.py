"""
Middleware для перевірки авторизації в адмін-панелі
"""
from django.shortcuts import redirect
from django.urls import reverse


class AdminAuthMiddleware:
    """
    Middleware для перевірки авторизації адміністратора
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
        # URL які не потребують авторизації
        self.public_urls = [
            reverse('admin_panel:login'),
            '/admin-panel/login/',
        ]
    
    def __call__(self, request):
        # Перевіряємо чи це запит до адмін-панелі
        if request.path.startswith('/admin-panel/'):
            # Перевіряємо чи це публічний URL
            is_public = any(request.path == url or request.path.startswith(url) for url in self.public_urls)
            
            # Перевіряємо чи це статичні файли
            is_static = request.path.startswith('/admin-panel/static/')
            
            # Якщо не публічний і не статичний, перевіряємо авторизацію
            if not is_public and not is_static:
                if not request.session.get('admin_authenticated'):
                    # Зберігаємо URL для повернення після входу
                    request.session['next_url'] = request.path
                    return redirect('admin_panel:login')
        
        response = self.get_response(request)
        return response

