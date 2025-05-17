document.addEventListener('DOMContentLoaded', function() {
    // Function to handle responsive layout
    function handleResponsiveLayout() {
        const isMobile = window.innerWidth <= 768;
        const logoContainer = document.querySelector('.logo-container');
        const mobileElements = document.querySelectorAll('.header-top, .site-title, .title-underline');
        
        if (isMobile) {
            // Mobile view
            if (logoContainer) logoContainer.style.display = 'none';
            mobileElements.forEach(el => {
                if (el) el.style.display = 'block';
            });
        } else {
            // Desktop view
            if (logoContainer) logoContainer.style.display = 'flex';
            mobileElements.forEach(el => {
                if (el) el.style.display = 'none';
            });
        }
    }
    
    // Initial call
    handleResponsiveLayout();
    
    // Listen for window resize
    window.addEventListener('resize', handleResponsiveLayout);
    
    // Get current page URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Set active class on current nav button
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        if (button.getAttribute('href') === currentPage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
});
