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

// Функція для обробки кошика
function initializeCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = 0;
    
    if (cartIcon && cartCount) {
        cartIcon.addEventListener('click', function() {
            openCart();
        });
        
        // Функція для додавання товарів в кошик (для демонстрації)
        window.addToCart = function() {
            cartItems++;
            cartCount.textContent = cartItems;
            cartCount.style.display = cartItems > 0 ? 'flex' : 'none';
        };
        
        // Функція для очищення кошика
        window.clearCart = function() {
            cartItems = 0;
            cartCount.textContent = '0';
            cartCount.style.display = 'none';
        };
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

// Глобальна змінна для відстеження стану товару в кошику
let productInCart = false;

// Глобальна змінна для відстеження стану додаткових товарів в кошику
let additionalProductsInCart = {
    1: false,
    2: false,
    3: false
};

// Функція для додавання товару в кошик
function initializeProductCart() {
    // Функція перемикання стану товару в кошику
    window.toggleCart = function() {
        const cartButton = document.getElementById('cart-button');
        const cartCount = document.querySelector('.cart-count');
        
        if (!productInCart) {
            // Додаємо товар в кошик
            productInCart = true;
            
            // Оновлюємо кнопку
            cartButton.textContent = 'Прибрати';
            cartButton.classList.add('in-cart');
            
            // Оновлюємо лічильник кошика
            if (cartCount) {
                let currentCount = parseInt(cartCount.textContent) || 0;
                currentCount++;
                cartCount.textContent = currentCount;
                cartCount.style.display = 'flex';
            }
            
        } else {
            // Віднімаємо товар з кошика
            productInCart = false;
            
            // Оновлюємо кнопку
            cartButton.textContent = 'В кошик';
            cartButton.classList.remove('in-cart');
            
            // Оновлюємо лічильник кошика
            if (cartCount) {
                let currentCount = parseInt(cartCount.textContent) || 0;
                currentCount = Math.max(0, currentCount - 1);
                cartCount.textContent = currentCount;
                cartCount.style.display = currentCount > 0 ? 'flex' : 'none';
            }
        }
    };
}

// Функція для перемикання додаткового товару в кошику
window.toggleAdditionalProduct = function(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    const button = productCard.querySelector('.additional-add-to-cart-btn');
    const cartCount = document.querySelector('.cart-count');
    const addAllBtn = document.querySelector('.add-all-btn');
    
    // Додаємо затримку для запобігання подвійному натисканню
    if (button.disabled) return;
    button.disabled = true;
    
    setTimeout(() => {
        button.disabled = false;
    }, 300);
    
    if (!additionalProductsInCart[productId]) {
        // Додаємо товар в кошик
        additionalProductsInCart[productId] = true;
        
        // Оновлюємо кнопку
        button.textContent = 'Відняти з кошика';
        button.classList.add('in-cart');
        
        // Оновлюємо картку
        productCard.classList.add('in-cart');
        
        // Оновлюємо лічильник кошика
        if (cartCount) {
            let currentCount = parseInt(cartCount.textContent) || 0;
            currentCount++;
            cartCount.textContent = currentCount;
            cartCount.style.display = 'flex';
        }
        
    } else {
        // Віднімаємо товар з кошика
        additionalProductsInCart[productId] = false;
        
        // Оновлюємо кнопку
        button.textContent = 'Додати в кошик';
        button.classList.remove('in-cart');
        
        // Оновлюємо картку
        productCard.classList.remove('in-cart');
        
        // Оновлюємо лічильник кошика
        if (cartCount) {
            let currentCount = parseInt(cartCount.textContent) || 0;
            currentCount = Math.max(0, currentCount - 1);
            cartCount.textContent = currentCount;
            cartCount.style.display = currentCount > 0 ? 'flex' : 'none';
        }
    }
    
    // Оновлюємо текст кнопки "Додати всі" / "Прибрати всі"
    if (addAllBtn) {
        const allInCart = Object.values(additionalProductsInCart).every(status => status);
        if (allInCart) {
            addAllBtn.textContent = 'Прибрати всі';
            addAllBtn.classList.add('all-in-cart');
        } else {
            addAllBtn.textContent = 'Додати всі';
            addAllBtn.classList.remove('all-in-cart');
        }
    }
};

// Функція для перемикання всіх додаткових товарів
window.toggleAllAdditionalProducts = function() {
    const allInCart = Object.values(additionalProductsInCart).every(status => status);
    const addAllBtn = document.querySelector('.add-all-btn');
    
    // Якщо всі в кошику - видаляємо всі, інакше додаємо всі
    Object.keys(additionalProductsInCart).forEach(productId => {
        if (allInCart) {
            // Видаляємо з кошика
            if (additionalProductsInCart[productId]) {
                toggleAdditionalProduct(parseInt(productId));
            }
        } else {
            // Додаємо в кошик
            if (!additionalProductsInCart[productId]) {
                toggleAdditionalProduct(parseInt(productId));
            }
        }
    });
    
    // Оновлюємо текст кнопки
    if (addAllBtn) {
        if (allInCart) {
            addAllBtn.textContent = 'Додати всі';
            addAllBtn.classList.remove('all-in-cart');
        } else {
            addAllBtn.textContent = 'Прибрати всі';
            addAllBtn.classList.add('all-in-cart');
        }
    }
};

// Функція для відкриття кошика
window.openCart = function() {
    const cartPopup = document.getElementById('cart-popup');
    if (cartPopup) {
        cartPopup.classList.add('show');
        updateCartDisplay();
        
        // Додаємо обробник для закриття при кліку поза кошиком
        cartPopup.addEventListener('click', function(e) {
            if (e.target === cartPopup) {
                closeCart();
            }
        });
    }
};

// Функція для закриття кошика
window.closeCart = function() {
    const cartPopup = document.getElementById('cart-popup');
    if (cartPopup) {
        cartPopup.classList.remove('show');
    }
};

// Функція для оновлення відображення кошика
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    
    if (!cartItems || !totalAmount) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    
    // Додаємо головний товар якщо він в кошику
    if (productInCart) {
        const mainProductItem = document.createElement('div');
        mainProductItem.className = 'cart-item';
        mainProductItem.innerHTML = `
            <img src="foto 2.jpg" alt="Преміум товар">
            <div class="cart-item-info">
                <h4>Преміум товар</h4>
                <div class="price">2800 грн</div>
            </div>
            <button class="remove-item-btn" onclick="removeMainProduct()">×</button>
        `;
        cartItems.appendChild(mainProductItem);
        total += 2800;
    }
    
    // Додаємо додаткові товари
    const productNames = {
        1: 'Букет квітів',
        2: 'Пейзажне мистецтво',
        3: 'Автомобільна палітра'
    };
    
    const productPrices = {
        1: 2800,
        2: 3200,
        3: 1800
    };
    
    const productImages = {
        1: 'foto 1.jpg',
        2: 'foto 2.jpg',
        3: 'foto 3.jpg'
    };
    
    Object.keys(additionalProductsInCart).forEach(productId => {
        if (additionalProductsInCart[productId]) {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${productImages[productId]}" alt="${productNames[productId]}">
                <div class="cart-item-info">
                    <h4>${productNames[productId]}</h4>
                    <div class="price">${productPrices[productId]} грн</div>
                </div>
                <button class="remove-item-btn" onclick="removeAdditionalProduct(${productId})">×</button>
            `;
            cartItems.appendChild(cartItem);
            total += productPrices[productId];
        }
    });
    
    totalAmount.textContent = total;
}

// Функція для видалення головного товару
window.removeMainProduct = function() {
    productInCart = false;
    const cartButton = document.getElementById('cart-button');
    const cartCount = document.querySelector('.cart-count');
    
    if (cartButton) {
        cartButton.textContent = 'Додати в кошик';
        cartButton.classList.remove('in-cart');
    }
    
    if (cartCount) {
        let currentCount = parseInt(cartCount.textContent) || 0;
        currentCount = Math.max(0, currentCount - 1);
        cartCount.textContent = currentCount;
        cartCount.style.display = currentCount > 0 ? 'flex' : 'none';
    }
    
    updateCartDisplay();
};

// Функція для видалення додаткового товару
window.removeAdditionalProduct = function(productId) {
    additionalProductsInCart[productId] = false;
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    const button = productCard.querySelector('.additional-add-to-cart-btn');
    const cartCount = document.querySelector('.cart-count');
    
    if (button) {
        button.textContent = 'Додати в кошик';
        button.classList.remove('in-cart');
    }
    
    if (productCard) {
        productCard.classList.remove('in-cart');
    }
    
    if (cartCount) {
        let currentCount = parseInt(cartCount.textContent) || 0;
        currentCount = Math.max(0, currentCount - 1);
        cartCount.textContent = currentCount;
        cartCount.style.display = currentCount > 0 ? 'flex' : 'none';
    }
    
    updateCartDisplay();
};

// Ініціалізуємо нові функції
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Ініціалізація всіх функцій...');
    
    // Ініціалізуємо основні функції
    initializeB2BButton();
    initializeCart();
    initializeProductCarousel();
    initializeProductCart();
    initializeProgressBar();
    
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
    const quantityButtons = document.querySelectorAll('.quantity-btn');
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
        const quantity = parseInt(quantityBtn.dataset.quantity);
        const pricePerUnit = parseFloat(quantityBtn.dataset.pricePerUnit);
        const currency = quantityBtn.dataset.currency || 'грн';
        
        console.log(`💰 Розрахунок: ${quantity} × ${pricePerUnit} = ${quantity * pricePerUnit}`);
        
        if (quantity && pricePerUnit) {
            const totalPrice = (quantity * pricePerUnit).toFixed(2);
            
            // Оновлюємо фінальну ціну
            if (finalPriceDisplay) {
                finalPriceDisplay.textContent = totalPrice;
            } else {
                // Якщо немає елементу final-price, оновлюємо загальний елемент
                priceElement.innerHTML = `<strong>${totalPrice}</strong> ${currency}`;
            }
            
            // Додаємо анімацію зміни ціни
            const targetElement = finalPriceDisplay || priceElement;
            targetElement.style.transition = 'transform 0.3s ease, color 0.3s ease';
            targetElement.style.transform = 'scale(1.1)';
            targetElement.style.color = '#4CAF50';
            
            setTimeout(() => {
                targetElement.style.transform = 'scale(1)';
                targetElement.style.color = '';
            }, 300);
            
            console.log(`💰 Ціна оновлена: ${totalPrice} ${currency}`);
        }
    }
    
    quantityButtons.forEach((btn, index) => {
        console.log(`🔗 Додаємо слухач для кнопки ${index + 1}: "${btn.textContent.trim()}"`);
        console.log(`🔗 Дані кнопки:`, btn.dataset);
        
        // Очищуємо старі слухачі
        btn.onclick = null;
        
        // Функція обробки кліку
        function handleClick(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`🖱️ КЛІК на кількість: ${this.dataset.quantity}`);
            console.log(`🖱️ Кнопка:`, this);
            
            // Знімаємо активний клас з усіх кнопок
            quantityButtons.forEach(b => b.classList.remove('active'));
            // Додаємо активний клас до поточної кнопки
            this.classList.add('active');
            // Оновлюємо ціну
            updatePrice(this);
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
        // Знаходимо перший активний варіант або просто перший
        let firstActiveBtn = Array.from(quantityButtons).find(btn => btn.classList.contains('active')) || quantityButtons[0];
        
        // Видаляємо всі активні класи та встановлюємо активний тільки для першого
        quantityButtons.forEach(btn => btn.classList.remove('active'));
        firstActiveBtn.classList.add('active');
        
        // Оновлюємо ціну
        updatePrice(firstActiveBtn);
        console.log('💰 Встановлено початкову ціну для:', firstActiveBtn.dataset.quantity);
    } else {
        console.log('❌ Кнопки кількості не знайдені!');
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
    const quantityButtons = document.querySelectorAll('.quantity-btn');
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
        const quantityButtons = document.querySelectorAll('.quantity-btn');
        
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