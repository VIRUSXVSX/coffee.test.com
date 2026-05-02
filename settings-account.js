// import { 
//     auth, 
//     onAuthStateChanged, 
//     getUserData, 
//     updateUserProfile, 
//     deleteUserAccount,
//     changeUserPassword 
// } from './auth-service.js';

// // Predefined profile images
// const profileImages = [
//     "images/profile/1.jpg", "images/profile/2.jpg", "images/profile/3.jpg",
//     "images/profile/4.jpg", "images/profile/5.jpg", "images/profile/6.jpg",
//     "images/profile/7.jpg", "images/profile/8.jpg", "images/profile/9.jpg",
//     "images/profile/10.jpg", "images/profile/11.jpg", "images/profile/12.jpg",
//     "images/profile/13.jpg", "images/profile/14.jpg", "images/profile/15.jpg",
//     "images/profile/16.jpg", "images/profile/17.jpg", "images/profile/18.jpg",
//     "images/profile/19.jpg", "images/profile/20.jpg", "images/profile/21.jpg",
//     "images/profile/22.jpg", "images/profile/23.jpg", "images/profile/24.jpg",
//     "images/profile/25.jpg", "images/profile/26.png", "images/profile/27.jpg",
//     "images/profile/28.jpg", "images/profile/29.jpg", "images/profile/pro/no-user.webp"
// ];

// let currentUser = null;
// let userData = {}; 
// let selectedImage = '';
// let isCustomLinkMode = false;

// document.addEventListener('DOMContentLoaded', () => {
//     onAuthStateChanged(auth, async (user) => {
//         if (user) {
//             currentUser = user;
//             await loadUserData();
//             setupEventListeners();
//         } else {
//             window.location.href = 'login.html';
//         }
//     });
// });

// async function loadUserData() {
//     try {
//         const result = await getUserData(currentUser.uid);
//         if (result.success) {
//             userData = result.data;
//             updateUI();
//         }
//     } catch (error) {
//         console.error("Error loading user data:", error);
//     }
// }

// function updateUI() {
//     const data = userData || {};

//     if(document.getElementById('sidebarName')) 
//         document.getElementById('sidebarName').textContent = data.fullName || 'الزبون';
    
//     if(document.getElementById('sidebarEducation')) 
//         document.getElementById('sidebarEducation').textContent = data.educationLevel || 'زبون جديد';
    
//     const currentImg = data.profileImage || 'images/user.png';
//     if(document.getElementById('sidebarImage')) 
//         document.getElementById('sidebarImage').src = currentImg;
    
//     const fullName = data.fullName || '';
//     const nameParts = fullName.split(' ');
    
//     const firstName = nameParts[0] || '';
//     const lastName = nameParts.slice(1).join(' ') || '';

//     const firstNameInput = document.getElementById('firstName');
//     const lastNameInput = document.getElementById('lastName');
//     const bioInput = document.getElementById('userBio'); 
//     const emailInput = document.getElementById('email');
//     const eduInput = document.getElementById('educationLevel');

//     if(firstNameInput) firstNameInput.value = firstName;
//     if(lastNameInput) lastNameInput.value = lastName;
//     if(bioInput) bioInput.value = data.bio || 'أنا جديد في القهوة';
//     if(emailInput) emailInput.value = currentUser.email || data.email || '';
//     if(eduInput) eduInput.value = data.educationLevel || 'طالب';
// }

// function setupEventListeners() {
//     // 1. Personal Info Save
//     const infoForm = document.getElementById('personalInfoForm');
//     if (infoForm) {
//         infoForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             await savePersonalInfo();
//         });
//     }

//     // 2. Image Modal Triggers
//     const triggerImgBtn = document.getElementById('triggerImageModal');
//     if (triggerImgBtn) {
//         triggerImgBtn.addEventListener('click', (e) => {
//             e.preventDefault(); 
//             openImageModal();
//         });
//     }

//     const cancelImgBtn = document.getElementById('cancelImageSelect');
//     const confirmImgBtn = document.getElementById('confirmImageSelect');

//     if(cancelImgBtn) cancelImgBtn.addEventListener('click', closeImageModal);
//     if(confirmImgBtn) confirmImgBtn.addEventListener('click', saveNewProfileImage);

//     // Custom Link Input Listener
//     const customUrlInput = document.getElementById('customImageUrl');
//     if (customUrlInput) {
//         customUrlInput.addEventListener('input', (e) => {
//             handleCustomUrlInput(e.target.value);
//         });
//     }

//     // 3. Password Modal Triggers
//     const triggerPassBtn = document.getElementById('triggerPasswordModal');
//     const passModal = document.getElementById('passwordModal');
//     const closePassBtn = document.getElementById('closePassModal');
//     const cancelPassBtn = document.getElementById('cancelPass');
//     const passForm = document.getElementById('changePasswordForm');

//     if (triggerPassBtn) {
//         triggerPassBtn.addEventListener('click', () => {
//             passModal.style.display = 'flex';
//             document.getElementById('passwordMsg').textContent = '';
//             passForm.reset();
//         });
//     }

//     const closePassModal = () => passModal.style.display = 'none';
//     if (closePassBtn) closePassBtn.addEventListener('click', closePassModal);
//     if (cancelPassBtn) cancelPassBtn.addEventListener('click', closePassModal);

//     if (passForm) {
//         passForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             await handlePasswordChange();
//         });
//     }

//     // 4. Delete Modal Triggers
//     const deleteBtn = document.getElementById('deleteAccountBtn');
//     if (deleteBtn) deleteBtn.addEventListener('click', setupDeleteAccount);

//     window.onclick = (e) => {
//         const imgModal = document.getElementById('imageModal');
//         const delModal = document.getElementById('deleteModal');
//         const pwdModal = document.getElementById('passwordModal');
        
//         if (e.target == imgModal) closeImageModal();
//         if (e.target == delModal) delModal.style.display = 'none';
//         if (e.target == pwdModal) pwdModal.style.display = 'none';
//     };
// }

// async function handlePasswordChange() {
//     const oldPass = document.getElementById('oldPassword').value;
//     const newPass = document.getElementById('newPassword').value;
//     const msgDiv = document.getElementById('passwordMsg');
//     const btn = document.querySelector('#changePasswordForm button[type="submit"]');

//     if (newPass.length < 6) {
//         msgDiv.style.color = 'red';
//         msgDiv.textContent = 'الباسورد قصير أوي يا كابتن (على الأقل 6 حروف)';
//         return;
//     }

//     btn.disabled = true;
//     btn.textContent = 'جاري التشفير...';
//     msgDiv.style.color = 'var(--text-grey)';
//     msgDiv.textContent = 'لحظة واحدة...';

//     const result = await changeUserPassword(oldPass, newPass);

//     if (result.success) {
//         msgDiv.style.color = 'green';
//         msgDiv.textContent = 'تمام يا ريس! الباسورد اتغير بنجاح';
//         btn.textContent = 'تم!';
//         setTimeout(() => {
//             document.getElementById('passwordModal').style.display = 'none';
//             btn.disabled = false;
//             btn.textContent = 'غير يا باشا';
//         }, 2000);
//     } else {
//         msgDiv.style.color = 'red';
//         msgDiv.textContent = 'مشكلة: ' + result.error;
//         btn.disabled = false;
//         btn.textContent = 'غير يا باشا';
//     }
// }

// // --- Image Logic ---
// function openImageModal() {
//     const modal = document.getElementById('imageModal');
//     const grid = document.getElementById('imageGrid');
//     const customInput = document.getElementById('customImageInput');
//     const errorMsg = document.getElementById('imgPreviewError');
    
//     if(!modal || !grid) return;

//     // Hide input and error initially
//     customInput.style.display = 'none';
//     if(errorMsg) errorMsg.style.display = 'none';
//     isCustomLinkMode = false;
//     document.getElementById('customImageUrl').value = '';

//     const currentImage = userData?.profileImage || 'images/user.png';
//     selectedImage = currentImage;

//     // Generate Grid with "+" option at the start
//     let html = `
//         <div class="image-option" style="display:flex; align-items:center; justify-content:center; background:#eee;" 
//              onclick="window.toggleCustomLink(this)">
//             <i class="fa-solid fa-plus" style="font-size: 2rem; color: var(--text-grey);"></i>
//         </div>
//     `;

//     html += profileImages.map(img => `
//         <div class="image-option ${currentImage === img ? 'selected' : ''}" 
//              onclick="window.handleImageSelect(this, '${img}')">
//             <img src="${img}" onerror="this.src='images/user.png'">
//         </div>
//     `).join('');

//     grid.innerHTML = html;
//     modal.style.display = 'flex';
// }

// window.handleImageSelect = function(el, imgSrc) {
//     document.querySelectorAll('.image-option').forEach(opt => opt.classList.remove('selected'));
//     el.classList.add('selected');
    
//     // Hide custom input if a standard image is picked
//     document.getElementById('customImageInput').style.display = 'none';
//     isCustomLinkMode = false;
    
//     selectedImage = imgSrc;
// };

// window.toggleCustomLink = function(el) {
//     document.querySelectorAll('.image-option').forEach(opt => opt.classList.remove('selected'));
//     el.classList.add('selected');
    
//     const inputDiv = document.getElementById('customImageInput');
//     inputDiv.style.display = 'block';
//     isCustomLinkMode = true;
// };

// function handleCustomUrlInput(url) {
//     const preview = document.getElementById('customImagePreview');
//     const errorMsg = document.getElementById('imgPreviewError');
    
//     if (!url) {
//         preview.style.display = 'none';
//         errorMsg.style.display = 'none';
//         return;
//     }

//     // --- Google Drive Link Converter (IMPROVED) ---
//     // Old: uc?export=view (Blocked often)
//     // New: thumbnail?sz=w1000 (Very Reliable)
    
//     let finalUrl = url;
    
//     // Check for standard Drive Links or 'open?id=' links
//     if (url.includes('drive.google.com')) {
//         let fileId = null;

//         // Try to match /d/ID
//         const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        
//         // Try to match id=ID
//         const queryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

//         if (idMatch && idMatch[1]) {
//             fileId = idMatch[1];
//         } else if (queryMatch && queryMatch[1]) {
//             fileId = queryMatch[1];
//         }

//         if (fileId) {
//             // Using the Thumbnail endpoint which is more permissive
//             finalUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
//         }
//     }

//     selectedImage = finalUrl;
    
//     // Reset state
//     preview.style.display = 'inline-block';
//     preview.style.border = '2px solid var(--border-color)';
//     errorMsg.style.display = 'none';
    
//     // Set src
//     preview.src = finalUrl;
    
//     // Handle error in preview
//     preview.onerror = () => {
//         preview.style.border = '2px solid red';
//         errorMsg.style.display = 'block';
//         // Give user a hint if it fails
//         errorMsg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> الصورة مش بتحمل! اتأكد إنها Public <br> (General Access -> Anyone with the link)';
//     };
//     preview.onload = () => {
//         preview.style.border = '2px solid green';
//         errorMsg.style.display = 'none';
//     };
// }

// function closeImageModal() {
//     const modal = document.getElementById('imageModal');
//     if(modal) modal.style.display = 'none';
// }

// async function saveNewProfileImage() {
//     const btn = document.getElementById('confirmImageSelect');
//     const errorMsg = document.getElementById('imgPreviewError');
//     const originalText = btn.textContent;
    
//     // Prevent saving if there is an error
//     if (isCustomLinkMode && errorMsg.style.display === 'block') {
//         alert('الصورة مش شغالة! اتأكد من اللينك الأول.');
//         return;
//     }
    
//     // Use the custom link if in custom mode, otherwise selectedImage
//     let imageToSave = selectedImage;

//     // Basic Validation
//     if (!imageToSave) {
//         alert("اختار صورة يا فنان!");
//         return;
//     }

//     btn.textContent = 'جاري الحفظ...';
//     btn.disabled = true;

//     const result = await updateUserProfile({ profileImage: imageToSave });
    
//     if (result.success) {
//         userData.profileImage = imageToSave;
//         updateUI(); 
        
//         const navImg = document.querySelector('.user-avatar img');
//         if(navImg) navImg.src = imageToSave;
        
//         closeImageModal();
//         alert('تم تغيير الصورة يا جميل!');
//     } else {
//         alert('حصل مشكلة: ' + result.error);
//     }
    
//     btn.textContent = originalText;
//     btn.disabled = false;
// }

// // --- Personal Info Logic ---
// async function savePersonalInfo() {
//     const btn = document.querySelector('#personalInfoForm button');
//     const originalText = btn.innerHTML;
//     btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> بيحفظ...';
//     btn.disabled = true;

//     const firstName = document.getElementById('firstName').value.trim();
//     const lastName = document.getElementById('lastName').value.trim();
//     const bio = document.getElementById('userBio').value.trim(); 
//     const educationLevel = document.getElementById('educationLevel').value;
    
//     const fullName = `${firstName} ${lastName}`.trim();

//     const result = await updateUserProfile({
//         fullName: fullName,
//         bio: bio,
//         educationLevel: educationLevel
//     });

//     if (result.success) {
//         alert('تسلم ايدك، البيانات اتحدثت!');
//         userData.fullName = fullName;
//         userData.educationLevel = educationLevel;
//         userData.bio = bio; 
//         updateUI();
//     } else {
//         alert('مشكلة في الحفظ: ' + result.error);
//     }

//     btn.innerHTML = originalText;
//     btn.disabled = false;
// }

// // --- Delete Account Logic ---
// function setupDeleteAccount() {
//     const modal = document.getElementById('deleteModal');
//     const input = document.getElementById('deleteConfirm');
//     const confirmBtn = document.getElementById('confirmDelete');
//     const cancelBtn = document.getElementById('cancelDelete');
//     const closeBtn = modal.querySelector('.close');

//     if(!modal) return;

//     modal.style.display = 'flex';
//     input.value = '';
//     confirmBtn.disabled = true;
//     confirmBtn.style.opacity = '0.5';

//     input.oninput = (e) => {
//         if (e.target.value === 'امسح') {
//             confirmBtn.disabled = false;
//             confirmBtn.style.opacity = '1';
//             confirmBtn.style.cursor = 'pointer';
//         } else {
//             confirmBtn.disabled = true;
//             confirmBtn.style.opacity = '0.5';
//             confirmBtn.style.cursor = 'not-allowed';
//         }
//     };

//     confirmBtn.onclick = async () => {
//         confirmBtn.innerHTML = 'بيودع...';
//         const result = await deleteUserAccount();
//         if (result.success) {
//             window.location.href = 'index.html';
//         } else {
//             alert('مشكلة في المسح: ' + result.error);
//             confirmBtn.innerHTML = 'تأكيد المسح';
//         }
//     };

//     const closeModal = () => modal.style.display = 'none';
//     cancelBtn.onclick = closeModal;
//     if(closeBtn) closeBtn.onclick = closeModal;
// }






// import { 
//     auth, 
//     onAuthStateChanged, 
//     getUserData, 
//     updateUserProfile, 
//     deleteUserAccount,
//     changeUserPassword 
// } from './auth-service.js';

// // Predefined profile images
// const profileImages = [
//     "images/profile/1.jpg", "images/profile/2.jpg", "images/profile/3.jpg",
//     "images/profile/4.jpg", "images/profile/5.jpg", "images/profile/6.jpg",
//     "images/profile/7.jpg", "images/profile/8.jpg", "images/profile/9.jpg",
//     "images/profile/10.jpg", "images/profile/11.jpg", "images/profile/12.jpg",
//     "images/profile/13.jpg", "images/profile/14.jpg", "images/profile/15.jpg",
//     "images/profile/16.jpg", "images/profile/17.jpg", "images/profile/18.jpg",
//     "images/profile/19.jpg", "images/profile/20.jpg", "images/profile/21.jpg",
//     "images/profile/22.jpg", "images/profile/23.jpg", "images/profile/24.jpg",
//     "images/profile/25.jpg", "images/profile/26.png", "images/profile/27.jpg",
//     "images/profile/28.jpg", "images/profile/29.jpg" 
//     // "images/profile/pro/no-user.webp"
// ];

// let currentUser = null;
// let userData = {}; 
// let selectedImage = '';
// let isCustomLinkMode = false;

// document.addEventListener('DOMContentLoaded', () => {
//     onAuthStateChanged(auth, async (user) => {
//         if (user) {
//             currentUser = user;
//             await loadUserData();
//             setupEventListeners();
//         } else {
//             window.location.href = 'login.html';
//         }
//     });
// });

// async function loadUserData() {
//     try {
//         const result = await getUserData(currentUser.uid);
//         if (result.success) {
//             userData = result.data;
//             updateUI();
//         }
//     } catch (error) {
//         console.error("Error loading user data:", error);
//     }
// }

// function updateUI() {
//     const data = userData || {};

//     if(document.getElementById('sidebarName')) 
//         document.getElementById('sidebarName').textContent = data.fullName || 'الزبون';
    
//     if(document.getElementById('sidebarEducation')) 
//         document.getElementById('sidebarEducation').textContent = data.educationLevel || 'زبون جديد';
    
//     const currentImg = data.profileImage || 'images/user.png';
//     if(document.getElementById('sidebarImage')) 
//         document.getElementById('sidebarImage').src = currentImg;
    
//     const fullName = data.fullName || '';
//     const nameParts = fullName.split(' ');
    
//     const firstName = nameParts[0] || '';
//     const lastName = nameParts.slice(1).join(' ') || '';

//     const firstNameInput = document.getElementById('firstName');
//     const lastNameInput = document.getElementById('lastName');
//     const bioInput = document.getElementById('userBio'); 
//     const emailInput = document.getElementById('email');
//     const eduInput = document.getElementById('educationLevel');
//     const drinkInput = document.getElementById('signatureDrink'); // New Input

//     if(firstNameInput) firstNameInput.value = firstName;
//     if(lastNameInput) lastNameInput.value = lastName;
//     if(bioInput) bioInput.value = data.bio || 'أنا جديد في القهوة';
//     if(emailInput) emailInput.value = currentUser.email || data.email || '';
//     if(eduInput) eduInput.value = data.educationLevel || 'طالب';
//     if(drinkInput) drinkInput.value = data.signatureDrink || ''; // Set Drink value
// }

// function setupEventListeners() {
//     // 1. Personal Info Save
//     const infoForm = document.getElementById('personalInfoForm');
//     if (infoForm) {
//         infoForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             await savePersonalInfo();
//         });
//     }

//     // 2. Image Modal Triggers
//     const triggerImgBtn = document.getElementById('triggerImageModal');
//     if (triggerImgBtn) {
//         triggerImgBtn.addEventListener('click', (e) => {
//             e.preventDefault(); 
//             openImageModal();
//         });
//     }

//     const cancelImgBtn = document.getElementById('cancelImageSelect');
//     const confirmImgBtn = document.getElementById('confirmImageSelect');

//     if(cancelImgBtn) cancelImgBtn.addEventListener('click', closeImageModal);
//     if(confirmImgBtn) confirmImgBtn.addEventListener('click', saveNewProfileImage);

//     // Custom Link Input Listener
//     const customUrlInput = document.getElementById('customImageUrl');
//     if (customUrlInput) {
//         customUrlInput.addEventListener('input', (e) => {
//             handleCustomUrlInput(e.target.value);
//         });
//     }

//     // 3. Password Modal Triggers
//     const triggerPassBtn = document.getElementById('triggerPasswordModal');
//     const passModal = document.getElementById('passwordModal');
//     const closePassBtn = document.getElementById('closePassModal');
//     const cancelPassBtn = document.getElementById('cancelPass');
//     const passForm = document.getElementById('changePasswordForm');

//     if (triggerPassBtn) {
//         triggerPassBtn.addEventListener('click', () => {
//             passModal.style.display = 'flex';
//             document.getElementById('passwordMsg').textContent = '';
//             passForm.reset();
//         });
//     }

//     const closePassModal = () => passModal.style.display = 'none';
//     if (closePassBtn) closePassBtn.addEventListener('click', closePassModal);
//     if (cancelPassBtn) cancelPassBtn.addEventListener('click', closePassModal);

//     if (passForm) {
//         passForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             await handlePasswordChange();
//         });
//     }

//     // 4. Delete Modal Triggers
//     const deleteBtn = document.getElementById('deleteAccountBtn');
//     if (deleteBtn) deleteBtn.addEventListener('click', setupDeleteAccount);

//     window.onclick = (e) => {
//         const imgModal = document.getElementById('imageModal');
//         const delModal = document.getElementById('deleteModal');
//         const pwdModal = document.getElementById('passwordModal');
        
//         if (e.target == imgModal) closeImageModal();
//         if (e.target == delModal) delModal.style.display = 'none';
//         if (e.target == pwdModal) pwdModal.style.display = 'none';
//     };
// }

// async function handlePasswordChange() {
//     const oldPass = document.getElementById('oldPassword').value;
//     const newPass = document.getElementById('newPassword').value;
//     const msgDiv = document.getElementById('passwordMsg');
//     const btn = document.querySelector('#changePasswordForm button[type="submit"]');

//     if (newPass.length < 6) {
//         msgDiv.style.color = 'red';
//         msgDiv.textContent = 'الباسورد قصير أوي يا كابتن (على الأقل 6 حروف)';
//         return;
//     }

//     btn.disabled = true;
//     btn.textContent = 'جاري التشفير...';
//     msgDiv.style.color = 'var(--text-grey)';
//     msgDiv.textContent = 'لحظة واحدة...';

//     const result = await changeUserPassword(oldPass, newPass);

//     if (result.success) {
//         msgDiv.style.color = 'green';
//         msgDiv.textContent = 'تمام يا ريس! الباسورد اتغير بنجاح';
//         btn.textContent = 'تم!';
//         setTimeout(() => {
//             document.getElementById('passwordModal').style.display = 'none';
//             btn.disabled = false;
//             btn.textContent = 'غير يا باشا';
//         }, 2000);
//     } else {
//         msgDiv.style.color = 'red';
//         msgDiv.textContent = 'مشكلة: ' + result.error;
//         btn.disabled = false;
//         btn.textContent = 'غير يا باشا';
//     }
// }

// // --- Image Logic ---
// function openImageModal() {
//     const modal = document.getElementById('imageModal');
//     const grid = document.getElementById('imageGrid');
//     const customInput = document.getElementById('customImageInput');
//     const errorMsg = document.getElementById('imgPreviewError');
    
//     if(!modal || !grid) return;

//     customInput.style.display = 'none';
//     if(errorMsg) errorMsg.style.display = 'none';
//     isCustomLinkMode = false;
//     document.getElementById('customImageUrl').value = '';

//     const currentImage = userData?.profileImage || 'images/user.png';
//     selectedImage = currentImage;

//     let html = `
//         <div class="image-option" style="display:flex; align-items:center; justify-content:center; background:#eee;" 
//              onclick="window.toggleCustomLink(this)">
//             <i class="fa-solid fa-plus" style="font-size: 2rem; color: var(--text-grey);"></i>
//         </div>
//     `;

//     html += profileImages.map(img => `
//         <div class="image-option ${currentImage === img ? 'selected' : ''}" 
//              onclick="window.handleImageSelect(this, '${img}')">
//             <img src="${img}" onerror="this.src='images/user.png'">
//         </div>
//     `).join('');

//     grid.innerHTML = html;
//     modal.style.display = 'flex';
// }

// window.handleImageSelect = function(el, imgSrc) {
//     document.querySelectorAll('.image-option').forEach(opt => opt.classList.remove('selected'));
//     el.classList.add('selected');
//     document.getElementById('customImageInput').style.display = 'none';
//     isCustomLinkMode = false;
//     selectedImage = imgSrc;
// };

// window.toggleCustomLink = function(el) {
//     document.querySelectorAll('.image-option').forEach(opt => opt.classList.remove('selected'));
//     el.classList.add('selected');
//     const inputDiv = document.getElementById('customImageInput');
//     inputDiv.style.display = 'block';
//     isCustomLinkMode = true;
// };

// function handleCustomUrlInput(url) {
//     const preview = document.getElementById('customImagePreview');
//     const errorMsg = document.getElementById('imgPreviewError');
    
//     if (!url) {
//         preview.style.display = 'none';
//         errorMsg.style.display = 'none';
//         return;
//     }

//     let finalUrl = url;
//     if (url.includes('drive.google.com')) {
//         let fileId = null;
//         const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
//         const queryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
//         if (idMatch && idMatch[1]) fileId = idMatch[1];
//         else if (queryMatch && queryMatch[1]) fileId = queryMatch[1];

//         if (fileId) finalUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
//     }

//     selectedImage = finalUrl;
//     preview.style.display = 'inline-block';
//     preview.style.border = '2px solid var(--border-color)';
//     errorMsg.style.display = 'none';
//     preview.src = finalUrl;
    
//     preview.onerror = () => {
//         preview.style.border = '2px solid red';
//         errorMsg.style.display = 'block';
//         errorMsg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> الصورة مش بتحمل! اتأكد إنها Public <br> (General Access -> Anyone with the link)';
//     };
//     preview.onload = () => {
//         preview.style.border = '2px solid green';
//         errorMsg.style.display = 'none';
//     };
// }

// function closeImageModal() {
//     const modal = document.getElementById('imageModal');
//     if(modal) modal.style.display = 'none';
// }

// async function saveNewProfileImage() {
//     const btn = document.getElementById('confirmImageSelect');
//     const errorMsg = document.getElementById('imgPreviewError');
//     const originalText = btn.textContent;
    
//     if (isCustomLinkMode && errorMsg.style.display === 'block') {
//         alert('الصورة مش شغالة! اتأكد من اللينك الأول.');
//         return;
//     }
    
//     let imageToSave = selectedImage;

//     if (!imageToSave) {
//         alert("اختار صورة يا فنان!");
//         return;
//     }

//     btn.textContent = 'جاري الحفظ...';
//     btn.disabled = true;

//     const result = await updateUserProfile({ profileImage: imageToSave });
    
//     if (result.success) {
//         userData.profileImage = imageToSave;
//         updateUI(); 
        
//         const navImg = document.querySelector('.user-avatar img');
//         if(navImg) navImg.src = imageToSave;
        
//         closeImageModal();
//         alert('تم تغيير الصورة يا جميل!');
//     } else {
//         alert('حصل مشكلة: ' + result.error);
//     }
    
//     btn.textContent = originalText;
//     btn.disabled = false;
// }

// // --- Personal Info Logic ---
// async function savePersonalInfo() {
//     const btn = document.querySelector('#personalInfoForm button');
//     const originalText = btn.innerHTML;
//     btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> بيحفظ...';
//     btn.disabled = true;

//     const firstName = document.getElementById('firstName').value.trim();
//     const lastName = document.getElementById('lastName').value.trim();
//     const bio = document.getElementById('userBio').value.trim(); 
//     const educationLevel = document.getElementById('educationLevel').value;
//     const signatureDrink = document.getElementById('signatureDrink').value; // Get Drink Value
    
//     const fullName = `${firstName} ${lastName}`.trim();

//     const result = await updateUserProfile({
//         fullName: fullName,
//         bio: bio,
//         educationLevel: educationLevel,
//         signatureDrink: signatureDrink // Save to Firestore
//     });

//     if (result.success) {
//         alert('تسلم ايدك، البيانات اتحدثت!');
//         userData.fullName = fullName;
//         userData.educationLevel = educationLevel;
//         userData.bio = bio; 
//         userData.signatureDrink = signatureDrink;
//         updateUI();
//     } else {
//         alert('مشكلة في الحفظ: ' + result.error);
//     }

//     btn.innerHTML = originalText;
//     btn.disabled = false;
// }

// function setupDeleteAccount() {
//     const modal = document.getElementById('deleteModal');
//     const input = document.getElementById('deleteConfirm');
//     const confirmBtn = document.getElementById('confirmDelete');
//     const cancelBtn = document.getElementById('cancelDelete');
//     const closeBtn = modal.querySelector('.close');

//     if(!modal) return;

//     modal.style.display = 'flex';
//     input.value = '';
//     confirmBtn.disabled = true;
//     confirmBtn.style.opacity = '0.5';

//     input.oninput = (e) => {
//         if (e.target.value === 'امسح') {
//             confirmBtn.disabled = false;
//             confirmBtn.style.opacity = '1';
//             confirmBtn.style.cursor = 'pointer';
//         } else {
//             confirmBtn.disabled = true;
//             confirmBtn.style.opacity = '0.5';
//             confirmBtn.style.cursor = 'not-allowed';
//         }
//     };

//     confirmBtn.onclick = async () => {
//         confirmBtn.innerHTML = 'بيودع...';
//         const result = await deleteUserAccount();
//         if (result.success) {
//             window.location.href = 'index.html';
//         } else {
//             alert('مشكلة في المسح: ' + result.error);
//             confirmBtn.innerHTML = 'تأكيد المسح';
//         }
//     };

//     const closeModal = () => modal.style.display = 'none';
//     cancelBtn.onclick = closeModal;
//     if(closeBtn) closeBtn.onclick = closeModal;
// }
















// new





// import {
//   auth,
//   onAuthStateChanged,
//   getUserData,
//   updateUserProfile,
//   deleteUserAccount,
//   changeUserPassword
// } from './auth-service.js';

// // الصور الافتراضية
// const profileImages = [
//   "images/profile/1.jpg", "images/profile/2.jpg", "images/profile/3.jpg",
//   "images/profile/4.jpg", "images/profile/5.jpg", "images/profile/6.jpg",
//   "images/profile/7.jpg", "images/profile/8.jpg", "images/profile/9.jpg",
//   "images/profile/10.jpg", "images/profile/11.jpg", "images/profile/12.jpg",
//   "images/profile/13.jpg", "images/profile/14.jpg", "images/profile/15.jpg",
//   "images/profile/16.jpg", "images/profile/17.jpg", "images/profile/18.jpg",
//   "images/profile/19.jpg", "images/profile/20.jpg", "images/profile/21.jpg",
//   "images/profile/22.jpg", "images/profile/23.jpg", "images/profile/24.jpg",
//   "images/profile/25.jpg", "images/profile/26.png", "images/profile/27.jpg",
//   "images/profile/28.jpg", "images/profile/29.jpg"
// ];

// let currentUser = null;
// let userData = {};
// let selectedImage = '';
// let isCustomLinkMode = false;

// document.addEventListener('DOMContentLoaded', () => {
//   onAuthStateChanged(auth, async (user) => {
//     if (user) {
//       currentUser = user;
//       await loadUserData();
//       setupEventListeners();
//     } else {
//       window.location.href = 'login.html';
//     }
//   });
// });

// async function loadUserData() {
//   try {
//     const result = await getUserData(currentUser.uid);
//     if (result.success) {
//       userData = result.data;
//       updateUI();
//     }
//   } catch (error) {
//     console.error("Error loading user data:", error);
//   }
// }

// function updateUI() {
//   const data = userData || {};
  
//   if(document.getElementById('sidebarName')) 
//     document.getElementById('sidebarName').textContent = data.fullName || 'الزبون';

//   if(document.getElementById('sidebarEducation')) 
//     document.getElementById('sidebarEducation').textContent = data.educationLevel || 'زبون جديد';

//   const currentImg = data.profileImage || 'images/user.png';
//   if(document.getElementById('sidebarImage')) 
//     document.getElementById('sidebarImage').src = currentImg;

//   const fullName = data.fullName || '';
//   const nameParts = fullName.split(' ');
//   const firstName = nameParts[0] || '';
//   const lastName = nameParts.slice(1).join(' ') || '';

//   const firstNameInput = document.getElementById('firstName');
//   const lastNameInput = document.getElementById('lastName');
//   const bioInput = document.getElementById('userBio'); 
//   const emailInput = document.getElementById('email');
//   const eduInput = document.getElementById('educationLevel');
//   const drinkInput = document.getElementById('signatureDrink');

//   if(firstNameInput) firstNameInput.value = firstName;
//   if(lastNameInput) lastNameInput.value = lastName;
//   if(bioInput) bioInput.value = data.bio || 'أنا جديد في القهوة';
//   if(emailInput) emailInput.value = currentUser.email || data.email || '';
//   if(eduInput) eduInput.value = data.educationLevel || 'طالب';
//   if(drinkInput) drinkInput.value = data.signatureDrink || '';
// }

// function setupEventListeners() {
//   const infoForm = document.getElementById('personalInfoForm');
//   if (infoForm) {
//     infoForm.addEventListener('submit', async (e) => {
//       e.preventDefault();
//       await savePersonalInfo();
//     });
//   }

//   const triggerImgBtn = document.getElementById('triggerImageModal');
//   if (triggerImgBtn) {
//     triggerImgBtn.addEventListener('click', (e) => {
//       e.preventDefault(); 
//       window.openImageModal();
//     });
//   }

//   const confirmImgBtn = document.getElementById('confirmImageSelect');
//   if(confirmImgBtn) confirmImgBtn.addEventListener('click', saveNewProfileImage);

//   const customUrlInput = document.getElementById('customImageUrl');
//   if (customUrlInput) {
//     customUrlInput.addEventListener('input', (e) => {
//       window.handleCustomUrlInput(e.target.value);
//     });
//   }

//   // زرار الـ Enter للبحث في بنترست
//   document.getElementById('pinterestSearchInput')?.addEventListener('keydown', function(e) {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       window.openPinterestSearch();
//     }
//   });

//   // زرار الـ Enter للبحث الحر
//   document.getElementById('freeSearchInput')?.addEventListener('keydown', function(e) {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       window.filterFreeImages();
//     }
//   });

//   const triggerPassBtn = document.getElementById('triggerPasswordModal');
//   const passModal = document.getElementById('passwordModal');
//   const closePassBtn = document.getElementById('closePassModal');
//   const cancelPassBtn = document.getElementById('cancelPass');
//   const passForm = document.getElementById('changePasswordForm');

//   if (triggerPassBtn) {
//     triggerPassBtn.addEventListener('click', () => {
//       passModal.style.display = 'flex';
//       document.getElementById('passwordMsg').textContent = '';
//       passForm.reset();
//     });
//   }

//   const closePassModal = () => passModal.style.display = 'none';
//   if (closePassBtn) closePassBtn.addEventListener('click', closePassModal);
//   if (cancelPassBtn) cancelPassBtn.addEventListener('click', closePassModal);

//   if (passForm) {
//     passForm.addEventListener('submit', async (e) => {
//       e.preventDefault();
//       await handlePasswordChange();
//     });
//   }

//   const deleteBtn = document.getElementById('deleteAccountBtn');
//   if (deleteBtn) deleteBtn.addEventListener('click', setupDeleteAccount);

//   window.onclick = (e) => {
//     const imgModal = document.getElementById('imageModal');
//     const delModal = document.getElementById('deleteModal');
//     const pwdModal = document.getElementById('passwordModal');
    
//     if (e.target == imgModal) window.closeImageModal();
//     if (e.target == delModal) delModal.style.display = 'none';
//     if (e.target == pwdModal) pwdModal.style.display = 'none';
//   };
// }

// // =========================================
// // Image Modal Logic
// // =========================================
// window.openImageModal = function() {
//   const modal = document.getElementById('imageModal');
//   const grid = document.getElementById('imageGrid');
//   if(!modal || !grid) return;

//   window.switchImageTab('default'); 

//   const currentImage = userData?.profileImage || 'images/user.png';
//   selectedImage = currentImage;

//   let html = profileImages.map(img => `
//     <div class="image-option ${currentImage === img ? 'selected' : ''}" 
//          onclick="window.handleImageSelect(this, '${img}')">
//       <img src="${img}" onerror="this.src='images/user.png'">
//     </div>
//   `).join('');

//   grid.innerHTML = html;
//   modal.style.display = 'flex';
// };

// window.switchImageTab = function(tabName) {
//   document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
//   document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
//   event?.currentTarget?.classList.add('active');
//   document.getElementById(`tab-${tabName}`).style.display = 'block';

//   if (tabName === 'link') {
//     isCustomLinkMode = true; 
//   } else {
//     isCustomLinkMode = false;
//   }

//   // لو فتحنا تاب "مجموعتي"، نرسم الصور اللي متسيفة في الفايربيز
//   if (tabName === 'collection') {
//     window.renderCollection();
//   }
// };

// window.renderCollection = function() {
//   const grid = document.getElementById('collectionGrid');
//   const emptyMsg = document.getElementById('emptyCollectionMsg');
  
//   // بنجيب الصور من بيانات اليوزر، لو مفيش بنخليها مصفوفة فاضية
//   const savedImages = userData?.customImages || [];

//   if (savedImages.length === 0) {
//     grid.style.display = 'none';
//     emptyMsg.style.display = 'block';
//   } else {
//     grid.style.display = 'grid'; 
//     emptyMsg.style.display = 'none';
    
//     grid.innerHTML = savedImages.map(imgSrc => `
//       <div class="image-option ${selectedImage === imgSrc ? 'selected' : ''}" 
//            onclick="window.handleImageSelect(this, '${imgSrc}')">
//         <img src="${imgSrc}" onerror="this.src='images/user.png'">
//       </div>
//     `).join('');
//   }
// };

// window.closeImageModal = function() {
//   const modal = document.getElementById('imageModal');
//   if(modal) modal.style.display = 'none';
//   setTimeout(() => {
//     if(document.querySelector('.tab-btn')) {
//       document.querySelector('.tab-btn').click();
//     }
//   }, 200);
// };

// window.handleImageSelect = function(el, imgSrc) {
//   document.querySelectorAll('.image-option, .masonry-item').forEach(opt => opt.classList.remove('selected'));
//   el.classList.add('selected');
//   isCustomLinkMode = false;
//   selectedImage = imgSrc;
// };

// /// =========================================
// // Pinterest Search - Opens in New Tab
// // =========================================

// // Open Pinterest search in new tab
// window.openPinterestSearch = function() {
//   const searchInput = document.getElementById('pinterestSearchInput');
//   const searchTerm = searchInput.value.trim();
  
//   if (!searchTerm) {
//     alert('اكتب حاجة عشان نبحث عنها! ☕');
//     searchInput.focus();
//     return;
//   }
  
//   const pinterestUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchTerm)}`;
//   window.open(pinterestUrl, '_blank');
  
//   // Show helpful message after 2 seconds
//   setTimeout(() => {
//     alert('💡 ازاي تاخد اللينك:\n\n1. دوس على الصورة عشان تكبر\n2. كليك يمين على الصورة\n3. اختار "Copy Image Address"\n4. الصق اللينك في خانة "لينك جوجل درايف"');
//   }, 2000);
// };

// // Quick search from tags
// window.quickPinterestSearch = function(term) {
//   const searchInput = document.getElementById('pinterestSearchInput');
//   searchInput.value = term;
//   window.openPinterestSearch();
// };

// // =========================================
// // Custom Link Logic (Google Drive + Pinterest)
// // =========================================
// window.handleCustomUrlInput = function(url) {
//   const preview = document.getElementById('customImagePreview');
//   const errorMsg = document.getElementById('imgPreviewError');
  
//   if (!url) {
//     preview.style.display = 'none';
//     errorMsg.style.display = 'none';
//     return;
//   }
  
//   let finalUrl = url;
  
//   // Handle Pinterest URLs
//   if (url.includes('pinterest.com') || url.includes('pin.it')) {
//     if (url.includes('i.pinimg.com')) {
//       // Convert to highest quality
//       finalUrl = url.replace(/\/236x\//, '/originals/')
//                     .replace(/\/564x\//, '/originals/')
//                     .replace(/\/736x\//, '/originals/');
//     } else {
//       preview.style.display = 'none';
//       errorMsg.style.display = 'block';
//       errorMsg.textContent = '⚠️ لينك بنترست مش مباشر - افتح الصورة وانسخ اللينك المباشر';
//       return;
//     }
//   }
  
//   // Handle Google Drive URLs
//   if (url.includes('drive.google.com')) {
//     let fileId = null;
//     const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
//     const queryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
//     if (idMatch && idMatch[1]) fileId = idMatch[1];
//     else if (queryMatch && queryMatch[1]) fileId = queryMatch[1];
    
//     if (fileId) finalUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
//   }
  
//   selectedImage = finalUrl;
//   preview.style.display = 'inline-block';
//   preview.style.border = '2px solid var(--border-color)';
//   errorMsg.style.display = 'none';
//   preview.src = finalUrl;
  
//   preview.onerror = () => {
//     preview.style.border = '2px solid red';
//     errorMsg.style.display = 'block';
//     errorMsg.textContent = 'الصورة مش بتحمل - اتأكد من اللينك';
//   };
//   preview.onload = () => {
//     preview.style.border = '2px solid green';
//     errorMsg.style.display = 'none';
//     isCustomLinkMode = true; // Ensure this is true to trigger saving to collection
//   };
// };

// // =========================================
// // Save Profile Image
// // =========================================
// async function saveNewProfileImage() {
//   const btn = document.getElementById('confirmImageSelect');
//   const errorMsgGoogle = document.getElementById('imgPreviewError');
//   const originalText = btn.innerHTML;
  
//   if (isCustomLinkMode && errorMsgGoogle.style.display === 'block') {
//     alert('الصورة مش شغالة! اتأكد من اللينك الأول.');
//     return;
//   }

//   let imageToSave = selectedImage;

//   if (!imageToSave) {
//     alert("اختار صورة يا فنان!");
//     return;
//   }

//   btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
//   btn.disabled = true;

//   // تجهيز البيانات اللي هتتبعت للفايربيز
//   let payload = { profileImage: imageToSave };

//   // لو اليوزر بيسيف لينك جديد من تاب "درايف" أو "بنترست"
//   if (isCustomLinkMode) {
//     let currentCollection = userData.customImages || [];
//     // نتأكد إن الصورة مش موجودة أصلاً عشان ميتعملش تكرار
//     if (!currentCollection.includes(imageToSave)) {
//       currentCollection.push(imageToSave);
//       payload.customImages = currentCollection; // هنبعت المصفوفة الجديدة للفايربيز
//     }
//   }

//   // updateUserProfile هتحفظ الصورة الجديدة والمصفوفة (لو اتحدثت) في نفس الوقت
//   const result = await updateUserProfile(payload);

//   if (result.success) {
//     userData.profileImage = imageToSave;
//     // تحديث المصفوفة محلياً عشان تظهر لو فتح التاب تاني
//     if (payload.customImages) userData.customImages = payload.customImages; 
    
//     updateUI(); 
    
//     const navImg = document.querySelector('.user-avatar img');
//     if(navImg) navImg.src = imageToSave;
    
//     window.closeImageModal();
//   } else {
//     alert('حصل مشكلة: ' + result.error);
//   }

//   btn.innerHTML = originalText;
//   btn.disabled = false;
// }

// // =========================================
// // Personal Info & Security Logic
// // =========================================
// async function savePersonalInfo() {
//   const btn = document.querySelector('#personalInfoForm button');
//   const originalText = btn.innerHTML;
  
//   btn.innerHTML = 'بيحفظ...';
//   btn.disabled = true;
  
//   const firstName = document.getElementById('firstName').value.trim();
//   const lastName = document.getElementById('lastName').value.trim();
//   const bio = document.getElementById('userBio').value.trim(); 
//   const educationLevel = document.getElementById('educationLevel').value;
//   const signatureDrink = document.getElementById('signatureDrink').value; 

//   const fullName = `${firstName} ${lastName}`.trim();

//   const result = await updateUserProfile({
//     fullName: fullName,
//     bio: bio,
//     educationLevel: educationLevel,
//     signatureDrink: signatureDrink 
//   });

//   if (result.success) {
//     alert('تسلم ايدك، البيانات اتحدثت!');
//     userData.fullName = fullName;
//     userData.educationLevel = educationLevel;
//     userData.bio = bio; 
//     userData.signatureDrink = signatureDrink;
//     updateUI();
//   } else {
//     alert('مشكلة في الحفظ: ' + result.error);
//   }

//   btn.innerHTML = originalText;
//   btn.disabled = false;
// }

// async function handlePasswordChange() {
//   const oldPass = document.getElementById('oldPassword').value;
//   const newPass = document.getElementById('newPassword').value;
//   const msgDiv = document.getElementById('passwordMsg');
//   const btn = document.querySelector('#changePasswordForm button[type="submit"]');
  
//   if (newPass.length < 6) {
//     msgDiv.style.color = 'red';
//     msgDiv.textContent = 'الباسورد قصير أوي يا كابتن (على الأقل 6 حروف)';
//     return;
//   }

//   btn.disabled = true;
//   btn.textContent = 'جاري التشفير...';
//   msgDiv.style.color = 'var(--text-grey)';
//   msgDiv.textContent = 'لحظة واحدة...';

//   const result = await changeUserPassword(oldPass, newPass);

//   if (result.success) {
//     msgDiv.style.color = 'green';
//     msgDiv.textContent = 'تمام يا ريس! الباسورد اتغير بنجاح';
//     btn.textContent = 'تم!';
//     setTimeout(() => {
//       document.getElementById('passwordModal').style.display = 'none';
//       btn.disabled = false;
//       btn.textContent = 'غير يا باشا';
//     }, 2000);
//   } else {
//     msgDiv.style.color = 'red';
//     msgDiv.textContent = 'مشكلة: ' + result.error;
//     btn.disabled = false;
//     btn.textContent = 'غير يا باشا';
//   }
// }

// function setupDeleteAccount() {
//   const modal = document.getElementById('deleteModal');
//   const input = document.getElementById('deleteConfirm');
//   const confirmBtn = document.getElementById('confirmDelete');
//   const cancelBtn = document.getElementById('cancelDelete');
//   const closeBtn = modal.querySelector('.close');
  
//   if(!modal) return;

//   modal.style.display = 'flex';
//   input.value = '';
//   confirmBtn.disabled = true;
//   confirmBtn.style.opacity = '0.5';

//   input.oninput = (e) => {
//     if (e.target.value === 'امسح') {
//       confirmBtn.disabled = false;
//       confirmBtn.style.opacity = '1';
//       confirmBtn.style.cursor = 'pointer';
//     } else {
//       confirmBtn.disabled = true;
//       confirmBtn.style.opacity = '0.5';
//       confirmBtn.style.cursor = 'not-allowed';
//     }
//   };

//   confirmBtn.onclick = async () => {
//     confirmBtn.innerHTML = 'بيودع...';
//     const result = await deleteUserAccount();
//     if (result.success) {
//       window.location.href = 'index.html';
//     } else {
//       alert('مشكلة في المسح: ' + result.error);
//       confirmBtn.innerHTML = 'تأكيد المسح';
//     }
//   };

//   const closeModal = () => modal.style.display = 'none';
//   cancelBtn.onclick = closeModal;
//   if(closeBtn) closeBtn.onclick = closeModal;
// }




















import {
  auth,
  onAuthStateChanged,
  getUserData,
  updateUserProfile,
  deleteUserAccount,
  changeUserPassword
} from './auth-service.js';

// الصور الافتراضية
const profileImages = [
  "images/profile/1.jpg", "images/profile/2.jpg", "images/profile/3.jpg",
  "images/profile/4.jpg", "images/profile/5.jpg", "images/profile/6.jpg",
  "images/profile/7.jpg", "images/profile/8.jpg", "images/profile/9.jpg",
  "images/profile/10.jpg", "images/profile/11.jpg", "images/profile/12.jpg",
  "images/profile/13.jpg", "images/profile/14.jpg", "images/profile/15.jpg",
  "images/profile/16.jpg", "images/profile/17.jpg", "images/profile/18.jpg",
  "images/profile/19.jpg", "images/profile/20.jpg", "images/profile/21.jpg",
  "images/profile/22.jpg", "images/profile/23.jpg", "images/profile/24.jpg",
  "images/profile/25.jpg", "images/profile/26.png", "images/profile/27.jpg",
  "images/profile/28.jpg", "images/profile/29.jpg"
];

let currentUser = null;
let userData = {};
let selectedImage = '';
let isCustomLinkMode = false;

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
  const data = userData || {};
  
  if(document.getElementById('sidebarName')) 
    document.getElementById('sidebarName').textContent = data.fullName || 'الزبون';

  if(document.getElementById('sidebarEducation')) 
    document.getElementById('sidebarEducation').textContent = data.educationLevel || 'زبون جديد';

  const currentImg = data.profileImage || 'images/user.png';
  if(document.getElementById('sidebarImage')) 
    document.getElementById('sidebarImage').src = currentImg;

  const fullName = data.fullName || '';
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const bioInput = document.getElementById('userBio'); 
  const emailInput = document.getElementById('email');
  const eduInput = document.getElementById('educationLevel');
  const drinkInput = document.getElementById('signatureDrink');

  if(firstNameInput) firstNameInput.value = firstName;
  if(lastNameInput) lastNameInput.value = lastName;
  if(bioInput) bioInput.value = data.bio || 'أنا جديد في القهوة';
  if(emailInput) emailInput.value = currentUser.email || data.email || '';
  if(eduInput) eduInput.value = data.educationLevel || 'طالب';
  if(drinkInput) drinkInput.value = data.signatureDrink || '';
}

function setupEventListeners() {
  const infoForm = document.getElementById('personalInfoForm');
  if (infoForm) {
    infoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await savePersonalInfo();
    });
  }

  const triggerImgBtn = document.getElementById('triggerImageModal');
  if (triggerImgBtn) {
    triggerImgBtn.addEventListener('click', (e) => {
      e.preventDefault(); 
      window.openImageModal();
    });
  }

  const confirmImgBtn = document.getElementById('confirmImageSelect');
  if(confirmImgBtn) confirmImgBtn.addEventListener('click', saveNewProfileImage);

  const customUrlInput = document.getElementById('customImageUrl');
  if (customUrlInput) {
    customUrlInput.addEventListener('input', (e) => {
      window.handleCustomUrlInput(e.target.value);
    });
  }

  // زرار الـ Enter للبحث في بنترست
  document.getElementById('pinterestSearchInput')?.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      window.openPinterestSearch();
    }
  });

  // زرار الـ Enter للبحث الحر
  document.getElementById('freeSearchInput')?.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      window.filterFreeImages();
    }
  });

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

  const deleteBtn = document.getElementById('deleteAccountBtn');
  if (deleteBtn) deleteBtn.addEventListener('click', setupDeleteAccount);

  window.onclick = (e) => {
    const imgModal = document.getElementById('imageModal');
    const delModal = document.getElementById('deleteModal');
    const pwdModal = document.getElementById('passwordModal');
    
    if (e.target == imgModal) window.closeImageModal();
    if (e.target == delModal) delModal.style.display = 'none';
    if (e.target == pwdModal) pwdModal.style.display = 'none';
  };
}

// =========================================
// Image Modal Logic
// =========================================
window.openImageModal = function() {
  const modal = document.getElementById('imageModal');
  const grid = document.getElementById('imageGrid');
  if(!modal || !grid) return;

  window.switchImageTab('default'); 

  const currentImage = userData?.profileImage || 'images/user.png';
  selectedImage = currentImage;

  let html = profileImages.map(img => `
    <div class="image-option ${currentImage === img ? 'selected' : ''}" 
         onclick="window.handleImageSelect(this, '${img}')">
      <img src="${img}" onerror="this.src='images/user.png'">
    </div>
  `).join('');

  grid.innerHTML = html;
  modal.style.display = 'flex';
};

window.switchImageTab = function(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
  event?.currentTarget?.classList.add('active');
  document.getElementById(`tab-${tabName}`).style.display = 'block';

  if (tabName === 'link') {
    isCustomLinkMode = true; 
  } else {
    isCustomLinkMode = false;
  }

  // لو فتحنا تاب "مجموعتي"، نرسم الصور اللي متسيفة في الفايربيز
  if (tabName === 'collection') {
    window.renderCollection();
  }
};

window.renderCollection = function() {
  const grid = document.getElementById('collectionGrid');
  const emptyMsg = document.getElementById('emptyCollectionMsg');
  
  // بنجيب الصور من بيانات اليوزر، لو مفيش بنخليها مصفوفة فاضية
  const savedImages = userData?.customImages || [];

  if (savedImages.length === 0) {
    grid.style.display = 'none';
    emptyMsg.style.display = 'block';
  } else {
    grid.style.display = 'grid'; 
    emptyMsg.style.display = 'none';
    
    // رسم الكروت مع زرار الحذف
    grid.innerHTML = savedImages.map(imgSrc => `
      <div class="image-option ${selectedImage === imgSrc ? 'selected' : ''}" 
           onclick="window.handleImageSelect(this, '${imgSrc}')">
           
        <button class="delete-img-btn" onclick="window.removeImageFromCollection('${imgSrc}', event)" title="حذف الصورة">
            <i class="fa-solid fa-trash"></i>
        </button>
        
        <img src="${imgSrc}" onerror="this.src='images/user.png'">
      </div>
    `).join('');
  }
};

// دالة حذف الصورة من المجموعة
window.removeImageFromCollection = async function(imgSrc, event) {
  // السطر ده مهم جداً بيمنع الحدث إنه يسمع في الكارت الأساسي
  event.stopPropagation();

  if (!confirm('متأكد إنك عايز تمسح الصورة دي من مجموعتك؟')) return;

  // نفلتر الـ Array عشان نشيل الصورة اللي اليوزر اختارها
  const updatedCollection = (userData.customImages || []).filter(img => img !== imgSrc);

  // نبعت الـ Array الجديدة للفايربيز
  const result = await updateUserProfile({ customImages: updatedCollection });

  if (result.success) {
    // نحدث الداتا اللي في المتصفح
    userData.customImages = updatedCollection;

    // لو الصورة اللي اتمسحت كانت هي اللي متعلم عليها حالياً، نلغي التحديد
    if (selectedImage === imgSrc) {
      selectedImage = userData.profileImage || 'images/user.png';
    }

    // نرسم المجموعة من تاني عشان الصورة تختفي
    window.renderCollection();
  } else {
    alert('حصل مشكلة في الحذف: ' + result.error);
  }
};

window.closeImageModal = function() {
  const modal = document.getElementById('imageModal');
  if(modal) modal.style.display = 'none';
  setTimeout(() => {
    if(document.querySelector('.tab-btn')) {
      document.querySelector('.tab-btn').click();
    }
  }, 200);
};

window.handleImageSelect = function(el, imgSrc) {
  document.querySelectorAll('.image-option, .masonry-item').forEach(opt => opt.classList.remove('selected'));
  el.classList.add('selected');
  isCustomLinkMode = false;
  selectedImage = imgSrc;
};

/// =========================================
// Pinterest Search - Opens in New Tab
// =========================================

// Open Pinterest search in new tab
window.openPinterestSearch = function() {
  const searchInput = document.getElementById('pinterestSearchInput');
  const searchTerm = searchInput.value.trim();
  
  if (!searchTerm) {
    alert('اكتب حاجة عشان نبحث عنها! ☕');
    searchInput.focus();
    return;
  }
  
  const pinterestUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchTerm)}`;
  window.open(pinterestUrl, '_blank');
  
  // Show helpful message after 2 seconds
  setTimeout(() => {
    alert('💡 ازاي تاخد اللينك:\n\n1. دوس على الصورة عشان تكبر\n2. كليك يمين على الصورة\n3. اختار "Copy Image Address"\n4. الصق اللينك في خانة "لينك جوجل درايف"');
  }, 2000);
};

// Quick search from tags
window.quickPinterestSearch = function(term) {
  const searchInput = document.getElementById('pinterestSearchInput');
  searchInput.value = term;
  window.openPinterestSearch();
};

// =========================================
// Custom Link Logic (Google Drive + Pinterest)
// =========================================
window.handleCustomUrlInput = function(url) {
  const preview = document.getElementById('customImagePreview');
  const errorMsg = document.getElementById('imgPreviewError');
  
  if (!url) {
    preview.style.display = 'none';
    errorMsg.style.display = 'none';
    return;
  }
  
  let finalUrl = url;
  
  // Handle Pinterest URLs
  if (url.includes('pinterest.com') || url.includes('pin.it')) {
    if (url.includes('i.pinimg.com')) {
      // Convert to highest quality
      finalUrl = url.replace(/\/236x\//, '/originals/')
                    .replace(/\/564x\//, '/originals/')
                    .replace(/\/736x\//, '/originals/');
    } else {
      preview.style.display = 'none';
      errorMsg.style.display = 'block';
      errorMsg.textContent = '⚠️ لينك بنترست مش مباشر - افتح الصورة وانسخ اللينك المباشر';
      return;
    }
  }
  
  // Handle Google Drive URLs
  if (url.includes('drive.google.com')) {
    let fileId = null;
    const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const queryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) fileId = idMatch[1];
    else if (queryMatch && queryMatch[1]) fileId = queryMatch[1];
    
    if (fileId) finalUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }
  
  selectedImage = finalUrl;
  preview.style.display = 'inline-block';
  preview.style.border = '2px solid var(--border-color)';
  errorMsg.style.display = 'none';
  preview.src = finalUrl;
  
  preview.onerror = () => {
    preview.style.border = '2px solid red';
    errorMsg.style.display = 'block';
    errorMsg.textContent = 'الصورة مش بتحمل - اتأكد من اللينك';
  };
  preview.onload = () => {
    preview.style.border = '2px solid green';
    errorMsg.style.display = 'none';
    isCustomLinkMode = true; // Ensure this is true to trigger saving to collection
  };
};

// =========================================
// Save Profile Image
// =========================================
async function saveNewProfileImage() {
  const btn = document.getElementById('confirmImageSelect');
  const errorMsgGoogle = document.getElementById('imgPreviewError');
  const originalText = btn.innerHTML;
  
  if (isCustomLinkMode && errorMsgGoogle.style.display === 'block') {
    alert('الصورة مش شغالة! اتأكد من اللينك الأول.');
    return;
  }

  let imageToSave = selectedImage;

  if (!imageToSave) {
    alert("اختار صورة يا فنان!");
    return;
  }

  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
  btn.disabled = true;

  // تجهيز البيانات اللي هتتبعت للفايربيز
  let payload = { profileImage: imageToSave };

  // لو اليوزر بيسيف لينك جديد من تاب "درايف" أو "بنترست"
  if (isCustomLinkMode) {
    let currentCollection = userData.customImages || [];
    // نتأكد إن الصورة مش موجودة أصلاً عشان ميتعملش تكرار
    if (!currentCollection.includes(imageToSave)) {
      currentCollection.push(imageToSave);
      payload.customImages = currentCollection; // هنبعت المصفوفة الجديدة للفايربيز
    }
  }

  // updateUserProfile هتحفظ الصورة الجديدة والمصفوفة (لو اتحدثت) في نفس الوقت
  const result = await updateUserProfile(payload);

  if (result.success) {
    userData.profileImage = imageToSave;
    // تحديث المصفوفة محلياً عشان تظهر لو فتح التاب تاني
    if (payload.customImages) userData.customImages = payload.customImages; 
    
    updateUI(); 
    
    const navImg = document.querySelector('.user-avatar img');
    if(navImg) navImg.src = imageToSave;
    
    window.closeImageModal();
  } else {
    alert('حصل مشكلة: ' + result.error);
  }

  btn.innerHTML = originalText;
  btn.disabled = false;
}

// =========================================
// Personal Info & Security Logic
// =========================================
async function savePersonalInfo() {
  const btn = document.querySelector('#personalInfoForm button');
  const originalText = btn.innerHTML;
  
  btn.innerHTML = 'بيحفظ...';
  btn.disabled = true;
  
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const bio = document.getElementById('userBio').value.trim(); 
  const educationLevel = document.getElementById('educationLevel').value;
  const signatureDrink = document.getElementById('signatureDrink').value; 

  const fullName = `${firstName} ${lastName}`.trim();

  const result = await updateUserProfile({
    fullName: fullName,
    bio: bio,
    educationLevel: educationLevel,
    signatureDrink: signatureDrink 
  });

  if (result.success) {
    alert('تسلم ايدك، البيانات اتحدثت!');
    userData.fullName = fullName;
    userData.educationLevel = educationLevel;
    userData.bio = bio; 
    userData.signatureDrink = signatureDrink;
    updateUI();
  } else {
    alert('مشكلة في الحفظ: ' + result.error);
  }

  btn.innerHTML = originalText;
  btn.disabled = false;
}

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