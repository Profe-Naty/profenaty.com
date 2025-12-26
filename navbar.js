// Cargar el navbar dinámicamente y generar menús desde JSON
document.addEventListener('DOMContentLoaded', function() {
    // Obtener la ruta relativa correcta
    const currentPage = window.location.pathname;
    let navbarPath = 'navbar.html';
    
    // Cargar el navbar
    fetch(navbarPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar navbar: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                navbarContainer.innerHTML = html;
                // Después de cargar el navbar, generar los items dinámicamente
                generarItemsDropdown();
            }
        })
        .catch(error => console.error('Error cargando navbar:', error));
});

// Función para generar items de los dropdowns dinámicamente desde artifacts.json
function generarItemsDropdown() {
    // Primero cargar las categorías fijas
    Promise.all([
        fetch('categories.json').then(r => r.json()),
        fetch('artifacts.json').then(r => r.json())
    ])
    .then(([categoriesData, artifactsData]) => {
        const navbarItems = document.getElementById('navbar-items');
        if (!navbarItems) return;
        
        navbarItems.innerHTML = ''; // Limpiar items existentes
        
        // Iterar sobre las categorías fijas
        categoriesData.categories.forEach(category => {
            // Saltar si la categoría está deshabilitada
            if (category.enabled === false) return;
            
            // Filtrar artefactos que pertenecen a esta categoría Y estén habilitados
            const artefactosDeCategoria = artifactsData.artifacts.filter(
                artifact => artifact.categoria === category.id && artifact.enabled !== false
            );
            
            // Solo crear el dropdown si hay artefactos en esta categoría
            if (artefactosDeCategoria.length === 0) return;
            
            const dropdownId = `${category.id}-dropdown`;
            
            // Crear el elemento del dropdown
            const dropdownLi = document.createElement('li');
            dropdownLi.className = 'nav-item dropdown';
            
            const dropdownToggle = document.createElement('a');
            dropdownToggle.className = 'nav-link dropdown-toggle';
            dropdownToggle.href = '#';
            dropdownToggle.id = dropdownId;
            dropdownToggle.role = 'button';
            dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
            dropdownToggle.setAttribute('aria-expanded', 'false');
            dropdownToggle.textContent = category.displayName;
            
            const dropdownMenu = document.createElement('ul');
            dropdownMenu.className = 'dropdown-menu dropdown-menu-light';
            dropdownMenu.setAttribute('aria-labelledby', dropdownId);
            
            // Agregar items al dropdown
            artefactosDeCategoria.forEach(artifact => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.className = 'dropdown-item';
                a.href = `${artifact.id}.html`;
                a.textContent = artifact.shortName;
                li.appendChild(a);
                dropdownMenu.appendChild(li);
            });
            
            dropdownLi.appendChild(dropdownToggle);
            dropdownLi.appendChild(dropdownMenu);
            navbarItems.appendChild(dropdownLi);
        });
    })
    .catch(error => console.error('Error generando items:', error));
}

