function toggleDropdown(id) {
    // Close all other dropdowns first
    document.querySelectorAll('.dropdown-content').forEach(content => {
        if (content.id !== `${id}-dropdown`) {
            content.classList.remove('show');
            content.style.transform = '';
            content.style.opacity = '';
            
            // Reset the active state of the button
            const btn = content.previousElementSibling;
            if (btn) btn.classList.remove('active');
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
        button.classList.add('active');
        
        // Add ripple effect to button
        createRipple(event, button);
        
        // Add haptic feedback on mobile if supported
        if (window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    } else {
        // Closing animation
        dropdown.style.transform = 'translateY(-10px)';
        dropdown.style.opacity = '0';
        button.classList.remove('active');
        
        setTimeout(() => {
            dropdown.classList.remove('show');
        }, 300);
    }
}

// Create ripple effect
function createRipple(event, element) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    // Get position relative to the button
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.classList.add('ripple');
    
    // Remove existing ripples
    const ripple = element.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }
    
    element.appendChild(circle);
    
    // Remove the ripple after animation completes
    setTimeout(() => {
        circle.remove();
    }, 600);
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
    if (!event.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.style.transform = 'translateY(-10px)';
            dropdown.style.opacity = '0';
            
            // Reset the active state of the button
            const btn = dropdown.previousElementSibling;
            if (btn) btn.classList.remove('active');
            
            setTimeout(() => {
                dropdown.classList.remove('show');
            }, 300);
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

// Enhanced dropdown handling for mobile
function initializeDropdowns() {
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');
    
    // Close all dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.classList.remove('show');
            });
        }
    });
    
    // Toggle dropdown on button click
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const content = this.nextElementSibling;
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                if (dropdown !== content) {
                    dropdown.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            content.classList.toggle('show');
            
            // Scroll to make dropdown visible if needed
            if (content.classList.contains('show')) {
                // Ensure the dropdown is visible
                setTimeout(() => {
                    const rect = content.getBoundingClientRect();
                    const isInViewport = (
                        rect.top >= 0 &&
                        rect.left >= 0 &&
                        rect.bottom <= window.innerHeight &&
                        rect.right <= window.innerWidth
                    );
                    
                    if (!isInViewport) {
                        content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }, 100);
            }
        });
    });
    
    // Prevent clicks inside dropdown from closing it
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDropdowns();
});

// Add ripple style
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    </style>
`);

