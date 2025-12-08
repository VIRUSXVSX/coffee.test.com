// import { auth, onAuthStateChanged, getUserData } from './auth-service.js';

// async function initProfileNav() {
//     const navAuth = document.getElementById('navAuth');
//     if (!navAuth) return;

//     // Global listener to close dropdown when clicking outside
//     window.addEventListener('click', (e) => {
//         const dropdown = document.querySelector('.dropdown-content');
//         const profileBtn = document.querySelector('.profile-dropdown');
        
//         // If clicking outside the dropdown AND outside the button, close it
//         if (dropdown && dropdown.classList.contains('show')) {
//             if (!profileBtn.contains(e.target)) {
//                 dropdown.classList.remove('show');
//             }
//         }
//     });

//     onAuthStateChanged(auth, async (user) => {
//         if (user) {
//             // --- User is Logged In ---
//             let photoURL = user.photoURL || 'images/user.png';
//             let displayName = user.displayName || 'الزبون';

//             renderNav(navAuth, photoURL, displayName, true);

//             // Sync with DB
//             try {
//                 const result = await getUserData(user.uid);
//                 if (result.success && result.data && result.data.profileImage) {
//                     const imgTag = navAuth.querySelector('img');
//                     if (imgTag && result.data.profileImage !== photoURL) {
//                         imgTag.src = result.data.profileImage;
//                     }
//                 }
//             } catch (error) {
//                 console.warn("Minor sync error", error);
//             }

//         } else {
//             // --- User is Logged Out ---
//             renderNav(navAuth, null, null, false);
//         }
//     });
// }

// function renderNav(container, imageSrc, name, isLoggedIn) {
//     if (isLoggedIn) {
//         // Dropdown HTML Structure
//         container.innerHTML = `
//             <div class="profile-dropdown">
//                 <div class="user-avatar" style="cursor: pointer;">
//                     <img src="${imageSrc}" alt="${name}" title="${name}">
//                 </div>
//                 <div class="dropdown-content">
//                     <a href="profile.html"><i class="fa-solid fa-user"></i> الملف الشخصي</a>
//                     <hr>
//                     <a href="dashboard.html"><i class="fa-solid fa-mug-hot"></i> الصالة</a>
//                     <a href="settings.html"><i class="fa-solid fa-cog"></i> الإعدادات</a>
//                     <hr>
//                     <a href="#" id="logoutBtn" style="color: #c5221f;"><i class="fa-solid fa-sign-out-alt"></i> خروج</a>
//                 </div>
//             </div>
//         `;

//         // Toggle Logic
//         const avatarBtn = container.querySelector('.user-avatar');
//         const dropdown = container.querySelector('.dropdown-content');

//         avatarBtn.addEventListener('click', (e) => {
//             e.stopPropagation(); // Stop click from bubbling to window
//             dropdown.classList.toggle('show');
//         });

//         // Logout Logic
//         const logoutBtn = document.getElementById('logoutBtn');
//         if (logoutBtn) {
//             logoutBtn.addEventListener('click', async (e) => {
//                 e.preventDefault();
//                 try {
//                     await auth.signOut();
//                     window.location.href = 'index.html';
//                 } catch (error) {
//                     console.error("Logout failed", error);
//                 }
//             });
//         }

//     } else {
//         container.innerHTML = `
//             <a href="login.html" class="btn-primary">دخول</a>
//         `;
//     }
// }

// document.addEventListener('DOMContentLoaded', initProfileNav);




import { auth, onAuthStateChanged, getUserData } from './auth-service.js';

async function initProfileNav() {
    const navAuth = document.getElementById('navAuth');
    const heroButtons = document.getElementById('hero-buttons'); // Get the hero buttons container
    
    // Global listener to close dropdown when clicking outside
    window.addEventListener('click', (e) => {
        const dropdown = document.querySelector('.dropdown-content');
        const profileBtn = document.querySelector('.profile-dropdown');
        
        if (dropdown && dropdown.classList.contains('show')) {
            if (profileBtn && !profileBtn.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        }
    });

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // --- User is Logged In ---
            let photoURL = user.photoURL || 'images/user.png';
            let displayName = user.displayName || 'الزبون';

            // 1. Update Navbar (Show Profile)
            if (navAuth) renderNav(navAuth, photoURL, displayName, true);

            // 2. Update Hero Section (Show "Enter Dashboard")
            if (heroButtons) updateHero(heroButtons, true);

            // Sync with DB for latest image
            if (navAuth) {
                try {
                    const result = await getUserData(user.uid);
                    if (result.success && result.data && result.data.profileImage) {
                        const imgTag = navAuth.querySelector('img');
                        if (imgTag && result.data.profileImage !== photoURL) {
                            imgTag.src = result.data.profileImage;
                        }
                    }
                } catch (error) {
                    console.warn("Minor sync error", error);
                }
            }

        } else {
            // --- User is Logged Out ---
            
            // 1. Update Navbar (Show Login & Signup)
            if (navAuth) renderNav(navAuth, null, null, false);

            // 2. Update Hero Section (Show Login & Signup)
            if (heroButtons) updateHero(heroButtons, false);
        }
    });
}

function updateHero(container, isLoggedIn) {
    if (isLoggedIn) {
        // Show "Enter Dashboard" button only
        container.innerHTML = `
            <a href="dashboard.html" class="btn-primary" style="padding: 1rem 2.5rem; font-size: 1.2rem; border: 2px solid var(--primary-blue);">
                <i class="fa-solid fa-mug-hot"></i> ادخل الصالة
            </a>
        `;
    } else {
        // Show "Login" and "Signup" buttons
        container.innerHTML = `
            <a href="login.html" class="btn-primary" style="padding: 1rem 2.5rem; font-size: 1.2rem; border: 2px solid var(--primary-blue);">
                <i class="fa-solid fa-sign-in-alt"></i> دخول
            </a>
            <a href="signup.html" class="btn-outline" style="padding: 1rem 2.5rem; font-size: 1.2rem; background: rgba(255,255,255,0.1); color: white; border-color: white;">
                <i class="fa-solid fa-user-plus"></i> لسه جديد؟
            </a>
        `;
    }
}

function renderNav(container, imageSrc, name, isLoggedIn) {
    if (isLoggedIn) {
        container.innerHTML = `
            <div class="profile-dropdown">
                <div class="user-avatar" style="cursor: pointer;">
                    <img src="${imageSrc}" alt="${name}" title="${name}">
                </div>
                <div class="dropdown-content">
                    <a href="profile.html"><i class="fa-solid fa-user"></i> الملف الشخصي</a>
                    <hr>
                    <a href="dashboard.html"><i class="fa-solid fa-mug-hot"></i> الصالة</a>
                    <a href="settings.html"><i class="fa-solid fa-cog"></i> الإعدادات</a>
                    <hr>
                    <a href="#" id="logoutBtn" style="color: #c5221f;"><i class="fa-solid fa-sign-out-alt"></i> خروج</a>
                </div>
            </div>
        `;

        const avatarBtn = container.querySelector('.user-avatar');
        const dropdown = container.querySelector('.dropdown-content');

        if (avatarBtn && dropdown) {
            avatarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await auth.signOut();
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error("Logout failed", error);
                }
            });
        }

    } else {
        // Show both Login and Signup in Navbar
        container.innerHTML = `
            <div style="display: flex; gap: 10px; align-items: center;">
                <a href="login.html" class="btn-outline" style="border: none; padding: 0.5rem 1rem;">دخول</a>
                <a href="signup.html" class="btn-primary" style="font-size: 0.9rem;">عضوية جديدة</a>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', initProfileNav);