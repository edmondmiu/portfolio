// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.getElementById('site-header');
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

    // Mobile menu
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'mobile-menu-button';
    mobileMenuButton.innerHTML = '<span></span><span></span><span></span>';
    
    const nav = document.getElementById('site-navigation-wrap');
    nav.parentNode.insertBefore(mobileMenuButton, nav);

    mobileMenuButton.addEventListener('click', () => {
        const menu = document.querySelector('.main-menu');
        menu.classList.toggle('active');
        mobileMenuButton.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const menu = document.querySelector('.main-menu');
        const mobileButton = document.querySelector('.mobile-menu-button');
        
        if (!menu.contains(e.target) && !mobileButton.contains(e.target)) {
            menu.classList.remove('active');
            mobileButton.classList.remove('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

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
        'images/ugandaLotteryBrand.jpg',
        'images/magazine_moneybookers.jpg',
        'images/itm_v002b-e1612823366160.jpg',
        'images/bdayparty.jpg',
        'images/whiskey.jpg',
        'images/1128businesscards.jpg'
    ];
    let currentGraphicIndex = 0;

    const lightbox = document.getElementById('graphic-lightbox');
    const lightboxImg = document.querySelector('.graphic-lightbox-img');
    const lightboxOverlay = document.querySelector('.graphic-lightbox-overlay');
    const lightboxClose = document.querySelector('.graphic-lightbox-close');
    const lightboxLeft = document.querySelector('.graphic-lightbox-arrow.left');
    const lightboxRight = document.querySelector('.graphic-lightbox-arrow.right');
    const graphicItems = document.querySelectorAll('.graphic-design-item img');

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
}); 