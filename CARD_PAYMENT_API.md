# Monobank Card Payment System

## Огляд

Система оплати за реквізитами картки через Monobank API дозволяє клієнтам оплачувати замовлення безпосередньо введенням даних картки на сайті. Це забезпечує зручність для клієнтів та додаткову безпеку через 3DS авторизацію.

## API Endpoints

### POST /api/payment/card/

Обробка оплати за реквізитами картки через Monobank API.

**Request Body:**
```json
{
  "amount": 100.0,
  "cardData": {
    "pan": "4242424242424242",
    "exp": "12/25",
    "cvv": 123
  },
  "paymentType": "debit",
  "initiationKind": "client",
  "reference": "order_123",
  "destination": "Оплата замовлення",
  "customerEmail": "customer@example.com",
  "saveCardData": {
    "saveCard": true
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "invoiceId": "2210012MPLYwJjVUzchj",
  "tdsUrl": "https://example.com/tds/url",
  "status": "success",
  "failureReason": null,
  "amount": 10000,
  "ccy": 980,
  "createdDate": "2024-12-29T10:30:00Z",
  "modifiedDate": "2024-12-29T10:30:00Z",
  "message": "Оплата успішно оброблена"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Помилка обробки оплати",
  "errorCode": "INVALID_CARD",
  "errorText": "Невірні дані картки",
  "details": "Детальний опис помилки"
}
```

### GET /payment/card/

Сторінка форми оплати за реквізитами картки.

## Сторінки оплати карткою

### 1. Форма оплати (`/payment/card/`)

- **Функціональність:**
  - Введення даних картки (номер, термін дії, CVV)
  - Введення суми оплати
  - Вибір типу оплати (debit/hold)
  - Вибір типу проведення (client/merchant)
  - Додаткова інформація про замовлення
  - Опція збереження картки
  - Валідація даних на клієнті

- **Поля форми:**
  - **Номер картки** - 16-значний номер з автоматичним форматуванням
  - **Термін дії** - ММ/РР формат
  - **CVV** - 3-4 цифри
  - **Сума** - в гривнях з валідацією
  - **Тип оплати** - debit (звичайна) або hold (блокування)
  - **Тип проведення** - client (за вимогою) або merchant (за ініціативою)
  - **Номер замовлення** - опціонально
  - **Опис замовлення** - опціонально
  - **Email клієнта** - опціонально

### 2. 3DS Авторизація (`/payment/card/`)

- **Функціональність:**
  - Відображення iframe з 3DS авторизацією
  - Автоматична перевірка статусу платежу
  - Інформація про процес авторизації
  - Кнопки навігації

- **Процес 3DS:**
  1. Клієнт вводить дані картки
  2. Система відправляє запит до Monobank
  3. Monobank повертає URL для 3DS авторизації
  4. Клієнт проходить авторизацію в iframe
  5. Система отримує результат авторизації

### 3. Успішна оплата (`/payment/card/`)

- **Функціональність:**
  - Відображення деталей успішної оплати
  - ID рахунку та статус
  - Сума та дата оплати
  - Інформація про наступні кроки
  - Навігаційні кнопки

### 4. Помилка оплати (`/payment/card/`)

- **Функціональність:**
  - Відображення деталей помилки
  - Коди помилок та їх описи
  - Можливі рішення проблем
  - Кнопки для повторної спроби

## JavaScript API

### submitCardPayment(event)

Функція для відправки форми оплати карткою.

```javascript
// Автоматично викликається при відправці форми
<form onsubmit="submitCardPayment(event)">
  <!-- поля форми -->
</form>
```

### Валідація даних

```javascript
// Форматування номера картки
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

// Форматування терміну дії
document.getElementById('cardExpiry').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});
```

## Процес оплати

### 1. Введення даних

```javascript
// Клієнт заповнює форму
const formData = {
    amount: 100.0,
    cardData: {
        pan: '4242424242424242',
        exp: '12/25',
        cvv: 123
    },
    paymentType: 'debit',
    initiationKind: 'client'
};
```

### 2. Валідація

```javascript
// Перевірка обов'язкових полів
if (!agreeTerms) {
    alert('Будь ласка, погодьтеся з умовами');
    return;
}

if (cardNumber.length < 13 || cardNumber.length > 19) {
    alert('Невірний номер картки');
    return;
}
```

### 3. Відправка запиту

```javascript
const response = await fetch('/api/payment/card/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify(paymentData)
});
```

### 4. Обробка відповіді

```javascript
const result = await response.json();

if (result.success) {
    if (result.tdsUrl) {
        // Перенаправлення на 3DS
        window.location.href = result.tdsUrl;
    } else {
        // Успішна оплата
        window.location.href = `/payment/card/success/${result.invoiceId}/`;
    }
} else {
    alert('Помилка оплати: ' + result.error);
}
```

## Безпека

### 1. PCI DSS Compliance

- **Відсутність зберігання даних картки** - дані не зберігаються на сервері
- **Шифрування передачі** - всі дані передаються зашифрованими
- **Валідація на клієнті** - перевірка формату даних перед відправкою
- **3DS авторизація** - додатковий рівень безпеки

### 2. Валідація даних

```javascript
// Перевірка номера картки
if (cardNumber.length < 13 || cardNumber.length > 19) {
    alert('Невірний номер картки');
    return;
}

// Перевірка терміну дії
if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
    alert('Невірний формат терміну дії (ММ/РР)');
    return;
}

// Перевірка CVV
if (cardCvv.length < 3 || cardCvv.length > 4) {
    alert('Невірний CVV код');
    return;
}
```

### 3. CSRF Protection

```javascript
// Всі запити захищені CSRF токенами
headers: {
    'X-CSRFToken': getCookie('csrftoken')
}
```

## Обробка помилок

### Коди помилок Monobank

- **BAD_REQUEST** - Невірний запит
- **INVALID_CARD** - Невірні дані картки
- **INSUFFICIENT_FUNDS** - Недостатньо коштів
- **CARD_EXPIRED** - Картка прострочена
- **CARD_BLOCKED** - Картка заблокована
- **FORBIDDEN** - Невірний токен
- **TMR** - Занадто багато запитів

### Обробка в JavaScript

```javascript
if (result.success) {
    // Успішна оплата
    handleSuccess(result);
} else {
    switch (result.errorCode) {
        case 'INVALID_CARD':
            showError('Невірні дані картки');
            break;
        case 'INSUFFICIENT_FUNDS':
            showError('Недостатньо коштів на картці');
            break;
        case 'CARD_EXPIRED':
            showError('Картка прострочена');
            break;
        default:
            showError(result.error);
    }
}
```

## 3DS Авторизація

### Процес 3DS

1. **Ініціація** - клієнт вводить дані картки
2. **Запит до Monobank** - система відправляє дані
3. **3DS URL** - Monobank повертає URL для авторизації
4. **Iframe** - клієнт проходить авторизацію
5. **Результат** - система отримує результат

### Iframe інтеграція

```html
<iframe id="tdsFrame" src="{{ tds_url }}" style="display: none;"></iframe>
```

### Автоматична перевірка статусу

```javascript
// Перевірка статусу кожні 30 секунд
setInterval(checkPaymentStatus, 30000);

async function checkPaymentStatus() {
    const response = await fetch(`/api/payment/status/{{ invoice_id }}/`);
    const result = await response.json();
    
    if (result.status === 'success') {
        window.location.href = `/payment/card/success/{{ invoice_id }}/`;
    } else if (result.status === 'failure') {
        window.location.href = `/payment/card/failure/{{ invoice_id }}/`;
    }
}
```

## Логування

### Django Logs

```python
logger.info('Processing card payment')
logger.error(f'Card payment API error: {response.status_code}')
logger.warning(f'Card payment failed: {error_code}')
```

### JavaScript Console

```javascript
console.log('Submitting card payment...');
console.error('Card payment error:', error);
console.info('Card payment successful:', result);
```

## Тестування

### Автоматичні тести

```bash
python test_monobank_integration.py
```

Тести перевіряють:
- ✅ API endpoints
- ✅ Шаблони
- ✅ JavaScript функції
- ✅ Обробку помилок
- ✅ Валідацію даних

### Ручне тестування

1. **Тестовий номер картки:** 4242424242424242
2. **Тестовий термін дії:** 12/25
3. **Тестовий CVV:** 123
4. **Тестова сума:** 100.00 грн

## Налаштування

### Змінні середовища

```bash
# Токен Monobank (автоматично з monobank_config.py)
MONOBANK_PRODUCTION_TOKEN=your_production_token
MONOBANK_TEST_TOKEN=your_test_token
```

### Конфігурація

```python
MONOBANK_CONFIG = {
    'card_payment_url': 'https://api.monobank.ua/api/merchant/invoice/payment-direct',
    # ... інші налаштування
}
```

## Приклади використання

### 1. Базова оплата

```javascript
const paymentData = {
    amount: 100.0,
    cardData: {
        pan: '4242424242424242',
        exp: '12/25',
        cvv: 123
    }
};
```

### 2. Оплата з блокуванням коштів

```javascript
const paymentData = {
    amount: 100.0,
    cardData: {
        pan: '4242424242424242',
        exp: '12/25',
        cvv: 123
    },
    paymentType: 'hold'
};
```

### 3. Оплата з збереженням картки

```javascript
const paymentData = {
    amount: 100.0,
    cardData: {
        pan: '4242424242424242',
        exp: '12/25',
        cvv: 123
    },
    saveCardData: {
        saveCard: true
    }
};
```

## Підтримка

### Налагодження

1. Перевірте логи Django
2. Перевірте статус Monobank API
3. Перевірте валідність токенів
4. Перевірте з'єднання з інтернетом
5. Перевірте дані картки

### Контакти

- [Monobank Support](https://web.monobank.ua/)
- Внутрішня підтримка: support@yoursite.com

## Оновлення

При оновленні Monobank API:

1. Оновіть `monobank_config.py`
2. Перевірте сумісність з новою версією
3. Протестуйте всі функції оплати карткою
4. Оновіть документацію

## Повний цикл Monobank API

Система тепер надає **повний цикл Monobank API**:

1. **Створення рахунку** → 2. **Оплата** → 3. **Webhook обробка** → 4. **Перевірка статусу** → 5. **Скасування з поверненням** → 6. **Інвалідація без повернення** → 7. **Фіналізація холду** → 8. **Дані мерчанта** → 9. **Оплата за реквізитами** → 10. **Відстеження замовлення**

### Всі доступні операції

- **Створення рахунку** - Генерація рахунків для оплати
- **Перевірка статусу** - Моніторинг стану рахунків
- **Скасування** - Повернення коштів за оплачені рахунки
- **Інвалідація** - Деактивація неоплачених рахунків
- **Фіналізація холду** - Завершення блокування коштів
- **Дані мерчанта** - Відображення інформації про мерчанта
- **Оплата за реквізитами** - Пряма оплата карткою на сайті

## Підсумок

Інтеграція Monobank Card Payment System повністю готова до використання! Система тепер надає **комплексне управління Monobank API** з можливістю:

- Прямої оплати карткою на сайті
- 3DS авторизації для додаткової безпеки
- PCI DSS сумісного обробки платежів
- Повного циклу управління платежами

Це забезпечує **максимальну зручність для клієнтів** та **повну безпеку платежів**! 🚀
