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
        progressText.textContent = `${Math.round(cartTotal)}₴ / 1000₴`;
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
    
    // Елементи для відображення інформації про замовлення
    const totalFlowerCount = document.getElementById('total-flower-count');
    const totalItemsCount = document.getElementById('total-items-count');
    const totalOrderPrice = document.getElementById('total-order-price');
    const cartClearSection = document.getElementById('cart-clear-section');
    
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
        if (cartClearSection) cartClearSection.style.display = 'none';
    } else {
        // Показуємо товари
        cartEmpty.style.display = 'none';
        cartItems.style.display = 'block';
        checkoutBtn.disabled = false;
        if (cartClearSection) cartClearSection.style.display = 'block';
        
        // Додаємо товари в кошик
        cart.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            // Формуємо інформацію про колір та кількість
            let colorInfo = '';
            let quantityInfo = '';
            
            if (item.color) {
                colorInfo = `<div class="item-color">
                    <span class="color-label">Колір:</span>
                    <div class="color-preview" style="background-color: ${item.color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.3); display: inline-block; margin-left: 8px;"></div>
                </div>`;
            }
            
            if (item.flowerQuantity && item.flowerQuantity !== '1') {
                quantityInfo = `<div class="item-quantity">
                    <span class="quantity-value">${item.flowerQuantity}</span>
                </div>`;
            }
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <div class="cart-item-details">
                        ${colorInfo}
                        ${quantityInfo}
                        <div class="item-total">
                            <span class="quantity">Кількість: ${item.quantity || 1}</span>
                            <span class="price">${Math.round(item.price * (item.quantity || 1))} грн</span>
                        </div>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item-btn" data-item-id="${item.id}" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Оновлюємо загальну суму та кількість
    cartTotalPrice.textContent = `${Math.round(cart.total)} грн`;
    const itemsText = cart.count === 1 ? 'товар' : 
                     cart.count < 5 ? 'товари' : 'товарів';
    cartItemsCount.textContent = `${cart.count} ${itemsText}`;
    
    // Оновлюємо доставку
    if (cartDelivery) {
        if (cart.total >= 1000) {
            cartDelivery.textContent = 'Безкоштовно';
            cartDelivery.classList.add('free');
        } else {
            const remaining = Math.round(1000 - cart.total);
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
            const remaining = Math.round(1000 - cart.total);
            deliveryInfo.textContent = `Додайте товарів на ${remaining}₴ для безкоштовної доставки`;
            deliveryInfo.classList.remove('achieved');
        }
    }
    
    // Оновлюємо прогрес бар
    updateProgressBar();
    
    // Оновлюємо лічильник
    updateCartCount();
    
    // Підраховуємо загальну кількість квітів
    let totalFlowers = 0;
    cart.items.forEach(item => {
        if (item.flowerQuantity && item.flowerQuantity !== '1') {
            const flowerCount = parseInt(item.flowerQuantity) || 0;
            const itemQuantity = item.quantity || 1;
            totalFlowers += flowerCount * itemQuantity;
        } else {
            // Якщо кількість квітів не вказана, вважаємо 1 квіт на товар
            totalFlowers += (item.quantity || 1);
        }
    });
    
    // Оновлюємо відображення інформації про замовлення
    if (totalFlowerCount) {
        totalFlowerCount.textContent = totalFlowers;
    }
    if (totalItemsCount) {
        totalItemsCount.textContent = cart.count;
    }
    if (totalOrderPrice) {
        totalOrderPrice.textContent = `${Math.round(cart.total)} грн`;
    }
}

// Функція changeQuantity видалена, оскільки кнопки зміни кількості прибрані

// Функції для роботи з формою замовлення
function showOrderForm() {
    const orderForm = document.getElementById('order-form');
    
    if (orderForm) {
        orderForm.style.display = 'block';
        
        // Плавна прокрутка до форми
        orderForm.scrollIntoView({ behavior: 'smooth' });
    }
}

function backToCart() {
    const orderForm = document.getElementById('order-form');
    
    if (orderForm) {
        orderForm.style.display = 'none';
    }
}

function submitOrder() {
    const form = document.getElementById('order-form');
    if (!form) return;
    
    // Збираємо дані форми
    const formData = new FormData(form);
    const orderData = {
        customer: {
            name: formData.get('name') || formData.get('firstName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            deliveryDate: formData.get('deliveryDate') || formData.get('delivery_date'),
            deliveryTime: formData.get('deliveryTime'),
            comments: formData.get('comments') || formData.get('order-comments')
        },
        items: cart.items,
        total: cart.total,
        timestamp: new Date().toISOString()
    };
    
    // Валідація
    if (!orderData.customer.name || !orderData.customer.phone || !orderData.customer.address) {
        alert('Будь ласка, заповніть всі обов\'язкові поля');
        return;
    }
    
    if (!formData.get('agree_terms')) {
        alert('Будь ласка, погодьтеся з умовами обробки персональних даних');
        return;
    }
    
    // Відправляємо замовлення
    console.log('📦 Відправка замовлення:', orderData);
    
    // Тут можна додати відправку на сервер
    // fetch('/api/orders/', { method: 'POST', body: JSON.stringify(orderData) })
    
    // Показуємо повідомлення про успіх
    alert('✅ Замовлення успішно оформлено! Ми зв\'яжемося з вами найближчим часом.');
    
    // Очищаємо кошик
    clearCart();
    
    // Повертаємося на головну сторінку
    window.location.href = '/';
}

// Функція для видалення товару з кошика
function removeFromCart(itemId) {
    console.log('🗑️ Видалення товару з кошика:', itemId);
    
    // Видаляємо товар з масиву
    cart.items = cart.items.filter(item => item.id !== itemId);
    
    // Оновлюємо відображення кошика
    updateCartDisplay();
    saveCartToStorage();
    
    // Повідомлення видалено - замість них показуємо лічильник на іконці кошику
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
        
        // Повідомлення видалено - замість них показуємо лічильник на іконці кошику
    }
}

// Функція для оформлення замовлення
function checkout() {
    if (cart.items.length === 0) {
        // Повідомлення видалено - замість них показуємо лічильник на іконці кошику
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
        // Повідомлення видалено - замість них показуємо лічильник на іконці кошику
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
        // Повідомлення видалено - замість них показуємо лічильник на іконці кошику
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
        `${item.title} (${item.quantity || 1} шт.) - ${Math.round(item.price * (item.quantity || 1))} грн`
    ).join('\n');
    
    const deliveryInfo = `Доставка: ${orderData.delivery.city}, ${orderData.delivery.address}`;
    const paymentInfo = `Оплата: ${getPaymentMethodName(orderData.payment)}`;
    
    const message = `🎉 Замовлення успішно оформлено!\n\n📋 Деталі замовлення:\n${orderSummary}\n\n💰 Всього: ${Math.round(orderData.total)} грн\n\n🚚 ${deliveryInfo}\n💳 ${paymentInfo}\n\n📞 Ми зв'яжемося з вами для підтвердження.\n\nДякуємо за покупку!`;
    
    // Повідомлення видалено - замість них показуємо лічильник на іконці кошику
    
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

// Функція showNotification видалена - замість повідомлень використовуємо лічильник на іконці кошику

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

