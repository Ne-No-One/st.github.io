# 🎨 Система Шарів для Динамічної Зміни Дизайну Товарів

## 📋 Огляд

Ця система реалізує повноцінний функціонал вибору товару з динамічною зміною дизайну упаковки, використовуючи технологію шарів (layers) та масок. Система працює аналогічно до Adobe Photoshop та дозволяє створювати складні візуальні ефекти.

## 🏗️ Архітектура Шарів

### Структура шарів (від найнижчого до найвищого):

1. **Шар пакувального паперу** (z-index: 0)
   - Найнижчий шар
   - Містить текстуру пакувального матеріалу
   - Активується тільки при виборі кольору

2. **Основне зображення товару** (z-index: 1)
   - Базове фото букета/товару
   - Замінюється при зміні кількості або варіанту

3. **Кольорова маска** (z-index: 2)
   - Накладає колір з ефектом `mix-blend-mode: multiply`
   - Імітує ефект фарбування упаковки

4. **Шар квітів** (z-index: 3)
   - Найвищий шар
   - Містить додаткові деталі або декорації

## 🎯 Основні Функції

### `changeColorWithMask(colorData)`
Головна функція для зміни кольору з повною системою шарів:

```javascript
const colorData = {
    hex_code: '#ff0000',           // HEX код кольору
    image_url: 'image.jpg',        // Основне зображення
    flowers_image: 'flowers.jpg',  // Зображення для шару квітів
    mask_image: 'mask.jpg',        // Зображення маски
    packaging_texture: 'paper.jpg' // Текстура пакувального паперу
};
changeColorWithMask(colorData);
```

### `changeQuantityWithLayers(quantityData)`
Функція для зміни кількості зі збереженням кольору:

```javascript
const quantityData = {
    base_image: 'bouquet_21.jpg',  // Зображення для конкретної кількості
    flowers_image: 'flowers_21.jpg' // Шар квітів для цієї кількості
};
changeQuantityWithLayers(quantityData);
```

### `selectColor(element, hexCode, imageUrl, flowersImage, maskImage, packagingTexture)`
Функція викликається з HTML при натисканні на кольоровий кружечок.

### `resetLayers()`
Скидає всі активні шари до початкового стану.

### `toggleLayer(layerType)`
Перемикає видимість окремого шару для налагодження.

## 📱 HTML Структура

```html
<div class="product-layers">
    <!-- Нижній шар: пакувальний папір -->
    <div class="packaging-layer"></div>
    
    <!-- Основне зображення товару -->
    <img id="product-image" src="product.jpg" class="product-image">
    
    <!-- Кольорова маска -->
    <div class="color-mask"></div>
    
    <!-- Верхній шар: квіти -->
    <div class="flowers-layer"></div>
</div>

<!-- Кнопки вибору кольору -->
<div class="color-dots">
    <div class="color-dot" 
         onclick="selectColor(this, '#ff0000', 'red.jpg', 'flowers_red.jpg', 'mask_red.jpg', 'paper_red.jpg')"
         style="background-color: #ff0000;">
    </div>
</div>
```

## 🎨 CSS Стилі

### Основний контейнер:
```css
.product-layers {
    position: relative;
    width: 100%;
    height: 100%;
}
```

### Стилі шарів:
```css
.packaging-layer,
.color-mask,
.flowers-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.4s ease;
    background-size: cover;
    background-position: center;
}

.packaging-layer.active,
.flowers-layer.active {
    opacity: 1;
}

.color-mask.active {
    opacity: 0.8;
}

.color-mask {
    mix-blend-mode: multiply;
}
```

## 🔧 Панель Налагодження

У шаблоні додано панель керування шарами для тестування:

```html
<div class="layers-control">
    <button onclick="resetLayers()">Скинути шари</button>
    <button onclick="toggleLayer('packaging')">Папір</button>
    <button onclick="toggleLayer('mask')">Маска</button>
    <button onclick="toggleLayer('flowers')">Квіти</button>
</div>
```

## 🚀 Переваги Системи

### ✅ Технічні переваги:
- **Продуктивність**: Використання CSS-трансформацій замість перезавантаження зображень
- **Гнучкість**: Легко додавати нові шари та ефекти
- **Сумісність**: Працює у всіх сучасних браузерах
- **Масштабованість**: Можна легко розширити для нових товарів

### ✅ UX переваги:
- **Швидкість**: Миттєва зміна кольору без затримок
- **Плавність**: Красиві анімації переходів
- **Інтуїтивність**: Зрозумілий інтерфейс вибору
- **Візуалізація**: Реалістичне відображення результату

## 📈 Використання в Адмін Панелі

Для кожного варіанту кольору в адмін панелі можна налаштувати:

1. **Основне зображення** (`image_url`)
2. **HEX код кольору** (`hex_code`) 
3. **Зображення квітів** (`flowers_image_url`)
4. **Зображення маски** (`mask_image_url`)
5. **Текстура пакування** (`packaging_texture_url`)

## 🎯 Приклад Повного Циклу

1. **Користувач натискає на червоний кружечок**
2. **Активується шар пакувального паперу** з червоним градієнтом
3. **Накладається кольорова маска** з ефектом multiply
4. **Показується шар квітів** (якщо є)
5. **Основне зображення** замінюється на червоний варіант
6. **Всі анімації** виконуються плавно протягом 0.4 секунди

## 🔮 Можливості Розширення

- Додавання ефектів blur, brightness, contrast
- Підтримка відео-шарів
- 3D трансформації
- Інтерактивні елементи на шарах
- Експорт готового зображення

---

**🎨 Система готова до використання та може бути легко адаптована для будь-яких товарів з кольоровими варіантами!**
