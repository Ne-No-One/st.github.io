# Monobank Invoice Invalidation System

## Огляд

Система інвалідації (деактивації) рахунків через Monobank API дозволяє скасовувати неоплачені рахунки без повернення коштів. Це корисно для випадків, коли замовлення скасовано або товар недоступний, але оплата ще не була здійснена.

## API Endpoints

### POST /api/payment/invalidate/

Інвалідація рахунку через Monobank API.

**Request Body:**
```json
{
  "invoiceId": "p2_9ZgpZVsl3"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Рахунок успішно деактивовано"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Помилка інвалідації рахунку",
  "errorCode": "BAD_REQUEST",
  "errorText": "empty 'invoiceId'",
  "details": "Детальний опис помилки"
}
```

### GET /payment/invalidate/

Форма для введення ID рахунку та інвалідації замовлення.

### GET /payment/invalidate/{invoice_id}/

Сторінка підтвердження інвалідації з деталями замовлення.

## Сторінки інвалідації

### 1. Форма інвалідації (`/payment/invalidate/`)

- **Функціональність:**
  - Введення ID рахунку
  - Вибір причини інвалідації
  - Додавання коментарів
  - Підтвердження згоди

- **Причини інвалідації:**
  - Запит клієнта
  - Замовлення скасовано
  - Товар недоступний
  - Дублювання замовлення
  - Рахунок прострочений
  - Інша причина

### 2. Підтвердження інвалідації (`/payment/invalidate/{invoice_id}/`)

- **Функціональність:**
  - Відображення попередження
  - Інформація про рахунок
  - Остаточне підтвердження

### 3. Успішна інвалідація (`/payment/invalidate/success/{invoice_id}/`)

- **Функціональність:**
  - Підтвердження інвалідації
  - Деталі операції
  - Наступні кроки
  - Навігація

### 4. Помилка інвалідації (`/payment/invalidate/failure/{invoice_id}/`)

- **Функціональність:**
  - Відображення помилки
  - Деталі проблеми
  - Можливі рішення
  - Повторна спроба

## JavaScript API

### invalidateInvoice(invoiceId)

Асинхронна функція для інвалідації рахунку.

```javascript
const result = await invalidateInvoice('p2_9ZgpZVsl3');

if (result.success) {
    console.log('Інвалідація успішна:', result.message);
} else {
    console.error('Помилка інвалідації:', result.error);
}
```

### showInvalidateModal(invoiceId)

Відображення модального вікна для інвалідації.

```javascript
showInvalidateModal('p2_9ZgpZVsl3');
```

### submitInvalidateForm(event, invoiceId)

Обробка форми інвалідації з валідацією.

```javascript
// Автоматично викликається при відправці форми
// Включає валідацію та підтвердження
```

## Процес інвалідації

### 1. Ініціація інвалідації

```javascript
// Відкриття модального вікна
showInvalidateModal('p2_9ZgpZVsl3');

// Або перехід на сторінку
window.location.href = '/payment/invalidate/p2_9ZgpZVsl3/';
```

### 2. Валідація та підтвердження

- Перевірка обов'язкових полів
- Підтвердження згоди користувача
- Остаточне підтвердження дії

### 3. Обробка через API

```javascript
const invalidateData = {
    invoiceId: 'p2_9ZgpZVsl3'
};

const response = await fetch('/api/payment/invalidate/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify(invalidateData)
});
```

### 4. Обробка результату

- **Успіх:** Перенаправлення на сторінку підтвердження
- **Помилка:** Відображення деталей помилки з можливістю повторної спроби

## Обробка помилок

### Коди помилок Monobank

- **BAD_REQUEST** - Невірний запит
- **FORBIDDEN** - Невірний токен
- **NOT_FOUND** - Рахунок не знайдено
- **METHOD_NOT_ALLOWED** - Невірний HTTP метод
- **TMR** - Занадто багато запитів
- **INTERNAL_ERROR** - Внутрішня помилка сервера

### Обробка в JavaScript

```javascript
const result = await invalidateInvoice('p2_9ZgpZVsl3');

if (!result.success) {
    switch (result.errorCode) {
        case 'BAD_REQUEST':
            showError('Невірний запит');
            break;
        case 'NOT_FOUND':
            showError('Рахунок не знайдено');
            break;
        default:
            showError(result.error);
    }
}
```

## Відмінності від скасування

### Інвалідація (Deactivation)
- ✅ Для неоплачених рахунків
- ✅ Без повернення коштів
- ✅ Рахунок стає недоступним
- ✅ Швидка операція

### Скасування (Cancellation)
- ✅ Для оплачених рахунків
- ✅ З поверненням коштів
- ✅ Повний процес повернення
- ✅ Складніша операція

## Безпека

### 1. Валідація даних

- Перевірка формату ID рахунку
- Валідація статусу рахунку
- Перевірка обов'язкових полів

### 2. Підтвердження дій

- Подвійне підтвердження інвалідації
- Попередження про незворотність дії
- Логування всіх операцій

### 3. CSRF захист

- Всі POST запити захищені CSRF токенами
- Перевірка токенів на сервері

## Логування

### Django Logs

```python
logger.info(f'Invalidating invoice: {invoice_id}')
logger.error(f'Invalidate API error: {response.status_code}')
logger.warning(f'Invalidate failed: {error_code}')
```

### JavaScript Console

```javascript
console.log('Initiating invalidation for:', invoiceId);
console.error('Invalidate error:', error);
console.info('Invalidate successful:', result);
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
2. **Інвалідація через форму**
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
    'invalidate_url': 'https://api.monobank.ua/api/merchant/invoice/remove',
    # ... інші налаштування
}
```

## Приклади використання

### 1. Адмін-панель

```python
def invalidate_order(request, order_id):
    invoice_id = get_invoice_id_for_order(order_id)
    result = invalidate_invoice(invoice_id)
    
    if result.success:
        messages.success(request, 'Замовлення деактивовано')
    else:
        messages.error(request, f'Помилка: {result.error}')
    
    return redirect('orders_list')
```

### 2. API інтеграція

```python
# Інвалідація зовнішньою системою
response = requests.post(
    'https://yoursite.com/api/payment/invalidate/',
    json={'invoiceId': 'p2_9ZgpZVsl3'},
    headers={'Authorization': 'Bearer your_token'}
)
```

### 3. Автоматична інвалідація

```python
# Celery task для автоматичної інвалідації
@task
def auto_invalidate_expired_orders():
    expired_orders = get_expired_unpaid_orders()
    for order in expired_orders:
        invalidate_invoice(order.invoice_id)
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
3. Протестуйте всі функції інвалідації
4. Оновіть документацію

## Повний цикл управління платежами

Система тепер надає **повний цикл управління платежами**:

1. **Створення рахунку** → 2. **Оплата** → 3. **Webhook обробка** → 4. **Перевірка статусу** → 5. **Скасування з поверненням** → 6. **Інвалідація без повернення** → 7. **Відстеження замовлення**

### Вибір між скасуванням та інвалідацією

- **Скасування:** Якщо рахунок оплачений → повернення коштів
- **Інвалідація:** Якщо рахунок не оплачений → деактивація без повернення
