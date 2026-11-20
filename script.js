/**
 * Maincrafts Technology - Web Scripting
 * Handles Navigation, Stats Counters, Form Validation, FAQs, and Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initStatsCounter();
    initFaqAccordion();
    initContactValidation();
    initNewsletterValidation();
    initScrollAnimations();
});

/**
 * 1. NAVIGATION & HAMBURGER MENU MANAGEMENT
 */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle Mobile Menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking any nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Set Active State based on current filename
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (pageName === linkPage || (pageName === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * 2. STICKY HEADER & BACK-TO-TOP BUTTON
 */
function initScrollEffects() {
    const header = document.querySelector('header');
    const backToTopBtn = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Sticky header transition
        if (header) {
            if (scrollPos > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to top appearance
        if (backToTopBtn) {
            if (scrollPos > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    // Smooth scroll back to top on click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * 3. ANIMATED STATISTICS COUNTER
 */
function initStatsCounter() {
    const statsSection = document.querySelector('.stats-grid');
    if (!statsSection) return;

    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // lower is faster

    const startCounting = (counter) => {
        const target = +counter.getAttribute('data-target');
        const updateCount = () => {
            const current = +counter.innerText.replace('+', '').replace('%', '');
            const increment = target / speed;

            if (current < target) {
                const nextVal = Math.ceil(current + increment);
                if (nextVal >= target) {
                    // Append signs properly
                    if (counter.getAttribute('data-type') === 'percent') {
                        counter.innerText = target + '%';
                    } else if (counter.getAttribute('data-type') === 'plus') {
                        counter.innerText = target + '+';
                    } else {
                        counter.innerText = target;
                    }
                } else {
                    counter.innerText = nextVal;
                    setTimeout(updateCount, 1);
                }
            } else {
                if (counter.getAttribute('data-type') === 'percent') {
                    counter.innerText = target + '%';
                } else if (counter.getAttribute('data-type') === 'plus') {
                    counter.innerText = target + '+';
                } else {
                    counter.innerText = target;
                }
            }
        };
        updateCount();
    };

    // Use Intersection Observer to animate only when scrolled into view
    const observerOptions = {
        root: null,
        threshold: 0.15
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => startCounting(counter));
                observer.unobserve(entry.target); // trigger animation only once
            }
        });
    }, observerOptions);

    statsObserver.observe(statsSection);
}

/**
 * 4. FAQ ACCORDION COLLAPSE/EXPAND
 */
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = question.nextElementSibling;
            
            // Toggle active state
            const isActive = faqItem.classList.contains('active');
            
            // Close other open FAQ items (optional but clean)
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                faqItem.classList.add('active');
                // Calculate and apply maximum height for smooth css transition
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                faqItem.classList.remove('active');
                answer.style.maxHeight = null;
            }
        });
    });
}

/**
 * 5. CONTACT FORM CLIENT-SIDE VALIDATION
 */
function initContactValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const successBanner = document.getElementById('formSuccessBanner');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;

        // Reset error messages and classes
        resetFormErrors([nameInput, emailInput, messageInput]);

        // Name Validation
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Name is required.');
            isValid = false;
        }

        // Email Validation
        const emailValue = emailInput.value.trim();
        if (!emailValue) {
            showError(emailInput, 'Email is required.');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError(emailInput, 'Please enter a valid email address.');
            isValid = false;
        }

        // Message Validation
        if (!messageInput.value.trim()) {
            showError(messageInput, 'Message cannot be empty.');
            isValid = false;
        }

        // If form checks pass, simulate success
        if (isValid) {
            // Hide potential old banner
            successBanner.style.display = 'none';

            // Show simulated loader or disable button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Show custom alert banner
                successBanner.style.display = 'flex';
                successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Clear fields
                contactForm.reset();

                // Alert the user via alert dialog
                alert('Success! Your message has been sent successfully. We will get back to you shortly.');

                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 1200);
        }
    });

    // Helper functions for validation UI
    function showError(inputEl, msg) {
        inputEl.classList.add('invalid');
        const errorEl = inputEl.nextElementSibling;
        if (errorEl && errorEl.classList.contains('form-error')) {
            errorEl.innerText = msg;
            errorEl.style.display = 'block';
        }
    }

    function resetFormErrors(inputs) {
        inputs.forEach(input => {
            input.classList.remove('invalid');
            const errorEl = input.nextElementSibling;
            if (errorEl && errorEl.classList.contains('form-error')) {
                errorEl.style.display = 'none';
            }
        });
        if (successBanner) {
            successBanner.style.display = 'none';
        }
    }

    function isValidEmail(email) {
        // RFC 5322 compliant regex check
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }
}

/**
 * 6. NEWSLETTER SUBSCRIPTION INTERACTION
 */
function initNewsletterValidation() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('.newsletter-input');
        const email = input.value.trim();

        if (!email) {
            alert('Please enter an email address.');
            return;
        }

        // basic validation
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!re.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        alert('Thank you for subscribing to our newsletter! Please check your email to confirm subscription.');
        newsletterForm.reset();
    });
}

/**
 * 7. SCROLL INTERSECTION REVEALS
 */
function initScrollAnimations() {
    const fadeEls = document.querySelectorAll('.fade-in-up');
    if (fadeEls.length === 0) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // keep layout static after reveal
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeEls.forEach(el => revealObserver.observe(el));
}
