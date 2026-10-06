// ============================================
// ИМПОРТЫ
// ============================================

import { showDayWithAI } from './ai.js';
import { calcCycleValue, daysBetween } from './calculations.js';

// ============================================
// 1. ОТРИСОВКА ЛЕГЕНДЫ
// ============================================

export function renderLegend(CYCLES) {
    const container = document.getElementById('legend');
    container.innerHTML = '';
    const tooltip = document.getElementById('cycle-tooltip');

    CYCLES.forEach(function(cycle) {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = 
            '<span class="legend-color" style="background:' + cycle.color + ';"></span>' +
            cycle.name +
            '<span class="legend-days">(' + cycle.days + ' дн.: +' + cycle.plus + '/-' + cycle.minus + ')</span>';

        item.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const tooltipEl = document.getElementById('cycle-tooltip');
            
            tooltipEl.querySelector('.cycle-name').textContent = cycle.name;
            tooltipEl.querySelector('.cycle-desc').textContent = cycle.desc;
            tooltipEl.querySelector('.cycle-detail').textContent = 
                'Длительность: ' + cycle.days + ' дней (' + cycle.plus + ' в плюсе, ' + cycle.minus + ' в минусе)';
            
            tooltipEl.style.display = 'block';
            tooltipEl.style.left = (rect.left + rect.width / 2) + 'px';
            tooltipEl.style.top = (rect.top - 10) + 'px';
            tooltipEl.style.borderColor = cycle.color;
        });

        item.addEventListener('mouseleave', function() {
            document.getElementById('cycle-tooltip').style.display = 'none';
        });

        container.appendChild(item);
    });
}

// ============================================
// 2. ОТРИСОВКА ЛУННОЙ ДОРОГИ
// ============================================

// ============================================
// 2. ОТРИСОВКА ЛУННОЙ ДОРОГИ
// ============================================

export function renderLunarRoad(data, todayDate, getMoonPhase, MOON_PHASES, showDay, CYCLES) {
    const container = document.getElementById('lunar-road');
    container.innerHTML = '';

    // Импорт картинок луны
    // MOON_IMAGES пробрасывается через аргумент (см. app.js) — но для простоты используем window
    const MOON_IMAGES_LOCAL = window._MOON_IMAGES || [];

    data.forEach(function(dayData, index) {
        const date = dayData.date;
        const phase = getMoonPhase(date, MOON_PHASES);
        const isToday = date.toDateString() === todayDate.toDateString();

        // Номер картинки луны (0..14)
        const moonIdx = window._getMoonImageIndex ? window._getMoonImageIndex(date) : 0;
        const moonSrc = MOON_IMAGES_LOCAL[moonIdx] || '';

        const dayEl = document.createElement('div');
        dayEl.className = 'lunar-day' + (isToday ? ' today' : '');
        dayEl.dataset.index = index;
        dayEl.innerHTML = 
            '<img src="' + moonSrc + '" alt="' + phase.name + '" class="moon-icon">' +
            '<span class="date-label">' + date.getDate() + '</span>';

        dayEl.addEventListener('mouseenter', function(e) {
            this.style.background = 'rgba(255,215,0,0.25)';
            this.style.borderRadius = '8px';
            this.style.transform = 'scale(1.1)';
            
            const rect = this.getBoundingClientRect();
            const tooltipEl = document.getElementById('moon-tooltip');
            
            document.querySelector('#moon-tooltip .phase-icon').textContent = phase.icon;
            document.querySelector('#moon-tooltip .phase-name').textContent = phase.name;
            document.querySelector('#moon-tooltip .phase-short').textContent = phase.short;
            document.querySelector('#moon-tooltip .phase-influence').textContent = '✦ ' + phase.influence;
            document.querySelector('#moon-tooltip .phase-history').textContent = '📜 ' + phase.history;
            
            tooltipEl.style.display = 'block';
            tooltipEl.style.left = (rect.left + rect.width / 2) + 'px';
            tooltipEl.style.top = (rect.top - 10) + 'px';
        });

        dayEl.addEventListener('mouseleave', function() {
            this.style.background = '';
            this.style.transform = '';
            document.getElementById('moon-tooltip').style.display = 'none';
        });

        dayEl.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            showDay(data, idx);
            
            document.querySelectorAll('.lunar-day').forEach(function(el) {
                el.style.border = 'none';
            });
            this.style.border = '2px solid #ffd700';
            this.style.borderRadius = '8px';
        });

        container.appendChild(dayEl);
    });
}

// ============================================
// 3. ОПРЕДЕЛЕНИЕ СТАТУСА ЦИКЛА (С УЧЁТОМ НАПРАВЛЕНИЯ И ЭКСТРЕМУМОВ)
// ============================================

export function getCycleStatus(value, prevValue) {
    // ===== 1. ЭКСТРЕМУМЫ (ПЕРЕБИВАЮТ ВСЁ) =====
    if (value >= 0.9) return 'пик силы';
    if (value <= -0.9) return 'на дне';
    
    // ===== 2. НАПРАВЛЕНИЕ ДВИЖЕНИЯ =====
    const isRising = value > prevValue;
    const isFalling = value < prevValue;
    
    // ===== 3. ОТКАТ ОТ ПИКА ИЛИ ОТСКОК ОТ ДНА =====
    if (prevValue >= 0.9 && value <= 0.8) return 'спад';
    if (prevValue <= -0.9 && value >= -0.8) return 'подъём';
    
    // ===== 4. ОБЫЧНОЕ НАПРАВЛЕНИЕ =====
    if (isRising) return 'идёт на подъём';
    if (isFalling) return 'идёт на спад';
    // Если значения равны — считаем подъёмом
    return 'идёт на подъём';
}

// ============================================
// 4. ОТРИСОВКА ГРАФИКА (С ВЫДВИЖЕНИЕМ ДАТ ПОВЕРХ)
// ============================================

export function drawChart(data, criticalMap, CYCLES, showCriticalInfo, showDay, getMoonPhase, MOON_PHASES, birthDate) {
    const canvas = document.getElementById('biorhythmChart');
    const ctx = canvas.getContext('2d');
    
    // ===== ШИРИНА: КОНТЕЙНЕР ИЛИ БОЛЬШЕ (ДЛЯ ПРОКРУТКИ) =====
    const PX_PER_DAY = 26;
    const containerWidth = canvas.parentElement.getBoundingClientRect().width - 30 || 900;
    const neededWidth = data.length * PX_PER_DAY + 80;
    canvas.width = Math.max(containerWidth, neededWidth);
    canvas.height = 420;

    const w = canvas.width;
    const h = canvas.height;
    const padding = { top: 30, bottom: 55, left: 45, right: 20 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    let datePositions = [];
    let currentHighlightIndex = undefined;

    // ===== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ДЕТАЛЬНОЙ ИНФОРМАЦИИ О ДНЕ =====
    function getDayDetails(dayData, index) {
        const date = dayData.date;
        const phase = getMoonPhase(date, MOON_PHASES);
        
        let cyclesInfo = '';
        CYCLES.forEach(function(cycle) {
            const value = dayData.cycles[cycle.name];
            const percent = Math.round(Math.abs(value) * 100);
            let status = '';
            if (value > 0.7) status = '🔥 Пик';
            else if (value > 0.3) status = '⬆ Подъём';
            else if (value > -0.3) status = '➖ Нейтр.';
            else if (value > -0.7) status = '⬇ Спад';
            else status = '❄ Минимум';
            cyclesInfo += cycle.name + ': ' + percent + '% ' + status + '\n';
        });
        
        return {
            dateStr: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
            weekDay: date.toLocaleDateString('ru-RU', { weekday: 'long' }),
            moon: phase.name + ' ' + phase.icon,
            cycles: cyclesInfo,
            isCritical: criticalMap[index] && criticalMap[index].length > 0
        };
    }

    function render(highlightIndex) {
        currentHighlightIndex = highlightIndex;
        ctx.clearRect(0, 0, w, h);

        // ===== 1. РИСУЕМ ЛИНИИ ГРАФИКА =====
        const zeroY = padding.top + chartH / 2;
        ctx.strokeStyle = '#2a3040';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(padding.left, zeroY);
        ctx.lineTo(w - padding.right, zeroY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#666';
        ctx.font = '11px Roboto, Arial';
        ctx.textAlign = 'center';
        ctx.fillText('0', padding.left - 20, zeroY + 4);
        ctx.fillText('+', padding.left - 20, padding.top + 10);
        ctx.fillText('−', padding.left - 20, h - padding.bottom - 4);

        // Рисуем циклы с тенями
        CYCLES.forEach(function(cycle) {
            const color = cycle.color;
            
            ctx.shadowColor = color;
            ctx.shadowBlur = 12;
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.beginPath();

            data.forEach(function(dayData, i) {
                const x = padding.left + (i / (data.length - 1)) * chartW;
                const value = dayData.cycles[cycle.name];
                const y = padding.top + chartH / 2 - (value * chartH / 2.2);

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            ctx.shadowBlur = 0;
        });

        // ===== 2. КРИТИЧЕСКИЕ ТОЧКИ (ПУЛЬСИРУЮЩИЕ) =====
        const criticalIndices = Object.keys(criticalMap).map(Number).sort(function(a, b) { return a - b; });
        
        criticalIndices.forEach(function(index) {
            const x = padding.left + (index / (data.length - 1)) * chartW;
            
            ctx.strokeStyle = '#ffd70033';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 6]);
            ctx.beginPath();
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, h - padding.bottom);
            ctx.stroke();
            ctx.setLineDash([]);
            
            const time = Date.now() / 1000;
            const pulse = Math.sin(time * 2) * 0.3 + 0.7;
            
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 30 * pulse;
            ctx.beginPath();
            ctx.arc(x, zeroY, 8 * pulse, 0, 2 * Math.PI);
            ctx.fillStyle = '#ffd700';
            ctx.fill();
            ctx.shadowBlur = 0;
            
            ctx.beginPath();
            ctx.arc(x, zeroY, 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // ===== 3. ЛИНИЯ "СЕГОДНЯ" =====
        const todayX = padding.left;
        ctx.strokeStyle = '#ffd70088';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(todayX, padding.top);
        ctx.lineTo(todayX, h - padding.bottom);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ffd70088';
        ctx.font = '10px Roboto, Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📌 Сегодня', todayX, padding.top - 8);

        // ===== 4. ВСЕ ДАТЫ (КРОМЕ ПОДСВЕЧЕННОЙ) =====
        datePositions = [];
        
        data.forEach(function(dayData, i) {
            const x = padding.left + (i / (data.length - 1)) * chartW;
            const dateStr = dayData.date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
            const y = h - padding.bottom + 20;
            const isToday = dayData.date.toDateString() === new Date().toDateString();
            const isCritical = criticalMap[i] && criticalMap[i].length > 0;
            const isHighlighted = (highlightIndex !== undefined && i === highlightIndex);
            
            datePositions.push({ 
                x: x, 
                y: y, 
                width: 36, 
                height: 22, 
                index: i,
                isHighlighted: isHighlighted
            });
            
            if (isHighlighted) {
                return;
            }
            
            if (isToday) {
                ctx.fillStyle = 'rgba(255,215,0,0.2)';
                ctx.beginPath();
                ctx.roundRect(x - 18, y - 11, 36, 22, 6);
                ctx.fill();
            } else {
                ctx.fillStyle = 'rgba(10,14,26,0.8)';
                ctx.beginPath();
                ctx.roundRect(x - 18, y - 11, 36, 22, 6);
                ctx.fill();
            }
            
            if (isCritical) {
                ctx.strokeStyle = '#ffd70044';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.roundRect(x - 18, y - 11, 36, 22, 6);
                ctx.stroke();
            }
            
            ctx.fillStyle = isToday ? '#ffd700' : (isCritical ? '#ffd700' : '#aaa');
            ctx.font = isToday ? 'bold 10px Roboto, Arial' : '10px Roboto, Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(dateStr, x, y + 1);
            
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.moveTo(x, padding.top + chartH);
            ctx.lineTo(x, y - 12);
            ctx.stroke();
            ctx.setLineDash([]);
        });

        // ===== 5. ПОДСВЕЧЕННАЯ ДАТА (ВЫДВИГАЕТСЯ ПОВЕРХ) =====
        if (highlightIndex !== undefined) {
            const dayData = data[highlightIndex];
            const x = padding.left + (highlightIndex / (data.length - 1)) * chartW;
            const y = h - padding.bottom + 20;
            const details = getDayDetails(dayData, highlightIndex);
            
            const pos = datePositions.find(p => p.index === highlightIndex);
            if (pos) {
                pos.x = x;
                pos.y = y;
                pos.width = 54;
                pos.height = 33;
            }
            
            const scaledWidth = 54;
            const scaledHeight = 33;

            // ===== ЛУЧ ОТ ДАТЫ ЧЕРЕЗ ВЕСЬ ГРАФИК =====
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.75)';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, h - padding.bottom);
            ctx.stroke();
            ctx.setLineDash([]);

            // ===== ТОЧКИ ПЕРЕСЕЧЕНИЯ ЛУЧА С КАЖДЫМ ЦИКЛОМ =====
            CYCLES.forEach(function(cycle) {
                const value = dayData.cycles[cycle.name];
                const cy = padding.top + chartH / 2 - (value * chartH / 2.2);
                
                // Внешнее свечение
                ctx.shadowColor = cycle.color;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(x, cy, 5, 0, 2 * Math.PI);
                ctx.fillStyle = cycle.color;
                ctx.fill();
                ctx.shadowBlur = 0;
                
                // Белая обводка
                ctx.beginPath();
                ctx.arc(x, cy, 5, 0, 2 * Math.PI);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                
                // Внутренняя точка
                ctx.beginPath();
                ctx.arc(x, cy, 2, 0, 2 * Math.PI);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            });

            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 30;
            
            ctx.fillStyle = 'rgba(20,30,50,0.92)';
            ctx.beginPath();
            ctx.roundRect(x - scaledWidth/2, y - scaledHeight/2, scaledWidth, scaledHeight, 10);
            ctx.fill();
            
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(x - scaledWidth/2, y - scaledHeight/2, scaledWidth, scaledHeight, 10);
            ctx.stroke();
            
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 15px Roboto, Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const dateShort = dayData.date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
            ctx.fillText(dateShort, x, y + 1);
            ctx.shadowBlur = 0;
            
            // ===== ИНФОРМАЦИОННАЯ КАРТОЧКА НАД ДАТОЙ =====
            const infoWidth = 240;
            const infoHeight = 200;
            let infoX = x - infoWidth/2;
            let infoY = y - scaledHeight/2 - infoHeight - 15;
            
            if (infoX < 10) infoX = 10;
            if (infoX + infoWidth > w - 10) infoX = w - infoWidth - 10;
            if (infoY < 10) infoY = 10;
            
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(10,14,26,0.95)';
            ctx.beginPath();
            ctx.roundRect(infoX, infoY, infoWidth, infoHeight, 10);
            ctx.fill();
            
            ctx.strokeStyle = '#ffd70044';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(infoX, infoY, infoWidth, infoHeight, 10);
            ctx.stroke();
            
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 13px Roboto, Arial';
            const fullDateStr = dayData.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
            ctx.fillText('📅 ' + fullDateStr, infoX + 12, infoY + 8);
            
            ctx.fillStyle = '#aaa';
            ctx.font = '12px Roboto, Arial';
            const weekDayStr = dayData.date.toLocaleDateString('ru-RU', { weekday: 'long' });
            ctx.fillText('📆 ' + weekDayStr, infoX + 12, infoY + 30);
            
            ctx.fillStyle = '#ccc';
            ctx.font = '12px Roboto, Arial';
            ctx.fillText('🌙 ' + details.moon, infoX + 12, infoY + 50);
            
            // ===== СПИСОК ЦИКЛОВ В КАРТОЧКЕ (ВСЕ 5, С УЧЁТОМ ПРОИЗВОДНОЙ) =====
            // Считаем "вчерашнее" значение через birthDate — работает для любого дня, включая сегодня
            const baseDaysLived = daysBetween(birthDate, data[0].date);
            let cycleY = infoY + 70;
            
            CYCLES.forEach(function(cycle) {
                const value = dayData.cycles[cycle.name];
                
                // Значение цикла в предыдущий день (день раньше)
                const daysLivedYesterday = baseDaysLived - 1 + highlightIndex;
                const prevValue = calcCycleValue(daysLivedYesterday, cycle.days);
                
                // Определяем статус с учётом направления и экстремумов
                const status = getCycleStatus(value, prevValue);
                const statusColor = value >= 0 ? '#44ff88' : '#ff6666';
                
                // Название цикла
                ctx.fillStyle = cycle.color;
                ctx.font = 'bold 11px Roboto, Arial';
                ctx.fillText(cycle.name + ':', infoX + 12, cycleY);
                const nameWidth = ctx.measureText(cycle.name + ':').width;
                
                // Статус (цветной, с учётом зоны)
                ctx.fillStyle = statusColor;
                ctx.font = '11px Roboto, Arial';
                ctx.fillText(status, infoX + 12 + nameWidth + 4, cycleY);
                
                cycleY += 18;
            });
            
            if (details.isCritical) {
                ctx.fillStyle = '#ffd700';
                ctx.font = 'bold 11px Roboto, Arial';
                const criticalCount = criticalMap[highlightIndex] ? criticalMap[highlightIndex].length : 0;
                let warningText = '⭐ КРИТИЧЕСКАЯ ТОЧКА!';
                if (criticalCount >= 5) {
                    warningText = '🔴 ВСЕ 5 ЦИКЛОВ! ОПАСНО!';
                } else if (criticalCount >= 3) {
                    warningText = '⚠️ 3 ЦИКЛА В ТОЧКЕ! ОСТОРОЖНО!';
                }
                ctx.fillText(warningText, infoX + 12, infoY + infoHeight - 18);
            }
            
            ctx.strokeStyle = 'rgba(255,215,0,0.2)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.moveTo(x, infoY + infoHeight);
            ctx.lineTo(x, y - scaledHeight/2);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        return datePositions;
    }

    // ===== ПЕРВИЧНАЯ ОТРИСОВКА =====
    render(undefined);

    // ===== АНИМАЦИЯ ПУЛЬСАЦИИ КРИТИЧЕСКИХ ТОЧЕК =====
    let animationId = null;

    function animatePulse() {
        const criticalIndices = Object.keys(criticalMap).map(Number).sort(function(a, b) { return a - b; });
        if (criticalIndices.length > 0) {
            render(currentHighlightIndex);
        }
        animationId = requestAnimationFrame(animatePulse);
    }

    if (animationId) cancelAnimationFrame(animationId);
    animatePulse();

    // ===== ОБРАБОТКА НАВЕДЕНИЯ МЫШИ =====
    canvas.onmousemove = function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = mouseX * scaleX;
        const canvasY = mouseY * scaleY;
        
        let foundIndex = -1;
        
        for (var i = 0; i < datePositions.length; i++) {
            var pos = datePositions[i];
            var hitWidth = 50;
            var hitHeight = 34;
            if (canvasX >= pos.x - hitWidth/2 && canvasX <= pos.x + hitWidth/2 &&
                canvasY >= pos.y - hitHeight/2 && canvasY <= pos.y + hitHeight/2) {
                foundIndex = pos.index;
                canvas.style.cursor = 'pointer';
                break;
            }
        }
        
        if (foundIndex === -1) {
            const criticalIndices = Object.keys(criticalMap).map(Number).sort(function(a, b) { return a - b; });
            for (var j = 0; j < criticalIndices.length; j++) {
                var idx = criticalIndices[j];
                var x = padding.left + (idx / (data.length - 1)) * chartW;
                var y = padding.top + chartH / 2;
                var dist = Math.sqrt((canvasX - x) * (canvasX - x) + (canvasY - y) * (canvasY - y));
                if (dist < 20) {
                    foundIndex = idx;
                    canvas.style.cursor = 'pointer';
                    break;
                }
            }
        }
        
        if (foundIndex !== -1) {
            if (foundIndex !== currentHighlightIndex) {
                render(foundIndex);
                canvas.style.cursor = 'pointer';
            }
        } else {
            if (currentHighlightIndex !== undefined) {
                render(undefined);
                canvas.style.cursor = 'default';
            }
        }
    };

    // ===== ОБРАБОТКА КЛИКА =====
    canvas.onclick = function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = mouseX * scaleX;
        const canvasY = mouseY * scaleY;
        
        let hitCritical = false;
        const criticalIndices = Object.keys(criticalMap).map(Number).sort(function(a, b) { return a - b; });
        
        for (var k = 0; k < criticalIndices.length; k++) {
            var idx = criticalIndices[k];
            var x = padding.left + (idx / (data.length - 1)) * chartW;
            var y = padding.top + chartH / 2;
            var dist = Math.sqrt((canvasX - x) * (canvasX - x) + (canvasY - y) * (canvasY - y));
            if (dist < 20) {
                showCriticalInfo(data, criticalMap, idx);
                hitCritical = true;
                break;
            }
        }
        
        if (!hitCritical) {
            for (var i = 0; i < datePositions.length; i++) {
                var pos = datePositions[i];
                var hitWidth = 50;
                var hitHeight = 34;
                if (canvasX >= pos.x - hitWidth/2 && canvasX <= pos.x + hitWidth/2 &&
                    canvasY >= pos.y - hitHeight/2 && canvasY <= pos.y + hitHeight/2) {
                    showDay(data, pos.index);
                    document.querySelectorAll('.lunar-day').forEach(function(el) {
                        el.style.border = 'none';
                        if (parseInt(el.dataset.index) === pos.index) {
                            el.style.border = '2px solid #ffd700';
                            el.style.borderRadius = '8px';
                        }
                    });
                    break;
                }
            }
        }
    };

    // ===== ОБРАБОТКА ВЫХОДА МЫШИ ЗА ПРЕДЕЛЫ CANVAS =====
    canvas.onmouseleave = function() {
        if (currentHighlightIndex !== undefined) {
            render(undefined);
            canvas.style.cursor = 'default';
        }
    };
}

// ============================================
// 5. ОТРИСОВКА СПИСКА КРИТИЧЕСКИХ ДНЕЙ
// ============================================

export function renderCriticalDays(data, criticalMap, showCriticalInfo) {
    const container = document.getElementById('critical-days');
    const indices = Object.keys(criticalMap).map(Number).sort(function(a, b) { return a - b; });
    
    if (indices.length === 0) {
        container.innerHTML = '⚠️ Критических дней (пересечений с осью) в этом периоде не обнаружено.';
        return;
    }

    var itemsHtml = '';
    indices.forEach(function(i) {
        var date = data[i].date;
        var count = criticalMap[i].length;
        var warning = '';
        if (count >= 5) warning = ' 🔴 ОПАСНО!';
        else if (count >= 3) warning = ' ⚠️';
        itemsHtml += '<span class="critical-item" data-index="' + i + '">' + 
            date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) + warning + 
            '</span>';
    });

    container.innerHTML = 
        '<strong>⭐ Критические дни (пересечение оси X):</strong><br>' +
        itemsHtml;

    container.querySelectorAll('.critical-item').forEach(function(el) {
        el.addEventListener('click', function() {
            var index = parseInt(this.dataset.index);
            showCriticalInfo(data, criticalMap, index);
        });
    });
}