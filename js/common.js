// common.js - общие функции для всех страниц

// Глобальные переменные
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
        setTimeout(initBurger, 200);
        return;
    }

    function closeMenu() {
        menu.classList.remove('header__menu--open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openMenu() {
        menu.classList.add('header__menu--open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    burger.removeEventListener('click', openMenu);
    closeBtn.removeEventListener('click', closeMenu);
    overlay.removeEventListener('click', closeMenu);

    burger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.header__menu-link').forEach(link => {
        link.removeEventListener('click', closeMenu);
        link.addEventListener('click', closeMenu);
    });

    document.removeEventListener('keydown', closeOnEscape);
    document.addEventListener('keydown', closeOnEscape);
    
    function closeOnEscape(e) {
        if (e.key === 'Escape' && menu.classList.contains('header__menu--open')) {
            closeMenu();
        }
    }
}

/* ========== ИЗБРАННОЕ ========== */
function updateFavoriteCount() {
    const countEl = document.querySelector('.header__favorite-count');
    if (countEl) {
        const count = window.favorites.length;
        countEl.textContent = count;
        countEl.setAttribute('data-count', count);
    }
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

    const favModal = document.getElementById('favoriteModal');
    if (favModal && favModal.classList.contains('active')) {
        renderFavoritesModal();
    }
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
        container.innerHTML = '<p style="text-align: center; padding: 40px;">В избранном пока нет товаров</p>';
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
        document.body.style.overflow = 'hidden';
    }
}

function closeFavorites() {
    const overlay = document.getElementById('favoriteOverlay');
    const modal = document.getElementById('favoriteModal');
    if (overlay && modal) {
        overlay.classList.remove('active');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function initFavorites() {
    const favIcon = document.querySelector('.header__icon--favorite');
    const favClose = document.querySelector('.favorite-modal__close');
    const favOverlay = document.getElementById('favoriteOverlay');

    if (favIcon) {
        favIcon.removeEventListener('click', openFavorites);
        favIcon.addEventListener('click', (e) => {
            e.preventDefault();
            openFavorites();
        });
    }
    if (favClose) {
        favClose.removeEventListener('click', closeFavorites);
        favClose.addEventListener('click', closeFavorites);
    }
    if (favOverlay) {
        favOverlay.removeEventListener('click', closeFavorites);
        favOverlay.addEventListener('click', closeFavorites);
    }

    updateFavoriteCount();
}

/* ========== МОДАЛКА КОРЗИНЫ ========== */
function initCart() {
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.querySelector('.cart-modal__close');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartIcon && cartModal) {
        cartIcon.removeEventListener('click', openCart);
        cartIcon.addEventListener('click', openCart);
        
        function openCart(e) {
            e.preventDefault();
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    if (cartClose) {
        cartClose.removeEventListener('click', closeCart);
        cartClose.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.removeEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);
    }
    
    function closeCart() {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ========== МОДАЛКА ПРИВЕТСТВИЯ (только на index.html и 1 раз за сессию) ========== */
let welcomeModalShown = false;

function initWelcomeModal() {
    const isIndexPage = window.location.pathname === '/' || 
                        window.location.pathname === '/index.html' || 
                        window.location.pathname.endsWith('index.html');
    
    if (!isIndexPage || welcomeModalShown) {
        return;
    }
    
    if (document.getElementById('welcomeOverlay')) {
        const welcomeOverlay = document.getElementById('welcomeOverlay');
        const welcomeModal = document.getElementById('welcomeModal');
        
        if (welcomeOverlay && welcomeModal) {
            welcomeModalShown = true;
            setTimeout(() => {
                welcomeOverlay.classList.add('active');
                welcomeModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, 500);
        }
        return;
    }
    
    const welcomeHTML = `
        <div class="welcome-overlay" id="welcomeOverlay"></div>
        <div class="welcome-modal" id="welcomeModal">
            <div class="welcome-modal__inner">
                <button class="welcome-modal__close">&times;</button>
                <div class="welcome-modal__image">
                    <img src="image/Frame_252.png.webp" alt="Welcome">
                </div>
                <h2 class="welcome-modal__title">WELCOME TO THE FAMILY</h2>
                <p class="welcome-modal__description">Подписывайся и будь в курсе закрытой информации:</p>
                <ul class="welcome-modal__list">
                    <li>Новинок</li>
                    <li>Новостей</li>
                    <li>Скидок</li>
                    <li>Розыгрышей</li>
                </ul>
                <a href="https://t.me/+8h0qPRLvvu9hOWIy" target="_blank" class="welcome-modal__button">Подписаться</a>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', welcomeHTML);
    
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const welcomeModal = document.getElementById('welcomeModal');
    const welcomeClose = document.querySelector('.welcome-modal__close');
    
    function closeWelcomeModal() {
        welcomeOverlay.classList.remove('active');
        welcomeModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (welcomeClose) {
        welcomeClose.addEventListener('click', closeWelcomeModal);
    }
    if (welcomeOverlay) {
        welcomeOverlay.addEventListener('click', closeWelcomeModal);
    }
    
    welcomeModalShown = true;
    setTimeout(() => {
        welcomeOverlay.classList.add('active');
        welcomeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 500);
}

/* ========== ИНИЦИАЛИЗАЦИЯ ========== */
function initCommon() {
    initBurger();
    initFavorites();
    initCart();
    initWelcomeModal();
}

document.addEventListener('componentsLoaded', initCommon);
if (document.querySelector('.header')) {
    setTimeout(initCommon, 100);
}
