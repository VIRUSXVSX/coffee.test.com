const EMOJI_LIST = [
    "☕", "🍵", "🥤", "🧃", "🧊", "🥛", "🥯", "🥐", 
    "😂", "❤️", "😍", "🤣", "👍", "👎", "😭", "😡", 
    "😅", "😳", "🙄", "🤔", "😎", "🤫", "😴", "🤧", 
    "👋", "👌", "✌️", "🤞", "🤝", "🙌", "🤲", "🙏", 
    "🔥", "✨", "🎉", "🎈", "💯", "💢", "💥", "💫", 
    "⚽", "🎮", "🎲", "♟️", "🎯", "🎨", "🎬", "🎧",
    "🌹", "💐", "🌸", "🌺", "🌻", "🌼", "🌷", "🌱"
];

export function setupEmojiPicker(triggerBtnId, inputId, containerId) {
    const triggerBtn = document.getElementById(triggerBtnId);
    const inputField = document.getElementById(inputId);
    const container = document.getElementById(containerId);

    if (!triggerBtn || !inputField || !container) {
        console.error("Emoji Picker Error: Elements not found");
        return;
    }

    // Check if picker already exists to prevent duplicates
    let picker = container.querySelector('.emoji-picker-menu');
    if (!picker) {
        picker = document.createElement('div');
        picker.className = 'emoji-picker-menu';
        
        EMOJI_LIST.forEach(emoji => {
            const span = document.createElement('span');
            span.textContent = emoji;
            span.className = 'emoji-btn';
            span.onclick = (e) => {
                e.stopPropagation(); // Stop clicking emoji from closing menu immediately
                insertAtCursor(inputField, emoji);
            };
            picker.appendChild(span);
        });
        
        // Append to the INPUT CONTAINER (Relative Parent)
        container.appendChild(picker);
    }

    // Toggle Logic
    triggerBtn.onclick = (e) => {
        e.stopPropagation();
        // Close all other open pickers if any
        document.querySelectorAll('.emoji-picker-menu.show').forEach(p => {
            if(p !== picker) p.classList.remove('show');
        });
        picker.classList.toggle('show');
    };

    // Close when clicking anywhere else
    document.addEventListener('click', (e) => {
        if (!picker.contains(e.target) && e.target !== triggerBtn) {
            picker.classList.remove('show');
        }
    });
}

function insertAtCursor(input, text) {
    const start = input.selectionStart || input.value.length;
    const end = input.selectionEnd || input.value.length;
    const value = input.value;
    
    input.value = value.substring(0, start) + text + value.substring(end);
    
    // Move cursor after emoji
    input.selectionStart = input.selectionEnd = start + text.length;
    input.focus();
}