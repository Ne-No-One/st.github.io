# Налаштування Monobank Payment Gateway

## Огляд

Система інтегрована з Monobank API для обробки онлайн платежів. Підтримує створення рахунків, обробку webhook'ів та відображення сторінок успіху/помилки.

## Функціональність

- ✅ Створення рахунку для оплати через Monobank API
- ✅ Підтримка різних способів оплати (картка, Apple Pay, Google Pay)
- ✅ Webhook обробка статусів платежів
- ✅ Сторінки успішної та невдалої оплати
- ✅ Валідація форми замовлення
- ✅ Згода з умовами обробки даних

## Налаштування

### 1. Отримання токенів Monobank

1. Зареєструйтеся в [Monobank Business](https://web.monobank.ua/)
2. Отримайте тестовий токен з [API документації](https://api.monobank.ua/)
3. Для продакшну отримайте production токен

### 2. Налаштування змінних середовища

Створіть файл `.env` або встановіть змінні середовища:

```bash
# Тестовий токен Monobank
MONOBANK_TEST_TOKEN=your_test_token_here

# Production токен Monobank (для продакшну)
MONOBANK_PRODUCTION_TOKEN=your_production_token_here

# URL сайту (для webhook'ів)
SITE_URL=https://yourdomain.com
```

### 3. Оновлення конфігурації

Файл `monobank_config.py` автоматично використовує змінні середовища:

```python
# Для тестового середовища
MONOBANK_CONFIG = {
    'token': os.getenv('MONOBANK_TEST_TOKEN', 'test_token'),
    # ...
}

# Для продакшну
MONOBANK_CONFIG = {
    'token': os.getenv('MONOBANK_PRODUCTION_TOKEN', ''),
    # ...
}
```

## API Endpoints

### POST /payment/create-invoice/

Створює рахунок для оплати через Monobank.

**Request Body:**
```json
{
    "amount": 4200,
    "items": [
        {
            "title": "Букет квітів",
            "price": 2100,
            "quantity": 2
        }
    ],
    "customer": {
        "firstName": "Іван",
        "lastName": "Петренко",
        "phone": "+380123456789",
        "email": "ivan@example.com"
    },
    "delivery": {
        "city": "Київ",
        "address": "вул. Хрещатик, 1"
    }
}
```

**Response:**
```json
{
    "success": true,
    "invoiceId": "p2_9ZgpZVsl3",
    "pageUrl": "https://pay.mbnk.biz/p2_9ZgpZVsl3"
}
```

### POST /payment/webhook/

Webhook для обробки статусів платежів від Monobank.

**Webhook Data:**
```json
{
    "invoiceId": "p2_9ZgpZVsl3",
    "status": "success",
    "amount": 4200,
    "ccy": 980,
    "createdDate": "2024-12-29T10:30:00Z",
    "modifiedDate": "2024-12-29T10:35:00Z"
}
```

### GET /payment/success/

Сторінка успішної оплати.

### GET /payment/failure/

Сторінка невдалої оплати.

## Структура файлів

```
├── main/
│   └── payment_views.py          # Django views для платіжної системи
├── templates/
│   └── payment/
│       ├── success.html          # Сторінка успішної оплати
│       └── failure.html          # Сторінка невдалої оплати
├── static/js/
│   └── cart.js                   # JavaScript для обробки онлайн оплати
├── monobank_config.py            # Конфігурація Monobank API
└── mysite/urls.py               # URL маршрути
```

## Тестування

### 1. Тестовий режим

Для тестування використовуйте тестовий токен Monobank. Всі платежі будуть симульовані.

### 2. Перевірка webhook'ів

Для локального тестування webhook'ів використовуйте ngrok:

```bash
# Встановіть ngrok
npm install -g ngrok

# Запустіть ngrok
ngrok http 8000

# Оновіть SITE_URL в конфігурації
SITE_URL=https://your-ngrok-url.ngrok.io
```

### 3. Логування

Всі операції логуються в Django logs:

```python
logger.info(f'Monobank webhook received: {data}')
logger.error(f'Monobank API error: {response.status_code}')
```

## Безпека

1. **CSRF Protection**: Всі POST запити захищені CSRF токенами
2. **Token Security**: Токени Monobank зберігаються в змінних середовища
3. **Webhook Validation**: Webhook'и перевіряються на валідність
4. **HTTPS Only**: В продакшні використовуйте тільки HTTPS

## Помилки та вирішення

### Помилка 403: Токен невалідний
- Перевірте правильність токена Monobank
- Переконайтеся, що токен активний

### Помилка 400: Невірні параметри
- Перевірте формат даних в запиті
- Переконайтеся, що сума в копійках

### Webhook не приходить
- Перевірте URL webhook'а
- Переконайтеся, що сервер доступний з інтернету
- Перевірте логування на помилки

## Підтримка

Для отримання підтримки:
1. Перевірте логи Django
2. Перевірте статус Monobank API
3. Зверніться до [Monobank Support](https://web.monobank.ua/)

## Оновлення

При оновленні API Monobank:
1. Оновіть `monobank_config.py`
2. Перевірте сумісність з новою версією API
3. Протестуйте всі функції
4. Оновіть документацію
