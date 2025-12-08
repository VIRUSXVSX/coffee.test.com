// import { 
//     auth, 
//     onAuthStateChanged, 
//     createPost, 
//     getPosts, 
//     toggleLike,
//     deletePost
// } from './auth-service.js';

// let currentUser = null;

// document.addEventListener('DOMContentLoaded', () => {
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
    
//     // --- CHANGED: Auto-resize logic instead of Enter-to-Submit ---
//     const postInput = document.getElementById('postInput');
//     if(postInput) {
//         postInput.addEventListener('input', function() {
//             this.style.height = 'auto'; // Reset height
//             this.style.height = (this.scrollHeight) + 'px'; // Grow to fit content
//         });
//     }
// });

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
//         input.style.height = 'auto'; // Reset height after publish
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
//     const isLiked = post.likes && currentUser && post.likes.includes(currentUser.uid);
//     const likeCount = post.likes ? post.likes.length : 0;
//     const isAuthor = currentUser && post.authorId === currentUser.uid;
    
//     let timeAgo = "دلوقتي";
//     if (post.timestamp) {
//         const seconds = (new Date() - post.timestamp.toDate()) / 1000;
//         if (seconds > 3600) timeAgo = `من ${Math.floor(seconds / 3600)} ساعة`;
//         else if (seconds > 60) timeAgo = `من ${Math.floor(seconds / 60)} دقيقة`;
//     }

//     const profileLink = isAuthor 
//         ? 'profile.html' 
//         : `user.html?uid=${post.authorId}`;

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
            
//             <div class="card-actions">
//                 <div class="compare-check like-btn ${isLiked ? 'active' : ''}" data-id="${post.id}" style="cursor: pointer;">
//                     <i class="fa-${isLiked ? 'solid' : 'regular'} fa-thumbs-up"></i>
//                     <span>${likeCount > 0 ? likeCount + ' واجب' : 'واجب'}</span>
//                 </div>
//                 <div class="compare-check" style="cursor: not-allowed; opacity: 0.6;">
//                     <i class="fa-regular fa-comment"></i>
//                     <span>تلقيح</span>
//                 </div>
//             </div>
//         </div>
//     `;
// }

// function attachPostListeners() {
//     document.querySelectorAll('.like-btn').forEach(btn => {
//         btn.addEventListener('click', async function() {
//             const postId = this.dataset.id;
//             const icon = this.querySelector('i');
//             const span = this.querySelector('span');
//             let count = parseInt(span.textContent) || 0;
            
//             if (this.classList.contains('active')) {
//                 this.classList.remove('active');
//                 icon.classList.remove('fa-solid');
//                 icon.classList.add('fa-regular');
//                 if(span.textContent.includes('واجب') && count > 0) count--; 
//             } else {
//                 this.classList.add('active');
//                 icon.classList.remove('fa-regular');
//                 icon.classList.add('fa-solid');
//                 count++;
//             }
//             span.textContent = count > 0 ? count + ' واجب' : 'واجب';

//             await toggleLike(postId);
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

// function escapeHtml(text) {
//     if (!text) return "";
//     return text
//         .replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;")
//         .replace(/"/g, "&quot;")
//         .replace(/'/g, "&#039;");
// }


























import { 
    auth, 
    onAuthStateChanged, 
    createPost, 
    getPosts, 
    toggleLike,
    deletePost,
    addComment,
    getComments,
    getUserData 
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

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            const avatar = document.getElementById('userAvatarSmall');
            if(avatar) avatar.src = user.photoURL || 'images/user.png';
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

    } else {
        feedContainer.innerHTML = `<p style="color:red; text-align:center;">حصل خطأ في تحميل المشاريب</p>`;
    }
}

function createPostHTML(post) {
    // 1. Analyze Reactions (Merge old Likes with new Reactions)
    let reactions = {};
    
    // A. Add old likes first (Default to 'like')
    if (Array.isArray(post.likes)) {
        post.likes.forEach(uid => reactions[uid] = 'like');
    }
    // B. Add/Overwrite with new reactions
    if (post.reactions) {
        Object.assign(reactions, post.reactions);
    }

    let userReactionType = null;
    if (currentUser && reactions[currentUser.uid]) {
        userReactionType = reactions[currentUser.uid];
    }
    const reactionCount = Object.keys(reactions).length;

    // Get Top 3 Unique Icons
    const uniqueIcons = [...new Set(Object.values(reactions).map(t => REACTION_TYPES[t]?.icon).filter(Boolean))].slice(0, 3);
    
    const isAuthor = currentUser && post.authorId === currentUser.uid;
    
    let timeAgo = "دلوقتي";
    if (post.timestamp) {
        const seconds = (new Date() - post.timestamp.toDate()) / 1000;
        if (seconds > 3600) timeAgo = `من ${Math.floor(seconds / 3600)} ساعة`;
        else if (seconds > 60) timeAgo = `من ${Math.floor(seconds / 60)} دقيقة`;
    }

    // Button State
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
                                <span class="location" style="font-size: 0.8rem; color: var(--text-grey); display: block;">${timeAgo}</span>
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

// --- Global Helpers ---

window.toggleComments = function(postId) {
    const section = document.getElementById(`comments-section-${postId}`);
    if (section.classList.contains('show')) {
        section.classList.remove('show');
    } else {
        section.classList.add('show');
        fetchAndRenderComments(postId);
    }
};

// FIXED: Merging Logic inside Modal
window.showReactorsModal = async function(postId) {
    const modal = document.getElementById('reactorsModal');
    const list = document.getElementById('reactorsList');
    const loading = document.getElementById('reactorsLoading');
    
    modal.style.display = 'flex';
    list.innerHTML = '';
    loading.style.display = 'block';

    const postsResult = await getPosts(); 
    const post = postsResult.data.find(p => p.id === postId);
    
    // --- FIX START: Merge Logic ---
    let reactions = {};
    if (post) {
        // 1. Add Old Likes
        if (Array.isArray(post.likes)) {
            post.likes.forEach(uid => reactions[uid] = 'like');
        }
        // 2. Add New Reactions
        if (post.reactions) {
            Object.assign(reactions, post.reactions);
        }
    }
    // --- FIX END ---

    const uids = Object.keys(reactions);

    if (uids.length === 0) {
        loading.style.display = 'none';
        list.innerHTML = '<p style="text-align:center; padding:1rem;">مفيش تفاعل لسه</p>';
        return;
    }

    let html = '';
    for (const uid of uids) {
        const type = reactions[uid];
        // Ensure we have a valid icon, default to Like if unknown
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
        .reactor-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
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

function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}