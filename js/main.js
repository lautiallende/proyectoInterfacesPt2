document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loader');
    const percent = document.getElementById('loader-percent');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        percent.textContent = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 400);
            }, 400);
        }
    }, 30); // 100 * 50ms = 5000ms = 5s

    const menuButtons = document.querySelectorAll('.notificaciones, .favoritos, .carrito, .menuHamburguesa');

    menuButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (e.target.classList.contains('cerrar-menu')) return;
            e.stopPropagation();
            menuButtons.forEach(b => {
                if (b !== btn) b.classList.remove('show-menu');
            });
            btn.classList.toggle('show-menu');
        });

        const closeBtn = btn.querySelector('.cerrar-menu');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                btn.classList.remove('show-menu');
            });
        }
    });

    // PERFIL: solo abre/cierra al hacer clic en la imagen
    const perfilBtn = document.querySelector('.perfil');
    const perfilImg = perfilBtn.querySelector('.imgHeader');
    perfilImg.addEventListener('click', function(e) {
        e.stopPropagation();
        // Cierra otros menús
        menuButtons.forEach(b => b.classList.remove('show-menu'));
        perfilBtn.classList.toggle('show-menu');
    });
    // Cerrar menú perfil al hacer clic en la X
    const perfilClose = perfilBtn.querySelector('.cerrar-menu');
    if (perfilClose) {
        perfilClose.addEventListener('click', function(e) {
            e.stopPropagation();
            perfilBtn.classList.remove('show-menu');
        });
    }

    // Acción para cerrar sesión
    const cerrarSesionBtn = document.querySelector('.perfil-opcion:last-child');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.location.href = 'login.html';
        });
    }

    // SLIDER
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    let current = 0;
    let sliderInterval;

    function showSlide(idx) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === idx);
        });
        current = idx;
    }

    function nextSlide() {
        showSlide((current + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((current - 1 + slides.length) % slides.length);
    }

    function startSlider() {
        sliderInterval = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
        clearInterval(sliderInterval);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            stopSlider();
            prevSlide();
            startSlider();
        });
        nextBtn.addEventListener('click', function() {
            stopSlider();
            nextSlide();
            startSlider();
        });
    }

    showSlide(0);
    startSlider();

    // Carrusel
    document.querySelectorAll('.carrusel').forEach(carrusel => {
        const track = carrusel.querySelector('.carrusel-track');
        const prev = carrusel.querySelector('.carrusel-arrow.prev');
        const next = carrusel.querySelector('.carrusel-arrow.next');
        let scrollAmount = 0;
        const cardWidth = 174 + 18; // card width + gap

        prev.addEventListener('click', () => {
            track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });

        next.addEventListener('click', () => {
            track.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
    });
    
});
