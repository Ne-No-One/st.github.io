# Monobank iFrame Payment System

## Огляд

Система iFrame оплати через Monobank API дозволяє клієнтам здійснювати платежі безпосередньо на сайті без перенаправлень. Платіжний віджет Monobank вбудовується в iFrame, що забезпечує безшовний користувацький досвід.

## API Endpoints

### POST /api/payment/iframe/

Створення рахунку для iFrame оплати.

**Request Body:**
```json
{
  "amount": 100.0,
  "ccy": 980,
  "reference": "order_123",
  "destination": "Опис замовлення",
  "paymentType": "debit",
  "validity": 3600
}
```

**Response (Success):**
```json
{
  "success": true,
  "invoiceId": "p2_9ZgpZVsl3",
  "pageUrl": "https://pay.mbnk.biz/p2_9ZgpZVsl3",
  "message": "Рахунок для iFrame успішно створено"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Помилка створення рахунку для iFrame",
  "errorCode": "BAD_REQUEST",
  "errorText": "Невірний запит",
  "details": "Детальний опис помилки"
}
```

### GET /payment/iframe/

Сторінка форми створення рахунку для iFrame оплати.

## Сторінки iFrame оплати

### 1. Форма створення рахунку (`/payment/iframe/`)

- **Функціональність:**
  - Введення суми та деталей замовлення
  - Налаштування типу платежу та терміну дії
  - Валідація даних
  - Створення рахунку з `displayType: "iframe"`

- **Поля форми:**
  - **Сума** - сума до сплати в гривнях
  - **Номер замовлення** - референс замовлення (опціонально)
  - **Опис замовлення** - призначення платежу (опціонально)
  - **Тип платежу** - debit (звичайна) або hold (блокування)
  - **Термін дії** - кількість годин (1-72)

### 2. iFrame оплата (`/payment/iframe/pay/`)

- **Функціональність:**
  - Відображення вбудованого віджета Monobank
  - Обробка подій iFrame
  - Автоматичне оновлення статусу
  - Модальне вікно для перевірки статусу

### 3. Помилка створення рахунку (`/payment/iframe/error/`)

- **Функціональність:**
  - Відображення деталей помилки
  - Коди помилок та їх описи
  - Можливі рішення проблем
  - Кнопки для повторної спроби

## Технічна реалізація iFrame

### Базовий HTML-код

```html
<iframe
    id="payFrame"
    title="monopay"
    width="600"
    height="600"
    src="{{pageUrl}}"
    allow="payment *"
    style="border-radius: 24px;"
></iframe>
```

### Обов'язкові параметри

| Параметр | Значення | Опис |
|----------|----------|------|
| `id` | `payFrame` | Ідентифікатор фрейму |
| `title` | `monopay` | Назва фрейму для доступності |
| `allow` | `payment *` | Дозвіл на обробку платежів (обов'язковий) |
| `src` | `{{pageUrl}}` | URL сторінки оплати з Monobank |

### Вимоги до розмірів

- **Мінімальна ширина:** 576px
- **Мінімальна висота:** 576px
- **Радіус заокруглення:** 24px
- **Центрування:** iFrame повинен відображатися по центру екрану

### CSS для центрування

```css
.iframe-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
}
```

## Обробка подій iFrame

### JavaScript обробник подій

```javascript
function listenFrame(event) {
    const data = JSON.parse(event.data || "{}");
   
    // Обробка кліку по кнопці "назад" або "повернутись на сайт"
    if (data.message === "close-button") {
        closeModal();
    }
   
    // Обробка переходу на мобільному пристрої через діпклінк
    if (data.message === "monopay-link") {
        window.location.href = data.value;
    }
}

window.addEventListener("message", listenFrame, false);
```

### Типи подій

- **`close-button`** - клік по кнопці "назад" або "повернутись на сайт"
- **`monopay-link`** - перехід через діпклінк на мобільному пристрої

## Процес iFrame оплати

### 1. Створення рахунку

```javascript
const paymentData = {
    amount: 100.0,
    ccy: 980,
    reference: 'order_123',
    destination: 'Опис замовлення',
    paymentType: 'debit',
    validity: 3600
};

const response = await fetch('/api/payment/iframe/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify(paymentData)
});

const result = await response.json();
```

### 2. Відображення iFrame

```javascript
if (result.success) {
    // Перенаправляємо на сторінку з iFrame
    window.location.href = `/payment/iframe/pay/${result.invoiceId}/?url=${encodeURIComponent(result.pageUrl)}`;
}
```

### 3. Обробка подій

```javascript
// Додаємо слухач подій для iFrame
window.addEventListener("message", listenFrame, false);

// Автоматична перевірка статусу кожні 30 секунд
setInterval(checkPaymentStatus, 30000);
```

### 4. Перевірка статусу

```javascript
async function checkPaymentStatus() {
    try {
        const response = await fetch(`/api/payment/status/${invoiceId}/`);
        const result = await response.json();
        
        if (result.success) {
            if (result.status === 'success') {
                // Успішна оплата
                closeIframe();
            } else if (result.status === 'failure') {
                // Невдала оплата
                showError(result.failureReason);
            }
        }
    } catch (error) {
        console.error('Помилка перевірки статусу:', error);
    }
}
```

## Конфігурація Monobank

### Обов'язковий параметр

```python
invoice_data = {
    'amount': int(amount * 100),
    'ccy': 980,
    'displayType': 'iframe'  # Обов'язковий параметр для iFrame
}
```

### Повний приклад запиту

```python
def create_iframe_invoice(request):
    invoice_data = {
        'amount': int(data['amount'] * 100),
        'ccy': data.get('ccy', 980),
        'displayType': 'iframe',
        'merchantPaymInfo': {
            'reference': data.get('reference', f'order_{int(time.time())}'),
            'destination': data.get('destination', 'Оплата замовлення')
        },
        'redirectUrl': MONOBANK_CONFIG['redirect_url'],
        'webHookUrl': MONOBANK_CONFIG['webhook_url'],
        'validity': data.get('validity', 3600),
        'paymentType': data.get('paymentType', 'debit')
    }
    
    response = requests.post(
        MONOBANK_CONFIG['api_url'],
        json=invoice_data,
        headers={'X-Token': MONOBANK_CONFIG['token']}
    )
```

## Обробка помилок

### Коди помилок Monobank

- **BAD_REQUEST** - Невірний запит
- **INVALID_AMOUNT** - Невірна сума
- **INVALID_VALIDITY** - Невірний термін дії
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
        'pageUrl': result.get('pageUrl'),
        'message': 'Рахунок для iFrame успішно створено'
    })
else:
    error_data = response.json()
    return JsonResponse({
        'success': False,
        'error': 'Помилка створення рахунку для iFrame',
        'errorCode': error_data.get('errCode'),
        'errorText': error_data.get('errText')
    }, status=400)
```

## Безпека

### 1. Валідація даних

```python
# Перевірка обов'язкових полів
required_fields = ['amount']
for field in required_fields:
    if field not in data:
        return JsonResponse({'error': f'Відсутнє обов\'язкове поле: {field}'}, status=400)

# Перевірка суми
if amount <= 0:
    return JsonResponse({'error': 'Сума повинна бути більше 0'}, status=400)

# Перевірка терміну дії
if validity < 3600 or validity > 259200:  # 1-72 години
    return JsonResponse({'error': 'Термін дії повинен бути від 1 до 72 годин'}, status=400)
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
logger.info(f'iFrame invoice created: {amount} UAH')
logger.error(f'iFrame invoice API error: {response.status_code}')
logger.warning(f'iFrame payment failed: {error_code}')
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
- ✅ iFrame інтеграцію

### Ручне тестування

1. **Тестова сума:** 100.0 грн
2. **Тестовий референс:** test_iframe_order_123
3. **Очікуваний результат:** iFrame з віджетом Monobank

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
    'api_url': 'https://api.monobank.ua/api/merchant/invoice/create',
    'display_type': 'iframe',
    # ... інші налаштування
}
```

## Приклади використання

### 1. Створення рахунку для iFrame

```bash
curl -X POST "https://yoursite.com/api/payment/iframe/" \
     -H "Content-Type: application/json" \
     -H "X-CSRFToken: your_csrf_token" \
     -d '{
       "amount": 100.0,
       "ccy": 980,
       "reference": "order_123",
       "destination": "Опис замовлення"
     }'
```

### 2. Відображення iFrame

```html
<div class="iframe-container">
    <iframe
        id="payFrame"
        title="monopay"
        width="600"
        height="600"
        src="https://pay.mbnk.biz/p2_9ZgpZVsl3"
        allow="payment *"
        style="border-radius: 24px;"
    ></iframe>
</div>
```

### 3. Обробка подій

```javascript
// Обробка кнопки "назад"
function listenFrame(event) {
    const data = JSON.parse(event.data || "{}");
    
    if (data.message === "close-button") {
        closeModal();
    }
    
    if (data.message === "monopay-link") {
        window.location.href = data.value;
    }
}

window.addEventListener("message", listenFrame, false);
```

## Логування

### Django Logs

```python
logger.info('iFrame invoice created: %s UAH', amount)
logger.error('iFrame invoice API error: %s - %s', response.status_code, response.text)
logger.warning('iFrame payment failed: %s', error_code)
```

### JavaScript Console

```javascript
console.log('iFrame payment requested:', paymentData);
console.error('iFrame payment error:', error);
console.info('iFrame payment successful:', result);
```

## Підтримка

### Налагодження

1. Перевірте логи Django
2. Перевірте статус Monobank API
3. Перевірте валідність токенів
4. Перевірте параметр `displayType: "iframe"`
5. Перевірте з'єднання з інтернетом

### Контакти

- [Monobank Support](https://web.monobank.ua/)
- Внутрішня підтримка: support@yoursite.com

## Оновлення

При оновленні Monobank API:

1. Оновіть `monobank_config.py`
2. Перевірте сумісність з новою версією
3. Протестуйте iFrame функціональність
4. Оновіть документацію

## Повний цикл Monobank API

Система тепер надає **повний цикл Monobank API**:

1. **Створення рахунку** → 2. **Оплата** → 3. **Webhook обробка** → 4. **Перевірка статусу** → 5. **Скасування з поверненням** → 6. **Інвалідація без повернення** → 7. **Фіналізація холду** → 8. **Дані мерчанта** → 9. **Оплата за реквізитами** → 10. **Квитанції** → 11. **Синхронна оплата** → 12. **iFrame оплата** → 13. **Відстеження замовлення**

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
- **iFrame оплата** - Вбудований віджет оплати без перенаправлень

## Підсумок

Інтеграція Monobank iFrame Payment System повністю готова до використання! Система тепер надає **комплексне управління Monobank API** з можливістю:

- Вбудованого віджета оплати
- Безшовного користувацького досвіду
- Всіх способів оплати Monobank
- Автоматичного оновлення статусу
- Повного циклу управління платежами

Це забезпечує **максимальну зручність для клієнтів** та **професійний вигляд сайту**! 🚀
