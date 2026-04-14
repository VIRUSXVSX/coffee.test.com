import { 
    auth, rtdb, ref, set, update, onValue, remove, push, onDisconnect, onAuthStateChanged, get
} from './auth-service.js';

let currentUser = null;
const urlParams = new URLSearchParams(window.location.search);
let roomId = urlParams.get('room');
let localStream = null;
let isMuted = false; 
let isRoomAdmin = false;
let roomData = null;
let selectedMicId = 'default';
let selectedSpeakerId = 'default';
let lastUnmuteTrigger = 0; 
let isListeningRequests = false; 

// تخزين الأنيميشن الخاص بكل مستخدم لمنع التداخل
const activeVisualizers = {};

const peerConnections = {}; 
const ICE_SERVERS = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const ROOM_TIMEOUT = 10 * 60 * 1000; 

// ================= TOAST =================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'error' ? '<i class="fa-solid fa-circle-exclamation" style="color:#e74c3c;"></i>' : 
                 type === 'success' ? '<i class="fa-solid fa-circle-check" style="color:#2ecc71;"></i>' : '<i class="fa-solid fa-bell" style="color:var(--primary-blue);"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    
    toast.style.transform = 'translateX(-100%)';
    toast.style.opacity = '0';
    container.appendChild(toast);
    
    requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; toast.style.opacity = '1'; });
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(-20px)'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) { window.location.href = 'login.html'; return; }
        currentUser = user;
        initSetup();
    });
});

async function initSetup() {
    bindGlobalEvents();
    await requestMicPermission();
    await loadAudioDevices();

    const setupTitle = document.getElementById('setupTitle');
    const setupDesc = document.getElementById('setupDesc');
    const createControls = document.getElementById('createControls');
    const joinControls = document.getElementById('joinControls');

    if (!roomId) {
        setupTitle.innerText = "غرفة جديدة";
        setupDesc.innerText = "اختار اسم وخصوصية الغرفة";
        createControls.style.display = 'flex';
    } else {
        const isValid = await checkRoomValidity(roomId);
        if(!isValid) {
            showToast("الغرفة دي انتهت صلاحيتها أو اتمسحت!", "error");
            setTimeout(()=> window.location.href = 'dashboard.html', 2000);
            return;
        }
        setupTitle.innerText = "جاهز للدخول؟";
        setupDesc.innerText = "ظبط مايكك ودوس انضم.";
        joinControls.style.display = 'block';
    }
}

async function checkRoomValidity(id) {
    const snap = await get(ref(rtdb, `rooms/${id}/info`));
    if(!snap.exists()) return false;
    const info = snap.val();
    if (info.lastActive && (Date.now() - info.lastActive > ROOM_TIMEOUT)) {
        remove(ref(rtdb, `rooms/${id}`)); 
        return false;
    }
    return true;
}

setInterval(() => {
    if(roomId && currentUser && document.getElementById('activeRoomArea').style.display === 'flex') {
        update(ref(rtdb, `rooms/${roomId}/info`), { lastActive: Date.now() });
    }
}, 60000);

function bindGlobalEvents() {
    document.getElementById('createRoomBtn')?.addEventListener('click', createRoom);
    document.getElementById('joinRoomBtn')?.addEventListener('click', attemptJoinRoom);
    document.getElementById('preJoinMicBtn')?.addEventListener('click', togglePreJoinMic);
    document.getElementById('toggleMicBtn')?.addEventListener('click', toggleMainMic);
    
    const chatToggleHandler = () => {
        const sidebar = document.getElementById('chatSidebar');
        const btn = document.getElementById('toggleChatBtn');
        sidebar.classList.toggle('hidden');
        btn.classList.toggle('active-chat');
        if(window.innerWidth <= 768) document.body.classList.toggle('chat-open');
    };
    document.getElementById('toggleChatBtn')?.addEventListener('click', chatToggleHandler);
    document.getElementById('closeChatBtn')?.addEventListener('click', chatToggleHandler);

    document.getElementById('openLobbySettingsBtn')?.addEventListener('click', () => { document.getElementById('settingsModal').classList.add('active'); loadAudioDevices(); });
    document.getElementById('openRoomSettingsBtn')?.addEventListener('click', () => { document.getElementById('settingsModal').classList.add('active'); loadAudioDevices(); });
    document.getElementById('openParticipantsBtn')?.addEventListener('click', () => document.getElementById('participantsModal').classList.add('active'));
    document.getElementById('leaveBtn')?.addEventListener('click', openLeaveModal);
    
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => document.getElementById(e.currentTarget.getAttribute('data-target')).classList.remove('active'));
    });

    document.getElementById('inviteBtn')?.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.origin + window.location.pathname + '?room=' + roomId);
        showToast("تم نسخ الرابط!", "success");
    });

    document.getElementById('adminPrivacySelect')?.addEventListener('change', (e) => {
        if (isRoomAdmin) { update(ref(rtdb, `rooms/${roomId}/info`), { privacy: e.target.value }); showToast("تم التحديث", "success"); }
    });

    // Device Changing
    document.getElementById('micSelect')?.addEventListener('change', (e) => switchMicrophone(e.target.value));
    document.getElementById('speakerSelect')?.addEventListener('change', (e) => switchSpeaker(e.target.value));
    
    document.getElementById('sendRoomChatBtn')?.addEventListener('click', sendMessage);
    document.getElementById('roomChatInput')?.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById(e.target.getAttribute('data-tab')).classList.add('active');
        });
    });
}

// ================= DEVICE MANAGEMENT (MODERNIZED) =================
async function requestMicPermission(deviceId = null) {
    try {
        const constraints = { audio: deviceId ? { deviceId: { exact: deviceId } } : true, video: false };
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        document.getElementById('micStatusText').innerText = "المايك شغال 🎙️"; document.getElementById('micStatusText').style.color = "#2ecc71";
        if(isMuted) localStream.getAudioTracks()[0].enabled = false;
        
        startVisualizer(localStream, 'micPreview', true);
        updatePreJoinMicUI();
        return true;
    } catch (err) {
        localStream = null; isMuted = true;
        document.getElementById('micStatusText').innerText = "هتدخل مستمع 🎧"; document.getElementById('micStatusText').style.color = "#ea4335";
        updatePreJoinMicUI(); return false;
    }
}

async function loadAudioDevices() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const micSelect = document.getElementById('micSelect');
        const speakerSelect = document.getElementById('speakerSelect');
        const speakerWarning = document.getElementById('speakerWarning');
        
        micSelect.innerHTML = ''; speakerSelect.innerHTML = '';

        const mics = devices.filter(d => d.kind === 'audioinput');
        const speakers = devices.filter(d => d.kind === 'audiooutput');

        if(mics.length === 0) micSelect.innerHTML = '<option value="">مفيش مايك</option>';
        mics.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.deviceId; opt.text = d.label || `مايك ${micSelect.length + 1}`;
            if (d.deviceId === selectedMicId) opt.selected = true;
            micSelect.appendChild(opt);
        });

        // Speaker support check (Firefox/Safari issues)
        if (typeof HTMLAudioElement.prototype.setSinkId === 'undefined') {
            speakerSelect.disabled = true;
            speakerSelect.innerHTML = '<option value="">الافتراضي</option>';
            speakerWarning.style.display = 'block';
        } else {
            speakerWarning.style.display = 'none';
            if(speakers.length === 0) speakerSelect.innerHTML = '<option value="">الافتراضي</option>';
            speakers.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.deviceId; opt.text = d.label || `سماعة ${speakerSelect.length + 1}`;
                if (d.deviceId === selectedSpeakerId) opt.selected = true;
                speakerSelect.appendChild(opt);
            });
        }
    } catch(e) {}
}

async function switchMicrophone(deviceId) {
    if(!deviceId) return;
    selectedMicId = deviceId;
    try {
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: deviceId } } });
        const newTrack = newStream.getAudioTracks()[0];
        if(localStream) { localStream.removeTrack(localStream.getAudioTracks()[0]); localStream.addTrack(newTrack); } else { localStream = newStream; }
        newTrack.enabled = !isMuted;
        
        Object.values(peerConnections).forEach(pc => { const sender = pc.getSenders().find(s => s.track && s.track.kind === 'audio'); if(sender) sender.replaceTrack(newTrack); });
        
        startVisualizer(localStream, roomId ? `card_${currentUser.uid}` : 'micPreview', true);
        showToast("تم تغيير المايك", "success");
    } catch (e) { showToast("فشل التغيير", "error"); }
}

async function switchSpeaker(deviceId) {
    if(!deviceId) return;
    selectedSpeakerId = deviceId;
    const audios = document.querySelectorAll('audio');
    audios.forEach(async (audio) => {
        if (typeof audio.setSinkId !== 'undefined') {
            try { await audio.setSinkId(deviceId); } catch (e) {}
        }
    });
    showToast("تم تغيير مخرج الصوت", "success");
}

async function togglePreJoinMic() {
    if (isMuted) { if (!localStream) { const ok = await requestMicPermission(); if(!ok) return; } isMuted = false; if(localStream) localStream.getAudioTracks()[0].enabled = true; } 
    else { isMuted = true; if(localStream) localStream.getAudioTracks()[0].enabled = false; }
    updatePreJoinMicUI();
}

function updatePreJoinMicUI() {
    const preview = document.getElementById('micPreview'); const preBtn = document.getElementById('preJoinMicBtn');
    if (isMuted) { preview.classList.remove('active'); preview.classList.add('muted'); preview.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>'; preBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> افتح المايك'; } 
    else { preview.classList.add('active'); preview.classList.remove('muted'); preview.innerHTML = '<i class="fa-solid fa-microphone"></i>'; preBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i> اكتم المايك'; }
}

// ================= ROOM MANAGEMENT =================
async function createRoom() {
    const name = document.getElementById('roomNameInput').value.trim() || "قعدة رايقة";
    const privacy = document.getElementById('roomPrivacy').value;
    roomId = 'room_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    
    await set(ref(rtdb, `rooms/${roomId}/info`), { name: name, adminId: currentUser.uid, privacy: privacy, createdAt: Date.now(), lastActive: Date.now() });
    
    urlParams.set('room', roomId); urlParams.set('admin', 'true');
    window.history.replaceState(null, '', '?'+urlParams.toString());
    
    enterRoomInterface();
}

async function attemptJoinRoom() {
    const infoSnap = await get(ref(rtdb, `rooms/${roomId}/info`));
    const info = infoSnap.val();
    
    const kickedSnap = await get(ref(rtdb, `rooms/${roomId}/kicked/${currentUser.uid}`));
    const isKicked = kickedSnap.val() === true;

    if (currentUser.uid === info.adminId) {
        urlParams.set('admin', 'true'); window.history.replaceState(null, '', '?'+urlParams.toString());
        enterRoomInterface();
    } else if (info.privacy === 'private' || isKicked) {
        document.getElementById('setupArea').style.display = 'none';
        document.getElementById('requestArea').style.display = 'flex';
        
        await set(ref(rtdb, `rooms/${roomId}/requests/${currentUser.uid}`), { name: currentUser.displayName, photo: currentUser.photoURL || 'images/user.png', status: 'pending' });
        
        onValue(ref(rtdb, `rooms/${roomId}/requests/${currentUser.uid}`), snap => {
            const req = snap.val();
            if (req && req.status === 'accepted') {
                document.getElementById('requestArea').style.display = 'none';
                enterRoomInterface();
            } else if (req && req.status === 'declined') {
                showToast("المعلم رفض دخولك!", "error");
                setTimeout(()=> window.location.href='dashboard.html', 2000);
            }
        });
    } else {
        enterRoomInterface();
    }
}

function enterRoomInterface() {
    document.getElementById('setupArea').style.display = 'none';
    document.getElementById('requestArea').style.display = 'none';
    document.getElementById('activeRoomArea').style.display = 'flex'; 
    
    updateActiveMicUI(); 
    setupRoomListeners();
    connectToPeers();
    setupChatListeners();

    if (localStream && !isMuted) startVisualizer(localStream, `card_${currentUser.uid}`, true);
}

function setupRoomListeners() {
    onValue(ref(rtdb, `rooms/${roomId}/info`), (snap) => {
        const data = snap.val();
        if (!data) { showToast("الغرفة اتقفلت!", "error"); setTimeout(() => window.location.href = 'dashboard.html', 1500); return; }
        roomData = data;
        isRoomAdmin = (currentUser.uid === data.adminId);
        
        document.getElementById('rNameText').innerText = data.name;
        const privBadge = document.getElementById('roomPrivacyBadge');
        const adminSelect = document.getElementById('adminPrivacySelect');

        if (isRoomAdmin) {
            privBadge.style.display = 'none'; adminSelect.style.display = 'flex'; adminSelect.value = data.privacy;
            document.getElementById('requestsTabBtn').style.display = data.privacy === 'private' ? 'block' : 'none';
            listenToRequests();
        } else {
            adminSelect.style.display = 'none'; privBadge.style.display = 'flex';
            privBadge.innerHTML = data.privacy === 'private' ? '<i class="fa-solid fa-lock"></i> خاصة' : '<i class="fa-solid fa-globe"></i> عامة';
        }
    });

    const myRef = ref(rtdb, `rooms/${roomId}/participants/${currentUser.uid}`);
    set(myRef, { name: currentUser.displayName || 'زبون', photo: currentUser.photoURL || 'images/user.png', isMuted: isMuted, forceMuted: false, unmuteTrigger: 0 });
    onDisconnect(myRef).remove(); 

    onValue(ref(rtdb, `rooms/${roomId}/participants`), (snap) => {
        const participants = snap.val() || {};
        updateParticipantsUI(participants);

        const me = participants[currentUser.uid];
        if(!me) { showToast("تم طردك.", "error"); setTimeout(() => window.location.href = 'dashboard.html', 1500); return; }
        
        if (me.forceMuted && !isMuted) {
            enforceMute();
        } else if (me.unmuteTrigger && me.unmuteTrigger > lastUnmuteTrigger) {
            lastUnmuteTrigger = me.unmuteTrigger; isMuted = false;
            if(localStream) localStream.getAudioTracks()[0].enabled = true;
            updateActiveMicUI(); showToast("المعلم سمحلك تتكلم 🎙️", "success");
        }
    });
}

function listenToRequests() {
    if(isListeningRequests) return;
    isListeningRequests = true;
    onValue(ref(rtdb, `rooms/${roomId}/requests`), snap => {
        const reqs = snap.val() || {}; const pending = Object.entries(reqs).filter(([_, r]) => r.status === 'pending');
        const badge = document.getElementById('requestAlertBadge'); const countBadge = document.getElementById('reqCountBadge'); const requestsTab = document.getElementById('requestsTab');
        
        if(pending.length > 0) {
            badge.style.display = 'flex'; countBadge.innerText = `(${pending.length})`; requestsTab.innerHTML = '';
            pending.forEach(([uid, r]) => {
                const div = document.createElement('div'); div.className = 'user-list-item';
                div.innerHTML = `<div class="user-list-info"><img src="${r.photo}"><span>${r.name}</span></div>
                    <div class="user-list-actions">
                        <button class="action-btn accept" onclick="window.handleReq('${uid}', 'accepted')"><i class="fa-solid fa-check"></i></button>
                        <button class="action-btn kick" onclick="window.handleReq('${uid}', 'declined')"><i class="fa-solid fa-xmark"></i></button>
                    </div>`;
                requestsTab.appendChild(div);
            });
        } else {
            badge.style.display = 'none'; countBadge.innerText = '';
            requestsTab.innerHTML = '<p style="text-align:center; color:gray; font-size:0.9rem;">مفيش طلبات</p>';
        }
    });
}

window.handleReq = (uid, status) => { update(ref(rtdb, `rooms/${roomId}/requests/${uid}`), { status: status }); }
window.adminMute = (uid) => { update(ref(rtdb, `rooms/${roomId}/participants/${uid}`), { forceMuted: true, isMuted: true }); }
window.adminUnmute = (uid) => { update(ref(rtdb, `rooms/${roomId}/participants/${uid}`), { forceMuted: false, isMuted: false, unmuteTrigger: Date.now() }); }
window.adminKick = (uid) => { remove(ref(rtdb, `rooms/${roomId}/participants/${uid}`)); set(ref(rtdb, `rooms/${roomId}/kicked/${uid}`), true); }

function updateParticipantsUI(participants) {
    const grid = document.getElementById('participantsGrid'); const usersTab = document.getElementById('usersTab');
    document.getElementById('participantsCount').innerText = Object.keys(participants).length;
    
    Array.from(grid.children).forEach(c => { if (!participants[c.id.replace('card_','')]) c.remove(); });
    usersTab.innerHTML = ''; 

    Object.keys(participants).forEach(uid => {
        const p = participants[uid]; const isMe = (uid === currentUser.uid);
        const micClass = p.isMuted ? 'muted' : 'active'; const micIcon = p.isMuted ? '<i class="fa-solid fa-microphone-slash"></i>' : '<i class="fa-solid fa-microphone"></i>';
        
        let card = document.getElementById(`card_${uid}`);
        if (!card) { card = document.createElement('div'); card.className = 'participant-card'; card.id = `card_${uid}`; grid.appendChild(card); }
        card.innerHTML = `<div class="mic-status-icon ${micClass}">${micIcon}</div><img src="${p.photo}"><div class="participant-name">${p.name}</div>`;

        let adminHtml = '';
        if (isRoomAdmin && !isMe) {
            const muteAction = p.isMuted 
                ? `<button class="action-btn unmute" onclick="window.adminUnmute('${uid}')" title="فك الميوت"><i class="fa-solid fa-microphone"></i></button>`
                : `<button class="action-btn mute" onclick="window.adminMute('${uid}')" title="اسحب المايك"><i class="fa-solid fa-microphone-slash"></i></button>`;
            adminHtml = `<div class="user-list-actions">${muteAction}<button class="action-btn kick" onclick="window.adminKick('${uid}')" title="طرد"><i class="fa-solid fa-ban"></i></button></div>`;
        }
        usersTab.innerHTML += `<div class="user-list-item"><div class="user-list-info"><img src="${p.photo}"> <span>${p.name} ${isMe?'(أنت)':''} ${uid === roomData?.adminId ? '<i class="fa-solid fa-crown" style="color:#f1c40f;"></i>':''}</span></div>${adminHtml}</div>`;
    });
}

function enforceMute() {
    isMuted = true;
    if(localStream) localStream.getAudioTracks()[0].enabled = false;
    updateActiveMicUI();
    showToast("المعلم سحب المايك!", "error");
    update(ref(rtdb, `rooms/${roomId}/participants/${currentUser.uid}`), { isMuted: true });
}

async function toggleMainMic() {
    if (!localStream && isMuted) { const ok = await requestMicPermission(selectedMicId); if(!ok) return; }
    get(ref(rtdb, `rooms/${roomId}/participants/${currentUser.uid}/forceMuted`)).then(snap => {
        if (snap.val() === true) { showToast("ممنوع تفتح المايك.", "error"); return; }
        isMuted = !isMuted;
        if (localStream) localStream.getAudioTracks()[0].enabled = !isMuted;
        update(ref(rtdb, `rooms/${roomId}/participants/${currentUser.uid}`), { isMuted: isMuted });
        updateActiveMicUI();
    });
}

function updateActiveMicUI() {
    const btn = document.getElementById('toggleMicBtn'); if(!btn) return;
    if (isMuted) { btn.classList.add('muted'); btn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>'; } 
    else { btn.classList.remove('muted'); btn.innerHTML = '<i class="fa-solid fa-microphone"></i>'; if(localStream) startVisualizer(localStream, `card_${currentUser.uid}`, true); }
}

// ================= WEBRTC MESH & AUDIO =================
function connectToPeers() {
    onValue(ref(rtdb, `rooms/${roomId}/participants`), (snap) => {
        const participants = snap.val() || {};

        // FIX 1: Cleanup disconnected peers
        // If someone leaves or refreshes, we must destroy their WebRTC connection and audio element
        Object.keys(peerConnections).forEach(uid => {
            if (!participants[uid]) {
                peerConnections[uid].close();
                delete peerConnections[uid];
                const audioEl = document.getElementById(`audio_${uid}`);
                if (audioEl) audioEl.remove();
            }
        });

        // FIX 2: Prevent WebRTC Glare
        Object.keys(participants).forEach(uid => {
            if (uid !== currentUser.uid && !peerConnections[uid]) {
                // By comparing UIDs, we force ONLY ONE user to be the caller.
                // The other user will naturally wait to receive the offer, perfectly completing the handshake.
                if (currentUser.uid < uid) {
                    initiateCall(uid);
                }
            }
        });
    });

    onValue(ref(rtdb, `rooms/${roomId}/signaling/${currentUser.uid}`), (snap) => {
        const data = snap.val(); if (!data) return;
        Object.keys(data).forEach(async (senderUid) => {
            const signal = data[senderUid];
            if (signal.offer && !peerConnections[senderUid]) await answerCall(senderUid, signal.offer);
            if (signal.answer && peerConnections[senderUid]) { 
                const pc = peerConnections[senderUid]; 
                if (pc.signalingState !== "stable") await pc.setRemoteDescription(new RTCSessionDescription(signal.answer)); 
            }
            if (signal.ice_candidates && peerConnections[senderUid] && peerConnections[senderUid].remoteDescription) { 
                Object.values(signal.ice_candidates).forEach(async (c) => { 
                    try { await peerConnections[senderUid].addIceCandidate(new RTCIceCandidate(c)); } catch(e){} 
                }); 
            }
        });
    });
}

async function initiateCall(targetUid) { 
    // FIX 3: Clear old signaling data from previous sessions before starting a new call
    await remove(ref(rtdb, `rooms/${roomId}/signaling/${targetUid}/${currentUser.uid}`));

    const pc = createPeerConnection(targetUid); 
    const offer = await pc.createOffer(); 
    await pc.setLocalDescription(offer); 
    await set(ref(rtdb, `rooms/${roomId}/signaling/${targetUid}/${currentUser.uid}/offer`), { type: offer.type, sdp: offer.sdp }); 
}

async function answerCall(targetUid, offerData) { 
    // FIX 4: Clear old signaling data before answering to prevent stale ICE candidates
    await remove(ref(rtdb, `rooms/${roomId}/signaling/${targetUid}/${currentUser.uid}`));

    const pc = createPeerConnection(targetUid); 
    await pc.setRemoteDescription(new RTCSessionDescription(offerData)); 
    const answer = await pc.createAnswer(); 
    await pc.setLocalDescription(answer); 
    await set(ref(rtdb, `rooms/${roomId}/signaling/${targetUid}/${currentUser.uid}/answer`), { type: answer.type, sdp: answer.sdp }); 
}
// ================= MODERN VISUALIZER =================
function startVisualizer(stream, targetId, isLocal) {
    if (!stream) return;
    
    if (activeVisualizers[targetId]) {
        cancelAnimationFrame(activeVisualizers[targetId].frameId);
        if(activeVisualizers[targetId].ctx) activeVisualizers[targetId].ctx.close();
    }

    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 256;

        const src = audioCtx.createMediaStreamSource(stream);
        src.connect(analyser); // We do NOT connect to destination to avoid echo

        const array = new Uint8Array(analyser.frequencyBinCount);

        function update() {
            if (isLocal && isMuted) {
                const el = document.getElementById(targetId);
                if (el) el.classList.remove('active', 'speaking');
                activeVisualizers[targetId].frameId = requestAnimationFrame(update);
                return;
            }

            analyser.getByteFrequencyData(array);
            let values = 0;
            for (let i = 0; i < array.length; i++) values += array[i];
            const avg = values / array.length;

            const el = document.getElementById(targetId);
            if (el) {
                if (avg > 15) {
                    el.classList.add('speaking');
                    if(isLocal) el.classList.add('active'); // For lobby circle
                } else {
                    el.classList.remove('speaking');
                    if(isLocal) el.classList.remove('active');
                }
            }
            activeVisualizers[targetId].frameId = requestAnimationFrame(update);
        }
        
        activeVisualizers[targetId] = { ctx: audioCtx, frameId: requestAnimationFrame(update) };
    } catch(e) { console.warn("Visualizer Error", e); }
}

// ================= CHAT =================
function setupChatListeners() {
    const chatArea = document.getElementById('roomChatArea');
    onValue(ref(rtdb, `rooms/${roomId}/chat`), (snap) => {
        chatArea.innerHTML = '<div style="text-align:center; color:gray; font-size:0.8rem; margin:10px 0;">الشات مؤقت.</div>';
        Object.values(snap.val() || {}).forEach(msg => {
            const isMine = msg.uid === currentUser.uid; const div = document.createElement('div'); div.className = `msg-bubble ${isMine ? 'mine' : 'others'}`;
            div.innerHTML = `${!isMine ? `<span class="msg-author">${msg.name}</span>` : ''}<div>${msg.text}</div>`;
            chatArea.appendChild(div);
        });
        chatArea.scrollTop = chatArea.scrollHeight;
    });
}
function sendMessage() { const input = document.getElementById('roomChatInput'); const text = input.value.trim(); if(!text) return; push(ref(rtdb, `rooms/${roomId}/chat`), { uid: currentUser.uid, name: currentUser.displayName.split(' ')[0], text: text }); input.value = ''; }

// ================= LEAVE OPTIONS =================
function openLeaveModal() {
    const title = document.getElementById('leaveModalTitle');
    const text = document.getElementById('leaveModalText');
    const btnContainer = document.getElementById('leaveModalButtons');
    
    if (isRoomAdmin) {
        title.innerText = "خيارات المغادرة"; text.innerText = "أنت المعلم. عايز تقفل الغرفة خالص على الكل، ولا تسيبهم وتخرج أنت بس؟";
        btnContainer.innerHTML = `
            <button class="btn-action btn-cancel close-modal-btn" data-target="leaveModal" style="flex: 1; min-width: 100px;">إلغاء</button>
            <button class="btn-action btn-warning" onclick="window.executeLeave('leave_only')" style="flex: 1; min-width: 100px;">مغادرة فقط</button>
            <button class="btn-action btn-danger" onclick="window.executeLeave('close_all')" style="flex: 1; min-width: 100px;">إنهاء للجميع</button>
        `;
    } else {
        title.innerText = "هتمشي؟"; text.innerText = "متأكد إنك عايز تسيب الغرفة؟";
        btnContainer.innerHTML = `
            <button class="btn-action btn-cancel close-modal-btn" data-target="leaveModal" style="flex: 1;">لا، هكمل</button>
            <button class="btn-action btn-danger" onclick="window.executeLeave('leave_only')" style="flex: 1;">سلام</button>
        `;
    }
    
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => document.getElementById(e.currentTarget.getAttribute('data-target')).classList.remove('active'));
    });
    document.getElementById('leaveModal').classList.add('active');
}

window.executeLeave = (type) => { 
    if (type === 'close_all' && isRoomAdmin) remove(ref(rtdb, `rooms/${roomId}`));
    else remove(ref(rtdb, `rooms/${roomId}/participants/${currentUser.uid}`));
    window.location.href = 'dashboard.html'; 
}