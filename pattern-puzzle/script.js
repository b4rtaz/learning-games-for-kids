'use strict';

const TOTAL_ROUNDS = 10;
const ANSWER_LETTERS = ['A', 'B', 'C'];
const UI_TEXT = {
    english: {
        documentTitle: 'Pattern Puzzle - Think and Type!',
        title: 'Pattern Puzzle',
        intro: 'Find what comes next, then type the letter on the correct answer.',
        languageLabel: 'Choose your language:',
        start: 'Start 10 rounds',
        round: 'Round',
        question: 'What comes next?',
        hint: 'Type the letter on the correct card',
        soundOn: '🔊 Sound on',
        soundOff: '🔇 Sound off',
        menu: '⌂ Menu',
        correct: 'Great! That is the pattern!',
        wrong: 'Try again — look closely at the pattern.',
        finishTitle: 'Great thinking!',
        scoreOutOf: '/10 correct on the first try',
        accuracy: 'Accuracy',
        mistakes: 'Wrong keys',
        perfect: 'You spotted every pattern!',
        strong: 'Excellent pattern spotting!',
        good: 'Good work — your pattern skills are growing!',
        keepGoing: 'Nice try! Every game makes your brain stronger.',
        restart: 'Play again',
        back: 'Back to menu',
        patternImage: 'Pattern image',
        answerChoice: 'Answer choice'
    },
    polish: {
        documentTitle: 'Układanka Wzorów - Myśl i Pisz!',
        title: 'Układanka Wzorów',
        intro: 'Odgadnij, co będzie dalej, a potem wpisz literę z poprawnej odpowiedzi.',
        languageLabel: 'Wybierz język:',
        start: 'Rozpocznij 10 rund',
        round: 'Runda',
        question: 'Co będzie dalej?',
        hint: 'Wpisz literę z poprawnej karty',
        soundOn: '🔊 Dźwięk wł.',
        soundOff: '🔇 Dźwięk wył.',
        menu: '⌂ Menu',
        correct: 'Brawo! To właściwy wzór!',
        wrong: 'Spróbuj ponownie — przyjrzyj się wzorowi.',
        finishTitle: 'Świetnie myślisz!',
        scoreOutOf: '/10 poprawnych za pierwszym razem',
        accuracy: 'Celność',
        mistakes: 'Błędne klawisze',
        perfect: 'Rozpoznajesz wszystkie wzory!',
        strong: 'Doskonale rozpoznajesz wzory!',
        good: 'Dobra robota — coraz lepiej rozpoznajesz wzory!',
        keepGoing: 'Dobra próba! Każda gra ćwiczy Twój umysł.',
        restart: 'Zagraj ponownie',
        back: 'Wróć do menu',
        patternImage: 'Obrazek wzoru',
        answerChoice: 'Możliwa odpowiedź'
    }
};

const state = {
    language: detectLanguage(),
    soundEnabled: true,
    puzzles: [],
    roundIndex: 0,
    firstTryScore: 0,
    totalMistakes: 0,
    roundMistakes: 0,
    locked: false
};

const elements = {};

function detectLanguage() {
    const browserLanguage = navigator.language || 'en';
    return browserLanguage.toLowerCase().startsWith('pl') ? 'polish' : 'english';
}

function text() {
    return UI_TEXT[state.language];
}

function cacheElements() {
    [
        'startScreen', 'gameScreen', 'finishScreen', 'gameTitle', 'gameIntro', 'languageLabel',
        'langPolish', 'langEnglish', 'startButton', 'roundLabel', 'roundNumber', 'roundTotal',
        'progressFill', 'soundButton', 'menuButton', 'questionText', 'keyboardHint', 'sequenceRow',
        'answersRow', 'feedback', 'finishTitle', 'scoreValue', 'scoreOutOf', 'accuracyValue',
        'accuracyLabel', 'mistakesValue', 'mistakesLabel', 'finishMessage', 'restartButton',
        'finishMenuButton', 'confetti'
    ].forEach(id => { elements[id] = document.getElementById(id); });
}

function setLanguage(language) {
    state.language = language;
    document.documentElement.lang = language === 'polish' ? 'pl' : 'en';
    const copy = text();
    document.title = copy.documentTitle;
    elements.gameTitle.textContent = copy.title;
    elements.gameIntro.textContent = copy.intro;
    elements.languageLabel.textContent = copy.languageLabel;
    elements.startButton.textContent = copy.start;
    elements.roundLabel.textContent = copy.round;
    elements.questionText.textContent = copy.question;
    elements.keyboardHint.textContent = copy.hint;
    elements.menuButton.textContent = copy.menu;
    elements.finishTitle.textContent = copy.finishTitle;
    elements.scoreOutOf.textContent = copy.scoreOutOf;
    elements.accuracyLabel.textContent = copy.accuracy;
    elements.mistakesLabel.textContent = copy.mistakes;
    elements.restartButton.textContent = copy.restart;
    elements.finishMenuButton.textContent = copy.back;
    elements.langPolish.classList.toggle('active', language === 'polish');
    elements.langEnglish.classList.toggle('active', language === 'english');
    updateSoundButton();
}

function showScreen(screen) {
    [elements.startScreen, elements.gameScreen, elements.finishScreen].forEach(element => {
        element.hidden = element !== screen;
    });
}

function startGame() {
    state.puzzles = PatternEngine.generateGame(TOTAL_ROUNDS);
    state.roundIndex = 0;
    state.firstTryScore = 0;
    state.totalMistakes = 0;
    state.roundMistakes = 0;
    state.locked = false;
    elements.roundTotal.textContent = String(TOTAL_ROUNDS);
    showScreen(elements.gameScreen);
    renderRound();
}

function renderRound() {
    const puzzle = state.puzzles[state.roundIndex];
    state.roundMistakes = 0;
    state.locked = false;
    elements.roundNumber.textContent = String(state.roundIndex + 1);
    elements.progressFill.style.width = `${(state.roundIndex / TOTAL_ROUNDS) * 100}%`;
    elements.feedback.textContent = '';
    elements.feedback.className = 'feedback';
    elements.sequenceRow.replaceChildren();
    elements.answersRow.replaceChildren();

    puzzle.sequence.forEach((patternItem, index) => {
        elements.sequenceRow.appendChild(createVisualCard(patternItem, 'sequence-card', `${text().patternImage} ${index + 1}`));
    });

    const questionCard = document.createElement('div');
    questionCard.className = 'visual-card sequence-card question-card';
    questionCard.textContent = '?';
    questionCard.setAttribute('aria-label', text().question);
    elements.sequenceRow.appendChild(questionCard);

    puzzle.choices.forEach((choice, index) => {
        const letter = ANSWER_LETTERS[index];
        const card = createVisualCard(choice, 'answer-card', `${text().answerChoice} ${letter}`);
        card.dataset.choiceIndex = String(index);
        card.dataset.letter = letter;
        const keyBadge = document.createElement('span');
        keyBadge.className = 'key-badge';
        keyBadge.textContent = letter;
        card.appendChild(keyBadge);
        elements.answersRow.appendChild(card);
    });
}

function createVisualCard(patternItem, className, ariaLabel) {
    const card = document.createElement('div');
    card.className = `visual-card ${className}`;
    card.setAttribute('aria-label', ariaLabel);
    card.appendChild(createPatternSvg(patternItem));
    return card;
}

function createPatternSvg(patternItem) {
    const namespace = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('viewBox', '0 0 120 120');
    svg.setAttribute('aria-hidden', 'true');

    const layouts = {
        1: [[60, 60]],
        2: [[38, 60], [82, 60]],
        3: [[60, 32], [36, 82], [84, 82]],
        4: [[38, 38], [82, 38], [38, 82], [82, 82]]
    };
    const positionMap = {
        center: [60, 60], top: [60, 30], right: [90, 60], bottom: [60, 90], left: [30, 60]
    };
    const points = patternItem.count > 1 ? layouts[patternItem.count] : [positionMap[patternItem.position] || positionMap.center];
    const sizeMap = { small: 16, medium: 23, large: 31, 'extra-large': 39 };
    const radius = patternItem.count > 1 ? Math.min(sizeMap[patternItem.size], 18) : sizeMap[patternItem.size];

    points.forEach(([x, y]) => {
        svg.appendChild(createShape(namespace, patternItem, x, y, radius));
    });
    return svg;
}

function createShape(namespace, patternItem, x, y, radius) {
    let shape;
    if (patternItem.shape === 'circle') {
        shape = document.createElementNS(namespace, 'circle');
        shape.setAttribute('cx', x);
        shape.setAttribute('cy', y);
        shape.setAttribute('r', radius);
    } else if (patternItem.shape === 'square') {
        shape = document.createElementNS(namespace, 'rect');
        shape.setAttribute('x', x - radius);
        shape.setAttribute('y', y - radius);
        shape.setAttribute('width', radius * 2);
        shape.setAttribute('height', radius * 2);
        shape.setAttribute('rx', Math.max(3, radius * 0.18));
    } else {
        shape = document.createElementNS(namespace, 'polygon');
        const pointMakers = {
            triangle: () => `${x},${y - radius} ${x + radius},${y + radius} ${x - radius},${y + radius}`,
            diamond: () => `${x},${y - radius} ${x + radius},${y} ${x},${y + radius} ${x - radius},${y}`,
            arrow: () => `${x - radius},${y - radius * 0.35} ${x + radius * 0.18},${y - radius * 0.35} ${x + radius * 0.18},${y - radius} ${x + radius},${y} ${x + radius * 0.18},${y + radius} ${x + radius * 0.18},${y + radius * 0.35} ${x - radius},${y + radius * 0.35}`,
            star: () => starPoints(x, y, radius, radius * 0.44)
        };
        shape.setAttribute('points', pointMakers[patternItem.shape]());
    }
    shape.setAttribute('fill', patternItem.color);
    shape.setAttribute('stroke', 'rgba(38, 30, 82, 0.22)');
    shape.setAttribute('stroke-width', '2');
    shape.setAttribute('transform', `rotate(${patternItem.rotation || 0} ${x} ${y})`);
    return shape;
}

function starPoints(centerX, centerY, outerRadius, innerRadius) {
    const points = [];
    for (let index = 0; index < 10; index++) {
        const radius = index % 2 === 0 ? outerRadius : innerRadius;
        const angle = -Math.PI / 2 + (index * Math.PI / 5);
        points.push(`${centerX + Math.cos(angle) * radius},${centerY + Math.sin(angle) * radius}`);
    }
    return points.join(' ');
}

function handleKeydown(event) {
    if (elements.gameScreen.hidden || state.locked || event.repeat) return;
    const key = event.key.toUpperCase();
    const card = Array.from(elements.answersRow.children).find(answer => answer.dataset.letter === key);
    if (!card) return;
    event.preventDefault();
    checkAnswer(card);
}

function checkAnswer(card) {
    if (state.locked) return;
    const puzzle = state.puzzles[state.roundIndex];
    const choiceIndex = Number(card.dataset.choiceIndex);
    if (choiceIndex === puzzle.answerIndex) {
        state.locked = true;
        card.classList.add('correct');
        elements.feedback.textContent = text().correct;
        elements.feedback.className = 'feedback success';
        if (state.roundMistakes === 0) state.firstTryScore++;
        playTone(true);
        burstConfetti(24);
        window.setTimeout(nextRound, 900);
    } else {
        state.roundMistakes++;
        state.totalMistakes++;
        card.classList.remove('wrong');
        void card.offsetWidth;
        card.classList.add('wrong');
        elements.feedback.textContent = text().wrong;
        elements.feedback.className = 'feedback error';
        playTone(false);
    }
}

function nextRound() {
    state.roundIndex++;
    if (state.roundIndex >= TOTAL_ROUNDS) {
        showSummary();
    } else {
        renderRound();
    }
}

function showSummary() {
    const copy = text();
    const totalAttempts = TOTAL_ROUNDS + state.totalMistakes;
    const accuracy = Math.round((TOTAL_ROUNDS / totalAttempts) * 100);
    elements.scoreValue.textContent = String(state.firstTryScore);
    elements.accuracyValue.textContent = `${accuracy}%`;
    elements.mistakesValue.textContent = String(state.totalMistakes);
    if (state.firstTryScore === TOTAL_ROUNDS) elements.finishMessage.textContent = copy.perfect;
    else if (state.firstTryScore >= 8) elements.finishMessage.textContent = copy.strong;
    else if (state.firstTryScore >= 5) elements.finishMessage.textContent = copy.good;
    else elements.finishMessage.textContent = copy.keepGoing;
    showScreen(elements.finishScreen);
    burstConfetti(90);
}

function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    updateSoundButton();
}

function updateSoundButton() {
    elements.soundButton.textContent = state.soundEnabled ? text().soundOn : text().soundOff;
}

function playTone(correct) {
    if (!state.soundEnabled) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.type = correct ? 'sine' : 'triangle';
    oscillator.frequency.setValueAtTime(correct ? 520 : 220, context.currentTime);
    oscillator.frequency.linearRampToValueAtTime(correct ? 780 : 150, context.currentTime + 0.2);
    gain.gain.setValueAtTime(0.18, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.28);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.28);
    oscillator.addEventListener('ended', () => context.close());
}

function burstConfetti(count) {
    const colors = ['#ff5f7e', '#ffb627', '#36bfa6', '#4f7cff', '#925fe2'];
    for (let index = 0; index < count; index++) {
        const piece = document.createElement('i');
        piece.style.setProperty('--x', `${Math.random() * 100}vw`);
        piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 180}px`);
        piece.style.setProperty('--delay', `${Math.random() * 0.2}s`);
        piece.style.setProperty('--duration', `${0.8 + Math.random() * 0.7}s`);
        piece.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
        elements.confetti.appendChild(piece);
        window.setTimeout(() => piece.remove(), 1800);
    }
}

function showMenu() {
    state.locked = true;
    showScreen(elements.startScreen);
}

function bindEvents() {
    elements.langPolish.addEventListener('click', () => setLanguage('polish'));
    elements.langEnglish.addEventListener('click', () => setLanguage('english'));
    elements.startButton.addEventListener('click', startGame);
    elements.restartButton.addEventListener('click', startGame);
    elements.menuButton.addEventListener('click', showMenu);
    elements.finishMenuButton.addEventListener('click', showMenu);
    elements.soundButton.addEventListener('click', toggleSound);
    document.addEventListener('keydown', handleKeydown);
}

function initialize() {
    cacheElements();
    bindEvents();
    setLanguage(state.language);
    showScreen(elements.startScreen);
}

document.addEventListener('DOMContentLoaded', initialize);
