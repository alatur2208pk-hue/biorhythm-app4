// ============================================
// ПАНТЕОН БОГОВ — ЛОГИКА
// ============================================

import { PANTHEON } from './pantheon-data.js';

// ============================================
// 1. РЕНДЕР ВСЕХ СЕКЦИЙ
// ============================================

function renderPantheon() {
    const container = document.getElementById('pantheonContainer');
    if (!container) return;

    let html = '';

    PANTHEON.forEach(function(section) {
        html += 
            '<section class="pantheon-section" data-section="' + section.id + '">' +
                '<h2 class="pantheon-section-title">' + section.title + '</h2>' +
                '<p class="pantheon-section-desc">' + section.description + '</p>' +
                '<div class="pantheon-grid">';

        section.gods.forEach(function(god) {
            // god — либо строка (старый формат), либо объект { name, description }
            const godName = typeof god === 'string' ? god : god.name;
            const searchKey = godName.toLowerCase();
            html += 
                '<div class="pantheon-card" data-name="' + searchKey + '" data-section="' + section.id + '">' +
                    '<div class="pantheon-card-icon">🔆</div>' +
                    '<div class="pantheon-card-name">' + godName + '</div>' +
                '</div>';
        });

        html += 
                '</div>' +
            '</section>';
    });

    container.innerHTML = html;

    // Навешиваем клики на карточки
    container.querySelectorAll('.pantheon-card').forEach(function(card) {
        card.addEventListener('click', function() {
            const name = this.querySelector('.pantheon-card-name').textContent;
            openGodModal(name);
        });
    });
}

// ============================================
// 2. ПОИСК
// ============================================

function initSearch() {
    const input = document.getElementById('pantheonSearchInput');
    if (!input) return;

    input.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        const cards = document.querySelectorAll('.pantheon-card');
        const sections = document.querySelectorAll('.pantheon-section');

        // Показываем/скрываем карточки
        cards.forEach(function(card) {
            const name = card.getAttribute('data-name');
            if (!query || name.indexOf(query) !== -1) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        // Скрываем секцию, если в ней нет видимых карточек
        sections.forEach(function(section) {
            const visibleCards = section.querySelectorAll('.pantheon-card:not([style*="display: none"])');
            if (visibleCards.length === 0) {
                section.style.display = 'none';
            } else {
                section.style.display = '';
            }
        });
    });
}

// ============================================
// 3. МОДАЛЬНОЕ ОКНО БОГА
// ============================================

function initModal() {
    const modal = document.getElementById('godModal');
    const closeBtn = document.getElementById('closeGodModal');
    if (!modal || !closeBtn) return;

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Закрытие по клику вне окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
        }
    });
}

function openGodModal(name) {
    const modal = document.getElementById('godModal');
    if (!modal) return;

    const iconEl = modal.querySelector('.god-modal-icon');
    const nameEl = modal.querySelector('.god-modal-name');
    const descEl = modal.querySelector('.god-modal-desc');

    // Ищем бога во всех секциях — либо строку, либо объект
    let foundGod = null;
    for (const section of PANTHEON) {
        for (const god of section.gods) {
            const godName = typeof god === 'string' ? god : god.name;
            if (godName === name) {
                foundGod = god;
                break;
            }
        }
        if (foundGod) break;
    }

    iconEl.textContent = '🔆';
    nameEl.textContent = name;

    // Если у бога есть description — показываем
    if (foundGod && typeof foundGod === 'object' && foundGod.description) {
        descEl.innerHTML = foundGod.description.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>');
    } else {
        descEl.innerHTML = '<em style="color: #888;">📖 Подробное описание скоро появится — сейчас оно в разработке.</em>';
    }

    modal.style.display = 'flex';
}

// ============================================
// 4. ГЕНЕРАЦИЯ ЗВЁЗД
// ============================================

function createStars() {
    const container = document.getElementById('stars');
    if (!container) return;
    const count = 150;
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        container.appendChild(star);
    }
}

// ============================================
// 5. ЗАПУСК
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    createStars();
    renderPantheon();
    initSearch();
    initModal();
});