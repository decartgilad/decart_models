// Decart Website Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile detection
    const isMobile = window.innerWidth <= 768;
    const isTouch = 'ontouchstart' in window;
    
    // CTA Button Click Handler
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Add haptic feedback on mobile
            if (navigator.vibrate && isMobile) {
                navigator.vibrate(50);
            }
            // Add your booking logic here
            console.log('Book a meeting clicked');
            // Example: window.open('https://calendly.com/your-link', '_blank');
        });
    }
    
    // Twitter Button Click Handler
    const twitterButton = document.querySelector('.twitter-button');
    if (twitterButton) {
        twitterButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (navigator.vibrate && isMobile) {
                navigator.vibrate(30);
            }
            window.open('https://twitter.com/decartai', '_blank');
        });
    }
    
    // Navigation Menu Active State
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Haptic feedback on mobile
            if (navigator.vibrate && isMobile) {
                navigator.vibrate(30);
            }
            
            // Add your navigation logic here
            console.log('Navigation clicked:', this.textContent);
        });
    });
    
    // Smooth animations on load
    const hero = document.querySelector('.hero');
    const sidebar = document.querySelector('.sidebar');
    const twitterBtn = document.querySelector('.twitter-button');
    
    // Add fade-in animation
    setTimeout(() => {
        if (hero) hero.style.opacity = '1';
        if (sidebar) sidebar.style.opacity = '1';
        if (twitterBtn) twitterBtn.style.opacity = '1';
    }, 100);
    
    // Touch and hover effects
    const interactiveElements = document.querySelectorAll('.cta-button, .twitter-button, .nav-item');
    interactiveElements.forEach(element => {
        
        // Touch events for mobile
        if (isTouch) {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.transition = 'transform 0.1s ease';
            });
            
            element.addEventListener('touchend', function() {
                this.style.transform = 'translateY(0)';
            });
        }
        
        // Mouse events for desktop
        if (!isTouch) {
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        }
    });
    
    // Handle orientation change on mobile
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            window.scrollTo(0, 0);
            // Trigger a resize event to recalculate layout
            window.dispatchEvent(new Event('resize'));
        }, 100);
    });
    
    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Handle viewport height changes on mobile browsers
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
});
