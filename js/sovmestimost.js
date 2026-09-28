// ============================================
// СТРАНИЦА СОВМЕСТИМОСТИ ЧЕРТОГОВ
// ============================================

import { getFullInfo } from './svarog-calculator.js';
import { getSovmestimostAdvice } from './ai.js';

// ============================================
// 1. РАСЧЁТ И ОТОБРАЖЕНИЕ
// ============================================

let currentResult = null;

function initCalculator() {
    const btn = document.getElementById('calculateSovmestimostBtn');
    if (!btn) return;

    btn.addEventListener('click', function() {
        // ===== ПОЛУЧАЕМ ДАННЫЕ ОБОИХ =====
        const hisName = document.getElementById('hisName').value.trim();
        const hisDateValue = document.getElementById('hisBirthDate').value;
        const hisTimeValue = document.getElementById('hisBirthTime').value;

        const herName = document.getElementById('herName').value.trim();
        const herDateValue = document.getElementById('herBirthDate').value;
        const herTimeValue = document.getElementById('herBirthTime').value;

        // ===== ПРОВЕРКА =====
        if (!hisName || !hisDateValue) {
            alert('Заполни имя и дату рождения для него.');
            return;
        }
        if (!herName || !herDateValue) {
            alert('Заполни имя и дату рождения для неё.');
            return;
        }

        // ===== ПАРСИМ ДАТЫ =====
        const hisParts = hisDateValue.split('-');
        const hisYear = parseInt(hisParts[0]);
        const hisMonth = parseInt(hisParts[1]);
        const hisDay = parseInt(hisParts[2]);
        const hisHours = hisTimeValue === 'night' ? 20 : 12;

        const herParts = herDateValue.split('-');
        const herYear = parseInt(herParts[0]);
        const herMonth = parseInt(herParts[1]);
        const herDay = parseInt(herParts[2]);
        const herHours = herTimeValue === 'night' ? 20 : 12;

        // ===== СЧИТАЕМ ОБОИХ =====
        const hisResult = getFullInfo(hisDay, hisMonth, hisYear, hisHours, 0);
        const herResult = getFullInfo(herDay, herMonth, herYear, herHours, 0);

        // ===== СОХРАНЯЕМ =====
        const result = {
            he: {
                name: hisName,
                data: hisResult
            },
            she: {
                name: herName,
                data: herResult
            }
        };

        currentResult = result;
        window._currentSovmestimostResult = result;

        displayResult(result);
        showAiBlock(result);
    });
}

// ============================================
// 2. ОТОБРАЖЕНИЕ РЕЗУЛЬТАТА (КАРТОЧКИ ПАРЫ)
// ============================================

function displayResult(result) {
    const container = document.getElementById('sovmestimostResult');
    if (!container) return;

    const he = result.he;
    const she = result.she;
    const heChertog = he.data.chertog;
    const sheChertog = she.data.chertog;

    container.innerHTML = `
        <h2>💞 ${he.name} и ${she.name}</h2>
        <p class="sovmestimost-sub">Сопоставление чертогов, залов, четвертей и стихий</p>

        <div class="sovmestimost-pair">
            <div class="sovmestimost-pair-item">
                <div class="sovmestimost-pair-icon">
                    <img src="${heChertog.runeImg}" alt="Руна ${heChertog.name}" style="width: 60px; height: 60px; object-fit: contain; filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.35));">
                </div>
                <div class="sovmestimost-pair-name" style="color: ${heChertog.color};">${he.name}</div>
                <div class="sovmestimost-pair-chertog">Чертог ${heChertog.name}</div>
                <div class="sovmestimost-pair-chertog" style="font-size:11px; opacity:0.7;">${heChertog.element} · ${heChertog.god}</div>
            </div>
            <div class="sovmestimost-heart">💞</div>
            <div class="sovmestimost-pair-item">
                <div class="sovmestimost-pair-icon">
                    <img src="${sheChertog.runeImg}" alt="Руна ${sheChertog.name}" style="width: 60px; height: 60px; object-fit: contain; filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.35));">
                </div>
                <div class="sovmestimost-pair-name" style="color: ${sheChertog.color};">${she.name}</div>
                <div class="sovmestimost-pair-chertog">Чертог ${sheChertog.name}</div>
                <div class="sovmestimost-pair-chertog" style="font-size:11px; opacity:0.7;">${sheChertog.element} · ${sheChertog.god}</div>
            </div>
        </div>

        <div class="sovmestimost-text" id="sovmestimostAdviceText">
⏳ Ведагор сопоставляет ваши судьбы...
        </div>
    `;

    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// 3. ПОКАЗ БЛОКА С ЧАТОМ И ЗАПРОС К ВЕДАГОРУ
// ============================================

async function showAiBlock(result) {
    const aiBlock = document.getElementById('sovmestimostAiBlock');
    if (!aiBlock) return;

    aiBlock.style.display = 'block';

    const loadingEl = aiBlock.querySelector('.sovmestimost-ai-loading');
    const chatArea = aiBlock.querySelector('.sovmestimost-ai-chat-area');
    const chatInput = aiBlock.querySelector('.sovmestimost-ai-chat-input');

    if (loadingEl) loadingEl.style.display = 'flex';
    if (chatArea) chatArea.style.display = 'none';
    if (chatInput) chatInput.style.display = 'none';

    try {
        const advice = await getSovmestimostAdvice(result, null);

        // Пишем основной расклад в свиток
        const adviceTextEl = document.getElementById('sovmestimostAdviceText');
        if (adviceTextEl) {
            adviceTextEl.innerHTML = advice.replace(/\n/g, '<br>');
        }

        // Готовим чат
        if (loadingEl) loadingEl.style.display = 'none';
        if (chatArea) {
            chatArea.style.display = 'block';
            chatArea.innerHTML = '';
        }
        if (chatInput) chatInput.style.display = 'flex';

    } catch (error) {
        console.error('Ошибка получения совета:', error);
        const adviceTextEl = document.getElementById('sovmestimostAdviceText');
        if (adviceTextEl) {
            adviceTextEl.innerHTML = '<span style="color:#ff8844;">Не удалось получить расклад. Попробуй позже.</span>';
        }
        if (loadingEl) loadingEl.style.display = 'none';
        if (chatArea) {
            chatArea.style.display = 'block';
            chatArea.innerHTML = '';
        }
        if (chatInput) chatInput.style.display = 'flex';
    }
}

// ============================================
// 4. ОТПРАВКА ВОПРОСА ВЕДАГОРУ ПО СОВМЕСТИМОСТИ
// ============================================

window.sendSovmestimostQuestion = async function() {
    const input = document.getElementById('sovmestimostChatInput');
    if (!input) return;
    const question = input.value.trim();
    if (!question) return;

    const chatArea = document.querySelector('.sovmestimost-ai-chat-area');
    if (!chatArea) return;

    // Сообщение пользователя
    chatArea.innerHTML += 
        '<div class="ai-message ai-user">' +
            '<strong>🧑 Ты:</strong><br>' +
            '<span class="ai-text">' + question + '</span>' +
        '</div>';

    input.value = '';
    chatArea.scrollTop = chatArea.scrollHeight;

    // Индикатор загрузки
    const loadingId = 'sovmestimost-loading-' + Date.now();
    chatArea.innerHTML += 
        '<div class="ai-message ai-bot" id="' + loadingId + '">' +
            '<img src="images/vedagor.png" alt="Ведагор" style="width: 30px; height: 30px; object-fit: contain; vertical-align: middle; margin-right: 6px;">' +
            '<span style="color:#888;">Ведагор думает...</span>' +
        '</div>';
    chatArea.scrollTop = chatArea.scrollHeight;

    try {
        const result = window._currentSovmestimostResult;
        if (!result) throw new Error('Нет данных');

        const answer = await getSovmestimostAdvice(result, question);
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            loadingEl.innerHTML = 
                '<strong style="display: inline-flex; align-items: center; gap: 8px;"><img src="images/vedagor.png" alt="Ведагор" style="width: 30px; height: 30px; object-fit: contain; vertical-align: middle;"> Ведагор:</strong><br>' +
                '<span class="ai-text">' + answer.replace(/\n/g, '<br>') + '</span>';
        }
    } catch (error) {
        console.error('Ошибка:', error);
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            loadingEl.innerHTML = 
                '<strong style="color:#ff8844; display: inline-flex; align-items: center; gap: 8px;"><img src="images/vedagor.png" alt="Ведагор" style="width: 30px; height: 30px; object-fit: contain; vertical-align: middle;"> Ведагор:</strong><br>' +
                '<span style="color:#888;">Произошла ошибка. Попробуй ещё раз.</span>';
        }
    }
    chatArea.scrollTop = chatArea.scrollHeight;
};

// ============================================
// 5. ЗАПУСК
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Загружаем имя пользователя для приветствия (опционально)
    if (!window._userName) {
        const savedName = localStorage.getItem('userName');
        const savedGender = localStorage.getItem('userGender');
        if (savedName && savedGender) {
            window._userName = savedName;
            window._userGender = savedGender;
            window._userPossessive = savedGender === 'male' ? 'твой' : 'твоя';
            window._userPossessive2 = savedGender === 'male' ? 'твоего' : 'твоей';
        }
    }

    initCalculator();

    // Обработка Enter в чате
    const input = document.getElementById('sovmestimostChatInput');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                window.sendSovmestimostQuestion();
            }
        });
    }
});