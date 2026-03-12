import { app } from './firebase-config.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    deleteUser,
    sendPasswordResetEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    updateDoc,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    deleteDoc,
    orderBy,
    serverTimestamp,
    deleteField,
    increment,
    writeBatch,
    onSnapshot,
    arrayUnion,
    arrayRemove
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// --- Realtime Database Imports ---
import { 
    getDatabase, 
    ref, 
    set, 
    push, 
    onValue, 
    off, 
    update, 
    remove, 
    get,    
    onDisconnect,
    serverTimestamp as rtdbTimestamp 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// ================= USER MANAGEMENT =================

async function signUp(email, password, fullName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const photoURL = 'images/user.png'; 
        
        await updateProfile(user, { displayName: fullName, photoURL: photoURL });

        await setDoc(doc(db, "users", user.uid), {
            fullName: fullName,
            searchKey: fullName.toLowerCase(),
            email: email,
            role: "زبون", 
            profileImage: photoURL,
            createdAt: serverTimestamp(),
            educationLevel: "طالب",
            bio: "أنا جديد في القهوة",
            friends: []
        });

        return { success: true, user: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function logout() {
    try { await signOut(auth); return { success: true }; } 
    catch (error) { return { success: false, error: error.message }; }
}

async function resetPassword(email) {
    try { await sendPasswordResetEmail(auth, email); return { success: true }; } 
    catch (error) { return { success: false, error: error.message }; }
}

async function changeUserPassword(oldPass, newPass) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "لازم تسجل دخول" };
    try {
        const cred = EmailAuthProvider.credential(user.email, oldPass);
        await reauthenticateWithCredential(user, cred);
        await updatePassword(user, newPass);
        return { success: true };
    } catch (error) { return { success: false, error: error.message }; }
}

async function getUserData(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return { success: true, data: docSnap.data() };
        return { success: false, error: "User not found" };
    } catch (error) { return { success: false, error: error.message }; }
}

async function updateUserProfile(data) {
    const user = auth.currentUser;
    if(!user) return { success: false, error: "Not logged in" };
    try {
        const userRef = doc(db, "users", user.uid);
        if (data.fullName) data.searchKey = data.fullName.toLowerCase();
        await updateDoc(userRef, data);
        
        const updates = {};
        if (data.profileImage) updates.photoURL = data.profileImage;
        if (data.fullName) updates.displayName = data.fullName;
        if (Object.keys(updates).length > 0) await updateProfile(user, updates);

        if (data.profileImage || data.fullName) {
            const batch = writeBatch(db);
            const q = query(collection(db, "posts"), where("authorId", "==", user.uid));
            const snap = await getDocs(q);
            snap.forEach((doc) => {
                const pUp = {};
                if (data.profileImage) pUp.authorImage = data.profileImage;
                if (data.fullName) pUp.authorName = data.fullName;
                batch.update(doc.ref, pUp);
            });
            if (!snap.empty) await batch.commit();
        }
        return { success: true };
    } catch (error) { return { success: false, error: error.message }; }
}

async function deleteUserAccount() {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "No user" };
    try { await deleteDoc(doc(db, "users", user.uid)); await deleteUser(user); return { success: true }; } 
    catch (error) { return { success: false, error: error.message }; }
}

// async function searchUsers(searchTerm) {
//     try {
//         if (!searchTerm) return { success: true, data: [] };
//         const lowerTerm = searchTerm.toLowerCase();
//         const usersRef = collection(db, "users");
//         const q = query(usersRef, where("searchKey", ">=", lowerTerm), where("searchKey", "<=", lowerTerm + '\uf8ff'));
//         const querySnapshot = await getDocs(q);
//         const users = [];
//         querySnapshot.forEach((doc) => users.push({ id: doc.id, ...doc.data() }));
//         return { success: true, data: users };
//     } catch (error) { return { success: false, error: error.message }; }
// }
// استبدل دالة searchUsers القديمة في ملف auth-service.js بهذه النسخة المطورة
async function searchUsers(searchTerm) {
    try {
        if (!searchTerm) return { success: true, data: [] };
        
        const lowerTerm = searchTerm.toLowerCase();
        const usersRef = collection(db, "users");
        
        // جلب جميع المستخدمين (لعمل فلاتر متقدمة برمجياً لأن Firestore محدود في البحث الجزئي)
        const querySnapshot = await getDocs(usersRef);
        
        const users = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const fullName = (data.fullName || "").toLowerCase();
            
            // بحث متقدم: هل المصطلح موجود في أي مكان بالاسم؟
            if (fullName.includes(lowerTerm)) {
                users.push({ id: doc.id, ...data });
            }
        });

        // ترتيب النتائج: اللي بيبدأ بالاسم يظهر الأول (Relevancy Sorting)
        users.sort((a, b) => {
            const aName = a.fullName.toLowerCase();
            const bName = b.fullName.toLowerCase();
            if (aName.startsWith(lowerTerm) && !bName.startsWith(lowerTerm)) return -1;
            if (!aName.startsWith(lowerTerm) && bName.startsWith(lowerTerm)) return 1;
            return 0;
        });

        return { success: true, data: users };
    } catch (error) { 
        return { success: false, error: error.message }; 
    }
}
async function fixAllUsersSearch() {
    try {
        const q = query(collection(db, "users"));
        const snap = await getDocs(q);
        const batch = writeBatch(db);
        let count = 0;
        snap.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.fullName && !data.searchKey) {
                batch.update(doc(db, "users", docSnap.id), { searchKey: data.fullName.toLowerCase() });
                count++;
            }
        });
        if (count > 0) await batch.commit();
        return { success: true, updated: count };
    } catch (e) { return { success: false, error: e.message }; }
}

// ================= POSTS & SOCIAL =================

async function createPost(content) {
    const user = auth.currentUser; if (!user) return { success: false, error: "Login required" };
    try {
        await addDoc(collection(db, "posts"), {
            authorId: user.uid, authorName: user.displayName || "Unknown", authorImage: user.photoURL || "images/user.png",
            content: content, timestamp: serverTimestamp(), reactions: {}, likes: [], commentsCount: 0
        });
        return { success: true };
    } catch (error) { return { success: false, error: error.message }; }
}

async function getPosts() {
    try {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        const posts = []; snap.forEach(d => posts.push({ id: d.id, ...d.data() }));
        return { success: true, data: posts };
    } catch (error) { return { success: false, error: error.message }; }
}

async function getUserPosts(uid) {
    try {
        const q = query(collection(db, "posts"), where("authorId", "==", uid), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        const posts = []; snap.forEach(d => posts.push({id:d.id, ...d.data()}));
        return { success: true, data: posts };
    } catch (error) {
        if (error.code === 'failed-precondition' || error.message.includes("index")) {
            const allQ = query(collection(db, "posts"), orderBy("timestamp", "desc"));
            const snap = await getDocs(allQ);
            const posts = [];
            snap.forEach(d => { if (d.data().authorId === uid) posts.push({id:d.id, ...d.data()}); });
            return { success: true, data: posts };
        }
        return { success: false, error: error.message };
    }
}

async function toggleLike(postId, type = null, collectionName = 'posts') {
    const user = auth.currentUser; if (!user) return { success: false };
    try {
        const postRef = doc(db, collectionName, postId);
        if (type) await updateDoc(postRef, { [`reactions.${user.uid}`]: type });
        else await updateDoc(postRef, { [`reactions.${user.uid}`]: deleteField() });
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

async function deletePost(postId, collectionName = 'posts') {
    try { await deleteDoc(doc(db, collectionName, postId)); return { success: true }; } catch (e) { return { success: false, error: e.message }; }
}

async function addComment(postId, content, collectionName = 'posts') {
    const user = auth.currentUser; if (!user) return { success: false };
    try {
        let name = user.displayName||"زبون"; let img = user.photoURL||"images/user.png";
        if(collectionName === 'secrets'){ name="فاعل خير"; img="anonymous"; }
        await addDoc(collection(db, collectionName, postId, "comments"), { 
            content: content, authorId: user.uid, authorName: name, authorImage: img, timestamp: serverTimestamp() 
        });
        await updateDoc(doc(db, collectionName, postId), { commentsCount: increment(1) });
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

async function getComments(postId, collectionName = 'posts') {
    try {
        const q = query(collection(db, collectionName, postId, "comments"), orderBy("timestamp", "asc"));
        const snap = await getDocs(q);
        const data = []; snap.forEach(d => data.push({id:d.id, ...d.data()}));
        return { success: true, data: data };
    } catch (e) { return { success: false, error: e.message }; }
}

// ================= SECRETS =================

async function createSecret(content) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Login required" };
    try {
        await addDoc(collection(db, "secrets"), { 
            authorId: user.uid, fakeName: "بير الأسرار", content: content, timestamp: serverTimestamp(), reactions: {}, commentsCount: 0, type: 'secret' 
        });
        return { success: true };
    } catch (error) { return { success: false, error: error.message }; }
}

async function getSecrets() {
    try {
        const q = query(collection(db, "secrets"), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        const secrets = []; snap.forEach(doc => secrets.push({ id: doc.id, ...doc.data() }));
        return { success: true, data: secrets };
    } catch (error) { return { success: false, error: error.message }; }
}

// ================= NOTIFICATIONS =================

async function createNotification(targetUid, type, message, extraData = {}) {
    try {
        await addDoc(collection(db, "notifications"), {
            userId: targetUid, type: type, message: message, read: false, timestamp: serverTimestamp(), ...extraData
        });
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

async function getNotifications() {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "No User" };
    try {
        const q = query(collection(db, "notifications"), where("userId", "==", user.uid), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        const data = []; snap.forEach(d => data.push({ id: d.id, ...d.data() }));
        return { success: true, data: data };
    } catch (e) {
        if(e.message.includes("index")) {
            const q2 = query(collection(db, "notifications"), where("userId", "==", user.uid));
            const snap = await getDocs(q2);
            const data = []; snap.forEach(d => data.push({ id: d.id, ...d.data() }));
            data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
            return { success: true, data: data };
        }
        return { success: false, error: e.message };
    }
}

async function markNotificationRead(notifId) {
    try { await updateDoc(doc(db, "notifications", notifId), { read: true }); return { success: true }; } 
    catch (e) { return { success: false, error: e.message }; }
}

// ================= FRIENDS =================

async function getFriendshipStatus(targetUid) {
    const user = auth.currentUser; if (!user) return 'none';
    if (user.uid === targetUid) return 'self';
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const friends = userDoc.data()?.friends || [];
    if (friends.includes(targetUid)) return 'friends';
    const outQ = query(collection(db, "friendRequests"), where("from", "==", user.uid), where("to", "==", targetUid));
    if (!(await getDocs(outQ)).empty) return 'pending_sent';
    const inQ = query(collection(db, "friendRequests"), where("from", "==", targetUid), where("to", "==", user.uid));
    if (!(await getDocs(inQ)).empty) return 'pending_received';
    return 'none';
}

async function sendFriendRequest(targetUid) {
    const user = auth.currentUser; if (!user) return { success: false };
    try {
        const q = query(collection(db, "friendRequests"), where("from", "==", user.uid), where("to", "==", targetUid));
        if(!(await getDocs(q)).empty) return { success: true }; 
        await addDoc(collection(db, "friendRequests"), { from: user.uid, to: targetUid, timestamp: serverTimestamp(), status: 'pending' });
        await createNotification(targetUid, 'friend_request', `${user.displayName} بعتلك طلب صداقة`, { senderId: user.uid });
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

async function getIncomingRequests() {
    const user = auth.currentUser; if (!user) return { success: false, error: "No User" };
    try {
        const q = query(collection(db, "friendRequests"), where("to", "==", user.uid), where("status", "==", "pending"));
        const snap = await getDocs(q);
        const requests = [];
        for (const d of snap.docs) {
            const reqData = d.data();
            const senderDoc = await getDoc(doc(db, "users", reqData.from));
            if (senderDoc.exists()) requests.push({ requestId: d.id, ...reqData, sender: senderDoc.data() });
        }
        return { success: true, data: requests };
    } catch (e) { return { success: false, error: e.message }; }
}

async function acceptFriendRequest(requestId, senderUid) {
    const user = auth.currentUser; if (!user) return { success: false };
    try {
        const batch = writeBatch(db);
        batch.update(doc(db, "users", user.uid), { friends: arrayUnion(senderUid) });
        batch.update(doc(db, "users", senderUid), { friends: arrayUnion(user.uid) });
        if (requestId && requestId !== 'dummy' && requestId !== 'dummy_req_id') {
             batch.delete(doc(db, "friendRequests", requestId));
        } else {
             const q = query(collection(db, "friendRequests"), where("from", "==", senderUid), where("to", "==", user.uid));
             const snap = await getDocs(q);
             snap.forEach(d => batch.delete(d.ref));
        }
        await batch.commit();
        await createNotification(senderUid, 'request_accepted', `${user.displayName} قبل طلب الصداقة`, { friendId: user.uid });
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

async function denyFriendRequest(requestId) {
    try { await deleteDoc(doc(db, "friendRequests", requestId)); return { success: true }; } 
    catch (e) { return { success: false, error: e.message }; }
}

async function removeFriend(friendUid) {
    const user = auth.currentUser;
    try {
        const batch = writeBatch(db);
        batch.update(doc(db, "users", user.uid), { friends: arrayRemove(friendUid) });
        batch.update(doc(db, "users", friendUid), { friends: arrayRemove(user.uid) });
        await batch.commit();
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

async function getUserFriends(uid) {
    try {
        const docSnap = await getDoc(doc(db, "users", uid));
        if (!docSnap.exists()) return { success: true, data: [] };
        const friendIds = docSnap.data().friends || [];
        if (friendIds.length === 0) return { success: true, data: [] };
        const friendsData = [];
        for (const fid of friendIds.slice(0, 20)) {
            const fDoc = await getDoc(doc(db, "users", fid));
            if (fDoc.exists()) friendsData.push({ id: fDoc.id, ...fDoc.data() });
        }
        return { success: true, data: friendsData };
    } catch (e) { return { success: false, error: e.message }; }
}

// ================= GAMES =================

async function createOnlineGame() {
    const user = auth.currentUser; if (!user) return { success: false, error: "Login first" };
    try {
        const gameRef = await addDoc(collection(db, "games"), {
            playerX: user.uid, playerXName: user.displayName, playerO: null, playerOName: "...",
            board: ["", "", "", "", "", "", "", "", ""], turn: "X", winner: null, status: "waiting", createdAt: serverTimestamp()
        });
        return { success: true, gameId: gameRef.id };
    } catch (e) { return { success: false, error: e.message }; }
}

async function joinOnlineGame(gameId) {
    const user = auth.currentUser; if (!user) return { success: false, error: "Login first" };
    try {
        const gameRef = doc(db, "games", gameId);
        const gameSnap = await getDoc(gameRef);
        if (!gameSnap.exists()) return { success: false, error: "Game not found" };
        const data = gameSnap.data();
        if (data.playerX === user.uid) return { success: true, role: 'X' }; 
        if (data.status !== 'waiting' && data.playerO !== user.uid) return { success: false, error: "Game full" };
        await updateDoc(gameRef, { playerO: user.uid, playerOName: user.displayName, status: "playing" });
        return { success: true, role: 'O' };
    } catch (e) { return { success: false, error: e.message }; }
}

async function makeOnlineMove(gameId, newBoard, nextTurn, winner) {
    try {
        const updateData = { board: newBoard, turn: nextTurn };
        if (winner) { updateData.status = 'finished'; updateData.winner = winner; }
        await updateDoc(doc(db, "games", gameId), updateData);
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

async function resetOnlineGame(gameId) {
    try { await updateDoc(doc(db, "games", gameId), { board: ["", "", "", "", "", "", "", "", ""], turn: "X", winner: null, status: "playing" }); return { success: true }; } 
    catch (e) { return { success: false, error: e.message }; }
}

async function sendGameInvite(friendId, gameId, gameType = 'xo') {
    const user = auth.currentUser;
    try {
        let msg = "";
        if (gameType === 'chess') msg = `${user.displayName} بيتحداك في جيم شطرنج ♟️`;
        else if (gameType === 'domino') msg = `${user.displayName} بيتحداك في دور دومينو 🎲`;
        else msg = `${user.displayName} بيتحداك في جيم XO ❌⭕`;
        await createNotification(friendId, 'game_invite', msg, { gameId: gameId, gameType: gameType });
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

// --- CHESS ---
async function createChessGame() {
    const user = auth.currentUser; if (!user) return { success: false, error: "لازم تسجل دخول" };
    try {
        const startFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        const gameRef = await addDoc(collection(db, "chess_games"), {
            white: user.uid, whiteName: user.displayName, black: null, blackName: "...",
            fen: startFEN, turn: "w", status: "waiting", winner: null, lastMove: null, createdAt: serverTimestamp()
        });
        return { success: true, gameId: gameRef.id };
    } catch (e) { return { success: false, error: e.message }; }
}

async function joinChessGame(gameId) {
    const user = auth.currentUser; if (!user) return { success: false, error: "لازم تسجل دخول" };
    try {
        const gameRef = doc(db, "chess_games", gameId);
        const gameSnap = await getDoc(gameRef);
        if (!gameSnap.exists()) return { success: false, error: "اللعبة مش موجودة" };
        const data = gameSnap.data();
        if (data.white === user.uid) return { success: true, color: 'white' }; 
        if (data.status === 'waiting' && data.black !== user.uid) {
            await updateDoc(gameRef, { black: user.uid, blackName: user.displayName, status: "playing" });
            return { success: true, color: 'black' };
        }
        if (data.black === user.uid) return { success: true, color: 'black' };
        return { success: false, error: "اللعبة مكتملة" };
    } catch (e) { return { success: false, error: e.message }; }
}

async function makeChessMove(gameId, newFEN, nextTurn, moveData, winner = null) {
    try {
        const updateData = { fen: newFEN, turn: nextTurn, lastMove: moveData };
        if (winner) { updateData.status = 'finished'; updateData.winner = winner; }
        await updateDoc(doc(db, "chess_games", gameId), updateData);
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

// --- DOMINO (UPDATED WITH DELETE DB FUNCTION) ---
async function createDominoGame(hostHand, guestHand, boneyard) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Login required" };
    try {
        const docRef = await addDoc(collection(db, "domino_games"), {
            hostId: user.uid,
            hostName: user.displayName,
            guestId: null,
            guestName: "...",
            status: 'waiting',
            turn: 'host',
            board: [],
            hostHand: hostHand,
            guestHand: guestHand,
            boneyard: boneyard, 
            scores: { host: 0, guest: 0 },
            lastMove: null,
            createdAt: serverTimestamp()
        });
        return { success: true, gameId: docRef.id };
    } catch (e) { return { success: false, error: e.message }; }
}

async function joinDominoGame(gameId) {
     const user = auth.currentUser;
     if (!user) return { success: false, error: "Login required" };
     try {
         const gameRef = doc(db, "domino_games", gameId);
         const snap = await getDoc(gameRef);
         if (!snap.exists()) return { success: false, error: "Game not found" };
         const data = snap.data();
         
         if (data.hostId === user.uid) return { success: true, role: 'host', hand: data.hostHand };
         if (data.guestId === user.uid) return { success: true, role: 'guest', hand: data.guestHand };
         
         if (data.status !== 'waiting') return { success: false, error: "Game full" };
         
         await updateDoc(gameRef, {
             guestId: user.uid,
             guestName: user.displayName,
             status: 'playing'
         });
         return { success: true, role: 'guest', hand: data.guestHand };
     } catch (e) { return { success: false, error: e.message }; }
}

async function makeDominoMove(gameId, updateData) {
    try {
        await updateDoc(doc(db, "domino_games", gameId), updateData);
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

// دالة جديدة لحذف الغرفة من قاعدة البيانات
async function deleteDominoGame(gameId) {
    try {
        await deleteDoc(doc(db, "domino_games", gameId));
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

// ================= REALTIME CHAT SYSTEM =================

function getChatId(uid1, uid2) { return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`; }

async function sendMessage(recipientId, content) {
    const user = auth.currentUser; if (!user || !content.trim()) return;
    const chatId = getChatId(user.uid, recipientId);
    
    const messagesRef = ref(rtdb, `messages/${chatId}`);
    await set(push(messagesRef), { senderId: user.uid, content: content, timestamp: rtdbTimestamp() });

    const senderChatRef = ref(rtdb, `users/${user.uid}/chats/${recipientId}`);
    await update(senderChatRef, { lastMessage: content, timestamp: rtdbTimestamp(), otherUserId: recipientId });

    const recipientChatRef = ref(rtdb, `users/${recipientId}/chats/${user.uid}`);
    await update(recipientChatRef, { lastMessage: content, timestamp: rtdbTimestamp(), otherUserId: user.uid });
    
    return { success: true };
}

function subscribeToChat(recipientId, callback) {
    const user = auth.currentUser; if (!user) return;
    const chatId = getChatId(user.uid, recipientId);
    return onValue(ref(rtdb, `messages/${chatId}`), (snapshot) => {
        const data = snapshot.val();
        const messages = [];
        if (data) Object.keys(data).forEach(key => messages.push({ id: key, ...data[key] }));
        callback(messages);
    });
}

function subscribeToChatList(callback) {
    const user = auth.currentUser; if (!user) return;
    return onValue(ref(rtdb, `users/${user.uid}/chats`), (snapshot) => {
        const data = snapshot.val();
        const chats = [];
        if (data) Object.keys(data).forEach(key => chats.push({ otherUserId: key, ...data[key] }));
        chats.sort((a, b) => b.timestamp - a.timestamp);
        callback(chats);
    });
}

function subscribeToUserStatus(uid, callback) {
    return onValue(ref(rtdb, `/status/${uid}`), (snapshot) => callback(snapshot.val()));
}

// ================= EXPORTS =================
export {
    auth, db, doc, onSnapshot,
    signUp, login, logout, resetPassword, changeUserPassword, getUserData, updateUserProfile, deleteUserAccount,
    onAuthStateChanged, 
    createPost, getPosts, getUserPosts, toggleLike, deletePost, addComment, getComments,
    createSecret, getSecrets,
    getFriendshipStatus, sendFriendRequest, acceptFriendRequest, denyFriendRequest, getIncomingRequests, removeFriend, getUserFriends,
    getNotifications, markNotificationRead, createNotification,
    searchUsers, fixAllUsersSearch,
    createOnlineGame, joinOnlineGame, makeOnlineMove, resetOnlineGame, sendGameInvite,
    createChessGame, joinChessGame, makeChessMove,
    
    // DOMINO EXPORTS (Added Delete Function)
    createDominoGame, joinDominoGame, makeDominoMove, deleteDominoGame,
    
    // CHAT
    sendMessage, subscribeToChat, subscribeToChatList, subscribeToUserStatus,
    
    // Firestore Helpers
    getDoc, updateDoc, addDoc, collection, query, where, getDocs, serverTimestamp,
    
    // REALTIME DB EXPORTS
    rtdb, ref, set, update, onValue, remove, get, push, onDisconnect
};