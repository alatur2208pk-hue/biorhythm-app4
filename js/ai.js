// ============================================
// 1. ИМПОРТЫ
// ============================================

import { DEEPSEEK_CONFIG, MOON_IMAGES } from './config.js';
import { getCycleStatus } from './render.js';

// ============================================
// 2. ЗАПРОС К DEEPSEEK API
// ============================================

export async function getDayAdvice(dayData, phase, CYCLES, userQuestion) {
    const date = dayData.date;
    const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const userName = window._userName || 'путник';
    const userGender = window._userGender || 'male';
    const possessive = userGender === 'male' ? 'твой' : 'твоя';
    const possessive2 = userGender === 'male' ? 'твоего' : 'твоей';
    
    // ===== ПОИСК ПРЕДЫДУЩЕГО ДНЯ ДЛЯ РАСЧЁТА ПРОИЗВОДНОЙ =====
    let prevDay = null;
    if (window._currentData && window._currentData.length > 0) {
        const currentIdx = window._currentData.findIndex(function(d) {
            return d.date.getTime() === dayData.date.getTime();
        });
        if (currentIdx > 0) {
            prevDay = window._currentData[currentIdx - 1];
        }
    }
    
    let cyclesInfo = '';
    CYCLES.forEach(function(cycle) {
        const value = dayData.cycles[cycle.name];
        const prevValue = prevDay ? prevDay.cycles[cycle.name] : value;
        const percent = Math.round(Math.abs(value) * 100);
        
        // Используем ту же логику, что и на графике
        const status = getCycleStatus(value, prevValue);
        
        // Эмодзи по зоне значения
        let emoji = '';
        if (value >= 0.9) emoji = '🔥';
        else if (value >= 0) emoji = '⬆';
        else if (value > -0.9) emoji = '⬇';
        else emoji = '❄';
        
        cyclesInfo += cycle.name + ': ' + emoji + ' ' + percent + '% — ' + status + '\n';
    });
    
    const moonInfo = 'Луна в фазе "' + phase.name + '" ' + phase.icon + '. ' + phase.influence;
    
    let systemPrompt = 
        'Ты — Ведагор, мудрый славянский волхв и наставник. Ты даёшь советы на основе биоритмов и лунного календаря.\n\n' +
        'Твои черты:\n' +
        '- Говоришь мудро, но просто и понятно\n' +
        '- Используешь образы природы: солнце, ветер, земля, вода, лес\n' +
        '- Обращаешься к человеку на "ты" с теплотой и уважением\n' +
        '- Всегда обращаешься к человеку по имени: ' + userName + '\n' +
        '- Учитываешь пол человека. Если женщина — используешь женский род: "она", "ей", "её". Если мужчина — мужской род: "он", "ему", "его"\n' +
        '- НИКОГДА не используешь звёздочки (**) в тексте\n' +
        '- Начинаешь каждый пункт с "Твой [название цикла] цикл"\n' +
        '- Отвечаешь кратко и по делу (3-6 предложений)\n' +
        '- Используешь древнеславянские обороты речи: "ведь", "дабы", "во благо", "сила твоя"\n' +
        '- Сравниваешь состояние человека с природными явлениями\n' +
        '- Никогда не пугаешь, даёшь надежду и поддержку\n' +
        '- Отвечаешь только на русском языке';

    let basePrompt = 
        'День: ' + dateStr + '\n\n' +
        'Состояние ' + possessive2 + ' циклов:\n' + cyclesInfo + '\n' +
        moonInfo + '\n\n';
    
    let prompt = '';
    if (userQuestion) {
        prompt = basePrompt +
            userName + ' спрашивает: "' + userQuestion + '"\n\n' +
            'Ответь мудро и с душой, как добрый волхв. Дай совет, который поможет ' + userName + ' в этот день. Обращайся к нему по имени. Начинай каждый пункт с "Твой [название] цикл". НЕ используй звёздочки (**).';
    } else {
        prompt = basePrompt +
            'Дай совет ' + userName + ' на этот день. Распиши его так:\n' +
            '1. 🌙 Что говорит луна\n' +
            '2. ' + CYCLES[0].name + ': состояние и совет\n' +
            '3. ' + CYCLES[1].name + ': состояние и совет\n' +
            '4. ' + CYCLES[2].name + ': состояние и совет\n' +
            '5. ' + CYCLES[3].name + ': состояние и совет\n' +
            '6. ' + CYCLES[4].name + ': состояние и совет\n\n' +
            'Говори кратко по каждому пункту. Сохраняй образ мудрого волхва. Обращайся к ' + userName + ' по имени. Начинай каждый пункт с "Твой [название] цикл". НЕ используй звёздочки (**).';
    }

    if (!DEEPSEEK_CONFIG.apiKey || DEEPSEEK_CONFIG.apiKey === 'YOUR_DEEPSEEK_API_KEY') {
        console.warn('DeepSeek API ключ не настроен. Используем заглушку.');
        return getFallbackAdvice(dayData, phase, CYCLES, userQuestion);
    }

    try {
        const response = await fetch(DEEPSEEK_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + DEEPSEEK_CONFIG.apiKey
            },
            body: JSON.stringify({
                model: DEEPSEEK_CONFIG.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.6,
                max_tokens: 2500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка API:', errorText);
            return getFallbackAdvice(dayData, phase, CYCLES, userQuestion);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();

    } catch (error) {
        console.error('Ошибка запроса к DeepSeek:', error);
        return getFallbackAdvice(dayData, phase, CYCLES, userQuestion);
    }
}

// ============================================
// 3. ЗАГЛУШКА (ЕСЛИ НЕТ API КЛЮЧА)
// ============================================

function getFallbackAdvice(dayData, phase, CYCLES, userQuestion) {
    const date = dayData.date;
    const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const userName = window._userName || 'путник';
    const userGender = window._userGender || 'male';
    const possessive = userGender === 'male' ? 'твой' : 'твоя';
    const possessive2 = userGender === 'male' ? 'твоего' : 'твоей';
    
    // ===== ПОИСК ПРЕДЫДУЩЕГО ДНЯ ДЛЯ РАСЧЁТА ПРОИЗВОДНОЙ =====
    let prevDay = null;
    if (window._currentData && window._currentData.length > 0) {
        const currentIdx = window._currentData.findIndex(function(d) {
            return d.date.getTime() === dayData.date.getTime();
        });
        if (currentIdx > 0) {
            prevDay = window._currentData[currentIdx - 1];
        }
    }
    
    let sum = 0;
    CYCLES.forEach(function(cycle) {
        sum += dayData.cycles[cycle.name];
    });
    const avgValue = sum / CYCLES.length;
    
    let advice = '🌿 ' + userName + ', Ведагор говорит тебе в день ' + dateStr + ':\n\n';
    
    advice += '🌙 Луна в фазе "' + phase.name + '". ';
    if (phase.name === 'Новолуние') {
        advice += 'Время обновления, как весенний ручей. Очисти душу и начни новое.\n\n';
    } else if (phase.name === 'Полнолуние') {
        advice += 'Сила ' + possessive2 + ' на пике, но ветер эмоций может качнуть ладью. Будь спокоен как озеро.\n\n';
    } else if (phase.name.indexOf('Молодая') !== -1 || phase.name.indexOf('Первая') !== -1 || phase.name.indexOf('Прибывающая') !== -1) {
        advice += 'Энергия растёт как молодой дубок. Самое время сеять семена замыслов.\n\n';
    } else if (phase.name.indexOf('Убывающая') !== -1 || phase.name.indexOf('Последняя') !== -1 || phase.name.indexOf('Старая') !== -1) {
        advice += 'Пора завершать дела, как осенью собирают урожай. Благодари за всё.\n\n';
    } else {
        advice += 'Прислушайся к себе, как лес прислушивается к ветру.\n\n';
    }
    
    CYCLES.forEach(function(cycle) {
        const value = dayData.cycles[cycle.name];
        const prevValue = prevDay ? prevDay.cycles[cycle.name] : value;
        const percent = Math.round(Math.abs(value) * 100);
        
        // Используем ту же логику, что и на графике
        const status = getCycleStatus(value, prevValue);
        
        let emoji = '';
        if (value >= 0.9) emoji = '🔥';
        else if (value >= 0) emoji = '⬆';
        else if (value > -0.9) emoji = '⬇';
        else emoji = '❄';
        
        // Формируем совет в зависимости от статуса
        let adviceText = '';
        const isPositive = value >= 0;
        
        if (status === 'пик силы') {
            if (cycle.name === 'Физический') adviceText = 'Твой физический цикл сейчас на пике, ' + userName + ' — тело готово к подвигам, как могучий дуб перед бурей. Действуй смело!';
            else if (cycle.name === 'Эмоциональный') adviceText = 'Твой эмоциональный цикл на пике, ' + userName + ' — душа твоя светится, как солнце в полдень. Делись теплом с миром!';
            else if (cycle.name === 'Интеллектуальный') adviceText = 'Твой ум сейчас ясен и остр, ' + userName + ' — время великих открытий и мудрых решений. Твори!';
            else if (cycle.name === 'Психокинетический') adviceText = 'Сила твоей мысли сейчас огромна, ' + userName + ' — загадывай смело, и мир ответит тебе!';
            else if (cycle.name === 'Астро-ментальный') adviceText = 'Твой сон сейчас глубок и вещий, ' + userName + ' — запоминай сны, они ключ к тайнам подсознания.';
        } else if (status === 'на дне') {
            if (cycle.name === 'Физический') adviceText = 'Твой физический цикл на дне, ' + userName + ' — словно зимний лес, тело набирается сил перед весной. Отдыхай без сожаления.';
            else if (cycle.name === 'Эмоциональный') adviceText = 'Твой эмоциональный цикл на дне, ' + userName + ' — душа твоя отдыхает, как земля зимой. Береги себя от лишних переживаний.';
            else if (cycle.name === 'Интеллектуальный') adviceText = 'Твой ум в спячке, ' + userName + ' — не пытайся решать сложные задачи. Время тишины и простых дел.';
            else if (cycle.name === 'Психокинетический') adviceText = 'Твоя внутренняя сила затихла, ' + userName + ' — не борись с обстоятельствами. Доверься течению жизни.';
            else if (cycle.name === 'Астро-ментальный') adviceText = 'Ты можешь видеть вещие сны, ' + userName + ' — подсознание открыто. Записывай то, что снится, ищи знаки.';
        } else if (status === 'идёт на подъём' || status === 'подъём') {
            if (cycle.name === 'Физический') adviceText = 'Твой физический цикл идёт на подъём, ' + userName + ' — тело наливается силой, как река весной. Время для дел и свершений!';
            else if (cycle.name === 'Эмоциональный') adviceText = 'Твой эмоциональный цикл растёт, ' + userName + ' — душа твоя поёт, как жаворонок в небе. Радуйся и вдохновляй других!';
            else if (cycle.name === 'Интеллектуальный') adviceText = 'Твой ум набирает высоту, ' + userName + ' — мысли ясны, как звёздное небо. Учись и познавай новое!';
            else if (cycle.name === 'Психокинетический') adviceText = 'Твоя внутренняя сила растёт, ' + userName + ' — замыслы твои обретают крылья. Действуй уверенно!';
            else if (cycle.name === 'Астро-ментальный') adviceText = 'Твои сны становятся ярче, ' + userName + ' — подсознание открывает двери. Слушай его подсказки!';
        } else if (status === 'идёт на спад' || status === 'спад') {
            if (cycle.name === 'Физический') adviceText = 'Твой физический цикл идёт на спад, ' + userName + ' — тело просит отдыха. Побудь в тишине, как лес перед грозой.';
            else if (cycle.name === 'Эмоциональный') adviceText = 'Твой эмоциональный цикл на спаде, ' + userName + ' — не ищи бурь, побудь с собой. Эмоции улягутся, как волны после шторма.';
            else if (cycle.name === 'Интеллектуальный') adviceText = 'Твой ум устал, ' + userName + ' — дай ему отдых. Не заставляй себя думать, просто наблюдай за миром.';
            else if (cycle.name === 'Психокинетический') adviceText = 'Твоя внутренняя сила уменьшается, ' + userName + ' — не сопротивляйся течению жизни. Прими то, что есть.';
            else if (cycle.name === 'Астро-ментальный') adviceText = 'Твой сон становится глубже, ' + userName + ' — подсознание активно работает. Позволь себе поспать дольше.';
        } else {
            // «в равновесии»
            if (cycle.name === 'Физический') adviceText = 'Твой физический цикл в равновесии, ' + userName + ' — тело спокойно, как озеро в безветренный день. Наслаждайся гармонией.';
            else if (cycle.name === 'Эмоциональный') adviceText = 'Твой эмоциональный цикл в равновесии, ' + userName + ' — душа твоя ровна, как гладь воды. Время для спокойных размышлений.';
            else if (cycle.name === 'Интеллектуальный') adviceText = 'Твой ум в равновесии, ' + userName + ' — мысли текут плавно, как река. Всё, что нужно, придёт в свой срок.';
            else if (cycle.name === 'Психокинетический') adviceText = 'Твоя внутренняя сила в покое, ' + userName + ' — соберись с мыслями, время для планирования.';
            else if (cycle.name === 'Астро-ментальный') adviceText = 'Твой сон спокоен и ровен, ' + userName + ' — отдыхай и набирайся сил перед новым днём.';
        }
        
        // Цвет статуса в тексте зависит от знака значения
        const statusColorWord = isPositive ? '🟢' : '🔴';
        
        advice += cycle.name + ' ' + emoji + ': ' + percent + '% — ' + statusColorWord + ' ' + status + '.\n';
        advice += adviceText + '\n\n';
    });
    
    if (userQuestion) {
        advice += '\n📝 ' + userName + ', ты спросил' + (userGender === 'female' ? 'а' : '') + ': "' + userQuestion + '"\n';
        if (avgValue > 0.2) {
            advice += 'Сила ' + possessive2 + ' сейчас хороша, ' + userName + '. Действуй смело, как орёл в небе!';
        } else {
            advice += 'Время набраться терпения, ' + userName + ', как земля перед дождём. Всё будет во благо.';
        }
    } else {
        advice += '\n🌿 Пусть сила Рода будет с тобой, ' + userName + '. Славься!';
    }
    
    return advice;
}

// ============================================
// 4. ПОКАЗ ИНФО С AI В ДНЕВНОМ ОКНЕ
// ============================================

export async function showDayWithAI(data, index, CYCLES, getMoonPhase, MOON_PHASES) {
    const infoBox = document.getElementById('day-info');
    const dayData = data[index];
    const date = dayData.date;
    const phase = getMoonPhase(date, MOON_PHASES);
    
    infoBox.dataset.index = index;
    infoBox.dataset.date = date.toISOString();
    window._currentDayData = dayData;
    window._currentPhase = phase;
    window._currentCycles = CYCLES;
    
    infoBox.style.display = 'block';
    infoBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    document.querySelector('#day-info .day-date').textContent = 
        '📅 ' + date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    
    // Определяем индекс картинки луны для этой даты
    const moonIdx = window._getMoonImageIndex ? window._getMoonImageIndex(date) : 0;
    const moonSrc = MOON_IMAGES[moonIdx] || '';

    document.querySelector('#day-info .day-moon').innerHTML = 
        '<img src="' + moonSrc + '" alt="' + phase.name + '" style="width: 60px; height: 60px; object-fit: contain; vertical-align: middle; filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.35)); margin-right: 10px;">' +
        '<strong>' + phase.name + '</strong> — ' + phase.short + '<br>' +
        '<span style="color:#aaa;font-size:13px;">' + phase.influence + '</span>';
    
    // ===== ПОИСК ПРЕДЫДУЩЕГО ДНЯ ДЛЯ РАСЧЁТА ПРОИЗВОДНОЙ =====
    let prevDayForHtml = null;
    if (window._currentData && window._currentData.length > 0) {
        const currentIdx = window._currentData.findIndex(function(d) {
            return d.date.getTime() === dayData.date.getTime();
        });
        if (currentIdx > 0) {
            prevDayForHtml = window._currentData[currentIdx - 1];
        }
    }
    
    let cyclesHtml = '';
    CYCLES.forEach(function(cycle) {
        const value = dayData.cycles[cycle.name];
        const prevValue = prevDayForHtml ? prevDayForHtml.cycles[cycle.name] : value;
        const percent = Math.round(Math.abs(value) * 100);
        
        // Используем ту же логику, что и на графике
        const status = getCycleStatus(value, prevValue);
        
        // Цвет зависит от знака значения
        let statusColor;
        if (value >= 0) {
            statusColor = '#44ff44';
        } else {
            statusColor = '#ff6666';
        }
        
        const isCritical = Math.abs(value) < 0.001;
        
        cyclesHtml += 
            '<div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05);">' +
                '<span><span style="color:' + cycle.color + '; font-weight:bold;">' + cycle.name + '</span>' +
                '<span style="color:#666; font-size:12px;"> (' + cycle.days + ' дн.)</span></span>' +
                '<span style="color:' + (isCritical ? '#ffd700' : statusColor) + '; font-size:13px; font-weight:' + (isCritical ? 'bold' : 'normal') + ';">' +
                    (isCritical ? '⭐ КРИТИЧЕСКАЯ ТОЧКА' : percent + '% — ' + status) +
                '</span>' +
            '</div>';
    });
    document.querySelector('#day-info .day-cycles').innerHTML = cyclesHtml;
    
    document.querySelector('#day-info .day-history').innerHTML = 
        '<strong style="color:#ffd700;">📜 Исторический контекст:</strong> ' + phase.history;
    
    const aiContainer = document.querySelector('#day-info .day-ai-advice');
    if (aiContainer) {
        const chatArea = aiContainer.querySelector('.ai-chat-area');
        const loadingEl = aiContainer.querySelector('.ai-loading');
        if (loadingEl) {
            loadingEl.style.display = 'flex';
            loadingEl.style.alignItems = 'center';
            loadingEl.style.gap = '12px';
            loadingEl.innerHTML = `
                <div class="vedagor-spinner"></div>
                <span style="color:#ffd700; font-size:16px;">🧙‍♂️ Ведагор думает...</span>
            `;
        }
        if (chatArea) {
            chatArea.style.display = 'block';
            chatArea.innerHTML = '';
        }
    }
    
    try {
        const advice = await getDayAdvice(dayData, phase, CYCLES, null);
        if (aiContainer) {
            const chatArea = aiContainer.querySelector('.ai-chat-area');
            const loadingEl = aiContainer.querySelector('.ai-loading');
            if (loadingEl) loadingEl.style.display = 'none';
            if (chatArea) {
                chatArea.style.display = 'block';
                const formattedAdvice = advice.split('\n').map(function(line) {
                    if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || 
                        line.trim().startsWith('3.') || line.trim().startsWith('4.') ||
                        line.trim().startsWith('5.') || line.trim().startsWith('6.')) {
                        return '<span style="color:#ffd700;">' + line.trim() + '</span>';
                    }
                    return line.trim();
                }).join('<br>');
                
                chatArea.innerHTML = 
                    '<div class="ai-message ai-bot">' +
                        '<strong>🧙‍♂️ Ведагор:</strong><br>' +
                        '<span class="ai-text">' + formattedAdvice + '</span>' +
                    '</div>';
            }
        }
    } catch (error) {
        if (aiContainer) {
            const chatArea = aiContainer.querySelector('.ai-chat-area');
            const loadingEl = aiContainer.querySelector('.ai-loading');
            if (loadingEl) loadingEl.style.display = 'none';
            if (chatArea) {
                chatArea.style.display = 'block';
                chatArea.innerHTML = 
                    '<div class="ai-message ai-bot">' +
                        '<strong style="color:#ff8844;">🧙‍♂️ Ведагор:</strong><br>' +
                        '<span style="color:#888;">Не удалось получить совет. Проверь связь с миром духов.</span>' +
                    '</div>';
            }
        }
        console.error('Ошибка AI:', error);
    }
}

// ============================================
// 5. ОТПРАВКА ВОПРОСА В ДИАЛОГЕ
// ============================================

export async function askQuestion(question) {
    const dayData = window._currentDayData;
    const phase = window._currentPhase;
    const CYCLES = window._currentCycles;
    
    if (!dayData) {
        return 'Извини, я не могу найти данные для этого дня. Попробуй обновить страницу.';
    }
    
    const chatArea = document.querySelector('#day-info .ai-chat-area');
    if (chatArea) {
        const loadingId = 'loading-' + Date.now();
        chatArea.innerHTML += 
            '<div class="ai-message ai-bot" id="' + loadingId + '">' +
                '<div style="display:flex; align-items:center; gap:12px; padding:4px 0;">' +
                    '<div class="vedagor-spinner" style="width:24px; height:24px; border-width:2px;"></div>' +
                    '<span style="color:#ffd700; font-size:14px;">🧙‍♂️ Ведагор думает...</span>' +
                '</div>' +
            '</div>';
        chatArea.scrollTop = chatArea.scrollHeight;
    }
    
    try {
        const advice = await getDayAdvice(dayData, phase, CYCLES, question);
        
        const chatArea2 = document.querySelector('#day-info .ai-chat-area');
        if (chatArea2) {
            const loadingEl = chatArea2.querySelector('[id^="loading-"]');
            if (loadingEl) {
                loadingEl.innerHTML = 
                    '<strong>🧙‍♂️ Наставник:</strong><br>' +
                    '<span class="ai-text">' + advice + '</span>';
            }
        }
        return advice;
    } catch (error) {
        console.error('Ошибка запроса:', error);
        
        const chatArea3 = document.querySelector('#day-info .ai-chat-area');
        if (chatArea3) {
            const loadingEl = chatArea3.querySelector('[id^="loading-"]');
            if (loadingEl) {
                loadingEl.innerHTML = 
                    '<strong style="color:#ff8844;">🧙‍♂️ Наставник:</strong><br>' +
                    '<span style="color:#888;">Извини, произошла ошибка. Попробуй ещё раз.</span>';
            }
        }
        return 'Извини, я не смог ответить на твой вопрос. Попробуй позже.';
    }
}

// ============================================
// 6. ВЕДАГОР ДЛЯ СВАРОЖЬЕГО КРУГА
// ============================================

export async function getSvarogAdvice(result, userQuestion) {
    const chertog = result.chertog;
    const zal = result.zal;
    const quarterInfo = result.quarterInfo;
    const yearEssence = result.yearEssence;
    const slavicDate = result.slavicDate;
    const transition = result.transition || { isTransition: false };
    
    const userName = window._userName || 'путник';
    const userGender = window._userGender || 'male';
    
    const dateStr = slavicDate.weekDay.name + ', ' + slavicDate.day + ' ' + slavicDate.month.name + ' ' + slavicDate.лето + ' Лета от С.М.З.Х.';
    
    let systemPrompt = 
        'Ты — Ведагор, мудрый славянский волхв и наставник. Ты помогаешь людям понять их судьбу через Сварожий круг.\n\n' +
        'Твои черты:\n' +
        '- Говоришь мудро, с уважением к древним традициям\n' +
        '- Используешь образы природы и славянской мифологии\n' +
        '- Обращаешься к человеку на "ты" с теплотой\n' +
        '- Всегда обращаешься к человеку по имени: ' + userName + '\n' +
        '- Учитываешь пол человека. Если перед тобой женщина — используешь женский род: "рождена", "она", "ей", "её". Если мужчина — мужской род: "рождён", "он", "ему", "его"\n' +
        '- НИКОГДА не используешь звёздочки (**) в тексте\n' +
        '- Нумеруешь пункты просто цифрами: 1., 2., 3.\n' +
        '- Говоришь живым, образным языком, как мудрый наставник\n' +
        '- Отвечаешь развёрнуто, но по делу (4-8 предложений)\n' +
        '- Используешь древнеславянские обороты: "ведь", "дабы", "во благо", "сила твоя", "Род твой"\n' +
        '- Даёшь мудрые советы, основанные на чертоге, зале и сущности года\n' +
        '- Всегда поддерживаешь и даёшь надежду\n' +
        '- Отвечаешь только на русском языке';

    let dataPrompt = 
        'Данные человека:\n\n' +
        '📅 Славянская дата: ' + dateStr + '\n' +
        '🔮 Чертог: ' + chertog.name + ' (' + chertog.symbol + ')\n' +
        '   Бог-покровитель: ' + chertog.god + '\n' +
        '   Священное дерево: ' + chertog.tree + '\n' +
        '   Стихия: ' + chertog.element + '\n' +
        '   Описание: ' + chertog.description + '\n\n';
    
    // ===== ЕСЛИ ЕСТЬ ПЕРЕХОД — ДОБАВЛЯЕМ ИНФУ О ВТОРОМ ЧЕРТОГЕ =====
    if (transition && transition.isTransition) {
        const second = transition.second;
        const from = transition.from;
        const to = transition.to;
        
        let positionText = '';
        if (transition.position === 'before') {
            positionText = 'Человек рождён в последний день Чертога ' + from.name + ' — черты его ещё сильны, но дыхание Чертога ' + to.name + ' уже рядом.';
        } else if (transition.position === 'junction') {
            positionText = 'Человек рождён в самый миг перехода — на стыке двух Чертогов.';
        } else {
            positionText = 'Человек рождён в первый день Чертога ' + to.name + ' — черты его уже проявились, но отголоски Чертога ' + from.name + ' ещё звучат.';
        }
        
        dataPrompt += 
            '☀️ ВАЖНО: Переход Ярило-Солнца!\n' +
            '   ' + transition.message + '\n' +
            '   ' + positionText + '\n\n' +
            '🌗 Второй Чертог (соседний, тоже влияет на человека):\n' +
            '   Чертог: ' + second.name + ' (' + second.symbol + ')\n' +
            '   Бог-покровитель: ' + second.god + '\n' +
            '   Священное дерево: ' + second.tree + '\n' +
            '   Стихия: ' + second.element + '\n' +
            '   Описание: ' + second.description + '\n\n';
    }
    
    dataPrompt += 
        '🏛️ Зал рождения: ' + zal.name + ' ' + zal.symbol + '\n' +
        '   ' + zal.description + '\n\n';
    
    if (quarterInfo) {
        dataPrompt += '📅 Четверть месяца: ' + quarterInfo.quarterLabel + '\n';
        if (quarterInfo.dayDescription) {
            dataPrompt += '   День ' + quarterInfo.dayInQuarter + ' в четверти: ' + quarterInfo.dayDescription + '\n';
        }
        dataPrompt += '   Характер: ' + quarterInfo.description + '\n\n';
    }
    
    if (yearEssence) {
        dataPrompt += '🌟 Сущность года: ' + yearEssence.name + '\n';
        dataPrompt += '   Стихия года: ' + yearEssence.element + '\n';
        dataPrompt += '   ' + yearEssence.description + '\n\n';
    }
    
    if (userQuestion) {
        dataPrompt += userName + ' спрашивает: "' + userQuestion + '"\n\n';
        dataPrompt += 'Дай мудрый совет, основанный на всех этих данных. ';
        if (transition && transition.isTransition) {
            dataPrompt += 'Обязательно учти, что человек рождён на переходе между двумя Чертогами — объедини черты обоих Чертогов и их покровителей в своём совете. ';
        }
        dataPrompt += 'Ответь от лица Ведагора. Обращайся к ' + userName + ' по имени. Учитывай пол человека. Говори живым, образным языком. НЕ используй звёздочки (**) в ответе.';
    } else {
        dataPrompt += 'Дай общий совет ' + userName + ' на основе его данных. Распиши:\n' +
            '1. Что говорит его чертог о его судьбе\n' +
            '2. Что говорит его зал о его предназначении\n' +
            '3. Что говорит четверть месяца о его характере\n' +
            '4. Что говорит сущность года о его жизненном пути\n';
        if (transition && transition.isTransition) {
            dataPrompt += '5. ВАЖНО: Человек рождён на переходе между Чертогами ' + transition.from.name + ' и ' + transition.to.name + ' — расскажи, как это влияет на его характер, объединив черты обоих Чертогов и их покровителей\n';
        }
        dataPrompt += '\nЗакончи мудрым напутствием. Говори живым, образным языком, как добрый наставник. Обращайся к ' + userName + ' по имени. Учитывай пол человека. НЕ используй звёздочки (**) в ответе.';
    }

    if (!DEEPSEEK_CONFIG.apiKey || DEEPSEEK_CONFIG.apiKey === 'YOUR_DEEPSEEK_API_KEY') {
        console.warn('DeepSeek API ключ не настроен. Используем заглушку.');
        return getFallbackSvarogAdvice(result, userQuestion);
    }

    try {
        const response = await fetch(DEEPSEEK_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + DEEPSEEK_CONFIG.apiKey
            },
            body: JSON.stringify({
                model: DEEPSEEK_CONFIG.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: dataPrompt }
                ],
                temperature: 0.5,
                max_tokens: 2500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка API:', errorText);
            return getFallbackSvarogAdvice(result, userQuestion);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();

    } catch (error) {
        console.error('Ошибка запроса к DeepSeek:', error);
        return getFallbackSvarogAdvice(result, userQuestion);
    }
}

// ============================================
// 7. ЗАГЛУШКА ДЛЯ СВАРОЖЬЕГО КРУГА
// ============================================

function getFallbackSvarogAdvice(result, userQuestion) {
    const chertog = result.chertog;
    const zal = result.zal;
    const quarterInfo = result.quarterInfo;
    const yearEssence = result.yearEssence;
    const transition = result.transition || { isTransition: false };
    
    const userName = window._userName || 'путник';
    const userGender = window._userGender || 'male';
    const possessive = userGender === 'male' ? 'твой' : 'твоя';
    const possessive2 = userGender === 'male' ? 'твоего' : 'твоей';
    
    const bornWord = userGender === 'male' ? 'рождён' : 'рождена';
    const askedWord = userGender === 'female' ? 'а' : '';
    
    let advice = '🧙‍♂️ Слушай, ' + userName + ', что говорит тебе Ведагор, потомок древних волхвов:\n\n';
    
    advice += 'Чертог ' + possessive + ' — "' + chertog.name + '". ' + chertog.description + '\n\n';
    advice += 'Бог-покровитель ' + chertog.god + ' наделил тебя силой стихии "' + chertog.element + '". Священное дерево ' + possessive2 + ' — ' + chertog.tree + '.\n\n';
    
    if (transition && transition.isTransition) {
        const second = transition.second;
        advice += '☀️ ' + transition.message + '\n';
        if (transition.position === 'before') {
            advice += 'Ты ' + bornWord + ' в последний день Чертога ' + transition.from.name + '. В тебе сильны черты этого Чертога, но дыхание Чертога ' + transition.to.name + ' уже коснулось тебя.\n\n';
        } else if (transition.position === 'junction') {
            advice += 'Ты ' + bornWord + ' в самый миг перехода. В тебе соединились черты обоих Чертогов.\n\n';
        } else {
            advice += 'Ты ' + bornWord + ' в первый день Чертога ' + transition.to.name + '. В тебе уже проявились его черты, но отголоски Чертога ' + transition.from.name + ' ещё звучат.\n\n';
        }
        advice += '🌗 Второй Чертог: ' + second.name + '. Бог-покровитель: ' + second.god + '. Священное дерево: ' + second.tree + '.\n\n';
    }
    
    advice += 'Зал ' + possessive2 + ' рождения — "' + zal.name + '". ' + zal.description + '\n\n';
    
    if (quarterInfo && quarterInfo.description) {
        let quarterText = quarterInfo.description;
        if (userGender === 'female') {
            quarterText = quarterText
                .replace(/рождённые/g, 'рождённые')
                .replace(/человек/g, 'человек')
                .replace(/ему/g, 'ей')
                .replace(/он/g, 'она')
                .replace(/его/g, 'её');
        }
        advice += 'Ты ' + bornWord + ' в ' + quarterInfo.quarterLabel + ' месяца, ' + userName + '. ' + quarterText + '\n\n';
    }
    
    if (yearEssence) {
        advice += 'Сущность ' + possessive2 + ' года — "' + yearEssence.name + '". ' + yearEssence.description + '\n\n';
    }
    
    advice += '🌿 Помни, ' + userName + ', сила твоя в Роде твоём. Иди по Светлому Пути, слушай сердце и береги честь. Да хранят тебя Боги, ' + userName + '!';
    
    if (userQuestion) {
        advice = '🧙‍♂️ ' + userName + ', ты спросил' + askedWord + ': "' + userQuestion + '"\n\n' + advice;
    }
    
    return advice;
}

// ============================================
// 8. ВЕДАГОР ДЛЯ СОВМЕСТИМОСТИ ЧЕРТОГОВ
// ============================================

export async function getSovmestimostAdvice(result, userQuestion) {
    const he = result.he;
    const she = result.she;
    const heData = he.data;
    const sheData = she.data;
    
    const heChertog = heData.chertog;
    const sheChertog = sheData.chertog;
    const heZal = heData.zal;
    const sheZal = sheData.zal;
    const heQuarter = heData.quarterInfo;
    const sheQuarter = sheData.quarterInfo;
    
    // ===== СИСТЕМНЫЙ ПРОМПТ =====
    let systemPrompt = 
        'Ты — Ведагор, мудрый славянский волхв и наставник. Ты помогаешь двум людям понять их совместимость через Сварожий круг.\n\n' +
        'Твои черты:\n' +
        '- Говоришь мудро, с уважением к древним традициям\n' +
        '- Используешь образы природы и славянской мифологии\n' +
        '- Обращаешься к людям по именам: ' + he.name + ' (он) и ' + she.name + ' (она)\n' +
        '- НИКОГДА не используешь звёздочки (**) в тексте\n' +
        '- Нумеруешь пункты просто цифрами: 1., 2., 3.\n' +
        '- Говоришь живым, образным языком, как мудрый наставник\n' +
        '- Отвечаешь развёрнуто, но по делу (5-8 предложений на пункт)\n' +
        '- Используешь древнеславянские обороты: "ведь", "дабы", "во благо", "сила ваша", "Род ваш"\n' +
        '- Даёшь мудрые советы на основе чертогов, залов, четвертей и стихий обоих\n' +
        '- Всегда поддерживаешь и даёшь надежду\n' +
        '- Отвечаешь только на русском языке';
    
    // ===== ДАННЫЕ ОБОИХ =====
    let dataPrompt = 
        'Данные пары:\n\n' +
        'ОН: ' + he.name + '\n' +
        '  Чертог: ' + heChertog.name + ' (' + heChertog.symbol + ')\n' +
        '  Бог-покровитель: ' + heChertog.god + '\n' +
        '  Священное дерево: ' + heChertog.tree + '\n' +
        '  Стихия: ' + heChertog.element + '\n' +
        '  Описание: ' + heChertog.description + '\n' +
        '  Зал: ' + heZal.name + ' ' + heZal.symbol + '\n' +
        '  Зал — описание: ' + heZal.description + '\n';
    
    if (heQuarter && heQuarter.description) {
        dataPrompt += '  Четверть месяца: ' + heQuarter.quarterLabel + '\n';
        dataPrompt += '  Характер четверти: ' + heQuarter.description + '\n';
    }
    if (heData.yearEssence) {
        dataPrompt += '  Сущность года: ' + heData.yearEssence.name + ' — ' + heData.yearEssence.description + '\n';
    }
    dataPrompt += '\n';
    
    dataPrompt += 
        'ОНА: ' + she.name + '\n' +
        '  Чертог: ' + sheChertog.name + ' (' + sheChertog.symbol + ')\n' +
        '  Бог-покровитель: ' + sheChertog.god + '\n' +
        '  Священное дерево: ' + sheChertog.tree + '\n' +
        '  Стихия: ' + sheChertog.element + '\n' +
        '  Описание: ' + sheChertog.description + '\n' +
        '  Зал: ' + sheZal.name + ' ' + sheZal.symbol + '\n' +
        '  Зал — описание: ' + sheZal.description + '\n';
    
    if (sheQuarter && sheQuarter.description) {
        dataPrompt += '  Четверть месяца: ' + sheQuarter.quarterLabel + '\n';
        dataPrompt += '  Характер четверти: ' + sheQuarter.description + '\n';
    }
    if (sheData.yearEssence) {
        dataPrompt += '  Сущность года: ' + sheData.yearEssence.name + ' — ' + sheData.yearEssence.description + '\n';
    }
    dataPrompt += '\n';
    
    // ===== ЗАПРОС =====
    let prompt = '';
    if (userQuestion) {
        prompt = dataPrompt +
            he.name + ' и ' + she.name + ' спрашивают: "' + userQuestion + '"\n\n' +
            'Ответь мудро и с душой, как добрый волхв. Дай совет, который поможет паре. Обращайся к обоим по именам. НЕ используй звёздочки (**).';
    } else {
        prompt = dataPrompt +
            'Дай расклад совместимости для ' + he.name + ' и ' + she.name + '. Распиши:\n' +
            '1. 💞 Общая совместимость — как соединяются их чертоги и стихии\n' +
            '2. 🔥 Любовь и страсть — как взаимодействуют их покровители и стихии\n' +
            '3. 🏡 Быт и семья — как их залы влияют на совместную жизнь\n' +
            '4. 🎯 Общие цели — как четверти их месяцев помогают или мешают\n' +
            '5. ⚠️ Возможные трудности — на что обратить внимание\n' +
            '6. 🌿 Совет от Ведагора — напутствие паре\n\n' +
            'Говори развёрнуто по каждому пункту. Сохраняй образ мудрого волхва. Обращайся к ' + he.name + ' и ' + she.name + ' по именам. НЕ используй звёздочки (**).';
    }
    
    // ===== ЗАГЛУШКА =====
    if (!DEEPSEEK_CONFIG.apiKey || DEEPSEEK_CONFIG.apiKey === 'YOUR_DEEPSEEK_API_KEY') {
        console.warn('DeepSeek API ключ не настроен. Используем заглушку.');
        return getFallbackSovmestimostAdvice(result, userQuestion);
    }
    
    // ===== ЗАПРОС К API =====
    try {
        const response = await fetch(DEEPSEEK_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + DEEPSEEK_CONFIG.apiKey
            },
            body: JSON.stringify({
                model: DEEPSEEK_CONFIG.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 1200
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка API:', errorText);
            return getFallbackSovmestimostAdvice(result, userQuestion);
        }
        
        const data = await response.json();
        return data.choices[0].message.content.trim();
        
    } catch (error) {
        console.error('Ошибка запроса к DeepSeek:', error);
        return getFallbackSovmestimostAdvice(result, userQuestion);
    }
}

// ============================================
// 9. ЗАГЛУШКА ДЛЯ СОВМЕСТИМОСТИ (БЕЗ API)
// ============================================

function getFallbackSovmestimostAdvice(result, userQuestion) {
    const he = result.he;
    const she = result.she;
    const heData = he.data;
    const sheData = she.data;
    
    const heChertog = heData.chertog;
    const sheChertog = sheData.chertog;
    const heZal = heData.zal;
    const sheZal = sheData.zal;
    const heQuarter = heData.quarterInfo;
    const sheQuarter = sheData.quarterInfo;
    
    // ===== ОПРЕДЕЛЯЕМ СТИХИИ =====
    const heElement = heChertog.element;
    const sheElement = sheChertog.element;
    
    let elementHarmony = '';
    if (heElement === sheElement) {
        elementHarmony = 'Ваши стихии совпадают — это даёт естественное понимание и лёгкость в общении.';
    } else if (
        (heElement === 'Огонь' && sheElement === 'Воздух') ||
        (heElement === 'Воздух' && sheElement === 'Огонь')
    ) {
        elementHarmony = 'Огонь и Воздух — союз страсти и вдохновения. Воздух раздувает пламя, но и может его погасить, если переусердствовать.';
    } else if (
        (heElement === 'Земля' && sheElement === 'Вода') ||
        (heElement === 'Вода' && sheElement === 'Земля')
    ) {
        elementHarmony = 'Земля и Вода — союз плодородия. Вода питает Землю, Земля даёт Воде форму. Это союз стабильности и глубины.';
    } else if (
        (heElement === 'Огонь' && sheElement === 'Вода') ||
        (heElement === 'Вода' && sheElement === 'Огонь')
    ) {
        elementHarmony = 'Огонь и Вода — сложный союз. Или пар, или пепел. Многое зависит от того, кто кого принимает и в какой мере.';
    } else if (
        (heElement === 'Огонь' && sheElement === 'Земля') ||
        (heElement === 'Земля' && sheElement === 'Огонь')
    ) {
        elementHarmony = 'Огонь и Земля — союз устойчивости. Земля принимает Огонь, Огонь согревает Землю. Может быть тепло и надёжно.';
    } else if (
        (heElement === 'Воздух' && sheElement === 'Вода') ||
        (heElement === 'Вода' && sheElement === 'Воздух')
    ) {
        elementHarmony = 'Воздух и Вода — союз лёгкости и текучести. Много движения, мало опоры. Хорошо для творчества, но важно не потерять корни.';
    } else if (
        (heElement === 'Воздух' && sheElement === 'Земля') ||
        (heElement === 'Земля' && sheElement === 'Воздух')
    ) {
        elementHarmony = 'Воздух и Земля — союз мечты и реальности. Воздух летает, Земля держит. Если договорятся — будет опора для полёта.';
    } else {
        elementHarmony = 'Ваши стихии разные — это даёт интерес, но требует большего внимания друг к другу.';
    }
    
    // ===== ФОРМИРУЕМ ОТВЕТ =====
    let advice = '💞 Ведагор говорит о паре ' + he.name + ' и ' + she.name + ':\n\n';
    
    // 1. Общая совместимость
    advice += '1. 💞 Общая совместимость\n';
    advice += he.name + ' рождён в Чертоге ' + heChertog.name + ' (' + heChertog.symbol + '), под покровительством ' + heChertog.god + '.\n';
    advice += she.name + ' рождена в Чертоге ' + sheChertog.name + ' (' + sheChertog.symbol + '), под покровительством ' + sheChertog.god + '.\n';
    advice += elementHarmony + '\n\n';
    
    // 2. Любовь
    advice += '2. 🔥 Любовь и страсть\n';
    advice += 'Его стихия — ' + heElement + ', её стихия — ' + sheElement + '. ' + heChertog.description.split('.')[0] + '. ' + sheChertog.description.split('.')[0] + '.\n';
    advice += 'Соединение этих качеств может быть как источником тепла, так и испытанием. Слушайте друг друга — и огонь не сожжёт, а согреет.\n\n';
    
    // 3. Быт и семья
    advice += '3. 🏡 Быт и семья\n';
    advice += 'Его Зал — ' + heZal.name + '. ' + heZal.description.split('.')[0] + '.\n';
    advice += 'Её Зал — ' + sheZal.name + '. ' + sheZal.description.split('.')[0] + '.\n';
    advice += 'В быту вам поможет уважение к разным проявлениям друг друга. Каждый приносит в дом своё — и это может стать силой союза.\n\n';
    
    // 4. Общие цели
    advice += '4. 🎯 Общие цели\n';
    if (heQuarter && heQuarter.description) {
        advice += he.name + ' — четверть: ' + heQuarter.quarterLabel + '. ' + heQuarter.description.split('.')[0] + '.\n';
    }
    if (sheQuarter && sheQuarter.description) {
        advice += she.name + ' — четверть: ' + sheQuarter.quarterLabel + '. ' + sheQuarter.description.split('.')[0] + '.\n';
    }
    advice += 'Разные четверти могут означать разные ритмы жизни. Учитесь идти в ногу — или принимать разный темп.\n\n';
    
    // 5. Трудности
    advice += '5. ⚠️ Возможные трудности\n';
    if (heElement === sheElement) {
        advice += 'Схожесть стихий даёт понимание, но может привести к застою. Ищите новое вместе — не замыкайтесь в привычном.';
    } else {
        advice += 'Разные стихии — разные скорости и потребности. Не пытайтесь переделать друг друга — ищите общий ритм.';
    }
    advice += '\n\n';
    
    // 6. Совет
    advice += '6. 🌿 Совет от Ведагора\n';
    advice += 'Помните, ' + he.name + ' и ' + she.name + ', что союз — это не совпадение, а путь. Два разных чертога не встречаются случайно. Ваша встреча — это возможность пройти вместе то, что поодиночке пройти сложно.\n';
    advice += 'Берегите друг друга. Слушайте совесть — она подскажет верное слово. И пусть сила Рода будет с вами.\n\n';
    
    if (userQuestion) {
        advice = '💞 ' + he.name + ' и ' + she.name + ' спрашивают: "' + userQuestion + '"\n\n' + advice;
    }
    
    return advice;
}