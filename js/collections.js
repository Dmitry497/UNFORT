// collections.js - простая версия для теста

// Ждем загрузки всех компонентов
document.addEventListener('componentsLoaded', function() {
    console.log('Компоненты загружены, запускаем коллекции');
    initCollections();
});

// Если компоненты уже загружены
if (document.querySelector('.header')) {
    initCollections();
}

function initCollections() {
    // Находим кнопки
    const buttons = document.querySelectorAll('.collections-nav__btn');
    const grid = document.getElementById('collections-grid');
    
    console.log('Найдено кнопок:', buttons.length);
    
    if (buttons.length === 0) {
        console.log('Кнопки не найдены, пробуем позже');
        setTimeout(initCollections, 500);
        return;
    }
    
    // Для каждой кнопки добавляем обработчик
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех
            buttons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс нажатой кнопке
            this.classList.add('active');
            
            // Показываем сообщение (для теста)
            const collection = this.dataset.collection;
            grid.innerHTML = `<div class="collections-empty">Коллекция "${collection}" - здесь будут товары</div>`;
            
            console.log('Выбрана коллекция:', collection);
        });
    });
    
    // Скрываем прелоадер
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
}
