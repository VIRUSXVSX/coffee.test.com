import { auth, onAuthStateChanged } from './auth-service.js';
import { app } from './firebase-config.js';
import { 
    getDatabase, 
    ref, 
    onValue, 
    set, 
    onDisconnect, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

const rtdb = getDatabase(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Reference to this user's status in Realtime DB
        const userStatusRef = ref(rtdb, `/status/${user.uid}`);
        
        // Special Firebase location that tracks connection state
        const connectedRef = ref(rtdb, '.info/connected');

        onValue(connectedRef, (snap) => {
            if (snap.val() === true) {
                // 1. When we disconnect (close tab/lose internet), automatically set to offline
                onDisconnect(userStatusRef).set({
                    state: 'offline',
                    last_changed: serverTimestamp()
                }).then(() => {
                    // 2. While we are connected, set to online
                    set(userStatusRef, {
                        state: 'online',
                        last_changed: serverTimestamp()
                    });
                });
            }
        });
    }
});