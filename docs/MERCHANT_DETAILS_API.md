# Monobank Merchant Details System

## Огляд

Система отримання даних мерчанта через Monobank API дозволяє відображати інформацію про мерчант-акаунт, включаючи ID мерчанта, найменування та код ЄДРПОУ. Це корисно для валідації налаштувань та відображення інформації про мерчанта.

## API Endpoints

### GET /api/payment/merchant/

Отримання даних мерчанта через Monobank API.

**Response (Success):**
```json
{
  "success": true,
  "merchantId": "12o4Vv7EWy",
  "merchantName": "Your Favourite Company",
  "edrpou": "4242424242",
  "message": "Дані мерчанта успішно отримано"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Помилка отримання даних мерчанта",
  "errorCode": "FORBIDDEN",
  "errorText": "forbidden",
  "details": "Детальний опис помилки"
}
```

### GET /payment/merchant/

Сторінка з даними мерчанта або помилкою отримання.

## Сторінки даних мерчанта

### 1. Успішне отримання даних (`/payment/merchant/`)

- **Функціональність:**
  - Відображення ID мерчанта
  - Відображення найменування мерчанта
  - Відображення коду ЄДРПОУ
  - Статус підключення API
  - Доступні операції
  - Навігація по системі

- **Інформація про мерчанта:**
  - **ID мерчанта:** Унікальний ідентифікатор
  - **Найменування:** Назва компанії
  - **ЄДРПОУ:** Код Єдиного державного реєстру підприємств

### 2. Помилка отримання даних (`/payment/merchant/`)

- **Функціональність:**
  - Відображення помилки
  - Деталі проблеми
  - Можливі рішення
  - Коди помилок
  - Повторна спроба

## JavaScript API

### getMerchantDetails()

Асинхронна функція для отримання даних мерчанта.

```javascript
const result = await getMerchantDetails();

if (result.success) {
    console.log('ID мерчанта:', result.merchantId);
    console.log('Назва:', result.merchantName);
    console.log('ЄДРПОУ:', result.edrpou);
} else {
    console.error('Помилка:', result.error);
}
```

### showMerchantDetailsModal()

Відображення модального вікна з даними мерчанта.

```javascript
showMerchantDetailsModal();
```

### loadMerchantData()

Завантаження даних мерчанта в модальне вікно.

```javascript
// Автоматично викликається при відкритті модального вікна
// Включає індикатор завантаження та обробку помилок
```

## Процес отримання даних

### 1. Ініціація отримання

```javascript
// Відкриття модального вікна
showMerchantDetailsModal();

// Або перехід на сторінку
window.location.href = '/payment/merchant/';
```

### 2. Завантаження даних

```javascript
const merchantData = await getMerchantDetails();

if (merchantData.success) {
    // Відображення даних мерчанта
    displayMerchantInfo(merchantData);
} else {
    // Відображення помилки
    displayError(merchantData.error);
}
```

### 3. Обробка через API

```javascript
const response = await fetch('/api/payment/merchant/', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
    }
});

const result = await response.json();
```

### 4. Відображення результату

- **Успіх:** Відображення інформації про мерчанта
- **Помилка:** Відображення деталей помилки з можливістю повторної спроби

## Обробка помилок

### Коди помилок Monobank

- **BAD_REQUEST** - Невірний запит
- **FORBIDDEN** - Невірний токен
- **METHOD_NOT_ALLOWED** - Невірний HTTP метод
- **TMR** - Занадто багато запитів
- **INTERNAL_ERROR** - Внутрішня помилка сервера

### Обробка в JavaScript

```javascript
const result = await getMerchantDetails();

if (!result.success) {
    switch (result.errorCode) {
        case 'BAD_REQUEST':
            showError('Невірний запит');
            break;
        case 'FORBIDDEN':
            showError('Невірний токен');
            break;
        case 'TMR':
            showError('Занадто багато запитів');
            break;
        default:
            showError(result.error);
    }
}
```

## Відображення даних

### Інформація про мерчанта

```html
<div class="merchant-info">
    <div class="info-row">
        <span class="info-label">ID мерчанта:</span>
        <span class="info-value">12o4Vv7EWy</span>
    </div>
    <div class="info-row">
        <span class="info-label">Найменування:</span>
        <span class="info-value">Your Favourite Company</span>
    </div>
    <div class="info-row">
        <span class="info-label">ЄДРПОУ:</span>
        <span class="info-value">4242424242</span>
    </div>
</div>
```

### Статус підключення

```html
<div class="merchant-status">
    <div class="status-item success">
        <i class="fas fa-check"></i>
        <span>API підключення активне</span>
    </div>
    <div class="status-item success">
        <i class="fas fa-check"></i>
        <span>Токен валідний</span>
    </div>
    <div class="status-item success">
        <i class="fas fa-check"></i>
        <span>Мерчант налаштований</span>
    </div>
</div>
```

## Доступні операції

### Навігаційні кнопки

- **Створити рахунок** - Перехід до створення рахунку
- **Перевірити статус** - Перехід до перевірки статусу
- **Скасувати замовлення** - Перехід до скасування
- **Деактивувати замовлення** - Перехід до інвалідації
- **Фіналізувати холд** - Перехід до фіналізації
- **Оновити дані** - Повторне завантаження даних

### Модальне вікно

```javascript
// Відкриття модального вікна
showMerchantDetailsModal();

// Закриття модального вікна
closeMerchantModal();
```

## Безпека

### 1. Валідація токенів

- Перевірка валідності токена Monobank
- Автоматичне визначення тестового/продакшн токена
- Обробка помилок авторизації

### 2. CSRF захист

- Всі запити захищені CSRF токенами
- Перевірка токенів на сервері

### 3. Логування

- Логування всіх запитів до API
- Збереження помилок для налагодження

## Логування

### Django Logs

```python
logger.info('Getting merchant details')
logger.error(f'Merchant details API error: {response.status_code}')
logger.warning(f'Merchant details failed: {error_code}')
```

### JavaScript Console

```javascript
console.log('Loading merchant details...');
console.error('Merchant details error:', error);
console.info('Merchant details loaded:', result);
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

1. **Перевірка валідного токена**
2. **Тестування з невалідним токеном**
3. **Перевірка відображення даних**
4. **Тестування модального вікна**

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
    'merchant_details_url': 'https://api.monobank.ua/api/merchant/details',
    # ... інші налаштування
}
```

## Приклади використання

### 1. Адмін-панель

```python
def show_merchant_info(request):
    merchant_data = get_merchant_details(request)
    return render(request, 'admin/merchant_info.html', {
        'merchant_data': merchant_data
    })
```

### 2. API інтеграція

```python
# Отримання даних мерчанта зовнішньою системою
response = requests.get(
    'https://yoursite.com/api/payment/merchant/',
    headers={'Authorization': 'Bearer your_token'}
)
```

### 3. Автоматична перевірка

```python
# Celery task для перевірки статусу мерчанта
@task
def check_merchant_status():
    result = get_merchant_details()
    if not result.success:
        send_alert('Merchant API error')
```

## Підтримка

### Налагодження

1. Перевірте логи Django
2. Перевірте статус Monobank API
3. Перевірте валідність токенів
4. Перевірте з'єднання з інтернетом

### Контакти

- [Monobank Support](https://web.monobank.ua/)
- Внутрішня підтримка: support@yoursite.com

## Оновлення

При оновленні Monobank API:

1. Оновіть `monobank_config.py`
2. Перевірте сумісність з новою версією
3. Протестуйте всі функції даних мерчанта
4. Оновіть документацію

## Повний цикл Monobank API

Система тепер надає **повний цикл Monobank API**:

1. **Створення рахунку** → 2. **Оплата** → 3. **Webhook обробка** → 4. **Перевірка статусу** → 5. **Скасування з поверненням** → 6. **Інвалідація без повернення** → 7. **Фіналізація холду** → 8. **Дані мерчанта** → 9. **Відстеження замовлення**

### Всі доступні операції

- **Створення рахунку** - Генерація рахунків для оплати
- **Перевірка статусу** - Моніторинг стану рахунків
- **Скасування** - Повернення коштів за оплачені рахунки
- **Інвалідація** - Деактивація неоплачених рахунків
- **Фіналізація холду** - Завершення блокування коштів
- **Дані мерчанта** - Відображення інформації про мерчанта

## Підсумок

Інтеграція Monobank Merchant Details System повністю готова до використання! Система тепер надає **комплексне управління Monobank API** з можливістю:

- Отримання даних мерчанта
- Відображення інформації про мерчанта
- Валідації налаштувань
- Моніторингу статусу підключення

Це забезпечує повний контроль над всіма аспектами Monobank API! 🚀
