// Cargar artefactos dinámicamente desde JSON
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el ID del artefacto desde el data attribute del body
    const artifactId = document.body.getAttribute('data-artifact');
    
    if (!artifactId) {
        console.warn('No artifact ID provided');
        return;
    }
    
    // Cargar el archivo JSON
    fetch('artifacts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar artifacts.json: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Encontrar el artefacto correspondiente
            const artifact = data.artifacts.find(art => art.id === artifactId);
            
            if (!artifact) {
                console.error(`Artifact ${artifactId} not found in artifacts.json`);
                return;
            }
            
            // Construir la URL del embed
            const embedUrl = `https://claude.site/public/artifacts/${artifact.artifactId}/embed`;
            
            // Encontrar el contenedor del iframe
            const iframeContainer = document.getElementById('artifact-container');
            
            if (iframeContainer) {
                // Generar el iframe con el patrón de Claude
                const iframe = document.createElement('iframe');
                iframe.src = embedUrl;
                iframe.title = artifact.title;
                iframe.width = '100%';
                iframe.height = '600';
                iframe.frameBorder = '0';
                iframe.allow = 'clipboard-write';
                iframe.allowFullscreen = true;
                
                // Limpiar el contenedor y agregar el iframe
                iframeContainer.innerHTML = '';
                iframeContainer.appendChild(iframe);
            }
            
            // Actualizar el título de la página si existe
            const pageTitle = document.querySelector('h2.artifact-title');
            if (pageTitle) {
                pageTitle.innerHTML = `${artifact.emoji} ${artifact.title}`;
            }
            
            // Actualizar la descripción si existe
            const pageDescription = document.querySelector('.artifact-description');
            if (pageDescription) {
                pageDescription.innerHTML = `<small>${artifact.description}</small>`;
            }
        })
        .catch(error => console.error('Error loading artifacts:', error));
});
