/**
 * script.js - Funcionalidades principales del sitio web
 * Desarrollado por: Nixon López
 * 
 * Contenido:
 * - Animaciones de typing
 * - Filtrado de portfolio
 * - Animaciones de estadísticas
 */

// ======================================
// Inicialización y setup inicial
// ======================================
document.addEventListener('DOMContentLoaded', () => {
    // ======================================
    // Typing Animation for Roles
    // ======================================
    const roles = [
        'Web Developer',
        'IT Teacher',
        'Tech Enthusiast',
        'Entrepreneur'
    ];
    const rolesContainer = document.getElementById('hero-roles');
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;
    let erasingDelay = 50;
    let newTextDelay = 2000;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Borrar caracteres
            let text = currentRole.substring(0, charIndex);
            rolesContainer.innerHTML = `<span class="role">${text}</span><span class="cursor">|</span>`;
            charIndex--;
            
            if (charIndex < 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(type, 500);
                return;
            }
            
            setTimeout(type, erasingDelay);
        } else {
            // Escribir caracteres
            let text = currentRole.substring(0, charIndex);
            rolesContainer.innerHTML = `<span class="role">${text}</span><span class="cursor">|</span>`;
            charIndex++;
            
            if (charIndex > currentRole.length) {
                isDeleting = true;
                setTimeout(type, newTextDelay);
                return;
            }
            
            setTimeout(type, typingDelay);
        }
    }

    // Iniciar la animación con un pequeño delay
    setTimeout(type, 1000);

    // ======================================
    // Portfolio Filter
    // ======================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioGrid = document.querySelector('.portfolio-grid');

    // Configurar el grid inicial
    portfolioGrid.style.opacity = '1';
    portfolioItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        item.style.display = 'block';
    });

    // Función para filtrar los items
    async function filterPortfolio(category) {
        // Ocultar todo el grid con una animación suave
        portfolioGrid.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 300));

        // Filtrar y preparar los items
        portfolioItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            item.style.transition = 'none';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            if (category === 'all' || category === itemCategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        // Forzar reflow
        portfolioGrid.offsetHeight;

        // Mostrar el grid y animar los items visibles
        portfolioGrid.style.opacity = '1';
        portfolioItems.forEach(item => {
            if (item.style.display === 'block') {
                item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    }

    // Event listeners para los botones de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase activa de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase activa al botón clickeado
            button.classList.add('active');
            
            // Filtrar los items
            const filterValue = button.getAttribute('data-filter');
            filterPortfolio(filterValue);
        });
    });

    // Activar el filtro "web" por defecto
    const defaultFilter = document.querySelector('.filter-btn[data-filter="web"]');
    if (defaultFilter) {
        defaultFilter.click();
    }

    // ======================================
    // Stats Counter Animation
    // ======================================
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateStats() {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const counter = setInterval(() => {
                current += increment;
                stat.textContent = Math.floor(current);

                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(counter);
                }
            }, 16);
        });
    }

    // Animate stats when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateStats();
            }
        });
    });

    stats.forEach(stat => observer.observe(stat));
});
