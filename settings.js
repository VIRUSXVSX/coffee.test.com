// import { 
//     auth, 
//     onAuthStateChanged, 
//     getUserData, 
//     getSavedUniversities, 
//     getUserComparisons,
//     logout 
// } from './auth-service.js';

// let currentUser = null;

// // --- INITIALIZATION ---
// document.addEventListener('DOMContentLoaded', () => {
//     // 1. Initialize Theme immediately
//     const savedTheme = localStorage.getItem('theme') || 'system';
//     setTheme(savedTheme);

//     // 2. Initialize Data
//     initSettingsPage();
// });

// async function initSettingsPage() {
//     onAuthStateChanged(auth, async (user) => {
//         if (user) {
//             currentUser = user;
//             await loadUserProfile();
//             await loadSidebarStats(); // Load counts for badges
//         } else {
//             // Optional: Redirect if not logged in
//              window.location.href = 'login.html';
//         }
//     });

//     // Logout Listener
//     document.getElementById('logoutBtn')?.addEventListener('click', async () => {
//         if (confirm('Are you sure you want to logout?')) {
//             await logout();
//             window.location.href = 'index.html';
//         }
//     });
// }

// // --- PROFILE LOADING LOGIC ---
// async function loadUserProfile() {
//     try {
//         const result = await getUserData(currentUser.uid);
        
//         if (result.success && result.data) {
//             const data = result.data;

//             // 1. Update Images (Sidebar + Navbar)
//             const userImg = data.profileImage || 'images/user.png';
            
//             const profileImgEl = document.getElementById('profileImage');
//             if (profileImgEl) profileImgEl.src = userImg;

//             const navAvatar = document.getElementById('navAvatar');
//             if (navAvatar) navAvatar.src = userImg;

//             // 2. Update Text Info
//             setText('userName', data.fullName || 'User');
//             setText('userEducation', data.educationLevel || 'Student');
//             setText('userEmail', data.email || currentUser.email);
            
//             // 3. Update Form Inputs (if they exist on this page)
//             setVal('firstName', data.firstName || '');
//             setVal('lastName', data.lastName || '');
//             setVal('email', data.email || currentUser.email);
//             setVal('educationLevel', data.educationLevel || 'Undergraduate');
//         }
//     } catch (error) {
//         console.error("Error loading profile:", error);
//     }
// }

// async function loadSidebarStats() {
//     // Load Saved Count
//     try {
//         const savedRes = await getSavedUniversities(currentUser.uid);
//         if (savedRes.success) {
//             setText('savedCount', savedRes.data.length);
//         }
//     } catch (e) { console.log('Error loading saved count', e); }

//     // Load Comparisons Count
//     try {
//         const compRes = await getUserComparisons(currentUser.uid);
//         if (compRes.success) {
//             setText('comparisonsCount', compRes.data.length);
//         }
//     } catch (e) { console.log('Error loading comparison count', e); }
// }

// // Helper to safely set text content
// function setText(id, value) {
//     const el = document.getElementById(id);
//     if (el) el.textContent = value;
// }

// // Helper to safely set input value
// function setVal(id, value) {
//     const el = document.getElementById(id);
//     if (el) el.value = value;
// }

// // --- THEME LOGIC ---
// window.setTheme = function(theme) {
//     // Save preference
//     localStorage.setItem('theme', theme);
    
//     // Update UI Buttons
//     updateThemeButtons(theme);

//     // Apply the theme
//     if (theme === 'system') {
//         applySystemTheme();
//         // Listen for system changes
//         if (!window.matchMedia('(prefers-color-scheme: dark)').onchange) {
//             window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
//                 if (localStorage.getItem('theme') === 'system') applySystemTheme();
//             });
//         }
//     } else {
//         document.documentElement.setAttribute('data-theme', theme);
//     }
// }

// function applySystemTheme() {
//     const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
// }

// function updateThemeButtons(activeTheme) {
//     const buttons = {
//         'light': document.getElementById('btn-light'),
//         'dark': document.getElementById('btn-dark'),
//         'system': document.getElementById('btn-system')
//     };

//     // Reset all to outline
//     Object.values(buttons).forEach(btn => {
//         if(btn) {
//             btn.className = 'theme-btn btn-outline'; 
//         }
//     });

//     // Set active to primary
//     if (buttons[activeTheme]) {
//         buttons[activeTheme].className = 'theme-btn active btn-primary';
//     }
// }


import { 
    auth, 
    onAuthStateChanged, 
    getUserData, 
    logout 
} from './auth-service.js';

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            await loadSettingsProfile();
        } else {
            // window.location.href = 'login.html';
        }
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (confirm('عايز تمشي وتسبنا؟')) {
                await logout();
                window.location.href = 'index.html';
            }
        });
    }
});

async function loadSettingsProfile() {
    try {
        const result = await getUserData(currentUser.uid);
        
        if (result.success && result.data) {
            const data = result.data;
            
            // 1. Sidebar Elements
            const imgEl = document.getElementById('profileImage');
            const nameEl = document.getElementById('userName');
            const eduEl = document.getElementById('userEducation');
            const emailEl = document.getElementById('userEmail');

            // 2. Set Values safely
            if (imgEl) imgEl.src = data.profileImage || 'images/user.png';
            if (nameEl) nameEl.textContent = data.fullName || 'الزبون';
            if (eduEl) eduEl.textContent = data.educationLevel || 'زبون جديد';
            if (emailEl) emailEl.textContent = currentUser.email;

            // 3. Navbar Avatar (if exists)
            const navAvatar = document.getElementById('navAvatar');
            if (navAvatar) navAvatar.src = data.profileImage || 'images/user.png';
        }
    } catch (error) {
        console.error("Error loading settings profile:", error);
    }
}

// import { 
//     auth, 
//     onAuthStateChanged, 
//     getUserData, 
//     getSavedUniversities, 
//     getUserComparisons,
//     logout 
// } from './auth-service.js';

// let currentUser = null;

// // --- INITIALIZATION ---
// document.addEventListener('DOMContentLoaded', () => {
//     // Initialize Data (Theme is now handled by theme.js)
//     initSettingsPage();
// });

// async function initSettingsPage() {
//     onAuthStateChanged(auth, async (user) => {
//         if (user) {
//             currentUser = user;
//             await loadUserProfile();
//             await loadSidebarStats(); // Load counts for badges
//         } else {
//             // Optional: Redirect if not logged in
//             // window.location.href = 'login.html';
//         }
//     });

//     // Logout Listener
//     document.getElementById('logoutBtn')?.addEventListener('click', async () => {
//         if (confirm('Are you sure you want to logout?')) {
//             await logout();
//             window.location.href = 'index.html';
//         }
//     });
// }

// // --- PROFILE LOADING LOGIC ---
// async function loadUserProfile() {
//     try {
//         const result = await getUserData(currentUser.uid);
        
//         if (result.success && result.data) {
//             const data = result.data;

//             // 1. Update Images (Sidebar + Navbar)
//             const userImg = data.profileImage || 'images/user.png';
            
//             const profileImgEl = document.getElementById('profileImage');
//             if (profileImgEl) profileImgEl.src = userImg;

//             const navAvatar = document.getElementById('navAvatar');
//             if (navAvatar) navAvatar.src = userImg;

//             // 2. Update Text Info
//             setText('userName', data.fullName || 'User');
//             setText('userEducation', data.educationLevel || 'Student');
//             setText('userEmail', data.email || currentUser.email);
            
//             // 3. Update Form Inputs (if they exist on this page)
//             setVal('firstName', data.firstName || '');
//             setVal('lastName', data.lastName || '');
//             setVal('email', data.email || currentUser.email);
//             setVal('educationLevel', data.educationLevel || 'Undergraduate');
//         }
//     } catch (error) {
//         console.error("Error loading profile:", error);
//     }
// }

// async function loadSidebarStats() {
//     // Load Saved Count
//     try {
//         const savedRes = await getSavedUniversities(currentUser.uid);
//         if (savedRes.success) {
//             setText('savedCount', savedRes.data.length);
//         }
//     } catch (e) { console.log('Error loading saved count', e); }

//     // Load Comparisons Count
//     try {
//         const compRes = await getUserComparisons(currentUser.uid);
//         if (compRes.success) {
//             setText('comparisonsCount', compRes.data.length);
//         }
//     } catch (e) { console.log('Error loading comparison count', e); }
// }

// // Helper to safely set text content
// function setText(id, value) {
//     const el = document.getElementById(id);
//     if (el) el.textContent = value;
// }

// // Helper to safely set input value
// function setVal(id, value) {
//     const el = document.getElementById(id);
//     if (el) el.value = value;
// }










