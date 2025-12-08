// // theme.js - Global Theme Handler for UniFind
// // Drop this into any HTML page to enable Dark Mode logic

// document.addEventListener('DOMContentLoaded', () => {
//     // 1. Initialize Theme on Load
//     const savedTheme = localStorage.getItem('theme') || 'system';
//     setTheme(savedTheme);
// });

// // 2. Global Function to Set Theme
// window.setTheme = function(theme) {
//     // Save preference
//     localStorage.setItem('theme', theme);
    
//     // Update UI Buttons (only if they exist on this page, e.g., Settings page)
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
//         // Apply explicit 'light' or 'dark'
//         document.documentElement.setAttribute('data-theme', theme);
//     }
// }

// // 3. Helper: Apply System Preference
// function applySystemTheme() {
//     const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
// }

// // 4. Helper: Update Buttons (Safe to run on pages without buttons)
// function updateThemeButtons(activeTheme) {
//     const buttons = {
//         'light': document.getElementById('btn-light'),
//         'dark': document.getElementById('btn-dark'),
//         'system': document.getElementById('btn-system')
//     };

//     // Reset all to outline (if they exist)
//     Object.values(buttons).forEach(btn => {
//         if(btn) {
//             btn.className = 'theme-btn btn-outline'; 
//         }
//     });

//     // Set active to primary (if it exists)
//     if (buttons[activeTheme]) {
//         buttons[activeTheme].className = 'theme-btn active btn-primary';
//     }
// }











// theme.js - Global Theme Handler for UniFind
// Drop this into any HTML page to enable Dark Mode logic

// 1. Apply Theme IMMEDIATELY to prevent "Flash of White"
// This self-executing function runs as soon as the script is loaded
(function() {
    const savedTheme = localStorage.getItem('theme') || 'system';
    
    if (savedTheme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
})();

// 2. Initialize UI (Buttons) when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    updateThemeButtons(savedTheme);
});

// 3. Global Function to Set Theme (User Action)
window.setTheme = function(theme) {
    // Save preference
    localStorage.setItem('theme', theme);
    
    // Update UI Buttons (only if they exist on this page)
    updateThemeButtons(theme);

    // Apply the theme logic
    if (theme === 'system') {
        applySystemTheme();
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

// 4. Helper: Apply System Preference
function applySystemTheme() {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
}

// 5. Watch for System Changes (Global Listener)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === 'system') {
        applySystemTheme();
    }
});

// 6. Helper: Update Buttons (Safe to run on pages without buttons)
function updateThemeButtons(activeTheme) {
    const buttons = {
        'light': document.getElementById('btn-light'),
        'dark': document.getElementById('btn-dark'),
        'system': document.getElementById('btn-system')
    };

    // Reset all to outline (if they exist)
    Object.values(buttons).forEach(btn => {
        if(btn) {
            btn.className = 'theme-btn btn-outline'; 
        }
    });

    // Set active to primary (if it exists)
    if (buttons[activeTheme]) {
        buttons[activeTheme].className = 'theme-btn active btn-primary';
    }
}