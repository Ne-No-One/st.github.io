# Monobank Invoice Status API

## Огляд

Додано функціональність перевірки статусу рахунків через Monobank API. Це дозволяє відстежувати стан платежів у реальному часі та обробляти випадки, коли webhook не прийшов або потрібна синхронізація з боку продавця.

## API Endpoints

### GET /api/payment/status/{invoice_id}/

Отримання статусу рахунку через Monobank API.

**Параметри:**
- `invoice_id` (string) - Ідентифікатор рахунку

**Відповідь:**
```json
{
  "success": true,
  "status": "success",
  "invoiceId": "p2_9ZgpZVsl3",
  "amount": 4200,
  "ccy": 980,
  "finalAmount": 4200,
  "createdDate": "2024-12-29T10:30:00Z",
  "modifiedDate": "2024-12-29T10:35:00Z",
  "reference": "84d0070ee4e44667b31371d8f8813947",
  "destination": "Покупка щастя",
  "failureReason": null,
  "errCode": null,
  "paymentInfo": {
    "maskedPan": "444403******1902",
    "approvalCode": "662476",
    "rrn": "060189181768",
    "tranId": "13194036",
    "terminal": "MI001088",
    "bank": "Універсал Банк",
    "paymentSystem": "visa",
    "paymentMethod": null,
    "fee": null,
    "country": "804",
    "agentFee": null
  },
  "walletData": {
    "cardToken": "67XZtXdR4NpKU3",
    "walletId": "c1376a611e17b059aeaf96b73258da9c",
    "status": "success"
  },
  "tipsInfo": {
    "employeeId": null,
    "amount": 4200
  },
  "cancelList": []
}
```

**Коди статусів:**
- `success` - Платіж успішний
- `failure` - Платіж невдалий
- `processing` - Платіж в обробці
- `expired` - Платіж прострочений
- `null` - Статус невідомий

### GET /payment/status/

Сторінка для введення ID рахунку та перевірки статусу.

### GET /payment/status/{invoice_id}/

Сторінка з детальною інформацією про статус замовлення.

## JavaScript API

### checkInvoiceStatus(invoiceId)

Асинхронна функція для перевірки статусу рахунку.

```javascript
const result = await checkInvoiceStatus('p2_9ZgpZVsl3');

if (result.success) {
    console.log('Статус:', result.status);
    console.log('Дані:', result.data);
} else {
    console.error('Помилка:', result.error);
}
```

### showInvoiceStatusModal(invoiceId)

Відображення статусу рахунку в модальному вікні.

```javascript
showInvoiceStatusModal('p2_9ZgpZVsl3');
```

### getStatusText(status)

Отримання читабельного тексту статусу.

```javascript
const statusText = getStatusText('success'); // "Оплачено"
const statusText = getStatusText('failure'); // "Помилка оплати"
```

## Сторінка статусу замовлення

### Функціональність

1. **Форма пошуку** - Введення ID рахунку для перевірки
2. **Детальна інформація** - Повна інформація про замовлення
3. **Інформація про платіж** - Дані про картку, банк, платіжну систему
4. **Оновлення статусу** - Кнопка для перевірки актуального статусу

### Відображення статусів

- ✅ **Успішний платіж** - Зелена іконка, деталі платежу
- ❌ **Невдалий платіж** - Червона іконка, причина помилки
- ⏳ **Обробка** - Помаранчева іконка, індикатор завантаження
- ❓ **Невідомий** - Сіра іконка, загальна інформація

## Використання

### 1. Перевірка статусу через API

```python
import requests

response = requests.get(
    'https://yoursite.com/api/payment/status/p2_9ZgpZVsl3/',
    headers={'X-Token': 'your_monobank_token'}
)

status_data = response.json()
```

### 2. Відображення статусу на сторінці

```html
<a href="/payment/status/p2_9ZgpZVsl3/" class="status-link">
    Перевірити статус замовлення
</a>
```

### 3. JavaScript інтеграція

```javascript
// Перевірка статусу при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    const invoiceId = getInvoiceIdFromUrl(); // Ваша логіка
    if (invoiceId) {
        checkInvoiceStatus(invoiceId).then(result => {
            updateStatusDisplay(result);
        });
    }
});
```

## Обробка помилок

### API помилки

- **404** - Рахунок не знайдено
- **403** - Невірний токен
- **400** - Невірні параметри
- **500** - Внутрішня помилка сервера

### JavaScript помилки

```javascript
const result = await checkInvoiceStatus('invalid_id');

if (!result.success) {
    switch (result.error) {
        case 'INVOICE_NOT_FOUND':
            showError('Рахунок не знайдено');
            break;
        case 'Помилка з\'єднання з сервером':
            showError('Перевірте підключення до інтернету');
            break;
        default:
            showError(result.error);
    }
}
```

## Налаштування

### Змінні середовища

```bash
# Токен Monobank (автоматично використовується з monobank_config.py)
MONOBANK_PRODUCTION_TOKEN=your_production_token
MONOBANK_TEST_TOKEN=your_test_token
```

### Конфігурація

Файл `monobank_config.py` автоматично налаштовує URL для API статусу:

```python
MONOBANK_CONFIG = {
    'status_url': 'https://api.monobank.ua/api/merchant/invoice/status',
    # ... інші налаштування
}
```

## Тестування

Запустіть тестовий скрипт для перевірки функціональності:

```bash
python test_monobank_integration.py
```

Тести перевіряють:
- ✅ Конфігурацію Monobank
- ✅ Django views
- ✅ URL маршрути
- ✅ Шаблони
- ✅ JavaScript функції
- ✅ API статусу

## Безпека

1. **CSRF Protection** - Всі POST запити захищені
2. **Token Validation** - Токени Monobank перевіряються
3. **Input Validation** - ID рахунку валідується
4. **Error Handling** - Безпечна обробка помилок

## Логування

Всі операції логуються в Django logs:

```python
logger.info(f'Checking invoice status: {invoice_id}')
logger.error(f'Invoice status API error: {response.status_code}')
```

## Приклади використання

### 1. Адмін-панель

```python
def check_order_status(request, order_id):
    invoice_id = get_invoice_id_for_order(order_id)
    status = check_invoice_status(invoice_id)
    return render(request, 'admin/order_status.html', {
        'status': status
    })
```

### 2. Email повідомлення

```python
def send_status_update(invoice_id, customer_email):
    status = check_invoice_status(invoice_id)
    if status['status'] == 'success':
        send_payment_confirmation(customer_email, status)
```

### 3. Автоматична перевірка

```python
# Celery task для періодичної перевірки
@periodic_task(run_every=crontab(minute='*/5'))
def check_pending_invoices():
    pending_invoices = get_pending_invoices()
    for invoice in pending_invoices:
        status = check_invoice_status(invoice.id)
        if status['status'] in ['success', 'failure']:
            update_order_status(invoice.order_id, status['status'])
```

## Підтримка

Для отримання підтримки:
1. Перевірте логи Django
2. Перевірте статус Monobank API
3. Зверніться до [Monobank Support](https://web.monobank.ua/)

## Оновлення

При оновленні Monobank API:
1. Оновіть `monobank_config.py`
2. Перевірте сумісність з новою версією
3. Протестуйте всі функції
4. Оновіть документацію
