// document.addEventListener('DOMContentLoaded', () => {
    
//     // --- Mobile Menu Toggle ---
//     const menuToggle = document.querySelector('.menu-toggle');
//     const navLinks = document.querySelector('.nav-links');

//     if (menuToggle) {
//         menuToggle.addEventListener('click', () => {
//             navLinks.classList.toggle('active');
//             const icon = menuToggle.querySelector('i');
//             if (navLinks.classList.contains('active')) {
//                 icon.classList.remove('fa-bars');
//                 icon.classList.add('fa-times');
//             } else {
//                 icon.classList.remove('fa-times');
//                 icon.classList.add('fa-bars');
//             }
//         });
//     }

//     // --- Active Link Highlighting ---
//     const currentPath = window.location.pathname.split('/').pop();
//     const navItems = document.querySelectorAll('.nav-links a');
    
//     navItems.forEach(link => {
//         // Simple check: if href matches filename, add active
//         if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'index.html')) {
//             link.classList.add('active');
//         }
//     });

//     // --- Compare Page Accordion Logic ---
//     const sectionRows = document.querySelectorAll('.section-row');
//     sectionRows.forEach(row => {
//         row.addEventListener('click', () => {
//             const icon = row.querySelector('i');
//             // In a real table this is tricky, but for grid/flex layout:
//             // This is a visual toggle placeholder. 
//             // Real implementation would hide next sibling elements until next section-row
//             if (icon.classList.contains('fa-chevron-down')) {
//                 icon.classList.remove('fa-chevron-down');
//                 icon.classList.add('fa-chevron-up');
//             } else {
//                 icon.classList.remove('fa-chevron-up');
//                 icon.classList.add('fa-chevron-down');
//             }
//         });
//     });
// });
















//     // Mobile Menu Toggle
// const mobileBtn = document.querySelector('.mobile-toggle-btn');
// const navMenu = document.querySelector('.nav-menu');

// if(mobileBtn) {
//     mobileBtn.addEventListener('click', () => {
//         navMenu.classList.toggle('active');
//         // Toggle Icon
//         const icon = mobileBtn.querySelector('i');
//         if(navMenu.classList.contains('active')){
//             icon.classList.remove('ri-menu-4-line');
//             icon.classList.add('ri-close-line');
//         } else {
//             icon.classList.add('ri-menu-4-line');
//             icon.classList.remove('ri-close-line');
//         }
//     });
// }

































// new
// document.addEventListener('DOMContentLoaded', () => {
    
//     // --- Mobile Menu Toggle ---
//     const menuToggle = document.querySelector('.menu-toggle');
//     const navLinks = document.querySelector('.nav-links');

//     if (menuToggle) {
//         menuToggle.addEventListener('click', () => {
//             navLinks.classList.toggle('active');
//             const icon = menuToggle.querySelector('i');
//             if (navLinks.classList.contains('active')) {
//                 icon.classList.remove('fa-bars');
//                 icon.classList.add('fa-times');
//             } else {
//                 icon.classList.remove('fa-times');
//                 icon.classList.add('fa-bars');
//             }
//         });
//     }

//     // --- Active Link Highlighting ---
//     const currentPath = window.location.pathname.split('/').pop();
//     const navItems = document.querySelectorAll('.nav-links a');
    
//     navItems.forEach(link => {
//         // Simple check: if href matches filename, add active
//         if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'index.html')) {
//             link.classList.add('active');
//         }
//     });

//     // --- Compare Page Accordion Logic ---
//     const sectionRows = document.querySelectorAll('.section-row');
//     sectionRows.forEach(row => {
//         row.addEventListener('click', () => {
//             const icon = row.querySelector('i');
//             // In a real table this is tricky, but for grid/flex layout:
//             // This is a visual toggle placeholder. 
//             // Real implementation would hide next sibling elements until next section-row
//             if (icon.classList.contains('fa-chevron-down')) {
//                 icon.classList.remove('fa-chevron-down');
//                 icon.classList.add('fa-chevron-up');
//             } else {
//                 icon.classList.remove('fa-chevron-up');
//                 icon.classList.add('fa-chevron-down');
//             }
//         });
//     });
// });
















//     // Mobile Menu Toggle
// const mobileBtn = document.querySelector('.mobile-toggle-btn');
// const navMenu = document.querySelector('.nav-menu');

// if(mobileBtn) {
//     mobileBtn.addEventListener('click', () => {
//         navMenu.classList.toggle('active');
//         // Toggle Icon
//         const icon = mobileBtn.querySelector('i');
//         if(navMenu.classList.contains('active')){
//             icon.classList.remove('ri-menu-4-line');
//             icon.classList.add('ri-close-line');
//         } else {
//             icon.classList.add('ri-menu-4-line');
//             icon.classList.remove('ri-close-line');
//         }
//     });
// }







document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. OLD Mobile Menu Toggle (عشان لو لسه بتستخدمه في صفحات تانية) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- 2. NEW Mobile Menu Toggle (النافبار الزجاجي الجديد) ---
    const mobileBtn = document.querySelector('.mobile-toggle-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // تغيير الأيقونة
            const icon = mobileBtn.querySelector('i');
            if(navMenu.classList.contains('active')){
                icon.classList.remove('ri-menu-4-line');
                icon.classList.add('ri-close-line');
            } else {
                icon.classList.add('ri-menu-4-line');
                icon.classList.remove('ri-close-line');
            }
        });
    }

    // --- 3. Active Link Highlighting ---
    const currentPath = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-links a, .nav-link'); // دمجنا الروابط القديمة والجديدة
    
    navItems.forEach(link => {
        if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });

    // --- 4. Compare Page Accordion Logic ---
    const sectionRows = document.querySelectorAll('.section-row');
    sectionRows.forEach(row => {
        row.addEventListener('click', () => {
            const icon = row.querySelector('i');
            if (icon && icon.classList.contains('fa-chevron-down')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
});


















// layout.js - Desktop Layout Engine (Navbar vs Sidebar + Position)

(function() {
    // 1. Apply Layout IMMEDIATELY to prevent layout shift (Flash)
    const savedLayout = localStorage.getItem('app_layout') || 'nav-only'; 
    const sidebarState = localStorage.getItem('sidebar_state') || 'expanded'; 
    const sidebarPosition = localStorage.getItem('sidebar_position') || 'right'; // جديد: المكان الافتراضي يمين
    
    document.documentElement.setAttribute('data-layout', savedLayout);
    document.documentElement.setAttribute('data-sidebar-position', sidebarPosition); // تطبيق المكان
    
    if (sidebarState === 'collapsed') {
        document.documentElement.setAttribute('data-sidebar', 'collapsed');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // تحديث الزراير عند التحميل
    const currentLayout = localStorage.getItem('app_layout') || 'nav-only';
    updateLayoutButtons(currentLayout);
    updatePositionButtons(localStorage.getItem('sidebar_position') || 'right');
    togglePositionControls(currentLayout); // إخفاء/إظهار زراير المكان

    // زرار طي وتوسيع السايدبار
    const toggleBtn = document.getElementById('appSidebarToggle');
    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isCollapsed = document.documentElement.getAttribute('data-sidebar') === 'collapsed';
            const newState = isCollapsed ? 'expanded' : 'collapsed';
            
            if (newState === 'collapsed') {
                document.documentElement.setAttribute('data-sidebar', 'collapsed');
            } else {
                document.documentElement.removeAttribute('data-sidebar');
            }
            localStorage.setItem('sidebar_state', newState);
        });
    }
});

// دالة تغيير الواجهة
window.setLayoutMode = function(mode) {
    localStorage.setItem('app_layout', mode);
    document.documentElement.setAttribute('data-layout', mode);
    updateLayoutButtons(mode);
    togglePositionControls(mode); // إخفاء أو إظهار زراير اليمين واليسار
}

// دالة تغيير المكان (يمين/يسار)
window.setSidebarPosition = function(pos) {
    localStorage.setItem('sidebar_position', pos);
    document.documentElement.setAttribute('data-sidebar-position', pos);
    updatePositionButtons(pos);
}

// تحديث زراير الواجهة
function updateLayoutButtons(activeMode) {
    const buttons = ['nav-only', 'sidebar-only', 'both'];
    buttons.forEach(mode => {
        const btn = document.getElementById(`btn-layout-${mode}`);
        if (btn) btn.className = 'btn-outline'; 
    });
    
    const activeBtn = document.getElementById(`btn-layout-${activeMode}`);
    if (activeBtn) activeBtn.className = 'btn-primary active';
}

// تحديث زراير المكان
function updatePositionButtons(activePos) {
    const buttons = ['right', 'left'];
    buttons.forEach(pos => {
        const btn = document.getElementById(`btn-pos-${pos}`);
        if (btn) btn.className = 'btn-outline'; 
    });
    
    const activeBtn = document.getElementById(`btn-pos-${activePos}`);
    if (activeBtn) activeBtn.className = 'btn-primary active';
}

// إخفاء زراير المكان لو الواجهة علوية بس
function togglePositionControls(mode) {
    const controls = document.getElementById('sidebarPositionControls');
    if(controls) {
        if(mode === 'nav-only') {
            controls.style.display = 'none'; // خفيها
        } else {
            controls.style.display = 'block'; // أظهرها
        }
    }
}


// ==========================================
    // Sidebar Notifications Toggle Logic
    // ==========================================
    const sidebarNotifBtn = document.getElementById('sidebarNotifToggleBtn');
    const sidebarNotifDropdown = document.getElementById('sidebarNotifDropdown');

    if (sidebarNotifBtn && sidebarNotifDropdown) {
        sidebarNotifBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            sidebarNotifDropdown.classList.toggle('show');
            
            // قفل أي قوائم تانية مفتوحة في السايدبار
            const userDropdown = document.querySelector('.sidebar-dropdown-content');
            if(userDropdown && userDropdown.classList.contains('show')) {
                userDropdown.classList.remove('show');
            }
        });
    }

    // إغلاق قائمة الإشعارات لو ضغطت بره
    window.addEventListener('click', (e) => {
        if (sidebarNotifDropdown && sidebarNotifDropdown.classList.contains('show')) {
            if (!sidebarNotifBtn.contains(e.target) && !sidebarNotifDropdown.contains(e.target)) {
                sidebarNotifDropdown.classList.remove('show');
            }
        }
    });






// ==========================================
// Smart Link Detector (Convert URLs to clickable links)
// ==========================================
window.linkifyText = function(text) {
    if (!text) return "";
    
    // Regex لاكتشاف الروابط اللي بتبدأ بـ http, https أو www
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
    
    return text.replace(urlRegex, function(url) {
        let href = url;
        // لو الرابط بيبدأ بـ www بس، هنضيفله https:// عشان يشتغل صح
        if (!href.match('^https?:\/\/')) {
            href = 'https://' + href;
        }
        
        // تحويل النص لرابط HTML
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-blue); text-decoration: underline; font-weight: bold; direction: ltr; display: inline-block;">${url}</a>`;
    });
};



    // تشغيل وإغلاق القائمة الجانبية في الموبايل
    document.addEventListener('DOMContentLoaded', () => {
        const menuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('mobileSidebar');
        const overlay = document.getElementById('mobileSidebarOverlay');
        const closeBtn = document.getElementById('closeMobileSidebar');

        function toggleMenu(e) {
            if(e) e.preventDefault();
            sidebar.classList.toggle('open');
            overlay.classList.toggle('open');
        }

        if(menuBtn) menuBtn.addEventListener('click', toggleMenu);
        if(closeBtn) closeBtn.addEventListener('click', toggleMenu);
        if(overlay) overlay.addEventListener('click', toggleMenu);
    });





    // =========================================
// Loading Screen Logic
// =========================================
window.showLoader = function() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.classList.remove('hidden');
};

window.hideLoader = function() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.classList.add('hidden');
};

// احتياطي: لو الصفحة مفيهاش فايربيز أو خلصت تحميل الدوم كله يخفي اللودر
window.addEventListener('load', () => {
    // مأخرينها نص ثانية بس عشان تدي شكل سلس
    setTimeout(() => {
        window.hideLoader();
    }, 1000);
});










// // =========================================
// // Global Linkify System (تحويل النصوص لروابط)
// // =========================================
// window.linkifyText = function(text) {
//     if (!text) return "";

//     // Regex بيدور على أي لينك بيبدأ بـ http أو https أو حتى www.
//     const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/ig;
    
//     return text.replace(urlRegex, function(url) {
//         let href = url;
//         // لو اللينك مكتوب www. على طول من غير http، هنضيفها إحنا عشان المتصفح يفهمها
//         if (url.toLowerCase().startsWith('www.')) {
//             href = 'https://' + url;
//         }
        
//         // بنرجع اللينك جوه <a> tag مع كلاس post-link وبنخليه يفتح في صفحة جديدة
//         // ضفنا dir="ltr" عشان اللينكات الإنجليزي متلخبطش سطر العربي
//         return `<a href="${href}" target="_blank" class="post-link" dir="ltr" rel="noopener noreferrer">
//                     <i class="fa-solid fa-link"></i> ${url}
//                 </a>`;
//     });
// };









// // =========================================
// // Global Smart Linkify System (النظام الذكي للروابط - النسخة الجبارة)
// // =========================================
// window.linkifyText = function(text) {
//     if (!text) return "";

//     const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/ig;
//     let firstUrl = null;

//     // 1. تحويل اللينكات في النص لروابط قابلة للضغط
//     let replacedText = text.replace(urlRegex, function(url) {
//         let href = url.toLowerCase().startsWith('www.') ? 'https://' + url : url;
//         if (!firstUrl) firstUrl = href; 
        
//         return `<a href="${href}" target="_blank" class="post-link" dir="ltr" rel="noopener noreferrer">
//                     <i class="fa-solid fa-link"></i> ${url}
//                 </a>`;
//     });

//     // 2. فحص نوع اللينك وعرض الميديا المناسبة
//     if (firstUrl) {
        
//         // --- أ: صورة مباشرة ---
//         if (firstUrl.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i)) {
//             replacedText += `
//                 <div class="smart-embed-container">
//                     <img src="${firstUrl}" class="embed-image" alt="مرفق" onerror="this.style.display='none'">
//                 </div>`;
//         }
        
//         // --- ب: فيديو يوتيوب (بأقوى Regex و Nocookie) ---
// // --- ب: فيديو يوتيوب (بأقوى Regex و Nocookie) ---
//         else if (firstUrl.match(/(youtube\.com|youtu\.be)/i)) {
//             const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
//             const ytMatch = firstUrl.match(ytRegex);
            
//             if (ytMatch && ytMatch[1]) {
//                 const videoId = ytMatch[1];
//                 replacedText += `
//                     <div class="smart-embed-container">
//                         <div class="yt-container">
//                             <iframe 
//                                 src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1" 
//                                 frameborder="0" 
//                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
//                                 allowfullscreen>
//                             </iframe>
//                         </div>
//                         <div style="background: var(--bg-light); padding: 8px; text-align: center; border-top: 1px solid var(--border-color);">
//                             <a href="${firstUrl}" target="_blank" style="color: var(--primary-blue); font-size: 0.85rem; font-weight: bold; text-decoration: none;">
//                                 <i class="fa-brands fa-youtube" style="color: red;"></i> الفيديو مش شغال؟ افتحه في يوتيوب
//                             </a>
//                         </div>
//                     </div>`;
//             } else {
//                 replacedText += window.generatePreviewPlaceholder(firstUrl);
//             }
//         }
        
//         // --- ج: سبوتيفاي ---
//         else if (firstUrl.match(/spotify\.com/i)) {
//             const embedUrl = firstUrl.replace('/track/', '/embed/track/')
//                                      .replace('/playlist/', '/embed/playlist/')
//                                      .replace('/album/', '/embed/album/');
//             replacedText += `
//                 <div class="smart-embed-container" style="border:none; background:transparent;">
//                     <iframe src="${embedUrl}" width="100%" height="152" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
//                 </div>`;
//         }
        
//         // --- د: موقع عادي -> كارت ---
//         else {
//             replacedText += window.generatePreviewPlaceholder(firstUrl);
//         }
//     }

//     return replacedText;
// };
// =========================================
// نظام معالجة روابط جوجل درايف (صور، فيديو، صوت، ملفات)
// =========================================
window.linkifyText = function(text) {
    if (!text) return "";

    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/ig;
    let firstUrl = null;

    // 1. تحويل النصوص لروابط زرقاء
    let replacedText = text.replace(urlRegex, function(url) {
        let href = url.toLowerCase().startsWith('www.') ? 'https://' + url : url;
        if (!firstUrl) firstUrl = href; 
        return `<a href="${href}" target="_blank" class="post-link" dir="ltr" rel="noopener noreferrer"><i class="fa-solid fa-link"></i> ${url}</a>`;
    });

    if (firstUrl) {
        // --- فحص إذا كان الرابط من جوجل درايف ---
        const driveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=|drive\/folders\/)([^/?\s]+)/i;
        const driveMatch = firstUrl.match(driveRegex);

        if (driveMatch && driveMatch[1]) {
            const fileId = driveMatch[1];
            
            // استخدام رابط الـ Thumbnail (بيجيب صورة لأي ملف حتى لو فيديو أو PDF)
            const hiResThumb = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
            const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;

            replacedText += `
                <div class="drive-smart-card" style="margin-top: 15px; border: 1px solid var(--border-color); border-radius: 15px; overflow: hidden; background: var(--bg-card); box-shadow: var(--shadow-sm);">
                         <div class="drive-media-box" style="position: relative; background: #000; display: flex; justify-content: center; align-items: center; min-height: 200px; cursor: pointer;" onclick="this.innerHTML='<iframe src=\\'${previewUrl}\\' style=\\'width:100%; height:400px; border:none;\\' allow=\\'autoplay\\'></iframe>'">

                        <img src="${hiResThumb}" 
                             style="width: 100%; max-height: 400px; object-fit: cover;" 
                             alt="Drive Content" 
                             onerror="this.parentElement.innerHTML='<div style=\\'padding:40px; color:#fff; text-align:center;\\'><i class=\\'fa-brands fa-google-drive\\' style=\\'font-size:3rem;\\'></i><br>الملف يحتاج صلاحية (Anyone with link)</div>'">
                        

                </div>`;
            // replacedText += `
            //     <div class="drive-smart-card" style="margin-top: 15px; border: 1px solid var(--border-color); border-radius: 15px; overflow: hidden; background: var(--bg-card); box-shadow: var(--shadow-sm);">
            //         <div class="drive-media-box" style="position: relative; background: #000; display: flex; justify-content: center; align-items: center; min-height: 200px; cursor: pointer;" onclick="this.innerHTML='<iframe src=\\'${previewUrl}\\' style=\\'width:100%; height:400px; border:none;\\' allow=\\'autoplay\\'></iframe>'">
                        
            //             <img src="${hiResThumb}" 
            //                  style="width: 100%; max-height: 400px; object-fit: contain;" 
            //                  alt="Drive Content" 
            //                  onerror="this.parentElement.innerHTML='<div style=\\'padding:40px; color:#fff; text-align:center;\\'><i class=\\'fa-brands fa-google-drive\\' style=\\'font-size:3rem;\\'></i><br>الملف يحتاج صلاحية (Anyone with link)</div>'">
                        
            //             <div class="play-overlay" style="position: absolute; background: rgba(0,0,0,0.4); border-radius: 50%; width: 60px; height: 60px; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 1.5rem; border: 2px solid #fff;">
            //                 <i class="fa-solid fa-expand"></i>
            //             </div>
            //         </div>
                    
            //         <div style="padding: 12px; background: #fff; display: flex; justify-content: space-between; align-items: center;">
            //             <div style="display: flex; align-items: center; gap: 8px;">
            //                 <img src="https://www.google.com/s2/favicons?domain=drive.google.com&sz=32" style="width: 20px; height: 20px;">
            //                 <span style="font-size: 0.85rem; font-weight: bold; color: #555;">محتوى من Google Drive</span>
            //             </div>
            //             <a href="${firstUrl}" target="_blank" style="text-decoration: none; color: var(--primary-blue); font-size: 0.8rem; font-weight: bold;">
            //                  عرض الملف الأصلي <i class="fa-solid fa-up-right-from-square"></i>
            //             </a>
            //         </div>
            //     </div>`;
        } 
        // لو مش درايف، شغل نظام المعاينة العادي للمواقع التانية
        else {
            replacedText += window.generatePreviewPlaceholder(firstUrl);
        }
    }

    return replacedText;
};
window.generatePreviewPlaceholder = function(url) {
    return `
        <div class="url-preview-container" data-url="${url}">
            <div class="preview-loading">
                <i class="fa-solid fa-circle-notch fa-spin"></i> بنجيب تفاصيل اللينك...
            </div>
        </div>`;
};

// =========================================
// جلب كروت المعاينة للمواقع العادية (Microlink API)
// =========================================
// =========================================
// جلب كروت المعاينة للمواقع العادية (النسخة الخارقة)
// =========================================
window.processLinkPreviews = async function() {
    const containers = document.querySelectorAll('.url-preview-container:not(.loaded)');

    for (let container of containers) {
        container.classList.add('loaded'); 
        const url = container.getAttribute('data-url');

        try {
            // بنستخرج الدومين الأساسي (مثلاً: facebook.com)
            const domain = new URL(url).hostname;
            
            const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
            const json = await res.json();

            if (json.status === 'success' && json.data) {
                const data = json.data;
                const title = data.title || url;
                const desc = data.description || '';
                const image = data.image?.url || ''; 
                
                // 🚀 السلاح السري لجلب اللوجو:
                // لو الـ API جاب اللوجو خير وبركة، لو مجابوش نستخدم سيرفرات جوجل!
                const logo = data.logo?.url || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;   
                
                const publisher = data.publisher || domain.replace('www.', '');

                container.innerHTML = `
                    <a href="${url}" target="_blank" class="preview-card" rel="noopener noreferrer">
                        ${image ? `<img src="${image}" class="preview-img" alt="Preview" onerror="this.style.display='none'">` : ''}
                        <div class="preview-info">
                            <h4 class="preview-title" dir="auto">${title}</h4>
                            ${desc ? `<p class="preview-desc" dir="auto">${desc}</p>` : ''}
                            <div class="preview-domain">
                                <img src="${logo}" alt="logo" onerror="this.src='images/coffee.ico'">
                                <span>${publisher}</span>
                            </div>
                        </div>
                    </a>
                `;
            } else {
                // لو الـ API فشل خالص، نعمل كارت بسيط فيه اللوجو من جوجل واللينك
                const domain = new URL(url).hostname;
                const fallbackLogo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                
                container.innerHTML = `
                    <a href="${url}" target="_blank" class="preview-card" rel="noopener noreferrer" style="padding: 10px;">
                        <div class="preview-domain" style="font-size: 1rem;">
                            <img src="${fallbackLogo}" alt="logo" style="width: 24px; height: 24px;">
                            <span style="color: var(--primary-blue); font-weight: bold;">${domain.replace('www.', '')}</span>
                        </div>
                    </a>
                `;
            }
        } catch (error) {
            console.error('Error fetching preview:', error);
            container.style.display = 'none';
        }
    }
};







// // =========================================
// // 1. المفتش الذكي (تحويل النص لروابط + زرع أماكن المعاينة)
// // =========================================
// window.linkifyText = function(text) {
//     if (!text) return "";

//     const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/ig;
//     let firstUrl = null;

//     // تحويل كل اللينكات لروابط زرقاء قابلة للضغط
//     let replacedText = text.replace(urlRegex, function(url) {
//         let href = url.toLowerCase().startsWith('www.') ? 'https://' + url : url;
//         if (!firstUrl) firstUrl = href; 
        
//         return `<a href="${href}" target="_blank" class="post-link" dir="ltr" rel="noopener noreferrer">
//                     <i class="fa-solid fa-link"></i> ${url}
//                 </a>`;
//     });

//     // لو لقينا لينك، بنحط Container ذكي هو اللي هيتحول لكارت أو مشغل ميديا
//     if (firstUrl) {
//         replacedText += `
//             <div class="url-preview-container" data-url="${firstUrl}">
//                 <div class="preview-loading">
//                     <i class="fa-solid fa-circle-notch fa-spin"></i> بنجيب تفاصيل الرابط...
//                 </div>
//             </div>`;
//     }

//     return replacedText;
// };

// // دالة مساعدة لرسم مكان الكارت لحد ما يحمل
// window.generatePreviewPlaceholder = function(url) {
//     return `
//         <div class="url-preview-container" data-url="${url}">
//             <div class="preview-loading">
//                 <i class="fa-solid fa-circle-notch fa-spin"></i> بنجيب تفاصيل اللينك...
//             </div>
//         </div>`;
// };

// // =========================================
// // 2. معالج المعاينة (الرسم الفعلي للميديا والبيانات)
// // =========================================
// window.processLinkPreviews = async function() {
//     const containers = document.querySelectorAll('.url-preview-container:not(.loaded)');

//     for (let container of containers) {
//         container.classList.add('loaded'); 
//         const url = container.getAttribute('data-url');

//         try {
//             // فحص نوع الميديا أولاً قبل طلب الـ API لسرعة الأداء في المنصات المعروفة
            
//             // --- أ: فيديو يوتيوب (النسخة الجبارة) ---
//             const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
//             const ytMatch = url.match(ytRegex);
            
//             if (ytMatch && ytMatch[1]) {
//                 const videoId = ytMatch[1];
//                 container.innerHTML = `
//                     <div class="smart-embed-container">
//                         <div class="yt-container">
//                             <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1" frameborder="0" allowfullscreen></iframe>
//                         </div>
//                         <div style="background: var(--bg-light); padding: 8px; text-align: center; border-top: 1px solid var(--border-color);">
//                             <a href="${url}" target="_blank" style="color: var(--primary-blue); font-size: 0.85rem; font-weight: bold;">
//                                 <i class="fa-brands fa-youtube" style="color: red;"></i> افتح الفيديو في يوتيوب
//                             </a>
//                         </div>
//                     </div>`;
//                 continue; // تخطي جلب بيانات الـ API لأن المشغل كفاية
//             }

//             // --- ب: ساوند كلاود (SoundCloud) ---
//             if (url.match(/soundcloud\.com/i)) {
//                 const scUrl = encodeURIComponent(url);
//                 container.innerHTML = `<div class="smart-embed-container"><iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=${scUrl}&color=%236F4E37"></iframe></div>`;
//                 continue;
//             }

//             // --- ج: أنغامي (Anghami) ---
//             const angMatch = url.match(/play\.anghami\.com\/(song|album|playlist)\/([0-9]+)/i);
//             if(angMatch) {
//                 container.innerHTML = `<div class="smart-embed-container"><iframe src="https://widget.anghami.com/${angMatch[1]}/${angMatch[2]}" width="100%" height="316" frameborder="0"></iframe></div>`;
//                 continue;
//             }

//             // --- د: سبوتيفاي (Spotify) ---
//             if (url.match(/spotify\.com/i)) {
//                 const embedUrl = url.replace('/track/', '/embed/track/').replace('/playlist/', '/embed/playlist/').replace('/album/', '/embed/album/');
//                 container.innerHTML = `<div class="smart-embed-container" style="border:none;"><iframe src="${embedUrl}" width="100%" height="152" frameborder="0" allow="encrypted-media"></iframe></div>`;
//                 continue;
//             }

//             // --- هـ: فيسبوك (Facebook Embed) ---
//             if (url.match(/(facebook\.com|fb\.watch|fb\.com)/i)) {
//                 const isVideo = url.includes('/videos/') || url.includes('fb.watch') || url.includes('/watch');
//                 const fbEmbedUrl = `https://www.facebook.com/plugins/${isVideo ? 'video.php' : 'post.php'}?href=${encodeURIComponent(url)}&show_text=true&width=500`;
//                 container.innerHTML = `<div class="smart-embed-container" style="background:white; padding:10px;"><iframe src="${fbEmbedUrl}" width="100%" height="400" style="border:none; overflow:hidden;" scrolling="no" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe></div>`;
//                 continue;
//             }

//             // --- و: أي موقع تاني (استخدام API Microlink + لوجوهات جوجل) ---
//             const domain = new URL(url).hostname;
//             const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
//             const json = await res.json();

//             if (json.status === 'success' && json.data) {
//                 const d = json.data;
//                 const logo = d.logo?.url || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`; // جلب اللوجو بذكاء
                
//                 container.innerHTML = `
//                     <a href="${url}" target="_blank" class="preview-card">
//                         ${d.image?.url ? `<img src="${d.image.url}" class="preview-img" onerror="this.style.display='none'">` : ''}
//                         <div class="preview-info">
//                             <h4 class="preview-title">${d.title || url}</h4>
//                             ${d.description ? `<p class="preview-desc">${d.description}</p>` : ''}
//                             <div class="preview-domain">
//                                 <img src="${logo}" alt="logo" onerror="this.src='images/coffee.ico'">
//                                 <span>${d.publisher || domain}</span>
//                             </div>
//                         </div>
//                     </a>`;
//             } else {
//                 // حالة الفشل: كارت بسيط فيه اللوجو والاسم فقط
//                 const fallbackLogo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
//                 container.innerHTML = `
//                     <a href="${url}" target="_blank" class="preview-card" style="padding: 10px;">
//                         <div class="preview-domain" style="font-size: 1rem;">
//                             <img src="${fallbackLogo}" alt="logo" style="width: 24px; height: 24px;">
//                             <span style="color: var(--primary-blue); font-weight: bold;">${domain.replace('www.', '')}</span>
//                         </div>
//                     </a>`;
//             }
//         } catch (error) {
//             console.error('Link Preview Error:', error);
//             container.style.display = 'none';
//         }
//     }
// };


// // =========================================
// // Global Smart Linkify System (النظام الذكي الشامل للروابط)
// // =========================================
// window.linkifyText = function(text) {
//     if (!text) return "";

//     const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/ig;
//     let firstUrl = null;

//     // 1. تحويل اللينكات في النص لروابط زرقاء قابلة للضغط
//     let replacedText = text.replace(urlRegex, function(url) {
//         let href = url.toLowerCase().startsWith('www.') ? 'https://' + url : url;
//         if (!firstUrl) firstUrl = href; 
        
//         return `<a href="${href}" target="_blank" class="post-link" dir="ltr" rel="noopener noreferrer">
//                     <i class="fa-solid fa-link"></i> ${url}
//                 </a>`;
//     });

//     // 2. المفتش الذكي: فحص نوع اللينك وعرض الميديا المناسبة
//     if (firstUrl) {
        
//         // --- أ: صورة مباشرة ---
//         if (firstUrl.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i)) {
//             replacedText += `
//                 <div class="smart-embed-container">
//                     <img src="${firstUrl}" class="embed-image" alt="مرفق" onerror="this.style.display='none'">
//                 </div>`;
//         }
        
//         // --- ب: فيديو يوتيوب ---
//         else if (firstUrl.match(/(youtube\.com|youtu\.be)/i)) {
//             const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
//             const ytMatch = firstUrl.match(ytRegex);
//             if (ytMatch && ytMatch[1]) {
//                 const videoId = ytMatch[1];
//                 replacedText += `
//                     <div class="smart-embed-container">
//                         <div class="yt-container">
//                             <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
//                         </div>
//                         <div style="background: var(--bg-light); padding: 8px; text-align: center; border-top: 1px solid var(--border-color);">
//                             <a href="${firstUrl}" target="_blank" style="color: var(--primary-blue); font-size: 0.85rem; font-weight: bold; text-decoration: none;">
//                                 <i class="fa-brands fa-youtube" style="color: red;"></i> الفيديو مش شغال؟ افتحه في يوتيوب
//                             </a>
//                         </div>
//                     </div>`;
//             } else {
//                 replacedText += window.generatePreviewPlaceholder(firstUrl);
//             }
//         }

//         // --- ج: ساوند كلاود (SoundCloud) ---
//         else if (firstUrl.match(/soundcloud\.com/i)) {
//             const scUrl = encodeURIComponent(firstUrl);
//             replacedText += `
//                 <div class="smart-embed-container">
//                     <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=${scUrl}&color=%236F4E37&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
//                 </div>`;
//         }

//         // --- د: أنغامي (Anghami) ---
//         else if (firstUrl.match(/play\.anghami\.com\/(song|album|playlist)\/([0-9]+)/i)) {
//             const match = firstUrl.match(/play\.anghami\.com\/(song|album|playlist)\/([0-9]+)/i);
//             if(match && match.length >= 3) {
//                 const type = match[1];
//                 const id = match[2];
//                 replacedText += `
//                     <div class="smart-embed-container">
//                         <iframe src="https://widget.anghami.com/${type}/${id}" width="100%" height="316" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
//                     </div>`;
//             } else {
//                 replacedText += window.generatePreviewPlaceholder(firstUrl);
//             }
//         }

//         // --- هـ: سبوتيفاي (Spotify) ---
//         else if (firstUrl.match(/spotify\.com/i)) {
//             const embedUrl = firstUrl.replace('/track/', '/embed/track/')
//                                      .replace('/playlist/', '/embed/playlist/')
//                                      .replace('/album/', '/embed/album/');
//             replacedText += `
//                 <div class="smart-embed-container" style="border:none; background:transparent;">
//                     <iframe src="${embedUrl}" width="100%" height="152" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
//                 </div>`;
//         }

//         // --- و: بوست أو فيديو فيسبوك ---
//         else if (firstUrl.match(/(facebook\.com|fb\.watch|fb\.com)/i)) {
//             const isVideo = firstUrl.includes('/videos/') || firstUrl.includes('fb.watch') || firstUrl.includes('/watch');
//             const fbPluginType = isVideo ? 'video.php' : 'post.php';
//             const fbEmbedUrl = `https://www.facebook.com/plugins/${fbPluginType}?href=${encodeURIComponent(firstUrl)}&show_text=true&width=500`;

//             replacedText += `
//                 <div class="smart-embed-container" style="background: white; display: flex; flex-direction: column; overflow: hidden;">
//                     <div style="padding: 10px; display: flex; justify-content: center;">
//                         <iframe src="${fbEmbedUrl}" width="100%" height="400" style="border:none; overflow:hidden; max-width: 500px;" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
//                     </div>
//                     <div style="background: var(--bg-light); padding: 8px; text-align: center; border-top: 1px solid var(--border-color);">
//                         <a href="${firstUrl}" target="_blank" style="color: #1877F2; font-size: 0.85rem; font-weight: bold; text-decoration: none;">
//                             <i class="fa-brands fa-facebook"></i> افتح البوست في فيسبوك
//                         </a>
//                     </div>
//                 </div>`;
//         }
        
//         // --- ز: أي موقع تاني (كارت المعاينة العادي) ---
//         else {
//             replacedText += window.generatePreviewPlaceholder(firstUrl);
//         }
//     }

//     return replacedText;
// };

// // دالة مساعدة لرسم مكان الكارت لحد ما يحمل
// window.generatePreviewPlaceholder = function(url) {
//     return `
//         <div class="url-preview-container" data-url="${url}">
//             <div class="preview-loading">
//                 <i class="fa-solid fa-circle-notch fa-spin"></i> بنجيب تفاصيل اللينك...
//             </div>
//         </div>`;
// };

// // =========================================
// // جلب كروت المعاينة للمواقع العادية (النسخة الخارقة باللوجوهات)
// // =========================================
// window.processLinkPreviews = async function() {
//     const containers = document.querySelectorAll('.url-preview-container:not(.loaded)');

//     for (let container of containers) {
//         container.classList.add('loaded'); 
//         const url = container.getAttribute('data-url');

//         try {
//             // بنستخرج الدومين الأساسي (مثلاً: whatsapp.com)
//             const domain = new URL(url).hostname;
            
//             const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
//             const json = await res.json();

//             if (json.status === 'success' && json.data) {
//                 const data = json.data;
//                 const title = data.title || url;
//                 const desc = data.description || '';
//                 const image = data.image?.url || ''; 
                
//                 // لو API مجابش لوجو، نجيبه من جوجل
//                 const logo = data.logo?.url || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;   
                
//                 const publisher = data.publisher || domain.replace('www.', '');

//                 container.innerHTML = `
//                     <a href="${url}" target="_blank" class="preview-card" rel="noopener noreferrer">
//                         ${image ? `<img src="${image}" class="preview-img" alt="Preview" onerror="this.style.display='none'">` : ''}
//                         <div class="preview-info">
//                             <h4 class="preview-title" dir="auto">${title}</h4>
//                             ${desc ? `<p class="preview-desc" dir="auto">${desc}</p>` : ''}
//                             <div class="preview-domain">
//                                 <img src="${logo}" alt="logo" onerror="this.src='images/coffee.ico'">
//                                 <span>${publisher}</span>
//                             </div>
//                         </div>
//                     </a>
//                 `;
//             } else {
//                 // خطة بديلة: لو الموقع محمي ومش راضي يدينا بيانات، نعرض اللوجو واسم الموقع بس
//                 const domain = new URL(url).hostname;
//                 const fallbackLogo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                
//                 container.innerHTML = `
//                     <a href="${url}" target="_blank" class="preview-card" rel="noopener noreferrer" style="padding: 10px;">
//                         <div class="preview-domain" style="font-size: 1rem;">
//                             <img src="${fallbackLogo}" alt="logo" style="width: 24px; height: 24px;">
//                             <span style="color: var(--primary-blue); font-weight: bold;">${domain.replace('www.', '')}</span>
//                         </div>
//                     </a>
//                 `;
//             }
//         } catch (error) {
//             console.error('Error fetching preview:', error);
//             container.style.display = 'none';
//         }
//     }
// };