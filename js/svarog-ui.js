// ============================================
// UI ДЛЯ СВАРОЖЬЕГО КРУГА
// ============================================

import { CHERTOGI, LIFE_NUMBERS } from './svarog-data.js';
import { getFullInfo } from './svarog-calculator.js';
import { getSvarogAdvice } from './ai.js';

// ============================================
// 1. ОБРАБОТКА РАСЧЁТА
// ============================================

export function initCalculator() {
    const btn = document.getElementById('calculateBtn');
    const dateInput = document.getElementById('birthDate');
    const timeSelect = document.getElementById('birthTime');

    if (btn) {
        btn.addEventListener('click', function() {
            const dateValue = dateInput.value;
            const timeValue = timeSelect ? timeSelect.value : 'day';

            if (!dateValue) {
                alert('Пожалуйста, выберите дату рождения.');
                return;
            }

            const parts = dateValue.split('-');
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const day = parseInt(parts[2]);

            if (!day || !month || !year) {
                alert('Пожалуйста, заполните все поля.');
                return;
            }

            let hours = 12;
            if (timeValue === 'night') {
                hours = 20;
            } else {
                hours = 12;
            }

            const result = getFullInfo(day, month, year, hours, 0);
            displayResult(result);
        });
    }
}

// ============================================
// 2. ОТОБРАЖЕНИЕ РЕЗУЛЬТАТА
// ============================================

function displayResult(result) {
    const container = document.getElementById('resultContainer');
    if (!container) return;

    // Сохраняем результат для кнопки "Узнать число жизни"
    window._lastResult = result;

    const chertog = result.chertog;
    const zal = result.zal;
    const slavicDate = result.slavicDate;
    const yearEssence = result.yearEssence || { name: '—', element: '—', color: '#888', description: 'Данные недоступны' };
    const transition = result.transition || { isTransition: false };
    
    const weekDayName = slavicDate.weekDay.name;
    const monthName = slavicDate.month.name;
    const dayNum = slavicDate.day;
    const лето = slavicDate.лето;
    const летоInCircle = slavicDate.летоInCircle;
    const летоInLife = slavicDate.летоInLife;
    
    // ===== БЛОК ПЕРЕХОДА =====
    let transitionHtml = '';
    if (transition.isTransition) {
        const from = transition.from;
        const to = transition.to;
        const second = transition.second;
        
        let positionLabel = '';
        if (transition.position === 'before') {
            positionLabel = 'Ты рождён в последний день Чертога ' + from.name + ' — черты его ещё сильны, но дыхание Чертога ' + to.name + ' уже рядом.';
        } else if (transition.position === 'junction') {
            positionLabel = 'Ты рождён в самый миг перехода — на стыке двух Чертогов.';
        } else {
            positionLabel = 'Ты рождён в первый день Чертога ' + to.name + ' — черты его уже проявились, но отголоски Чертога ' + from.name + ' ещё звучат.';
        }
        
        transitionHtml = `
        <div class="result-block" style="background: linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,140,0,0.05)); padding: 15px; border-radius: 10px; margin-top: 15px; border: 1px solid rgba(255,215,0,0.25);">
            <h3 style="color: #ffd700; margin: 0 0 10px 0;">Переход Ярило-Солнца</h3>
            <p style="color: #ffd700; margin: 5px 0; font-size: 16px; font-weight: bold;">${transition.message}</p>
            <p style="color: #ccc; margin: 10px 0 0 0; line-height: 1.6;">${positionLabel}</p>
        </div>
        
        <div class="result-block" style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; margin-top: 15px; border: 1px solid rgba(255,255,255,0.06);">
            <h3 style="color: #ffd700; margin: 0 0 10px 0;">Второй Чертог (соседний)</h3>
            <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                <img src="${second.runeImg}" alt="Руна ${second.name}" class="chertog-rune-img-small">
                <img src="${second.chertogImg}" alt="${second.name}" class="chertog-rune-img-small">
                <div>
                    <p style="color: ${second.color}; font-size: 18px; margin: 0; font-weight: bold;">${second.name}</p>
                    <p style="color: #aaa; margin: 4px 0; font-size: 13px;">Бог-покровитель: <strong style="color: #ffd700;">${second.god}</strong></p>
                    <p style="color: #aaa; margin: 4px 0; font-size: 13px;">Священное дерево: <strong style="color: #44ff88;">${second.tree}</strong></p>
                </div>
            </div>
        </div>
        `;
    }
    
    container.innerHTML = `
        <div class="result-header" style="background: linear-gradient(135deg, ${chertog.color}33, transparent); padding: 24px; border-radius: 12px; border-left: 4px solid ${chertog.color};">
            <div class="chertog-info-grid">
                
                <div class="chertog-info-col">
                    <div class="chertog-info-label">Руна</div>
                    <div class="chertog-info-value" style="color: #888; font-style: italic; font-size: 14px;">в разработке</div>
                    <img src="${chertog.runeImg}" alt="Руна ${chertog.name}" class="chertog-info-img">
                </div>
                
                <div class="chertog-info-col">
                    <div class="chertog-info-label">Чертог</div>
                    <div class="chertog-info-value" style="color: ${chertog.color};">${chertog.name}</div>
                    <img src="${chertog.chertogImg}" alt="${chertog.name}" class="chertog-info-img">
                </div>
                
                <div class="chertog-info-col">
                    <div class="chertog-info-label">Бог-покровитель</div>
                    <div class="chertog-info-value" style="color: #ffd700;">${chertog.god}</div>
                    <img src="${chertog.godImg}" alt="Бог ${chertog.god}" class="chertog-info-img">
                </div>
                
                <div class="chertog-info-col">
                    <div class="chertog-info-label">Стихия</div>
                    <div class="chertog-info-value" style="color: ${chertog.color};">${chertog.element}</div>
                    <img src="${chertog.elementImg}" alt="Стихия ${chertog.element}" class="chertog-info-img">
                </div>
                
                <div class="chertog-info-col">
                    <div class="chertog-info-label">Священное дерево</div>
                    <div class="chertog-info-value" style="color: #44ff88;">${chertog.tree}</div>
                    <div class="chertog-info-img-placeholder"></div>
                </div>
                
                <div class="chertog-info-col">
                    <div class="chertog-info-label">Число жизни</div>
                    <div class="chertog-info-value" style="color: #ffd700;">${result.lifeNumber}</div>
                    <div class="chertog-info-img-placeholder"></div>
                </div>
                
            </div>
        </div>
        
        <div class="result-block" style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; margin-top: 15px; border: 1px solid rgba(255,255,255,0.06);">
            <h3 style="color: #ffd700; margin: 0 0 10px 0;">Славянская дата</h3>
            <p style="color: #ddd; margin: 5px 0;"><strong>${weekDayName}</strong>, ${dayNum} число месяца ${monthName}, ${лето} Лета от С.М.З.Х.</p>
            <p style="color: #888; margin: 5px 0;">Лето в круге Лет: <strong style="color: #ffd700;">${летоInCircle}</strong></p>
            <p style="color: #888; margin: 5px 0;">Лето в круге Жизни: <strong style="color: #ffd700;">${летоInLife}</strong></p>
            ${slavicDate.isAfter18 ? '<p style="color: #ff8844; margin: 5px 0;">Время рождения после 18:00 — день считается следующим</p>' : ''}
        </div>
        
        <div class="result-block" style="background: rgba(255,215,0,0.03); padding: 15px; border-radius: 10px; margin-top: 15px; border: 1px solid rgba(255,215,0,0.1);">
            <h3 style="color: #ffd700; margin: 0 0 10px 0;">Чертог ${chertog.name}</h3>
            <p style="color: #ddd; margin: 5px 0;">Бог-Покровитель: <strong style="color: #ffd700;">${chertog.god}</strong></p>
            <p style="color: #aaa; line-height: 1.8; margin-top: 8px;">${chertog.description}</p>
        </div>
        
        ${transitionHtml}
        
        <div class="result-block" style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; margin-top: 15px; border: 1px solid rgba(255,255,255,0.06);">
            <h3 style="color: #ffd700; margin: 0 0 10px 0;">Сущность года: ${yearEssence.name}</h3>
            <p style="color: #ddd; margin: 5px 0;"><strong>Стихия:</strong> ${yearEssence.element} | <strong>Цвет:</strong> <span style="color:${yearEssence.color}; font-weight:bold;">${yearEssence.color}</span></p>
            <p style="color: #aaa; line-height: 1.8; margin-top: 8px; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; border-left: 3px solid ${yearEssence.color};">${yearEssence.description}</p>
        </div>
        
        ${result.quarterInfo ? `
        <div class="result-block" style="background: rgba(68, 136, 255, 0.03); padding: 15px; border-radius: 10px; margin-top: 15px; border: 1px solid rgba(68, 136, 255, 0.1);">
            <h3 style="color: #88bbff; margin: 0 0 10px 0;">Четверть месяца: ${result.quarterInfo.quarterLabel}</h3>
            <p style="color: #ddd; line-height: 1.8; margin-top: 8px; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; border-left: 3px solid #88bbff;">${result.quarterInfo.description}</p>
            ${result.quarterInfo.dayDescription ? `
            <p style="color: #88bbff; margin-top: 8px; font-style: italic;">День ${result.quarterInfo.dayInQuarter} в четверти: ${result.quarterInfo.dayDescription}</p>
            ` : ''}
            ${result.quarterInfo.isSpecialDay ? `
            <p style="color: #ffd700; margin-top: 8px; font-weight: bold;">Особый день — 41-й день месяца!</p>
            ` : ''}
        </div>
        ` : ''}
        
        <div class="result-block" style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; margin-top: 15px; border: 1px solid rgba(255,255,255,0.06);">
            <h3 style="color: #ffd700; margin: 0 0 10px 0;">Зал рождения: ${zal ? zal.name : '—'}</h3>
            <p style="color: #aaa; margin: 5px 0;">${zal ? (zal.symbol + ' ' + zal.description) : 'Данные недоступны'}</p>
        </div>
        
        <div class="result-block" style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; margin-top: 15px; border: 1px solid rgba(255,255,255,0.06);">
            <h3 style="color: #ffd700; margin: 0 0 10px 0;">Совместимость с другими чертогами</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${(result.compatibility || []).map(name => {
                    const c = CHERTOGI.find(ch => ch.name === name);
                    if (!c) return '';
                    return `<span style="background: ${c.color}22; border: 1px solid ${c.color}44; padding: 6px 12px; border-radius: 12px; color: #ddd; display: inline-flex; align-items: center; gap: 8px;">
                        <img src="${c.runeImg}" alt="Руна ${c.name}" style="width: 24px; height: 24px; object-fit: contain;">
                        <span>${name}</span>
                    </span>`;
                }).join('')}
            </div>
        </div>
        
        ${result.holiday ? `
        <div class="result-block" style="background: rgba(255,215,0,0.05); padding: 15px; border-radius: 10px; margin-top: 15px; border: 1px solid rgba(255,215,0,0.15);">
            <h3 style="color: #ffd700; margin: 0 0 10px 0;">Славянский праздник</h3>
            <p style="color: #ffd700; margin: 5px 0;"><strong>${result.holiday.name}</strong></p>
            <p style="color: #aaa; margin: 5px 0;">${result.holiday.description}</p>
        </div>
        ` : ''}
        
        <div class="result-block" style="background: rgba(68,255,136,0.03); padding: 15px; border-radius: 10px; margin-top: 15px; border: 1px solid rgba(68,255,136,0.1); text-align: center;">
            <h3 style="color: #44ff88; margin: 0 0 10px 0;">Твой оберег</h3>
            <div style="font-size: 80px; margin: 10px 0;">${chertog.symbol}</div>
            <p style="color: #aaa;">Оберег чертога «${chertog.name}» с руной ${chertog.rune}</p>
            <button onclick="generateAmulet()" style="background: rgba(255,215,0,0.15); border: 1px solid #ffd70044; color: #ffd700; padding: 8px 20px; border-radius: 8px; cursor: pointer; margin-top: 10px; transition: all 0.3s;">
                Сгенерировать оберег
            </button>
        </div>
    `;
    
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    setTimeout(() => {
        showSvarogAdvice(result);
    }, 300);
}

// ============================================
// 3. ГЕНЕРАЦИЯ ОБЕРЕГА
// ============================================

window.generateAmulet = function() {
    const container = document.getElementById('resultContainer');
    if (!container) return;
    
    const amuletBtn = container.querySelector('button');
    if (amuletBtn) {
        amuletBtn.textContent = 'Оберег создан!';
        amuletBtn.style.background = 'rgba(68,255,136,0.15)';
        amuletBtn.style.borderColor = '#44ff8844';
        amuletBtn.style.color = '#44ff88';
        
        setTimeout(() => {
            amuletBtn.textContent = 'Сгенерировать оберег';
            amuletBtn.style.background = 'rgba(255,215,0,0.15)';
            amuletBtn.style.borderColor = '#ffd70044';
            amuletBtn.style.color = '#ffd700';
        }, 3000);
    }
};

// ============================================
// 4. ПОКАЗ СОВЕТА ВЕДАГОРА В СВАРОЖЬЕМ КРУГЕ
// ============================================

window.showSvarogAdvice = async function(result) {
    const aiBlock = document.getElementById('svarog-ai-block');
    if (!aiBlock) return;
    
    aiBlock.style.display = 'block';
    
    const loadingEl = aiBlock.querySelector('.svarog-ai-loading');
    const chatArea = aiBlock.querySelector('.svarog-ai-chat-area');
    const chatInput = aiBlock.querySelector('.svarog-ai-chat-input');
    
    if (loadingEl) loadingEl.style.display = 'flex';
    if (chatArea) chatArea.style.display = 'none';
    if (chatInput) chatInput.style.display = 'none';
    
    window._currentSvarogResult = result;
    
    try {
        const advice = await getSvarogAdvice(result, null);
        
        if (loadingEl) loadingEl.style.display = 'none';
        if (chatArea) {
            chatArea.style.display = 'block';
            chatArea.innerHTML = 
                '<div class="ai-message ai-bot">' +
                    '<strong>Ведагор:</strong><br>' +
                    '<span class="ai-text">' + advice.replace(/\n/g, '<br>') + '</span>' +
                '</div>';
        }
        if (chatInput) chatInput.style.display = 'flex';
        
    } catch (error) {
        console.error('Ошибка получения совета:', error);
        if (loadingEl) loadingEl.style.display = 'none';
        if (chatArea) {
            chatArea.style.display = 'block';
            chatArea.innerHTML = 
                '<div class="ai-message ai-bot">' +
                    '<strong style="color:#ff8844;">Ведагор:</strong><br>' +
                    '<span style="color:#888;">Не удалось получить совет. Проверь связь с миром духов.</span>' +
                '</div>';
        }
        if (chatInput) chatInput.style.display = 'flex';
    }
};

// ============================================
// 5. ОТПРАВКА ВОПРОСА ВЕДАГОРУ
// ============================================

window.sendSvarogQuestion = async function() {
    const input = document.getElementById('svarogChatInput');
    if (!input) return;
    const question = input.value.trim();
    if (!question) return;
    
    const chatArea = document.querySelector('.svarog-ai-chat-area');
    if (!chatArea) return;
    
    chatArea.innerHTML += 
        '<div class="ai-message ai-user">' +
            '<strong>Ты:</strong><br>' +
            '<span class="ai-text">' + question + '</span>' +
        '</div>';
    
    input.value = '';
    chatArea.scrollTop = chatArea.scrollHeight;
    
    const loadingId = 'svarog-loading-' + Date.now();
    chatArea.innerHTML += 
        '<div class="ai-message ai-bot" id="' + loadingId + '">' +
            '<span style="color:#888;">Ведагор думает...</span>' +
        '</div>';
    chatArea.scrollTop = chatArea.scrollHeight;
    
    try {
        const result = window._currentSvarogResult;
        if (!result) {
            throw new Error('Нет данных');
        }
        
        const answer = await getSvarogAdvice(result, question);
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            loadingEl.innerHTML = 
                '<strong>Ведагор:</strong><br>' +
                '<span class="ai-text">' + answer.replace(/\n/g, '<br>') + '</span>';
        }
    } catch (error) {
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            loadingEl.innerHTML = 
                '<strong style="color:#ff8844;">Ведагор:</strong><br>' +
                '<span style="color:#888;">Извини, произошла ошибка. Попробуй ещё раз.</span>';
        }
    }
    chatArea.scrollTop = chatArea.scrollHeight;
};

// ============================================
// 6. МОДАЛЬНОЕ ОКНО ЧИСЛА ЖИЗНИ
// ============================================

function initLifeNumberButton() {
    const btn = document.getElementById('lifeNumberBtn');
    const modal = document.getElementById('lifeNumberModal');
    const closeBtn = document.getElementById('closeLifeNumberModal');

    if (!btn || !modal) return;

    btn.addEventListener('click', function() {
        // ===== ПРОВЕРЯЕМ ДАТУ РОЖДЕНИЯ =====
        const dateInput = document.getElementById('birthDate');
        const timeSelect = document.getElementById('birthTime');

        if (!dateInput || !dateInput.value) {
            alert('Сначала введи дату рождения');
            return;
        }

        // ===== ПАРСИМ ДАТУ =====
        const parts = dateInput.value.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);

        if (!day || !month || !year) {
            alert('Сначала введи дату рождения');
            return;
        }

        const timeValue = timeSelect ? timeSelect.value : 'day';
        const hours = timeValue === 'night' ? 20 : 12;

        // ===== СЧИТАЕМ ЗАНОВО ПО ВВЕДЁННОЙ ДАТЕ =====
        const result = getFullInfo(day, month, year, hours, 0);

        const lifeNumber = result.lifeNumber;
        const lifeData = LIFE_NUMBERS[lifeNumber - 1];

        if (!lifeData) {
            alert('Не удалось определить число жизни');
            return;
        }

        const nameEl = modal.querySelector('.god-modal-name');
        const descEl = modal.querySelector('.god-modal-desc');

        // Заголовок: "Ваше число жизни: 9 — Фита"
        nameEl.textContent = 'Ваше число жизни: ' + lifeNumber + ' — ' + lifeData.name;

        // Описание — большой HTML
        descEl.innerHTML = 
            '<p><strong>Вступление:</strong> У Славян и Ариев числа — это не просто абстрактные математические знаки. Каждое число от 1 до 9 (и базовые числа, из которых они сворачиваются) — это мерная волна, качественная характеристика Живы и конкретная чакральная ступень развития Души.</p>' +
            
            '<p><strong>Образ:</strong> ' + lifeData.image + '</p>' +
            
            '<p><strong>Что означает в Числе Жизни:</strong> ' + lifeData.description + '</p>' +
            
            '<p><strong>В тени:</strong> ' + lifeData.shadow + '</p>' +
            
            '<p><strong>Важно понимать:</strong> Никакое Число Жизни или чертог рождения не определяют судьбу человека на 100%. Число Жизни — это всего лишь (комплектация скафандра) набор начальных качеств тела и психики, данная при рождении. А вот как Вы распорядитесь этим скафандром — зависит только от Вашей Совести, Вашей Свободной Воли и Ваших Деяний.</p>' +
            
            '<p style="text-align: center; font-style: italic; color: #6b4426; margin: 16px 0;"><strong>Как учили Старейшины:</strong><br>«Человек по Совести живущий — выше любых гороскопов и чисел стоит, ибо им управляют Боги, а не таблицы!»</p>' +
            
            '<p><strong>Как вычисляется настоящее Число Жизни:</strong> Давайте сегодня разберём Вместе что же такое это за ЧИСЛО ЖИЗНИ? И почему большинство людей ошибаются в расчётах? Ответ очень прост: все складывают или от С.М.З.Х., или от Рождества Христова.</p>' +
            
            '<p>В современной нумерологии люди просто складывают все цифры текущего года: 2 + 0 + 2 + 6 = 10 = 1. Если сложить 7535 от С.М.З.Х. или 111 833 от Даарии, получатся абсолютно разные цифры! И если считать ТАК — это беЗсмысленная бутафория, но в исконном Ведании Число Жизни считается НЕ от абстрактной даты эры.</p>' +
            
            '<p>В Коляды Даре Число Жизни высчитывается строго из космической матрицы 144-летнего Круга Жизни:</p>' +
            
            '<ul style="margin: 10px 0 10px 20px;">' +
                '<li>Номер Лѣта в 144-летнем круге жизни.</li>' +
                '<li>Номер Лѣта в 16-летнем Круге Лѣт (например, 15-е Лѣто — Лунный Дом).</li>' +
                '<li>Номер Сороковника (месяца от 1 до 9).</li>' +
                '<li>День Сороковника (от 1 до 41).</li>' +
                '<li>День Недели (от 1 до 9).</li>' +
            '</ul>' +
            
            '<p>Сам астрономический цикл 16 × 9 = 144 года не меняется! Какое бы название эры мы ни взяли (С.М.З.Х., Даария или Великая Стужа), положение Ярилы-Солнца во Сварожьем Круге в момент Вашего воплощения остаётся строго неизменным.</p>' +
            
            '<p>Григорианский календарь — это искусственная политико-религиозная конструкция, созданная римскими папами и Цезарем. В нём искусственно сдвинуты месяцы, обрезаны дни и переписаны високосы, поэтому когда люди пытаются считать Число Судьбы по дате от Р.Х. (например, 22.09.2026), они считают по искусственному цифровому вирусу, а не по реальному положению Земли и Звёзд! Это всё равно что пытаться измерить температуру тела с помощью линейки.</p>' +
            
            '<p>Конечно, политики, цари и жрецы чужих культов могут каждые сто лет менять точки отсчёта гражданских эр (как Пётр I, урезавший 5508 лет нашей истории), НО НИ ОДИН УКАЗ ЦАРЯ ИЛИ КОГО ЛИБО ЕЩЁ НЕ МОЖЕТ ИЗМЕНИТЬ ДВИЖЕНИЕ КОСМОСА.</p>' +
            
            '<p>Земля как вращалась вокруг Ярилы за 365–369 дней, проходя 16 Чертогов, так и вращается. Круголет Числобога опирается не на решения правителей, а на пульс Галактики.</p>';

        modal.style.display = 'flex';
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
}

// ============================================
// 7. ИНИЦИАЛИЗАЦИЯ
// ============================================

export function initSvarogUI() {
    initCalculator();
    initLifeNumberButton();
    
    const input = document.getElementById('svarogChatInput');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                window.sendSvarogQuestion();
            }
        });
    }
}