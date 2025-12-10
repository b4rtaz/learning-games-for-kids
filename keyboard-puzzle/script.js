// Keyboard Puzzle Game
// Supports multiple grid sizes

// Grid size modes
const GRID_MODES = {
    large: { cols: 10, rows: 8, name: '10×8' },
    medium: { cols: 8, rows: 6, name: '8×6' },
    small: { cols: 6, rows: 4, name: '6×4' }
};

let currentGridMode = 'medium';
let GRID_COLS = GRID_MODES[currentGridMode].cols;
let GRID_ROWS = GRID_MODES[currentGridMode].rows;
let TOTAL_PIECES = GRID_COLS * GRID_ROWS;

// Characters pool: A-Z and 0-9
const CHARACTERS_ENGLISH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
const CHARACTERS_POLISH = 'ABCDEFGHIJKLMNOPRSTUWYZ0123456789'.split(''); // No Q, V, X in Polish

function getCharacters() {
    return currentLanguage === 'polish' ? CHARACTERS_POLISH : CHARACTERS_ENGLISH;
}

// Child-friendly images - Animals only
const IMAGES = [
    { id: 'lion', name: '🦁 Lion', url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&h=640&fit=crop' },
    { id: 'panda', name: '🐼 Panda', url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=640&fit=crop' },
    { id: 'elephant', name: '🐘 Elephant', url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&h=640&fit=crop' },
    { id: 'dolphin', name: '🐬 Dolphin', url: 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=800&h=640&fit=crop' },
    { id: 'butterfly', name: '🦋 Butterfly', url: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=800&h=640&fit=crop' },
    { id: 'puppy', name: '🐕 Puppy', url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=640&fit=crop' },
    { id: 'kitten', name: '🐱 Kitten', url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=640&fit=crop' },
    { id: 'parrot', name: '🦜 Parrot', url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=640&fit=crop' },
    { id: 'turtle', name: '🐢 Turtle', url: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?w=800&h=640&fit=crop' },
    { id: 'penguin', name: '🐧 Penguin', url: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=800&h=640&fit=crop' },
    { id: 'fox', name: '🦊 Fox', url: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=800&h=640&fit=crop' },
    { id: 'owl', name: '🦉 Owl', url: 'https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?w=800&h=640&fit=crop' },
    { id: 'rabbit', name: '🐰 Rabbit', url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&h=640&fit=crop' },
    { id: 'giraffe', name: '🦒 Giraffe', url: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&h=640&fit=crop' },
    { id: 'zebra', name: '🦓 Zebra', url: 'https://images.unsplash.com/photo-1501706362039-c06b2d715385?w=800&h=640&fit=crop' },
    { id: 'koala', name: '🐨 Koala', url: 'https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?w=800&h=640&fit=crop' },
    { id: 'flamingo', name: '🦩 Flamingo', url: 'https://images.unsplash.com/photo-1497206365907-f5e630693df0?w=800&h=640&fit=crop' },
    { id: 'peacock', name: '🦚 Peacock', url: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=800&h=640&fit=crop' },
    { id: 'tiger', name: '🐅 Tiger', url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&h=640&fit=crop' },
    { id: 'bear', name: '🐻 Bear', url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&h=640&fit=crop' },
    { id: 'deer', name: '🦌 Deer', url: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=800&h=640&fit=crop' },
    { id: 'monkey', name: '🐒 Monkey', url: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800&h=640&fit=crop' },
    { id: 'horse', name: '🐴 Horse', url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&h=640&fit=crop' },
    { id: 'frog', name: '🐸 Frog', url: 'https://images.unsplash.com/photo-1474314170901-f351b68f544f?w=800&h=640&fit=crop' },
    { id: 'hedgehog', name: '🦔 Hedgehog', url: 'https://images.unsplash.com/photo-1446292267125-fecb4ecbf1a5?w=800&h=640&fit=crop' },
    { id: 'squirrel', name: '🐿️ Squirrel', url: 'https://images.unsplash.com/photo-1507666405895-422eee7d517f?w=800&h=640&fit=crop' },
    { id: 'cat', name: '🐈 Cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=640&fit=crop' },
    { id: 'hamster', name: '🐹 Hamster', url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&h=640&fit=crop' },
    { id: 'duck', name: '🦆 Duck', url: 'https://images.unsplash.com/photo-1459682687441-7761439a709d?w=800&h=640&fit=crop' },
    { id: 'goldfish', name: '🐠 Fish', url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&h=640&fit=crop' },
];

let currentLanguage = 'english';
let selectedImage = IMAGES[0];
let puzzlePieces = [];
let currentPieceIndex = 0;
let soundEnabled = true;
let gameStarted = false;
let preloadedLetterSounds = {};

const UI_TEXT = {
    english: {
        progressLabel: 'Progress',
        instruction: 'Press the highlighted key to uncover a puzzle piece!',
        pressLabel: 'Press:',
        celebration: '⭐ GREAT! ⭐',
        finishTitle: '🎉 AMAZING! 🎉',
        finishButton: 'Play Again',
        homeButton: 'Menu',
        soundOn: '🔊 Sound ON',
        soundOff: '🔇 Sound OFF',
        startLangLabel: 'Choose your language:',
        startImageLabel: 'Choose an image:',
        startSizeLabel: 'Choose grid size:',
        startButton: 'Start!'
    },
    polish: {
        progressLabel: 'Postęp',
        instruction: 'Naciśnij podświetlony klawisz, aby odsłonić kawałek układanki!',
        pressLabel: 'Naciśnij:',
        celebration: '⭐ BRAWO! ⭐',
        finishTitle: '🎉 WSPANIALE! 🎉',
        finishButton: 'Zagraj ponownie',
        homeButton: 'Menu',
        soundOn: '🔊 Dźwięk WŁ',
        soundOff: '🔇 Dźwięk WYŁ',
        startLangLabel: 'Wybierz język:',
        startImageLabel: 'Wybierz obrazek:',
        startSizeLabel: 'Wybierz rozmiar:',
        startButton: 'Start!'
    }
};

// Confetti
let confettiEl = null;

function setupConfetti() {
    confettiEl = document.getElementById('confettiScreen');
}

function triggerConfetti() {
    if (!confettiEl) return;
    const colors = ['#ff6b6b', '#ffd166', '#4ecdc4', '#ffe66d', '#ff9f1c', '#667eea'];
    const count = 50;
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        const size = 6 + Math.random() * 8;
        piece.style.width = `${size}px`;
        piece.style.height = `${size * 1.4}px`;
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 160}px`);
        piece.style.setProperty('--r', `${Math.random() * 360}deg`);
        piece.style.setProperty('--d', `${0.85 + Math.random() * 0.4}s`);
        piece.style.setProperty('--delay', `${Math.random() * 0.15}s`);
        piece.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);
        confettiEl.appendChild(piece);
        setTimeout(() => {
            if (piece.parentNode) {
                piece.parentNode.removeChild(piece);
            }
        }, 1200);
    }
}

function triggerBigConfetti() {
    if (!confettiEl) return;
    const colors = ['#ff6b6b', '#ffd166', '#4ecdc4', '#ffe66d', '#ff9f1c', '#667eea', '#a855f7'];
    const count = 150;
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        const size = 8 + Math.random() * 12;
        piece.style.width = `${size}px`;
        piece.style.height = `${size * 1.4}px`;
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 200}px`);
        piece.style.setProperty('--r', `${Math.random() * 360}deg`);
        piece.style.setProperty('--d', `${1.2 + Math.random() * 0.6}s`);
        piece.style.setProperty('--delay', `${Math.random() * 0.3}s`);
        piece.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);
        confettiEl.appendChild(piece);
        setTimeout(() => {
            if (piece.parentNode) {
                piece.parentNode.removeChild(piece);
            }
        }, 2000);
    }
}

// Sound functions using Audio() as in letter-jump
function preloadLetterSounds() {
    const symbols = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
    preloadedLetterSounds = {};

    const langFolder = currentLanguage === 'polish' ? 'pl' : 'en';
    
    symbols.forEach(symbol => {
        const upper = symbol.toUpperCase();
        const path = `../assets/letters/${langFolder}/${langFolder}_${upper}.mp3`;
        const audio = new Audio(path);
        audio.preload = 'auto';
        preloadedLetterSounds[symbol] = audio;
    });
}

function playLetterSound(letter) {
    if (!soundEnabled || !letter) return;
    
    const symbol = letter.toLowerCase();
    const audio = preloadedLetterSounds[symbol];
    
    if (audio) {
        const clone = audio.cloneNode();
        clone.volume = 0.6;
        clone.play().catch(() => {});
    }
}

function playCorrectSound() {
    if (!soundEnabled) return;
    
    // Generate a simple positive sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playWrongSound() {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playSuccessSound() {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523, 659, 784, 1047];
    
    notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.12);
        
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime + i * 0.12);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.12 + 0.2);
        
        oscillator.start(audioContext.currentTime + i * 0.12);
        oscillator.stop(audioContext.currentTime + i * 0.12 + 0.2);
    });
}

// Shuffle array
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Generate puzzle pieces with random characters
function generatePuzzlePieces() {
    puzzlePieces = [];
    
    // Update grid dimensions based on current mode
    GRID_COLS = GRID_MODES[currentGridMode].cols;
    GRID_ROWS = GRID_MODES[currentGridMode].rows;
    TOTAL_PIECES = GRID_COLS * GRID_ROWS;
    
    // Create array of indices and shuffle for random order
    const indices = [];
    for (let i = 0; i < TOTAL_PIECES; i++) {
        indices.push(i);
    }
    shuffleArray(indices);
    
    // Assign RANDOM characters to each piece
    const characters = getCharacters();
    for (let i = 0; i < TOTAL_PIECES; i++) {
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        puzzlePieces.push({
            index: i,
            order: indices[i], // Random order for uncovering
            character: randomChar,
            uncovered: false
        });
    }
    
    // Sort by order to determine which piece to uncover next
    puzzlePieces.sort((a, b) => a.order - b.order);
}

// Render the puzzle grid
function renderPuzzleGrid() {
    const grid = document.getElementById('puzzlesGrid');
    grid.innerHTML = '';
    
    // Update grid CSS for current mode
    grid.style.gridTemplateColumns = `repeat(${GRID_COLS}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${GRID_ROWS}, 1fr)`;
    
    // Create pieces in grid order
    const sortedByIndex = [...puzzlePieces].sort((a, b) => a.index - b.index);
    
    sortedByIndex.forEach(piece => {
        const pieceEl = document.createElement('div');
        pieceEl.className = 'puzzle-piece';
        pieceEl.id = `piece-${piece.index}`;
        pieceEl.textContent = piece.character;
        
        if (piece.uncovered) {
            pieceEl.classList.add('uncovered');
        }
        
        grid.appendChild(pieceEl);
    });
    
    highlightCurrentPiece();
}

// Highlight the current piece to uncover
function highlightCurrentPiece() {
    // Remove current class from all pieces
    document.querySelectorAll('.puzzle-piece.current').forEach(el => {
        el.classList.remove('current');
    });
    
    if (currentPieceIndex < TOTAL_PIECES) {
        const currentPiece = puzzlePieces[currentPieceIndex];
        const pieceEl = document.getElementById(`piece-${currentPiece.index}`);
        if (pieceEl) {
            pieceEl.classList.add('current');
        }
        
        // Update current key display
        document.getElementById('currentKey').textContent = currentPiece.character;
        
        // Play the letter sound
        setTimeout(() => {
            playLetterSound(currentPiece.character);
        }, 100);
    }
}

// Update progress display
function updateProgress() {
    document.getElementById('progress').textContent = currentPieceIndex;
}

// Update background color based on progress
function updateBackground() {
    const progress = currentPieceIndex / TOTAL_PIECES;
    
    // Start: light playful purple/pink -> End: serious deep blue/purple
    const startHue1 = 280;  // Light purple
    const endHue1 = 220;    // Deep blue
    const startHue2 = 320;  // Pink
    const endHue2 = 260;    // Deep purple
    
    const hue1 = startHue1 + (endHue1 - startHue1) * progress;
    const hue2 = startHue2 + (endHue2 - startHue2) * progress;
    
    // Saturation: stays vivid but gets slightly more intense
    const sat1 = 70 + progress * 15;
    const sat2 = 60 + progress * 20;
    
    // Lightness: goes from light to darker
    const light1 = 70 - progress * 30;  // 70% -> 40%
    const light2 = 55 - progress * 25;  // 55% -> 30%
    
    document.body.style.background = `linear-gradient(180deg, 
        hsl(${hue1}, ${sat1}%, ${light1}%) 0%, 
        hsl(${hue2}, ${sat2}%, ${light2}%) 100%)`;
}

// Handle key press
function handleKeyPress(e) {
    if (!gameStarted) return;
    if (e.repeat) return;
    
    const key = e.key.toUpperCase();
    
    // Only handle A-Z and 0-9
    if (!/^[A-Z0-9]$/.test(key)) return;
    
    if (currentPieceIndex >= TOTAL_PIECES) return;
    
    const currentPiece = puzzlePieces[currentPieceIndex];
    const pieceEl = document.getElementById(`piece-${currentPiece.index}`);
    
    if (key === currentPiece.character) {
        // Correct key pressed
        playCorrectSound();
        triggerConfetti();
        
        currentPiece.uncovered = true;
        if (pieceEl) {
            pieceEl.classList.remove('current');
            pieceEl.classList.add('uncover-animation');
            
            setTimeout(() => {
                pieceEl.classList.add('uncovered');
            }, 400);
        }
        
        currentPieceIndex++;
        updateProgress();
        updateBackground();
        
        if (currentPieceIndex >= TOTAL_PIECES) {
            // Game complete!
            setTimeout(() => {
                gameComplete();
            }, 500);
        } else {
            // Move to next piece
            setTimeout(() => {
                highlightCurrentPiece();
            }, 300);
        }
    } else {
        // Wrong key pressed
        playWrongSound();
        
        if (pieceEl) {
            pieceEl.classList.add('wrong');
            setTimeout(() => {
                pieceEl.classList.remove('wrong');
            }, 400);
        }
        
        // Replay the correct letter sound
        setTimeout(() => {
            playLetterSound(currentPiece.character);
        }, 400);
    }
}

// Game complete
function gameComplete() {
    playSuccessSound();
    triggerBigConfetti();
    
    const celebration = document.getElementById('celebration');
    celebration.classList.add('show');
    
    setTimeout(() => {
        celebration.classList.remove('show');
        showFinishScreen();
    }, 1000);
}

// UI functions
function getUIText() {
    return currentLanguage === 'polish' ? UI_TEXT.polish : UI_TEXT.english;
}

function updateUIStrings() {
    const t = getUIText();
    
    document.getElementById('progressLabel').textContent = t.progressLabel;
    document.getElementById('instructionsText').textContent = t.instruction;
    document.getElementById('currentKeyLabel').textContent = t.pressLabel;
    document.getElementById('celebration').textContent = t.celebration;
    document.getElementById('finishTitle').textContent = t.finishTitle;
    
    const homeBtn = document.getElementById('homeButton');
    if (homeBtn) homeBtn.textContent = `🏠 ${t.homeButton}`;
    
    updateSoundButton();
}

function updateSoundButton() {
    const t = getUIText();
    const btn = document.getElementById('soundToggle');
    if (btn) {
        btn.textContent = soundEnabled ? t.soundOn : t.soundOff;
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    updateSoundButton();
}

function selectLanguage(lang) {
    currentLanguage = lang;
    
    const polishBtn = document.getElementById('langPolish');
    const englishBtn = document.getElementById('langEnglish');
    
    if (polishBtn) polishBtn.classList.toggle('active', lang === 'polish');
    if (englishBtn) englishBtn.classList.toggle('active', lang === 'english');
    
    updateStartScreenStrings();
}

function selectImage(imageId) {
    selectedImage = IMAGES.find(img => img.id === imageId) || IMAGES[0];
    
    document.querySelectorAll('.image-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.imageId === imageId);
    });
}

function updateStartScreenStrings() {
    const t = getUIText();
    
    const langLabel = document.getElementById('startLangLabel');
    const imageLabel = document.getElementById('startImageLabel');
    const sizeLabel = document.getElementById('startSizeLabel');
    const startBtn = document.getElementById('startBtn');
    
    if (langLabel) langLabel.textContent = t.startLangLabel;
    if (imageLabel) imageLabel.textContent = t.startImageLabel;
    if (sizeLabel) sizeLabel.textContent = t.startSizeLabel;
    if (startBtn) startBtn.textContent = t.startButton;
}

function selectGridMode(mode) {
    currentGridMode = mode;
    
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
}

function renderSizeButtons() {
    const container = document.getElementById('sizeButtons');
    if (!container) return;
    container.innerHTML = '';
    
    Object.entries(GRID_MODES).forEach(([mode, config]) => {
        const btn = document.createElement('button');
        btn.className = 'size-btn' + (mode === currentGridMode ? ' active' : '');
        btn.dataset.mode = mode;
        btn.textContent = config.name;
        btn.onclick = () => selectGridMode(mode);
        container.appendChild(btn);
    });
}

function renderImageButtons() {
    const container = document.getElementById('imageButtons');
    container.innerHTML = '';
    
    IMAGES.forEach((img, index) => {
        const btn = document.createElement('button');
        btn.className = 'image-btn' + (index === 0 ? ' active' : '');
        btn.dataset.imageId = img.id;
        btn.onclick = () => selectImage(img.id);
        
        const imgEl = document.createElement('img');
        imgEl.src = img.url;
        imgEl.alt = img.name;
        imgEl.loading = 'lazy';
        
        const nameEl = document.createElement('span');
        nameEl.className = 'image-name';
        nameEl.textContent = img.name;
        
        btn.appendChild(imgEl);
        btn.appendChild(nameEl);
        container.appendChild(btn);
    });
}

function startGame() {
    preloadLetterSounds();
    generatePuzzlePieces();
    
    document.getElementById('startScreen').style.display = 'none';
    
    // Set the background image
    document.getElementById('backgroundImage').src = selectedImage.url;
    
    gameStarted = true;
    currentPieceIndex = 0;
    
    document.getElementById('progressTotal').textContent = TOTAL_PIECES;
    updateProgress();
    updateBackground();
    updateUIStrings();
    
    renderPuzzleGrid();
}

function showFinishScreen() {
    const t = getUIText();
    const finish = document.getElementById('finishScreen');
    const title = document.getElementById('finishTitle');
    const btn = finish.querySelector('.finish-button');
    const preview = document.getElementById('finishImagePreview');
    
    if (title) title.textContent = t.finishTitle;
    if (btn) btn.textContent = t.finishButton;
    
    // Show the completed image
    if (preview) {
        preview.innerHTML = `<img src="${selectedImage.url}" alt="Completed puzzle">`;
    }
    
    if (finish) {
        finish.style.display = 'flex';
    }
}

function hideFinishScreen() {
    const finish = document.getElementById('finishScreen');
    if (finish) finish.style.display = 'none';
}

function restartGame() {
    hideFinishScreen();
    startGame();
}

function goHome() {
    hideFinishScreen();
    gameStarted = false;
    
    const start = document.getElementById('startScreen');
    if (start) start.style.display = 'flex';
    
    const grid = document.getElementById('puzzlesGrid');
    if (grid) grid.innerHTML = '';
    
    currentPieceIndex = 0;
    puzzlePieces = [];
}

// Initialize
document.addEventListener('keydown', handleKeyPress);
setupConfetti();
renderImageButtons();
renderSizeButtons();
selectLanguage(currentLanguage);
updateStartScreenStrings();
hideFinishScreen();
