// Enhanced dropdown toggle function matching website UI
function toggleDropdown(id) {
    const dropdown = document.getElementById(`${id}-dropdown`);
    if (!dropdown) return;
    
    // Close all dropdowns first
    document.querySelectorAll('.dropdown-content').forEach(content => {
        if (content.id !== `${id}-dropdown`) {
            content.style.display = 'none';
            content.previousElementSibling.classList.remove('active');
        }
    });
    
    // Toggle current dropdown
    const button = dropdown.previousElementSibling;
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
        button.classList.remove('active');
    } else {
        dropdown.style.display = 'block';
        button.classList.add('active');
        
        // Ensure the industrial dropdown has the Fans and Blower Terms link
        if (id === 'industrial' && dropdown.children.length === 0) {
            const link = document.createElement('a');
            link.href = 'quiz-fans-blowers.html';
            link.textContent = 'Fans and Blower Terms';
            dropdown.appendChild(link);
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing quiz dropdowns');
    
    // Ensure the industrial dropdown has content
    const industrialDropdown = document.getElementById('industrial-dropdown');
    if (industrialDropdown) {
        console.log('Found industrial dropdown');
        
        // Make sure the link exists
        if (industrialDropdown.children.length === 0) {
            const link = document.createElement('a');
            link.href = 'quiz-fans-blowers.html';
            link.textContent = 'Fans and Blower Terms';
            industrialDropdown.appendChild(link);
            console.log('Added Fans and Blower Terms link');
        } else {
            console.log('Dropdown already has content:', industrialDropdown.children.length, 'items');
        }
    } else {
        console.error('Industrial dropdown not found');
    }
    
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
