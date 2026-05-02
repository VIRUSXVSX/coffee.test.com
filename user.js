// import { 
//     auth, 
//     onAuthStateChanged, 
//     getUserData, 
//     getUserPosts,
//     toggleLike,
//     addComment,
//     getComments,
//     getFriendshipStatus, 
//     sendFriendRequest,
//     removeFriend,
//     acceptFriendRequest,
//     getUserFriends
// } from './auth-service.js';

// let currentUser = null;
// let targetUserId = null;

// const REACTION_TYPES = {
//     like:    { icon: '👍', label: 'تسلم إيدك',      class: 'color-like' },
//     love:    { icon: '❤️', label: 'حبيبي يا هندسة', class: 'color-love' },
//     haha:    { icon: '😂', label: 'هموت',           class: 'color-haha' },
//     wow:     { icon: '😮', label: 'يا صلاة النبي',  class: 'color-wow' },
//     angry:   { icon: '😡', label: 'جرا إيه!',       class: 'color-angry' },
//     dislike: { icon: '👎', label: 'هبد',            class: 'color-dislike' }
// };

// // --- FIXED: DRINKS_MAP matching settings-account.html values ---
// const DRINKS_MAP = {
//     'tea': 'شاي في الخمسينة ☕',
//     'mint_tea': 'شاي بالنعناع 🌿',
//     'coffee': 'قهوة تركي ☕',
//     'french_coffee': 'قهوة فرنساوي 🥛',
//     'nescafe': 'نسكافية / كابتشينو 🥤',
//     'espresso': 'إسبريسو 🧉',
//     'anise': 'يانسون دافي 🌼',
//     'sahlab': 'سحلب بالمكسرات 🥥',
//     'lemon': 'ليمون بالنعناع 🍋',
//     'mango': 'عصير مانجا 🥭',
//     'cane': 'عصير قصب 🎋',
//     'shisha': 'شيشة تفاح 🍎',
//     'cola': 'حاجة ساقعة 🥤',
//     'water': 'مية ساقعة 💧'
// };

// document.addEventListener('DOMContentLoaded', () => {
//     injectStyles();
//     createReactorsModal();
//     createImagePreviewModalUser();

//     const urlParams = new URLSearchParams(window.location.search);
//     targetUserId = urlParams.get('uid');

//     if (!targetUserId) {
//         alert("رابط غير صحيح");
//         window.location.href = 'dashboard.html';
//         return;
//     }

//     onAuthStateChanged(auth, async (user) => {
//         if (user) {
//             currentUser = user;
//             if (currentUser.uid === targetUserId) {
//                 window.location.href = 'profile.html';
//                 return;
//             }
//             await loadTargetProfile();
//         } else {
//             window.location.href = 'login.html';
//         }
//     });
// });

// async function loadTargetProfile() {
//     // 1. Load User Info
//     const userRes = await getUserData(targetUserId);

    
//     if (userRes.success) {
//         const data = userRes.data;
//         // document.getElementById('visitUserName').textContent = data.fullName || 'زبون مجهول';
        
//         // let headerName = (data.fullName || 'الزبون').split(' ')[0]; 
//         // // --- FIXED: Signature Drink Logic ---
//         // if (data.signatureDrink && DRINKS_MAP[data.signatureDrink]) {
//         //      headerName += ` <span style="font-size: 0.8rem; background: #fff3cd; color: #856404; padding: 3px 10px; border-radius: 15px; vertical-align: middle;">${DRINKS_MAP[data.signatureDrink]}</span>`;
//         // }
//         // document.getElementById('headerName').innerHTML = headerName;
//         // 1. نظبط الاسم في الكارت اللي على اليمين ونحط تحته البادج
//         let nameHtml = data.fullName || 'زبون مجهول';
//         if (data.signatureDrink && DRINKS_MAP[data.signatureDrink]) {
//              // استخدمنا <br> عشان البادج ينزل تحت الاسم وشكله يكون مظبوط
//              nameHtml += `<br><span style="font-size: 0.8rem; background: #fff8e1; color: #f57f17; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-top: 8px; border: 1px solid #ffe082;">
//                 مشروبه: ${DRINKS_MAP[data.signatureDrink]}
//             </span>`;
//         }
//         document.getElementById('visitUserName').innerHTML = nameHtml;
        
//         // 2. نخلي العنوان اللي فوق (الصفحة الشخصية لـ) اسم بس من غير البادج
//         let headerName = (data.fullName || 'الزبون').split(' ')[0]; 
//         document.getElementById('headerName').textContent = headerName;
//         document.getElementById('visitUserEducation').textContent = data.educationLevel || 'زبون جديد';
//         document.getElementById('visitUserBio').textContent = data.bio || 'أنا جديد في القهوة';
//         const rankEl = document.getElementById('visitUserRank');
//         if (rankEl) rankEl.textContent = data.role || 'زبون';
//             // جوه دالة loadTargetProfile() هتلاقي السطرين دول:
// const imgEl = document.getElementById('visitProfileImage');
// imgEl.src = data.profileImage || 'images/user.png';

// // ضيف تحتهم الكود ده:
// imgEl.onerror = () => { imgEl.src = 'images/user.png'; };
// imgEl.style.cursor = 'pointer';
// imgEl.onclick = () => openImagePreviewUser(imgEl.src);
//         // const imgEl = document.getElementById('visitProfileImage');
//         // imgEl.src = data.profileImage || 'images/user.png';
//         // imgEl.onerror = () => { imgEl.src = 'images/user.png'; };

//         setupFriendButton();
//         loadFriendsList(); // Load friends for visited user

//     } else {
//         document.querySelector('main').innerHTML = `<div style="text-align:center; padding:3rem; color:red;"><h3>مش لاقيين الزبون ده!</h3></div>`;
//         return;
//     }

//     // 2. Load User Posts
//     const postsRes = await getUserPosts(targetUserId);
//     const postsContainer = document.getElementById('visitUserPostsList');
//     if (postsRes.success) {
//         const posts = postsRes.data;
//         let totalLikes = 0;
//         posts.forEach(p => {
//             let reactionCount = 0;
//             if(p.reactions) reactionCount = Object.keys(p.reactions).length;
//             else if(p.likes) reactionCount = p.likes.length;
//             totalLikes += reactionCount;
//         });

//         document.getElementById('visitTotalPosts').textContent = posts.length;
//         document.getElementById('visitTotalLikes').textContent = totalLikes;

//         if (posts.length === 0) {
//             postsContainer.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-grey);"><p>لسه منزلش أي مشاريب.</p></div>`;
//         } else {
//             postsContainer.innerHTML = posts.map(post => createPostHTML(post)).join('');
//             attachPostListeners();
//         }
//     }
// }

// async function setupFriendButton() {
//     const existingBtn = document.getElementById('friendActionContainer');
//     if (!existingBtn) {
//         // Create container if not exists (should be in HTML)
//         const bio = document.getElementById('visitUserBio');
//         const container = document.createElement('div');
//         container.id = 'friendActionContainer';
//         bio.insertAdjacentElement('afterend', container);
//     }
//     const container = document.getElementById('friendActionContainer');

//     const status = await getFriendshipStatus(targetUserId);
    
//     let btnHtml = '';
//     if (status === 'none') {
//         btnHtml = `<button id="btnAddFriend" class="btn-primary" style="width:100%; margin-top:1rem;"><i class="fa-solid fa-user-plus"></i> إضافة صديق</button>`;
//     } else if (status === 'pending_sent') {
//         btnHtml = `<button class="btn-outline" style="width:100%; margin-top:1rem; cursor:default; opacity:0.7;"><i class="fa-regular fa-clock"></i> تم إرسال الطلب</button>`;
//     } else if (status === 'pending_received') {
//         btnHtml = `<button id="btnAcceptFriend" class="btn-primary" style="width:100%; margin-top:1rem; background:green;"><i class="fa-solid fa-check"></i> اقبل الطلب</button>`;
// } else if (status === 'friends') {
//         btnHtml = `
//             <div style="margin-top:1rem; display:flex; flex-direction:column; gap:8px;">
//                 <button class="btn-outline" style="width:100%; color:green; border-color:green; cursor:default;"><i class="fa-solid fa-check"></i> أصدقاء</button>
                
//                 <button id="btnChat" class="btn-primary" style="width:100%; background: var(--primary-blue);">
//                     <i class="fa-regular fa-comments"></i> دردشة
//                 </button>

//                 <button id="btnUnfriend" class="btn-outline" style="width:100%; color:red; border-color:red; font-size:0.8rem;">
//                     <i class="fa-solid fa-user-minus"></i> مسح من الشلة
//                 </button>
//             </div>
//         `;
//     }
//     // } else if (status === 'friends') {
//     //     btnHtml = `
//     //         <div style="margin-top:1rem;">
//     //             <button class="btn-outline" style="width:100%; color:green; border-color:green; cursor:default; margin-bottom:5px;"><i class="fa-solid fa-check"></i> أصدقاء</button>
//     //             <button id="btnUnfriend" class="btn-outline" style="width:100%; color:red; border-color:red; font-size:0.8rem;"><i class="fa-solid fa-user-minus"></i> مسح من الشلة</button>
//     //         </div>
//     //     `;
//     // }

//     container.innerHTML = btnHtml;

//     // Listeners
//     const btnAdd = document.getElementById('btnAddFriend');
//     if (btnAdd) {
//         btnAdd.addEventListener('click', async () => {
//             btnAdd.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
//             await sendFriendRequest(targetUserId);
//             setupFriendButton();
//         });
//     }
// const btnChat = document.getElementById('btnChat');
//     if (btnChat) {
//         btnChat.addEventListener('click', () => {
//             // Go to chat page with this user's ID
//             window.location.href = `chat.html?uid=${targetUserId}`;
//         });
//     }
//     const btnAccept = document.getElementById('btnAcceptFriend');
//     if (btnAccept) {
//         btnAccept.addEventListener('click', async () => {
//             btnAccept.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
//             await acceptFriendRequest(targetUserId); // Fixed: Removed request ID arg as per previous update
//             setupFriendButton();
//             loadFriendsList();
//         });
//     }

//     const btnUnfriend = document.getElementById('btnUnfriend');
//     if (btnUnfriend) {
//         btnUnfriend.addEventListener('click', async () => {
//             if(confirm('متأكد عايز تمشيه من الشلة؟')) {
//                 btnUnfriend.innerHTML = '...';
//                 await removeFriend(targetUserId);
//                 setupFriendButton();
//                 loadFriendsList();
//             }
//         });
//     }
// }

// // // --- NEW: Load Friends List for Visited User ---
// // async function loadFriendsList() {
// //     const listEl = document.getElementById('visitUserFriendsList');
// //     if (!listEl) return;
    
// //     const result = await getUserFriends(targetUserId);
    
// //     if(result.success) {
// //         if(result.data.length === 0) {
// //             listEl.innerHTML = '<p style="color:var(--text-grey); font-size:0.9rem;">لسه معندوش شلة.</p>';
// //         } else {
// //             listEl.innerHTML = result.data.map(f => `
// //                 <div onclick="window.location.href='user.html?uid=${f.id}'" style="display:inline-flex; flex-direction:column; align-items:center; margin:5px; cursor:pointer; width:60px;">
// //                     <img src="${f.profileImage || f.photoURL || 'images/user.png'}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid var(--border-color);">
// //                     <span style="font-size:0.7rem; color:var(--text-dark); overflow:hidden; white-space:nowrap; text-overflow:ellipsis; width:100%; text-align:center;">
// //                         ${(f.fullName||'زبون').split(' ')[0]}
// //                     </span>
// //                 </div>
// //             `).join('');
// //         }
// //     } else {
// //         listEl.innerHTML = '<p style="color:red; font-size:0.8rem;">خطأ تحميل</p>';
// //     }
// // }

// // استبدل الدالة دي بالكامل في ملف user.js
// async function loadFriendsList() {
//     const listEl = document.getElementById('visitUserFriendsList');
//     if (!listEl) return;
    
//     const result = await getUserFriends(targetUserId);
    
//     if(result.success) {
//         // --- السطر ده هو اللي بيفلتر وبيشيلك إنت من الشلة ---
//         const filteredFriends = result.data.filter(f => f.id !== currentUser.uid);

//         if(filteredFriends.length === 0) {
//             listEl.innerHTML = '<p style="color:var(--text-grey); font-size:0.9rem;">لسه معندوش شلة (أو إنت بس اللي فيها).</p>';
//         } else {
//             const displayedFriends = filteredFriends.slice(0, 5);
//             let html = displayedFriends.map(f => `
//                 <div onclick="window.location.href='user.html?uid=${f.id}'" style="display:inline-flex; flex-direction:column; align-items:center; margin:5px; cursor:pointer; width:60px;">
//                     <img src="${f.profileImage || f.photoURL || 'images/user.png'}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid var(--border-color);">
//                     <span style="font-size:0.7rem; color:var(--text-dark); overflow:hidden; white-space:nowrap; text-overflow:ellipsis; width:100%; text-align:center;">
//                         ${(f.fullName||'زبون').split(' ')[0]}
//                     </span>
//                 </div>
//             `).join('');

//             if (filteredFriends.length > 0) {
//                 html += `
//                 <div onclick="window.location.href='user-friends.html?uid=${targetUserId}'" style="display:inline-flex; flex-direction:column; align-items:center; margin:5px; justify-content:center; cursor:pointer; width:60px;">
//                     <div style="width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.05); border:1px dashed var(--text-grey);">
//                         <i class="fa-solid fa-ellipsis" style="color:var(--text-grey);"></i>
//                     </div>
//                     <span style="font-size:0.7rem; color:var(--primary-blue); margin-top:3px; font-weight:bold;">الكل</span>
//                 </div>`;
//             }
//             listEl.innerHTML = html;
//         }
//     } else {
//         listEl.innerHTML = '<p style="color:red; font-size:0.8rem;">خطأ تحميل</p>';
//     }
// }

// // async function loadFriendsList() {
// //     const listEl = document.getElementById('visitUserFriendsList');
// //     if (!listEl) return;
    
// //     const result = await getUserFriends(targetUserId);
    
// //     if(result.success) {
// //         if(result.data.length === 0) {
// //             listEl.innerHTML = '<p style="color:var(--text-grey); font-size:0.9rem;">لسه معندوش شلة.</p>';
// //         } else {
// //             const displayedFriends = result.data.slice(0, 5);
// //             let html = displayedFriends.map(f => `
// //                 <div onclick="window.location.href='user.html?uid=${f.id}'" style="display:inline-flex; flex-direction:column; align-items:center; margin:5px; cursor:pointer; width:60px;">
// //                     <img src="${f.profileImage || f.photoURL || 'images/user.png'}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid var(--border-color);">
// //                     <span style="font-size:0.7rem; color:var(--text-dark); overflow:hidden; white-space:nowrap; text-overflow:ellipsis; width:100%; text-align:center;">
// //                         ${(f.fullName||'زبون').split(' ')[0]}
// //                     </span>
// //                 </div>
// //             `).join('');

// //             if (result.data.length > 0) {
// //                 html += `
// //                 <div onclick="window.location.href='user-friends.html?uid=${targetUserId}'" style="display:inline-flex; flex-direction:column; align-items:center; margin:5px; justify-content:center; cursor:pointer; width:60px;">
// //                     <div style="width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.05); border:1px dashed var(--text-grey);">
// //                         <i class="fa-solid fa-ellipsis" style="color:var(--text-grey);"></i>
// //                     </div>
// //                     <span style="font-size:0.7rem; color:var(--primary-blue); margin-top:3px; font-weight:bold;">الكل</span>
// //                 </div>`;
// //             }
// //             listEl.innerHTML = html;
// //         }
// //     } else {
// //         listEl.innerHTML = '<p style="color:red; font-size:0.8rem;">خطأ تحميل</p>';
// //     }
// // }
// function createPostHTML(post) {
//     let reactions = {};
//     if (Array.isArray(post.likes)) post.likes.forEach(uid => reactions[uid] = 'like');
//     if (post.reactions) Object.assign(reactions, post.reactions);
    
//     const reactionCount = Object.keys(reactions).length;
//     const uniqueIcons = [...new Set(Object.values(reactions).map(t => REACTION_TYPES[t]?.icon).filter(Boolean))].slice(0, 3);
    
//     let timeAgo = "دلوقتي";
//     if (post.timestamp) {
//         const seconds = (new Date() - post.timestamp.toDate()) / 1000;
//         if (seconds > 3600) timeAgo = `من ${Math.floor(seconds / 3600)} ساعة`;
//         else if (seconds > 60) timeAgo = `من ${Math.floor(seconds / 60)} دقيقة`;
//     }

//     return `
//         <div class="uni-card" id="post-${post.id}" style="border: 1px solid var(--border-color); padding: 0; margin-bottom: 1rem; border-radius: var(--radius); overflow:hidden;">
//             <div class="uni-content" style="padding: 1.5rem;">
//                 <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
//                     <div style="display: flex; gap: 10px; align-items: center;">
//                         <span style="color: var(--text-grey); font-size: 0.9rem;">${timeAgo}</span>
//                     </div>
//                 </div>
//                 <p style="white-space: pre-wrap; margin-bottom: 1rem;">${escapeHtml(post.content)}</p>
//             </div>
//             <div class="post-stats" style="padding: 10px 1.5rem;">
//                 <div class="stats-likes" onclick="showReactorsModal('${post.id}')" style="cursor: pointer;">
//                     ${reactionCount > 0 ? `<span class="stats-icons">${uniqueIcons.join('')}</span> <span class="stats-text">${reactionCount} تفاعل</span>` : `<span style="font-size:0.8rem;">كن أول واحد يعمل واجب</span>`}
//                 </div>
//                 <div class="stats-comments" onclick="toggleComments('${post.id}')" style="cursor: pointer;">
//                     ${post.commentsCount > 0 ? `${post.commentsCount} تلقيح` : ''}
//                 </div>
//             </div>
//             <div class="card-actions" style="padding: 10px 1.5rem;">
//                  <div class="compare-check reaction-main-btn" data-id="${post.id}" id="react-btn-${post.id}">
//                     <i class="fa-regular fa-thumbs-up"></i> <span>واجب</span>
//                 </div>
//                 <div class="compare-check comment-btn" data-id="${post.id}">
//                     <i class="fa-regular fa-comment"></i> <span>تلقيح</span>
//                 </div>
//             </div>
//              <div class="comments-section" id="comments-section-${post.id}" style="margin: 0 1rem 1rem 1rem; border-radius: 8px;">
//                 <div class="comment-list" id="comment-list-${post.id}"></div>
//                 <div class="comment-input-wrapper">
//                     <img src="${currentUser ? (currentUser.photoURL || 'images/user.png') : 'images/user.png'}" class="comment-avatar">
//                     <input type="text" class="comment-input" id="comment-input-${post.id}" placeholder="اكتب تعليق..." autocomplete="off">
//                     <button class="btn-send-comment" data-id="${post.id}"><i class="fa-solid fa-paper-plane"></i></button>
//                 </div>
//             </div>
//         </div>
//     `;
// }

// function attachPostListeners() {
//     document.querySelectorAll('.reaction-main-btn').forEach(btn => {
//         btn.addEventListener('click', async function() {
//             const postId = this.dataset.id;
//             // Simple toggle like logic for brevity
//             await toggleLike(postId, 'like');
//             // Optimistic update omitted for brevity, reload recommended
//         });
//     });

//     document.querySelectorAll('.comment-btn').forEach(btn => {
//         btn.addEventListener('click', function() { toggleComments(this.dataset.id); });
//     });

//     document.querySelectorAll('.btn-send-comment').forEach(btn => {
//         btn.addEventListener('click', function() { submitComment(this.dataset.id); });
//     });
    
//     document.querySelectorAll('.comment-input').forEach(input => {
//         input.addEventListener('keypress', function(e) {
//             if (e.key === 'Enter') submitComment(this.id.split('comment-input-')[1]);
//         });
//     });
// }

// // Helpers
// window.toggleComments = function(postId) {
//     const section = document.getElementById(`comments-section-${postId}`);
//     section.classList.toggle('show');
//     if(section.classList.contains('show')) fetchAndRenderComments(postId);
// };

// window.showReactorsModal = async function(postId) {
//     const modal = document.getElementById('reactorsModal');
//     modal.style.display = 'flex';
//     document.getElementById('reactorsList').innerHTML = 'تحميل...';
//     // Simplified logic
//     document.getElementById('reactorsList').innerHTML = 'قائمة المتفاعلين...';
// };

// async function fetchAndRenderComments(postId) {
//     const list = document.getElementById(`comment-list-${postId}`);
//     const res = await getComments(postId);
//     if(res.success) {
//         list.innerHTML = res.data.map(c => `
//             <div class="comment-item">
//                 <img src="${c.authorImage}" class="comment-avatar">
//                 <div class="comment-bubble">
//                     <div class="comment-author">${c.authorName}</div>
//                     <div class="comment-text">${escapeHtml(c.content)}</div>
//                 </div>
//             </div>
//         `).join('');
//     }
// }

// async function submitComment(postId) {
//     const input = document.getElementById(`comment-input-${postId}`);
//     const content = input.value.trim();
//     if(!content) return;
//     input.value = '';
//     await addComment(postId, content);
//     fetchAndRenderComments(postId);
// }

// function escapeHtml(text) { if (!text) return ""; return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
// function injectStyles() {
//     const style = document.createElement('style');
//     style.innerHTML = `
//         .post-stats { border-bottom: 1px solid var(--border-color); font-size: 0.9rem; color: var(--text-grey); }
//         .custom-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; }
//         .custom-modal-content { background: var(--bg-card); width: 90%; max-width: 400px; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; max-height: 80vh; }
//         .custom-modal-header { padding: 15px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; font-weight: bold; color: var(--primary-blue); }
//         .custom-modal-body { padding: 15px; overflow-y: auto; }
//         .friends-grid { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
//     `;
//     document.head.appendChild(style);
// }
// function createReactorsModal() {
//     if (document.getElementById('reactorsModal')) return;
//     const div = document.createElement('div');
//     div.id = 'reactorsModal';
//     div.className = 'custom-modal';
//     div.innerHTML = `<div class="custom-modal-content"><div class="custom-modal-header"><span>التفاعل</span><span onclick="this.parentElement.parentElement.parentElement.style.display='none'" style="cursor:pointer">&times;</span></div><div class="custom-modal-body" id="reactorsList"></div></div>`;
//     document.body.appendChild(div);
// }


// function createImagePreviewModalUser() {
//     if (document.getElementById('imgPreviewModalUser')) return;
//     const modal = document.createElement('div');
//     modal.id = 'imgPreviewModalUser';
//     modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:99999; justify-content:center; align-items:center; cursor:pointer; backdrop-filter:blur(5px); animation: fadeIn 0.2s;';
//     modal.innerHTML = `
//         <span style="position:absolute; top:20px; right:30px; color:white; font-size:40px; font-weight:bold; cursor:pointer; z-index:100000;">&times;</span>
//         <img id="previewModalImgUser" style="max-width:90%; max-height:90%; object-fit:contain; border-radius:10px; box-shadow:0 5px 15px rgba(0,0,0,0.5);">
//     `;
//     modal.onclick = () => modal.style.display = 'none';
//     document.body.appendChild(modal);
// }

// window.openImagePreviewUser = function(src) {
//     const modal = document.getElementById('imgPreviewModalUser');
//     document.getElementById('previewModalImgUser').src = src;
//     modal.style.display = 'flex';
// };
























// new

import { 
    auth, 
    onAuthStateChanged, 
    getUserData, 
    getUserPosts,
    toggleLike,
    addComment,
    getComments,
    getFriendshipStatus, 
    sendFriendRequest,
    removeFriend,
    acceptFriendRequest,
    getUserFriends
} from './auth-service.js';

let currentUser = null;
let targetUserId = null;

const REACTION_TYPES = {
    like:    { icon: '👍', label: 'تسلم إيدك',      class: 'color-like' },
    love:    { icon: '❤️', label: 'حبيبي يا هندسة', class: 'color-love' },
    haha:    { icon: '😂', label: 'هموت',           class: 'color-haha' },
    wow:     { icon: '😮', label: 'يا صلاة النبي',  class: 'color-wow' },
    angry:   { icon: '😡', label: 'جرا إيه!',       class: 'color-angry' },
    dislike: { icon: '👎', label: 'هبد',            class: 'color-dislike' }
};

// --- FIXED: DRINKS_MAP matching settings-account.html values ---
const DRINKS_MAP = {
    'tea': 'شاي في الخمسينة ☕',
    'mint_tea': 'شاي بالنعناع 🌿',
    'coffee': 'قهوة تركي ☕',
    'french_coffee': 'قهوة فرنساوي 🥛',
    'nescafe': 'نسكافية / كابتشينو 🥤',
    'espresso': 'إسبريسو 🧉',
    'anise': 'يانسون دافي 🌼',
    'sahlab': 'سحلب بالمكسرات 🥥',
    'lemon': 'ليمون بالنعناع 🍋',
    'mango': 'عصير مانجا 🥭',
    'cane': 'عصير قصب 🎋',
    'shisha': 'شيشة تفاح 🍎',
    'cola': 'حاجة ساقعة 🥤',
    'water': 'مية ساقعة 💧'
};

document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    createReactorsModal();
    createImagePreviewModalUser();

    const urlParams = new URLSearchParams(window.location.search);
    targetUserId = urlParams.get('uid');

    if (!targetUserId) {
        alert("رابط غير صحيح");
        window.location.href = 'dashboard.html';
        return;
    }

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            if (currentUser.uid === targetUserId) {
                window.location.href = 'profile.html';
                return;
            }
            await loadTargetProfile();
        } else {
            window.location.href = 'login.html';
        }
    });
});

async function loadTargetProfile() {
    // 1. Load User Info
    const userRes = await getUserData(targetUserId);

    
    if (userRes.success) {
        const data = userRes.data;
        // document.getElementById('visitUserName').textContent = data.fullName || 'زبون مجهول';
        
        // let headerName = (data.fullName || 'الزبون').split(' ')[0]; 
        // // --- FIXED: Signature Drink Logic ---
        // if (data.signatureDrink && DRINKS_MAP[data.signatureDrink]) {
        //      headerName += ` <span style="font-size: 0.8rem; background: #fff3cd; color: #856404; padding: 3px 10px; border-radius: 15px; vertical-align: middle;">${DRINKS_MAP[data.signatureDrink]}</span>`;
        // }
        // document.getElementById('headerName').innerHTML = headerName;
        // 1. نظبط الاسم في الكارت اللي على اليمين ونحط تحته البادج
        let nameHtml = data.fullName || 'زبون مجهول';
        if (data.signatureDrink && DRINKS_MAP[data.signatureDrink]) {
             // استخدمنا <br> عشان البادج ينزل تحت الاسم وشكله يكون مظبوط
             nameHtml += `<br><span style="font-size: 0.8rem; background: #fff8e1; color: #f57f17; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-top: 8px; border: 1px solid #ffe082;">
                مشروبه: ${DRINKS_MAP[data.signatureDrink]}
            </span>`;
        }
        document.getElementById('visitUserName').innerHTML = nameHtml;
        
        // 2. نخلي العنوان اللي فوق (الصفحة الشخصية لـ) اسم بس من غير البادج
        let headerName = (data.fullName || 'الزبون').split(' ')[0]; 
        document.getElementById('headerName').textContent = headerName;
        document.getElementById('visitUserEducation').textContent = data.educationLevel || 'زبون جديد';
        // document.getElementById('visitUserBio').textContent = data.bio || 'أنا جديد في القهوة';
        // document.getElementById('visitUserBio').textContent = data.bio || 'أنا جديد في القهوة';
        const visitBioEl = document.getElementById('visitUserBio');
        if (visitBioEl) {
            const safeBio = escapeHtml(data.bio || 'أنا جديد في القهوة');
            visitBioEl.innerHTML = window.linkifyText ? window.linkifyText(safeBio) : safeBio;
        }
        const rankEl = document.getElementById('visitUserRank');
        if (rankEl) rankEl.textContent = data.role || 'زبون';
            // جوه دالة loadTargetProfile() هتلاقي السطرين دول:
const imgEl = document.getElementById('visitProfileImage');
imgEl.src = data.profileImage || 'images/user.png';

// ضيف تحتهم الكود ده:
imgEl.onerror = () => { imgEl.src = 'images/user.png'; };
imgEl.style.cursor = 'pointer';
imgEl.onclick = () => openImagePreviewUser(imgEl.src);
        // const imgEl = document.getElementById('visitProfileImage');
        // imgEl.src = data.profileImage || 'images/user.png';
        // imgEl.onerror = () => { imgEl.src = 'images/user.png'; };

        setupFriendButton();
        loadFriendsList(); // Load friends for visited user

    } else {
        document.querySelector('main').innerHTML = `<div style="text-align:center; padding:3rem; color:red;"><h3>مش لاقيين الزبون ده!</h3></div>`;
        return;
    }

    // 2. Load User Posts
    const postsRes = await getUserPosts(targetUserId);
    const postsContainer = document.getElementById('visitUserPostsList');
    if (postsRes.success) {
        const posts = postsRes.data;
        let totalLikes = 0;
        posts.forEach(p => {
            let reactionCount = 0;
            if(p.reactions) reactionCount = Object.keys(p.reactions).length;
            else if(p.likes) reactionCount = p.likes.length;
            totalLikes += reactionCount;
        });

        document.getElementById('visitTotalPosts').textContent = posts.length;
        document.getElementById('visitTotalLikes').textContent = totalLikes;

        if (posts.length === 0) {
            postsContainer.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-grey);"><p>لسه منزلش أي مشاريب.</p></div>`;
        } else {
            postsContainer.innerHTML = posts.map(post => createPostHTML(post)).join('');
            attachPostListeners();
            // 🚀 السطر السحري: تشغيل معاينة اللينكات في صفحة الزبون اللي بتزوره
            if (window.processLinkPreviews) {
                window.processLinkPreviews();
            }
        }
    }
}

async function setupFriendButton() {
    const existingBtn = document.getElementById('friendActionContainer');
    if (!existingBtn) {
        // Create container if not exists (should be in HTML)
        const bio = document.getElementById('visitUserBio');
        const container = document.createElement('div');
        container.id = 'friendActionContainer';
        bio.insertAdjacentElement('afterend', container);
    }
    const container = document.getElementById('friendActionContainer');

    const status = await getFriendshipStatus(targetUserId);
    
    let btnHtml = '';
    if (status === 'none') {
        btnHtml = `<button id="btnAddFriend" class="btn-primary" style="width:100%; margin-top:1rem;"><i class="fa-solid fa-user-plus"></i> إضافة صديق</button>`;
    } else if (status === 'pending_sent') {
        btnHtml = `<button class="btn-outline" style="width:100%; margin-top:1rem; cursor:default; opacity:0.7;"><i class="fa-regular fa-clock"></i> تم إرسال الطلب</button>`;
    } else if (status === 'pending_received') {
        btnHtml = `<button id="btnAcceptFriend" class="btn-primary" style="width:100%; margin-top:1rem; background:green;"><i class="fa-solid fa-check"></i> اقبل الطلب</button>`;
} else if (status === 'friends') {
        btnHtml = `
            <div style="margin-top:1rem; display:flex; flex-direction:column; gap:8px;">
                <button class="btn-outline" style="width:100%; color:green; border-color:green; cursor:default;"><i class="fa-solid fa-check"></i> أصدقاء</button>
                
                <button id="btnChat" class="btn-primary" style="width:100%; background: var(--primary-blue);">
                    <i class="fa-regular fa-comments"></i> دردشة
                </button>

                <button id="btnUnfriend" class="btn-outline" style="width:100%; color:red; border-color:red; font-size:0.8rem;">
                    <i class="fa-solid fa-user-minus"></i> مسح من الشلة
                </button>
            </div>
        `;
    }
    // } else if (status === 'friends') {
    //     btnHtml = `
    //         <div style="margin-top:1rem;">
    //             <button class="btn-outline" style="width:100%; color:green; border-color:green; cursor:default; margin-bottom:5px;"><i class="fa-solid fa-check"></i> أصدقاء</button>
    //             <button id="btnUnfriend" class="btn-outline" style="width:100%; color:red; border-color:red; font-size:0.8rem;"><i class="fa-solid fa-user-minus"></i> مسح من الشلة</button>
    //         </div>
    //     `;
    // }

    container.innerHTML = btnHtml;

    // Listeners
    const btnAdd = document.getElementById('btnAddFriend');
    if (btnAdd) {
        btnAdd.addEventListener('click', async () => {
            btnAdd.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            await sendFriendRequest(targetUserId);
            setupFriendButton();
        });
    }
const btnChat = document.getElementById('btnChat');
    if (btnChat) {
        btnChat.addEventListener('click', () => {
            // Go to chat page with this user's ID
            window.location.href = `chat.html?uid=${targetUserId}`;
        });
    }
    const btnAccept = document.getElementById('btnAcceptFriend');
    if (btnAccept) {
        btnAccept.addEventListener('click', async () => {
            btnAccept.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            await acceptFriendRequest(targetUserId); // Fixed: Removed request ID arg as per previous update
            setupFriendButton();
            loadFriendsList();
        });
    }

    const btnUnfriend = document.getElementById('btnUnfriend');
    if (btnUnfriend) {
        btnUnfriend.addEventListener('click', async () => {
            if(confirm('متأكد عايز تمشيه من الشلة؟')) {
                btnUnfriend.innerHTML = '...';
                await removeFriend(targetUserId);
                setupFriendButton();
                loadFriendsList();
            }
        });
    }
}

// // --- NEW: Load Friends List for Visited User ---
// async function loadFriendsList() {
//     const listEl = document.getElementById('visitUserFriendsList');
//     if (!listEl) return;
    
//     const result = await getUserFriends(targetUserId);
    
//     if(result.success) {
//         if(result.data.length === 0) {
//             listEl.innerHTML = '<p style="color:var(--text-grey); font-size:0.9rem;">لسه معندوش شلة.</p>';
//         } else {
//             listEl.innerHTML = result.data.map(f => `
//                 <div onclick="window.location.href='user.html?uid=${f.id}'" style="display:inline-flex; flex-direction:column; align-items:center; margin:5px; cursor:pointer; width:60px;">
//                     <img src="${f.profileImage || f.photoURL || 'images/user.png'}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid var(--border-color);">
//                     <span style="font-size:0.7rem; color:var(--text-dark); overflow:hidden; white-space:nowrap; text-overflow:ellipsis; width:100%; text-align:center;">
//                         ${(f.fullName||'زبون').split(' ')[0]}
//                     </span>
//                 </div>
//             `).join('');
//         }
//     } else {
//         listEl.innerHTML = '<p style="color:red; font-size:0.8rem;">خطأ تحميل</p>';
//     }
// }

// استبدل الدالة دي بالكامل في ملف user.js
async function loadFriendsList() {
    const listEl = document.getElementById('visitUserFriendsList');
    if (!listEl) return;
    
    const result = await getUserFriends(targetUserId);
    
    if(result.success) {
        // --- السطر ده هو اللي بيفلتر وبيشيلك إنت من الشلة ---
        const filteredFriends = result.data.filter(f => f.id !== currentUser.uid);

        if(filteredFriends.length === 0) {
            listEl.innerHTML = '<p style="color:var(--text-grey); font-size:0.9rem;">لسه معندوش شلة (أو إنت بس اللي فيها).</p>';
        } else {
            const displayedFriends = filteredFriends.slice(0, 5);
            let html = displayedFriends.map(f => `
                <div onclick="window.location.href='user.html?uid=${f.id}'" style="display:inline-flex; flex-direction:column; align-items:center; margin:5px; cursor:pointer; width:60px;">
                    <img src="${f.profileImage || f.photoURL || 'images/user.png'}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid var(--border-color);">
                    <span style="font-size:0.7rem; color:var(--text-dark); overflow:hidden; white-space:nowrap; text-overflow:ellipsis; width:100%; text-align:center;">
                        ${(f.fullName||'زبون').split(' ')[0]}
                    </span>
                </div>
            `).join('');

            if (filteredFriends.length > 0) {
                html += `
                <div onclick="window.location.href='user-friends.html?uid=${targetUserId}'" style="display:inline-flex; flex-direction:column; align-items:center; margin:5px; justify-content:center; cursor:pointer; width:60px;">
                    <div style="width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.05); border:1px dashed var(--text-grey);">
                        <i class="fa-solid fa-ellipsis" style="color:var(--text-grey);"></i>
                    </div>
                    <span style="font-size:0.7rem; color:var(--primary-blue); margin-top:3px; font-weight:bold;">الكل</span>
                </div>`;
            }
            listEl.innerHTML = html;
        }
    } else {
        listEl.innerHTML = '<p style="color:red; font-size:0.8rem;">خطأ تحميل</p>';
    }
}

// async function loadFriendsList() {
//     const listEl = document.getElementById('visitUserFriendsList');
//     if (!listEl) return;
    
//     const result = await getUserFriends(targetUserId);
    
//     if(result.success) {
//         if(result.data.length === 0) {
//             listEl.innerHTML = '<p style="color:var(--text-grey); font-size:0.9rem;">لسه معندوش شلة.</p>';
//         } else {
//             const displayedFriends = result.data.slice(0, 5);
//             let html = displayedFriends.map(f => `
//                 <div onclick="window.location.href='user.html?uid=${f.id}'" style="display:inline-flex; flex-direction:column; align-items:center; margin:5px; cursor:pointer; width:60px;">
//                     <img src="${f.profileImage || f.photoURL || 'images/user.png'}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid var(--border-color);">
//                     <span style="font-size:0.7rem; color:var(--text-dark); overflow:hidden; white-space:nowrap; text-overflow:ellipsis; width:100%; text-align:center;">
//                         ${(f.fullName||'زبون').split(' ')[0]}
//                     </span>
//                 </div>
//             `).join('');

//             if (result.data.length > 0) {
//                 html += `
//                 <div onclick="window.location.href='user-friends.html?uid=${targetUserId}'" style="display:inline-flex; flex-direction:column; align-items:center; margin:5px; justify-content:center; cursor:pointer; width:60px;">
//                     <div style="width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.05); border:1px dashed var(--text-grey);">
//                         <i class="fa-solid fa-ellipsis" style="color:var(--text-grey);"></i>
//                     </div>
//                     <span style="font-size:0.7rem; color:var(--primary-blue); margin-top:3px; font-weight:bold;">الكل</span>
//                 </div>`;
//             }
//             listEl.innerHTML = html;
//         }
//     } else {
//         listEl.innerHTML = '<p style="color:red; font-size:0.8rem;">خطأ تحميل</p>';
//     }
// }
// function createPostHTML(post) {
//     let reactions = {};
//     if (Array.isArray(post.likes)) post.likes.forEach(uid => reactions[uid] = 'like');
//     if (post.reactions) Object.assign(reactions, post.reactions);
    
//     const reactionCount = Object.keys(reactions).length;
//     const uniqueIcons = [...new Set(Object.values(reactions).map(t => REACTION_TYPES[t]?.icon).filter(Boolean))].slice(0, 3);
    
//     let timeAgo = "دلوقتي";
//     if (post.timestamp) {
//         const seconds = (new Date() - post.timestamp.toDate()) / 1000;
//         if (seconds > 3600) timeAgo = `من ${Math.floor(seconds / 3600)} ساعة`;
//         else if (seconds > 60) timeAgo = `من ${Math.floor(seconds / 60)} دقيقة`;
//     }

//     return `
//         <div class="uni-card" id="post-${post.id}" style="border: 1px solid var(--border-color); padding: 0; margin-bottom: 1rem; border-radius: var(--radius); overflow:hidden;">
//             <div class="uni-content" style="padding: 1.5rem;">
//                 <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
//                     <div style="display: flex; gap: 10px; align-items: center;">
//                         <span style="color: var(--text-grey); font-size: 0.9rem;">${timeAgo}</span>
//                     </div>
//                 </div>
//                 <p style="white-space: pre-wrap; margin-bottom: 1rem;">${escapeHtml(post.content)}</p>
//             </div>
//             <div class="post-stats" style="padding: 10px 1.5rem;">
//                 <div class="stats-likes" onclick="showReactorsModal('${post.id}')" style="cursor: pointer;">
//                     ${reactionCount > 0 ? `<span class="stats-icons">${uniqueIcons.join('')}</span> <span class="stats-text">${reactionCount} تفاعل</span>` : `<span style="font-size:0.8rem;">كن أول واحد يعمل واجب</span>`}
//                 </div>
//                 <div class="stats-comments" onclick="toggleComments('${post.id}')" style="cursor: pointer;">
//                     ${post.commentsCount > 0 ? `${post.commentsCount} تلقيح` : ''}
//                 </div>
//             </div>
//             <div class="card-actions" style="padding: 10px 1.5rem;">
//                  <div class="compare-check reaction-main-btn" data-id="${post.id}" id="react-btn-${post.id}">
//                     <i class="fa-regular fa-thumbs-up"></i> <span>واجب</span>
//                 </div>
//                 <div class="compare-check comment-btn" data-id="${post.id}">
//                     <i class="fa-regular fa-comment"></i> <span>تلقيح</span>
//                 </div>
//             </div>
//              <div class="comments-section" id="comments-section-${post.id}" style="margin: 0 1rem 1rem 1rem; border-radius: 8px;">
//                 <div class="comment-list" id="comment-list-${post.id}"></div>
//                 <div class="comment-input-wrapper">
//                     <img src="${currentUser ? (currentUser.photoURL || 'images/user.png') : 'images/user.png'}" class="comment-avatar">
//                     <input type="text" class="comment-input" id="comment-input-${post.id}" placeholder="اكتب تعليق..." autocomplete="off">
//                     <button class="btn-send-comment" data-id="${post.id}"><i class="fa-solid fa-paper-plane"></i></button>
//                 </div>
//             </div>
//         </div>
//     `;
// }
function createPostHTML(post) {
    // 1. تجميع كل التفاعلات (اللايكات القديمة والـ Reactions الجديدة)
    let reactions = {};
    if (Array.isArray(post.likes)) post.likes.forEach(uid => reactions[uid] = 'like');
    if (post.reactions) Object.assign(reactions, post.reactions);
    
    // 2. حساب العدد والأيقونات
    const reactionCount = Object.keys(reactions).length;
    const uniqueIcons = [...new Set(Object.values(reactions).map(t => REACTION_TYPES[t]?.icon).filter(Boolean))].slice(0, 3);
    
    // 3. معرفة لو أنا (المستخدم الحالي) عامل تفاعل ونوعه إيه
    let userReactionType = null;
    if (currentUser && reactions[currentUser.uid]) {
        userReactionType = reactions[currentUser.uid];
    }

    // 4. تجهيز شكل الزرار بناءً على التفاعل
    let activeClass = '';
    let btnContent = '';
    if (userReactionType && REACTION_TYPES[userReactionType]) {
        const r = REACTION_TYPES[userReactionType];
        activeClass = `active ${r.class}`; 
        btnContent = `<span style="font-size:1.2rem">${r.icon}</span> <span class="reacted-text">${r.label}</span>`;
    } else {
        btnContent = `<i class="fa-regular fa-thumbs-up"></i> <span>واجب</span>`;
    }

    // let timeAgo = "دلوقتي";
    // if (post.timestamp) {
    //     const seconds = (new Date() - post.timestamp.toDate()) / 1000;
    //     if (seconds > 3600) timeAgo = `من ${Math.floor(seconds / 3600)} ساعة`;
    //     else if (seconds > 60) timeAgo = `من ${Math.floor(seconds / 60)} دقيقة`;
    // }
    

    // return `
    //     <div class="uni-card" id="post-${post.id}">
    //         <div class="uni-content" style="padding: 1.5rem;">
    //             <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
    //                 <span style="color: var(--text-grey); font-size: 0.9rem;">${timeAgo}</span>
    //             </div>
    //             <p class="description">${escapeHtml(post.content)}</p>
    //         </div>
// --- NEW TIME FORMAT ---
    let timeString = "منذ فترة";
    if (post.timestamp) {
        const date = post.timestamp.toDate();
        timeString = date.toLocaleDateString('ar-EG', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: 'numeric'
        });
    }

    return `
        <div class="uni-card" id="post-${post.id}">
            <div class="uni-content" style="padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--text-grey); font-size: 0.75rem;">${timeString}</span>
                </div>
            <div class="post-stats" style="padding: 10px 1.5rem;">
                <div class="stats-likes" onclick="showReactorsModal('${post.id}')" style="cursor: pointer;">
                    ${reactionCount > 0 ? `<span class="stats-icons">${uniqueIcons.join('')}</span> <span class="stats-text">${reactionCount} تفاعل</span>` : `<span style="font-size:0.8rem; opacity:0.7">كن أول واحد يعمل واجب</span>`}
                </div>
                <div class="stats-comments" onclick="toggleComments('${post.id}')" style="cursor: pointer;">
                    ${post.commentsCount > 0 ? `${post.commentsCount} تلقيح` : ''}
                </div>
            </div>

            <div class="card-actions" style="padding: 10px 1.5rem;">
                <div class="reaction-wrapper">
                    <div class="reaction-picker">
                        <div class="reaction-emoji" data-type="like" data-post-id="${post.id}" data-label="تسلم إيدك">👍</div>
                        <div class="reaction-emoji" data-type="love" data-post-id="${post.id}" data-label="حبيبي يا هندسة">❤️</div>
                        <div class="reaction-emoji" data-type="haha" data-post-id="${post.id}" data-label="هموت">😂</div>
                        <div class="reaction-emoji" data-type="wow" data-post-id="${post.id}" data-label="يا صلاة النبي">😮</div>
                        <div class="reaction-emoji" data-type="angry" data-post-id="${post.id}" data-label="جرا إيه!">😡</div>
                        <div class="reaction-emoji" data-type="dislike" data-post-id="${post.id}" data-label="هبد">👎</div>
                    </div>
                    <div class="compare-check reaction-main-btn ${activeClass}" id="react-btn-${post.id}" data-id="${post.id}">
                        ${btnContent}
                    </div>
                </div>

                <div class="compare-check comment-btn" data-id="${post.id}">
                    <i class="fa-regular fa-comment"></i> <span>تلقيح</span>
                </div>
            </div>

            <div class="comments-section" id="comments-section-${post.id}">
                <div class="comment-list" id="comment-list-${post.id}"></div>
                <div class="comment-input-wrapper">
                    <img src="${currentUser ? (currentUser.photoURL || 'images/user.png') : 'images/user.png'}" class="comment-avatar">
                    <input type="text" class="comment-input" id="comment-input-${post.id}" placeholder="رد عليه يا زميلي..." autocomplete="off">
                    <button class="btn-send-comment" data-id="${post.id}"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;
}

function attachPostListeners() {
    // 1. الضغط على إيموجي معين من القائمة
    document.querySelectorAll('.reaction-emoji').forEach(emoji => {
        emoji.addEventListener('click', async function(e) {
            e.stopPropagation();
            const postId = this.dataset.postId;
            const type = this.dataset.type;
            updateReactionUI(postId, type); // تحديث الشكل فوراً
            await toggleLike(postId, type); // الإرسال للفايربيز
        });
    });
function updateReactionUI(postId, type) {
    const btn = document.getElementById(`react-btn-${postId}`);
    if(!btn) return;
    const r = REACTION_TYPES[type];
    // إضافة الكلاسات والألوان
    btn.className = 'compare-check reaction-main-btn active';
    btn.classList.add(r.class); 
    btn.innerHTML = `<span style="font-size:1.2rem">${r.icon}</span> <span class="reacted-text">${r.label}</span>`;
}

    // 2. الضغط على الزرار الرئيسي (واجب)
    document.querySelectorAll('.reaction-main-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const postId = this.dataset.id;
            if (this.classList.contains('active')) {
                // لو عامل تفاعل، يشيله
                this.className = 'compare-check reaction-main-btn'; 
                this.innerHTML = `<i class="fa-regular fa-thumbs-up"></i> <span>واجب</span>`;
                await toggleLike(postId); 
            } else {
                // لو مش عامل، يعمل "تسلم إيدك" افتراضي
                updateReactionUI(postId, 'like');
                await toggleLike(postId, 'like');
            }
        });
    });

    // ... (باقي مستمعات الكومنتات زي ما هي) ...
    document.querySelectorAll('.comment-btn').forEach(btn => {
        btn.addEventListener('click', function() { toggleComments(this.dataset.id); });
    });
    document.querySelectorAll('.btn-send-comment').forEach(btn => {
        btn.addEventListener('click', function() { submitComment(this.dataset.id); });
    });
}
// function attachPostListeners() {
//     document.querySelectorAll('.reaction-main-btn').forEach(btn => {
//         btn.addEventListener('click', async function() {
//             const postId = this.dataset.id;
//             // Simple toggle like logic for brevity
//             await toggleLike(postId, 'like');
//             // Optimistic update omitted for brevity, reload recommended
//         });
//     });

//     document.querySelectorAll('.comment-btn').forEach(btn => {
//         btn.addEventListener('click', function() { toggleComments(this.dataset.id); });
//     });

//     document.querySelectorAll('.btn-send-comment').forEach(btn => {
//         btn.addEventListener('click', function() { submitComment(this.dataset.id); });
//     });
    
//     document.querySelectorAll('.comment-input').forEach(input => {
//         input.addEventListener('keypress', function(e) {
//             if (e.key === 'Enter') submitComment(this.id.split('comment-input-')[1]);
//         });
//     });
// }

// Helpers
window.toggleComments = function(postId) {
    const section = document.getElementById(`comments-section-${postId}`);
    section.classList.toggle('show');
    if(section.classList.contains('show')) fetchAndRenderComments(postId);
};

window.showReactorsModal = async function(postId) {
    const modal = document.getElementById('reactorsModal');
    modal.style.display = 'flex';
    document.getElementById('reactorsList').innerHTML = 'تحميل...';
    // Simplified logic
    document.getElementById('reactorsList').innerHTML = 'قائمة المتفاعلين...';
};

async function fetchAndRenderComments(postId) {
    const list = document.getElementById(`comment-list-${postId}`);
    const res = await getComments(postId);
    if(res.success) {
        list.innerHTML = res.data.map(c => `
            <div class="comment-item">
                <img src="${c.authorImage}" class="comment-avatar">
                <div class="comment-bubble">
                    <div class="comment-author">${c.authorName}</div>
                    <div class="comment-text">${escapeHtml(c.content)}</div>
                </div>
            </div>
        `).join('');
    }
}

async function submitComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();
    if(!content) return;
    input.value = '';
    await addComment(postId, content);
    fetchAndRenderComments(postId);
}

// function escapeHtml(text) { if (!text) return ""; return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
// function escapeHtml(text) {
//     if (!text) return "";
//     // 1. تأمين النص من الأكواد الخبيثة
//     let escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
//     // 2. الربط مع المفتش الذكي (script.js) عشان يحول اللينكات
//     if (window.linkifyText) return window.linkifyText(escaped);
    
//     return escaped;
// }


function escapeHtml(text) {
    if (!text) return "";
    let escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (window.linkifyText) return window.linkifyText(escaped);
    return escaped;
}


function injectStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        .post-stats { border-bottom: 1px solid var(--border-color); font-size: 0.9rem; color: var(--text-grey); }
        .custom-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; }
        .custom-modal-content { background: var(--bg-card); width: 90%; max-width: 400px; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; max-height: 80vh; }
        .custom-modal-header { padding: 15px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; font-weight: bold; color: var(--primary-blue); }
        .custom-modal-body { padding: 15px; overflow-y: auto; }
        .friends-grid { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
    `;
    document.head.appendChild(style);
}
function createReactorsModal() {
    if (document.getElementById('reactorsModal')) return;
    const div = document.createElement('div');
    div.id = 'reactorsModal';
    div.className = 'custom-modal';
    div.innerHTML = `<div class="custom-modal-content"><div class="custom-modal-header"><span>التفاعل</span><span onclick="this.parentElement.parentElement.parentElement.style.display='none'" style="cursor:pointer">&times;</span></div><div class="custom-modal-body" id="reactorsList"></div></div>`;
    document.body.appendChild(div);
}


function createImagePreviewModalUser() {
    if (document.getElementById('imgPreviewModalUser')) return;
    const modal = document.createElement('div');
    modal.id = 'imgPreviewModalUser';
    modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:99999; justify-content:center; align-items:center; cursor:pointer; backdrop-filter:blur(5px); animation: fadeIn 0.2s;';
    modal.innerHTML = `
        <span style="position:absolute; top:20px; right:30px; color:white; font-size:40px; font-weight:bold; cursor:pointer; z-index:100000;">&times;</span>
        <img id="previewModalImgUser" style="max-width:90%; max-height:90%; object-fit:contain; border-radius:10px; box-shadow:0 5px 15px rgba(0,0,0,0.5);">
    `;
    modal.onclick = () => modal.style.display = 'none';
    document.body.appendChild(modal);
}

window.openImagePreviewUser = function(src) {
    const modal = document.getElementById('imgPreviewModalUser');
    document.getElementById('previewModalImgUser').src = src;
    modal.style.display = 'flex';
};