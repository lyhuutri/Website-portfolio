/**
 * Website Portfolio - Main JavaScript
 * ====================================
 */

// Initialize loading screen immediately
initLoadingScreen();

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initHamburgerMenu();
    initBlogSlider();
    initEncryptEffect();
});

/**
 * Encrypt Text Effect Module
 * --------------------------
 * Creates scrambled text effect on button hover
 */
function initEncryptEffect() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    const buttons = document.querySelectorAll('.Button span, .Button-icon .Phone-Number');

    buttons.forEach(function(element) {
        const originalText = element.textContent;
        let interval = null;

        element.parentElement.addEventListener('mouseenter', function() {
            let iteration = 0;
            const textLength = originalText.length;

            clearInterval(interval);

            interval = setInterval(function() {
                element.textContent = originalText
                    .split('')
                    .map(function(char, index) {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        if (char === ' ') return ' ';
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iteration >= textLength) {
                    clearInterval(interval);
                }

                iteration += 1 / 2;
            }, 30);
        });

        element.parentElement.addEventListener('mouseleave', function() {
            clearInterval(interval);
            element.textContent = originalText;
        });
    });
}

/**
 * Loading Screen Module
 * ---------------------
 * Creates grid cells that fade out randomly
 */
function initLoadingScreen() {
    const loadingGrid = document.getElementById('loadingGrid');
    const loadingScreen = document.getElementById('loadingScreen');

    if (!loadingGrid || !loadingScreen) return;

    // Calculate cells based on screen size (100px minimum cell size)
    const cellSize = 100;
    const cols = Math.ceil(window.innerWidth / cellSize);
    const rows = Math.ceil(window.innerHeight / cellSize);
    const totalCells = cols * rows;
    const totalDuration = 1000; // 1 second

    // Set grid columns
    loadingGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    // Create grid cells
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'loading-cell';
        cell.dataset.index = i;
        loadingGrid.appendChild(cell);
    }

    // Get all cells and shuffle their order
    const cells = Array.from(loadingGrid.querySelectorAll('.loading-cell'));
    const shuffledIndices = shuffleArray([...Array(totalCells).keys()]);

    // Calculate delay between each cell disappearing
    const delayBetweenCells = (totalDuration - 300) / totalCells;

    // Fade out cells randomly
    shuffledIndices.forEach((index, i) => {
        setTimeout(() => {
            cells[index].classList.add('fade-out');
        }, i * delayBetweenCells);
    });

    // Hide loading screen after all animations complete
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, totalDuration);
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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
