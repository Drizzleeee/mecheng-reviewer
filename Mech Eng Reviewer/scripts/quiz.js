function toggleDropdown(id) {
    // Close all dropdowns first
    const allDropdowns = document.querySelectorAll('.dropdown-content');
    const allButtons = document.querySelectorAll('.dropdown-btn');
    
    allDropdowns.forEach(dropdown => {
        if (dropdown.id !== `${id}-dropdown`) {
            dropdown.classList.remove('show');
            dropdown.style.transform = 'translateY(-10px)';
            dropdown.style.opacity = '0';
        }
    });
    
    allButtons.forEach(button => {
        if (!button.getAttribute('onclick').includes(id)) {
            button.classList.remove('active');
        }
    });

    // Toggle the clicked dropdown
    const dropdown = document.getElementById(`${id}-dropdown`);
    const button = dropdown.previousElementSibling;
    
    if (!dropdown.classList.contains('show')) {
        // Opening animation
        dropdown.classList.add('show');
        dropdown.style.transform = 'translateY(0)';
        dropdown.style.opacity = '1';
        
        // Add ripple effect to button
        createRipple(event, button);
    } else {
        // Closing animation
        dropdown.style.transform = 'translateY(-10px)';
        dropdown.style.opacity = '0';
        setTimeout(() => {
            dropdown.classList.remove('show');
        }, 300);
    }
    
    button.classList.toggle('active');
}

// Create ripple effect
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add hover effect for dropdown items
document.querySelectorAll('.dropdown-content a').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(10px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// Add focus states for accessibility
document.querySelectorAll('.dropdown-btn').forEach(button => {
    button.addEventListener('focus', function() {
        this.classList.add('focused');
    });
    
    button.addEventListener('blur', function() {
        this.classList.remove('focused');
    });
});

// Add keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openDropdowns = document.querySelectorAll('.dropdown-content.show');
        openDropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
            dropdown.previousElementSibling.classList.remove('active');
        });
    }
});

// Add hover sound effect (subtle)
function playHoverSound() {
    const hoverSound = new Audio('assets/hover.mp3'); // You'll need to add this sound file
    hoverSound.volume = 0.1;
    hoverSound.play();
}

document.querySelectorAll('.dropdown-btn').forEach(button => {
    button.addEventListener('mouseenter', playHoverSound);
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.matches('.dropdown-btn') && !event.target.matches('.dropdown-icon')) {
        const dropdowns = document.querySelectorAll('.dropdown-content');
        const buttons = document.querySelectorAll('.dropdown-btn');
        
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        
        buttons.forEach(button => {
            button.classList.remove('active');
        });
    }
});

// Prevent dropdown from closing when clicking inside it
document.querySelectorAll('.dropdown-content').forEach(dropdown => {
    dropdown.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

// Mobile touch handling and gestures
class TouchHandler {
    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.threshold = 50; // minimum distance for swipe
        this.restraint = 100; // maximum deviation in perpendicular direction
        
        this.init();
    }

    init() {
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
    }

    handleTouchStart(evt) {
        const touch = evt.touches[0];
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.lastTouch = Date.now();
    }

    handleTouchMove(evt) {
        if (!this.startX || !this.startY) return;

        const touch = evt.touches[0];
        const deltaX = this.startX - touch.clientX;
        const deltaY = this.startY - touch.clientY;

        // Prevent page scroll if interacting with dropdown
        if (evt.target.closest('.dropdown-content')) {
            evt.preventDefault();
        }
    }

    handleTouchEnd(evt) {
        const touch = evt.changedTouches[0];
        const deltaX = this.startX - touch.clientX;
        const deltaY = this.startY - touch.clientY;
        const timeDiff = Date.now() - this.lastTouch;

        // Handle swipe gestures
        if (timeDiff < 250) { // Quick swipe
            if (Math.abs(deltaX) >= this.threshold && Math.abs(deltaY) <= this.restraint) {
                if (deltaX > 0) {
                    this.handleSwipeLeft();
                } else {
                    this.handleSwipeRight();
                }
            }
        }

        // Reset values
        this.startX = this.startY = 0;
    }

    handleSwipeLeft() {
        const openDropdowns = document.querySelectorAll('.dropdown-content.show');
        openDropdowns.forEach(dropdown => {
            closeDropdownWithAnimation(dropdown);
        });
    }

    handleSwipeRight() {
        // Custom swipe right behavior
    }
}

// Enhanced dropdown handling for mobile
function closeDropdownWithAnimation(dropdown) {
    dropdown.style.transform = 'translateX(-10px)';
    dropdown.style.opacity = '0';
    
    setTimeout(() => {
        dropdown.classList.remove('show');
        dropdown.style.transform = '';
        dropdown.style.opacity = '';
    }, 300);
}

// Mobile-specific optimizations
function initializeMobileOptimizations() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (isMobile) {
        // Add touch feedback
        document.querySelectorAll('.dropdown-btn, .dropdown-content a').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });

            element.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });

        // Optimize scroll performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            document.body.classList.add('is-scrolling');

            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('is-scrolling');
            }, 150);
        }, { passive: true });

        // Add pull-to-refresh resistance
        let startY;
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].pageY;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            const y = e.touches[0].pageY;
            const scrollTop = window.pageYOffset;
            
            if (scrollTop <= 0 && y > startY) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

// Initialize mobile features
document.addEventListener('DOMContentLoaded', () => {
    new TouchHandler();
    initializeMobileOptimizations();
    
    // Check for viewport height changes (mobile keyboard)
    const viewportHandler = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    window.addEventListener('resize', viewportHandler);
    viewportHandler();
});

// Enhance existing dropdown functionality for mobile
const enhanceDropdownForMobile = () => {
    document.querySelectorAll('.dropdown-btn').forEach(button => {
        // Add haptic feedback (if supported)
        button.addEventListener('touchstart', () => {
            if (window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        });

        // Improve touch target size
        button.style.minHeight = '44px';
        button.style.minWidth = '44px';
    });
};

enhanceDropdownForMobile();

