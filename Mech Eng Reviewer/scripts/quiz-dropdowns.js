// Enhanced dropdown toggle function matching website UI
function toggleDropdown(id) {
    const dropdown = document.getElementById(`${id}-dropdown`);
    if (!dropdown) {
        console.error(`Dropdown with id ${id}-dropdown not found`);
        return;
    }
    
    const button = dropdown.previousElementSibling;
    
    // Close all other dropdowns
    document.querySelectorAll('.dropdown-content').forEach(content => {
        if (content.id !== `${id}-dropdown` && content.classList.contains('show')) {
            content.classList.remove('show');
            content.style.display = 'none';
            
            // Reset the active state of other buttons
            const otherBtn = content.previousElementSibling;
            if (otherBtn) otherBtn.classList.remove('active');
        }
    });

    // Toggle the clicked dropdown
    if (dropdown.style.display !== 'block') {
        // Opening dropdown
        dropdown.style.display = 'block';
        button.classList.add('active');
        
        // Ensure the link is present for industrial dropdown
        if (id === 'industrial') {
            // Clear existing content first to avoid duplicates
            dropdown.innerHTML = '';
            
            // Add the link
            const link = document.createElement('a');
            link.href = 'quiz-fans-blowers.html';
            link.textContent = 'Fans and Blower Terms';
            dropdown.appendChild(link);
            console.log('Added Fans and Blower Terms link');
        }
    } else {
        // Closing dropdown
        dropdown.style.display = 'none';
        button.classList.remove('active');
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing quiz dropdowns');
    
    // Ensure the industrial dropdown has content
    const industrialDropdown = document.getElementById('industrial-dropdown');
    if (industrialDropdown) {
        console.log('Found industrial dropdown');
        
        // Clear existing content and add the link
        industrialDropdown.innerHTML = '';
        const link = document.createElement('a');
        link.href = 'quiz-fans-blowers.html';
        link.textContent = 'Fans and Blower Terms';
        industrialDropdown.appendChild(link);
        console.log('Added Fans and Blower Terms link');
    } else {
        console.error('Industrial dropdown not found');
    }
    
    // Prevent dropdown buttons from triggering document click
    document.querySelectorAll('.dropdown-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Stop event from bubbling up
            
            // Extract the ID from the button
            const id = this.textContent.trim().includes('Industrial') ? 'industrial' : 'powerplant';
            toggleDropdown(id);
        });
    });
    
    // Prevent clicks inside dropdown content from closing it
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation(); // Stop event from bubbling up
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                dropdown.style.display = 'none';
                dropdown.previousElementSibling.classList.remove('active');
            });
        }
    });
});


