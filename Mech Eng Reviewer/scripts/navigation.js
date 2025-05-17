document.addEventListener('DOMContentLoaded', function() {
    // Get current page URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Set active class on current nav button
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        const href = button.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (href === 'quiz.html' && currentPage.startsWith('quiz-'))) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Force layout refresh on page load
    const isMobile = window.innerWidth <= 768;
    const logoContainer = document.querySelector('.logo-container');
    const mobileElements = document.querySelectorAll('.header-top, .site-title, .title-underline');
    
    if (isMobile) {
        if (logoContainer) logoContainer.style.display = 'none';
        mobileElements.forEach(el => {
            if (el) el.style.display = 'block';
        });
    } else {
        if (logoContainer) logoContainer.style.display = 'flex';
        mobileElements.forEach(el => {
            if (el) el.style.display = 'none';
        });
    }
    
    // Fix for any duplicate ME REVIEWER text that might be in the DOM
    const extraTitles = document.querySelectorAll('.navbar > .me-reviewer-text');
    extraTitles.forEach(el => {
        if (el) el.style.display = 'none';
    });
});


