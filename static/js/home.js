// ===== ЛОГІКА ГОЛОВНОЇ СТОРІНКИ З КОШИКОМ В LOCALSTORAGE =====

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
    
    // Оновлюємо прогрес бар під шапкою (якщо є)
    const mainProgressFill = document.getElementById('progress-fill');
    const mainProgressText = document.getElementById('progress-text');
    if (mainProgressFill) {
        mainProgressFill.style.width = progressPercent + '%';
    }
    if (mainProgressText) {
        mainProgressText.textContent = formatPrice(cartTotal);
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
        // Додаємо товар в кошик
        cart.items.push({
            id: 'main-product',
            title: productTitle,
            price: parseFloat(currentPrice) || 0,
            currency: currency,
            image: productImage,
            quantity: 1
        });
        button.textContent = window.cartTexts?.removeFromCart || 'Прибрати з кошика';
        button.classList.add('in-cart');
    }
    
    updateCartCount();
    updateProgressBar();
    saveCartToStorage();
    
    // Показуємо повідомлення
    const message = existingItem ? 'Товар видалено з кошика' : 'Товар додано в кошик';
    showNotification(message, existingItem ? 'info' : 'success');
}

// Функція для додавання додаткового товару в кошик
function toggleAdditionalProduct(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    const button = productCard?.querySelector('.additional-add-to-cart-btn');
    const productTitle = productCard?.querySelector('h3')?.textContent || `Товар ${productId}`;
    const productPrice = productCard?.querySelector('.additional-product-price')?.textContent || '0 грн';
    const productImage = productCard?.querySelector('img')?.src || '/static/images/foto 1.jpg';
    
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
        // Додаємо товар в кошик
        cart.items.push({
            id: `product-${productId}`,
            title: productTitle,
            price: priceValue,
            currency: currency,
            image: productImage,
            quantity: 1
        });
        if (button) {
            button.textContent = window.cartTexts?.removeFromCart || 'Прибрати з кошика';
            button.classList.add('in-cart');
        }
        productCard?.classList.add('in-cart');
    }
    
    updateCartCount();
    updateProgressBar();
    saveCartToStorage();
    updateAddAllButton();
    
    // Повідомлення видалено - замість них показуємо лічильник на іконці кошику
}

// Функція для перемикання всіх додаткових товарів
function toggleAllAdditionalProducts() {
    const addAllBtn = document.querySelector('.add-all-btn');
    const productCards = document.querySelectorAll('.additional-product-card[data-product-id]');
    
    // Перевіряємо, чи всі товари в кошику
    const allInCart = Array.from(productCards).every(card => {
        const productId = card.getAttribute('data-product-id');
        return cart.items.some(item => item.id === `product-${productId}`);
    });
    
    if (allInCart) {
        // Видаляємо всі товари з кошика
        productCards.forEach(card => {
            const productId = card.getAttribute('data-product-id');
            const button = card.querySelector('.additional-add-to-cart-btn');
            
            cart.items = cart.items.filter(item => item.id !== `product-${productId}`);
            
            if (button) {
                button.textContent = window.cartTexts?.addToCart || 'В кошик';
                button.classList.remove('in-cart');
            }
            card.classList.remove('in-cart');
        });
        
        if (addAllBtn) {
            addAllBtn.textContent = 'Додати всі';
            addAllBtn.classList.remove('all-in-cart');
        }
    } else {
        // Додаємо всі товари в кошик
        productCards.forEach(card => {
            const productId = card.getAttribute('data-product-id');
            const button = card.querySelector('.additional-add-to-cart-btn');
            const productTitle = card.querySelector('h3')?.textContent || `Товар ${productId}`;
            const productPrice = card.querySelector('.additional-product-price')?.textContent || '0 грн';
            const productImage = card.querySelector('img')?.src || '/static/images/foto 1.jpg';
            
            // Перевіряємо, чи товар вже в кошику
            const existingItem = cart.items.find(item => item.id === `product-${productId}`);
            
            if (!existingItem) {
                // Парсимо ціну
                const priceValue = parseFloat(productPrice.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
                const currency = productPrice.split(' ').pop() || 'грн';
                
                cart.items.push({
                    id: `product-${productId}`,
                    title: productTitle,
                    price: priceValue,
                    currency: currency,
                    image: productImage,
                    quantity: 1
                });
                
                if (button) {
                    button.textContent = window.cartTexts?.removeFromCart || 'Прибрати з кошика';
                    button.classList.add('in-cart');
                }
                card.classList.add('in-cart');
            }
        });
        
        if (addAllBtn) {
            addAllBtn.textContent = 'Прибрати всі';
            addAllBtn.classList.add('all-in-cart');
        }
    }
    
    updateCartCount();
    updateProgressBar();
    saveCartToStorage();
    
    // Повідомлення видалено - замість них показуємо лічильник на іконці кошику
}

// Функція для оновлення кнопки "Додати всі"
function updateAddAllButton() {
    const addAllBtn = document.querySelector('.add-all-btn');
    const productCards = document.querySelectorAll('.additional-product-card[data-product-id]');
    
    if (addAllBtn && productCards.length > 0) {
        const allInCart = Array.from(productCards).every(card => {
            const productId = card.getAttribute('data-product-id');
            return cart.items.some(item => item.id === `product-${productId}`);
        });
        
        if (allInCart) {
            addAllBtn.textContent = 'Прибрати всі';
            addAllBtn.classList.add('all-in-cart');
        } else {
            addAllBtn.textContent = 'Додати всі';
            addAllBtn.classList.remove('all-in-cart');
        }
    }
}

// Функція showNotification видалена - замість повідомлень використовуємо лічильник на іконці кошику

// Функція для синхронізації стану кнопок з кошиком
function syncButtonsWithCart() {
    // Синхронізуємо головний товар
    const mainProduct = cart.items.find(item => item.id === 'main-product');
    const mainButton = document.getElementById('cart-button');
    if (mainButton) {
        if (mainProduct) {
            mainButton.textContent = window.cartTexts?.removeFromCart || 'Прибрати з кошика';
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
                button.textContent = window.cartTexts?.removeFromCart || 'Прибрати з кошика';
                button.classList.add('in-cart');
                card.classList.add('in-cart');
            } else {
                button.textContent = window.cartTexts?.addToCart || 'В кошик';
                button.classList.remove('in-cart');
                card.classList.remove('in-cart');
            }
        }
    });
    
    // Синхронізуємо кнопку "Додати всі"
    updateAddAllButton();
}

// Ініціалізація головної сторінки
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏠 Ініціалізація головної сторінки...');
    
    // Завантажуємо кошик з localStorage
    loadCartFromStorage();
    
    // Синхронізуємо кнопки з поточним станом кошика
    syncButtonsWithCart();
    
    // Оновлюємо лічильник та прогрес бар
    updateCartCount();
    updateProgressBar();
    
    console.log('✅ Головна сторінка ініціалізована');
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

