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
        console.log('🎨 Перший активний колір:', colorName);
        updateQuantityButtonsVisibility(colorName);
    } else {
        console.log('⚠️ Не знайдено активного кольору при завантаженні');
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
    
    // Функція для зміни зображення видалена
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
        console.log('❌ Фото для кількості не знайдено, використовуємо фото за замовчуванням');
        // Якщо немає фото для кількості, використовуємо фото за замовчуванням
        const defaultImage = getDefaultImageForColor(colorName);
        if (defaultImage) {
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
            
            productImage.style.opacity = '0.7';
            setTimeout(() => {
                productImage.src = defaultImage;
                productImage.style.opacity = '1';
            }, 200);
        }
    }
}

// Функція для отримання фото для кількості та кольору
function getQuantityImageForColor(colorName, quantity) {
    console.log('🔍 Шукаємо фото для кольору:', colorName, 'кількість:', quantity);
    
    // Отримуємо дані кольору з HTML
    const colorDot = document.querySelector(`[data-color="${colorName}"]`);
    if (!colorDot) {
        console.log('❌ Колір не знайдено в DOM');
        return null;
    }
    
    // Отримуємо quantity_images для цього кольору
    const quantityImages = getColorQuantityImages(colorName);
    console.log('📸 Quantity images для кольору', colorName, ':', quantityImages);
    
    // Шукаємо фото для конкретної кількості
    if (quantityImages && quantityImages[quantity]) {
        console.log('✅ Знайдено фото для кількості', quantity, ':', quantityImages[quantity]);
        return quantityImages[quantity];
    }
    
    // Якщо немає фото для цієї кількості, повертаємо фото за замовчуванням
    console.log('⚠️ Фото для кількості', quantity, 'не знайдено, використовуємо фото за замовчуванням');
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
    // Отримуємо дані з HTML data-атрибута
    const colorDot = document.querySelector(`[data-color="${colorName}"]`);
    if (colorDot && colorDot.dataset.quantityImages) {
        try {
            const quantityImages = JSON.parse(colorDot.dataset.quantityImages);
            console.log('📸 Отримано quantity_images для кольору', colorName, ':', quantityImages);
            return quantityImages;
        } catch (e) {
            console.error('❌ Помилка парсингу quantity_images:', e);
            return {};
        }
    }
    return {};
}

// Функція для отримання статусів кількостей для кольору
function getColorQuantityStatuses(colorName) {
    const colorDot = document.querySelector(`[data-color="${colorName}"]`);
    console.log('🔍 Шукаємо статуси для кольору:', colorName);
    console.log('   └─ colorDot знайдено:', !!colorDot);
    
    if (colorDot) {
        console.log('   └─ data-quantity-statuses:', colorDot.dataset.quantityStatuses);
        
        if (colorDot.dataset.quantityStatuses) {
            try {
                const statuses = JSON.parse(colorDot.dataset.quantityStatuses);
                console.log('📊 ✅ Розпарсено quantity_statuses:', statuses);
                return statuses;
            } catch (e) {
                console.error('❌ Помилка парсингу quantity_statuses:', e);
                console.error('   └─ Сирі дані:', colorDot.dataset.quantityStatuses);
                return {};
            }
        } else {
            console.log('⚠️ quantity_statuses порожній або відсутній');
        }
    } else {
        console.log('❌ colorDot не знайдено');
    }
    return {};
}

// Функція для оновлення видимості кнопок кількостей на основі наявності фото та складу
function updateQuantityButtonsVisibility(colorName) {
    console.log('🔍 Оновлюємо видимість кнопок кількостей для кольору:', colorName);
    
    // Отримуємо фото для цього кольору
    const quantityImages = getColorQuantityImages(colorName);
    console.log('📸 Доступні фото для кольору:', quantityImages);
    
    // Отримуємо статуси для цього кольору
    const quantityStatuses = getColorQuantityStatuses(colorName);
    console.log('📊 Статуси кількостей для кольору:', quantityStatuses);
    
    // Отримуємо всі кнопки кількостей
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    console.log('🔘 Знайдено кнопок кількостей:', quantityButtons.length);
    
    quantityButtons.forEach(button => {
        const quantity = parseInt(button.dataset.quantity);
        const imageUrl = quantityImages && quantityImages[quantity] ? quantityImages[quantity] : '';
        const hasImage = imageUrl && imageUrl.trim() !== '' && imageUrl !== 'null' && imageUrl !== 'undefined';
        
        // Перевіряємо статус конкретної кількості для цього кольору
        const qtyStatusRaw = quantityStatuses ? quantityStatuses[quantity] : null;
        const qtyStatus = qtyStatusRaw || { is_active: true, in_stock: true };
        const isActive = qtyStatus.is_active !== false;
        const hasStock = qtyStatus.in_stock !== false;
        
        // Скорочене логування
        console.log(`🔍 Кількість ${quantity}: active=${isActive}, stock=${hasStock}, photo=${hasImage ? 'є' : 'немає'}`);
        
        // Спрощена логіка - як для кольорів
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
                console.log('✅ Доступна:', quantity);
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
    
    console.log(`📊 Всього видимих кнопок після фільтрації: ${visibleButtons.length}`);
    
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
        
        console.log(`🎯 Оновлено ${visibleButtons.length} кнопок: padding=${buttonPadding}, gap=${containerGap}`);
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
        
        console.log(`📊 Доступних кнопок (без out-of-stock): ${availableButtons.length} з ${visibleButtons.length}`);
        
        let selectedButton;
        
        if (availableButtons.length > 0) {
            // Обираємо НАЙМЕНШУ доступну кількість
            const sortedButtons = availableButtons.sort((a, b) => {
                const qtyA = parseInt(a.dataset.quantity || 0);
                const qtyB = parseInt(b.dataset.quantity || 0);
                return qtyA - qtyB; // Сортуємо за ЗРОСТАННЯМ кількості
            });
            
            selectedButton = sortedButtons[0];
            console.log('✅ Обрано найменшу ДОСТУПНУ кількість:', selectedButton.dataset.quantity);
            
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
            console.log('🔄 Активовано кнопку:', selectedButton.dataset.quantity);
            
            // Оновлюємо фото для цієї кількості
            updateQuantityImage(selectedButton.dataset.quantity);
            
            // Оновлюємо ціну для нової активної кнопки
            updatePrice(selectedButton);
        }
    }
}

// Функція для відображення фото всіх кількостей для кольору
function showQuantityImages(colorName) {
    console.log('🖼️ Показуємо фото для кольору:', colorName);
    
    const container = document.getElementById('quantitiesContainer');
    const grid = document.getElementById('quantityImagesGrid');
    
    if (!container || !grid) {
        // Контейнер не існує в поточному дизайні - це нормально
        return;
    }
    
    // Очищуємо попередні фото
    grid.innerHTML = '';
    
    // Отримуємо quantity_images для цього кольору
    const quantityImages = getColorQuantityImages(colorName);
    console.log('📸 Quantity images для відображення:', quantityImages);
    
    if (!quantityImages || Object.keys(quantityImages).length === 0) {
        console.log('❌ Немає фото для кольору', colorName);
        container.style.display = 'none';
        return;
    }
    
    // Показуємо контейнер
    container.style.display = 'block';
    
    // Додаємо фото для кожної кількості
    Object.keys(quantityImages).forEach(quantity => {
        const imageUrl = quantityImages[quantity];
        console.log('🖼️ Додаємо фото для кількості', quantity, ':', imageUrl);
        
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
    
    console.log('✅ Фото кількостей відображено для кольору', colorName);
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
    
    // Отримуємо назву кольору з data-атрибута
    const colorName = element.dataset.color;
    console.log('🎨 Назва кольору:', colorName);
    
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
    
    // Оновлюємо видимість кнопок кількостей на основі наявності фото
    // (це також оновить ціну для нової активної кнопки)
    updateQuantityButtonsVisibility(colorName);
            
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
        
        const totalPrice = pricePerUnit * quantity;
        // Оновлюємо тільки ціну, без валюти (валюта вже є в HTML) - тільки цілі числа
        priceElement.textContent = Math.round(totalPrice);
    }
}

// Ініціалізуємо нові функції
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Ініціалізація всіх функцій...');
    
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
        console.log('🎨 Ініціалізація для першого кольору:', colorName);
        
        // Показуємо фото для всіх кількостей першого кольору
        showQuantityImages(colorName);
        
        // Оновлюємо видимість кнопок (це також встановить активну кнопку)
        updateQuantityButtonsVisibility(colorName);
        
        // Встановлюємо фото для поточної активної кількості (після оновлення видимості)
        setTimeout(() => {
            const activeQuantity = document.querySelector('.quantity-btn.active');
            if (activeQuantity) {
                console.log('🖼️ Встановлюємо фото для активної кількості:', activeQuantity.dataset.quantity);
                updateQuantityImage(activeQuantity.dataset.quantity);
            } else {
                console.log('⚠️ Немає активної кнопки після ініціалізації');
            }
        }, 100);
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

// Обробник зміни розміру вікна для адаптації кнопок кількості
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        const activeColor = document.querySelector('.color-dot.active');
        if (activeColor) {
            const colorName = activeColor.dataset.color;
            console.log('🔄 Зміна розміру екрану, оновлюємо кнопки для:', colorName);
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
            const totalPrice = Math.round(quantity * pricePerUnit);
            
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
        
        // Фільтруємо тільки ВИДИМІ кнопки (не приховані через is_active=false)
        const visibleButtons = Array.from(quantityButtons).filter(btn => {
            const computedStyle = window.getComputedStyle(btn);
            return computedStyle.display !== 'none';
        });
        
        console.log(`💰 Видимих кнопок: ${visibleButtons.length} з ${quantityButtons.length}`);
        
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
        console.log('💰 Встановлено початкову ціну для:', defaultBtn.dataset.quantity);
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
                const totalPrice = Math.round(quantity * pricePerUnit);
                finalPriceElement.textContent = totalPrice;
                console.log('💰 Відновлено початкову ціну:', totalPrice);
            }
        }
    }, 100);
});