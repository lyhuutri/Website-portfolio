/**
 * Website Portfolio - Main JavaScript
 * ====================================
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initHamburgerMenu();
    initBlogSlider();
});

/**
 * Hamburger Menu Module
 * ---------------------
 * Handles mobile menu toggle functionality
 */
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!hamburger || !mobileMenu) return;

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    mobileMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Blog Slider Module
 * ------------------
 * Handles blog cards carousel/slider functionality
 */
function initBlogSlider() {
    const blogSlider = document.getElementById('blogCardsSlider');
    const blogPrevBtn = document.getElementById('blogPrevBtn');
    const blogNextBtn = document.getElementById('blogNextBtn');

    if (!blogSlider || !blogPrevBtn || !blogNextBtn) return;

    const cards = blogSlider.querySelectorAll('.Blog-card');
    const cardWidth = 380; // 360px card + 20px gap
    let currentIndex = 0;
    const totalCards = cards.length;

    /**
     * Update slider position
     * @param {string} direction - 'next' or 'prev'
     */
    function updateSlider(direction) {
        if (direction === 'next') {
            currentIndex++;
            if (currentIndex >= totalCards) {
                currentIndex = 0;
                blogSlider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                blogSlider.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        } else {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = totalCards - 1;
                blogSlider.scrollTo({ left: blogSlider.scrollWidth, behavior: 'smooth' });
            } else {
                blogSlider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            }
        }
    }

    // Button event listeners
    blogPrevBtn.addEventListener('click', function() {
        updateSlider('prev');
    });

    blogNextBtn.addEventListener('click', function() {
        updateSlider('next');
    });

    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    blogSlider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    blogSlider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                updateSlider('next');
            } else {
                updateSlider('prev');
            }
        }
    }

    // Keyboard navigation
    blogSlider.setAttribute('tabindex', '0');
    blogSlider.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            updateSlider('prev');
        } else if (e.key === 'ArrowRight') {
            updateSlider('next');
        }
    });
}

/**
 * Smooth Scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
