// Main entry point
let game;

document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing game...');
        game = new Game();
        game.init();
        console.log('Game initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        alert('Game initialization failed: ' + error.message);
    }
});
