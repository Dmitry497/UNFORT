// Функция загрузки HTML-компонентов
async function loadComponent(url, placeholderId) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        document.getElementById(placeholderId).innerHTML = html;
        return true;
    } catch (error) {
        console.error(`Ошибка загрузки компонента ${url}:`, error);
        return false;
    }
}

// Загружаем все компоненты после загрузки страницы
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Загрузка компонентов...');
    
    await Promise.all([
        loadComponent('components/header.html', 'header-placeholder'),
        loadComponent('components/footer.html', 'footer-placeholder'),
        loadComponent('components/modals.html', 'modals-placeholder')
    ]);
    
    console.log('Все компоненты загружены');
    
    // Создаем событие, что все компоненты загружены
    const event = new Event('componentsLoaded');
    document.dispatchEvent(event);
});
