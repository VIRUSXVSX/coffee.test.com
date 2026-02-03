document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Active Link Highlighting ---
    const currentPath = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(link => {
        // Simple check: if href matches filename, add active
        if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });

    // --- Compare Page Accordion Logic ---
    const sectionRows = document.querySelectorAll('.section-row');
    sectionRows.forEach(row => {
        row.addEventListener('click', () => {
            const icon = row.querySelector('i');
            // In a real table this is tricky, but for grid/flex layout:
            // This is a visual toggle placeholder. 
            // Real implementation would hide next sibling elements until next section-row
            if (icon.classList.contains('fa-chevron-down')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
});
















    // Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-toggle-btn');
const navMenu = document.querySelector('.nav-menu');

if(mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Toggle Icon
        const icon = mobileBtn.querySelector('i');
        if(navMenu.classList.contains('active')){
            icon.classList.remove('ri-menu-4-line');
            icon.classList.add('ri-close-line');
        } else {
            icon.classList.add('ri-menu-4-line');
            icon.classList.remove('ri-close-line');
        }
    });
}
















