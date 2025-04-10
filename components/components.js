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
        console.error('Error loading component:', error);
    }
}

// Función para inicializar la funcionalidad del navbar
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Toggle menu
    navbarToggler.addEventListener('click', () => {
        const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
        navbarToggler.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            navbarCollapse.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            navbarCollapse.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbarCollapse.classList.remove('show');
            navbarToggler.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Navbar scroll behavior
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Función para manejar el modo oscuro
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    // Establecer tema inicial
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
    
    // Manejar cambio de tema
    themeToggle.addEventListener('click', () => {
        let theme = 'light';
        if (document.documentElement.getAttribute('data-theme') !== 'dark') {
            theme = 'dark';
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        } else {
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        }
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
}

// Función para inicializar los componentes
function initComponents() {
    // Cargar header y footer
    loadComponent('header', '/components/header.html');
    loadComponent('footer', '/components/footer.html');
    
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