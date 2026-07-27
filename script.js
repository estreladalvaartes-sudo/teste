// ===== INICIALIZAR AOS =====
AOS.init({
    duration: 800,
    once: false,
    mirror: true,
    offset: 100,
    easing: 'ease-in-out'
});

// ===== BANNER INFINITO =====
document.addEventListener('DOMContentLoaded', function() {
    const bannerInfinito = document.getElementById('bannerInfinito');
    const slidesContainer = document.getElementById('slidesInfinito');

    if (bannerInfinito && slidesContainer) {
        const slides = document.querySelectorAll('.slide-infinito');
        const totalSlides = slides.length;
        const firstClone = slides[0].cloneNode(true);
        slidesContainer.appendChild(firstClone);

        let currentIndex = 0;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        function goToSlide(index, animate = true) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentIndex = index;
            currentTranslate = -index * 100;
            prevTranslate = currentTranslate;
            slidesContainer.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
            slidesContainer.style.transform = `translateX(${currentTranslate}%)`;
        }

        function nextSlide() {
            if (currentIndex === totalSlides - 1) {
                goToSlide(totalSlides, true);
                setTimeout(() => {
                    slidesContainer.style.transition = 'none';
                    goToSlide(0, false);
                }, 500);
            } else {
                goToSlide(currentIndex + 1, true);
            }
        }

        function getX(e) {
            return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        }

        function touchStart(e) {
            isDragging = true;
            startPos = getX(e);
            slidesContainer.style.transition = 'none';
            slidesContainer.classList.add('dragging');
            bannerInfinito.classList.add('dragging');
            document.querySelector('.banner-drag-hint').style.opacity = '0';
        }

        function touchMove(e) {
            if (!isDragging) return;
            currentTranslate = prevTranslate + ((getX(e) - startPos) / bannerInfinito.offsetWidth) * 100;
            slidesContainer.style.transform = `translateX(${currentTranslate}%)`;
        }

        function touchEnd() {
            if (!isDragging) return;
            isDragging = false;
            slidesContainer.classList.remove('dragging');
            bannerInfinito.classList.remove('dragging');

            const moved = currentTranslate - prevTranslate;
            if (Math.abs(moved) > 20) {
                if (moved < 0) {
                    nextSlide();
                } else {
                    if (currentIndex === 0) {
                        goToSlide(totalSlides - 1, true);
                    } else {
                        goToSlide(currentIndex - 1, true);
                    }
                }
            } else {
                goToSlide(currentIndex, true);
            }
            prevTranslate = currentTranslate;
            setTimeout(() => {
                document.querySelector('.banner-drag-hint').style.opacity = '1';
            }, 2000);
        }

        // Eventos mouse
        bannerInfinito.addEventListener('mousedown', touchStart);
        bannerInfinito.addEventListener('mousemove', touchMove);
        bannerInfinito.addEventListener('mouseup', touchEnd);
        bannerInfinito.addEventListener('mouseleave', () => {
            if (isDragging) touchEnd();
        });

        // Eventos touch
        bannerInfinito.addEventListener('touchstart', touchStart, { passive: true });
        bannerInfinito.addEventListener('touchmove', touchMove, { passive: true });
        bannerInfinito.addEventListener('touchend', touchEnd);

        // Prevenir drag nativo
        bannerInfinito.addEventListener('dragstart', e => e.preventDefault());

        // Auto-play
        let autoPlay = setInterval(nextSlide, 5000);
        bannerInfinito.addEventListener('mouseenter', () => clearInterval(autoPlay));
        bannerInfinito.addEventListener('mouseleave', () => {
            if (!isDragging) autoPlay = setInterval(nextSlide, 5000);
        });

        goToSlide(0, false);
    }

    // ===== SERVIÇOS CAROUSEL COM AUTO-PLAY =====
    document.querySelectorAll('[data-carousel]').forEach(container => {
        const slides = container.querySelector('.carousel-slides');
        if (!slides) return;

        const images = slides.querySelectorAll('img');
        const total = images.length;
        const counter = container.querySelector('.slide-counter');
        const progressFill = container.querySelector('.progress-fill');

        let currentIndex = 0;
        let isDragging = false;
        let startX = 0;
        let autoPlayInterval = null;

        function updateUI() {
            if (counter) counter.textContent = `${currentIndex + 1} / ${total}`;
            if (progressFill) progressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;
        }

        function goToSlide(index, animate = true) {
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
            currentIndex = index;
            slides.style.transition = animate ? 'transform 0.5s ease' : 'none';
            slides.style.transform = `translateX(-${currentIndex * (100 / total)}%)`;
            updateUI();
        }

        function nextSlide() {
            if (currentIndex === total - 1) {
                goToSlide(0, true);
            } else {
                goToSlide(currentIndex + 1, true);
            }
        }

        // Iniciar auto-play
        function startAutoPlay() {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextSlide, 3000);
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        // Eventos para pausar ao interagir
        container.addEventListener('mouseenter', stopAutoPlay);
        container.addEventListener('mouseleave', () => {
            if (!isDragging) startAutoPlay();
        });

        // Eventos de arrasto
        container.addEventListener('mousedown', (e) => {
            if (e.target.closest('a, button')) return;
            isDragging = true;
            startX = e.clientX;
            slides.style.transition = 'none';
            container.style.cursor = 'grabbing';
            e.preventDefault();
            stopAutoPlay();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            slides.style.transform = `translateX(${-currentIndex * (100 / total) + ((e.clientX - startX) / container.offsetWidth) * 100}%)`;
        });

        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            container.style.cursor = 'grab';
            slides.style.transition = 'transform 0.5s ease';
            goToSlide(currentIndex);
            startAutoPlay();
        });

        container.addEventListener('touchstart', (e) => {
            if (e.target.closest('a, button')) return;
            isDragging = true;
            startX = e.touches[0].clientX;
            slides.style.transition = 'none';
            stopAutoPlay();
        });

        container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            slides.style.transform = `translateX(${-currentIndex * (100 / total) + ((e.touches[0].clientX - startX) / container.offsetWidth) * 100}%)`;
        });

        container.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            slides.style.transition = 'transform 0.5s ease';
            goToSlide(currentIndex);
            startAutoPlay();
        });

        // Iniciar
        updateUI();
        startAutoPlay();
    });

    // ===== BRINDES =====
    const trackBrinde = document.getElementById('trackBrinde');
    if (trackBrinde) {
        trackBrinde.innerHTML = trackBrinde.innerHTML + trackBrinde.innerHTML + trackBrinde.innerHTML;

        let position = 0;
        let paused = false;

        function animate() {
            if (!paused) {
                position -= 0.6;
                if (position <= -trackBrinde.scrollWidth / 3) position = 0;
                trackBrinde.style.transform = `translateX(${position}px)`;
            }
            requestAnimationFrame(animate);
        }

        const scrollWrapper = document.getElementById('scrollWrapper');

        scrollWrapper?.addEventListener('mouseenter', () => {
            paused = true;
            document.getElementById('statusTexto').textContent = '⏸️ Pausado';
        });

        scrollWrapper?.addEventListener('mouseleave', () => {
            paused = false;
            document.getElementById('statusTexto').textContent = '▶️ Arraste para explorar';
        });

        let isDragging = false;
        let startX = 0;
        let startPos = 0;

        scrollWrapper?.addEventListener('mousedown', (e) => {
            if (e.target.closest('.btn-resgatar')) return;
            isDragging = true;
            paused = true;
            startX = e.clientX;
            startPos = position;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            position = startPos + (e.clientX - startX);
            trackBrinde.style.transform = `translateX(${position}px)`;
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                paused = false;
            }
        });

        scrollWrapper?.addEventListener('touchstart', (e) => {
            if (e.target.closest('.btn-resgatar')) return;
            isDragging = true;
            paused = true;
            startX = e.touches[0].clientX;
            startPos = position;
        });

        scrollWrapper?.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            position = startPos + (e.touches[0].clientX - startX);
            trackBrinde.style.transform = `translateX(${position}px)`;
        });

        scrollWrapper?.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                paused = false;
            }
        });

        animate();

        // Botões de resgate
        document.querySelectorAll('.btn-resgatar').forEach(btn => {
            btn.addEventListener('click', () => {
                window.open('http://play.google.com/store/apps/details?id=com.coffeeincode.postoaki.rede368&hl=pt_BR', '_blank');
            });
        });
    }

    // ===== LUBRIFICANTES =====
    const lubContainer = document.getElementById('lubContainer');
    const lubTrack = document.getElementById('lubTrack');

    if (lubContainer && lubTrack) {
        const products = [
            { nome: 'Mobil Super Sintético 5W30', preco: 'R$ 89,90', precoAntigo: 'R$ 119,90', imagem: 'OLEO/OLEO 01.png' },
            { nome: 'Mobil Super 10W40', preco: 'R$ 79,90', precoAntigo: 'R$ 99,90', imagem: 'OLEO/OLEO 01.png' },
            { nome: 'Mobil Super 15W40', preco: 'R$ 99,90', precoAntigo: 'R$ 129,90', imagem: 'OLEO/OLEO 01.png' },
            { nome: 'Aditivo Motor Mobil', preco: 'R$ 49,90', precoAntigo: 'R$ 69,90', imagem: 'OLEO/OLEO 01.png' },
            { nome: 'Fluído Freio Mobil', preco: 'R$ 39,90', precoAntigo: 'R$ 59,90', imagem: 'OLEO/OLEO 01.png' },
            { nome: 'Mobil Multiuso', preco: 'R$ 29,90', precoAntigo: 'R$ 44,90', imagem: 'OLEO/OLEO 01.png' },
            { nome: 'Graxa Mobil', preco: 'R$ 34,90', precoAntigo: 'R$ 49,90', imagem: 'OLEO/OLEO 01.png' }
        ];

        const html = products.map(p =>
            `<div class="lub-card">
                <div class="lub-imagem-wrapper">
                    <img src="${p.imagem}" alt="${p.nome}" class="lub-imagem-zoom" loading="lazy">
                </div>
                <div class="lub-nome-produto">${p.nome}</div>
                <div class="lub-preco">
                    ${p.precoAntigo ? `<span class="lub-preco-antigo">${p.precoAntigo}</span>` : ''}
                    ${p.preco}
                </div>
            </div>`
        ).join('');

        lubTrack.innerHTML = html + html + html;

        let position = 0;
        let isDragging = false;
        let startX = 0;
        let startPos = 0;
        let paused = false;

        function updatePosition() {
            lubTrack.style.transform = `translateX(${position}px)`;
        }

        function autoScroll() {
            if (!paused && !isDragging) {
                position -= 0.8;
                if (position <= -lubTrack.scrollWidth / 3) position = 0;
                updatePosition();
            }
            requestAnimationFrame(autoScroll);
        }

        lubContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startPos = position;
            lubTrack.style.transition = 'none';
            lubTrack.classList.add('dragging');
            lubContainer.classList.add('dragging');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            position = startPos + (e.clientX - startX);
            updatePosition();
        });

        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            lubTrack.classList.remove('dragging');
            lubContainer.classList.remove('dragging');
            lubTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        lubContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            startPos = position;
            lubTrack.style.transition = 'none';
        });

        lubContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            position = startPos + (e.touches[0].clientX - startX);
            updatePosition();
        });

        lubContainer.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            lubTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        lubContainer.addEventListener('mouseenter', () => paused = true);
        lubContainer.addEventListener('mouseleave', () => {
            if (!isDragging) paused = false;
        });

        autoScroll();
    }

    // ===== PARCEIROS =====
    const parceirosContainer = document.getElementById('parceirosContainer');
    const parceirosTrack = document.getElementById('parceirosTrack');

    if (parceirosContainer && parceirosTrack) {
        const logos = [
            { src: 'LOGOS/BOLOTA.PNG', alt: 'Bolota' },
            { src: 'LOGOS/BRS LOGO.PNG', alt: 'BRS' },
            { src: 'LOGOS/ECONORTE.PNG', alt: 'Econorte' },
            { src: 'LOGOS/HELP PRAGAS.PNG', alt: 'Help Pragas' }
        ];

        const html = logos.map(l =>
            `<div class="logo-card">
                <img src="${l.src}" alt="${l.alt}" loading="lazy">
            </div>`
        ).join('');

        parceirosTrack.innerHTML = html + html + html;

        let position = 0;
        let isDragging = false;
        let startX = 0;
        let startPos = 0;
        let paused = false;

        function updatePosition() {
            parceirosTrack.style.transform = `translateX(${position}px)`;
        }

        function autoScroll() {
            if (!paused && !isDragging) {
                position -= 0.5;
                if (position <= -parceirosTrack.scrollWidth / 3) position = 0;
                updatePosition();
            }
            requestAnimationFrame(autoScroll);
        }

        parceirosContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startPos = position;
            parceirosTrack.style.transition = 'none';
            parceirosTrack.classList.add('dragging');
            parceirosContainer.classList.add('dragging');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            position = startPos + (e.clientX - startX);
            updatePosition();
        });

        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            parceirosTrack.classList.remove('dragging');
            parceirosContainer.classList.remove('dragging');
            parceirosTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        parceirosContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            startPos = position;
            parceirosTrack.style.transition = 'none';
        });

        parceirosContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            position = startPos + (e.touches[0].clientX - startX);
            updatePosition();
        });

        parceirosContainer.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            parceirosTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        parceirosContainer.addEventListener('mouseenter', () => paused = true);
        parceirosContainer.addEventListener('mouseleave', () => {
            if (!isDragging) paused = false;
        });

        autoScroll();
    }
});