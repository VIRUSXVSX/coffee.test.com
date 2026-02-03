import { auth, onAuthStateChanged, getNotifications } from './auth-service.js';

document.addEventListener('DOMContentLoaded', () => {
    setupNotificationUI();
});

function setupNotificationUI() {
    // 1. DOM Elements
    const btn = document.getElementById('notifToggleBtn');
    const dropdown = document.getElementById('notifDropdown');

    // 2. Event Listeners for Toggling
    if (btn && dropdown) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    // 3. Listen for Auth Changes to Fetch Data
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Initial Load
            updateNotificationBadgeAndList();

            // Refresh every 60 seconds to check for new notifications
            setInterval(updateNotificationBadgeAndList, 60000);
        } else {
            // Hide badge if logged out
            const badge = document.getElementById('notifBadge');
            if (badge) badge.style.display = 'none';
        }
    });
}

// --- Main Logic ---
async function updateNotificationBadgeAndList() {
    const badge = document.getElementById('notifBadge');
    const listMini = document.getElementById('notifListMini');

    // Fetch notifications from Firebase
    const res = await getNotifications();

    if (res.success) {
        const notifs = res.data;

        // A. Update Red Badge (Count Unread)
        const unreadCount = notifs.filter(n => !n.read).length;
        
        if (badge) {
            if (unreadCount > 0) {
                badge.style.display = 'flex';
                // badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                badge.textContent = unreadCount > 9 ? '9+' : unreadCount; // Empty text makes it just a small dot
badge.style.width = '10px'; // Make it smaller
badge.style.height = '10px';
badge.style.minWidth = '0';
                badge.classList.add('pulse-animation'); // Optional: Add CSS for pulse
            } else {
                badge.style.display = 'none';
                badge.classList.remove('pulse-animation');
            }
        }

        // B. Populate Dropdown List
        if (listMini) {
            if (notifs.length === 0) {
                listMini.innerHTML = `
                    <div style="padding:20px; text-align:center; color:var(--text-grey);">
                        <i class="ri-notification-off-line" style="font-size:1.5rem; display:block; margin-bottom:5px;"></i>
                        <span style="font-size:0.8rem;">مفيش إشعارات جديدة</span>
                    </div>`;
                return;
            }

            // Take only the top 5 latest notifications
            const topNotifs = notifs.slice(0, 5);

            listMini.innerHTML = topNotifs.map(n => {
                // 1. Choose Icon based on type
                let iconClass = 'ri-notification-3-fill'; // Default
                let iconColor = 'var(--primary-blue)';

                if (n.type === 'friend_request') {
                    iconClass = 'ri-user-add-fill';
                } else if (n.type === 'game_invite') {
                    iconClass = 'ri-gamepad-fill';
                    iconColor = '#e67e22'; // Orange for games
                } else if (n.type === 'request_accepted') {
                    iconClass = 'ri-checkbox-circle-fill';
                    iconColor = '#2ecc71'; // Green for success
                }

                // 2. Format Time (e.g., 10:30 PM)
                let timeStr = 'دلوقتي';
                if (n.timestamp) {
                    timeStr = new Date(n.timestamp.toDate()).toLocaleTimeString('ar-EG', {
                        hour: '2-digit', 
                        minute: '2-digit'
                    });
                }

                // 3. Highlight Unread
                const unreadClass = n.read ? '' : 'unread';

                return `
                <div class="mini-notif-item ${unreadClass}" onclick="window.location.href='notifications.html'">
                    <i class="${iconClass} mini-notif-icon" style="color: ${iconColor};"></i>
                    <div class="mini-notif-content">
                        <p>${n.message}</p>
                        <span class="mini-notif-time">${timeStr}</span>
                    </div>
                </div>
                `;
            }).join('');
        }
    }
}