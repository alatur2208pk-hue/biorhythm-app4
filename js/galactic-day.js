// ============================================
// ГАЛАКТИЧЕСКИЕ СУТКИ (СУТКИ СВАРОГА)
// ============================================

// ============================================
// 1. ДАННЫЕ ЭПОХ
// ============================================

const EPOCHS = [
    { id: 1,  name: 'Дева',    god: 'Джива',           start: -10948, end: -9328, phase: 'Вечер', symbol: '🌿', color: '#8B0000' },
    { id: 2,  name: 'Раса',    god: 'Даждьбог (Тарх)', start: -9328,  end: -7708, phase: 'Вечер', symbol: '🌟', color: '#9400D3' },
    { id: 3,  name: 'Орёл',    god: 'Перун',           start: -7708,  end: -6088, phase: 'Вечер', symbol: '🦅', color: '#B22222' },
    { id: 4,  name: 'Конь',    god: 'Купала',          start: -6088,  end: -4468, phase: 'Вечер', symbol: '🐴', color: '#DAA520' },
    { id: 5,  name: 'Финист',  god: 'Вышень',          start: -4468,  end: -2848, phase: 'Ночь',  symbol: '🦅', color: '#FF6347' },
    { id: 6,  name: 'Лось',    god: 'Лада',            start: -2848,  end: -1228, phase: 'Ночь',  symbol: '🦌', color: '#CD853F' },
    { id: 7,  name: 'Тур',     god: 'Крышень',         start: -1228,  end: -392,  phase: 'Ночь',  symbol: '🐂', color: '#228B22' },
    { id: 8,  name: 'Лиса',    god: 'Марена',          start: -392,   end: 2012,  phase: 'Ночь',  symbol: '🦊', color: '#FF8C00' },
    { id: 9,  name: 'Волк',    god: 'Велес',           start: 2012,   end: 3632,  phase: 'Утро',  symbol: '🐺', color: '#A9A9A9' },
    { id: 10, name: 'Бусл',    god: 'Род',             start: 3632,   end: 5252,  phase: 'Утро',  symbol: '🦅', color: '#4B0082' },
    { id: 11, name: 'Медведь', god: 'Сварог',          start: 5252,   end: 6872,  phase: 'Утро',  symbol: '🐻', color: '#8B6914' },
    { id: 12, name: 'Ворон',   god: 'Коляда, Варуна',  start: 6872,   end: 8492,  phase: 'Утро',  symbol: '🐦', color: '#2F2F2F' },
    { id: 13, name: 'Змей',    god: 'Семаргл',         start: 8492,   end: 10112, phase: 'День',  symbol: '🐉', color: '#00FF00' },
    { id: 14, name: 'Лебедь',  god: 'Макошь',          start: 10112,  end: 11732, phase: 'День',  symbol: '🦢', color: '#FFD700' },
    { id: 15, name: 'Щука',    god: 'Рожана',          start: 11732,  end: 13352, phase: 'День',  symbol: '🐟', color: '#1E90FF' },
    { id: 16, name: 'Вепрь',   god: 'Рамхат',          start: 13352,  end: 14972, phase: 'День',  symbol: '🐗', color: '#8B4513' }
];

// ============================================
// 2. ОПИСАНИЯ ФАЗ
// ============================================

const PHASE_DESCRIPTIONS = {
    'Вечер': 'Вечер Суток Сварога — время завершения великого цикла. Человечество пожинает плоды прошлых деяний, накапливает мудрость и готовится к переходу в Ночь.',
    'Ночь':  'Ночь Суток Сварога — время испытаний и забвения. Тёмные силы берут верх, знания скрываются, народы теряют память о своих корнях. Но именно в ночи рождается свет — те, кто сохранил искру.',
    'Утро':  'Утро Суток Сварога — время пробуждения и возрождения. Рассвет занимается над миром: возвращаются Древние Знания, народы вспоминают своих Богов и Предков, силы Света набирают мощь.',
    'День':  'День Суток Сварога — время расцвета и полноты сил. Человечество живёт в гармонии с Природой и Богами, знания открыты, мир процветает.'
};

// ============================================
// 3. ЧЕТВЕРТИ ЭПОХИ
// ============================================

const QUARTER_DESCRIPTIONS = [
    { name: 'Рассвет эпохи', years: [0, 405],    color: '#FFD700' },
    { name: 'День эпохи',    years: [405, 810],  color: '#44AAFF' },
    { name: 'Вечер эпохи',   years: [810, 1215], color: '#FF8C00' },
    { name: 'Закат эпохи',   years: [1215, 1620], color: '#8B0000' }
];

// ============================================
// 4. КОНСТАНТЫ
// ============================================

const START_ANGLE = -90;
const SECTOR_ANGLE = 22.5;

// ============================================
// 5. ГЕОМЕТРИЯ
// ============================================

const SIZE = 3543;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_OUTER = SIZE / 2 - 10;
const R_INNER = 500;
const R_SUN = 90;

// ============================================
// 6. ФУНКЦИИ ВРЕМЕНИ
// ============================================

function getCurrentYear() {
    const now = new Date();
    return now.getFullYear() + (now.getMonth() + 1) / 12 + now.getDate() / 365;
}

function getCurrentEpoch() {
    const year = getCurrentYear();
    for (let i = 0; i < EPOCHS.length; i++) {
        const e = EPOCHS[i];
        if (year >= e.start && year < e.end) {
            return { epoch: e, index: i };
        }
    }
    return { epoch: EPOCHS[8], index: 8 };
}

function getEpochProgress(epoch) {
    const year = getCurrentYear();
    const yearsInEpoch = year - epoch.start;
    const progress = yearsInEpoch / 1620;
    return {
        yearsInEpoch: Math.max(0, yearsInEpoch),
        progress: Math.max(0, Math.min(1, progress)),
        yearsLeft: Math.max(0, epoch.end - year)
    };
}

function getQuarter(yearsInEpoch) {
    for (let i = 0; i < QUARTER_DESCRIPTIONS.length; i++) {
        const q = QUARTER_DESCRIPTIONS[i];
        if (yearsInEpoch >= q.years[0] && yearsInEpoch < q.years[1]) {
            return { index: i, ...q, yearsInQuarter: yearsInEpoch - q.years[0] };
        }
    }
    return { index: 0, ...QUARTER_DESCRIPTIONS[0], yearsInQuarter: 0 };
}

// ============================================
// 7. ПОРЯДОК И ГЕОМЕТРИЯ
// ============================================

function getOrderIndex(epochId) {
    if (epochId === 1) return 15;
    return epochId - 2;
}

function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = angleDeg * Math.PI / 180;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad)
    };
}

function describeArc(cx, cy, rOuter, rInner, startAngle, endAngle) {
    const startOuter = polarToCartesian(cx, cy, rOuter, startAngle);
    const endOuter = polarToCartesian(cx, cy, rOuter, endAngle);
    const startInner = polarToCartesian(cx, cy, rInner, startAngle);
    const endInner = polarToCartesian(cx, cy, rInner, endAngle);
    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
    return [
        'M', startOuter.x, startOuter.y,
        'A', rOuter, rOuter, 0, largeArc, 1, endOuter.x, endOuter.y,
        'L', endInner.x, endInner.y,
        'A', rInner, rInner, 0, largeArc, 0, startInner.x, startInner.y,
        'Z'
    ].join(' ');
}

// ============================================
// 8. ОТРИСОВКА SVG
// ============================================

const svg = document.getElementById('gc-overlay');
const NS = 'http://www.w3.org/2000/svg';

function createSVG(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) {
        e.setAttribute(k, attrs[k]);
    }
    return e;
}

function drawClock() {
    svg.innerHTML = '';

    // ===== 8.1. DEFS =====
    const defs = createSVG('defs', {});

    const sunCoreGrad = createSVG('radialGradient', {
        id: 'sunCoreGrad',
        cx: '50%', cy: '50%', r: '50%'
    });
    sunCoreGrad.appendChild(createSVG('stop', { offset: '0%',   'stop-color': '#FFFAE0' }));
    sunCoreGrad.appendChild(createSVG('stop', { offset: '25%',  'stop-color': '#FFE066' }));
    sunCoreGrad.appendChild(createSVG('stop', { offset: '55%',  'stop-color': '#FFB300' }));
    sunCoreGrad.appendChild(createSVG('stop', { offset: '80%',  'stop-color': '#FF7A00' }));
    sunCoreGrad.appendChild(createSVG('stop', { offset: '100%', 'stop-color': '#CC4400' }));
    defs.appendChild(sunCoreGrad);

    const sunGlowGrad = createSVG('radialGradient', {
        id: 'sunGlowGrad',
        cx: '50%', cy: '50%', r: '50%'
    });
    sunGlowGrad.appendChild(createSVG('stop', { offset: '0%',   'stop-color': '#FFD700', 'stop-opacity': '0.55' }));
    sunGlowGrad.appendChild(createSVG('stop', { offset: '50%',  'stop-color': '#FFA500', 'stop-opacity': '0.25' }));
    sunGlowGrad.appendChild(createSVG('stop', { offset: '100%', 'stop-color': '#FF6600', 'stop-opacity': '0' }));
    defs.appendChild(sunGlowGrad);

    svg.appendChild(defs);

    // ===== 8.2. СЕКТОРА-ЗОНЫ КЛИКА =====
    EPOCHS.forEach(function(epoch) {
        const orderIdx = getOrderIndex(epoch.id);
        const startAngle = START_ANGLE + orderIdx * SECTOR_ANGLE;
        const endAngle = startAngle + SECTOR_ANGLE;

        const path = createSVG('path', {
            d: describeArc(CX, CY, R_OUTER, R_INNER, startAngle, endAngle),
            class: 'gc-sector',
            'data-epoch-id': epoch.id
        });
        svg.appendChild(path);
    });

    // ===== 8.3. ОРБИТЫ С 8 ПЛАНЕТАМИ =====
    // Орбиты разнесены друг от друга на 30% (шаг ~60px), размеры планет сохранены
    const planetsData = [
        { r: R_SUN + 60,  size: 18, color: '#A0A0A0', speed: 20,  orbitClass: 'gc-orbit-1' }, // Меркурий
        { r: R_SUN + 150,  size: 24, color: '#E6C088', speed: 32,  orbitClass: 'gc-orbit-2' }, // Венера
        { r: R_SUN + 230, size: 27, color: '#6BA8E0', speed: 48,  orbitClass: 'gc-orbit-3' }, // Земля
        { r: R_SUN + 300, size: 22, color: '#C9705A', speed: 62,  orbitClass: 'gc-orbit-4' }, // Марс
        { r: R_SUN + 400, size: 45, color: '#D4A76A', speed: 85,  orbitClass: 'gc-orbit-5' }, // Юпитер
        { r: R_SUN + 500, size: 38, color: '#E8D48B', speed: 110, orbitClass: 'gc-orbit-6' }, // Сатурн
        { r: R_SUN + 610, size: 30, color: '#8FC5D4', speed: 140, orbitClass: 'gc-orbit-7' }, // Уран
        { r: R_SUN + 740, size: 27, color: '#5B7FBF', speed: 175, orbitClass: 'gc-orbit-8' }  // Нептун
    ];

    planetsData.forEach(function(p) {
        const orbit = createSVG('circle', {
            cx: CX, cy: CY, r: p.r,
            class: 'gc-planet-orbit'
        });
        svg.appendChild(orbit);

        const planetGroup = createSVG('g', {
            class: p.orbitClass
        });
        planetGroup.style.animationDuration = p.speed + 's';

        const planet = createSVG('circle', {
            cx: CX, cy: CY - p.r, r: p.size,
            fill: p.color,
            class: 'gc-planet'
        });

        const planetHighlight = createSVG('circle', {
            cx: CX - p.size * 0.3,
            cy: CY - p.r - p.size * 0.3,
            r: p.size * 0.35,
            fill: 'rgba(255, 255, 255, 0.55)',
            'pointer-events': 'none'
        });

        planetGroup.appendChild(planet);
        planetGroup.appendChild(planetHighlight);
        svg.appendChild(planetGroup);
    });

    // ===== 8.4. РЕАЛИСТИЧНОЕ СОЛНЦЕ =====
    const sunGlow = createSVG('circle', {
        cx: CX, cy: CY, r: R_SUN * 2.4,
        fill: 'url(#sunGlowGrad)',
        class: 'gc-sun-glow'
    });
    svg.appendChild(sunGlow);

    const sunRaysGroup = createSVG('g', { class: 'gc-sun-rays' });
    const raysCount = 12;
    for (let i = 0; i < raysCount; i++) {
        const angle = (360 / raysCount) * i;
        const rad = angle * Math.PI / 180;
        const isLong = i % 2 === 0;
        const r1 = R_SUN + 12;
        const r2 = R_SUN + (isLong ? 55 : 32);
        const x1 = CX + r1 * Math.cos(rad);
        const y1 = CY + r1 * Math.sin(rad);
        const x2 = CX + r2 * Math.cos(rad);
        const y2 = CY + r2 * Math.sin(rad);

        const ray = createSVG('line', {
            x1: x1, y1: y1, x2: x2, y2: y2,
            stroke: '#FFD700',
            'stroke-width': isLong ? 4 : 2.5,
            'stroke-linecap': 'round',
            opacity: isLong ? 0.85 : 0.6
        });
        sunRaysGroup.appendChild(ray);
    }
    svg.appendChild(sunRaysGroup);

    const sunCore = createSVG('circle', {
        cx: CX, cy: CY, r: R_SUN,
        fill: 'url(#sunCoreGrad)',
        class: 'gc-sun-core'
    });
    svg.appendChild(sunCore);

    const sunHighlight = createSVG('circle', {
        cx: CX - R_SUN * 0.25,
        cy: CY - R_SUN * 0.25,
        r: R_SUN * 0.45,
        fill: 'rgba(255, 250, 200, 0.6)',
        class: 'gc-sun-highlight'
    });
    svg.appendChild(sunHighlight);

    // ===== 8.5. ПОЗИЦИЯ HTML-СТРЕЛКИ =====
    updateArrowPosition();
}

// ============================================
// 9. ПОЗИЦИЯ HTML-СТРЕЛКИ
// ============================================

function updateArrowPosition() {
    const arrowLayer = document.getElementById('gc-arrow-layer');
    if (!arrowLayer) return;

    const current = getCurrentEpoch();
    const orderIdx = getOrderIndex(current.epoch.id);
    const progress = getEpochProgress(current.epoch);

    const sectorStart = START_ANGLE + orderIdx * SECTOR_ANGLE;
    const angle = sectorStart + progress.progress * SECTOR_ANGLE;

    // +5° по часовой стрелке
    const finalAngle = angle + 5;

    arrowLayer.style.transform = `rotate(${finalAngle + 90}deg)`;

    console.log('Стрелка: эпоха=' + current.epoch.name + ', угол=' + finalAngle.toFixed(2) + '°');
}

// ============================================
// 10. КЛИК ПО СЕКТОРУ
// ============================================

function initSectorClicks() {
    const sectors = document.querySelectorAll('.gc-sector');
    sectors.forEach(function(sector) {
        sector.addEventListener('click', function() {
            const epochId = parseInt(this.getAttribute('data-epoch-id'));
            showEpochInfo(epochId);

            document.querySelectorAll('.gc-sector').forEach(s => s.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ============================================
// 11. ИНФО-ПАНЕЛЬ
// ============================================

function showEpochInfo(epochId) {
    const epoch = EPOCHS.find(e => e.id === epochId);
    if (!epoch) return;

    const panel = document.getElementById('epoch-info-panel');
    const content = panel.querySelector('.epoch-info-content');

    const year = getCurrentYear();
    let statusBadge = '';
    let statusText = '';
    if (year >= epoch.start && year < epoch.end) {
        statusBadge = '<span class="epoch-current-badge">⏳ СЕЙЧАС ИДЁТ</span>';
        statusText = 'Эта эпоха сейчас в самом разгаре — ты живёшь в ней!';
    } else if (year >= epoch.end) {
        statusBadge = '<span class="epoch-past-badge">✓ В ПРОШЛОМ</span>';
        statusText = 'Эта эпоха уже завершилась, от неё осталась только память и наследие.';
    } else {
        statusBadge = '<span class="epoch-future-badge">→ В БУДУЩЕМ</span>';
        statusText = 'Эта эпоха ещё не наступила — она ждёт своего часа.';
    }

    let timelineInfo = '';
    if (year >= epoch.end) {
        timelineInfo = 'Завершилась ' + Math.round(year - epoch.end) + ' лет назад.';
    } else if (year >= epoch.start) {
        const progress = getEpochProgress(epoch);
        const quarter = getQuarter(progress.yearsInEpoch);
        timelineInfo = 
            'Идёт уже ' + Math.round(progress.yearsInEpoch) + ' лет. ' +
            'Осталось ' + Math.round(progress.yearsLeft) + ' лет.<br>' +
            '<strong style="color:' + quarter.color + ';">' + quarter.name + '</strong> — ' +
            'прошло ' + Math.round(quarter.yearsInQuarter) + ' лет из 405.';
    } else {
        timelineInfo = 'Начнётся через ' + Math.round(epoch.start - year) + ' лет.';
    }

    let quartersHtml = '';
    QUARTER_DESCRIPTIONS.forEach(function(q, idx) {
        const startYear = epoch.start + q.years[0];
        const endYear = epoch.start + q.years[1];
        const isCurrentQuarter = (year >= epoch.start && year < epoch.end) && 
                                 getQuarter(getEpochProgress(epoch).yearsInEpoch).index === idx;
        quartersHtml += 
            '<div class="epoch-row" style="' + (isCurrentQuarter ? 'background: rgba(139,90,43,0.15); border-radius:6px; padding-left:8px; padding-right:8px;' : '') + '">' +
                '<span><strong style="color:' + q.color + ';">' + q.name + '</strong></span>' +
                '<span style="color:#7a5a3a; font-size:12px;">' + startYear + ' — ' + endYear + '</span>' +
            '</div>';
    });

    content.innerHTML = 
        '<h2>' + epoch.symbol + ' ' + epoch.name + statusBadge + '</h2>' +
        '<p class="epoch-sub">' + epoch.phase + ' Суток Сварога · Покровитель: ' + epoch.god + '</p>' +
        
        '<div class="epoch-row"><span>Период эпохи:</span><strong>' + epoch.start + ' — ' + epoch.end + ' г.</strong></div>' +
        '<div class="epoch-row"><span>Длительность:</span><strong>1620 лет</strong></div>' +
        '<div class="epoch-row"><span>Фаза Суток:</span><strong style="color:' + getPhaseColor(epoch.phase) + ';">' + epoch.phase + '</strong></div>' +
        '<div class="epoch-row"><span>Текущий статус:</span><span>' + timelineInfo + '</span></div>' +
        
        '<div class="epoch-desc">' +
            '<strong style="color:#6b4426;">📖 ' + epoch.phase + ' Суток Сварога:</strong><br>' +
            PHASE_DESCRIPTIONS[epoch.phase] +
        '</div>' +
        
        '<div style="margin-top: 14px;">' +
            '<strong style="color:#6b4426; font-size:14px;">🕐 Четверти эпохи (по 405 лет):</strong>' +
            '<div style="margin-top: 8px;">' + quartersHtml + '</div>' +
        '</div>' +
        
        '<div class="epoch-desc" style="margin-top: 14px; border-left-color:' + epoch.color + ';">' +
            '<strong style="color:' + epoch.color + ';">' + statusText + '</strong>' +
        '</div>';

    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function getPhaseColor(phase) {
    const colors = {
        'Вечер': '#FF8C00',
        'Ночь':  '#4A4A8A',
        'Утро':  '#FFD700',
        'День':  '#44AAFF'
    };
    return colors[phase] || '#ffd700';
}

// ============================================
// 12. ЗАКРЫТИЕ ПАНЕЛИ
// ============================================

function initCloseButton() {
    const btn = document.getElementById('closeEpochInfo');
    if (btn) {
        btn.addEventListener('click', function() {
            document.getElementById('epoch-info-panel').style.display = 'none';
            document.querySelectorAll('.gc-sector').forEach(s => s.classList.remove('active'));
        });
    }
}

// ============================================
// 13. СВИТОК "ЧТО ТАКОЕ СВАРОЖИЙ КРУГ"
// ============================================

function initScrollToggle() {
    const btn = document.getElementById('galactic-scroll-toggle');
    const body = document.getElementById('galactic-scroll-body');
    const arrow = btn ? btn.querySelector('.scroll-toggle-arrow') : null;

    if (!btn || !body) return;

    btn.addEventListener('click', function() {
        const isOpen = body.classList.contains('open');

        if (isOpen) {
            body.style.maxHeight = '0px';
            body.classList.remove('open');
            if (arrow) arrow.textContent = '▼';
            btn.classList.remove('active');
        } else {
            body.classList.add('open');
            body.style.maxHeight = body.scrollHeight + 'px';
            if (arrow) arrow.textContent = '▲';
            btn.classList.add('active');

            setTimeout(function() {
                if (body.classList.contains('open')) {
                    body.style.maxHeight = 'none';
                }
            }, 800);
        }
    });
}

// ============================================
// 14. ЗАПУСК
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    drawClock();
    initSectorClicks();
    initCloseButton();
    initScrollToggle();

    setTimeout(function() {
        const current = getCurrentEpoch();
        showEpochInfo(current.epoch.id);
    }, 500);
});