// ===== ЛОГІКА КОШИКА ДЛЯ ОКРЕМОЇ СТОРІНКИ =====

// Глобальні змінні для кошика
let cart = {
    items: [],
    total: 0,
    count: 0,
    itemsTotal: 0 // Сума БЕЗ доставки (для прогрес-бару)
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
            cart.itemsTotal = parsedCart.itemsTotal || 0;
            cart.discount = parsedCart.discount || 0;
            console.log('✅ Кошик завантажено з localStorage:', cart);
        }
    } catch (error) {
        console.error('❌ Помилка завантаження кошика:', error);
        cart = { items: [], total: 0, count: 0, itemsTotal: 0, discount: 0 };
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
    // Перераховуємо кількість товарів (на випадок якщо не оновлено)
    cart.count = cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
    
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.count;
        cartCount.setAttribute('data-count', cart.count);
        
        console.log('🛒 Оновлення лічильника кошика:', cart.count);
        
        if (cart.count > 0) {
            cartCount.classList.remove('hidden');
            cartCount.style.display = 'flex';
        } else {
            cartCount.classList.add('hidden');
            cartCount.style.display = 'none';
        }
    } else {
        console.error('❌ Елемент cart-count не знайдено');
    }
}

// Функція для оновлення прогрес бару
function updateProgressBar() {
    // ВАЖЛИВО: Передаємо суму БЕЗ доставки для правильного розрахунку бонусів
    const cartTotal = cart.itemsTotal || 0;
    
    // Використовуємо новий динамічний прогрес-бар
    if (window.progressBarManager) {
        window.progressBarManager.update(cartTotal);
        return;
    }
    
    // Fallback для старої версії (якщо прогрес-бар модуль не завантажено)
    const maxAmount = 1000;
    const progressPercent = Math.min((cartTotal / maxAmount) * 100, 100);
    
    // Оновлюємо прогрес бар у навбарі
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    if (progressFill) {
        progressFill.style.width = progressPercent + '%';
    }
    if (progressText) {
        progressText.textContent = `${Math.round(cartTotal)}₴ / 1000₴`;
    }
    
    // Оновлюємо мобільний прогрес бар
    const mobileFill = document.getElementById('progress-fill-mobile');
    const mobileText = document.getElementById('progress-text-mobile');
    if (mobileFill) {
        mobileFill.style.width = progressPercent + '%';
    }
    if (mobileText) {
        mobileText.textContent = `${Math.round(cartTotal)}₴ / 1000₴`;
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
    
    // Оновлюємо відображення бонусів в підсумку (передаємо суму БЕЗ доставки)
    if (window.progressBarManager && window.progressBarManager.updateCartSummaryRewards) {
        window.progressBarManager.updateCartSummaryRewards(cart.itemsTotal || 0);
    }
    
    // Елементи для відображення інформації про замовлення
    const totalFlowerCount = document.getElementById('total-flower-count');
    const totalItemsCount = document.getElementById('total-items-count');
    const totalOrderPrice = document.getElementById('total-order-price');
    const cartClearSection = document.getElementById('cart-clear-section');
    
    if (!cartItems || !cartEmpty || !cartTotalPrice || !cartItemsCount || !checkoutBtn) return;
    
    // Очищаємо кошик
    cartItems.innerHTML = '';
    
    // Обчислюємо загальну суму товарів (БЕЗ доставки)
    const itemsTotal = cart.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    // Зберігаємо суму БЕЗ доставки для прогрес-бару
    cart.itemsTotal = itemsTotal;
    
    // Отримуємо налаштування доставки з глобальних змінних або використовуємо значення за замовчуванням
    const deliverySettings = window.deliverySettings || { cost: 50, freeThreshold: 1000 };
    
    // Перевіряємо досягнуті бонуси
    console.log('🎁 Перевірка бонусів для суми:', itemsTotal);
    console.log('🔍 window.progressBarManager доступний:', !!window.progressBarManager);
    
    let hasFreeShippingBonus = false;
    let discountPercent = 0;
    
    if (window.progressBarManager) {
        const rewards = window.progressBarManager.getAchievedRewards(itemsTotal);
        console.log('🎉 Отримано бонусів:', rewards.length);
        console.log('📋 Список бонусів:', rewards);
        
        // Перевіряємо безкоштовну доставку
        hasFreeShippingBonus = rewards.some(r => r.type === 'shipping');
        console.log('🚚 Безкоштовна доставка:', hasFreeShippingBonus ? 'ТАК' : 'НІ');
        
        // Перевіряємо знижку
        const discountReward = rewards.find(r => r.type === 'discount');
        if (discountReward && discountReward.value) {
            discountPercent = discountReward.value;
            console.log(`💰 Застосовується знижка: ${discountPercent}%`);
        } else {
            console.log('💰 Знижки немає');
        }
        
        // Перевіряємо подарунок
        const giftReward = rewards.find(r => r.type === 'gift');
        if (giftReward) {
            console.log(`🎁 Є подарунок: ${giftReward.value}`);
        } else {
            console.log('🎁 Подарунку немає');
        }
    } else {
        console.error('❌ КРИТИЧНО: progressBarManager не завантажено!');
        console.error('   Перевірте чи завантажується progress-bar.js');
        console.error('   Перевірте console на помилки завантаження скриптів');
    }
    
    // Застосовуємо знижку до суми товарів
    let itemsTotalAfterDiscount = itemsTotal;
    let discountAmount = 0;
    
    if (discountPercent > 0) {
        discountAmount = (itemsTotal * discountPercent) / 100;
        itemsTotalAfterDiscount = itemsTotal - discountAmount;
        console.log(`💰 РОЗРАХУНОК ЗНИЖКИ:`);
        console.log(`   Сума товарів: ${itemsTotal} грн`);
        console.log(`   Знижка ${discountPercent}%: -${discountAmount} грн`);
        console.log(`   Сума зі знижкою: ${itemsTotalAfterDiscount} грн`);
    } else {
        console.log(`💰 Знижки немає (discountPercent = ${discountPercent})`);
    }
    
    // Додаємо вартість доставки ТІЛЬКИ якщо немає бонусу безкоштовної доставки
    const deliveryCost = hasFreeShippingBonus ? 0 : deliverySettings.cost;
    cart.total = itemsTotalAfterDiscount + deliveryCost;
    cart.discount = discountPercent; // Зберігаємо для відображення
    
    console.log(`📊 ПІДСУМОК РОЗРАХУНКІВ:`);
    console.log(`   Товари: ${itemsTotal} грн`);
    console.log(`   Знижка: -${discountAmount} грн`);
    console.log(`   Після знижки: ${itemsTotalAfterDiscount} грн`);
    console.log(`   Доставка: ${deliveryCost} грн`);
    console.log(`   ВСЬОГО: ${cart.total} грн`);
    
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
            
            // Якщо це подарунок - додаємо спеціальний клас
            if (item.isGift || item.type === 'gift') {
                cartItem.classList.add('gift-item');
            }
            
            // Формуємо інформацію про колір та кількість
            let colorInfo = '';
            let quantityInfo = '';
            let pricePerUnit = Math.round(item.price);
            let totalPrice = Math.round(item.price * (item.quantity || 1));
            
            if (item.color) {
                colorInfo = `<div class="item-color">
                    <span class="color-label">Колір:</span>
                    <div class="color-preview" style="background-color: ${item.color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.3); display: inline-block;"></div>
                </div>`;
            }
            
            if (item.flowerQuantity && item.flowerQuantity !== '1') {
                quantityInfo = `<div class="item-quantity">
                    <span class="color-label">Кількість:</span>
                    <span class="quantity-value">${item.flowerQuantity} шт</span>
                </div>`;
            }
            
            // Для подарунків показуємо спеціальне відображення
            let priceDisplay = '';
            if (item.isGift || item.type === 'gift') {
                priceDisplay = `
                    <div class="item-quantity">
                        <span class="color-label" style="color: #10b981;">🎁 Подарунок:</span>
                        <span class="quantity-value" style="color: #10b981; font-weight: bold;">БЕЗКОШТОВНО</span>
                </div>
                `;
            } else {
                priceDisplay = `
                        <div class="item-quantity">
                            <span class="color-label">Ціна за шт:</span>
                            <span class="quantity-value">${pricePerUnit} грн</span>
                        </div>
                        <div class="item-total">
                            <span class="quantity">Всього:</span>
                            <span class="price">${totalPrice} грн</span>
                        </div>
                `;
            }
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='/static/images/foto 1.jpg'">
                </div>
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <div class="cart-item-details">
                        ${colorInfo}
                        ${quantityInfo}
                        ${priceDisplay}
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
    
    // Додаємо рядок "Сума товарів" перед знижкою
    console.log('📝 Оновлення відображення підсумку...');
    const summaryDetails = document.querySelector('.summary-details');
    console.log('   summaryDetails знайдено:', !!summaryDetails);
    
    let itemsTotalRow = document.getElementById('cart-items-total-row');
    
    if (!itemsTotalRow) {
        console.log('   Створюємо рядок "Сума товарів"');
        itemsTotalRow = document.createElement('div');
        itemsTotalRow.id = 'cart-items-total-row';
        itemsTotalRow.className = 'summary-row';
        
        // Вставляємо після cart-items-count
        const itemsCountRow = summaryDetails.querySelector('.summary-row:has(#cart-items-count)');
        if (itemsCountRow && itemsCountRow.nextSibling) {
            summaryDetails.insertBefore(itemsTotalRow, itemsCountRow.nextSibling);
        }
    }
    
    itemsTotalRow.innerHTML = `
        <span>Сума товарів:</span>
        <span>${Math.round(itemsTotal)} грн</span>
    `;
    
    // Додаємо рядок зі знижкою якщо вона є
    console.log(`💰 Перевірка відображення знижки: discountPercent = ${discountPercent}`);
    let discountRow = document.getElementById('cart-discount-row');
    
    if (discountPercent > 0) {
        const discountAmount = Math.round((itemsTotal * discountPercent) / 100);
        console.log(`   ✅ Знижка є! Створюємо/оновлюємо рядок знижки`);
        console.log(`   Сума знижки: ${discountAmount} грн`);
        
        if (!discountRow) {
            console.log('   Створюємо новий елемент discount-row');
            discountRow = document.createElement('div');
            discountRow.id = 'cart-discount-row';
            discountRow.className = 'summary-row';
            discountRow.style.color = '#10b981';
            
            // Вставляємо після items total
            if (itemsTotalRow && itemsTotalRow.nextSibling) {
                summaryDetails.insertBefore(discountRow, itemsTotalRow.nextSibling);
                console.log('   ✅ Елемент discount-row вставлено після items total');
            } else {
                summaryDetails.appendChild(discountRow);
                console.log('   ✅ Елемент discount-row додано в кінець');
            }
        } else {
            console.log('   Оновлюємо існуючий елемент discount-row');
        }
        
        discountRow.innerHTML = `
            <span>💰 Знижка ${discountPercent}%:</span>
            <span style="font-weight: 600;">-${discountAmount} грн</span>
        `;
        discountRow.style.display = 'flex';
        console.log('   ✅ HTML знижки встановлено:', discountRow.innerHTML);
    } else {
        console.log('   ℹ️ Знижки немає, ховаємо рядок якщо існує');
        if (discountRow) {
            discountRow.style.display = 'none';
        }
    }
    
    // Оновлюємо загальну суму та кількість
    cartTotalPrice.textContent = `${Math.round(cart.total)} грн`;
    const itemsText = cart.count === 1 ? 'товар' : 
                     cart.count < 5 ? 'товари' : 'товарів';
    cartItemsCount.textContent = `${cart.count} ${itemsText}`;
    
    // Перевіряємо чи є безкоштовна доставка в бонусах
    let hasFreeShipping = false;
    if (window.progressBarManager) {
        const rewards = window.progressBarManager.getAchievedRewards(cart.itemsTotal || 0);
        hasFreeShipping = rewards.some(r => r.type === 'shipping');
    }
    
    // Оновлюємо доставку (тільки якщо є бонус безкоштовної доставки)
    if (cartDelivery) {
        if (hasFreeShipping) {
            cartDelivery.innerHTML = '<span style="color: #10b981; font-weight: 600;">Безкоштовно 🚚</span>';
            cartDelivery.classList.add('free');
        } else {
            cartDelivery.innerHTML = `${deliverySettings.cost} грн`;
            cartDelivery.classList.remove('free');
        }
    }
    
    // Оновлюємо інформацію про доставку
    if (deliveryInfo) {
        if (hasFreeShipping) {
            deliveryInfo.textContent = '🎉 Вітаємо! Ви отримали безкоштовну доставку!';
            deliveryInfo.classList.add('achieved');
        } else {
            // Показуємо прогрес до наступного бонусу
            if (window.progressBarManager) {
                const current = window.progressBarManager.getCurrentMilestone(cart.itemsTotal || 0);
                if (current && current.nextMilestone) {
                    const remaining = Math.round(current.remaining);
                    deliveryInfo.textContent = `Додайте товарів на ${remaining}₴ для бонусу`;
                } else {
                    deliveryInfo.textContent = `Вартість доставки: ${deliverySettings.cost} грн`;
                }
            } else {
                deliveryInfo.textContent = `Вартість доставки: ${deliverySettings.cost} грн`;
            }
            deliveryInfo.classList.remove('achieved');
        }
    }
    
    // Оновлюємо прогрес бар
    updateProgressBar();
    
    // Оновлюємо лічильник
    updateCartCount();
    
    // Підраховуємо загальну кількість квітів (тільки для головного товару)
    let totalFlowers = 0;
    cart.items.forEach(item => {
        // Рахуємо тільки головний товар (квіти), додаткові товари пропускаємо
        if (item.type === 'main' && item.flowerQuantity) {
            const flowerCount = parseInt(item.flowerQuantity) || 0;
            const itemQuantity = item.quantity || 1;
            totalFlowers += flowerCount * itemQuantity;
        }
    });
    
    // Перераховуємо cart.count на основі items
    cart.count = cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
    
    // Оновлюємо відображення інформації про замовлення
    if (totalFlowerCount) {
        totalFlowerCount.textContent = totalFlowers;
        console.log('   📊 Оновлено кількість квітів:', totalFlowers);
    }
    if (totalItemsCount) {
        totalItemsCount.textContent = cart.count;
        console.log('   📊 Оновлено кількість товарів:', cart.count);
    }
    if (totalOrderPrice) {
        totalOrderPrice.textContent = `${Math.round(cart.total)} грн`;
        console.log('   📊 Оновлено загальну суму:', Math.round(cart.total), 'грн');
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
    
    // Показуємо красиве модальне вікно замість confirm()
    showClearCartModal();
}

// Функція для показу модального вікна очищення кошика
function showClearCartModal() {
    const modal = document.createElement('div');
    modal.className = 'clear-cart-modal';
    modal.innerHTML = `
        <div class="clear-cart-overlay" onclick="closeClearCartModal()"></div>
        <div class="clear-cart-content">
            <div class="clear-cart-icon">
                <i class="fas fa-trash-alt"></i>
            </div>
            <h3>Очистити кошик?</h3>
            <p>Ви дійсно хочете видалити всі товари з кошика?</p>
            <p class="warning-text">Ця дія незворотна</p>
            <div class="clear-cart-actions">
                <button class="btn-cancel" onclick="closeClearCartModal()">
                    <i class="fas fa-times"></i>
                    Скасувати
                </button>
                <button class="btn-confirm-clear" onclick="confirmClearCart()">
                    <i class="fas fa-trash"></i>
                    Так, очистити
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Анімація появи
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Функція для закриття модального вікна
function closeClearCartModal() {
    const modal = document.querySelector('.clear-cart-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Функція підтвердження очищення
function confirmClearCart() {
    console.log('🗑️ Очищення кошика...');
    console.log('   Товарів до очищення:', cart.items.length);
    
    // Перевіряємо чи є подарунки
    const hasGifts = cart.items.some(item => item.isGift);
    console.log('   Подарунків в кошику:', hasGifts ? 'ТАК' : 'НІ');
    
    // ПОВНІСТЮ очищаємо кошик (включно з подарунками)
        cart.items = [];
    cart.total = 0;
    cart.count = 0;
    cart.itemsTotal = 0;
    cart.discount = 0;
    
    console.log('   ✅ Кошик очищено:', cart);
    
    // Оновлюємо відображення
        updateCartDisplay();
    updateCartCount();
    updateProgressBar();
        saveCartToStorage();
        
    // Явно викликаємо видалення подарунків якщо вони є
    if (window.progressBarManager && window.progressBarManager.removeGiftFromCart) {
        window.progressBarManager.removeGiftFromCart();
    }
    
    console.log('   ✅ Всі елементи оновлено (включно з подарунками)');
    
    // Закриваємо модальне вікно
    closeClearCartModal();
}

// Функція для показу модального вікна порожнього кошика
function showEmptyCartModal() {
    const modal = document.createElement('div');
    modal.className = 'empty-cart-modal';
    modal.innerHTML = `
        <div class="empty-cart-overlay" onclick="closeEmptyCartModal()"></div>
        <div class="empty-cart-content">
            <div class="empty-cart-icon">
                <i class="fas fa-shopping-cart"></i>
            </div>
            <h3>Кошик порожній</h3>
            <p>Ви не можете оформити замовлення без товарів.</p>
            <p class="info-text">Додайте квіти до кошика, щоб продовжити покупки!</p>
            <div class="empty-cart-actions">
                <a href="/" class="btn-continue-shopping">
                    <i class="fas fa-arrow-left"></i>
                    Повернутись до покупок
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Анімація появи
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Функція для закриття модального вікна порожнього кошика
function closeEmptyCartModal() {
    const modal = document.querySelector('.empty-cart-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Функція для оформлення замовлення
function checkout() {
    // Перевіряємо чи є товари в кошику
    if (!cart.items || cart.items.length === 0) {
        showEmptyCartModal();
        console.error('❌ Спроба відкрити форму замовлення з порожнім кошиком');
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
        // Перевіряємо, чи це мобільний пристрій
        if (window.innerWidth <= 768) {
            // Запам'ятовуємо поточну позицію прокрутки
            const scrollY = window.scrollY;
            document.body.style.top = `-${scrollY}px`;
            
            // Додаємо клас для заборони прокрутки
            document.body.classList.add('order-form-open');
            
            // Додаткові методи заборони прокрутки для мобільних
            preventOrderFormScroll();
        }
        
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
        // Перевіряємо, чи це мобільний пристрій
        if (window.innerWidth <= 768) {
            // Відновлюємо прокрутку
            document.body.classList.remove('order-form-open');
            
            // Відновлюємо позицію прокрутки
            const scrollY = document.body.style.top;
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
            
            // Відновлюємо прокрутку
            enableOrderFormScroll();
        }
        
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
    // Перевіряємо чи є товари в кошику (КРИТИЧНА ВАЛІДАЦІЯ)
    if (!cart.items || cart.items.length === 0) {
        showEmptyCartModal();
        console.error('❌ Спроба оформити замовлення з порожнім кошиком');
        return;
    }
    
    // Валідація форми
    if (!validateOrderForm()) {
        return;
    }
    
    // Збираємо дані форми
    const orderData = collectOrderData();
    
    // Перевіряємо спосіб оплати
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (selectedPayment && selectedPayment.value === 'online') {
        // Обробляємо онлайн оплату через Monobank
        processOnlinePayment(orderData);
    } else {
        // Показуємо підтвердження замовлення для інших способів оплати
        showOrderConfirmation(orderData);
    }
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
async function showOrderConfirmation(orderData) {
    try {
        // Спочатку зберігаємо замовлення на сервері
        const response = await fetch('/api/orders/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Замовлення успішно збережено на сервері
            console.log('✅ Замовлення збережено на сервері:', result.order_number);
            
            // Очищаємо кошик після успішного збереження
            cart.items = [];
            updateCartDisplay();
            saveCartToStorage();
            
            // Показуємо повідомлення про успіх
            const orderSummary = orderData.items.map(item => 
                `${item.title} (${item.quantity || 1} шт.) - ${Math.round(item.price * (item.quantity || 1))} грн`
            ).join('\n');
            
            const deliveryInfo = `Доставка: ${orderData.delivery.city}, ${orderData.delivery.address}`;
            const paymentInfo = `Оплата: ${getPaymentMethodName(orderData.payment)}`;
            
            const message = `🎉 Замовлення успішно оформлено!\n\n📋 Номер замовлення: ${result.order_number}\n\n📋 Деталі замовлення:\n${orderSummary}\n\n💰 Всього: ${Math.round(orderData.total)} грн\n\n🚚 ${deliveryInfo}\n💳 ${paymentInfo}\n\n📞 Ми зв'яжемося з вами для підтвердження.\n\nДякуємо за покупку!`;
            
            alert(message);
            
        } else {
            // Помилка збереження на сервері
            console.error('❌ Помилка збереження замовлення:', result.error);
            
            // Зберігаємо в localStorage як резерв
            saveOrderToStorage(orderData);
            
            alert('⚠️ Замовлення оформлено, але виникла помилка збереження. Ми зберегли ваші дані локально і зв\'яжемося з вами.');
            
            // Очищаємо кошик
            cart.items = [];
            updateCartDisplay();
            saveCartToStorage();
        }
        
    } catch (error) {
        console.error('❌ Помилка збереження замовлення:', error);
        
        // Зберігаємо в localStorage як резерв
        saveOrderToStorage(orderData);
        
        alert('⚠️ Замовлення оформлено, але виникла помилка збереження. Ми зберегли ваші дані локально і зв\'яжемося з вами.');
        
        // Очищаємо кошик
        cart.items = [];
        updateCartDisplay();
        saveCartToStorage();
    }
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

// Функції для заборони прокрутки на мобільних пристроях (для форми замовлення)
let orderFormScrollPosition = 0;

function preventOrderFormScroll() {
    if (window.innerWidth <= 768) {
        // Запам'ятовуємо поточну позицію прокрутки
        orderFormScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Блокуємо прокрутку через touch events
        document.addEventListener('touchmove', preventOrderFormTouchScroll, { passive: false });
        document.addEventListener('touchstart', preventOrderFormTouchScroll, { passive: false });
        document.addEventListener('touchend', preventOrderFormTouchScroll, { passive: false });
        
        // Блокуємо прокрутку через wheel events
        document.addEventListener('wheel', preventOrderFormWheelScroll, { passive: false });
        
        // Блокуємо прокрутку через keyboard
        document.addEventListener('keydown', preventOrderFormKeyScroll, { passive: false });
    }
}

function enableOrderFormScroll() {
    if (window.innerWidth <= 768) {
        // Відновлюємо прокрутку
        document.removeEventListener('touchmove', preventOrderFormTouchScroll);
        document.removeEventListener('touchstart', preventOrderFormTouchScroll);
        document.removeEventListener('touchend', preventOrderFormTouchScroll);
        document.removeEventListener('wheel', preventOrderFormWheelScroll);
        document.removeEventListener('keydown', preventOrderFormKeyScroll);
    }
}

function preventOrderFormTouchScroll(e) {
    // Дозволяємо прокрутку тільки всередині форми замовлення
    const orderForm = document.getElementById('order-form');
    if (orderForm && orderForm.style.display === 'block') {
        const target = e.target;
        const isInsideForm = orderForm.contains(target);
        
        // Дозволяємо всі події всередині форми
        if (isInsideForm) {
            return true;
        }
        
        // Блокуємо події поза формою
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    return true;
}

function preventOrderFormWheelScroll(e) {
    // Дозволяємо прокрутку всередині форми замовлення
    const orderForm = document.getElementById('order-form');
    if (orderForm && orderForm.style.display === 'block') {
        const target = e.target;
        const isInsideForm = orderForm.contains(target);
        
        if (isInsideForm) {
            return true;
        }
    }
    
    e.preventDefault();
    e.stopPropagation();
    return false;
}

function preventOrderFormKeyScroll(e) {
    // Дозволяємо клавіші всередині форми замовлення
    const orderForm = document.getElementById('order-form');
    if (orderForm && orderForm.style.display === 'block') {
        const target = e.target;
        const isInsideForm = orderForm.contains(target);
        
        if (isInsideForm) {
            return true;
        }
    }
    
    // Блокуємо клавіші прокрутки (Page Up, Page Down, Home, End, Arrow keys)
    const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
    if (scrollKeys.includes(e.keyCode)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    return true;
}

// Обробка клавіші Escape для закриття форми замовлення (тільки на мобільних)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && window.innerWidth <= 768) {
        const orderForm = document.getElementById('order-form');
        if (orderForm && orderForm.style.display === 'block') {
            toggleOrderForm();
        }
    }
});

// Ініціалізація сторінки кошика
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛒 Ініціалізація сторінки кошика...');
    console.log('═══════════════════════════════════════════════════════');
    
    // Перевірка доступності модулів
    console.log('🔍 ПЕРЕВІРКА МОДУЛІВ:');
    console.log('   - window.progressBarManager:', !!window.progressBarManager);
    console.log('   - window.deliverySettings:', window.deliverySettings);
    
    if (window.progressBarManager) {
        console.log('   - progressBarManager.update:', typeof window.progressBarManager.update);
        console.log('   - progressBarManager.getAchievedRewards:', typeof window.progressBarManager.getAchievedRewards);
        console.log('   - progressBarManager.getCurrentMilestone:', typeof window.progressBarManager.getCurrentMilestone);
    } else {
        console.error('❌ КРИТИЧНО: progressBarManager НЕ ЗНАЙДЕНО!');
        console.error('   Скрипт progress-bar.js не завантажився або виконався з помилкою');
    }
    
    // Завантажуємо кошик з localStorage
    console.log('📂 Завантаження кошика з localStorage...');
    loadCartFromStorage();
    console.log('   - Товарів в кошику:', cart.items.length);
    console.log('   - Загальна сума:', cart.total);
    console.log('   - Сума товарів:', cart.itemsTotal);
    
    // Оновлюємо відображення
    console.log('🎨 Оновлення відображення кошика...');
    updateCartDisplay();
    
    console.log('✅ Сторінка кошика ініціалізована');
    console.log('═══════════════════════════════════════════════════════');
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

// Функція для обробки онлайн оплати через Monobank
async function processOnlinePayment(orderData) {
    console.log('🔄 Початок обробки онлайн оплати через Monobank...');
    console.log('📊 Дані замовлення:', orderData);
    
    try {
        // Перевіряємо спосіб оплати
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        console.log('💳 Обраний спосіб оплати:', selectedPayment ? selectedPayment.value : 'не обрано');
        
        if (!selectedPayment || selectedPayment.value !== 'online') {
            console.error('❌ Спосіб оплати не обрано або не онлайн');
            alert('Будь ласка, оберіть онлайн оплату');
            return;
        }
        
        // Показуємо індикатор завантаження
        const checkoutBtn = document.getElementById('checkout-btn');
        const originalText = checkoutBtn.innerHTML;
        checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обробка оплати...';
        checkoutBtn.disabled = true;
        
        console.log('💾 Збереження замовлення на сервері...');
        
        // Спочатку зберігаємо замовлення на сервері
        const saveResponse = await fetch('/api/orders/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(orderData)
        });
        
        const saveResult = await saveResponse.json();
        console.log('📥 Відповідь збереження замовлення:', saveResult);
        
        if (!saveResult.success) {
            console.error('❌ Помилка збереження замовлення:', saveResult.error);
            throw new Error('Помилка збереження замовлення: ' + saveResult.error);
        }
        
        console.log('✅ Замовлення збережено на сервері:', saveResult.order_number);
        
        // Тепер створюємо рахунок для оплати
        const paymentData = {
            ...orderData,
            order_id: saveResult.order_id,
            order_number: saveResult.order_number
        };
        
        console.log('💳 Дані для створення рахунку:', paymentData);
        
        const response = await fetch('/payment/create-invoice/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(paymentData)
        });
        
        console.log('📥 Відповідь створення рахунку:', response.status);
        const result = await response.json();
        console.log('📊 Результат створення рахунку:', result);
        
        if (result.success) {
            console.log('✅ Рахунок створено успішно:', result);
            
            // Очищаємо кошик перед перенаправленням
            cart.items = [];
            updateCartDisplay();
            saveCartToStorage();
            console.log('🧹 Кошик очищено');
            
            // Перенаправляємо на сторінку оплати Monobank
            console.log('🔗 Перенаправлення на сторінку оплати:', result.pageUrl);
            window.location.href = result.pageUrl;
        } else {
            console.error('❌ Помилка створення рахунку:', result.error);
            // Показуємо помилку
            alert('Помилка створення рахунку: ' + (result.error || 'Невідома помилка'));
            
            // Відновлюємо кнопку
            checkoutBtn.innerHTML = originalText;
            checkoutBtn.disabled = false;
        }
        
    } catch (error) {
        console.error('Помилка при обробці онлайн оплати:', error);
        alert('Сталася помилка при обробці оплати. Спробуйте ще раз.');
        
        // Відновлюємо кнопку
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn.innerHTML = originalText;
        checkoutBtn.disabled = false;
    }
}

// Функція для отримання CSRF токена
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Функція для перевірки статусу рахунку
async function checkInvoiceStatus(invoiceId) {
    try {
        const response = await fetch(`/api/payment/status/${invoiceId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            return {
                success: true,
                status: result.status,
                data: result
            };
        } else {
            return {
                success: false,
                error: result.error || 'Помилка отримання статусу'
            };
        }
        
    } catch (error) {
        console.error('Помилка при перевірці статусу рахунку:', error);
        return {
            success: false,
            error: 'Помилка з\'єднання з сервером'
        };
    }
}

// Функція для відображення статусу рахунку в модальному вікні
function showInvoiceStatusModal(invoiceId) {
    // Створюємо модальне вікно
    const modal = document.createElement('div');
    modal.className = 'invoice-status-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Статус замовлення</h3>
                <button class="close-btn" onclick="closeInvoiceStatusModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="loading" id="status-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Перевірка статусу...</p>
                </div>
                <div class="status-content" id="status-content" style="display: none;">
                    <!-- Тут буде відображено статус -->
                </div>
            </div>
        </div>
    `;
    
    // Додаємо стилі для модального вікна
    const style = document.createElement('style');
    style.textContent = `
        .invoice-status-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #333;
        }
        
        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .loading {
            text-align: center;
            padding: 40px 20px;
        }
        
        .loading i {
            font-size: 32px;
            color: #667eea;
            margin-bottom: 15px;
        }
        
        .status-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .status-item:last-child {
            border-bottom: none;
        }
        
        .status-label {
            font-weight: 600;
            color: #666;
        }
        
        .status-value {
            color: #333;
        }
        
        .status-success {
            color: #4CAF50;
        }
        
        .status-failure {
            color: #f44336;
        }
        
        .status-processing {
            color: #ff9800;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Перевіряємо статус
    checkInvoiceStatus(invoiceId).then(result => {
        const loading = document.getElementById('status-loading');
        const content = document.getElementById('status-content');
        
        loading.style.display = 'none';
        content.style.display = 'block';
        
        if (result.success) {
            const statusText = getStatusText(result.status);
            const statusClass = getStatusClass(result.status);
            
            content.innerHTML = `
                <div class="status-item">
                    <span class="status-label">ID рахунку:</span>
                    <span class="status-value">${invoiceId}</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Статус:</span>
                    <span class="status-value ${statusClass}">${statusText}</span>
                </div>
                ${result.data.amount ? `
                <div class="status-item">
                    <span class="status-label">Сума:</span>
                    <span class="status-value">${(result.data.amount / 100).toFixed(2)} грн</span>
                </div>
                ` : ''}
                ${result.data.destination ? `
                <div class="status-item">
                    <span class="status-label">Призначення:</span>
                    <span class="status-value">${result.data.destination}</span>
                </div>
                ` : ''}
                ${result.data.failureReason ? `
                <div class="status-item">
                    <span class="status-label">Причина помилки:</span>
                    <span class="status-value status-failure">${result.data.failureReason}</span>
                </div>
                ` : ''}
            `;
        } else {
            content.innerHTML = `
                <div class="status-item">
                    <span class="status-label">Помилка:</span>
                    <span class="status-value status-failure">${result.error}</span>
                </div>
            `;
        }
    });
}

// Функція для закриття модального вікна
function closeInvoiceStatusModal() {
    const modal = document.querySelector('.invoice-status-modal');
    if (modal) {
        modal.remove();
    }
}

// Функція для отримання тексту статусу
function getStatusText(status) {
    const statusMap = {
        'success': 'Оплачено',
        'failure': 'Помилка оплати',
        'processing': 'Обробка платежу',
        'expired': 'Прострочено',
        null: 'Невідомий статус'
    };
    return statusMap[status] || 'Невідомий статус';
}

// Функція для отримання класу статусу
function getStatusClass(status) {
    const classMap = {
        'success': 'status-success',
        'failure': 'status-failure',
        'processing': 'status-processing',
        'expired': 'status-failure',
        null: ''
    };
    return classMap[status] || '';
}

// Функція для скасування рахунку
async function cancelInvoice(invoiceId, extRef = null, amount = null) {
    try {
        const data = {
            invoiceId: invoiceId
        };
        
        if (extRef) data.extRef = extRef;
        if (amount) data.amount = amount;
        
        const response = await fetch('/api/payment/cancel/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            return {
                success: true,
                status: result.status,
                createdDate: result.createdDate,
                modifiedDate: result.modifiedDate,
                message: result.message
            };
        } else {
            return {
                success: false,
                error: result.error || 'Помилка скасування',
                errorCode: result.errorCode,
                errorText: result.errorText
            };
        }
        
    } catch (error) {
        console.error('Помилка при скасуванні рахунку:', error);
        return {
            success: false,
            error: 'Помилка з\'єднання з сервером'
        };
    }
}

// Функція для відображення модального вікна скасування
function showCancelModal(invoiceId) {
    const modal = document.createElement('div');
    modal.className = 'cancel-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Скасування замовлення</h3>
                <button class="close-btn" onclick="closeCancelModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="warning-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Ви дійсно хочете скасувати замовлення <strong>${invoiceId}</strong>?</p>
                    <p>Ця дія незворотна та призведе до повернення коштів на картку клієнта.</p>
                </div>
                
                <form id="cancelForm" onsubmit="submitCancelForm(event, '${invoiceId}')">
                    <div class="form-group">
                        <label for="cancelReason">Причина скасування</label>
                        <select id="cancelReason" name="reason" required>
                            <option value="">Оберіть причину</option>
                            <option value="customer_request">Запит клієнта</option>
                            <option value="product_unavailable">Товар недоступний</option>
                            <option value="payment_error">Помилка оплати</option>
                            <option value="duplicate_order">Дублювання замовлення</option>
                            <option value="other">Інша причина</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="cancelComment">Коментар (опціонально)</label>
                        <textarea id="cancelComment" name="comment" rows="3" 
                                  placeholder="Додаткові деталі..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-danger">
                            <i class="fas fa-times"></i>
                            Скасувати замовлення
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closeCancelModal()">
                            <i class="fas fa-arrow-left"></i>
                            Скасувати
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Додаємо стилі для модального вікна
    const style = document.createElement('style');
    style.textContent = `
        .cancel-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #333;
        }
        
        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .warning-message {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .warning-message i {
            color: #856404;
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .warning-message p {
            margin: 5px 0;
            color: #856404;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }
        
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
        }
        
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #f44336;
        }
        
        .form-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            padding: 10px 20px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        
        .btn i {
            margin-right: 5px;
        }
        
        .btn-danger {
            background: #f44336;
            color: white;
        }
        
        .btn-danger:hover {
            background: #d32f2f;
        }
        
        .btn-secondary {
            background: #f8f9fa;
            color: #333;
            border: 2px solid #e9ecef;
        }
        
        .btn-secondary:hover {
            background: #e9ecef;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
}

// Функція для закриття модального вікна скасування
function closeCancelModal() {
    const modal = document.querySelector('.cancel-modal');
    if (modal) {
        modal.remove();
    }
}

// Функція для відправки форми скасування
async function submitCancelForm(event, invoiceId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const reason = formData.get('reason');
    const comment = formData.get('comment');
    
    if (!reason) {
        alert('Будь ласка, оберіть причину скасування');
        return;
    }
    
    if (confirm('ОСТАННЄ ПІДТВЕРДЖЕННЯ: Ви дійсно хочете скасувати це замовлення?')) {
        const result = await cancelInvoice(invoiceId);
        
        if (result.success) {
            alert('Замовлення успішно скасовано!');
            closeCancelModal();
            // Перенаправляємо на сторінку успіху
            window.location.href = `/payment/cancel/success/${invoiceId}/`;
        } else {
            alert('Помилка скасування: ' + result.error);
        }
    }
}

// Функція для інвалідації рахунку
async function invalidateInvoice(invoiceId) {
    try {
        const data = {
            invoiceId: invoiceId
        };
        
        const response = await fetch('/api/payment/invalidate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            return {
                success: true,
                message: result.message
            };
        } else {
            return {
                success: false,
                error: result.error || 'Помилка інвалідації',
                errorCode: result.errorCode,
                errorText: result.errorText
            };
        }
        
    } catch (error) {
        console.error('Помилка при інвалідації рахунку:', error);
        return {
            success: false,
            error: 'Помилка з\'єднання з сервером'
        };
    }
}

// Функція для відображення модального вікна інвалідації
function showInvalidateModal(invoiceId) {
    const modal = document.createElement('div');
    modal.className = 'invalidate-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Деактивація замовлення</h3>
                <button class="close-btn" onclick="closeInvalidateModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="warning-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Ви дійсно хочете деактивувати замовлення <strong>${invoiceId}</strong>?</p>
                    <p>Після деактивації клієнт не зможе оплатити цей рахунок.</p>
                </div>
                
                <div class="info-message">
                    <h4><i class="fas fa-info-circle"></i> Важливо!</h4>
                    <ul>
                        <li>Деактивація можлива тільки для неоплачених рахунків</li>
                        <li>Кошти не повертаються (рахунок не оплачений)</li>
                        <li>Ця операція незворотна</li>
                    </ul>
                </div>
                
                <form id="invalidateForm" onsubmit="submitInvalidateForm(event, '${invoiceId}')">
                    <div class="form-group">
                        <label for="invalidateReason">Причина деактивації</label>
                        <select id="invalidateReason" name="reason" required>
                            <option value="">Оберіть причину</option>
                            <option value="customer_request">Запит клієнта</option>
                            <option value="order_cancelled">Замовлення скасовано</option>
                            <option value="product_unavailable">Товар недоступний</option>
                            <option value="duplicate_order">Дублювання замовлення</option>
                            <option value="expired">Рахунок прострочений</option>
                            <option value="other">Інша причина</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="invalidateComment">Коментар (опціонально)</label>
                        <textarea id="invalidateComment" name="comment" rows="3" 
                                  placeholder="Додаткові деталі..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-warning">
                            <i class="fas fa-ban"></i>
                            Деактивувати замовлення
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closeInvalidateModal()">
                            <i class="fas fa-arrow-left"></i>
                            Скасувати
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Додаємо стилі для модального вікна
    const style = document.createElement('style');
    style.textContent = `
        .invalidate-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #333;
        }
        
        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .warning-message {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .warning-message i {
            color: #856404;
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .warning-message p {
            margin: 5px 0;
            color: #856404;
        }
        
        .info-message {
            background: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }
        
        .info-message h4 {
            color: #1976d2;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        
        .info-message h4 i {
            margin-right: 8px;
        }
        
        .info-message ul {
            margin: 0;
            padding-left: 20px;
            color: #1976d2;
        }
        
        .info-message li {
            margin-bottom: 5px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }
        
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
        }
        
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #ff9800;
        }
        
        .form-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            padding: 10px 20px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        
        .btn i {
            margin-right: 5px;
        }
        
        .btn-warning {
            background: #ff9800;
            color: white;
        }
        
        .btn-warning:hover {
            background: #f57c00;
        }
        
        .btn-secondary {
            background: #f8f9fa;
            color: #333;
            border: 2px solid #e9ecef;
        }
        
        .btn-secondary:hover {
            background: #e9ecef;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
}

// Функція для закриття модального вікна інвалідації
function closeInvalidateModal() {
    const modal = document.querySelector('.invalidate-modal');
    if (modal) {
        modal.remove();
    }
}

// Функція для відправки форми інвалідації
async function submitInvalidateForm(event, invoiceId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const reason = formData.get('reason');
    const comment = formData.get('comment');
    
    if (!reason) {
        alert('Будь ласка, оберіть причину деактивації');
        return;
    }
    
    if (confirm('ОСТАННЄ ПІДТВЕРДЖЕННЯ: Ви дійсно хочете деактивувати це замовлення?')) {
        const result = await invalidateInvoice(invoiceId);
        
        if (result.success) {
            alert('Замовлення успішно деактивовано!');
            closeInvalidateModal();
            // Перенаправляємо на сторінку успіху
            window.location.href = `/payment/invalidate/success/${invoiceId}/`;
        } else {
            alert('Помилка деактивації: ' + result.error);
        }
    }
}

// Функція для фіналізації холду
async function finalizeHold(invoiceId, amount = null, items = null) {
    try {
        const data = {
            invoiceId: invoiceId
        };
        
        if (amount) data.amount = amount;
        if (items) data.items = items;
        
        const response = await fetch('/api/payment/finalize/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            return {
                success: true,
                status: result.status,
                message: result.message
            };
        } else {
            return {
                success: false,
                error: result.error || 'Помилка фіналізації',
                errorCode: result.errorCode,
                errorText: result.errorText
            };
        }
        
    } catch (error) {
        console.error('Помилка при фіналізації холду:', error);
        return {
            success: false,
            error: 'Помилка з\'єднання з сервером'
        };
    }
}

// Функція для відображення модального вікна фіналізації
function showFinalizeModal(invoiceId) {
    const modal = document.createElement('div');
    modal.className = 'finalize-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Фіналізація холду</h3>
                <button class="close-btn" onclick="closeFinalizeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="warning-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Ви дійсно хочете фіналізувати холд для замовлення <strong>${invoiceId}</strong>?</p>
                    <p>Після фіналізації кошти будуть списані з картки клієнта остаточно.</p>
                </div>
                
                <div class="info-message">
                    <h4><i class="fas fa-info-circle"></i> Про фіналізацію холду</h4>
                    <ul>
                        <li>Фіналізація можлива тільки для рахунків з типом "hold"</li>
                        <li>Кошти вже заблоковані на картці клієнта</li>
                        <li>Після фіналізації кошти списуються остаточно</li>
                    </ul>
                </div>
                
                <form id="finalizeForm" onsubmit="submitFinalizeForm(event, '${invoiceId}')">
                    <div class="form-group">
                        <label for="finalizeAmount">Фінальна сума (опціонально)</label>
                        <input type="number" id="finalizeAmount" name="amount" step="0.01" min="0"
                               placeholder="Якщо не вказано, буде використано оригінальну суму">
                    </div>
                    
                    <div class="form-group">
                        <label for="finalizeReason">Причина фіналізації</label>
                        <select id="finalizeReason" name="reason" required>
                            <option value="">Оберіть причину</option>
                            <option value="order_completed">Замовлення виконано</option>
                            <option value="delivery_confirmed">Доставка підтверджена</option>
                            <option value="service_provided">Послуга надана</option>
                            <option value="partial_payment">Часткова оплата</option>
                            <option value="other">Інша причина</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="finalizeComment">Коментар (опціонально)</label>
                        <textarea id="finalizeComment" name="comment" rows="3" 
                                  placeholder="Додаткові деталі..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-check-double"></i>
                            Фіналізувати холд
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closeFinalizeModal()">
                            <i class="fas fa-arrow-left"></i>
                            Скасувати
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Додаємо стилі для модального вікна
    const style = document.createElement('style');
    style.textContent = `
        .finalize-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #333;
        }
        
        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .warning-message {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .warning-message i {
            color: #856404;
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .warning-message p {
            margin: 5px 0;
            color: #856404;
        }
        
        .info-message {
            background: #e8f5e8;
            border: 1px solid #c8e6c9;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }
        
        .info-message h4 {
            color: #2e7d32;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        
        .info-message h4 i {
            margin-right: 8px;
        }
        
        .info-message ul {
            margin: 0;
            padding-left: 20px;
            color: #2e7d32;
        }
        
        .info-message li {
            margin-bottom: 5px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #4CAF50;
        }
        
        .form-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            padding: 10px 20px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        
        .btn i {
            margin-right: 5px;
        }
        
        .btn-success {
            background: #4CAF50;
            color: white;
        }
        
        .btn-success:hover {
            background: #45a049;
        }
        
        .btn-secondary {
            background: #f8f9fa;
            color: #333;
            border: 2px solid #e9ecef;
        }
        
        .btn-secondary:hover {
            background: #e9ecef;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
}

// Функція для закриття модального вікна фіналізації
function closeFinalizeModal() {
    const modal = document.querySelector('.finalize-modal');
    if (modal) {
        modal.remove();
    }
}

// Функція для відправки форми фіналізації
async function submitFinalizeForm(event, invoiceId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const amount = formData.get('amount');
    const reason = formData.get('reason');
    const comment = formData.get('comment');
    
    if (!reason) {
        alert('Будь ласка, оберіть причину фіналізації');
        return;
    }
    
    if (confirm('ОСТАННЄ ПІДТВЕРДЖЕННЯ: Ви дійсно хочете фіналізувати цей холд?')) {
        const data = {
            invoiceId: invoiceId
        };
        
        if (amount) data.amount = parseFloat(amount);
        
        const result = await finalizeHold(invoiceId, amount ? parseFloat(amount) : null);
        
        if (result.success) {
            alert('Холд успішно фіналізовано!');
            closeFinalizeModal();
            // Перенаправляємо на сторінку успіху
            window.location.href = `/payment/finalize/success/${invoiceId}/`;
        } else {
            alert('Помилка фіналізації: ' + result.error);
        }
    }
}

// Функція для отримання даних мерчанта
async function getMerchantDetails() {
    try {
        const response = await fetch('/api/payment/merchant/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            return {
                success: true,
                merchantId: result.merchantId,
                merchantName: result.merchantName,
                edrpou: result.edrpou,
                message: result.message
            };
        } else {
            return {
                success: false,
                error: result.error || 'Помилка отримання даних мерчанта',
                errorCode: result.errorCode,
                errorText: result.errorText
            };
        }
        
    } catch (error) {
        console.error('Помилка при отриманні даних мерчанта:', error);
        return {
            success: false,
            error: 'Помилка з\'єднання з сервером'
        };
    }
}

// Функція для відображення модального вікна з даними мерчанта
function showMerchantDetailsModal() {
    const modal = document.createElement('div');
    modal.className = 'merchant-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Дані мерчанта</h3>
                <button class="close-btn" onclick="closeMerchantModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="loading" id="merchantLoading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Завантаження даних мерчанта...</p>
                </div>
                <div class="merchant-content" id="merchantContent" style="display: none;">
                    <!-- Дані мерчанта будуть завантажені тут -->
                </div>
                <div class="merchant-error" id="merchantError" style="display: none;">
                    <!-- Помилка буде відображена тут -->
                </div>
            </div>
        </div>
    `;
    
    // Додаємо стилі для модального вікна
    const style = document.createElement('style');
    style.textContent = `
        .merchant-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #333;
        }
        
        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .loading {
            text-align: center;
            padding: 40px 20px;
        }
        
        .loading i {
            font-size: 32px;
            color: #2196F3;
            margin-bottom: 15px;
        }
        
        .loading p {
            color: #666;
            margin: 0;
        }
        
        .merchant-info {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .info-label {
            font-weight: 600;
            color: #666;
        }
        
        .info-value {
            color: #333;
            font-weight: 600;
        }
        
        .merchant-error {
            background: #ffebee;
            border: 1px solid #ffcdd2;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        
        .merchant-error i {
            color: #f44336;
            font-size: 32px;
            margin-bottom: 15px;
        }
        
        .merchant-error p {
            color: #c62828;
            margin: 0;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Завантажуємо дані мерчанта
    loadMerchantData();
}

// Функція для завантаження даних мерчанта
async function loadMerchantData() {
    const loading = document.getElementById('merchantLoading');
    const content = document.getElementById('merchantContent');
    const error = document.getElementById('merchantError');
    
    try {
        const result = await getMerchantDetails();
        
        if (result.success) {
            content.innerHTML = `
                <div class="merchant-info">
                    <div class="info-row">
                        <span class="info-label">ID мерчанта:</span>
                        <span class="info-value">${result.merchantId}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Найменування:</span>
                        <span class="info-value">${result.merchantName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">ЄДРПОУ:</span>
                        <span class="info-value">${result.edrpou}</span>
                    </div>
                </div>
                <div style="text-align: center;">
                    <button onclick="closeMerchantModal()" class="btn btn-primary">
                        <i class="fas fa-check"></i>
                        Закрити
                    </button>
                </div>
            `;
            loading.style.display = 'none';
            content.style.display = 'block';
        } else {
            error.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>Помилка: ${result.error}</p>
                <button onclick="closeMerchantModal()" class="btn btn-secondary">
                    <i class="fas fa-times"></i>
                    Закрити
                </button>
            `;
            loading.style.display = 'none';
            error.style.display = 'block';
        }
    } catch (err) {
        error.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>Помилка завантаження: ${err.message}</p>
            <button onclick="closeMerchantModal()" class="btn btn-secondary">
                <i class="fas fa-times"></i>
                Закрити
            </button>
        `;
        loading.style.display = 'none';
        error.style.display = 'block';
    }
}

// Функція для закриття модального вікна мерчанта
function closeMerchantModal() {
    const modal = document.querySelector('.merchant-modal');
    if (modal) {
        modal.remove();
    }
}

// Функція для відправки форми оплати карткою
async function submitCardPayment(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const cardNumber = formData.get('pan').replace(/\s/g, '');
    const cardExpiry = formData.get('exp');
    const cardCvv = formData.get('cvv');
    const amount = parseFloat(formData.get('amount'));
    const agreeTerms = formData.get('agreeTerms');
    
    if (!agreeTerms) {
        alert('Будь ласка, погодьтеся з умовами обробки платежів');
        return;
    }
    
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        alert('Невірний номер картки');
        return;
    }
    
    if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
        alert('Невірний формат терміну дії (ММ/РР)');
        return;
    }
    
    if (cardCvv.length < 3 || cardCvv.length > 4) {
        alert('Невірний CVV код');
        return;
    }
    
    if (amount <= 0) {
        alert('Введіть суму більше 0');
        return;
    }
    
    if (confirm('Підтвердити оплату на суму ' + amount + ' грн?')) {
        const paymentData = {
            amount: amount,
            cardData: {
                pan: cardNumber,
                exp: cardExpiry,
                cvv: parseInt(cardCvv)
            },
            paymentType: formData.get('paymentType'),
            initiationKind: formData.get('initiationKind'),
            reference: formData.get('reference') || null,
            destination: formData.get('destination') || null,
            customerEmail: formData.get('customerEmail') || null
        };
        
        if (formData.get('saveCard')) {
            paymentData.saveCardData = {
                saveCard: true
            };
        }
        
        try {
            const response = await fetch('/api/payment/card/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(paymentData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                if (result.tdsUrl) {
                    // Перенаправлення на 3DS
                    window.location.href = result.tdsUrl;
                } else {
                    // Успішна оплата
                    window.location.href = `/payment/card/success/${result.invoiceId}/`;
                }
            } else {
                alert('Помилка оплати: ' + result.error);
            }
        } catch (error) {
            console.error('Помилка:', error);
            alert('Помилка з\'єднання з сервером');
        }
    }
}

// Ініціалізуємо B2B кнопку
document.addEventListener('DOMContentLoaded', () => {
    initializeB2BButton();
});

