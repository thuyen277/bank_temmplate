document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.project-wrapper');
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');
    const cards = document.querySelectorAll('.project-card');
    const visibleCards = 3;
    const totalCards = cards.length;
    const totalSlides = Math.ceil(totalCards / visibleCards);

    let currentSlide = 0;

    // Update slide indicator
    const indicator = document.querySelector('.slide-indicator');
    const slideTrack = document.createElement('div');
    slideTrack.classList.add('slide-track');
    const slideThumb = document.createElement('div');
    slideThumb.classList.add('slide-thumb');
    slideTrack.appendChild(slideThumb);
    indicator.appendChild(slideTrack);

    function updateSlide() {
        wrapper.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;
        updateArrowVisibility();
        updateSlideIndicator();
    }

    function updateArrowVisibility() {
        prevBtn.style.opacity = currentSlide <= 0 ? '0.5' : '1';
        prevBtn.style.pointerEvents = currentSlide <= 0 ? 'none' : 'auto';
        
        nextBtn.style.opacity = currentSlide >= totalSlides - 1 ? '0.5' : '1';
        nextBtn.style.pointerEvents = currentSlide >= totalSlides - 1 ? 'none' : 'auto';
    }

    function updateSlideIndicator() {
        const progress = currentSlide / (totalSlides - 1);
        slideThumb.style.left = `${progress * (100 - 33.333)}%`;
    }

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlide();
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50; // Adjust this value to change swipe sensitivity
        if (touchStartX - touchEndX > swipeThreshold && currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlide();
        } else if (touchEndX - touchStartX > swipeThreshold && currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    }

    // Handle touchpad horizontal scrolling
    let scrollTimeout;
    wrapper.addEventListener('wheel', (e) => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                if (e.deltaX > 0 && currentSlide < totalSlides - 1) {
                    currentSlide++;
                    updateSlide();
                } else if (e.deltaX < 0 && currentSlide > 0) {
                    currentSlide--;
                    updateSlide();
                }
            }
        }, 50); // Adjust this delay to change responsiveness
    }, { passive: false });

    // Initialize
    updateSlide();

    // Handle window resize
    window.addEventListener('resize', updateSlide);
});