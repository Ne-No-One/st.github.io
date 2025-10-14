"""
Views для авторизації адміністраторів
"""
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import hashlib
import secrets
from datetime import datetime


def hash_password(password, salt=None):
    """
    Хешує пароль з використанням SHA256 + salt
    """
    if salt is None:
        salt = secrets.token_hex(16)
    
    # Комбінуємо пароль і сіль
    password_salt = f"{password}{salt}".encode()
    
    # Хешуємо 100,000 разів для додаткової безпеки
    hashed = hashlib.sha256(password_salt).digest()
    for _ in range(99999):
        hashed = hashlib.sha256(hashed).digest()
    
    return hashed.hex(), salt


def verify_password(password, hashed_password, salt):
    """
    Перевіряє пароль
    """
    new_hash, _ = hash_password(password, salt)
    return new_hash == hashed_password


def admin_login(request):
    """
    Сторінка входу для адміністраторів
    """
    # Якщо вже авторизований, перенаправляємо на dashboard
    if request.session.get('admin_authenticated'):
        return redirect('admin_panel:dashboard')
    
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        
        if not username or not password:
            messages.error(request, 'Заповніть всі поля')
            return render(request, 'admin_panel/login.html')
        
        # Перевіряємо credentials
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        admin = json_manager.get_admin_by_username(username)
        
        if admin and verify_password(password, admin['password_hash'], admin['salt']):
            # Успішна авторизація
            request.session['admin_authenticated'] = True
            request.session['admin_id'] = admin['id']
            request.session['admin_username'] = admin['username']
            request.session['admin_role'] = admin.get('role', 'admin')
            request.session['admin_name'] = admin.get('name', username)
            
            # Оновлюємо last_login
            json_manager.update_admin_last_login(admin['id'])
            
            print(f"✅ Адміністратор {username} увійшов в систему")
            messages.success(request, f'Ласкаво просимо, {admin.get("name", username)}!')
            
            return redirect('admin_panel:dashboard')
        else:
            print(f"❌ Невдала спроба входу: {username}")
            messages.error(request, 'Невірний логін або пароль')
    
    return render(request, 'admin_panel/login.html')


def admin_logout(request):
    """
    Вихід з адмін-панелі
    """
    username = request.session.get('admin_username', 'Unknown')
    
    # Очищаємо сесію
    request.session.flush()
    
    print(f"👋 Адміністратор {username} вийшов з системи")
    messages.success(request, 'Ви успішно вийшли з системи')
    
    return redirect('admin_panel:login')


def admin_profile(request):
    """
    Профіль адміністратора
    """
    if not request.session.get('admin_authenticated'):
        return redirect('admin_panel:login')
    
    from json_manager import JSONManager
    json_manager = JSONManager()
    
    admin_id = request.session.get('admin_id')
    admin = json_manager.get_admin_by_id(admin_id)
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'update_profile':
            name = request.POST.get('name', '').strip()
            email = request.POST.get('email', '').strip()
            
            if name:
                json_manager.update_admin_profile(admin_id, name=name, email=email)
                request.session['admin_name'] = name
                messages.success(request, 'Профіль оновлено')
                return redirect('admin_panel:admin_profile')
        
        elif action == 'change_password':
            current_password = request.POST.get('current_password', '')
            new_password = request.POST.get('new_password', '')
            confirm_password = request.POST.get('confirm_password', '')
            
            if not all([current_password, new_password, confirm_password]):
                messages.error(request, 'Заповніть всі поля')
            elif new_password != confirm_password:
                messages.error(request, 'Нові паролі не співпадають')
            elif len(new_password) < 8:
                messages.error(request, 'Пароль має містити мінімум 8 символів')
            elif not verify_password(current_password, admin['password_hash'], admin['salt']):
                messages.error(request, 'Невірний поточний пароль')
            else:
                # Змінюємо пароль
                new_hash, new_salt = hash_password(new_password)
                json_manager.update_admin_password(admin_id, new_hash, new_salt)
                messages.success(request, 'Пароль успішно змінено')
                print(f"🔐 Адміністратор {admin['username']} змінив пароль")
                return redirect('admin_panel:admin_profile')
    
    context = {
        'admin': admin
    }
    return render(request, 'admin_panel/admin_profile.html', context)


def admin_users_list(request):
    """
    Список адміністраторів (тільки для super admin)
    """
    if not request.session.get('admin_authenticated'):
        return redirect('admin_panel:login')
    
    # Перевіряємо чи є права super admin
    if request.session.get('admin_role') != 'super_admin':
        messages.error(request, 'Доступ заборонено')
        return redirect('admin_panel:dashboard')
    
    from json_manager import JSONManager
    json_manager = JSONManager()
    
    admins = json_manager.get_all_admins()
    
    context = {
        'admins': admins
    }
    return render(request, 'admin_panel/admin_users_list.html', context)


@require_http_methods(["POST"])
def create_admin_user(request):
    """
    Створення нового адміністратора (тільки для super admin)
    """
    if not request.session.get('admin_authenticated'):
        return JsonResponse({'success': False, 'error': 'Не авторизовано'}, status=401)
    
    if request.session.get('admin_role') != 'super_admin':
        return JsonResponse({'success': False, 'error': 'Доступ заборонено'}, status=403)
    
    try:
        import json as json_lib
        data = json_lib.loads(request.body)
        
        username = data.get('username', '').strip()
        password = data.get('password', '')
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        role = data.get('role', 'admin')
        
        # Валідація
        if not username or not password or not name:
            return JsonResponse({'success': False, 'error': 'Заповніть всі обов\'язкові поля'}, status=400)
        
        if len(password) < 8:
            return JsonResponse({'success': False, 'error': 'Пароль має містити мінімум 8 символів'}, status=400)
        
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        # Перевіряємо чи існує користувач
        if json_manager.get_admin_by_username(username):
            return JsonResponse({'success': False, 'error': 'Користувач з таким логіном вже існує'}, status=400)
        
        # Хешуємо пароль
        password_hash, salt = hash_password(password)
        
        # Створюємо адміністратора
        admin_data = {
            'username': username,
            'password_hash': password_hash,
            'salt': salt,
            'name': name,
            'email': email,
            'role': role,
            'created_at': datetime.now().isoformat(),
            'last_login': None,
            'is_active': True
        }
        
        result = json_manager.create_admin(admin_data)
        
        if result:
            print(f"✅ Створено нового адміністратора: {username}")
            return JsonResponse({
                'success': True,
                'message': f'Адміністратор {username} успішно створений'
            })
        else:
            return JsonResponse({'success': False, 'error': 'Помилка створення адміністратора'}, status=500)
        
    except Exception as e:
        print(f"❌ Помилка створення адміністратора: {e}")
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@require_http_methods(["POST"])
def toggle_admin_status(request, admin_id):
    """
    Активація/деактивація адміністратора
    """
    if not request.session.get('admin_authenticated'):
        return JsonResponse({'success': False, 'error': 'Не авторизовано'}, status=401)
    
    if request.session.get('admin_role') != 'super_admin':
        return JsonResponse({'success': False, 'error': 'Доступ заборонено'}, status=403)
    
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        result = json_manager.toggle_admin_status(admin_id)
        
        if result:
            return JsonResponse({'success': True, 'message': 'Статус оновлено'})
        else:
            return JsonResponse({'success': False, 'error': 'Адміністратора не знайдено'}, status=404)
        
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


def check_admin_auth(view_func):
    """
    Декоратор для перевірки авторизації адміністратора
    """
    def wrapper(request, *args, **kwargs):
        if not request.session.get('admin_authenticated'):
            messages.warning(request, 'Будь ласка, увійдіть в систему')
            return redirect('admin_panel:login')
        return view_func(request, *args, **kwargs)
    return wrapper

