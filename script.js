document.addEventListener('DOMContentLoaded', () => {
    // Selectores del DOM
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const mainContent = document.getElementById('main-content');
    const gameBoard = document.getElementById('game-board');
    const timeElement = document.getElementById('time');
    const modal = document.getElementById('end-game-modal');
    const finalImage = document.getElementById('final-image');
    const restartButton = document.getElementById('restart-button');
    const endGameMessage = document.getElementById('end-game-message');

    // Variables del juego
    const imageNames = ['1.webp', '2.jpg', '3.jpg', '4.jpg', '5.webp', '6.jpg', '7.jpg', '8.jpg'];
    let selection = [];
    let lockBoard = false;
    let timer;

    // --- FUNCIONES DEL JUEGO ---

    function initializeGame() {
        // Reinicia todas las variables
        selection = [];
        lockBoard = false;
        let matchedPairs = 0;
        let timeLeft = 60;
        timeElement.textContent = timeLeft;
        modal.style.display = 'none';
        
        // Crea y baraja las cartas
        gameBoard.innerHTML = '';
        const cardImages = [...imageNames, ...imageNames];
        shuffleArray(cardImages);
        
        // Renderiza el tablero
        cardImages.forEach(imageName => {
            const card = createCard(imageName);
            gameBoard.appendChild(card);
        });
        
        startTimer(timeLeft, matchedPairs);
    }
    
    function createCard(imageName) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = imageName;
        // Asigna el estado inicial a la carta
        card.dataset.state = 'default';

        card.innerHTML = `
            <div class="card-face card-front"><img src="img/${imageName}" alt="Carta frontal"></div>
            <div class="card-face card-back"><img src="img/back1.png" alt="Reverso de la carta"></div>`;
        
        card.addEventListener('click', () => handleCardClick(card));
        return card;
    }
    
    function handleCardClick(card) {
        // No se puede hacer clic si el tablero está bloqueado o la carta no está en su estado inicial
        if (lockBoard || card.dataset.state !== 'default') {
            return;
        }

        // Cambia el estado a 'flipped' y la añade a la selección
        card.dataset.state = 'flipped';
        selection.push(card);

        // Si ya hay dos cartas seleccionadas, comprueba si son pareja
        if (selection.length === 2) {
            checkForMatch();
        }
    }
    
    function checkForMatch() {
        lockBoard = true;
        const [card1, card2] = selection;

        if (card1.dataset.image === card2.dataset.image) {
            // SI COINCIDEN: cambia su estado a 'matched'
            card1.dataset.state = 'matched';
            card2.dataset.state = 'matched';
            selection = []; // Vacía la selección
            lockBoard = false; // Desbloquea el tablero inmediatamente
        } else {
            // SI NO COINCIDEN: espera y luego las devuelve a 'default'
            setTimeout(() => {
                card1.dataset.state = 'default';
                card2.dataset.state = 'default';
                selection = []; // Vacía la selección
                lockBoard = false; // Desbloquea el tablero
            }, 1000);
        }
    }

    // --- FUNCIONES AUXILIARES ---

    function startTimer(timeLeft, matchedPairs) {
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timeElement.textContent = timeLeft;

            // Comprueba victoria contando las cartas emparejadas
            const currentMatches = document.querySelectorAll('[data-state="matched"]').length / 2;
            if (currentMatches === imageNames.length) {
                endGame(true);
            }
            
            // Comprueba derrota por tiempo
            if (timeLeft <= 0) {
                endGame(false);
            }
        }, 1000);
    }

    function endGame(isWinner) {
        clearInterval(timer);
        setTimeout(() => {
            modal.style.display = 'flex';
            if (isWinner) {
                endGameMessage.textContent = '¡Felicidades, Ganaste!';
                finalImage.src = 'img/ganaste.gif';
            } else {
                endGameMessage.textContent = '¡Tiempo Agotado, Perdiste!';
                finalImage.src = 'img/perdiste.gif';
            }
        }, 500);
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    // --- MANEJADORES DE EVENTOS INICIALES ---

    startButton.addEventListener('click', () => {
        startScreen.style.opacity = '0';
        setTimeout(() => {
            startScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            initializeGame();
        }, 500);
    });

    restartButton.addEventListener('click', initializeGame);
});