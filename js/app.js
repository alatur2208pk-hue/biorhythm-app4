// ============================================
// ИМПОРТЫ
// ============================================

import { CYCLES, MOON_PHASES, MOON_IMAGES } from './config.js';
import { calculateAllCycles, findCriticalDays, getMoonPhase, getMoonImageIndex } from './calculations.js';
import { renderLegend, renderLunarRoad, drawChart, renderCriticalDays } from './render.js';
import { showCriticalInfo, initCloseButtons } from './ui.js';
import { showDayWithAI, askQuestion } from './ai.js';

// ============================================
// 0. МОДАЛЬНОЕ ОКНО ВВОДА ИМЕНИ И ПОЛА
// ============================================

function initUserModal() {
    const modal = document.getElementById('user-modal');
    const nameInput = document.getElementById('userNameInput');
    const genderMale = document.getElementById('genderMale');
    const genderFemale = document.getElementById('genderFemale');
    const genderInput = document.getElementById('userGenderInput');
    const startBtn = document.getElementById('startBtn');
    
    // ===== ПРОВЕРКА: ЕСЛИ ДАННЫЕ УЖЕ ЕСТЬ — ПРОПУСКАЕМ МОДАЛКУ =====
    const savedName = localStorage.getItem('userName');
    const savedGender = localStorage.getItem('userGender');
    
    if (savedName && savedGender) {
        applyUserData(savedName, savedGender);
        modal.style.display = 'none';
        updateApp();
        return;
    }
    
    let selectedGender = '';
    
    genderMale.addEventListener('click', function() {
        selectedGender = 'male';
        genderInput.value = 'male';
        genderMale.style.background = 'rgba(68,136,255,0.2)';
        genderMale.style.borderColor = '#4488ff';
        genderFemale.style.background = 'rgba(255,68,136,0.08)';
        genderFemale.style.borderColor = 'rgba(255,68,136,0.2)';
        checkStart();
    });
    
    genderFemale.addEventListener('click', function() {
        selectedGender = 'female';
        genderInput.value = 'female';
        genderFemale.style.background = 'rgba(255,68,136,0.2)';
        genderFemale.style.borderColor = '#ff4488';
        genderMale.style.background = 'rgba(68,136,255,0.08)';
        genderMale.style.borderColor = 'rgba(68,136,255,0.2)';
        checkStart();
    });
    
    function checkStart() {
        const name = nameInput.value.trim();
        if (name.length > 0 && selectedGender) {
            startBtn.disabled = false;
            startBtn.style.opacity = '1';
            startBtn.style.cursor = 'pointer';
        } else {
            startBtn.disabled = true;
            startBtn.style.opacity = '0.5';
            startBtn.style.cursor = 'default';
        }
    }
    
    nameInput.addEventListener('input', checkStart);
    
    startBtn.addEventListener('click', function() {
        const name = nameInput.value.trim();
        const gender = genderInput.value;
        if (name && gender) {
            localStorage.setItem('userName', name);
            localStorage.setItem('userGender', gender);
            
            applyUserData(name, gender);
            
            modal.style.display = 'none';
            updateApp();
        }
    });
    
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !startBtn.disabled) {
            startBtn.click();
        }
    });
}

// ============================================
// 0.1. ПРИМЕНЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
// ============================================

function applyUserData(name, gender) {
    window._userName = name;
    window._userGender = gender;
    window._userPronoun = 'ты';
    window._userPossessive = gender === 'male' ? 'твой' : 'твоя';
    window._userPossessive2 = gender === 'male' ? 'твоего' : 'твоей';
    window._userPossessive3 = gender === 'male' ? 'твоей' : 'твоей';
    
    const greetingBlock = document.getElementById('greeting-block');
    const greetingText = document.getElementById('greeting-text');
    if (greetingBlock && greetingText) {
        greetingText.textContent = 'Добро пожаловать, ' + name + '! 🌙';
        greetingBlock.style.display = 'block';
    }
}

// ============================================
// 0.2. ВЫХОД (СБРОС ДАННЫХ)
// ============================================

window.logoutUser = function() {
    localStorage.removeItem('userName');
    localStorage.removeItem('userGender');
    window._userName = null;
    window._userGender = null;
    window.location.reload();
};

// ============================================
// 0.3. ГЛОБАЛЬНЫЕ ФУНКЦИИ ДОСТУПА К ДАННЫМ
// ============================================

window.getUserName = function() {
    return window._userName || 'путник';
};

window.getUserGender = function() {
    return window._userGender || 'male';
};

window.getUserPronoun = function() {
    return window._userPronoun || 'ты';
};

window.getUserPossessive = function() {
    return window._userPossessive || 'твой';
};

window.getUserPossessive2 = function() {
    return window._userPossessive2 || 'твоего';
};

window.getUserPossessive3 = function() {
    return window._userPossessive3 || 'твоей';
};

// ============================================
// 1. ГЛАВНАЯ ФУНКЦИЯ
// ============================================

function updateApp() {
    // ===== ПРОБРАСЫВАЕМ КАРТИНКИ ЛУНЫ И ФУНКЦИЮ ИНДЕКСА В WINDOW =====
    window._MOON_IMAGES = MOON_IMAGES;
    window._getMoonImageIndex = getMoonImageIndex;

    var birthInput = document.getElementById('birthdate');
    var viewInput = document.getElementById('viewdate');
    var periodSelect = document.getElementById('periodSelect');

    var birthDate = birthInput.value ? new Date(birthInput.value) : new Date('1990-01-01');
    var viewDate = viewInput.value ? new Date(viewInput.value) : new Date();
    var rangeDays = parseInt(periodSelect.value);

    if (isNaN(birthDate.getTime())) {
        alert('Выберите корректную дату рождения');
        return;
    }

    var data = calculateAllCycles(birthDate, viewDate, rangeDays, CYCLES);
    var criticalMap = findCriticalDays(data, CYCLES);
    
    window._currentData = data;

    function showInfo(data, criticalMap, index) {
        showCriticalInfo(data, criticalMap, index, CYCLES);
    }
    
    function showDay(data, index) {
        showDayWithAI(data, index, CYCLES, getMoonPhase, MOON_PHASES);
    }

    renderLegend(CYCLES);
    renderLunarRoad(data, viewDate, getMoonPhase, MOON_PHASES, showDay, CYCLES);
    drawChart(data, criticalMap, CYCLES, showInfo, showDay, getMoonPhase, MOON_PHASES, birthDate);
    renderCriticalDays(data, criticalMap, showInfo);

    document.getElementById('critical-info').style.display = 'none';
    document.getElementById('day-info').style.display = 'none';
}

// ============================================
// 2. ЗАПУСК
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('birthdate').value = '1990-01-01';
    document.getElementById('viewdate').value = new Date().toISOString().split('T')[0];

    document.getElementById('todayBtn').addEventListener('click', function() {
        document.getElementById('viewdate').value = new Date().toISOString().split('T')[0];
        updateApp();
    });

    document.getElementById('updateBtn').addEventListener('click', updateApp);
    document.getElementById('periodSelect').addEventListener('change', updateApp);
    document.getElementById('birthdate').addEventListener('change', updateApp);
    document.getElementById('viewdate').addEventListener('change', updateApp);

    initCloseButtons();
    initUserModal();
});

// ============================================
// 3. ГЛОБАЛЬНАЯ ФУНКЦИЯ ДЛЯ ДИАЛОГА
// ============================================

window.sendQuestion = async function() {
    const input = document.getElementById('chatInput');
    const question = input.value.trim();
    if (!question) return;
    
    const chatArea = document.querySelector('#day-info .ai-chat-area');
    if (!chatArea) return;
    
    chatArea.innerHTML += 
        '<div class="ai-message ai-user">' +
            '<strong>🧑 Ты:</strong><br>' +
            '<span class="ai-text">' + question + '</span>' +
        '</div>';
    
    input.value = '';
    chatArea.scrollTop = chatArea.scrollHeight;
    
    const loadingId = 'loading-' + Date.now();
    chatArea.innerHTML += 
        '<div class="ai-message ai-bot" id="' + loadingId + '">' +
            '<span style="color:#888;">⏳ Наставник думает...</span>' +
        '</div>';
    chatArea.scrollTop = chatArea.scrollHeight;
    
    try {
        const answer = await askQuestion(question);
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            loadingEl.innerHTML = 
                '<strong>🧙‍♂️ Наставник:</strong><br>' +
                '<span class="ai-text">' + answer + '</span>';
        }
    } catch (error) {
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            loadingEl.innerHTML = 
                '<strong style="color:#ff8844;">🧙‍♂️ Наставник:</strong><br>' +
                '<span style="color:#888;">Извини, произошла ошибка. Попробуй ещё раз.</span>';
        }
    }
    chatArea.scrollTop = chatArea.scrollHeight;
};

window.sendQuestionEnter = function(event) {
    if (event.key === 'Enter') {
        window.sendQuestion();
    }
};