// Medical Landing Page JavaScript

// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');
const modal = document.getElementById('appointmentModal');
const modalClose = document.getElementById('modalClose');
const appointmentForm = document.getElementById('appointmentForm');

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function () {
    lucide.createIcons();
    initializeApp();
});

// Initialize all app functionality
function initializeApp() {
    setupNavigation();
    setupModal();
    setupFormHandling();
    setupScrollAnimations();
    setupCounterAnimations();
    setupAppointmentButtons();
    setupDatePicker();
}

// Navigation Setup
function setupNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;

        if (scrolled > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Modal Setup
function setupModal() {
    // Open modal buttons
    const appointmentButtons = document.querySelectorAll('#bookAppointment, .nav-cta, .service-btn, .doctor-btn, .quick-book-btn');
    appointmentButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            openModal();
        });
    });

    // Close modal
    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Cancel button
    const cancelButton = document.getElementById('cancelAppointment');
    if (cancelButton) {
        cancelButton.addEventListener('click', closeModal);
    }
}

function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus on first input
    const firstInput = modal.querySelector('input[type="text"]');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    appointmentForm.reset();
    clearFormErrors();
}

// Form Handling
function setupFormHandling() {
    appointmentForm.addEventListener('submit', handleFormSubmission);

    // Real-time validation
    const inputs = appointmentForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // Service and doctor dependency
    const serviceSelect = document.getElementById('serviceSelect');
    const doctorSelect = document.getElementById('doctorSelect');

    serviceSelect.addEventListener('change', function () {
        updateDoctorOptions(this.value);
    });
}

function updateDoctorOptions(selectedService) {
    const doctorSelect = document.getElementById('doctorSelect');
    const doctorOptions = {
        'cardiology': [
            { value: 'ivanov', text: 'Д-р Иванов (Кардиолог)' }
        ],
        'neurology': [
            { value: 'smirnova', text: 'Д-р Смирнова (Невролог)' }
        ],
        'ophthalmology': [
            { value: 'petrov', text: 'Д-р Петров (Офтальмолог)' }
        ],
        'traumatology': [
            { value: 'kozlov', text: 'Д-р Козлов (Травматолог)' }
        ],
        'pediatrics': [
            { value: 'volkova', text: 'Д-р Волкова (Педиатр)' }
        ],
        'laboratory': [
            { value: 'any', text: 'Любой специалист' }
        ]
    };

    // Clear existing options except first
    doctorSelect.innerHTML = '<option value="">Выберите врача</option>';

    if (selectedService && doctorOptions[selectedService]) {
        doctorOptions[selectedService].forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.value;
            option.textContent = doctor.text;
            doctorSelect.appendChild(option);
        });
        doctorSelect.disabled = false;
    } else {
        doctorSelect.disabled = true;
    }
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    clearFieldError(field);

    // Validation rules
    switch (field.type) {
        case 'text':
            if (field.name === 'name') {
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Имя должно содержать минимум 2 символа';
                } else if (!/^[а-яё\s-]+$/i.test(value)) {
                    isValid = false;
                    errorMessage = 'Имя должно содержать только русские буквы';
                }
            }
            break;

        case 'tel':
            const phoneRegex = /^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный номер телефона';
            }
            break;

        case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный email адрес';
            }
            break;

        case 'date':
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                isValid = false;
                errorMessage = 'Дата не может быть в прошлом';
            }
            break;
    }

    // Check required fields
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Это поле обязательно для заполнения';
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');

    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    errorElement.innerHTML = `<i data-lucide="alert-circle" style="width: 16px; height: 16px;"></i>${message}`;

    field.parentNode.appendChild(errorElement);
    lucide.createIcons();

    // Add error styles to field
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
}

function clearFieldError(field) {
    if (typeof field === 'object' && field.target) {
        field = field.target;
    }

    field.classList.remove('error');
    field.style.borderColor = '';
    field.style.boxShadow = '';

    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function clearFormErrors() {
    const errorMessages = appointmentForm.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());

    const errorFields = appointmentForm.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
        field.style.borderColor = '';
        field.style.boxShadow = '';
    });
}

function handleFormSubmission(e) {
    e.preventDefault();

    // Validate all fields
    const fields = appointmentForm.querySelectorAll('input[required], select[required]');
    let isFormValid = true;

    fields.forEach(field => {
        if (!validateField({ target: field })) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
        return;
    }

    // Show loading state
    const submitButton = appointmentForm.querySelector('button[type="submit"]');
    const originalButtonContent = submitButton.innerHTML;
    submitButton.innerHTML = '<div class="spinner"></div> Отправка...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalButtonContent;
        submitButton.disabled = false;

        // Show success message
        showNotification('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
        closeModal();

        // Optional: Send data to server
        const formData = new FormData(appointmentForm);
        console.log('Form data:', Object.fromEntries(formData));
    }, 2000);
}

// Date Picker Setup
function setupDatePicker() {
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        // Set minimum date to today
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        dateInput.min = formattedDate;

        // Set default date to tomorrow
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add scroll animations to elements
    const animateElements = document.querySelectorAll('.service-card, .doctor-card');
    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 100}ms`;
        observer.observe(el);
    });
}

// Counter Animations
function setupCounterAnimations() {
    function animateCounter(element, start, end, duration, suffix = '') {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);

            if (suffix === '+') {
                element.textContent = current.toLocaleString('ru-RU') + '+';
            } else {
                element.textContent = current + suffix;
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    if (text.includes('15,000+')) {
                        animateCounter(stat, 0, 15000, 2000, '+');
                    } else if (text.includes('12')) {
                        animateCounter(stat, 0, 12, 1500);
                    } else if (text.includes('24/7')) {
                        stat.textContent = '24/7';
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
}

// Appointment Buttons Setup
function setupAppointmentButtons() {
    // Emergency call button
    const emergencyButton = document.getElementById('emergencyCall');
    if (emergencyButton) {
        emergencyButton.addEventListener('click', function (e) {
            e.preventDefault();
            showNotification('Экстренная служба: +7 (495) 911-22-33', 'info');

            // Optionally open phone dialer
            if (confirm('Хотите позвонить в экстренную службу?')) {
                window.location.href = 'tel:+74959112233';
            }
        });
    }

    // Service buttons - populate form with selected service
    const serviceButtons = document.querySelectorAll('.service-btn');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Get service info from the card
            const serviceCard = this.closest('.service-card');
            const serviceTitle = serviceCard.querySelector('.service-title').textContent;

            // Open modal and pre-select service
            openModal();

            setTimeout(() => {
                const serviceSelect = document.getElementById('serviceSelect');
                const serviceMap = {
                    'Кардиология': 'cardiology',
                    'Неврология': 'neurology',
                    'Офтальмология': 'ophthalmology',
                    'Травматология': 'traumatology',
                    'Педиатрия': 'pediatrics',
                    'Лабораторная диагностика': 'laboratory'
                };

                const serviceValue = serviceMap[serviceTitle];
                if (serviceValue) {
                    serviceSelect.value = serviceValue;
                    updateDoctorOptions(serviceValue);
                }
            }, 100);
        });
    });

    // Doctor buttons - populate form with selected doctor
    const doctorButtons = document.querySelectorAll('.doctor-btn');
    doctorButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Get doctor info from the card
            const doctorCard = this.closest('.doctor-card');
            const doctorName = doctorCard.querySelector('.doctor-name').textContent;
            const doctorSpecialty = doctorCard.querySelector('.doctor-specialty').textContent;

            // Open modal and pre-select doctor
            openModal();

            setTimeout(() => {
                // Set service based on specialty
                const serviceSelect = document.getElementById('serviceSelect');
                const specialtyMap = {
                    'Кардиолог': 'cardiology',
                    'Невролог': 'neurology',
                    'Офтальмолог': 'ophthalmology',
                    'Травматолог': 'traumatology',
                    'Педиатр': 'pediatrics'
                };

                const serviceValue = specialtyMap[doctorSpecialty];
                if (serviceValue) {
                    serviceSelect.value = serviceValue;
                    updateDoctorOptions(serviceValue);

                    // Select the doctor after options are updated
                    setTimeout(() => {
                        const doctorSelect = document.getElementById('doctorSelect');
                        const doctorMap = {
                            'Д-р Алексей Иванов': 'ivanov',
                            'Д-р Елена Смирнова': 'smirnova',
                            'Д-р Михаил Петров': 'petrov'
                        };

                        const doctorValue = doctorMap[doctorName];
                        if (doctorValue) {
                            doctorSelect.value = doctorValue;
                        }
                    }, 50);
                }
            }, 100);
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" type="button">
                <i data-lucide="x"></i>
            </button>
        </div>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Initialize icons
    lucide.createIcons();

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto hide after 5 seconds
    const autoHideTimeout = setTimeout(() => {
        hideNotification(notification);
    }, 5000);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoHideTimeout);
        hideNotification(notification);
    });

    // Close on click outside
    notification.addEventListener('click', (e) => {
        if (e.target === notification) {
            clearTimeout(autoHideTimeout);
            hideNotification(notification);
        }
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Floating Animation for Medical Icons
function setupFloatingAnimations() {
    const floatingElements = document.querySelectorAll('.medical-icon, .appointment-card');

    floatingElements.forEach((element, index) => {
        // Add random delay to make animations more organic
        const delay = Math.random() * 2;
        element.style.animationDelay = `${delay}s`;

        // Add mouse interaction
        element.addEventListener('mouseenter', function () {
            this.style.animationPlayState = 'paused';
        });

        element.addEventListener('mouseleave', function () {
            this.style.animationPlayState = 'running';
        });
    });
}

// Doctor Status Updates (simulated)
function setupDoctorStatusUpdates() {
    const doctorStatuses = document.querySelectorAll('.doctor-status');

    // Simulate real-time status updates
    setInterval(() => {
        doctorStatuses.forEach(status => {
            // Random chance to change status
            if (Math.random() < 0.1) {
                const isOnline = Math.random() > 0.3;
                status.className = `doctor-status ${isOnline ? 'online' : 'busy'}`;
            }
        });
    }, 30000); // Update every 30 seconds
}

// Scroll Progress Indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';

    // Add styles for scroll progress
    const progressStyles = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(6, 182, 212, 0.1);
            z-index: 9999;
            pointer-events: none;
        }
        
        .scroll-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #06b6d4, #10b981);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;

    if (!document.querySelector('#scroll-progress-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'scroll-progress-styles';
        styleSheet.textContent = progressStyles;
        document.head.appendChild(styleSheet);
    }

    document.body.appendChild(progressBar);

    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        const progressBarElement = document.querySelector('.scroll-progress-bar');
        if (progressBarElement) {
            progressBarElement.style.width = Math.min(scrollPercent, 100) + '%';
        }
    });
}

// Phone Number Formatting
function setupPhoneFormatting() {
    const phoneInput = document.getElementById('patientPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.length <= 1) {
                    value = '+7 (' + value;
                } else if (value.length <= 4) {
                    value = '+7 (' + value.slice(1);
                } else if (value.length <= 7) {
                    value = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4);
                } else if (value.length <= 9) {
                    value = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4, 7) + '-' + value.slice(7);
                } else {
                    value = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4, 7) + '-' + value.slice(7, 9) + '-' + value.slice(9, 11);
                }
            }

            e.target.value = value;
        });
    }
}

// Service Worker Registration (for offline functionality)
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw.js')
                .then(function (registration) {
                    console.log('SW registered: ', registration);
                }, function (registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Accessibility Improvements
function setupAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#hero';
    skipLink.textContent = 'Перейти к основному содержанию';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #06b6d4;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', function () {
        this.style.top = '6px';
    });

    skipLink.addEventListener('blur', function () {
        this.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Announce page changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(announcer);

    window.announceToScreenReader = function (message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

// Error Handling
window.addEventListener('error', function (e) {
    console.error('JavaScript error:', e.error);
    showNotification('Произошла ошибка. Пожалуйста, обновите страницу.', 'error');
});

// Handle offline/online status
window.addEventListener('online', function () {
    showNotification('Соединение восстановлено', 'success');
});

window.addEventListener('offline', function () {
    showNotification('Нет соединения с интернетом', 'error');
});

// Performance monitoring
function setupPerformanceMonitoring() {
    // Measure page load time
    window.addEventListener('load', function () {
        setTimeout(function () {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            console.log(`Page load time: ${loadTime}ms`);

            if (loadTime > 3000) {
                console.warn('Slow page load detected');
            }
        }, 0);
    });
}

// Initialize additional features after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    setupFloatingAnimations();
    setupDoctorStatusUpdates();
    createScrollProgress();
    setupPhoneFormatting();
    setupServiceWorker();
    setupAccessibility();
    setupPerformanceMonitoring();
});

// Throttle function for performance optimization
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

// Debounce function for search/input optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Console styling for developers
console.log(
    '%c🏥 МедЦентр Landing Page',
    'color: #06b6d4; font-size: 24px; font-weight: bold;'
);
console.log(
    '%cДобро пожаловать в консоль разработчика!',
    'color: #10b981; font-size: 16px;'
);
console.log(
    '%cЕсли вы видите это сообщение, значит вы разбираетесь в веб-разработке. Присоединяйтесь к нашей команде!',
    'color: #666; font-size: 14px;'
);

// Export functions for testing (if in development environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        formatPhone: setupPhoneFormatting,
        showNotification,
        hideNotification
    };
}