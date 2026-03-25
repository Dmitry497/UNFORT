// index.js — только логика главной страницы

/* ========== ПЕРЕМЕННЫЕ ========== */
let categoryTabs, productsGrid, pagination, prevPageBtn, nextPageBtn, pageButtons;
const ITEMS_PER_PAGE = 36;
let currentPage = 1;
let totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

/* ========== РЕНДЕР ========== */
function renderProducts(productsArray) {
    productsGrid.innerHTML = '';
    productsArray.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.dataset.productId = product.id;
        card.dataset.category = product.category;

        card.innerHTML = `
            <a href="product.html?id=${product.id}" class="product-card__link">
                <div class="product-card__image-wrapper">
                    <img src="${product.imgPrimary}" alt="${product.title}" class="product-card__image product-card__image--primary">
                    <img src="${product.imgSecondary}" alt="${product.title} hover" class="product-card__image product-card__image--secondary">
                    <button class="product-card__favorite" aria-label="Добавить в избранное">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
                    ${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ''}
                </div>
                <h3 class="product-card__title">${product.title}</h3>
                <div class="product-card__prices">
                    <span class="product-card__price product-card__price--new">${product.priceNew}</span>
                    ${product.priceOld ? `<span class="product-card__price product-card__price--old">${product.priceOld}</span>` : ''}
                </div>
                <div class="product-card__installment">Долями по ${product.installment}</div>
            </a>
        `;

        if (favorites.includes(product.id)) {
            card.querySelector('.product-card__favorite').classList.add('active');
        }

        productsGrid.appendChild(card);
    });

    document.querySelectorAll('.product-card__favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const productId = card.dataset.productId;
            if (!productId) return;
            toggleFavorite(productId, btn);
        });
    });
}

function renderAllPage(page) {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    renderProducts(products.slice(start, end));
    currentPage = page;
    updatePagination();
    pagination.classList.remove('hidden');
    // Убираем автоскролл - комментарий или удаление этой строки
    // productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderCategory(category) {
    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered);
    pagination.classList.add('hidden');
}

function filterProducts(category) {
    if (category === 'all') renderAllPage(1);
    else renderCategory(category);
}

function updatePagination() {
    pageButtons.forEach(btn => {
        const page = parseInt(btn.dataset.page);
        btn.classList.toggle('active', page === currentPage);
    });
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

/* ========== ИНИЦИАЛИЗАЦИЯ ========== */
function initIndex() {
    categoryTabs = document.querySelectorAll('.category-tab');
    productsGrid = document.getElementById('products-grid');
    pagination = document.getElementById('pagination');
    prevPageBtn = document.getElementById('prevPage');
    nextPageBtn = document.getElementById('nextPage');
    pageButtons = document.querySelectorAll('.pagination__page');

    if (!productsGrid) return;

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterProducts(tab.dataset.category);
        });
    });

    pageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (page !== currentPage) renderAllPage(page);
        });
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) renderAllPage(currentPage - 1);
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) renderAllPage(currentPage + 1);
    });

    filterProducts('all');
}

document.addEventListener('componentsLoaded', initIndex);
if (document.querySelector('.category-tab')) initIndex();
