// ===== ЛОГІКА КОШИКА ДЛЯ ОКРЕМОЇ СТОРІНКИ =====

// Глобальні змінні для кошика
let cart = {
    items: [],
    total: 0,
    count: 0
};

// Функція для завантаження кошика з localStorage
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('flowerShopCart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            cart.items = parsedCart.items || [];
            cart.total = parsedCart.total || 0;
            cart.count = parsedCart.count || 0;
            console.log('✅ Кошик завантажено з localStorage:', cart);
        }
    } catch (error) {
        console.error('❌ Помилка завантаження кошика:', error);
        cart = { items: [], total: 0, count: 0 };
    }
}

// Функція для збереження кошика в localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem('flowerShopCart', JSON.stringify(cart));
        console.log('💾 Кошик збережено в localStorage:', cart);
    } catch (error) {
        console.error('❌ Помилка збереження кошика:', error);
    }
}

// Функція для оновлення лічильника кошика в навігації
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.count;
        if (cart.count > 0) {
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
    }
}

// Функція для оновлення прогрес бару
function updateProgressBar() {
    const cartTotal = cart.total || 0;
    const maxAmount = 1000; // Максимальна сума для 100% прогрес бару
    const progressPercent = Math.min((cartTotal / maxAmount) * 100, 100);
    
    // Оновлюємо прогрес бар
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    if (progressFill) {
        progressFill.style.width = progressPercent + '%';
    }
    if (progressText) {
        progressText.textContent = `${cartTotal.toFixed(2)}₴ / 1000₴`;
    }
}

// Функція для оновлення відображення кошика
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartItemsCount = document.getElementById('cart-items-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const deliveryInfo = document.getElementById('delivery-threshold-info');
    const cartDelivery = document.getElementById('cart-delivery');
    
    if (!cartItems || !cartEmpty || !cartTotalPrice || !cartItemsCount || !checkoutBtn) return;
    
    // Очищаємо кошик
    cartItems.innerHTML = '';
    
    // Обчислюємо загальну суму
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    if (cart.items.length === 0) {
        // Показуємо порожній кошик
        cartEmpty.style.display = 'flex';
        cartItems.style.display = 'none';
        checkoutBtn.disabled = true;
        clearCartBtn.disabled = true;
    } else {
        // Показуємо товари
        cartEmpty.style.display = 'none';
        cartItems.style.display = 'block';
        checkoutBtn.disabled = false;
        clearCartBtn.disabled = false;
        
        // Додаємо товари в кошик
        cart.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <div class="cart-item-details">
                        <span class="quantity">Кількість: ${item.quantity || 1}</span>
                        <span class="price">${(item.price * (item.quantity || 1)).toFixed(2)} грн</span>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrease" onclick="changeQuantity('${item.id}', -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity || 1}</span>
                    <button class="quantity-btn increase" onclick="changeQuantity('${item.id}', 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="remove-item-btn" data-item-id="${item.id}" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Оновлюємо загальну суму та кількість
    cartTotalPrice.textContent = `${cart.total.toFixed(2)} грн`;
    const itemsText = cart.count === 1 ? 'товар' : 
                     cart.count < 5 ? 'товари' : 'товарів';
    cartItemsCount.textContent = `${cart.count} ${itemsText}`;
    
    // Оновлюємо доставку
    if (cartDelivery) {
        if (cart.total >= 1000) {
            cartDelivery.textContent = 'Безкоштовно';
            cartDelivery.classList.add('free');
        } else {
            const remaining = (1000 - cart.total).toFixed(2);
            cartDelivery.textContent = '50 грн';
            cartDelivery.classList.remove('free');
        }
    }
    
    // Оновлюємо інформацію про доставку
    if (deliveryInfo) {
        if (cart.total >= 1000) {
            deliveryInfo.textContent = '🎉 Вітаємо! Ви отримали безкоштовну доставку!';
            deliveryInfo.classList.add('achieved');
        } else {
            const remaining = (1000 - cart.total).toFixed(2);
            deliveryInfo.textContent = `Додайте товарів на ${remaining}₴ для безкоштовної доставки`;
            deliveryInfo.classList.remove('achieved');
        }
    }
    
    // Оновлюємо прогрес бар
    updateProgressBar();
    
    // Оновлюємо лічильник
    updateCartCount();
}

// Функція для зміни кількості товару
function changeQuantity(itemId, change) {
    const item = cart.items.find(item => item.id === itemId);
    if (!item) return;
    
    const newQuantity = (item.quantity || 1) + change;
    
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    item.quantity = newQuantity;
    updateCartDisplay();
    saveCartToStorage();
    
    // Показуємо анімацію
    const cartItem = document.querySelector(`[data-item-id="${itemId}"]`).closest('.cart-item');
    if (cartItem) {
        cartItem.style.transform = 'scale(1.05)';
        setTimeout(() => {
            cartItem.style.transform = 'scale(1)';
        }, 200);
    }
}

// Функція для видалення товару з кошика
function removeFromCart(itemId) {
    console.log('🗑️ Видалення товару з кошика:', itemId);
    
    // Видаляємо товар з масиву
    cart.items = cart.items.filter(item => item.id !== itemId);
    
    // Оновлюємо відображення кошика
    updateCartDisplay();
    saveCartToStorage();
    
    // Показуємо повідомлення
    showNotification('Товар видалено з кошика', 'info');
}

// Функція для очищення кошика
function clearCart() {
    if (cart.items.length === 0) {
        return;
    }
    
    if (confirm('Ви впевнені, що хочете очистити кошик?')) {
        // Очищаємо кошик
        cart.items = [];
        updateCartDisplay();
        saveCartToStorage();
        
        // Показуємо повідомлення
        showNotification('Кошик очищено', 'success');
    }
}

// Функція для оформлення замовлення
function checkout() {
    if (cart.items.length === 0) {
        showNotification('Кошик порожній!', 'error');
        return;
    }
    
    // Показуємо форму замовлення
    toggleOrderForm();
}

// Функція для перемикання форми замовлення
function toggleOrderForm() {
    const orderForm = document.getElementById('order-form');
    const cartSummary = document.querySelector('.cart-summary-card');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (orderForm.style.display === 'none') {
        // Показуємо форму замовлення
        orderForm.style.display = 'block';
        cartSummary.style.display = 'none';
        checkoutBtn.textContent = 'Повернутися до кошика';
        checkoutBtn.onclick = () => toggleOrderForm();
        
        // Встановлюємо мінімальну дату доставки (завтра)
        const deliveryDate = document.getElementById('deliveryDate');
        if (deliveryDate) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            deliveryDate.min = tomorrow.toISOString().split('T')[0];
            deliveryDate.value = tomorrow.toISOString().split('T')[0];
        }
        
        // Ініціалізуємо вибір способу оплати
        initializePaymentMethods();
        
        // Прокручуємо до форми
        orderForm.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Приховуємо форму замовлення
        orderForm.style.display = 'none';
        cartSummary.style.display = 'block';
        checkoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Оформити замовлення';
        checkoutBtn.onclick = checkout;
    }
}

// Функція для ініціалізації способів оплати
function initializePaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        const radio = method.querySelector('input[type="radio"]');
        const label = method.querySelector('label');
        
        // Обробник кліку на метод оплати
        method.addEventListener('click', () => {
            // Знімаємо вибір з усіх методів
            paymentMethods.forEach(m => {
                m.classList.remove('selected');
                m.querySelector('input[type="radio"]').checked = false;
            });
            
            // Встановлюємо вибір для поточного методу
            method.classList.add('selected');
            radio.checked = true;
        });
    });
}

// Функція для підтвердження замовлення
function submitOrder() {
    if (cart.items.length === 0) {
        showNotification('Кошик порожній!', 'error');
        return;
    }
    
    // Валідація форми
    if (!validateOrderForm()) {
        return;
    }
    
    // Збираємо дані форми
    const orderData = collectOrderData();
    
    // Показуємо підтвердження замовлення
    showOrderConfirmation(orderData);
}

// Функція для валідації форми замовлення
function validateOrderForm() {
    const requiredFields = [
        { id: 'firstName', name: 'Ім\'я' },
        { id: 'lastName', name: 'Прізвище' },
        { id: 'phone', name: 'Телефон' },
        { id: 'city', name: 'Місто' },
        { id: 'address', name: 'Адреса' },
        { id: 'agreeTerms', name: 'Згода з умовами' }
    ];
    
    let isValid = true;
    const errors = [];
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element || !element.value.trim()) {
            if (field.id === 'agreeTerms' && !element.checked) {
                errors.push(`Необхідно погодитися з умовами доставки`);
            } else if (field.id !== 'agreeTerms') {
                errors.push(`Поле "${field.name}" є обов'язковим`);
            }
            isValid = false;
        }
    });
    
    // Перевіряємо вибір способу оплати
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
        errors.push('Оберіть спосіб оплати');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification(errors.join('\n'), 'error');
    }
    
    return isValid;
}

// Функція для збору даних замовлення
function collectOrderData() {
    const orderData = {
        items: cart.items,
        total: cart.total,
        customer: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value
        },
        delivery: {
            city: document.getElementById('city').value,
            address: document.getElementById('address').value,
            postalCode: document.getElementById('postalCode').value,
            date: document.getElementById('deliveryDate').value,
            time: document.getElementById('deliveryTime').value
        },
        payment: document.querySelector('input[name="payment"]:checked').value,
        notes: document.getElementById('notes').value,
        subscribeNews: document.getElementById('subscribeNews').checked,
        orderDate: new Date().toISOString()
    };
    
    return orderData;
}

// Функція для показу підтвердження замовлення
function showOrderConfirmation(orderData) {
    const orderSummary = orderData.items.map(item => 
        `${item.title} (${item.quantity || 1} шт.) - ${(item.price * (item.quantity || 1)).toFixed(2)} грн`
    ).join('\n');
    
    const deliveryInfo = `Доставка: ${orderData.delivery.city}, ${orderData.delivery.address}`;
    const paymentInfo = `Оплата: ${getPaymentMethodName(orderData.payment)}`;
    
    const message = `🎉 Замовлення успішно оформлено!\n\n📋 Деталі замовлення:\n${orderSummary}\n\n💰 Всього: ${orderData.total.toFixed(2)} грн\n\n🚚 ${deliveryInfo}\n💳 ${paymentInfo}\n\n📞 Ми зв'яжемося з вами для підтвердження.\n\nДякуємо за покупку!`;
    
    // Показуємо повідомлення
    showNotification('Замовлення оформлено!', 'success');
    
    // Очищаємо кошик після оформлення
    cart.items = [];
    updateCartDisplay();
    saveCartToStorage();
    
    // Зберігаємо дані замовлення (можна відправити на сервер)
    saveOrderToStorage(orderData);
    
    // Показуємо детальне повідомлення
    setTimeout(() => {
        alert(message);
        
        // Перенаправляємо на головну сторінку
        window.location.href = '/';
    }, 1000);
}

// Функція для отримання назви способу оплати
function getPaymentMethodName(paymentMethod) {
    const methods = {
        'cash': 'Готівка при отриманні',
        'card': 'Банківська карта',
        'online': 'Онлайн оплата'
    };
    return methods[paymentMethod] || 'Невідомо';
}

// Функція для збереження замовлення в localStorage
function saveOrderToStorage(orderData) {
    try {
        const orders = JSON.parse(localStorage.getItem('flowerShopOrders') || '[]');
        orders.push(orderData);
        localStorage.setItem('flowerShopOrders', JSON.stringify(orders));
        console.log('💾 Замовлення збережено в localStorage:', orderData);
    } catch (error) {
        console.error('❌ Помилка збереження замовлення:', error);
    }
}

// Функція для показу повідомлень
function showNotification(message, type = 'info') {
    // Створюємо елемент повідомлення
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Додаємо стилі
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        opacity: 0;
        transform: translateY(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        font-size: 14px;
    `;
    
    // Додаємо до сторінки
    document.body.appendChild(notification);
    
    // Показуємо повідомлення
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Приховуємо через 3 секунди
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Ініціалізація сторінки кошика
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛒 Ініціалізація сторінки кошика...');
    
    // Завантажуємо кошик з localStorage
    loadCartFromStorage();
    
    // Оновлюємо відображення
    updateCartDisplay();
    
    console.log('✅ Сторінка кошика ініціалізована');
});

// Обробка помилок з message port (розширення браузера)
window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('message port')) {
        console.log('🔧 Ігноруємо помилку message port (розширення браузера)');
        e.preventDefault();
        return false;
    }
});

// Обробка необроблених помилок
window.addEventListener('unhandledrejection', function(e) {
    if (e.reason && e.reason.message && e.reason.message.includes('message port')) {
        console.log('🔧 Ігноруємо помилку message port (розширення браузера)');
        e.preventDefault();
    }
});

// Функція для B2B кнопки
function initializeB2BButton() {
    const b2bButton = document.querySelector('.b2b-button');
    if (b2bButton) {
        b2bButton.addEventListener('click', function() {
            alert('B2B функціональність буде додана пізніше!');
        });
    }
}

// Ініціалізуємо B2B кнопку
document.addEventListener('DOMContentLoaded', () => {
    initializeB2BButton();
});

