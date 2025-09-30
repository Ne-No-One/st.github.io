# Monobank Invoice Creation API

## Огляд

Повна інтеграція API створення рахунку Monobank з підтримкою всіх можливостей згідно з офіційною документацією.

## Можливості API

### ✅ Реалізовані функції

1. **Створення рахунку** - Базове створення рахунку для оплати
2. **Створення рахунку з кошика** - Спеціалізована функція для кошика
3. **Встановлення терміну дії** - Налаштування валідності рахунку (за замовчуванням 24 години)
4. **Збереження токена карти** - Токенізація карток для подальшої оплати
5. **Передавання змісту кошика** - Детальна інформація про товари
6. **Скасування рахунку** - API для скасування в будь-який момент
7. **Типи платежів** - debit (звичайна оплата) та hold (блокування коштів)
8. **iFrame інтеграція** - Вбудований віджет оплати
9. **Синхронна оплата** - Миттєва оплата карткою, Apple Pay, Google Pay
10. **Оплата за реквізитами** - Пряма оплата карткою на сайті

## API Endpoints

### 1. Створення рахунку

**URL:** `/payment/create-invoice/`  
**Метод:** `POST`  
**Опис:** Універсальне створення рахунку з підтримкою всіх параметрів

#### Параметри запиту

```json
{
  "amount": 100.0,                    // Сума в гривнях (обов'язково)
  "ccy": 980,                         // Код валюти (за замовчуванням 980)
  "merchantPaymInfo": {               // Детальна інформація про замовлення
    "reference": "order_123",         // Референс замовлення
    "destination": "Оплата товару",   // Призначення платежу
    "comment": "Коментар",            // Коментар
    "customerEmails": ["email@example.com"], // Email клієнта
    "discounts": [],                  // Знижки
    "basketOrder": [                  // Корзина товарів
      {
        "name": "Товар",
        "qty": 1,
        "sum": 10000,                 // Ціна в копійках
        "total": 10000,               // Загальна сума в копійках
        "icon": null,
        "unit": "шт.",
        "code": "product_code",
        "barcode": null,
        "header": null,
        "footer": null,
        "tax": [],
        "uktzed": null,
        "splitReceiverId": null,
        "discounts": []
      }
    ]
  },
  "redirectUrl": "https://example.com/success", // URL повернення
  "webHookUrl": "https://example.com/webhook",  // URL webhook
  "validity": 3600,                   // Термін дії в секундах
  "paymentType": "debit",             // Тип платежу: debit/hold
  "qrId": "QR_CODE_ID",               // ID QR-каси
  "code": "TERMINAL_CODE",            // Код терміналу
  "saveCardData": {                   // Дані для токенізації
    "saveCard": true,
    "walletId": "wallet_id"
  },
  "agentFeePercent": 1.5,             // Відсоток комісії агента
  "tipsEmployeeId": "employee_id",    // ID співробітника для чайових
  "displayType": "iframe",            // Тип відображення
  "cms": "Django",                    // Назва CMS
  "cmsVersion": "4.2"                 // Версія CMS
}
```

#### Відповідь при успіху

```json
{
  "success": true,
  "invoiceId": "p2_9ZgpZVsl3",
  "pageUrl": "https://pay.mbnk.biz/p2_9ZgpZVsl3",
  "message": "Рахунок успішно створено"
}
```

#### Відповідь при помилці

```json
{
  "success": false,
  "error": "Помилка створення рахунку",
  "errorCode": "BAD_REQUEST",
  "errorText": "Невірні параметри",
  "details": "Детальний опис помилки"
}
```

### 2. Створення рахунку з кошика

**URL:** `/payment/create-cart-invoice/`  
**Метод:** `POST`  
**Опис:** Спеціалізована функція для створення рахунку з кошика

#### Параметри запиту

```json
{
  "amount": 150.0,                    // Загальна сума кошика
  "ccy": 980,                         // Код валюти
  "items": [                          // Товари з кошика
    {
      "name": "Товар 1",
      "quantity": 2,
      "price": 50.0
    },
    {
      "name": "Товар 2", 
      "quantity": 1,
      "price": 50.0
    }
  ],
  "reference": "cart_123",            // Референс замовлення
  "destination": "Оплата кошика",     // Призначення
  "comment": "Коментар",              // Коментар
  "customerEmails": ["email@example.com"], // Email клієнта
  "redirectUrl": "https://example.com/success", // URL повернення
  "webHookUrl": "https://example.com/webhook",  // URL webhook
  "validity": 3600,                   // Термін дії в секундах
  "paymentType": "debit",             // Тип платежу
  "displayType": "iframe"             // Тип відображення
}
```

## Типи платежів

### Debit (Звичайна оплата)
- **Опис:** Стандартна оплата карткою або іншим способом
- **Термін дії:** 24 години (за замовчуванням)
- **Використання:** Звичайні покупки, миттєва оплата

### Hold (Блокування коштів)
- **Опис:** Блокування коштів на картці з можливістю фіналізації пізніше
- **Термін дії:** 9 днів
- **Використання:** Бронювання, попередня оплата, холди

## Підтримувані способи оплати

### 1. Картка
- Visa, Mastercard, МИР
- 3D Secure автентифікація
- Токенізація для збереження

### 2. Apple Pay
- Швидка оплата на iOS пристроях
- Біометрична автентифікація
- Високий рівень безпеки

### 3. Google Pay
- Швидка оплата на Android пристроях
- Інтеграція з Google Wallet
- Зручність використання

### 4. Monobank App
- Пряма оплата через додаток Monobank
- Швидкий доступ до рахунків
- Push-повідомлення

## Webhook обробка

### URL Webhook
```
POST https://your-domain.com/payment/webhook/
```

### Структура webhook

```json
{
  "invoiceId": "p2_9ZgpZVsl3",
  "status": "success",
  "amount": 10000,
  "ccy": 980,
  "finalAmount": 10000,
  "createdDate": "2024-12-29T10:00:00Z",
  "modifiedDate": "2024-12-29T10:05:00Z",
  "reference": "order_123",
  "destination": "Оплата товару",
  "paymentInfo": {
    "maskedPan": "444403******1902",
    "approvalCode": "662476",
    "rrn": "060189181768",
    "tranId": "13194036",
    "terminal": "MI001088",
    "bank": "Універсал Банк",
    "paymentSystem": "visa"
  }
}
```

### Статуси платежів

- **created** - Рахунок створено, очікується оплата
- **processing** - Платіж обробляється
- **hold** - Сума заблокована (для hold платежів)
- **success** - Успішна оплата
- **failure** - Неуспішна оплата
- **reversed** - Оплата повернена
- **expired** - Час дії вичерпано

## Інтеграція з фронтендом

### JavaScript приклад

```javascript
// Створення рахунку з кошика
async function createCartInvoice() {
    const cartData = {
        amount: 150.0,
        ccy: 980,
        items: [
            {
                name: "Товар 1",
                quantity: 2,
                price: 50.0
            }
        ],
        reference: `cart_${Date.now()}`,
        destination: "Оплата кошика"
    };
    
    try {
        const response = await fetch('/payment/create-cart-invoice/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(cartData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Перенаправляємо на оплату
            window.location.href = result.pageUrl;
        } else {
            console.error('Помилка створення рахунку:', result.error);
        }
    } catch (error) {
        console.error('Помилка запиту:', error);
    }
}
```

### Python приклад

```python
import requests
import json

def create_invoice(amount, items, reference):
    url = "https://your-domain.com/payment/create-invoice/"
    
    data = {
        "amount": amount,
        "ccy": 980,
        "merchantPaymInfo": {
            "reference": reference,
            "destination": "Оплата замовлення",
            "basketOrder": items
        },
        "validity": 3600,
        "paymentType": "debit"
    }
    
    response = requests.post(url, json=data)
    return response.json()
```

## Обробка помилок

### Коди помилок Monobank

- **BAD_REQUEST** - Невірні параметри запиту
- **FORBIDDEN** - Невірний токен
- **NOT_FOUND** - Рахунок не знайдено
- **METHOD_NOT_ALLOWED** - Невірний HTTP метод
- **TMR** - Занадто багато запитів
- **INTERNAL_ERROR** - Внутрішня помилка сервера

### Обробка в коді

```javascript
if (result.success) {
    // Успішне створення рахунку
    window.location.href = result.pageUrl;
} else {
    // Обробка помилки
    switch(result.errorCode) {
        case 'BAD_REQUEST':
            alert('Невірні параметри запиту');
            break;
        case 'FORBIDDEN':
            alert('Помилка авторизації');
            break;
        case 'TMR':
            alert('Занадто багато запитів, спробуйте пізніше');
            break;
        default:
            alert('Помилка: ' + result.errorText);
    }
}
```

## Безпека

### CSRF захист
- Всі POST запити захищені CSRF токенами
- Автоматична валідація токенів Django

### Валідація даних
- Перевірка обов'язкових полів
- Валідація типів даних
- Санитизація вхідних параметрів

### Логування
- Детальне логування всіх операцій
- Збереження помилок для аналізу
- Моніторинг API запитів

## Тестування

### Автоматичні тести

```bash
python test_monobank_integration.py
```

### Ручне тестування

1. **Створення рахунку** - Тестування базової функціональності
2. **Кошик** - Тестування створення з кошика
3. **Помилки** - Тестування обробки помилок
4. **Webhook** - Тестування обробки статусів

## Конфігурація

### Налаштування в monobank_config.py

```python
MONOBANK_CONFIG = {
    'api_url': 'https://api.monobank.ua/api/merchant/invoice/create',
    'token': 'your_token_here',
    'currency_code': 980,
    'redirect_url': 'https://your-domain.com/payment/success/',
    'webhook_url': 'https://your-domain.com/payment/webhook/',
    'validity_seconds': 86400,  # 24 години
    'payment_type': 'debit'
}
```

### Змінні середовища

```bash
export MONOBANK_TOKEN="your_production_token"
export MONOBANK_WEBHOOK_URL="https://your-domain.com/payment/webhook/"
export MONOBANK_REDIRECT_URL="https://your-domain.com/payment/success/"
```

## Моніторинг

### Метрики для відстеження

- Кількість створених рахунків
- Успішність створення
- Час відгуку API
- Помилки та їх типи
- Конверсія оплат

### Алерти

- Високий рівень помилок
- Повільний відгук API
- Недоступність Monobank API
- Проблеми з webhook

## Підтримка

### Документація Monobank
- [Офіційна документація](https://api.monobank.ua/)
- [Тестовий токен](https://api.monobank.ua/)

### Контакти
- [Monobank Support](https://web.monobank.ua/)
- [Технічна підтримка](mailto:support@monobank.ua)

## Оновлення

### Версіонування API
- Підтримка поточної версії API
- Автоматичне оновлення при змінах
- Backward compatibility

### Changelog
- v1.0 - Базова інтеграція
- v1.1 - Додано підтримку кошика
- v1.2 - Додано iFrame інтеграцію
- v1.3 - Додано синхронну оплату

## Підсумок

Система створення рахунків Monobank повністю інтегрована та готова до використання:

✅ **Повна підтримка API** - Всі можливості Monobank API  
✅ **Гнучкість** - Підтримка різних сценаріїв використання  
✅ **Безпека** - CSRF захист та валідація даних  
✅ **Моніторинг** - Логування та обробка помилок  
✅ **Тестування** - Автоматичні та ручні тести  
✅ **Документація** - Повна документація API  

Система готова для продакшн використання! 🚀
