// ============================================
// АТЛАС СУДЬБЫ — ФИНАЛЬНАЯ ВЕРСИЯ 9
// ============================================

// ============================================
// 1. КОНСТАНТЫ
// ============================================

const CX = 500;
const CY = 500;
const R_MAX = 480;

const R = {
    yarga:      R_MAX * 0.15,
    border1:    R_MAX * 0.15,
    border2:    R_MAX * 0.35,
    border3:    R_MAX * 0.55,
    border4:    R_MAX * 0.75,
    border5:    R_MAX * 0.95,
    pvd:        R_MAX * 0.03
};

const INCARNATION = {
    r: R_MAX * 0.65,
    angle: -30
};

const SPIRAL = {
    rStart: INCARNATION.r,
    rEnd: R.pvd,
    turns: 2,
    startAngle: INCARNATION.angle
};

const CHOICE_POINTS_COUNT = 13;
const TOTAL_SPIRAL_SLOTS = 14;
const VECTOR_TARGET_INDEX = 4;

// ============================================
// 2. ДАННЫЕ ЭЛЕМЕНТОВ
// ============================================

const ATLAS_ITEMS = {
    yarga: {
        name: 'ЯрГа',
        desc: 'ЯрГа — центральное ядро Атласа Судьбы, сердце Золотого Пути. Это не просто точка, а состояние пребывания в Божественной любви и мудрости. Здесь дух соединяется с Творцом, исчезает разделение на «я» и «не-я». Человек, достигший Ярги, становится проводником Божественной воли — «Асом», Богом живущим и созидающим на земле. Его воля сливается с волей Богов, его душа — кристально чистое озеро, отражающее небо Прави. В Ярге человек обретает власть над природой через единство с ней, освобождается от негативной кармы и получает истинную свободу — от страхов, желаний и иллюзий.'
    },
    pvd: {
        name: 'ПВД — Пространственно-Временная Дислокация',
        desc: 'ПВД — это Настоящее Мгновение, острие наконечника стрелы духа, Точка Силы. Здесь пересекаются все нити: прошлое встречается с будущим, квантовый поток времени замирает на миг, чтобы дать нам возможность выбора. В этой точке человек реализует свою свободную волю. Степень правильности принимаемых решений зависит от его осознанности и нравственности — от способности видеть не только внешнюю оболочку событий, но и их глубинную суть. Позади ПВД — прошлое с его наследием. Впереди — будущее как квантовое поле потенциала, где мыслью и действием зарождаются грядущие события. В ПВД мы либо поднимаемся к свету, либо опускаемся во тьму. В нём решается всё.'
    },
    border1: {
        name: '1-й Квантовый Рубеж',
        desc: 'Первый квантовый рубеж — граница ЯрГи и Пояса Рока. Это энергетический барьер, удерживающий сознание в рамках определённого пояса. Одновременно испытывает душу и защищает её от преждевременного перехода на уровень, к которому она ещё не готова. Подход к нему — всегда время экзамена. Переход возможен только при устойчивом изменении приоритетов и психических структур человека. Нельзя подняться выше, не изменившись внутри.'
    },
    border2: {
        name: '2-й Квантовый Рубеж',
        desc: 'Второй квантовый рубеж — граница Пояса Рока и Пояса Урока. Здесь решается, продолжит ли человек восхождение к своему предназначению или начнёт скатываться в сторону порока. Это шлюз между двумя бассейнами: чтобы перейти из одного в другой, нужно набрать достаточную высоту. Если человек берёт курс на очищение, при приближении к рубежу он входит в Коридор Искушений — время, когда тёмные силы с повышенной интенсивностью провоцируют его на старые грехи, проверяя, изменился ли он на самом деле.'
    },
    border3: {
        name: '3-й Квантовый Рубеж',
        desc: 'Третий квантовый рубеж — граница Пояса Урока и Пояса Порока. Здесь решается судьба души: обретёт она совесть или потеряет. Это порог, через который проходят те, кто очнулся от морока и начинает восхождение из духовной пустыни к свету. Карма здесь — удерживающая сила: пока не развязаны узлы прошлых деяний, пока не отданы долги, рубеж не будет пройден. Человек, увязший в причинно-следственных связях с тёмными делами, на этом рубеже может столкнуться с реальной опасностью — вплоть до угрозы жизни.'
    },
    border4: {
        name: '4-й Квантовый Рубеж',
        desc: 'Четвёртый квантовый рубеж — граница Пояса Порока и Пояса Забвения. Это последняя черта перед духовной пустыней. Если человек переходит его в сторону тьмы, меняется всё: цели, мотивы, окружение, интересы. Вместо созидания — разрушение, вместо служения — потребление, вместо любви — обладание. Светлые люди уходят или их вытесняют. То, что раньше вызывало отвращение, теперь кажется привлекательным. То, что было святым, становится предметом насмешек. Слабеет мораль, угасает совесть, процветает эгоизм. Чем дальше человек заходит за этот рубеж, тем пустее становятся его глаза — физическое отражение погибающей души.'
    },
    border5: {
        name: 'Грань Миров',
        desc: 'Грань Миров — 5-й рубеж, финальная граница сферы Атласа. Это рубеж, разделяющий владения света и тьмы, граница, за которой кончается сфера созидания и начинается бездна разрушения. Это фронт духовных битв, где ведётся прямое противостояние за человеческие души. Грань имеет градиентную природу: это серая зона, где энергия света постепенно смешивается с энергией тьмы, где ещё можно повернуть назад, но уже чувствуется дыхание бездны. Внутри сферы Атласа правит светлый дух — здесь возможен рост, очищение, восхождение, даже если ты на краю. За Гранью — иное царство: там власть над душой берёт бездуховность, и сущность, переступившая черту, перерождается в слугу мрака. Грань проходит не в космических далях — она проходит через наше сердце, через наши выборы, мысли и поступки.'
    },
    ringRoka: {
        name: 'Пояс Рока',
        desc: 'Пояс Рока — ближайший к Ярге пояс, пространство обретения предназначения. Здесь нет случайностей и суеты. Здесь человек находит то, ради чего пришёл в этот мир, и начинает становиться тем, кем должен был стать. Рок — это не неотвратимая судьба, а набор задач, миссия и экзамен одновременно. Исполняя Рок, человек идёт дорогой Прави и совершенствуется духовно с десятикратной скоростью, обретая истинное счастье — со-участие в творении гармоничного бытия с небесным Родом. В этом поясе человек получает Долю — дар Богов, дополнительную жизненную силу для успешного прохождения своего Рока. Если он уклоняется от предназначения, Доля заменяется на Недолю: всё становится трудным и бессмысленным. На Поясе Рока душа достаточно чиста: вредоносные программы поведения быстро распознаются и блокируются — человек научился видеть. Здесь он спокоен, осознан, его ум и сердце в согласии, его желания — с его долгом, его долг — с его радостью.'
    },
    ringUroka: {
        name: 'Пояс Урока',
        desc: 'Пояс Урока — срединный пояс, сердцевина обычной человеческой судьбы. Здесь преобладают нейтральные энергии: силы света и тьмы имеют равносильное влияние. Здесь жизнь наиболее стабильна, и протекает судьба обыкновенного человека — со средней осознанностью, с работающей, но не в полную силу совестью. Такой человек не совершает героических поступков, но и не опускается до подлости, не стремится к святости, но и не продаёт душу. Его жизнь — движение в среднем течении реки: без водопадов, но и без болот. От Экватора нравственной нормы — срединной линии пояса — расходятся две дороги. Первая ведёт в сторону Порока (изрочная дорога): начинается с малого, с повторяющихся соблазнов, и незаметно уводит душу во тьму. Вторая ведёт в сторону Рока: начинается с вопроса «Зачем я здесь? В чём смысл моей жизни?» — и через поиск, осознанность и созидание приводит человека к его предназначению.'
    },
    ringPoroka: {
        name: 'Пояс Порока',
        desc: 'Пояс Порока — самый драматический пояс Атласа, сфера, где человек либо обретает совесть, либо теряет. Здесь одновременно происходят два противоположных процесса: одни души погружаются в тьму, другие выныривают к свету. Это второй духовный фронт, где ведётся не менее серьёзное противостояние, чем на Грани Миров. Тёмные силы работают здесь с особой тщательностью: соблазны подбираются индивидуально под характер, слабости, неутолённые желания. Светлые силы вразумляют через ситуации, которые заставляют остановиться и посмотреть на себя со стороны, через сближение с наставником, через возможности проявить светлые качества, через напутствия совести. Совесть — это совместная весть с небесным Родом, «небесный интернет», через который человек получает информацию о том, как поступать в любой ситуации. Когда совесть молчит, в ход идут грубые инструменты: болезни, потери, разорения, предательства — последняя попытка разбудить спящее сознание. Карма здесь — учитель, который не устаёт: обидел — будешь обижен, обманул — будешь обманут. Покаяние — лекарство, исцеляющее душу: это глубокое осознание, при котором человек, испытывая сильную душевную боль, вырывает с корнями кармический сорняк из почвы своей души. Обет, данный в покаянии, нужно хранить всегда — это продолжение процесса очищения.'
    },
    ringZabvenia: {
        name: 'Пояс Забвения',
        desc: 'Пояс Забвения — духовная пустыня, первый пояс находящийся по сторону светлых сил. Здесь человек забывает себя: стёрта память о своём истинном предназначении, дух погружается в такой глубокий сон, что начинает казаться, будто сознания вовсе нет. Здесь нет живительных родников совести, дух не слышит голос предков, свет едва пробивается сквозь тяжёлые низкочастотные энергии. Пояс неоднороден: он подобен склону, уходящему вниз — от сумерек до полного мрака. Чем ближе к Грани Миров, тем мрачнее судьба. Чем дальше от Грани и ближе к центру — тем карма мягче, а сознание яснее: иллюзии рассеиваются, и узник пустыни начинает различать направление к свету. Здесь человека подстерегают две пропасти: душа становится пищей для демонов (растворяется, и дух начинает всё сначала) или обращается в Нежить (наполняется мраком настолько, что становится слугой тьмы). Обитатели пустыни — наркоманы, алкоголики, извращенцы, все, чей путь извращён. Но даже здесь есть надежда: пока человек не переступил Грань Миров, путь обратно открыт. Пояс Забвения — не место наказания, а спецшкола: душа сама приходит сюда, дабы понять, что путь потакания низменным страстям ведёт в бездну мрака.'
    },
    lifeLine: {
        name: 'Линия Жизни',
        desc: 'Линия Жизни — зелёная спираль событийного ряда, прожитый жизненный путь от точки воплощения до ПВД. На этой спирали отмечены ключевые события — фиолетовые точки. От каждой такой точки расходятся ветви — возможные траектории, которые могли бы быть выбраны. Таких точек в судьбе человека бесчисленное множество, как и путей от них, но иногда выбор бывает ограничен, ибо карма — неутомимый следопыт, который всегда догоняет и диктует свои условия исхода. Линия Жизни показывает, как человек движется по Атласу: к центру (к свету, к Ярге) или к краю (во тьму, к Грани Миров). Каждый поворот спирали — это результат свободного выбора человека в точке ПВД.'
    },
    pastLine: {
        name: 'Линия Прошлой Жизни',
        desc: 'Линия Прошлой Жизни — пунктир, продолжение спирали вовне. Она показывает, откуда пришла душа в эту жизнь: на каком поясе Атласа завершилась её предыдущая жизнь, каково было состояние её души. Это важно, потому что по Кону Воздаяния на том же поясе и с тем же состоянием души человек начинает свою новую жизнь. Если душа была грязна, это может отразиться на здоровье, на семейных условиях, на качестве родителей, на материальном положении семьи. Линия Прошлой Жизни — это след наследия, которое душа несёт с собой в новое воплощение: и личное, и соборное (общенародное и общечеловеческое).'
    },
    incarnation: {
        name: 'Точка Воплощения',
        desc: 'Точка Воплощения — место входа души в новую жизнь. Здесь дух, пройдя через царства минералов, растений и животных, обретает человеческое тело. Здесь начинается новый виток спирали событийного ряда. Точка Воплощения — это не случайное место: она определяется состоянием души на момент завершения предыдущей жизни. По Кону Воздаяния душа приходит в те условия, которые соответствуют её накопленному опыту, её карме, её предназначению. От точки воплощения начинается Линия Жизни, которая ведёт человека либо к свету (к Ярге), либо во тьму (к Грани Миров) — в зависимости от его выборов.'
    },
    angelWings: {
        name: 'Ангельские крылья (Силы Света)',
        desc: 'Ангельские крылья — силы Света, ведущие к гармонии и развитию. Это Леги — хранители, наставники и защитники, встающие на пути тьмы. Они используют все доступные инструменты, чтобы пробудить наш дух: насылают знаки, которые мы часто не замечаем, подталкивают к встречам с нужными людьми, наводят на книги, которые могут изменить сознание, посылают сны, полные предупреждений и подсказок, внушают мысли, которые кажутся нам «своими». Они видят нашу судьбу по-другому: для них открыто как на ладони то, что для нас лежит за горизонтом восприятия. Наши всевозможные пути, что бы мы ни выбрали, предстают пред ними как чёткий образ надвигающегося будущего. Их голос — это та самая совесть, тот внутренний компас, который никогда не ошибается. Они делают всё, чтобы мы не переступили черту, чтобы мы, даже блуждая во тьме, нашли путь к свету. Но последний шаг — наш: свободная воля — величайший дар Творца, и никто не может сделать его за нас.'
    },
    demonWings: {
        name: 'Демонические крылья (Силы Тьмы)',
        desc: 'Демонические крылья — силы Тьмы, ведущие к деградации и падению. Это демонические сущности, «охотники за душами», для которых душа человека — это добыча, энергия, ресурс. Их оружие — обман, соблазн, искушение. Они видят наперёд гораздо дальше, чем человек, особенно с незрелой душой, оттого могут плести сложнейшие сценарии, ловушка которых захлопнется через долгий срок после того, как вы клюнули на приманку. Они тянут нас в обратную сторону — от центра Атласа к краю, от света во тьму. У тёмных свой путь и свой атлас судьбы — негативная копия нашего светлого. У них чем ближе к центру, тем сильнее первородный мрак наполняет душу. Если у нас в центре находится золотой путь и источник света, у них в центре — нечто похожее на чёрную дыру, впитывающую в себя всё, что можно. Слуги тьмы подобны своему чёрному солнцу: они тоже могут только забирать и отнимать, где силой, а где обманом. Их цель — сместить Экватор нравственной нормы в сторону бездны, находящейся за Гранью Миров, через пропаганду, через нормализацию порока, через ослабление нравственного иммунитета человечества.'
    },
    choice: {
        name: 'Важный выбор (перекрёсток)',
        desc: 'Фиолетовые точки на Линии Жизни — это важные перекрёстки, точки судьбы, где человек делает ключевой выбор. От каждой такой точки расходятся ветви — возможные траектории, которые могли бы быть выбраны. В этих точках судьба даёт выбор: каждая из них может стать шагом к свету или шагом во тьму. В момент выбора небесные силы через совесть наставляют человека на наиболее гармоничную траекторию полёта, чтобы он всегда попадал в яблочко. Силы мрака, пользуясь его невежеством, наоборот, уводят стрелу его духа от цели — «в молоко». Отклонение от гармоничного полёта и есть поГрешность, то есть грех. Каждый выбор, сделанный сегодня, определяет завтрашний рубеж. В точке выбора решается, останется ли человек на прежнем уровне или поднимется выше, — или опустится ниже.'
    }
};

// ============================================
// 3. SVG
// ============================================

const svg = document.getElementById('atlas-svg');
const NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) {
        e.setAttribute(k, attrs[k]);
    }
    return e;
}

function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = angleDeg * Math.PI / 180;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad)
    };
}

// ============================================
// 4. ОТРИСОВКА
// ============================================

function drawAtlas() {
    svg.innerHTML = '';

    // ===== 4.1. DEFS =====
    const defs = el('defs');

    const glow = el('radialGradient', { id: 'centerGlow' });
    glow.appendChild(el('stop', { offset: '0%', 'stop-color': '#FFD700', 'stop-opacity': '0.25' }));
    glow.appendChild(el('stop', { offset: '50%', 'stop-color': '#FFD700', 'stop-opacity': '0.06' }));
    glow.appendChild(el('stop', { offset: '100%', 'stop-color': '#000000', 'stop-opacity': '0' }));
    defs.appendChild(glow);

    const atlasGrad = el('radialGradient', {
        id: 'atlasGradient',
        cx: '50%',
        cy: '50%',
        r: '50%'
    });

    atlasGrad.appendChild(el('stop', { offset: '0%',   'stop-color': '#FFD700', 'stop-opacity': '0.55' }));
    atlasGrad.appendChild(el('stop', { offset: '15%',  'stop-color': '#FFD700', 'stop-opacity': '0.45' }));
    atlasGrad.appendChild(el('stop', { offset: '20%',  'stop-color': '#E6C200', 'stop-opacity': '0.38' }));
    atlasGrad.appendChild(el('stop', { offset: '35%',  'stop-color': '#C9A800', 'stop-opacity': '0.30' }));
    atlasGrad.appendChild(el('stop', { offset: '40%',  'stop-color': '#A89650', 'stop-opacity': '0.24' }));
    atlasGrad.appendChild(el('stop', { offset: '55%',  'stop-color': '#888060', 'stop-opacity': '0.18' }));
    atlasGrad.appendChild(el('stop', { offset: '60%',  'stop-color': '#5A5A5A', 'stop-opacity': '0.14' }));
    atlasGrad.appendChild(el('stop', { offset: '75%',  'stop-color': '#333333', 'stop-opacity': '0.12' }));
    atlasGrad.appendChild(el('stop', { offset: '80%',  'stop-color': '#1A1A1A', 'stop-opacity': '0.10' }));
    atlasGrad.appendChild(el('stop', { offset: '95%',  'stop-color': '#000000', 'stop-opacity': '0.08' }));
    atlasGrad.appendChild(el('stop', { offset: '100%', 'stop-color': '#000000', 'stop-opacity': '0.05' }));

    defs.appendChild(atlasGrad);

    ['Light', 'Dark'].forEach(function(name) {
        const color = name === 'Light' ? '#FFFFFF' : '#FF4444';
        const marker = el('marker', {
            id: 'arrowHead' + name,
            markerWidth: '3',
            markerHeight: '3',
            refX: '2.5',
            refY: '1.5',
            orient: 'auto'
        });
        marker.appendChild(el('path', {
            d: 'M 0 0 L 3 1.5 L 0 3 Z',
            fill: color
        }));
        defs.appendChild(marker);
    });

    svg.appendChild(defs);

    // ===== 4.2. ФОНОВОЕ СВЕЧЕНИЕ =====
    svg.appendChild(el('circle', {
        cx: CX, cy: CY, r: R_MAX * 0.7,
        fill: 'url(#centerGlow)',
        'pointer-events': 'none'
    }));

    // ===== 4.3. ПОЯСА =====
    const gradientCircle = el('circle', {
        cx: CX, cy: CY, r: R.border5,
        fill: 'url(#atlasGradient)',
        'pointer-events': 'none'
    });
    svg.appendChild(gradientCircle);

    const rings = [
        { key: 'ringZabvenia',  r1: R.border4, r2: R.border5 },
        { key: 'ringPoroka',    r1: R.border3, r2: R.border4 },
        { key: 'ringUroka',     r1: R.border2, r2: R.border3 },
        { key: 'ringRoka',      r1: R.border1, r2: R.border2 }
    ];

    rings.forEach(function(ring) {
        const rMid = (ring.r1 + ring.r2) / 2;
        const width = ring.r2 - ring.r1;
        const circle = el('circle', {
            cx: CX, cy: CY,
            r: rMid,
            fill: 'none',
            stroke: 'transparent',
            'stroke-width': width,
            class: 'atlas-item atlas-ring',
            'data-key': ring.key
        });
        svg.appendChild(circle);
    });

    // ===== 4.4. ЯРГА =====
    const yarga = el('circle', {
        cx: CX, cy: CY, r: R.yarga,
        fill: 'transparent',
        class: 'atlas-item atlas-yarga',
        'data-key': 'yarga'
    });
    svg.appendChild(yarga);

    const yargaText = el('text', {
        x: CX, y: CY - R.yarga - 25,
        class: 'atlas-yarga-text'
    });
    yargaText.textContent = 'ЯрГа';
    svg.appendChild(yargaText);

    // ===== 4.5. КВАНТОВЫЕ РУБЕЖИ (1–4) =====
    [1, 2, 3, 4].forEach(function(n) {
        const r = R['border' + n];
        const circle = el('circle', {
            cx: CX, cy: CY, r: r,
            class: 'atlas-item atlas-border',
            'data-key': 'border' + n
        });
        svg.appendChild(circle);
    });

    // ===== 4.6. ГРАНЬ МИРОВ =====
    const edgeCircle = el('circle', {
        cx: CX, cy: CY, r: R.border5,
        class: 'atlas-item atlas-edge',
        'data-key': 'border5'
    });
    svg.appendChild(edgeCircle);

    // ===== 4.7. ЛИНИЯ ПРОШЛОЙ ЖИЗНИ =====
    const pastPath = buildPastLine(CX, CY);
    const pastLine = el('path', {
        d: pastPath,
        class: 'atlas-item atlas-past-line',
        'data-key': 'pastLine'
    });
    svg.appendChild(pastLine);

    // ===== 4.8. ЛИНИЯ ЖИЗНИ =====
    const lifePath = buildSpiral(
        CX, CY,
        SPIRAL.rStart,
        SPIRAL.rEnd,
        SPIRAL.turns,
        SPIRAL.startAngle
    );
    const lifeLine = el('path', {
        d: lifePath,
        class: 'atlas-item atlas-life-line',
        'data-key': 'lifeLine'
    });
    svg.appendChild(lifeLine);

    // ===== 4.9. ФИОЛЕТОВЫЕ ТОЧКИ =====
    const choicePoints = drawChoicePoints();

    // ===== 4.10. ТОЧКА ВОПЛОЩЕНИЯ =====
    const incPos = polarToCartesian(CX, CY, INCARNATION.r, INCARNATION.angle);
    const incarnation = el('circle', {
        cx: incPos.x, cy: incPos.y, r: 10,
        class: 'atlas-item atlas-incarnation',
        'data-key': 'incarnation'
    });
    svg.appendChild(incarnation);

    // ===== 4.11. КРЫЛЬЯ =====
    const targetPoint = choicePoints[VECTOR_TARGET_INDEX];
    if (targetPoint) {
        drawWings(targetPoint);
    }

    // ===== 4.12. ПВД =====
    const pvd = el('circle', {
        cx: CX, cy: CY, r: 14,
        class: 'atlas-item atlas-pvd',
        'data-key': 'pvd'
    });
    svg.appendChild(pvd);
}

// ============================================
// 5. СПИРАЛЬ
// ============================================

function buildSpiral(cx, cy, rStart, rEnd, turns, startAngle) {
    const steps = 400;
    let d = '';
    const totalAngle = turns * 360;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const r = rStart + (rEnd - rStart) * t;
        const angle = startAngle + totalAngle * t;
        const p = polarToCartesian(cx, cy, r, angle);
        d += (i === 0 ? 'M ' : 'L ') + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + ' ';
    }
    return d;
}

// ============================================
// 6. ЛИНИЯ ПРОШЛОЙ ЖИЗНИ
// ============================================

function buildPastLine(cx, cy) {
    const steps = 100;
    let d = '';

    const rStart = INCARNATION.r;
    const rEnd = R.border4 * 0.98;
    const startAngle = INCARNATION.angle;
    const totalAngleDelta = -180;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const r = rStart + (rEnd - rStart) * t;
        const angle = startAngle + totalAngleDelta * t;
        const p = polarToCartesian(cx, cy, r, angle);
        d += (i === 0 ? 'M ' : 'L ') + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + ' ';
    }

    return d;
}

// ============================================
// 7. ФИОЛЕТОВЫЕ ТОЧКИ + ОТРОСТКИ
// ============================================

function drawChoicePoints() {
    const points = [];
    const N = CHOICE_POINTS_COUNT;
    const SLOTS = TOTAL_SPIRAL_SLOTS;

    for (let i = 0; i < N; i++) {
        const t = (i + 0.5) / SLOTS;
        const r = SPIRAL.rStart + (SPIRAL.rEnd - SPIRAL.rStart) * t;
        const angle = SPIRAL.startAngle + SPIRAL.turns * 360 * t;
        const pos = polarToCartesian(CX, CY, r, angle);

        points.push({ x: pos.x, y: pos.y, r: r, angle: angle, index: i + 1 });

        const tNext = t + 0.005;
        const rNext = SPIRAL.rStart + (SPIRAL.rEnd - SPIRAL.rStart) * tNext;
        const angleNext = SPIRAL.startAngle + SPIRAL.turns * 360 * tNext;
        const posNext = polarToCartesian(CX, CY, rNext, angleNext);

        const dx = posNext.x - pos.x;
        const dy = posNext.y - pos.y;
        const tangentDeg = Math.atan2(dy, dx) * 180 / Math.PI;

        const branchAngle1 = tangentDeg + 10;
        const branchAngle2 = tangentDeg - 10;

        const branchLength = 45;

        [branchAngle1, branchAngle2].forEach(function(devAngle) {
            const branchSteps = 12;
            const branchEndX = pos.x + Math.cos(devAngle * Math.PI / 180) * branchLength;
            const branchEndY = pos.y + Math.sin(devAngle * Math.PI / 180) * branchLength;

            const ctrlX = pos.x + (branchEndX - pos.x) * 0.5 + Math.cos(tangentDeg * Math.PI / 180) * 8;
            const ctrlY = pos.y + (branchEndY - pos.y) * 0.5 + Math.sin(tangentDeg * Math.PI / 180) * 8;

            let branchD = '';
            for (let s = 0; s <= branchSteps; s++) {
                const st = s / branchSteps;
                const x = (1 - st) * (1 - st) * pos.x + 2 * (1 - st) * st * ctrlX + st * st * branchEndX;
                const y = (1 - st) * (1 - st) * pos.y + 2 * (1 - st) * st * ctrlY + st * st * branchEndY;
                branchD += (s === 0 ? 'M ' : 'L ') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
            }

            const branch = el('path', {
                d: branchD,
                fill: 'none',
                stroke: '#44FF44',
                'stroke-width': '1.5',
                'stroke-opacity': '0.55',
                'pointer-events': 'none'
            });
            svg.appendChild(branch);
        });

        const choice = el('circle', {
            cx: pos.x, cy: pos.y, r: 8,
            class: 'atlas-item atlas-choice',
            'data-key': 'choice',
            'data-index': i + 1
        });
        svg.appendChild(choice);
    }

    return points;
}

// ============================================
// 8. КРЫЛЬЯ
// ============================================

function drawWings(target) {
    const point = { x: target.x, y: target.y };

    const toAngelDir = -150;
    const toDemonDir = 30;

    const wingOffset = 42;

    const angelWingPos = {
        x: point.x + Math.cos(toAngelDir * Math.PI / 180) * wingOffset,
        y: point.y + Math.sin(toAngelDir * Math.PI / 180) * wingOffset
    };

    const angelArrowStart = {
        x: point.x + Math.cos(toAngelDir * Math.PI / 180) * (wingOffset - 8),
        y: point.y + Math.sin(toAngelDir * Math.PI / 180) * (wingOffset - 8)
    };
    const angelArrowEnd = {
        x: point.x + Math.cos(toAngelDir * Math.PI / 180) * 12,
        y: point.y + Math.sin(toAngelDir * Math.PI / 180) * 12
    };

    const angelGroup = el('g', {
        class: 'atlas-item atlas-vector-light',
        'data-key': 'angelWings'
    });

    const angelArrow = el('line', {
        x1: angelArrowStart.x, y1: angelArrowStart.y,
        x2: angelArrowEnd.x, y2: angelArrowEnd.y,
        stroke: '#FFFFFF',
        'stroke-width': '1.5',
        'marker-end': 'url(#arrowHeadLight)'
    });
    angelGroup.appendChild(angelArrow);

    const angelEmoji = el('text', {
        x: angelWingPos.x, y: angelWingPos.y,
        'font-size': '26',
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        'pointer-events': 'none'
    });
    angelEmoji.textContent = '👼';
    angelGroup.appendChild(angelEmoji);

    svg.appendChild(angelGroup);

    const demonWingPos = {
        x: point.x + Math.cos(toDemonDir * Math.PI / 180) * wingOffset,
        y: point.y + Math.sin(toDemonDir * Math.PI / 180) * wingOffset
    };

    const demonArrowStart = {
        x: point.x + Math.cos(toDemonDir * Math.PI / 180) * (wingOffset - 8),
        y: point.y + Math.sin(toDemonDir * Math.PI / 180) * (wingOffset - 8)
    };
    const demonArrowEnd = {
        x: point.x + Math.cos(toDemonDir * Math.PI / 180) * 12,
        y: point.y + Math.sin(toDemonDir * Math.PI / 180) * 12
    };

    const demonGroup = el('g', {
        class: 'atlas-item atlas-vector-dark',
        'data-key': 'demonWings'
    });

    const demonArrow = el('line', {
        x1: demonArrowStart.x, y1: demonArrowStart.y,
        x2: demonArrowEnd.x, y2: demonArrowEnd.y,
        stroke: '#FF4444',
        'stroke-width': '1.5',
        'marker-end': 'url(#arrowHeadDark)'
    });
    demonGroup.appendChild(demonArrow);

    const demonEmoji = el('text', {
        x: demonWingPos.x, y: demonWingPos.y,
        'font-size': '26',
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        'pointer-events': 'none'
    });
    demonEmoji.textContent = '😈';
    demonGroup.appendChild(demonEmoji);

    svg.appendChild(demonGroup);
}

// ============================================
// 9. ВСПЛЫВАЮЩАЯ КАРТОЧКА
// ============================================

function initTooltip() {
    const tooltip = document.getElementById('atlas-tooltip');
    const tooltipName = tooltip.querySelector('.atlas-tooltip-name');

    document.querySelectorAll('.atlas-item').forEach(function(item) {
        item.addEventListener('mouseenter', function(e) {
            const key = this.getAttribute('data-key');
            const index = this.getAttribute('data-index');
            const name = getItemName(key, index);

            tooltipName.textContent = name;
            tooltip.style.display = 'block';

            const rect = this.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width / 2) + 'px';
            tooltip.style.top = (rect.top - 10) + 'px';
        });

        item.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
        });
    });
}

function getItemName(key, index) {
    if (key === 'choice') {
        return 'Важный выбор № ' + index;
    }
    const item = ATLAS_ITEMS[key];
    return item ? item.name : 'Неизвестно';
}

// ============================================
// 10. КЛИКИ
// ============================================

function initClicks() {
    document.querySelectorAll('.atlas-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const key = this.getAttribute('data-key');
            const index = this.getAttribute('data-index');
            showInfo(key, index);
        });
    });
}

// ============================================
// 11. ИНФО-ПАНЕЛЬ
// ============================================

function showInfo(key, index) {
    const panel = document.getElementById('atlas-info-panel');
    const content = panel.querySelector('.atlas-info-content');

    let data = ATLAS_ITEMS[key];
    if (!data && key === 'choice') {
        data = ATLAS_ITEMS.choice;
    }

    if (!data) {
        data = { name: 'Неизвестный элемент', desc: '' };
    }

    content.innerHTML = 
        '<h2>' + data.name + '</h2>' +
        '<p class="atlas-sub">Элемент Атласа Судьбы</p>' +
        '<div class="atlas-desc">' + data.desc + '</div>';

    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================
// 12. ЗАКРЫТИЕ ПАНЕЛИ
// ============================================

function initCloseButton() {
    const btn = document.getElementById('closeAtlasInfo');
    if (btn) {
        btn.addEventListener('click', function() {
            document.getElementById('atlas-info-panel').style.display = 'none';
        });
    }
}

// ============================================
// 13. СВИТОК "ЧТО ТАКОЕ АТЛАС СУТЬБЫ"
// ============================================

function initScrollToggle() {
    const btn = document.getElementById('atlas-scroll-toggle');
    const body = document.getElementById('atlas-scroll-body');
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
    drawAtlas();
    initTooltip();
    initClicks();
    initCloseButton();
    initScrollToggle();
});