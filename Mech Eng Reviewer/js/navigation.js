document.addEventListener('DOMContentLoaded', function() {
    // Get current page URL
    const currentPage = window.location.pathname.split('/').pop();
    
    // Set appropriate class for sliding indicator
    const navLinks = document.querySelector('.nav-links');
    if (currentPage === 'courses.html') {
        navLinks.classList.add('courses-active');
    } else if (currentPage === 'quiz.html') {
        navLinks.classList.add('quiz-active');
    }
    
    // Set active class on current nav button
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        if (button.getAttribute('href') === currentPage || 
            (currentPage === '' && button.getAttribute('href') === 'index.html')) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
});