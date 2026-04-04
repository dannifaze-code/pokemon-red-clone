// Main entry point
let game;

class AppController {
    constructor() {
        this.screens = {
            title: document.getElementById('title-screen'),
            generator: document.getElementById('generator-screen'),
            game: document.getElementById('game-screen')
        };

        this.startButton = document.getElementById('start-game-button');
        this.openGeneratorButton = document.getElementById('open-generator-button');
        this.closeGeneratorButton = document.getElementById('close-generator-button');
        this.generatorFrame = document.getElementById('generator-frame');
        this.generatorStatus = document.getElementById('generator-status');
        this.generatorError = document.getElementById('generator-error');

        this.generatorLoaded = false;
        this.generatorLoadPromise = null;
    }

    init() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.openGeneratorButton.addEventListener('click', () => this.openGenerator());
        this.closeGeneratorButton.addEventListener('click', () => this.showScreen('title'));
        this.showScreen('title');
    }

    showScreen(screenName) {
        Object.entries(this.screens).forEach(([name, element]) => {
            element.classList.toggle('hidden', name !== screenName);
        });
    }

    startGame() {
        this.showScreen('game');

        if (game) {
            return;
        }

        try {
            console.log('Initializing game...');
            game = new Game();
            game.init();
            window.game = game;
            console.log('Game initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize game:', error);
            alert('Game initialization failed: ' + error.message);
            this.showScreen('title');
        }
    }

    async openGenerator() {
        this.showScreen('generator');

        if (!this.generatorLoadPromise) {
            this.generatorLoadPromise = this.loadGenerator();
        }

        await this.generatorLoadPromise;
    }

    async loadGenerator() {
        this.generatorStatus.textContent = 'Loading generator...';
        this.generatorStatus.classList.remove('hidden');
        this.generatorError.classList.add('hidden');

        try {
            const response = await fetch('gameworldmapgenerator/pokemon-style-map-generator');
            if (!response.ok) {
                throw new Error(`Unable to load generator (${response.status})`);
            }

            const rawHtml = await response.text();
            const replacements = new Map([
                ['https://static.itch.io/game.min.js?1775329055', new URL('content%20main.js/game.min.js', window.location.href).href],
                ['https://static.itch.io/bundle.min.js?1775329055', new URL('content%20main.js/bundle.min.js', window.location.href).href],
                ['https://static.itch.io/lib.min.js?1775329055', new URL('content%20main.js/lib.min.js', window.location.href).href],
                ['https://static.itch.io/lib/jquery.maskMoney.js', new URL('content%20main.js/jquery.maskMoney.js', window.location.href).href],
                ['https://img.itch.zone/aW1nLzE3MDcwNzkxLnBuZw==/347x500/s2EarB.png', new URL('game%20world%20map/s2EarB.png', window.location.href).href]
            ]);

            let patchedHtml = rawHtml;
            replacements.forEach((localUrl, remoteUrl) => {
                patchedHtml = patchedHtml.replaceAll(remoteUrl, localUrl);
            });

            const htmlWithBase = patchedHtml.replace(
                '<head>',
                '<head><base href="https://screensmith.itch.io/pokemon-style-map-generator/">'
            );

            await new Promise((resolve) => {
                this.generatorFrame.onload = () => resolve();
                this.generatorFrame.srcdoc = htmlWithBase;
            });

            this.generatorLoaded = true;
            this.generatorStatus.textContent = 'Generator loaded.';
            this.generatorStatus.classList.add('hidden');
        } catch (error) {
            console.error('Generator failed to load:', error);
            this.generatorError.textContent = `Generator failed to load: ${error.message}`;
            this.generatorError.classList.remove('hidden');
            this.generatorStatus.textContent = 'Generator unavailable.';
            this.generatorStatus.classList.remove('hidden');
            this.generatorLoadPromise = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const controller = new AppController();
    controller.init();
});
