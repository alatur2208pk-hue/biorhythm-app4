// ============================================
// ВЕРХНЕЕ МЕНЮ (ВЫПАДАЮЩЕЕ)
// ============================================

(function initTopNav() {
    const nav = document.getElementById('topNav');
    if (!nav) return;

    const trigger = nav.querySelector('.top-nav-trigger');
    const menu = nav.querySelector('.top-nav-menu');

    if (!trigger || !menu) return;

    let autoHideTimer = null;

    // ===== ОТКРЫТЬ / ЗАКРЫТЬ МЕНЮ =====
    function openMenu() {
        nav.classList.add('open');

        // Таймер автоскрытия через 5 секунд
        if (autoHideTimer) clearTimeout(autoHideTimer);
        autoHideTimer = setTimeout(function() {
            closeMenu();
        }, 5000);
    }

    function closeMenu() {
        nav.classList.remove('open');
        if (autoHideTimer) {
            clearTimeout(autoHideTimer);
            autoHideTimer = null;
        }
    }

    function toggleMenu() {
        if (nav.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // ===== КЛИК ПО СИМВОЛУ АЛАТЫРЯ =====
    trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // ===== КЛИК ВНЕ МЕНЮ — ЗАКРЫВАЕМ =====
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target)) {
            closeMenu();
        }
    });

    // ===== ЗАКРЫТИЕ ПО ESC =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // ===== ПРИ КЛИКЕ ПО ССЫЛКЕ — НЕ ЗАКРЫВАЕМ (переход сам сработает) =====
    // (это ок)

    // ===== ВЫХОД =====
    const logoutBtn = nav.querySelector('.top-nav-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('userName');
            localStorage.removeItem('userGender');
            window._userName = null;
            window._userGender = null;
            window.location.href = 'index.html';
        });
    }
})();