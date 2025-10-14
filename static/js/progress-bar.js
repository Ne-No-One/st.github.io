/**
 * ===================================
 * ДИНАМІЧНИЙ ПРОГРЕС-БАР З ЕТАПАМИ
 * ===================================
 * Завантажує налаштування з сервера та оновлює прогрес-бар
 */

// Глобальні налаштування прогрес-бару
let progressBarSettings = {
    enabled: true,
    milestones: []
};

/**
 * Завантажити налаштування прогрес-бару з сервера
 */
async function loadProgressBarSettings() {
    console.log('🔄 Початок завантаження налаштувань прогрес-бару...');
    console.log('📍 URL запиту: /api/progress-bar/');
    
    try {
        const response = await fetch('/api/progress-bar/');
        console.log('📥 Отримано відповідь:', response.status, response.statusText);
        
        const data = await response.json();
        console.log('📊 Дані відповіді:', data);
        
        if (data.success) {
            progressBarSettings = data.settings;
            console.log('✅ Налаштування прогрес-бару завантажено успішно!');
            console.log('📋 Деталі налаштувань:');
            console.log('   - Увімкнено:', progressBarSettings.enabled);
            console.log('   - Кількість етапів:', progressBarSettings.milestones?.length || 0);
            
            if (progressBarSettings.milestones && progressBarSettings.milestones.length > 0) {
                progressBarSettings.milestones.forEach((m, idx) => {
                    console.log(`   📌 Етап ${idx + 1}:`, {
                        amount: m.amount,
                        title: m.title,
                        discount: m.discount_percent,
                        freeShipping: m.free_shipping,
                        gift: m.gift
                    });
                });
            } else {
                console.warn('⚠️ Немає етапів в налаштуваннях!');
            }
            
            return true;
        } else {
            console.error('❌ Помилка завантаження налаштувань:', data.error);
            return false;
        }
    } catch (error) {
        console.error('❌ Помилка запиту:', error);
        console.error('💥 Деталі помилки:', error.message, error.stack);
        return false;
    }
}

/**
 * Знайти поточний активний етап
 */
function getCurrentMilestone(cartTotal) {
    console.log('🎯 getCurrentMilestone викликано:', {
        cartTotal,
        enabled: progressBarSettings.enabled,
        milestonesCount: progressBarSettings.milestones?.length || 0
    });
    
    if (!progressBarSettings.enabled || !progressBarSettings.milestones || progressBarSettings.milestones.length === 0) {
        return null;
    }
    
    // Сортуємо етапи по сумі (зростання)
    const sortedMilestones = [...progressBarSettings.milestones].sort((a, b) => a.amount - b.amount);
    console.log('📊 Відсортовані етапи:', sortedMilestones.map(m => `${m.amount}₴ - ${m.title}`));
    
    // Знаходимо останній досягнутий етап
    let lastAchieved = null;
    let nextMilestone = sortedMilestones[0];
    
    for (let milestone of sortedMilestones) {
        if (cartTotal >= milestone.amount) {
            lastAchieved = milestone;
        } else {
            nextMilestone = milestone;
            break;
        }
    }
    
    // Якщо досягли всіх етапів
    if (lastAchieved && cartTotal >= sortedMilestones[sortedMilestones.length - 1].amount) {
        return {
            achieved: true,
            milestone: lastAchieved,
            nextMilestone: null,
            percent: 100,
            remaining: 0
        };
    }
    
    // Якщо не досягли жодного етапу
    if (!lastAchieved) {
        const remaining = nextMilestone.amount - cartTotal;
        const percent = (cartTotal / nextMilestone.amount) * 100;
        
        return {
            achieved: false,
            milestone: null,
            nextMilestone: nextMilestone,
            percent: Math.min(percent, 100),
            remaining: remaining
        };
    }
    
    // Проміжний стан між етапами
    const remaining = nextMilestone.amount - cartTotal;
    const rangeStart = lastAchieved.amount;
    const rangeEnd = nextMilestone.amount;
    const percent = ((cartTotal - rangeStart) / (rangeEnd - rangeStart)) * 100;
    
    return {
        achieved: false,
        milestone: lastAchieved,
        nextMilestone: nextMilestone,
        percent: Math.min(percent, 100),
        remaining: remaining
    };
}

/**
 * Оновити прогрес-бар
 */
function updateProgressBar(cartTotal = 0) {
    if (!progressBarSettings.enabled) {
        // Приховуємо прогрес-бари, якщо вимкнено
        hideProgressBars();
        return;
    }
    
    const current = getCurrentMilestone(cartTotal);
    
    if (!current) {
        hideProgressBars();
        return;
    }
    
    console.log('🔄 Оновлення обох прогрес-барів (desktop + mobile)');
    
    // Оновлюємо десктопний прогрес-бар (в навбарі)
    updateProgressBarElement('progress-fill', 'progress-text', 'progress-label', current, cartTotal, false);
    
    // Оновлюємо мобільний прогрес-бар
    updateProgressBarElement('progress-fill-mobile', 'progress-text-mobile', 'progress-label-mobile', current, cartTotal, true);
    
    // Оновлюємо список призів
    updateRewardsList(cartTotal);
}

/**
 * Оновити конкретний елемент прогрес-бару
 */
function updateProgressBarElement(fillId, textId, labelId, current, cartTotal, isMobile = false) {
    const fillElement = document.getElementById(fillId);
    const textElement = document.getElementById(textId);
    const labelElement = document.getElementById(labelId);
    
    console.log(`🎨 Оновлення прогрес-бару (${isMobile ? 'mobile' : 'desktop'}):`, {
        fillId, textId, labelId,
        fillFound: !!fillElement,
        textFound: !!textElement,
        labelFound: !!labelElement
    });
    
    if (!fillElement || !textElement) return;
    
    // Визначаємо колір прогрес-бару
    const color = current.nextMilestone ? current.nextMilestone.color : 
                  current.milestone ? current.milestone.color : '#10b981';
    
    // Оновлюємо прогрес-бар
    fillElement.style.width = current.percent + '%';
    fillElement.style.background = color;
    fillElement.style.transition = 'width 0.3s ease, background 0.3s ease';
    
    // Форматуємо текст
    const formattedTotal = Math.round(cartTotal);
    const formattedRemaining = Math.round(current.remaining);
    
    if (current.achieved && !current.nextMilestone) {
        // Досягнуто всіх етапів
        const milestone = current.milestone;
        let rewardName = 'Бонус';
        
        // Визначаємо назву винагороди
        if (milestone.gift) {
            rewardName = `Подарунок: ${milestone.gift}`;
        } else if (milestone.free_shipping) {
            rewardName = 'Безкоштовна доставка';
        } else if (milestone.discount_percent) {
            rewardName = `Знижка ${milestone.discount_percent}%`;
        }
        
        textElement.textContent = `${formattedTotal}₴ ✨`;
        if (labelElement) {
            labelElement.innerHTML = `<strong>🎉 ${rewardName}</strong>`;
        }
    } else if (current.nextMilestone) {
        // Є наступний етап
        const nextAmount = current.nextMilestone.amount;
        textElement.textContent = `${formattedTotal}₴ / ${nextAmount}₴`;
        
        if (labelElement) {
            // Визначаємо назву винагороди наступного етапу
            let rewardName = 'бонус';
            const nextMilestone = current.nextMilestone;
            
            if (nextMilestone.gift) {
                rewardName = `🎁 ${nextMilestone.gift}`;
            } else if (nextMilestone.free_shipping) {
                rewardName = '🚚 Безкоштовна доставка';
            } else if (nextMilestone.discount_percent) {
                rewardName = `💰 Знижка ${nextMilestone.discount_percent}%`;
            }
            
            if (formattedRemaining > 0) {
                labelElement.innerHTML = `До <strong>${rewardName}</strong> ще ${formattedRemaining}₴`;
            } else {
                labelElement.innerHTML = `<strong>✨ ${rewardName}</strong>`;
            }
        }
    }
    
    // Додаємо анімацію при досягненні етапу
    if (current.achieved && current.milestone) {
        fillElement.style.boxShadow = `0 0 10px ${color}`;
    } else {
        fillElement.style.boxShadow = 'none';
    }
}

/**
 * Приховати прогрес-бари
 */
function hideProgressBars() {
    const progressContainers = [
        document.querySelector('.navbar-progress-container'),
        document.getElementById('mobile-progress-container'),
        document.querySelector('.progress-container')
    ];
    
    progressContainers.forEach(container => {
        if (container) {
            container.style.display = 'none';
        }
    });
}

/**
 * Показати прогрес-бари
 */
function showProgressBars() {
    const progressContainers = [
        document.querySelector('.navbar-progress-container'),
        document.getElementById('mobile-progress-container'),
        document.querySelector('.progress-container')
    ];
    
    progressContainers.forEach(container => {
        if (container) {
            container.style.display = '';
        }
    });
}

/**
 * Отримати список досягнутих призів для відображення
 */
function getAchievedRewards(cartTotal) {
    const rewards = [];
    
    if (!progressBarSettings.milestones || progressBarSettings.milestones.length === 0) {
        return rewards;
    }
    
    const sortedMilestones = [...progressBarSettings.milestones].sort((a, b) => a.amount - b.amount);
    
    sortedMilestones.forEach(milestone => {
        const achieved = cartTotal >= milestone.amount;
        
        console.log(`🎁 Етап ${milestone.amount}₴ "${milestone.title}":`, {
            achieved,
            cartTotal,
            discount: milestone.discount_percent,
            freeShipping: milestone.free_shipping,
            gift: milestone.gift
        });
        
        if (achieved) {
            // Додаємо тільки досягнуті призи
            if (milestone.discount_percent) {
                rewards.push({
                    type: 'discount',
                    icon: '💰',
                    text: `Знижка ${milestone.discount_percent}%`,
                    value: milestone.discount_percent
                });
            }
            if (milestone.free_shipping) {
                rewards.push({
                    type: 'shipping',
                    icon: '🚚',
                    text: 'Безкоштовна доставка',
                    value: true
                });
            }
            if (milestone.gift) {
                rewards.push({
                    type: 'gift',
                    icon: '🎁',
                    text: `Подарунок: ${milestone.gift}`,
                    value: milestone.gift
                });
            }
        }
    });
    
    console.log('✅ Досягнуті призи:', rewards);
    return rewards;
}

/**
 * Оновити список активних призів
 */
function updateRewardsList(cartTotal) {
    // НЕ створюємо контейнер під прогрес-баром
    // Замість цього оновлюємо відображення в cart summary
    updateCartSummaryRewards(cartTotal);
}

/**
 * Оновити відображення призів в підсумку кошика
 */
function updateCartSummaryRewards(cartTotal) {
    const rewards = getAchievedRewards(cartTotal);
    
    // Знаходимо або створюємо контейнер в cart summary
    let summaryContainer = document.getElementById('cart-rewards-summary');
    
    if (!summaryContainer) {
        // Шукаємо секцію summary-details
        const summaryDetails = document.querySelector('.summary-details');
        
        if (summaryDetails) {
            summaryContainer = document.createElement('div');
            summaryContainer.id = 'cart-rewards-summary';
            summaryContainer.className = 'summary-rewards';
            
            // Вставляємо перед total-row
            const totalRow = summaryDetails.querySelector('.total-row');
            if (totalRow) {
                summaryDetails.insertBefore(summaryContainer, totalRow);
            } else {
                summaryDetails.appendChild(summaryContainer);
            }
        }
    }
    
    if (summaryContainer) {
        if (rewards.length > 0) {
            summaryContainer.innerHTML = `
                ${rewards.map(reward => `
                    <div class="summary-row reward-item" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%); border-radius: 8px; padding: 10px; margin-bottom: 8px;">
                        <span style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 18px;">${reward.icon}</span>
                            <span style="font-weight: 600;">${reward.text}</span>
                        </span>
                        <span style="color: #10b981; font-weight: 600; font-size: 18px;">✓</span>
                    </div>
                `).join('')}
            `;
            summaryContainer.style.display = 'block';
        } else {
            summaryContainer.style.display = 'none';
        }
    }
    
    // Оновлюємо компактне відображення в progress-info
    updateProgressInfoText(cartTotal, rewards);
}

/**
 * Оновити текст в progress-info (компактне відображення)
 */
function updateProgressInfoText(cartTotal, rewards) {
    const progressTextMobile = document.getElementById('progress-text-mobile');
    const progressText = document.getElementById('progress-text');
    
    // Знаходимо обидва progress-label
    const progressLabels = document.querySelectorAll('.progress-label');
    
    if (!rewards || rewards.length === 0) {
        // Немає призів - текст вже оновлено в updateProgressBarElement
        console.log('⚠️ updateProgressInfoText: немає активних призів, пропускаємо оновлення');
        return;
    }
    
    // Є призи - labels вже оновлено в updateProgressBarElement з конкретними назвами
    console.log('✅ updateProgressInfoText: є активні призи, автододавання подарунку');
    
    // Автоматично додаємо подарунок в кошик якщо є
    autoAddGiftToCart(rewards);
}

/**
 * Автоматично додати подарунок в кошик
 */
function autoAddGiftToCart(rewards) {
    // Шукаємо подарунок в нагородах
    const giftReward = rewards.find(r => r.type === 'gift' && r.value);
    
    if (!giftReward) {
        // Видаляємо подарунок з кошика якщо його немає в бонусах
        removeGiftFromCart();
        return;
    }
    
    const giftName = giftReward.value;
    
    // Перевіряємо чи подарунок вже в кошику
    if (typeof cart !== 'undefined' && cart.items) {
        // Якщо кошик порожній - не додаємо подарунок
        const nonGiftItems = cart.items.filter(item => !item.isGift);
        if (nonGiftItems.length === 0) {
            console.log('🎁 Кошик порожній - не додаємо подарунок');
            removeGiftFromCart();
            return;
        }
        
        const giftAlreadyInCart = cart.items.some(item => 
            item.title === giftName && item.isGift === true
        );
        
        if (giftAlreadyInCart) {
            console.log('🎁 Подарунок вже в кошику:', giftName);
            return;
        }
        
        // Додаємо подарунок в кошик
        console.log('🎁 Додаємо подарунок в кошик:', giftName);
        
        // Шукаємо чи подарунок є в додаткових товарах на сторінці
        let giftImage = '/static/images/foto 1.jpg'; // Дефолтне зображення
        const additionalProductCards = document.querySelectorAll('.additional-product-card');
        
        additionalProductCards.forEach(card => {
            const cardTitle = card.querySelector('h3')?.textContent?.trim();
            if (cardTitle && cardTitle === giftName) {
                const cardImage = card.querySelector('img')?.src;
                if (cardImage) {
                    giftImage = cardImage;
                    console.log('📷 Знайдено фото подарунку з каталогу:', giftImage);
                }
            }
        });
        
        // Додаємо подарунок як безкоштовний товар
        cart.items.push({
            id: `gift-${Date.now()}`,
            title: giftName, // Без emoji - вже є в priceDisplay
            price: 0,
            currency: 'грн',
            image: giftImage,
            quantity: 1,
            type: 'gift',
            isGift: true // Позначка що це подарунок
        });
        
        // Оновлюємо відображення кошика
        if (typeof updateCartDisplay === 'function') {
            updateCartDisplay();
        }
        if (typeof saveCartToStorage === 'function') {
            saveCartToStorage();
        }
        
        console.log('✅ Подарунок додано в кошик!');
    }
}

/**
 * Видалити всі подарунки з кошика
 */
function removeGiftFromCart() {
    if (typeof cart === 'undefined' || !cart.items) return;
    
    const hadGifts = cart.items.some(item => item.isGift);
    
    if (hadGifts) {
        console.log('🗑️ Видалення подарунків з кошика...');
        cart.items = cart.items.filter(item => !item.isGift);
        
        if (typeof updateCartDisplay === 'function') {
            updateCartDisplay();
        }
        if (typeof saveCartToStorage === 'function') {
            saveCartToStorage();
        }
        
        console.log('✅ Подарунки видалено');
    }
}

/**
 * Ініціалізація прогрес-бару при завантаженні сторінки
 */
async function initializeProgressBar() {
    console.log('🚀 Ініціалізація прогрес-бару...');
    
    // Завантажуємо налаштування
    const loaded = await loadProgressBarSettings();
    
    if (!loaded) {
        console.error('❌ КРИТИЧНА ПОМИЛКА: Не вдалося завантажити налаштування прогрес-бару!');
        console.error('   Можливі причини:');
        console.error('   1. API endpoint /api/progress-bar/ не відповідає');
        console.error('   2. Помилка в json_manager.get_progress_bar_settings()');
        console.error('   3. Файл data.json пошкоджений');
        console.error('   4. Django сервер не запущений');
        console.error('');
        console.error('   🔧 Запустіть діагностику: window.checkProgressBarSystem()');
        hideProgressBars();
        return;
    }
    
    if (!progressBarSettings.enabled) {
        console.warn('⚠️ Прогрес-бар вимкнено в налаштуваннях');
        hideProgressBars();
        return;
    }
    
    if (!progressBarSettings.milestones || progressBarSettings.milestones.length === 0) {
        console.warn('⚠️ Немає етапів прогрес-бару');
        console.warn('   Додайте етапи в адмін-панелі: /admin-panel/marketing/');
        hideProgressBars();
        return;
    }
    
    console.log('✅ Прогрес-бар успішно ініціалізовано');
    showProgressBars();
    
    // Оновлюємо прогрес-бар з поточною сумою кошика
    if (typeof cart !== 'undefined' && cart.itemsTotal) {
        console.log('🔄 Оновлення прогрес-бару для суми:', cart.itemsTotal);
        updateProgressBar(cart.itemsTotal);
    } else {
        console.log('🔄 Оновлення прогрес-бару (кошик порожній)');
        updateProgressBar(0);
    }
}

// Автоматична ініціалізація при завантаженні сторінки
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProgressBar);
} else {
    initializeProgressBar();
}

/**
 * 🔧 ДІАГНОСТИКА СИСТЕМИ - викличте з console: window.checkProgressBarSystem()
 */
async function checkProgressBarSystem() {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║       🔧 ДІАГНОСТИКА СИСТЕМИ ПРОГРЕС-БАРУ           ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    console.log('');
    
    // 1. Перевірка завантаження налаштувань
    console.log('📡 1. ПЕРЕВІРКА API:');
    const loaded = await loadProgressBarSettings();
    console.log('   Результат завантаження:', loaded ? '✅ УСПІШНО' : '❌ ПОМИЛКА');
    console.log('');
    
    // 2. Поточні налаштування
    console.log('⚙️ 2. ПОТОЧНІ НАЛАШТУВАННЯ:');
    console.log('   Увімкнено:', progressBarSettings.enabled);
    console.log('   Етапів:', progressBarSettings.milestones?.length || 0);
    console.log('');
    
    if (progressBarSettings.milestones && progressBarSettings.milestones.length > 0) {
        console.log('📋 3. ДЕТАЛІ ЕТАПІВ:');
        progressBarSettings.milestones.forEach((m, idx) => {
            console.log(`   ╔═ Етап ${idx + 1} ═══════════════════════════════`);
            console.log(`   ║ Сума: ${m.amount}₴`);
            console.log(`   ║ Назва: ${m.title}`);
            console.log(`   ║ Повідомлення: ${m.message}`);
            console.log(`   ║ Колір: ${m.color}`);
            console.log(`   ║ Знижка: ${m.discount_percent || 'немає'}%`);
            console.log(`   ║ Безкоштовна доставка: ${m.free_shipping ? 'ТАК' : 'НІ'}`);
            console.log(`   ║ Подарунок: ${m.gift || 'немає'}`);
            console.log(`   ╚════════════════════════════════════════════`);
        });
        console.log('');
    }
    
    // 3. Перевірка кошика
    console.log('🛒 4. СТАН КОШИКА:');
    if (typeof cart !== 'undefined') {
        console.log('   Товарів:', cart.items?.length || 0);
        console.log('   Сума товарів:', cart.itemsTotal || 0, '₴');
        console.log('   Загальна сума:', cart.total || 0, '₴');
        console.log('');
        
        // 4. Тестування бонусів
        if (cart.itemsTotal > 0) {
            console.log('🎁 5. ТЕСТ БОНУСІВ ДЛЯ ПОТОЧНОЇ СУМИ:');
            const current = getCurrentMilestone(cart.itemsTotal);
            const rewards = getAchievedRewards(cart.itemsTotal);
            
            console.log('   Поточний етап:', current);
            console.log('   Досягнуті бонуси:', rewards);
            console.log('');
        }
    } else {
        console.log('   ⚠️ Кошик ще не ініціалізовано');
        console.log('');
    }
    
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║              ДІАГНОСТИКА ЗАВЕРШЕНА                   ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
}

// Експортуємо функції для використання в інших файлах
if (typeof window !== 'undefined') {
    window.progressBarManager = {
        update: updateProgressBar,
        reload: loadProgressBarSettings,
        getCurrentMilestone: getCurrentMilestone,
        getAchievedRewards: getAchievedRewards,
        updateCartSummaryRewards: updateCartSummaryRewards,
        removeGiftFromCart: removeGiftFromCart  // Додано для очищення подарунків
    };
    
    // Експортуємо діагностичну функцію
    window.checkProgressBarSystem = checkProgressBarSystem;
    
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║  💡 ДЛЯ ДІАГНОСТИКИ ВВЕДІТЬ У CONSOLE:               ║');
    console.log('║     window.checkProgressBarSystem()                  ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    console.log('');
}

