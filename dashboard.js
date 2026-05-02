// import { 
//     auth, 
//     onAuthStateChanged, 
//     createPost, 
//     getPosts, 
//     toggleLike,
//     deletePost,
//     addComment,
//     getComments,
//     getUserData,
//     searchUsers,      // <--- استيراد البحث
//     fixAllUsersSearch // <--- استيراد أداة الإصلاح
// } from './auth-service.js';

// let currentUser = null;

// // --- CONFIG: Reaction Types ---
// const REACTION_TYPES = {
//     like:    { icon: '👍', label: 'تسلم إيدك',      class: 'color-like' },
//     love:    { icon: '❤️', label: 'حبيبي يا هندسة', class: 'color-love' },
//     haha:    { icon: '😂', label: 'هموت',           class: 'color-haha' },
//     wow:     { icon: '😮', label: 'يا صلاة النبي',  class: 'color-wow' },
//     angry:   { icon: '😡', label: 'جرا إيه!',       class: 'color-angry' },
//     dislike: { icon: '👎', label: 'هبد',            class: 'color-dislike' }
// };

// document.addEventListener('DOMContentLoaded', () => {
//     injectStyles(); 
//     createReactorsModal();

//     // تشغيل البحث
//     setupUserSearch();

//     // زرار إصلاح البيانات القديمة (شغله مرة واحدة من الكونسول لو حبيت: fixAllUsersSearch())
//     window.fixSearch = fixAllUsersSearch; 

//     onAuthStateChanged(auth, (user) => {
//         if (user) {
//             currentUser = user;
//             const avatar = document.getElementById('userAvatarSmall');
//             if(avatar) avatar.src = user.photoURL || 'images/user.png';
//         } else {
//             window.location.href = 'login.html';
//         }
//         loadFeed();
//     });

//     const publishBtn = document.getElementById('publishBtn');
//     if(publishBtn) publishBtn.addEventListener('click', handlePublish);
    
//     const postInput = document.getElementById('postInput');
//     if(postInput) {
//         postInput.addEventListener('input', function() {
//             this.style.height = 'auto'; 
//             this.style.height = (this.scrollHeight) + 'px'; 
//         });
//     }
// });

// // --- Search Functionality ---
// function setupUserSearch() {
//     const input = document.getElementById('userSearchInput');
//     const resultsDiv = document.getElementById('searchResultsDropdown');
//     const loader = document.getElementById('searchLoader');
//     let debounceTimer;

//     if (!input || !resultsDiv) return;

//     // إغلاق القائمة عند الضغط خارجها
//     document.addEventListener('click', (e) => {
//         if (!input.contains(e.target) && !resultsDiv.contains(e.target)) {
//             resultsDiv.classList.remove('active');
//         }
//     });

//     input.addEventListener('input', (e) => {
//         const term = e.target.value.trim();
//         resultsDiv.innerHTML = '';
        
//         clearTimeout(debounceTimer);

//         if (term.length === 0) {
//             resultsDiv.classList.remove('active');
//             if(loader) loader.style.display = 'none';
//             return;
//         }

//         if(loader) loader.style.display = 'block';

//         // تأخير البحث نصف ثانية (Debounce)
//         debounceTimer = setTimeout(async () => {
//             const res = await searchUsers(term);
//             if(loader) loader.style.display = 'none';
//             resultsDiv.classList.add('active');

//             if (res.success && res.data.length > 0) {
//                 // فلتر عشان مايظهرش المستخدم لنفسه
//                 const filtered = currentUser ? res.data.filter(u => u.id !== currentUser.uid) : res.data;

//                 if(filtered.length === 0) {
//                     resultsDiv.innerHTML = `<div class="no-results">انت بتدور على نفسك يا ريس؟ 😂</div>`;
//                     return;
//                 }

//                 resultsDiv.innerHTML = filtered.map(u => `
//                     <div class="search-result-item" onclick="window.location.href='user.html?uid=${u.id}'">
//                         <img src="${u.photoURL || 'images/user.png'}" class="result-avatar">
//                         <div class="result-info">
//                             <h4>${u.fullName || 'زبون مجهول'}</h4>
//                             <span>${u.role || 'زبون'}</span>
//                         </div>
//                     </div>
//                 `).join('');
//             } else {
//                 resultsDiv.innerHTML = `
//                     <div class="no-results">
//                         <i class="fa-regular fa-face-frown-open" style="font-size:1.5rem; margin-bottom:5px;"></i>
//                         <p>فص ملح وداب!</p>
//                         <small>مفيش حد بالاسم ده يا زميلي</small>
//                     </div>
//                 `;
//             }
//         }, 500);
//     });
// }

// async function handlePublish() {
//     const input = document.getElementById('postInput');
//     const content = input.value.trim();
//     const btn = document.getElementById('publishBtn');

//     if (!content) return;

//     btn.disabled = true;
//     btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

//     const result = await createPost(content);

//     if (result.success) {
//         input.value = ''; 
//         input.style.height = 'auto'; 
//         await loadFeed(); 
//     } else {
//         alert("حصلت مشكلة: " + result.error);
//     }

//     btn.disabled = false;
//     btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> انشر';
// }

// async function loadFeed() {
//     const feedContainer = document.getElementById('postsFeed');
//     if(!feedContainer) return;

//     const result = await getPosts();

//     if (result.success) {
//         const posts = result.data;
        
//         if (posts.length === 0) {
//             feedContainer.innerHTML = `
//                 <div style="text-align: center; padding: 3rem; color: var(--text-grey);">
//                     <i class="fa-solid fa-mug-hot" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
//                     <h3>القهوة فاضية!</h3>
//                     <p>كن أول واحد ينزل مشاريب النهاردة</p>
//                 </div>
//             `;
//             return;
//         }

//         feedContainer.innerHTML = posts.map(post => createPostHTML(post)).join('');
//         attachPostListeners();

//     } else {
//         feedContainer.innerHTML = `<p style="color:red; text-align:center;">حصل خطأ في تحميل المشاريب</p>`;
//     }
// }

// function createPostHTML(post) {
//     let reactions = {};
//     if (Array.isArray(post.likes)) {
//         post.likes.forEach(uid => reactions[uid] = 'like');
//     }
//     if (post.reactions) {
//         Object.assign(reactions, post.reactions);
//     }

//     let userReactionType = null;
//     if (currentUser && reactions[currentUser.uid]) {
//         userReactionType = reactions[currentUser.uid];
//     }
//     const reactionCount = Object.keys(reactions).length;
//     const uniqueIcons = [...new Set(Object.values(reactions).map(t => REACTION_TYPES[t]?.icon).filter(Boolean))].slice(0, 3);
    
//     const isAuthor = currentUser && post.authorId === currentUser.uid;
    
//     let timeAgo = "دلوقتي";
//     if (post.timestamp) {
//         const seconds = (new Date() - post.timestamp.toDate()) / 1000;
//         if (seconds > 3600) timeAgo = `من ${Math.floor(seconds / 3600)} ساعة`;
//         else if (seconds > 60) timeAgo = `من ${Math.floor(seconds / 60)} دقيقة`;
//     }

//     let activeClass = '';
//     let btnContent = '';
//     if (userReactionType && REACTION_TYPES[userReactionType]) {
//         const r = REACTION_TYPES[userReactionType];
//         activeClass = `active ${r.class}`; 
//         btnContent = `<span style="font-size:1.2rem">${r.icon}</span> <span class="reacted-text">${r.label}</span>`;
//     } else {
//         btnContent = `<i class="fa-regular fa-thumbs-up"></i> <span>واجب</span>`;
//     }

//     const profileLink = isAuthor ? 'profile.html' : `user.html?uid=${post.authorId}`;

//     return `
//         <div class="uni-card" id="post-${post.id}">
//             <div class="uni-content">
//                 <div style="display: flex; justify-content: space-between; align-items: flex-start;">
//                     <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 1rem;">
//                         <a href="${profileLink}" style="text-decoration: none; display: flex; gap: 10px; align-items: center;">
//                             <img src="${post.authorImage}" style="width: 45px; height: 45px; border-radius: 50%; border: 2px solid var(--border-color); object-fit: cover;">
//                             <div>
//                                 <h2 style="margin: 0; font-size: 1rem; color: var(--primary-blue); cursor: pointer;">
//                                     ${post.authorName}
//                                 </h2>
//                                 <span class="location" style="font-size: 0.8rem; color: var(--text-grey); display: block;">${timeAgo}</span>
//                             </div>
//                         </a>
//                     </div>
//                     ${isAuthor ? `
//                         <button class="btn-outline delete-btn" data-id="${post.id}" style="border:none; color: #c5221f; padding: 5px;">
//                             <i class="fa-solid fa-trash"></i>
//                         </button>
//                     ` : ''}
//                 </div>
                
//                 <p class="description">${escapeHtml(post.content)}</p>
//             </div>
            
//             <div class="post-stats">
//                 <div class="stats-likes" onclick="showReactorsModal('${post.id}')" style="cursor: pointer;">
//                     ${reactionCount > 0 ? `
//                         <span class="stats-icons">${uniqueIcons.join('')}</span>
//                         <span class="stats-text">${reactionCount} تفاعل</span>
//                     ` : `<span style="font-size:0.8rem; opacity:0.7">كن أول واحد يعمل واجب</span>`}
//                 </div>
//                 <div class="stats-comments" onclick="toggleComments('${post.id}')" style="cursor: pointer;">
//                     ${post.commentsCount > 0 ? `${post.commentsCount} تلقيح` : ''}
//                 </div>
//             </div>

//             <div class="card-actions">
//                 <div class="reaction-wrapper">
//                     <div class="reaction-picker">
//                         <div class="reaction-emoji" data-type="like" data-post-id="${post.id}" data-label="تسلم إيدك">👍</div>
//                         <div class="reaction-emoji" data-type="love" data-post-id="${post.id}" data-label="حبيبي يا هندسة">❤️</div>
//                         <div class="reaction-emoji" data-type="haha" data-post-id="${post.id}" data-label="هموت">😂</div>
//                         <div class="reaction-emoji" data-type="wow" data-post-id="${post.id}" data-label="يا صلاة النبي">😮</div>
//                         <div class="reaction-emoji" data-type="angry" data-post-id="${post.id}" data-label="جرا إيه!">😡</div>
//                         <div class="reaction-emoji" data-type="dislike" data-post-id="${post.id}" data-label="هبد">👎</div>
//                     </div>
//                     <div class="compare-check reaction-main-btn ${activeClass}" id="react-btn-${post.id}" data-id="${post.id}">
//                         ${btnContent}
//                     </div>
//                 </div>

//                 <div class="compare-check comment-btn" data-id="${post.id}">
//                     <i class="fa-regular fa-comment"></i>
//                     <span>تلقيح</span>
//                 </div>
//             </div>

//             <div class="comments-section" id="comments-section-${post.id}">
//                 <div class="comment-list" id="comment-list-${post.id}">
//                     <div style="text-align:center; padding:10px; color:var(--text-grey); font-size:0.8rem;">
//                         <i class="fa-solid fa-circle-notch fa-spin"></i> تحميل التلقيح...
//                     </div>
//                 </div>
                
//                 <div class="comment-input-wrapper">
//                     <img src="${currentUser ? currentUser.photoURL : 'images/user.png'}" class="comment-avatar">
//                     <input type="text" class="comment-input" id="comment-input-${post.id}" placeholder="لقح بالكلام يا زميلي..." autocomplete="off">
//                     <button class="btn-send-comment" data-id="${post.id}">
//                         <i class="fa-solid fa-paper-plane"></i>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     `;
// }

// function attachPostListeners() {
//     document.querySelectorAll('.reaction-emoji').forEach(emoji => {
//         emoji.addEventListener('click', async function(e) {
//             e.stopPropagation();
//             const postId = this.dataset.postId;
//             const type = this.dataset.type;
//             updateReactionUI(postId, type);
//             await toggleLike(postId, type); 
//         });
//     });

//     document.querySelectorAll('.reaction-main-btn').forEach(btn => {
//         btn.addEventListener('click', async function() {
//             const postId = this.dataset.id;
//             if (this.classList.contains('active')) {
//                 this.className = 'compare-check reaction-main-btn'; 
//                 this.innerHTML = `<i class="fa-regular fa-thumbs-up"></i> <span>واجب</span>`;
//                 await toggleLike(postId); 
//             } else {
//                 updateReactionUI(postId, 'like');
//                 await toggleLike(postId, 'like');
//             }
//         });
//     });

//     document.querySelectorAll('.comment-btn').forEach(btn => {
//         btn.addEventListener('click', function() {
//             toggleComments(this.dataset.id);
//         });
//     });

//     document.querySelectorAll('.btn-send-comment').forEach(btn => {
//         btn.addEventListener('click', function() {
//             const postId = this.dataset.id;
//             submitComment(postId);
//         });
//     });

//     document.querySelectorAll('.comment-input').forEach(input => {
//         input.addEventListener('keypress', function(e) {
//             if (e.key === 'Enter') {
//                 const postId = this.id.split('comment-input-')[1];
//                 submitComment(postId);
//             }
//         });
//     });

//     document.querySelectorAll('.delete-btn').forEach(btn => {
//         btn.addEventListener('click', async function() {
//             if(confirm("متأكد انك عايز تمسح الكلام ده؟")) {
//                 const postId = this.dataset.id;
//                 const result = await deletePost(postId);
//                 if(result.success) {
//                     const postEl = document.getElementById(`post-${postId}`);
//                     if(postEl) postEl.remove();
//                 }
//             }
//         });
//     });
// }

// // --- Global Helpers ---

// window.toggleComments = function(postId) {
//     const section = document.getElementById(`comments-section-${postId}`);
//     if (section.classList.contains('show')) {
//         section.classList.remove('show');
//     } else {
//         section.classList.add('show');
//         fetchAndRenderComments(postId);
//     }
// };

// window.showReactorsModal = async function(postId) {
//     const modal = document.getElementById('reactorsModal');
//     const list = document.getElementById('reactorsList');
//     const loading = document.getElementById('reactorsLoading');
    
//     modal.style.display = 'flex';
//     list.innerHTML = '';
//     loading.style.display = 'block';

//     const postsResult = await getPosts(); 
//     const post = postsResult.data.find(p => p.id === postId);
    
//     let reactions = {};
//     if (post) {
//         if (Array.isArray(post.likes)) {
//             post.likes.forEach(uid => reactions[uid] = 'like');
//         }
//         if (post.reactions) {
//             Object.assign(reactions, post.reactions);
//         }
//     }

//     const uids = Object.keys(reactions);

//     if (uids.length === 0) {
//         loading.style.display = 'none';
//         list.innerHTML = '<p style="text-align:center; padding:1rem;">مفيش تفاعل لسه</p>';
//         return;
//     }

//     let html = '';
//     for (const uid of uids) {
//         const type = reactions[uid];
//         const icon = REACTION_TYPES[type]?.icon || '👍';
//         const userRes = await getUserData(uid);
//         const userData = userRes.success ? userRes.data : { fullName: 'زبون', photoURL: 'images/user.png' };
//         html += `
//             <div class="reactor-item">
//                 <div style="position:relative;">
//                     <img src="${userData.photoURL || 'images/user.png'}" class="reactor-img">
//                     <span class="reactor-icon-badge">${icon}</span>
//                 </div>
//                 <div class="reactor-info">
//                     <strong>${userData.fullName || 'زبون'}</strong>
//                     <span>${userData.role || 'زبون'}</span>
//                 </div>
//             </div>
//         `;
//     }

//     loading.style.display = 'none';
//     list.innerHTML = html;
// };

// function injectStyles() {
//     const style = document.createElement('style');
//     style.innerHTML = `
//         .post-stats {
//             display: flex; justify-content: space-between; align-items: center;
//             padding: 8px 0; margin: 0 10px; border-bottom: 1px solid var(--border-color);
//             font-size: 0.9rem; color: var(--text-grey);
//         }
//         .stats-icons { font-size: 1.1rem; margin-left: 5px; vertical-align: middle; }
//         .stats-text:hover, .stats-comments:hover { text-decoration: underline; color: var(--primary-blue); }
//         .custom-modal {
//             display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
//             background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center;
//             animation: fadeIn 0.2s;
//         }
//         .custom-modal-content {
//             background: var(--bg-card); width: 90%; max-width: 400px;
//             border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;
//             max-height: 80vh;
//         }
//         .custom-modal-header {
//             padding: 15px; border-bottom: 1px solid var(--border-color);
//             display: flex; justify-content: space-between; font-weight: bold; color: var(--primary-blue);
//         }
//         .custom-modal-body { padding: 0; overflow-y: auto; }
//         .reactor-item {
//             display: flex; align-items: center; padding: 10px 15px; gap: 12px;
//             border-bottom: 1px solid rgba(0,0,0,0.05);
//         }
//         .reactor-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
//         .reactor-icon-badge {
//             position: absolute; bottom: -2px; right: -2px;
//             background: var(--bg-card); border-radius: 50%;
//             font-size: 14px; width: 20px; height: 20px;
//             display: flex; align-items: center; justify-content: center;
//             box-shadow: 0 1px 2px rgba(0,0,0,0.2);
//         }
//         .reactor-info { display: flex; flex-direction: column; }
//         .reactor-info span { font-size: 0.8rem; color: var(--text-grey); }
//     `;
//     document.head.appendChild(style);
// }

// function createReactorsModal() {
//     if (document.getElementById('reactorsModal')) return;
//     const div = document.createElement('div');
//     div.id = 'reactorsModal';
//     div.className = 'custom-modal';
//     div.innerHTML = `
//         <div class="custom-modal-content">
//             <div class="custom-modal-header">
//                 <span>الناس الواجبة (التفاعل)</span>
//                 <span onclick="document.getElementById('reactorsModal').style.display='none'" style="cursor:pointer">&times;</span>
//             </div>
//             <div class="custom-modal-body">
//                 <div id="reactorsLoading" style="text-align:center; padding:20px;">
//                     <i class="fa-solid fa-spinner fa-spin"></i> تحميل...
//                 </div>
//                 <div id="reactorsList"></div>
//             </div>
//         </div>
//     `;
//     document.body.appendChild(div);
//     div.addEventListener('click', (e) => {
//         if(e.target === div) div.style.display = 'none';
//     });
// }

// async function fetchAndRenderComments(postId) {
//     const list = document.getElementById(`comment-list-${postId}`);
//     const result = await getComments(postId);

//     if (result.success) {
//         if (result.data.length === 0) {
//             list.innerHTML = `<div style="text-align:center; padding:10px; color:var(--text-grey); font-size:0.8rem;">لسه مفيش تلقيح.. ابدأ انت</div>`;
//         } else {
//             list.innerHTML = result.data.map(comment => `
//                 <div class="comment-item">
//                     <img src="${comment.authorImage}" class="comment-avatar">
//                     <div class="comment-bubble">
//                         <div class="comment-author">${comment.authorName}</div>
//                         <div class="comment-text">${escapeHtml(comment.content)}</div>
//                     </div>
//                 </div>
//             `).join('');
//         }
//     } else {
//         list.innerHTML = `<div style="color:red; text-align:center;">فشل التحميل</div>`;
//     }
// }

// async function submitComment(postId) {
//     const input = document.getElementById(`comment-input-${postId}`);
//     const content = input.value.trim();
//     if (!content) return;

//     input.value = '';
    
//     const list = document.getElementById(`comment-list-${postId}`);
//     if(list.innerText.includes('لسه مفيش')) list.innerHTML = '';

//     const tempDiv = document.createElement('div');
//     tempDiv.className = 'comment-item';
//     tempDiv.style.opacity = '0.7'; 
//     tempDiv.innerHTML = `
//         <img src="${currentUser.photoURL}" class="comment-avatar">
//         <div class="comment-bubble">
//             <div class="comment-author">${currentUser.displayName || 'أنا'}</div>
//             <div class="comment-text">${escapeHtml(content)}</div>
//         </div>
//     `;
//     list.appendChild(tempDiv);
//     list.scrollTop = list.scrollHeight; 

//     const result = await addComment(postId, content);

//     if (result.success) {
//         fetchAndRenderComments(postId);
//     } else {
//         alert('حصل مشكلة في التلقيح: ' + result.error);
//         tempDiv.remove(); 
//         input.value = content;
//     }
// }

// function updateReactionUI(postId, type) {
//     const btn = document.getElementById(`react-btn-${postId}`);
//     if(!btn) return;
//     const r = REACTION_TYPES[type];
//     btn.className = 'compare-check reaction-main-btn active';
//     btn.classList.add(r.class); 
//     btn.innerHTML = `<span style="font-size:1.2rem">${r.icon}</span> <span class="reacted-text">${r.label}</span>`;
// }

// function escapeHtml(text) {
//     if (!text) return "";
//     return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
// }


















// import { 
//     auth, 
//     onAuthStateChanged, 
//     createPost, 
//     getPosts, 
//     toggleLike,
//     deletePost,
//     addComment,
//     getComments,
//     getUserData,
//     searchUsers,      
//     fixAllUsersSearch 
// } from './auth-service.js';

// let currentUser = null;

// // --- CONFIG: Reaction Types ---
// const REACTION_TYPES = {
//     like:    { icon: '👍', label: 'تسلم إيدك',      class: 'color-like' },
//     love:    { icon: '❤️', label: 'حبيبي يا هندسة', class: 'color-love' },
//     haha:    { icon: '😂', label: 'هموت',           class: 'color-haha' },
//     wow:     { icon: '😮', label: 'يا صلاة النبي',  class: 'color-wow' },
//     angry:   { icon: '😡', label: 'جرا إيه!',       class: 'color-angry' },
//     dislike: { icon: '👎', label: 'هبد',            class: 'color-dislike' }
// };

// document.addEventListener('DOMContentLoaded', () => {
//     injectStyles(); 
//     createReactorsModal();
//     setupGahwajyAI();

//     // تشغيل البحث الذكي (Smart Search)
//     setupUserSearch();

//     // أداة الإصلاح (للاستخدام اليدوي عند الحاجة)
//     window.fixSearch = fixAllUsersSearch; 

//     // onAuthStateChanged(auth, (user) => {
//     //     if (user) {
//     //         currentUser = user;
//     //         const avatar = document.getElementById('userAvatarSmall');
//     //         if(avatar) avatar.src = user.photoURL || 'images/user.png';
//     //     } else {
//     //         window.location.href = 'login.html';
//     //     }
//     //     loadFeed();
//     // });
// onAuthStateChanged(auth, (user) => {
//         if (user) {
//             currentUser = user;
            
//             // --- NEW: Share user info with the AI ---
//             window.currentGahwaUser = user; 
//             // ---------------------------------------

//             const avatar = document.getElementById('userAvatarSmall');
//             if(avatar) avatar.src = user.photoURL || 'images/user.png';
//         } else {
//             window.location.href = 'login.html';
//         }
//         loadFeed();
//     });
//     const publishBtn = document.getElementById('publishBtn');
//     if(publishBtn) publishBtn.addEventListener('click', handlePublish);
    
//     const postInput = document.getElementById('postInput');
//     if(postInput) {
//         postInput.addEventListener('input', function() {
//             this.style.height = 'auto'; 
//             this.style.height = (this.scrollHeight) + 'px'; 
//         });
//     }
// });

// // // ================= SMART SEARCH SYSTEM =================
// // function setupUserSearch() {
// //     const input = document.getElementById('userSearchInput');
// //     const resultsDiv = document.getElementById('searchResultsDropdown');
// //     const loader = document.getElementById('searchLoader');
    
// //     let debounceTimer;
// //     let currentFocus = -1; // لتتبع العنصر المختار بالكيبورد

// //     if (!input || !resultsDiv) return;

// //     // 1. إغلاق القائمة عند الضغط خارجها
// //     document.addEventListener('click', (e) => {
// //         if (!input.contains(e.target) && !resultsDiv.contains(e.target)) {
// //             closeAllLists();
// //         }
// //     });

// //     // 2. الاستماع للكتابة (Input)
// //     input.addEventListener('input', function(e) {
// //         const term = this.value.trim();
// //         closeAllLists(); // امسح القديم
        
// //         clearTimeout(debounceTimer); // Debounce

// //         if (!term) {
// //             if(loader) loader.style.display = 'none';
// //             return;
// //         }

// //         if(loader) loader.style.display = 'block';

// //         debounceTimer = setTimeout(async () => {
// //             const res = await searchUsers(term);
// //             if(loader) loader.style.display = 'none';

// //             // إنشاء القائمة
// //             resultsDiv.classList.add('active');
// //             currentFocus = -1; // تصفير الاختيار

// //             if (res.success && res.data.length > 0) {
// //                 // فلتر عشان مايظهرش المستخدم لنفسه
// //                 const filtered = currentUser ? res.data.filter(u => u.id !== currentUser.uid) : res.data;

// //                 if(filtered.length === 0) {
// //                     resultsDiv.innerHTML = `<div class="no-results">انت بتدور على نفسك يا ريس؟ 😂</div>`;
// //                     return;
// //                 }

// //                 // عرض النتائج مع التظليل (Highlighting)
// //                 resultsDiv.innerHTML = filtered.map((u, index) => {
// //                     // دالة لتظليل النص المطابق
// //                     const name = u.fullName || 'زبون مجهول';
// //                     const regex = new RegExp(`(${term})`, "gi"); // Case insensitive regex
// //                     const highlightedName = name.replace(regex, `<span class="highlight-text">$1</span>`);

// //                     return `
// //                     <div class="search-result-item" id="result-item-${index}" onclick="window.location.href='user.html?uid=${u.id}'">
// //                         <img src="${u.photoURL || 'images/user.png'}" class="result-avatar">
// //                         <div class="result-info">
// //                             <h4>${highlightedName}</h4>
// //                             <span>${u.role || 'زبون'}</span>
// //                         </div>
// //                     </div>
// //                 `}).join('');
// //             } else {
// //                 resultsDiv.innerHTML = `
// //                     <div class="no-results">
// //                         <i class="fa-regular fa-face-frown-open" style="font-size:1.5rem; margin-bottom:5px;"></i>
// //                         <p>فص ملح وداب!</p>
// //                         <small>مفيش حد بالاسم ده يا زميلي</small>
// //                     </div>
// //                 `;
// //             }
// //         }, 400); // 400ms delay
// //     });

// //     // 3. التحكم بالكيبورد (Keyboard Navigation)
// //     input.addEventListener("keydown", function(e) {
// //         const items = resultsDiv.getElementsByClassName("search-result-item");
// //         if (!resultsDiv.classList.contains('active') || items.length === 0) return;

// //         if (e.key === "ArrowDown") { // سهم لتحت
// //             currentFocus++;
// //             addActive(items);
// //         } else if (e.key === "ArrowUp") { // سهم لفوق
// //             currentFocus--;
// //             addActive(items);
// //         } else if (e.key === "Enter") { // زرار Enter
// //             e.preventDefault(); // منع إرسال الفورم لو موجود
// //             if (currentFocus > -1) {
// //                 if (items[currentFocus]) items[currentFocus].click(); // محاكاة الضغط
// //             }
// //         } else if (e.key === "Escape") { // زرار Escape
// //             closeAllLists();
// //             input.blur();
// //         }
// //     });

// //     // دوال مساعدة للكيبورد
// //     function addActive(items) {
// //         if (!items) return false;
// //         removeActive(items);
// //         if (currentFocus >= items.length) currentFocus = 0; // لو وصل للآخر يرجع للأول
// //         if (currentFocus < 0) currentFocus = (items.length - 1); // لو طلع فوق الأول يجيب الأخير
        
// //         items[currentFocus].classList.add("selected");
// //         // Scroll to view if hidden
// //         items[currentFocus].scrollIntoView({ block: 'nearest' });
// //     }

// //     function removeActive(items) {
// //         for (let i = 0; i < items.length; i++) {
// //             items[i].classList.remove("selected");
// //         }
// //     }

// //     function closeAllLists() {
// //         resultsDiv.innerHTML = '';
// //         resultsDiv.classList.remove('active');
// //         currentFocus = -1;
// //     }
// // }










// // // ================= END SMART SEARCH =================
// // ================= SMART SEARCH SYSTEM (UPDATED) =================
// function setupUserSearch() {
//     const input = document.getElementById('userSearchInput');
//     const resultsDiv = document.getElementById('searchResultsDropdown');
//     const loader = document.getElementById('searchLoader');
    
//     let debounceTimer;
//     let currentFocus = -1;

//     if (!input || !resultsDiv) return;

//     // 1. إغلاق القائمة عند الضغط خارجها
//     document.addEventListener('click', (e) => {
//         if (!input.contains(e.target) && !resultsDiv.contains(e.target)) {
//             closeAllLists();
//         }
//     });

//     // 2. الاستماع للكتابة
//     input.addEventListener('input', function(e) {
//         const term = this.value.trim();
//         closeAllLists();
        
//         clearTimeout(debounceTimer);

//         if (!term) {
//             if(loader) loader.style.display = 'none';
//             return;
//         }

//         if(loader) loader.style.display = 'block';

//         debounceTimer = setTimeout(async () => {
//             const res = await searchUsers(term);
//             if(loader) loader.style.display = 'none';

//             resultsDiv.classList.add('active');
//             currentFocus = -1;

//             if (res.success && res.data.length > 0) {
//                 // فلتر عشان مايظهرش المستخدم لنفسه
//                 const filtered = currentUser ? res.data.filter(u => u.id !== currentUser.uid) : res.data;

//                 if(filtered.length === 0) {
//                     resultsDiv.innerHTML = `<div class="no-results">انت بتدور على نفسك يا ريس؟ 😂</div>`;
//                     return;
//                 }

//                 resultsDiv.innerHTML = filtered.map((u, index) => {
//                     // --- (New) كود تحديد الصورة بذكاء ---
//                     // بيجرب يدور على profileImage لو ملقاش يشوف photoURL لو ملقاش يحط الصورة الافتراضية
//                     const userImg = u.profileImage || u.photoURL || 'images/user.png';
                    
//                     // تظليل الاسم
//                     const name = u.fullName || 'زبون مجهول';
//                     const regex = new RegExp(`(${term})`, "gi");
//                     const highlightedName = name.replace(regex, `<span class="highlight-text">$1</span>`);

//                     return `
//                     <div class="search-result-item" id="result-item-${index}" onclick="window.location.href='user.html?uid=${u.id}'">
//                         <img src="${userImg}" class="result-avatar" onerror="this.src='images/user.png'">
                        
//                         <div class="result-info">
//                             <h4>${highlightedName}</h4>
//                             <span>${u.role || 'زبون'}</span>
//                         </div>
//                     </div>
//                 `}).join('');
//             } else {
//                 resultsDiv.innerHTML = `
//                     <div class="no-results">
//                         <i class="fa-regular fa-face-frown-open" style="font-size:1.5rem; margin-bottom:5px;"></i>
//                         <p>فص ملح وداب!</p>
//                         <small>مفيش حد بالاسم ده يا زميلي</small>
//                     </div>
//                 `;
//             }
//         }, 400);
//     });

//     // 3. التحكم بالكيبورد (زي ما هو)
//     input.addEventListener("keydown", function(e) {
//         const items = resultsDiv.getElementsByClassName("search-result-item");
//         if (!resultsDiv.classList.contains('active') || items.length === 0) return;

//         if (e.key === "ArrowDown") {
//             currentFocus++;
//             addActive(items);
//         } else if (e.key === "ArrowUp") {
//             currentFocus--;
//             addActive(items);
//         } else if (e.key === "Enter") {
//             e.preventDefault();
//             if (currentFocus > -1) {
//                 if (items[currentFocus]) items[currentFocus].click();
//             }
//         } else if (e.key === "Escape") {
//             closeAllLists();
//             input.blur();
//         }
//     });

//     function addActive(items) {
//         if (!items) return false;
//         removeActive(items);
//         if (currentFocus >= items.length) currentFocus = 0;
//         if (currentFocus < 0) currentFocus = (items.length - 1);
//         items[currentFocus].classList.add("selected");
//         items[currentFocus].scrollIntoView({ block: 'nearest' });
//     }

//     function removeActive(items) {
//         for (let i = 0; i < items.length; i++) {
//             items[i].classList.remove("selected");
//         }
//     }

//     function closeAllLists() {
//         resultsDiv.innerHTML = '';
//         resultsDiv.classList.remove('active');
//         currentFocus = -1;
//     }
// }
// async function handlePublish() {
//     const input = document.getElementById('postInput');
//     const content = input.value.trim();
//     const btn = document.getElementById('publishBtn');

//     if (!content) return;

//     btn.disabled = true;
//     btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

//     const result = await createPost(content);

//     if (result.success) {
//         input.value = ''; 
//         input.style.height = 'auto'; 
//         await loadFeed(); 
//     } else {
//         alert("حصلت مشكلة: " + result.error);
//     }

//     btn.disabled = false;
//     btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> انشر';
// }

// async function loadFeed() {
//     const feedContainer = document.getElementById('postsFeed');
//     if(!feedContainer) return;

//     const result = await getPosts();

//     if (result.success) {
//         const posts = result.data;
        
//         if (posts.length === 0) {
//             feedContainer.innerHTML = `
//                 <div style="text-align: center; padding: 3rem; color: var(--text-grey);">
//                     <i class="fa-solid fa-mug-hot" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
//                     <h3>القهوة فاضية!</h3>
//                     <p>كن أول واحد ينزل مشاريب النهاردة</p>
//                 </div>
//             `;
//             return;
//         }

//         feedContainer.innerHTML = posts.map(post => createPostHTML(post)).join('');
//         attachPostListeners();

//     } else {
//         feedContainer.innerHTML = `<p style="color:red; text-align:center;">حصل خطأ في تحميل المشاريب</p>`;
//     }
// }

// function createPostHTML(post) {
//     let reactions = {};
//     if (Array.isArray(post.likes)) {
//         post.likes.forEach(uid => reactions[uid] = 'like');
//     }
//     if (post.reactions) {
//         Object.assign(reactions, post.reactions);
//     }
// let timeString = "منذ فترة";
//     if (post.timestamp) {
//         const date = post.timestamp.toDate();
//         // تنسيق التاريخ: الجمعة، 12 سبتمبر 2025 الساعة 5:10 م
//         timeString = date.toLocaleDateString('ar-EG', {
//             weekday: 'long', 
//             year: 'numeric', 
//             month: 'long', 
//             day: 'numeric',
//             hour: 'numeric',
//             minute: 'numeric'
//         });
//     }
//     let userReactionType = null;
//     if (currentUser && reactions[currentUser.uid]) {
//         userReactionType = reactions[currentUser.uid];
//     }
//     const reactionCount = Object.keys(reactions).length;
//     const uniqueIcons = [...new Set(Object.values(reactions).map(t => REACTION_TYPES[t]?.icon).filter(Boolean))].slice(0, 3);
    
//     const isAuthor = currentUser && post.authorId === currentUser.uid;
    
//     let timeAgo = "دلوقتي";
//     if (post.timestamp) {
//         const seconds = (new Date() - post.timestamp.toDate()) / 1000;
//         if (seconds > 3600) timeAgo = `من ${Math.floor(seconds / 3600)} ساعة`;
//         else if (seconds > 60) timeAgo = `من ${Math.floor(seconds / 60)} دقيقة`;
//     }

//     let activeClass = '';
//     let btnContent = '';
//     if (userReactionType && REACTION_TYPES[userReactionType]) {
//         const r = REACTION_TYPES[userReactionType];
//         activeClass = `active ${r.class}`; 
//         btnContent = `<span style="font-size:1.2rem">${r.icon}</span> <span class="reacted-text">${r.label}</span>`;
//     } else {
//         btnContent = `<i class="fa-regular fa-thumbs-up"></i> <span>واجب</span>`;
//     }

//     const profileLink = isAuthor ? 'profile.html' : `user.html?uid=${post.authorId}`;

//     // return `
//     //     <div class="uni-card" id="post-${post.id}">
//     //         <div class="uni-content">
//     //             <div style="display: flex; justify-content: space-between; align-items: flex-start;">
//     //                 <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 1rem;">
//     //                     <a href="${profileLink}" style="text-decoration: none; display: flex; gap: 10px; align-items: center;">
//     //                         <img src="${post.authorImage}" style="width: 45px; height: 45px; border-radius: 50%; border: 2px solid var(--border-color); object-fit: cover;">
//     //                         <div>
//     //                             <h2 style="margin: 0; font-size: 1rem; color: var(--primary-blue); cursor: pointer;">
//     //                                 ${post.authorName}
//     //                             </h2>
//     //                             <span class="location" style="font-size: 0.8rem; color: var(--text-grey); display: block;">${timeAgo}</span>
//     //                         </div>
//     //                     </a>
//     //                 </div>
// return `
//         <div class="uni-card" id="post-${post.id}">
//             <div class="uni-content">
//                 <div style="display: flex; justify-content: space-between; align-items: flex-start;">
//                     <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 1rem;">
//                         <a href="${profileLink}" style="text-decoration: none; display: flex; gap: 10px; align-items: center;">
//                             <img src="${post.authorImage}" style="width: 45px; height: 45px; border-radius: 50%; border: 2px solid var(--border-color); object-fit: cover;">
//                             <div>
//                                 <h2 style="margin: 0; font-size: 1rem; color: var(--primary-blue); cursor: pointer;">
//                                     ${post.authorName}
//                                 </h2>
//                                 <span class="location" style="font-size: 0.75rem; color: var(--text-grey); display: block;">${timeString}</span>
//                             </div>
//                         </a>
//                     </div>
//                     ${isAuthor ? `
//                         <button class="btn-outline delete-btn" data-id="${post.id}" style="border:none; color: #c5221f; padding: 5px;">
//                             <i class="fa-solid fa-trash"></i>
//                         </button>
//                     ` : ''}
//                 </div>
                
//                 <p class="description">${escapeHtml(post.content)}</p>
//             </div>
            
//             <div class="post-stats">
//                 <div class="stats-likes" onclick="showReactorsModal('${post.id}')" style="cursor: pointer;">
//                     ${reactionCount > 0 ? `
//                         <span class="stats-icons">${uniqueIcons.join('')}</span>
//                         <span class="stats-text">${reactionCount} تفاعل</span>
//                     ` : `<span style="font-size:0.8rem; opacity:0.7">كن أول واحد يعمل واجب</span>`}
//                 </div>
//                 <div class="stats-comments" onclick="toggleComments('${post.id}')" style="cursor: pointer;">
//                     ${post.commentsCount > 0 ? `${post.commentsCount} تلقيح` : ''}
//                 </div>
//             </div>

//             <div class="card-actions">
//                 <div class="reaction-wrapper">
//                     <div class="reaction-picker">
//                         <div class="reaction-emoji" data-type="like" data-post-id="${post.id}" data-label="تسلم إيدك">👍</div>
//                         <div class="reaction-emoji" data-type="love" data-post-id="${post.id}" data-label="حبيبي يا هندسة">❤️</div>
//                         <div class="reaction-emoji" data-type="haha" data-post-id="${post.id}" data-label="هموت">😂</div>
//                         <div class="reaction-emoji" data-type="wow" data-post-id="${post.id}" data-label="يا صلاة النبي">😮</div>
//                         <div class="reaction-emoji" data-type="angry" data-post-id="${post.id}" data-label="جرا إيه!">😡</div>
//                         <div class="reaction-emoji" data-type="dislike" data-post-id="${post.id}" data-label="هبد">👎</div>
//                     </div>
//                     <div class="compare-check reaction-main-btn ${activeClass}" id="react-btn-${post.id}" data-id="${post.id}">
//                         ${btnContent}
//                     </div>
//                 </div>

//                 <div class="compare-check comment-btn" data-id="${post.id}">
//                     <i class="fa-regular fa-comment"></i>
//                     <span>تلقيح</span>
//                 </div>
//             </div>

//             <div class="comments-section" id="comments-section-${post.id}">
//                 <div class="comment-list" id="comment-list-${post.id}">
//                     <div style="text-align:center; padding:10px; color:var(--text-grey); font-size:0.8rem;">
//                         <i class="fa-solid fa-circle-notch fa-spin"></i> تحميل التلقيح...
//                     </div>
//                 </div>
                
//                 <div class="comment-input-wrapper">
//                     <img src="${currentUser ? currentUser.photoURL : 'images/user.png'}" class="comment-avatar">
//                     <input type="text" class="comment-input" id="comment-input-${post.id}" placeholder="لقح بالكلام يا زميلي..." autocomplete="off">
//                     <button class="btn-send-comment" data-id="${post.id}">
//                         <i class="fa-solid fa-paper-plane"></i>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     `;
// }

// function attachPostListeners() {
//     document.querySelectorAll('.reaction-emoji').forEach(emoji => {
//         emoji.addEventListener('click', async function(e) {
//             e.stopPropagation();
//             const postId = this.dataset.postId;
//             const type = this.dataset.type;
//             updateReactionUI(postId, type);
//             await toggleLike(postId, type); 
//         });
//     });

//     document.querySelectorAll('.reaction-main-btn').forEach(btn => {
//         btn.addEventListener('click', async function() {
//             const postId = this.dataset.id;
//             if (this.classList.contains('active')) {
//                 this.className = 'compare-check reaction-main-btn'; 
//                 this.innerHTML = `<i class="fa-regular fa-thumbs-up"></i> <span>واجب</span>`;
//                 await toggleLike(postId); 
//             } else {
//                 updateReactionUI(postId, 'like');
//                 await toggleLike(postId, 'like');
//             }
//         });
//     });

//     document.querySelectorAll('.comment-btn').forEach(btn => {
//         btn.addEventListener('click', function() {
//             toggleComments(this.dataset.id);
//         });
//     });

//     document.querySelectorAll('.btn-send-comment').forEach(btn => {
//         btn.addEventListener('click', function() {
//             const postId = this.dataset.id;
//             submitComment(postId);
//         });
//     });

//     document.querySelectorAll('.comment-input').forEach(input => {
//         input.addEventListener('keypress', function(e) {
//             if (e.key === 'Enter') {
//                 const postId = this.id.split('comment-input-')[1];
//                 submitComment(postId);
//             }
//         });
//     });

//     document.querySelectorAll('.delete-btn').forEach(btn => {
//         btn.addEventListener('click', async function() {
//             if(confirm("متأكد انك عايز تمسح الكلام ده؟")) {
//                 const postId = this.dataset.id;
//                 const result = await deletePost(postId);
//                 if(result.success) {
//                     const postEl = document.getElementById(`post-${postId}`);
//                     if(postEl) postEl.remove();
//                 }
//             }
//         });
//     });
// }

// // --- Global Helpers ---

// window.toggleComments = function(postId) {
//     const section = document.getElementById(`comments-section-${postId}`);
//     if (section.classList.contains('show')) {
//         section.classList.remove('show');
//     } else {
//         section.classList.add('show');
//         fetchAndRenderComments(postId);
//     }
// };

// window.showReactorsModal = async function(postId) {
//     const modal = document.getElementById('reactorsModal');
//     const list = document.getElementById('reactorsList');
//     const loading = document.getElementById('reactorsLoading');
    
//     modal.style.display = 'flex';
//     list.innerHTML = '';
//     loading.style.display = 'block';

//     const postsResult = await getPosts(); 
//     const post = postsResult.data.find(p => p.id === postId);
    
//     let reactions = {};
//     if (post) {
//         if (Array.isArray(post.likes)) {
//             post.likes.forEach(uid => reactions[uid] = 'like');
//         }
//         if (post.reactions) {
//             Object.assign(reactions, post.reactions);
//         }
//     }

//     const uids = Object.keys(reactions);

//     if (uids.length === 0) {
//         loading.style.display = 'none';
//         list.innerHTML = '<p style="text-align:center; padding:1rem;">مفيش تفاعل لسه</p>';
//         return;
//     }

//     let html = '';
//     for (const uid of uids) {
//         const type = reactions[uid];
//         const icon = REACTION_TYPES[type]?.icon || '👍';
//         const userRes = await getUserData(uid);
//         const userData = userRes.success ? userRes.data : { fullName: 'زبون', photoURL: 'images/user.png' };
//         html += `
//             <div class="reactor-item">
//                 <div style="position:relative;">
//                     <img src="${userData.photoURL || 'images/user.png'}" class="reactor-img">
//                     <span class="reactor-icon-badge">${icon}</span>
//                 </div>
//                 <div class="reactor-info">
//                     <strong>${userData.fullName || 'زبون'}</strong>
//                     <span>${userData.role || 'زبون'}</span>
//                 </div>
//             </div>
//         `;
//     }

//     loading.style.display = 'none';
//     list.innerHTML = html;
// };

// function injectStyles() {
//     const style = document.createElement('style');
//     style.innerHTML = `
//         .post-stats {
//             display: flex; justify-content: space-between; align-items: center;
//             padding: 8px 0; margin: 0 10px; border-bottom: 1px solid var(--border-color);
//             font-size: 0.9rem; color: var(--text-grey);
//         }
//         .stats-icons { font-size: 1.1rem; margin-left: 5px; vertical-align: middle; }
//         .stats-text:hover, .stats-comments:hover { text-decoration: underline; color: var(--primary-blue); }
//         .custom-modal {
//             display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
//             background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center;
//             animation: fadeIn 0.2s;
//         }
//         .custom-modal-content {
//             background: var(--bg-card); width: 90%; max-width: 400px;
//             border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;
//             max-height: 80vh;
//         }
//         .custom-modal-header {
//             padding: 15px; border-bottom: 1px solid var(--border-color);
//             display: flex; justify-content: space-between; font-weight: bold; color: var(--primary-blue);
//         }
//         .custom-modal-body { padding: 0; overflow-y: auto; }
//         .reactor-item {
//             display: flex; align-items: center; padding: 10px 15px; gap: 12px;
//             border-bottom: 1px solid rgba(0,0,0,0.05);
//         }
//         .reactor-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
//         .reactor-icon-badge {
//             position: absolute; bottom: -2px; right: -2px;
//             background: var(--bg-card); border-radius: 50%;
//             font-size: 14px; width: 20px; height: 20px;
//             display: flex; align-items: center; justify-content: center;
//             box-shadow: 0 1px 2px rgba(0,0,0,0.2);
//         }
//         .reactor-info { display: flex; flex-direction: column; }
//         .reactor-info span { font-size: 0.8rem; color: var(--text-grey); }
//     `;
//     document.head.appendChild(style);
// }

// function createReactorsModal() {
//     if (document.getElementById('reactorsModal')) return;
//     const div = document.createElement('div');
//     div.id = 'reactorsModal';
//     div.className = 'custom-modal';
//     div.innerHTML = `
//         <div class="custom-modal-content">
//             <div class="custom-modal-header">
//                 <span>الناس الواجبة (التفاعل)</span>
//                 <span onclick="document.getElementById('reactorsModal').style.display='none'" style="cursor:pointer">&times;</span>
//             </div>
//             <div class="custom-modal-body">
//                 <div id="reactorsLoading" style="text-align:center; padding:20px;">
//                     <i class="fa-solid fa-spinner fa-spin"></i> تحميل...
//                 </div>
//                 <div id="reactorsList"></div>
//             </div>
//         </div>
//     `;
//     document.body.appendChild(div);
//     div.addEventListener('click', (e) => {
//         if(e.target === div) div.style.display = 'none';
//     });
// }

// async function fetchAndRenderComments(postId) {
//     const list = document.getElementById(`comment-list-${postId}`);
//     const result = await getComments(postId);

//     if (result.success) {
//         if (result.data.length === 0) {
//             list.innerHTML = `<div style="text-align:center; padding:10px; color:var(--text-grey); font-size:0.8rem;">لسه مفيش تلقيح.. ابدأ انت</div>`;
//         } else {
//             list.innerHTML = result.data.map(comment => `
//                 <div class="comment-item">
//                     <img src="${comment.authorImage}" class="comment-avatar">
//                     <div class="comment-bubble">
//                         <div class="comment-author">${comment.authorName}</div>
//                         <div class="comment-text">${escapeHtml(comment.content)}</div>
//                     </div>
//                 </div>
//             `).join('');
//         }
//     } else {
//         list.innerHTML = `<div style="color:red; text-align:center;">فشل التحميل</div>`;
//     }
// }

// async function submitComment(postId) {
//     const input = document.getElementById(`comment-input-${postId}`);
//     const content = input.value.trim();
//     if (!content) return;

//     input.value = '';
    
//     const list = document.getElementById(`comment-list-${postId}`);
//     if(list.innerText.includes('لسه مفيش')) list.innerHTML = '';

//     const tempDiv = document.createElement('div');
//     tempDiv.className = 'comment-item';
//     tempDiv.style.opacity = '0.7'; 
//     tempDiv.innerHTML = `
//         <img src="${currentUser.photoURL}" class="comment-avatar">
//         <div class="comment-bubble">
//             <div class="comment-author">${currentUser.displayName || 'أنا'}</div>
//             <div class="comment-text">${escapeHtml(content)}</div>
//         </div>
//     `;
//     list.appendChild(tempDiv);
//     list.scrollTop = list.scrollHeight; 

//     const result = await addComment(postId, content);

//     if (result.success) {
//         fetchAndRenderComments(postId);
//     } else {
//         alert('حصل مشكلة في التلقيح: ' + result.error);
//         tempDiv.remove(); 
//         input.value = content;
//     }
// }

// function updateReactionUI(postId, type) {
//     const btn = document.getElementById(`react-btn-${postId}`);
//     if(!btn) return;
//     const r = REACTION_TYPES[type];
//     btn.className = 'compare-check reaction-main-btn active';
//     btn.classList.add(r.class); 
//     btn.innerHTML = `<span style="font-size:1.2rem">${r.icon}</span> <span class="reacted-text">${r.label}</span>`;
// }

// function escapeHtml(text) {
//     if (!text) return "";
//     return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
// }























// new



import { 
    auth, 
    onAuthStateChanged, 
    createPost, 
    getPosts, 
    toggleLike,
    deletePost,
    addComment,
    getComments,
    getUserData,
    searchUsers,      
    fixAllUsersSearch 
} from './auth-service.js';

let currentUser = null;

// --- CONFIG: Reaction Types ---
const REACTION_TYPES = {
    like:    { icon: '👍', label: 'تسلم إيدك',      class: 'color-like' },
    love:    { icon: '❤️', label: 'حبيبي يا هندسة', class: 'color-love' },
    haha:    { icon: '😂', label: 'هموت',           class: 'color-haha' },
    wow:     { icon: '😮', label: 'يا صلاة النبي',  class: 'color-wow' },
    angry:   { icon: '😡', label: 'جرا إيه!',       class: 'color-angry' },
    dislike: { icon: '👎', label: 'هبد',            class: 'color-dislike' }
};

document.addEventListener('DOMContentLoaded', () => {
    injectStyles(); 
    createReactorsModal();
    if(typeof setupGahwajyAI === 'function') setupGahwajyAI();

    setupUserSearch();
    window.fixSearch = fixAllUsersSearch; 

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            window.currentGahwaUser = user; 
            
            const avatars = [document.getElementById('userAvatarSmall'), document.getElementById('userAvatarStory')];
            avatars.forEach(avatar => {
                if(avatar) avatar.src = user.photoURL || 'images/user.png';
            });
        } else {
            window.location.href = 'login.html';
        }
        loadFeed();
    });

    const publishBtn = document.getElementById('publishBtn');
    if(publishBtn) publishBtn.addEventListener('click', handlePublish);
    
    const postInput = document.getElementById('postInput');
    if(postInput) {
        postInput.addEventListener('input', function() {
            this.style.height = 'auto'; 
            this.style.height = (this.scrollHeight) + 'px'; 
        });
    }
});

// ================= SMART SEARCH SYSTEM =================
function setupUserSearch() {
    const input = document.getElementById('userSearchInput');
    const resultsDiv = document.getElementById('searchResultsDropdown');
    const loader = document.getElementById('searchLoader');
    
    let debounceTimer;
    let currentFocus = -1;

    if (!input || !resultsDiv) return;

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !resultsDiv.contains(e.target)) {
            closeAllLists();
        }
    });

    input.addEventListener('input', function(e) {
        const term = this.value.trim();
        closeAllLists();
        clearTimeout(debounceTimer);

        if (!term) {
            if(loader) loader.style.display = 'none';
            return;
        }

        if(loader) loader.style.display = 'block';

        debounceTimer = setTimeout(async () => {
            const res = await searchUsers(term);
            if(loader) loader.style.display = 'none';

            resultsDiv.classList.add('active');
            currentFocus = -1;

            if (res.success && res.data.length > 0) {
                const filtered = currentUser ? res.data.filter(u => u.id !== currentUser.uid) : res.data;

                if(filtered.length === 0) {
                    resultsDiv.innerHTML = `<div class="no-results">انت بتدور على نفسك يا ريس؟ 😂</div>`;
                    return;
                }

                resultsDiv.innerHTML = filtered.map((u, index) => {
                    const userImg = u.profileImage || u.photoURL || 'images/user.png';
                    const name = u.fullName || 'زبون مجهول';
                    const regex = new RegExp(`(${term})`, "gi");
                    const highlightedName = name.replace(regex, `<span class="highlight-text">$1</span>`);

                    return `
                    <div class="search-result-item" id="result-item-${index}" onclick="window.location.href='user.html?uid=${u.id}'">
                        <img src="${userImg}" class="result-avatar" onerror="this.src='images/user.png'">
                        <div class="result-info">
                            <h4>${highlightedName}</h4>
                            <span>${u.role || 'زبون'}</span>
                        </div>
                    </div>
                `}).join('');
            } else {
                resultsDiv.innerHTML = `
                    <div class="no-results">
                        <i class="fa-regular fa-face-frown-open" style="font-size:1.5rem; margin-bottom:5px;"></i>
                        <p>فص ملح وداب!</p>
                        <small>مفيش حد بالاسم ده يا زميلي</small>
                    </div>
                `;
            }
        }, 400);
    });

    input.addEventListener("keydown", function(e) {
        const items = resultsDiv.getElementsByClassName("search-result-item");
        if (!resultsDiv.classList.contains('active') || items.length === 0) return;

        if (e.key === "ArrowDown") {
            currentFocus++;
            addActive(items);
        } else if (e.key === "ArrowUp") {
            currentFocus--;
            addActive(items);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (currentFocus > -1) {
                if (items[currentFocus]) items[currentFocus].click();
            }
        } else if (e.key === "Escape") {
            closeAllLists();
            input.blur();
        }
    });

    function addActive(items) {
        if (!items) return false;
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (items.length - 1);
        items[currentFocus].classList.add("selected");
        items[currentFocus].scrollIntoView({ block: 'nearest' });
    }

    function removeActive(items) {
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove("selected");
        }
    }

    function closeAllLists() {
        resultsDiv.innerHTML = '';
        resultsDiv.classList.remove('active');
        currentFocus = -1;
    }
}

async function handlePublish() {
    const input = document.getElementById('postInput');
    const content = input.value.trim();
    const btn = document.getElementById('publishBtn');

    if (!content) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

    const result = await createPost(content);

    if (result.success) {
        input.value = ''; 
        input.style.height = 'auto'; 
        await loadFeed(); 
    } else {
        alert("حصلت مشكلة: " + result.error);
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> انشر';
}

async function loadFeed() {
    const feedContainer = document.getElementById('postsFeed');
    if(!feedContainer) return;

    const result = await getPosts();

    if (result.success) {
        const posts = result.data;
        
        if (posts.length === 0) {
            feedContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-grey);">
                    <i class="fa-solid fa-mug-hot" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>القهوة فاضية!</h3>
                    <p>كن أول واحد ينزل مشاريب النهاردة</p>
                </div>
            `;
            return;
        }

        feedContainer.innerHTML = posts.map(post => createPostHTML(post)).join('');
        attachPostListeners();
        // new
if (window.processLinkPreviews) window.processLinkPreviews();

    } else {
        feedContainer.innerHTML = `<p style="color:red; text-align:center;">حصل خطأ في تحميل المشاريب</p>`;
    }
}

function createPostHTML(post) {
    let reactions = {};
    if (Array.isArray(post.likes)) {
        post.likes.forEach(uid => reactions[uid] = 'like');
    }
    if (post.reactions) {
        Object.assign(reactions, post.reactions);
    }

    let timeString = "منذ فترة";
    if (post.timestamp) {
        const date = post.timestamp.toDate();
        timeString = date.toLocaleDateString('ar-EG', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: 'numeric'
        });
    }

    let userReactionType = null;
    if (currentUser && reactions[currentUser.uid]) {
        userReactionType = reactions[currentUser.uid];
    }
    const reactionCount = Object.keys(reactions).length;
    const uniqueIcons = [...new Set(Object.values(reactions).map(t => REACTION_TYPES[t]?.icon).filter(Boolean))].slice(0, 3);
    
    const isAuthor = currentUser && post.authorId === currentUser.uid;
    
    let activeClass = '';
    let btnContent = '';
    if (userReactionType && REACTION_TYPES[userReactionType]) {
        const r = REACTION_TYPES[userReactionType];
        activeClass = `active ${r.class}`; 
        btnContent = `<span style="font-size:1.2rem">${r.icon}</span> <span class="reacted-text">${r.label}</span>`;
    } else {
        btnContent = `<i class="fa-regular fa-thumbs-up"></i> <span>واجب</span>`;
    }

    const profileLink = isAuthor ? 'profile.html' : `user.html?uid=${post.authorId}`;

    return `
        <div class="uni-card" id="post-${post.id}">
            <div class="uni-content">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 1rem;">
                        <a href="${profileLink}" style="text-decoration: none; display: flex; gap: 10px; align-items: center;">
                            <img src="${post.authorImage}" style="width: 45px; height: 45px; border-radius: 50%; border: 2px solid var(--border-color); object-fit: cover;">
                            <div>
                                <h2 style="margin: 0; font-size: 1rem; color: var(--primary-blue); cursor: pointer;">
                                    ${post.authorName}
                                </h2>
                                <span class="location" style="font-size: 0.75rem; color: var(--text-grey); display: block;">${timeString}</span>
                            </div>
                        </a>
                    </div>
                    ${isAuthor ? `
                        <button class="btn-outline delete-btn" data-id="${post.id}" style="border:none; color: #c5221f; padding: 5px;">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
                
                <p class="description">${escapeHtml(post.content)}</p>
            </div>
            
            <div class="post-stats">
                <div class="stats-likes" onclick="showReactorsModal('${post.id}')" style="cursor: pointer;">
                    ${reactionCount > 0 ? `
                        <span class="stats-icons">${uniqueIcons.join('')}</span>
                        <span class="stats-text">${reactionCount} تفاعل</span>
                    ` : `<span style="font-size:0.8rem; opacity:0.7">كن أول واحد يعمل واجب</span>`}
                </div>
                <div class="stats-comments" onclick="toggleComments('${post.id}')" style="cursor: pointer;">
                    ${post.commentsCount > 0 ? `${post.commentsCount} تلقيح` : ''}
                </div>
            </div>

            <div class="card-actions">
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
                    <i class="fa-regular fa-comment"></i>
                    <span>تلقيح</span>
                </div>
            </div>

            <div class="comments-section" id="comments-section-${post.id}">
                <div class="comment-list" id="comment-list-${post.id}">
                    <div style="text-align:center; padding:10px; color:var(--text-grey); font-size:0.8rem;">
                        <i class="fa-solid fa-circle-notch fa-spin"></i> تحميل التلقيح...
                    </div>
                </div>
                
                <div class="comment-input-wrapper">
                    <img src="${currentUser ? currentUser.photoURL : 'images/user.png'}" class="comment-avatar">
                    <input type="text" class="comment-input" id="comment-input-${post.id}" placeholder="لقح بالكلام يا زميلي..." autocomplete="off">
                    <button class="btn-send-comment" data-id="${post.id}">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function attachPostListeners() {
    document.querySelectorAll('.reaction-emoji').forEach(emoji => {
        emoji.addEventListener('click', async function(e) {
            e.stopPropagation();
            const postId = this.dataset.postId;
            const type = this.dataset.type;
            updateReactionUI(postId, type);
            await toggleLike(postId, type); 
        });
    });

    document.querySelectorAll('.reaction-main-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const postId = this.dataset.id;
            if (this.classList.contains('active')) {
                this.className = 'compare-check reaction-main-btn'; 
                this.innerHTML = `<i class="fa-regular fa-thumbs-up"></i> <span>واجب</span>`;
                await toggleLike(postId); 
            } else {
                updateReactionUI(postId, 'like');
                await toggleLike(postId, 'like');
            }
        });
    });

    document.querySelectorAll('.comment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            toggleComments(this.dataset.id);
        });
    });

    document.querySelectorAll('.btn-send-comment').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = this.dataset.id;
            submitComment(postId);
        });
    });

    document.querySelectorAll('.comment-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const postId = this.id.split('comment-input-')[1];
                submitComment(postId);
            }
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            if(confirm("متأكد انك عايز تمسح الكلام ده؟")) {
                const postId = this.dataset.id;
                const result = await deletePost(postId);
                if(result.success) {
                    const postEl = document.getElementById(`post-${postId}`);
                    if(postEl) postEl.remove();
                }
            }
        });
    });
}

window.toggleComments = function(postId) {
    const section = document.getElementById(`comments-section-${postId}`);
    if (section.classList.contains('show')) {
        section.classList.remove('show');
    } else {
        section.classList.add('show');
        fetchAndRenderComments(postId);
    }
};

window.showReactorsModal = async function(postId) {
    const modal = document.getElementById('reactorsModal');
    const list = document.getElementById('reactorsList');
    const loading = document.getElementById('reactorsLoading');
    
    modal.style.display = 'flex';
    list.innerHTML = '';
    loading.style.display = 'block';

    const postsResult = await getPosts(); 
    const post = postsResult.data.find(p => p.id === postId);
    
    let reactions = {};
    if (post) {
        if (Array.isArray(post.likes)) {
            post.likes.forEach(uid => reactions[uid] = 'like');
        }
        if (post.reactions) {
            Object.assign(reactions, post.reactions);
        }
    }

    const uids = Object.keys(reactions);

    if (uids.length === 0) {
        loading.style.display = 'none';
        list.innerHTML = '<p style="text-align:center; padding:1rem;">مفيش تفاعل لسه</p>';
        return;
    }

    let html = '';
    for (const uid of uids) {
        const type = reactions[uid];
        const icon = REACTION_TYPES[type]?.icon || '👍';
        const userRes = await getUserData(uid);
        const userData = userRes.success ? userRes.data : { fullName: 'زبون', photoURL: 'images/user.png' };
        html += `
            <div class="reactor-item">
                <div style="position:relative;">
                    <img src="${userData.photoURL || 'images/user.png'}" class="reactor-img">
                    <span class="reactor-icon-badge">${icon}</span>
                </div>
                <div class="reactor-info">
                    <strong>${userData.fullName || 'زبون'}</strong>
                    <span>${userData.role || 'زبون'}</span>
                </div>
            </div>
        `;
    }

    loading.style.display = 'none';
    list.innerHTML = html;
};

function injectStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        .post-stats { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; margin: 0 10px; border-bottom: 1px solid var(--border-color); font-size: 0.9rem; color: var(--text-grey); }
        .stats-icons { font-size: 1.1rem; margin-left: 5px; vertical-align: middle; }
        .stats-text:hover, .stats-comments:hover { text-decoration: underline; color: var(--primary-blue); }
        .custom-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; animation: fadeIn 0.2s; }
        .custom-modal-content { background: var(--bg-card); width: 90%; max-width: 400px; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; max-height: 80vh; }
        .custom-modal-header { padding: 15px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; font-weight: bold; color: var(--primary-blue); }
        .custom-modal-body { padding: 0; overflow-y: auto; }
        .reactor-item { display: flex; align-items: center; padding: 10px 15px; gap: 12px; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .reactor-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
        .reactor-icon-badge { position: absolute; bottom: -2px; right: -2px; background: var(--bg-card); border-radius: 50%; font-size: 14px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
        .reactor-info { display: flex; flex-direction: column; }
        .reactor-info span { font-size: 0.8rem; color: var(--text-grey); }
    `;
    document.head.appendChild(style);
}

function createReactorsModal() {
    if (document.getElementById('reactorsModal')) return;
    const div = document.createElement('div');
    div.id = 'reactorsModal';
    div.className = 'custom-modal';
    div.innerHTML = `
        <div class="custom-modal-content">
            <div class="custom-modal-header">
                <span>الناس الواجبة (التفاعل)</span>
                <span onclick="document.getElementById('reactorsModal').style.display='none'" style="cursor:pointer">&times;</span>
            </div>
            <div class="custom-modal-body">
                <div id="reactorsLoading" style="text-align:center; padding:20px;">
                    <i class="fa-solid fa-spinner fa-spin"></i> تحميل...
                </div>
                <div id="reactorsList"></div>
            </div>
        </div>
    `;
    document.body.appendChild(div);
    div.addEventListener('click', (e) => {
        if(e.target === div) div.style.display = 'none';
    });
}

async function fetchAndRenderComments(postId) {
    const list = document.getElementById(`comment-list-${postId}`);
    const result = await getComments(postId);

    if (result.success) {
        if (result.data.length === 0) {
            list.innerHTML = `<div style="text-align:center; padding:10px; color:var(--text-grey); font-size:0.8rem;">لسه مفيش تلقيح.. ابدأ انت</div>`;
        } else {
            list.innerHTML = result.data.map(comment => `
                <div class="comment-item">
                    <img src="${comment.authorImage}" class="comment-avatar">
                    <div class="comment-bubble">
                        <div class="comment-author">${comment.authorName}</div>
                        <div class="comment-text">${escapeHtml(comment.content)}</div>
                    </div>
                </div>
            `).join('');
        }
    } else {
        list.innerHTML = `<div style="color:red; text-align:center;">فشل التحميل</div>`;
    }
}

async function submitComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();
    if (!content) return;

    input.value = '';
    
    const list = document.getElementById(`comment-list-${postId}`);
    if(list.innerText.includes('لسه مفيش')) list.innerHTML = '';

    const tempDiv = document.createElement('div');
    tempDiv.className = 'comment-item';
    tempDiv.style.opacity = '0.7'; 
    tempDiv.innerHTML = `
        <img src="${currentUser.photoURL}" class="comment-avatar">
        <div class="comment-bubble">
            <div class="comment-author">${currentUser.displayName || 'أنا'}</div>
            <div class="comment-text">${escapeHtml(content)}</div>
        </div>
    `;
    list.appendChild(tempDiv);
    list.scrollTop = list.scrollHeight; 

    const result = await addComment(postId, content);

    if (result.success) {
        fetchAndRenderComments(postId);
    } else {
        alert('حصل مشكلة في التلقيح: ' + result.error);
        tempDiv.remove(); 
        input.value = content;
    }
}

function updateReactionUI(postId, type) {
    const btn = document.getElementById(`react-btn-${postId}`);
    if(!btn) return;
    const r = REACTION_TYPES[type];
    btn.className = 'compare-check reaction-main-btn active';
    btn.classList.add(r.class); 
    btn.innerHTML = `<span style="font-size:1.2rem">${r.icon}</span> <span class="reacted-text">${r.label}</span>`;
}

// function escapeHtml(text) {
//     if (!text) return "";
//     return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
// }
function escapeHtml(text) {
    if (!text) return "";
    
    // 1. تأمين النص الأول (منع تشغيل أكواد خبيثة)
    let escaped = text.replace(/&/g, "&amp;")
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                      .replace(/"/g, "&quot;")
                      .replace(/'/g, "&#039;");
                      
    // 2. تحويل الروابط للينكات قابلة للضغط (باستخدام الدالة اللي في script.js)
    if (window.linkifyText) {
        return window.linkifyText(escaped);
    }
    
    return escaped;
}