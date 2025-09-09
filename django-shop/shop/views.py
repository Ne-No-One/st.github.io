from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

from .models import Product, Category, Cart, CartItem, Order, OrderItem

def home(request):
    """Головна сторінка магазину"""
    products = Product.objects.all()[:6]  # Показуємо 6 товарів
    categories = Category.objects.all()
    
    context = {
        'products': products,
        'categories': categories,
        'is_django': True
    }
    return render(request, 'shop/index.html', context)

def product_detail(request, product_id):
    """Детальна сторінка товару"""
    product = get_object_or_404(Product, id=product_id)
    related_products = Product.objects.filter(category=product.category).exclude(id=product_id)[:4]
    
    context = {
        'product': product,
        'related_products': related_products,
        'is_django': True
    }
    return render(request, 'shop/product_detail.html', context)

def category_products(request, category_slug):
    """Товари по категорії"""
    category = get_object_or_404(Category, slug=category_slug)
    products = Product.objects.filter(category=category)
    
    context = {
        'category': category,
        'products': products,
        'is_django': True
    }
    return render(request, 'shop/category.html', context)

@require_POST
def add_to_cart(request):
    """Додати товар в кошик"""
    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        quantity = int(data.get('quantity', 1))
        
        product = get_object_or_404(Product, id=product_id)
        
        # Отримуємо або створюємо кошик
        cart, created = Cart.objects.get_or_create(
            session_key=request.session.session_key,
            defaults={'user': request.user if request.user.is_authenticated else None}
        )
        
        # Додаємо товар в кошик
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        return JsonResponse({'success': True, 'message': 'Товар додано в кошик'})
        
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})

def cart_view(request):
    """Перегляд кошика"""
    cart = Cart.objects.filter(session_key=request.session.session_key).first()
    cart_items = CartItem.objects.filter(cart=cart) if cart else []
    
    total = sum(item.product.price * item.quantity for item in cart_items)
    
    context = {
        'cart_items': cart_items,
        'total': total,
        'is_django': True
    }
    return render(request, 'shop/cart.html', context)

def checkout(request):
    """Оформлення замовлення"""
    cart = Cart.objects.filter(session_key=request.session.session_key).first()
    cart_items = CartItem.objects.filter(cart=cart) if cart else []
    
    if not cart_items:
        messages.warning(request, 'Ваш кошик порожній')
        return redirect('cart')
    
    total = sum(item.product.price * item.quantity for item in cart_items)
    
    if request.method == 'POST':
        # Обробка замовлення
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        
        # Створюємо замовлення
        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            email=email,
            phone=phone,
            address=address,
            total=total
        )
        
        # Додаємо товари до замовлення
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
        
        # Очищуємо кошик
        cart.delete()
        
        messages.success(request, 'Замовлення успішно оформлено!')
        return redirect('order_success', order_id=order.id)
    
    context = {
        'cart_items': cart_items,
        'total': total,
        'is_django': True
    }
    return render(request, 'shop/checkout.html', context)

def order_success(request, order_id):
    """Сторінка успішного замовлення"""
    order = get_object_or_404(Order, id=order_id)
    
    context = {
        'order': order,
        'is_django': True
    }
    return render(request, 'shop/order_success.html', context)
