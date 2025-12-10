import { 
    auth, 
    onAuthStateChanged, 
    getUserData, 
    getUserPosts, 
    deletePost,
    addComment,
    getComments,
    toggleLike,
    getUserFriends
} from './auth-service.js';

let currentUser = null;
let userData = null;

const REACTION_TYPES = {
    like:    { icon: '👍', label: 'تسلم', class: 'color-like' },
    love:    { icon: '❤️', label: 'حبيبي', class: 'color-love' },
    haha:    { icon: '😂', label: 'هموت', class: 'color-haha' },
    wow:     { icon: '😮', label: 'يا صلاة', class: 'color-wow' },
    angry:   { icon: '😡', label: 'جرا إيه', class: 'color-angry' },
    dislike: { icon: '👎', label: 'هبد', class: 'color-dislike' }
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
    injectStylesProfile();
    createReactorsModalProfile();

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            await loadUserData();
            await loadUserStatsAndPosts();
            await loadMyFriends();
        } else {
            window.location.href = 'login.html';
        }
    });
});

async function loadUserData() {
    const result = await getUserData(currentUser.uid);
    if (result.success) {
        userData = result.data;
        updateProfileInfo(); 
    }
}

function updateProfileInfo() {
    const imgEl = document.getElementById('profileImage');
    const nameEl = document.getElementById('userName');
    const eduEl = document.getElementById('userEducation');
    const emailEl = document.getElementById('userEmail');
    const bioEl = document.getElementById('userBio');

    if(imgEl) imgEl.src = userData.profileImage || 'images/user.png';
    
    // --- Display Signature Drink ---
    if(nameEl) {
        let nameHtml = userData.fullName || 'الزبون';
        // Check if drink exists in map
        if (userData.signatureDrink && DRINKS_MAP[userData.signatureDrink]) {
            nameHtml += ` <div style="font-size: 0.8rem; background: #fff8e1; color: #f57f17; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-top: 5px; border: 1px solid #ffe082; vertical-align: middle;">
                طلبك: ${DRINKS_MAP[userData.signatureDrink]}
            </div>`;
        }
        nameEl.innerHTML = nameHtml;
    }

    if(eduEl) eduEl.textContent = userData.educationLevel || 'زبون جديد';
    if(bioEl) bioEl.textContent = userData.bio || 'أنا جديد في القهوة';
    if(emailEl) emailEl.textContent = currentUser.email;

    const rankEl = document.getElementById('userRank');
    if(rankEl) rankEl.textContent = userData.role || 'زبون'; 
}

async function loadMyFriends() {
    const listEl = document.getElementById('myFriendsList');
    if(!listEl) return;
    
    const result = await getUserFriends(currentUser.uid);
    if(result.success) {
        if(result.data.length === 0) {
            listEl.innerHTML = '<p style="color:var(--text-grey); font-size:0.9rem;">لسه مفيش حد في الشلة.</p>';
        } else {
            listEl.innerHTML = result.data.map(f => `
                <div onclick="window.location.href='user.html?uid=${f.id}'" style="display:inline-flex; flex-direction:column; align-items:center; margin:5px; cursor:pointer; width:60px;">
                    <img src="${f.profileImage || f.photoURL || 'images/user.png'}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid var(--border-color);">
                    <span style="font-size:0.7rem; color:var(--text-dark); overflow:hidden; white-space:nowrap; text-overflow:ellipsis; width:100%; text-align:center;">
                        ${(f.fullName||'زبون').split(' ')[0]}
                    </span>
                </div>
            `).join('');
        }
    }
}

async function loadUserStatsAndPosts() {
    const postsListEl = document.getElementById('userPostsList');
    
    // Fetch posts
    const result = await getUserPosts(currentUser.uid);

    if (result.success) {
        const posts = result.data;
        
        // Calculate Stats
        const totalPosts = posts.length;
        let totalLikes = 0;
        let totalComments = 0;

        posts.forEach(p => {
            let reactionCount = 0;
            if(p.reactions) reactionCount = Object.keys(p.reactions).length;
            if(Array.isArray(p.likes)) reactionCount = Math.max(reactionCount, p.likes.length);
            
            totalLikes += reactionCount;
            if(p.commentsCount) totalComments += p.commentsCount;
        });

        document.getElementById('totalPosts').textContent = totalPosts;
        document.getElementById('totalLikes').textContent = totalLikes;
        if(document.getElementById('postsCountBadge')) {
            document.getElementById('postsCountBadge').textContent = totalPosts;
        }

        // Render Posts
        if (posts.length === 0) {
            postsListEl.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 2rem;">
                    <i class="fa-solid fa-mug-saucer" style="font-size: 3rem; color: var(--border-color); margin-bottom: 1rem;"></i>
                    <h3>لسه منزلش حاجة</h3>
                    <p>روح الصالة ونزل أول بوست ليك</p>
                    <button class="btn-primary" onclick="window.location.href='dashboard.html'" style="margin-top: 1rem;">
                        روح الصالة
                    </button>
                </div>
            `;
        } else {
            postsListEl.innerHTML = posts.map(post => createProfilePostHTML(post)).join('');
            attachProfileListeners();
        }
    } else {
        postsListEl.innerHTML = `<p style="color:red">حصل خطأ في تحميل البوستات: ${result.error || ''}</p>`;
    }
}

function createProfilePostHTML(post) {
    let reactions = {};
    if (Array.isArray(post.likes)) {
        post.likes.forEach(uid => reactions[uid] = 'like');
    }
    if (post.reactions) {
        Object.assign(reactions, post.reactions);
    }
    
    const reactionCount = Object.keys(reactions).length;
    const uniqueIcons = [...new Set(Object.values(reactions).map(t => REACTION_TYPES[t]?.icon).filter(Boolean))].slice(0, 3);

    return `
        <div class="uni-card" id="post-${post.id}" style="border: 1px solid var(--border-color); padding: 1.5rem; margin-bottom: 1rem; border-radius: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="color: var(--text-grey); font-size: 0.9rem;">
                     ${post.timestamp ? new Date(post.timestamp.toDate()).toLocaleDateString('ar-EG') : 'دلوقتي'}
                </span>
                <button class="btn-danger-light delete-btn" data-id="${post.id}" style="cursor:pointer; padding: 5px 10px; font-size: 0.9rem; color:#c5221f; background: rgba(197, 34, 31, 0.1); border: none; border-radius: 5px;">
                    <i class="fa-solid fa-trash"></i> مسح
                </button>
            </div>
            
            <p style="white-space: pre-wrap; margin-bottom: 1rem; font-size: 1.05rem;">${escapeHtml(post.content)}</p>
            
            <div class="post-stats" style="margin: 0; padding: 10px 0;">
                <div class="stats-likes" onclick="showReactorsModal('${post.id}')" style="cursor: pointer;">
                    ${reactionCount > 0 ? `
                        <span class="stats-icons">${uniqueIcons.join('')}</span>
                        <span class="stats-text">${reactionCount} واجب</span>
                    ` : `<span style="font-size:0.8rem; opacity:0.7">مفيش واجب لسه</span>`}
                </div>
                <div class="stats-comments" onclick="toggleCommentsProfile('${post.id}')" style="cursor: pointer;">
                    ${post.commentsCount > 0 ? `${post.commentsCount} تلقيح` : ''}
                </div>
            </div>

            <div class="card-actions" style="border-top: none; padding-top: 5px; display: flex; gap: 20px;">
                <div class="comment-btn-profile" onclick="toggleCommentsProfile('${post.id}')" style="cursor: pointer; color: var(--text-grey); transition: 0.2s;">
                    <i class="fa-regular fa-comment"></i> <span>تلقيح</span>
                </div>
            </div>

            <div class="comments-section" id="comments-section-${post.id}" style="display: none;  padding: 10px; margin-top: 10px; border-radius: 8px;">
                <div class="comment-list" id="comment-list-${post.id}" style="max-height: 200px; overflow-y: auto; margin-bottom: 10px;">
                    <div style="text-align:center; font-size:0.8rem; color:grey;">
                        <i class="fa-solid fa-spinner fa-spin"></i> تحميل...
                    </div>
                </div>
                
                <div class="comment-input-wrapper" style="display: flex; gap: 5px;">
                    <input type="text" class="comment-input" id="comment-input-${post.id}" placeholder="رد على الكلام..." style="flex:1; padding:8px; border-radius:20px; border:1px solid #ccc;">
                    <button class="btn-send-comment" data-id="${post.id}" style="background:none; border:none; color:var(--primary-blue); cursor:pointer;">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function attachProfileListeners() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            if(confirm("عايز تمسح البوست ده؟")) {
                const pid = this.dataset.id;
                await deletePost(pid);
                document.getElementById(`post-${pid}`).remove();
                
                const countEl = document.getElementById('totalPosts');
                if(countEl) countEl.textContent = Math.max(0, parseInt(countEl.textContent) - 1);
            }
        });
    });

    document.querySelectorAll('.btn-send-comment').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = this.dataset.id;
            submitCommentProfile(postId);
        });
    });
}

// Global Helpers
window.toggleCommentsProfile = function(postId) {
    const section = document.getElementById(`comments-section-${postId}`);
    if (section.style.display === 'none' || section.style.display === '') {
        section.style.display = 'block';
        fetchAndRenderComments(postId);
    } else {
        section.style.display = 'none';
    }
};

window.showReactorsModal = async function(postId) {
    const modal = document.getElementById('reactorsModal');
    const list = document.getElementById('reactorsList');
    
    modal.style.display = 'flex';
    list.innerHTML = 'تحميل...';

    const postsResult = await getUserPosts(currentUser.uid); 
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
                    <img src="${userData.profileImage || userData.photoURL || 'images/user.png'}" class="reactor-img">
                    <span class="reactor-icon-badge">${icon}</span>
                </div>
                <div class="reactor-info">
                    <strong>${userData.fullName || 'زبون'}</strong>
                    <span>${userData.role || 'زبون'}</span>
                </div>
            </div>
        `;
    }
    list.innerHTML = html;
};

async function fetchAndRenderComments(postId) {
    const list = document.getElementById(`comment-list-${postId}`);
    const result = await getComments(postId);

    if (result.success) {
        if (result.data.length === 0) {
            list.innerHTML = `<div style="text-align:center; padding:5px; font-size:0.8rem; color:grey;">محدش لسه علق</div>`;
        } else {
            list.innerHTML = result.data.map(comment => `
                <div style="display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-start;">
                    <img src="${comment.authorImage}" style="width: 30px; height: 30px; border-radius: 50%; object-fit:cover;">
                    <div style="background: white; padding: 8px 12px; border-radius: 10px; border: 1px solid #eee; flex: 1;">
                        <div style="font-weight: bold; font-size: 0.85rem; color: var(--primary-blue);">${comment.authorName}</div>
                        <div style="font-size: 0.9rem; color: #333;">${escapeHtml(comment.content)}</div>
                    </div>
                </div>
            `).join('');
        }
    } else {
        list.innerHTML = `<p style="color:red; font-size:0.8rem; text-align:center">فشل التحميل</p>`;
    }
}

async function submitCommentProfile(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();
    if (!content) return;

    input.value = '';

    const list = document.getElementById(`comment-list-${postId}`);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
        <div style="display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-start; opacity: 0.7;">
            <img src="${currentUser.photoURL || 'images/user.png'}" style="width: 30px; height: 30px; border-radius: 50%;">
            <div style="background: white; padding: 8px 12px; border-radius: 10px; border: 1px solid #eee; flex: 1;">
                <div style="font-weight: bold; font-size: 0.85rem;">${currentUser.displayName || 'أنا'}</div>
                <div style="font-size: 0.9rem;">${escapeHtml(content)}</div>
            </div>
        </div>
    `;
    list.appendChild(tempDiv);
    list.scrollTop = list.scrollHeight;

    const result = await addComment(postId, content);
    if(result.success) {
        fetchAndRenderComments(postId);
    } else {
        alert("Error: " + result.error);
        tempDiv.remove();
        input.value = content;
    }
}

function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function injectStylesProfile() {
    const style = document.createElement('style');
    style.innerHTML = `
        .post-stats {
            display: flex; justify-content: space-between; align-items: center;
            padding: 8px 0; margin: 0 10px; border-bottom: 1px solid var(--border-color);
            font-size: 0.9rem; color: var(--text-grey);
        }
        .friends-grid { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
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

function createReactorsModalProfile() {
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
                <div id="reactorsList"></div>
            </div>
        </div>
    `;
    document.body.appendChild(div);
    div.addEventListener('click', (e) => {
        if(e.target === div) div.style.display = 'none';
    });
}