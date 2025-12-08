// // auth-service.js
// import { app } from './firebase-config.js';
// import { 
//     getAuth, 
//     createUserWithEmailAndPassword, 
//     signInWithEmailAndPassword,
//     signOut,
//     onAuthStateChanged,
//     updateProfile,
//     deleteUser
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
//     arrayUnion,
//     arrayRemove
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

// // --- NEW FUNCTION: Get Posts for Specific User (For Profile) ---
// async function getUserPosts(uid) {
//     try {
//         // Requires Index in Firestore usually, but basic query works if small data
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
//         // Fallback if index missing: Get all and filter in JS (Not recommended for prod but fixes error)
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

// async function toggleLike(postId) {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };
//     try {
//         const postRef = doc(db, "posts", postId);
//         const postSnap = await getDoc(postRef);
//         if (postSnap.exists()) {
//             const likes = postSnap.data().likes || [];
//             if (likes.includes(user.uid)) {
//                 await updateDoc(postRef, { likes: arrayRemove(user.uid) });
//             } else {
//                 await updateDoc(postRef, { likes: arrayUnion(user.uid) });
//             }
//             return { success: true };
//         }
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// async function deletePost(postId) {
//     try {
//         await deleteDoc(doc(db, "posts", postId));
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// export {
//     auth,
//     db,
//     signUp,
//     login,
//     logout,
//     getUserData,
//     updateUserProfile,
//     deleteUserAccount,
//     onAuthStateChanged,
//     createPost,
//     getPosts,
//     getUserPosts, // <--- Exported
//     toggleLike,
//     deletePost
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
//     deleteUser
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
//     increment // <--- IMPORTANT: Needed for counting comments
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
//             likes: [], // Keeping for legacy support
//             commentsCount: 0 // Initialize count
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

// async function toggleLike(postId, type = null) {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };

//     try {
//         const postRef = doc(db, "posts", postId);
        
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

// async function deletePost(postId) {
//     try {
//         await deleteDoc(doc(db, "posts", postId));
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// // --- Comments System (Updated with Counter) ---

// async function addComment(postId, content) {
//     const user = auth.currentUser;
//     if (!user) return { success: false, error: "Login required" };
    
//     try {
//         // 1. Add comment to subcollection
//         const commentRef = collection(db, "posts", postId, "comments");
//         await addDoc(commentRef, {
//             content: content,
//             authorId: user.uid,
//             authorName: user.displayName || "زبون القهوة",
//             authorImage: user.photoURL || "images/user.png",
//             timestamp: serverTimestamp()
//         });

//         // 2. Increment counter on the main post
//         const postRef = doc(db, "posts", postId);
//         await updateDoc(postRef, {
//             commentsCount: increment(1)
//         });

//         return { success: true };
//     } catch (error) {
//         console.error("Error adding comment:", error);
//         return { success: false, error: error.message };
//     }
// }

// async function getComments(postId) {
//     try {
//         const q = query(
//             collection(db, "posts", postId, "comments"), 
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
//     getComments
// };
























// auth-service.js
import { app } from './firebase-config.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    deleteUser
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
    increment 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

// --- User Management ---
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
            bio: "أنا جديد في القهوة"
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
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getUserData(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return { success: true, data: docSnap.data() };
        return { success: false, error: "User not found" };
    } catch (error) {
        return { success: false, error: error.message };
    }
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

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteUserAccount() {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "No user" };
    try {
        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(user);
        return { success: true };
    } catch (error) {
        if(error.code === 'auth/requires-recent-login') return { success: false, error: "requires-recent-login" };
        return { success: false, error: error.message };
    }
}

// --- Posts System ---
async function createPost(content) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Login required" };
    try {
        const postData = {
            authorId: user.uid,
            authorName: user.displayName || "Unknown",
            authorImage: user.photoURL || "images/user.png",
            content: content,
            timestamp: serverTimestamp(),
            reactions: {}, 
            likes: [], 
            commentsCount: 0
        };
        await addDoc(collection(db, "posts"), postData);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getPosts() {
    try {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const posts = [];
        querySnapshot.forEach((doc) => posts.push({ id: doc.id, ...doc.data() }));
        return { success: true, data: posts };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getUserPosts(uid) {
    try {
        const q = query(
            collection(db, "posts"), 
            where("authorId", "==", uid),
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const posts = [];
        querySnapshot.forEach((doc) => posts.push({ id: doc.id, ...doc.data() }));
        return { success: true, data: posts };
    } catch (error) {
        if(error.message.includes("index")) {
            console.warn("Missing Index, filtering client side");
            const all = await getPosts();
            if(all.success) {
                return { success: true, data: all.data.filter(p => p.authorId === uid) };
            }
        }
        return { success: false, error: error.message };
    }
}

// --- SECRETS SYSTEM ---
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

// --- SHARED ACTIONS ---

async function toggleLike(postId, type = null, collectionName = 'posts') {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Login required" };

    try {
        const postRef = doc(db, collectionName, postId);
        
        if (type) {
            await updateDoc(postRef, {
                [`reactions.${user.uid}`]: type
            });
        } else {
            await updateDoc(postRef, {
                [`reactions.${user.uid}`]: deleteField()
            });
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deletePost(postId, collectionName = 'posts') {
    try {
        await deleteDoc(doc(db, collectionName, postId));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function addComment(postId, content, collectionName = 'posts') {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Login required" };
    
    try {
        // --- PRIVACY CHECK ---
        // If we are in 'secrets', we MUST NOT save the real name or image to the DB.
        let nameToSave = user.displayName || "زبون القهوة";
        let imageToSave = user.photoURL || "images/user.png";

        if (collectionName === 'secrets') {
            nameToSave = "فاعل خير";
            imageToSave = "anonymous"; // Flag to use icon on frontend
        }

        const commentRef = collection(db, collectionName, postId, "comments");
        await addDoc(commentRef, {
            content: content,
            authorId: user.uid, // Kept for deletion rights only
            authorName: nameToSave,
            authorImage: imageToSave,
            timestamp: serverTimestamp()
        });

        const postRef = doc(db, collectionName, postId);
        await updateDoc(postRef, {
            commentsCount: increment(1)
        });

        return { success: true };
    } catch (error) {
        console.error("Error adding comment:", error);
        return { success: false, error: error.message };
    }
}

async function getComments(postId, collectionName = 'posts') {
    try {
        const q = query(
            collection(db, collectionName, postId, "comments"), 
            orderBy("timestamp", "asc")
        );
        const querySnapshot = await getDocs(q);
        const comments = [];
        querySnapshot.forEach((doc) => {
            comments.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: comments };
    } catch (error) {
        console.error("Error fetching comments:", error);
        return { success: false, error: error.message };
    }
}

export {
    auth,
    db,
    signUp,
    login,
    logout,
    getUserData,
    updateUserProfile,
    deleteUserAccount,
    onAuthStateChanged,
    createPost,
    getPosts,
    getUserPosts,
    toggleLike,
    deletePost,
    addComment,
    getComments,
    createSecret,
    getSecrets
};