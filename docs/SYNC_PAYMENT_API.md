# Monobank Synchronous Payment System

## Огляд

Система синхронної оплати через Monobank API дозволяє клієнтам оплачувати замовлення різними способами: карткою, Apple Pay та Google Pay. Оплата обробляється миттєво без перенаправлень, що забезпечує зручність та швидкість для клієнтів.

## API Endpoints

### POST /api/payment/sync/

Синхронна оплата через Monobank API.

**Request Body:**
```json
{
  "amount": 100.0,
  "ccy": 980,
  "merchantPaymInfo": {
    "reference": "order_123",
    "destination": "Опис замовлення"
  },
  "cardData": {
    "pan": "4242424242424242",
    "exp": "12/25",
    "cvv": "123",
    "eciIndicator": "02",
    "cavv": "123"
  },
  "applePay": {
    "token": "4242424242424242",
    "exp": "12/25",
    "eciIndicator": "02",
    "cryptogram": "AQAAAAoAR9qDi9kAAAAAgGpLpoA="
  },
  "googlePay": {
    "token": "4242424242424242",
    "exp": "12/25",
    "eciIndicator": "02",
    "cryptogram": "AQAAAAoAR9qDi9kAAAAAgGpLpoA="
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "invoiceId": "p2_9ZgpZVsl3",
  "status": "success",
  "amount": 10000,
  "ccy": 980,
  "finalAmount": 10000,
  "createdDate": "2024-12-29T10:30:00Z",
  "modifiedDate": "2024-12-29T10:30:05Z",
  "reference": "order_123",
  "destination": "Опис замовлення",
  "paymentInfo": {
    "maskedPan": "444403******1902",
    "approvalCode": "662476",
    "rrn": "060189181768",
    "tranId": "13194036",
    "terminal": "MI001088",
    "bank": "Універсал Банк",
    "paymentSystem": "visa"
  },
  "walletData": {
    "cardToken": "67XZtXdR4NpKU3",
    "walletId": "c1376a611e17b059aeaf96b73258da9c"
  },
  "message": "Синхронна оплата успішно оброблена"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Помилка обробки синхронної оплати",
  "errorCode": "INVALID_CARD",
  "errorText": "Невірні дані картки",
  "details": "Детальний опис помилки"
}
```

### GET /payment/sync/

Сторінка форми синхронної оплати.

## Сторінки синхронної оплати

### 1. Форма синхронної оплати (`/payment/sync/`)

- **Функціональність:**
  - Вибір способу оплати (картка, Apple Pay, Google Pay)
  - Введення суми та деталей замовлення
  - Валідація даних відповідно до обраного способу
  - Підтвердження умов обробки платежів

- **Способи оплати:**
  - **Картка** - оплата банківською карткою
  - **Apple Pay** - швидка оплата через Apple Pay
  - **Google Pay** - зручна оплата через Google Pay

### 2. Успішна оплата (`/payment/sync/success/`)

- **Функціональність:**
  - Відображення деталей успішної оплати
  - Інформація про платіж (сума, час, ID рахунку)
  - Дані про картку та банк
  - Навігаційні кнопки

### 3. Помилка оплати (`/payment/sync/failure/`)

- **Функціональність:**
  - Відображення деталей помилки
  - Коди помилок та їх описи
  - Можливі рішення проблем
  - Кнопки для повторної спроби

### 4. Обробка оплати (`/payment/sync/processing/`)

- **Функціональність:**
  - Відображення статусу обробки
  - Автоматичне оновлення статусу
  - Етапи обробки платежу
  - Кнопки для ручної перевірки

## Способи оплати

### 1. Оплата карткою

```javascript
const cardData = {
    pan: '4242424242424242',        // Номер картки
    exp: '12/25',                   // Термін дії (ММ/РР)
    cvv: '123',                     // CVV код
    eciIndicator: '02',             // ECI індикатор
    cavv: '123'                     // CAVV
};
```

### 2. Apple Pay

```javascript
const applePay = {
    token: '4242424242424242',      // Токен Apple Pay
    exp: '12/25',                   // Термін дії
    eciIndicator: '02',             // ECI індикатор
    cryptogram: 'AQAAAAoAR9qDi9kAAAAAgGpLpoA='  // Криптограма
};
```

### 3. Google Pay

```javascript
const googlePay = {
    token: '4242424242424242',      // Токен Google Pay
    exp: '12/25',                   // Термін дії
    eciIndicator: '02',             // ECI індикатор
    cryptogram: 'AQAAAAoAR9qDi9kAAAAAgGpLpoA='  // Криптограма
};
```

## Процес синхронної оплати

### 1. Вибір способу оплати

```javascript
// Обробка вибору способу оплати
document.querySelectorAll('.method-card').forEach(card => {
    card.addEventListener('click', function() {
        selectedMethod = this.dataset.method;
        
        // Показуємо відповідну секцію
        if (selectedMethod === 'card') {
            document.getElementById('cardSection').style.display = 'block';
        } else if (selectedMethod === 'apple') {
            document.getElementById('appleSection').style.display = 'block';
        } else if (selectedMethod === 'google') {
            document.getElementById('googleSection').style.display = 'block';
        }
    });
});
```

### 2. Валідація даних

```javascript
// Валідація картки
if (selectedMethod === 'card') {
    const cardNumber = formData.get('pan').replace(/\s/g, '');
    const cardExpiry = formData.get('exp');
    const cardCvv = formData.get('cvv');
    
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        alert('Невірний номер картки');
        return;
    }
    
    if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
        alert('Невірний формат терміну дії (ММ/РР)');
        return;
    }
    
    if (cardCvv.length < 3 || cardCvv.length > 4) {
        alert('Невірний CVV код');
        return;
    }
}
```

### 3. Відправка запиту

```javascript
const paymentData = {
    amount: amount,
    ccy: 980,
    merchantPaymInfo: {
        reference: formData.get('reference') || null,
        destination: formData.get('destination') || null
    }
};

// Додаємо дані відповідно до обраного способу
if (selectedMethod === 'card') {
    paymentData.cardData = cardData;
} else if (selectedMethod === 'apple') {
    paymentData.applePay = applePay;
} else if (selectedMethod === 'google') {
    paymentData.googlePay = googlePay;
}

const response = await fetch('/api/payment/sync/', {
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
    if (result.status === 'success') {
        window.location.href = `/payment/sync/success/${result.invoiceId}/`;
    } else if (result.status === 'failure') {
        window.location.href = `/payment/sync/failure/${result.invoiceId}/?reason=${encodeURIComponent(result.failureReason)}`;
    } else {
        window.location.href = `/payment/sync/processing/${result.invoiceId}/`;
    }
} else {
    alert('Помилка оплати: ' + result.error);
}
```

## Статуси оплати

### 1. Успішна оплата (success)

- Платіж успішно оброблено
- Кошти списано з картки
- Замовлення підтверджено

### 2. Невдала оплата (failure)

- Платіж не пройшов
- Кошти не списано
- Потрібно спробувати ще раз

### 3. Обробка (processing)

- Платіж отримано
- Триває обробка
- Автоматичне оновлення статусу

### 4. Створено (created)

- Рахунок створено
- Очікується оплата
- Потрібно завершити платіж

## Обробка помилок

### Коди помилок Monobank

- **BAD_REQUEST** - Невірний запит
- **INVALID_CARD** - Невірні дані картки
- **INSUFFICIENT_FUNDS** - Недостатньо коштів
- **CARD_EXPIRED** - Картка прострочена
- **CARD_BLOCKED** - Картка заблокована
- **FORBIDDEN** - Невірний токен
- **TMR** - Занадто багато запитів
- **INTERNAL_ERROR** - Внутрішня помилка сервера

### Обробка в Django

```python
if response.status_code == 200:
    result = response.json()
    return JsonResponse({
        'success': True,
        'invoiceId': result.get('invoiceId'),
        'status': result.get('status'),
        'amount': result.get('amount'),
        'paymentInfo': result.get('paymentInfo'),
        'message': 'Синхронна оплата успішно оброблена'
    })
else:
    error_data = response.json()
    return JsonResponse({
        'success': False,
        'error': 'Помилка обробки синхронної оплати',
        'errorCode': error_data.get('errCode'),
        'errorText': error_data.get('errText')
    }, status=400)
```

## Безпека

### 1. Валідація даних

```python
# Перевірка обов'язкових полів
required_fields = ['amount', 'ccy']
for field in required_fields:
    if field not in data:
        return JsonResponse({'error': f'Відсутнє обов\'язкове поле: {field}'}, status=400)

# Перевірка наявності хоча б одного способу оплати
payment_methods = ['cardData', 'applePay', 'googlePay']
has_payment_method = any(method in data for method in payment_methods)

if not has_payment_method:
    return JsonResponse({'error': 'Необхідно вказати хоча б один спосіб оплати'}, status=400)
```

### 2. CSRF Protection

```html
<!-- Всі форми захищені CSRF токенами -->
<form method="post">
    {% csrf_token %}
    <!-- поля форми -->
</form>
```

### 3. Логування

```python
# Логування всіх операцій
logger.info(f'Sync payment requested: {amount} UAH')
logger.error(f'Sync payment API error: {response.status_code}')
logger.warning(f'Sync payment failed: {error_code}')
```

## Тестування

### Автоматичні тести

```bash
python test_monobank_integration.py
```

Тести перевіряють:
- ✅ API endpoints
- ✅ Шаблони
- ✅ Обробку помилок
- ✅ Валідацію даних
- ✅ Синхронну оплату

### Ручне тестування

1. **Тестова картка:** 4242424242424242
2. **Тестовий Apple Pay:** Токен з Apple Pay
3. **Тестовий Google Pay:** Токен з Google Pay
4. **Очікуваний результат:** Успішна оплата або помилка

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
    'sync_payment_url': 'https://api.monobank.ua/api/merchant/invoice/sync-payment',
    # ... інші налаштування
}
```

## Приклади використання

### 1. Оплата карткою

```bash
curl -X POST "https://yoursite.com/api/payment/sync/" \
     -H "Content-Type: application/json" \
     -H "X-CSRFToken: your_csrf_token" \
     -d '{
       "amount": 100.0,
       "ccy": 980,
       "cardData": {
         "pan": "4242424242424242",
         "exp": "12/25",
         "cvv": "123"
       }
     }'
```

### 2. Apple Pay

```bash
curl -X POST "https://yoursite.com/api/payment/sync/" \
     -H "Content-Type: application/json" \
     -H "X-CSRFToken: your_csrf_token" \
     -d '{
       "amount": 100.0,
       "ccy": 980,
       "applePay": {
         "token": "4242424242424242",
         "exp": "12/25",
         "cryptogram": "AQAAAAoAR9qDi9kAAAAAgGpLpoA="
       }
     }'
```

### 3. Google Pay

```bash
curl -X POST "https://yoursite.com/api/payment/sync/" \
     -H "Content-Type: application/json" \
     -H "X-CSRFToken: your_csrf_token" \
     -d '{
       "amount": 100.0,
       "ccy": 980,
       "googlePay": {
         "token": "4242424242424242",
         "exp": "12/25",
         "cryptogram": "AQAAAAoAR9qDi9kAAAAAgGpLpoA="
       }
     }'
```

## Логування

### Django Logs

```python
logger.info('Sync payment requested: %s UAH', amount)
logger.error('Sync payment API error: %s - %s', response.status_code, response.text)
logger.warning('Sync payment failed: %s', error_code)
```

### JavaScript Console

```javascript
console.log('Sync payment requested:', paymentData);
console.error('Sync payment error:', error);
console.info('Sync payment successful:', result);
```

## Підтримка

### Налагодження

1. Перевірте логи Django
2. Перевірте статус Monobank API
3. Перевірте валідність токенів
4. Перевірте дані картки/Apple Pay/Google Pay
5. Перевірте з'єднання з інтернетом

### Контакти

- [Monobank Support](https://web.monobank.ua/)
- Внутрішня підтримка: support@yoursite.com

## Оновлення

При оновленні Monobank API:

1. Оновіть `monobank_config.py`
2. Перевірте сумісність з новою версією
3. Протестуйте всі способи оплати
4. Оновіть документацію

## Повний цикл Monobank API

Система тепер надає **повний цикл Monobank API**:

1. **Створення рахунку** → 2. **Оплата** → 3. **Webhook обробка** → 4. **Перевірка статусу** → 5. **Скасування з поверненням** → 6. **Інвалідація без повернення** → 7. **Фіналізація холду** → 8. **Дані мерчанта** → 9. **Оплата за реквізитами** → 10. **Квитанції** → 11. **Синхронна оплата** → 12. **Відстеження замовлення**

### Всі доступні операції

- **Створення рахунку** - Генерація рахунків для оплати
- **Перевірка статусу** - Моніторинг стану рахунків
- **Скасування** - Повернення коштів за оплачені рахунки
- **Інвалідація** - Деактивація неоплачених рахунків
- **Фіналізація холду** - Завершення блокування коштів
- **Дані мерчанта** - Відображення інформації про мерчанта
- **Оплата за реквізитами** - Пряма оплата карткою на сайті
- **Квитанції** - Генерація та надсилання PDF квитанцій
- **Синхронна оплата** - Миттєва оплата карткою, Apple Pay, Google Pay

## Підсумок

Інтеграція Monobank Synchronous Payment System повністю готова до використання! Система тепер надає **комплексне управління Monobank API** з можливістю:

- Синхронної оплати карткою
- Інтеграції з Apple Pay
- Інтеграції з Google Pay
- Миттєвої обробки платежів
- Повного циклу управління платежами

Це забезпечує **максимальну зручність для клієнтів** та **швидкість обробки платежів**! 🚀
