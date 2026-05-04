// ===== Ultra-Smooth Scrolling =====
class SmoothScroll {
    constructor() {
        this.targetY = window.scrollY;
        this.currentY = window.scrollY;
        this.easing = 0.075; // Adjust this (0.05 to 0.1) for different levels of "smoothness"
        this.isScrolling = false;
        
        this.init();
    }

    init() {
        window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
        window.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                this.targetY = window.scrollY;
                this.currentY = window.scrollY;
            }
        });
        this.animate();
    }

    onWheel(e) {
        e.preventDefault();
        this.isScrolling = true;
        this.targetY += e.deltaY;
        this.targetY = Math.max(0, Math.min(this.targetY, document.documentElement.scrollHeight - window.innerHeight));
    }

    animate() {
        const diff = this.targetY - this.currentY;
        if (Math.abs(diff) > 0.1) {
            this.currentY += diff * this.easing;
            window.scrollTo(0, this.currentY);
        } else {
            this.isScrolling = false;
        }
        requestAnimationFrame(() => this.animate());
    }

    scrollTo(targetY) {
        this.isScrolling = true;
        this.targetY = targetY;
    }
}

const smoother = new SmoothScroll();

// ===== Dark Mode Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

// ===== Hydration Calculator =====
const weightInput = document.getElementById('weight');
const activitySelect = document.getElementById('activity');
const calculateBtn = document.getElementById('calculate-btn');
const calcResult = document.getElementById('calc-result');
const waterValue = document.getElementById('water-value');
const glassesValue = document.getElementById('glasses-value');
const resultPlaceholder = calcResult.querySelector('.result-placeholder');
const resultDisplay = calcResult.querySelector('.result-display');

calculateBtn.addEventListener('click', () => {
    const weight = parseFloat(weightInput.value);
    const activity = activitySelect.value;
    
    if (!weight || weight < 20 || weight > 300) {
        alert('Please enter a valid weight between 20kg and 300kg');
        return;
    }
    
    // Base calculation: 35ml per kg of body weight
    let liters = (weight * 35) / 1000;
    
    // Add based on activity level
    const activityMultipliers = {
        'sedentary': 0,
        'light': 0.3,
        'moderate': 0.6,
        'active': 1.0
    };
    
    liters += activityMultipliers[activity];
    
    // Animate the result
    resultPlaceholder.classList.add('hidden');
    resultDisplay.classList.remove('hidden');
    
    // Simple counter animation for liters
    let currentLiters = 0;
    const targetLiters = liters;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = progress * targetLiters;
        waterValue.textContent = currentValue.toFixed(1);
        glassesValue.textContent = Math.round(currentValue / 0.25);
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
});

// ===== Preloader =====
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1500);
});

// ===== Navbar Scroll Effect =====
const navbar = document.querySelector('.navbar');
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        backToTop.classList.add('visible');
    } else {
        navbar.classList.remove('scrolled');
        backToTop.classList.remove('visible');
    }
});

// ===== Mobile Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== Typing Effect =====
const typingText = document.querySelector('.typing-text');
const texts = [
    'Nutritionist',
    'Diet Consultant',
    'Health Advisor',
    'Fitness Expert',
    'Food Scientist'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500; // Pause before next word
    }
    
    setTimeout(typeText, typingSpeed);
}

// Start typing effect after page loads
setTimeout(typeText, 2000);

// ===== Floating Particles =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ===== Scroll Animations =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate children with delay
            const children = entry.target.querySelectorAll('.animate-child');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('visible');
                }, index * 100);
            });
        }
    });
};

const observer = new IntersectionObserver(animateOnScroll, observerOptions);

// Add animation class to elements
document.querySelectorAll('.timeline-item, .edu-card, .project-card, .cert-card, .ref-card, .contact-item, .spec-card, .info-card, .skills-block, .calc-container').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

// ===== 3D Tilt Effect =====
function addTiltEffect(element) {
    let ticking = false;

    element.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                ticking = false;
            });
            ticking = true;
        }
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
}
// Apply tilt effect to cards
document.querySelectorAll('.spec-card, .edu-card-inner, .cert-card').forEach(card => {
    addTiltEffect(card);
});

// ===== Counter Animation =====
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            smoother.scrollTo(offsetPosition);
        }
    });
});

// ===== Back to Top =====
backToTop.addEventListener('click', () => {
    smoother.scrollTo(0);
});

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Create mailto link
    const mailtoLink = `mailto:nusrat.j.nisha@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    const button = contactForm.querySelector('.submit-btn');
    const originalText = button.innerHTML;
    button.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
    button.style.background = 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
        contactForm.reset();
    }, 3000);
});

// ===== Parallax Effect on Hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image-container');
    const heroText = document.querySelector('.hero-text');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroText.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// ===== Ripple Effect on Buttons =====
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    .btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// ===== Magnetic Effect on Social Links =====
document.querySelectorAll('.social-link, .social-btn').forEach(link => {
    link.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ===== Skills Tag Hover Effect =====
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = `translateY(-5px) scale(1.1) rotate(${Math.random() * 6 - 3}deg)`;
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ===== Timeline Animation =====
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, { threshold: 0.3 });

timelineItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
    timelineObserver.observe(item);
});

// ===== Floating Icon Random Movement =====
document.querySelectorAll('.float-icon').forEach(icon => {
    setInterval(() => {
        const randomX = Math.random() * 10 - 5;
        const randomY = Math.random() * 10 - 5;
        icon.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }, 2000);
});

// ===== Project Card Flip Sound Effect (Visual Feedback) =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.querySelector('.project-card-inner').style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
});

// ===== Dynamic Year in Footer =====
const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    footerYear.innerHTML = footerYear.innerHTML.replace('2026', currentYear);
}

// ===== Easter Egg - Konami Code =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Trigger celebration effect
            celebrateEffect();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function celebrateEffect() {
    const colors = ['#4CAF50', '#81C784', '#A5D6A7', '#8BC34A', '#66BB6A'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                pointer-events: none;
                z-index: 10000;
                animation: confetti-fall 3s ease-out forwards;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
    
    // Add confetti animation
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        @keyframes confetti-fall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(confettiStyle);
}

// ===== Lazy Load Images =====
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ===== Console Welcome Message =====
console.log('%c Welcome! ', 'background: linear-gradient(135deg, #4CAF50, #81C784); color: white; font-size: 20px; padding: 10px 20px; border-radius: 10px;');
console.log('%c Nusrat Jahan - Portfolio Website ', 'color: #4CAF50; font-size: 14px;');
console.log('%c Built with ❤️ using HTML, CSS & JavaScript ', 'color: #666; font-size: 12px;');
