import { 
    auth, 
    onAuthStateChanged, 
    getUserData, 
    updateUserProfile, 
    deleteUserAccount,
    changeUserPassword // <--- Imported
} from './auth-service.js';

// Predefined profile images
const profileImages = [
    "images/profile/1.jpg", "images/profile/2.jpg", "images/profile/3.jpg",
    "images/profile/4.jpg", "images/profile/5.jpg", "images/profile/6.jpg",
    "images/profile/7.jpg", "images/profile/8.jpg", "images/profile/9.jpg",
    "images/profile/10.jpg", "images/profile/11.jpg", "images/profile/12.jpg",
    "images/profile/13.jpg", "images/profile/14.jpg", "images/profile/15.jpg",
    "images/profile/16.jpg", "images/profile/17.jpg", "images/profile/18.jpg",
    "images/profile/19.jpg", "images/profile/20.jpg", "images/profile/21.jpg",
    "images/profile/22.jpg", "images/profile/23.jpg", "images/profile/24.jpg"
    // "images/profile/mmssb.jpg"
];

let currentUser = null;
let userData = {}; 
let selectedImage = '';

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            await loadUserData();
            setupEventListeners();
        } else {
            window.location.href = 'login.html';
        }
    });
});

async function loadUserData() {
    try {
        const result = await getUserData(currentUser.uid);
        if (result.success) {
            userData = result.data;
            updateUI();
        }
    } catch (error) {
        console.error("Error loading user data:", error);
    }
}

function updateUI() {
    // Safety check
    const data = userData || {};

    // 1. Sidebar Elements
    if(document.getElementById('sidebarName')) 
        document.getElementById('sidebarName').textContent = data.fullName || 'الزبون';
    
    if(document.getElementById('sidebarEducation')) 
        document.getElementById('sidebarEducation').textContent = data.educationLevel || 'زبون جديد';
    
    const currentImg = data.profileImage || 'images/user.png';
    if(document.getElementById('sidebarImage')) 
        document.getElementById('sidebarImage').src = currentImg;
    
    // 2. Form Inputs
    const fullName = data.fullName || '';
    const nameParts = fullName.split(' ');
    
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const bioInput = document.getElementById('userBio'); 
    const emailInput = document.getElementById('email');
    const eduInput = document.getElementById('educationLevel');

    if(firstNameInput) firstNameInput.value = firstName;
    if(lastNameInput) lastNameInput.value = lastName;
    
    // Set Bio with Default
    if(bioInput) bioInput.value = data.bio || 'أنا جديد في القهوة';

    if(emailInput) emailInput.value = currentUser.email || data.email || '';
    if(eduInput) eduInput.value = data.educationLevel || 'طالب';
}

function setupEventListeners() {
    // 1. Personal Info Save
    const infoForm = document.getElementById('personalInfoForm');
    if (infoForm) {
        infoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await savePersonalInfo();
        });
    }

    // 2. Image Modal Triggers
    const triggerImgBtn = document.getElementById('triggerImageModal');
    if (triggerImgBtn) {
        triggerImgBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            openImageModal();
        });
    }

    const cancelImgBtn = document.getElementById('cancelImageSelect');
    const confirmImgBtn = document.getElementById('confirmImageSelect');
    const closeImgIcon = document.querySelector('#imageModal .close'); // Deprecated if using new modal style, but kept for safety

    if(cancelImgBtn) cancelImgBtn.addEventListener('click', closeImageModal);
    if(confirmImgBtn) confirmImgBtn.addEventListener('click', saveNewProfileImage);

    // 3. Password Modal Triggers (NEW)
    const triggerPassBtn = document.getElementById('triggerPasswordModal');
    const passModal = document.getElementById('passwordModal');
    const closePassBtn = document.getElementById('closePassModal');
    const cancelPassBtn = document.getElementById('cancelPass');
    const passForm = document.getElementById('changePasswordForm');

    if (triggerPassBtn) {
        triggerPassBtn.addEventListener('click', () => {
            passModal.style.display = 'flex';
            document.getElementById('passwordMsg').textContent = '';
            passForm.reset();
        });
    }

    const closePassModal = () => passModal.style.display = 'none';
    if (closePassBtn) closePassBtn.addEventListener('click', closePassModal);
    if (cancelPassBtn) cancelPassBtn.addEventListener('click', closePassModal);

    if (passForm) {
        passForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handlePasswordChange();
        });
    }

    // 4. Delete Modal Triggers
    const deleteBtn = document.getElementById('deleteAccountBtn');
    if (deleteBtn) deleteBtn.addEventListener('click', setupDeleteAccount);

    // Global Click to Close Modals
    window.onclick = (e) => {
        const imgModal = document.getElementById('imageModal');
        const delModal = document.getElementById('deleteModal');
        const pwdModal = document.getElementById('passwordModal');
        
        if (e.target == imgModal) closeImageModal();
        if (e.target == delModal) delModal.style.display = 'none';
        if (e.target == pwdModal) pwdModal.style.display = 'none';
    };
}

// --- Password Change Logic (NEW) ---
async function handlePasswordChange() {
    const oldPass = document.getElementById('oldPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const msgDiv = document.getElementById('passwordMsg');
    const btn = document.querySelector('#changePasswordForm button[type="submit"]');

    if (newPass.length < 6) {
        msgDiv.style.color = 'red';
        msgDiv.textContent = 'الباسورد قصير أوي يا كابتن (على الأقل 6 حروف)';
        return;
    }

    btn.disabled = true;
    btn.textContent = 'جاري التشفير...';
    msgDiv.style.color = 'var(--text-grey)';
    msgDiv.textContent = 'لحظة واحدة...';

    const result = await changeUserPassword(oldPass, newPass);

    if (result.success) {
        msgDiv.style.color = 'green';
        msgDiv.textContent = 'تمام يا ريس! الباسورد اتغير بنجاح';
        btn.textContent = 'تم!';
        setTimeout(() => {
            document.getElementById('passwordModal').style.display = 'none';
            btn.disabled = false;
            btn.textContent = 'غير يا باشا';
        }, 2000);
    } else {
        msgDiv.style.color = 'red';
        msgDiv.textContent = 'مشكلة: ' + result.error;
        btn.disabled = false;
        btn.textContent = 'غير يا باشا';
    }
}

// --- Image Logic ---
function openImageModal() {
    const modal = document.getElementById('imageModal');
    const grid = document.getElementById('imageGrid');
    
    if(!modal || !grid) return;

    const currentImage = userData?.profileImage || 'images/user.png';
    selectedImage = currentImage;

    grid.innerHTML = profileImages.map(img => `
        <div class="image-option ${currentImage === img ? 'selected' : ''}" 
             onclick="window.handleImageSelect(this, '${img}')">
            <img src="${img}" onerror="this.src='images/user.png'">
        </div>
    `).join('');

    modal.style.display = 'flex';
}

window.handleImageSelect = function(el, imgSrc) {
    document.querySelectorAll('.image-option').forEach(opt => opt.classList.remove('selected'));
    el.classList.add('selected');
    selectedImage = imgSrc;
};

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if(modal) modal.style.display = 'none';
}

async function saveNewProfileImage() {
    const btn = document.getElementById('confirmImageSelect');
    const originalText = btn.textContent;
    btn.textContent = 'جاري الحفظ...';
    btn.disabled = true;

    const result = await updateUserProfile({ profileImage: selectedImage });
    
    if (result.success) {
        userData.profileImage = selectedImage;
        updateUI(); 
        
        const navImg = document.querySelector('.user-avatar img');
        if(navImg) navImg.src = selectedImage;
        
        closeImageModal();
        alert('تم تغيير الصورة يا جميل!');
    } else {
        alert('حصل مشكلة: ' + result.error);
    }
    
    btn.textContent = originalText;
    btn.disabled = false;
}

// --- Personal Info Logic ---
async function savePersonalInfo() {
    const btn = document.querySelector('#personalInfoForm button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> بيحفظ...';
    btn.disabled = true;

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const bio = document.getElementById('userBio').value.trim(); 
    const educationLevel = document.getElementById('educationLevel').value;
    
    const fullName = `${firstName} ${lastName}`.trim();

    const result = await updateUserProfile({
        fullName: fullName,
        bio: bio,
        educationLevel: educationLevel
    });

    if (result.success) {
        alert('تسلم ايدك، البيانات اتحدثت!');
        userData.fullName = fullName;
        userData.educationLevel = educationLevel;
        userData.bio = bio; 
        updateUI();
    } else {
        alert('مشكلة في الحفظ: ' + result.error);
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
}

// --- Delete Account Logic ---
function setupDeleteAccount() {
    const modal = document.getElementById('deleteModal');
    const input = document.getElementById('deleteConfirm');
    const confirmBtn = document.getElementById('confirmDelete');
    const cancelBtn = document.getElementById('cancelDelete');
    const closeBtn = modal.querySelector('.close');

    if(!modal) return;

    modal.style.display = 'flex';
    input.value = '';
    confirmBtn.disabled = true;
    confirmBtn.style.opacity = '0.5';

    input.oninput = (e) => {
        if (e.target.value === 'امسح') {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
            confirmBtn.style.cursor = 'pointer';
        } else {
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
            confirmBtn.style.cursor = 'not-allowed';
        }
    };

    confirmBtn.onclick = async () => {
        confirmBtn.innerHTML = 'بيودع...';
        const result = await deleteUserAccount();
        if (result.success) {
            window.location.href = 'index.html';
        } else {
            alert('مشكلة في المسح: ' + result.error);
            confirmBtn.innerHTML = 'تأكيد المسح';
        }
    };

    const closeModal = () => modal.style.display = 'none';
    cancelBtn.onclick = closeModal;
    if(closeBtn) closeBtn.onclick = closeModal;
}