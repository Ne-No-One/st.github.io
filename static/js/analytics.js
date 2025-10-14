/**
 * ===================================
 * СИСТЕМА АНАЛІТИКИ ВІДВІДУВАНЬ
 * ===================================
 * Відстежує відвідування сайту користувачами
 */

/**
 * Отримати інформацію про браузер
 */
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    
    if (ua.indexOf('Firefox') > -1) {
        browserName = 'Firefox';
    } else if (ua.indexOf('Chrome') > -1) {
        browserName = 'Chrome';
    } else if (ua.indexOf('Safari') > -1) {
        browserName = 'Safari';
    } else if (ua.indexOf('Edge') > -1) {
        browserName = 'Edge';
    } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
        browserName = 'Opera';
    }
    
    return browserName;
}

/**
 * Отримати інформацію про операційну систему
 */
function getOSInfo() {
    const ua = navigator.userAgent;
    let osName = 'Unknown';
    
    if (ua.indexOf('Win') > -1) osName = 'Windows';
    else if (ua.indexOf('Mac') > -1) osName = 'MacOS';
    else if (ua.indexOf('Linux') > -1) osName = 'Linux';
    else if (ua.indexOf('Android') > -1) osName = 'Android';
    else if (ua.indexOf('iOS') > -1) osName = 'iOS';
    
    return osName;
}

/**
 * Отримати тип пристрою
 */
function getDeviceType() {
    const width = window.innerWidth;
    
    if (width < 768) return 'Mobile';
    if (width < 1024) return 'Tablet';
    return 'Desktop';
}

/**
 * Отримати джерело відвідування (referrer)
 */
function getReferrer() {
    const referrer = document.referrer;
    
    if (!referrer) return 'Direct';
    
    try {
        const url = new URL(referrer);
        const hostname = url.hostname;
        
        // Визначаємо популярні джерела
        if (hostname.includes('google')) return 'Google';
        if (hostname.includes('facebook')) return 'Facebook';
        if (hostname.includes('instagram')) return 'Instagram';
        if (hostname.includes('youtube')) return 'YouTube';
        if (hostname.includes('tiktok')) return 'TikTok';
        if (hostname.includes('t.me') || hostname.includes('telegram')) return 'Telegram';
        
        return hostname;
    } catch (e) {
        return 'Unknown';
    }
}

/**
 * Отримати UTM параметри
 */
function getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    
    return {
        source: params.get('utm_source') || null,
        medium: params.get('utm_medium') || null,
        campaign: params.get('utm_campaign') || null,
        content: params.get('utm_content') || null,
        term: params.get('utm_term') || null
    };
}

/**
 * Згенерувати унікальний ID користувача
 */
function getUserId() {
    let userId = localStorage.getItem('analytics_user_id');
    
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('analytics_user_id', userId);
    }
    
    return userId;
}

/**
 * Згенерувати ID сесії
 */
function getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('analytics_session_id', sessionId);
    }
    
    return sessionId;
}

/**
 * Відправити дані про візит на сервер
 */
async function trackPageView() {
    try {
        const visitData = {
            // Унікальні ID
            user_id: getUserId(),
            session_id: getSessionId(),
            
            // Час
            timestamp: new Date().toISOString(),
            
            // Сторінка
            page_url: window.location.pathname,
            page_title: document.title,
            
            // Пристрій
            device_type: getDeviceType(),
            screen_width: window.innerWidth,
            screen_height: window.innerHeight,
            
            // Браузер та ОС
            browser: getBrowserInfo(),
            os: getOSInfo(),
            user_agent: navigator.userAgent,
            
            // Джерело
            referrer: getReferrer(),
            referrer_url: document.referrer || null,
            
            // UTM параметри
            utm: getUTMParams(),
            
            // Геолокація (якщо є)
            city: window.geolocationManager ? window.geolocationManager.getUserLocation().city : null,
            
            // Мова
            language: navigator.language || navigator.userLanguage
        };
        
        // Відправляємо на сервер
        const response = await fetch('/api/analytics/track/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(visitData)
        });
        
        if (response.ok) {
            console.log('✅ Візит записано в аналітику');
        } else {
            console.warn('⚠️ Не вдалося записати візит');
        }
    } catch (error) {
        console.error('❌ Помилка аналітики:', error);
    }
}

/**
 * Відстежити час на сторінці
 */
let pageStartTime = Date.now();

function trackTimeOnPage() {
    const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000); // секунди
    
    // Відправляємо тільки якщо користувач був на сторінці більше 3 секунд
    if (timeSpent < 3) return;
    
    navigator.sendBeacon('/api/analytics/time/', JSON.stringify({
        session_id: getSessionId(),
        page_url: window.location.pathname,
        time_spent: timeSpent,
        timestamp: new Date().toISOString()
    }));
}

// Відстежуємо коли користувач залишає сторінку
window.addEventListener('beforeunload', trackTimeOnPage);

// Відстежуємо також при переході на іншу сторінку
window.addEventListener('pagehide', trackTimeOnPage);

/**
 * Ініціалізація аналітики
 */
function initializeAnalytics() {
    console.log('📊 Ініціалізація аналітики...');
    
    // Трекаємо візит через 1 секунду після завантаження
    setTimeout(() => {
        trackPageView();
    }, 1000);
    
    // Періодично оновлюємо час на сторінці (кожні 30 сек)
    setInterval(() => {
        const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000);
        console.log(`⏱️ Час на сторінці: ${timeSpent}с`);
    }, 30000);
}

// Автоматичний запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalytics);
} else {
    initializeAnalytics();
}

// Експорт
if (typeof window !== 'undefined') {
    window.analyticsManager = {
        track: trackPageView,
        getUserId: getUserId,
        getSessionId: getSessionId
    };
}

