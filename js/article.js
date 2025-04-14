// Configuración de marked para el resaltado de código
marked.setOptions({
    highlight: function(code, lang) {
        return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true
});

// Configuración de highlight.js
hljs.highlightAll();

// Función para obtener parámetros de la URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id')
    };
}

// Función para convertir Markdown a HTML
async function markdownToHtml(markdown) {
    // Usamos marked.js para convertir Markdown a HTML
    return marked.parse(markdown);
}

// Función para cargar el artículo
async function loadArticle() {
    try {
        const { id } = getUrlParams();
        console.log('ID del artículo:', id);
        
        if (!id) {
            throw new Error('No se proporcionó ID de artículo');
        }

        // Cargar el archivo index.json para obtener la lista de artículos
        console.log('Intentando cargar index.json...');
        const response = await fetch('../articles/index.json');
        if (!response.ok) {
            throw new Error(`Error al cargar index.json: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Datos cargados:', data);
        
        // Buscar el artículo por ID
        const article = data.articles.find(art => art.id === id);
        console.log('Artículo encontrado:', article);
        
        if (!article) {
            throw new Error('Artículo no encontrado');
        }

        // Cargar el contenido del artículo
        console.log('Intentando cargar el contenido desde:', article.path);
        const contentResponse = await fetch(`../${article.path}`);
        if (!contentResponse.ok) {
            throw new Error(`Error al cargar el contenido: ${contentResponse.status} ${contentResponse.statusText}`);
        }
        const content = await contentResponse.text();
        console.log('Contenido cargado:', content.substring(0, 100) + '...');

        // Actualizar el contenido del artículo
        updateArticleContent(article, content);
        
        // Cargar artículos relacionados
        loadRelatedArticles(data.articles, article);

    } catch (error) {
        console.error('Error loading article:', error);
        document.querySelector('.article-content').innerHTML = `
            <div class="error-message">
                <h2>Error al cargar el artículo</h2>
                <p>${error.message}</p>
                <a href="../blog.html" class="btn btn-primary">Volver al blog</a>
            </div>
        `;
    }
}

// Función para actualizar el contenido del artículo
function updateArticleContent(article, content) {
    // Actualizar metadatos
    updateMetadata(article);

    // Actualizar contenido principal
    const mainContent = document.querySelector('.article-content');
    if (mainContent) {
        mainContent.innerHTML = marked.parse(content);
    }

    // Actualizar sidebar
    updateSidebar(article);

    // Inicializar resaltado de código
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }
}

// Función para actualizar los metadatos del artículo
function updateMetadata(article) {
    // Actualizar título de la página
    document.title = `${article.title} | Blog`;
    
    // Actualizar hero section
    const hero = document.querySelector('.article-hero');
    if (hero) {
        // Actualizar título
        const title = hero.querySelector('h1');
        if (title) {
            title.textContent = article.title;
        }

        // Actualizar metadatos
        const dateSpan = hero.querySelector('.date span:last-child');
        if (dateSpan) {
            dateSpan.textContent = formatDate(article.date);
        }

        const authorSpan = hero.querySelector('.author span:last-child');
        if (authorSpan) {
            authorSpan.textContent = article.author;
        }

        const readTimeSpan = hero.querySelector('.read-time span:last-child');
        if (readTimeSpan) {
            readTimeSpan.textContent = article.readTime || '5 min';
        }

        // Actualizar categoría
        const category = hero.querySelector('.article-category');
        if (category) {
            category.textContent = article.category;
        }
    }

    // Actualizar tags
    const tags = document.querySelector('.article-tags');
    if (tags) {
        tags.innerHTML = article.tags.map(tag => `
            <a href="/blog.html?tag=${tag}" class="tag">#${tag}</a>
        `).join('');
    }
}

// Función para actualizar el sidebar
function updateSidebar(article) {
    // Generar tabla de contenidos
    const headings = document.querySelectorAll('.article-content h2, .article-content h3');
    const toc = document.querySelector('.table-of-contents');
    if (toc && headings.length > 0) {
        toc.innerHTML = `
            <h3>Tabla de Contenidos</h3>
            <ul>
                ${Array.from(headings).map((heading, index) => `
                    <li>
                        <a href="#${heading.id || `heading-${index}`}">
                            ${heading.textContent}
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    // Configurar botones de compartir
    const shareButtons = document.querySelector('.share-buttons');
    if (shareButtons) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(article.title);
        shareButtons.innerHTML = `
            <a href="https://twitter.com/intent/tweet?url=${url}&text=${title}" 
               class="share-btn twitter" target="_blank">
                <i class="fab fa-twitter"></i>
                Compartir en Twitter
            </a>
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}" 
               class="share-btn linkedin" target="_blank">
                <i class="fab fa-linkedin"></i>
                Compartir en LinkedIn
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" 
               class="share-btn facebook" target="_blank">
                <i class="fab fa-facebook"></i>
                Compartir en Facebook
            </a>
        `;
    }
}

// Función para cargar artículos relacionados
function loadRelatedArticles(articles, currentArticle) {
    const relatedArticles = articles
        .filter(article => 
            article.id !== currentArticle.id && 
            (article.category === currentArticle.category || 
            article.tags.some(tag => currentArticle.tags.includes(tag)))
        )
        .slice(0, 3);

    const relatedGrid = document.querySelector('.related-articles-grid');
    if (relatedGrid) {
        relatedGrid.innerHTML = relatedArticles
            .map(article => `
                <article class="related-article-card">
                    <div class="article-image">
                        <img src="${article.image}" alt="${article.title}">
                        <div class="article-category">${article.category}</div>
                    </div>
                    <div class="article-info">
                        <h3>${article.title}</h3>
                        <p>${article.description}</p>
                        <div class="article-footer">
                            <span class="article-date">${formatDate(article.date)}</span>
                            <a href="article.html?id=${article.id}" class="read-more">Leer más →</a>
                        </div>
                    </div>
                </article>
            `)
            .join('');
    }
}

// Función para formatear la fecha
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Manejar envío de comentarios
document.querySelector('.comment-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        // Aquí iría la lógica para enviar el comentario al backend
        console.log('Comentario enviado:', Object.fromEntries(formData));
        alert('¡Gracias por tu comentario!');
        e.target.reset();
    } catch (error) {
        console.error('Error al enviar el comentario:', error);
        alert('Hubo un error al enviar el comentario. Por favor, intenta de nuevo.');
    }
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    loadArticle();
});

// Copiar código
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const code = btn.closest('.code-block').querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    });
});

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

// Sidebar Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.article-sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarContent = document.querySelector('.sidebar-content');

    // Toggle sidebar on mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            this.innerHTML = sidebar.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992 && 
            !sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target) && 
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Handle comment form submission
    const commentForm = document.querySelector('.comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aquí iría la lógica para enviar el comentario
            showSuccessMessage('Tu comentario ha sido publicado');
            this.reset();
        });
    }

    // Handle suggestion form submission
    const suggestionForm = document.querySelector('.suggestion-form');
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aquí iría la lógica para enviar la sugerencia
            showSuccessMessage('Gracias por tu sugerencia');
            this.reset();
        });
    }

    // Handle comment actions (like, reply)
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('like-btn')) {
                this.classList.toggle('liked');
                const icon = this.querySelector('i');
                const count = this.querySelector('span');
                if (this.classList.contains('liked')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    count.textContent = parseInt(count.textContent) + 1;
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    count.textContent = parseInt(count.textContent) - 1;
                }
            }
        });
    });
});

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Función para generar la tabla de contenidos
async function generateTableOfContents() {
    const article = document.querySelector('.article-content');
    const toc = document.querySelector('.table-of-contents');
    
    if (!article || !toc) return;

    // Esperar a que el contenido del artículo esté cargado
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const headings = article.querySelectorAll('h2, h3');
    if (headings.length === 0) return;

    const ul = document.createElement('ul');
    
    headings.forEach((heading, index) => {
        // Asignar ID único al encabezado si no tiene
        const headingId = heading.id || `heading-${index}`;
        heading.id = headingId;
        
        const li = document.createElement('li');
        li.className = heading.tagName === 'H3' ? 'sub-item' : '';
        
        const a = document.createElement('a');
        a.href = `#${headingId}`;
        a.textContent = heading.textContent;
        
        // Evento de click para scroll suave
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                const headerOffset = 100; // Ajustar según el tamaño de tu header fijo
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Resaltar visualmente la sección actual
                document.querySelectorAll('.table-of-contents a').forEach(link => {
                    link.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });
        
        li.appendChild(a);
        ul.appendChild(li);
    });

    // Limpiar y actualizar la tabla de contenidos
    toc.innerHTML = '<h3>Tabla de Contenidos</h3>';
    toc.appendChild(ul);

    // Observador de intersección para actualizar la tabla de contenidos al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                document.querySelectorAll('.table-of-contents a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-100px 0px -80% 0px'
    });

    headings.forEach(heading => observer.observe(heading));
}

// Función para manejar el formulario de comentarios
function handleCommentForm() {
    const form = document.querySelector('.comment-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Aquí iría la lógica para enviar el comentario
        showNotification('¡Comentario enviado con éxito!');
        form.reset();
    });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Función para manejar el formulario de contacto
function handleContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
        };

        try {
            // Aquí iría la lógica para enviar el formulario a tu backend
            console.log('Datos del formulario:', formData);
            
            // Mostrar mensaje de éxito
            showNotification('¡Mensaje enviado con éxito! Pronto nos pondremos en contacto contigo.');
            
            // Limpiar el formulario
            form.reset();
            
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            showNotification('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.', 'error');
        }
    });
}

// Actualizar la inicialización
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadArticle();
        await generateTableOfContents();
        handleContactForm();
        handleCommentForm();
    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
}); 