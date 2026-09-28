// ============================================
// 1. ПОКАЗ ИНФО О КРИТИЧЕСКОМ ДНЕ
// ============================================

export function showCriticalInfo(data, criticalMap, index, CYCLES) {
    const infoBox = document.getElementById('critical-info');
    const date = data[index].date;
    
    document.querySelector('#critical-info .critical-date').textContent = 
        '⭐ Критический день: ' + date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const cyclesAtDay = criticalMap[index] || [];
    const count = cyclesAtDay.length;
    
    let desc = 'В этот день ' + count + ' цикл' + (count > 1 ? 'а' : '') + ' пересека' + (count > 1 ? 'ют' : 'ет') + ' ось X.<br>';
    
    if (count >= 5) {
        desc += '<strong style="color:#ff4444;">⚠️ ВСЕ 5 ЦИКЛОВ! День ОПАСНЫЙ для жизни!</strong>';
    } else if (count >= 3) {
        desc += '<strong style="color:#ff8800;">⚠️ Будьте осторожны! 3 цикла в критической точке.</strong>';
    } else {
        desc += 'Рекомендуется быть внимательным к своему состоянию.';
    }
    
    document.querySelector('#critical-info .critical-desc').innerHTML = desc;
    
    const cyclesHtml = cyclesAtDay.map(function(name) {
        const cycle = CYCLES.find(function(c) { return c.name === name; });
        return '<span style="color:' + cycle.color + '; border:1px solid ' + cycle.color + '44; background:' + cycle.color + '22; padding:3px 10px; border-radius:6px;">' + name + '</span>';
    }).join(' ');
    
    document.querySelector('#critical-info .critical-cycles').innerHTML = 
        cyclesAtDay.length > 0 ? 'Пересекающиеся циклы: ' + cyclesHtml : '';
    
    infoBox.style.display = 'block';
    infoBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================
// 2. ЗАКРЫТИЕ ИНФО-ОКНА
// ============================================

export function initCloseButtons() {
    document.getElementById('closeCriticalInfo').addEventListener('click', function() {
        document.getElementById('critical-info').style.display = 'none';
    });
    
    document.getElementById('closeDayInfo').addEventListener('click', function() {
        document.getElementById('day-info').style.display = 'none';
    });
}