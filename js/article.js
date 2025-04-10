// Configuración de marked para el resaltado de código
marked.setOptions({
    highlight: function(code, lang) {
        return hljs.highlightAuto(code).value;
    }
});

// Función para obtener parámetros de la URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Función para convertir Markdown a HTML
async function markdownToHtml(markdown) {
    // Usamos marked.js para convertir Markdown a HTML
    return marked.parse(markdown);
}

// Función para cargar el contenido del artículo
async function loadArticle() {
    const articleId = getUrlParameter('id');
    if (!articleId) {
        window.location.href = '/404.html';
        return;
    }

    try {
        // Cargar metadatos del artículo
        const metaResponse = await fetch(`/articles/${articleId}/meta.json`);
        const metadata = await metaResponse.json();

        // Cargar contenido del artículo
        const contentResponse = await fetch(`/articles/${articleId}/content.md`);
        const markdown = await contentResponse.text();
        const content = await markdownToHtml(markdown);

        // Actualizar el contenido de la página
        updateArticlePage(metadata, content);

        // Cargar artículos relacionados
        await loadRelatedArticles(metadata.related);

    } catch (error) {
        console.error('Error loading article:', error);
        window.location.href = '/404.html';
    }
}

// Función para actualizar el contenido de la página
function updateArticlePage(metadata, content) {
    // Actualizar meta tags
    document.title = `${metadata.title} | Nixon López`;
    document.querySelector('meta[name="description"]').content = metadata.description;

    // Actualizar hero section
    const hero = document.querySelector('.article-hero');
    hero.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${metadata.image})`;
    
    // Actualizar contenido del artículo
    const articleContainer = document.querySelector('.article-content');
    articleContainer.innerHTML = `
        <div class="article-header">
            <div class="article-meta">
                <span class="article-category">${metadata.category}</span>
                <span class="article-date">
                    <i class="far fa-calendar"></i> ${new Date(metadata.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span class="article-read-time">
                    <i class="far fa-clock"></i> ${metadata.readTime}
                </span>
            </div>
            <h1>${metadata.title}</h1>
            <div class="article-author">
                <img src="/assets/profile.jpg" alt="${metadata.author}" class="author-image">
                <div class="author-info">
                    <span class="author-name">${metadata.author}</span>
                    <span class="author-role">Developer & Profesor</span>
                </div>
            </div>
        </div>
        <div class="article-body">
            ${content}
        </div>
        <div class="article-tags">
            ${metadata.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
        </div>
    `;

    // Activar syntax highlighting
    Prism.highlightAll();
}

// Función para cargar artículos relacionados
async function loadRelatedArticles(relatedIds) {
    const relatedArticles = await Promise.all(
        relatedIds.map(async (id) => {
            const response = await fetch(`/articles/${id}/meta.json`);
            return response.json();
        })
    );

    const relatedContainer = document.querySelector('.related-articles .row');
    relatedContainer.innerHTML = relatedArticles.map(article => `
        <div class="col-md-6">
            <div class="related-article-card">
                <img src="${article.image}" alt="${article.title}" class="related-article-image">
                <div class="related-article-content">
                    <span class="related-article-category">${article.category}</span>
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <a href="article.html?id=${article.id}" class="read-more">
                        Leer artículo <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    loadArticle();
    
    // Manejar el formulario de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        // Aquí irá la lógica para manejar la suscripción
        console.log('Newsletter subscription:', email);
    });
    
    // Manejar botones de compartir
    document.querySelectorAll('.share-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = window.location.href;
            const title = document.getElementById('article-title').textContent;
            
            switch(true) {
                case link.classList.contains('twitter'):
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
                    break;
                case link.classList.contains('linkedin'):
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
                    break;
                case link.classList.contains('facebook'):
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
                    break;
            }
        });
    });
}); 