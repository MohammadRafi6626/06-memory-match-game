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
        this.startTime = null;
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
        if (!this.startTime) {
            this.startTime = Date.now();
            this.timerInterval = setInterval(() => {
                this.updateTimer();
            }, 1000);
        }
    }
    
    // Update the timer display
    updateTimer() {
        if (!this.startTime) return;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        this.timeDisplay.textContent = `${minutes}:${seconds}`;
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
        
        // Show final stats
        this.finalMovesDisplay.textContent = this.moves;
        this.finalTimeDisplay.textContent = this.timeDisplay.textContent;
        
        // Show game over modal with delay for final animation
        setTimeout(() => {
            this.showGameOverModal();
        }, 1000);
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
        this.isGameActive = false;
        this.isProcessing = false;
        this.startTime = null;
        
        // Stop timer
        this.stopTimer();
        
        // Reset displays
        this.movesDisplay.textContent = '0';
        this.timeDisplay.textContent = '00:00';
        this.updateMatchesDisplay();
        
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