import { 
    auth, rtdb, ref, set, update, onValue, remove, get, push, 
    onAuthStateChanged, getUserFriends, createNotification,
    onDisconnect 
} from './auth-service.js';

let roomId = null;
let isHost = false;
let currentUser = null;
let currentRotation = 0; 
let isPlaying = true; // حالة التشغيل
let lastRenderedUrl = '';

const CHANNELS = {
    1: 'https://www.youtube.com/watch?v=M7lc1UVf-VE', // Coding / Tech
    2: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', // Lofi / Quran
    3: 'https://www.youtube.com/watch?v=u31qwQUeGuM', // Nature / Chill
    4: 'https://www.youtube.com/watch?v=5YXjR577m3k'  // Oldies / Music
};

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    roomId = urlParams.get('roomId');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            checkCleanup(); // تنظيف الغرف القديمة

            if (roomId) {
                joinRoom(roomId);
            } else {
                // لو مفيش ID في الرابط، اظهر شاشة البداية
                const setupArea = document.getElementById('setupArea');
                const tvArea = document.getElementById('tvArea');
                if(setupArea) setupArea.style.display = 'block';
                if(tvArea) tvArea.style.display = 'none';
            }
        } else {
            // لو مش مسجل، احفظ مكانه ووديه يسجل
            sessionStorage.setItem('redirect_after_login', window.location.href);
            window.location.href = 'login.html';
        }
    });

    // --- ربط الزراير (Event Listeners) ---

    // 1. زرار إنشاء غرفة جديدة
    const createBtn = document.getElementById('createRoomBtn');
    if(createBtn) createBtn.addEventListener('click', createRoom);
    
    // 2. زرار تشغيل لينك خاص (يوتيوب أو غيره)
    const customBtn = document.getElementById('playCustomBtn');
    if(customBtn) customBtn.addEventListener('click', () => {
        const url = document.getElementById('customUrlInput').value.trim();
        if (url) updateRoomVideo(url);
    });

    // 3. بكرة القنوات
    const knob = document.getElementById('channelKnob');
    if(knob) knob.addEventListener('click', () => {
        if (!isHost) return alert("الريموت مش معاك يا زميلي!");
        let currentCh = parseInt(document.getElementById('channelNum').innerText);
        // لو القناة 0 (خاص) أو وصلت للآخر، ارجع لـ 1
        let nextCh = (currentCh >= 4 || currentCh === 0) ? 1 : currentCh + 1;
        window.changeChannel(nextCh);
    });

    // 4. زرار الوقف/التشغيل (للأدمن)
    const toggleBtn = document.getElementById('togglePlayBtn');
    if(toggleBtn) toggleBtn.addEventListener('click', togglePlayState);

    // 5. زرار فتح قائمة الدعوات
    const inviteBtn = document.getElementById('inviteBtn');
    if(inviteBtn) inviteBtn.addEventListener('click', openInviteModal);
    
    // 6. إرسال الشات
    const sendChatBtn = document.getElementById('sendChatBtn');
    if(sendChatBtn) sendChatBtn.addEventListener('click', sendChatMessage);
    
    const chatInput = document.getElementById('chatInput');
    if(chatInput) chatInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') sendChatMessage();
    });
});

// --- إنشاء الغرفة ---
async function createRoom() {
    roomId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    // إعدادات الغرفة المبدئية
    await set(ref(rtdb, `tv_rooms/${roomId}`), {
        hostId: currentUser.uid,
        currentUrl: CHANNELS[1], 
        channelNum: 1,
        isPlaying: true, 
        lastActivity: Date.now()
    });

    // تحديث الرابط من غير ريفريش
    window.history.pushState({}, '', `?roomId=${roomId}`);
    joinRoom(roomId);
}

// --- دخول الغرفة ---
function joinRoom(id) {
    document.getElementById('setupArea').style.display = 'none';
    document.getElementById('tvArea').style.display = 'flex';
    roomId = id;
    
    const roomRef = ref(rtdb, `tv_rooms/${roomId}`);
    
    // 1. مراقبة حالة الغرفة (الفيديو، القناة، التشغيل)
    onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        
        // لو الغرفة اتمسحت (أو مش موجودة)
        if (!data) {
            alert("الغرفة دي قفلت يا معلم.");
            window.location.href = 'tv.html';
            return;
        }

        // --- تحديد هل أنا الأدمن؟ ---
        if (data.hostId === currentUser.uid) {
            isHost = true;
            // إظهار لوحة التحكم
            const panel = document.getElementById('adminPanel');
            if(panel) panel.style.display = 'block';
            
            const status = document.getElementById('statusText');
            if(status) status.innerText = "أنت المعلم (معاك الريموت)";
            
            // إخفاء طبقة الحماية (عشان الأدمن يقدر يدوس ع الفيديو لو عايز)
            const overlay = document.getElementById('viewerOverlay');
            if(overlay) overlay.style.display = 'none'; 
            
            // تحديث شكل زرار الوقف/التشغيل
            const btn = document.getElementById('togglePlayBtn');
            if (btn) {
                if (data.isPlaying) {
                    btn.innerHTML = '<i class="fa-solid fa-stop"></i> وقف العرض';
                    btn.style.background = '#c5221f'; // أحمر
                } else {
                    btn.innerHTML = '<i class="fa-solid fa-play"></i> شغل العرض';
                    btn.style.background = '#4CAF50'; // أخضر
                }
            }
        } else {
            // أنا مشاهد
            isHost = false;
            const panel = document.getElementById('adminPanel');
            if(panel) panel.style.display = 'none';

            const status = document.getElementById('statusText');
            if(status) status.innerText = "مشاهدة فقط";
            
            // إظهار طبقة الحماية (عشان محدش يوقف الفيديو)
            const overlay = document.getElementById('viewerOverlay');
            if(overlay) overlay.style.display = 'block'; 
        }

        // --- تحديث الواجهة ---
        isPlaying = data.isPlaying;
        updateKnobUI(data.channelNum);
        
        const pausedOverlay = document.getElementById('pausedOverlay');
        const videoContainer = document.getElementById('videoContainer');
        
        if (isPlaying) {
            // لو شغال: اخفي شاشة التوقف واعرض الفيديو
            if(pausedOverlay) pausedOverlay.style.display = 'none';
            renderVideo(data.currentUrl);
        } else {
            // لو واقف: اظهر شاشة التوقف وفضي الفيديو
            if(pausedOverlay) pausedOverlay.style.display = 'flex';
            if(videoContainer) videoContainer.innerHTML = ''; 
            lastRenderedUrl = ''; // تصفير عشان يحمل تاني لما يشتغل
        }

        // تحديث وقت النشاط (عشان الغرفة متتمسحش طول ما فيها ناس)
        update(ref(rtdb, `tv_rooms/${roomId}`), { lastActivity: Date.now() });
    });

    // 2. تسجيل نفسي في قائمة المشاهدين
    const viewerRef = ref(rtdb, `tv_rooms/${roomId}/viewers/${currentUser.uid}`);
    set(viewerRef, { 
        name: currentUser.displayName, 
        photo: currentUser.photoURL || 'images/user.png' 
    });

    // !!! سحر الفايربيس: لو خرجت، امسح اسمي فوراً !!!
    onDisconnect(viewerRef).remove();

    // 3. مراقبة قائمة المشاهدين (لعرضهم في اللوحة)
    onValue(ref(rtdb, `tv_rooms/${roomId}/viewers`), (snap) => {
        const viewers = snap.val() || {};
        const listDiv = document.getElementById('viewersList');
        
        if(listDiv) {
            listDiv.innerHTML = '';
            Object.keys(viewers).forEach(uid => {
                const v = viewers[uid];
                const isMe = uid === currentUser.uid;
                
                let actionBtn = '';
                // لو أنا الأدمن وده مش أنا، زرار عشان اديه الريموت
                // if (isHost && !isMe) {
                //     actionBtn = `<button class="remote-btn" onclick="giveRemote('${uid}')" title="ديه الريموت"><i class="fa-solid fa-gamepad"></i></button>`;
                // }
                
                // علامة تاج للأدمن الحالي (نجيبها من الهوست المسجل في الغرفة)
                // (للتسهيل هنعرضها بس لو هو الهوست في اللحظة دي، وده بيتحدث مع onValue الأساسية)
                
                listDiv.innerHTML += `
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:5px; background:rgba(255,255,255,0.05); padding:5px; border-radius:5px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <img src="${v.photo}" style="width:25px; height:25px; border-radius:50%;">
                            <span style="font-size:0.85rem; color: #eee;">${v.name}</span>
                        </div>
                        ${actionBtn}
                    </div>
                `;
            });
        }
    });

    // 4. تشغيل الشات
    setupChat();
}

// --- وظائف الأدمن ---

// تسليم القيادة لشخص آخر
window.giveRemote = function(newHostId) {
    if(!isHost) return;
    if(confirm("متأكد عايز تديه الريموت؟ مش هتعرف تتحكم تاني غير لما هو يرجعهولك.")) {
        update(ref(rtdb, `tv_rooms/${roomId}`), { hostId: newHostId });
    }
}

// زرار وقف/تشغيل البث
function togglePlayState() {
    if(!isHost) return;
    update(ref(rtdb, `tv_rooms/${roomId}`), { isPlaying: !isPlaying });
}

// تغيير القناة (من البكرة)
window.changeChannel = function(num) {
    if (!isHost) return;
    currentRotation += 90; // لف البكرة 90 درجة
    update(ref(rtdb, `tv_rooms/${roomId}`), { 
        currentUrl: CHANNELS[num], 
        channelNum: num, 
        isPlaying: true, // شغل لو كان واقف
        lastActivity: Date.now() 
    });
};

// تشغيل رابط خاص (من الـ Input)
window.updateRoomVideo = function(url) {
    if (!isHost) return;
    update(ref(rtdb, `tv_rooms/${roomId}`), { 
        currentUrl: url, 
        channelNum: 0, // 0 يعني قناة خاصة
        isPlaying: true,
        lastActivity: Date.now() 
    });
}

// --- واجهة المستخدم (UI) ---

function updateKnobUI(num) {
    const knob = document.getElementById('channelKnob');
    const label = document.getElementById('channelNum');
    if(knob) knob.style.transform = `rotate(${currentRotation}deg)`;
    if(label) label.innerText = num === 0 ? "خاص" : num;
}

window.copyInvite = function() {
    navigator.clipboard.writeText(window.location.href);
    alert("تم نسخ الرابط! ابعته للشلة.");
};

// --- منطق عرض الفيديو (The Renderer) ---
function renderVideo(url) {
    if (!url || url === lastRenderedUrl) return; 
    lastRenderedUrl = url;
    
    const container = document.getElementById('videoContainer');
    const noise = document.getElementById('staticNoise');
    if(!container) return;

    // تأثير التشويش عند تغيير القناة
    if(noise) { 
        noise.style.display = 'block'; 
        setTimeout(() => { noise.style.display = 'none'; }, 500); 
    }

    let html = '';
    
    // 1. يوتيوب (Youtube)
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
        else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1];
        
        // Autoplay=1, Controls=0 (عشان نخفي تحكم يوتيوب ونستخدم تحكمنا احنا)
        html = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&playsinline=1" 
                allow="autoplay; encrypted-media" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>`;
    } 
    // 2. فيديو مباشر (MP4, WebM)
    else if (url.match(/\.(mp4|webm|ogg)$/i)) {
        html = `<video src="${url}" autoplay loop playsinline style="width:100%; height:100%; background:black; object-fit:contain;"></video>`;
    } 
    // 3. أي موقع تاني (Iframe Embed)
    else {
        html = `<iframe src="${url}" allow="autoplay" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>`;
    }
    
    container.innerHTML = html;
}

// --- نظام الشات ---
function setupChat() {
    const chatRef = ref(rtdb, `tv_rooms/${roomId}/chat`);
    
    // استلام الرسائل الجديدة
    onValue(chatRef, (snap) => {
        const msgs = snap.val();
        const div = document.getElementById('chatMessages');
        if(div) {
            div.innerHTML = '';
            if(msgs) {
                // تحويل الأوبجكت لمصفوفة وترتيبها
                Object.values(msgs).forEach(m => {
                    const type = m.uid === currentUser.uid ? 'mine' : 'others';
                    div.innerHTML += `
                        <div class="msg ${type}">
                            <span class="msg-sender">${m.name}</span>
                            ${m.text}
                        </div>
                    `;
                });
                // انزل لآخر رسالة تحت
                div.scrollTop = div.scrollHeight;
            }
        }
    });
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if(!text) return;
    
    const chatRef = ref(rtdb, `tv_rooms/${roomId}/chat`);
    push(chatRef, {
        uid: currentUser.uid,
        name: currentUser.displayName,
        text: text,
        time: Date.now()
    });
    input.value = '';
}

// --- نظام الدعوات (Invite System) ---
async function openInviteModal() {
    const modal = document.getElementById('inviteModal');
    const container = document.getElementById('friendsListContainer');
    if(!modal || !container) return;
    
    modal.style.display = 'flex';
    container.innerHTML = '<p>ثواني بنجيب الشلة...</p>';

    // هات قائمة الأصدقاء من الداتابيز
    const res = await getUserFriends(currentUser.uid);
    
    if(res.success && res.data.length > 0) {
        container.innerHTML = res.data.map(f => `
            <div class="friend-item">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${f.profileImage || f.photoURL || 'images/user.png'}">
                    <span>${f.fullName || f.displayName}</span>
                </div>
                <button class="btn-primary" onclick="inviteUser('${f.id}')" style="padding:5px 10px; font-size:0.8rem;">اعزم</button>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p>معندكش صحاب لسه يا معلم 😅 ضيف ناس من "البحث".</p>';
    }
}

// دي لازم تكون window عشان HTML يشوفها جوه الـ onclick
window.inviteUser = async function(friendId) {
    await createNotification(friendId, 'tv_invite', `${currentUser.displayName} بيعزمك تتفرجوا سوا على التلفزيون 📺`, {
        link: window.location.href // ابعتله رابط الغرفة الحالية
    });
    alert("تم إرسال الدعوة!");
}

// --- التنظيف التلقائي (Garbage Collector) ---
// بتمسح الغرف اللي بقالها 30 دقيقة مهجورة
async function checkCleanup() {
    const roomsRef = ref(rtdb, 'tv_rooms');
    const snapshot = await get(roomsRef);
    if (snapshot.exists()) {
        const rooms = snapshot.val();
        const now = Date.now();
        const THIRTY_MIN = 30 * 60 * 1000;
        
        Object.keys(rooms).forEach(key => {
            // لو عدى 30 دقيقة على آخر نشاط (lastActivity)
            if (now - rooms[key].lastActivity > THIRTY_MIN) {
                remove(ref(rtdb, `tv_rooms/${key}`));
                console.log(`Room ${key} cleaned up.`);
            }
        });
    }
}