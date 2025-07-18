// Emoji Memory Match Game
class MemoryGame {
    constructor() {
        // Game configuration
        this.emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        this.gameEmojis = [...this.emojis, ...this.emojis];
        
        // Game state
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.matches = 0;
        this.timeLeft = 60; // 60 second countdown
        this.timerInterval = null;
        this.isGameActive = false;
        this.isProcessing = false;
        
        // DOM elements
        this.gameBoard = document.getElementById('game-board');
        this.movesDisplay = document.getElementById('moves');
        this.timeDisplay = document.getElementById('time');
        this.matchesDisplay = document.getElementById('matches');
        this.restartBtn = document.getElementById('restart-btn');
        this.gameOverModal = document.getElementById('game-over');
        this.finalMovesDisplay = document.getElementById('final-moves');
        this.finalTimeDisplay = document.getElementById('final-time');
        this.playAgainBtn = document.getElementById('play-again-btn');
        
        this.init();
    }
    
    init() {
        this.createBoard();
        this.attachEventListeners();
    }
    
    // Shuffle array using Fisher-Yates algorithm
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Create the game board
    createBoard() {
        this.gameBoard.innerHTML = '';
        const shuffledEmojis = this.shuffle(this.gameEmojis);
        
        shuffledEmojis.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            
            card.innerHTML = `
                <div class="card-face card-back"></div>
                <div class="card-face card-front">${emoji}</div>
            `;
            
            card.addEventListener('click', () => this.flipCard(card));
            this.gameBoard.appendChild(card);
        });
    }
    
    // Attach event listeners
    attachEventListeners() {
        this.restartBtn.addEventListener('click', () => this.resetGame());
        this.playAgainBtn.addEventListener('click', () => {
            this.hideGameOverModal();
            this.resetGame();
        });
    }
    
    // Start the game timer
    startTimer() {
        if (this.timerInterval) return; // Prevent multiple timers
        
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            // Check if time is up
            if (this.timeLeft <= 0) {
                this.gameTimeout();
            }
        }, 1000);
    }
    
    // Update the timer display
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
        const seconds = (this.timeLeft % 60).toString().padStart(2, '0');
        this.timeDisplay.textContent = `${minutes}:${seconds}`;
        
        // Add visual warnings based on time left
        this.timeDisplay.classList.remove('time-warning', 'time-critical');
        
        if (this.timeLeft <= 5) {
            this.timeDisplay.classList.add('time-critical');
        } else if (this.timeLeft <= 10) {
            this.timeDisplay.classList.add('time-warning');
        }
    }
    
    // Handle game timeout
    gameTimeout() {
        this.isGameActive = false;
        this.stopTimer();
        
        // Show timeout modal
        this.showTimeoutModal();
    }
    
    // Stop the timer
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    // Flip a card
    flipCard(card) {
        // Prevent flipping if game is not active, card is already flipped, or processing
        if (!this.isGameActive && this.moves === 0) {
            this.startGame();
        }
        
        // Prevent interaction if time is up
        if (this.timeLeft <= 0) {
            return;
        }
        
        if (this.isProcessing || 
            card.classList.contains('flipped') || 
            card.classList.contains('matched') ||
            this.flippedCards.length >= 2) {
            return;
        }
        
        // Flip the card
        card.classList.add('flipped');
        this.flippedCards.push(card);
        
        // Check if two cards are flipped
        if (this.flippedCards.length === 2) {
            this.incrementMoves();
            this.checkMatch();
        }
    }
    
    // Start the game
    startGame() {
        this.isGameActive = true;
        this.startTimer();
    }
    
    // Increment move counter
    incrementMoves() {
        this.moves++;
        this.movesDisplay.textContent = this.moves;
    }
    
    // Check if two flipped cards match
    checkMatch() {
        this.isProcessing = true;
        const [card1, card2] = this.flippedCards;
        const emoji1 = card1.dataset.emoji;
        const emoji2 = card2.dataset.emoji;
        
        if (emoji1 === emoji2) {
            // Cards match
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                this.matchedCards.push(card1, card2);
                this.matches++;
                this.updateMatchesDisplay();
                this.flippedCards = [];
                this.isProcessing = false;
                
                // Check if game is won
                if (this.matches === this.emojis.length) {
                    // Stop timer immediately and show win
                    this.isGameActive = false;
                    this.stopTimer();
                    this.winGame();
                }
            }, 600);
        } else {
            // Cards don't match - flip them back
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.flippedCards = [];
                this.isProcessing = false;
            }, 1000);
        }
    }
    
    // Update matches display
    updateMatchesDisplay() {
        this.matchesDisplay.textContent = `${this.matches}/${this.emojis.length}`;
    }
    
    // Win the game
    winGame() {
        this.isGameActive = false;
        this.stopTimer();

        // Predefined congratulation messages and emojis
        const messages = [
            'Awesome job! 🎉',
            'You did it! 🥳',
            'Fantastic memory! 🎊',
            'Superb! 🎈',
            'You are a memory master! 🏆',
            'Brilliant! 🌟',
            'Wow, all matched! 🎆',
            'Great work! 🎀'
        ];
        // Pick a random message
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];

        // Show final stats
        this.finalMovesDisplay.textContent = this.moves;
        this.finalTimeDisplay.textContent = this.timeDisplay.textContent;

        // Update modal with random message and emoji
        const gameOverModal = document.getElementById('game-over');
        const heading = gameOverModal.querySelector('h2');
        const message = gameOverModal.querySelector('p');
        heading.textContent = randomMsg;
        heading.style.color = '#FF8C94';
        message.textContent = 'You completed the game!';

        // Add win class for popup background
        gameOverModal.classList.remove('lose');
        gameOverModal.classList.add('win');

        // Show confetti effect
        this.showConfetti();

        // Show game over modal with delay for final animation
        setTimeout(() => {
            this.showGameOverModal();
        }, 1000);
    }

    // Show confetti animation for winning
    showConfetti() {
        // Create confetti pieces
        const colors = ['#FFD972', '#FF8C94', '#B2F7EF', '#FFB6C1', '#87CEEB'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.width = Math.random() * 8 + 8 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '2000';
            confetti.style.animation = `confetti-fall ${Math.random() * 2 + 3}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
    }

    // Show timeout modal
    showTimeoutModal() {
        // Predefined losing messages and sad emojis
        const loseMessages = [
            'Time\'s up! 😢',
            'So close! 😞',
            'Try again! 😔',
            'Don\'t give up! 😟',
            'Keep practicing! 😕',
            'Better luck next time! 🙁',
            'Almost there! 😬',
            'You can do it! 😣'
        ];
        // Pick a random message
        const randomLoseMsg = loseMessages[Math.floor(Math.random() * loseMessages.length)];

        // Change the modal content for timeout
        const gameOverModal = document.getElementById('game-over');
        const heading = gameOverModal.querySelector('h2');
        const message = gameOverModal.querySelector('p');
        
        heading.textContent = randomLoseMsg;
        heading.style.color = '#e74c3c';
        message.textContent = 'You ran out of time! Try again to beat the clock.';

        // Add lose class for popup background
        gameOverModal.classList.remove('win');
        gameOverModal.classList.add('lose');
        
        this.finalMovesDisplay.textContent = this.moves;
        this.finalTimeDisplay.textContent = '00:00';
        
        setTimeout(() => {
            this.showGameOverModal();
        }, 500);
    }
    
    // Show game over modal
    showGameOverModal() {
        this.gameOverModal.classList.remove('hidden');
    }
    
    // Hide game over modal
    hideGameOverModal() {
        this.gameOverModal.classList.add('hidden');
    }
    
    // Reset the game
    resetGame() {
        // Reset game state
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.matches = 0;
        this.timeLeft = 60; // Reset to 60 seconds
        this.isGameActive = false;
        this.isProcessing = false;
        
        // Stop timer
        this.stopTimer();
        
        // Reset displays
        this.movesDisplay.textContent = '0';
        this.timeDisplay.textContent = '01:00';
        this.timeDisplay.classList.remove('time-warning', 'time-critical');
        this.updateMatchesDisplay();
        
        // Reset modal content to default
        const gameOverModal = document.getElementById('game-over');
        const heading = gameOverModal.querySelector('h2');
        const message = gameOverModal.querySelector('p');
        
        heading.textContent = '🎉 Congratulations!';
        heading.style.color = '#FF8C94';
        message.textContent = 'You completed the game!';
        
        // Hide game over modal
        this.hideGameOverModal();
        
        // Recreate board
        this.createBoard();
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});

// Add some fun interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard support for restart
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            document.getElementById('restart-btn').click();
        }
        if (e.key === 'Escape') {
            const gameOverModal = document.getElementById('game-over');
            if (!gameOverModal.classList.contains('hidden')) {
                document.getElementById('play-again-btn').click();
            }
        }
    });
    
    // Add visual feedback for button interactions
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
});