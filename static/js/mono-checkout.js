/**
 * Monobank Checkout Button Integration
 * Офіційна інтеграція кнопок Monobank згідно з брендбуком
 */

// Конфігурація кнопок Monobank
const MONO_CHECKOUT_CONFIG = {
    // API endpoints
    createInvoice: '/api/payment/create-invoice/',
    iframePayment: '/api/payment/iframe/',
    syncPayment: '/api/payment/sync/',
    cardPayment: '/api/payment/card/',
    
    // Налаштування кнопок
    defaultSize: 'medium',
    defaultVariant: 'standard',
    
    // Текст кнопок
    buttonText: 'Оформити через',
    logoText: 'mono checkout',
    
    // Анімації
    enableAnimations: true,
    loadingTimeout: 30000
};

/**
 * Створення кнопки Monobank checkout
 * @param {Object} options - Опції кнопки
 * @returns {HTMLElement} - HTML елемент кнопки
 */
function createMonoCheckoutButton(options = {}) {
    const {
        size = MONO_CHECKOUT_CONFIG.defaultSize,
        variant = MONO_CHECKOUT_CONFIG.defaultVariant,
        text = MONO_CHECKOUT_CONFIG.buttonText,
        logo = MONO_CHECKOUT_CONFIG.logoText,
        onClick = null,
        disabled = false,
        loading = false,
        className = '',
        id = null
    } = options;
    
    // Створюємо кнопку
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `mono-checkout-btn ${size} ${variant} ${loading ? 'loading' : ''} ${className}`;
    
    if (id) button.id = id;
    if (disabled) button.disabled = true;
    
    // Додаємо текст та логотип
    button.innerHTML = `
        <span class="mono-checkout-text">${text}</span>
        <span class="mono-checkout-logo">${logo}</span>
    `;
    
    // Додаємо обробник кліку
    if (onClick && typeof onClick === 'function') {
        button.addEventListener('click', onClick);
    }
    
    return button;
}

/**
 * Створення кнопки для кошика
 * @param {Object} cartData - Дані кошика
 * @returns {HTMLElement} - HTML елемент кнопки
 */
function createCartMonoButton(cartData) {
    return createMonoCheckoutButton({
        size: 'large',
        variant: 'standard',
        className: 'cart-mono-btn',
        onClick: () => processCartMonoPayment(cartData)
    });
}

/**
 * Створення кнопки для карточки товару
 * @param {Object} productData - Дані товару
 * @returns {HTMLElement} - HTML елемент кнопки
 */
function createProductMonoButton(productData) {
    return createMonoCheckoutButton({
        size: 'medium',
        variant: 'standard',
        className: 'product-mono-btn',
        onClick: () => processProductMonoPayment(productData)
    });
}

/**
 * Обробка оплати з кошика через Monobank
 * @param {Object} cartData - Дані кошика
 */
async function processCartMonoPayment(cartData) {
    try {
        // Показуємо індикатор завантаження
        const button = document.querySelector('.cart-mono-btn');
        if (button) {
            button.classList.add('loading');
            button.disabled = true;
        }
        
        // Формуємо дані для створення рахунку
        const invoiceData = {
            amount: cartData.total,
            ccy: 980,
            items: cartData.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            reference: `cart_${Date.now()}`,
            destination: `Оплата кошика (${cartData.items.length} товарів)`
        };
        
        // Створюємо рахунок
        const response = await fetch('/payment/create-cart-invoice/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(invoiceData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Перенаправляємо на оплату
            window.location.href = result.pageUrl;
        } else {
            throw new Error(result.error || 'Помилка створення рахунку');
        }
        
    } catch (error) {
        console.error('Помилка оплати через Monobank:', error);
        alert('Помилка створення рахунку: ' + error.message);
    } finally {
        // Прибираємо індикатор завантаження
        const button = document.querySelector('.cart-mono-btn');
        if (button) {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }
}

/**
 * Обробка оплати товару через Monobank
 * @param {Object} productData - Дані товару
 */
async function processProductMonoPayment(productData) {
    try {
        // Показуємо індикатор завантаження
        const button = document.querySelector('.product-mono-btn');
        if (button) {
            button.classList.add('loading');
            button.disabled = true;
        }
        
        // Формуємо дані для створення рахунку
        const invoiceData = {
            amount: productData.price,
            ccy: 980,
            items: [{
                name: productData.name,
                quantity: 1,
                price: productData.price
            }],
            reference: `product_${productData.id}_${Date.now()}`,
            destination: `Оплата товару: ${productData.name}`
        };
        
        // Створюємо рахунок
        const response = await fetch('/payment/create-cart-invoice/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(invoiceData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Перенаправляємо на оплату
            window.location.href = result.pageUrl;
        } else {
            throw new Error(result.error || 'Помилка створення рахунку');
        }
        
    } catch (error) {
        console.error('Помилка оплати через Monobank:', error);
        alert('Помилка створення рахунку: ' + error.message);
    } finally {
        // Прибираємо індикатор завантаження
        const button = document.querySelector('.product-mono-btn');
        if (button) {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }
}

/**
 * Додавання кнопок Monobank до кошика
 */
function addMonoButtonsToCart() {
    const cartActions = document.querySelector('.cart-actions');
    if (cartActions && !document.querySelector('.cart-mono-btn')) {
        // Отримуємо дані кошика
        const cartData = getCartData();
        
        if (cartData.items.length > 0) {
            // Створюємо кнопку Monobank
            const monoButton = createCartMonoButton(cartData);
            
            // Додаємо кнопку до кошика
            cartActions.appendChild(monoButton);
        }
    }
}

/**
 * Додавання кнопок Monobank до карточок товарів
 */
function addMonoButtonsToProducts() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (!card.querySelector('.product-mono-btn')) {
            // Отримуємо дані товару
            const productData = {
                id: card.dataset.productId,
                name: card.querySelector('.product-name')?.textContent || 'Товар',
                price: parseFloat(card.querySelector('.product-price')?.textContent || '0')
            };
            
            if (productData.price > 0) {
                // Створюємо кнопку Monobank
                const monoButton = createProductMonoButton(productData);
                
                // Додаємо кнопку до карточки
                const actions = card.querySelector('.product-actions') || card;
                actions.appendChild(monoButton);
            }
        }
    });
}

/**
 * Ініціалізація кнопок Monobank
 */
function initMonoCheckoutButtons() {
    // Додаємо кнопки до кошика
    addMonoButtonsToCart();
    
    // Додаємо кнопки до карточок товарів
    addMonoButtonsToProducts();
    
    // Додаємо кнопки до форм оплати
    addMonoButtonsToPaymentForms();
}

/**
 * Додавання кнопок Monobank до форм оплати
 */
function addMonoButtonsToPaymentForms() {
    const paymentForms = document.querySelectorAll('.payment-form');
    
    paymentForms.forEach(form => {
        if (!form.querySelector('.mono-checkout-btn')) {
            // Створюємо групу кнопок
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'mono-checkout-group';
            
            // Кнопка iFrame оплати
            const iframeButton = createMonoCheckoutButton({
                size: 'medium',
                variant: 'standard',
                text: 'Оформити через',
                logo: 'mono checkout',
                className: 'iframe-mono-btn',
                onClick: () => window.location.href = '/payment/iframe/'
            });
            
            // Кнопка синхронної оплати
            const syncButton = createMonoCheckoutButton({
                size: 'medium',
                variant: 'white',
                text: 'Миттєва оплата',
                logo: 'mono',
                className: 'sync-mono-btn',
                onClick: () => window.location.href = '/payment/sync/'
            });
            
            // Кнопка оплати за реквізитами
            const cardButton = createMonoCheckoutButton({
                size: 'medium',
                variant: 'gray',
                text: 'Оплата карткою',
                logo: 'mono',
                className: 'card-mono-btn',
                onClick: () => window.location.href = '/payment/card/'
            });
            
            // Додаємо кнопки до групи
            buttonGroup.appendChild(iframeButton);
            buttonGroup.appendChild(syncButton);
            buttonGroup.appendChild(cardButton);
            
            // Додаємо групу до форми
            form.appendChild(buttonGroup);
        }
    });
}

/**
 * Отримання даних кошика
 * @returns {Object} - Дані кошика
 */
function getCartData() {
    const cartItems = document.querySelectorAll('.cart-item');
    const items = [];
    let total = 0;
    
    cartItems.forEach(item => {
        const name = item.querySelector('.item-name')?.textContent || 'Товар';
        const price = parseFloat(item.querySelector('.item-price')?.textContent || '0');
        const quantity = parseInt(item.querySelector('.item-quantity')?.textContent || '1');
        
        items.push({
            name,
            price,
            quantity,
            total: price * quantity
        });
        
        total += price * quantity;
    });
    
    return { items, total };
}

/**
 * Отримання CSRF токена
 * @param {string} name - Назва cookie
 * @returns {string} - Значення cookie
 */
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

/**
 * Показ анімації кнопки
 * @param {HTMLElement} button - Кнопка
 * @param {number} duration - Тривалість анімації
 */
function animateMonoButton(button, duration = 2000) {
    if (MONO_CHECKOUT_CONFIG.enableAnimations) {
        button.classList.add('animate');
        setTimeout(() => {
            button.classList.remove('animate');
        }, duration);
    }
}

/**
 * Оновлення кнопок при зміні кошика
 */
function updateMonoButtons() {
    // Видаляємо старі кнопки
    document.querySelectorAll('.cart-mono-btn, .product-mono-btn').forEach(btn => btn.remove());
    
    // Додаємо нові кнопки
    initMonoCheckoutButtons();
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    initMonoCheckoutButtons();
    
    // Оновлюємо кнопки при зміні кошика
    document.addEventListener('cartUpdated', updateMonoButtons);
});

// Експорт функцій для глобального використання
window.MonoCheckout = {
    createButton: createMonoCheckoutButton,
    createCartButton: createCartMonoButton,
    createProductButton: createProductMonoButton,
    init: initMonoCheckoutButtons,
    update: updateMonoButtons,
    animate: animateMonoButton,
    config: MONO_CHECKOUT_CONFIG
};
