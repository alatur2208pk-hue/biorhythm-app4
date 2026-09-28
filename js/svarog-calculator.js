// ============================================
// КАЛЬКУЛЯТОР СВАРОЖЬЕГО КРУГА (РАБОЧАЯ ВЕРСИЯ)
// ============================================

import { CHERTOGI, MONTHS, WEEK_DAYS, YEARS, ZALY, QUARTERS_DATA, DAY_QUARTER_INFO } from './svarog-data.js';

// ============================================
// 1. ЭТАЛОННАЯ ТОЧКА ОТСЧЁТА
// ============================================

// 1 Рамхатъ 7376 Лета от С.М.З.Х. = 19 сентября 1867 года
const EPOCH_DATE = new Date(1867, 8, 19);
const EPOCH_YEAR = 7376;

// ============================================
// 2. БАЗОВЫЕ ФУНКЦИИ
// ============================================

function isSacredYear(yearInCircle) {
    return yearInCircle === 16;
}

function getDaysInYear(year) {
    const yearInCircle = ((year - 1) % 16) + 1;
    return isSacredYear(yearInCircle) ? 369 : 365;
}

function getDaysInMonth(monthIndex, year) {
    const yearInCircle = ((year - 1) % 16) + 1;
    if (isSacredYear(yearInCircle)) {
        return 41;
    }
    return (monthIndex % 2 === 0) ? 41 : 40;
}

// ============================================
// 3. ОСНОВНАЯ ФУНКЦИЯ ПЕРЕВОДА ДАТЫ
// ============================================

export function toSlavicDate(day, month, year, hours = 12, minutes = 0) {
    const birthDate = new Date(year, month - 1, day, hours || 12, minutes || 0);
    const isAfter18 = hours >= 18;

    let adjustedDate = new Date(birthDate);
    if (isAfter18) {
        adjustedDate.setDate(adjustedDate.getDate() + 1);
    }

    const diffDays = Math.floor((adjustedDate - EPOCH_DATE) / (1000 * 60 * 60 * 24));

    let remainingDays = diffDays;
    let currentYear = EPOCH_YEAR;

    if (remainingDays < 0) {
        while (remainingDays < 0) {
            currentYear--;
            remainingDays += getDaysInYear(currentYear);
        }
    } else {
        let daysInCurrentYear = getDaysInYear(currentYear);
        while (remainingDays >= daysInCurrentYear) {
            remainingDays -= daysInCurrentYear;
            currentYear++;
            daysInCurrentYear = getDaysInYear(currentYear);
        }
    }

    const dayInYear = remainingDays;

    let monthIndex = 0;
    let dayInMonth = dayInYear;

    while (monthIndex < MONTHS.length) {
        const daysInMonth = getDaysInMonth(monthIndex, currentYear);
        if (dayInMonth < daysInMonth) {
            break;
        }
        dayInMonth -= daysInMonth;
        monthIndex++;
    }

    const slavicMonth = MONTHS[monthIndex];
    const slavicDay = dayInMonth + 1;

    const weekDayNumber = (diffDays % 9) + 1;
    const weekDay = WEEK_DAYS[weekDayNumber - 1];

    const летоInCircle = ((currentYear - 1) % 16) + 1;
    const летоInLife = ((currentYear - EPOCH_YEAR - 1) % 144 + 144) % 144 + 1;

    return {
        лето: currentYear,
        летоInCircle: летоInCircle,
        летоInLife: летоInLife,
        month: slavicMonth,
        day: slavicDay,
        weekDay: weekDay,
        weekDayNumber: weekDayNumber,
        daysFromNewYear: dayInYear,
        isAfter18: isAfter18,
        isSacred: isSacredYear(летоInCircle)
    };
}

// ============================================
// 4. ОПРЕДЕЛЕНИЕ ЧЕРТОГА (ПО СЛАВЯНСКОЙ ДАТЕ)
// ============================================

export function getChertog(day, month, year, hours = 12) {
    const slavicDate = toSlavicDate(day, month, year, hours, 0);
    const slavicMonthName = slavicDate.month.name;
    const slavicDay = slavicDate.day;

    for (let i = 0; i < CHERTOGI.length; i++) {
        const chertog = CHERTOGI[i];
        const start = chertog.dates.start;
        const end = chertog.dates.end;

        if (isDateInRange(slavicMonthName, slavicDay, start.month, start.day, end.month, end.day)) {
            return chertog;
        }
    }

    return CHERTOGI[0];
}

// ============================================
// 4.1. ПРОВЕРКА: ПОПАДАЕТ ЛИ ДАТА В ДИАПАЗОН
// ============================================

function isDateInRange(monthName, day, startMonth, startDay, endMonth, endDay) {
    const monthIndex = MONTHS.findIndex(m => m.name === monthName);
    const startMonthIndex = MONTHS.findIndex(m => m.name === startMonth);
    const endMonthIndex = MONTHS.findIndex(m => m.name === endMonth);

    if (monthIndex === -1 || startMonthIndex === -1 || endMonthIndex === -1) {
        return false;
    }

    const currentPos = monthIndex * 100 + day;
    const startPos = startMonthIndex * 100 + startDay;
    const endPos = endMonthIndex * 100 + endDay;

    if (startPos <= endPos) {
        return currentPos >= startPos && currentPos <= endPos;
    }

    return currentPos >= startPos || currentPos <= endPos;
}

// ============================================
// 5. ОПРЕДЕЛЕНИЕ ЗАЛА (ПО СЛАВЯНСКОЙ ДАТЕ)
// ============================================

export function getZal(day, month, year, chertog, hours = 12) {
    const slavicDate = toSlavicDate(day, month, year, hours, 0);
    const slavicMonthIndex = MONTHS.findIndex(m => m.name === slavicDate.month.name);
    const startMonthIndex = MONTHS.findIndex(m => m.name === chertog.dates.start.month);

    if (slavicMonthIndex === -1 || startMonthIndex === -1) {
        return ZALY[0];
    }

    let daysFromStart = 0;

    if (slavicMonthIndex >= startMonthIndex) {
        for (let i = startMonthIndex; i < slavicMonthIndex; i++) {
            daysFromStart += MONTHS[i].days;
        }
        daysFromStart += slavicDate.day - chertog.dates.start.day;
    } else {
        for (let i = startMonthIndex; i < MONTHS.length; i++) {
            daysFromStart += MONTHS[i].days;
        }
        for (let i = 0; i < slavicMonthIndex; i++) {
            daysFromStart += MONTHS[i].days;
        }
        daysFromStart += slavicDate.day - chertog.dates.start.day;
    }

    const zalLength = 40 / 9;
    
    let zalIndex = Math.floor(daysFromStart / zalLength);
    if (zalIndex > 8) zalIndex = 8;
    if (zalIndex < 0) zalIndex = 0;

    return ZALY[zalIndex];
}

// ============================================
// 6. ОПРЕДЕЛЕНИЕ СУЩНОСТИ ГОДА (144-летний Круг Жизни)
// ============================================

export function getYearEssence(year) {
    let yearInLife = ((year - EPOCH_YEAR - 1) % 144 + 144) % 144 + 1;
    if (yearInLife < 1) yearInLife = 1;
    if (yearInLife > 144) yearInLife = 144;
    return YEARS[yearInLife - 1];
}

// ============================================
// 7. ПОЛНАЯ ИНФОРМАЦИЯ
// ============================================

export function getFullInfo(day, month, year, hours = 12, minutes = 0) {
    const slavicDate = toSlavicDate(day, month, year, hours, minutes);
    const chertogResult = getChertogWithTransition(day, month, year, hours);
    const chertog = chertogResult.main;
    const zal = getZal(day, month, year, chertog, hours);
    const yearEssence = getYearEssence(slavicDate.лето);
    
    const quarterInfo = getQuarterInfo(slavicDate.day, slavicDate.month.name);
    const lifeNumberData = getLifeNumber(slavicDate);

    return {
        slavicDate: slavicDate,
        chertog: chertog,
        zal: zal,
        yearEssence: yearEssence,
        quarterInfo: quarterInfo,
        compatibility: getCompatibility(chertog.name),
        holiday: getHoliday(day, month),
        transition: chertogResult.transition,
        lifeNumber: lifeNumberData.lifeNumber,
        lifeNumberComponents: lifeNumberData.components
    };
}

// ============================================
// 7.1. ОПРЕДЕЛЕНИЕ ЧЕРТОГА С УЧЁТОМ ПЕРЕХОДА
// ============================================

export function getChertogWithTransition(day, month, year, hours = 12) {
    const slavicDate = toSlavicDate(day, month, year, hours, 0);
    const slavicMonthName = slavicDate.month.name;
    const slavicDay = slavicDate.day;
    const slavicMonthIndex = MONTHS.findIndex(m => m.name === slavicMonthName);

    const currentPos = slavicMonthIndex * 100 + slavicDay;

    const boundaries = [];
    for (let i = 0; i < CHERTOGI.length; i++) {
        const c = CHERTOGI[i];
        const startMonthIdx = MONTHS.findIndex(m => m.name === c.dates.start.month);
        const endMonthIdx = MONTHS.findIndex(m => m.name === c.dates.end.month);
        boundaries.push({
            chertog: c,
            startPos: startMonthIdx * 100 + c.dates.start.day,
            endPos: endMonthIdx * 100 + c.dates.end.day
        });
    }

    for (let i = 0; i < boundaries.length; i++) {
        const current = boundaries[i];
        const next = boundaries[(i + 1) % boundaries.length];

        const junctionPos = current.endPos;

        if (current.endPos !== next.startPos) {
            continue;
        }

        const beforePos = getPrevPos(junctionPos);
        const afterPos = getNextPos(junctionPos);

        if (currentPos === beforePos || currentPos === junctionPos || currentPos === afterPos) {
            let main, second, position;

            if (currentPos === beforePos) {
                main = current.chertog;
                second = next.chertog;
                position = 'before';
            } else if (currentPos === junctionPos) {
                main = next.chertog;
                second = current.chertog;
                position = 'junction';
            } else {
                main = next.chertog;
                second = current.chertog;
                position = 'after';
            }

            return {
                main: main,
                transition: {
                    isTransition: true,
                    from: current.chertog,
                    to: next.chertog,
                    main: main,
                    second: second,
                    position: position,
                    message: 'В выбранную дату Ярило-Солнце переходит из Чертога ' + current.chertog.name + ' в Чертог ' + next.chertog.name
                }
            };
        }
    }

    const normalChertog = getChertog(day, month, year, hours);
    return {
        main: normalChertog,
        transition: {
            isTransition: false,
            main: normalChertog,
            second: null,
            message: null
        }
    };
}

// ============================================
// 7.2. ВСПОМОГАТЕЛЬНЫЕ: ПРЕДЫДУЩАЯ / СЛЕДУЮЩАЯ ПОЗИЦИЯ
// ============================================

function getPrevPos(pos) {
    const monthIndex = Math.floor(pos / 100);
    const day = pos % 100;

    if (day > 1) {
        return monthIndex * 100 + (day - 1);
    }

    const prevMonthIndex = monthIndex - 1;
    if (prevMonthIndex < 0) {
        return (MONTHS.length - 1) * 100 + MONTHS[MONTHS.length - 1].days;
    }
    return prevMonthIndex * 100 + MONTHS[prevMonthIndex].days;
}

function getNextPos(pos) {
    const monthIndex = Math.floor(pos / 100);
    const day = pos % 100;
    const daysInMonth = MONTHS[monthIndex].days;

    if (day < daysInMonth) {
        return monthIndex * 100 + (day + 1);
    }

    const nextMonthIndex = (monthIndex + 1) % MONTHS.length;
    return nextMonthIndex * 100 + 1;
}

// ============================================
// 8. СОВМЕСТИМОСТЬ
// ============================================

function getCompatibility(chertogName) {
    const compatible = {
        'Дева': ['Вепрь', 'Тур', 'Лось'],
        'Вепрь': ['Дева', 'Волк', 'Медведь'],
        'Щука': ['Лебедь', 'Орел', 'Рас'],
        'Лебедь': ['Щука', 'Змей', 'Лиса'],
        'Змей': ['Лебедь', 'Ворон', 'Конь'],
        'Ворон': ['Змей', 'Финист', 'Конь'],
        'Медведь': ['Вепрь', 'Тур', 'Бусл'],
        'Бусл': ['Медведь', 'Орел', 'Финист'],
        'Волк': ['Вепрь', 'Лиса', 'Тур'],
        'Лиса': ['Волк', 'Лебедь', 'Щука'],
        'Тур': ['Дева', 'Медведь', 'Лось'],
        'Лось': ['Дева', 'Тур', 'Бусл'],
        'Финист': ['Ворон', 'Бусл', 'Конь'],
        'Конь': ['Финист', 'Ворон', 'Змей'],
        'Орел': ['Щука', 'Бусл', 'Рас'],
        'Рас': ['Щука', 'Орел', 'Змей']
    };

    return compatible[chertogName] || [];
}

// ============================================
// 9. ПРАЗДНИКИ
// ============================================

function getHoliday(day, month) {
    const holidays = [
        { date: { day: 22, month: 9 }, name: 'Новолетие (Славянский Новый год)', description: 'Начало нового Лета по славянскому календарю' },
        { date: { day: 24, month: 9 }, name: 'День богини Дживы', description: 'Почитание богини жизни и плодородия' },
        { date: { day: 14, month: 10 }, name: 'Покров', description: 'День защиты и покровительства' },
        { date: { day: 31, month: 10 }, name: 'День Велеса', description: 'Почитание бога мудрости' },
        { date: { day: 21, month: 12 }, name: 'Зимнее солнцестояние', description: 'День рождения Солнца' },
        { date: { day: 7, month: 1 }, name: 'Коляда', description: 'День зимнего солнцеворота' },
        { date: { day: 14, month: 1 }, name: 'День Перуна', description: 'Почитание бога-громовержца' },
        { date: { day: 20, month: 2 }, name: 'Масленица', description: 'День проводов зимы' },
        { date: { day: 14, month: 3 }, name: 'День Ярилы', description: 'Встреча весны' },
        { date: { day: 22, month: 3 }, name: 'Весеннее равноденствие', description: 'День пробуждения природы' },
        { date: { day: 6, month: 5 }, name: 'День Бога Леля', description: 'Почитание бога любви' },
        { date: { day: 22, month: 6 }, name: 'Летнее солнцестояние', description: 'День Купалы' },
        { date: { day: 7, month: 7 }, name: 'Иван Купала', description: 'Праздник воды и огня' },
        { date: { day: 30, month: 7 }, name: 'День бога Раса', description: 'Почитание бога знаний' },
        { date: { day: 22, month: 8 }, name: 'День Тарха', description: 'Почитание бога-воина' }
    ];

    for (let holiday of holidays) {
        if (holiday.date.day === day && holiday.date.month === month) {
            return holiday;
        }
    }

    return null;
}

// ============================================
// 10. ОПРЕДЕЛЕНИЕ ЧЕТВЕРТИ МЕСЯЦА
// ============================================

export function getQuarterInfo(day, monthName) {
    let quarter = 0;
    let dayInQuarter = 0;
    let quarterLabel = '';
    
    if (day <= 10) {
        quarter = 1;
        dayInQuarter = day;
        quarterLabel = 'I четверть (1-10)';
    } else if (day <= 20) {
        quarter = 2;
        dayInQuarter = day - 10;
        quarterLabel = 'II четверть (11-20)';
    } else if (day <= 30) {
        quarter = 3;
        dayInQuarter = day - 20;
        quarterLabel = 'III четверть (21-30)';
    } else if (day <= 40) {
        quarter = 4;
        dayInQuarter = day - 30;
        quarterLabel = 'IV четверть (31-40)';
    } else if (day === 41) {
        quarter = 5;
        dayInQuarter = 0;
        quarterLabel = '41 день';
    }
    
    let description = '';
    const monthData = QUARTERS_DATA[monthName];
    if (monthData && monthData[quarter]) {
        description = monthData[quarter];
    }
    
    let dayDescription = '';
    if (dayInQuarter >= 1 && dayInQuarter <= 10) {
        dayDescription = DAY_QUARTER_INFO[dayInQuarter] || '';
    }
    
    return {
        quarter: quarter,
        quarterLabel: quarterLabel,
        dayInQuarter: dayInQuarter,
        description: description,
        dayDescription: dayDescription,
        isSpecialDay: quarter === 5
    };
}

// ============================================
// 11. РАСЧЁТ ЧИСЛА ЖИЗНИ
// ============================================

export function getLifeNumber(slavicDate) {
    // ===== СВЁРТКА ЧИСЛА ДО ОДНОЗНАЧНОГО =====
    function reduceToSingle(num) {
        while (num > 9) {
            let sum = 0;
            const digits = String(num).split('');
            for (let i = 0; i < digits.length; i++) {
                sum += parseInt(digits[i]);
            }
            num = sum;
        }
        return num;
    }
    
    // ===== 1. ЛЕТО В КРУГЕ ЖИЗНИ (1..144) =====
    const lifeNum = reduceToSingle(slavicDate.летоInLife);
    
    // ===== 2. ЛЕТО В КРУГЕ ЛЕТ (1..16) =====
    const circleNum = reduceToSingle(slavicDate.летоInCircle);
    
    // ===== 3. НОМЕР СОРОКОВНИКА (1..9) =====
    const monthNum = reduceToSingle(slavicDate.month.id);
    
    // ===== 4. НОМЕР ДНЯ НЕДЕЛИ (1..9) =====
    const weekDayNum = reduceToSingle(slavicDate.weekDayNumber);
    
    // ===== 5. ЧИСЛО РОЖДЕНИЯ В СОРОКОВНИКЕ (1..41) =====
    const dayNum = reduceToSingle(slavicDate.day);
    
    // ===== 6. СУММА ВСЕХ ЧИСЕЛ =====
    const total = lifeNum + circleNum + monthNum + weekDayNum + dayNum;
    
    // ===== 7. СВЁРТКА ДО ОДНОЗНАЧНОГО =====
    const lifeNumber = reduceToSingle(total);
    
    return {
        lifeNumber: lifeNumber,
        components: {
            lifeNum: lifeNum,
            circleNum: circleNum,
            monthNum: monthNum,
            weekDayNum: weekDayNum,
            dayNum: dayNum,
            total: total
        }
    };
}