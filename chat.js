// import { 
//     auth, 
//     onAuthStateChanged, 
//     getUserData,
//     sendMessage,
//     subscribeToChat,
//     subscribeToChatList,
//     searchUsers
// } from './auth-service.js';

// import { setupEmojiPicker } from './emoji-system.js';

// let currentUser = null;
// let currentChatUserId = null;
// let unsubscribeChat = null;      // Tracks message listener
// let unsubscribeChatList = null;  // Tracks sidebar listener (Fixes Sidebar Duplicates)

// document.addEventListener('DOMContentLoaded', () => {
//     // 1. Initialize Emoji Picker
//     setupEmojiPicker('btnEmojiToggle', 'msgInput', 'chatInputContainer');
    
//     // 2. Initialize Search
//     setupChatSearch();

//     // 3. Auth Listener
//     onAuthStateChanged(auth, async (user) => {
//         if (user) {
//             currentUser = user;
//             setupChatList(); // Load Sidebar (Now Protected)
            
//             // Check URL for direct chat link (?uid=USER_ID)
//             const urlParams = new URLSearchParams(window.location.search);
//             const targetUid = urlParams.get('uid');
//             if (targetUid && targetUid !== currentUser.uid) {
//                 await openChat(targetUid);
//             }
//         } else {
//             window.location.href = 'login.html';
//         }
//     });

//     // 4. Input & Send Logic
//     const input = document.getElementById('msgInput');
    
//     // Auto-Resize Textarea
//     input.addEventListener('input', function() {
//         this.style.height = '24px'; 
//         this.style.height = (this.scrollHeight) + 'px';
//     });

//     // Enter to Send
//     input.addEventListener('keydown', function(e) {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             sendCurrentMessage();
//         }
//     });

//     // FIX: Use onclick to prevent duplicate listeners
//     document.getElementById('sendBtn').onclick = sendCurrentMessage;

//     // 5. Back Button (Mobile)
//     document.getElementById('backToChatList').addEventListener('click', () => {
//         document.getElementById('chatContainer').classList.remove('mobile-chat-open');
//         document.getElementById('chatMainArea').style.display = 'none';
        
//         // Reset selection so we can click the same person again if needed
//         currentChatUserId = null; 
//         document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
//     });
// });

// // --- SIDEBAR LIST (FIXED DUPLICATES) ---
// function setupChatList() {
//     // FIX: Stop previous listener if it exists
//     if (unsubscribeChatList) {
//         unsubscribeChatList();
//     }

//     unsubscribeChatList = subscribeToChatList(async (chats) => {
//         const listEl = document.getElementById('chatList');
        
//         if (chats.length === 0) {
//             listEl.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-grey);">لسه مفيش رسايل.</div>';
//             return;
//         }

//         // PRE-FETCH DATA: Fetch all users first to avoid "flashing" or async appending issues
//         const renderedItems = await Promise.all(chats.map(async (chat) => {
//             const userRes = await getUserData(chat.otherUserId);
//             const userData = userRes.success ? userRes.data : { fullName: 'مستخدم', profileImage: 'images/user.png' };
//             return { chat, userData };
//         }));

//         listEl.innerHTML = ''; // Clear list ONCE
        
//         renderedItems.forEach(({ chat, userData }) => {
//             // Time Formatting
//             let timeString = '';
//             if (chat.timestamp) {
//                 const date = typeof chat.timestamp === 'number' ? new Date(chat.timestamp) : chat.timestamp.toDate();
//                 const today = new Date();
//                 if(date.toDateString() === today.toDateString()) {
//                     timeString = date.toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'});
//                 } else {
//                     timeString = date.toLocaleDateString('ar-EG', {month:'short', day:'numeric'});
//                 }
//             }

//             const div = document.createElement('div');
//             div.className = `chat-item ${currentChatUserId === chat.otherUserId ? 'active' : ''}`;
//             div.innerHTML = `
//                 <img src="${userData.profileImage || 'images/user.png'}">
//                 <div class="chat-info">
//                     <span class="chat-name">${(userData.fullName || 'مجهول').split(' ')[0]}</span>
//                     <div class="chat-last-msg">
//                         ${chat.lastSenderId === currentUser.uid ? '<i class="fa-solid fa-check-double" style="color:var(--primary-blue); margin-left:5px; font-size:0.7rem;"></i>' : ''}
//                         ${chat.lastMessage || '...'}
//                     </div>
//                 </div>
//                 <div style="font-size:0.7rem; color:var(--text-grey); align-self:flex-start; margin-top:5px;">${timeString}</div>
//             `;
            
//             div.onclick = () => openChat(chat.otherUserId, userData);
//             listEl.appendChild(div);
//         });
//     });
// }

// // --- OPEN CHAT (FIXED RE-OPENING) ---
// async function openChat(targetUid, userDataObj = null) {
//     if (currentChatUserId === targetUid) return;
//     currentChatUserId = targetUid;

//     // Desktop UI
//     document.getElementById('emptyState').style.display = 'none';
//     document.getElementById('chatMainArea').style.display = 'flex';
    
//     // Mobile UI
//     document.getElementById('chatContainer').classList.add('mobile-chat-open');
//     document.getElementById('backToChatList').style.display = 'block';
    
//     // Loading State
//     document.getElementById('messagesArea').innerHTML = '<div style="text-align:center; padding:20px;"><i class="fa-solid fa-spinner fa-spin"></i></div>';
    
//     if (!userDataObj) {
//         const res = await getUserData(targetUid);
//         userDataObj = res.success ? res.data : { fullName: 'Unknown', profileImage: 'images/user.png' };
//     }

//     document.getElementById('chatHeaderName').textContent = userDataObj.fullName;
//     document.getElementById('chatHeaderImg').src = userDataObj.profileImage || 'images/user.png';
    
//     // Sidebar Active State
//     document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));

//     // FIX: Unsubscribe previous chat before starting new one
//     if (unsubscribeChat) unsubscribeChat();
//     unsubscribeChat = subscribeToChat(targetUid, (messages) => {
//         renderMessages(messages);
//     });
// }

// // --- RENDER MESSAGES ---
// function renderMessages(messages) {
//     const area = document.getElementById('messagesArea');
//     area.innerHTML = ''; // Always clear before rendering
    
//     if (messages.length === 0) {
//         area.innerHTML = `
//             <div style="text-align:center; color:var(--text-grey); margin-top:50px;">
//                 <i class="fa-regular fa-comments fa-3x" style="margin-bottom:10px; opacity:0.5;"></i>
//                 <p>قول يا مسا.. وابدأ الكلام!</p>
//             </div>`;
//         return;
//     }

//     let lastDateStr = '';

//     messages.forEach(msg => {
//         const isMe = msg.senderId === currentUser.uid;
//         let msgDateObj = typeof msg.timestamp === 'number' ? new Date(msg.timestamp) : msg.timestamp?.toDate();
        
//         // Date Separator
//         if(msgDateObj) {
//             const dateStr = msgDateObj.toDateString();
//             if (dateStr !== lastDateStr) {
//                 const separator = document.createElement('div');
//                 separator.className = 'date-separator';
//                 const today = new Date().toDateString();
//                 const yesterday = new Date(new Date().setDate(new Date().getDate()-1)).toDateString();
//                 let label = dateStr === today ? 'النهاردة' : (dateStr === yesterday ? 'إمبارح' : msgDateObj.toLocaleDateString('ar-EG', {day:'numeric', month:'long'}));
//                 separator.innerHTML = `<span>${label}</span>`;
//                 area.appendChild(separator);
//                 lastDateStr = dateStr;
//             }
//         }

//         const div = document.createElement('div');
//         div.className = `message ${isMe ? 'sent' : 'received'}`;
        
//         let timeString = msgDateObj ? msgDateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...';
        
//         div.innerHTML = `
//             ${msg.content.replace(/\n/g, '<br>')}
//             <span class="msg-time">
//                 ${timeString} 
//                 ${isMe ? '<i class="fa-solid fa-check-double" style="font-size:0.6rem;"></i>' : ''}
//             </span>
//         `;
//         area.appendChild(div);
//     });

//     area.scrollTop = area.scrollHeight;
// }

// // --- SEND MESSAGE ---
// async function sendCurrentMessage() {
//     const input = document.getElementById('msgInput');
//     const content = input.value.trim();
//     if (!content || !currentChatUserId) return;
    
//     input.value = ''; 
//     input.style.height = '24px'; 
//     input.focus();
    
//     await sendMessage(currentChatUserId, content);
// }

// // --- SEARCH FUNCTION ---
// function setupChatSearch() {
//     const input = document.getElementById('chatSearchBox');
//     const resultsDiv = document.getElementById('chatSearchResults');
//     const loader = document.getElementById('searchLoader');
//     let debounceTimer;

//     if (!input || !resultsDiv) return;

//     document.addEventListener('click', (e) => {
//         if (!input.contains(e.target) && !resultsDiv.contains(e.target)) {
//             resultsDiv.style.display = 'none';
//         }
//     });

//     input.addEventListener('input', function() {
//         const term = this.value.trim();
//         resultsDiv.style.display = 'none';
//         resultsDiv.innerHTML = '';
//         clearTimeout(debounceTimer);

//         if (!term) {
//             if(loader) loader.style.display = 'none';
//             return;
//         }

//         if(loader) loader.style.display = 'block';

//         debounceTimer = setTimeout(async () => {
//             const res = await searchUsers(term);
//             if(loader) loader.style.display = 'none';

//             resultsDiv.style.display = 'block';

//             if (res.success && res.data.length > 0) {
//                 const filtered = currentUser ? res.data.filter(u => u.id !== currentUser.uid) : res.data;
                
//                 if (filtered.length === 0) {
//                     resultsDiv.innerHTML = `<div style="padding:15px; text-align:center; color:var(--text-grey); font-size:0.9rem;">انت بتدور على نفسك؟ 😂</div>`;
//                     return;
//                 }

//                 filtered.forEach(u => {
//                     const userImg = u.profileImage || u.photoURL || 'images/user.png';
//                     const item = document.createElement('div');
//                     item.className = 'search-result-item';
//                     item.style.cssText = 'display:flex; align-items:center; padding:10px; cursor:pointer; border-bottom:1px solid rgba(0,0,0,0.05); transition:background 0.2s;';
//                     item.innerHTML = `
//                         <img src="${userImg}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; margin-left:10px;">
//                         <div>
//                             <div style="font-weight:bold; font-size:0.9rem; color:var(--text-dark);">${u.fullName || 'مجهول'}</div>
//                             <div style="font-size:0.75rem; color:var(--text-grey);">${u.role || 'زبون'}</div>
//                         </div>
//                     `;
//                     item.onclick = () => {
//                         resultsDiv.style.display = 'none';
//                         input.value = '';
//                         openChat(u.id, u);
//                     };
//                     resultsDiv.appendChild(item);
//                 });
//             } else {
//                 resultsDiv.innerHTML = `<div style="padding:15px; text-align:center; color:var(--text-grey); font-size:0.9rem;">مفيش حد بالاسم ده</div>`;
//             }
//         }, 400);
//     });
// }
































import { 
    auth, 
    onAuthStateChanged, 
    getUserData,
    sendMessage,
    subscribeToChat,
    subscribeToChatList,
    searchUsers,
    subscribeToUserStatus // New Import
} from './auth-service.js';

import { setupEmojiPicker } from './emoji-system.js';

let currentUser = null;
let currentChatUserId = null;
let unsubscribeChat = null;
let unsubscribeChatList = null;
let unsubscribeStatus = null; // New Subscription Tracker

document.addEventListener('DOMContentLoaded', () => {
    // 1. Emoji Picker
    setupEmojiPicker('btnEmojiToggle', 'msgInput', 'chatInputContainer');
    
    // 2. Search
    setupChatSearch();

    // 3. Auth Listener
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            setupChatList(); // Load Sidebar
            
            const urlParams = new URLSearchParams(window.location.search);
            const targetUid = urlParams.get('uid');
            if (targetUid && targetUid !== currentUser.uid) {
                await openChat(targetUid);
            }
        } else {
            window.location.href = 'login.html';
        }
    });

    // 4. Input Logic
    const input = document.getElementById('msgInput');
    
    input.addEventListener('input', function() {
        this.style.height = '24px'; 
        this.style.height = (this.scrollHeight) + 'px';
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendCurrentMessage();
        }
    });

    // Send Button (One-time binding)
    document.getElementById('sendBtn').onclick = sendCurrentMessage;

    // 5. Back Button (Mobile)
    document.getElementById('backToChatList').addEventListener('click', () => {
        document.getElementById('chatContainer').classList.remove('mobile-chat-open');
        document.getElementById('chatMainArea').style.display = 'none';
        
        // Cleanup selection
        currentChatUserId = null;
        if(unsubscribeChat) unsubscribeChat();
        if(unsubscribeStatus) unsubscribeStatus();
        document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
    });
});

// --- SIDEBAR ---
function setupChatList() {
    if (unsubscribeChatList) unsubscribeChatList(); // Stop old listener

    unsubscribeChatList = subscribeToChatList(async (chats) => {
        const listEl = document.getElementById('chatList');
        
        if (chats.length === 0) {
            listEl.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-grey);">لسه مفيش رسايل.</div>';
            return;
        }

        // Prefetch user data
        const renderedItems = await Promise.all(chats.map(async (chat) => {
            const userRes = await getUserData(chat.otherUserId);
            const userData = userRes.success ? userRes.data : { fullName: 'مستخدم', profileImage: 'images/user.png' };
            return { chat, userData };
        }));

        listEl.innerHTML = '';
        
        renderedItems.forEach(({ chat, userData }) => {
            let timeString = '';
            if (chat.timestamp) {
                const date = typeof chat.timestamp === 'number' ? new Date(chat.timestamp) : chat.timestamp.toDate();
                const today = new Date();
                if(date.toDateString() === today.toDateString()) {
                    timeString = date.toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'});
                } else {
                    timeString = date.toLocaleDateString('ar-EG', {month:'short', day:'numeric'});
                }
            }

            const div = document.createElement('div');
            div.className = `chat-item ${currentChatUserId === chat.otherUserId ? 'active' : ''}`;
            div.innerHTML = `
                <img src="${userData.profileImage || 'images/user.png'}">
                <div class="chat-info">
                    <span class="chat-name">${(userData.fullName || 'مجهول').split(' ')[0]}</span>
                    <div class="chat-last-msg">
                        ${chat.lastSenderId === currentUser.uid ? '<i class="fa-solid fa-check-double" style="color:var(--primary-blue); margin-left:5px; font-size:0.7rem;"></i>' : ''}
                        ${chat.lastMessage || '...'}
                    </div>
                </div>
                <div style="font-size:0.7rem; color:var(--text-grey); align-self:flex-start; margin-top:5px;">${timeString}</div>
            `;
            
            div.onclick = () => openChat(chat.otherUserId, userData);
            listEl.appendChild(div);
        });
    });
}

// --- OPEN CHAT ---
async function openChat(targetUid, userDataObj = null) {
    if (currentChatUserId === targetUid) return;
    currentChatUserId = targetUid;

    // UI Updates
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('chatMainArea').style.display = 'flex';
    document.getElementById('chatContainer').classList.add('mobile-chat-open');
    document.getElementById('backToChatList').style.display = 'block';
    
    // Messages Loader
    document.getElementById('messagesArea').innerHTML = '<div style="text-align:center; padding:20px;"><i class="fa-solid fa-spinner fa-spin"></i></div>';
    
    // User Data
    if (!userDataObj) {
        const res = await getUserData(targetUid);
        userDataObj = res.success ? res.data : { fullName: 'Unknown', profileImage: 'images/user.png' };
    }

    document.getElementById('chatHeaderName').textContent = userDataObj.fullName;
    document.getElementById('chatHeaderImg').src = userDataObj.profileImage || 'images/user.png';
    
    // --- ONLINE STATUS LOGIC ---
    const statusEl = document.getElementById('onlineStatus');
    statusEl.innerHTML = '...';

    if (unsubscribeStatus) unsubscribeStatus(); // Stop old listener
    
    unsubscribeStatus = subscribeToUserStatus(targetUid, (status) => {
        if (!status || status.state === 'offline') {
            let lastSeenText = 'غير متصل';
            if (status && status.last_changed) {
                const date = new Date(status.last_changed);
                const now = new Date();
                const diff = (now - date) / 1000 / 60; // minutes
                if (diff < 60) lastSeenText = `آخر ظهور من ${Math.floor(diff)} دقيقة`;
                else if (diff < 1440) lastSeenText = `آخر ظهور الساعة ${date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
                else lastSeenText = `آخر ظهور ${date.toLocaleDateString()}`;
            }
            statusEl.innerHTML = `<span style="color:var(--text-grey); font-size:0.75rem;">${lastSeenText}</span>`;
        } else {
            statusEl.innerHTML = `<i class="fa-solid fa-circle" style="font-size:8px; color:#4CAF50;"></i> <span style="color:#4CAF50; font-weight:bold; font-size:0.8rem;">متصل</span>`;
        }
    });
    // ----------------------------

    document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));

    // Messages Subscription
    if (unsubscribeChat) unsubscribeChat(); // Stop old listener
    unsubscribeChat = subscribeToChat(targetUid, (messages) => {
        renderMessages(messages);
    });
}

// --- RENDER MESSAGES ---
function renderMessages(messages) {
    const area = document.getElementById('messagesArea');
    area.innerHTML = '';
    
    if (messages.length === 0) {
        area.innerHTML = `
            <div style="text-align:center; color:var(--text-grey); margin-top:50px;">
                <i class="fa-regular fa-comments fa-3x" style="margin-bottom:10px; opacity:0.5;"></i>
                <p>قول يا مسا.. وابدأ الكلام!</p>
            </div>`;
        return;
    }

    let lastDateStr = '';

    messages.forEach(msg => {
        const isMe = msg.senderId === currentUser.uid;
        let msgDateObj = typeof msg.timestamp === 'number' ? new Date(msg.timestamp) : msg.timestamp?.toDate();
        
        // Date Separator
        if(msgDateObj) {
            const dateStr = msgDateObj.toDateString();
            if (dateStr !== lastDateStr) {
                const separator = document.createElement('div');
                separator.className = 'date-separator';
                const today = new Date().toDateString();
                const yesterday = new Date(new Date().setDate(new Date().getDate()-1)).toDateString();
                let label = dateStr === today ? 'النهاردة' : (dateStr === yesterday ? 'إمبارح' : msgDateObj.toLocaleDateString('ar-EG', {day:'numeric', month:'long'}));
                separator.innerHTML = `<span>${label}</span>`;
                area.appendChild(separator);
                lastDateStr = dateStr;
            }
        }

        const div = document.createElement('div');
        div.className = `message ${isMe ? 'sent' : 'received'}`;
        
        let timeString = msgDateObj ? msgDateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...';
        
        div.innerHTML = `
            ${msg.content.replace(/\n/g, '<br>')}
            <span class="msg-time">
                ${timeString} 
                ${isMe ? '<i class="fa-solid fa-check-double" style="font-size:0.6rem;"></i>' : ''}
            </span>
        `;
        area.appendChild(div);
    });

    area.scrollTop = area.scrollHeight;
}

// --- SEND MESSAGE ---
async function sendCurrentMessage() {
    const input = document.getElementById('msgInput');
    const content = input.value.trim();
    if (!content || !currentChatUserId) return;
    
    input.value = ''; 
    input.style.height = '24px'; 
    input.focus();
    
    await sendMessage(currentChatUserId, content);
}

// --- SEARCH ---
function setupChatSearch() {
    const input = document.getElementById('chatSearchBox');
    const resultsDiv = document.getElementById('chatSearchResults');
    const loader = document.getElementById('searchLoader');
    let debounceTimer;

    if (!input || !resultsDiv) return;

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !resultsDiv.contains(e.target)) {
            resultsDiv.style.display = 'none';
        }
    });

    input.addEventListener('input', function() {
        const term = this.value.trim();
        resultsDiv.innerHTML = '';
        resultsDiv.style.display = 'none';
        clearTimeout(debounceTimer);

        if (!term) {
            if(loader) loader.style.display = 'none';
            return;
        }

        if(loader) loader.style.display = 'block';

        debounceTimer = setTimeout(async () => {
            const res = await searchUsers(term);
            if(loader) loader.style.display = 'none';

            resultsDiv.style.display = 'block';

            if (res.success && res.data.length > 0) {
                const filtered = currentUser ? res.data.filter(u => u.id !== currentUser.uid) : res.data;
                
                if (filtered.length === 0) {
                    resultsDiv.innerHTML = `<div style="padding:15px; text-align:center; color:var(--text-grey); font-size:0.9rem;">انت بتدور على نفسك؟ 😂</div>`;
                    return;
                }

                filtered.forEach(u => {
                    const userImg = u.profileImage || u.photoURL || 'images/user.png';
                    const item = document.createElement('div');
                    item.className = 'search-result-item';
                    item.style.cssText = 'display:flex; align-items:center; padding:10px; cursor:pointer; border-bottom:1px solid rgba(0,0,0,0.05); transition:background 0.2s;';
                    item.innerHTML = `
                        <img src="${userImg}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; margin-left:10px;">
                        <div>
                            <div style="font-weight:bold; font-size:0.9rem; color:var(--text-dark);">${u.fullName || 'مجهول'}</div>
                            <div style="font-size:0.75rem; color:var(--text-grey);">${u.role || 'زبون'}</div>
                        </div>
                    `;
                    item.onclick = () => {
                        resultsDiv.style.display = 'none';
                        input.value = '';
                        openChat(u.id, u);
                    };
                    resultsDiv.appendChild(item);
                });
            } else {
                resultsDiv.innerHTML = `<div style="padding:15px; text-align:center; color:var(--text-grey); font-size:0.9rem;">مفيش حد بالاسم ده</div>`;
            }
        }, 400);
    });
}