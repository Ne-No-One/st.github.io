// Функція для плавної прокрутки
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Функція для анімацій при скролі
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Спостерігаємо за секціями
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Функція для прогрес бару
function initializeProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    
    if (progressFill) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressFill.style.width = scrollPercent + '%';
        });
    }
}

// Функція для оновлення прогрес барів кошика
function updateProgressBars() {
    const cartTotal = cart.total || 0;
    const maxAmount = 1000; // Максимальна сума для 100% прогрес бару
    const progressPercent = Math.min((cartTotal / maxAmount) * 100, 100);
    
    // Оновлюємо прогрес бар під шапкою
    const mainProgressFill = document.getElementById('progress-fill');
    const mainProgressText = document.getElementById('progress-text');
    if (mainProgressFill) {
        mainProgressFill.style.width = progressPercent + '%';
    }
    if (mainProgressText) {
        mainProgressText.textContent = formatPrice(cartTotal);
    }
    
    // Оновлюємо прогрес бар в кошику
    const cartProgressFill = document.getElementById('cart-progress-fill');
    const cartProgressText = document.getElementById('cart-progress-text');
    if (cartProgressFill) {
        cartProgressFill.style.width = progressPercent + '%';
    }
    if (cartProgressText) {
        cartProgressText.textContent = formatPrice(cartTotal);
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

// Функція для обробки форми контактів
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Тут можна додати логіку відправки форми
            alert('Дякуємо за ваше повідомлення! Ми зв\'яжемося з вами найближчим часом.');
            
            // Очищуємо форму
            this.reset();
        });
    }
}

// Ініціалізуємо сайт після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeContactForm();
});

// Додаємо обробник для кнопки CTA
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cta-button')) {
        e.preventDefault();
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Функція для обробки кнопки B2B
function initializeB2BButton() {
    const b2bButton = document.querySelector('.b2b-button');
    if (b2bButton) {
        b2bButton.addEventListener('click', function() {
            alert('B2B функціональність буде додана пізніше!');
        });
    }
}


// Функція для каруселі товару
function initializeProductCarousel() {
    const colorDots = document.querySelectorAll('.color-dot');
    const productImage = document.getElementById('product-image');
    
    console.log(`🎨 Знайдено ${colorDots.length} кружечків кольорів`);
    
    // Обробка вибору кольору
    colorDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            console.log(`🎨 Клік на колір: ${this.dataset.color}`);
            
            // Видаляємо активний клас з усіх точок
            colorDots.forEach(d => d.classList.remove('active'));
            // Додаємо активний клас до поточної точки
            this.classList.add('active');
            
            // Змінюємо зображення з анімацією
            const newImageSrc = this.getAttribute('data-image');
            if (productImage && newImageSrc) {
                // Плавна зміна зображення
                productImage.style.opacity = '0.5';
                setTimeout(() => {
                    productImage.src = newImageSrc;
                    productImage.style.opacity = '1';
                }, 150);
            }
        });
    });
    
    // Активуємо перший колір за замовчуванням
    if (colorDots.length > 0) {
        colorDots[0].classList.add('active');
    }
    
    // Функція для зміни зображення (кнопки навігації)
    window.changeImage = function(direction) {
        const activeDot = document.querySelector('.color-dot.active');
        const allDots = Array.from(colorDots);
        const currentIndex = allDots.indexOf(activeDot);
        
        let newIndex = currentIndex + direction;
        
        // Зациклюємо навігацію
        if (newIndex >= allDots.length) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = allDots.length - 1;
        }
        
        // Клікаємо на нову точку
        if (allDots[newIndex]) {
            allDots[newIndex].click();
        }
    };
}



// ===== НОВИЙ КОШИК =====

// Глобальні змінні для кошика
let cart = {
    items: [],
    total: 0,
    count: 0
};

// Функція для перемикання кошика
function toggleCart() {
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartOverlay) {
        if (cartOverlay.classList.contains('show')) {
            closeCart();
        } else {
            openCart();
        }
    }
}

// Функція для відкриття кошика
function openCart() {
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartOverlay) {
        cartOverlay.classList.add('show');
        updateCartDisplay();
    }
}

// Функція для закриття кошика
function closeCart() {
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartOverlay) {
        cartOverlay.classList.remove('show');
    }
}

// Обробник для закриття кошика при натисканні Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay && cartOverlay.classList.contains('show')) {
            closeCart();
        }
    }
});

// Обробник для закриття кошика при кліку поза ним
document.addEventListener('click', function(e) {
    const cartOverlay = document.getElementById('cart-overlay');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartOverlay && cartOverlay.classList.contains('show')) {
        // Перевіряємо, чи клік був поза кошиком та поза іконкою кошика
        if (!cartOverlay.contains(e.target) && !cartIcon.contains(e.target)) {
            closeCart();
        }
    }
});

// Функція ініціалізації кошика
function initializeCart() {
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartOverlay) {
        // Переконуємося, що кошик прихований при завантаженні
        cartOverlay.classList.remove('show');
        
        console.log('✅ Кошик ініціалізовано та приховано');
    }
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
        button.textContent = 'Прибрати з кошика';
        button.classList.add('in-cart');
    }
    
    updateCartCount();
    updateCartDisplay();
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
            button.textContent = 'Прибрати з кошика';
            button.classList.add('in-cart');
        }
        productCard?.classList.add('in-cart');
    }
    
    updateCartCount();
    updateCartDisplay();
    updateAddAllButton();
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
                button.textContent = 'Додати в кошик';
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
                    button.textContent = 'Прибрати з кошика';
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
        updateCartDisplay();
}

// Функція для оновлення лічильника кошика
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cart.count = cart.items.length;
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    if (cartCount) {
        cartCount.textContent = cart.count;
        if (cart.count > 0) {
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
    }
    
    // Також оновлюємо відображення в кошику якщо він відкритий
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartItemsCount = document.getElementById('cart-items-count');
    
    if (cartTotalPrice) {
        cartTotalPrice.textContent = `${cart.total.toFixed(2)} грн`;
    }
    
    if (cartItemsCount) {
        const itemsText = cart.count === 1 ? 'товар' : 
                         cart.count < 5 ? 'товари' : 'товарів';
        cartItemsCount.textContent = `${cart.count} ${itemsText}`;
    }
}

// Функція для оновлення відображення кошика
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartItemsCount = document.getElementById('cart-items-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!cartItems || !cartEmpty || !cartTotalPrice || !cartItemsCount || !checkoutBtn) return;
    
    // Очищаємо кошик
    cartItems.innerHTML = '';
    
    // Обчислюємо загальну суму
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cart.items.length === 0) {
        // Показуємо порожній кошик
        cartEmpty.style.display = 'block';
        cartItems.style.display = 'none';
        checkoutBtn.disabled = true;
    } else {
        // Показуємо товари
        cartEmpty.style.display = 'none';
        cartItems.style.display = 'block';
        checkoutBtn.disabled = false;
        
        // Додаємо товари в кошик
        cart.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <div class="price">${item.price.toFixed(2)} ${item.currency}</div>
                </div>
                <button class="remove-item-btn" data-item-id="${item.id}">×</button>
            `;
            
            // Додаємо обробник події для кнопки видалення
            const removeBtn = cartItem.querySelector('.remove-item-btn');
            removeBtn.addEventListener('click', () => {
                removeFromCart(item.id);
            });
            cartItems.appendChild(cartItem);
        });
    }
    
    // Оновлюємо загальну суму та кількість
    cartTotalPrice.textContent = `${cart.total.toFixed(2)} грн`;
    cartItemsCount.textContent = `${cart.count} товар${cart.count === 1 ? '' : cart.count < 5 ? 'и' : 'ів'}`;
    
    // Оновлюємо прогрес бари
    updateProgressBars();
}

// Функція для видалення товару з кошика
function removeFromCart(itemId) {
    console.log('Видалення товару з кошика:', itemId);
    
    // Видаляємо товар з масиву
    cart.items = cart.items.filter(item => item.id !== itemId);
    
    // Оновлюємо відображення кошика
    updateCartCount();
    updateCartDisplay();
    
    // Оновлюємо кнопки на сайті
    if (itemId === 'main-product') {
        const mainButton = document.getElementById('cart-button');
        if (mainButton) {
            mainButton.textContent = 'В кошик';
            mainButton.classList.remove('in-cart');
        }
    } else if (itemId.startsWith('product-')) {
        const productId = itemId.replace('product-', '');
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        const button = productCard?.querySelector('.additional-add-to-cart-btn');
        if (button) {
            button.textContent = 'Додати в кошик';
            button.classList.remove('in-cart');
        }
        if (productCard) {
            productCard.classList.remove('in-cart');
        }
    }
    
    // Оновлюємо кнопку "Додати все"
    updateAddAllButton();
    
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

// Функція для оформлення замовлення
function checkout() {
    if (cart.items.length === 0) {
        alert('Кошик порожній!');
        return;
    }
    
    // Тут можна додати логіку оформлення замовлення
    alert(`Замовлення на суму ${cart.total.toFixed(2)} грн оформлено!`);
    
    // Очищаємо кошик
    cart.items = [];
    updateCartCount();
    updateCartDisplay();
    updateAddAllButton();
    
    // Оновлюємо всі кнопки
    const mainButton = document.getElementById('cart-button');
    if (mainButton) {
        mainButton.textContent = 'В кошик';
        mainButton.classList.remove('in-cart');
    }
    
    const additionalButtons = document.querySelectorAll('.additional-add-to-cart-btn');
    additionalButtons.forEach(button => {
        button.textContent = 'Додати в кошик';
        button.classList.remove('in-cart');
    });
    
    const productCards = document.querySelectorAll('.additional-product-card');
    productCards.forEach(card => {
        card.classList.remove('in-cart');
    });
    
    // Закриваємо кошик
    closeCart();
}

// ===== СИСТЕМА ШАРІВ ДЛЯ ТОВАРІВ =====

// Глобальний об'єкт для зберігання поточного стану
let currentProductState = {
    selectedColor: null,
    selectedQuantity: null,
    packagingTexture: null,
    maskImage: null,
    flowersImage: null
};

// Функція для зміни кольору з повною системою шарів
function changeColorWithMask(colorData) {
    console.log('🎨 Зміна кольору з даними:', colorData);
    
    const packagingLayer = document.querySelector('.packaging-layer');
    const flowersLayer = document.querySelector('.flowers-layer');
    const colorMask = document.querySelector('.color-mask');
    const productImage = document.getElementById('product-image');
    
    if (!colorData) {
        console.log('❌ Немає даних кольору');
        return;
    }
    
    // Оновлюємо поточний стан
    currentProductState.selectedColor = colorData;
    
    // 1. Нижній шар: пакувальний папір з текстурою
    if (packagingLayer) {
        // Встановлюємо текстуру паперу як фон
        if (colorData.packaging_texture) {
            packagingLayer.style.backgroundImage = `url(${colorData.packaging_texture})`;
        } else {
            // Якщо немає текстури, використовуємо градієнт
            packagingLayer.style.background = `linear-gradient(45deg, ${colorData.hex_code}, ${adjustBrightness(colorData.hex_code, -20)})`;
        }
        packagingLayer.classList.add('active');
        console.log('✅ Активовано шар пакування');
    }
    
    // 2. Середній шар: кольорова маска з ефектом multiply
    if (colorMask) {
        if (colorData.mask_image) {
            colorMask.style.backgroundImage = `url(${colorData.mask_image})`;
        }
        colorMask.style.backgroundColor = colorData.hex_code;
        colorMask.classList.add('active');
        console.log('✅ Активовано кольорову маску');
    }
    
    // 3. Верхній шар: зображення квітів
    if (flowersLayer) {
        if (colorData.flowers_image) {
            flowersLayer.style.backgroundImage = `url(${colorData.flowers_image})`;
            flowersLayer.classList.add('active');
            console.log('✅ Активовано шар квітів');
        } else {
            flowersLayer.classList.remove('active');
        }
    }
    
    // 4. Основне зображення видалено - використовуємо тільки фото для кількості
    
    console.log('🎯 Зміна кольору завершена');
}

// Функція для скидання всіх шарів
function resetLayers() {
    console.log('🔄 Скидання всіх шарів');
    
    const layers = document.querySelectorAll('.packaging-layer, .flowers-layer, .color-mask');
    layers.forEach(layer => {
        layer.classList.remove('active');
        layer.style.backgroundImage = '';
        layer.style.backgroundColor = '';
        layer.style.background = '';
    });
    
    // Скидаємо поточний стан
    currentProductState.selectedColor = null;
    currentProductState.selectedQuantity = null;
    
    console.log('✅ Всі шари скинуті');
}

// Допоміжна функція для зміни яскравості кольору
function adjustBrightness(hex, amount) {
    const usePound = hex[0] === '#';
    const col = usePound ? hex.slice(1) : hex;
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = (num >> 8 & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}

// Функція для оновлення фото для кількості
function updateQuantityImage(quantity) {
    console.log('🖼️ Оновлення фото для кількості:', quantity);
    
    // Отримуємо поточний колір
    const activeColor = document.querySelector('.color-dot.active');
    if (!activeColor) {
        console.log('❌ Немає активного кольору');
        return;
    }
    
    const colorName = activeColor.dataset.color;
    console.log('🎨 Поточний колір:', colorName);
    
    // Отримуємо фото для цієї кількості та кольору
    const quantityImage = getQuantityImageForColor(colorName, quantity);
    if (quantityImage) {
        console.log('✅ Знайдено фото для кількості:', quantityImage);
        
        // Створюємо або оновлюємо зображення
        let productImage = document.getElementById('product-image');
        if (!productImage) {
            // Створюємо нове зображення
            productImage = document.createElement('img');
            productImage.id = 'product-image';
            productImage.className = 'product-image';
            productImage.alt = 'Товар';
            productImage.loading = 'lazy';
            
            // Додаємо до контейнера
            const imageGallery = document.querySelector('.image-gallery');
            if (imageGallery) {
                imageGallery.appendChild(productImage);
            }
        }
        
        // Оновлюємо зображення
        productImage.style.opacity = '0.7';
        setTimeout(() => {
            productImage.src = quantityImage;
            productImage.style.opacity = '1';
        }, 200);
    } else {
        console.log('❌ Фото для кількості не знайдено');
    }
}

// Функція для отримання фото для кількості та кольору
function getQuantityImageForColor(colorName, quantity) {
    // Отримуємо активний колір
    const activeColor = document.querySelector('.color-dot.active');
    if (!activeColor) return null;
    
    // Отримуємо дані кольору з data-атрибутів
    const colorData = {
        name: colorName,
        quantity_images: getColorQuantityImages(colorName)
    };
    
    // Повертаємо фото для конкретної кількості або фото за замовчуванням
    if (colorData.quantity_images && colorData.quantity_images[quantity]) {
        return colorData.quantity_images[quantity];
    }
    
    // Якщо немає фото для цієї кількості, повертаємо фото за замовчуванням
    return getDefaultImageForColor(colorName);
}

// Функція для отримання фото за замовчуванням для кольору
function getDefaultImageForColor(colorName) {
    // Отримуємо дані кольору з HTML
    const colorDot = document.querySelector(`[data-color="${colorName}"]`);
    if (colorDot && colorDot.dataset.defaultImage) {
        return colorDot.dataset.defaultImage;
    }
    return null;
}

// Функція для отримання фото кількості для кольору
function getColorQuantityImages(colorName) {
    // Це буде заповнено даними з сервера
    // Поки що повертаємо порожній об'єкт
    return {};
}

// Функція для відображення фото всіх кількостей для кольору
function showQuantityImages(colorName) {
    console.log('🖼️ Показуємо фото для кольору:', colorName);
    
    const container = document.getElementById('quantitiesContainer');
    const grid = document.getElementById('quantityImagesGrid');
    
    if (!container || !grid) {
        console.log('❌ Контейнер не знайдено');
        return;
    }
    
    // Очищуємо попередні фото
    grid.innerHTML = '';
    
    // Отримуємо всі кнопки кількості
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    
    if (quantityButtons.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    // Показуємо контейнер
    container.style.display = 'block';
    
    // Додаємо фото для кожної кількості
    quantityButtons.forEach(btn => {
        const quantity = btn.dataset.quantity;
        const imageUrl = getQuantityImageForColor(colorName, quantity);
        
        if (imageUrl) {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'quantity-image-item';
            imageDiv.innerHTML = `
                <div class="quantity-image-wrapper">
                    <img src="${imageUrl}" alt="Кількість ${quantity}" class="quantity-image">
                    <div class="quantity-label">${quantity} шт</div>
                </div>
            `;
            grid.appendChild(imageDiv);
        }
    });
    
    console.log('✅ Фото кількостей відображено');
}

// Функція для зміни кількості з збереженням кольору
function changeQuantityWithLayers(quantityData) {
    console.log('🔢 Зміна кількості з даними:', quantityData);
    
    const productImage = document.getElementById('product-image');
    const flowersLayer = document.querySelector('.flowers-layer');
    
    if (!quantityData) return;
    
    // Оновлюємо поточний стан
    currentProductState.selectedQuantity = quantityData;
    
    // Змінюємо основне зображення на відповідне кількості
    if (productImage && quantityData.base_image) {
        productImage.style.opacity = '0.7';
        setTimeout(() => {
            productImage.src = quantityData.base_image;
            productImage.style.opacity = '1';
        }, 200);
        console.log('✅ Оновлено основне зображення для кількості');
    }
    
    // Оновлюємо шар квітів для цієї кількості (якщо є)
    if (flowersLayer && quantityData.flowers_image) {
        flowersLayer.style.backgroundImage = `url(${quantityData.flowers_image})`;
        console.log('✅ Оновлено шар квітів для кількості');
    }
    
    // Повторно застосовуємо поточний колір до нового зображення
    if (currentProductState.selectedColor) {
        setTimeout(() => {
            changeColorWithMask(currentProductState.selectedColor);
        }, 300);
        console.log('♻️  Повторно застосовано колір');
    }
    
    console.log('🎯 Зміна кількості завершена');
}

// Функція для вибору кольору (викликається з HTML)
function selectColor(element, hexCode, flowersImage, maskImage, packagingTexture) {
    console.log('🎨 Вибір кольору:', { hexCode, flowersImage, maskImage, packagingTexture });
    
    // Видаляємо активний клас з усіх кольорових кружечків
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Додаємо активний клас до вибраного кружечка
    element.classList.add('active');
    
    // Створюємо об'єкт з повними даними кольору
    const colorData = {
        hex_code: hexCode,
        flowers_image: flowersImage,
        mask_image: maskImage,
        packaging_texture: packagingTexture || null
    };
    
    // Застосовуємо зміну кольору з повною системою шарів
    changeColorWithMask(colorData);
    
    // Оновлюємо ціну якщо потрібно
    updatePrice();
    
            // Оновлюємо фото для поточної кількості
            const activeQuantity = document.querySelector('.quantity-btn.active');
            if (activeQuantity) {
                updateQuantityImage(activeQuantity.dataset.quantity);
            }
            
            // Показуємо фото для всіх кількостей цього кольору
            showQuantityImages(colorName);
    
    console.log('✅ Колір вибрано та застосовано');
}

// Функція для переключення видимості окремих шарів (для демонстрації)
function toggleLayer(layerType) {
    let layer;
    
    switch(layerType) {
        case 'packaging':
            layer = document.querySelector('.packaging-layer');
            break;
        case 'mask':
            layer = document.querySelector('.color-mask');
            break;
        case 'flowers':
            layer = document.querySelector('.flowers-layer');
            break;
        default:
            console.log('❌ Невідомий тип шару:', layerType);
            return;
    }
    
    if (layer) {
        layer.classList.toggle('active');
        console.log(`🔄 Переключено шар ${layerType}:`, layer.classList.contains('active') ? 'активний' : 'неактивний');
    }
}

// Функція для оновлення ціни
function updatePrice() {
    const activeQuantity = document.querySelector('.quantity-btn.active');
    const priceElement = document.querySelector('.final-price');
    
    if (activeQuantity && priceElement) {
        const pricePerUnit = parseFloat(activeQuantity.dataset.pricePerUnit) || 0;
        const quantity = parseInt(activeQuantity.dataset.quantity) || 1;
        const currency = activeQuantity.dataset.currency || 'грн';
        
        const totalPrice = pricePerUnit * quantity;
        priceElement.textContent = `${totalPrice.toFixed(2)} ${currency}`;
    }
}

// Ініціалізуємо нові функції
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Ініціалізація всіх функцій...');
    
    // Ініціалізуємо кошик
    initializeCart();
    
    // Ініціалізуємо основні функції
    initializeB2BButton();
    initializeProductCarousel();
    initializeProgressBar();
    initializePriceCalculation();
    
    // Ініціалізуємо прогрес бари
    updateProgressBars();
    
    // Додаткова ініціалізація для першого зображення
    const firstDot = document.querySelector('.color-dot.active');
    const productImage = document.getElementById('product-image');
    if (firstDot && productImage) {
        const firstImageSrc = firstDot.getAttribute('data-image');
        if (firstImageSrc) {
            productImage.src = firstImageSrc;
            console.log('🖼️ Встановлено початкове зображення');
        }
    }
    
    // Перевіряємо наявність всіх важливих елементів
    checkButtonFunctionality();
    
    // Забезпечуємо запуск сторінки з самого верху
    window.scrollTo(0, 0);
    
    console.log('✅ Ініціалізація завершена');
});

// Додатково скидаємо скрол при завантаженні сторінки
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

// ===== ОПТИМІЗАЦІЯ ДЛЯ ШВИДШОГО ЗАВАНТАЖЕННЯ =====

// Debounce функція для оптимізації скролу
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Функція для оновлення прогрес-бару
function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }
}

// Оптимізований обробник скролу
const optimizedScrollHandler = debounce(function() {
    updateProgressBar();
}, 16); // ~60fps

// Замінюємо звичайний обробник скролу на оптимізований
window.removeEventListener('scroll', updateProgressBar);
window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// Preload критичних зображень
function preloadCriticalImages() {
    const criticalImages = [
        '/static/images/IMG_1243.PNG',
        '/static/images/foto 2.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Функція розрахунку ціни залежно від кількості (нова логіка)
function initializePriceCalculation() {
    const quantityButtons = document.querySelectorAll('.quantity-buttons-container .quantity-btn, .quantity-btn');
    const priceElement = document.querySelector('.current-price, .product-price');
    const finalPriceDisplay = document.querySelector('.final-price');
    
    console.log(`💰 Знайдено ${quantityButtons.length} кнопок кількості`);
    console.log(`💰 Елемент ціни:`, priceElement);
    console.log(`💰 Дисплей фінальної ціни:`, finalPriceDisplay);
    
    if (!priceElement || quantityButtons.length === 0) {
        console.log('❌ Не знайдено елементи для розрахунку ціни');
        return;
    }
    
    function updatePrice(quantityBtn) {
        console.log('🔴 updatePrice викликана для кнопки:', quantityBtn);
        console.log('🔴 Dataset кнопки:', quantityBtn.dataset);
        
        const quantity = parseInt(quantityBtn.dataset.quantity);
        const pricePerUnit = parseFloat(quantityBtn.dataset.pricePerUnit);
        const currency = quantityBtn.dataset.currency || 'грн';
        
        console.log(`💰 Розрахунок: ${quantity} × ${pricePerUnit} = ${quantity * pricePerUnit}`);
        console.log(`💰 Елементи: finalPriceDisplay=${!!finalPriceDisplay}, priceElement=${!!priceElement}`);
        
        if (quantity && pricePerUnit) {
            const totalPrice = (quantity * pricePerUnit).toFixed(2);
            
            // Оновлюємо фінальну ціну
            if (finalPriceDisplay) {
                console.log('💰 Оновлюємо finalPriceDisplay:', finalPriceDisplay);
                finalPriceDisplay.textContent = totalPrice;
            } else {
                console.log('💰 Оновлюємо priceElement:', priceElement);
                // Якщо немає елементу final-price, оновлюємо загальний елемент
                priceElement.innerHTML = `<span class="final-price">${totalPrice}</span> ${currency}`;
            }
            
            // Додаємо анімацію зміни ціни
            const targetElement = finalPriceDisplay || priceElement.querySelector('.final-price') || priceElement;
            if (targetElement) {
            targetElement.style.transition = 'transform 0.3s ease, color 0.3s ease';
            targetElement.style.transform = 'scale(1.1)';
            targetElement.style.color = '#4CAF50';
            
            setTimeout(() => {
                targetElement.style.transform = 'scale(1)';
                targetElement.style.color = '';
            }, 300);
            }
            
            console.log(`✅ Ціна оновлена: ${totalPrice} ${currency}`);
            
        } else {
            console.log('❌ Помилка: quantity або pricePerUnit не валідні');
            console.log('❌ quantity:', quantity, 'pricePerUnit:', pricePerUnit);
        }
    }
    
    quantityButtons.forEach((btn, index) => {
        console.log(`🔗 Додаємо слухач для кнопки ${index + 1}: "${btn.textContent.trim()}"`);
        console.log(`🔗 Дані кнопки:`, btn.dataset);
        console.log(`🔗 Кнопка знаходиться в контейнері:`, btn.closest('.quantity-buttons-container'));
        
        // Очищуємо старі слухачі
        btn.onclick = null;
        
        // Функція обробки кліку
        function handleClick(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`🖱️ КЛІК на кількість: ${this.dataset.quantity}`);
            console.log(`🖱️ Кнопка:`, this);
            console.log(`🖱️ Dataset кнопки:`, this.dataset);
            
            // Знімаємо активний клас з усіх кнопок
            quantityButtons.forEach(b => b.classList.remove('active'));
            // Додаємо активний клас до поточної кнопки
            this.classList.add('active');
            console.log('🖱️ Активний клас додано, викликаємо updatePrice...');
            
            // Оновлюємо ціну
            updatePrice(this);
            
            // Оновлюємо фото для кількості
            updateQuantityImage(this.dataset.quantity);
        }
        
        // Додаємо слухачі різними способами для надійності
        btn.addEventListener('click', handleClick);
        btn.addEventListener('mousedown', function(e) {
            console.log(`🖱️ MouseDown на кнопці: ${this.textContent.trim()}`);
        });
        
        // Перевіряємо чи кнопка доступна для кліку
        const rect = btn.getBoundingClientRect();
        console.log(`🔍 Кнопка ${index + 1} геометрія:`, {
            width: rect.width,
            height: rect.height,
            visible: rect.width > 0 && rect.height > 0,
            pointerEvents: getComputedStyle(btn).pointerEvents,
            cursor: getComputedStyle(btn).cursor
        });
    });
    
    // Встановлюємо початкову ціну для першого варіанту
    if (quantityButtons.length > 0) {
        console.log('✅ Знайдено кнопки кількості, ініціалізуємо...');
        
        // Знаходимо перший активний варіант або просто перший
        let firstActiveBtn = Array.from(quantityButtons).find(btn => btn.classList.contains('active')) || quantityButtons[0];
        
        // Видаляємо всі активні класи та встановлюємо активний тільки для першого
        quantityButtons.forEach(btn => btn.classList.remove('active'));
        firstActiveBtn.classList.add('active');
        
        // Оновлюємо ціну
        updatePrice(firstActiveBtn);
        console.log('💰 Встановлено початкову ціну для:', firstActiveBtn.dataset.quantity);
        console.log('✅ Функціональність кнопок кількості ініціалізована!');
    } else {
        console.log('❌ Кнопки кількості не знайдені!');
        console.log('🔍 Шукаємо альтернативні селектори...');
        
        // Спробуємо знайти кнопки іншим способом
        const altButtons = document.querySelectorAll('button[data-quantity]');
        console.log(`🔍 Знайдено ${altButtons.length} кнопок з data-quantity`);
        
        // Якщо немає кнопок кількості, але є ціна в HTML, залишаємо її як є
        if (finalPriceDisplay && finalPriceDisplay.textContent === '0') {
            console.log('💰 Використовуємо ціну з HTML');
        }
    }
}

// Функція для перевірки функціональності всіх кнопок
function checkButtonFunctionality() {
    console.log('🔍 Перевірка функціональності кнопок...');
    
    // Перевіряємо кольорові кружечки
    const colorDots = document.querySelectorAll('.color-dot');
    console.log(`🎨 Кольорових кружечків: ${colorDots.length}`);
    
    colorDots.forEach((dot, index) => {
        const color = dot.style.backgroundColor;
        const dataColor = dot.dataset.color;
        const dataImage = dot.dataset.image;
        
        console.log(`🎨 Кружечок ${index + 1}: колір=${color}, назва=${dataColor}, зображення=${dataImage ? 'є' : 'немає'}`);
        
        if (!color) {
            console.warn(`⚠️ Кружечок ${index + 1} не має кольору!`);
        }
    });
    
    // Перевіряємо кнопки кількості
    const quantityButtons = document.querySelectorAll('.quantity-buttons-container .quantity-btn, .quantity-btn');
    console.log(`🔢 Кнопок кількості: ${quantityButtons.length}`);
    
    quantityButtons.forEach((btn, index) => {
        const quantity = btn.dataset.quantity;
        const pricePerUnit = btn.dataset.pricePerUnit;
        const currency = btn.dataset.currency;
        
        console.log(`🔢 Кнопка ${index + 1}: кількість=${quantity}, ціна=${pricePerUnit}, валюта=${currency}`);
        
        if (!quantity || !pricePerUnit) {
            console.warn(`⚠️ Кнопка кількості ${index + 1} має неповні дані!`);
        }
    });
    
    // Перевіряємо кнопку кошика
    const cartButton = document.getElementById('cart-button');
    console.log(`🛒 Кнопка кошика: ${cartButton ? 'знайдена' : 'не знайдена'}`);
    
    // Перевіряємо кнопку B2B
    const b2bButton = document.querySelector('.b2b-button');
    console.log(`🏢 B2B кнопка: ${b2bButton ? 'знайдена' : 'не знайдена'}`);
    
    // Перевіряємо іконку кошика
    const cartIcon = document.querySelector('.cart-icon');
    console.log(`🛍️ Іконка кошика: ${cartIcon ? 'знайдена' : 'не знайдена'}`);
    
    // Перевіряємо елемент ціни
    const priceElement = document.querySelector('.final-price');
    console.log(`💰 Елемент ціни: ${priceElement ? 'знайдений' : 'не знайдений'}`);
    
    console.log('✅ Перевірка функціональності завершена');
}

// Запускаємо preload при завантаженні
preloadCriticalImages();

// Додаємо ініціалізацію розрахунку ціни після завантаження DOM
document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізуємо розрахунок ціни
    initializePriceCalculation();
    console.log('💰 Розрахунок ціни ініціалізовано!');
    
    // Додаткова ініціалізація через таймаут для гарантії
    setTimeout(function() {
        const finalPriceElement = document.querySelector('.final-price');
        const quantityButtons = document.querySelectorAll('.quantity-buttons-container .quantity-btn, .quantity-btn');
        
        if (finalPriceElement && quantityButtons.length > 0) {
            const firstBtn = quantityButtons[0];
            const quantity = parseInt(firstBtn.dataset.quantity);
            const pricePerUnit = parseFloat(firstBtn.dataset.pricePerUnit);
            
            if (quantity && pricePerUnit) {
                const totalPrice = (quantity * pricePerUnit).toFixed(2);
                finalPriceElement.textContent = totalPrice;
                console.log('💰 Відновлено початкову ціну:', totalPrice);
            }
        }
    }, 100);
});