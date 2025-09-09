// Функція для завантаження HTML компонентів
async function loadComponent(componentPath, containerId) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
    } catch (error) {
        console.error(`Помилка завантаження компонента ${componentPath}:`, error);
    }
}

// Функція для ініціалізації сайту
async function initializeSite() {
    // Завантажуємо плаваючі шари
    await loadComponent('components/floating-shapes.html', 'floating-shapes-container');
    
    // Завантажуємо шапку
    await loadComponent('components/header.html', 'header-container');
    
    // Завантажуємо всі секції окремо
    await loadComponent('components/hero.html', 'hero-container');
    await loadComponent('components/about.html', 'about-container');
    await loadComponent('components/services.html', 'services-container');
    await loadComponent('components/contact.html', 'contact-container');
    
    // Ініціалізуємо плавну прокрутку для навігації
    initializeSmoothScrolling();
    
    // Ініціалізуємо анімації при скролі
    initializeScrollAnimations();
}

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
document.addEventListener('DOMContentLoaded', async () => {
    await initializeSite();
    
    // Додаємо невелику затримку для завантаження стилів
    setTimeout(() => {
        initializeContactForm();
    }, 100);
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
