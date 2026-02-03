







import { 
    auth, onAuthStateChanged, createChessGame, joinChessGame, 
    makeChessMove, onSnapshot, doc, db, getUserFriends, sendGameInvite
} from './auth-service.js';

let board = null;
let game = null;
let currentMode = '';
let playerColor = 'w';
let gameId = null;
let isMyTurn = true;
let selectedSquare = null; 

// Sounds
const sndMove = document.getElementById('sndMove');
const sndCapture = document.getElementById('sndCapture');
const sndNotify = document.getElementById('sndNotify');
const sndWin = document.getElementById('sndWin');

// ================= AUTH CHECK =================
onAuthStateChanged(auth, (user) => {
    const navAuth = document.getElementById('navAuth');
    if (navAuth) {
        if (user) {
            navAuth.innerHTML = `<img src="${user.photoURL || 'images/user.png'}" style="width:35px;height:35px;border-radius:50%;border:2px solid var(--border-color);">`;
            // Set Player Info
            document.getElementById('myAvatar').src = user.photoURL || 'images/user.png';
            document.getElementById('myName').innerText = user.displayName || 'أنا';
        } else {
            navAuth.innerHTML = `<a href="login.html" style="font-weight:bold;">دخول</a>`;
        }
    }
});

// ================= GAME START =================
window.startGame = async function(mode) {
    if (typeof window.Chess === 'undefined' || typeof window.Chessboard === 'undefined') {
        alert("لحظة واحدة، جاري تحميل ملفات اللعبة..."); return;
    }

    currentMode = mode;
    document.getElementById('setupScreen').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';

    game = new window.Chess();

    if (mode === 'online') {
        const user = auth.currentUser;
        if (!user) { alert("لازم تسجل دخول عشان تلعب أونلاين!"); window.location.href = 'login.html'; return; }
        
        const urlParams = new URLSearchParams(window.location.search);
        const inviteId = urlParams.get('gameId');
        
        if (inviteId) await initOnlineGame(inviteId);
        else await createNewOnlineGame();

    } else if (mode === 'ai') {
        playerColor = 'w'; // Human is White
        initBoard('white');
        updateStatus();
    } else {
        // Local 1vs1
        playerColor = 'both';
        initBoard('white');
        updateStatus();
    }
};

// ================= BOARD SETUP =================
function initBoard(orientation = 'white') {
    const config = {
        draggable: true,
        position: 'start',
        orientation: orientation,
        pieceTheme: createPieceIcon, // Custom Coffee FontAwesome
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        moveSpeed: 'fast',
        snapbackSpeed: 'fast',
        snapSpeed: 'fast'
    };
    
    board = window.Chessboard('myBoard', config);
    $('#myBoard').on('click', '.square-55d63', handleSquareClick); // Hybrid Click
    
    updateStatus();
    window.addEventListener('resize', board.resize);
}

// ================= PIECE GRAPHICS (COFFEE THEME) =================
function createPieceIcon(piece) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 60; canvas.height = 60;

    const icons = { 'k': '\uf43f', 'q': '\uf445', 'r': '\uf447', 'b': '\uf43a', 'n': '\uf441', 'p': '\uf443' };
    const type = piece.charAt(1).toLowerCase(); 
    const color = piece.charAt(0); 

    ctx.font = "900 42px 'Font Awesome 6 Free'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (color === 'w') {
        // White Pieces: Beige with Dark Outline
        ctx.fillStyle = "#FFF8DC"; 
        ctx.strokeStyle = "#4A3424"; 
        ctx.lineWidth = 2;
        ctx.strokeText(icons[type], 30, 35);
        ctx.fillText(icons[type], 30, 35);
    } else {
        // Black Pieces: Dark Coffee
        ctx.fillStyle = "#2C1810"; 
        ctx.fillText(icons[type], 30, 35);
        ctx.strokeStyle = "#FFF8DC"; 
        ctx.lineWidth = 1;
        ctx.strokeText(icons[type], 30, 35);
    }
    return canvas.toDataURL();
}

// ================= GAME LOGIC =================
function onDragStart(source, piece) {
    if (game.game_over()) return false;

    // Check permissions
    if (currentMode === 'online') {
        if (!isMyTurn) return false;
        if ((playerColor === 'w' && piece.search(/^b/) !== -1) || 
            (playerColor === 'b' && piece.search(/^w/) !== -1)) return false;
    }
    if (currentMode === 'ai' && piece.search(/^b/) !== -1) return false;

    // Show Hints
    removeHighlights();
    selectedSquare = source;
    showMoveHints(source);
}

function onDrop(source, target) {
    removeHighlights();
    selectedSquare = null;

    const move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) return 'snapback';

    playSound(move);
    updateStatus();
    updateMoveHistory();
    processMove(move);
}

function onSnapEnd() {
    board.position(game.fen());
}

function handleSquareClick(e) {
    const square = $(this).attr('data-square');
    
    if (selectedSquare && selectedSquare !== square) {
        const move = game.move({ from: selectedSquare, to: square, promotion: 'q' });
        if (move) {
            playSound(move);
            board.position(game.fen());
            selectedSquare = null;
            removeHighlights();
            updateStatus();
            updateMoveHistory();
            processMove(move);
            return;
        }
    }

    const piece = game.get(square);
    if (piece && isPieceMine(piece)) {
        selectedSquare = square;
        removeHighlights();
        showMoveHints(square);
    } else {
        selectedSquare = null;
        removeHighlights();
    }
}

function isPieceMine(piece) {
    if (currentMode === 'online') return piece.color === playerColor && isMyTurn;
    if (currentMode === 'ai') return piece.color === 'w';
    return piece.color === game.turn();
}

// ================= AI & PROCESSING =================
function processMove(move) {
    if (game.game_over()) {
        playSound(null, 'win');
        return;
    }

    if (currentMode === 'ai' && game.turn() === 'b') {
        setTimeout(makeBestMove, 500); // AI Thinking Delay
    } else if (currentMode === 'online') {
        sendMoveToFirebase(move);
    }
}

function makeBestMove() {
    const moves = game.moves({ verbose: true });
    if (moves.length === 0) return;

    // Simple Evaluation AI
    let bestMove = moves[0];
    let bestScore = -9999;

    for (let i = 0; i < moves.length; i++) {
        game.move(moves[i]);
        let score = evaluateBoard(game.fen());
        game.undo();
        
        // Add randomness
        score += Math.random() * 0.5;

        if (score > bestScore) {
            bestScore = score;
            bestMove = moves[i];
        }
    }

    game.move(bestMove);
    board.position(game.fen());
    playSound(bestMove);
    updateStatus();
    updateMoveHistory();
}

function evaluateBoard(fen) {
    const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    let score = 0;
    const pieces = fen.split(' ')[0];
    for (let char of pieces) {
        if (values[char.toLowerCase()]) {
            const val = values[char.toLowerCase()];
            score += (char === char.toUpperCase()) ? -val : val; // AI is Black (Positive)
        }
    }
    return score;
}

// ================= ONLINE SYSTEM =================
async function createNewOnlineGame() {
    document.getElementById('status').innerHTML = 'جاري إنشاء الغرفة...';
    const res = await createChessGame();
    if (res.success) {
        gameId = res.gameId;
        playerColor = 'w';
        document.getElementById('shareBtn').style.display = 'block'; // Show invite button
        document.getElementById('status').innerText = 'أنت الأبيض. اعزم صاحبك!';
        
        loadFriendsForInvite();
        document.getElementById('inviteModal').style.display = 'flex';
        
        initBoard('white');
        listenToGame(gameId);
        window.history.pushState({}, '', `?gameId=${gameId}`);
    }
}

async function initOnlineGame(id) {
    gameId = id;
    document.getElementById('status').innerHTML = 'جاري الاتصال...';
    const res = await joinChessGame(gameId);
    if (res.success) {
        playerColor = res.color === 'white' ? 'w' : 'b';
        // Auto Flip Board if Black
        initBoard(playerColor === 'w' ? 'white' : 'black');
        
        document.getElementById('status').innerText = (playerColor === 'w') ? 'أنت الأبيض' : 'أنت الأسود';
        listenToGame(gameId);
    } else {
        alert("الغرفة غير موجودة أو ممتلئة");
        window.location.href = 'games-chess.html';
    }
}

function listenToGame(id) {
    onSnapshot(doc(db, "chess_games", id), (docSnap) => {
        if (!docSnap.exists()) return;
        const data = docSnap.data();

        // Update Opponent Name
        if(playerColor === 'w' && data.blackName) document.getElementById('oppName').innerText = data.blackName;
        if(playerColor === 'b' && data.whiteName) document.getElementById('oppName').innerText = data.whiteName;

        if (data.fen !== game.fen()) {
            game.load(data.fen);
            board.position(data.fen);
            playSound(data.lastMove);
            updateStatus();
            updateMoveHistory();
        }

        isMyTurn = (data.turn === playerColor);
        document.getElementById('status').innerText = isMyTurn ? "دورك الآن!" : "انتظار الخصم...";
        if(isMyTurn && data.status !== 'finished') sndNotify.play();
    });
}

async function sendMoveToFirebase(move) {
    const newFen = game.fen();
    const nextTurn = game.turn();
    let winner = null;
    if (game.in_checkmate()) winner = playerColor;
    await makeChessMove(gameId, newFen, nextTurn, move, winner);
}

// ================= UI HELPERS =================
function updateStatus() {
    let status = '';
    let moveColor = (game.turn() === 'w') ? 'الأبيض' : 'الأسود';

    if (game.in_checkmate()) status = `كش ملك! ${moveColor} خسر.`;
    else if (game.in_draw()) status = 'تعادل!';
    else status = `الدور على: ${moveColor}`;

    if (game.in_check()) status += ' (كش!)';
    document.getElementById('status').innerText = status;
}

function playSound(move, type=null) {
    try {
        if (type === 'win') { sndWin.play(); return; }
        if (move && (move.flags.includes('c') || move.flags.includes('e'))) {
            sndCapture.play(); 
        } else {
            sndMove.play(); 
        }
    } catch(e) { console.log("Audio play error", e); }
}

function updateMoveHistory() {
    const history = game.history();
    const list = document.getElementById('moveHistory');
    let html = '';
    for (let i = 0; i < history.length; i += 2) {
        html += `<div class="move-row">
            <div class="move-num">${(i/2)+1}.</div>
            <div class="move-val">${history[i]}</div>
            <div class="move-val">${history[i+1] || ''}</div>
        </div>`;
    }
    list.innerHTML = html;
    list.scrollTop = list.scrollHeight;
}

function removeHighlights() {
    $('#myBoard .square-55d63').removeClass('highlight-active');
    $('#myBoard .hint-dot').remove();
    $('#myBoard .capture-ring').remove();
}

function showMoveHints(square) {
    const $square = $('#myBoard .square-' + square);
    $square.addClass('highlight-active');

    const moves = game.moves({ square: square, verbose: true });
    moves.forEach(move => {
        const $target = $('#myBoard .square-' + move.to);
        if (move.flags.includes('c') || move.flags.includes('e')) {
            $target.append('<div class="capture-ring"></div>');
        } else {
            $target.append('<div class="hint-dot"></div>');
        }
    });
}

// Friend Invite Logic
window.shareGameLink = function() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => alert("تم نسخ الرابط! ابعته لصاحبك."));
};

async function loadFriendsForInvite() {
    const list = document.getElementById('inviteList');
    list.innerHTML = '<div style="padding:10px; text-align:center;">جاري التحميل...</div>';
    
    const user = auth.currentUser;
    const res = await getUserFriends(user.uid);
    
    if (res.success && res.data.length > 0) {
        list.innerHTML = res.data.map(f => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #eee;">
                <div style="display:flex; gap:10px; align-items:center;">
                    <img src="${f.photoURL || 'images/user.png'}" style="width:30px; height:30px; border-radius:50%;">
                    <span>${f.fullName}</span>
                </div>
                <button class="btn-primary" onclick="sendInvite('${f.id}')" style="font-size:0.8rem;">دعوة</button>
            </div>`).join('');
    } else {
        list.innerHTML = '<div style="padding:10px; text-align:center;">معندكش أصدقاء لسه..</div>';
    }
}

window.sendInvite = async (fid) => {
    await sendGameInvite(fid, gameId, 'chess');
    alert("تم إرسال الدعوة!");
};