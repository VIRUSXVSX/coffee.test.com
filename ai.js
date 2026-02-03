// ai.js - The Smart Gahwajy Module

// 1. Memory Storage
let conversationHistory = [];

// 2. The Widget HTML Template
const aiWidgetHTML = `
<button id="aiToggleBtn" title="القهوجي الذكي">
    <i class="ri-bard-fill"></i>
</button>

<div class="ai-chat-widget" id="aiChatWidget">
    <div class="ai-header">
        <div style="display: flex; align-items: center; gap: 10px;">
            <div class="ai-avatar">
                <i class="fa-solid fa-mug-hot"></i>
            </div>
            <div>
                <h4 style="margin: 0; color: white;">القهوجي الذكي</h4>
                <span style="font-size: 0.7rem; color: #eee; opacity: 0.8;">مدعوم من Puter.js</span>
            </div>
        </div>
        <button id="closeAiBtn"><i class="fa-solid fa-xmark"></i></button>
    </div>
    
    <div class="ai-messages" id="aiMessagesArea">
        <div class="ai-msg-row received">
            <div class="ai-msg-bubble">
                أحلى مسا عليك يا كبير! ☕<br>
                أنا القهوجي.. اطلب واتمنى.
            </div>
        </div>
    </div>

    <div class="ai-input-area">
        <input type="text" id="aiInput" placeholder="اكتب للقهوجي..." autocomplete="off">
        <button id="sendAiBtn"><i class="fa-solid fa-paper-plane"></i></button>
    </div>
</div>
`;
// const aiWidgetHTML = `
// <button id="aiToggleBtn" title="القهوجي الذكي">
//     <i class="fa-solid fa-mug-hot"></i>
// </button>

// <div class="ai-chat-widget" id="aiChatWidget">
//     <div class="ai-header">
//         <div style="display: flex; align-items: center; gap: 10px;">
//             <div class="ai-avatar">
//                 <i class="fa-solid fa-mug-hot"></i>
//             </div>
//             <div>
//                 <h4 style="margin: 0; color: white;">القهوجي الذكي</h4>
//                 <span style="font-size: 0.7rem; color: #eee; opacity: 0.8;">مدعوم من Puter.js</span>
//             </div>
//         </div>
//         <button id="closeAiBtn"><i class="fa-solid fa-xmark"></i></button>
//     </div>
    
//     <div class="ai-messages" id="aiMessagesArea">
//         <div class="ai-msg-row received">
//             <div class="ai-msg-bubble">
//                 أحلى مسا عليك يا كبير! ☕<br>
//                 أنا القهوجي.. اطلب واتمنى.
//             </div>
//         </div>
//     </div>

//     <div class="ai-input-area">
//         <input type="text" id="aiInput" placeholder="اكتب للقهوجي..." autocomplete="off">
//         <button id="sendAiBtn"><i class="fa-solid fa-paper-plane"></i></button>
//     </div>
// </div>
// `;

// 3. Initialization Function
function initGahwajyAI() {
    // Check if Puter.js is loaded
    if (typeof puter === 'undefined') {
        console.warn("Puter.js is missing! Please add the script tag.");
        return;
    }

    // Inject HTML if it doesn't exist
    if (!document.getElementById('aiChatWidget')) {
        document.body.insertAdjacentHTML('beforeend', aiWidgetHTML);
    }

    // Get Elements
    const toggleBtn = document.getElementById('aiToggleBtn');
    const widget = document.getElementById('aiChatWidget');
    const closeBtn = document.getElementById('closeAiBtn');
    const sendBtn = document.getElementById('sendAiBtn');
    const input = document.getElementById('aiInput');
    const msgArea = document.getElementById('aiMessagesArea');

    // Event Listeners
    if(toggleBtn) toggleBtn.addEventListener('click', () => widget.classList.add('active'));
    if(closeBtn) closeBtn.addEventListener('click', () => widget.classList.remove('active'));

    // Send Logic
    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // 1. Show User Message
        addMessage(text, 'sent');
        input.value = '';

        // 2. Add to History
        conversationHistory.push({ role: 'user', content: text });

        // 3. Show Loading
        const loadingId = addLoadingBubble();

        try {
            const reply = await getPuterResponse();
            removeMessage(loadingId);
            addMessage(reply, 'received');
            conversationHistory.push({ role: 'assistant', content: reply });
        } catch (error) {
            removeMessage(loadingId);
            addMessage("النت بعافية شوية.. جرب تاني.", 'received');
            console.error(error);
        }
    }

    if(sendBtn) sendBtn.addEventListener('click', sendMessage);
    if(input) input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Helpers
    function addMessage(text, type) {
        const div = document.createElement('div');
        div.className = `ai-msg-row ${type}`;
        const formattedText = text.replace(/\n/g, '<br>');
        div.innerHTML = `<div class="ai-msg-bubble">${formattedText}</div>`;
        msgArea.appendChild(div);
        msgArea.scrollTop = msgArea.scrollHeight;
    }

    function addLoadingBubble() {
        const id = 'loading-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'ai-msg-row received';
        div.innerHTML = `<div class="ai-msg-bubble"><i class="fa-solid fa-mug-hot fa-bounce"></i></div>`;
        msgArea.appendChild(div);
        msgArea.scrollTop = msgArea.scrollHeight;
        return id;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if(el) el.remove();
    }
}

// // 4. The Brain (Puter Logic)
// async function getPuterResponse() {
//     // Get User Name from Global Variable (set by user-loader.js)
//     let userName = "زبون";
//     if (window.currentGahwaUser && window.currentGahwaUser.displayName) {
//         userName = window.currentGahwaUser.displayName.split(' ')[0];
//     }

//     // Site Map
//     const siteMap = `
//     معلومات عن الموقع:
//     - الألعاب: "games.html"
//     - الفضفضة: "fadfada.html"
//     - الأصدقاء: "friends.html"
//     - بروفايلي: "profile.html"
//     - الرئيسية: "dashboard.html"
//     `;

//     // History Context (Last 5 messages)
//     const recentHistory = conversationHistory.slice(-5);
//     let chatContext = "";
//     recentHistory.forEach(msg => {
//         const roleName = msg.role === 'user' ? "الزبون" : "القهوجي";
//         chatContext += `${roleName}: ${msg.content}\n`;
//     });

//     const prompt = `
//     ${siteMap}
//     أنت "القهوجي الذكي" في موقع "القهوة".
//     اسم الزبون: ${userName}
    
//     التعليمات:
//     1. اتكلم مصري عامية (جدعنة).
//     2. استخدم ألقاب زي "يا ${userName}"، "يا معلم"، "يا باشا".
//     3. لو الزبون طلب يروح صفحة، استخدم الزرار ده:
//     <br><a href="الرابط" class="ai-link-btn"><i class="fa-solid fa-link"></i> النص</a>

//     الحوار السابق:
//     ${chatContext}

//     ردك:
//     `;

//     const response = await puter.ai.chat(prompt);
//     return typeof response === 'object' ? response.message.content : response.toString();
// }

// // Run on Load
// document.addEventListener('DOMContentLoaded', initGahwajyAI);













// 4. The Brain (Puter Logic)
async function getPuterResponse() {
    // Get User Name
    let userName = "يا كبير";
    if (window.currentGahwaUser && window.currentGahwaUser.displayName) {
        userName = window.currentGahwaUser.displayName.split(' ')[0];
    }

    // Site Map (Hidden Knowledge)
    // We give this to the AI, but tell it NOT to use it yet.
    const siteMap = `
    - الألعاب: "games.html"
    - الفضفضة: "fadfada.html"
    - الأصدقاء: "friends.html"
    - بروفايلي: "profile.html"
    - الرئيسية: "dashboard.html"
    - التلفزيون و الفرجة:  "tv.html"
    `;

    // History Context
    const recentHistory = conversationHistory.slice(-5);
    let chatContext = "";
    recentHistory.forEach(msg => {
        const roleName = msg.role === 'user' ? "الزبون" : "القهوجي";
        chatContext += `${roleName}: ${msg.content}\n`;
    });

    // UPDATED PROMPT (Strict "No Menu" Rule)
    const prompt = `
    أنت "القهوجي الذكي" في موقع "القهوة".
    شخصيتك: مصري ابن بلد، صاحب صاحبك، دمك خفيف، وجدع.
    اسم الزبون: ${userName}

    التعليمات الصارمة:
    1. **ممنوع** تعرض قائمة الروابط (Menu) في بداية الكلام أبداً.
    2. **ممنوع** تقول "أقدر أوديك الألعاب أو الفضفضة..." إلا لو الزبون سأل "الموقع فيه ايه؟".
    3. لو الزبون قال "سلام" أو "ازيك": رد بترحيب مصري فقط (أهلا يا كبير، منور الدينا، تشرب ايه؟).
    4. خلي كلامك دردشة عادية (فضفضة) مش خدمة عملاء.

    معلومات الموقع (استخدمها *فقط* لو الزبون طلب رابط):
    ${siteMap}

    طريقة الرد:
    - اتكلم عامية مصرية.
    - لو الزبون طلب يروح صفحة معينة، استخدم الكود ده: <br><a href="الرابط" class="ai-link-btn"><i class="fa-solid fa-link"></i> اسم الصفحة</a>

    الحوار السابق:
    ${chatContext}

    ردك (بدون روابط):
    `;

    const response = await puter.ai.chat(prompt);
    return typeof response === 'object' ? response.message.content : response.toString();
}


// // Run on Load
document.addEventListener('DOMContentLoaded', initGahwajyAI);