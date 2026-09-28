// ============================================
// ТОЧКА ВХОДА ДЛЯ СВАРОЖЬЕГО КРУГА
// ============================================

import { initSvarogUI } from './svarog-ui.js';

document.addEventListener('DOMContentLoaded', function() {
    // Загружаем данные пользователя из localStorage
    if (!window._userName) {
        const savedName = localStorage.getItem('userName');
        const savedGender = localStorage.getItem('userGender');
        if (savedName && savedGender) {
            window._userName = savedName;
            window._userGender = savedGender;
            window._userPronoun = 'ты';
            window._userPossessive = savedGender === 'male' ? 'твой' : 'твоя';
            window._userPossessive2 = savedGender === 'male' ? 'твоего' : 'твоей';
            window._userPossessive3 = savedGender === 'male' ? 'твоей' : 'твоей';
        }
    }
    
    // Показываем приветствие
    const userName = window._userName;
    const userGender = window._userGender;
    
    if (userName) {
        const greetingBlock = document.getElementById('svarog-greeting-block');
        const greetingText = document.getElementById('svarog-greeting-text');
        if (greetingBlock && greetingText) {
            greetingText.innerHTML = 'Добро пожаловать, ' + userName + '! <img src="images/vedagor.png" alt="Ведагор" style="width: 64px; height: 64px; object-fit: contain; vertical-align: middle; margin-left: 8px; filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.35));">';
            greetingBlock.style.display = 'block';
        }
    }
    
    initSvarogUI();
});