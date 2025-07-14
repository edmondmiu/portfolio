// Gallery functionality with Isotope masonry layout and lightbox
class Gallery {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.galleryGrid = document.querySelector('.gallery-grid');
        this.isotope = null;
        
        this.init();
    }
    
    async init() {
        try {
            console.log('Initializing gallery with Isotope...');
            await this.loadImages();
            this.renderGallery();
            this.setupEventListeners();
            console.log('Gallery initialization complete');
        } catch (error) {
            console.error('Error initializing gallery:', error);
        }
    }
    
    async loadImages() {
        // Auto-detect all images in the gallery folder - using original order from the website
        const imageFiles = [
            'FullSizeRender.jpg',
            '20080407195043_20070913-img_1306-edit.jpg',
            '20080429071738_20080426-img_5018.jpg',
            '20071119011307_img_2748.jpg',
            '20080228232159_img_2718.jpg',
            'DSCF1259.jpg',
            'IMG_3808.jpg',
            'IMG_4266.jpg',
            '20070917012151_20070913-img_1221.jpg',
            '20070917013446_20070812-img_8751.jpg',
            '20081223-20081223-img_0438.jpg',
            '20070531232816_20070531-img_6580-edit.jpg',
            '20070528005203_20070505-img_5132.jpg',
            '20070602000512_20070519-img_6172.jpg',
            '20070924225511_20070912-img_1208.jpg',
            '20071104041654_20070913-20070913-img_1477-2.jpg',
            '20080222190212__mg_4524.jpg',
            '20080720-img_7955.jpg',
            '20071025031228_20070913-img_1442.jpg',
            '20080315004040_20070911-img_0747-edit.jpg',
            'IMG_2916.jpg',
            'IMG_6136.jpg',
            'IMG_6355.jpg',
            '20081012-20081013-img_9835.jpg',
            '20090810-20090810-img_2514.jpg',
            'IMG_3886.jpg',
            '20080104-_mg_3895-2.jpg',
            'IMG_4916.jpg',
            '20070917010024_20070322-img_3554.jpg',
            '20071121030617_img_2701-edit.jpg',
            '20080504233212_20080426-untitled_panorama1.jpg',
            'DSCF0400.jpg',
            '20070917010751_20070816-img_9098.jpg',
            '20070917010241_20070725-img_7823-edit.jpg',
            '20070929013506_20070913-img_1269.jpg',
            'IMG_4350-Edit.jpg',
            '20080222185844__mg_4369.jpg',
            '20070917010146_20070505-img_4856.jpg',
            '20070917010940_20070825-img_9553.jpg',
            '20071113024747_20070913-img_1341_edit.jpg'
        ];
        
        // Create image objects with proper paths and alt text
        this.images = imageFiles.map(filename => {
            const name = filename.replace('.jpg', '');
            return {
                src: `/assets/images/gallery/${filename}`,
                alt: this.generateAltText(name),
                filename: name
            };
        });
    }
    
    generateAltText(filename) {
        // Generate meaningful alt text from filename
        if (filename.includes('IMG_')) {
            return `Photograph ${filename}`;
        } else if (filename.includes('DSCF')) {
            return `Photograph ${filename}`;
        } else if (filename.includes('FullSizeRender')) {
            return 'Full Size Render';
        } else {
            // Extract date and create descriptive alt text
            const dateMatch = filename.match(/(\d{4})(\d{2})(\d{2})/);
            if (dateMatch) {
                const year = dateMatch[1];
                const month = dateMatch[2];
                const day = dateMatch[3];
                return `Photograph from ${month}/${day}/${year}`;
            }
            return `Photograph ${filename}`;
        }
    }
    
    renderGallery() {
        this.galleryGrid.innerHTML = '';
        
        this.images.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.index = index;
            
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            
            // Add error handling for low-resolution images
            img.onerror = () => {
                console.warn(`Failed to load image: ${image.src}`);
                item.classList.add('error');
            };
            
            img.onload = () => {
                console.log(`Image loaded: ${image.src}`);
                // Check if image is low resolution and apply enhancement
                this.enhanceLowResImage(img);
            };
            
            item.appendChild(img);
            this.galleryGrid.appendChild(item);
        });
        
        // Initialize Isotope after all images are rendered
        setTimeout(() => {
            this.initIsotope();
        }, 100);
    }
    
    initIsotope() {
        console.log('Initializing Isotope...');
        
        try {
            // Initialize Isotope with masonry layout
            this.isotope = new Isotope(this.galleryGrid, {
                itemSelector: '.gallery-item',
                masonry: {
                    columnWidth: '.gallery-item',
                    gutter: 20
                },
                percentPosition: true
            });
            
            console.log('Isotope initialized, items count:', this.galleryGrid.children.length);
            
            // Layout Isotope after all images are loaded
            imagesLoaded(this.galleryGrid).on('progress', (instance, image) => {
                console.log('Image loaded in imagesLoaded:', image.img.src);
                this.isotope.layout();
            }).on('done', () => {
                console.log('All images loaded, final layout');
                this.isotope.layout();
                
                // Debug: check if items are positioned
                const items = this.galleryGrid.querySelectorAll('.gallery-item');
                console.log('Items after layout:', items.length);
                items.forEach((item, index) => {
                    const rect = item.getBoundingClientRect();
                    console.log(`Item ${index}:`, {
                        visible: rect.width > 0 && rect.height > 0,
                        width: rect.width,
                        height: rect.height,
                        top: rect.top,
                        left: rect.left
                    });
                });
            });
            
            // Fallback: if items are not visible after 2 seconds, force a simple layout
            setTimeout(() => {
                const items = this.galleryGrid.querySelectorAll('.gallery-item');
                const visibleItems = Array.from(items).filter(item => {
                    const rect = item.getBoundingClientRect();
                    return rect.width > 0 && rect.height > 0;
                });
                
                if (visibleItems.length === 0) {
                    console.log('No visible items detected, applying fallback layout');
                    this.galleryGrid.style.display = 'grid';
                    this.galleryGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                    this.galleryGrid.style.gap = '20px';
                    this.galleryGrid.style.position = 'static';
                    
                    items.forEach(item => {
                        item.style.position = 'static';
                        item.style.width = '100%';
                        item.style.height = 'auto';
                    });
                }
            }, 2000);
            
            // Handle window resize
            window.addEventListener('resize', () => {
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = setTimeout(() => {
                    this.isotope.layout();
                }, 250);
            });
        } catch (error) {
            console.error('Isotope initialization failed:', error);
            // Fallback: show images in a simple grid
            this.galleryGrid.style.display = 'grid';
            this.galleryGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            this.galleryGrid.style.gap = '20px';
        }
    }
    
    enhanceLowResImage(img) {
        // Apply CSS filters to enhance low-resolution images
        img.style.imageRendering = 'crisp-edges';
        img.style.filter = 'contrast(1.1) saturate(1.2)';
        
        // Add a subtle upscaling effect for very small images
        const rect = img.getBoundingClientRect();
        if (rect.width < 200 || rect.height < 200) {
            img.style.transform = 'scale(1.02)';
            img.style.transition = 'transform 0.3s ease';
        }
    }
    
    setupEventListeners() {
        // Gallery item clicks
        this.galleryGrid.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (item) {
                this.openLightbox(parseInt(item.dataset.index));
            }
        });
        
        // Lightbox controls
        document.getElementById('lightboxClose').addEventListener('click', () => {
            this.closeLightbox();
        });
        
        document.getElementById('lightboxPrev').addEventListener('click', () => {
            this.previousImage();
        });
        
        document.getElementById('lightboxNext').addEventListener('click', () => {
            this.nextImage();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
        
        // Click outside to close
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Touch/swipe support for mobile
        let startX = 0;
        let startY = 0;
        
        this.lightbox.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.lightbox.addEventListener('touchend', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Minimum swipe distance
            if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    this.nextImage();
                } else {
                    this.previousImage();
                }
            }
        });
    }
    
    openLightbox(index) {
        this.currentIndex = index;
        this.updateLightboxImage();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    updateLightboxImage() {
        const image = this.images[this.currentIndex];
        this.lightboxImage.src = image.src;
        
        // Apply enhancement to lightbox image as well
        this.lightboxImage.onload = () => {
            this.enhanceLowResImage(this.lightboxImage);
        };
    }
    
    previousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    }
    
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
}); 