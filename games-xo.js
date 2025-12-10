import { 
    auth, 
    onAuthStateChanged, 
    createOnlineGame, 
    joinOnlineGame, 
    sendGameInvite, 
    makeOnlineMove,
    resetOnlineGame,
    onSnapshot,
    doc,
    db,
    getUserFriends
} from './auth-service.js';

let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let currentPlayer = "X"; 
let gameMode = "ai"; // 'ai', 'local', 'online'
let onlineGameId = null;
let myRole = null; // 'X' or 'O' for online
let unsubscribeGame = null;

// DOM Elements
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('turnIndicator');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const p1NameEl = document.getElementById('p1Name');
const p2NameEl = document.getElementById('p2Name');
const modal = document.getElementById('resultModal');
const modeSelection = document.getElementById('modeSelection');
const inviteModal = document.getElementById('inviteModal');

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Check for game invite link
            const urlParams = new URLSearchParams(window.location.search);
            const gid = urlParams.get('gameId');
            if (gid) {
                // Auto Join
                modeSelection.style.display = 'none';
                handleOnlineJoin(gid);
            }
        } else {
            // Not logged in -> Local Only
            if(document.getElementById('btnOnline')) document.getElementById('btnOnline').style.display = 'none';
        }
    });
});

window.startGame = async (mode) => {
    gameMode = mode;
    
    if (mode === 'online') {
        // Create Game
        const res = await createOnlineGame();
        if (res.success) {
            onlineGameId = res.gameId;
            myRole = 'X';
            p1NameEl.textContent = "أنت (X)";
            p2NameEl.textContent = "في الانتظار...";
            modeSelection.style.display = 'none';
            // Show Invite Modal
            loadFriendsForInvite();
            inviteModal.style.display = 'flex';
            
            listenToGame(onlineGameId);
        } else {
            alert('مشكلة في النت: ' + res.error);
        }
    } else {
        modeSelection.style.display = 'none';
        if (mode === 'ai') {
            p1NameEl.textContent = "أنت";
            p2NameEl.textContent = "الكمبيوتر";
        } else {
            p1NameEl.textContent = "لاعب 1";
            p2NameEl.textContent = "لاعب 2";
        }
        initGame();
    }
};

async function handleOnlineJoin(gid) {
    const res = await joinOnlineGame(gid);
    if (res.success) {
        gameMode = 'online';
        onlineGameId = gid;
        myRole = res.role;
        listenToGame(gid);
    } else {
        alert(res.error);
        window.location.href = 'games.html';
    }
}

function listenToGame(gid) {
    statusText.textContent = "بنوصل اللعبة...";
    unsubscribeGame = onSnapshot(doc(db, "games", gid), (docSnap) => {
        const data = docSnap.data();
        if (!data) return;

        // Sync State
        gameState = data.board;
        currentPlayer = data.turn;
        
        p1NameEl.textContent = data.playerXName + " (X)";
        p2NameEl.textContent = data.playerOName + " (O)";
        
        renderBoard();

        if (data.status === 'waiting') {
            statusText.textContent = "مستنيين صاحبك يدخل...";
            gameActive = false;
        } else if (data.status === 'playing') {
            gameActive = true;
            if (data.turn === myRole) {
                statusText.textContent = "دورك يا معلم! (" + myRole + ")";
                statusText.style.background = "#22c55e"; // Green
            } else {
                statusText.textContent = "دور المنافس...";
                statusText.style.background = "#f59e0b"; // Yellow
            }
        } else if (data.status === 'finished') {
            gameActive = false;
            endGame(data.winner);
        }
    });
}

function renderBoard() {
    cells.forEach((cell, index) => {
        cell.classList.remove('taken', 'win');
        if (gameState[index] === "X") {
            cell.innerHTML = '<i class="fa-solid fa-mug-hot symbol-x"></i>';
            cell.classList.add('taken');
        } else if (gameState[index] === "O") {
            cell.innerHTML = '<i class="fa-solid fa-leaf symbol-o"></i>';
            cell.classList.add('taken');
        } else {
            cell.innerHTML = "";
        }
    });
}

// --- Local Game Logic ---
function initGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    renderBoard();
    statusText.textContent = "ابدأ يا بطل";
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

async function handleCellClick(e) {
    const clickedCell = e.target.closest('.cell');
    const idx = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[idx] !== "" || !gameActive) return;

    // Online Check
    if (gameMode === 'online') {
        if (currentPlayer !== myRole) {
            alert("استنى دورك يا كابتن!");
            return;
        }
        
        const nextBoard = [...gameState];
        nextBoard[idx] = myRole;
        
        const winner = checkWin(nextBoard) ? myRole : (nextBoard.includes("") ? null : 'draw');
        const nextTurn = myRole === 'X' ? 'O' : 'X';
        
        await makeOnlineMove(onlineGameId, nextBoard, nextTurn, winner);
        return;
    }

    // Local/AI Logic
    gameState[idx] = currentPlayer;
    renderBoard();
    
    if (checkWin(gameState)) {
        endGame(currentPlayer);
        return;
    }
    if (!gameState.includes("")) {
        endGame('draw');
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    
    if (gameMode === 'ai' && currentPlayer === "O") {
        gameActive = false;
        setTimeout(makeAIMove, 500);
    }
}

// --- Helpers ---
function checkWin(board) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(let w of wins) {
        if(board[w[0]] && board[w[0]] === board[w[1]] && board[w[1]] === board[w[2]] && board[w[0]] !== "") return true;
    }
    return false;
}

function makeAIMove() {
    const empty = gameState.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    const move = empty[Math.floor(Math.random() * empty.length)];
    gameState[move] = "O";
    renderBoard();
    gameActive = true;
    
    if (checkWin(gameState)) endGame("O");
    else if (!gameState.includes("")) endGame('draw');
    else currentPlayer = "X";
}

function endGame(winner) {
    if (winner === 'draw') {
        showModal("تعادل!", "محدش غلب..", "fa-handshake");
    } else {
        const text = winner === myRole ? "مبروك كسبت! 🎉" : "حظ أوفر.. خسرت 😢";
        showModal(gameMode === 'online' ? text : `الفائز: ${winner}`, "", "fa-trophy");
    }
}

function showModal(title, msg, icon) {
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultMessage').textContent = msg;
    modal.style.display = 'flex';
}

window.resetGame = async () => {
    if (gameMode === 'online') {
        await resetOnlineGame(onlineGameId);
        modal.style.display = 'none';
    } else {
        modal.style.display = 'none';
        initGame();
    }
};

window.closeResultModal = () => { modal.style.display = 'none'; };
window.closeInviteModal = () => { inviteModal.style.display = 'none'; };

// Invite Logic
async function loadFriendsForInvite() {
    const list = document.getElementById('inviteList');
    list.innerHTML = 'جاري التحميل...';
    // Use user ID from auth
    const user = auth.currentUser;
    const res = await getUserFriends(user.uid); 
    if (res.success && res.data.length > 0) {
        list.innerHTML = res.data.map(f => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #eee;">
                <span>${f.fullName}</span>
                <button class="btn-primary" onclick="window.inviteFriend('${f.id}')" style="font-size:0.8rem; padding:5px 10px;">عزومة</button>
            </div>
        `).join('');
    } else {
        list.innerHTML = 'معندكش أصدقاء لسه..';
    }
}

window.inviteFriend = async (fid) => {
    const btn = event.target;
    btn.textContent = 'تم الإرسال';
    btn.disabled = true;
    await sendGameInvite(fid, onlineGameId);
};