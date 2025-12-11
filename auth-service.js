// // auth-service.js
// import { app } from './firebase-config.js';
// import { 
//     getAuth, 
//     createUserWithEmailAndPassword, 
//     signInWithEmailAndPassword,
//     signOut,
//     onAuthStateChanged,
//     updateProfile,
//     deleteUser,
//     sendPasswordResetEmail // <--- IMPORTED THIS
// } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
// import { 
//     getFirestore, 
//     doc, 
//     setDoc, 
//     getDoc,
//     updateDoc,
//     collection,
//     addDoc,
//     query,
//     where,
//     getDocs,
//     deleteDoc,
//     orderBy,
//     serverTimestamp,
//     deleteField,
//     increment 
// } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// const auth = getAuth(app);
// const db = getFirestore(app);

// // --- User Management ---
// async function signUp(email, password, fullName) {
//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
//         const photoURL = 'images/user.png'; 
        
//         await updateProfile(user, { displayName: fullName, photoURL: photoURL });

//         await setDoc(doc(db, "users", user.uid), {
//             fullName: fullName,
//             email: email,
//             role: "زبون", 
//             createdAt: serverTimestamp(),
//             educationLevel: "طالب",
//             bio: "أنا جديد في القهوة"
//         });

//         return { success: true, user: user };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function login(email, password) {
//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         return { success: true, user: userCredential.user };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function logout() {
//     try {
//         await signOut(auth);
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// // --- NEW FUNCTION: Reset Password ---
// async function resetPassword(email) {
//     try {
//         await sendPasswordResetEmail(auth, email);
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function getUserData(uid) {
//     try {
//         const docRef = doc(db, "users", uid);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) return { success: true, data: docSnap.data() };
//         return { success: false, error: "User not found" };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function updateUserProfile(data) {
//     const user = auth.currentUser;
//     if(!user) return { success: false, error: "Not logged in" };
//     try {
//         const userRef = doc(db, "users", user.uid);
//         await updateDoc(userRef, data);
        
//         const updates = {};
//         if (data.profileImage) updates.photoURL = data.profileImage;
//         if (data.fullName) updates.displayName = data.fullName;
//         if (Object.keys(updates).length > 0) await updateProfile(user, updates);

//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function deleteUserAccount() {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "No user" };
//     try {
//         await deleteDoc(doc(db, "users", user.uid));
//         await deleteUser(user);
//         return { success: true };
//     } catch (error) {
//         if(error.code === 'auth/requires-recent-login') return { success: false, error: "requires-recent-login" };
//         return { success: false, error: error.message };
//     }
// }

// // --- Posts System ---
// async function createPost(content) {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };
//     try {
//         const postData = {
//             authorId: user.uid,
//             authorName: user.displayName || "Unknown",
//             authorImage: user.photoURL || "images/user.png",
//             content: content,
//             timestamp: serverTimestamp(),
//             reactions: {}, 
//             likes: [], 
//             commentsCount: 0
//         };
//         await addDoc(collection(db, "posts"), postData);
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function getPosts() {
//     try {
//         const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
//         const querySnapshot = await getDocs(q);
//         const posts = [];
//         querySnapshot.forEach((doc) => posts.push({ id: doc.id, ...doc.data() }));
//         return { success: true, data: posts };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function getUserPosts(uid) {
//     try {
//         const q = query(
//             collection(db, "posts"), 
//             where("authorId", "==", uid),
//             orderBy("timestamp", "desc")
//         );
//         const querySnapshot = await getDocs(q);
//         const posts = [];
//         querySnapshot.forEach((doc) => posts.push({ id: doc.id, ...doc.data() }));
//         return { success: true, data: posts };
//     } catch (error) {
//         if(error.message.includes("index")) {
//             console.warn("Missing Index, filtering client side");
//             const all = await getPosts();
//             if(all.success) {
//                 return { success: true, data: all.data.filter(p => p.authorId === uid) };
//             }
//         }
//         return { success: false, error: error.message };
//     }
// }

// // --- SECRETS SYSTEM ---
// async function createSecret(content) {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };
//     try {
//         const secretData = {
//             authorId: user.uid, 
//             fakeName: "بير الأسرار", 
//             content: content,
//             timestamp: serverTimestamp(),
//             reactions: {}, 
//             commentsCount: 0,
//             type: 'secret'
//         };
//         await addDoc(collection(db, "secrets"), secretData);
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function getSecrets() {
//     try {
//         const q = query(collection(db, "secrets"), orderBy("timestamp", "desc"));
//         const querySnapshot = await getDocs(q);
//         const secrets = [];
//         querySnapshot.forEach((doc) => secrets.push({ id: doc.id, ...doc.data() }));
//         return { success: true, data: secrets };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// // --- SHARED ACTIONS ---

// async function toggleLike(postId, type = null, collectionName = 'posts') {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };

//     try {
//         const postRef = doc(db, collectionName, postId);
        
//         if (type) {
//             await updateDoc(postRef, {
//                 [`reactions.${user.uid}`]: type
//             });
//         } else {
//             await updateDoc(postRef, {
//                 [`reactions.${user.uid}`]: deleteField()
//             });
//         }
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function deletePost(postId, collectionName = 'posts') {
//     try {
//         await deleteDoc(doc(db, collectionName, postId));
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function addComment(postId, content, collectionName = 'posts') {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };
    
//     try {
//         let nameToSave = user.displayName || "زبون القهوة";
//         let imageToSave = user.photoURL || "images/user.png";

//         if (collectionName === 'secrets') {
//             nameToSave = "فاعل خير";
//             imageToSave = "anonymous"; 
//         }

//         const commentRef = collection(db, collectionName, postId, "comments");
//         await addDoc(commentRef, {
//             content: content,
//             authorId: user.uid, 
//             authorName: nameToSave,
//             authorImage: imageToSave,
//             timestamp: serverTimestamp()
//         });

//         const postRef = doc(db, collectionName, postId);
//         await updateDoc(postRef, {
//             commentsCount: increment(1)
//         });

//         return { success: true };
//     } catch (error) {
//         console.error("Error adding comment:", error);
//         return { success: false, error: error.message };
//     }
// }

// async function getComments(postId, collectionName = 'posts') {
//     try {
//         const q = query(
//             collection(db, collectionName, postId, "comments"), 
//             orderBy("timestamp", "asc")
//         );
//         const querySnapshot = await getDocs(q);
//         const comments = [];
//         querySnapshot.forEach((doc) => {
//             comments.push({ id: doc.id, ...doc.data() });
//         });
//         return { success: true, data: comments };
//     } catch (error) {
//         console.error("Error fetching comments:", error);
//         return { success: false, error: error.message };
//     }
// }

// export {
//     auth,
//     db,
//     signUp,
//     login,
//     logout,
//     resetPassword, // <--- Exported
//     getUserData,
//     updateUserProfile,
//     deleteUserAccount,
//     onAuthStateChanged,
//     createPost,
//     getPosts,
//     getUserPosts,
//     toggleLike,
//     deletePost,
//     addComment,
//     getComments,
//     createSecret,
//     getSecrets
// };






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

const auth = getAuth(app);
const db = getFirestore(app);

// ================= USER MANAGEMENT =================

async function signUp(email, password, fullName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const photoURL = 'images/user.png'; 
        
        await updateProfile(user, { displayName: fullName, photoURL: photoURL });

        await setDoc(doc(db, "users", user.uid), {
            fullName: fullName,
            email: email,
            role: "زبون", 
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
        await updateDoc(userRef, data);
        
        const updates = {};
        if (data.profileImage) updates.photoURL = data.profileImage;
        if (data.fullName) updates.displayName = data.fullName;
        if (Object.keys(updates).length > 0) await updateProfile(user, updates);

        // Update Author info in posts
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

// ================= POSTS SYSTEM =================

async function createPost(content) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Login required" };
    try {
        await addDoc(collection(db, "posts"), {
            authorId: user.uid,
            authorName: user.displayName || "Unknown",
            authorImage: user.photoURL || "images/user.png",
            content: content,
            timestamp: serverTimestamp(),
            reactions: {}, 
            likes: [], 
            commentsCount: 0
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
            console.warn("Index missing, falling back to client-side filtering...");
            const allQ = query(collection(db, "posts"), orderBy("timestamp", "desc"));
            const snap = await getDocs(allQ);
            const posts = [];
            snap.forEach(d => { if (d.data().authorId === uid) posts.push({id:d.id, ...d.data()}); });
            return { success: true, data: posts };
        }
        return { success: false, error: error.message };
    }
}

// ================= SECRETS SYSTEM (ADDED BACK) =================

async function createSecret(content) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Login required" };
    try {
        const secretData = {
            authorId: user.uid, 
            fakeName: "بير الأسرار", 
            content: content,
            timestamp: serverTimestamp(),
            reactions: {}, 
            commentsCount: 0,
            type: 'secret'
        };
        await addDoc(collection(db, "secrets"), secretData);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getSecrets() {
    try {
        const q = query(collection(db, "secrets"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const secrets = [];
        querySnapshot.forEach((doc) => secrets.push({ id: doc.id, ...doc.data() }));
        return { success: true, data: secrets };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ================= SHARED ACTIONS =================

async function toggleLike(postId, type = null, collectionName = 'posts') {
    const user = auth.currentUser; if (!user) return { success: false, error: "Login required" };
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
    const user = auth.currentUser; if (!user) return { success: false, error: "Login required" };
    try {
        let name = user.displayName||"زبون"; let img = user.photoURL||"images/user.png";
        if(collectionName==='secrets'){ name="فاعل خير"; img="anonymous"; }
        await addDoc(collection(db, collectionName, postId, "comments"), { content:content, authorId:user.uid, authorName:name, authorImage:img, timestamp:serverTimestamp() });
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

// ================= NOTIFICATIONS & FRIENDS =================
// (Kept from your update)

async function createNotification(targetUid, type, message, extraData = {}) {
    try {
        await addDoc(collection(db, "notifications"), {
            userId: targetUid,
            type: type, 
            message: message,
            read: false,
            timestamp: serverTimestamp(),
            ...extraData
        });
    } catch (e) { console.error("Notif Error:", e); }
}

async function getNotifications() {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "No User" };
    try {
        const q = query(collection(db, "notifications"), where("userId", "==", user.uid), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        const data = [];
        snap.forEach(d => data.push({ id: d.id, ...d.data() }));
        return { success: true, data: data };
    } catch (e) {
        if(e.message.includes("index")) {
            const q2 = query(collection(db, "notifications"), where("userId", "==", user.uid));
            const snap = await getDocs(q2);
            const data = []; snap.forEach(d => data.push({ id: d.id, ...d.data() }));
            return { success: true, data: data };
        }
        return { success: false, error: e.message };
    }
}

async function markNotificationRead(notifId) {
    try { await updateDoc(doc(db, "notifications", notifId), { read: true }); return { success: true }; } 
    catch (e) { return { success: false, error: e.message }; }
}

async function getFriendshipStatus(targetUid) {
    const user = auth.currentUser;
    if (!user) return 'none';
    if (user.uid === targetUid) return 'self';
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const friends = userDoc.data()?.friends || [];
    if (friends.includes(targetUid)) return 'friends';
    const outQ = query(collection(db, "friendRequests"), where("from", "==", user.uid), where("to", "==", targetUid));
    const outSnap = await getDocs(outQ);
    if (!outSnap.empty) return 'pending_sent';
    const inQ = query(collection(db, "friendRequests"), where("from", "==", targetUid), where("to", "==", user.uid));
    const inSnap = await getDocs(inQ);
    if (!inSnap.empty) return 'pending_received';
    return 'none';
}

async function sendFriendRequest(targetUid) {
    const user = auth.currentUser;
    if (!user) return { success: false };
    try {
        const q = query(collection(db, "friendRequests"), where("from", "==", user.uid), where("to", "==", targetUid));
        const snap = await getDocs(q);
        if(!snap.empty) return { success: true };
        await addDoc(collection(db, "friendRequests"), { from: user.uid, to: targetUid, timestamp: serverTimestamp(), status: 'pending' });
        await createNotification(targetUid, 'friend_request', `${user.displayName} بعتلك طلب صداقة`, { senderId: user.uid });
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

async function getIncomingRequests() {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "No User" };
    try {
        const q = query(collection(db, "friendRequests"), where("to", "==", user.uid), where("status", "==", "pending"));
        const snap = await getDocs(q);
        const requests = [];
        for (const d of snap.docs) {
            const reqData = d.data();
            const senderDoc = await getDoc(doc(db, "users", reqData.from));
            if (senderDoc.exists()) { requests.push({ requestId: d.id, ...reqData, sender: senderDoc.data() }); }
        }
        return { success: true, data: requests };
    } catch (e) { return { success: false, error: e.message }; }
}

async function acceptFriendRequest(requestId, senderUid) {
    const user = auth.currentUser;
    if (!user) return { success: false };
    try {
        const batch = writeBatch(db);
        const userRef = doc(db, "users", user.uid);
        batch.update(userRef, { friends: arrayUnion(senderUid) });
        const senderRef = doc(db, "users", senderUid);
        batch.update(senderRef, { friends: arrayUnion(user.uid) });
        batch.delete(doc(db, "friendRequests", requestId));
        await batch.commit();
        await createNotification(senderUid, 'request_accepted', `${user.displayName} قبل طلب الصداقة`, { friendId: user.uid });
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

async function denyFriendRequest(requestId) {
    try { await deleteDoc(doc(db, "friendRequests", requestId)); return { success: true }; } catch (e) { return { success: false, error: e.message }; }
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
        const limitedIds = friendIds.slice(0, 20); 
        for (const fid of limitedIds) {
            const fDoc = await getDoc(doc(db, "users", fid));
            if (fDoc.exists()) { friendsData.push({ id: fDoc.id, ...fDoc.data() }); }
        }
        return { success: true, data: friendsData };
    } catch (e) { return { success: false, error: e.message }; }
}

// ================= ONLINE GAMES SYSTEM =================

async function createOnlineGame() {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Login first" };
    try {
        const gameRef = await addDoc(collection(db, "games"), {
            playerX: user.uid, playerXName: user.displayName,
            playerO: null, playerOName: "...",
            board: ["", "", "", "", "", "", "", "", ""],
            turn: "X", winner: null, status: "waiting", createdAt: serverTimestamp()
        });
        return { success: true, gameId: gameRef.id };
    } catch (e) { return { success: false, error: e.message }; }
}

async function joinOnlineGame(gameId) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Login first" };
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
    try {
        await updateDoc(doc(db, "games", gameId), { board: ["", "", "", "", "", "", "", "", ""], turn: "X", winner: null, status: "playing" });
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

async function sendGameInvite(friendId, gameId) {
    const user = auth.currentUser;
    try {
        await createNotification(friendId, 'game_invite', `${user.displayName} بيتحداك في XO`, { gameId: gameId });
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

// ================= EXPORTS =================

export {
    auth, db, doc, onSnapshot,
    signUp, login, logout, resetPassword, changeUserPassword, getUserData, updateUserProfile, deleteUserAccount,
    onAuthStateChanged, 
    // Posts
    createPost, getPosts, getUserPosts, toggleLike, deletePost, addComment, getComments,
    // Secrets (FIXED: Added Back)
    createSecret, getSecrets,
    // Friends
    getFriendshipStatus, sendFriendRequest, acceptFriendRequest, denyFriendRequest, getIncomingRequests, removeFriend, getUserFriends,
    // Notifications
    getNotifications, markNotificationRead,
    // Games
    createOnlineGame, joinOnlineGame, makeOnlineMove, resetOnlineGame, sendGameInvite
};






// import { app } from './firebase-config.js';
// import { 
//     getAuth, 
//     createUserWithEmailAndPassword, 
//     signInWithEmailAndPassword,
//     signOut,
//     onAuthStateChanged,
//     updateProfile,
//     deleteUser,
//     sendPasswordResetEmail,
//     updatePassword,
//     reauthenticateWithCredential,
//     EmailAuthProvider
// } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
// import { 
//     getFirestore, 
//     doc, 
//     setDoc, 
//     getDoc,
//     updateDoc,
//     collection,
//     addDoc,
//     query,
//     where,
//     getDocs,
//     deleteDoc,
//     orderBy,
//     serverTimestamp,
//     deleteField,
//     increment,
//     writeBatch,
//     onSnapshot,
//     arrayUnion,
//     arrayRemove
// } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// const auth = getAuth(app);
// const db = getFirestore(app);

// // ================= USER MANAGEMENT =================

// async function signUp(email, password, fullName) {
//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
//         const photoURL = 'images/user.png'; 
        
//         await updateProfile(user, { displayName: fullName, photoURL: photoURL });

//         await setDoc(doc(db, "users", user.uid), {
//             fullName: fullName,
//             email: email,
//             role: "زبون", 
//             createdAt: serverTimestamp(),
//             educationLevel: "طالب",
//             bio: "أنا جديد في القهوة",
//             friends: []
//         });

//         return { success: true, user: user };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function login(email, password) {
//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         return { success: true, user: userCredential.user };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function logout() {
//     try { await signOut(auth); return { success: true }; } 
//     catch (error) { return { success: false, error: error.message }; }
// }

// async function resetPassword(email) {
//     try { await sendPasswordResetEmail(auth, email); return { success: true }; } 
//     catch (error) { return { success: false, error: error.message }; }
// }

// async function changeUserPassword(oldPass, newPass) {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "لازم تسجل دخول" };
//     try {
//         const cred = EmailAuthProvider.credential(user.email, oldPass);
//         await reauthenticateWithCredential(user, cred);
//         await updatePassword(user, newPass);
//         return { success: true };
//     } catch (error) { return { success: false, error: error.message }; }
// }

// async function getUserData(uid) {
//     try {
//         const docRef = doc(db, "users", uid);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) return { success: true, data: docSnap.data() };
//         return { success: false, error: "User not found" };
//     } catch (error) { return { success: false, error: error.message }; }
// }

// async function updateUserProfile(data) {
//     const user = auth.currentUser;
//     if(!user) return { success: false, error: "Not logged in" };
//     try {
//         const userRef = doc(db, "users", user.uid);
//         await updateDoc(userRef, data);
        
//         const updates = {};
//         if (data.profileImage) updates.photoURL = data.profileImage;
//         if (data.fullName) updates.displayName = data.fullName;
//         if (Object.keys(updates).length > 0) await updateProfile(user, updates);

//         // Update Author info in posts
//         if (data.profileImage || data.fullName) {
//             const batch = writeBatch(db);
//             const q = query(collection(db, "posts"), where("authorId", "==", user.uid));
//             const snap = await getDocs(q);
//             snap.forEach((doc) => {
//                 const pUp = {};
//                 if (data.profileImage) pUp.authorImage = data.profileImage;
//                 if (data.fullName) pUp.authorName = data.fullName;
//                 batch.update(doc.ref, pUp);
//             });
//             if (!snap.empty) await batch.commit();
//         }

//         return { success: true };
//     } catch (error) { return { success: false, error: error.message }; }
// }

// async function deleteUserAccount() {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "No user" };
//     try { await deleteDoc(doc(db, "users", user.uid)); await deleteUser(user); return { success: true }; } 
//     catch (error) { return { success: false, error: error.message }; }
// }

// // ================= POSTS SYSTEM =================

// async function createPost(content) {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };
//     try {
//         await addDoc(collection(db, "posts"), {
//             authorId: user.uid,
//             authorName: user.displayName || "Unknown",
//             authorImage: user.photoURL || "images/user.png",
//             content: content,
//             timestamp: serverTimestamp(),
//             reactions: {}, 
//             likes: [], 
//             commentsCount: 0
//         });
//         return { success: true };
//     } catch (error) { return { success: false, error: error.message }; }
// }

// async function getPosts() {
//     try {
//         const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
//         const snap = await getDocs(q);
//         const posts = []; snap.forEach(d => posts.push({ id: d.id, ...d.data() }));
//         return { success: true, data: posts };
//     } catch (error) { return { success: false, error: error.message }; }
// }

// async function getUserPosts(uid) {
//     try {
//         const q = query(collection(db, "posts"), where("authorId", "==", uid), orderBy("timestamp", "desc"));
//         const snap = await getDocs(q);
//         const posts = []; snap.forEach(d => posts.push({id:d.id, ...d.data()}));
//         return { success: true, data: posts };
//     } catch (error) {
//         if (error.code === 'failed-precondition' || error.message.includes("index")) {
//             console.warn("Index missing, falling back to client-side filtering...");
//             const allQ = query(collection(db, "posts"), orderBy("timestamp", "desc"));
//             const snap = await getDocs(allQ);
//             const posts = [];
//             snap.forEach(d => { if (d.data().authorId === uid) posts.push({id:d.id, ...d.data()}); });
//             return { success: true, data: posts };
//         }
//         return { success: false, error: error.message };
//     }
// }

// async function toggleLike(postId, type = null, collectionName = 'posts') {
//     const user = auth.currentUser; if (!user) return { success: false, error: "Login required" };
//     try {
//         const postRef = doc(db, collectionName, postId);
//         if (type) await updateDoc(postRef, { [`reactions.${user.uid}`]: type });
//         else await updateDoc(postRef, { [`reactions.${user.uid}`]: deleteField() });
//         return { success: true };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// async function deletePost(postId, collectionName = 'posts') {
//     try { await deleteDoc(doc(db, collectionName, postId)); return { success: true }; } catch (e) { return { success: false, error: e.message }; }
// }

// async function addComment(postId, content, collectionName = 'posts') {
//     const user = auth.currentUser; if (!user) return { success: false, error: "Login required" };
//     try {
//         let name = user.displayName||"زبون"; let img = user.photoURL||"images/user.png";
//         if(collectionName==='secrets'){ name="فاعل خير"; img="anonymous"; }
//         await addDoc(collection(db, collectionName, postId, "comments"), { content:content, authorId:user.uid, authorName:name, authorImage:img, timestamp:serverTimestamp() });
//         await updateDoc(doc(db, collectionName, postId), { commentsCount: increment(1) });
//         return { success: true };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// async function getComments(postId, collectionName = 'posts') {
//     try {
//         const q = query(collection(db, collectionName, postId, "comments"), orderBy("timestamp", "asc"));
//         const snap = await getDocs(q);
//         const data = []; snap.forEach(d => data.push({id:d.id, ...d.data()}));
//         return { success: true, data: data };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// // ================= NOTIFICATIONS SYSTEM =================

// async function createNotification(targetUid, type, message, extraData = {}) {
//     try {
//         await addDoc(collection(db, "notifications"), {
//             userId: targetUid,
//             type: type, // 'friend_request', 'game_invite', 'request_accepted'
//             message: message,
//             read: false,
//             timestamp: serverTimestamp(),
//             ...extraData
//         });
//     } catch (e) { console.error("Notif Error:", e); }
// }

// async function getNotifications() {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "No User" };
//     try {
//         // Note: This requires an Index (userId + timestamp)
//         // If it fails, create index in Firebase Console
//         const q = query(collection(db, "notifications"), where("userId", "==", user.uid), orderBy("timestamp", "desc"));
//         const snap = await getDocs(q);
//         const data = [];
//         snap.forEach(d => data.push({ id: d.id, ...d.data() }));
//         return { success: true, data: data };
//     } catch (e) {
//         if(e.message.includes("index")) {
//             console.warn("Index Missing for Notifications. Showing recent unsorted.");
//             const q2 = query(collection(db, "notifications"), where("userId", "==", user.uid));
//             const snap = await getDocs(q2);
//             const data = []; snap.forEach(d => data.push({ id: d.id, ...d.data() }));
//             return { success: true, data: data };
//         }
//         return { success: false, error: e.message };
//     }
// }

// async function markNotificationRead(notifId) {
//     try {
//         await updateDoc(doc(db, "notifications", notifId), { read: true });
//         return { success: true };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// // ================= FRIENDS SYSTEM =================

// async function getFriendshipStatus(targetUid) {
//     const user = auth.currentUser;
//     if (!user) return 'none';
//     if (user.uid === targetUid) return 'self';

//     // 1. Check Friends Array
//     const userDoc = await getDoc(doc(db, "users", user.uid));
//     const friends = userDoc.data()?.friends || [];
//     if (friends.includes(targetUid)) return 'friends';

//     // 2. Check Pending Requests
//     const outQ = query(collection(db, "friendRequests"), where("from", "==", user.uid), where("to", "==", targetUid));
//     const outSnap = await getDocs(outQ);
//     if (!outSnap.empty) return 'pending_sent';

//     const inQ = query(collection(db, "friendRequests"), where("from", "==", targetUid), where("to", "==", user.uid));
//     const inSnap = await getDocs(inQ);
//     if (!inSnap.empty) return 'pending_received';

//     return 'none';
// }

// async function sendFriendRequest(targetUid) {
//     const user = auth.currentUser;
//     if (!user) return { success: false };
//     try {
//         const q = query(collection(db, "friendRequests"), where("from", "==", user.uid), where("to", "==", targetUid));
//         const snap = await getDocs(q);
//         if(!snap.empty) return { success: true };

//         await addDoc(collection(db, "friendRequests"), {
//             from: user.uid,
//             to: targetUid,
//             timestamp: serverTimestamp(),
//             status: 'pending'
//         });

//         // Notify Receiver
//         await createNotification(targetUid, 'friend_request', `${user.displayName} بعتلك طلب صداقة`, { senderId: user.uid });
        
//         return { success: true };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// async function getIncomingRequests() {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "No User" };
//     try {
//         const q = query(collection(db, "friendRequests"), where("to", "==", user.uid), where("status", "==", "pending"));
//         const snap = await getDocs(q);
        
//         const requests = [];
//         for (const d of snap.docs) {
//             const reqData = d.data();
//             // Fetch Sender Info
//             const senderDoc = await getDoc(doc(db, "users", reqData.from));
//             if (senderDoc.exists()) {
//                 requests.push({
//                     requestId: d.id,
//                     ...reqData,
//                     sender: senderDoc.data()
//                 });
//             }
//         }
//         return { success: true, data: requests };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// async function acceptFriendRequest(requestId, senderUid) {
//     const user = auth.currentUser;
//     if (!user) return { success: false };
//     try {
//         const batch = writeBatch(db);
        
//         // Update Friends Arrays
//         const userRef = doc(db, "users", user.uid);
//         batch.update(userRef, { friends: arrayUnion(senderUid) });

//         const senderRef = doc(db, "users", senderUid);
//         batch.update(senderRef, { friends: arrayUnion(user.uid) });

//         // Delete Request
//         batch.delete(doc(db, "friendRequests", requestId));

//         await batch.commit();

//         // Notify Sender
//         await createNotification(senderUid, 'request_accepted', `${user.displayName} قبل طلب الصداقة`, { friendId: user.uid });

//         return { success: true };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// async function denyFriendRequest(requestId) {
//     try {
//         await deleteDoc(doc(db, "friendRequests", requestId));
//         return { success: true };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// async function removeFriend(friendUid) {
//     const user = auth.currentUser;
//     try {
//         const batch = writeBatch(db);
//         batch.update(doc(db, "users", user.uid), { friends: arrayRemove(friendUid) });
//         batch.update(doc(db, "users", friendUid), { friends: arrayRemove(user.uid) });
//         await batch.commit();
//         return { success: true };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// async function getUserFriends(uid) {
//     try {
//         const docSnap = await getDoc(doc(db, "users", uid));
//         if (!docSnap.exists()) return { success: true, data: [] };
        
//         const friendIds = docSnap.data().friends || [];
//         if (friendIds.length === 0) return { success: true, data: [] };

//         const friendsData = [];
//         const limitedIds = friendIds.slice(0, 20); // Limit to 20 for performance
        
//         for (const fid of limitedIds) {
//             const fDoc = await getDoc(doc(db, "users", fid));
//             if (fDoc.exists()) {
//                 friendsData.push({ id: fDoc.id, ...fDoc.data() });
//             }
//         }
//         return { success: true, data: friendsData };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// // ================= ONLINE GAMES SYSTEM =================

// async function createOnlineGame() {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login first" };
//     try {
//         const gameRef = await addDoc(collection(db, "games"), {
//             playerX: user.uid,
//             playerXName: user.displayName,
//             playerO: null,
//             playerOName: "...",
//             board: ["", "", "", "", "", "", "", "", ""],
//             turn: "X",
//             winner: null,
//             status: "waiting", // waiting, playing, finished
//             createdAt: serverTimestamp()
//         });
//         return { success: true, gameId: gameRef.id };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// async function joinOnlineGame(gameId) {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login first" };
//     try {
//         const gameRef = doc(db, "games", gameId);
//         const gameSnap = await getDoc(gameRef);
//         if (!gameSnap.exists()) return { success: false, error: "Game not found" };
        
//         const data = gameSnap.data();
//         if (data.playerX === user.uid) return { success: true, role: 'X' }; // Rejoin as host
//         if (data.status !== 'waiting' && data.playerO !== user.uid) return { success: false, error: "Game full" };

//         await updateDoc(gameRef, {
//             playerO: user.uid,
//             playerOName: user.displayName,
//             status: "playing"
//         });
//         return { success: true, role: 'O' };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// async function makeOnlineMove(gameId, newBoard, nextTurn, winner) {
//     try {
//         const updateData = {
//             board: newBoard,
//             turn: nextTurn
//         };
//         if (winner) {
//             updateData.status = 'finished';
//             updateData.winner = winner;
//         }
//         await updateDoc(doc(db, "games", gameId), updateData);
//         return { success: true };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// async function resetOnlineGame(gameId) {
//     try {
//         await updateDoc(doc(db, "games", gameId), {
//             board: ["", "", "", "", "", "", "", "", ""],
//             turn: "X",
//             winner: null,
//             status: "playing"
//         });
//         return { success: true };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// async function sendGameInvite(friendId, gameId) {
//     const user = auth.currentUser;
//     try {
//         await createNotification(friendId, 'game_invite', `${user.displayName} بيتحداك في XO`, { gameId: gameId });
//         return { success: true };
//     } catch (e) { return { success: false, error: e.message }; }
// }

// // ================= EXPORTS =================

// export {
//     auth, db, doc, onSnapshot, // Firestore Helpers needed in UI
//     signUp, login, logout, resetPassword, changeUserPassword, getUserData, updateUserProfile, deleteUserAccount,
//     onAuthStateChanged, 
//     // Posts
//     createPost, getPosts, getUserPosts, toggleLike, deletePost, addComment, getComments,
//     // Friends
//     getFriendshipStatus, sendFriendRequest, acceptFriendRequest, denyFriendRequest, getIncomingRequests, removeFriend, getUserFriends,
//     // Notifications
//     getNotifications, markNotificationRead,
//     // Games
//     createOnlineGame, joinOnlineGame, makeOnlineMove, resetOnlineGame, sendGameInvite
// };

















// import { app } from './firebase-config.js';
// import { 
//     getAuth, 
//     createUserWithEmailAndPassword, 
//     signInWithEmailAndPassword,
//     signOut,
//     onAuthStateChanged,
//     updateProfile,
//     deleteUser,
//     sendPasswordResetEmail,
//     updatePassword,
//     reauthenticateWithCredential,
//     EmailAuthProvider
// } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
// import { 
//     getFirestore, 
//     doc, 
//     setDoc, 
//     getDoc,
//     updateDoc,
//     collection,
//     addDoc,
//     query,
//     where,
//     getDocs,
//     deleteDoc,
//     orderBy,
//     serverTimestamp,
//     deleteField,
//     increment,
//     writeBatch // <--- NEW: Needed for updating multiple posts at once
// } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// const auth = getAuth(app);
// const db = getFirestore(app);

// // --- User Management ---
// async function signUp(email, password, fullName) {
//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
//         const photoURL = 'images/user.png'; 
        
//         await updateProfile(user, { displayName: fullName, photoURL: photoURL });

//         await setDoc(doc(db, "users", user.uid), {
//             fullName: fullName,
//             email: email,
//             role: "زبون", 
//             createdAt: serverTimestamp(),
//             educationLevel: "طالب",
//             bio: "أنا جديد في القهوة"
//         });

//         return { success: true, user: user };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function login(email, password) {
//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         return { success: true, user: userCredential.user };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function logout() {
//     try {
//         await signOut(auth);
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function resetPassword(email) {
//     try {
//         await sendPasswordResetEmail(auth, email);
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function changeUserPassword(oldPassword, newPassword) {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "لازم تسجل دخول الأول يا نجم" };

//     try {
//         const credential = EmailAuthProvider.credential(user.email, oldPassword);
//         await reauthenticateWithCredential(user, credential);
//         await updatePassword(user, newPassword);
//         return { success: true };
//     } catch (error) {
//         if (error.code === 'auth/wrong-password') {
//             return { success: false, error: "الباسورد القديم غلط يا معلم، ركز كده" };
//         }
//         return { success: false, error: error.message };
//     }
// }

// async function getUserData(uid) {
//     try {
//         const docRef = doc(db, "users", uid);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) return { success: true, data: docSnap.data() };
//         return { success: false, error: "User not found" };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// // --- UPDATED FUNCTION: Updates User Profile AND Old Posts ---
// async function updateUserProfile(data) {
//     const user = auth.currentUser;
//     if(!user) return { success: false, error: "Not logged in" };
//     try {
//         // 1. Update User Document
//         const userRef = doc(db, "users", user.uid);
//         await updateDoc(userRef, data);
        
//         // 2. Update Auth Profile
//         const updates = {};
//         if (data.profileImage) updates.photoURL = data.profileImage;
//         if (data.fullName) updates.displayName = data.fullName;
//         if (Object.keys(updates).length > 0) await updateProfile(user, updates);

//         // 3. SPECIAL FIX: Update all past posts by this user
//         // This ensures the image/name updates on the timeline
//         if (data.profileImage || data.fullName) {
//             const batch = writeBatch(db);
//             const q = query(collection(db, "posts"), where("authorId", "==", user.uid));
//             const querySnapshot = await getDocs(q);

//             querySnapshot.forEach((doc) => {
//                 const postUpdate = {};
//                 if (data.profileImage) postUpdate.authorImage = data.profileImage;
//                 if (data.fullName) postUpdate.authorName = data.fullName;
//                 batch.update(doc.ref, postUpdate);
//             });

//             // Commit if there are posts to update
//             if (!querySnapshot.empty) {
//                 await batch.commit();
//             }
//         }

//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function deleteUserAccount() {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "No user" };
//     try {
//         // Delete User Doc
//         await deleteDoc(doc(db, "users", user.uid));
//         // Delete User Auth
//         await deleteUser(user);
//         return { success: true };
//     } catch (error) {
//         if(error.code === 'auth/requires-recent-login') return { success: false, error: "requires-recent-login" };
//         return { success: false, error: error.message };
//     }
// }

// // --- Posts System ---
// async function createPost(content) {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };
//     try {
//         const postData = {
//             authorId: user.uid,
//             authorName: user.displayName || "Unknown",
//             authorImage: user.photoURL || "images/user.png",
//             content: content,
//             timestamp: serverTimestamp(),
//             reactions: {}, 
//             likes: [], 
//             commentsCount: 0
//         };
//         await addDoc(collection(db, "posts"), postData);
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function getPosts() {
//     try {
//         const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
//         const querySnapshot = await getDocs(q);
//         const posts = [];
//         querySnapshot.forEach((doc) => posts.push({ id: doc.id, ...doc.data() }));
//         return { success: true, data: posts };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function getUserPosts(uid) {
//     try {
//         const q = query(
//             collection(db, "posts"), 
//             where("authorId", "==", uid),
//             orderBy("timestamp", "desc")
//         );
//         const querySnapshot = await getDocs(q);
//         const posts = [];
//         querySnapshot.forEach((doc) => posts.push({ id: doc.id, ...doc.data() }));
//         return { success: true, data: posts };
//     } catch (error) {
//         if(error.message.includes("index")) {
//             console.warn("Missing Index, filtering client side");
//             const all = await getPosts();
//             if(all.success) {
//                 return { success: true, data: all.data.filter(p => p.authorId === uid) };
//             }
//         }
//         return { success: false, error: error.message };
//     }
// }

// // --- SECRETS SYSTEM ---
// async function createSecret(content) {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };
//     try {
//         const secretData = {
//             authorId: user.uid, 
//             fakeName: "بير الأسرار", 
//             content: content,
//             timestamp: serverTimestamp(),
//             reactions: {}, 
//             commentsCount: 0,
//             type: 'secret'
//         };
//         await addDoc(collection(db, "secrets"), secretData);
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function getSecrets() {
//     try {
//         const q = query(collection(db, "secrets"), orderBy("timestamp", "desc"));
//         const querySnapshot = await getDocs(q);
//         const secrets = [];
//         querySnapshot.forEach((doc) => secrets.push({ id: doc.id, ...doc.data() }));
//         return { success: true, data: secrets };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// // --- SHARED ACTIONS ---

// async function toggleLike(postId, type = null, collectionName = 'posts') {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };

//     try {
//         const postRef = doc(db, collectionName, postId);
        
//         if (type) {
//             await updateDoc(postRef, {
//                 [`reactions.${user.uid}`]: type
//             });
//         } else {
//             await updateDoc(postRef, {
//                 [`reactions.${user.uid}`]: deleteField()
//             });
//         }
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function deletePost(postId, collectionName = 'posts') {
//     try {
//         await deleteDoc(doc(db, collectionName, postId));
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function addComment(postId, content, collectionName = 'posts') {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };
    
//     try {
//         let nameToSave = user.displayName || "زبون القهوة";
//         let imageToSave = user.photoURL || "images/user.png";

//         if (collectionName === 'secrets') {
//             nameToSave = "فاعل خير";
//             imageToSave = "anonymous"; 
//         }

//         const commentRef = collection(db, collectionName, postId, "comments");
//         await addDoc(commentRef, {
//             content: content,
//             authorId: user.uid, 
//             authorName: nameToSave,
//             authorImage: imageToSave,
//             timestamp: serverTimestamp()
//         });

//         const postRef = doc(db, collectionName, postId);
//         await updateDoc(postRef, {
//             commentsCount: increment(1)
//         });

//         return { success: true };
//     } catch (error) {
//         console.error("Error adding comment:", error);
//         return { success: false, error: error.message };
//     }
// }

// async function getComments(postId, collectionName = 'posts') {
//     try {
//         const q = query(
//             collection(db, collectionName, postId, "comments"), 
//             orderBy("timestamp", "asc")
//         );
//         const querySnapshot = await getDocs(q);
//         const comments = [];
//         querySnapshot.forEach((doc) => {
//             comments.push({ id: doc.id, ...doc.data() });
//         });
//         return { success: true, data: comments };
//     } catch (error) {
//         console.error("Error fetching comments:", error);
//         return { success: false, error: error.message };
//     }
// }

// export {
//     auth,
//     db,
//     signUp,
//     login,
//     logout,
//     resetPassword,
//     changeUserPassword,
//     getUserData,
//     updateUserProfile,
//     deleteUserAccount,
//     onAuthStateChanged,
//     createPost,
//     getPosts,
//     getUserPosts,
//     toggleLike,
//     deletePost,
//     addComment,
//     getComments,
//     createSecret,
//     getSecrets
// };

// // auth-service.js
// import { app } from './firebase-config.js';
// import { 
//     getAuth, 
//     createUserWithEmailAndPassword, 
//     signInWithEmailAndPassword,
//     signOut,
//     onAuthStateChanged,
//     updateProfile,
//     deleteUser,
//     sendPasswordResetEmail,
//     updatePassword,             // <--- NEW
//     reauthenticateWithCredential, // <--- NEW
//     EmailAuthProvider           // <--- NEW
// } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
// import { 
//     getFirestore, 
//     doc, 
//     setDoc, 
//     getDoc,
//     updateDoc,
//     collection,
//     addDoc,
//     query,
//     where,
//     getDocs,
//     deleteDoc,
//     orderBy,
//     serverTimestamp,
//     deleteField,
//     increment 
// } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// const auth = getAuth(app);
// const db = getFirestore(app);

// // --- User Management ---
// async function signUp(email, password, fullName) {
//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
//         const photoURL = 'images/user.png'; 
        
//         await updateProfile(user, { displayName: fullName, photoURL: photoURL });

//         await setDoc(doc(db, "users", user.uid), {
//             fullName: fullName,
//             email: email,
//             role: "زبون", 
//             createdAt: serverTimestamp(),
//             educationLevel: "طالب",
//             bio: "أنا جديد في القهوة"
//         });

//         return { success: true, user: user };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function login(email, password) {
//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         return { success: true, user: userCredential.user };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function logout() {
//     try {
//         await signOut(auth);
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function resetPassword(email) {
//     try {
//         await sendPasswordResetEmail(auth, email);
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// // --- NEW: Change Password with Re-Auth ---
// async function changeUserPassword(oldPassword, newPassword) {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "لازم تسجل دخول الأول يا نجم" };

//     try {
//         // 1. Re-authenticate user (Security Check)
//         const credential = EmailAuthProvider.credential(user.email, oldPassword);
//         await reauthenticateWithCredential(user, credential);

//         // 2. Update Password
//         await updatePassword(user, newPassword);
        
//         return { success: true };
//     } catch (error) {
//         // Handle specific errors for better UX
//         if (error.code === 'auth/wrong-password') {
//             return { success: false, error: "الباسورد القديم غلط يا معلم، ركز كده" };
//         }
//         return { success: false, error: error.message };
//     }
// }

// async function getUserData(uid) {
//     try {
//         const docRef = doc(db, "users", uid);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) return { success: true, data: docSnap.data() };
//         return { success: false, error: "User not found" };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function updateUserProfile(data) {
//     const user = auth.currentUser;
//     if(!user) return { success: false, error: "Not logged in" };
//     try {
//         const userRef = doc(db, "users", user.uid);
//         await updateDoc(userRef, data);
        
//         const updates = {};
//         if (data.profileImage) updates.photoURL = data.profileImage;
//         if (data.fullName) updates.displayName = data.fullName;
//         if (Object.keys(updates).length > 0) await updateProfile(user, updates);

//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function deleteUserAccount() {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "No user" };
//     try {
//         await deleteDoc(doc(db, "users", user.uid));
//         await deleteUser(user);
//         return { success: true };
//     } catch (error) {
//         if(error.code === 'auth/requires-recent-login') return { success: false, error: "requires-recent-login" };
//         return { success: false, error: error.message };
//     }
// }

// // --- Posts System ---
// async function createPost(content) {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };
//     try {
//         const postData = {
//             authorId: user.uid,
//             authorName: user.displayName || "Unknown",
//             authorImage: user.photoURL || "images/user.png",
//             content: content,
//             timestamp: serverTimestamp(),
//             reactions: {}, 
//             likes: [], 
//             commentsCount: 0
//         };
//         await addDoc(collection(db, "posts"), postData);
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function getPosts() {
//     try {
//         const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
//         const querySnapshot = await getDocs(q);
//         const posts = [];
//         querySnapshot.forEach((doc) => posts.push({ id: doc.id, ...doc.data() }));
//         return { success: true, data: posts };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function getUserPosts(uid) {
//     try {
//         const q = query(
//             collection(db, "posts"), 
//             where("authorId", "==", uid),
//             orderBy("timestamp", "desc")
//         );
//         const querySnapshot = await getDocs(q);
//         const posts = [];
//         querySnapshot.forEach((doc) => posts.push({ id: doc.id, ...doc.data() }));
//         return { success: true, data: posts };
//     } catch (error) {
//         if(error.message.includes("index")) {
//             console.warn("Missing Index, filtering client side");
//             const all = await getPosts();
//             if(all.success) {
//                 return { success: true, data: all.data.filter(p => p.authorId === uid) };
//             }
//         }
//         return { success: false, error: error.message };
//     }
// }

// // --- SECRETS SYSTEM ---
// async function createSecret(content) {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };
//     try {
//         const secretData = {
//             authorId: user.uid, 
//             fakeName: "بير الأسرار", 
//             content: content,
//             timestamp: serverTimestamp(),
//             reactions: {}, 
//             commentsCount: 0,
//             type: 'secret'
//         };
//         await addDoc(collection(db, "secrets"), secretData);
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function getSecrets() {
//     try {
//         const q = query(collection(db, "secrets"), orderBy("timestamp", "desc"));
//         const querySnapshot = await getDocs(q);
//         const secrets = [];
//         querySnapshot.forEach((doc) => secrets.push({ id: doc.id, ...doc.data() }));
//         return { success: true, data: secrets };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// // --- SHARED ACTIONS ---

// async function toggleLike(postId, type = null, collectionName = 'posts') {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };

//     try {
//         const postRef = doc(db, collectionName, postId);
        
//         if (type) {
//             await updateDoc(postRef, {
//                 [`reactions.${user.uid}`]: type
//             });
//         } else {
//             await updateDoc(postRef, {
//                 [`reactions.${user.uid}`]: deleteField()
//             });
//         }
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function deletePost(postId, collectionName = 'posts') {
//     try {
//         await deleteDoc(doc(db, collectionName, postId));
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function addComment(postId, content, collectionName = 'posts') {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };
    
//     try {
//         let nameToSave = user.displayName || "زبون القهوة";
//         let imageToSave = user.photoURL || "images/user.png";

//         if (collectionName === 'secrets') {
//             nameToSave = "فاعل خير";
//             imageToSave = "anonymous"; 
//         }

//         const commentRef = collection(db, collectionName, postId, "comments");
//         await addDoc(commentRef, {
//             content: content,
//             authorId: user.uid, 
//             authorName: nameToSave,
//             authorImage: imageToSave,
//             timestamp: serverTimestamp()
//         });

//         const postRef = doc(db, collectionName, postId);
//         await updateDoc(postRef, {
//             commentsCount: increment(1)
//         });

//         return { success: true };
//     } catch (error) {
//         console.error("Error adding comment:", error);
//         return { success: false, error: error.message };
//     }
// }

// async function getComments(postId, collectionName = 'posts') {
//     try {
//         const q = query(
//             collection(db, collectionName, postId, "comments"), 
//             orderBy("timestamp", "asc")
//         );
//         const querySnapshot = await getDocs(q);
//         const comments = [];
//         querySnapshot.forEach((doc) => {
//             comments.push({ id: doc.id, ...doc.data() });
//         });
//         return { success: true, data: comments };
//     } catch (error) {
//         console.error("Error fetching comments:", error);
//         return { success: false, error: error.message };
//     }
// }

// export {
//     auth,
//     db,
//     signUp,
//     login,
//     logout,
//     resetPassword,
//     changeUserPassword, // <--- Exported
//     getUserData,
//     updateUserProfile,
//     deleteUserAccount,
//     onAuthStateChanged,
//     createPost,
//     getPosts,
//     getUserPosts,
//     toggleLike,
//     deletePost,
//     addComment,
//     getComments,
//     createSecret,
//     getSecrets
// };