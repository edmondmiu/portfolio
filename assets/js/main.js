// Enhanced Component Loading System
document.addEventListener('DOMContentLoaded', () => {
    // Component cache for better performance
    if (!window.componentCache) window.componentCache = {};
    
    const loadComponent = async (path, placeholderId) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;

        try {
            let html;
            
            // Use cache if available
            if (window.componentCache[path]) {
                html = window.componentCache[path];
            } else {
                const response = await fetch(path);
                if (!response.ok) throw new Error(`Failed to fetch ${path} (${response.status})`);
                html = await response.text();
                // Cache for future use
                window.componentCache[path] = html;
            }
            
            const temp = document.createElement('div');
            temp.innerHTML = html.trim();
            
            // Find the actual component element (skip all script tags that Vite might inject)
            const componentElement = Array.from(temp.children)
                .find(child => child.tagName !== 'SCRIPT');
            
            if (componentElement) {
                placeholder.replaceWith(componentElement);
            } else {
                console.warn(`No valid component found in ${path}`);
                placeholder.style.display = 'none';
            }
        } catch (error) {
            console.error(`Component loading failed: ${path}`, error);
            // Graceful fallback - hide placeholder instead of showing error text
            placeholder.style.display = 'none';
        }
    };

    const initializeApp = async () => {
        // Determine the base path for components based on current page location
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment !== '');
        
        // Calculate how many levels to go up to reach root
        let basePath = '/';
        if (pathSegments.length >= 2) {
            // For pages like /pages/projects/linking-products/, we need to go up 3 levels
            const levelsUp = pathSegments.length;
            basePath = '../'.repeat(levelsUp);
        }
        
        await Promise.all([
            loadComponent(`${basePath}components/header.html`, 'header-placeholder'),
            loadComponent(`${basePath}components/footer.html`, 'footer-placeholder')
        ]);

        // --- Post-Component-Load Initializations ---

        // Set dynamic copyright year (with retry logic)
        const setCopyrightYear = () => {
            const yearSpan = document.getElementById('copyright-year');
            if (yearSpan) {
                yearSpan.textContent = new Date().getFullYear();
                return true;
            }
            return false;
        };
        
        // Try immediately, then retry if needed
        if (!setCopyrightYear()) {
            setTimeout(setCopyrightYear, 100);
        }

        // Handle smooth scrolling for on-page anchor links
        document.querySelectorAll('a[href*="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const currentUrl = new URL(window.location.href);
                const targetUrl = new URL(link.href, window.location.href);

                if (currentUrl.pathname === targetUrl.pathname && targetUrl.hash) {
                    e.preventDefault();
                    const targetElement = document.getElementById(targetUrl.hash.substring(1));
                    if (targetElement) {
                        const headerHeight = 56;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // Initialize Lottie animation
        const lottieContainer = document.getElementById('lottie-container');
        if (lottieContainer && !lottieContainer.querySelector('dotlottie-player')) {
            const player = document.createElement('dotlottie-player');
            player.setAttribute('src', `${basePath}assets/images/ui/ed-duck.lottie`);
            player.setAttribute('background', 'transparent');
            player.setAttribute('speed', '1');
            player.setAttribute('style', 'width: 100%; height: 100%');
            player.setAttribute('loop', '');
            player.setAttribute('autoplay', '');
            lottieContainer.appendChild(player);
        }

    // Header scroll effect
        const header = document.querySelector('.site-header');
        if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
        }

    // Mobile menu
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'mobile-menu-button';
    mobileMenuButton.innerHTML = '<span></span><span></span><span></span>';
    
        const nav = document.querySelector('.main-nav');
        if (nav) {
    nav.parentNode.insertBefore(mobileMenuButton, nav);

    mobileMenuButton.addEventListener('click', () => {
                const menu = document.querySelector('.nav-menu');
        menu.classList.toggle('active');
        mobileMenuButton.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
                const menu = document.querySelector('.nav-menu');
        const mobileButton = document.querySelector('.mobile-menu-button');
        
        if (!menu.contains(e.target) && !mobileButton.contains(e.target)) {
            menu.classList.remove('active');
            mobileButton.classList.remove('active');
        }
    });
        }

    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // Initialize Lottie animations
    const lottiePlayers = document.querySelectorAll('dotlottie-player');
    lottiePlayers.forEach(player => {
        player.addEventListener('load', () => {
            player.play();
        });
    });

    // Graphic Design Lightbox Functionality
    const graphicImages = [
            `${basePath}assets/images/graphics/ugandaLotteryBrand.jpg`,
            `${basePath}assets/images/graphics/magazine_moneybookers.jpg`,
            `${basePath}assets/images/graphics/itm_v002b-e1612823366160.jpg`,
            `${basePath}assets/images/graphics/bdayparty.jpg`,
            `${basePath}assets/images/graphics/whiskey.jpg`,
            `${basePath}assets/images/graphics/1128businesscards.jpg`
    ];
    let currentGraphicIndex = 0;

    const lightbox = document.getElementById('graphic-lightbox');
    const lightboxImg = document.querySelector('.graphic-lightbox-img');
    const lightboxOverlay = document.querySelector('.graphic-lightbox-overlay');
    const lightboxClose = document.querySelector('.graphic-lightbox-close');
    const lightboxLeft = document.querySelector('.graphic-lightbox-arrow.left');
    const lightboxRight = document.querySelector('.graphic-lightbox-arrow.right');
    const graphicItems = document.querySelectorAll('.graphic-design-item img');

        if (lightbox && lightboxImg && lightboxOverlay && lightboxClose && lightboxLeft && lightboxRight) {
    function openLightbox(index) {
        currentGraphicIndex = index;
        lightboxImg.src = graphicImages[index];
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }
    function showPrev() {
        currentGraphicIndex = (currentGraphicIndex - 1 + graphicImages.length) % graphicImages.length;
        lightboxImg.src = graphicImages[currentGraphicIndex];
    }
    function showNext() {
        currentGraphicIndex = (currentGraphicIndex + 1) % graphicImages.length;
        lightboxImg.src = graphicImages[currentGraphicIndex];
    }
    graphicItems.forEach((img, idx) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openLightbox(idx));
    });
    lightboxOverlay.addEventListener('click', closeLightbox);
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxLeft.addEventListener('click', showPrev);
    lightboxRight.addEventListener('click', showNext);
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        }
    });
        }
    };

    initializeApp();
}); 