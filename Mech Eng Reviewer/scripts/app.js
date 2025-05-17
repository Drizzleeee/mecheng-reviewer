// Debug manifest loading
const manifestLink = document.querySelector('link[rel="manifest"]');
if (manifestLink) {
  console.log('Manifest link found:', manifestLink.href);
  fetch(manifestLink.href)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Manifest fetch failed: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Manifest loaded successfully:', data);
      if (data.icons && data.icons.length > 0) {
        console.log('Icons found in manifest:', data.icons);
        // Test if icons are accessible
        data.icons.forEach(icon => {
          const img = new Image();
          img.onload = () => console.log(`Icon loaded successfully: ${icon.src}`);
          img.onerror = () => console.error(`Failed to load icon: ${icon.src}`);
          img.src = icon.src;
        });
      } else {
        console.error('No icons found in manifest');
      }
    })
    .catch(error => {
      console.error('Error loading manifest:', error);
    });
} else {
  console.error('No manifest link found in document');
}

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// Add to home screen prompt handler
let deferredPrompt;
const addBtn = document.createElement('button');
addBtn.style.display = 'none';
addBtn.className = 'add-to-home';
addBtn.textContent = 'Add to Home Screen';
document.body.appendChild(addBtn);

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';
  addBtn.style.position = 'fixed';
  addBtn.style.bottom = '20px';
  addBtn.style.left = '50%';
  addBtn.style.transform = 'translateX(-50%)';
  addBtn.style.padding = '10px 20px';
  addBtn.style.backgroundColor = '#FF6B2B';
  addBtn.style.color = 'white';
  addBtn.style.border = 'none';
  addBtn.style.borderRadius = '5px';
  addBtn.style.zIndex = '9999';

  addBtn.addEventListener('click', () => {
    // Hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});

// For iOS devices (which don't support beforeinstallprompt)
// Check if the device is iOS and not in standalone mode
if (
  (navigator.standalone === false || 
   (window.matchMedia('(display-mode: browser)').matches && 
    !window.matchMedia('(display-mode: standalone)').matches)) && 
  (/iPhone|iPad|iPod/.test(navigator.userAgent) || 
   /Mac/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
) {
  // Create iOS instruction element
  const iosPrompt = document.createElement('div');
  iosPrompt.className = 'ios-prompt';
  iosPrompt.innerHTML = `
    <div style="background-color: rgba(255, 107, 43, 0.9); color: white; padding: 15px; position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999; text-align: center; font-family: 'Inter', sans-serif;">
      <p>Install this app on your device: tap <strong>Share</strong> <span style="font-size: 1.2em;">↑</span> then <strong>Add to Home Screen</strong> <span style="font-size: 1.2em;">+</span></p>
      <button style="background: white; color: #FF6B2B; border: none; padding: 5px 10px; margin-top: 5px; border-radius: 5px;">Close</button>
    </div>
  `;
  
  // Add to DOM after a delay
  setTimeout(() => {
    document.body.appendChild(iosPrompt);
    
    // Add close button functionality
    const closeButton = iosPrompt.querySelector('button');
    closeButton.addEventListener('click', () => {
      iosPrompt.remove();
      // Store in localStorage that the user has seen the prompt
      localStorage.setItem('iosPromptSeen', 'true');
    });
  }, 2000);
}

// Update any references to the app name
const APP_NAME = 'ME Reviewer';

// For example, if there's a welcome message or similar:
function showWelcomeMessage() {
    alert(`Welcome to ${APP_NAME}!`);
}

// If there are any other references to the app name, update them here

// Enhanced mobile navigation experience
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to navigation buttons on mobile
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Add haptic feedback if supported
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    });
    
    // Highlight current page in navigation
    const currentPath = window.location.pathname;
    navButtons.forEach(button => {
        const href = button.getAttribute('href');
        if (currentPath.endsWith(href)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
});

