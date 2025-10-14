// ===== ЛОГІКА ГОЛОВНОЇ СТОРІНКИ З КОШИКОМ В LOCALSTORAGE =====

// Глобальні змінні для кошика
let cart = {
    items: [],
    total: 0,
    count: 0
};

// Перевірка наявності кольорів та кількостей при завантаженні
document.addEventListener('DOMContentLoaded', function() {
    // Перевіряємо кольори
    document.querySelectorAll('.color-dot').forEach(dot => {
        const inStock = dot.getAttribute('data-in-stock') === 'true';
        if (!inStock) {
            dot.classList.add('out-of-stock');
            // НЕ блокуємо pointer-events - користувач може клікати і дивитись фото
            // Блокування додавання в кошик відбувається в toggleMainProduct()
            console.log('⚠️ Колір без наявності (можна переглядати):', dot.getAttribute('data-color'));
        }
    });
    
    // Перевіряємо кількості
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        const inStock = btn.getAttribute('data-in-stock') === 'true';
        if (!inStock) {
            btn.classList.add('out-of-stock');
            // НЕ блокуємо кнопку - дозволяємо клік для перегляду фото
            // Блокування додавання в кошик відбувається в toggleMainProduct()
            console.log('⚠️ Кількість без наявності (можна переглядати):', btn.getAttribute('data-quantity'));
        }
    });
});

// Функція для завантаження кошика з localStorage
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('flowerShopCart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            cart.items = parsedCart.items || [];
            cart.total = parsedCart.total || 0;
            // Перераховуємо count з items
            cart.count = cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
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
    // ОБОВ'ЯЗКОВО перераховуємо кількість товарів
    cart.count = cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
    
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.count;
        cartCount.setAttribute('data-count', cart.count);
        
        // Додаємо спеціальний клас для великих чисел
        if (cart.count > 9) {
            cartCount.classList.add('large-count');
        } else {
            cartCount.classList.remove('large-count');
        }
        
        console.log('🛒 Оновлено лічильник кошика:', cart.count);
        
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

// Функція для оновлення прогрес бару (на головній сторінці)
function updateProgressBar() {
    const cartTotal = cart.total || 0;
    
    console.log('📊 Оновлення прогрес бару:', {
        cartTotal,
        cartItems: cart.items.length
    });
    
    // Використовуємо новий динамічний прогрес-бар
    if (window.progressBarManager) {
        window.progressBarManager.update(cartTotal);
        // На головній сторінці немає cart summary, тому бонуси показуються тільки компактно
        return;
    }
    
    // Fallback для старої версії (якщо прогрес-бар модуль не завантажено)
    const maxAmount = 1000;
    const progressPercent = Math.min((cartTotal / maxAmount) * 100, 100);
    const mainProgressFill = document.getElementById('progress-fill');
    const mainProgressText = document.getElementById('progress-text');
    
    console.log('📊 Елементи прогрес бару:', {
        progressFill: !!mainProgressFill,
        progressText: !!mainProgressText
    });
    
    if (mainProgressFill) {
        mainProgressFill.style.width = progressPercent + '%';
        console.log('✅ Прогрес бар оновлено:', progressPercent + '%');
    }
    if (mainProgressText) {
        mainProgressText.textContent = formatPrice(cartTotal);
        console.log('✅ Текст прогрес бару оновлено:', formatPrice(cartTotal));
    }
    
    // Оновлюємо мобільний прогрес бар
    const mobileFill = document.getElementById('progress-fill-mobile');
    const mobileText = document.getElementById('progress-text-mobile');
    if (mobileFill) {
        mobileFill.style.width = progressPercent + '%';
        console.log('✅ Мобільний прогрес бар оновлено:', progressPercent + '%');
    }
    if (mobileText) {
        mobileText.textContent = formatPrice(cartTotal);
        console.log('✅ Текст мобільного прогрес бару оновлено:', formatPrice(cartTotal));
    }
}

// Функція для форматування ціни
function formatPrice(price) {
    return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        minimumFractionDigits: 2
    }).format(price).replace('UAH', '₴');
}

// Функція для додавання головного товару в кошик
function toggleMainProduct() {
    const button = document.getElementById('cart-button');
    
    // ПЕРЕВІРКА: чи активний колір в наявності
    const activeColorDot = document.querySelector('.color-dot.active');
    if (activeColorDot && activeColorDot.getAttribute('data-in-stock') === 'false') {
        console.log('🚫 Активний колір немає в наявності');
        alert('Обраний колір відсутній в наявності. Будь ласка, оберіть інший колір.');
        return;
    }
    
    // ПЕРЕВІРКА: чи є наявна кількість
    const activeQuantityBtn = document.querySelector('.quantity-btn.active');
    if (!activeQuantityBtn) {
        console.log('🚫 Немає активної кнопки кількості');
        alert('Будь ласка, оберіть кількість квітів');
        return;
    }
    
    // ПЕРЕВІРКА: чи кількість в наявності
    if (activeQuantityBtn.getAttribute('data-in-stock') === 'false' || activeQuantityBtn.classList.contains('out-of-stock')) {
        console.log('🚫 Активна кількість немає в наявності');
        alert('Обрана кількість відсутня в наявності. Будь ласка, оберіть іншу кількість.');
        return;
    }
    
    const productTitle = document.querySelector('.product-title')?.textContent || 'Преміум товар';
    const currentPrice = document.querySelector('.final-price')?.textContent || '0';
    const currency = document.querySelector('.current-price')?.textContent?.split(' ').pop() || 'грн';
    const productImage = document.getElementById('product-image')?.src || '/static/images/IMG_1243.PNG';
    
    // Перевіряємо, чи товар вже в кошику
    const existingItem = cart.items.find(item => item.id === 'main-product');
    
    if (existingItem) {
        // Видаляємо товар з кошика
        cart.items = cart.items.filter(item => item.id !== 'main-product');
        button.textContent = 'В кошик';
        button.classList.remove('in-cart');
    } else {
        // Збираємо інформацію про колір та кількість квітів
        const selectedColor = document.querySelector('.color-dot.active')?.style.backgroundColor || '';
        const selectedQuantity = activeQuantityBtn.textContent || '1';
        
        // Додаємо товар в кошик
        cart.items.push({
            id: 'main-product',
            title: productTitle,
            price: parseFloat(currentPrice) || 0,
            currency: currency,
            image: productImage,
            quantity: 1,
            color: selectedColor,
            flowerQuantity: selectedQuantity,
            type: 'main' // Головний товар - квіти
        });
        button.textContent = window.cartTexts?.removeFromCart || 'З кошика';
        button.classList.add('in-cart');
    }
    
    // Оновлюємо загальну суму кошика
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    updateCartCount();
    updateProgressBar();
    saveCartToStorage();
}

// Функція для додавання додаткового товару в кошик
function toggleAdditionalProduct(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    const button = productCard?.querySelector('.additional-add-to-cart-btn');
    const productTitle = productCard?.querySelector('h3')?.textContent || `Товар ${productId}`;
    const productPrice = productCard?.querySelector('.additional-product-price')?.textContent || '0 грн';
    const productImage = productCard?.querySelector('img')?.src || '/static/images/foto 1.jpg';
    
    // Товар завжди доступний (склад видалено)
    
    // Парсимо ціну
    const priceValue = parseFloat(productPrice.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    const currency = productPrice.split(' ').pop() || 'грн';
    
    // Перевіряємо, чи товар вже в кошику
    const existingItem = cart.items.find(item => item.id === `product-${productId}`);
    
    if (existingItem) {
        // Видаляємо товар з кошика
        cart.items = cart.items.filter(item => item.id !== `product-${productId}`);
        if (button) {
            button.textContent = 'Додати в кошик';
            button.classList.remove('in-cart');
        }
        productCard?.classList.remove('in-cart');
    } else {
        // Збираємо інформацію про колір та кількість квітів для додаткового товару
        const selectedColor = productCard.querySelector('.color-dot.active')?.style.backgroundColor || '';
        const selectedQuantity = productCard.querySelector('.quantity-btn.active')?.textContent || '1';
        
        // Додаємо товар в кошик
        cart.items.push({
            id: `product-${productId}`,
            title: productTitle,
            price: priceValue,
            currency: currency,
            image: productImage,
            quantity: 1,
            type: 'additional' // Додатковий товар - не квіти
        });
        if (button) {
            button.textContent = window.cartTexts?.removeFromCart || 'З кошика';
            button.classList.add('in-cart');
        }
        productCard?.classList.add('in-cart');
    }
    
    // Оновлюємо загальну суму кошика
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    updateCartCount();
    updateProgressBar();
    saveCartToStorage();
    
    // Повідомлення видалено - замість них показуємо лічильник на іконці кошику
}

// Функція для перемикання всіх додаткових товарів видалена

// Функція для оновлення кнопки "Додати всі" видалена

// Функція showNotification видалена - замість повідомлень використовуємо лічильник на іконці кошику

// Функції для заборони прокрутки на мобільних пристроях видалені - використовуємо сторінку кошика

// Функція для синхронізації стану кнопок з кошиком
function syncButtonsWithCart() {
    // Синхронізуємо головний товар
    const mainProduct = cart.items.find(item => item.id === 'main-product');
    const mainButton = document.getElementById('cart-button');
    if (mainButton) {
        if (mainProduct) {
            mainButton.textContent = window.cartTexts?.removeFromCart || 'З кошика';
            mainButton.classList.add('in-cart');
        } else {
            mainButton.textContent = window.cartTexts?.addToCart || 'В кошик';
            mainButton.classList.remove('in-cart');
        }
    }
    
    // Синхронізуємо додаткові товари
    const productCards = document.querySelectorAll('.additional-product-card[data-product-id]');
    productCards.forEach(card => {
        const productId = card.getAttribute('data-product-id');
        const button = card.querySelector('.additional-add-to-cart-btn');
        const isInCart = cart.items.some(item => item.id === `product-${productId}`);
        
        if (button) {
            if (isInCart) {
                button.textContent = window.cartTexts?.removeFromCart || 'З кошика';
                button.classList.add('in-cart');
                card.classList.add('in-cart');
            } else {
                button.textContent = window.cartTexts?.addToCart || 'В кошик';
                button.classList.remove('in-cart');
                card.classList.remove('in-cart');
            }
        }
    });
    
    // Центруємо кнопки кількості після синхронізації
    centerQuantityButtons();
}

// Обробники подій для кошика видалені - використовуємо сторінку кошика

// Функція для центрування кнопок кількості
function centerQuantityButtons() {
    const containers = document.querySelectorAll('.quantity-buttons-container');
    
    containers.forEach(container => {
        const visibleButtons = container.querySelectorAll('.quantity-btn:not(.hidden)');
        const buttonCount = visibleButtons.length;
        
        // Видаляємо попередні класи
        container.classList.remove('single-btn', 'two-btns', 'three-btns', 'four-btns', 'five-btns');
        
        // Додаємо відповідний клас залежно від кількості
        if (buttonCount === 1) {
            container.classList.add('single-btn');
        } else if (buttonCount === 2) {
            container.classList.add('two-btns');
        } else if (buttonCount === 3) {
            container.classList.add('three-btns');
        } else if (buttonCount === 4) {
            container.classList.add('four-btns');
        } else if (buttonCount >= 5) {
            container.classList.add('five-btns');
        }
    });
}

// Ініціалізація головної сторінки
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏠 Ініціалізація головної сторінки...');
    console.log('═══════════════════════════════════════════════════════');
    
    // Перевірка доступності модулів
    console.log('🔍 ПЕРЕВІРКА МОДУЛІВ:');
    console.log('   - window.progressBarManager:', !!window.progressBarManager);
    
    if (window.progressBarManager) {
        console.log('   ✅ progressBarManager доступний');
    } else {
        console.error('   ❌ progressBarManager НЕ знайдено!');
    }
    
    // Завантажуємо кошик з localStorage
    console.log('📂 Завантаження кошика з localStorage...');
    loadCartFromStorage();
    console.log('   - Товарів:', cart.items.length);
    console.log('   - Сума:', cart.total);
    
    // Синхронізуємо кнопки з поточним станом кошика
    syncButtonsWithCart();
    
    // Оновлюємо лічильник та прогрес бар
    updateCartCount();
    updateProgressBar();
    
    // Центруємо кнопки кількості
    centerQuantityButtons();
    
    console.log('✅ Головна сторінка ініціалізована');
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

// Функції для роботи з overlay кошика видалені - використовуємо сторінку кошика

function goToCheckout() {
    window.location.href = '/cart/';
}

// Обробка необроблених помилок
window.addEventListener('unhandledrejection', function(e) {
    if (e.reason && e.reason.message && e.reason.message.includes('message port')) {
        console.log('🔧 Ігноруємо помилку message port (розширення браузера)');
        e.preventDefault();
    }
});

