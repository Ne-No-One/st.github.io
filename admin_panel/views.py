from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import HttpResponse

def admin_dashboard(request):
    """Головна сторінка адмін панелі"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        # Отримуємо останні замовлення (максимум 5)
        all_orders = json_manager.get_orders()
        recent_orders = sorted(all_orders, key=lambda x: x.get('date', ''), reverse=True)[:5]
        
        context = {
            'site_settings': json_manager.get_site_settings(),
            'main_product': json_manager.get_main_product(),
            'additional_products_count': len(json_manager.get_additional_products()),
            'color_options_count': len(json_manager.get_color_options()),
            'quantity_options_count': len(json_manager.get_quantity_options()),
            'services_count': len(json_manager.get_services()),
            'contact_info': json_manager.get_contact_info(),
            'about_section': json_manager.get_about_section(),
            # Нові дані
            'orders_count': len(all_orders),
            'customers_count': len(json_manager.get_customers()),
            'inventory_count': len(json_manager.get_inventory()),
            'low_stock_count': len(json_manager.get_low_stock_items()),
            'recent_orders': recent_orders,
        }
        return render(request, 'admin_panel/dashboard.html', context)
    except Exception as e:
        return HttpResponse(f"Помилка адмін панелі: {e}")

def site_settings(request):
    """Налаштування сайту"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        settings_obj = json_manager.get_site_settings()

        if request.method == 'POST':
            site_title = request.POST.get('site_title', '').strip()
            site_description = request.POST.get('site_description', '').strip()
            cart_button_text = request.POST.get('cart_button_text', '').strip()
            premium_label_text = request.POST.get('premium_label_text', '').strip()
            header_subtitle = request.POST.get('header_subtitle', '').strip()

            if not site_title:
                messages.error(request, 'Назва сайту не може бути порожньою!')
            elif not site_description:
                messages.error(request, 'Опис сайту не може бути порожнім!')
            else:
                # Отримуємо дані головного товару
                main_product_title = request.POST.get('main_product_title', '').strip()
                main_product_add_to_cart_text = request.POST.get('main_product_add_to_cart_text', '').strip()
                main_product_order = request.POST.get('main_product_order', '1').strip()
                main_product_currency = request.POST.get('main_product_currency', 'грн').strip()
                
                # Отримуємо всі додаткові поля
                color_selector_title = request.POST.get('color_selector_title', '').strip()
                quantity_selector_title = request.POST.get('quantity_selector_title', '').strip()
                additional_products_title = request.POST.get('additional_products_title', '').strip()
                add_all_text = request.POST.get('add_all_text', '').strip()
                main_product_premium_label = request.POST.get('main_product_premium_label', '').strip()
                b2b_button_text = request.POST.get('b2b_button_text', '').strip()
                contact_phone = request.POST.get('contact_phone', '').strip()
                contact_email = request.POST.get('contact_email', '').strip()
                contact_address = request.POST.get('contact_address', '').strip()
                about_title = request.POST.get('about_title', '').strip()
                about_description = request.POST.get('about_description', '').strip()
                cart_count_label = request.POST.get('cart_count_label', '').strip()
                currency_symbol = request.POST.get('currency_symbol', '').strip()
                loading_text = request.POST.get('loading_text', '').strip()
                error_text = request.POST.get('error_text', '').strip()
                
                # Оновлюємо налаштування сайту
                updated_settings = {
                    'site_title': site_title,
                    'site_description': site_description,
                    'cart_button_text': cart_button_text or 'В кошик',
                    'premium_label_text': premium_label_text or 'Преміум',
                    'header_subtitle': header_subtitle or 'Красиві квіти для всіх подій',
                    'color_selector_title': color_selector_title or 'колір пакування',
                    'quantity_selector_title': quantity_selector_title or 'кількість квітів',
                    'b2b_button_text': b2b_button_text or 'B2B',
                    'cart_count_label': cart_count_label or 'шт',
                    'currency_symbol': currency_symbol or 'грн',
                    'loading_text': loading_text or 'Сайт завантажується...',
                    'error_text': error_text or 'Помилка завантаження сайту'
                }
                
                # Оновлюємо головний товар
                try:
                    order_int = int(main_product_order) if main_product_order else 1
                except ValueError:
                    order_int = 1
                    
                updated_main_product = {
                    'title': main_product_title or 'Преміум букет квітів',
                    'add_to_cart_text': main_product_add_to_cart_text or 'Додати в кошик',
                    'order': order_int,
                    'currency': main_product_currency or 'грн',
                    'premium_label_text': main_product_premium_label or '⭐ Преміум якість'
                }
                
                # Оновлюємо додаткові налаштування
                updated_additional_settings = {
                    'section_title': additional_products_title or 'Додаткові товари',
                    'add_all_text': add_all_text or 'Додати всі'
                }
                
                # Оновлюємо контактну інформацію
                updated_contact_info = {
                    'phone': contact_phone or '+380 XX XXX XX XX',
                    'email': contact_email or 'info@example.com',
                    'address': contact_address or 'м. Київ, вул. Хрещатик, 1'
                }
                
                # Оновлюємо секцію "Про нас"
                updated_about_section = {
                    'title': about_title or 'Про нас',
                    'description': about_description or 'Ми - провідна компанія у сфері квітів з багаторічним досвідом.'
                }
                
                # Зберігаємо всі зміни
                site_updated = json_manager.update_site_settings(**updated_settings)
                product_updated = json_manager.update_main_product(**updated_main_product)
                additional_updated = json_manager.update_additional_settings(**updated_additional_settings)
                contact_updated = json_manager.update_contact_info(**updated_contact_info)
                about_updated = json_manager.update_about_section(**updated_about_section)
                
                # Перевіряємо результати збереження
                success_count = sum([site_updated, product_updated, additional_updated, contact_updated, about_updated])
                total_count = 5
                
                if success_count == total_count:
                    messages.success(request, 'Всі налаштування успішно оновлено! 🎉')
                elif success_count > 0:
                    messages.warning(request, f'Частково оновлено: {success_count}/{total_count} секцій збережено успішно.')
                else:
                    messages.error(request, 'Помилка збереження всіх налаштувань!')
            return redirect('admin_panel:site_settings')
        
        # Отримуємо дані для відображення
        main_product = json_manager.get_main_product()
        additional_settings = json_manager.get_additional_settings()
        contact_info = json_manager.get_contact_info()
        about_section = json_manager.get_about_section()
        
        context = {
            'settings': settings_obj,
            'main_product': main_product,
            'additional_settings': additional_settings,
            'contact_info': contact_info,
            'about_section': about_section,
            'site_settings': settings_obj  # Додаткове посилання для консистентності
        }
        return render(request, 'admin_panel/site_settings.html', context)
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def main_product_settings(request):
    """Налаштування головного товару та його варіантів"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        main_product = json_manager.get_main_product()
        colors = json_manager.get_color_options()

        if request.method == 'POST':
            action = request.POST.get('action')
            
            if action == 'update_product':
                title = request.POST.get('title', '').strip()
                cart_button_text = request.POST.get('cart_button_text', '').strip()
                order = request.POST.get('order', '1').strip()

                if not title:
                    messages.error(request, 'Назва товару не може бути порожньою!')
                else:
                    try:
                        order_int = int(order) if order else 1
                    except ValueError:
                        order_int = 1
                    
                    updated_data = {
                        'title': title,
                        'currency': 'грн',  # Фіксована валюта
                        'add_to_cart_text': cart_button_text or 'В кошик',
                        'order': order_int
                    }
                    if json_manager.update_main_product(**updated_data):
                        messages.success(request, 'Головний товар успішно оновлено!')
                    else:
                        messages.error(request, 'Помилка збереження головного товару!')
            
            elif action == 'add_variant':
                try:
                    name = request.POST.get('variant_name', '').strip()
                    hex_code = request.POST.get('hex_code', '').strip()
                    image_url = request.POST.get('image_url', '').strip()
                    order = request.POST.get('variant_order', '1').strip()
                    
                    print(f"🔍 Додавання варіанту: name='{name}', hex='{hex_code}', url='{image_url}', order='{order}'")
                    
                    if not name or not hex_code or not image_url:
                        messages.error(request, 'Всі поля варіанту є обов\'язковими!')
                        print("❌ Не всі поля заповнені")
                    elif not hex_code.startswith('#') or len(hex_code) != 7:
                        messages.error(request, 'Hex-код повинен мати формат #rrggbb!')
                        print(f"❌ Неправильний hex-код: {hex_code}")
                    else:
                        try:
                            order_int = int(order) if order else 1
                        except ValueError:
                            order_int = 1
                        print("✅ Всі дані валідні, додаємо варіант...")
                        result = json_manager.add_color_option(name, hex_code, image_url, order_int)
                        print(f"📊 Результат додавання: {result}")
                        
                        if result:
                            messages.success(request, f'Варіант "{name}" успішно додано!')
                            print(f"✅ Варіант '{name}' успішно додано!")
                        else:
                            messages.error(request, 'Помилка додавання варіанту!')
                            print("❌ Помилка при збереженні в JSON")
                except Exception as e:
                    error_msg = f'Помилка: {str(e)}'
                    messages.error(request, error_msg)
                    print(f"💥 Виключення: {e}")
                    import traceback
                    traceback.print_exc()
            
            elif action == 'update_variant':
                variant_id = int(request.POST.get('variant_id'))
                name = request.POST.get('edit_variant_name', '').strip()
                hex_code = request.POST.get('edit_hex_code', '').strip()
                image_url = request.POST.get('edit_image_url', '').strip()
                
                if not name or not hex_code or not image_url:
                    messages.error(request, 'Всі поля варіанту є обов\'язковими!')
                else:
                    if json_manager.update_color_option(variant_id, name, hex_code, image_url):
                        messages.success(request, f'Варіант "{name}" успішно оновлено!')
                    else:
                        messages.error(request, 'Помилка оновлення варіанту!')
                        
            elif action == 'add_quantity':
                try:
                    quantity = int(request.POST.get('quantity', 0))
                    price_per_unit = float(request.POST.get('price_per_unit', 0))
                    order = request.POST.get('quantity_order', '1').strip()
                    
                    if quantity <= 0:
                        messages.error(request, 'Кількість повинна бути більше 0!')
                    elif price_per_unit <= 0:
                        messages.error(request, 'Ціна за одиницю повинна бути більше 0!')
                    else:
                        try:
                            order_int = int(order) if order else 1
                        except ValueError:
                            order_int = 1
                        if json_manager.add_quantity_option_with_price(quantity, price_per_unit, order_int):
                            messages.success(request, f'Варіант {quantity} шт по {price_per_unit} грн/шт додано!')
                        else:
                            messages.error(request, 'Помилка додавання варіанту кількості!')
                except (ValueError, TypeError):
                    messages.error(request, 'Неправильний формат числових даних!')
                    
            elif action == 'update_quantity':
                try:
                    quantity_id = int(request.POST.get('quantity_id'))
                    quantity = int(request.POST.get('edit_quantity', 0))
                    price_per_unit = float(request.POST.get('edit_price_per_unit', 0))
                    is_active = request.POST.get('edit_is_active') == 'on'
                    
                    if quantity <= 0 or price_per_unit <= 0:
                        messages.error(request, 'Кількість та ціна повинні бути більше 0!')
                    else:
                        if json_manager.update_quantity_option(quantity_id, quantity, price_per_unit, is_active):
                            messages.success(request, f'Варіант {quantity} шт оновлено!')
                        else:
                            messages.error(request, 'Помилка оновлення варіанту кількості!')
                except (ValueError, TypeError):
                    messages.error(request, 'Неправильний формат числових даних!')
            
            return redirect('admin_panel:main_product_settings')
        
        quantities = json_manager.get_quantity_options()
        
        context = {
            'product': main_product,
            'variants': colors,  # Кольори
            'quantities': quantities  # Варіанти кількості
        }
        return render(request, 'admin_panel/main_product_settings.html', context)
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def edit_color_variant(request, color_id):
    """Редагування кольорового варіанту"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        colors = json_manager.get_color_options()
        color = None
        for c in colors:
            if c['id'] == color_id:
                color = c
                break
        
        if not color:
            messages.error(request, 'Колір не знайдено!')
            return redirect('admin_panel:main_product_settings')
        
        if request.method == 'POST':
            name = request.POST.get('name', '').strip()
            hex_code = request.POST.get('hex_code', '').strip()
            image_url = request.POST.get('image_url', '').strip()
            is_active = request.POST.get('is_active') == 'on'
            
            if not name or not hex_code or not image_url:
                messages.error(request, 'Всі поля є обов\'язковими!')
            elif not hex_code.startswith('#') or len(hex_code) != 7:
                messages.error(request, 'Hex-код повинен мати формат #rrggbb!')
            else:
                updated_color = {
                    'name': name,
                    'hex_code': hex_code,
                    'image_url': image_url,
                    'is_active': is_active
                }
                if json_manager.update_color_option(color_id, **updated_color):
                    messages.success(request, f'Колір "{name}" успішно оновлено!')
                    return redirect('admin_panel:main_product_settings')
                else:
                    messages.error(request, 'Помилка збереження кольору!')
        
        context = {
            'color': color
        }
        return render(request, 'admin_panel/edit_color_variant.html', context)
    except Exception as e:
        messages.error(request, f'Помилка: {e}')
        return redirect('admin_panel:main_product_settings')

def delete_color_from_main(request, color_id):
    """Видалення кольору з головного товару"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        if json_manager.delete_color_option(color_id):
            messages.success(request, 'Колір успішно видалено!')
        else:
            messages.error(request, 'Помилка видалення кольору!')
        return redirect('admin_panel:main_product_settings')
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def color_options(request):
    """Управління кольорами"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        colors = json_manager.get_color_options()

        if request.method == 'POST':
            name = request.POST.get('name', '').strip()
            hex_code = request.POST.get('hex_code', '').strip()
            image_url = request.POST.get('image_url', '').strip()
            
            if not name or not hex_code:
                messages.error(request, 'Назва та Hex-код кольору не можуть бути порожніми!')
            else:
                if json_manager.add_color_option(name, hex_code, image_url):
                    messages.success(request, 'Колір успішно додано!')
                else:
                    messages.error(request, 'Помилка додавання кольору!')
            return redirect('admin_panel:color_options')
        return render(request, 'admin_panel/color_options.html', {'colors': colors})
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def delete_color_option(request, color_id):
    """Видалення кольору"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        if json_manager.delete_color_option(color_id):
            messages.success(request, 'Колір успішно видалено!')
        else:
            messages.error(request, 'Помилка видалення кольору!')
        return redirect('admin_panel:color_options')
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def quantity_options(request):
    """Управління кількістю"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        quantities = json_manager.get_quantity_options()

        if request.method == 'POST':
            quantity_str = request.POST.get('quantity', '').strip()
            if not quantity_str or not quantity_str.isdigit():
                messages.error(request, 'Кількість повинна бути цілим числом!')
            else:
                quantity = int(quantity_str)
                if json_manager.add_quantity_option(quantity):
                    messages.success(request, 'Кількість успішно додано!')
                else:
                    messages.error(request, 'Помилка додавання кількості!')
            return redirect('admin_panel:quantity_options')
        return render(request, 'admin_panel/quantity_options.html', {'quantities': quantities})
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def edit_quantity_variant(request, quantity_id):
    """Редагування варіанту кількості"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        quantities = json_manager.get_quantity_options()
        quantity = None
        for q in quantities:
            if q['id'] == quantity_id:
                quantity = q
                break
        
        if not quantity:
            messages.error(request, 'Варіант кількості не знайдено!')
            return redirect('admin_panel:main_product_settings')
        
        if request.method == 'POST':
            quantity_value = request.POST.get('quantity', '').strip()
            price_per_unit = request.POST.get('price_per_unit', '').strip()
            is_active = request.POST.get('is_active') == 'on'
            
            try:
                quantity_value = int(quantity_value)
                price_per_unit = float(price_per_unit)
                
                if quantity_value <= 0 or price_per_unit <= 0:
                    messages.error(request, 'Кількість та ціна повинні бути більше 0!')
                else:
                    updated_quantity = {
                        'quantity': quantity_value,
                        'price_per_unit': price_per_unit,
                        'is_active': is_active
                    }
                    if json_manager.update_quantity_option(quantity_id, **updated_quantity):
                        messages.success(request, f'Варіант кількості "{quantity_value}" успішно оновлено!')
                        return redirect('admin_panel:main_product_settings')
                    else:
                        messages.error(request, 'Помилка збереження варіанту кількості!')
            except ValueError:
                messages.error(request, 'Неправильний формат чисел!')
        
        context = {
            'quantity': quantity
        }
        return render(request, 'admin_panel/edit_quantity_variant.html', context)
    except Exception as e:
        messages.error(request, f'Помилка: {e}')
        return redirect('admin_panel:main_product_settings')

def delete_quantity_option(request, quantity_id):
    """Видалення кількості"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        if json_manager.delete_quantity_option(quantity_id):
            messages.success(request, 'Кількість успішно видалено!')
        else:
            messages.error(request, 'Помилка видалення кількості!')
        return redirect('admin_panel:quantity_options')
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def additional_products(request):
    """Управління додатковими товарами"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        products = json_manager.get_additional_products()

        if request.method == 'POST':
            title = request.POST.get('title', '').strip()
            description = request.POST.get('description', '').strip()
            price_str = request.POST.get('price', '').strip()
            currency = request.POST.get('currency', '').strip()
            image_url = request.POST.get('image_url', '').strip()

            if not title or not price_str or not price_str.replace('.', '', 1).isdigit():
                messages.error(request, 'Назва та ціна (число) є обов\'язковими!')
            else:
                price = float(price_str)
                if json_manager.add_additional_product(title, description, price, currency, image_url):
                    messages.success(request, 'Додатковий товар успішно додано!')
                else:
                    messages.error(request, 'Помилка додавання додаткового товару!')
            return redirect('admin_panel:additional_products')
        return render(request, 'admin_panel/additional_products.html', {'products': products})
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def edit_additional_product(request, product_id):
    """Редагування додаткового товару"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        # Знаходимо товар для редагування
        products = json_manager.get_additional_products()
        product = None
        for p in products:
            if p['id'] == product_id:
                product = p
                break
        
        if not product:
            messages.error(request, 'Товар не знайдено!')
            return redirect('admin_panel:additional_products')
        
        if request.method == 'POST':
            title = request.POST.get('title', '').strip()
            description = request.POST.get('description', '').strip()
            price_str = request.POST.get('price', '').strip()
            currency = request.POST.get('currency', '').strip()
            image_url = request.POST.get('image_url', '').strip()
            order = request.POST.get('order', '1').strip()

            if not title or not price_str or not price_str.replace('.', '', 1).isdigit():
                messages.error(request, 'Назва та ціна (число) є обов\'язковими!')
            else:
                try:
                    order_int = int(order) if order else 1
                except ValueError:
                    order_int = 1
                price = float(price_str)
                if json_manager.update_additional_product(product_id, title, description, price, currency, image_url, order_int):
                    messages.success(request, 'Додатковий товар успішно оновлено!')
                    return redirect('admin_panel:additional_products')
                else:
                    messages.error(request, 'Помилка оновлення додаткового товару!')
        
        return render(request, 'admin_panel/edit_additional_product.html', {'product': product})
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def delete_additional_product(request, product_id):
    """Видалення додаткового товару"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        if json_manager.delete_additional_product(product_id):
            messages.success(request, 'Додатковий товар успішно видалено!')
        else:
            messages.error(request, 'Помилка видалення додаткового товару!')
        return redirect('admin_panel:additional_products')
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def about_section(request):
    """Управління секцією 'Про нас'"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        about = json_manager.get_about_section()

        if request.method == 'POST':
            title = request.POST.get('title', '').strip()
            description = request.POST.get('description', '').strip()
            show_section = request.POST.get('show_section') == 'on'

            if not title or not description:
                messages.error(request, 'Заголовок та опис секції "Про нас" не можуть бути порожніми!')
            else:
                if json_manager.update_about_section(title, description, show_section):
                    messages.success(request, 'Секція "Про нас" успішно оновлена!')
                else:
                    messages.error(request, 'Помилка збереження секції "Про нас"!')
            return redirect('admin_panel:about_section')
        return render(request, 'admin_panel/about_section.html', {'about': about})
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def services(request):
    """Управління послугами"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        services_list = json_manager.get_services()

        if request.method == 'POST':
            title = request.POST.get('title', '').strip()
            description = request.POST.get('description', '').strip()
            icon = request.POST.get('icon', '').strip()

            if not title or not description or not icon:
                messages.error(request, 'Всі поля послуги є обов\'язковими!')
            else:
                if json_manager.add_service(title, description, icon):
                    messages.success(request, 'Послугу успішно додано!')
                else:
                    messages.error(request, 'Помилка додавання послуги!')
            return redirect('admin_panel:services')
        return render(request, 'admin_panel/services.html', {'services': services_list})
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def delete_service(request, service_id):
    """Видалення послуги"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        if json_manager.delete_service(service_id):
            messages.success(request, 'Послугу успішно видалено!')
        else:
            messages.error(request, 'Помилка видалення послуги!')
        return redirect('admin_panel:services')
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def contact_info(request):
    """Управління контактною інформацією"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        contact = json_manager.get_contact_info()

        if request.method == 'POST':
            phone = request.POST.get('phone', '').strip()
            email = request.POST.get('email', '').strip()
            address = request.POST.get('address', '').strip()
            working_hours = request.POST.get('working_hours', '').strip()

            if not phone or not email or not address or not working_hours:
                messages.error(request, 'Всі поля контактної інформації є обов\'язковими!')
            else:
                if json_manager.update_contact_info(phone, email, address, working_hours):
                    messages.success(request, 'Контактну інформацію успішно оновлено!')
                else:
                    messages.error(request, 'Помилка збереження контактної інформації!')
            return redirect('admin_panel:contact_info')
        return render(request, 'admin_panel/contact_info.html', {'contact': contact})
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def about_section(request):
    """Управління секцією 'Про нас'"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        about = json_manager.get_about_section()

        if request.method == 'POST':
            title = request.POST.get('title', '').strip()
            description = request.POST.get('description', '').strip()
            show_section = request.POST.get('show_section') == 'on'

            if not title or not description:
                messages.error(request, 'Заголовок та опис є обов\'язковими!')
            else:
                if json_manager.update_about_section(title, description, show_section):
                    messages.success(request, 'Секцію "Про нас" успішно оновлено!')
                else:
                    messages.error(request, 'Помилка збереження секції "Про нас"!')
            return redirect('admin_panel:about_section')
        return render(request, 'admin_panel/about_section.html', {'about': about})
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

# ===== ORDERS MANAGEMENT =====

def orders_list(request):
    """Список замовлень"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        # Фільтр по статусу
        status_filter = request.GET.get('status', 'all')
        
        if status_filter == 'all':
            orders = json_manager.get_orders()
        else:
            orders = json_manager.get_orders_by_status(status_filter)
        
        # Статистика
        all_orders = json_manager.get_orders()
        stats = {
            'total': len(all_orders),
            'new': len([o for o in all_orders if o.get('status') == 'нове']),
            'processing': len([o for o in all_orders if o.get('status') == 'в обробці']),
            'completed': len([o for o in all_orders if o.get('status') == 'виконано']),
            'cancelled': len([o for o in all_orders if o.get('status') == 'скасовано'])
        }
        
        context = {
            'orders': orders,
            'current_filter': status_filter,
            'stats': stats
        }
        return render(request, 'admin_panel/orders_list.html', context)
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def order_detail(request, order_id):
    """Деталі замовлення"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        order = json_manager.get_order_by_id(order_id)
        if not order:
            messages.error(request, f"Замовлення з ID {order_id} не знайдено")
            return redirect('admin_panel:orders_list')
        
        context = {'order': order}
        return render(request, 'admin_panel/order_detail.html', context)
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def update_order_status(request, order_id):
    """Оновлення статусу замовлення"""
    try:
        from json_manager import JSONManager
        from datetime import datetime
        json_manager = JSONManager()
        
        if request.method == 'POST':
            new_status = request.POST.get('status')
            comment = request.POST.get('comment', '').strip()
            
            # Отримуємо поточне замовлення
            order = json_manager.get_order_by_id(order_id)
            if not order:
                messages.error(request, 'Замовлення не знайдено!')
                return redirect('admin_panel:orders_list')
            
            # Оновлюємо статус
            if json_manager.update_order_status(order_id, new_status):
                status_emoji = {
                    'нове': '🆕',
                    'в обробці': '⏳', 
                    'виконано': '✅',
                    'скасовано': '❌'
                }
                
                emoji = status_emoji.get(new_status, '')
                messages.success(request, f'Статус замовлення {order.get("order_number")} оновлено на "{emoji} {new_status}"')
                
                # Логування зміни статусу
                if comment:
                    print(f"📝 Статус замовлення {order.get('order_number')} змінено на '{new_status}'. Коментар: {comment}")
                else:
                    print(f"📝 Статус замовлення {order.get('order_number')} змінено на '{new_status}'")
            else:
                messages.error(request, 'Помилка оновлення статусу замовлення!')
        
        return redirect('admin_panel:orders_list')
    except Exception as e:
        messages.error(request, f"Помилка: {e}")
        return redirect('admin_panel:orders_list')

# ===== CUSTOMERS MANAGEMENT =====

def customers_list(request):
    """Список клієнтів"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        customers = json_manager.get_customers()
        
        # Статистика
        total_customers = len(customers)
        vip_customers = len([c for c in customers if c.get('total_spent', 0) > 5000])
        new_customers = len([c for c in customers if c.get('registration_date', '').startswith('2025-09')])
        
        context = {
            'customers': customers,
            'stats': {
                'total': total_customers,
                'vip': vip_customers,
                'new_this_month': new_customers
            }
        }
        return render(request, 'admin_panel/customers_list.html', context)
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def customer_detail(request, customer_id):
    """Деталі клієнта"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        customer = json_manager.get_customer_by_id(customer_id)
        if not customer:
            messages.error(request, f"Клієнт з ID {customer_id} не знайдений")
            return redirect('admin_panel:customers_list')
        
        # Отримуємо замовлення клієнта
        all_orders = json_manager.get_orders()
        customer_orders = [order for order in all_orders 
                          if order.get('customer_name') == customer.get('name')]
        
        context = {
            'customer': customer,
            'customer_orders': customer_orders
        }
        return render(request, 'admin_panel/customer_detail.html', context)
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def add_customer(request):
    """Додавання нового клієнта"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        if request.method == 'POST':
            customer_data = {
                'name': request.POST.get('name'),
                'phone': request.POST.get('phone'),
                'email': request.POST.get('email'),
                'address': request.POST.get('address'),
                'birthday': request.POST.get('birthday'),
                'registration_date': request.POST.get('registration_date'),
                'total_orders': 0,
                'total_spent': 0.0,
                'loyalty_points': 0,
                'notes': request.POST.get('notes', '')
            }
            
            customer_id = json_manager.add_customer(customer_data)
            if customer_id:
                messages.success(request, f"Клієнт '{customer_data['name']}' додан успішно")
                return redirect('admin_panel:customer_detail', customer_id=customer_id)
            else:
                messages.error(request, "Помилка при додаванні клієнта")
        
        return render(request, 'admin_panel/add_customer.html')
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def edit_customer(request, customer_id):
    """Редагування клієнта"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        customer = json_manager.get_customer_by_id(customer_id)
        if not customer:
            messages.error(request, f"Клієнт з ID {customer_id} не знайдений")
            return redirect('admin_panel:customers_list')
        
        if request.method == 'POST':
            customer_data = {
                'name': request.POST.get('name'),
                'phone': request.POST.get('phone'),
                'email': request.POST.get('email'),
                'address': request.POST.get('address'),
                'birthday': request.POST.get('birthday'),
                'notes': request.POST.get('notes', '')
            }
            
            if json_manager.update_customer(customer_id, customer_data):
                messages.success(request, f"Дані клієнта оновлено")
                return redirect('admin_panel:customer_detail', customer_id=customer_id)
            else:
                messages.error(request, "Помилка при оновленні даних клієнта")
        
        context = {'customer': customer}
        return render(request, 'admin_panel/edit_customer.html', context)
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

# ===== INVENTORY MANAGEMENT =====

def inventory_list(request):
    """Список інвентарю"""
    try:
        from json_manager import JSONManager
        from datetime import datetime
        json_manager = JSONManager()
        
        # Обробка POST запитів
        if request.method == 'POST':
            action = request.POST.get('action')
            
            if action == 'add_item':
                name = request.POST.get('name', '').strip()
                category = request.POST.get('category', '').strip()
                current_stock = int(request.POST.get('current_stock', 0))
                min_stock = int(request.POST.get('min_stock', 1))
                unit = request.POST.get('unit', 'шт').strip()
                supplier_price = float(request.POST.get('supplier_price', 0))
                selling_price = float(request.POST.get('selling_price', 0))
                
                new_item = {
                    'id': len(json_manager.get_inventory()) + 1,
                    'name': name,
                    'category': category,
                    'current_stock': current_stock,
                    'min_stock': min_stock,
                    'unit': unit,
                    'supplier_price': supplier_price,
                    'selling_price': selling_price,
                    'last_restock_date': datetime.now().strftime('%Y-%m-%d'),
                    'created_date': datetime.now().strftime('%Y-%m-%d')
                }
                
                if json_manager.add_inventory_item(new_item):
                    messages.success(request, f'Товар "{name}" успішно додано!')
                else:
                    messages.error(request, 'Помилка додавання товару!')
                    
            elif action == 'edit_item':
                item_id = int(request.POST.get('item_id'))
                name = request.POST.get('name', '').strip()
                category = request.POST.get('category', '').strip()
                min_stock = int(request.POST.get('min_stock', 1))
                unit = request.POST.get('unit', 'шт').strip()
                supplier_price = float(request.POST.get('supplier_price', 0))
                selling_price = float(request.POST.get('selling_price', 0))
                
                update_data = {
                    'name': name,
                    'category': category,
                    'min_stock': min_stock,
                    'unit': unit,
                    'supplier_price': supplier_price,
                    'selling_price': selling_price
                }
                
                if json_manager.update_inventory_item(item_id, update_data):
                    messages.success(request, f'Товар "{name}" успішно оновлено!')
                else:
                    messages.error(request, 'Помилка оновлення товару!')
        
        inventory = json_manager.get_inventory()
        low_stock_items = json_manager.get_low_stock_items()
        
        # Розширена статистика з фінансовими розрахунками
        total_items = len(inventory)
        low_stock_count = len(low_stock_items)
        
        # Фінансові розрахунки
        total_purchase_cost = sum([item.get('current_stock', 0) * item.get('supplier_price', 0) for item in inventory])
        total_selling_value = sum([item.get('current_stock', 0) * item.get('selling_price', 0) for item in inventory])
        potential_profit = total_selling_value - total_purchase_cost
        profit_margin = (potential_profit / total_selling_value * 100) if total_selling_value > 0 else 0
        
        context = {
            'inventory': inventory,
            'low_stock_items': low_stock_items,
            'stats': {
                'total_items': total_items,
                'low_stock_count': low_stock_count,
                'total_purchase_cost': total_purchase_cost,
                'total_selling_value': total_selling_value,
                'potential_profit': potential_profit,
                'profit_margin': profit_margin
            }
        }
        return render(request, 'admin_panel/inventory_list.html', context)
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def update_inventory_stock(request, item_id):
    """Оновлення кількості на складі"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        if request.method == 'POST':
            new_stock = int(request.POST.get('new_stock', 0))
            if json_manager.update_stock(item_id, new_stock):
                messages.success(request, "Кількість на складі оновлено")
            else:
                messages.error(request, "Помилка при оновленні складу")
        
        return redirect('admin_panel:inventory_list')
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

# ===== FINANCIAL REPORTS =====

def financial_reports(request):
    """Фінансові звіти"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        reports = json_manager.get_financial_reports()
        daily_sales = json_manager.get_daily_sales(limit=7)  # Останні 7 днів
        monthly_summary = json_manager.get_monthly_summary()
        
        # Загальна статистика
        orders = json_manager.get_orders()
        customers = json_manager.get_customers()
        
        context = {
            'daily_sales': daily_sales,
            'monthly_summary': monthly_summary,
            'stats': {
                'total_orders': len(orders),
                'total_customers': len(customers),
                'monthly_revenue': monthly_summary.get('total_revenue', 0),
                'monthly_profit': monthly_summary.get('profit', 0)
            }
        }
        return render(request, 'admin_panel/financial_reports.html', context)
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")

def daily_sales_report(request):
    """Детальний щоденний звіт"""
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        
        limit = int(request.GET.get('days', 30))
        daily_sales = json_manager.get_daily_sales(limit=limit)
        
        context = {
            'daily_sales': daily_sales,
            'days_limit': limit
        }
        return render(request, 'admin_panel/daily_sales_report.html', context)
    except Exception as e:
        return HttpResponse(f"Помилка: {e}")