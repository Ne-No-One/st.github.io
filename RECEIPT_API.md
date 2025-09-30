# Monobank Receipt System

## Огляд

Система квитанцій через Monobank API дозволяє клієнтам отримувати PDF квитанції про оплату та надсилати їх на електронну пошту. Це забезпечує повну документацію платежів для звітності та архівування.

## API Endpoints

### GET /api/payment/receipt/{invoice_id}/

Отримання квитанції через Monobank API.

**Query Parameters:**
- `email` (optional) - Адреса електронної пошти для надсилання квитанції

**Response (Success):**
```json
{
  "success": true,
  "file": "CJFVBERi0xLj4QKJaqrrK0KMSAw123I4G9ia3go38PAovQ43JlYXRvciAoQXBhY2hl5IEZPFCBWZXJzaW9uIfDIuMykKL...",
  "message": "Квитанція успішно отримана"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Помилка отримання квитанції",
  "errorCode": "NOT_FOUND",
  "errorText": "Рахунок не знайдено",
  "details": "Детальний опис помилки"
}
```

### GET /payment/receipt/{invoice_id}/download/

Завантаження квитанції як PDF файл.

**Response:** PDF файл з заголовком `Content-Disposition: attachment; filename="receipt_{invoice_id}.pdf"`

### GET /payment/receipt/

Сторінка форми для отримання квитанцій.

### GET /payment/receipt/{invoice_id}/

Сторінка форми для отримання квитанції конкретного рахунку.

## Сторінки квитанцій

### 1. Форма отримання квитанції (`/payment/receipt/`)

- **Функціональність:**
  - Введення ID рахунку
  - Введення email для надсилання (опціонально)
  - Валідація даних
  - Підтвердження обробки персональних даних

- **Поля форми:**
  - **ID рахунку** - ідентифікатор рахунку Monobank
  - **Email** - адреса для надсилання квитанції (опціонально)

### 2. Успішне отримання квитанції (`/payment/receipt/{invoice_id}/`)

- **Функціональність:**
  - Відображення деталей квитанції
  - Кнопки завантаження та перегляду
  - Інформація про email (якщо вказано)
  - Навігаційні кнопки

### 3. Помилка отримання квитанції (`/payment/receipt/{invoice_id}/`)

- **Функціональність:**
  - Відображення деталей помилки
  - Коди помилок та їх описи
  - Можливі рішення проблем
  - Кнопки для повторної спроби

## Процес отримання квитанції

### 1. Введення даних

```javascript
// Клієнт заповнює форму
const formData = {
    invoiceId: 'p2_9ZgpZVsl3',
    email: 'customer@example.com'
};
```

### 2. Валідація

```javascript
// Перевірка обов'язкових полів
if (!invoiceId) {
    alert('Введіть ID рахунку');
    return;
}

if (!agreeTerms) {
    alert('Погодьтеся з обробкою персональних даних');
    return;
}
```

### 3. Відправка запиту

```javascript
// GET запит до API
const response = await fetch(`/api/payment/receipt/${invoiceId}/?email=${email}`);
const result = await response.json();
```

### 4. Обробка відповіді

```javascript
if (result.success) {
    // Успішне отримання квитанції
    window.location.href = `/payment/receipt/${invoiceId}/success/`;
} else {
    // Помилка отримання
    window.location.href = `/payment/receipt/${invoiceId}/error/`;
}
```

## Завантаження PDF

### Пряме завантаження

```javascript
// Завантаження PDF файлу
window.open(`/payment/receipt/${invoiceId}/download/`, '_blank');
```

### Перегляд в браузері

```javascript
// Відкриття PDF в новій вкладці
function viewReceipt() {
    window.open(`/payment/receipt/${invoiceId}/download/`, '_blank');
}
```

## Обробка PDF файлів

### Base64 декодування

```python
import base64

# Декодування base64 файлу
pdf_data = base64.b64decode(receipt_data['file'])

# Створення HTTP відповіді з PDF файлом
response = HttpResponse(pdf_data, content_type='application/pdf')
response['Content-Disposition'] = f'attachment; filename="receipt_{invoice_id}.pdf"'
return response
```

### MIME типи

```python
# Правильний MIME тип для PDF
content_type='application/pdf'

# Заголовок для завантаження
'Content-Disposition': 'attachment; filename="receipt_{invoice_id}.pdf"'
```

## Обробка помилок

### Коди помилок Monobank

- **BAD_REQUEST** - Невірний запит
- **NOT_FOUND** - Рахунок не знайдено
- **FORBIDDEN** - Невірний токен
- **TMR** - Занадто багато запитів
- **INTERNAL_ERROR** - Внутрішня помилка сервера

### Обробка в Django

```python
if response.status_code == 200:
    result = response.json()
    return JsonResponse({
        'success': True,
        'file': result.get('file'),
        'message': 'Квитанція успішно отримана'
    })
else:
    error_data = response.json()
    return JsonResponse({
        'success': False,
        'error': 'Помилка отримання квитанції',
        'errorCode': error_data.get('errCode'),
        'errorText': error_data.get('errText')
    }, status=400)
```

## Безпека

### 1. Валідація даних

```python
# Перевірка ID рахунку
if not invoice_id or len(invoice_id) < 3:
    return JsonResponse({'error': 'Невірний ID рахунку'}, status=400)

# Перевірка email
if email and not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
    return JsonResponse({'error': 'Невірний email'}, status=400)
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
logger.info(f'Receipt requested for invoice: {invoice_id}')
logger.error(f'Receipt API error: {response.status_code}')
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
- ✅ PDF генерацію

### Ручне тестування

1. **Тестовий ID рахунку:** p2_9ZgpZVsl3
2. **Тестовий email:** test@example.com
3. **Очікуваний результат:** PDF квитанція або помилка

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
    'receipt_url': 'https://api.monobank.ua/api/merchant/invoice/receipt',
    # ... інші налаштування
}
```

## Приклади використання

### 1. Отримання квитанції без email

```bash
curl -X GET "https://yoursite.com/api/payment/receipt/p2_9ZgpZVsl3/" \
     -H "X-Token: your_token"
```

### 2. Отримання квитанції з email

```bash
curl -X GET "https://yoursite.com/api/payment/receipt/p2_9ZgpZVsl3/?email=customer@example.com" \
     -H "X-Token: your_token"
```

### 3. Завантаження PDF

```bash
curl -X GET "https://yoursite.com/payment/receipt/p2_9ZgpZVsl3/download/" \
     -H "X-Token: your_token" \
     -o receipt.pdf
```

## Логування

### Django Logs

```python
logger.info('Receipt requested for invoice: %s', invoice_id)
logger.error('Receipt API error: %s - %s', response.status_code, response.text)
logger.warning('Receipt failed: %s', error_code)
```

### JavaScript Console

```javascript
console.log('Requesting receipt for invoice:', invoiceId);
console.error('Receipt error:', error);
console.info('Receipt downloaded successfully');
```

## Підтримка

### Налагодження

1. Перевірте логи Django
2. Перевірте статус Monobank API
3. Перевірте валідність токенів
4. Перевірте ID рахунку
5. Перевірте з'єднання з інтернетом

### Контакти

- [Monobank Support](https://web.monobank.ua/)
- Внутрішня підтримка: support@yoursite.com

## Оновлення

При оновленні Monobank API:

1. Оновіть `monobank_config.py`
2. Перевірте сумісність з новою версією
3. Протестуйте всі функції квитанцій
4. Оновіть документацію

## Повний цикл Monobank API

Система тепер надає **повний цикл Monobank API**:

1. **Створення рахунку** → 2. **Оплата** → 3. **Webhook обробка** → 4. **Перевірка статусу** → 5. **Скасування з поверненням** → 6. **Інвалідація без повернення** → 7. **Фіналізація холду** → 8. **Дані мерчанта** → 9. **Оплата за реквізитами** → 10. **Квитанції** → 11. **Відстеження замовлення**

### Всі доступні операції

- **Створення рахунку** - Генерація рахунків для оплати
- **Перевірка статусу** - Моніторинг стану рахунків
- **Скасування** - Повернення коштів за оплачені рахунки
- **Інвалідація** - Деактивація неоплачених рахунків
- **Фіналізація холду** - Завершення блокування коштів
- **Дані мерчанта** - Відображення інформації про мерчанта
- **Оплата за реквізитами** - Пряма оплата карткою на сайті
- **Квитанції** - Генерація та надсилання PDF квитанцій

## Підсумок

Інтеграція Monobank Receipt System повністю готова до використання! Система тепер надає **комплексне управління Monobank API** з можливістю:

- Генерації PDF квитанцій
- Надсилання квитанцій на email
- Завантаження квитанцій
- Повного циклу управління платежами

Це забезпечує **повну документацію платежів** та **зручність для клієнтів**! 🚀
