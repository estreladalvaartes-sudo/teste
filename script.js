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

    // ===== CARROSSEL PRINCIPAL - SERVIÇOS =====
    var container = document.getElementById('carouselContainer');
    var track = document.getElementById('carouselTrack');

    if (container && track) {
        var currentIndex = 0;
        var visibleCount = getVisibleCards();
        var maxIndex = Math.max(0, track.children.length - visibleCount);

        var isDragging = false;
        var startX = 0;
        var currentTranslateX = 0;
        var initialTrackOffset = 0;
        var isMoved = false;

        var autoPlayInterval = null;
        var AUTO_INTERVAL_MS = 3500;
        var pauseTimeout = null;

        function getVisibleCards() {
            var containerWidth = container.clientWidth;
            var firstCard = track.querySelector('.service-card-carousel');
            if (!firstCard) return 4;
            var cardStyle = window.getComputedStyle(firstCard);
            var cardWidth = firstCard.offsetWidth + parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
            if (cardWidth === 0) return 4;
            var visible = Math.floor(containerWidth / cardWidth);
            return Math.min(visible, 4);
        }

        function getOffsetForIndex(index) {
            var firstCard = track.querySelector('.service-card-carousel');
            if (!firstCard) return 0;
            var cardStyle = window.getComputedStyle(firstCard);
            var cardWidth = firstCard.offsetWidth + parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
            return -index * cardWidth;
        }

        function setTrackPosition(index, animate) {
            if (animate === undefined) animate = true;
            currentIndex = Math.min(Math.max(0, index), maxIndex);
            var offset = getOffsetForIndex(currentIndex);
            track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
            track.style.transform = 'translateX(' + offset + 'px)';
            currentTranslateX = offset;
        }

        function recalcVisible() {
            var newVisible = getVisibleCards();
            if (newVisible !== visibleCount) {
                visibleCount = newVisible;
                maxIndex = Math.max(0, track.children.length - visibleCount);
                if (currentIndex > maxIndex) currentIndex = maxIndex;
                setTrackPosition(currentIndex, false);
            } else {
                if (currentIndex > maxIndex) {
                    currentIndex = maxIndex;
                    setTrackPosition(currentIndex, false);
                } else {
                    setTrackPosition(currentIndex, false);
                }
            }
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
            var firstCard = track.querySelector('.service-card-carousel');
            if (firstCard) {
                var cardStyle = window.getComputedStyle(firstCard);
                var cardWidth = firstCard.offsetWidth + parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
                var minOffset = getOffsetForIndex(maxIndex);
                var maxOffset = 0;
                newOffset = Math.min(Math.max(newOffset, minOffset), maxOffset);
            }
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

            var firstCard = track.querySelector('.service-card-carousel');
            if (!firstCard) return;
            var cardStyle = window.getComputedStyle(firstCard);
            var cardWidth = firstCard.offsetWidth + parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);

            var approxIndex = -currentTranslateX / cardWidth;
            var targetIndex = Math.round(approxIndex);
            targetIndex = Math.min(Math.max(0, targetIndex), maxIndex);

            var offsetDiff = Math.abs(currentTranslateX - getOffsetForIndex(targetIndex));
            if (offsetDiff < cardWidth * 0.2 && targetIndex === currentIndex) {
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
        maxIndex = Math.max(0, track.children.length - visibleCount);
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

    // ===== MINI CARROSSEIS =====
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
                miniInterval = setInterval(nextImage, 4000);
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

    initMiniCarousels();

    // ===== BRINDES =====
    var trackBrinde = document.getElementById('trackBrinde');
    if (trackBrinde) {
        trackBrinde.innerHTML = trackBrinde.innerHTML + trackBrinde.innerHTML + trackBrinde.innerHTML;

        var position = 0;
        var paused = false;

        function animate() {
            if (!paused) {
                position -= 0.6;
                if (position <= -trackBrinde.scrollWidth / 3) position = 0;
                trackBrinde.style.transform = 'translateX(' + position + 'px)';
            }
            requestAnimationFrame(animate);
        }

        var scrollWrapper = document.getElementById('scrollWrapper');

        if (scrollWrapper) {
            scrollWrapper.addEventListener('mouseenter', function() {
                paused = true;
                document.getElementById('statusTexto').textContent = '⏸️ Pausado';
            });

            scrollWrapper.addEventListener('mouseleave', function() {
                paused = false;
                document.getElementById('statusTexto').textContent = '▶️ Arraste para explorar';
            });
        }

        var isDragging = false;
        var startX = 0;
        var startPos = 0;

        if (scrollWrapper) {
            scrollWrapper.addEventListener('mousedown', function(e) {
                if (e.target.closest('.btn-resgatar')) return;
                isDragging = true;
                paused = true;
                startX = e.clientX;
                startPos = position;
            });
        }

        window.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            position = startPos + (e.clientX - startX);
            trackBrinde.style.transform = 'translateX(' + position + 'px)';
        });

        window.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                paused = false;
            }
        });

        if (scrollWrapper) {
            scrollWrapper.addEventListener('touchstart', function(e) {
                if (e.target.closest('.btn-resgatar')) return;
                isDragging = true;
                paused = true;
                startX = e.touches[0].clientX;
                startPos = position;
            });

            scrollWrapper.addEventListener('touchmove', function(e) {
                if (!isDragging) return;
                position = startPos + (e.touches[0].clientX - startX);
                trackBrinde.style.transform = 'translateX(' + position + 'px)';
            });

            scrollWrapper.addEventListener('touchend', function() {
                if (isDragging) {
                    isDragging = false;
                    paused = false;
                }
            });
        }

        animate();

        document.querySelectorAll('.btn-resgatar').forEach(function(btn) {
            btn.addEventListener('click', function() {
                window.open('http://play.google.com/store/apps/details?id=com.coffeeincode.postoaki.rede368&hl=pt_BR', '_blank');
            });
        });
    }

    // ===== LUBRIFICANTES =====
    var lubContainer = document.getElementById('lubContainer');
    var lubTrack = document.getElementById('lubTrack');

    if (lubContainer && lubTrack) {
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

        lubTrack.innerHTML = html + html + html;

        var position = 0;
        var isDragging = false;
        var startX = 0;
        var startPos = 0;
        var paused = false;

        function updatePosition() {
            lubTrack.style.transform = 'translateX(' + position + 'px)';
        }

        function autoScroll() {
            if (!paused && !isDragging) {
                position -= 0.8;
                if (position <= -lubTrack.scrollWidth / 3) position = 0;
                updatePosition();
            }
            requestAnimationFrame(autoScroll);
        }

        lubContainer.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startPos = position;
            lubTrack.style.transition = 'none';
            lubTrack.classList.add('dragging');
            lubContainer.classList.add('dragging');
        });

        window.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            position = startPos + (e.clientX - startX);
            updatePosition();
        });

        window.addEventListener('mouseup', function() {
            if (!isDragging) return;
            isDragging = false;
            lubTrack.classList.remove('dragging');
            lubContainer.classList.remove('dragging');
            lubTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        lubContainer.addEventListener('touchstart', function(e) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startPos = position;
            lubTrack.style.transition = 'none';
        });

        lubContainer.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            position = startPos + (e.touches[0].clientX - startX);
            updatePosition();
        });

        lubContainer.addEventListener('touchend', function() {
            if (!isDragging) return;
            isDragging = false;
            lubTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        lubContainer.addEventListener('mouseenter', function() { paused = true; });
        lubContainer.addEventListener('mouseleave', function() {
            if (!isDragging) paused = false;
        });

        autoScroll();
    }

    // ===== PARCEIROS =====
    var parceirosContainer = document.getElementById('parceirosContainer');
    var parceirosTrack = document.getElementById('parceirosTrack');

    if (parceirosContainer && parceirosTrack) {
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

        parceirosTrack.innerHTML = html + html + html;

        var position = 0;
        var isDragging = false;
        var startX = 0;
        var startPos = 0;
        var paused = false;

        function updatePosition() {
            parceirosTrack.style.transform = 'translateX(' + position + 'px)';
        }

        function autoScroll() {
            if (!paused && !isDragging) {
                position -= 0.5;
                if (position <= -parceirosTrack.scrollWidth / 3) position = 0;
                updatePosition();
            }
            requestAnimationFrame(autoScroll);
        }

        parceirosContainer.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startPos = position;
            parceirosTrack.style.transition = 'none';
            parceirosTrack.classList.add('dragging');
            parceirosContainer.classList.add('dragging');
        });

        window.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            position = startPos + (e.clientX - startX);
            updatePosition();
        });

        window.addEventListener('mouseup', function() {
            if (!isDragging) return;
            isDragging = false;
            parceirosTrack.classList.remove('dragging');
            parceirosContainer.classList.remove('dragging');
            parceirosTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        parceirosContainer.addEventListener('touchstart', function(e) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startPos = position;
            parceirosTrack.style.transition = 'none';
        });

        parceirosContainer.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            position = startPos + (e.touches[0].clientX - startX);
            updatePosition();
        });

        parceirosContainer.addEventListener('touchend', function() {
            if (!isDragging) return;
            isDragging = false;
            parceirosTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        parceirosContainer.addEventListener('mouseenter', function() { paused = true; });
        parceirosContainer.addEventListener('mouseleave', function() {
            if (!isDragging) paused = false;
        });

        autoScroll();
    }
});