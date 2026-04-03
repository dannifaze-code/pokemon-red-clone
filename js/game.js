class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        // Graphics engine
        this.graphics = new GraphicsEngine(this.canvas);
        
        // Frame rate control
        this.targetFPS = 120;
        this.frameInterval = 1000 / this.targetFPS;
        this.lastFrameTime = 0;
        this.accumulator = 0;
        
        this.TILE_SIZE = 32;
        this.VIEW_WIDTH = 20;
        this.VIEW_HEIGHT = 18;
        
        this.state = 'world'; // world, battle, dialog, menu
        this.paused = false;
        
        this.colors = {
            grass: '#4a8c4a',
            water: '#4a7aa8',
            path: '#8c7a6b',
            tree: '#2d5a2d',
            building: '#8c6b4a'
        };
        
        this.lastTime = 0;
        this.deltaTime = 0;

        this.pressedDirections = new Set();
        this.lastDirectionPressed = null;
    }
    
    init() {
        this.player = new Player(10, 8);
        this.map = new GameMap();
        this.battle = new BattleSystem(this);
        this.saveSystem = new SaveSystem(this);
        
        this.party = [];
        this.inventory = new Inventory();
        this.pcStorage = new PCStorage();
        
        this.playTime = 0;
        this.pokedex = { seen: [], caught: [] };
        this.badges = [];
        this.storyProgress = 0;
        this.defeatedTrainers = [];
        this.currentMap = 'fernvale';
        this.mapStates = {};
        this.settings = {
            textSpeed: 'medium',
            battleAnimations: true,
            soundEnabled: true,
            xpShare: false,
            fastForward: false,
            nuzlockeMode: false,
            runningShoes: true
        };
        this.lastHealX = 10;
        this.lastHealY = 8;

        // Multi-page dialog state
        this.dialogPages = [];
        this.dialogPageIndex = 0;
        this.dialogCallback = null;
        
        this.startNewGame();
        this.setupEventListeners();
        this.gameLoop(0);
    }
    
    startNewGame() {
        this.storyProgress = 0;
        this.player.name = PLAYER_NAME;

        // Choose starter
        const event = getStoryEvent(0);
        const starters = event?.starterPool || ['LEAFLING', 'EMBERL', 'AQUAFIN'];
        const starter = starters[Math.floor(Math.random() * starters.length)];
        const starterPokemon = new Pokemon(starter, 5);
        this.party.push(starterPokemon);

        // Starting items
        for (const item of (event?.items || [])) {
            this.inventory.addItem(item.id, item.count);
        }

        // Play intro sequence then reveal starter
        const introPages = [
            ...INTRO_SEQUENCE,
            `PROF. SOLEN: Take ${starterPokemon.getName()} with you.`,
            `${starterPokemon.getName()} joined your party!`
        ];
        this.showDialogPages(introPages);
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.handleInput(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
    
    handleInput(e) {
        if (this.state === 'dialog') {
            if (e.key === 'z' || e.key === ' ' || e.key === 'Enter') {
                this.advanceDialog();
            }
            return;
        }
        
        if (this.state === 'menu') {
            this.handleMenuInput(e);
            return;
        }
        
        if (this.state === 'battle') {
            this.battle.handleInput(e.key);
            return;
        }

        if (e.key.startsWith('Arrow')) {
            e.preventDefault();
            this.pressedDirections.add(e.key);
            this.lastDirectionPressed = e.key;
            return;
        }
        
        switch(e.key) {
            case 'z':
            case ' ':
                this.handleInteract();
                break;
            case 'x':
                this.openMenu();
                break;
        }
    }

    handleKeyUp(e) {
        if (this.state !== 'world') return;
        if (!e.key.startsWith('Arrow')) return;

        this.pressedDirections.delete(e.key);
        if (this.lastDirectionPressed === e.key) {
            this.lastDirectionPressed = null;
        }
    }

    processMovementInput() {
        if (!this.player.canAcceptMovementInput()) return;
        if (this.pressedDirections.size === 0) return;

        let directionKey = this.lastDirectionPressed;
        if (!directionKey || !this.pressedDirections.has(directionKey)) {
            directionKey = Array.from(this.pressedDirections).at(-1);
        }
        if (!directionKey) return;

        let dx = 0;
        let dy = 0;
        if (directionKey === 'ArrowUp') dy = -1;
        else if (directionKey === 'ArrowDown') dy = 1;
        else if (directionKey === 'ArrowLeft') dx = -1;
        else if (directionKey === 'ArrowRight') dx = 1;

        this.player.move(dx, dy, this.map);
    }
    
    handleMenuInput(e) {
        const menu = document.getElementById('menu');
        const items = menu.querySelectorAll('li');
        let selected = menu.querySelector('.selected');
        let index = selected ? Array.from(items).indexOf(selected) : -1;
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (selected) selected.classList.remove('selected');
                index = index > 0 ? index - 1 : items.length - 1;
                items[index].classList.add('selected');
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (selected) selected.classList.remove('selected');
                index = index < items.length - 1 ? index + 1 : 0;
                items[index].classList.add('selected');
                break;
            case 'z':
            case ' ':
            case 'Enter':
                if (selected) {
                    this.executeMenuAction(selected.dataset.action);
                }
                break;
            case 'x':
                this.closeMenu();
                break;
        }
    }
    
    openMenu() {
        this.state = 'menu';
        const menu = document.getElementById('menu');
        menu.classList.remove('hidden');
        const items = menu.querySelectorAll('li');
        items.forEach(item => item.classList.remove('selected'));
        items[0].classList.add('selected');
    }
    
    closeMenu() {
        this.state = 'world';
        document.getElementById('menu').classList.add('hidden');
    }
    
    executeMenuAction(action) {
        switch(action) {
            case 'pokemon':
                this.showPokemonMenu();
                break;
            case 'bag':
                this.showBagMenu();
                break;
            case 'save':
                this.saveGame();
                this.closeMenu();
                break;
            case 'exit':
                this.closeMenu();
                break;
            default:
                this.showDialog(`${action.toUpperCase()} is not implemented yet!`);
                this.closeMenu();
                break;
        }
    }
    
    showPokemonMenu() {
        let text = 'Your Pokemon:\n';
        for (let i = 0; i < this.party.length; i++) {
            const p = this.party[i];
            text += `${i + 1}. ${p.getName()} Lv${p.level} (${p.currentHp}/${p.maxHp} HP)`;
            if (p.status) text += ` [${p.status.toUpperCase()}]`;
            if (p.isFainted) text += ' [FAINTED]';
            text += '\n';
        }
        this.showDialog(text);
        this.closeMenu();
    }
    
    showBagMenu() {
        let text = 'Your Bag:\n';
        text += `Money: $${this.inventory.money}\n\n`;
        
        const pockets = this.inventory.pockets;
        for (const [cat, items] of Object.entries(pockets)) {
            const entries = Object.entries(items);
            if (entries.length > 0) {
                text += cat.toUpperCase() + ':\n';
                for (const [id, count] of entries) {
                    const item = ITEM_DATABASE[id];
                    text += `  ${item?.name || id} x${count}\n`;
                }
                text += '\n';
            }
        }
        
        this.showDialog(text || 'Bag is empty.');
        this.closeMenu();
    }
    
    saveGame() {
        const result = this.saveSystem.save(true);
        this.showDialog(result.success ? 'Game saved!' : 'Failed to save.');
    }
    
    handleInteract() {
        const facingX = this.player.x + this.player.direction.x;
        const facingY = this.player.y + this.player.direction.y;
        const tile = this.map.getTile(facingX, facingY);

        if (tile === 'npc') {
            // Check professor lab door first
            if (this.map.isProfessorFacing(facingX, facingY) || (facingX === 15 && facingY <= 6)) {
                const lines = getDialog('professor', this.storyProgress);
                this.showDialogPages(lines);
                return;
            }
            const npcId = this.map.getNpcAt(facingX, facingY);
            if (npcId) {
                const lines = getDialog(npcId, this.storyProgress);
                // Check if dialog triggers a battle
                const lastLine = lines[lines.length - 1];
                if (lastLine && lastLine.startsWith('[') && lastLine.includes('battle')) {
                    const battleLines = lines.slice(0, -1);
                    this.showDialogPages(battleLines, () => {
                        this.triggerNpcBattle(npcId);
                    });
                } else {
                    this.showDialogPages(lines);
                }
            } else {
                this.showDialogPages(['...']);
            }
        } else if (tile === 'sign') {
            const signId = this.map.getSignAt(facingX, facingY);
            const lines = signId ? getDialog(signId, this.storyProgress) : ['...'];
            this.showDialogPages(lines);
        } else if (tile === 'door') {
            // Entering prof lab
            const lines = getDialog('professor', this.storyProgress);
            this.showDialogPages(lines);
        } else if (tile === 'grass') {
            if (Math.random() < 0.4) {
                this.startBattle();
            }
        }
    }

    triggerNpcBattle(npcId) {
        const event = getStoryEvent(this.storyProgress);
        let battleData = event?.rivalBattle || event?.veilBattle || null;

        if (!battleData) {
            this.showDialogPages(['...No battle data found.']);
            return;
        }

        if (this.defeatedTrainers.includes(`${npcId}_${this.storyProgress}`)) {
            this.showDialogPages([`${battleData.name}: You already beat me. I remember.`]);
            return;
        }

        const enemyParty = battleData.party.map(e => new Pokemon(e.species, e.level));
        this.state = 'battle';
        this.battle.startBattle(enemyParty, 'trainer', battleData.name);

        // On battle end, record defeat and check story advance
        const originalEnd = this.battle.end.bind(this.battle);
        this.battle.end = () => {
            originalEnd();
            this.battle.end = originalEnd;
            this.defeatedTrainers.push(`${npcId}_${this.storyProgress}`);
            this.checkStoryAdvance(npcId);
        };
    }

    checkStoryAdvance(trigger) {
        const p = this.storyProgress;
        if (trigger === 'rival_dray' && p === 2) this.advanceStory(3);
        else if (trigger === 'veil_grunt' && p === 3) this.advanceStory(4);
        else if (trigger === 'rival_dray' && p === 5) this.advanceStory(6);
        else if (trigger === 'veil_commander' && p === 6) this.advanceStory(7);
        else if (trigger === 'mira' && p === 8) this.advanceStory(9);
    }

    advanceStory(newProgress) {
        this.storyProgress = newProgress;
        const event = getStoryEvent(newProgress);
        if (!event) return;

        // Trigger memory dialog
        if (event.memoryDialog) {
            this.showDialogPages(event.memoryDialog);
        }
        // Trigger ending dialog
        if (event.endingDialog) {
            this.showDialogPages(event.endingDialog);
        }
    }
    
    showDialog(text) {
        this.showDialogPages([text]);
    }

    showDialogPages(pages, callback = null) {
        if (!pages || pages.length === 0) return;
        this.state = 'dialog';
        this.dialogPages = pages;
        this.dialogPageIndex = 0;
        this.dialogCallback = callback || null;
        this._renderDialogPage();
    }

    _renderDialogPage() {
        const text = this.dialogPages[this.dialogPageIndex];
        const dialogBox = document.getElementById('dialog-box');
        const dialogText = document.getElementById('dialog-text');
        dialogText.textContent = text;
        dialogBox.classList.remove('hidden');
    }

    advanceDialog() {
        this.dialogPageIndex++;
        if (this.dialogPageIndex < this.dialogPages.length) {
            this._renderDialogPage();
        } else {
            this.closeDialog();
            if (this.dialogCallback) {
                const cb = this.dialogCallback;
                this.dialogCallback = null;
                cb();
            }
        }
    }

    closeDialog() {
        this.state = 'world';
        this.dialogPages = [];
        this.dialogPageIndex = 0;
        document.getElementById('dialog-box').classList.add('hidden');
    }
    
    // Register Pokemon seen in pokedex
    registerPokedexEncounter(speciesId, caught = false) {
        if (!this.pokedex) {
            this.pokedex = { seen: [], caught: [] };
        }
        
        if (!this.pokedex.seen.includes(speciesId)) {
            this.pokedex.seen.push(speciesId);
        }
        
        if (caught && !this.pokedex.caught.includes(speciesId)) {
            this.pokedex.caught.push(speciesId);
        }
    }
    
    // Register Pokemon caught in pokedex
    registerPokedexCatch(speciesId) {
        this.registerPokedexEncounter(speciesId, true);
    }
    
    startBattle() {
        const encounters = ['SKYWING', 'SCRATCHCLAW', 'SILKWORM'];
        const species = encounters[Math.floor(Math.random() * encounters.length)];
        this.state = 'battle';
        this.battle.startWildBattle(species);
    }
    
    gameLoop(timestamp) {
        // Frame rate limiting
        if (this.lastFrameTime === 0) {
            this.lastFrameTime = timestamp;
        }
        
        const frameDelta = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        
        // Accumulate time and update at fixed intervals
        this.accumulator += frameDelta;
        
        while (this.accumulator >= this.frameInterval) {
            this.deltaTime = this.frameInterval;
            this.update();
            this.accumulator -= this.frameInterval;
        }
        
        // Always render with interpolation
        const alpha = this.accumulator / this.frameInterval;
        this.render(alpha);
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }
    
    update() {
        if (this.state === 'world' && !this.paused) {
            this.map.update();
            this.player.update(this.deltaTime);
            this.processMovementInput();
            this.saveSystem.checkAutoSave();
            this.graphics.updateScreenShake(this.deltaTime);
        }
    }
    
    render(alpha = 0) {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const playerRenderPos = this.player.getRenderPosition(alpha);
        
        // Calculate camera offset
        const cameraX = Math.max(0, Math.min(
            this.map.width * this.TILE_SIZE - this.canvas.width,
            playerRenderPos.x - this.canvas.width / 2 + this.TILE_SIZE / 2
        ));
        const cameraY = Math.max(0, Math.min(
            this.map.height * this.TILE_SIZE - this.canvas.height,
            playerRenderPos.y - this.canvas.height / 2 + this.TILE_SIZE / 2
        ));

        const snappedCameraX = Math.round(cameraX);
        const snappedCameraY = Math.round(cameraY);
        
        this.ctx.save();
        this.ctx.translate(-snappedCameraX, -snappedCameraY);
        
        // Apply screen shake
        this.graphics.applyScreenShake(this.ctx);
        
        // Render map with enhanced graphics
        this.map.render(this.ctx, snappedCameraX, snappedCameraY, this.canvas.width, this.canvas.height, this.graphics);
        
        // Render player with enhanced sprite
        this.graphics.drawPlayerSprite(
            playerRenderPos.x,
            playerRenderPos.y,
            this.player,
            this.ctx,
            alpha
        );
        
        this.ctx.restore();
        
        // Draw particles
        this.graphics.drawParticles(this.ctx);
        
        // Render battle if active
        if (this.state === 'battle') {
            this.battle.render(this.ctx);
        }
    }
}
