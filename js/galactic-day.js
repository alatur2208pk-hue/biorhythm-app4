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
    { id: 9,  name: 'Волк',    god: 'Велес',           start: 2012,   end: 3632,  phase: 'Утро',  symbol: '🐺', color: '#A9A9A9',
      wolfMorningText: [
          'Почему время, в которое мы живём, называют Утром Сварога? Но ведь мы живём в самом начале Квантового перехода, когда Ночь Сварога закончилась на границе 2012-2013 годов, а День Сварога как справедливое мироустройство без лжи и насилия ещё не наступил. Само понятие Утра Сварога имеет не только астрономические и мифологические корни, но и нравственные, ибо прорастают они осознанными семенами Всевышнего разума в воплощённых на Землю живых человеческих Душах.',
          'А кто такой Сварог? На санскрите есть слово, схожее этимологически с именем «Сварог» — Svaraj, что означает «самодержец». Так и есть, Сварог — главный в пантеоне славянский богов. В основе имени всевышнего Бога, являющегося олицетворением небес, лежит корень svar (svar-ga), что с санскрита переводится как «небо», «свет», то есть тот, кто ходит по небу. Бог Сварог олицетворяет небеса, которые, по сути, и являются синонимом космосу, Вселенной.',
          'Сварог в славянской мифологии — хранитель Мира Прави (Сварги Пречистой), места, где после развоплощения обитают Светлые Духи предков и Родные Боги. Оттого и славяне, когда они ещё не были разобщены на государства и религии, называли себя Православными – славящим Правь – детьми миров Прави и Слави.',
          'В славяно-арийской астрономии «Утром Сварога» называют начало периода, когда Солнечная система находится на стороне эллипса, обращённой к центру галактики. Этот цикл называется «Сутками Сварога», и длится он 25 920 земных лет. По аналогии с земными сутками «Сутки Сварога» наши ведические предки образно разделяли на «День Сварога», «Ночь Сварога», «Утро» и «Вечер».',
          'В славянской мифологии «Утро Сварога» символизирует эпоху возрождения. Считается, что с наступлением этого времени открываются Врата Сварги, и на Землю нисходит поток светлых энергий, что сейчас и происходит – из тьмы веков на Землю нисходят совершенно новые энергии, повышающие её вибрации и способствующие рождению детей нового поколения, которых теперь называют «дети-кристаллы».',
          'Нам говорят, что астрономическое и мифологическое значения понятия «Утро Сварога» не имеют научного обоснования. Но если сам Квантовый переход теперь стал не только предметом научного наблюдения, но и обрёл наглядные результаты научных исследований, то фактически, и «Утро Сварога» как изначальное название Квантового перехода обретает не только мифологические корни, но и становится предметом научного изучения.',
          'MIR_PEREXOD_HEADER',
          'Так что же произошло в 2012-м? Вот что об этом в своей статье «Мир после Квантового перехода» пишет известный биофизик Валентина Юрьевна Миронова:',
          '«Все ещё помнят ожидания 2012 года, страх неизвестности, ожидания катаклизм, которыми нас пугали… Переход состоялся, но не там, где его ожидали...',
          'В январе 2013 года было рассказано об эксперименте, который длился 10 лет, с 2003 года. Ученые ядерщики работали с атомом водорода (он же — протон)... Было сделано открытие, что частица протона уменьшилась на 4%. Изменилось всё – его скорость, вращение, направление, диаметр... За протоном двинулись и остальные частицы, и то, что считалось ядерной физикой незыблемым, предстало совершенно в другом виде, в чужом... Те законы, которые были установлены до 2013 года, вдруг перестали работать, потому что плотность материи стала другой...',
          'Январь – март 2013 года стал богатым на радикальные научные открытия в астрономии и астрофизике... На орбите Земли летает немецкий телескоп Шпицер, ... он увидел ультракрасные Галактики, они ярче обыкновенных в 60 раз. Судите сами, ещё в декабре 2012 года их не было, а январе 2013 года они появились - за сутки. Так не бывает! Они или есть или их нет… Значит, произошло что-то за эти сутки, что заставило поменяться Мир? Обычная электромагнитная шкала... увеличилась на три октавы в инфракрасном диапазоне и три октавы в ультрафиолете. У нас стало на шесть октав выше.',
          'Ещё одно открытие – до 2013 года ученые знали, а нас с вами пугали, что наша Солнечная система двигалась в Черную дыру. Ученые Новосибирска говорили, что мы идем в область совершенно не изведанных энергий, которых раньше не было и непонятно что с этим будет дальше. А сейчас дыры нет! Оказалось, что Черная дыра – это дверь, которую мы с вами прошли, и дверь закрылась.',
          'Получается, что энергетический спектр нового водорода, совершенно отличен от спектра старого водорода. Это спектр - ультракрасный цвет, более глубинный, чем инфракрасный цвет. Именно этот диапазон стал ведущим. Мы живем и не знаем, что воспринимаем совершенно другие энергетические спектры. И это всё восходит к сознанию человека! Пришло время, о котором нам говорили – вот будете жить в Тонком Мире, а там – всё мыслью управляется, захотел – стул передвинул, захотел – сам взлетел. Но, пока мы не дошли до такой концентрации мысли.',
          'В связи с этим начались разные феномены... Вы все слышали такой термин как Акаши, это и есть Золотая структура, которая названа Протей. Блавацкая его также упоминает. Так вот этот Протей пошел в воплощения. Это стало нашей новой нервной системой, теперь она у нас насыщена светом Протея... В течение последних тысяч лет до Перехода, как минимум 26000 лет, у нас в глазу у всех было так называемое слепое пятно... Теперь мы перешли на «тот Свет», наш Эксперимент благополучно завершен и это слепое пятно стало растворяться и исчезать... Сейчас нам открывается доступ к видению многомерности. Это открытие Планетарного масштаба, и это заметили ученые всех стран.',
          'Изменился Тимус, вилочковая железа, она сама по себе очень сакральна. Её и Елена Блаватская упоминала, и Рерихи. Сейчас в Тимусе живет тот самый Протей. Здесь он локализуется, а потом разбрызгивается по всем нашим тонким нервным каналам. Солнечные, лунные меридианы, всё здесь задействуется, они тоже стали другие. И иммунный надзор Протея изменился, если раньше эта система иммунитета была формальна, то теперь она отслеживает каждую человеческую мысль и теперь стало так важно – уметь думать! Раньше мы с вами отвечали за свои поступки, а сейчас будем учиться отвечать за свои мысли!',
          'Водород и протон - это одно и то же... Вода на новом Тонком уровне – это кипящая субстанция, но не кипяток. Просто новый водород мгновенно перестраивает структуру воды. Её формула была Н2О, а теперь она колеблется. Мысли спокойные – вода одной формулы, активное сознание – вода принимает свойства другой формулы. Это может поменяться в течении секунды и сразу меняется вся биохимия, совершенно другой метаболизм клетки. Поскольку протон другой, поменялась симметрия внутри атома ядра, она просто стала другая. Соответственно поменялся и уран, он имеет другие изотопы… Никаких взрывов и страшилок, никакого повышения уровня радиации, просто уран стал жить меньше, чем жил раньше. Если раньше период распада был 235 лет, то сейчас может и за два года распасться.',
          'Если до Перехода работала интуиция, и нам советовали её развивать... теперь необходимо развивать глубинное чувствование. Это новое отношение с Миром. Вы выражаете своё Намерение, и Вселенная начинает выстраивать под вас события, которые приводят к исполнению ваших желаний».',
          'Казалось бы, последняя мысль в словах Валентины Юрьевны уже не из области научных исследований, а из иных – изотерических источников, но озвучена она человеком, привыкшим отвечать за свои слова. И согласитесь, лично Вы ничего не теряете, если данную теорию попробуете превратить в одно из правил своей жизни. А всё, что надо для этого – поверить и взять отВед-ственность за своё будущее на себя. Да и события в жизни порой складываются так, что ничего другого уже не остаётся.'
      ]
    },
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

    // ===== 8.3. ОРБИТЫ С 8 ПЛАНЕТАМИ (КАРТИНКИ) =====
    // Орбиты разнесены друг от друга на 30% (шаг ~60px)
    const planetsData = [
        { r: R_SUN + 75,  size: 19, img: 'images/planets/mercury.png', speed: 20,  orbitClass: 'gc-orbit-1' }, // Меркурий
        { r: R_SUN + 150,  size: 29, img: 'images/planets/venus.png',   speed: 32,  orbitClass: 'gc-orbit-2' }, // Венера
        { r: R_SUN + 240, size: 35, img: 'images/planets/earth.png',   speed: 48,  orbitClass: 'gc-orbit-3' }, // Земля
        { r: R_SUN + 320, size: 32, img: 'images/planets/mars.png',    speed: 62,  orbitClass: 'gc-orbit-4' }, // Марс
        { r: R_SUN + 440, size: 60, img: 'images/planets/jupiter.png', speed: 85,  orbitClass: 'gc-orbit-5' }, // Юпитер
        { r: R_SUN + 590, size: 90, img: 'images/planets/saturn.png',  speed: 110, orbitClass: 'gc-orbit-6' }, // Сатурн
        { r: R_SUN + 720, size: 39, img: 'images/planets/uranus.png',  speed: 140, orbitClass: 'gc-orbit-7' }, // Уран
        { r: R_SUN + 840, size: 34, img: 'images/planets/neptune.png', speed: 175, orbitClass: 'gc-orbit-8' }  // Нептун
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

        const planetImg = createSVG('image', {
            x: CX - p.size,
            y: CY - p.r - p.size,
            width: p.size * 2,
            height: p.size * 2,
            href: p.img,
            class: 'gc-planet',
            preserveAspectRatio: 'xMidYMid meet'
        });

        planetGroup.appendChild(planetImg);
        svg.appendChild(planetGroup);
    });

    // ===== 8.4. СОЛНЦЕ (КАРТИНКА + ЛУЧИ + СВЕЧЕНИЕ) =====
    const sunGlow = createSVG('circle', {
        cx: CX, cy: CY, r: R_SUN * 2.4,
        fill: 'url(#sunGlowGrad)',
        class: 'gc-sun-glow'
    });
    svg.appendChild(sunGlow);

    // Солнце-картинка
    const sunImg = createSVG('image', {
        x: CX - R_SUN * 1.1,
        y: CY - R_SUN * 1.1,
        width: R_SUN * 2.2,
        height: R_SUN * 2.2,
        href: 'images/planets/sun.png',
        class: 'gc-sun-img',
        preserveAspectRatio: 'xMidYMid meet'
    });
    svg.appendChild(sunImg);



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

    // ===== БЛОК УТРА СВАРОГА ДЛЯ ЭПОХИ ВОЛКА =====
    let wolfTextHtml = '';
    if (epoch.id === 9 && epoch.wolfMorningText) {
        let wolfTextContent = '';
        epoch.wolfMorningText.forEach(function(paragraph) {
            if (paragraph === 'MIR_PEREXOD_HEADER') {
                wolfTextContent += '<h3 style="color: #6b4426; font-family: \'Philosopher\', serif; font-size: 20px; text-align: center; margin: 22px 0 14px; padding-bottom: 10px; border-bottom: 1px dashed rgba(139, 90, 43, 0.4);">Мир после Квантового перехода</h3>';
            } else {
                wolfTextContent += '<p style="margin-bottom: 12px; text-align: justify;">' + paragraph + '</p>';
            }
        });
        
        wolfTextHtml = 
            '<div class="epoch-desc" style="margin-top: 18px; border-left-color: #ffd700; background: rgba(255, 215, 0, 0.06); padding: 16px 18px;">' +
                wolfTextContent +
            '</div>';
    }

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
        '</div>' +
        
        wolfTextHtml;

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