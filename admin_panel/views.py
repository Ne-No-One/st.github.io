from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.paginator import Paginator
from django.db import transaction
import json

from .models import (
    SiteSettings, ColorOption, QuantityOption, MainProduct, 
    AdditionalProduct, AdditionalProductsSettings, ContactInfo, Service
)

def admin_dashboard(request):
    """Головна сторінка адмін панелі"""
    context = {
        'site_settings': SiteSettings.objects.first(),
        'main_product': MainProduct.objects.first(),
        'additional_products_count': AdditionalProduct.objects.filter(is_active=True).count(),
        'color_options_count': ColorOption.objects.filter(is_active=True).count(),
        'quantity_options_count': QuantityOption.objects.filter(is_active=True).count(),
        'services_count': Service.objects.filter(is_active=True).count(),
    }
    return render(request, 'admin_panel/dashboard.html', context)

def site_settings(request):
    """Налаштування сайту"""
    settings_obj = SiteSettings.objects.first()
    if not settings_obj:
        settings_obj = SiteSettings.objects.create()
    
    if request.method == 'POST':
        settings_obj.site_title = request.POST.get('site_title', settings_obj.site_title)
        settings_obj.site_description = request.POST.get('site_description', settings_obj.site_description)
        settings_obj.hero_section_title = request.POST.get('hero_section_title', settings_obj.hero_section_title)
        settings_obj.hero_section_description = request.POST.get('hero_section_description', settings_obj.hero_section_description)
        settings_obj.primary_color = request.POST.get('primary_color', settings_obj.primary_color)
        settings_obj.secondary_color = request.POST.get('secondary_color', settings_obj.secondary_color)
        settings_obj.hero_section_width_pc = int(request.POST.get('hero_section_width_pc', settings_obj.hero_section_width_pc))
        settings_obj.additional_products_width_pc = int(request.POST.get('additional_products_width_pc', settings_obj.additional_products_width_pc))
        settings_obj.save()
        messages.success(request, 'Налаштування сайту успішно оновлено!')
        return redirect('admin_panel:site_settings')
    
    return render(request, 'admin_panel/site_settings.html', {'settings': settings_obj})

def main_product_settings(request):
    """Налаштування головного товару"""
    product = MainProduct.objects.first()
    if not product:
        product = MainProduct.objects.create()
    
    if request.method == 'POST':
        product.title = request.POST.get('title', product.title)
        product.description = request.POST.get('description', product.description)
        product.base_price = float(request.POST.get('base_price', product.base_price))
        product.currency = request.POST.get('currency', product.currency)
        product.add_to_cart_text = request.POST.get('add_to_cart_text', product.add_to_cart_text)
        product.remove_from_cart_text = request.POST.get('remove_from_cart_text', product.remove_from_cart_text)
        product.show_premium_label = 'show_premium_label' in request.POST
        product.premium_label_text = request.POST.get('premium_label_text', product.premium_label_text)
        product.is_active = 'is_active' in request.POST
        product.save()
        messages.success(request, 'Налаштування головного товару успішно оновлено!')
        return redirect('admin_panel:main_product_settings')
    
    return render(request, 'admin_panel/main_product_settings.html', {'product': product})

def color_options(request):
    """Управління кольоровими варіантами"""
    colors = ColorOption.objects.all().order_by('order')
    
    if request.method == 'POST':
        if 'add_color' in request.POST:
            name = request.POST.get('name')
            hex_code = request.POST.get('hex_code')
            image = request.FILES.get('image')
            order = int(request.POST.get('order', 0))
            
            if name and hex_code and image:
                ColorOption.objects.create(
                    name=name,
                    hex_code=hex_code,
                    image=image,
                    order=order
                )
                messages.success(request, 'Кольоровий варіант успішно додано!')
            else:
                messages.error(request, 'Заповніть всі обов\'язкові поля!')
        
        elif 'update_colors' in request.POST:
            # Оновлення порядку та статусу кольорів
            colors_data = json.loads(request.POST.get('colors_data', '[]'))
            for color_data in colors_data:
                color = get_object_or_404(ColorOption, id=color_data['id'])
                color.order = color_data['order']
                color.is_active = color_data['is_active']
                color.save()
            messages.success(request, 'Кольорові варіанти успішно оновлено!')
        
        return redirect('admin_panel:color_options')
    
    return render(request, 'admin_panel/color_options.html', {'colors': colors})

def quantity_options(request):
    """Управління варіантами кількості"""
    quantities = QuantityOption.objects.all().order_by('order')
    
    if request.method == 'POST':
        if 'add_quantity' in request.POST:
            quantity = int(request.POST.get('quantity'))
            order = int(request.POST.get('order', 0))
            
            if quantity > 0:
                QuantityOption.objects.create(
                    quantity=quantity,
                    order=order
                )
                messages.success(request, 'Варіант кількості успішно додано!')
            else:
                messages.error(request, 'Кількість повинна бути більше 0!')
        
        elif 'update_quantities' in request.POST:
            # Оновлення порядку та статусу варіантів кількості
            quantities_data = json.loads(request.POST.get('quantities_data', '[]'))
            for quantity_data in quantities_data:
                quantity_obj = get_object_or_404(QuantityOption, id=quantity_data['id'])
                quantity_obj.order = quantity_data['order']
                quantity_obj.is_active = quantity_data['is_active']
                quantity_obj.save()
            messages.success(request, 'Варіанти кількості успішно оновлено!')
        
        return redirect('admin_panel:quantity_options')
    
    return render(request, 'admin_panel/quantity_options.html', {'quantities': quantities})

def additional_products(request):
    """Управління додатковими товарами"""
    products = AdditionalProduct.objects.all().order_by('order')
    
    if request.method == 'POST':
        if 'add_product' in request.POST:
            title = request.POST.get('title')
            description = request.POST.get('description', '')
            price = float(request.POST.get('price', 0))
            currency = request.POST.get('currency', 'грн')
            image = request.FILES.get('image')
            order = int(request.POST.get('order', 0))
            
            if title and price > 0 and image:
                AdditionalProduct.objects.create(
                    title=title,
                    description=description,
                    price=price,
                    currency=currency,
                    image=image,
                    order=order
                )
                messages.success(request, 'Додатковий товар успішно додано!')
            else:
                messages.error(request, 'Заповніть всі обов\'язкові поля!')
        
        elif 'update_products' in request.POST:
            # Оновлення порядку та статусу товарів
            products_data = json.loads(request.POST.get('products_data', '[]'))
            for product_data in products_data:
                product = get_object_or_404(AdditionalProduct, id=product_data['id'])
                product.order = product_data['order']
                product.is_active = product_data['is_active']
                product.save()
            messages.success(request, 'Додаткові товари успішно оновлено!')
        
        return redirect('admin_panel:additional_products')
    
    return render(request, 'admin_panel/additional_products.html', {'products': products})

def edit_additional_product(request, product_id):
    """Редагування додаткового товару"""
    product = get_object_or_404(AdditionalProduct, id=product_id)
    
    if request.method == 'POST':
        product.title = request.POST.get('title', product.title)
        product.description = request.POST.get('description', product.description)
        product.price = float(request.POST.get('price', product.price))
        product.currency = request.POST.get('currency', product.currency)
        product.add_to_cart_text = request.POST.get('add_to_cart_text', product.add_to_cart_text)
        product.remove_from_cart_text = request.POST.get('remove_from_cart_text', product.remove_from_cart_text)
        product.order = int(request.POST.get('order', product.order))
        product.is_active = 'is_active' in request.POST
        
        if 'image' in request.FILES:
            product.image = request.FILES['image']
        
        product.save()
        messages.success(request, 'Додатковий товар успішно оновлено!')
        return redirect('admin_panel:additional_products')
    
    return render(request, 'admin_panel/edit_additional_product.html', {'product': product})

def delete_additional_product(request, product_id):
    """Видалення додаткового товару"""
    product = get_object_or_404(AdditionalProduct, id=product_id)
    product.delete()
    messages.success(request, 'Додатковий товар успішно видалено!')
    return redirect('admin_panel:additional_products')

def additional_products_settings(request):
    """Налаштування секції додаткових товарів"""
    settings_obj = AdditionalProductsSettings.objects.first()
    if not settings_obj:
        settings_obj = AdditionalProductsSettings.objects.create()
    
    if request.method == 'POST':
        settings_obj.section_title = request.POST.get('section_title', settings_obj.section_title)
        settings_obj.add_all_text = request.POST.get('add_all_text', settings_obj.add_all_text)
        settings_obj.remove_all_text = request.POST.get('remove_all_text', settings_obj.remove_all_text)
        settings_obj.show_section = 'show_section' in request.POST
        settings_obj.max_products_per_row = int(request.POST.get('max_products_per_row', settings_obj.max_products_per_row))
        settings_obj.save()
        messages.success(request, 'Налаштування секції додаткових товарів успішно оновлено!')
        return redirect('admin_panel:additional_products_settings')
    
    return render(request, 'admin_panel/additional_products_settings.html', {'settings': settings_obj})

def contact_info(request):
    """Управління контактною інформацією"""
    contact = ContactInfo.objects.first()
    if not contact:
        contact = ContactInfo.objects.create()
    
    if request.method == 'POST':
        contact.phone = request.POST.get('phone', contact.phone)
        contact.email = request.POST.get('email', contact.email)
        contact.address = request.POST.get('address', contact.address)
        contact.working_hours = request.POST.get('working_hours', contact.working_hours)
        contact.instagram = request.POST.get('instagram', contact.instagram)
        contact.facebook = request.POST.get('facebook', contact.facebook)
        contact.telegram = request.POST.get('telegram', contact.telegram)
        contact.is_active = 'is_active' in request.POST
        contact.save()
        messages.success(request, 'Контактна інформація успішно оновлена!')
        return redirect('admin_panel:contact_info')
    
    return render(request, 'admin_panel/contact_info.html', {'contact': contact})

def services(request):
    """Управління послугами"""
    services_list = Service.objects.all().order_by('order')
    
    if request.method == 'POST':
        if 'add_service' in request.POST:
            title = request.POST.get('title')
            description = request.POST.get('description')
            icon = request.POST.get('icon', '🌟')
            order = int(request.POST.get('order', 0))
            
            if title and description:
                Service.objects.create(
                    title=title,
                    description=description,
                    icon=icon,
                    order=order
                )
                messages.success(request, 'Послугу успішно додано!')
            else:
                messages.error(request, 'Заповніть всі обов\'язкові поля!')
        
        elif 'update_services' in request.POST:
            # Оновлення порядку та статусу послуг
            services_data = json.loads(request.POST.get('services_data', '[]'))
            for service_data in services_data:
                service = get_object_or_404(Service, id=service_data['id'])
                service.order = service_data['order']
                service.is_active = service_data['is_active']
                service.save()
            messages.success(request, 'Послуги успішно оновлено!')
        
        return redirect('admin_panel:services')
    
    return render(request, 'admin_panel/services.html', {'services': services_list})

def edit_service(request, service_id):
    """Редагування послуги"""
    service = get_object_or_404(Service, id=service_id)
    
    if request.method == 'POST':
        service.title = request.POST.get('title', service.title)
        service.description = request.POST.get('description', service.description)
        service.icon = request.POST.get('icon', service.icon)
        service.order = int(request.POST.get('order', service.order))
        service.is_active = 'is_active' in request.POST
        service.save()
        messages.success(request, 'Послугу успішно оновлено!')
        return redirect('admin_panel:services')
    
    return render(request, 'admin_panel/edit_service.html', {'service': service})

def delete_service(request, service_id):
    """Видалення послуги"""
    service = get_object_or_404(Service, id=service_id)
    service.delete()
    messages.success(request, 'Послугу успішно видалено!')
    return redirect('admin_panel:services')

@csrf_exempt
@require_http_methods(["POST"])
def delete_color_option(request, color_id):
    """API для видалення кольорового варіанту"""
    try:
        color = get_object_or_404(ColorOption, id=color_id)
        color.delete()
        return JsonResponse({'success': True, 'message': 'Кольоровий варіант успішно видалено!'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})

@csrf_exempt
@require_http_methods(["POST"])
def delete_quantity_option(request, quantity_id):
    """API для видалення варіанту кількості"""
    try:
        quantity = get_object_or_404(QuantityOption, id=quantity_id)
        quantity.delete()
        return JsonResponse({'success': True, 'message': 'Варіант кількості успішно видалено!'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})
