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
    let currentImageIndex = 0;
    
    // Обробка вибору кольору
    colorDots.forEach(dot => {
        dot.addEventListener('click', function() {
            // Видаляємо активний клас з усіх точок
            colorDots.forEach(d => d.classList.remove('active'));
            // Додаємо активний клас до поточної точки
            this.classList.add('active');
            
            // Змінюємо зображення
            const newImageSrc = this.getAttribute('data-image');
            if (productImage && newImageSrc) {
                productImage.src = newImageSrc;
            }
        });
    });
    
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
        allDots[newIndex].click();
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
};

// Функція для перемикання всіх додаткових товарів
window.toggleAllAdditionalProducts = function() {
    const allInCart = Object.values(additionalProductsInCart).every(status => status);
    
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
        }
    }
    
    // Забезпечуємо запуск сторінки з самого верху
    window.scrollTo(0, 0);
});

// Додатково скидаємо скрол при завантаженні сторінки
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});