# Monobank Brand Integration Guide

## Огляд

Інтеграція офіційних кнопок Monobank згідно з брендбуком для забезпечення консистентного дизайну та користувацького досвіду.

## Брендбук Monobank

### Логотип та кольори

- **Логотип:** Виключно у монохромних кольорах
- **Заборонено:** Зміна елементів, збільшення/зменшення розмірів без збереження пропорцій
- **Кольори:** Чорний (#000000) та білий (#ffffff)

### Кнопка "Оформити через mono checkout"

#### Структура кнопки

```
[Оформити через] [mono checkout]
```

- **Текст:** "Оформити через" (Nunito Sans Semibold)
- **Логотип:** "mono checkout" (Nunito Sans Extrabold)

#### Шрифти

- **Nunito Sans Semibold** - для тексту "Оформити через"
- **Nunito Sans Extrabold** - для логотипу "mono checkout"
- **Підключення:** Google Fonts CDN

## Розміщення кнопок

### 1. У кошику

Кнопка додається поруч з основною кнопкою "Оформити замовлення":

```html
<div class="cart-actions-overlay">
    <button class="btn-secondary" onclick="closeCart()">Продовжити покупки</button>
    <button class="btn-primary" onclick="goToCheckout()">Оформити замовлення</button>
    <!-- Monobank Checkout Button in Cart -->
    <button class="mono-checkout-btn large standard cart-mono-btn" id="cart-mono-btn" onclick="processCartMonoPayment()">
        <span class="mono-checkout-text">Оформити через</span>
        <span class="mono-checkout-logo">mono checkout</span>
    </button>
</div>
```

### 2. У карточці товару

Кнопка додається під кнопкою "Додати в кошик":

```html
<button class="additional-add-to-cart-btn" onclick="toggleAdditionalProduct({{ product.id }})">
    Додати в кошик
</button>
<!-- Monobank Checkout Button for Additional Product -->
<button class="mono-checkout-btn small standard additional-mono-btn" onclick="processAdditionalProductMonoPayment({{ product.id }}, '{{ product.title }}', {{ product.price }})">
    <span class="mono-checkout-text">Оформити через</span>
    <span class="mono-checkout-logo">mono checkout</span>
</button>
```

### 3. На головній сторінці

Кнопка додається поруч з кнопкою "В кошик":

```html
<button class="add-to-cart-btn" id="cart-button" onclick="toggleMainProduct()">
    В кошик
</button>
<!-- Monobank Checkout Button -->
<button class="mono-checkout-btn medium standard" id="main-mono-btn" onclick="processMainProductMonoPayment()">
    <span class="mono-checkout-text">Оформити через</span>
    <span class="mono-checkout-logo">mono checkout</span>
</button>
```

## CSS Стилі

### Базові стилі кнопки

```css
.mono-checkout-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: 'Nunito Sans', sans-serif;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

### Розміри кнопок

#### Малий розмір (32px)
```css
.mono-checkout-btn.small {
    height: 32px;
    padding: 0 12px;
    font-size: 12px;
    min-width: 120px;
}
```

#### Середній розмір (48px)
```css
.mono-checkout-btn.medium {
    height: 48px;
    padding: 0 16px;
    font-size: 14px;
    min-width: 160px;
}
```

#### Великий розмір (64px)
```css
.mono-checkout-btn.large {
    height: 64px;
    padding: 0 20px;
    font-size: 18px;
    min-width: 200px;
}
```

### Варіанти кнопок

#### Стандартна (чорна)
```css
.mono-checkout-btn.standard {
    background: #000000;
    color: #ffffff;
}
```

#### Біла
```css
.mono-checkout-btn.white {
    background: #ffffff;
    color: #000000;
    border: 1px solid #e0e0e0;
}
```

#### Сіра
```css
.mono-checkout-btn.gray {
    background: #f5f5f5;
    color: #000000;
    border: 1px solid #e0e0e0;
}
```

#### Біла з обведенням
```css
.mono-checkout-btn.white-outline {
    background: #ffffff;
    color: #000000;
    border: 1px solid #000000;
}
```

### Стани кнопки

#### Hover
```css
.mono-checkout-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
```

#### Active
```css
.mono-checkout-btn:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
```

#### Loading
```css
.mono-checkout-btn.loading {
    opacity: 0.7;
    cursor: not-allowed;
}

.mono-checkout-btn.loading::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: mono-spin 1s linear infinite;
    margin-left: 8px;
}
```

## JavaScript Функціональність

### Основні функції

#### Створення кнопки
```javascript
function createMonoCheckoutButton(options = {}) {
    const {
        size = 'medium',
        variant = 'standard',
        text = 'Оформити через',
        logo = 'mono checkout',
        onClick = null,
        disabled = false,
        loading = false
    } = options;
    
    // Створення HTML елемента кнопки
}
```

#### Обробка оплати з кошика
```javascript
async function processCartMonoPayment() {
    try {
        // Показ індикатора завантаження
        const button = document.getElementById('cart-mono-btn');
        button.classList.add('loading');
        
        // Отримання даних кошика
        const cartData = getCartData();
        
        // Створення рахунку через Monobank API
        const response = await fetch('/api/payment/create-invoice/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(invoiceData)
        });
        
        // Обробка відповіді
        const result = await response.json();
        if (result.success) {
            window.location.href = result.pageUrl;
        }
    } catch (error) {
        console.error('Помилка оплати через Monobank:', error);
    }
}
```

#### Обробка оплати товару
```javascript
async function processProductMonoPayment(productId, productName, productPrice) {
    // Аналогічна логіка для окремого товару
}
```

### Ініціалізація

```javascript
// Автоматична ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    initMonoCheckoutButtons();
});

// Оновлення кнопок при зміні кошика
document.addEventListener('cartUpdated', updateMonoButtons);
```

## Вимоги до розміщення

### Простір навколо кнопки

- **Мінімальний відступ:** 8px з усіх сторін
- **Рекомендований відступ:** 16px з усіх сторін
- **Між кнопками:** 10px

### Контрастність

- **Біла кнопка** - на темному фоні
- **Чорна кнопка** - на світлому фоні
- **Сіра кнопка** - на нейтральному фоні

### Скруглення кутів

- **Стандартне:** 8px
- **Дозволено:** Налаштування відповідно до стилістики сайту

## Заборонені дії

### ❌ Не можна робити

1. **Змінювати розміри логотипу** без збереження пропорцій
2. **Використовувати довільні кольори** замість офіційних
3. **Змінювати місцями елементи** кнопки
4. **Використовувати інші шрифти** замість Nunito Sans
5. **Додавати власні елементи** до логотипу

### ✅ Можна робити

1. **Налаштовувати скруглення кутів** відповідно до дизайну
2. **Додавати тіні** для кращого візуального ефекту
3. **Змінювати розмір кнопки** згідно з гайдлайнами
4. **Використовувати різні варіанти** (стандартна, біла, сіра)
5. **Додавати анімації** при взаємодії

## Адаптивність

### Мобільні пристрої

```css
@media (max-width: 768px) {
    .mono-checkout-btn {
        width: 100%;
        margin: 10px 0;
    }
    
    .mono-checkout-btn.small {
        height: 40px;
        font-size: 14px;
    }
    
    .mono-checkout-btn.medium {
        height: 48px;
        font-size: 16px;
    }
    
    .mono-checkout-btn.large {
        height: 56px;
        font-size: 18px;
    }
}
```

## Інтеграція з Monobank API

### Створення рахунку

```javascript
const invoiceData = {
    amount: cartData.total,
    ccy: 980,
    merchantPaymInfo: {
        reference: `cart_${Date.now()}`,
        destination: `Оплата кошика (${cartData.items.length} товарів)`,
        basketOrder: cartData.items.map(item => ({
            name: item.name,
            qty: item.quantity,
            sum: item.price * 100,
            total: (item.price * item.quantity) * 100
        }))
    }
};
```

### Обробка відповіді

```javascript
const response = await fetch('/api/payment/create-invoice/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify(invoiceData)
});

const result = await response.json();
if (result.success) {
    window.location.href = result.pageUrl;
}
```

## Тестування

### Автоматичні тести

```bash
python test_monobank_integration.py
```

### Ручне тестування

1. **Перевірка відображення** кнопок на всіх сторінках
2. **Тестування кліків** та переходів на оплату
3. **Перевірка адаптивності** на різних пристроях
4. **Тестування станів** (loading, disabled, hover)

## Підтримка

### Налагодження

1. **Перевірка консолі** на помилки JavaScript
2. **Перевірка мережі** на запити до Monobank API
3. **Перевірка CSS** на правильне відображення
4. **Перевірка токенів** Monobank

### Контакти

- [Monobank Support](https://web.monobank.ua/)
- [Figma Design System](https://www.figma.com/design/MRMtWeIHtX0wifAPaBbpZd/Sales-Tools-Guide-by-mono-|-public?node-id=272-47&p=f&t=zTL0fNoE8EPT7eOH-0)

## Оновлення

При оновленні брендбуку Monobank:

1. **Оновіть CSS стилі** відповідно до нових вимог
2. **Перевірте шрифти** та їх налаштування
3. **Протестуйте кнопки** на всіх сторінках
4. **Оновіть документацію** з новими правилами

## Підсумок

Інтеграція кнопок Monobank згідно з брендбуком забезпечує:

- ✅ **Консистентний дизайн** з офіційними стандартами
- ✅ **Професійний вигляд** сайту
- ✅ **Зручність для клієнтів** при оплаті
- ✅ **Відповідність вимогам** Monobank
- ✅ **Адаптивність** на всіх пристроях
- ✅ **Легкість підтримки** та оновлення

Система готова для використання в продакшні! 🚀
