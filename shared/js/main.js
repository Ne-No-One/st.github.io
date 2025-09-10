// Спільний JavaScript для обох версій сайту

// Плавна прокрутка для навігації
document.addEventListener('DOMContentLoaded', function() {
    // Плавна прокрутка для посилань
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Анімація появу елементів при прокрутці
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Спостерігаємо за елементами для анімації
    const animatedElements = document.querySelectorAll('.product-card, .service-card, .feature');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Ініціалізація лічильника кошика
    updateCartDisplay();
    
    // Ініціалізація прогрес бару
    initializeProgressBar();
});

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

// Функція для оновлення відображення кошика
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        // Отримуємо кількість товарів з localStorage (для демо версії)
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

// Функція для додавання товару в кошик (для демо версії)
function addToCartDemo(productId, productName, productPrice) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Перевіряємо, чи товар вже є в кошику
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    
    // Показуємо повідомлення
    showNotification('Товар додано в кошик!');
}

// Функція для показу повідомлень
function showNotification(message) {
    // Створюємо елемент повідомлення
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #4ecdc4, #45b7d1);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-weight: bold;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Анімація появи
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Видаляємо через 3 секунди
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Функція для зміни зображень товару (для демо версії)
function changeImage(direction) {
    const images = [
        'foto.jpg',
        'foto 2.jpg', 
        'foto 3.jpg',
        'foto 4.jpg'
    ];
    
    const productImage = document.getElementById('product-image');
    if (!productImage) return;
    
    const currentSrc = productImage.src;
    const currentIndex = images.findIndex(img => currentSrc.includes(img));
    
    let newIndex;
    if (direction === 1) {
        newIndex = (currentIndex + 1) % images.length;
    } else {
        newIndex = (currentIndex - 1 + images.length) % images.length;
    }
    
    productImage.src = images[newIndex];
}

// Функція для вибору кольору (для демо версії)
function selectColor(colorDot) {
    // Видаляємо активний клас з усіх точок
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Додаємо активний клас до вибраної точки
    colorDot.classList.add('active');
    
    // Змінюємо зображення
    const newImage = colorDot.getAttribute('data-image');
    const productImage = document.getElementById('product-image');
    if (productImage && newImage) {
        productImage.src = newImage;
    }
}

// Функція для відправки форми контактів
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Симуляція відправки
    showNotification('Повідомлення відправлено! Ми зв\'яжемося з вами найближчим часом.');
    
    // Очищуємо форму
    event.target.reset();
}

// Додаємо обробник для форми контактів
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Додаємо обробники для кнопок кольорів
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', function() {
            selectColor(this);
        });
    });
});

// Функція для відображення кошика (для демо версії)
function showCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        alert('Ваш кошик порожній');
        return;
    }
    
    let cartContent = 'Ваш кошик:\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartContent += `${item.name} x${item.quantity} = ${itemTotal} грн\n`;
    });
    
    cartContent += `\nЗагальна сума: ${total} грн`;
    
    alert(cartContent);
}

// Функція для очищення кошика
function clearCart() {
    localStorage.removeItem('cart');
    updateCartDisplay();
    showNotification('Кошик очищено');
}

// Експортуємо функції для використання в HTML
window.addToCartDemo = addToCartDemo;
window.changeImage = changeImage;
window.selectColor = selectColor;
window.showCart = showCart;
window.clearCart = clearCart;
