// import { 
//     auth, 
//     onAuthStateChanged, 
//     createSecret,
//     getSecrets,
//     toggleLike,
//     deletePost,
//     addComment,
//     getComments
//     // Note: getUserData is REMOVED from imports because we don't want to use it here for privacy
// } from './auth-service.js';

// let currentUser = null;

// // Config for Anonymous Look
// const ANONYMOUS_NAME = 'بير الأسرار';

// const REACTION_TYPES = {
//     like:    { icon: '👍', label: 'تسلم', class: 'color-like' },
//     love:    { icon: '❤️', label: 'حبيبي', class: 'color-love' },
//     haha:    { icon: '😂', label: 'هموت', class: 'color-haha' },
//     wow:     { icon: '😮', label: 'يا صلاة', class: 'color-wow' },
//     angry:   { icon: '😡', label: 'جرا إيه', class: 'color-angry' },
//     dislike: { icon: '👎', label: 'هبد', class: 'color-dislike' }
// };

// document.addEventListener('DOMContentLoaded', () => {
//     injectStyles(); 
//     createReactorsModal();

//     onAuthStateChanged(auth, (user) => {
//         if (user) {
//             currentUser = user;
//         } else {
//             window.location.href = 'login.html';
//         }
//         loadSecretsFeed();
//     });

//     const publishBtn = document.getElementById('publishSecretBtn');
//     if(publishBtn) publishBtn.addEventListener('click', handlePublishSecret);
    
//     const input = document.getElementById('secretInput');
//     if(input) {
//         input.addEventListener('input', function() {
//             this.style.height = 'auto'; 
//             this.style.height = (this.scrollHeight) + 'px'; 
//         });
//     }
// });

// async function handlePublishSecret() {
//     const input = document.getElementById('secretInput');
//     const content = input.value.trim();
//     const btn = document.getElementById('publishSecretBtn');

//     if (!content) return;

//     btn.disabled = true;
//     btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

//     const result = await createSecret(content);

//     if (result.success) {
//         input.value = ''; 
//         input.style.height = 'auto'; 
//         await loadSecretsFeed(); 
//     } else {
//         alert("حصلت مشكلة: " + result.error);
//     }

//     btn.disabled = false;
//     btn.innerHTML = '<i class="fa-solid fa-ghost"></i> انشر في السر';
// }

// async function loadSecretsFeed() {
//     const feedContainer = document.getElementById('secretsFeed');
//     if(!feedContainer) return;

//     const result = await getSecrets();

//     if (result.success) {
//         const secrets = result.data;
        
//         if (secrets.length === 0) {
//             feedContainer.innerHTML = `
//                 <div style="text-align: center; padding: 3rem; color: var(--text-grey);">
//                     <i class="fa-solid fa-wind" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
//                     <h3>البير فاضي</h3>
//                     <p>محدش فضفض لسه.. ابدأ انت</p>
//                 </div>
//             `;
//             return;
//         }

//         feedContainer.innerHTML = secrets.map(post => createSecretHTML(post)).join('');
//         attachSecretListeners();

//     } else {
//         feedContainer.innerHTML = `<p style="color:red; text-align:center;">حصل خطأ في تحميل الأسرار</p>`;
//     }
// }

// function createSecretHTML(post) {
//     let reactions = post.reactions || {};
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
//         btnContent = `<i class="fa-regular fa-thumbs-up"></i> <span>تضامن</span>`;
//     }

//     return `
//         <div class="uni-card secret-card" id="post-${post.id}">
//             <div class="uni-content">
//                 <div style="display: flex; justify-content: space-between; align-items: flex-start;">
//                     <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 1rem;">
//                         <div class="anon-avatar-circle">
//                             <i class="fa-solid fa-user-secret"></i>
//                         </div>
//                         <div>
//                             <h2 style="margin: 0; font-size: 1rem; color: #2C1810; font-family: 'Courier New', sans-serif; font-weight:bold;">
//                                 ${ANONYMOUS_NAME}
//                             </h2>
//                             <span class="location" style="font-size: 0.8rem; color: var(--text-grey); display: block;">${timeAgo}</span>
//                         </div>
//                     </div>
//                     ${isAuthor ? `
//                         <button class="btn-outline delete-btn" data-id="${post.id}" style="border:none; color: #c5221f; padding: 5px;">
//                             <i class="fa-solid fa-trash"></i>
//                         </button>
//                     ` : ''}
//                 </div>
                
//                 <p class="description" style="font-size: 1.1rem; color: url(--text-dark);">${escapeHtml(post.content)}</p>
//             </div>
            
//             <div class="post-stats">
//                 <div class="stats-likes" onclick="showReactorsModal('${post.id}')" style="cursor: pointer;">
//                     ${reactionCount > 0 ? `
//                         <span class="stats-icons">${uniqueIcons.join('')}</span>
//                         <span class="stats-text">${reactionCount} تضامن</span>
//                     ` : `<span style="font-size:0.8rem; opacity:0.7">مفيش تضامن لسه</span>`}
//                 </div>
//                 <div class="stats-comments" onclick="toggleComments('${post.id}')" style="cursor: pointer;">
//                     ${post.commentsCount > 0 ? `${post.commentsCount} نصيحة` : ''}
//                 </div>
//             </div>

//             <div class="card-actions">
//                 <div class="reaction-wrapper">
//                     <div class="reaction-picker">
//                         <div class="reaction-emoji" data-type="like" data-post-id="${post.id}" data-label="الله يعينك">👍</div>
//                         <div class="reaction-emoji" data-type="love" data-post-id="${post.id}" data-label="قلبي معاك">❤️</div>
//                         <div class="reaction-emoji" data-type="wow" data-post-id="${post.id}" data-label="ربنا يستر">😮</div>
//                         <div class="reaction-emoji" data-type="angry" data-post-id="${post.id}" data-label="معلش">😡</div>
//                     </div>
//                     <div class="compare-check reaction-main-btn ${activeClass}" id="react-btn-${post.id}" data-id="${post.id}">
//                         ${btnContent}
//                     </div>
//                 </div>

//                 <div class="compare-check comment-btn" data-id="${post.id}">
//                     <i class="fa-regular fa-comment-dots"></i>
//                     <span>نصيحة</span>
//                 </div>
//             </div>

//             <div class="comments-section" id="comments-section-${post.id}">
//                 <div class="comment-list" id="comment-list-${post.id}">
//                     <div style="text-align:center; padding:10px; color:var(--text-grey); font-size:0.8rem;">
//                         <i class="fa-solid fa-circle-notch fa-spin"></i> تحميل النصايح...
//                     </div>
//                 </div>
                
//                 <div class="comment-input-wrapper">
//                     <div class="anon-avatar-small" style="margin-left:5px;">
//                         <i class="fa-solid fa-user-secret"></i>
//                     </div>
//                     <input type="text" class="comment-input" id="comment-input-${post.id}" placeholder="اكتب نصيحة أو كلمة حلوة..." autocomplete="off">
//                     <button class="btn-send-comment" data-id="${post.id}">
//                         <i class="fa-solid fa-paper-plane"></i>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     `;
// }

// function attachSecretListeners() {
//     document.querySelectorAll('.reaction-emoji').forEach(emoji => {
//         emoji.addEventListener('click', async function(e) {
//             e.stopPropagation();
//             const postId = this.dataset.postId;
//             const type = this.dataset.type;
//             updateReactionUI(postId, type);
//             await toggleLike(postId, type, 'secrets'); 
//         });
//     });

//     document.querySelectorAll('.reaction-main-btn').forEach(btn => {
//         btn.addEventListener('click', async function() {
//             const postId = this.dataset.id;
//             if (this.classList.contains('active')) {
//                 this.className = 'compare-check reaction-main-btn'; 
//                 this.innerHTML = `<i class="fa-regular fa-thumbs-up"></i> <span>تضامن</span>`;
//                 await toggleLike(postId, null, 'secrets'); 
//             } else {
//                 updateReactionUI(postId, 'like');
//                 await toggleLike(postId, 'like', 'secrets');
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
//             if(confirm("عايز تمسح السر ده؟")) {
//                 const postId = this.dataset.id;
//                 const result = await deletePost(postId, 'secrets');
//                 if(result.success) {
//                     const postEl = document.getElementById(`post-${postId}`);
//                     if(postEl) postEl.remove();
//                 }
//             }
//         });
//     });
// }

// // Helpers
// window.toggleComments = function(postId) {
//     const section = document.getElementById(`comments-section-${postId}`);
//     if (section.classList.contains('show')) {
//         section.classList.remove('show');
//     } else {
//         section.classList.add('show');
//         fetchAndRenderComments(postId);
//     }
// };

// // --- ANONYMOUS REACTIONS MODAL ---
// window.showReactorsModal = async function(postId) {
//     const modal = document.getElementById('reactorsModal');
//     const list = document.getElementById('reactorsList');
//     const loading = document.getElementById('reactorsLoading');
    
//     modal.style.display = 'flex';
//     list.innerHTML = '';
//     loading.style.display = 'block';

//     const postsResult = await getSecrets(); 
//     const post = postsResult.data.find(p => p.id === postId);
    
//     if (!post || !post.reactions || Object.keys(post.reactions).length === 0) {
//         loading.style.display = 'none';
//         list.innerHTML = '<p style="text-align:center; padding:1rem;">مفيش تضامن لسه</p>';
//         return;
//     }

//     const reactions = post.reactions;
//     const uids = Object.keys(reactions);
//     let html = '';
    
//     // Loop through UIDs but DO NOT fetch user data. 
//     // Always render anonymous.
//     for (const uid of uids) {
//         const type = reactions[uid];
//         const icon = REACTION_TYPES[type]?.icon || '👍';
        
//         // Static Anonymous Data
//         html += `
//             <div class="reactor-item">
//                 <div style="position:relative;">
//                     <div class="anon-avatar-small">
//                         <i class="fa-solid fa-user-secret"></i>
//                     </div>
//                     <span class="reactor-icon-badge">${icon}</span>
//                 </div>
//                 <div class="reactor-info">
//                     <strong>مشارك</strong>
//                     <span>مجهول</span>
//                 </div>
//             </div>
//         `;
//     }
//     //     html += `
//     //         <div class="reactor-item">
//     //             <div style="position:relative;">
//     //                 <div class="anon-avatar-small">
//     //                     <i class="fa-solid fa-user-secret"></i>
//     //                 </div>
//     //                 <span class="reactor-icon-badge">${icon}</span>
//     //             </div>
//     //             <div class="reactor-info">
//     //                 <strong>فاعل خير</strong>
//     //                 <span>مجهول</span>
//     //             </div>
//     //         </div>
//     //     `;
//     // }

//     loading.style.display = 'none';
//     list.innerHTML = html;
// };

// async function fetchAndRenderComments(postId) {
//     const list = document.getElementById(`comment-list-${postId}`);
//     const result = await getComments(postId, 'secrets');

//     if (result.success) {
//         if (result.data.length === 0) {
//             list.innerHTML = `<div style="text-align:center; padding:10px; color:var(--text-grey); font-size:0.8rem;">لسه مفيش نصايح.. كن أول واحد</div>`;
//         } else {
//             list.innerHTML = result.data.map(comment => `
//                 <div class="comment-item">
//                     <div class="anon-avatar-small">
//                         <i class="fa-solid fa-user-secret"></i>
//                     </div>
//                     <div class="comment-bubble">
//                         <div class="comment-author">مشارك</div>
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
//         <div class="anon-avatar-small">
//             <i class="fa-solid fa-user-secret"></i>
//         </div>
//         <div class="comment-bubble">
//             <div class="comment-author">مشارك</div>
//             <div class="comment-text">${escapeHtml(content)}</div>
//         </div>
//     `;
//     list.appendChild(tempDiv);
//     list.scrollTop = list.scrollHeight; 

//     // 'secrets' passed here tells auth-service to save name as "فاعل خير" in DB
//     const result = await addComment(postId, content, 'secrets');

//     if (result.success) {
//         fetchAndRenderComments(postId);
//     } else {
//         alert('حصل مشكلة: ' + result.error);
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
//     return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// }

// function injectStyles() {
//     const style = document.createElement('style');
//     // style.innerHTML = `
//     //     .secret-card {
//     //         background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0wIDBMNCA0Wk00IDBMMCA0WiIgc3Ryb2tlPSIjZjJmMmYyIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+');
//     //         border-left: 5px solid #2C1810;
//     //     }
//     style.innerHTML = `
//         .secret-card {
//             border-left: 5px solid #2C1810;
//         }
//         .anon-avatar-circle {
//             width: 45px; height: 45px; border-radius: 50%;
//             background: #2C1810; display: flex; align-items: center; justify-content: center;
//             color: #C19A6B; font-size: 1.5rem;
//         }
//         .anon-avatar-small {
//             width: 32px; height: 32px; border-radius: 50%;
//             background: #4A3424; display: flex; align-items: center; justify-content: center;
//             color: #fff; font-size: 1rem; flex-shrink: 0;
//         }
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
//                 <span>المتضامنين</span>
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


















import { 
    auth, 
    onAuthStateChanged, 
    createSecret,
    getSecrets,
    toggleLike,
    deletePost,
    addComment,
    getComments
    // Note: getUserData is REMOVED from imports because we don't want to use it here for privacy
} from './auth-service.js';

let currentUser = null;

// Config for Anonymous Look
const ANONYMOUS_NAME = ' مجهول';
// const ANONYMOUS_NAME = 'بير الأسرار';

const REACTION_TYPES = {
    like:    { icon: '👍', label: 'تسلم', class: 'color-like' },
    love:    { icon: '❤️', label: 'حبيبي', class: 'color-love' },
    haha:    { icon: '😂', label: 'هموت', class: 'color-haha' },
    wow:     { icon: '😮', label: 'يا صلاة', class: 'color-wow' },
    angry:   { icon: '😡', label: 'جرا إيه', class: 'color-angry' },
    dislike: { icon: '👎', label: 'هبد', class: 'color-dislike' }
};

document.addEventListener('DOMContentLoaded', () => {
    injectStyles(); 
    createReactorsModal();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
        } else {
            window.location.href = 'login.html';
        }
        loadSecretsFeed();
    });

    const publishBtn = document.getElementById('publishSecretBtn');
    if(publishBtn) publishBtn.addEventListener('click', handlePublishSecret);
    
    const input = document.getElementById('secretInput');
    if(input) {
        input.addEventListener('input', function() {
            this.style.height = 'auto'; 
            this.style.height = (this.scrollHeight) + 'px'; 
        });
    }
});

async function handlePublishSecret() {
    const input = document.getElementById('secretInput');
    const content = input.value.trim();
    const btn = document.getElementById('publishSecretBtn');

    if (!content) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

    const result = await createSecret(content);

    if (result.success) {
        input.value = ''; 
        input.style.height = 'auto'; 
        await loadSecretsFeed(); 
    } else {
        alert("حصلت مشكلة: " + result.error);
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-ghost"></i> انشر في السر';
}

async function loadSecretsFeed() {
    const feedContainer = document.getElementById('secretsFeed');
    if(!feedContainer) return;

    const result = await getSecrets();

    if (result.success) {
        const secrets = result.data;
        
        if (secrets.length === 0) {
            feedContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-grey);">
                    <i class="fa-solid fa-wind" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>البير فاضي</h3>
                    <p>محدش فضفض لسه.. ابدأ انت</p>
                </div>
            `;
            return;
        }

        feedContainer.innerHTML = secrets.map(post => createSecretHTML(post)).join('');
        attachSecretListeners();

    } else {
        feedContainer.innerHTML = `<p style="color:red; text-align:center;">حصل خطأ في تحميل الأسرار</p>`;
    }
}

function createSecretHTML(post) {
    let reactions = post.reactions || {};
    let userReactionType = null;
    if (currentUser && reactions[currentUser.uid]) {
        userReactionType = reactions[currentUser.uid];
    }
    
    const reactionCount = Object.keys(reactions).length;
    const uniqueIcons = [...new Set(Object.values(reactions).map(t => REACTION_TYPES[t]?.icon).filter(Boolean))].slice(0, 3);
    
    const isAuthor = currentUser && post.authorId === currentUser.uid;
    
    // --- UPDATED: Detailed Time Format like Dashboard ---
    let timeString = "منذ فترة";
    if (post.timestamp) {
        const date = post.timestamp.toDate();
        // تنسيق التاريخ الكامل: الجمعة، 12 سبتمبر...
        timeString = date.toLocaleDateString('ar-EG', {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }
    // ----------------------------------------------------

    let activeClass = '';
    let btnContent = '';
    if (userReactionType && REACTION_TYPES[userReactionType]) {
        const r = REACTION_TYPES[userReactionType];
        activeClass = `active ${r.class}`; 
        btnContent = `<span style="font-size:1.2rem">${r.icon}</span> <span class="reacted-text">${r.label}</span>`;
    } else {
        btnContent = `<i class="fa-regular fa-thumbs-up"></i> <span>تضامن</span>`;
    }

    return `
        <div class="uni-card secret-card" id="post-${post.id}">
            <div class="uni-content">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 1rem;">
                        <div class="anon-avatar-circle">
                            <i class="fa-solid fa-user-secret"></i>
                        </div>
                        <div>
                            <h2 style="margin: 0; font-size: 1rem;  font-family: 'Courier New', sans-serif; font-weight:bold;">
                                ${ANONYMOUS_NAME}
                            </h2>
                            <span class="location" style="font-size: 0.8rem; color: var(--text-grey); display: block;">${timeString}</span>
                        </div>
                    </div>
                    ${isAuthor ? `
                        <button class="btn-outline delete-btn" data-id="${post.id}" style="border:none; color: #c5221f; padding: 5px;">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
                
                <p class="description" style="font-size: 1.1rem; color: url(--text-dark);">${escapeHtml(post.content)}</p>
            </div>
            
            <div class="post-stats">
                <div class="stats-likes" onclick="showReactorsModal('${post.id}')" style="cursor: pointer;">
                    ${reactionCount > 0 ? `
                        <span class="stats-icons">${uniqueIcons.join('')}</span>
                        <span class="stats-text">${reactionCount} تضامن</span>
                    ` : `<span style="font-size:0.8rem; opacity:0.7">مفيش تضامن لسه</span>`}
                </div>
                <div class="stats-comments" onclick="toggleComments('${post.id}')" style="cursor: pointer;">
                    ${post.commentsCount > 0 ? `${post.commentsCount} نصيحة` : ''}
                </div>
            </div>

            <div class="card-actions">
                <div class="reaction-wrapper">
                    <div class="reaction-picker">
                        <div class="reaction-emoji" data-type="like" data-post-id="${post.id}" data-label="الله يعينك">👍</div>
                        <div class="reaction-emoji" data-type="love" data-post-id="${post.id}" data-label="قلبي معاك">❤️</div>
                        <div class="reaction-emoji" data-type="wow" data-post-id="${post.id}" data-label="ربنا يستر">😮</div>
                        <div class="reaction-emoji" data-type="angry" data-post-id="${post.id}" data-label="معلش">😡</div>
                    </div>
                    <div class="compare-check reaction-main-btn ${activeClass}" id="react-btn-${post.id}" data-id="${post.id}">
                        ${btnContent}
                    </div>
                </div>

                <div class="compare-check comment-btn" data-id="${post.id}">
                    <i class="fa-regular fa-comment-dots"></i>
                    <span>نصيحة</span>
                </div>
            </div>

            <div class="comments-section" id="comments-section-${post.id}">
                <div class="comment-list" id="comment-list-${post.id}">
                    <div style="text-align:center; padding:10px; color:var(--text-grey); font-size:0.8rem;">
                        <i class="fa-solid fa-circle-notch fa-spin"></i> تحميل النصايح...
                    </div>
                </div>
                
                <div class="comment-input-wrapper">
                    <div class="anon-avatar-small" style="margin-left:5px;">
                        <i class="fa-solid fa-user-secret"></i>
                    </div>
                    <input type="text" class="comment-input" id="comment-input-${post.id}" placeholder="اكتب نصيحة أو كلمة حلوة..." autocomplete="off">
                    <button class="btn-send-comment" data-id="${post.id}">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}
//     return `
//         <div class="uni-card secret-card" id="post-${post.id}">
//             <div class="uni-content">
//                 <div style="display: flex; justify-content: space-between; align-items: flex-start;">
//                     <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 1rem;">
//                         <div class="anon-avatar-circle">
//                             <i class="fa-solid fa-user-secret"></i>
//                         </div>
//                         <div>
//                             <h2 style="margin: 0; font-size: 1rem; color: #2C1810; font-family: 'Courier New', sans-serif; font-weight:bold;">
//                                 ${ANONYMOUS_NAME}
//                             </h2>
//                             <span class="location" style="font-size: 0.8rem; color: var(--text-grey); display: block;">${timeString}</span>
//                         </div>
//                     </div>
//                     ${isAuthor ? `
//                         <button class="btn-outline delete-btn" data-id="${post.id}" style="border:none; color: #c5221f; padding: 5px;">
//                             <i class="fa-solid fa-trash"></i>
//                         </button>
//                     ` : ''}
//                 </div>
                
//                 <p class="description" style="font-size: 1.1rem; color: url(--text-dark);">${escapeHtml(post.content)}</p>
//             </div>
            
//             <div class="post-stats">
//                 <div class="stats-likes" onclick="showReactorsModal('${post.id}')" style="cursor: pointer;">
//                     ${reactionCount > 0 ? `
//                         <span class="stats-icons">${uniqueIcons.join('')}</span>
//                         <span class="stats-text">${reactionCount} تضامن</span>
//                     ` : `<span style="font-size:0.8rem; opacity:0.7">مفيش تضامن لسه</span>`}
//                 </div>
//                 <div class="stats-comments" onclick="toggleComments('${post.id}')" style="cursor: pointer;">
//                     ${post.commentsCount > 0 ? `${post.commentsCount} نصيحة` : ''}
//                 </div>
//             </div>

//             <div class="card-actions">
//                 <div class="reaction-wrapper">
//                     <div class="reaction-picker">
//                         <div class="reaction-emoji" data-type="like" data-post-id="${post.id}" data-label="الله يعينك">👍</div>
//                         <div class="reaction-emoji" data-type="love" data-post-id="${post.id}" data-label="قلبي معاك">❤️</div>
//                         <div class="reaction-emoji" data-type="wow" data-post-id="${post.id}" data-label="ربنا يستر">😮</div>
//                         <div class="reaction-emoji" data-type="angry" data-post-id="${post.id}" data-label="معلش">😡</div>
//                     </div>
//                     <div class="compare-check reaction-main-btn ${activeClass}" id="react-btn-${post.id}" data-id="${post.id}">
//                         ${btnContent}
//                     </div>
//                 </div>

//                 <div class="compare-check comment-btn" data-id="${post.id}">
//                     <i class="fa-regular fa-comment-dots"></i>
//                     <span>نصيحة</span>
//                 </div>
//             </div>

//             <div class="comments-section" id="comments-section-${post.id}">
//                 <div class="comment-list" id="comment-list-${post.id}">
//                     <div style="text-align:center; padding:10px; color:var(--text-grey); font-size:0.8rem;">
//                         <i class="fa-solid fa-circle-notch fa-spin"></i> تحميل النصايح...
//                     </div>
//                 </div>
                
//                 <div class="comment-input-wrapper">
//                     <div class="anon-avatar-small" style="margin-left:5px;">
//                         <i class="fa-solid fa-user-secret"></i>
//                     </div>
//                     <input type="text" class="comment-input" id="comment-input-${post.id}" placeholder="اكتب نصيحة أو كلمة حلوة..." autocomplete="off">
//                     <button class="btn-send-comment" data-id="${post.id}">
//                         <i class="fa-solid fa-paper-plane"></i>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     `;
// }

function attachSecretListeners() {
    document.querySelectorAll('.reaction-emoji').forEach(emoji => {
        emoji.addEventListener('click', async function(e) {
            e.stopPropagation();
            const postId = this.dataset.postId;
            const type = this.dataset.type;
            updateReactionUI(postId, type);
            await toggleLike(postId, type, 'secrets'); 
        });
    });

    document.querySelectorAll('.reaction-main-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const postId = this.dataset.id;
            if (this.classList.contains('active')) {
                this.className = 'compare-check reaction-main-btn'; 
                this.innerHTML = `<i class="fa-regular fa-thumbs-up"></i> <span>تضامن</span>`;
                await toggleLike(postId, null, 'secrets'); 
            } else {
                updateReactionUI(postId, 'like');
                await toggleLike(postId, 'like', 'secrets');
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
            if(confirm("عايز تمسح السر ده؟")) {
                const postId = this.dataset.id;
                const result = await deletePost(postId, 'secrets');
                if(result.success) {
                    const postEl = document.getElementById(`post-${postId}`);
                    if(postEl) postEl.remove();
                }
            }
        });
    });
}

// Helpers
window.toggleComments = function(postId) {
    const section = document.getElementById(`comments-section-${postId}`);
    if (section.classList.contains('show')) {
        section.classList.remove('show');
    } else {
        section.classList.add('show');
        fetchAndRenderComments(postId);
    }
};

// --- ANONYMOUS REACTIONS MODAL ---
window.showReactorsModal = async function(postId) {
    const modal = document.getElementById('reactorsModal');
    const list = document.getElementById('reactorsList');
    const loading = document.getElementById('reactorsLoading');
    
    modal.style.display = 'flex';
    list.innerHTML = '';
    loading.style.display = 'block';

    const postsResult = await getSecrets(); 
    const post = postsResult.data.find(p => p.id === postId);
    
    if (!post || !post.reactions || Object.keys(post.reactions).length === 0) {
        loading.style.display = 'none';
        list.innerHTML = '<p style="text-align:center; padding:1rem;">مفيش تضامن لسه</p>';
        return;
    }

    const reactions = post.reactions;
    const uids = Object.keys(reactions);
    let html = '';
    
    // Loop through UIDs but DO NOT fetch user data. 
    // Always render anonymous.
    for (const uid of uids) {
        const type = reactions[uid];
        const icon = REACTION_TYPES[type]?.icon || '👍';
        
        // Static Anonymous Data
        html += `
            <div class="reactor-item">
                <div style="position:relative;">
                    <div class="anon-avatar-small">
                        <i class="fa-solid fa-user-secret"></i>
                    </div>
                    <span class="reactor-icon-badge">${icon}</span>
                </div>
                <div class="reactor-info">
                    <strong>مشارك</strong>
                    <span>مجهول</span>
                </div>
            </div>
        `;
    }

    loading.style.display = 'none';
    list.innerHTML = html;
};

async function fetchAndRenderComments(postId) {
    const list = document.getElementById(`comment-list-${postId}`);
    const result = await getComments(postId, 'secrets');

    if (result.success) {
        if (result.data.length === 0) {
            list.innerHTML = `<div style="text-align:center; padding:10px; color:var(--text-grey); font-size:0.8rem;">لسه مفيش نصايح.. كن أول واحد</div>`;
        } else {
            list.innerHTML = result.data.map(comment => `
                <div class="comment-item">
                    <div class="anon-avatar-small">
                        <i class="fa-solid fa-user-secret"></i>
                    </div>
                    <div class="comment-bubble">
                        <div class="comment-author">مشارك</div>
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
        <div class="anon-avatar-small">
            <i class="fa-solid fa-user-secret"></i>
        </div>
        <div class="comment-bubble">
            <div class="comment-author">مشارك</div>
            <div class="comment-text">${escapeHtml(content)}</div>
        </div>
    `;
    list.appendChild(tempDiv);
    list.scrollTop = list.scrollHeight; 

    // 'secrets' passed here tells auth-service to save name as "فاعل خير" in DB
    const result = await addComment(postId, content, 'secrets');

    if (result.success) {
        fetchAndRenderComments(postId);
    } else {
        alert('حصل مشكلة: ' + result.error);
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

function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function injectStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        .secret-card {
            border-left: 5px solid #2C1810;
        }
        .anon-avatar-circle {
            width: 45px; height: 45px; border-radius: 50%;
            background: #2C1810; display: flex; align-items: center; justify-content: center;
            color: #C19A6B; font-size: 1.5rem;
        }
        .anon-avatar-small {
            width: 32px; height: 32px; border-radius: 50%;
            background: #4A3424; display: flex; align-items: center; justify-content: center;
            color: #fff; font-size: 1rem; flex-shrink: 0;
        }
        .post-stats {
            display: flex; justify-content: space-between; align-items: center;
            padding: 8px 0; margin: 0 10px; border-bottom: 1px solid var(--border-color);
            font-size: 0.9rem; color: var(--text-grey);
        }
        .stats-icons { font-size: 1.1rem; margin-left: 5px; vertical-align: middle; }
        .stats-text:hover, .stats-comments:hover { text-decoration: underline; color: var(--primary-blue); }
        .custom-modal {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center;
            animation: fadeIn 0.2s;
        }
        .custom-modal-content {
            background: var(--bg-card); width: 90%; max-width: 400px;
            border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;
            max-height: 80vh;
        }
        .custom-modal-header {
            padding: 15px; border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; font-weight: bold; color: var(--primary-blue);
        }
        .custom-modal-body { padding: 0; overflow-y: auto; }
        .reactor-item {
            display: flex; align-items: center; padding: 10px 15px; gap: 12px;
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .reactor-icon-badge {
            position: absolute; bottom: -2px; right: -2px;
            background: var(--bg-card); border-radius: 50%;
            font-size: 14px; width: 20px; height: 20px;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
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
                <span>المتضامنين</span>
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