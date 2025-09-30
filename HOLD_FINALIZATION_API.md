# Monobank Hold Finalization System

## Огляд

Система фіналізації холду через Monobank API дозволяє завершувати блокування коштів та переводити їх у статус сплачених. Це важливо для завершення операцій холду, коли кошти були заблоковані, але потрібно їх фіналізувати.

## API Endpoints

### POST /api/payment/finalize/

Фіналізація холду через Monobank API.

**Request Body:**
```json
{
  "invoiceId": "p2_9ZgpZVsl3",
  "amount": 4200,
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
  "message": "Холд успішно фіналізовано"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Помилка фіналізації холду",
  "errorCode": "BAD_REQUEST",
  "errorText": "empty 'invoiceId'",
  "details": "Детальний опис помилки"
}
```

### GET /payment/finalize/

Форма для введення ID рахунку та фіналізації холду.

### GET /payment/finalize/{invoice_id}/

Сторінка підтвердження фіналізації з деталями холду.

## Сторінки фіналізації

### 1. Форма фіналізації (`/payment/finalize/`)

- **Функціональність:**
  - Введення ID рахунку
  - Вказання фінальної суми (опціонально)
  - Вибір причини фіналізації
  - Додавання коментарів
  - Підтвердження згоди

- **Причини фіналізації:**
  - Замовлення виконано
  - Доставка підтверджена
  - Послуга надана
  - Часткова оплата
  - Інша причина

### 2. Підтвердження фіналізації (`/payment/finalize/{invoice_id}/`)

- **Функціональність:**
  - Відображення попередження
  - Інформація про холд
  - Вказання фінальної суми
  - Остаточне підтвердження

### 3. Успішна фіналізація (`/payment/finalize/success/{invoice_id}/`)

- **Функціональність:**
  - Підтвердження фіналізації
  - Деталі операції
  - Наступні кроки
  - Навігація

### 4. Помилка фіналізації (`/payment/finalize/failure/{invoice_id}/`)

- **Функціональність:**
  - Відображення помилки
  - Деталі проблеми
  - Можливі рішення
  - Повторна спроба

## JavaScript API

### finalizeHold(invoiceId, amount, items)

Асинхронна функція для фіналізації холду.

```javascript
const result = await finalizeHold('p2_9ZgpZVsl3', 4200, items);

if (result.success) {
    console.log('Фіналізація успішна:', result.message);
} else {
    console.error('Помилка фіналізації:', result.error);
}
```

### showFinalizeModal(invoiceId)

Відображення модального вікна для фіналізації.

```javascript
showFinalizeModal('p2_9ZgpZVsl3');
```

### submitFinalizeForm(event, invoiceId)

Обробка форми фіналізації з валідацією.

```javascript
// Автоматично викликається при відправці форми
// Включає валідацію та підтвердження
```

## Процес фіналізації

### 1. Ініціація фіналізації

```javascript
// Відкриття модального вікна
showFinalizeModal('p2_9ZgpZVsl3');

// Або перехід на сторінку
window.location.href = '/payment/finalize/p2_9ZgpZVsl3/';
```

### 2. Валідація та підтвердження

- Перевірка обов'язкових полів
- Підтвердження згоди користувача
- Остаточне підтвердження дії

### 3. Обробка через API

```javascript
const finalizeData = {
    invoiceId: 'p2_9ZgpZVsl3',
    amount: 4200,
    items: [
        {
            name: 'Товар',
            qty: 1,
            sum: 4200,
            code: 'item_code'
        }
    ]
};

const response = await fetch('/api/payment/finalize/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify(finalizeData)
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
- **HOLD_INVOICE_NOT_FINALIZED** - Холд ще не фіналізовано

### Обробка в JavaScript

```javascript
const result = await finalizeHold('p2_9ZgpZVsl3');

if (!result.success) {
    switch (result.errorCode) {
        case 'BAD_REQUEST':
            showError('Невірний запит');
            break;
        case 'NOT_FOUND':
            showError('Рахунок не знайдено');
            break;
        case 'HOLD_INVOICE_NOT_FINALIZED':
            showError('Холд ще не фіналізовано');
            break;
        default:
            showError(result.error);
    }
}
```

## Відмінності від інших операцій

### Фіналізація холду (Finalization)
- ✅ Для рахунків з типом "hold"
- ✅ Завершує блокування коштів
- ✅ Кошти списуються остаточно
- ✅ Можна вказати фінальну суму

### Скасування (Cancellation)
- ✅ Для оплачених рахунків
- ✅ З поверненням коштів
- ✅ Повний процес повернення

### Інвалідація (Invalidation)
- ✅ Для неоплачених рахунків
- ✅ Без повернення коштів
- ✅ Рахунок стає недоступним

## Безпека

### 1. Валідація даних

- Перевірка формату ID рахунку
- Валідація суми фіналізації
- Перевірка типу рахунку (hold)
- Перевірка обов'язкових полів

### 2. Підтвердження дій

- Подвійне підтвердження фіналізації
- Попередження про незворотність дії
- Логування всіх операцій

### 3. CSRF захист

- Всі POST запити захищені CSRF токенами
- Перевірка токенів на сервері

## Логування

### Django Logs

```python
logger.info(f'Finalizing hold: {invoice_id}')
logger.error(f'Finalize API error: {response.status_code}')
logger.warning(f'Finalize failed: {error_code}')
```

### JavaScript Console

```javascript
console.log('Initiating finalization for:', invoiceId);
console.error('Finalize error:', error);
console.info('Finalize successful:', result);
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

1. **Створення тестового холду**
2. **Фіналізація через форму**
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
    'finalize_url': 'https://api.monobank.ua/api/merchant/invoice/finalize',
    # ... інші налаштування
}
```

## Приклади використання

### 1. Адмін-панель

```python
def finalize_order(request, order_id):
    invoice_id = get_invoice_id_for_order(order_id)
    result = finalize_hold(invoice_id)
    
    if result.success:
        messages.success(request, 'Холд фіналізовано')
    else:
        messages.error(request, f'Помилка: {result.error}')
    
    return redirect('orders_list')
```

### 2. API інтеграція

```python
# Фіналізація зовнішньою системою
response = requests.post(
    'https://yoursite.com/api/payment/finalize/',
    json={
        'invoiceId': 'p2_9ZgpZVsl3',
        'amount': 4200
    },
    headers={'Authorization': 'Bearer your_token'}
)
```

### 3. Автоматична фіналізація

```python
# Celery task для автоматичної фіналізації
@task
def auto_finalize_holds():
    completed_orders = get_completed_hold_orders()
    for order in completed_orders:
        finalize_hold(order.invoice_id)
```

## Підтримка

### Налагодження

1. Перевірте логи Django
2. Перевірте статус Monobank API
3. Перевірте валідність токенів
4. Перевірте тип рахунку (hold)

### Контакти

- [Monobank Support](https://web.monobank.ua/)
- Внутрішня підтримка: support@yoursite.com

## Оновлення

При оновленні Monobank API:

1. Оновіть `monobank_config.py`
2. Перевірте сумісність з новою версією
3. Протестуйте всі функції фіналізації
4. Оновіть документацію

## Повний цикл управління платежами

Система тепер надає **повний цикл управління платежами**:

1. **Створення рахунку** → 2. **Оплата** → 3. **Webhook обробка** → 4. **Перевірка статусу** → 5. **Скасування з поверненням** → 6. **Інвалідація без повернення** → 7. **Фіналізація холду** → 8. **Відстеження замовлення**

### Вибір між операціями

- **Скасування:** Якщо рахунок оплачений → повернення коштів
- **Інвалідація:** Якщо рахунок не оплачений → деактивація без повернення
- **Фіналізація:** Якщо рахунок типу "hold" → завершення блокування коштів
