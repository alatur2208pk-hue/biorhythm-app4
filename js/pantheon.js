// ============================================
// ПАНТЕОН БОГОВ — ЛОГИКА
// ============================================

import { PANTHEON, ZAPOVEDI } from './pantheon-data.js';

const GOD_IMAGES = {
    'Бог Род': 'images/bogi/rod.png',
    'Бог Сварог': 'images/bogi/svarog.png',
    'Бог Перун': 'images/bogi/perun1.png',
    'Лада-Матушка': 'images/bogi/lada1.png',
    'Богородица Макошь': 'images/bogi/makosh1.png',
    'Даждьбог': 'images/bogi/dajdbog.png',
    'Бог Велес': 'images/bogi/veles.png',
    'Богиня Марена': 'images/bogi/mara.png'
};

// ============================================
// 1. НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ
// ============================================

function initHomeCards() {
    const cards = document.querySelectorAll('.pantheon-home-card');
    const home = document.getElementById('pantheonHome');
    const sectionView = document.getElementById('pantheonSectionView');
    const backBtn = document.getElementById('backToHomeBtn');

    cards.forEach(function(card) {
        card.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // Скрываем стартовый экран, показываем контент
            home.style.display = 'none';
            sectionView.style.display = 'block';

            // Сброс поиска
            const searchInput = document.getElementById('pantheonSearchInput');
            if (searchInput) searchInput.value = '';

            if (sectionId === 'zapovedi') {
                document.getElementById('pantheonSearchWrap').style.display = 'none';
                document.getElementById('pantheonContainer').style.display = 'none';
                document.getElementById('zapovediContainer').style.display = 'block';
                renderZapovedi();
            } else {
                document.getElementById('pantheonSearchWrap').style.display = 'block';
                document.getElementById('zapovediContainer').style.display = 'none';
                document.getElementById('pantheonContainer').style.display = 'block';
                renderGodsBySection(sectionId);
            }
        });
    });

    if (backBtn) {
        backBtn.addEventListener('click', function() {
            sectionView.style.display = 'none';
            home.style.display = 'block';
        });
    }
}

// ============================================
// 2. РЕНДЕР БОГОВ ПО СЕКЦИИ
// ============================================

function renderGodsBySection(sectionId) {
    const container = document.getElementById('pantheonContainer');
    if (!container) return;

    const section = PANTHEON.find(function(s) { return s.id === sectionId; });
    if (!section) return;

    let html = 
        '<section class="pantheon-section" data-section="' + section.id + '">' +
            '<h2 class="pantheon-section-title">' + section.title + '</h2>' +
            '<p class="pantheon-section-desc">' + section.description + '</p>' +
            '<div class="pantheon-grid">';

    section.gods.forEach(function(god) {
        const godName = typeof god === 'string' ? god : god.name;
        const searchKey = godName.toLowerCase();

        // Проверяем, есть ли картинка для этого бога
        let iconHtml = '🔆';
        if (GOD_IMAGES[godName]) {
            iconHtml = '<img src="' + GOD_IMAGES[godName] + '" alt="' + godName + '" class="pantheon-card-img">';
        }

        html += 
            '<div class="pantheon-card" data-name="' + searchKey + '">' +
                '<div class="pantheon-card-icon">' + iconHtml + '</div>' +
                '<div class="pantheon-card-name">' + godName + '</div>' +
            '</div>';
    });

    html += 
            '</div>' +
        '</section>';

    container.innerHTML = html;

    container.querySelectorAll('.pantheon-card').forEach(function(card) {
        card.addEventListener('click', function() {
            const name = this.querySelector('.pantheon-card-name').textContent;
            openGodModal(name);
        });
    });
}

// ============================================
// 3. РЕНДЕР ЗАПОВЕДЕЙ
// ============================================

function renderZapovedi() {
    const container = document.getElementById('zapovediContainer');
    if (!container) return;

    let html = 
        '<section class="pantheon-section">' +
            '<h2 class="pantheon-section-title">Заповеди Богов</h2>' +
            '<p class="pantheon-section-desc">Заповеди Богов Светлых: Рамхата, Сварога, Перуна, Лады-Богородицы, Стрибога, Одина, Ладаада, Числобога, Даждьбога... и Два Великих Принципа, чтобы человек мог выполнять все Заповеди: Свято чтить Светлых Богов и Многомудрых Предков своих, а также жить по Совести.</p>' +
            '<div class="pantheon-grid">';

    ZAPOVEDI.forEach(function(zap) {
        html += 
            '<div class="pantheon-card zapoved-card" data-name="' + zap.name.toLowerCase() + '">' +
                '<div class="pantheon-card-icon">📜</div>' +
                '<div class="pantheon-card-name">' + zap.name + '</div>' +
            '</div>';
    });

    html += 
            '</div>' +
        '</section>';

    container.innerHTML = html;

    container.querySelectorAll('.zapoved-card').forEach(function(card) {
        card.addEventListener('click', function() {
            const name = this.querySelector('.pantheon-card-name').textContent;
            openZapovedModal(name);
        });
    });
}

// ============================================
// 4. ПОИСК
// ============================================

function initSearch() {
    const input = document.getElementById('pantheonSearchInput');
    if (!input) return;

    input.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        const cards = document.querySelectorAll('#pantheonContainer .pantheon-card');

        cards.forEach(function(card) {
            const name = card.getAttribute('data-name');
            if (!query || name.indexOf(query) !== -1) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ============================================
// 5. МОДАЛЬНОЕ ОКНО БОГА
// ============================================

function initModal() {
    const modal = document.getElementById('godModal');
    const closeBtn = document.getElementById('closeGodModal');
    if (!modal || !closeBtn) return;

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
        }
    });
}

function openGodModal(name) {
    const modal = document.getElementById('godModal');
    if (!modal) return;

    const iconEl = modal.querySelector('.ui-scroll-god-icon');
    const nameEl = modal.querySelector('.god-modal-name');
    const descEl = modal.querySelector('.god-modal-desc');

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

    if (GOD_IMAGES[name]) {
        iconEl.innerHTML = '<img src="' + GOD_IMAGES[name] + '" alt="' + name + '">';
    } else {
        iconEl.innerHTML = '🔆';
    }

    nameEl.textContent = name;

    if (foundGod && typeof foundGod === 'object' && foundGod.description) {
        descEl.innerHTML = foundGod.description.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>');
    } else {
        descEl.innerHTML = '<em style="color: #888;">📖 Подробное описание скоро появится — сейчас оно в разработке.</em>';
    }

    modal.style.display = 'flex';
}

// ============================================
// 6. МОДАЛЬНОЕ ОКНО ЗАПОВЕДЕЙ
// ============================================

function openZapovedModal(name) {
    const modal = document.getElementById('godModal');
    if (!modal) return;

    const iconEl = modal.querySelector('.ui-scroll-god-icon');
    const nameEl = modal.querySelector('.god-modal-name');
    const descEl = modal.querySelector('.god-modal-desc');

    const zap = ZAPOVEDI.find(function(z) { return z.name === name; });
    if (!zap) return;

    iconEl.innerHTML = '📜';
    nameEl.textContent = zap.name;

    const paragraphs = zap.text.split('\n').map(function(line) {
        return '<p>' + line + '</p>';
    }).join('');

    descEl.innerHTML = paragraphs;

    modal.style.display = 'flex';
}

// ============================================
// 7. ГЕНЕРАЦИЯ ЗВЁЗД
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
// 8. ЗАПУСК
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    createStars();
    initHomeCards();
    initSearch();
    initModal();
});