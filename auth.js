// auth.js
import { app } from './firebase-config.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
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
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

// Authentication Functions
async function signUp(email, password, fullName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update profile with display name
        await updateProfile(user, {
            displayName: fullName
        });

        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            fullName: fullName,
            email: email,
            educationLevel: "High School Senior",
            createdAt: new Date(),
            savedUniversities: [],
            comparisons: []
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

// Firestore Functions for Universities
async function getUniversities(filters = {}) {
    try {
        let q = collection(db, "universities");
        
        // Apply filters if provided
        const constraints = [];
        if (filters.location) {
            constraints.push(where("location", "==", filters.location));
        }
        if (filters.type) {
            constraints.push(where("type", "==", filters.type));
        }
        
        if (constraints.length > 0) {
            q = query(q, ...constraints);
        }
        
        const querySnapshot = await getDocs(q);
        const universities = [];
        querySnapshot.forEach((doc) => {
            universities.push({ id: doc.id, ...doc.data() });
        });
        
        return { success: true, data: universities };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getUniversityById(id) {
    try {
        const docRef = doc(db, "universities", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        } else {
            return { success: false, error: "University not found" };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// User Data Functions
async function getUserData(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() };
        } else {
            return { success: false, error: "User data not found" };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateUserData(uid, data) {
    try {
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, data);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Saved Universities Functions
async function saveUniversity(uid, universityId) {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const userData = userSnap.data();
            const savedUniversities = userData.savedUniversities || [];
            
            if (!savedUniversities.includes(universityId)) {
                savedUniversities.push(universityId);
                await updateDoc(userRef, {
                    savedUniversities: savedUniversities
                });
            }
            
            return { success: true };
        }
        return { success: false, error: "User not found" };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function removeSavedUniversity(uid, universityId) {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const userData = userSnap.data();
            const savedUniversities = userData.savedUniversities || [];
            const updatedUniversities = savedUniversities.filter(id => id !== universityId);
            
            await updateDoc(userRef, {
                savedUniversities: updatedUniversities
            });
            
            return { success: true };
        }
        return { success: false, error: "User not found" };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
// Add this to your existing auth.js functions

// Get universities with advanced filtering
async function getUniversitiesAdvanced(filters = {}) {
    try {
        let q = collection(db, "universities");
        
        const constraints = [];
        
        if (filters.locations && filters.locations.length > 0) {
            constraints.push(where("location", "in", filters.locations));
        }
        
        if (filters.types && filters.types.length > 0) {
            constraints.push(where("type", "in", filters.types));
        }
        
        if (filters.languages && filters.languages.length > 0) {
            constraints.push(where("language", "in", filters.languages));
        }
        
        if (filters.maxTuition) {
            constraints.push(where("tuition", "<=", filters.maxTuition));
        }
        
        if (constraints.length > 0) {
            q = query(q, ...constraints);
        }
        
        const querySnapshot = await getDocs(q);
        const universities = [];
        querySnapshot.forEach((doc) => {
            universities.push({ id: doc.id, ...doc.data() });
        });
        
        return { success: true, data: universities };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


async function getSavedUniversities(uid) {
    try {
        const userData = await getUserData(uid);
        if (!userData.success) return userData;
        
        const savedUniversityIds = userData.data.savedUniversities || [];
        const universities = [];
        
        for (const universityId of savedUniversityIds) {
            const universityData = await getUniversityById(universityId);
            if (universityData.success) {
                universities.push(universityData.data);
            }
        }
        
        return { success: true, data: universities };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Comparison Functions
async function createComparison(uid, universityIds, name) {
    try {
        const comparisonRef = await addDoc(collection(db, "comparisons"), {
            userId: uid,
            universityIds: universityIds,
            name: name || `Comparison ${new Date().toLocaleDateString()}`,
            createdAt: new Date()
        });
        
        return { success: true, id: comparisonRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getUserComparisons(uid) {
    try {
        const q = query(collection(db, "comparisons"), where("userId", "==", uid));
        const querySnapshot = await getDocs(q);
        const comparisons = [];
        
        querySnapshot.forEach((doc) => {
            comparisons.push({ id: doc.id, ...doc.data() });
        });
        
        return { success: true, data: comparisons };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export {
    auth,
    db,
    signUp,
    login,
    logout,
    onAuthStateChanged,
    getUniversities,
    getUniversityById,
    getUserData,
    updateUserData,
    saveUniversity,
    removeSavedUniversity,
    getSavedUniversities,
    createComparison,
    getUserComparisons
};