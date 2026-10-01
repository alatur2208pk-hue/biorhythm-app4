// ============================================
// 1. РАСЧЁТ ДНЕЙ
// ============================================

export function daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = (d2 - d1) / (1000 * 60 * 60 * 24);
    return Math.floor(diff);
}

// ============================================
// 2. РАСЧЁТ ЦИКЛА
// ============================================

export function calcCycleValue(daysLived, cycleLength) {
    const remainder = daysLived % cycleLength;
    const angle = (remainder / cycleLength) * 2 * Math.PI;
    return Math.sin(angle);
}

export function calculateAllCycles(birthDate, viewDate, rangeDays, CYCLES) {
    const start = new Date(viewDate);
    const daysLived = daysBetween(birthDate, start);
    const results = [];

    for (let i = 0; i < rangeDays; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        const currentDaysLived = daysLived + i;
        
        const dayData = {
            date: new Date(currentDate),
            cycles: {}
        };

        CYCLES.forEach(function(cycle) {
            dayData.cycles[cycle.name] = calcCycleValue(currentDaysLived, cycle.days);
        });

        results.push(dayData);
    }

    return results;
}

// ============================================
// 3. ПОИСК КРИТИЧЕСКИХ ДНЕЙ
// ============================================

export function findCriticalDays(data, CYCLES) {
    const criticalMap = {};
    
    CYCLES.forEach(function(cycle) {
        for (let i = 0; i < data.length; i++) {
            const val = data[i].cycles[cycle.name];
            if (Math.abs(val) < 0.001) {
                if (!criticalMap[i]) criticalMap[i] = [];
                criticalMap[i].push(cycle.name);
            }
        }
    });

    return criticalMap;
}

// ============================================
// 4. ЛУННЫЕ ФАЗЫ
// ============================================

export function getMoonPhase(date, MOON_PHASES) {
    const knownNewMoon = new Date(2000, 0, 6);
    const days = daysBetween(knownNewMoon, date);
    const lunarAge = ((days % 29.53) + 29.53) % 29.53;
    const phaseIndex = Math.floor((lunarAge / 29.53) * 8) % 8;
    return MOON_PHASES[phaseIndex];
}

// ============================================
// 5. ВОЗРАСТ ЛУНЫ И НОМЕР КАРТИНКИ (0..14)
// ============================================

export function getMoonAge(date) {
    const knownNewMoon = new Date(2000, 0, 6);
    const days = daysBetween(knownNewMoon, date);
    const lunarAge = ((days % 29.53) + 29.53) % 29.53;
    return lunarAge;
}

export function getMoonImageIndex(date) {
    const lunarAge = getMoonAge(date);
    // 29.53 дней делим на 15 отрезков ≈ 1.97 дня на картинку
    // Округляем: floor(lunarAge / 2) → 0..14 (максимум 14)
    let idx = Math.floor(lunarAge / 2);
    if (idx > 14) idx = 14;
    return idx;
}