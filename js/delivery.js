// delivery.js — аккордеон с отладкой

function initDeliveryAccordion() {
    console.log('initDeliveryAccordion вызван');
    const items = document.querySelectorAll('.accordion-item');
    console.log('Найдено элементов аккордеона:', items.length);
    
    if (items.length === 0) {
        console.warn('Элементы аккордеона не найдены, повтор через 500ms');
        setTimeout(initDeliveryAccordion, 500);
        return;
    }
    
    items.forEach((item, index) => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        if (!header || !content) {
            console.warn(`Элемент ${index} не имеет header или content`);
            return;
        }
        
        // Удаляем старые обработчики, чтобы не было дублей
        header.removeEventListener('click', header.clickHandler);
        
        // Создаём функцию-обработчик
        const clickHandler = (e) => {
            e.preventDefault();
            console.log(`Клик по заголовку ${index}`);
            
            // Закрыть все остальные
            items.forEach((other, otherIndex) => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                    const otherContent = other.querySelector('.accordion-content');
                    if (otherContent) {
                        otherContent.classList.remove('show');
                        otherContent.style.maxHeight = null;
                    }
                    console.log(`Закрыт элемент ${otherIndex}`);
                }
            });
            
            // Переключить текущий
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                content.classList.remove('show');
                content.style.maxHeight = null;
                console.log('Закрыт текущий');
            } else {
                item.classList.add('active');
                content.classList.add('show');
                // Небольшая задержка для применения класса и расчёта высоты
                setTimeout(() => {
                    const height = content.scrollHeight;
                    content.style.maxHeight = height + 'px';
                    console.log(`Открыт, высота: ${height}px`);
                }, 10);
            }
        };
        
        // Сохраняем обработчик для возможного удаления
        header.clickHandler = clickHandler;
        header.addEventListener('click', clickHandler);
    });
}

// Запускаем после полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');
    initDeliveryAccordion();
});

// После загрузки компонентов (header, footer)
document.addEventListener('componentsLoaded', function() {
    console.log('componentsLoaded');
    initDeliveryAccordion();
});

// Если элементы уже есть в DOM
if (document.querySelector('.product-detail__accordion')) {
    console.log('Элемент product-detail__accordion уже существует');
    initDeliveryAccordion();
}
