document.addEventListener('DOMContentLoaded', function() {
    // Only run these animations on individual product detail pages.
    // Skip on the main products listing page to avoid heavy effects there.
    try {
        const path = window.location.pathname || '';
        const page = path.split('/').pop() || '';
        const isProductsIndex = page === 'products.html' || page === 'products' || path.endsWith('/products/') || path === '/products';
        const isProductDetail = path.includes('/products/') && !isProductsIndex;
        // If the path doesn't include /products/ at all, still allow animations (covers top-level detail pages)
    } catch (e) {
        // if any unexpected error occurs, fall through and initialize as before
    }
    // Make sure we only inject the SVG filters once
    // Inject a lightweight oilEffect filter once. Keep turbulence octaves and scales low
    // to reduce CPU usage while preserving a subtle displacement effect.
    if (!document.querySelector('#oilEffect')) {
        const filtersSvg = `
            <svg class="product-filters" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="oilEffect">
                        <!-- Reduced complexity: single fractalNoise at low frequency -->
                        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="1" result="noise"/>
                        <!-- Single displacement map with modest scale -->
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G"/>
                        <!-- Small blur for smoothing -->
                        <feGaussianBlur stdDeviation="1.2"/>
                        <!-- Slight color modulation (cheap) -->
                        <feColorMatrix type="saturate" values="1.15"/>
                    </filter>
                </defs>
            </svg>
        `;
        document.body.insertAdjacentHTML('beforeend', filtersSvg);
    }

    // Initialize Intersection Observer for animation triggers
    // Droplet behaviour removed — replaced by coalescing oil overlay animation

    // Droplets and pixel-sampling removed — oil overlay animation will handle formulating

    // Helper: create or update an oil overlay that will be masked to the product shape
    const createOrUpdateOilOverlay = (productImage, img) => {
        // ensure container is positioned so absolute children align correctly
        if (getComputedStyle(productImage).position === 'static') {
            productImage.style.position = 'relative';
        }

        let overlay = productImage.querySelector('.oil-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'oil-overlay';
            overlay.style.position = 'absolute';
            overlay.style.left = '0';
            overlay.style.top = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.pointerEvents = 'none';
            overlay.style.zIndex = '5'; // keep above the image so oil remains visible
            overlay.style.opacity = '1';
            overlay.style.transition = 'opacity 500ms ease-out';
            productImage.appendChild(overlay);
        }

        const src = img.currentSrc || img.src;
        overlay.style.backgroundImage = `url("${src}")`;
        overlay.style.backgroundRepeat = 'no-repeat';

        // Align the overlay's background exactly to the displayed portion of the image
        try {
            const productRect = productImage.getBoundingClientRect();
            const imgRect = img.getBoundingClientRect();
            const maskWidth = Math.round(imgRect.width);
            const maskHeight = Math.round(imgRect.height);
            const offsetX = Math.round(imgRect.left - productRect.left);
            const offsetY = Math.round(imgRect.top - productRect.top);

            overlay.style.backgroundSize = `${maskWidth}px ${maskHeight}px`;
            overlay.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
        } catch (e) {
            overlay.style.backgroundSize = 'contain';
            overlay.style.backgroundPosition = 'center';
        }

        // apply the SVG filter for the oil effect and a blend mode so it looks like an overlay
        overlay.style.filter = 'url(#oilEffect)';
        overlay.style.mixBlendMode = 'screen';

        return overlay;
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(async entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const productImage = entry.target;
                const img = productImage.querySelector('img');
                if (!img) return;

                // Set initial state
                img.style.opacity = '0';

                    // create an oil overlay that will remain above the image while formulating
                    const oilOverlay = createOrUpdateOilOverlay(productImage, img);

                // Droplet build-up removed: instead trigger a coalescing overlay animation.
                // Use the overlay to simulate fast coalescence and then reveal the product.
                if (oilOverlay) {
                    oilOverlay.style.transition = 'opacity 420ms ease-out, transform 560ms cubic-bezier(0.2,0,0.2,1)';
                    oilOverlay.style.opacity = '1';
                    oilOverlay.style.transform = 'scale(1.02)';

                    // subtle settle back after entrance
                    setTimeout(() => {
                        if (oilOverlay) oilOverlay.style.transform = 'scale(1)';
                    }, 480);
                }

                // After droplets are placed and animated, trigger the main mask/coalescing animation
                productImage.dataset.animated = 'true';

                // Wait until the mask (::before) animation completes before revealing the product image.
                // Try to read the computed animation duration + delay from the pseudo-element; if not available, fall back
                // to a shorter sensible default for snappy UX.
                const computeMaskEndDelay = (el) => {
                    try {
                        // getComputedStyle supports pseudo-elements via second arg
                        const cs = window.getComputedStyle(el, '::before');
                        const dur = cs.getPropertyValue('animation-duration') || cs.getPropertyValue('-webkit-animation-duration') || '';
                        const delay = cs.getPropertyValue('animation-delay') || cs.getPropertyValue('-webkit-animation-delay') || '';

                        // animation-duration/delay can be comma-separated lists; take the first pair
                        const parseTime = (s) => {
                            if (!s) return 0;
                            const parts = s.split(',').map(p => p.trim());
                            const first = parts[0] || '0s';
                            // convert to ms
                            if (first.endsWith('ms')) return parseFloat(first);
                            if (first.endsWith('s')) return parseFloat(first) * 1000;
                            return parseFloat(first) || 0;
                        };

                        const d = parseTime(dur);
                        const del = parseTime(delay);
                        // clamp maximum to 2200ms to avoid excessive waits on slow pages
                        return Math.min(2200, Math.round(d + del));
                    } catch (e) {
                        return null;
                    }
                };

                const maskMs = computeMaskEndDelay(productImage) || 1400; // shorter fallback for snappier reveal

                // Reveal image after mask finishes
                setTimeout(() => {
                    img.style.transition = 'opacity 500ms ease-out';
                    img.style.opacity = '1';

                    // after the image is visible, fade the oil overlay out gracefully
                    setTimeout(() => {
                        if (oilOverlay) {
                            oilOverlay.style.opacity = '0';
                            setTimeout(() => {
                                try { oilOverlay.remove(); } catch (e) {}
                            }, 520);
                        }
                    }, 600);
                }, maskMs);

                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px'
    });

    // Initialize all product images and set mask variables
    const initializeImages = () => {
    // Find common image containers used across templates (include category tiles)
    // Find all images that are direct children of likely product image containers
    // Include .category-image so the products index category tiles receive the same oil overlay.
    const containers = Array.from(document.querySelectorAll('.product-image, .image-zoom-container, .product-detail-image, .category-image'));
        const imgs = new Set();
        containers.forEach(container => {
            // Add direct child <img> elements
            Array.from(container.children).forEach(child => {
                if (child.tagName === 'IMG') imgs.add(child);
            });
            // Also add any nested <img> for robustness
            Array.from(container.querySelectorAll('img')).forEach(img => imgs.add(img));
        });

        imgs.forEach(img => {
            if (!img) return;

            // decide which element should act as the productImage container
            let productImage = img.closest('.product-image') || img.closest('.image-zoom-container') || img.closest('.product-detail-image') || img.parentElement;
            if (!productImage) productImage = img.parentElement;

            // Always add the .product-image class so mask CSS applies
            productImage.classList.add('product-image');

            // skip if already initialized
            if (productImage.dataset.initialized) return;

            // Set initial image opacity so reveal animation works
            img.style.opacity = '0';

            // If this is a zoom-image, ensure overlay follows zoom transform
            if (img.classList.contains('zoom-image')) {
                // Listen for transform changes and apply same transform to overlay
                let lastTransform = '';
                const syncOverlayTransform = () => {
                    const overlay = productImage.querySelector('.oil-overlay');
                    if (overlay) {
                        const t = img.style.transform || window.getComputedStyle(img).transform;
                        if (t && t !== 'none') {
                            overlay.style.transform = t;
                            lastTransform = t;
                        } else {
                            overlay.style.transform = '';
                            lastTransform = '';
                        }
                    }
                };
                // Observe style changes (using MutationObserver for style attribute)
                const mo = new MutationObserver(syncOverlayTransform);
                mo.observe(img, { attributes: true, attributeFilter: ['style'] });
                // Also sync on mouse events (for JS-driven zoom)
                ['mouseenter', 'mouseleave', 'mousemove'].forEach(evt => {
                    img.addEventListener(evt, syncOverlayTransform);
                });
            }

            const applyMask = () => {
                try {
                    // Use the image source as mask; wrap in url() for CSS
                    const src = img.currentSrc || img.src;
                    productImage.style.setProperty('--mask-url', `url("${src}")`);

                    // Compute displayed image box relative to productImage element.
                    // This handles object-fit, padding, etc. so the mask aligns exactly.
                    const productRect = productImage.getBoundingClientRect();
                    const imgRect = img.getBoundingClientRect();

                    // Calculate mask size in pixels and position offsets
                    const maskWidth = Math.round(imgRect.width);
                    const maskHeight = Math.round(imgRect.height);
                    const offsetX = Math.round(imgRect.left - productRect.left);
                    const offsetY = Math.round(imgRect.top - productRect.top);

                    // Set explicit mask size and position in pixels
                    productImage.style.setProperty('--mask-size', `${maskWidth}px ${maskHeight}px`);
                    productImage.style.setProperty('--mask-position', `${offsetX}px ${offsetY}px`);

                    // If overlay exists, sync its transform to match zoom
                    if (img.classList.contains('zoom-image')) {
                        const overlay = productImage.querySelector('.oil-overlay');
                        if (overlay) {
                            const t = img.style.transform || window.getComputedStyle(img).transform;
                            overlay.style.transform = t && t !== 'none' ? t : '';
                        }
                    }
                } catch (e) {
                    // fallback: use contain/center if anything goes wrong
                    productImage.style.setProperty('--mask-size', 'contain');
                    productImage.style.setProperty('--mask-position', 'center');
                }
            };

            // rAF-based debounce helper to avoid layout thrashing during scroll/resize
            const rafDebounce = (fn) => {
                let raf = null;
                return () => {
                    if (raf) cancelAnimationFrame(raf);
                    raf = requestAnimationFrame(() => {
                        try { fn(); } catch (e) {}
                        raf = null;
                    });
                };
            };

            const applyMaskDebounced = rafDebounce(applyMask);

            // Recompute mask position/size on scroll/resize/orientationchange to handle
            // layout shifts, scrolling and zooming which can make overlay drift off.
            window.addEventListener('scroll', applyMaskDebounced, { passive: true });
            window.addEventListener('resize', applyMaskDebounced, { passive: true });
            window.addEventListener('orientationchange', applyMaskDebounced, { passive: true });

            // Also observe transform/style changes on the image's ancestors to resync overlay
            const ancestorObserver = new MutationObserver(applyMaskDebounced);
            let ancestor = productImage;
            // observe up to 3 levels to catch most transforms without being too heavy
            for (let i = 0; i < 3 && ancestor; i++) {
                ancestorObserver.observe(ancestor, { attributes: true, attributeFilter: ['style', 'class'] });
                ancestor = ancestor.parentElement;
            }

            // If image already loaded, apply mask, otherwise wait for load
            if (img.complete && img.naturalWidth > 0) {
                applyMask();
            } else {
                img.addEventListener('load', applyMask, { once: true });
            }

            // Observe size changes so mask size/position stay synced with the displayed image
            const resizeDebounce = (fn, wait = 80) => {
                let t = null;
                return (...args) => {
                    clearTimeout(t);
                    t = setTimeout(() => fn.apply(this, args), wait);
                };
            };

            const ro = new ResizeObserver(resizeDebounce(() => {
                applyMask();
            }));
            // observe both the image and its container
            ro.observe(img);
            ro.observe(productImage);

            productImage.dataset.initialized = 'true';
            observer.observe(productImage);
        });
    };

    // Initial setup
    initializeImages();

    // Handle dynamic content loading
    const mutationObserver = new MutationObserver(initializeImages);
    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});
