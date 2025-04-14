// Función para cargar componentes HTML
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Si es el header, inicializar la funcionalidad del navbar después de cargarlo
        if (elementId === 'header') {
            initNavbar();
        }
        
        // Activar el enlace actual en el menú
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('[data-nav]');
        navLinks.forEach(link => {
            const path = link.getAttribute('href');
            if (currentPath === path || (currentPath === '/' && path === '/')) {
                link.classList.add('active');
            }
        });
    } catch (error) {
        console.error(`Error loading component ${elementId}:`, error);
    }
}

// Función para inicializar la funcionalidad del navbar
function initNavbar() {
    const menuBtn = document.querySelector('.menu-btn');
    const navbar = document.querySelector('.navbar');
    
    if (menuBtn && navbar) {
        menuBtn.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace
        navbar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
            });
        });

        // Cambiar navbar al hacer scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Función para manejar el modo oscuro
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Establecer tema inicial
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.toggle('dark-theme');
    } else if (currentTheme === 'light') {
        document.body.classList.toggle('light-theme');
    }
    
    themeToggle?.addEventListener('click', () => {
        let theme = 'light';
        if (!document.body.classList.contains('dark-theme')) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            theme = 'dark';
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }
        localStorage.setItem('theme', theme);
    });
}

// Newsletter Component
async function loadNewsletter() {
    try {
        const response = await fetch('/components/newsletter.html');
        const html = await response.text();
        document.getElementById('newsletter').innerHTML = html;
        initializeNewsletter();
    } catch (error) {
        console.error('Error loading newsletter:', error);
    }
}

function initializeNewsletter() {
    const form = document.querySelector('.newsletter-form');
    const successMessage = document.querySelector('.newsletter-success');
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        try {
            // Aquí iría la lógica para enviar el email al backend
            console.log('Suscripción:', email);
            showNewsletterSuccess();
        } catch (error) {
            console.error('Error en suscripción:', error);
        }
    });
}

function showNewsletterSuccess() {
    const form = document.querySelector('.newsletter-form');
    const success = document.querySelector('.newsletter-success');
    
    if (form && success) {
        form.style.display = 'none';
        success.style.display = 'flex';
    }
}

// Blog Component
async function loadBlogSection() {
    try {
        // Cargar artículos desde el JSON
        const articlesResponse = await fetch('/articles/index.json');
        const data = await articlesResponse.json();
        const articles = data.articles;

        // Renderizar artículos en la grid
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid) {
            blogGrid.innerHTML = articles
                .slice(0, 3) // Mostrar solo los 3 más recientes
                .map(article => `
                    <div class="blog-card">
                        <div class="blog-image">
                            <img src="${article.image}" alt="${article.title}">
                            <div class="blog-category">${article.category}</div>
                        </div>
                        <div class="blog-content">
                            <div class="blog-date">
                                <i class="far fa-calendar"></i> ${formatDate(article.date)}
                            </div>
                            <h3>${article.title}</h3>
                            <p>${article.description}</p>
                            <a href="pages/article.html?id=${article.id}" class="blog-link">
                                Leer artículo <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                `)
                .join('');

            // Agregar event listeners para los enlaces de artículos
            document.querySelectorAll('.blog-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const articleId = new URLSearchParams(link.href.split('?')[1]).get('id');
                    window.location.href = `pages/article.html?id=${articleId}`;
                });
            });
        }
    } catch (error) {
        console.error('Error loading blog section:', error);
    }
}

// Función auxiliar para formatear la fecha
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Función para inicializar los componentes
function initComponents() {
    // Cargar header y footer
    loadComponent('header', '/components/header.html');
    loadComponent('footer', '/components/footer.html');
    
    // Cargar newsletter y blog
    loadNewsletter();
    loadBlogSection();
    
    // Inicializar el toggle de tema después de que el header se haya cargado
    setTimeout(initThemeToggle, 100);
    
    // Actualizar el año en el footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initComponents); 