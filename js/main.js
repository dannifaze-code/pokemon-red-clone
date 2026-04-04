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
        this.seedInput = document.getElementById('generator-seed');
        this.randomizeSeedButton = document.getElementById('randomize-seed-button');
        this.biomeSelect = document.getElementById('generator-biome');
        this.widthInput = document.getElementById('generator-width');
        this.heightInput = document.getElementById('generator-height');
        this.grassDensitySelect = document.getElementById('generator-grass-density');
        this.obstacleDensitySelect = document.getElementById('generator-obstacle-density');
        this.generateMapButton = document.getElementById('generate-map-button');
        this.playGeneratedMapButton = document.getElementById('play-generated-map-button');
        this.previewCanvas = document.getElementById('generator-preview');
        this.summary = document.getElementById('generator-summary');
        this.generatorStatus = document.getElementById('generator-status');
        this.generatorError = document.getElementById('generator-error');

        this.localMapGenerator = new LocalMapGenerator();
        this.generatedMapData = null;
    }

    init() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.openGeneratorButton.addEventListener('click', () => this.openGenerator());
        this.closeGeneratorButton.addEventListener('click', () => this.showScreen('title'));
        this.randomizeSeedButton.addEventListener('click', () => this.randomizeSeed());
        this.generateMapButton.addEventListener('click', () => this.generateLocalMap());
        this.playGeneratedMapButton.addEventListener('click', () => this.playGeneratedMap());
        [this.seedInput, this.biomeSelect, this.widthInput, this.heightInput, this.grassDensitySelect, this.obstacleDensitySelect].forEach(control => {
            control.addEventListener('change', () => this.generateLocalMap());
        });
        this.showScreen('title');
        this.generateLocalMap();
    }

    showScreen(screenName) {
        Object.entries(this.screens).forEach(([name, element]) => {
            element.classList.toggle('hidden', name !== screenName);
        });
    }

    startGame() {
        this.showScreen('game');

        if (game) {
            game.loadGeneratedMap(null);
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

    openGenerator() {
        this.showScreen('generator');
        if (!this.generatedMapData) {
            this.generateLocalMap();
        }
    }

    randomizeSeed() {
        const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let seed = '';
        for (let i = 0; i < 10; i++) {
            seed += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        this.seedInput.value = seed;
        this.generateLocalMap();
    }

    collectGeneratorConfig() {
        return {
            seed: this.seedInput.value,
            biome: this.biomeSelect.value,
            width: Number(this.widthInput.value),
            height: Number(this.heightInput.value),
            grassDensity: this.grassDensitySelect.value,
            obstacleDensity: this.obstacleDensitySelect.value
        };
    }

    generateLocalMap() {
        try {
            this.generatedMapData = this.localMapGenerator.generate(this.collectGeneratorConfig());
            this.localMapGenerator.drawPreview(this.previewCanvas, this.generatedMapData);
            this.summary.innerHTML = this.localMapGenerator.buildSummaryMarkup(this.generatedMapData);
            this.generatorStatus.textContent = `Generated ${this.generatedMapData.mapName}.`;
            this.generatorStatus.classList.remove('hidden');
            this.generatorError.classList.add('hidden');
        } catch (error) {
            console.error('Generator failed to build:', error);
            this.generatedMapData = null;
            this.summary.innerHTML = '';
            const previewCtx = this.previewCanvas.getContext('2d');
            previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
            this.generatorError.textContent = `Generator failed: ${error.message}`;
            this.generatorError.classList.remove('hidden');
            this.generatorStatus.textContent = 'Generator unavailable.';
            this.generatorStatus.classList.remove('hidden');
        }
    }

    playGeneratedMap() {
        if (!this.generatedMapData) {
            this.generateLocalMap();
        }

        if (!this.generatedMapData) {
            return;
        }

        this.showScreen('game');

        if (game) {
            game.loadGeneratedMap(this.generatedMapData);
            return;
        }

        try {
            console.log('Initializing generated game...');
            game = new Game({ generatedMapData: this.generatedMapData });
            game.init();
            window.game = game;
            console.log('Generated game initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize generated game:', error);
            alert('Generated game initialization failed: ' + error.message);
            this.showScreen('generator');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const controller = new AppController();
    controller.init();
});
