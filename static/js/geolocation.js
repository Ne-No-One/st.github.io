/**
 * =======================================
 * СИСТЕМА ГЕОЛОКАЦІЇ КОРИСТУВАЧА
 * =======================================
 * Визначення міста користувача для перевірки доставки
 */

// Глобальні дані про користувача
let userLocation = {
    detected: false,
    city: null,
    region: null,
    country: null,
    latitude: null,
    longitude: null,
    deliveryAvailable: true,
    timestamp: null
};

// Налаштування міст доставки (завантажуються з сервера)
let deliveryCities = [];

// Список всіх обласних центрів та великих міст України
const allUkrainianCities = [
    { name: 'Київ', region: 'Київська область' },
    { name: 'Харків', region: 'Харківська область' },
    { name: 'Одеса', region: 'Одеська область' },
    { name: 'Дніпро', region: 'Дніпропетровська область' },
    { name: 'Львів', region: 'Львівська область' },
    { name: 'Запоріжжя', region: 'Запорізька область' },
    { name: 'Кривий Ріг', region: 'Дніпропетровська область' },
    { name: 'Миколаїв', region: 'Миколаївська область' },
    { name: 'Вінниця', region: 'Вінницька область' },
    { name: 'Херсон', region: 'Херсонська область' },
    { name: 'Полтава', region: 'Полтавська область' },
    { name: 'Чернігів', region: 'Чернігівська область' },
    { name: 'Черкаси', region: 'Черкаська область' },
    { name: 'Суми', region: 'Сумська область' },
    { name: 'Житомир', region: 'Житомирська область' },
    { name: 'Хмельницький', region: 'Хмельницька область' },
    { name: 'Чернівці', region: 'Чернівецька область' },
    { name: 'Рівне', region: 'Рівненська область' },
    { name: 'Кропивницький', region: 'Кіровоградська область' },
    { name: 'Івано-Франківськ', region: 'Івано-Франківська область' },
    { name: 'Тернопіль', region: 'Тернопільська область' },
    { name: 'Луцьк', region: 'Волинська область' },
    { name: 'Ужгород', region: 'Закарпатська область' },
    { name: 'Біла Церква', region: 'Київська область' },
    { name: 'Кам\'янське', region: 'Дніпропетровська область' },
    { name: 'Маріуполь', region: 'Донецька область' },
    { name: 'Луганськ', region: 'Луганська область' }
];

/**
 * Завантажити список міст доставки з сервера
 */
async function loadDeliveryCities() {
    try {
        const response = await fetch('/api/delivery-cities/');
        const data = await response.json();
        
        if (data.success) {
            deliveryCities = data.cities || [];
            console.log('📍 Завантажено міста доставки:', deliveryCities);
            return true;
        } else {
            console.warn('⚠️ Не вдалося завантажити міста доставки');
            return false;
        }
    } catch (error) {
        console.error('❌ Помилка завантаження міст:', error);
        return false;
    }
}

/**
 * Отримати геолокацію через HTML5 Geolocation API
 */
function getGeoLocationFromBrowser() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Геолокація не підтримується браузером'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log('✅ Геолокація отримана:', position.coords);
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            error => {
                console.warn('⚠️ Помилка геолокації:', error.message);
                reject(error);
            },
            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
}

/**
 * Визначити місто за координатами через API
 * Використовуємо безкоштовне API: nominatim.openstreetmap.org
 */
async function getCityByCoordinates(lat, lon) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=uk`,
            {
                headers: {
                    'User-Agent': 'FlowerShop/1.0'
                }
            }
        );
        
        const data = await response.json();
        
        if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || null;
            const region = data.address.state || data.address.region || null;
            const country = data.address.country || null;
            
            console.log('🌍 Визначено локацію:', { city, region, country });
            
            return { city, region, country };
        }
        
        return null;
    } catch (error) {
        console.error('❌ Помилка визначення міста:', error);
        return null;
    }
}

/**
 * Перевірити чи доступна доставка в місто
 */
function isDeliveryAvailable(cityName) {
    if (!cityName || deliveryCities.length === 0) {
        return true; // За замовчуванням доставка доступна
    }
    
    // Нормалізуємо назву міста
    const normalizedCity = cityName.trim().toLowerCase();
    
    // Перевіряємо чи місто в списку
    const found = deliveryCities.some(dc => {
        const dcCity = dc.name.trim().toLowerCase();
        return dcCity === normalizedCity || normalizedCity.includes(dcCity) || dcCity.includes(normalizedCity);
    });
    
    console.log(`📦 Доставка в "${cityName}":`, found ? 'Доступна' : 'Недоступна');
    
    return found;
}

/**
 * Визначити локацію користувача (головна функція)
 */
async function detectUserLocation() {
    console.log('🌍 Починаємо визначення локації користувача...');
    
    // Перевіряємо чи є збережена локація в localStorage
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
        try {
            const parsed = JSON.parse(savedLocation);
            const age = Date.now() - (parsed.timestamp || 0);
            
            // Якщо локація свіжа (менше 24 годин)
            if (age < 24 * 60 * 60 * 1000) {
                userLocation = parsed;
                console.log('✅ Використано збережену локацію:', userLocation);
                
                // Оновлюємо індикатор міста
                if (userLocation.city) {
                    updateCityIndicator(userLocation.city, userLocation.deliveryAvailable);
                }
                
                return userLocation;
            }
        } catch (e) {
            console.warn('⚠️ Помилка парсингу збереженої локації');
        }
    }
    
    // Спробуємо отримати геолокацію
    try {
        const coords = await getGeoLocationFromBrowser();
        userLocation.latitude = coords.latitude;
        userLocation.longitude = coords.longitude;
        
        // Визначаємо місто за координатами
        const location = await getCityByCoordinates(coords.latitude, coords.longitude);
        
        if (location && location.city) {
            userLocation.city = location.city;
            userLocation.region = location.region;
            userLocation.country = location.country;
            userLocation.detected = true;
            userLocation.deliveryAvailable = isDeliveryAvailable(location.city);
            userLocation.timestamp = Date.now();
            
            // Зберігаємо в localStorage
            localStorage.setItem('userLocation', JSON.stringify(userLocation));
            
            console.log('✅ Локацію визначено:', userLocation);
            
            // Оновлюємо індикатор міста
            updateCityIndicator(userLocation.city, userLocation.deliveryAvailable);
            
            // Показуємо повідомлення користувачу
            showLocationBanner(userLocation.city, userLocation.deliveryAvailable);
            
            return userLocation;
        }
    } catch (error) {
        console.warn('⚠️ Не вдалося визначити локацію:', error.message);
    }
    
    // Якщо не вдалося визначити - запитуємо вручну
    showManualLocationInput();
    
    return userLocation;
}

/**
 * Показати банер з визначеним містом
 */
function showLocationBanner(city, deliveryAvailable) {
    // Перевіряємо чи користувач вже закрив це повідомлення
    const dismissed = sessionStorage.getItem('locationBannerDismissed');
    if (dismissed) return;
    
    const banner = document.createElement('div');
    banner.className = 'location-banner';
    banner.style.cssText = `
        position: fixed;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: ${deliveryAvailable ? '#10b981' : '#ef4444'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideDown 0.3s ease;
        font-size: 14px;
    `;
    
    banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">${deliveryAvailable ? '📍' : '❌'}</span>
            <span>
                <strong>Ваше місто: ${city}</strong>
                ${deliveryAvailable ? '✓ Доставка доступна' : '✗ Доставка недоступна'}
            </span>
        </div>
        <button onclick="changeCity()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px;">
            Змінити
        </button>
        <button onclick="dismissLocationBanner()" style="background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0 8px;">
            ×
        </button>
    `;
    
    document.body.appendChild(banner);
    
    // Автоматично приховуємо через 10 секунд
    setTimeout(() => {
        if (banner.parentNode) {
            banner.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => banner.remove(), 300);
        }
    }, 10000);
}

/**
 * Приховати банер
 */
window.dismissLocationBanner = function() {
    const banner = document.querySelector('.location-banner');
    if (banner) {
        sessionStorage.setItem('locationBannerDismissed', 'true');
        banner.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => banner.remove(), 300);
    }
};

/**
 * Змінити місто вручну
 */
window.changeCity = function() {
    window.dismissLocationBanner();
    showManualLocationInput();
};

/**
 * Показати форму вибору міста
 */
function showManualLocationInput() {
    const modal = document.createElement('div');
    modal.className = 'location-modal';
    
    const currentCity = userLocation.city || '';
    
    // Використовуємо всі українські міста для вибору
    const citiesToShow = deliveryCities.length > 0 ? deliveryCities : allUkrainianCities;
    
    modal.innerHTML = `
        <div class="city-modal-content">
            <div class="city-modal-header">
                <h3 class="city-modal-title">
                    📍 Ваше місто
                </h3>
                <button onclick="closeCityModal()" class="city-modal-close">
                    ×
                </button>
            </div>
            
            <p class="city-modal-description">
                Оберіть місто зі списку або введіть назву вручну. Це допоможе нам визначити доступність доставки.
            </p>
            
            <!-- Поле вибору міста -->
            <div class="city-form-group">
                <label class="city-form-label">
                    Виберіть місто зі списку
                </label>
                <select id="citySelect" class="city-form-select">
                    <option value="">-- Оберіть місто --</option>
                    ${citiesToShow.map(city => `
                        <option value="${city.name}" ${city.name === currentCity ? 'selected' : ''}>
                            ${city.name}${city.region ? ` (${city.region})` : ''}
                        </option>
                    `).join('')}
                </select>
                
                <p class="city-divider">АБО</p>
                
                <label class="city-form-label">
                    Введіть своє місто вручну
                </label>
                <input 
                    type="text" 
                    id="cityInput" 
                    class="city-form-input"
                    placeholder="Наприклад: Полтава"
                    value="${currentCity && citiesToShow.every(c => c.name !== currentCity) ? currentCity : ''}"
                >
                <p class="city-hint">
                    ${citiesToShow.length} міст у списку • Або введіть будь-яке інше місто
                </p>
            </div>
            
            <!-- Популярні міста -->
            ${citiesToShow.length > 0 ? `
                <div class="city-popular-section">
                    <label class="city-popular-label">
                        Популярні міста
                    </label>
                    <div class="city-popular-grid">
                        ${citiesToShow.slice(0, 6).map(city => `
                            <button 
                                onclick="selectPopularCity('${city.name}')"
                                class="city-popular-btn"
                            >
                                ${city.name}
                            </button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Кнопки -->
            <div class="city-modal-actions">
                <button onclick="confirmCitySelection()" class="city-confirm-btn">
                    ✓ Підтвердити
                </button>
                <button onclick="closeCityModal()" class="city-cancel-btn">
                    Скасувати
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Синхронізація select та input
    const select = document.getElementById('citySelect');
    const input = document.getElementById('cityInput');
    
    if (select && input) {
        select.addEventListener('change', function() {
            if (this.value) {
                input.value = ''; // Очищаємо input якщо обрано зі списку
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value) {
                select.value = ''; // Очищаємо select якщо вводимо вручну
            }
        });
    }
    
    // Фокус на select
    setTimeout(() => {
        if (select) select.focus();
    }, 100);
}

/**
 * Вибрати популярне місто
 */
window.selectPopularCity = function(cityName) {
    const select = document.getElementById('citySelect');
    const input = document.getElementById('cityInput');
    
    if (select) {
        select.value = cityName;
        if (input) input.value = ''; // Очищаємо input
    }
};

/**
 * Підтвердити вибір міста
 */
window.confirmCitySelection = function() {
    const select = document.getElementById('citySelect');
    const input = document.getElementById('cityInput');
    
    // Пріоритет: спочатку select, потім input
    let selectedCity = '';
    
    if (select && select.value) {
        selectedCity = select.value.trim();
    } else if (input && input.value) {
        selectedCity = input.value.trim();
    }
    
    if (selectedCity) {
        userLocation.city = selectedCity;
        userLocation.detected = true;
        userLocation.deliveryAvailable = isDeliveryAvailable(selectedCity);
        userLocation.timestamp = Date.now();
        
        localStorage.setItem('userLocation', JSON.stringify(userLocation));
        
        console.log('✅ Місто обрано:', userLocation);
        
        // Оновлюємо індикатор
        updateCityIndicator(selectedCity, userLocation.deliveryAvailable);
        
        closeCityModal();
    } else {
        alert('Будь ласка, оберіть місто зі списку або введіть вручну');
    }
};

/**
 * Закрити модальне вікно
 */
window.closeCityModal = function() {
    const modal = document.querySelector('.location-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
};

/**
 * Додати CSS анімації
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

/**
 * Створити постійний індикатор міста в хедері
 */
function createCityIndicator() {
    // Перевіряємо чи вже є індикатор
    let indicator = document.getElementById('city-indicator');
    
    if (!indicator) {
        // Знаходимо місце для індикатора (перед кошиком)
        const navActions = document.querySelector('.nav-actions');
        
        if (navActions) {
            indicator = document.createElement('div');
            indicator.id = 'city-indicator';
            indicator.style.cssText = `
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                background: rgba(59, 130, 246, 0.1);
                border: 1px solid rgba(59, 130, 246, 0.3);
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 13px;
                color: #3b82f6;
                white-space: nowrap;
            `;
            
            indicator.innerHTML = `
                <span style="font-size: 16px;">📍</span>
                <span id="city-indicator-text">Визначення...</span>
            `;
            
            indicator.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(59, 130, 246, 0.2)';
            });
            
            indicator.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(59, 130, 246, 0.1)';
            });
            
            indicator.addEventListener('click', function() {
                showManualLocationInput();
            });
            
            // Вставляємо перед кошиком
            navActions.insertBefore(indicator, navActions.firstChild);
        }
    }
    
    return indicator;
}

/**
 * Оновити індикатор міста
 */
function updateCityIndicator(city, deliveryAvailable) {
    const indicator = document.getElementById('city-indicator');
    const textElement = document.getElementById('city-indicator-text');
    
    if (indicator && textElement) {
        textElement.textContent = city || 'Оберіть місто';
        
        // Змінюємо колір в залежності від доступності доставки
        if (city) {
            if (deliveryAvailable) {
                indicator.style.background = 'rgba(16, 185, 129, 0.1)';
                indicator.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                indicator.style.color = '#10b981';
            } else {
                indicator.style.background = 'rgba(239, 68, 68, 0.1)';
                indicator.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                indicator.style.color = '#ef4444';
            }
        }
    }
}

/**
 * Ініціалізація геолокації при завантаженні сторінки
 */
async function initializeGeolocation() {
    console.log('🚀 Ініціалізація геолокації...');
    
    // Створюємо індикатор міста в хедері
    createCityIndicator();
    
    // Завантажуємо міста доставки
    await loadDeliveryCities();
    
    // Перевіряємо чи є збережене місто
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
        try {
            const parsed = JSON.parse(savedLocation);
            if (parsed.city) {
                updateCityIndicator(parsed.city, parsed.deliveryAvailable);
            }
        } catch (e) {
            console.warn('⚠️ Помилка парсингу збереженого міста');
        }
    }
    
    // Визначаємо локацію користувача (з затримкою 2 сек після завантаження сторінки)
    setTimeout(() => {
        detectUserLocation();
    }, 2000);
}

// Автоматична ініціалізація
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGeolocation);
} else {
    initializeGeolocation();
}

// Експортуємо функції
if (typeof window !== 'undefined') {
    window.geolocationManager = {
        getUserLocation: () => userLocation,
        detectLocation: detectUserLocation,
        isDeliveryAvailable: isDeliveryAvailable,
        changeCity: changeCity
    };
}

