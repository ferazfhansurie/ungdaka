// Particle System
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.connectionDistance = 150;
        
        this.resizeCanvas();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
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
                size: Math.random() * 2 + 1
            });
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Keep particles within bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.5;
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw particles
        this.ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
        this.particles.forEach(particle => {
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

// Typing Animation
class TypeWriter {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.start();
    }
    
    start() {
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeSpeed = this.speed;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }
    
    init() {
        this.observeElements();
        this.updateProgressCircles();
        window.addEventListener('scroll', () => this.updateProgressCircles());
    }
    
    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        this.elements.forEach(el => observer.observe(el));
    }
    
    updateProgressCircles() {
        const circles = document.querySelectorAll('.stat-circle');
        circles.forEach(circle => {
            const rect = circle.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (inView) {
                const percent = circle.dataset.percent;
                circle.style.setProperty('--percent', `${percent * 3.6}deg`);
            }
        });
    }
}

// Smooth Scrolling
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Navigation Controller
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleActiveLinks();
        
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    handleMobileMenu() {
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            const icon = this.navToggle.querySelector('i');
            if (this.navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                const icon = this.navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
    
    handleActiveLinks() {
        const sections = document.querySelectorAll('section');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop && 
                    window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Mouse Interaction Effects
class MouseEffects {
    constructor() {
        this.init();
    }
    
    init() {
        // Magnetic effect for buttons
        const magneticElements = document.querySelectorAll('.btn, .social-link, .project-link');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = element.getBoundingClientRect();
                const centerX = left + width / 2;
                const centerY = top + height / 2;
                const deltaX = (e.clientX - centerX) * 0.15;
                const deltaY = (e.clientY - centerY) * 0.15;
                
                element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0px, 0px) scale(1)';
            });
        });
        
        // Parallax effect for floating cards
        const floatingCards = document.querySelectorAll('.floating-card');
        
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            floatingCards.forEach((card, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed * 20;
                const y = (mouseY - 0.5) * speed * 20;
                
                card.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
}

// Form Handler
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setupFormValidation();
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            this.form.reset();
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }, 2000);
    }
    
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        
        this.clearErrors(field);
        
        if (!value) {
            this.showError(field, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
            return false;
        }
        
        if (fieldName === 'email' && !this.isValidEmail(value)) {
            this.showError(field, 'Please enter a valid email address');
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showError(field, message) {
        field.style.borderColor = '#ef4444';
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.classList.add('error-message');
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: 0.8rem;
                margin-top: 0.5rem;
                display: block;
            `;
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    clearErrors(field) {
        field.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Preload critical resources
        this.preloadResources();
        
        // Monitor performance
        this.monitorPerformance();
    }
    
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    preloadResources() {
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource;
            document.head.appendChild(link);
        });
    }
    
    monitorPerformance() {
        // Monitor FPS
        let frames = 0;
        let lastTime = performance.now();
        
        const measureFPS = (currentTime) => {
            frames++;
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    console.warn('Low FPS detected:', fps);
                    this.optimizeForLowPerformance();
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    optimizeForLowPerformance() {
        // Reduce particle count
        const particleCanvas = document.getElementById('particles');
        if (particleCanvas && window.particleSystem) {
            window.particleSystem.particleCount = Math.max(20, window.particleSystem.particleCount * 0.7);
            window.particleSystem.createParticles();
        }
        
        // Disable some animations on low-end devices
        document.body.classList.add('reduce-motion');
    }
}

// Theme Controller
class ThemeController {
    constructor() {
        this.currentTheme = 'dark';
        this.init();
    }
    
    init() {
        this.applyTheme();
        this.setupThemeToggle();
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }
    
    setupThemeToggle() {
        // Add theme toggle button if needed
        const themeToggle = document.createElement('button');
        themeToggle.classList.add('theme-toggle');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.style.cssText = `
            position: fixed;
            top: 50%;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            color: #ffffff;
            cursor: pointer;
            display: none; // Hidden by default since we're using dark theme
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        document.body.appendChild(themeToggle);
        
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const particleCanvas = document.getElementById('particles');
    if (particleCanvas) {
        window.particleSystem = new ParticleSystem(particleCanvas);
    }
    
    // Initialize typing animation
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        new TypeWriter(typingElement, [
            'Software Engineer',
            'AI Specialist',
            'Mobile Developer',
            'Full Stack Developer',
            'Entrepreneur',
            'Problem Solver'
        ]);
    }
    
    // Initialize all other components
    new Navigation();
    new SmoothScroll();
    new ScrollAnimations();
    new MouseEffects();
    new ContactForm();
    new PerformanceMonitor();
    new ThemeController();
    
    // Add loading animation
    const loader = document.createElement('div');
    loader.classList.add('page-loader');
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    loader.innerHTML = `
        <div style="text-align: center; color: #ffffff;">
            <div style="width: 50px; height: 50px; border: 3px solid rgba(59, 130, 246, 0.3); border-top: 3px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <p>Loading Amazing Experience...</p>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(loader);
    
    // Hide loader after everything is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
                document.body.classList.add('loaded');
            }, 500);
        }, 1000);
    });
    
    // Add some advanced interactions
    setupAdvancedInteractions();
});

// Advanced Interactions
function setupAdvancedInteractions() {
    // Tilt effect for project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const rotateX = (e.clientY - centerY) / 10;
            const rotateY = (centerX - e.clientX) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    
    // Glitch effect for name on hover
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        heroName.addEventListener('mouseenter', () => {
            heroName.style.animation = 'glitch 0.3s ease-in-out';
            setTimeout(() => {
                heroName.style.animation = '';
            }, 300);
        });
    }
    
    // Add glitch keyframes
    const glitchStyle = document.createElement('style');
    glitchStyle.textContent = `
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
        
        .loaded {
            animation: fadeInUp 1s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(glitchStyle);
    
    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        konamiCode = konamiCode.slice(-konamiSequence.length);
        
        if (konamiCode.join('') === konamiSequence.join('')) {
            activateEasterEgg();
        }
    });
    
    function activateEasterEgg() {
        // Add rainbow theme temporarily
        document.body.style.filter = 'hue-rotate(0deg)';
        
        let hue = 0;
        const rainbowInterval = setInterval(() => {
            hue += 10;
            document.body.style.filter = `hue-rotate(${hue}deg)`;
            
            if (hue >= 360) {
                clearInterval(rainbowInterval);
                document.body.style.filter = '';
            }
        }, 100);
        
        // Show easter egg message
        const message = document.createElement('div');
        message.textContent = '🎉 You found the easter egg! 🎉';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #ffffff;
            padding: 2rem;
            border-radius: 10px;
            font-size: 1.5rem;
            text-align: center;
            z-index: 10000;
            animation: bounce 0.5s ease-in-out;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
    
    // Add bounce animation
    const bounceStyle = document.createElement('style');
    bounceStyle.textContent = `
        @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
                transform: translate(-50%, -50%) scale(1);
            }
            40%, 43% {
                transform: translate(-50%, -50%) scale(1.1);
            }
        }
    `;
    document.head.appendChild(bounceStyle);
}