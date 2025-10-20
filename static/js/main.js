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
    
    // Прогрес-бар тепер не реагує на прокрутку сторінки
    // Він оновлюється тільки при зміні суми товарів в кошику
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
    
    // Оновлюємо видимість кнопок кількостей для першого активного кольору
    const firstActiveColor = document.querySelector('.color-dot.active');
    if (firstActiveColor) {
        const colorName = firstActiveColor.dataset.color;
        updateQuantityButtonsVisibility(colorName);
    } else {
        console.log('⚠️ ПОМИЛКА: Не знайдено активного кольору при завантаженні');
        // Приховуємо всі кнопки якщо немає активного кольору
        const quantityButtons = document.querySelectorAll('.quantity-btn');
        quantityButtons.forEach(button => {
            button.style.display = 'none';
            button.disabled = true;
            button.classList.add('hidden');
        });
    }
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


// Функція для каруселі товару (ЗАСТАРІЛА - тепер використовується система шарів)
function initializeProductCarousel() {
    const colorDots = document.querySelectorAll('.color-dot');
    if (colorDots.length > 0) {
        colorDots[0].classList.add('active');
    }
}



// ===== ФУНКЦІЇ КОШИКА ПЕРЕНЕСЕНІ В home.js =====
// Основні функції кошика тепер знаходяться в home.js для головної сторінки
// та в cart.js для сторінки кошика

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
    const packagingLayer = document.querySelector('.packaging-layer');
    const flowersLayer = document.querySelector('.flowers-layer');
    const colorMask = document.querySelector('.color-mask');
    
    if (!colorData) {
        console.log('❌ ПОМИЛКА: Немає даних кольору');
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
    }
    
    // 2. Середній шар: кольорова маска з ефектом multiply
    if (colorMask) {
        if (colorData.mask_image) {
            colorMask.style.backgroundImage = `url(${colorData.mask_image})`;
        }
        colorMask.style.backgroundColor = colorData.hex_code;
        colorMask.classList.add('active');
    }
    
    // 3. Верхній шар: зображення квітів
    if (flowersLayer) {
        if (colorData.flowers_image) {
            flowersLayer.style.backgroundImage = `url(${colorData.flowers_image})`;
            flowersLayer.classList.add('active');
            
            // Zoom застосовується через transform: scale() в updateQuantityImage()
            
        } else {
            flowersLayer.classList.remove('active');
        }
    }
    
    // 4. Основне зображення видалено - використовуємо тільки фото для кількості
    
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
    const activeColor = document.querySelector('.color-dot.active');
    if (!activeColor) {
        console.log('❌ ПОМИЛКА: Немає активного кольору');
        return;
    }
    
    const colorName = activeColor.dataset.color;
    const quantityImage = getQuantityImageForColor(colorName, quantity);
    
    if (quantityImage) {
        // Створюємо або оновлюємо <img> елемент
        let productImage = document.getElementById('product-image');
        if (!productImage) {
            productImage = document.createElement('img');
            productImage.id = 'product-image';
            productImage.className = 'product-image';
            productImage.alt = 'Товар';
            productImage.loading = 'lazy';
            
            const imageGallery = document.querySelector('.image-gallery');
            if (imageGallery) {
                imageGallery.appendChild(productImage);
            }
        }
        
        // Оновлюємо зображення
        productImage.src = quantityImage;
        productImage.style.display = 'block';
        
        // Застосовуємо zoom через transform: scale()
        const zoom = getZoomForQuantity(colorName, quantity);
        const scale = zoom ? zoom / 100 : 1;
        
        // Використовуємо scale() для всіх пристроїв
        productImage.style.transform = `translate3d(0, 0, 0) scale(${scale})`;
        productImage.style.transformOrigin = 'center center';
    } else {
        console.log('❌ ПОМИЛКА: Немає фото для кількості');
    }
}

// Функція для отримання фото для кількості та кольору
function getQuantityImageForColor(colorName, quantity) {
    const colorDot = document.querySelector(`[data-color="${colorName}"]`);
    if (!colorDot) {
        console.log('❌ ПОМИЛКА: Колір не знайдено в DOM');
        return null;
    }
    
    const quantityImages = getColorQuantityImages(colorName);
    
    if (quantityImages && quantityImages[quantity]) {
        return quantityImages[quantity];
    }
    
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
    const colorDot = document.querySelector(`[data-color="${colorName}"]`);
    if (colorDot && colorDot.dataset.quantityImages) {
        try {
            return JSON.parse(colorDot.dataset.quantityImages);
        } catch (e) {
            console.error('❌ ПОМИЛКА парсингу quantity_images:', e);
            return {};
        }
    }
    return {};
}

// Функція для отримання статусів кількостей для кольору
function getColorQuantityStatuses(colorName) {
    const colorDot = document.querySelector(`[data-color="${colorName}"]`);
    
    if (colorDot && colorDot.dataset.quantityStatuses) {
        try {
            return JSON.parse(colorDot.dataset.quantityStatuses);
        } catch (e) {
            console.error('❌ ПОМИЛКА парсингу quantity_statuses:', e);
            return {};
        }
    }
    return {};
}

// Функція для оновлення видимості кнопок кількостей на основі наявності фото та складу
function updateQuantityButtonsVisibility(colorName) {
    const quantityImages = getColorQuantityImages(colorName);
    const quantityStatuses = getColorQuantityStatuses(colorName);
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    
    quantityButtons.forEach(button => {
        const quantity = parseInt(button.dataset.quantity);
        const imageUrl = quantityImages && quantityImages[quantity] ? quantityImages[quantity] : '';
        const hasImage = imageUrl && imageUrl.trim() !== '' && imageUrl !== 'null' && imageUrl !== 'undefined';
        
        // Перевіряємо статус конкретної кількості для цього кольору
        const qtyStatusRaw = quantityStatuses ? quantityStatuses[quantity] : null;
        const qtyStatus = qtyStatusRaw || { is_active: true, in_stock: true };
        const isActive = qtyStatus.is_active !== false;
        const hasStock = qtyStatus.in_stock !== false;
        if (hasImage) {
            // Показуємо кнопку якщо є фото
            button.style.display = 'inline-block';
            button.style.visibility = 'visible';
            button.classList.remove('hidden');
            
            // Перевіряємо наявність - спочатку перевіряємо per-quantity статус
            if (!isActive) {
                // Якщо неактивна для цього кольору - ХОВАЄМО (не видаляємо!)
                button.style.setProperty('display', 'none', 'important');
                button.disabled = true;
                button.classList.add('hidden');
                console.log('❌ Кількість неактивна (приховано):', quantity);
            } else if (!hasStock) {
                // Якщо немає в наявності - показуємо з червоною лінією, але НЕ блокуємо клік
                button.classList.add('out-of-stock');
                // НЕ встановлюємо disabled - дозволяємо клік для перегляду фото
                button.title = `${quantity} шт - Немає в наявності (можна переглянути)`;
                console.log('⚠️ Без наявності (можна клікати):', quantity);
            } else {
                // Повністю доступна
                button.classList.remove('out-of-stock');
                button.disabled = false;
                button.title = '';
            }
        } else {
            // ХОВАЄМО якщо немає фото (не видаляємо!)
            button.style.setProperty('display', 'none', 'important');
            button.disabled = true;
            button.classList.add('hidden');
            console.log('❌ Немає фото (приховано):', quantity);
        }
    });
    
    // Перевіряємо чи є хоча б одна активна кнопка
    const visibleButtons = Array.from(quantityButtons).filter(btn => {
        const display = window.getComputedStyle(btn).display;
        return display !== 'none';
    });
    
    // ДИНАМІЧНО ОНОВЛЮЄМО РОЗМІРИ КНОПОК та КОНТЕЙНЕРА
    const container = document.querySelector('.quantity-buttons-container');
    if (container) {
        // Видаляємо старі класи
        container.classList.remove('single-btn', 'two-btns', 'three-btns', 'four-btns', 'five-btns');
        
        // Визначаємо розміри на основі кількості кнопок та ширини екрану
        let buttonPadding, buttonFontSize, buttonMinWidth, containerGap;
        const isMobile = window.innerWidth <= 768;
        
        if (visibleButtons.length === 1) {
            container.classList.add('single-btn');
            buttonPadding = isMobile ? '12px 20px' : '14px 24px';
            buttonFontSize = isMobile ? '1rem' : '1.1rem';
            buttonMinWidth = isMobile ? '70px' : '80px';
            containerGap = '0';
        } else if (visibleButtons.length === 2) {
            container.classList.add('two-btns');
            buttonPadding = isMobile ? '10px 16px' : '12px 20px';
            buttonFontSize = isMobile ? '0.95rem' : '1rem';
            buttonMinWidth = isMobile ? '60px' : '70px';
            containerGap = isMobile ? '12px' : '16px';
        } else if (visibleButtons.length === 3) {
            container.classList.add('three-btns');
            buttonPadding = isMobile ? '9px 14px' : '10px 16px';
            buttonFontSize = isMobile ? '0.9rem' : '0.95rem';
            buttonMinWidth = isMobile ? '52px' : '60px';
            containerGap = isMobile ? '10px' : '12px';
        } else if (visibleButtons.length === 4) {
            container.classList.add('four-btns');
            buttonPadding = isMobile ? '8px 12px' : '10px 14px';
            buttonFontSize = isMobile ? '0.85rem' : '0.9rem';
            buttonMinWidth = isMobile ? '48px' : '55px';
            containerGap = isMobile ? '8px' : '10px';
        } else if (visibleButtons.length >= 5) {
            container.classList.add('five-btns');
            buttonPadding = isMobile ? '7px 10px' : '8px 12px';
            buttonFontSize = isMobile ? '0.8rem' : '0.85rem';
            buttonMinWidth = isMobile ? '44px' : '50px';
            containerGap = isMobile ? '6px' : '8px';
        }
        
        // Застосовуємо стилі до контейнера з !important
        container.style.setProperty('gap', containerGap, 'important');
        container.style.setProperty('justify-content', 'center', 'important');
        container.style.setProperty('display', 'flex', 'important');
        container.style.setProperty('flex-direction', 'row', 'important');
        container.style.setProperty('align-items', 'center', 'important');
        container.style.setProperty('flex-wrap', 'wrap', 'important');
        container.style.setProperty('width', '100%', 'important');
        container.style.setProperty('box-sizing', 'border-box', 'important');
        
        // Застосовуємо стилі до ВИДИМИХ кнопок
        visibleButtons.forEach(button => {
            button.style.setProperty('padding', buttonPadding, 'important');
            button.style.setProperty('font-size', buttonFontSize, 'important');
            button.style.setProperty('min-width', buttonMinWidth, 'important');
        });
        
    }
    
    if (visibleButtons.length === 0) {
        console.log('⚠️ Немає доступних кількостей для цього кольору');
        // Блокуємо кнопку "Додати в кошик"
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.disabled = true;
            addToCartBtn.style.opacity = '0.5';
            addToCartBtn.style.cursor = 'not-allowed';
            console.log('🚫 Кнопку кошика заблоковано - немає доступних кількостей');
        }
    } else {
        // Фільтруємо тільки ДОСТУПНІ кнопки (БЕЗ out-of-stock класу)
        const availableButtons = visibleButtons.filter(btn => !btn.classList.contains('out-of-stock'));
        
        let selectedButton;
        
        if (availableButtons.length > 0) {
            // Обираємо НАЙМЕНШУ доступну кількість
            const sortedButtons = availableButtons.sort((a, b) => {
                const qtyA = parseInt(a.dataset.quantity || 0);
                const qtyB = parseInt(b.dataset.quantity || 0);
                return qtyA - qtyB; // Сортуємо за ЗРОСТАННЯМ кількості
            });
            
            selectedButton = sortedButtons[0];
            
            // Розблоковуємо кнопку "Додати в кошик"
            const addToCartBtn = document.querySelector('.add-to-cart-btn');
            if (addToCartBtn) {
                addToCartBtn.disabled = false;
                addToCartBtn.style.opacity = '1';
                addToCartBtn.style.cursor = 'pointer';
            }
        } else {
            // Немає доступних - обираємо будь-яку видиму (з out-of-stock)
            selectedButton = visibleButtons[0];
            console.log('⚠️ Всі кількості без наявності, обрано:', selectedButton.dataset.quantity);
            
            // Блокуємо кнопку "Додати в кошик"
            const addToCartBtn = document.querySelector('.add-to-cart-btn');
            if (addToCartBtn) {
                addToCartBtn.disabled = true;
                addToCartBtn.style.opacity = '0.5';
                addToCartBtn.style.cursor = 'not-allowed';
                console.log('🚫 Кнопку кошика заблоковано - немає наявних кількостей');
            }
        }
        
        // Видаляємо активний клас з усіх кнопок
        quantityButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Додаємо активний клас до обраної кнопки
        if (selectedButton) {
            selectedButton.classList.add('active');
            
            // Оновлюємо фото для цієї кількості
            updateQuantityImage(selectedButton.dataset.quantity);
            
            // Оновлюємо ціну для нової активної кнопки
            updatePrice(selectedButton);
        }
    }
}

// Функція для відображення фото всіх кількостей для кольору
function showQuantityImages(colorName) {
    const container = document.getElementById('quantitiesContainer');
    const grid = document.getElementById('quantityImagesGrid');
    
    if (!container || !grid) {
        return;
    }
    
    grid.innerHTML = '';
    const quantityImages = getColorQuantityImages(colorName);
    
    if (!quantityImages || Object.keys(quantityImages).length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    
    Object.keys(quantityImages).forEach(quantity => {
        const imageUrl = quantityImages[quantity];
        if (imageUrl) {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'quantity-image-item';
            imageDiv.innerHTML = `
                <div class="quantity-image-wrapper">
                    <img src="${imageUrl}" alt="Кількість ${quantity}" class="quantity-image" loading="lazy">
                    <div class="quantity-label">${quantity} шт</div>
                </div>
            `;
            grid.appendChild(imageDiv);
        }
    });
}

// Функція для отримання zoom для конкретної кількості кольору
function getZoomForQuantity(colorName, quantity) {
    if (!window.stockData || !window.stockData.colors) {
        console.log('❌ ПОМИЛКА: Немає window.stockData');
        return null;
    }
    
    const colorData = window.stockData.colors[colorName?.toLowerCase()];
    
    if (!colorData) {
        console.log('❌ ПОМИЛКА: Немає даних для кольору', colorName);
        return null;
    }
    
    // Вибираємо правильний zoom залежно від розміру екрану
    const isMobile = window.innerWidth <= 768;
    const zoomData = isMobile ? colorData.quantityZoomMobile : colorData.quantityZoomDesktop;
    
    if (!zoomData) {
        console.log(`⚠️ Немає zoom даних для ${isMobile ? 'mobile' : 'desktop'}`);
        return null;
    }
    
    const zoom = zoomData[quantity.toString()];
    
    if (!zoom) {
        console.log(`⚠️ Zoom не налаштовано для ${colorName} кількість ${quantity} (${isMobile ? 'mobile' : 'desktop'})`);
    }
    
    return zoom;
}

// Функція для зміни кількості з збереженням кольору  
function changeQuantityWithLayers(quantityData) {
    if (!quantityData) return;
    
    currentProductState.selectedQuantity = quantityData;
    
    // Повторно застосовуємо поточний колір до нового зображення
    if (currentProductState.selectedColor) {
        setTimeout(() => {
            changeColorWithMask(currentProductState.selectedColor);
        }, 300);
    }
}

// Функція для вибору кольору (викликається з HTML)
function selectColor(element, hexCode, flowersImage, maskImage, packagingTexture) {
    const colorName = element.dataset.color;
    
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
        packaging_texture: packagingTexture || null,
        name: colorName
    };
    
    // Застосовуємо зміну кольору з повною системою шарів
    changeColorWithMask(colorData);
    
    // Оновлюємо видимість кнопок кількостей на основі наявності фото
    updateQuantityButtonsVisibility(colorName);
    
    // Показуємо фото для всіх кількостей цього кольору
    showQuantityImages(colorName);
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
        
        const totalPrice = pricePerUnit * quantity;
        // Оновлюємо тільки ціну, без валюти (валюта вже є в HTML) - тільки цілі числа
        priceElement.textContent = Math.round(totalPrice);
    }
}

// Ініціалізуємо нові функції
document.addEventListener('DOMContentLoaded', () => {
    
    // Ініціалізуємо основні функції
    initializeB2BButton();
    initializeProductCarousel();
    initializeProgressBar();
    initializePriceCalculation();
    
    // Ініціалізуємо прогрес бари
    updateProgressBars();
    
    // Додаткова ініціалізація для першого зображення
    const firstDot = document.querySelector('.color-dot.active');
    if (firstDot) {
        const colorName = firstDot.dataset.color;
        
        // 🔥 ПОЧАТКОВЕ ВІДОБРАЖЕННЯ: Встановлюємо фото першої кількості
        setTimeout(() => {
            const firstQuantity = document.querySelector('.quantity-btn.active, .quantity-btn:not([style*="display: none"])');
            if (firstQuantity) {
                const qty = parseInt(firstQuantity.dataset.quantity);
                updateQuantityImage(qty);
            }
        }, 200);
        
        // Показуємо фото для всіх кількостей першого кольору
        showQuantityImages(colorName);
        
        // Застосовуємо zoom для першої активної кнопки кількості (працює на ВСІХ пристроях)
        setTimeout(() => {
            const firstQuantityBtn = document.querySelector('.quantity-btn.active, .quantity-btn:not([style*="display: none"])');
            
            if (firstQuantityBtn) {
                const quantity = parseInt(firstQuantityBtn.dataset.quantity);
                console.log(`📊 Кількість з кнопки: ${quantity}`);
                
                const zoom = getZoomForQuantity(colorName, quantity);
                // Zoom застосовується автоматично в updateQuantityImage()
            } else {
                console.log('⚠️ ПОМИЛКА: Активна кнопка кількості не знайдена');
            }
        }, 500);
        
        // Оновлюємо видимість кнопок (це також встановить активну кнопку)
        updateQuantityButtonsVisibility(colorName);
        
        // Встановлюємо фото для поточної активної кількості (після оновлення видимості)
        setTimeout(() => {
            const activeQuantity = document.querySelector('.quantity-btn.active');
            if (activeQuantity) {
                updateQuantityImage(activeQuantity.dataset.quantity);
                
                // НЕ застосовуємо колір тут - updateQuantityImage вже встановить фото на .flowers-layer
            } else {
                console.log('⚠️ Немає активної кнопки після ініціалізації');
            }
        }, 600);
    }
    
    // Перевіряємо наявність всіх важливих елементів
    
    // Забезпечуємо запуск сторінки з самого верху
    window.scrollTo(0, 0);
    
});

// Додатково скидаємо скрол при завантаженні сторінки
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

// Обробник зміни розміру вікна для адаптації кнопок кількості
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        const activeColor = document.querySelector('.color-dot.active');
        if (activeColor) {
            const colorName = activeColor.dataset.color;
            updateQuantityButtonsVisibility(colorName);
        }
    }, 250); // Debounce 250ms
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

// Функція для оновлення прогрес-бару (тільки на основі суми товарів)
function updateProgressBar() {
    // Прогрес-бар тепер оновлюється тільки на основі суми товарів в кошику
    // Викликається з updateProgressBars() при зміні кошика
}

// Прогрес-бар більше не реагує на прокрутку сторінки
// Він оновлюється тільки при зміні суми товарів в кошику


// Функція розрахунку ціни залежно від кількості (нова логіка)
function initializePriceCalculation() {
    const quantityButtons = document.querySelectorAll('.quantity-buttons-container .quantity-btn, .quantity-btn');
    const priceElement = document.querySelector('.current-price, .product-price');
    const finalPriceDisplay = document.querySelector('.final-price');
    
    if (!priceElement || quantityButtons.length === 0) {
        console.log('❌ ПОМИЛКА: Не знайдено елементи для розрахунку ціни');
        return;
    }
    
    function updatePrice(quantityBtn) {
        
        const quantity = parseInt(quantityBtn.dataset.quantity);
        const pricePerUnit = parseFloat(quantityBtn.dataset.pricePerUnit);
        const currency = quantityBtn.dataset.currency || 'грн';
        
        
            if (quantity && pricePerUnit) {
                const totalPrice = Math.round(quantity * pricePerUnit);
                
                // Оновлюємо фінальну ціну
                if (finalPriceDisplay) {
                    finalPriceDisplay.textContent = totalPrice;
                } else {
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
            } else {
                console.log('❌ ПОМИЛКА: quantity або pricePerUnit не валідні');
            }
    }
    
    quantityButtons.forEach((btn, index) => {
        // Очищуємо старі слухачі
        btn.onclick = null;
        
        // Функція обробки кліку
        function handleClick(e) {
            // Перевіряємо чи кнопка прихована (is_active=false)
            const computedStyle = window.getComputedStyle(this);
            if (computedStyle.display === 'none') {
                console.log(`🚫 Клік на приховану кнопку ${this.dataset.quantity} ігнорується`);
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            
            // Перевіряємо чи кнопка disabled (in_stock=false)
            if (this.disabled) {
                console.log(`🚫 Клік на неактивну кнопку ${this.dataset.quantity} ігнорується`);
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            // Знімаємо активний клас з усіх кнопок
            quantityButtons.forEach(b => b.classList.remove('active'));
            // Додаємо активний клас до поточної кнопки
            this.classList.add('active');
            
            // Оновлюємо ціну
            updatePrice(this);
            
            // Оновлюємо фото для кількості
            updateQuantityImage(this.dataset.quantity);
            
            // Zoom вже застосовується в updateQuantityImage()
        }
        
        // Додаємо слухачі
        btn.addEventListener('click', handleClick);
    });
    
    // Встановлюємо початкову ціну для першого варіанту
    if (quantityButtons.length > 0) {
        
        // Фільтруємо тільки ВИДИМІ кнопки (не приховані через is_active=false)
        const visibleButtons = Array.from(quantityButtons).filter(btn => {
            const computedStyle = window.getComputedStyle(btn);
            return computedStyle.display !== 'none';
        });
        
        
        if (visibleButtons.length === 0) {
            console.log('⚠️ Немає видимих кнопок кількості');
            return;
        }
        
        // Знаходимо найдорожчий варіант серед ВИДИМИХ кнопок
        const sortedButtons = visibleButtons.sort((a, b) => {
            const priceA = parseFloat(a.dataset.pricePerUnit || 0);
            const priceB = parseFloat(b.dataset.pricePerUnit || 0);
            return priceB - priceA; // Сортуємо за спаданням ціни
        });
        
        let defaultBtn = sortedButtons[0];
        
        // Видаляємо всі активні класи та встановлюємо активний тільки для найдорожчого
        quantityButtons.forEach(btn => btn.classList.remove('active'));
        defaultBtn.classList.add('active');
        
        // Оновлюємо ціну
        updatePrice(defaultBtn);
    } else {
        console.log('❌ ПОМИЛКА: Кнопки кількості не знайдені!');
        
    }
}


// Додаємо ініціалізацію розрахунку ціни після завантаження DOM
document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізуємо розрахунок ціни
    initializePriceCalculation();
    
    // Додаткова ініціалізація через таймаут для гарантії
    setTimeout(function() {
        const finalPriceElement = document.querySelector('.final-price');
        const quantityButtons = document.querySelectorAll('.quantity-buttons-container .quantity-btn, .quantity-btn');
        
        if (finalPriceElement && quantityButtons.length > 0) {
            const firstBtn = quantityButtons[0];
            const quantity = parseInt(firstBtn.dataset.quantity);
            const pricePerUnit = parseFloat(firstBtn.dataset.pricePerUnit);
            
            if (quantity && pricePerUnit) {
                const totalPrice = Math.round(quantity * pricePerUnit);
                finalPriceElement.textContent = totalPrice;
                console.log('💰 Відновлено початкову ціну:', totalPrice);
            }
        }
    }, 100);
});