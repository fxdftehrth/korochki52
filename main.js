// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    const header = document.querySelector('header');
    
    // Mobile menu functionality
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && mobileMenu && 
            !navMenu.contains(e.target) && 
            !mobileMenu.contains(e.target) &&
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#' || !targetId) return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after click
                if (navMenu) {
                    navMenu.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });

    // Form submission handler with validation
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        // Remove existing message if any
        const existingMessage = contactForm.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                email: document.getElementById('email').value.trim(),
                course: document.getElementById('course').value,
                message: document.getElementById('message').value.trim()
            };
            
            // Remove previous messages
            const prevMessage = contactForm.querySelector('.message');
            if (prevMessage) {
                prevMessage.remove();
            }
            
            // Validation
            let isValid = true;
            let errorMessage = '';

            if (!formData.name) {
                isValid = false;
                errorMessage = 'Пожалуйста, укажите ваше ФИО';
                highlightField('name');
            } else {
                removeHighlight('name');
            }

            if (!formData.phone) {
                isValid = false;
                errorMessage = 'Пожалуйста, укажите ваш телефон';
                highlightField('phone');
            } else if (!validatePhone(formData.phone)) {
                isValid = false;
                errorMessage = 'Пожалуйста, укажите корректный номер телефона';
                highlightField('phone');
            } else {
                removeHighlight('phone');
            }

            if (!formData.email) {
                isValid = false;
                errorMessage = 'Пожалуйста, укажите ваш email';
                highlightField('email');
            } else if (!validateEmail(formData.email)) {
                isValid = false;
                errorMessage = 'Пожалуйста, укажите корректный email адрес';
                highlightField('email');
            } else {
                removeHighlight('email');
            }

            if (!formData.course) {
                isValid = false;
                errorMessage = 'Пожалуйста, выберите курс';
                highlightField('course');
            } else {
                removeHighlight('course');
            }
            
            if (!isValid) {
                showMessage(contactForm, errorMessage, 'error');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.innerHTML = originalText + '<span class="loading"></span>';
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Here you would normally send the data to a server
                // Example: fetch('/api/submit', { method: 'POST', body: JSON.stringify(formData) })
                
                showMessage(contactForm, 'Спасибо за заявку! Мы свяжемся с вами в ближайшее время.', 'success');
                contactForm.reset();
                
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                // Scroll to message
                const message = contactForm.querySelector('.message');
                if (message) {
                    message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                
                // Remove highlights
                ['name', 'phone', 'email', 'course'].forEach(id => removeHighlight(id));
            }, 1500);
        });

        // Real-time validation
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const courseSelect = document.getElementById('course');

        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                if (this.value.trim() && !this.value.trim().match(/^[А-Яа-яЁё\s]{3,}$/)) {
                    highlightField('name');
                } else {
                    removeHighlight('name');
                }
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                // Format phone number
                let value = this.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value[0] === '8') value = '7' + value.slice(1);
                    if (value[0] !== '7') value = '7' + value;
                    if (value.length > 11) value = value.slice(0, 11);
                    
                    let formatted = '+7';
                    if (value.length > 1) formatted += ' (' + value.slice(1, 4);
                    if (value.length > 4) formatted += ') ' + value.slice(4, 7);
                    if (value.length > 7) formatted += '-' + value.slice(7, 9);
                    if (value.length > 9) formatted += '-' + value.slice(9, 11);
                    
                    this.value = formatted;
                }
            });

            phoneInput.addEventListener('blur', function() {
                if (this.value && !validatePhone(this.value)) {
                    highlightField('phone');
                } else {
                    removeHighlight('phone');
                }
            });
        }

        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (this.value && !validateEmail(this.value)) {
                    highlightField('email');
                } else {
                    removeHighlight('email');
                }
            });
        }

        if (courseSelect) {
            courseSelect.addEventListener('change', function() {
                if (this.value) {
                    removeHighlight('course');
                }
            });
        }
    }

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.course-card, .step, .about-content, .contact-content, .section-title');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Add stagger animation for course cards
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Add stagger animation for steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.style.transitionDelay = `${index * 0.15}s`;
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Add click animation to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Helper functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11 && cleaned[0] === '7';
}

function highlightField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#EF4444';
        field.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.1)';
    }
}

function removeHighlight(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }
}

function showMessage(form, message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type} show`;
    messageDiv.textContent = message;
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 5000);
}

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
