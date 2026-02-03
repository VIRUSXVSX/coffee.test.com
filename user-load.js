import { auth, onAuthStateChanged } from './auth-service.js';

function initUserLoader() {
    // Listen for Authentication Status
    onAuthStateChanged(auth, (user) => {
        // Define Elements
        const navContainer = document.getElementById('navAuth');
        const sidebarName = document.getElementById('myName');     // <h2 id="myName">
        const sidebarImage = document.getElementById('myAvatar');  // <img id="myAvatar">

        if (user) {
            // --- LOGGED IN ---
            const name = user.displayName || "زبون";
            const img = user.photoURL || "images/user.png";

            // 1. Update Navbar (If exists)
            if (navContainer) {
                navContainer.innerHTML = `
                    <div class="nav-profile-box" onclick="window.location.href='profile.html'" title="حسابي">
                        <img src="${img}" class="nav-avatar-img" onerror="this.src='images/user.png'">
                        <span class="nav-username-text">${name}</span>
                    </div>
                `;
            }

            // 2. Update Sidebar Name (If exists)
            if (sidebarName) {
                sidebarName.textContent = name;
            }

            // 3. Update Sidebar Image (If exists)
            if (sidebarImage) {
                sidebarImage.src = img;
            }

            // Global Access (Optional)
            window.currentGahwaUser = user;

        } else {
            // --- LOGGED OUT ---
            // Update Navbar to Login Button
            if (navContainer) {
                navContainer.innerHTML = `
                    <a href="login.html" class="nav-login-btn">
                        دخول <i class="fa-solid fa-arrow-left"></i>
                    </a>
                `;
            }
            
            // Clear Sidebar Data (Optional)
            if (sidebarName) sidebarName.textContent = "...";
            if (sidebarImage) sidebarImage.src = "images/user.png";
        }
    });
}

// Run immediately if DOM is ready, or wait for it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUserLoader);
} else {
    initUserLoader();
}














{/* <aside class="profile-sidebar">
    <div class="profile-image-container">
        <img id="myAvatar" src="images/user.png" class="profile-img-lg">
    </div>
    
    <h2 id="myName">...</h2>
    
    <ul class="profile-menu">...</ul>
</aside>

<nav class="glass-nav">
   ...
   <div id="navAuth" class="auth-box"></div> 
   ...
</nav>

<script type="module" src="user-loader.js"></script> */}