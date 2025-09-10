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
            alert('Кошик порожній. Додайте товари для покупки!');
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

// Функція для додавання товару в кошик
function initializeProductCart() {
    // Функція перемикання стану товару в кошику
    window.toggleCart = function() {
        const cartButton = document.getElementById('cart-button');
        const priceLabel = document.getElementById('price-label');
        const cartCount = document.querySelector('.cart-count');
        
        if (!productInCart) {
            // Додаємо товар в кошик
            productInCart = true;
            
            // Оновлюємо кнопку
            cartButton.textContent = 'Прибрати';
            cartButton.style.background = 'linear-gradient(45deg, rgba(244, 67, 54, 0.3), rgba(244, 67, 54, 0.5))';
            priceLabel.textContent = 'Відняти з кошика';
            
            // Оновлюємо лічильник кошика
            if (cartCount) {
                let currentCount = parseInt(cartCount.textContent) || 0;
                currentCount++;
                cartCount.textContent = currentCount;
                cartCount.style.display = 'flex';
            }
            
            // Показуємо повідомлення
            setTimeout(() => {
                cartButton.textContent = '2800 грн';
                cartButton.classList.add('in-cart');
                priceLabel.textContent = 'Відняти з кошика';
            }, 1000);
            
        } else {
            // Віднімаємо товар з кошика
            productInCart = false;
            
            // Оновлюємо кнопку
            cartButton.textContent = 'Додано назад!';
            cartButton.style.background = 'linear-gradient(45deg, rgba(76, 175, 80, 0.3), rgba(76, 175, 80, 0.5))';
            priceLabel.textContent = 'Додано назад!';
            
            // Оновлюємо лічильник кошика
            if (cartCount) {
                let currentCount = parseInt(cartCount.textContent) || 0;
                currentCount = Math.max(0, currentCount - 1);
                cartCount.textContent = currentCount;
                cartCount.style.display = currentCount > 0 ? 'flex' : 'none';
            }
            
            // Повертаємо до початкового стану
            setTimeout(() => {
                cartButton.textContent = '2800 грн';
                cartButton.classList.remove('in-cart');
                priceLabel.textContent = 'В кошик';
            }, 1000);
        }
    };
}

// Ініціалізуємо нові функції
document.addEventListener('DOMContentLoaded', () => {
    initializeB2BButton();
    initializeCart();
    initializeProductCarousel();
    initializeProductCart();
    initializeProgressBar();
});