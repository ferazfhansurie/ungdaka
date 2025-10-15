/**
 * Ungdaka Website - Modern Interactive JavaScript
 * Professional industrial lubricants and chemicals company website
 */

'use strict';

// ===== FORM HANDLERS =====
document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const company = contactForm.querySelector('[name="company"]').value;
            const contactPerson = contactForm.querySelector('[name="contact-person"]').value;
            const email = contactForm.querySelector('[name="email"]').value;
            const phone = contactForm.querySelector('[name="phone"]').value;
            const inquiryType = contactForm.querySelector('[name="inquiry-type"]').value;
            const industry = contactForm.querySelector('[name="industry"]').value;
            const message = contactForm.querySelector('[name="message"]').value;
            
            // Format the message for WhatsApp
            const whatsappMessage = 
`*New Inquiry from Website*
Company: ${company}
Contact Person: ${contactPerson}
Email: ${email}
Phone: ${phone}
Inquiry Type: ${inquiryType}
Industry: ${industry || 'Not specified'}

Message:
${message}`;

            // Encode the message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Create WhatsApp URL (using proper country code for Malaysia)
            const whatsappURL = `https://wa.me/60439999966?text=${encodedMessage}`;
            
            // Open WhatsApp in a new tab
            window.open(whatsappURL, '_blank');
            
            // Reset the form
            contactForm.reset();
        });
    }

    // Quote Form Handler
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const company = quoteForm.querySelector('[name="company"]').value;
            const contactPerson = quoteForm.querySelector('[name="contact-person"]').value;
            const email = quoteForm.querySelector('[name="email"]').value;
            const phone = quoteForm.querySelector('[name="phone"]').value;
            const productCategory = quoteForm.querySelector('[name="product-category"]').value;
            const requirements = quoteForm.querySelector('[name="requirements"]').value;
            
            // Format the message for WhatsApp
            const whatsappMessage = 
`*New Quote Request from Website*
Company: ${company}
Contact Person: ${contactPerson}
Email: ${email}
Phone: ${phone}
Product Category: ${productCategory}

Requirements:
${requirements}`;

            // Encode the message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Create WhatsApp URL
            const whatsappURL = `https://wa.me/60439999966?text=${encodedMessage}`;
            
            // Open WhatsApp in a new tab
            window.open(whatsappURL, '_blank');
            
            // Close modal and reset form
            const modal = document.getElementById('quote-modal');
            if (modal) {
                modal.style.display = 'none';
            }
            quoteForm.reset();
        });
    }
});

// Transparent overlay uses an animated GIF now; no autoplay handling needed.

// Dynamically load product-animations on product detail pages to avoid including
// the script on listing pages. Product pages use <body class="product-page">.
document.addEventListener('DOMContentLoaded', function() {
    try {
        if (document.body && document.body.classList.contains('product-page')) {
            const s = document.createElement('script');
            s.src = '../product-animations.js';
            s.async = false;
            document.body.appendChild(s);
        }
    } catch (e) {
        // ignore
    }
});

// ===== UTILITY FUNCTIONS =====
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    scrollToElement(element, offset = 100) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = window.innerWidth < 768 ? 30 : 60;
        this.connectionDistance = 120;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    bindEvents() {
        window.addEventListener('resize', Utils.debounce(() => {
            this.resizeCanvas();
            this.particleCount = window.innerWidth < 768 ? 30 : 60;
            this.createParticles();
        }, 250));

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.01;
                particle.vy -= (dy / distance) * force * 0.01;
            }
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }

            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.2;
                    this.ctx.strokeStyle = `rgba(0, 51, 102, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = `rgba(0, 51, 102, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// ===== NAVIGATION CONTROLLER =====
class NavigationController {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.dropdowns = document.querySelectorAll('.nav-dropdown');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateActiveLink();
        this.initDropdowns();
        this.checkInitialScroll();
    }
    
    checkInitialScroll() {
        // Check if page has a hero section
        const hasHero = document.querySelector('.hero, .hero-modern');
        
        // If no hero section or already scrolled, add scrolled class immediately
        if (!hasHero || window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        }
    }

    initDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            
            if (toggle) {
                // Mobile: Click to toggle
                toggle.addEventListener('click', (e) => {
                    if (window.innerWidth <= 1024) {
                        e.preventDefault();
                        
                        // Close other dropdowns
                        this.dropdowns.forEach(otherDropdown => {
                            if (otherDropdown !== dropdown) {
                                otherDropdown.classList.remove('active');
                            }
                        });
                        
                        // Toggle current dropdown
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                this.dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }

    bindEvents() {
        // Scroll handler
        window.addEventListener('scroll', Utils.throttle(() => {
        this.handleScroll();
            this.updateActiveLink();
        }, 16));

        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't handle dropdown toggles
                if (!link.classList.contains('dropdown-toggle')) {
                    this.handleNavClick(e, link);
                }
            });
        });

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                this.closeMobileMenu();
                this.dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');

        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('menu-open');
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('menu-open');
        }
    }
        
    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
    }

    handleNavClick(e, link) {
        const href = link.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                Utils.scrollToElement(targetElement);
                this.closeMobileMenu();
            }
        }
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
            
            sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
                const sectionHeight = section.clientHeight;
                
            if (sectionTop <= 200 && sectionTop + sectionHeight > 200) {
                currentSection = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
        });
    }
}

// ===== ANIMATION CONTROLLER =====
class AnimationController {
    constructor() {
        this.observedElements = new Set();
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.animateCounters();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.observedElements.add(entry.target);
                }
            });
        }, options);

        const elementsToAnimate = document.querySelectorAll(`
            .hero-content,
            .hero-visual,
            .section-header,
            .about-card,
            .experience-card,
            .product-card,
            .industry-card,
            .service-card,
            .contact-card,
            .branch-card
        `);

        elementsToAnimate.forEach(el => {
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
}

// ===== PRODUCT TABS CONTROLLER =====
class ProductTabsController {
    constructor() {
        this.tabPanels = document.querySelectorAll('.tab-panel');
        this.categoryCards = document.querySelectorAll('.category-card');
        this.categoryOverview = document.querySelector('.category-overview');
        this.backButton = document.querySelector('.back-to-categories');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        // Hide all tab panels on initial load
        this.hideAllTabs();
    }

    bindEvents() {
        // Category card events
        this.categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const targetTab = card.getAttribute('data-category');
                console.log('Category card clicked:', targetTab);
                this.switchTab(targetTab);
                // Hide category overview when clicking category cards
                this.hideCategoryOverview();
                // Show back button
                this.showBackButton();
                // Scroll to the tab content area
                const tabContent = document.querySelector('.tab-content');
                if (tabContent) {
                    tabContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Back button event
        if (this.backButton) {
            const backBtn = this.backButton.querySelector('.back-btn');
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    console.log('Back button clicked');
                    this.showCategoryOverview();
                    this.hideBackButton();
                    // Scroll to category overview
                    if (this.categoryOverview) {
                        this.categoryOverview.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            }
        }
    }

    hideAllTabs() {
        this.tabPanels.forEach(panel => {
            panel.classList.remove('active');
        });
    }

    switchTab(targetTab) {
        // Update panels
        this.tabPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === targetTab) {
                panel.classList.add('active');
            }
        });
    }

    hideCategoryOverview() {
        console.log('Hiding category overview');
        if (this.categoryOverview) {
            this.categoryOverview.classList.add('hidden');
            console.log('Category overview hidden');
        } else {
            console.log('Category overview element not found!');
        }
    }

    showCategoryOverview() {
        console.log('Showing category overview');
        if (this.categoryOverview) {
            this.categoryOverview.classList.remove('hidden');
            this.hideAllTabs();
            console.log('Category overview shown');
        } else {
            console.log('Category overview element not found!');
        }
    }

    showBackButton() {
        if (this.backButton) {
            this.backButton.classList.remove('hidden');
        }
    }

    hideBackButton() {
        if (this.backButton) {
            this.backButton.classList.add('hidden');
        }
    }
}

// ===== FORM CONTROLLER =====
class FormController {
    constructor() {
        this.contactForm = document.getElementById('contact-form');
        this.quoteForm = document.getElementById('quote-form');
        
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.setupForm(this.contactForm);
            this.initializeFloatingLabels(this.contactForm);
        }
        
        if (this.quoteForm) {
            this.setupForm(this.quoteForm);
            this.initializeFloatingLabels(this.quoteForm);
        }
    }

    initializeFloatingLabels(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Set initial state
            this.updateLabelPosition(input);
            
            // Add additional event listeners for better responsiveness
            input.addEventListener('keyup', () => this.updateLabelPosition(input));
            input.addEventListener('paste', () => {
                setTimeout(() => this.updateLabelPosition(input), 10);
            });
        });
    }

    setupForm(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });

        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
                this.updateLabelPosition(input);
            });
            input.addEventListener('input', () => {
                this.clearFieldError(input);
                this.updateLabelPosition(input);
            });
            input.addEventListener('focus', () => this.updateLabelPosition(input));
            input.addEventListener('change', () => this.updateLabelPosition(input));
            
            // Check initial state
            this.updateLabelPosition(input);
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }

        if (fieldName === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    validateForm(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    handleFormSubmit(form) {
        if (!this.validateForm(form)) {
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            this.showSuccessMessage(form);
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                form.reset();
                
                if (form === this.quoteForm && window.modalController) {
                    window.modalController.closeModal();
                }
            }, 2000);
        }, 2000);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#EF4444';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
            errorElement.style.cssText = `
            color: #EF4444;
            font-size: 0.875rem;
                margin-top: 0.5rem;
                display: block;
            `;
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    updateLabelPosition(input) {
        const hasValue = input.value.trim() !== '';
        
        if (hasValue) {
            input.classList.add('filled');
        } else {
            input.classList.remove('filled');
        }
        
        // Force a reflow to ensure the CSS changes take effect
        input.offsetHeight;
    }

    showSuccessMessage(form) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.style.cssText = `
            background: #10B981;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            text-align: center;
        `;
        successElement.textContent = 'Thank you! Your message has been sent successfully.';
        
        form.insertBefore(successElement, form.firstChild);
        
        setTimeout(() => {
            successElement.remove();
        }, 5000);
    }

    getFieldLabel(fieldName) {
        const labels = {
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            company: 'Company Name',
            'contact-person': 'Contact Person',
            subject: 'Subject',
            message: 'Message',
            industry: 'Industry',
            'product-category': 'Product Category',
            requirements: 'Requirements'
        };
        
        return labels[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    }
}

// ===== MODAL CONTROLLER =====
class ModalController {
    constructor() {
        this.modal = document.getElementById('quote-modal');
        this.modalClose = document.getElementById('modal-close');
        this.quoteButtons = document.querySelectorAll('.nav-quote-btn, [data-modal="quote"]');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.quoteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        });
        
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            const firstInput = this.modal.querySelector('input, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// ===== BACK TO TOP CONTROLLER =====
class BackToTopController {
    constructor() {
        this.button = document.getElementById('back-to-top');
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('scroll', Utils.throttle(() => {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }, 100));

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== INTERACTIVE LIQUID ANIMATION =====
class LiquidAnimation {
    constructor() {
        this.canvas = document.getElementById('liquidCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight * 0.5;
        this.lastX = this.width / 2;
        this.lastY = this.height / 2;
        this.points = [];
        this.numPoints = 100;
        this.viscosity = 20;
        this.mouseDist = 80;
        this.damping = 0.15;
        this.touchForce = 2;
        this.baseHeight = this.height * 0.5;
        this.color = '#FFD700';
        this.frameCount = 0;

        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Initialize points
        const spacing = this.width / (this.numPoints - 1);
        for (let i = 0; i < this.numPoints; i++) {
            this.points.push({
                x: spacing * i,
                y: this.baseHeight,
                originalY: this.baseHeight,
                velocity: 0,
                force: 0
            });
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.mouseMoved(x, y);
        });

        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight * 0.5;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.baseHeight = this.height * 0.5;
            this.init();
        });
    }

    mouseMoved(x, y) {
        const dx = x - this.lastX;
        const dy = y - this.lastY;
        const mouseSpeed = Math.sqrt(dx * dx + dy * dy) * this.touchForce;

        this.points.forEach(point => {
            const dist = Math.abs(x - point.x);
            if (dist < this.mouseDist) {
                const force = (1 - (dist / this.mouseDist)) * mouseSpeed;
                point.force = force;
            }
        });

        this.lastX = x;
        this.lastY = y;
    }

    updatePoints() {
        this.points.forEach(point => {
            let force = point.force;
            point.force = 0;

            // Add some random movement
            force += (Math.random() - 0.5) * 0.2;

            point.velocity *= (1 - this.damping);
            point.velocity += force / this.viscosity;
            point.y += point.velocity;

            // Spring back to original position
            const dy = point.originalY - point.y;
            point.velocity += dy * 0.01;
        });
    }

    drawLiquid() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height);
        this.ctx.lineTo(this.points[0].x, this.points[0].y);

        // Create smooth curve through points
        for (let i = 0; i < this.points.length - 1; i++) {
            const curr = this.points[i];
            const next = this.points[i + 1];
            const cx = (curr.x + next.x) * 0.5;
            const cy = (curr.y + next.y) * 0.5;
            this.ctx.quadraticCurveTo(curr.x, curr.y, cx, cy);
        }

        this.ctx.lineTo(this.width, this.height);
        this.ctx.closePath();
        this.ctx.fill();

        // Add gradient overlay
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 196, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(218, 165, 32, 0.9)');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.updatePoints();
        this.drawLiquid();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize liquid animation
document.addEventListener('DOMContentLoaded', () => {
    new LiquidAnimation();
});

// ===== LOADING SCREEN CONTROLLER =====
class LoadingController {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.init();
    }

    init() {
        // Hide loading screen immediately when all content is loaded
        window.addEventListener('load', () => {
            this.hideLoading();
        });

        // Fallback: Hide loading screen after 2 seconds even if not fully loaded
        setTimeout(() => {
            this.hideLoading();
        }, 2000);
    }

    hideLoading() {
        if (this.loadingScreen && !this.loadingScreen.classList.contains('hidden')) {
            this.loadingScreen.classList.add('hidden');
            
            // Remove the loading screen element after transition completes
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.remove();
                }
            }, 500);
        }
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.animatedElements = [];
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.observeElements();
    }

    setupScrollAnimations() {
        // Add animation classes to elements
        const elementsToAnimate = [
            { selector: '.hero-content', animation: 'animate-fade-in-left' },
            { selector: '.hero-image', animation: 'animate-fade-in-right' },
            { selector: '.section-header', animation: 'animate-slide-up' },
            { selector: '.service-card', animation: 'animate-scale-in' },
            { selector: '.product-card', animation: 'animate-bounce-in' },
            { selector: '.trust-item', animation: 'animate-slide-up' },
            { selector: '.contact-method', animation: 'animate-fade-in-left' },
            { selector: '.contact-form-container', animation: 'animate-fade-in-right' },
            { selector: '.footer-col', animation: 'animate-slide-up' }
        ];

        elementsToAnimate.forEach(({ selector, animation }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                element.classList.add(animation);
                if (index > 0) {
                    element.classList.add(`animate-delay-${Math.min(index, 6)}`);
                }
                this.animatedElements.push(element);
            });
        });

        // Add hover effects to specific elements
        const hoverElements = document.querySelectorAll('.service-card, .product-card, .trust-item');
        hoverElements.forEach(element => {
            element.classList.add('hover-float');
        });

        const glowElements = document.querySelectorAll('.btn-primary, .nav-quote-btn');
        glowElements.forEach(element => {
            element.classList.add('hover-glow');
        });

        // Add special animations for hero elements
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.classList.add('animate-bounce-in');
            this.animatedElements.push(heroTitle);
        }

        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.classList.add('animate-slide-up', 'animate-delay-1');
            this.animatedElements.push(heroSubtitle);
        }

        const heroButtons = document.querySelectorAll('.hero-buttons .btn');
        heroButtons.forEach((btn, index) => {
            btn.classList.add('animate-scale-in', `animate-delay-${index + 2}`);
            this.animatedElements.push(btn);
        });

        // Add staggered animations to grid items
        const gridItems = document.querySelectorAll('.services-grid .service-card, .products-grid .product-card, .trust-grid .trust-item');
        gridItems.forEach((item, index) => {
            item.classList.add('animate-scale-in', `animate-delay-${(index % 6) + 1}`);
            this.animatedElements.push(item);
        });
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ===== MOUSE EFFECTS =====
class MouseEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupMagneticEffect();
        this.setupTiltEffect();
    }

    setupMagneticEffect() {
        const magneticElements = document.querySelectorAll('.btn, .product-card, .industry-card');

        magneticElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transition = 'transform 0.3s ease';
            });

            element.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = element.getBoundingClientRect();
                const centerX = left + width / 2;
                const centerY = top + height / 2;
                const deltaX = (e.clientX - centerX) * 0.1;
                const deltaY = (e.clientY - centerY) * 0.1;

                element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0px, 0px) scale(1)';
            });
        });
    }

    setupTiltEffect() {
        const tiltElements = document.querySelectorAll('.floating-card');

        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = element.getBoundingClientRect();
                const centerX = left + width / 2;
                const centerY = top + height / 2;
            const rotateX = (e.clientY - centerY) / 10;
            const rotateY = (centerX - e.clientX) / 10;
            
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }
}

// ===== HERO SLIDER CONTROLLER =====
class HeroSliderController {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('hero-prev');
        this.nextBtn = document.getElementById('hero-next');
        this.currentSlide = 0;
        this.slideInterval = null;
        
        this.init();
    }

    init() {
        if (this.slides.length === 0) return;
        
        this.bindEvents();
        this.startAutoSlide();
    }

    bindEvents() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
            });
        }

        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Pause auto-slide on hover
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', () => {
                this.stopAutoSlide();
            });

            heroSlider.addEventListener('mouseleave', () => {
                this.startAutoSlide();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }

    goToSlide(index) {
        // Remove active class from current slide and indicator
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');

        // Update current slide
        this.currentSlide = index;

        // Add active class to new slide and indicator
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    startAutoSlide() {
        this.stopAutoSlide();
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }

    destroy() {
        this.stopAutoSlide();
        document.removeEventListener('keydown', this.handleKeydown);
    }
}

// ===== CAROUSEL CONTROLLER =====
class CarouselController {
    constructor() {
        this.carousel = document.getElementById('industries-carousel');
        this.slides = document.querySelectorAll('.carousel-slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicatorsContainer = document.getElementById('carouselIndicators');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        this.isMobile = window.innerWidth <= 768;
        this.autoSlideDelay = this.isMobile ? 2000 : 5000; // 2s for mobile, 5s for desktop
        
        this.init();
    }

    init() {
        if (!this.carousel || this.totalSlides === 0) return;

        this.createIndicators();
        this.bindEvents();
        this.startAutoSlide();
        this.updateCarousel();
        
        // Listen for window resize to adjust behavior
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (wasMobile !== this.isMobile) {
                this.autoSlideDelay = this.isMobile ? 2000 : 5000;
                this.currentSlide = 0; // Reset to first slide when switching modes
                
                // Reset all styles and classes when switching modes
                const slides = document.querySelectorAll('.carousel-slide');
                const allPanels = document.querySelectorAll('.industry-panel');
                
                slides.forEach(slide => slide.classList.remove('mobile-active'));
                allPanels.forEach(panel => panel.classList.remove('mobile-panel-active'));
                this.carousel.style.transform = '';
                
                this.createIndicators(); // Recreate indicators for new mode
                this.updateCarousel();
                this.resetAutoSlide();
            }
        });
    }

    createIndicators() {
        if (!this.indicatorsContainer) return;

        this.indicatorsContainer.innerHTML = '';
        
        // On mobile, create indicators for each individual industry panel
        if (this.isMobile) {
            // Count total industry panels across all slides
            const totalPanels = document.querySelectorAll('.industry-panel').length;
            
            for (let i = 0; i < totalPanels; i++) {
                const indicator = document.createElement('button');
                indicator.className = 'carousel-indicator';
                if (i === 0) indicator.classList.add('active');
                
                indicator.addEventListener('click', () => {
                    this.goToSlide(i);
                });
                
                this.indicatorsContainer.appendChild(indicator);
            }
        } else {
            // On desktop, create indicators for slides (groups of 4)
            for (let i = 0; i < this.totalSlides; i++) {
                const indicator = document.createElement('button');
                indicator.className = 'carousel-indicator';
                if (i === 0) indicator.classList.add('active');
                
                indicator.addEventListener('click', () => {
                    this.goToSlide(i);
                });
                
                this.indicatorsContainer.appendChild(indicator);
            }
        }
    }

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
            });
        }

        // Pause auto-slide on hover
        if (this.carousel) {
            this.carousel.addEventListener('mouseenter', () => {
                this.stopAutoSlide();
            });

            this.carousel.addEventListener('mouseleave', () => {
                this.startAutoSlide();
            });
        }

        // Touch/swipe support
        this.addTouchSupport();
    }

    addTouchSupport() {
        if (!this.carousel) return;

        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only trigger if horizontal swipe is greater than vertical
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > 50) { // Minimum swipe distance
                    if (diffX > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            }
        });
    }

    goToSlide(slideIndex) {
        if (this.isMobile) {
            // On mobile, slideIndex refers to individual industry panels
            const totalPanels = document.querySelectorAll('.industry-panel').length;
            if (slideIndex < 0 || slideIndex >= totalPanels) return;
        } else {
            // On desktop, slideIndex refers to slides (groups of 4)
            if (slideIndex < 0 || slideIndex >= this.totalSlides) return;
        }
        
        this.currentSlide = slideIndex;
        this.updateCarousel();
        this.resetAutoSlide();
    }

    nextSlide() {
        if (this.isMobile) {
            // On mobile, navigate through individual industry panels
            const totalPanels = document.querySelectorAll('.industry-panel').length;
            this.currentSlide = (this.currentSlide + 1) % totalPanels;
        } else {
            // On desktop, navigate through slides (groups of 4)
            this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        }
        this.updateCarousel();
        this.resetAutoSlide();
    }

    prevSlide() {
        if (this.isMobile) {
            // On mobile, navigate through individual industry panels
            const totalPanels = document.querySelectorAll('.industry-panel').length;
            this.currentSlide = (this.currentSlide - 1 + totalPanels) % totalPanels;
        } else {
            // On desktop, navigate through slides (groups of 4)
            this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        }
        this.updateCarousel();
        this.resetAutoSlide();
    }

    updateCarousel() {
        if (!this.carousel) return;

        if (this.isMobile) {
            // On mobile, show individual industry panels
            const slides = document.querySelectorAll('.carousel-slide');
            const allPanels = document.querySelectorAll('.industry-panel');
            const totalPanels = allPanels.length;
            
            // Remove all active classes
            slides.forEach(slide => slide.classList.remove('mobile-active'));
            allPanels.forEach(panel => panel.classList.remove('mobile-panel-active'));
            
            // Find the specific panel to show
            if (allPanels[this.currentSlide]) {
                const targetPanel = allPanels[this.currentSlide];
                const parentSlide = targetPanel.closest('.carousel-slide');
                
                // Show the parent slide and the target panel
                if (parentSlide) {
                    parentSlide.classList.add('mobile-active');
                }
                targetPanel.classList.add('mobile-panel-active');
            }
            
            // Update indicators
            const indicators = document.querySelectorAll('.carousel-indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentSlide);
            });
            
            // Update button states for mobile
            if (this.prevBtn) {
                this.prevBtn.disabled = this.currentSlide === 0;
            }
            if (this.nextBtn) {
                this.nextBtn.disabled = this.currentSlide === totalPanels - 1;
            }
        } else {
            // Desktop behavior - show slides with 4 panels each
            const slides = document.querySelectorAll('.carousel-slide');
            const allPanels = document.querySelectorAll('.industry-panel');
            
            // Remove mobile classes for desktop
            slides.forEach(slide => slide.classList.remove('mobile-active'));
            allPanels.forEach(panel => panel.classList.remove('mobile-panel-active'));
            
            const translateX = -this.currentSlide * 100;
            this.carousel.style.transform = `translateX(${translateX}%)`;

            // Update indicators
            const indicators = document.querySelectorAll('.carousel-indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentSlide);
            });

            // Update button states for desktop
            if (this.prevBtn) {
                this.prevBtn.disabled = this.currentSlide === 0;
            }
            if (this.nextBtn) {
                this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
            }
        }
    }

    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoSlideDelay);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }

    destroy() {
        this.stopAutoSlide();
        
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.prevSlide);
        }
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.nextSlide);
        }
    }
}

// ===== MAIN APPLICATION =====
class UngdakaApp {
    constructor() {
        this.controllers = {};
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeControllers();
            });
        } else {
            this.initializeControllers();
        }
    }

    initializeControllers() {
        try {
            this.controllers.loading = new LoadingController();

            const particlesCanvas = document.getElementById('particles-canvas');
            if (particlesCanvas) {
                this.controllers.particles = new ParticleSystem(particlesCanvas);
                window.particleSystem = this.controllers.particles;
            }

            this.controllers.navigation = new NavigationController();
            this.controllers.animation = new AnimationController();
            this.controllers.heroSlider = new HeroSliderController();
            this.controllers.productTabs = new ProductTabsController();
            this.controllers.forms = new FormController();
            this.controllers.modal = new ModalController();
            this.controllers.backToTop = new BackToTopController();
            this.controllers.mouseEffects = new MouseEffects();
            this.controllers.scrollAnimations = new ScrollAnimations();
            this.controllers.carousel = new CarouselController();

            window.modalController = this.controllers.modal;

            console.log('Ungdaka website initialized successfully');
        } catch (error) {
            console.error('Error initializing Ungdaka website:', error);
        }
    }

    destroy() {
        Object.values(this.controllers).forEach(controller => {
            if (controller.destroy && typeof controller.destroy === 'function') {
                controller.destroy();
            }
        });
    }
}

// ===== INITIALIZE APPLICATION =====
const app = new UngdakaApp();

// ===== GLOBAL ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Bearing Animation
document.addEventListener('DOMContentLoaded', () => {
    const bearings = ['dry-bearing', 'greased-bearing'].map(id => {
        const element = document.getElementById(id);
        return {
            element,
            img: element.querySelector('.bearing-image'),
            angle: 0,
            velocity: 0,
            lastX: 0,
            lastY: 0,
            isDragging: false,
            friction: id === 'dry-bearing' ? 0.98 : 0.995 // More friction for dry bearing
        };
    });

    bearings.forEach(bearing => {
        // Allow touch/pointer interactions on mobile by disabling default touch-action
        try {
            bearing.element.style.touchAction = 'none';
        } catch (err) {
            // ignore if not supported
        }

        // Mouse fallback (desktop)
        bearing.element.addEventListener('mousedown', (e) => {
            bearing.isDragging = true;
            bearing.lastX = e.clientX;
            bearing.lastY = e.clientY;
            bearing.element.style.cursor = 'grabbing';
        });

        // Pointer events (unified for mouse, pen, and touch)
        bearing.element.addEventListener('pointerdown', (e) => {
            // Prevent page scrolling while dragging
            try { e.preventDefault(); } catch (err) {}
            bearing.isDragging = true;
            bearing.lastX = e.clientX;
            bearing.lastY = e.clientY;
            if (bearing.element.setPointerCapture) {
                try { bearing.element.setPointerCapture(e.pointerId); } catch (err) {}
            }
            bearing.element.style.cursor = 'grabbing';
        });

        // Pointer / mouse move handler
        const onMove = (e) => {
            if (!bearing.isDragging) return;

            const clientX = e.clientX;
            const clientY = e.clientY;
            const dx = clientX - bearing.lastX;
            const dy = clientY - bearing.lastY;
            const center = bearing.element.getBoundingClientRect();
            const centerX = center.left + center.width / 2;
            const centerY = center.top + center.height / 2;

            // Calculate angle based on pointer position relative to center
            const angle = Math.atan2(clientY - centerY, clientX - centerX);
            const prevAngle = Math.atan2(bearing.lastY - centerY, bearing.lastX - centerX);
            let deltaAngle = angle - prevAngle;

            // Normalize deltaAngle to be between -π and π
            if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
            if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

            bearing.velocity += deltaAngle * 2;
            bearing.lastX = clientX;
            bearing.lastY = clientY;
        };

        // Attach both pointermove and mousemove (pointer covers mouse, but keep mouse for older browsers)
        window.addEventListener('pointermove', onMove);
        window.addEventListener('mousemove', onMove);

        const stopDragging = (e) => {
            bearing.isDragging = false;
            bearing.element.style.cursor = 'grab';
            if (e && e.pointerId && bearing.element.releasePointerCapture) {
                try { bearing.element.releasePointerCapture(e.pointerId); } catch (err) {}
            }
        };

        window.addEventListener('pointerup', stopDragging);
        window.addEventListener('pointercancel', stopDragging);
        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('mouseleave', stopDragging);
    });

    function animate() {
        bearings.forEach(bearing => {
            if (!bearing.isDragging) {
                bearing.velocity *= bearing.friction; // Apply friction
            }
            bearing.angle += bearing.velocity;
            bearing.img.style.transform = `rotate(${bearing.angle}rad)`;
        });
        requestAnimationFrame(animate);
    }

    animate();
});

// ===== ROLLING DRUM ANIMATION =====
class RollingDrumAnimation {
    constructor() {
        this.drumWithLogo = document.getElementById('drumWithLogo');
        this.drumWithoutLogo = document.getElementById('drumWithoutLogo');
        this.drumWrapper = this.drumWithLogo?.parentElement;
        this.drumSection = document.querySelector('.rolling-drum-section');
        this.drumSloganEl = document.getElementById('drumSlogan');
        this.sloganTextEl = document.getElementById('sloganText');
        this.lastScrollY = 0;
        this.position = 0;
        this.targetPosition = 0;
        this.rollCounter = 0;
        this.showingLogo = true;
        this.slogans = [
            'Fun fact: Our drums last longer than your coffee breaks ☕',
            'Rolling smooth — engineered for performance.',
            'Did you know? Proper lubrication extends life by 3×.',
            'Designed in Malaysia. Trusted worldwide.',
            'Pro tip: Store drums upright for longer life.'
        ];
        this.currentSloganIndex = 0;
        this.sloganTimeout = null;
        
        if (this.drumWithLogo && this.drumWithoutLogo && this.drumSection) {
            this.init();
        }
    }
    
    init() {
        // Initially show drum with logo, hide drum without logo
        this.drumWithLogo.classList.remove('hidden');
        this.drumWithoutLogo.classList.add('hidden');
        
        // Set initial position above the section (like it's coming from underneath the previous section)
        this.position = -400; // Start 400px above the section (updated size)
        this.targetPosition = -400;
        
        // Set initial transform
        if (this.drumWrapper) {
            this.drumWrapper.style.transform = `translateX(-50%) translateY(-400px)`;
        }
        
        // Add scroll event listener
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        
        // Start the animation loop
        this.animate();
        
        // Run initial scroll calculation
        this.handleScroll();
    }
    
    handleScroll() {
        if (!this.drumSection) return;
        
        const sectionRect = this.drumSection.getBoundingClientRect();
        const sectionTop = sectionRect.top + window.scrollY;
        const sectionHeight = sectionRect.height;
        const currentScrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        // Calculate when START marker is at center of screen
        const startMarkerPosition = sectionTop + 10; // START marker is 10px from section top
        const startTriggerPoint = startMarkerPosition - (viewportHeight / 2); // When START is at center
        
        // Calculate when END marker is at center of screen  
        const endMarkerPosition = sectionTop + sectionHeight - 10; // END marker is 10px from section bottom
        const endTriggerPoint = endMarkerPosition - (viewportHeight / 2); // When END is at center
        
        // Check if we're between start and end trigger points
        if (currentScrollY >= startTriggerPoint && currentScrollY <= endTriggerPoint) {
            
            // Calculate progress from when START marker hits center to when END marker hits center
            const totalScrollDistance = endTriggerPoint - startTriggerPoint;
            const currentScrollProgress = (currentScrollY - startTriggerPoint) / totalScrollDistance;
            
            // Clamp progress between 0 and 1
            const progress = Math.max(0, Math.min(1, currentScrollProgress));
            
            // Move drum from above the section to below the section
            // Start position: -400px (completely above section)
            // End position: sectionHeight + 400px (completely below section)
            const drumSize = 400; // Updated to match new drum size
            const startPos = -drumSize; // Start above the section
            const endPos = sectionHeight + drumSize; // End below the section
            const totalTravelDistance = endPos - startPos;
            
            this.targetPosition = startPos + (progress * totalTravelDistance);
            
            // Calculate how much we've scrolled and switch drum image more frequently
            const scrollDelta = Math.abs(currentScrollY - this.lastScrollY);
            if (scrollDelta > 20) { // Switch every 20px of scroll for more frequent switching
                this.rollCounter++;
                this.switchDrumImage(); // Switch on every roll event
                // show slogan briefly on scroll-driven "roll" events
                if (this.rollCounter % 3 === 0) { // Show slogan every 3rd roll
                    this.showSloganBriefly();
                }
            }
        } else if (currentScrollY < startTriggerPoint) {
            // Before start trigger - keep drum above the section
            this.targetPosition = -400; // Completely above section (updated size)
        } else if (currentScrollY > endTriggerPoint) {
            // After end trigger - keep drum below the section
            this.targetPosition = sectionHeight + 400; // Completely below section (updated size)
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    switchDrumImage() {
        if (this.showingLogo) {
            // Switch to drum without logo
            this.drumWithLogo.classList.add('hidden');
            this.drumWithoutLogo.classList.remove('hidden');
            this.showingLogo = false;
        } else {
            // Switch to drum with logo
            this.drumWithoutLogo.classList.add('hidden');
            this.drumWithLogo.classList.remove('hidden');
            this.showingLogo = true;
        }
    }

    showSloganBriefly() {
        if (!this.drumSloganEl || !this.sloganTextEl) return;

        // Update slogan text to next one
        this.currentSloganIndex = (this.currentSloganIndex + 1) % this.slogans.length;
        this.sloganTextEl.textContent = this.slogans[this.currentSloganIndex];

        // Make visible
        this.drumSloganEl.classList.remove('hide-up');
        this.drumSloganEl.classList.add('visible');
        this.drumSloganEl.setAttribute('aria-hidden', 'false');

        // Clear previous timeout
        if (this.sloganTimeout) clearTimeout(this.sloganTimeout);

        // Hide after 900ms
        this.sloganTimeout = setTimeout(() => {
            if (!this.drumSloganEl) return;
            this.drumSloganEl.classList.remove('visible');
            this.drumSloganEl.classList.add('hide-up');
            this.drumSloganEl.setAttribute('aria-hidden', 'true');
        }, 900);
    }
    
    animate() {
        // Smooth interpolation for position
        const easing = 0.08;
        this.position += (this.targetPosition - this.position) * easing;
        
        // Apply vertical movement to wrapper
        if (this.drumWrapper) {
            this.drumWrapper.style.transform = `translateX(-50%) translateY(${this.position}px)`;
        }
        
        // Continue animation
        requestAnimationFrame(this.animate.bind(this));
    }
}

// Initialize drum animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RollingDrumAnimation();
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});
