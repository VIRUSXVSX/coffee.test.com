import { auth, onAuthStateChanged, getUserData } from './auth-service.js';

// Fun random messages for "Smart Mode"
const smartMessages = [
    "منور القهوة يا ",
    "عاش من شافك يا ",
    "يا صباح الفل يا ",
    "إيه الحلاوة دي يا ",
    "يا هلا بيك يا ",
    "نورت بيتك يا "
];

// 1. Main Function to Update Display (Runs on Dashboard)
async function updateGreetingDisplay() {
    // FIX: Changed selector to match dashboard.html ID
    const headingElements = document.querySelectorAll('#welcomeText');
    if (headingElements.length === 0) return;

    // Check setting from LocalStorage
    // If key doesn't exist, default to 'true' (Enable by default for fun)
    const storedSetting = localStorage.getItem('smartGreetings');
    const isSmartEnabled = storedSetting === null ? true : (storedSetting === 'true');

    onAuthStateChanged(auth, async (user) => {
        let displayName = "يا معلم"; 

        if (user) {
            // Try to get fresh name from DB first
            const dbResult = await getUserData(user.uid);
            
            if (dbResult.success && dbResult.data.fullName) {
                displayName = dbResult.data.fullName.split(' ')[0];
            } 
            else if (user.displayName) {
                displayName = user.displayName.split(' ')[0]; 
            }
        }

        headingElements.forEach(el => {
            if (isSmartEnabled) {
                // Smart Mode: Random Message
                const randomMsg = smartMessages[Math.floor(Math.random() * smartMessages.length)];
                el.textContent = `${randomMsg} ${displayName}`;
            } else {
                // Default Mode: Standard Welcome
                el.textContent = `منور القهوة يا ${displayName}`;
            }
        });
    });
}

// 2. Initialize Toggle (Runs on Settings Page)
function initializeToggleSwitch() {
    const toggleSwitch = document.getElementById('smartGreetingsToggle');
    if (!toggleSwitch) return;

    const storedSetting = localStorage.getItem('smartGreetings');
    const isSmartEnabled = storedSetting === null ? true : (storedSetting === 'true');
    
    toggleSwitch.checked = isSmartEnabled;

    toggleSwitch.addEventListener('change', function() {
        localStorage.setItem('smartGreetings', this.checked);
        updateGreetingDisplay(); 
    });
}

// 3. Run on Load
document.addEventListener('DOMContentLoaded', () => {
    initializeToggleSwitch();
    updateGreetingDisplay();
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateGreetingDisplay();
});