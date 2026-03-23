// common.js - общие функции для всех страниц

// Глобальные переменные (делаем их свойствами window для явной глобальности)
window.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
window.productsMap = {};

// Заполняем productsMap из глобального массива products (из data.js)
if (typeof products !== 'undefined') {
    products.forEach(p => { window.productsMap[p.id] = p; });
}

/* ========== БУРГЕР-МЕНЮ ========== */
function initBurger() {
    const burger = document.querySelector('.header__burger');
    const menu = document.querySelector('.header__menu');
    const closeBtn = document.querySelector('.header__menu-close');
    const overlay = document.querySelector('.overlay');

    if (!burger || !menu || !closeBtn || !overlay) {
        console.warn('Burger elements not found, retrying...');
        setTimeout(initBurger, 200);
        return;
    }

    function closeMenu() {
        menu.classList.remove('header__menu--open');
        overlay.classList.remove('active');
    }

    burger.addEventListener('click', () => {
        menu.classList.add('header__menu--open');
        overlay.classList.add('active');
    });

    closeBtn.addEventListener('click', closeMenu);

    document.querySelectorAll('.header__menu-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('header__menu--open')) {
            closeMenu();
        }
    });
}

/* ========== ИЗБРАННОЕ ========== */
function updateFavoriteCount() {
    const countEl = document.querySelector('.header__favorite-count');
    if (countEl) countEl.textContent = window.favorites.length;
    localStorage.setItem('favorites', JSON.stringify(window.favorites));
}

function toggleFavorite(productId, btn) {
    const wasFavorite = window.favorites.includes(productId);

    if (wasFavorite) {
        window.favorites = window.favorites.filter(id => id !== productId);
        if (btn) {
            btn.classList.remove('active');
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('fill', 'none');
        }
    } else {
        window.favorites.push(productId);
        if (btn) {
            btn.classList.add('active');
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('fill', '#ff4d4f');
        }
        const product = window.productsMap[productId];
        if (product) showToast(`${product.title} добавлено в избранное`);
    }
    updateFavoriteCount();
    animateHeart();

    // Если модалка открыта – обновить её
    const favModal = document.getElementById('favoriteModal');
    if (favModal && favModal.classList.contains('active')) {
        renderFavoritesModal();
    }
}

function animateHeart() {
    const heartIcon = document.querySelector('.header__icon--favorite');
    if (!heartIcon) return;
    heartIcon.classList.add('heart-pop');
    setTimeout(() => heartIcon.classList.remove('heart-pop'), 500);
}

/* ========== ТОСТЫ ========== */
function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ========== МОДАЛКА ИЗБРАННОГО ========== */
function renderFavoritesModal() {
    const container = document.querySelector('.favorite-modal__items');
    if (!container) return;

    container.innerHTML = '';
    if (window.favorites.length === 0) {
        container.innerHTML = '<p>В избранном пока нет товаров</p>';
        return;
    }

    window.favorites.forEach(id => {
        const item = window.productsMap[id];
        if (!item) return;
        const el = document.createElement('div');
        el.className = 'favorite-item';
        el.innerHTML = `
            <img src="${item.imgPrimary}" alt="${item.title}" class="favorite-item__image">
            <div class="favorite-item__info">
                <h4 class="favorite-item__title">${item.title}</h4>
                <span class="favorite-item__size">One size</span>
                <span class="favorite-item__price">${item.priceNew}</span>
            </div>
            <button class="favorite-item__remove" data-product-id="${id}">&times;</button>
        `;
        container.appendChild(el);
    });

    document.querySelectorAll('.favorite-item__remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.dataset.productId;
            // Найти кнопку на странице (если есть)
            const cardBtn = document.querySelector(`.product-card[data-product-id="${productId}"] .product-card__favorite`);
            toggleFavorite(productId, cardBtn);
        });
    });
}

function openFavorites() {
    renderFavoritesModal();
    const overlay = document.getElementById('favoriteOverlay');
    const modal = document.getElementById('favoriteModal');
    if (overlay && modal) {
        overlay.classList.add('active');
        modal.classList.add('active');
    }
    const sticked = document.querySelector('.sticked-low');
    if (sticked) sticked.style.display = 'none';
}

function closeFavorites() {
    const overlay = document.getElementById('favoriteOverlay');
    const modal = document.getElementById('favoriteModal');
    if (overlay && modal) {
        overlay.classList.remove('active');
        modal.classList.remove('active');
    }
    const sticked = document.querySelector('.sticked-low');
    if (sticked) sticked.style.display = '';
}

function initFavorites() {
    const favIcon = document.querySelector('.header__icon--favorite');
    const favClose = document.querySelector('.favorite-modal__close');
    const favOverlay = document.getElementById('favoriteOverlay');

    if (favIcon) {
        favIcon.addEventListener('click', (e) => {
            e.preventDefault();
            openFavorites();
        });
    }
    if (favClose) {
        favClose.addEventListener('click', closeFavorites);
    }
    if (favOverlay) {
        favOverlay.addEventListener('click', closeFavorites);
    }

    updateFavoriteCount();
}

/* ========== ИНИЦИАЛИЗАЦИЯ ПОСЛЕ ЗАГРУЗКИ КОМПОНЕНТОВ ========== */
function initCommon() {
    initBurger();
    initFavorites();
}

document.addEventListener('componentsLoaded', initCommon);
if (document.querySelector('.header')) {
    initCommon();
}
