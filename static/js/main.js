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

// Функція для оновлення видимості кнопок кількостей на основі наявності фото та складу
function updateQuantityButtonsVisibility(colorName) {
    console.log('🔍 Оновлюємо видимість кнопок кількостей для кольору:', colorName);
    
    // Отримуємо фото для цього кольору
    const quantityImages = getColorQuantityImages(colorName);
    console.log('📸 Доступні фото для кольору:', quantityImages);
    
    // Отримуємо дані про склад для цього кольору
    const stockData = window.stockData?.colors?.[colorName.toLowerCase()];
    const availableQuantities = stockData?.availableQuantities || [];
    console.log('📦 Доступні кількості на складі:', availableQuantities);
    
    // Отримуємо всі кнопки кількостей
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    console.log('🔘 Знайдено кнопок кількостей:', quantityButtons.length);
    
    quantityButtons.forEach(button => {
        const quantity = parseInt(button.dataset.quantity);
        const imageUrl = quantityImages && quantityImages[quantity] ? quantityImages[quantity] : '';
        const hasImage = imageUrl && imageUrl.trim() !== '' && imageUrl !== 'null' && imageUrl !== 'undefined';
        
        // Перевіряємо наявність на складі
        const stockInfo = availableQuantities.find(q => q.quantity === quantity);
        const stockAvailable = stockInfo?.stock_available || 0;
        const hasStock = stockAvailable > 0;
        
        console.log(`🔍 Кількість ${quantity}:`, {
            hasImage,
            hasStock,
            stockAvailable,
            imageUrl: imageUrl,
            buttonElement: button,
            rawQuantityImages: quantityImages,
            stockInfo: stockInfo
        });
        
        if (hasImage && hasStock) {
            // Показуємо кнопку якщо є фото та наявність на складі
            button.style.display = 'inline-block';
            button.disabled = false;
            button.classList.remove('hidden', 'out-of-stock', 'low-stock');
            button.style.visibility = 'visible';
            button.title = ''; // Прибираємо tooltip з інформацією про склад
            
            console.log('✅ Показуємо кнопку для кількості:', quantity, 'з фото:', imageUrl, 'та наявністю:', stockAvailable);
        } else {
            // Приховуємо кнопку якщо немає фото або наявності
            button.style.display = 'none';
            button.disabled = true;
            button.classList.add('hidden');
            button.style.visibility = 'hidden';
            
            if (!hasImage) {
                console.log('❌ Приховуємо кнопку для кількості:', quantity, '(немає фото або порожній URL)');
            } else if (!hasStock) {
                console.log('❌ Приховуємо кнопку для кількості:', quantity, '(немає на складі)');
            }
        }
    });
    
    // Перевіряємо чи є хоча б одна активна кнопка
    const visibleButtons = Array.from(quantityButtons).filter(btn => btn.style.display !== 'none');
    if (visibleButtons.length === 0) {
        console.log('⚠️ Немає доступних кількостей для цього кольору');
        // Можна додати повідомлення користувачу
    } else {
        // Знаходимо кнопку з найбільшою ціною за одиницю
        const sortedButtons = visibleButtons.sort((a, b) => {
            const priceA = parseFloat(a.dataset.pricePerUnit || 0);
            const priceB = parseFloat(b.dataset.pricePerUnit || 0);
            return priceB - priceA; // Сортуємо за спаданням ціни
        });
        
        const mostExpensiveButton = sortedButtons[0];
        
        // Видаляємо активний клас з усіх кнопок
        quantityButtons.forEach(btn => btn.classList.remove('active'));
        
        // Додаємо активний клас до кнопки з найбільшою ціною
        if (mostExpensiveButton) {
            mostExpensiveButton.classList.add('active');
            console.log('🔄 Активуємо кнопку з найбільшою ціною:', mostExpensiveButton.dataset.quantity, 'грн за одиницю');
            
            // Оновлюємо фото для цієї кількості
            updateQuantityImage(mostExpensiveButton.dataset.quantity);
            
            // Оновлюємо ціну для нової активної кнопки
            updatePrice(mostExpensiveButton);
        }
    }
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
        
        // Встановлюємо фото для поточної кількості
        const activeQuantity = document.querySelector('.quantity-btn.active');
        if (activeQuantity) {
            updateQuantityImage(activeQuantity.dataset.quantity);
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
        
        // Знаходимо найдорожчий варіант за замовчуванням
        const sortedButtons = Array.from(quantityButtons).sort((a, b) => {
            const priceA = parseFloat(a.dataset.pricePerUnit || 0);
            const priceB = parseFloat(b.dataset.pricePerUnit || 0);
            return priceB - priceA; // Сортуємо за спаданням ціни
        });
        
        let defaultBtn = sortedButtons[0] || quantityButtons[0];
        
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