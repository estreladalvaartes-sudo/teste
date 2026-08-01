// ===== INICIALIZAR AOS COM CONFIGURAÇÃO OTIMIZADA PARA CELULAR =====
AOS.init({
    duration: 800,
    once: true,
    mirror: false,
    offset: 50,
    easing: 'ease-in-out',
    disable: window.innerWidth < 768 ? true : false
});

// Reativar AOS em telas maiores após redimensionamento
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        if (window.innerWidth >= 768) {
            AOS.init({
                duration: 800,
                once: true,
                mirror: false,
                offset: 50,
                easing: 'ease-in-out',
                disable: false
            });
        }
    }, 250);
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
            slidesContainer.style.transform = 'translateX(' + currentTranslate + '%)';
        }

        function nextSlide() {
            if (currentIndex === totalSlides - 1) {
                goToSlide(totalSlides, true);
                setTimeout(function() {
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
            var hint = document.querySelector('.banner-drag-hint');
            if (hint) hint.style.opacity = '0';
        }

        function touchMove(e) {
            if (!isDragging) return;
            currentTranslate = prevTranslate + ((getX(e) - startPos) / bannerInfinito.offsetWidth) * 100;
            slidesContainer.style.transform = 'translateX(' + currentTranslate + '%)';
        }

        function touchEnd() {
            if (!isDragging) return;
            isDragging = false;
            slidesContainer.classList.remove('dragging');
            bannerInfinito.classList.remove('dragging');

            var moved = currentTranslate - prevTranslate;
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
            setTimeout(function() {
                var hint = document.querySelector('.banner-drag-hint');
                if (hint) hint.style.opacity = '1';
            }, 2000);
        }

        bannerInfinito.addEventListener('mousedown', touchStart);
        bannerInfinito.addEventListener('mousemove', touchMove);
        bannerInfinito.addEventListener('mouseup', touchEnd);
        bannerInfinito.addEventListener('mouseleave', function() {
            if (isDragging) touchEnd();
        });

        bannerInfinito.addEventListener('touchstart', touchStart, { passive: true });
        bannerInfinito.addEventListener('touchmove', touchMove, { passive: true });
        bannerInfinito.addEventListener('touchend', touchEnd);
        bannerInfinito.addEventListener('dragstart', function(e) { e.preventDefault(); });

        var autoPlay = setInterval(nextSlide, 5000);
        bannerInfinito.addEventListener('mouseenter', function() { clearInterval(autoPlay); });
        bannerInfinito.addEventListener('mouseleave', function() {
            if (!isDragging) autoPlay = setInterval(nextSlide, 5000);
        });

        goToSlide(0, false);
    }

    // ================================================================
    // ===== 1. CARROSSEL DE SERVIÇOS - INFINITO =====
    // ================================================================
    function initCarrosselServicos() {
        var container = document.getElementById('carouselContainer');
        var track = document.getElementById('carouselTrack');

        if (!container || !track) return;

        // Duplica os cards para efeito infinito
        var cards = track.innerHTML;
        track.innerHTML = cards + cards + cards;

        var visibleCount = 0;
        var currentIndex = 0;
        var isDragging = false;
        var startX = 0;
        var currentTranslateX = 0;
        var initialTrackOffset = 0;
        var isMoved = false;

        var autoPlayInterval = null;
        var AUTO_INTERVAL_MS = 3500;
        var pauseTimeout = null;

        function getCardWidth() {
            var firstCard = track.querySelector('.service-card-carousel');
            if (!firstCard) return 320;
            var cardStyle = window.getComputedStyle(firstCard);
            return firstCard.offsetWidth + parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
        }

        function getVisibleCards() {
            var containerWidth = container.clientWidth;
            var width = getCardWidth();
            if (width === 0) return 4;
            var visible = Math.floor(containerWidth / width);
            return Math.min(visible, 4);
        }

        function getTotalCards() {
            return track.querySelectorAll('.service-card-carousel').length;
        }

        function getOffsetForIndex(index) {
            var width = getCardWidth();
            return -index * width;
        }

        function setTrackPosition(index, animate) {
            if (animate === undefined) animate = true;
            var total = getTotalCards() / 3;
            var offset = getOffsetForIndex(index);
            
            if (index >= total * 2) {
                track.style.transition = 'none';
                track.style.transform = 'translateX(' + getOffsetForIndex(0) + 'px)';
                currentTranslateX = getOffsetForIndex(0);
                currentIndex = 0;
                setTimeout(function() {
                    track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
                    track.style.transform = 'translateX(' + getOffsetForIndex(0) + 'px)';
                    currentTranslateX = getOffsetForIndex(0);
                }, 10);
                return;
            }
            
            if (index < 0) {
                track.style.transition = 'none';
                track.style.transform = 'translateX(' + getOffsetForIndex(total * 2 - visibleCount) + 'px)';
                currentTranslateX = getOffsetForIndex(total * 2 - visibleCount);
                currentIndex = total * 2 - visibleCount;
                setTimeout(function() {
                    track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
                    track.style.transform = 'translateX(' + getOffsetForIndex(total * 2 - visibleCount) + 'px)';
                    currentTranslateX = getOffsetForIndex(total * 2 - visibleCount);
                }, 10);
                return;
            }

            track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
            track.style.transform = 'translateX(' + offset + 'px)';
            currentTranslateX = offset;
            currentIndex = index;
        }

        function recalcVisible() {
            visibleCount = getVisibleCards();
            var total = getTotalCards() / 3;
            var maxIndex = total * 2 - visibleCount;
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            setTrackPosition(currentIndex, false);
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(function() {
                if (document.hidden) return;
                goToNext();
            }, AUTO_INTERVAL_MS);
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        function pauseAutoPlayTemporarily() {
            stopAutoPlay();
            if (pauseTimeout) clearTimeout(pauseTimeout);
            pauseTimeout = setTimeout(function() {
                startAutoPlay();
                pauseTimeout = null;
            }, 6000);
        }

        function goToNext() {
            var total = getTotalCards() / 3;
            var maxIndex = total * 2 - visibleCount;
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            setTrackPosition(currentIndex, true);
            pauseAutoPlayTemporarily();
        }

        function onDragStart(e) {
            if (e.button !== undefined && e.button !== 0) return;
            e.preventDefault();

            var clientX = e.clientX || (e.touches && e.touches[0].clientX);
            if (clientX === undefined) return;

            isDragging = true;
            isMoved = false;
            startX = clientX;
            initialTrackOffset = currentTranslateX;

            track.classList.add('dragging');
            container.style.cursor = 'grabbing';
            track.style.transition = 'none';

            document.addEventListener('mousemove', onDragMove);
            document.addEventListener('mouseup', onDragEnd);
            document.addEventListener('touchmove', onDragMove, { passive: false });
            document.addEventListener('touchend', onDragEnd);
            document.addEventListener('touchcancel', onDragEnd);
        }

        function onDragMove(e) {
            if (!isDragging) return;
            e.preventDefault();

            var clientX = e.clientX || (e.touches && e.touches[0].clientX);
            if (clientX === undefined) return;

            var deltaX = clientX - startX;
            if (Math.abs(deltaX) > 5) isMoved = true;

            var newOffset = initialTrackOffset + deltaX;
            var width = getCardWidth();
            var total = getTotalCards() / 3;
            var minOffset = getOffsetForIndex(total * 2 - visibleCount);
            var maxOffset = getOffsetForIndex(0);
            newOffset = Math.min(Math.max(newOffset, minOffset), maxOffset);
            track.style.transform = 'translateX(' + newOffset + 'px)';
            currentTranslateX = newOffset;
        }

        function onDragEnd(e) {
            if (!isDragging) {
                cleanupDragEvents();
                return;
            }

            isDragging = false;
            track.classList.remove('dragging');
            container.style.cursor = 'grab';
            cleanupDragEvents();

            if (!isMoved) {
                setTrackPosition(currentIndex, true);
                return;
            }

            var width = getCardWidth();
            var approxIndex = -currentTranslateX / width;
            var targetIndex = Math.round(approxIndex);
            var total = getTotalCards() / 3;
            targetIndex = Math.min(Math.max(0, targetIndex), total * 2 - visibleCount);

            var offsetDiff = Math.abs(currentTranslateX - getOffsetForIndex(targetIndex));
            if (offsetDiff < width * 0.2 && targetIndex === currentIndex) {
                setTrackPosition(currentIndex, true);
            } else {
                currentIndex = targetIndex;
                setTrackPosition(currentIndex, true);
                pauseAutoPlayTemporarily();
            }
        }

        function cleanupDragEvents() {
            document.removeEventListener('mousemove', onDragMove);
            document.removeEventListener('mouseup', onDragEnd);
            document.removeEventListener('touchmove', onDragMove);
            document.removeEventListener('touchend', onDragEnd);
            document.removeEventListener('touchcancel', onDragEnd);
        }

        var resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() { recalcVisible(); }, 100);
        });

        // Inicializa
        visibleCount = getVisibleCards();
        currentIndex = 0;
        setTrackPosition(0, false);

        container.addEventListener('mousedown', onDragStart);
        container.addEventListener('touchstart', onDragStart, { passive: false });
        container.style.cursor = 'grab';

        container.addEventListener('mouseenter', function() { stopAutoPlay(); });
        container.addEventListener('mouseleave', function() {
            if (!pauseTimeout) startAutoPlay();
        });
        container.addEventListener('touchstart', function() { stopAutoPlay(); }, { passive: true });
        container.addEventListener('touchend', function() { pauseAutoPlayTemporarily(); }, { passive: true });

        startAutoPlay();

        window.addEventListener('load', function() {
            setTimeout(function() { recalcVisible(); }, 200);
        });

        window.addEventListener('beforeunload', function() {
            stopAutoPlay();
            if (pauseTimeout) clearTimeout(pauseTimeout);
            cleanupDragEvents();
        });
    }

    // ================================================================
    // ===== 2. CARROSSEL DE BRINDES - INFINITO =====
    // ================================================================
    function initCarrosselBrindes() {
        var container = document.getElementById('scrollWrapper');
        var track = document.getElementById('trackBrinde');

        if (!container || !track) return;

        // Duplica os cards para efeito infinito
        var cards = track.innerHTML;
        track.innerHTML = cards + cards + cards;

        var position = 0;
        var isDragging = false;
        var startX = 0;
        var startPos = 0;
        var paused = false;
        var autoInterval = null;
        var AUTO_INTERVAL_MS = 20;
        var SPEED = 0.3;

        function getCardWidth() {
            var firstCard = track.querySelector('.card-brinde');
            if (!firstCard) return 250;
            return firstCard.offsetWidth + 20; // 20 é o gap
        }

        function getTotalWidth() {
            return track.scrollWidth / 3;
        }

        function moveTrack() {
            if (!paused && !isDragging) {
                position -= SPEED;
                if (position <= -getTotalWidth()) {
                    position = 0;
                }
                track.style.transform = 'translateX(' + position + 'px)';
            }
        }

        function startAuto() {
            stopAuto();
            autoInterval = setInterval(moveTrack, AUTO_INTERVAL_MS);
        }

        function stopAuto() {
            if (autoInterval) {
                clearInterval(autoInterval);
                autoInterval = null;
            }
        }

        function onDragStart(e) {
            if (e.target.closest('.btn-resgatar')) return;
            isDragging = true;
            paused = true;
            var clientX = e.clientX || (e.touches && e.touches[0].clientX);
            startX = clientX;
            startPos = position;
            stopAuto();
            document.getElementById('statusTexto').textContent = '⏸️ Pausado';
        }

        function onDragMove(e) {
            if (!isDragging) return;
            var clientX = e.clientX || (e.touches && e.touches[0].clientX);
            position = startPos + (clientX - startX);
            if (position > 0) position = 0;
            if (position < -getTotalWidth()) position = -getTotalWidth();
            track.style.transform = 'translateX(' + position + 'px)';
        }

        function onDragEnd() {
            if (!isDragging) return;
            isDragging = false;
            paused = false;
            document.getElementById('statusTexto').textContent = '▶️ Arraste para explorar';
            startAuto();
        }

        container.addEventListener('mousedown', onDragStart);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);

        container.addEventListener('touchstart', onDragStart, { passive: true });
        window.addEventListener('touchmove', onDragMove, { passive: true });
        window.addEventListener('touchend', onDragEnd);

        container.addEventListener('mouseenter', function() { 
            paused = true; 
            stopAuto(); 
            document.getElementById('statusTexto').textContent = '⏸️ Pausado';
        });
        
        container.addEventListener('mouseleave', function() {
            if (!isDragging) {
                paused = false;
                document.getElementById('statusTexto').textContent = '▶️ Arraste para explorar';
                startAuto();
            }
        });

        startAuto();

        document.querySelectorAll('.btn-resgatar').forEach(function(btn) {
            btn.addEventListener('click', function() {
                window.open('http://play.google.com/store/apps/details?id=com.coffeeincode.postoaki.rede368&hl=pt_BR', '_blank');
            });
        });
    }

    // ================================================================
    // ===== 3. CARROSSEL DE LUBRIFICANTES - INFINITO =====
    // ================================================================
    function initCarrosselLubrificantes() {
        var container = document.getElementById('lubContainer');
        var track = document.getElementById('lubTrack');

        if (!container || !track) return;

        var products = [
            { nome: 'Mobil Super Sintético 5W30', preco: 'R$ 89,90', precoAntigo: 'R$ 119,90', imagem: 'OLEO/OLEO 01.png' },
            { nome: 'Mobil Super 10W40', preco: 'R$ 79,90', precoAntigo: 'R$ 99,90', imagem: 'OLEO/OLEO 01.png' },
            { nome: 'Mobil Super 15W40', preco: 'R$ 99,90', precoAntigo: 'R$ 129,90', imagem: 'OLEO/OLEO 01.png' },
            { nome: 'Aditivo Motor Mobil', preco: 'R$ 49,90', precoAntigo: 'R$ 69,90', imagem: 'OLEO/OLEO 01.png' },
            { nome: 'Fluído Freio Mobil', preco: 'R$ 39,90', precoAntigo: 'R$ 59,90', imagem: 'OLEO/OLEO 01.png' },
            { nome: 'Mobil Multiuso', preco: 'R$ 29,90', precoAntigo: 'R$ 44,90', imagem: 'OLEO/OLEO 01.png' },
            { nome: 'Graxa Mobil', preco: 'R$ 34,90', precoAntigo: 'R$ 49,90', imagem: 'OLEO/OLEO 01.png' }
        ];

        var html = products.map(function(p) {
            return '<div class="lub-card">' +
                '<div class="lub-imagem-wrapper">' +
                '<img src="' + p.imagem + '" alt="' + p.nome + '" class="lub-imagem-zoom" loading="lazy">' +
                '</div>' +
                '<div class="lub-nome-produto">' + p.nome + '</div>' +
                '<div class="lub-preco">' +
                (p.precoAntigo ? '<span class="lub-preco-antigo">' + p.precoAntigo + '</span>' : '') +
                p.preco +
                '</div>' +
                '</div>';
        }).join('');

        // Duplica para efeito infinito
        track.innerHTML = html + html + html;

        var position = 0;
        var isDragging = false;
        var startX = 0;
        var startPos = 0;
        var paused = false;
        var autoInterval = null;
        var AUTO_INTERVAL_MS = 20;
        var SPEED = 0.4;

        function getCardWidth() {
            var firstCard = track.querySelector('.lub-card');
            if (!firstCard) return 200;
            return firstCard.offsetWidth + 24; // 24 é o gap (1.5rem)
        }

        function getTotalWidth() {
            return track.scrollWidth / 3;
        }

        function moveTrack() {
            if (!paused && !isDragging) {
                position -= SPEED;
                if (position <= -getTotalWidth()) {
                    position = 0;
                }
                track.style.transform = 'translateX(' + position + 'px)';
            }
        }

        function startAuto() {
            stopAuto();
            autoInterval = setInterval(moveTrack, AUTO_INTERVAL_MS);
        }

        function stopAuto() {
            if (autoInterval) {
                clearInterval(autoInterval);
                autoInterval = null;
            }
        }

        function onDragStart(e) {
            isDragging = true;
            paused = true;
            var clientX = e.clientX || (e.touches && e.touches[0].clientX);
            startX = clientX;
            startPos = position;
            stopAuto();
            track.style.transition = 'none';
            track.classList.add('dragging');
            container.classList.add('dragging');
        }

        function onDragMove(e) {
            if (!isDragging) return;
            var clientX = e.clientX || (e.touches && e.touches[0].clientX);
            position = startPos + (clientX - startX);
            if (position > 0) position = 0;
            if (position < -getTotalWidth()) position = -getTotalWidth();
            track.style.transform = 'translateX(' + position + 'px)';
        }

        function onDragEnd() {
            if (!isDragging) return;
            isDragging = false;
            paused = false;
            track.classList.remove('dragging');
            container.classList.remove('dragging');
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            startAuto();
        }

        container.addEventListener('mousedown', onDragStart);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);

        container.addEventListener('touchstart', onDragStart, { passive: true });
        window.addEventListener('touchmove', onDragMove, { passive: true });
        window.addEventListener('touchend', onDragEnd);

        container.addEventListener('mouseenter', function() { 
            paused = true; 
            stopAuto(); 
        });
        
        container.addEventListener('mouseleave', function() {
            if (!isDragging) {
                paused = false;
                startAuto();
            }
        });

        startAuto();
    }

    // ================================================================
    // ===== 4. CARROSSEL DE PARCEIROS - INFINITO =====
    // ================================================================
    function initCarrosselParceiros() {
        var container = document.getElementById('parceirosContainer');
        var track = document.getElementById('parceirosTrack');

        if (!container || !track) return;

        var logos = [
            { src: 'LOGOS/BOLOTA.PNG', alt: 'Bolota' },
            { src: 'LOGOS/BRS LOGO.PNG', alt: 'BRS' },
            { src: 'LOGOS/ECONORTE.PNG', alt: 'Econorte' },
            { src: 'LOGOS/HELP PRAGAS.PNG', alt: 'Help Pragas' }
        ];

        var html = logos.map(function(l) {
            return '<div class="logo-card">' +
                '<img src="' + l.src + '" alt="' + l.alt + '" loading="lazy">' +
                '</div>';
        }).join('');

        // Duplica para efeito infinito
        track.innerHTML = html + html + html;

        var position = 0;
        var isDragging = false;
        var startX = 0;
        var startPos = 0;
        var paused = false;
        var autoInterval = null;
        var AUTO_INTERVAL_MS = 20;
        var SPEED = 0.25;

        function getCardWidth() {
            var firstCard = track.querySelector('.logo-card');
            if (!firstCard) return 150;
            return firstCard.offsetWidth + 32; // 32 é o gap (2rem)
        }

        function getTotalWidth() {
            return track.scrollWidth / 3;
        }

        function moveTrack() {
            if (!paused && !isDragging) {
                position -= SPEED;
                if (position <= -getTotalWidth()) {
                    position = 0;
                }
                track.style.transform = 'translateX(' + position + 'px)';
            }
        }

        function startAuto() {
            stopAuto();
            autoInterval = setInterval(moveTrack, AUTO_INTERVAL_MS);
        }

        function stopAuto() {
            if (autoInterval) {
                clearInterval(autoInterval);
                autoInterval = null;
            }
        }

        function onDragStart(e) {
            isDragging = true;
            paused = true;
            var clientX = e.clientX || (e.touches && e.touches[0].clientX);
            startX = clientX;
            startPos = position;
            stopAuto();
            track.style.transition = 'none';
            track.classList.add('dragging');
            container.classList.add('dragging');
        }

        function onDragMove(e) {
            if (!isDragging) return;
            var clientX = e.clientX || (e.touches && e.touches[0].clientX);
            position = startPos + (clientX - startX);
            if (position > 0) position = 0;
            if (position < -getTotalWidth()) position = -getTotalWidth();
            track.style.transform = 'translateX(' + position + 'px)';
        }

        function onDragEnd() {
            if (!isDragging) return;
            isDragging = false;
            paused = false;
            track.classList.remove('dragging');
            container.classList.remove('dragging');
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            startAuto();
        }

        container.addEventListener('mousedown', onDragStart);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);

        container.addEventListener('touchstart', onDragStart, { passive: true });
        window.addEventListener('touchmove', onDragMove, { passive: true });
        window.addEventListener('touchend', onDragEnd);

        container.addEventListener('mouseenter', function() { 
            paused = true; 
            stopAuto(); 
        });
        
        container.addEventListener('mouseleave', function() {
            if (!isDragging) {
                paused = false;
                startAuto();
            }
        });

        startAuto();
    }

    // ================================================================
    // ===== MINI CARROSSEIS (DENTRO DOS CARDS) - INFINITO =====
    // ================================================================
    function initMiniCarousels() {
        var miniCarousels = document.querySelectorAll('.mini-carousel');

        miniCarousels.forEach(function(carousel, idx) {
            var track = carousel.querySelector('.mini-track');
            var dots = document.querySelectorAll('.mini-dots[data-mini-dots="' + idx + '"] .mini-dot');
            var total = track.querySelectorAll('img').length;
            var current = 0;
            var miniInterval = null;

            function goTo(index) {
                if (index >= total) index = 0;
                if (index < 0) index = total - 1;
                current = index;
                track.style.transform = 'translateX(-' + current * 100 + '%)';

                dots.forEach(function(dot, i) {
                    dot.classList.toggle('active', i === current);
                });
            }

            function nextImage() {
                goTo(current + 1);
            }

            function startMiniAuto() {
                stopMiniAuto();
                miniInterval = setInterval(nextImage, 20000);
            }

            function stopMiniAuto() {
                if (miniInterval) {
                    clearInterval(miniInterval);
                    miniInterval = null;
                }
            }

            dots.forEach(function(dot, i) {
                dot.addEventListener('click', function(e) {
                    e.stopPropagation();
                    stopMiniAuto();
                    goTo(i);
                    setTimeout(startMiniAuto, 4000);
                });
            });

            goTo(0);
            startMiniAuto();
        });
    }

    // ================================================================
    // ===== INICIALIZAR TODOS OS CARROSSÉIS =====
    // ================================================================
    
    // Aguarda o DOM carregar completamente
    setTimeout(function() {
        // 1. Serviços
        initCarrosselServicos();
        
        // 2. Brindes
        initCarrosselBrindes();
        
        // 3. Lubrificantes
        initCarrosselLubrificantes();
        
        // 4. Parceiros
        initCarrosselParceiros();
        
        // 5. Mini Carrosséis
        initMiniCarousels();
    }, 100);
});