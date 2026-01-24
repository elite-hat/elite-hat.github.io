const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const currentYear = document.getElementById('currentYear');

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initSmoothScrolling();
    initNavbarScroll();
    initContactForm();
    setCurrentYear();
});

function initNavbar() {
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// ============================================
// Navbar Scroll Effect
// ============================================

function initNavbarScroll() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for shadow effect
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// Smooth Scrolling for Anchor Links
// ============================================

function initSmoothScrolling() {
    // Handle all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#' || href === '') {
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Calculate offset for fixed navbar
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Scroll-Based Animations
// ============================================

function initScrollAnimations() {
    // Get all elements with fade-in-up class
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    // Create Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ============================================
// Contact Form Handling
// ============================================

function initContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !message) {
        showFormMessage('Please fill in all fields.', 'error');
        return;
    }
    
    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    // In a production environment, this would send data to a backend
    showFormMessage('Thank you for your message! (This is a demo - form would connect to backend in production)', 'success');
    
    // Reset form
    contactForm.reset();
    
    // Log form data (for demonstration - remove in production)
    console.log('Form submitted:', {
        name,
        email,
        message
    });
}

function showFormMessage(message, type) {
    // Remove existing message if any
    const existingMessage = contactForm.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('p');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    messageEl.style.marginTop = '1rem';
    messageEl.style.padding = '0.75rem';
    messageEl.style.borderRadius = '8px';
    messageEl.style.fontSize = '0.9rem';
    
    if (type === 'success') {
        messageEl.style.backgroundColor = '#d1fae5';
        messageEl.style.color = '#065f46';
        messageEl.style.border = '1px solid #6ee7b7';
    } else {
        messageEl.style.backgroundColor = '#fee2e2';
        messageEl.style.color = '#991b1b';
        messageEl.style.border = '1px solid #fca5a5';
    }
    
    // Insert message after submit button
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.parentNode.insertBefore(messageEl, submitButton.nextSibling);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// ============================================
// Set Current Year in Footer
// ============================================

function setCurrentYear() {
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

// ============================================
// Active Navigation Link Highlighting
// ============================================

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + navbar.offsetHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Update active link on scroll
window.addEventListener('scroll', updateActiveNavLink);

// ============================================
// Performance Optimization: Throttle Scroll Events
// ============================================

function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const throttledNavbarScroll = throttle(() => {
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 100);

window.addEventListener('scroll', throttledNavbarScroll);

document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

console.log('%c👋 Welcome to Elite Hat\'s Portfolio!', 'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with HTML, CSS, and Vanilla JavaScript', 'color: #64748b; font-size: 12px;');
console.log('%cGitHub: https://github.com/elite-hat', 'color: #2563eb; font-size: 12px;');

