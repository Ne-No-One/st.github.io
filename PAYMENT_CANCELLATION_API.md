# Monobank Payment Cancellation System

## Огляд

Система скасування платежів через Monobank API дозволяє повертати кошти клієнтам та скасовувати замовлення з повним контролем процесу та валідацією.

## API Endpoints

### POST /api/payment/cancel/

Скасування рахунку через Monobank API.

**Request Body:**
```json
{
  "invoiceId": "p2_9ZgpZVsl3",
  "extRef": "635ace02599849e981b2cd7a65f417fe",
  "amount": 5000,
  "items": [
    {
      "name": "Табуретка",
      "qty": 2,
      "sum": 2100,
      "code": "d21da1c47f3c45fca10a10c32518bdeb",
      "barcode": "3b2a558cc6e44e218cdce301d80a1779",
      "header": "Хідер",
      "footer": "Футер",
      "tax": null,
      "uktzed": "uktzedcode"
    }
  ]
}
```

**Response (Success):**
```json
{
  "success": true,
  "status": "success",
  "createdDate": "2024-12-29T10:30:00Z",
  "modifiedDate": "2024-12-29T10:35:00Z",
  "message": "Рахунок успішно скасовано"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Помилка скасування рахунку",
  "errorCode": "CANCEL_NOT_AVAILABLE",
  "errorText": "Неможливо скасувати оплату",
  "details": "Детальний опис помилки"
}
```

### GET /payment/cancel/

Форма для введення ID рахунку та скасування замовлення.

### GET /payment/cancel/{invoice_id}/

Сторінка підтвердження скасування з деталями замовлення.

## Сторінки скасування

### 1. Форма скасування (`/payment/cancel/`)

- **Функціональність:**
  - Введення ID рахунку
  - Вибір причини скасування
  - Додавання коментарів
  - Підтвердження згоди

- **Причини скасування:**
  - Запит клієнта
  - Товар недоступний
  - Помилка оплати
  - Дублювання замовлення
  - Інша причина

### 2. Підтвердження скасування (`/payment/cancel/{invoice_id}/`)

- **Функціональність:**
  - Відображення попередження
  - Введення референсу операції
  - Вказання суми повернення
  - Остаточне підтвердження

### 3. Успішне скасування (`/payment/cancel/success/{invoice_id}/`)

- **Функціональність:**
  - Підтвердження скасування
  - Деталі операції
  - Наступні кроки
  - Навігація

### 4. Помилка скасування (`/payment/cancel/failure/{invoice_id}/`)

- **Функціональність:**
  - Відображення помилки
  - Деталі проблеми
  - Можливі рішення
  - Повторна спроба

## JavaScript API

### cancelInvoice(invoiceId, extRef, amount)

Асинхронна функція для скасування рахунку.

```javascript
const result = await cancelInvoice('p2_9ZgpZVsl3', 'ref123', 5000);

if (result.success) {
    console.log('Скасування успішне:', result.message);
} else {
    console.error('Помилка скасування:', result.error);
}
```

### showCancelModal(invoiceId)

Відображення модального вікна для скасування.

```javascript
showCancelModal('p2_9ZgpZVsl3');
```

### submitCancelForm(event, invoiceId)

Обробка форми скасування з валідацією.

```javascript
// Автоматично викликається при відправці форми
// Включає валідацію та підтвердження
```

## Процес скасування

### 1. Ініціація скасування

```javascript
// Відкриття модального вікна
showCancelModal('p2_9ZgpZVsl3');

// Або перехід на сторінку
window.location.href = '/payment/cancel/p2_9ZgpZVsl3/';
```

### 2. Валідація та підтвердження

- Перевірка обов'язкових полів
- Підтвердження згоди користувача
- Остаточне підтвердження дії

### 3. Обробка через API

```javascript
const cancelData = {
    invoiceId: 'p2_9ZgpZVsl3',
    extRef: 'internal_ref_123',
    amount: 5000,
    items: [
        {
            name: 'Товар',
            qty: 1,
            sum: 5000,
            code: 'item_code'
        }
    ]
};

const response = await fetch('/api/payment/cancel/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify(cancelData)
});
```

### 4. Обробка результату

- **Успіх:** Перенаправлення на сторінку підтвердження
- **Помилка:** Відображення деталей помилки з можливістю повторної спроби

## Обробка помилок

### Коди помилок Monobank

- **FORBIDDEN** - Невірний токен
- **NOT_FOUND** - Рахунок не знайдено
- **CANCEL_NOT_AVAILABLE** - Неможливо скасувати оплату
- **TMR** - Занадто багато запитів
- **INTERNAL_ERROR** - Внутрішня помилка сервера

### Обробка в JavaScript

```javascript
const result = await cancelInvoice('p2_9ZgpZVsl3');

if (!result.success) {
    switch (result.errorCode) {
        case 'CANCEL_NOT_AVAILABLE':
            showError('Неможливо скасувати це замовлення');
            break;
        case 'NOT_FOUND':
            showError('Замовлення не знайдено');
            break;
        default:
            showError(result.error);
    }
}
```

## Безпека

### 1. Валідація даних

- Перевірка формату ID рахунку
- Валідація суми повернення
- Перевірка обов'язкових полів

### 2. Підтвердження дій

- Подвійне підтвердження скасування
- Попередження про незворотність дії
- Логування всіх операцій

### 3. CSRF захист

- Всі POST запити захищені CSRF токенами
- Перевірка токенів на сервері

## Логування

### Django Logs

```python
logger.info(f'Canceling invoice: {invoice_id}')
logger.error(f'Cancel API error: {response.status_code}')
logger.warning(f'Cancel failed: {error_code}')
```

### JavaScript Console

```javascript
console.log('Initiating cancellation for:', invoiceId);
console.error('Cancel error:', error);
console.info('Cancel successful:', result);
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

### Ручне тестування

1. **Створення тестового замовлення**
2. **Скасування через форму**
3. **Перевірка статусу**
4. **Тестування помилок**

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
    'cancel_url': 'https://api.monobank.ua/api/merchant/invoice/cancel',
    # ... інші налаштування
}
```

## Приклади використання

### 1. Адмін-панель

```python
def cancel_order(request, order_id):
    invoice_id = get_invoice_id_for_order(order_id)
    result = cancel_invoice(invoice_id)
    
    if result.success:
        messages.success(request, 'Замовлення скасовано')
    else:
        messages.error(request, f'Помилка: {result.error}')
    
    return redirect('orders_list')
```

### 2. API інтеграція

```python
# Скасування зовнішньою системою
response = requests.post(
    'https://yoursite.com/api/payment/cancel/',
    json={
        'invoiceId': 'p2_9ZgpZVsl3',
        'extRef': 'external_system_ref'
    },
    headers={'Authorization': 'Bearer your_token'}
)
```

### 3. Автоматичне скасування

```python
# Celery task для автоматичного скасування
@task
def auto_cancel_expired_orders():
    expired_orders = get_expired_orders()
    for order in expired_orders:
        if order.payment_status == 'pending':
            cancel_invoice(order.invoice_id)
```

## Підтримка

### Налагодження

1. Перевірте логи Django
2. Перевірте статус Monobank API
3. Перевірте валідність токенів
4. Перевірте формат даних

### Контакти

- [Monobank Support](https://web.monobank.ua/)
- Внутрішня підтримка: support@yoursite.com

## Оновлення

При оновленні Monobank API:

1. Оновіть `monobank_config.py`
2. Перевірте сумісність з новою версією
3. Протестуйте всі функції скасування
4. Оновіть документацію
